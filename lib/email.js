import nodemailer from "nodemailer";

export async function sendVerificationEmail(email, code) {

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port: 587,
    secure: false,

    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Verify your account",
    text: `Your verification code is ${code}`,
  });
}