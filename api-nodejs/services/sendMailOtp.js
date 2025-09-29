const nodemailer = require('nodemailer');

const sendMailOtp = async (email, otp) => {
  return new Promise(async (resolve, reject) => {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_LOGIN,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.MAIL_LOGIN,
      to: email,
      subject: `MYND Email Verification`,
      text: `Verify your email address. Verification code ${otp} (This code is valid for 1 hour).`,
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('Message sent successfully:', info.response);
      resolve(true);
    } catch (error) {
      console.error('Error sending message:', error);
      reject(error);
    }
  });
};

module.exports = sendMailOtp;
