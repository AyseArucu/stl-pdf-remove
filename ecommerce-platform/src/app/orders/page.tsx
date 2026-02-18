import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getUserOrders, getSuggestedProducts } from '@/app/actions';

export default async function OrdersPage() {
    // Get user session
    const cookieStore = await cookies();
    const sessionConfig = cookieStore.get('user_session');

    if (!sessionConfig?.value) {
        redirect('/login');
    }

    const user = JSON.parse(sessionConfig.value);
    const orders = await getUserOrders(user.id);
    const suggestedProducts = await getSuggestedProducts(8);

    // Filter orders
    const activeOrders = orders.filter(o => ['Hazırlanıyor', 'Kargolandı', 'Pending'].includes(o.status));
    const pastOrders = orders.filter(o => !['Hazırlanıyor', 'Kargolandı', 'Pending'].includes(o.status));

    const renderOrderCard = (order: any) => (
        <div key={order.id} className="order-card">
            <div className="order-header">
                <div>
                    <div className="order-number">Sipariş #{order.id}</div>
                    <div className="order-date">
                        {new Date(order.date).toLocaleDateString('tr-TR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    </div>
                </div>
                <div className={`status-badge ${order.status === 'Hazırlanıyor' ? 'status-pending' :
                    order.status === 'Kargolandı' ? 'status-shipped' :
                        order.status === 'Teslim Edildi' ? 'status-paid' :
                            'status-cancelled'
                    }`}>
                    {order.status}
                </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
                {order.items.map((item: any, idx: number) => (
                    <Link href={`/product/${item.productId}`} key={idx} style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', textDecoration: 'none', color: 'inherit', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem' }}>
                        <div style={{ width: '60px', height: '60px', position: 'relative', borderRadius: '4px', overflow: 'hidden', border: '1px solid #e5e7eb' }}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={item.product?.imageUrl || 'https://via.placeholder.com/60'}
                                alt={item.productName}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 500 }}>{item.productName}</div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>
                                {item.quantity} adet x {item.price} TL
                            </div>
                        </div>
                        <div style={{ fontWeight: 600, alignSelf: 'center' }}>
                            {item.price * item.quantity} TL
                        </div>
                    </Link>
                ))}
            </div>

            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>
                    Ödeme: {order.paymentMethod === 'CREDIT_CARD' ? 'Kredi Kartı' :
                        order.paymentMethod === 'BANK_TRANSFER' ? 'Havale/EFT' : 'Kapıda Ödeme'}
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary)' }}>
                    Toplam: {order.total} TL
                </div>
            </div>
        </div>
    );

    return (
        <div className="container" style={{ padding: '4rem 2rem', minHeight: '80vh' }}>
            <div className="profile-header">
                <div>
                    <h1 className="title">Siparişlerim</h1>
                    <p style={{ color: 'var(--text-light)', marginTop: '0.5rem' }}>
                        Geçmiş siparişlerinizi buradan görüntüleyebilirsiniz.
                    </p>
                </div>
                <Link href="/account" className="btn" style={{ backgroundColor: 'white', color: 'var(--primary)', border: '1px solid var(--primary)' }}>
                    Hesabıma Dön
                </Link>
            </div>

            <div className="profile-layout">
                {/* Sidebar Menu */}
                <div className="profile-menu">
                    <Link href="/account" className="profile-link">
                        Profil Bilgileri
                    </Link>
                    <Link href="/orders" className="profile-link active">
                        Siparişlerim
                    </Link>
                    <Link href="/" className="profile-link">
                        Alışverişe Başla
                    </Link>
                </div>

                {/* Content */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>

                    {/* Active Orders */}
                    <div>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', borderBottom: '2px solid #f1f5f9', paddingBottom: '0.5rem' }}>Aktif Siparişler</h2>
                        {activeOrders.length === 0 ? (
                            <p style={{ color: 'var(--text-light)', fontStyle: 'italic' }}>Aktif siparişiniz bulunmamaktadır.</p>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                {activeOrders.map(renderOrderCard)}
                            </div>
                        )}
                    </div>

                    {/* Past Orders */}
                    <div>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', borderBottom: '2px solid #f1f5f9', paddingBottom: '0.5rem' }}>Geçmiş Siparişler</h2>
                        {pastOrders.length === 0 ? (
                            <p style={{ color: 'var(--text-light)', fontStyle: 'italic' }}>Geçmiş siparişiniz bulunmamaktadır.</p>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                {pastOrders.map(renderOrderCard)}
                            </div>
                        )}
                    </div>

                    {/* Suggested Products */}
                    <div style={{ marginTop: '2rem' }}>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', borderBottom: '2px solid #f1f5f9', paddingBottom: '0.5rem' }}>Sizin İçin Seçtiklerimiz</h2>
                        <div className="grid">
                            {suggestedProducts.map((product) => (
                                <Link href={`/product/${product.id}`} key={product.id} className="product-card" style={{ textDecoration: 'none', color: 'inherit', maxWidth: 'none', margin: 0 }}>
                                    <div style={{ position: 'relative', aspectRatio: '1/1', overflow: 'hidden', borderRadius: '8px', marginBottom: '1rem' }}>
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={product.imageUrl}
                                            alt={product.name}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }}
                                        />
                                    </div>
                                    <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{product.name}</h3>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{product.price} TL</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
