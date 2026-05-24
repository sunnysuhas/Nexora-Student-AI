import nodemailer from "nodemailer";

function smtpUser() {
  return process.env.SMTP_EMAIL || process.env.GMAIL_USER;
}

function smtpPassword() {
  return process.env.SMTP_APP_PASSWORD || process.env.GMAIL_APP_PASSWORD;
}

function createTransporter() {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: smtpUser(),
      pass: smtpPassword(),
    },
  });
}

export async function sendEmail({ to, subject, html }) {
  if (!smtpUser() || !smtpPassword()) {
    console.log(`Email skipped: ${subject} -> ${to}`);
    return { skipped: true };
  }

  return createTransporter().sendMail({
    from: `"Nexora AI" <${smtpUser()}>`,
    to,
    subject,
    html,
  });
}

export function otpTemplate(otp) {
  return `<h2>Nexora AI Verification</h2><p>Your OTP is <strong>${otp}</strong>. It expires in 5 minutes.</p>`;
}
