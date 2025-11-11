import nodemailer from "nodemailer";

// Use environment variables
const sendEmail = async (options) => {
   const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST, //gmail
      port: process.env.EMAIL_PORT, //587
      secure: false, // true for 465, false for other ports like 587
      auth: {
         user: process.env.EMAIL_USER, // your mail whose app password is created
         pass: process.env.EMAIL_PASS, // app password
      },
   });

   const mailOptions = {
      from: `IPDIMS <${process.env.EMAIL_USER}>`, // your mail your mail whose app password is created from which you want to send mail
      to: options.email,
      subject: options.subject,
      text: options.message,
   };

   await transporter.sendMail(mailOptions);
};

export default sendEmail;
