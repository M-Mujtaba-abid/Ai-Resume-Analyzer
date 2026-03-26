import nodemailer from "nodemailer";

const sendEmail = async (options) => {
    console.log("Sending mail to ... ", options.email);
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: 'AI Resume Analyzer <support@airesume.com>',
        to: options.email,
        subject: options.subject,
        text: options.text,
        html: options.html,
    };

    await transporter.sendMail(mailOptions);
    console.log(" mail sent to ... ", options.email);
};

export default sendEmail;