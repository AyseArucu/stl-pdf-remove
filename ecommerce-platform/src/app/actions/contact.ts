'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { sendMail } from '@/lib/mail';

export async function deleteMessage(id: string) {
    try {
        await prisma.contactMessage.delete({
            where: { id }
        });
        revalidatePath('/erashu/admin/messages');
        return { success: true };
    } catch (error) {
        console.error('Error deleting message:', error);
        return { success: false, error: 'Mesaj silinemedi.' };
    }
}

export async function replyToMessage(id: string, replyMessage: string) {
    try {
        const message = await prisma.contactMessage.findUnique({
            where: { id }
        });

        if (!message) {
            return { success: false, error: 'Mesaj bulunamadı.' };
        }

        // Send email
        await sendMail({
            to: message.email,
            subject: `Re: ${message.subject}`,
            html: `
                <p>Sayın ${message.name},</p>
                <p>Mesajınıza istinaden cevabımız aşağıdadır:</p>
                <blockquote style="border-left: 2px solid #ccc; padding-left: 10px; color: #666;">
                    ${message.message}
                </blockquote>
                <hr />
                <p>${replyMessage.replace(/\n/g, '<br/>')}</p>
                <br/>
                <p>Saygılarımızla,<br/>Erashu Ekibi</p>
            `
        });

        // Optionally mark as replied or log it? 
        // For now just return success.

        return { success: true };
    } catch (error) {
        console.error('Error replying to message:', error);
        return { success: false, error: 'Cevap gönderilemedi.' };
    }
}
