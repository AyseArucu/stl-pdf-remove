import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';


export async function POST(req: Request) {

    try {
        const body = await req.json();
        const { targetUrl, name, password, design, type, data } = body;

        // Get User from Session Cookie
        const cookieStore = await cookies();
        const userSession = cookieStore.get('user_session')?.value;
        let userId = null;

        if (userSession) {
            try {
                const user = JSON.parse(userSession);
                userId = user.id;
            } catch (e) {
                console.error('Failed to parse user session in API', e);
            }
        }

        console.log('API Create QR:', { targetUrl, name, type, userId, hasPassword: !!password });

        // Validate required fields based on type
        // For 'url' type, targetUrl is required. For others, it might be optional or generated.
        if (type === 'url' && !targetUrl) {
            return NextResponse.json({ success: false, error: 'Target URL is required' }, { status: 400 });
        }

        const qr = await prisma.qrCode.create({
            data: {
                targetUrl: targetUrl || undefined,
                name: name || null,
                password: password || null,
                design: design || null,
                type: type || 'url',
                data: data || null,
                userId: userId,
            },
        });

        return NextResponse.json({ success: true, id: qr.id, shortUrl: `${process.env.NEXT_PUBLIC_APP_URL || ''}/q/${qr.id}` });
    } catch (error: any) {
        console.error('API Error creating QR code detailed:', error);
        return NextResponse.json({ success: false, error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
