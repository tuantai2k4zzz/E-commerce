const nodemailer = require('nodemailer')
const asyncHandler = require('express-async-handler');


const sendMail = asyncHandler(async ({email, html}) => {
  console.log(email)
    let transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // use SSL - TLS
      auth: {
        user: process.env.EMAIL_NAME,
        pass: process.env.EMAIL_APP_PASSWORD,
      },
    });
    let mailOptions = {
      from: '"Cuahangdientu" <no-reply@cuahangdientu.com>',
      to: email,
      subject: 'Forgot password',
      html: html,
    };
    return await transporter.sendMail(mailOptions); // promise
  })

module.exports = {sendMail}
  

