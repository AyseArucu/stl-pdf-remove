'use client';

import { useCart } from '@/components/CartContext';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function CartPage() {
    const { items, removeFromCart, clearCart, total, shippingTotal } = useCart();
    const [mounted, setMounted] = useState(false);

    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <main className="container">
            <header className="header" style={{ marginBottom: '2rem' }}>
                <h1 className="title">Sepetim</h1>
                <Link href="/" className="btn" style={{ backgroundColor: 'var(--secondary)' }}>
                    Alışverişe Dön
                </Link>
            </header>

            {items.length === 0 ? (
                <div className="empty-cart">
                    <p style={{ fontSize: '1.5rem', color: 'var(--text-light)', marginBottom: '1rem' }}>Sepetiniz boş.</p>
                    <Link href="/" className="btn">Mağazaya Git</Link>
                </div>
            ) : (
                <div className="cart-layout">
                    {/* Sol: Ürün Listesi */}
                    <div className="cart-items">
                        {items.map((item) => (
                            <div key={item.id} className="cart-item">
                                <img src={item.imageUrl} alt={item.name} className="cart-item-image" />
                                <div className="cart-item-info">
                                    <h3 className="cart-item-title">{item.name}</h3>
                                    <p className="cart-item-price">Birim Fiyat: {item.price} TL</p>
                                    <p className="cart-item-quantity">Adet: {item.quantity}</p>
                                </div>
                                <div className="cart-item-actions">
                                    <p className="cart-item-total">
                                        {item.price * item.quantity} TL
                                    </p>
                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        className="cart-remove-btn"
                                    >
                                        Kaldır
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Sağ: Özet ve Ödeme */}
                    <div style={{ height: 'fit-content' }}>
                        <div className="cart-summary">
                            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Sipariş Özeti</h2>

                            <div className="cart-summary-row">
                                <span>Ara Toplam</span>
                                <span>{subtotal} TL</span>
                            </div>
                            <div className="cart-summary-row">
                                <span>Kargo</span>
                                <span style={{ color: shippingTotal === 0 ? 'green' : 'inherit' }}>
                                    {shippingTotal > 0 ? `${shippingTotal} TL` : 'Ücretsiz'}
                                </span>
                            </div>
                            <div className="cart-summary-total">
                                <span>Genel Toplam</span>
                                <span style={{ color: 'var(--accent)' }}>{total} TL</span>
                            </div>

                            <Link
                                href="/checkout"
                                className="cart-checkout-btn"
                            >
                                Ödeme Yap
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
