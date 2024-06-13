const nodemailer = require("nodemailer");


  const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "3e819693bca18f",
      pass: "f0d9ad44e0f4f6"
    }
  });

  module.exports = transporter