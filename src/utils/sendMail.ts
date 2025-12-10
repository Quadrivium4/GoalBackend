
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
    // console.log(process.env.GMAIL_CLIENT_ID,
    //     process.env.GMAIL_CLIENT_SECRET,
    //     process.env.GMAIL_REDIRECT_URI)
    const accessToken = await oAuth2Client.getAccessToken()
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: "OAuth2",
            user: process.env.MY_EMAIL,
            clientId: process.env.GMAIL_CLIENT_ID,
            clientSecret: process.env.GMAIL_CLIENT_SECRET,
            refreshToken: process.env.GMAIL_REFRESH_TOKEN,
            accessToken: accessToken
        },
        tls: {
            rejectUnauthorized: false
        }
    });


    var mailOptions = {
        from: process.env.MY_EMAIL,
        to: to,
        subject: subject,
        html: body,
        attachments
    };

    const result = await transporter.sendMail(mailOptions);
    return result;
}

export default sendMail 