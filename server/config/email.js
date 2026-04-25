import nodemailer from "nodemailer";

// Use environment variables
const sendEmail = async (options) => {
   const emailHost = process.env.EMAIL_HOST;
   const emailUser = process.env.EMAIL_USER;
   const rawEmailPass = process.env.EMAIL_PASS;
   const emailPort = Number(process.env.EMAIL_PORT || 587);

   if (!emailHost || !emailUser || !rawEmailPass) {
      throw new Error(
         "Email configuration is missing. Please set EMAIL_HOST, EMAIL_USER, and EMAIL_PASS.",
      );
   }

   // Gmail app passwords are often copied with spaces; normalize to avoid auth failures.
   const emailPass = rawEmailPass.replace(/\s+/g, "").trim();

   const transporter = nodemailer.createTransport({
      host: emailHost, // smtp.gmail.com
      port: emailPort,
      secure: emailPort === 465,
      auth: {
         user: emailUser,
         pass: emailPass,
      },
   });

   const mailOptions = {
      from: `IPDIMS <${emailUser}>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: options.html,
   };

   await transporter.sendMail(mailOptions);
};

export default sendEmail;
