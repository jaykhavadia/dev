const nodemailer = require("nodemailer");

var transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "d4faf503e18702",
    pass: "1580d8dd63423a",
  },
});
// const transporter = nodemailer.createTransport({
//   host: "sandbox.smtp.mailtrap.io",
//   port: 2525,
//   auth: {
//     user: "3e819693bca18f",
//     pass: "f0d9ad44e0f4f6"
//   }
// });

module.exports = transporter;
