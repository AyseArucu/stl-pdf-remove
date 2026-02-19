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

            <div className="space-y-4">
                {slides.map((slide) => (
                    <div key={slide.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row items-center gap-4 md:gap-6">
                        <div className="flex items-center gap-4 w-full md:w-auto">
                            <span className="font-bold text-gray-400">#{slide.order}</span>
                            <div className="w-24 h-14 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                <img src={slide.imageUrl} alt={slide.title} className="w-full h-full object-cover" />
                            </div>
                        </div>

                        <div className="flex-1 text-center md:text-left w-full">
                            <h3 className="font-semibold text-gray-900">{slide.title}</h3>
                            <p className="text-sm text-gray-500">{slide.subtitle || '-'}</p>
                        </div>

                        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end border-t md:border-none pt-3 md:pt-0">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${slide.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {slide.isActive ? 'Aktif' : 'Pasif'}
                            </span>

                            <div className="flex gap-2">
                                <Link href={`/erashu/admin/slider/${slide.id}`} className="p-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium">
                                    Düzenle
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}

                {slides.length === 0 && (
                    <div className="p-8 text-center text-gray-500 bg-white rounded-xl border border-gray-200">
                        Henüz hiç slayt eklenmemiş.
                    </div>
                )}
            </div>
        </main>
    );
}
