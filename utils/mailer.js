import nodemailer from 'nodemailer';

const transporter = process.env.SMTP_HOST
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
      }
    })
  : null;

export async function sendMail({ to, subject, html }) {
  if (!transporter) {
    console.warn(`SMTP not configured; email skipped for ${to}`);
    return { skipped: true };
  }
  
  return transporter.sendMail({
    from: process.env.MAIL_FROM || process.env.SMTP_USER,
    to,
    subject,
    html
  });
}

export const emailTemplate = (title, body, link) => `
  <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:32px;color:#17324d">
    <h1 style="color:#176b87">Two M-s Veil</h1>
    <h2>${title}</h2>
    <p>${body}</p>
    <a href="${link}" style="display:inline-block;background:#176b87;color:white;padding:12px 20px;text-decoration:none;border-radius:6px">Continue</a>
    <p style="color:#718495;font-size:12px">This link expires automatically.</p>
  </div>
`;