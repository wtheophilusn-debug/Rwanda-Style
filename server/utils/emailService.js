const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
});

const sendOTP = async (to, otp, purpose = 'register') => {
  const subjects = {
    register: 'Rwanda Style — Verify Your Email',
    login: 'Rwanda Style — Admin Login OTP',
    reset: 'Rwanda Style — Password Reset OTP',
  };

  const messages = {
    register: 'Welcome to Rwanda Style! Your email verification code is:',
    login: 'Your admin login verification code is:',
    reset: 'Your password reset code is:',
  };

  await transporter.sendMail({
    from: `"Rwanda Style" <${process.env.EMAIL_USER}>`,
    to,
    subject: subjects[purpose],
    html: `
      <div style="font-family:Arial,sans-serif;max-width:500px;margin:0 auto;padding:20px;">
        <div style="background:#15803d;padding:20px;border-radius:12px 12px 0 0;text-align:center;">
          <h1 style="color:white;margin:0;font-size:24px;">Rwanda Style</h1>
        </div>
        <div style="background:#f9fafb;padding:30px;border-radius:0 0 12px 12px;border:1px solid #e5e7eb;">
          <p style="color:#374151;font-size:16px;">${messages[purpose]}</p>
          <div style="background:white;border:2px dashed #15803d;border-radius:12px;padding:20px;text-align:center;margin:20px 0;">
            <span style="font-size:40px;font-weight:bold;letter-spacing:12px;color:#15803d;">${otp}</span>
          </div>
          <p style="color:#6b7280;font-size:14px;">This code expires in <strong>10 minutes</strong>.</p>
          <p style="color:#6b7280;font-size:14px;">If you did not request this, please ignore this email.</p>
          <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0;">
          <p style="color:#9ca3af;font-size:12px;text-align:center;">Rwanda Style — Busasamana, Nyanza, Kigali, Rwanda</p>
        </div>
      </div>
    `,
  });
};

module.exports = { sendOTP };
