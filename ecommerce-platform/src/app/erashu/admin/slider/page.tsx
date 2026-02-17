import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function AdminSliderPage() {
    let slides = [];
    try {
        slides = await prisma.heroSlide.findMany({
            orderBy: { order: 'asc' }
        });
    } catch (e: any) {
        console.error("Slider fetch error:", e);
        return (
            <main className="container p-8">
                <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '2rem', borderRadius: '12px', textAlign: 'center' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Sistem Güncellemesi Gerekli</h2>
                    <p style={{ marginBottom: '1rem' }}>
                        Veritabanı şeması güncellendi ancak sunucu eski sürümü kullanıyor.
                    </p>
                    <div style={{ backgroundColor: 'white', padding: '1rem', borderRadius: '8px', border: '1px solid #fecaca', display: 'inline-block', textAlign: 'left', fontFamily: 'monospace' }}>
                        1. Terminalinizi kapatın (Ctrl+C)<br />
                        2. <strong>npm run dev</strong> komutunu tekrar çalıştırın.
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="container">
            <header className="header" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <h1 className="title">Slider Yönetimi</h1>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <Link href="/erashu/admin" className="btn" style={{ backgroundColor: 'var(--secondary)' }}>
                        ← Panele Dön
                    </Link>
                    <Link href="/erashu/admin/slider/new" className="btn">
                        + Yeni Slayt
                    </Link>
                </div>
            </header>

            <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid var(--border)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid var(--border)' }}>
                        <tr>
                            <th style={{ padding: '1rem', fontWeight: 600 }}>Sıra</th>
                            <th style={{ padding: '1rem', fontWeight: 600 }}>Ön Görsel</th>
                            <th style={{ padding: '1rem', fontWeight: 600 }}>Arka Plan</th>
                            <th style={{ padding: '1rem', fontWeight: 600 }}>Başlık</th>
                            <th style={{ padding: '1rem', fontWeight: 600 }}>Alt Başlık</th>
                            <th style={{ padding: '1rem', fontWeight: 600 }}>Buton</th>
                            <th style={{ padding: '1rem', fontWeight: 600 }}>Link</th>
                            <th style={{ padding: '1rem', fontWeight: 600 }}>Durum</th>
                            <th style={{ padding: '1rem', fontWeight: 600 }}>İşlemler</th>
                        </tr>
                    </thead>
                    <tbody>
                        {slides.map((slide) => (
                            <tr key={slide.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                <td style={{ padding: '1rem', fontWeight: 600 }}>{slide.order}</td>
                                <td style={{ padding: '1rem' }}>
                                    <div style={{ width: '80px', height: '40px', borderRadius: '4px', overflow: 'hidden', backgroundColor: '#f3f4f6' }}>
                                        <img
                                            src={slide.imageUrl}
                                            alt={slide.title}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    </div>
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    {slide.bgImageUrl ? (
                                        <div style={{ width: '80px', height: '40px', borderRadius: '4px', overflow: 'hidden', backgroundColor: '#f3f4f6' }}>
                                            <img
                                                src={slide.bgImageUrl}
                                                alt="Background"
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            />
                                        </div>
                                    ) : (
                                        <span style={{ fontSize: '0.8rem', color: '#9ca3af italic' }}>Varsayılan</span>
                                    )}
                                </td>
                                <td style={{ padding: '1rem', fontWeight: 500 }}>{slide.title}</td>
                                <td style={{ padding: '1rem', color: 'var(--text-light)' }}>{slide.subtitle || '-'}</td>
                                <td style={{ padding: '1rem' }}>{slide.buttonText}</td>
                                <td style={{ padding: '1rem', fontSize: '0.9rem', color: 'blue' }}>{slide.buttonLink}</td>
                                <td style={{ padding: '1rem' }}>
                                    <span style={{
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '9999px',
                                        fontSize: '0.75rem',
                                        fontWeight: 600,
                                        backgroundColor: slide.isActive ? '#ecfdf5' : '#fef2f2',
                                        color: slide.isActive ? '#059669' : '#dc2626'
                                    }}>
                                        {slide.isActive ? 'Aktif' : 'Pasif'}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                        <Link href={`/erashu/admin/slider/${slide.id}`} style={{ color: 'var(--primary)', fontWeight: 500, textDecoration: 'none' }}>
                                            Düzenle
                                        </Link>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {slides.length === 0 && (
                            <tr>
                                <td colSpan={7} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-light)' }}>
                                    <p>Henüz hiç slayt eklenmemiş.</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </main>
    );
}
