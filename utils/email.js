const nodemailer = require('nodemailer');
const sendEmail = async (options) => {
  // 1) create transpoter

  const transpoter = nodemailer.createTransport({
    host:process.env.EMAIL_HOST,
    port:process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    }
  });
  // 2) email options
  const mailOptions={
    from:'Ashu Mehra',
    to: 'ashumehra768@outlook.com',
    subject:options.subject,
    text:options.message
  }
  // 3) actually send email
  await transpoter.sendMail(mailOptions);
};

module.exports = sendEmail;
