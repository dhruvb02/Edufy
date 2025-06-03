// utils/mailSender.js
require('dotenv').config();          // ← MUST be the first line

const nodemailer = require('nodemailer');

// 1) Create a transporter using the exact env vars:
const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,       // e.g. "smtp.gmail.com"
  port: 587,                         // 587 for STARTTLS, or 465 for SSL
  secure: false,                     // false since we’re using port=587 (STARTTLS)
  auth: {
    user: process.env.MAIL_USER,     // e.g. "dhruvbansal0612@gmail.com"
    pass: process.env.MAIL_PASS      // your 16‐char App Password (if 2FA on)
  }
});

// 2) Immediately verify the connection at module load
transporter.verify()
  .then(() => console.log(' SMTP connection OK (mailSender.js)'))
  .catch(err => console.error('SMTP verify failed (mailSender.js):', err));

// 3) Export a function that re‐uses the transporter to send mail
const mailSender = async (email, subject, htmlBody) => {
  try {
    console.log('✉️  [mailSender] Sending to:', email);
    const info = await transporter.sendMail({
      from: `"Edufy Support" <${process.env.MAIL_USER}>`,
      to: email,
      subject: subject,
      html: htmlBody
    });
    console.log('✅ [mailSender] Email sent. MessageId:', info.messageId);
    return info;
  } catch (error) {
    console.error('[mailSender] Error sending email:', error);
    throw error;
  }
};

module.exports = mailSender;
