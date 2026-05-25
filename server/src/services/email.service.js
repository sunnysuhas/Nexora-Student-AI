import nodemailer from "nodemailer";

function smtpUser() {
  return process.env.SMTP_EMAIL || process.env.GMAIL_USER;
}

function smtpPassword() {
  return process.env.SMTP_APP_PASSWORD || process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD || process.env.GMAIL_PASS;
}

export function isEmailConfigured() {
  return Boolean(smtpUser() && smtpPassword());
}

function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT || 465),
    secure: String(process.env.SMTP_SECURE || "true") === "true",
    family: 4,
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 20000,
    auth: {
      user: smtpUser(),
      pass: smtpPassword(),
    },
  });
}

export async function sendEmail({ to, subject, html }) {
  if (!isEmailConfigured()) {
    throw new Error("SMTP email credentials are not configured");
  }

  try {
    return await createTransporter().sendMail({
      from: `"Nexora AI" <${smtpUser()}>`,
      to,
      subject,
      html,
    });
  } catch (error) {
    console.error("Nexora email delivery failed:", error.code || error.command || error.message);
    throw error;
  }
}

export function otpTemplate(otp) {
  return `
    <div style="margin:0;padding:32px;background:#050505;font-family:Inter,Arial,sans-serif;color:#e5f9ff;">
      <div style="max-width:560px;margin:0 auto;border:1px solid rgba(0,217,255,.28);border-radius:24px;background:linear-gradient(135deg,rgba(15,23,42,.94),rgba(5,5,5,.98));box-shadow:0 24px 80px rgba(0,217,255,.18);overflow:hidden;">
        <div style="padding:28px 28px 12px;">
          <div style="font-size:13px;letter-spacing:.16em;text-transform:uppercase;color:#38bdf8;font-weight:700;">Nexora AI</div>
          <h1 style="margin:14px 0 8px;font-size:28px;line-height:1.15;color:#ffffff;">Verify your student workspace</h1>
          <p style="margin:0;color:#b6c8d8;font-size:15px;line-height:1.7;">Use this one-time code to finish setting up your AI-powered student planner.</p>
        </div>
        <div style="margin:20px 28px;padding:22px;border-radius:18px;background:rgba(6,182,212,.12);border:1px solid rgba(56,189,248,.22);text-align:center;">
          <div style="font-size:38px;letter-spacing:.28em;font-weight:800;color:#ffffff;">${otp}</div>
          <div style="margin-top:10px;font-size:13px;color:#93c5fd;">This OTP expires in 5 minutes.</div>
        </div>
        <div style="padding:0 28px 28px;color:#94a3b8;font-size:13px;line-height:1.7;">
          If you did not create a Nexora AI account, you can safely ignore this email.
        </div>
      </div>
    </div>
  `;
}
