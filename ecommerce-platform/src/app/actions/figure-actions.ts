'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function submitFigureOrder(formData: FormData) {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const styleId = formData.get('styleId') as string;
    const styleName = formData.get('styleName') as string;

    // Handle File Upload
    const file = formData.get('image') as File;
    let imageUrl = '';

    if (file && file.size > 0) {
        try {
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);

            // Unique filename
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            const extension = file.type.split('/')[1] || 'jpg';
            const filename = `figure-${uniqueSuffix}.${extension}`;

            const uploadDir = join(process.cwd(), 'public', 'uploads');
            const path = join(uploadDir, filename);

            await writeFile(path, buffer);
            imageUrl = `/uploads/${filename}`;
        } catch (error) {
            console.error('File upload failed:', error);
            return { success: false, message: 'Görsel yüklenirken bir hata oluştu.' };
        }
    } else {
        return { success: false, message: 'Lütfen bir fotoğraf yükleyin.' };
    }

    if (!name || !email || !phone) {
        return { success: false, message: 'Lütfen iletişim bilgilerini eksiksiz doldurun.' };
    }

    // Create Order
    // Using a special ID prefix or item name to distinguish custom orders
    // Create Order
    try {
        await prisma.order.create({
            data: {
                // Generate a custom ID or let Prisma do it? 
                // Legacy used 'FIG-' + random. Prisma ID is usually CUID or UUID.
                // If ID is string in schema, we can set it.
                id: 'FIG-' + Math.random().toString(36).substring(7).toUpperCase(),
                customerName: name,
                customerEmail: email,
                address: `Tel: ${phone} | Ref Görsel: ${imageUrl}`, // Combining phone and ref image as address/note
                status: 'Hazırlanıyor',
                paymentMethod: 'COD',
                paymentStatus: 'PENDING',
                total: 0,
                // Nested create for items
                items: {
                    create: [
                        {
                            productId: 'custom-figure-' + styleId,
                            productName: `Özel 3D Figür Tasarımı (${styleName})`,
                            quantity: 1,
                            price: 0
                        }
                    ]
                }
            }
        });

        revalidatePath('/erashu/admin/orders');
        return { success: true, message: 'Siparişiniz alındı! Tasarım ekibimiz sizinle iletişime geçecektir.' };
    } catch (error) {
        console.error('Figure order error:', error);
        return { success: false, message: 'Sipariş oluşturulamadı.' };
    }
}

import { generate3DFigure } from '@/lib/ai';

export async function generatePreviewAction(prompt: string, styleId: string) {
    // In a real scenario, we might want to upload the image to OpenAI Vision to get a description first,
    // or use Replicate to do Image-to-Image.
    // For DALL-E 3 (Text-to-Image), we rely on the prompt. 
    // To make it better, we could ask the user for a description or use a generic one "A person..."

    // For this implementation, we will pass the prompt constructed by the client.

    const result = await generate3DFigure({
        prompt: prompt,
        style: styleId
    });

    return result;
}
