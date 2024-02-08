const nodemailer = require("nodemailer");

module.exports = async ({from, to, subject, text, html}) => {
    let transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.MAIL_USER, // generated ethereal user
            pass: process.env.MAIL_PASS, // generated ethereal password
        },

    });

    console.log("mail will be send to ", to);

    console.log("half done");


    const info = await transporter.sendMail({
        from: `Elecon <${from}>`, // sender address
        to: to, // list of receivers
        subject: subject, // Subject line
        text: text, // plain text body
        html: html, // html body
    });

    console.log("full done");
    console.log(info);
}