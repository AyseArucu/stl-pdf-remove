'use client';

import { useCart } from '@/components/CartContext';
import { createOrder } from '@/app/actions';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function CheckoutPage() {
    const { items, total, clearCart, shippingTotal } = useCart();
    const router = useRouter();
    const [paymentMethod, setPaymentMethod] = useState<'CREDIT_CARD' | 'BANK_TRANSFER' | 'COD'>('CREDIT_CARD');

    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    useEffect(() => {
        if (items.length === 0) {
            router.push('/');
        }
    }, [items, router]);

    if (items.length === 0) {
        return null;
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        // Append paymentMethod manually if not picked up (since we use custom state for radio but they are inputs so should be fine)
        // Actually the radio inputs have name="paymentMethodSelect", we need to ensure "paymentMethod" field is correct.
        // The hidden input already does this: <input type="hidden" name="paymentMethod" value={paymentMethod} />

        const result = await createOrder(formData);

        if (result && result.success) {
            clearCart();
            router.push('/?orderSuccess=true');
        } else {
            alert('Sipariş oluşturulurken bir hata oluştu.');
        }
    }

    return (
        <main className="container">
            <header className="header">
                <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <h1 className="title">Ödeme</h1>
                </Link>
                <Link href="/cart" className="btn" style={{ backgroundColor: 'var(--secondary)' }}>
                    ← Sepete Dön
                </Link>
            </header>

            <div className="checkout-grid">
                {/* Sol: Form */}
                <div>
                    <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Ödeme ve Teslimat</h2>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                        {/* Hidden inputs */}
                        <input type="hidden" name="items" value={JSON.stringify(items.map(i => ({
                            productId: i.id,
                            productName: i.name,
                            quantity: i.quantity,
                            price: i.price
                        })))} />
                        {/* Ensure total is a string for FormData */}
                        <input type="hidden" name="total" value={total.toString()} />
                        <input type="hidden" name="paymentMethod" value={paymentMethod} />

                        {/* Adres Bölümü */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <h3 style={{ fontSize: '1.2rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>Teslimat Adresi</h3>
                            <div className="form-group">
                                <label className="form-label">Ad Soyad</label>
                                <input name="name" type="text" required className="form-input" />
                            </div>

                            <div className="form-group">
                                <label className="form-label">E-posta</label>
                                <input name="email" type="email" required className="form-input" />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Adres</label>
                                <textarea name="address" required rows={3} className="form-textarea" style={{ resize: 'vertical' }}></textarea>
                            </div>
                        </div>

                        {/* Ödeme Yöntemi Seçimi */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <h3 style={{ fontSize: '1.2rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>Ödeme Yöntemi</h3>

                            <div className="radio-group">
                                <label className={`radio-option ${paymentMethod === 'CREDIT_CARD' ? 'selected' : ''}`}>
                                    <input type="radio" name="paymentMethodSelect" checked={paymentMethod === 'CREDIT_CARD'} onChange={() => setPaymentMethod('CREDIT_CARD')} />
                                    <span>Kredi/Banka Kartı</span>
                                </label>
                                <label className={`radio-option ${paymentMethod === 'BANK_TRANSFER' ? 'selected' : ''}`}>
                                    <input type="radio" name="paymentMethodSelect" checked={paymentMethod === 'BANK_TRANSFER'} onChange={() => setPaymentMethod('BANK_TRANSFER')} />
                                    <span>Havale/EFT</span>
                                </label>
                                <label className={`radio-option ${paymentMethod === 'COD' ? 'selected' : ''}`}>
                                    <input type="radio" name="paymentMethodSelect" checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')} />
                                    <span>Kapıda Ödeme</span>
                                </label>
                            </div>
                        </div>

                        {/* Ödeme Detayları - Conditional */}
                        {paymentMethod === 'CREDIT_CARD' && (
                            <div style={{ padding: '1.5rem', border: '1px solid var(--border)', borderRadius: '8px', backgroundColor: '#f9fafb' }}>
                                <h4 style={{ marginBottom: '1rem' }}>Kart Bilgileri</h4>
                                <div style={{ display: 'grid', gap: '1rem' }}>
                                    <input type="text" placeholder="Kart Numarası" className="form-input" />
                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        <input type="text" placeholder="AA/YY" className="form-input" style={{ flex: 1 }} />
                                        <input type="text" placeholder="CVC" className="form-input" style={{ flex: 1 }} />
                                    </div>
                                    <input type="text" placeholder="Kart Üzerindeki İsim" className="form-input" />
                                </div>
                            </div>
                        )}

                        {paymentMethod === 'BANK_TRANSFER' && (
                            <div style={{ padding: '1.5rem', border: '1px solid var(--border)', borderRadius: '8px', backgroundColor: '#f0f9ff' }}>
                                <h4 style={{ marginBottom: '0.5rem', color: '#0369a1' }}>Banka Bilgileri</h4>
                                <p style={{ marginBottom: '0.5rem' }}><strong>Banka:</strong> Ziraat Bankası</p>
                                <p style={{ marginBottom: '0.5rem' }}><strong>IBAN:</strong> TR00 0000 0000 0000 0000 0000 00</p>
                                <p><strong>Alıcı:</strong> Demo Şirketi</p>
                                <hr style={{ margin: '1rem 0', borderColor: '#bae6fd' }} />
                                <p style={{ fontSize: '0.9rem' }}>Sipariş numaranızı açıklama kısmına yazmayı unutmayınız.</p>
                            </div>
                        )}

                        {paymentMethod === 'COD' && (
                            <div style={{ padding: '1.5rem', border: '1px solid var(--border)', borderRadius: '8px', backgroundColor: '#fff7ed' }}>
                                <p style={{ color: '#c2410c' }}>Kapıda nakit veya kredi kartı ile ödeme yapabilirsiniz. Ekstra hizmet bedeli yansıtılmaz.</p>
                            </div>
                        )}

                        <div style={{ backgroundColor: '#f3f4f6', padding: '1rem', borderRadius: '6px', fontSize: '0.9rem', color: '#6b7280' }}>
                            Tüm ödemeleriniz 256-bit SSL sertifikası ile korunmaktadır. (Demo Proje)
                        </div>

                        <button type="submit" className="btn" style={{ width: '100%', fontSize: '1.2rem', padding: '1rem' }}>
                            Siparişi Tamamla ({total} TL)
                        </button>
                    </form>
                </div>

                {/* Sağ: Özet */}
                <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border)', height: 'fit-content' }}>
                    <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Sipariş Özeti</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                        {items.map((item) => (
                            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                    <div style={{ width: '50px', height: '50px', borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                                        <img src={item.imageUrl} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 600 }}>{item.name}</div>
                                        <div style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>{item.quantity} adet</div>
                                    </div>
                                </div>
                                <div>{item.price * item.quantity} TL</div>
                            </div>
                        ))}
                    </div>

                    <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem', marginTop: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span>Ara Toplam</span>
                            <span>{subtotal} TL</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <span>Kargo</span>
                            <span style={{ color: shippingTotal === 0 ? 'green' : 'inherit' }}>
                                {shippingTotal > 0 ? `${shippingTotal} TL` : 'Ücretsiz'}
                            </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 700 }}>
                            <span>Toplam</span>
                            <span>{total} TL</span>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
