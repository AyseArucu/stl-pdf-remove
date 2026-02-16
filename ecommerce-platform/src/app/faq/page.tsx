export default function FAQPage() {
    return (
        <div className="container" style={{ padding: '4rem 2rem', maxWidth: '800px' }}>
            <h1 className="title" style={{ fontSize: '2.5rem', marginBottom: '2rem', textAlign: 'center' }}>Sıkça Sorulan Sorular</h1>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div className="card" style={{ padding: '2rem' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--primary)' }}>Kargo ücreti ne kadar?</h3>
                    <p style={{ color: 'var(--text-light)' }}>
                        1000 TL ve üzeri alışverişlerinizde kargo ücretsizdir. 1000 TL altı siparişlerde kargo ücreti sabit 50 TL&apos;dir.
                    </p>
                </div>

                <div className="card" style={{ padding: '2rem' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--primary)' }}>Siparişim ne zaman kargoya verilir?</h3>
                    <p style={{ color: 'var(--text-light)' }}>
                        Siparişleriniz, ödeme onayının ardından en geç 2 iş günü içerisinde kargoya teslim edilmektedir.
                    </p>
                </div>

                <div className="card" style={{ padding: '2rem' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--primary)' }}>İade süreci nasıl işliyor?</h3>
                    <p style={{ color: 'var(--text-light)' }}>
                        Satın aldığınız ürünü teslim aldıktan sonra 14 gün içerisinde iade edebilirsiniz.
                    </p>
                </div>

                <div className="card" style={{ padding: '2rem' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--primary)' }}>Hangi ödeme yöntemlerini kabul ediyorsunuz?</h3>
                    <p style={{ color: 'var(--text-light)' }}>
                        Kredi kartı (Visa, Mastercard, Troy) ve havale/EFT ile ödeme yapabilirsiniz.
                    </p>
                </div>
            </div>
        </div>
    );
}
