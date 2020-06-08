const catchAsync = require('./../utils/catchAsync')
const sendEmail = require('./../utils/email')

exports.mailBooking = catchAsync(async (req, res, next) => {
    let {bookDate, message} = req.body;

    const sentMail = await sendEmail({
        email: req.user.email,
        subject: 'Thanks for booking with us!',
        data: {
            bookDate,
            message
        }
    })

    res.status(200).json({
        status: 'success',
        mail: sentMail
    })
})