const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config({ path: ".env" });

const SendEmailUtility = async (EmailTo, EmailText, EmailSubject) => {
  let transporter = nodemailer.createTransport({
    host: `${process.env.MailHost}`,
    port: 587,
    secure: false,
    auth: {
      user: `${process.env.AuthUser}`,
      pass: `${process.env.AuthPass}`,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  let mailOptions = {
    from: `Work Manager <${process.env.AuthUser}>`,
    to: EmailTo,
    subject: EmailSubject,
    text: EmailText,
  };

  try {
    return await transporter.sendMail(mailOptions);
  } catch (err) {
    console.log(err);
  }
};
module.exports = SendEmailUtility;
