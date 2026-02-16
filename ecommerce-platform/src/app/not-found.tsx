import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="container" style={{ padding: '6rem 2rem', textAlign: 'center', minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <h1 style={{ fontSize: '6rem', fontWeight: 'bold', color: 'var(--primary)', lineHeight: 1 }}>404</h1>
            <h2 className="title" style={{ fontSize: '2rem', marginBottom: '1rem' }}>Sayfa Bulunamadı</h2>
            <p style={{ color: 'var(--text-light)', marginBottom: '2rem', maxWidth: '500px' }}>
                Aradığınız sayfayı bulamadık. Silinmiş, taşınmış veya bağlantı hatalı olabilir.
            </p>
            <Link href="/" className="btn">
                Anasayfaya Dön
            </Link>
        </div>
    );
}
