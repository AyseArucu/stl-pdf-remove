// import nodemailer from 'nodemailer';

// const transporter = nodemailer.createTransport({
//     host: process.env.SMTP_HOST,
//     port: Number(process.env.SMTP_PORT) || 587,
//     secure: false, // true for 465, false for other ports
//     auth: {
//         user: process.env.SMTP_USER,
//         pass: process.env.SMTP_PASS,
//     },
// });

export async function sendMail({ to, subject, html }: { to: string; subject: string; html: string }) {
    console.log('--- MOCK EMAIL SEND START ---');
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log('Content:', html);
    console.log('--- MOCK EMAIL SEND END ---');

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return { success: true, messageId: 'mock-message-id-' + Date.now() };

    /* 
    // Real implementation (saving for later when nodemailer can be installed)
    try {
        const info = await transporter.sendMail({
            from: process.env.SMTP_FROM || '"Erashu Contact" <noreply@erashu.com>',
            to,
            subject,
            html,
        });
        console.log('Message sent: %s', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Error sending email:', error);
        return { success: false, error };
    }
    */
}
