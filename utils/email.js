const nodemailer = require('nodemailer');

const sendEmail = async options => {
    // 1) create a transporter
    const transporter = nodemailer.createTransport({
        // service: 'Gmail',
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user:process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    })
    // 2) Define email options
    const mailOptions = {
        from: `Arriba House of Fashion ${options.email}`,
        to: `Arriba House of Fashion`,
        subject: options.subject,
        text: options.data.message
        // html
    }

    // 3) Actually send the email
    await transporter.sendMail(mailOptions);
}

module.exports = sendEmail;