export default function PrivacyPage() {
    return (
        <div className="container" style={{ padding: '4rem 2rem', maxWidth: '800px' }}>
            <h1 className="title" style={{ fontSize: '2.5rem', marginBottom: '2rem', textAlign: 'center' }}>Gizlilik Politikası</h1>

            <div className="card" style={{ padding: '2.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <section>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>1. Veri Toplama</h2>
                        <p style={{ color: 'var(--text-light)', lineHeight: '1.6' }}>
                            Erashu & Gaming olarak, hizmetlerimizi kullanırken sizden bazı kişisel bilgileri (isim, e-posta, adres vb.) talep edebiliriz.
                            Bu bilgiler, siparişlerinizin işlenmesi ve size daha iyi hizmet verilebilmesi amacıyla saklanmaktadır.
                        </p>
                    </section>

                    <section>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>2. Güvenlik</h2>
                        <p style={{ color: 'var(--text-light)', lineHeight: '1.6' }}>
                            Kişisel verileriniz, yetkisiz erişime karşı korunmakta olup, SSL sertifikası ile şifrelenmiş sunucularımızda saklanmaktadır.
                            Ödeme bilgileriniz (kredi kartı vb.) hiçbir şekilde sistemlerimizde saklanmamaktadır.
                        </p>
                    </section>

                    <section>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>3. Çerezler (Cookies)</h2>
                        <p style={{ color: 'var(--text-light)', lineHeight: '1.6' }}>
                            Sitemizi daha verimli kullanabilmeniz ve alışveriş deneyiminizi kişiselleştirebilmek adına çerezler kullanmaktayız.
                            Tarayıcı ayarlarınızdan çerezleri yönetebilirsiniz.
                        </p>
                    </section>

                    <section>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>4. İletişim</h2>
                        <p style={{ color: 'var(--text-light)', lineHeight: '1.6' }}>
                            Gizlilik politikamızla ilgili her türlü sorunuz için <a href="/iletisim" style={{ color: 'var(--primary)', fontWeight: 600 }}>İletişim</a> sayfasından bize ulaşabilirsiniz.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
