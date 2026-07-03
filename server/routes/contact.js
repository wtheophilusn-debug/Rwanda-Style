const router = require('express').Router();
const { sendOTP } = require('../utils/emailService');

router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !subject || !message) return res.status(400).json({ message: 'All fields are required' });

    const nodemailer = require('nodemailer');
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    await transporter.sendMail({
      from: `"Rwanda Style Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      replyTo: email,
      subject: `New Message: ${subject}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:500px;margin:0 auto;padding:20px;">
          <div style="background:#15803d;padding:20px;border-radius:12px 12px 0 0;text-align:center;">
            <h1 style="color:white;margin:0;font-size:20px;">Rwanda Style — New Contact Message</h1>
          </div>
          <div style="background:#f9fafb;padding:24px;border-radius:0 0 12px 12px;border:1px solid #e5e7eb;">
            <p><strong>From:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <hr style="border:none;border-top:1px solid #e5e7eb;margin:16px 0;">
            <p><strong>Message:</strong></p>
            <p style="color:#374151;white-space:pre-line;">${message}</p>
            <hr style="border:none;border-top:1px solid #e5e7eb;margin:16px 0;">
            <p style="color:#9ca3af;font-size:12px;">Reply directly to this email to respond to ${name}.</p>
          </div>
        </div>
      `,
    });

    res.json({ message: 'Message sent successfully' });
  } catch (err) {
    console.error('Contact error:', err.message);
    res.status(500).json({ message: 'Failed to send message' });
  }
});

module.exports = router;
