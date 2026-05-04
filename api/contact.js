export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const { name, email, message } = req.body;

  const nodemailer = require("nodemailer");

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "cocompi.coco@gmail.com",
      pass: process.env.EMAIL_PASS="tcsr edzq kupi cwei"  // 🔴 use app password
    }
  });

  try {
    await transporter.sendMail({
      from: email,
      to: "cocompi.coco@gmail.com",
      subject: `New message from ${name}`,
      text: message
    });

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
