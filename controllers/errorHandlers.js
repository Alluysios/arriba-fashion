const AppError = require('./../utils/appError');

const handleCastErrorDB = err => {
    const message = `Invalid ${err.path}: ${err.value}`;

    return new AppError(message, 400);
}

const handleDuplicateErrorDB = err => {
    const value = err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/);
    const message = `${value} is already taken. Please use another value`;
    return new AppError(message, 400);
}

const handleValidationErrorDB = err => {
    const errors = Object.values(err.errors).map(el => el.message);
    const message = `Invalid input data. ${errors.join('.' )}`;

    return new AppError(message, 400);
}

const handleJWTError = err => {
    return new AppError('Invalid Token. Please login again.', 401)
}
const handExpiredTokenError = err => {
    return new AppError('Your token has expired. Please login again.', 401)
}


const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        errName: err.name,
        error: err,
        message: err.message,
        stack: err.stack
    });
}

const sendErrorProd = (err, res) => {
    // Operational are trusted error and we send message to client
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });

    // Unknown error for developers to see
    } else {
        // 1) Log error
        console.log('ERROR', err)

        // 2) Send generic message
        res.status(500).json({
            status: 'error',
            meesage: 'Something went very wrong'
        })
    }
}


module.exports = (err, req, res, next) => {
    // node application will defind status code and status
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if(process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res);
    } else if (process.env.NODE_ENV === 'production') {
        let error = err;

        if(err.name === 'CastError') error = handleCastErrorDB(error);
        if(err.code === 11000) error = handleDuplicateErrorDB(error);
        if(err.name === 'ValidationError') error = handleValidationErrorDB(error);
        if(err.name === 'ValidationError') error = handleValidationErrorDB(error);
        if(err.name === 'JsonWebTokenError') error = handleJWTError(error);
        if(err.name === 'TokenExpiredError') error = handExpiredTokenError(error);
        sendErrorProd(error, res);
    }
}