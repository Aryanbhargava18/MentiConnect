// services/notificationService.js
const nodemailer = require('nodemailer');

// Use Ethereal for testing - generates temporary credentials
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

exports.sendMatchNotification = async (mentee, mentor) => {
    const mailOptions = {
        from: '"Menti Connect" <notify@menticonnect.com>',
        to: `${mentee.email}, ${mentor.email}`,
        subject: '🎉 You have a new match on Menti Connect!',
        html: `
            <h3>Congratulations!</h3>
            <p><b>${mentee.username}</b> (Mentee) and <b>${mentor.username}</b> (Mentor) are now connected.</p>
            <p>Reach out to start your mentorship journey!</p>
        `,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`Notification email sent: ${info.messageId}`);
        // URL to preview the sent email in Ethereal
        console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    } catch (error) {
        console.error('Error sending notification email:', error);
    }
};