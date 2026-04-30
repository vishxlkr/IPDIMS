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

   const transportOptions = [
      {
         host: emailHost,
         port: emailPort,
         secure: emailPort === 465,
      },
   ];

   if (emailPort !== 465) {
      transportOptions.push({
         host: emailHost,
         port: 465,
         secure: true,
      });
   }

   let lastError;

   for (const transportOption of transportOptions) {
      const transporter = nodemailer.createTransport({
         ...transportOption,
         family: 4,
         auth: {
            user: emailUser,
            pass: emailPass,
         },
         connectionTimeout: 15000,
         greetingTimeout: 15000,
         socketTimeout: 30000,
      });

      const mailOptions = {
         from: `"IPDIMS Support Team" <${emailUser}>`,
         to: options.email,
         subject: options.subject,
         text: options.message,
         html: options.html,
      };

      try {
         await transporter.sendMail(mailOptions);
         return;
      } catch (error) {
         lastError = error;
      }
   }

   throw lastError || new Error("Failed to send email");
};

export default sendEmail;
