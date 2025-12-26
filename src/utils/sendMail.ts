
import dotenv from "dotenv"; 
dotenv.config()
import  { google } from "googleapis";
import nodemailer from "nodemailer";


const oAuth2Client = new google.auth.OAuth2(
    process.env.GMAIL_CLIENT_ID,
    process.env.GMAIL_CLIENT_SECRET,
    process.env.GMAIL_REDIRECT_URI
);

oAuth2Client.setCredentials({
    refresh_token: process.env.GMAIL_REFRESH_TOKEN
});
const sendMail = async ({to, subject, body, attachments = []}) => {
    const transporter  = nodemailer.createTransport({
    host: 'authsmtp.securemail.pro',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'support@goalapp.it', // your domain email address
      pass: process.env.MAIL_PSW // your password
    }
  });

    var mailOptions = {
        from: 'support@goalapp.it',
        to: to,
        subject: subject,
        html: body,
        attachments
    };

    const result = await transporter.sendMail(mailOptions,  function (error, info) {
                      if (error) {
                             //-- console.log(error);
                       } else {
                         //-- console.log('Email sent: ' + info.response);
                       }
               });
    return result;
}

export default sendMail 