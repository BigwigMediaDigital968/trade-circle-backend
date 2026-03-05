import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.BREVO_SMTP_HOST,
  port: Number(process.env.BREVO_SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.BREVO_SMTP_USER,
    pass: process.env.BREVO_SMTP_PASS,
  },
});

export default async function sendEmail({ to, subject, htmlContent }) {
  await transporter.sendMail({
    from: `"Trade Circle" <${process.env.BREVO_SENDER_EMAIL}>`,
    to,
    subject,
    html: htmlContent,
  });
};