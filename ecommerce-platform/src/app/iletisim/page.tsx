import { prisma } from '@/lib/prisma';
import { submitContactMessage } from "@/app/actions";
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

export default async function IletisimPage() {
    const contactSettings = await prisma.contactSettings.findFirst();

    const address = contactSettings?.address || "Adres bilgisi eklenmemiş.";
    const phone = (contactSettings as any)?.phone || "+90 555 555 55 55";
    const email = (contactSettings as any)?.email || "info@erashu.com";
    const mapUrl = contactSettings?.mapUrl || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3011.659932629618!2d29.02102171571597!3d40.98965002855523!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cab86064d72023%3A0x6b1f79579603036e!2sModa%2C%20Kad%C4%B1k%C3%B6y%2F%C4%B0stanbul!5e0!3m2!1str!2str!4v1672531200000!5m2!1str!2str";

    return (
        <div className="container" style={{ padding: '4rem 2rem' }}>
            <h1 className="title" style={{ marginBottom: '2rem', textAlign: 'center' }}>İletişim</h1>

            <div className="contact-grid" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '4rem',
                marginTop: '2rem'
            }}>
                {/* Contact Form Section */}
                < div className="contact-form-section" >
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--primary)' }}>Bize Ulaşın</h2>
                    <form action={async (formData) => {
                        'use server';
                        const { submitContactMessage } = await import('@/app/actions');
                        await submitContactMessage(formData);
                    }} className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <div style={{ flex: 1 }}>
                                <label className="form-label">Ad Soyad</label>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Adınız Soyadınız"
                                    className="form-input"
                                    required
                                />
                            </div>
                            <div style={{ flex: 1 }}>
                                <label className="form-label">E-posta</label>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="ornek@email.com"
                                    className="form-input"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="form-label">Konu</label>
                            <input
                                type="text"
                                name="subject"
                                placeholder="Mesajınızın konusu"
                                className="form-input"
                            />
                        </div>

                        <div>
                            <label className="form-label">Mesaj</label>
                            <textarea
                                name="message"
                                rows={5}
                                placeholder="Mesajınızı buraya yazın..."
                                className="form-textarea"
                                required
                            />
                        </div>

                        <button type="submit" className="btn" style={{ alignSelf: 'flex-start', border: 'none', cursor: 'pointer' }}>
                            Gönder
                        </button>
                    </form>
                </div >

                {/* Contact Info Section */}
                < div className="contact-info-section" >
                    <div className="card" style={{ padding: '2rem' }}>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--primary)' }}>İletişim Bilgileri</h2>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            <div className="info-item" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    backgroundColor: '#f1f5f9',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'var(--accent)'
                                }}>
                                    📍
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', fontWeight: 600 }}>Adres</h3>
                                    <p style={{ color: 'var(--text-light)', lineHeight: '1.6', whiteSpace: 'pre-line' }}>
                                        {address}
                                    </p>
                                </div>
                            </div>

                            <div className="info-item" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    backgroundColor: '#f1f5f9',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'var(--accent)'
                                }}>
                                    📞
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', fontWeight: 600 }}>Telefon</h3>
                                    <p style={{ color: 'var(--text-light)' }}>
                                        {phone}
                                    </p>
                                    <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>
                                        Pzt - Cum: 09:00 - 18:00
                                    </p>
                                </div>
                            </div>

                            <div className="info-item" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    backgroundColor: '#f1f5f9',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'var(--accent)'
                                }}>
                                    ✉️
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', fontWeight: 600 }}>E-posta</h3>
                                    <p style={{ color: 'var(--text-light)' }}>
                                        {email}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div >
            </div >

            {/* Map Section */}
            {
                mapUrl && (
                    <div style={{ marginTop: '4rem' }}>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', textAlign: 'center', color: 'var(--primary)' }}>Konumumuz</h2>
                        <div style={{
                            width: '100%',
                            height: '450px',
                            backgroundColor: '#f1f5f9',
                            borderRadius: '16px',
                            overflow: 'hidden',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            {mapUrl.includes('/embed') ? (
                                <iframe
                                    src={mapUrl}
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                />
                            ) : (
                                <div style={{ textAlign: 'center', padding: '1rem', color: '#64748b' }}>
                                    <p>Harita şu anda görüntülenemiyor.</p>
                                    <p style={{ fontSize: '0.875rem' }}>Lütfen yönetici paneli üzerinden geçerli bir harita yerleştirme bağlantısı yapılandırın.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )
            }
        </div >
    );
}
