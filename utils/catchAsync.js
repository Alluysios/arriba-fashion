// next(error) to pass the error in global error middleware
module.exports = fn => {
    return (req, res, next) => {
        fn(req, res, next).catch(err => next(err))
    }
}