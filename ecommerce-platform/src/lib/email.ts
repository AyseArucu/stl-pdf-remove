
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendPasswordResetEmail(email: string, token: string) {
    const resetLink = `http://localhost:3000/reset-password?token=${token}`;

    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev', // Default testing domain. Change to Verified Domain in Prod.
            to: email,
            subject: '🔒 Şifre Sıfırlama İsteği - Erashu & Gaming',
            html: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <style>
                    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f9fafb; }
                    .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
                    .header { text-align: center; padding-bottom: 30px; }
                    .logo { font-size: 24px; font-weight: bold; color: #65216e; text-decoration: none; }
                    .card { background: #ffffff; padding: 40px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); text-align: center; }
                    .icon { font-size: 48px; margin-bottom: 20px; }
                    .title { font-size: 24px; font-weight: 600; color: #111; margin-bottom: 16px; }
                    .text { color: #555; margin-bottom: 32px; font-size: 16px; }
                    .btn { display: inline-block; background-color: #65216e; color: #ffffff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px; transition: background-color 0.2s; }
                    .btn:hover { background-color: #4a1850; }
                    .footer { text-align: center; padding-top: 30px; color: #888; font-size: 14px; }
                    .link { word-break: break-all; color: #65216e; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <a href="http://localhost:3000" class="logo">ERASHU & GAMİNG</a>
                    </div>
                    <div class="card">
                        <div class="icon">🔒</div>
                        <h1 class="title">Şifre Sıfırlama</h1>
                        <p class="text">
                            Hesabınız için bir şifre sıfırlama talebi aldık. 
                            Aşağıdaki butona tıklayarak hemen yeni bir şifre belirleyebilirsiniz.
                            Bu bağlantı 30 dakika süreyle geçerlidir.
                        </p>
                        <a href="${resetLink}" class="btn">Şifremi Sıfırla</a>
                        <p style="margin-top: 30px; font-size: 14px; color: #999;">
                            Eğer bu talebi siz yapmadıysanız, bu e-postayı görmezden gelebilirsiniz. Hesabınız güvende.
                        </p>
                    </div>
                    <div class="footer">
                        <p>© 2024 Erashu & Gaming. Tüm hakları saklıdır.</p>
                        <p style="font-size: 12px; margin-top: 10px;">
                            Buton çalışmıyorsa aşağıdaki bağlantıyı tarayıcınıza yapıştırın:<br>
                            <a href="${resetLink}" class="link">${resetLink}</a>
                        </p>
                    </div>
                </div>
            </body>
            </html>
            `
        });
        console.log(`[EMAIL SENT] Password reset email sent to ${email}`);
        return { success: true };
    } catch (error) {
        console.error('[EMAIL ERROR] Failed to send email:', error);
        return { success: false, error };
    }
}


export async function sendServiceRequestEmail(data: any) {
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev', // Default testing domain
            to: 'info@erashugaming.com', // Change this to your actual admin email
            subject: `🚀 Yeni Web Tasarım Talebi: ${data.name}`,
            html: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <style>
                    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: #65216e; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
                    .content { background: #ffffff; padding: 20px; border: 1px solid #ddd; }
                    .field { margin-bottom: 15px; }
                    .label { font-weight: bold; color: #666; font-size: 14px; }
                    .value { font-size: 16px; color: #000; }
                    .footer { text-align: center; font-size: 12px; color: #999; margin-top: 20px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h2>Yeni Hizmet Talebi</h2>
                    </div>
                    <div class="content">
                        <div class="field">
                            <div class="label">Müşteri Adı</div>
                            <div class="value">${data.name}</div>
                        </div>
                        <div class="field">
                            <div class="label">E-posta</div>
                            <div class="value"><a href="mailto:${data.email}">${data.email}</a></div>
                        </div>
                        <div class="field">
                            <div class="label">Telefon</div>
                            <div class="value"><a href="tel:${data.phone}">${data.phone}</a></div>
                        </div>
                        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                        <div class="field">
                            <div class="label">Site Türü</div>
                            <div class="value">${data.siteType}</div>
                        </div>
                        <div class="field">
                            <div class="label">Sayfa Sayısı</div>
                            <div class="value">${data.pageCount}</div>
                        </div>
                        <div class="field">
                            <div class="label">Bütçe</div>
                            <div class="value">${data.budget || 'Belirtilmedi'}</div>
                        </div>
                        <div class="field">
                            <div class="label">Özel İstekler</div>
                            <div class="value">${data.specialRequests || 'Yok'}</div>
                        </div>
                    </div>
                    <div class="footer">
                        <p>Bu e-posta Erashu & Gaming web sitesinden gönderilmiştir.</p>
                    </div>
                </div>
            </body>
            </html>
            `
        });
        console.log(`[EMAIL SENT] Service request notification sent for ${data.email}`);
        return { success: true };
    } catch (error) {
        console.error('[EMAIL ERROR] Failed to send service request email:', error);
        return { success: false, error };
    }
}

export async function sendVerificationEmail(email: string, token: string) {
    const confirmLink = `http://localhost:3000/verify-email?token=${token}`;

    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: '✅ E-posta Adresinizi Doğrulayın - Erashu & Gaming',
            html: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <style>
                    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f9fafb; }
                    .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
                    .header { text-align: center; padding-bottom: 30px; }
                    .logo { font-size: 24px; font-weight: bold; color: #65216e; text-decoration: none; }
                    .card { background: #ffffff; padding: 40px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); text-align: center; }
                    .icon { font-size: 48px; margin-bottom: 20px; }
                    .title { font-size: 24px; font-weight: 600; color: #111; margin-bottom: 16px; }
                    .text { color: #555; margin-bottom: 32px; font-size: 16px; }
                    .btn { display: inline-block; background-color: #65216e; color: #ffffff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px; transition: background-color 0.2s; }
                    .btn:hover { background-color: #4a1850; }
                    .footer { text-align: center; padding-top: 30px; color: #888; font-size: 14px; }
                    .link { word-break: break-all; color: #65216e; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <a href="http://localhost:3000" class="logo">ERASHU & GAMİNG</a>
                    </div>
                    <div class="card">
                        <div class="icon">✉️</div>
                        <h1 class="title">E-posta Doğrulama</h1>
                        <p class="text">
                            Aramıza hoş geldiniz! Hesabınızı güvenle kullanmaya başlamak için lütfen e-posta adresinizi doğrulayın.
                        </p>
                        <a href="${confirmLink}" class="btn">Hesabımı Doğrula</a>
                        <p style="margin-top: 30px; font-size: 14px; color: #999;">
                            Eğer bu hesabı siz oluşturmadıysanız, bu e-postayı görmezden gelebilirsiniz.
                        </p>
                    </div>
                    <div class="footer">
                        <p>© 2024 Erashu & Gaming. Tüm hakları saklıdır.</p>
                        <p style="font-size: 12px; margin-top: 10px;">
                            Buton çalışmıyorsa aşağıdaki bağlantıyı tarayıcınıza yapıştırın:<br>
                            <a href="${confirmLink}" class="link">${confirmLink}</a>
                        </p>
                    </div>
                </div>
            </body>
            </html>
            `
        });
        console.log(`[EMAIL SENT] Verification email sent to ${email}`);
        return { success: true };
    } catch (error) {
        console.error('[EMAIL ERROR] Failed to send verification email:', error);
        return { success: false, error };
    }
}
