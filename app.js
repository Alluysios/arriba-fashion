const path = require('path');
const express = require('express');
const app = express();
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorHandlers');

const viewRoutes = require('./routes/viewRoutes');
const productRoutes = require('./routes/productRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const userRoutes = require('./routes/userRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

// set http security headers
app.use(helmet())

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'))

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// serving static files
app.use(express.static(path.join(__dirname, 'public')));
// body parser, ready data from body
app.use(express.json({ limit: '10kb' }));
// to access the cookies in a request
app.use(cookieParser());
app.use((req, res, next) => {
    // use this middleware to test
    next();
})

// limit the request prevent attackers from guessing
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many request from this IP, please try again in an hour!'
});

// Sanitize data against NoSQL query injection
app.use(mongoSanitize());
// Data sanitize against xss
app.use(xss());
// Prevent parameter pollution (1 >) (ex: price=250, price=200)
app.use(
    hpp({
        whitelist: [
            'price',
            'name'
        ]
    })
);

app.use('/api', limiter);
app.use('/', viewRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/reviews', reviewRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/booking', bookingRoutes);


app.all('*', (req, res, next) => {
    // const err = new Error(`Can't find ${req.originalUrl} on this server`);
    // err.status = 'fail';
    // err.statusCode = 404;
    
    // if we pass anything in next, express ill assume it's an error.
    next(new AppError(`Can't find ${req.originalUrl} on this server`, 404))
})

app.use(globalErrorHandler);

module.exports = app