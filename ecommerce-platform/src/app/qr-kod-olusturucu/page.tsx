import QRCodeGenerator from './QRCodeGenerator';
import { Metadata } from 'next';
import { cookies } from 'next/headers';

export const metadata: Metadata = {
    title: 'QR Kod Oluşturucu | Ücretsiz QR Aracı',
    description: 'Hızlı, ücretsiz ve kolay QR kod oluşturucu. Link, metin veya numara girin, anında QR kodunuzu oluşturun ve indirin.',
};

export default function QrCodePage() {
    const session = cookies().get('user_session')?.value;
    let user = null;
    try {
        user = session ? JSON.parse(session) : null;
    } catch (e) {
        console.error("Failed to parse user session", e);
    }

    return <QRCodeGenerator user={user} />;
}
