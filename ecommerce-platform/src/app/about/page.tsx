export default function AboutPage() {
    return (
        <div className="container" style={{ padding: '4rem 2rem' }}>
            {/* Header Section */}
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                <h1 className="title" style={{ fontSize: '3rem', marginBottom: '1rem' }}>Hakkımızda</h1>
                <p style={{ fontSize: '1.2rem', color: 'var(--text-light)', maxWidth: '800px', margin: '0 auto' }}>
                    Erashu & Gaming olarak, oyun dünyasının en yeni ve en kaliteli ekipmanlarını sizlere sunmak için buradayız.
                </p>
            </div>

            {/* Content Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', marginBottom: '4rem' }}>
                <div className="card" style={{ padding: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--secondary)' }}>Hikayemiz</h2>
                    <p style={{ color: 'var(--text-light)', lineHeight: '1.7' }}>
                        2025 yılında kurulan Erashu & Gaming, oyuncuların ihtiyaçlarını en iyi anlayan ve bu ihtiyaçlara yönelik çözümler üreten bir teknoloji mağazasıdır.
                        Küçük bir girişim olarak başladığımız bu yolda, bugün binlerce mutlu müşteriye hizmet vermenin gururunu yaşıyoruz.
                    </p>
                </div>

                <div className="card" style={{ padding: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--secondary)' }}>Misyonumuz</h2>
                    <p style={{ color: 'var(--text-light)', lineHeight: '1.7' }}>
                        Amacımız, her seviyeden oyuncuya en iyi performansı sağlayacak donanımları, erişilebilir fiyatlarla sunmaktır.
                        Teknolojiyi yakından takip ediyor ve ürün gamımızı sürekli güncelliyoruz.
                    </p>
                </div>

                <div className="card" style={{ padding: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--secondary)' }}>Vizyonumuz</h2>
                    <p style={{ color: 'var(--text-light)', lineHeight: '1.7' }}>
                        Türkiye&apos;nin lider oyuncu ekipmanları sağlayıcısı olmak ve e-spor ekosistemine katkıda bulunmak.
                        Müşteri memnuniyetini her zaman ön planda tutan bir marka olarak büyümeye devam ediyoruz.
                    </p>
                </div>
            </div>

            {/* Image Placeholder */}
            <div style={{
                width: '100%',
                height: '400px',
                backgroundColor: '#2d0a31',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '2rem',
                fontWeight: 'bold',
                backgroundImage: 'linear-gradient(135deg, #2d0a31 0%, #581c87 100%)'
            }}>
                Oyun Tutkunları İçin Buradayız
            </div>
        </div>
    );
}
