export default function TermsPage() {
    return (
        <div className="container" style={{ padding: '4rem 2rem', maxWidth: '800px' }}>
            <h1 className="title" style={{ fontSize: '2.5rem', marginBottom: '2rem', textAlign: 'center' }}>Hizmet Şartları</h1>

            <div className="card" style={{ padding: '2.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <p style={{ color: 'var(--text-light)', lineHeight: '1.6' }}>
                        Bu internet sitesine girmeniz veya bu internet sitesindeki herhangi bir bilgiyi kullanmanız aşağıdaki koşulları kabul ettiğiniz anlamına gelir.
                    </p>

                    <section>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>1. Genel Hükümler</h2>
                        <p style={{ color: 'var(--text-light)', lineHeight: '1.6' }}>
                            Erashu & Gaming, dilediği zaman bu yasal uyarı sayfasının içeriğini güncelleme yetkisini saklı tutmaktadır. Kullanıcıların siteye her girişte yasal uyarı sayfasını ziyaret etmeleri tavsiye edilmektedir.
                        </p>
                    </section>

                    <section>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>2. Telif Hakları</h2>
                        <p style={{ color: 'var(--text-light)', lineHeight: '1.6' }}>
                            Bu internet sitesinde yer alan her türlü tasarım, marka, logo ve ses, görüntü, yazı içeren bilgi ve belgeler (bunlardan ibaret olmamak kaydıyla) Erashu &amp; Gaming&apos;in mülkiyetindedir ve telif hakkı koruması altındadır.
                        </p>
                    </section>

                    <section>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>3. Sorumluluklar</h2>
                        <p style={{ color: 'var(--text-light)', lineHeight: '1.6' }}>
                            Erashu & Gaming, web sitesinde mevcut olan bilgilerin doğruluk ve güncelliğini sürekli şekilde kontrol etmektedir. Ancak gösterilen çabaya rağmen, web sitesindeki bilgiler fiili değişikliklerin gerisinde kalabilir.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
