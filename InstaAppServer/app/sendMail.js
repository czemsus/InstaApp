import nodemailer from "nodemailer";

export const sendMail = (email) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "mikolajsolarz11@gmail.com ",
      pass: "hmkz ciug usns cqtm",
    },
  });

  async function main() {
    const info = await transporter.sendMail({
      from: '"InstaApp" <mikolajsolarz11@gmail.com>',
      to: email,
      subject: "Hello ✔",
      text: "Hello world?",
      html: "<b>Hello world?</b>",
    });

    console.log("Message sent: %s", info.messageId);
  }

  main().catch(console.error);
};
