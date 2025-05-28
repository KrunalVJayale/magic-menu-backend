const nodemailer = require('nodemailer');

module.exports.sendEmail = async (name, email, otp) => {
    if (!email) {
        console.error('No email address provided!');
        return { status: 400, message: "No email address provided!" };
    }

    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST, // Example: 'smtp.gmail.com'
        port: 587,                   // TLS port
        secure: false,               // Use true for 465, false for 587
        auth: {
            user: process.env.EMAIL_USER, // Your email address
            pass: process.env.EMAIL_PASS, // Your email's app password
        },
    });

    const mailOptions = {
        from: `"Magic Menu Support" <${process.env.EMAIL_USER}>`, // More professional from address
        to: email, // Ensure email is passed correctly
        subject: `Welcome to Magic Menu, ${name}!`,
        text: `Hello ${name},\n\nThank you for choosing Magic Menu! We're thrilled to have you with us.\n\nYour one-time password (OTP) for login is: ${otp}\n\nIf you did not request this, please ignore this email.\n\nBest regards,\nMagic Menu Team`,
    };

    try {
        await transporter.sendMail(mailOptions);
        return { status: 200, message: "Email sent successfully" };
    } catch (error) {
        console.error('Error sending email:', error);
        return { status: 500, message: "Error sending email" };
    }
};
