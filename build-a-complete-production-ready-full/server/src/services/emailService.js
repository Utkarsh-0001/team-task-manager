import nodemailer from "nodemailer";

const buildTransport = () => {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER) return null;

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
};

export const sendMail = async ({ to, subject, html }) => {
  const transport = buildTransport();
  if (!transport) return { skipped: true };

  return transport.sendMail({
    from: process.env.SMTP_FROM || "Team Task Manager <no-reply@example.com>",
    to,
    subject,
    html
  });
};

