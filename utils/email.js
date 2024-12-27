const nodemailer = require('nodemailer');
require('dotenv').config(); 

const transporter = nodemailer.createTransport({
  service: 'Gmail',  
  auth: {
    user: process.env.EMAIL_USER,  
    pass: process.env.EMAIL_PASS,  
  },
  secure:true,
  port:587
});

const sendResetEmail = async (email, token) => {
  const resetUrl = `http://localhost:3000/reset-password?token=${token}`;
  console.log(resetUrl)
  const mailOptions = {
    from: process.env.EMAIL_USER, 
    to: email, 
    subject: 'Password Reset Request',
    text: `Click the link below to reset your password:\n\n${resetUrl}`,
    html: `<h3>Click the link below to reset your password:</h3><a href="${resetUrl}">${resetUrl}</a>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = { sendResetEmail };
