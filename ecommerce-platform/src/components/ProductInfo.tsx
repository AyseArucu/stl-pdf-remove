'use client';

import { Product, ProductOption, ProductFeature } from '@/lib/db';
import AddToCartButton from './AddToCartButton';
import { useState } from 'react';
import { useFavorites } from '@/context/FavoritesContext';
import { useRouter } from 'next/navigation';
import { useCart } from './CartContext';
import { useUser } from '@/context/UserContext';

type Props = {
    product: Product & {
        options?: ProductOption[];
        features?: ProductFeature[];
    };
    reviewCount: number;
    averageRating: number;
    categoryName?: string;
};

export default function ProductInfo({ product, reviewCount, averageRating, categoryName }: Props) {
    const router = useRouter();
    const { addToCart, discount } = useCart();
    const { user } = useUser();

    // Size selection removed as per request
    const [selectedOptionIndices, setSelectedOptionIndices] = useState<Set<number>>(new Set());

    const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites();
    const favorited = isFavorite(product.id);

    const toggleFavorite = async () => {
        if (!user) {
            router.push('/login');
            return;
        }

        const newStatus = !favorited;
        if (newStatus) {
            addToFavorites(product.id);
        } else {
            removeFromFavorites(product.id);
        }
        const { toggleProductFavorite } = await import('@/app/actions');
        await toggleProductFavorite(product.id, newStatus);
    };

    const toggleOption = (index: number) => {
        const newSet = new Set(selectedOptionIndices);
        if (newSet.has(index)) {
            newSet.delete(index);
        } else {
            newSet.add(index);
        }
        setSelectedOptionIndices(newSet);
    };

    // Price Calculation
    // Logic update: If we have a generic cart discount (e.g. 20%), should it apply to visual price here?
    // Usually "Sepette %20" means it applies at cart.
    // The previous code had "product.salePrice" which is separate from Cart Discount.
    // product.salePrice is a specific product discount.
    // The "campaign-item" badge saying "Sepette %20 İndirim" was static.
    // We should make THAT badge dynamic.

    const effectiveBasePrice = product.salePrice && product.salePrice < product.price ? product.salePrice : product.price;
    const optionsPrice = Array.from(selectedOptionIndices).reduce((acc, idx) => acc + (product.options?.[idx]?.price || 0), 0);
    const totalPrice = effectiveBasePrice + optionsPrice;

    const isOutOfStock = product.stock <= 0;

    // Derived product for cart
    const productForCart = {
        ...product,
        price: totalPrice,
        name: selectedOptionIndices.size > 0
            ? `${product.name} (${Array.from(selectedOptionIndices).map(i => product.options![i].name).join(', ')})`
            : product.name,
    };

    const handleBuyNow = () => {
        addToCart(productForCart);
        router.push('/checkout');
    };

    // Color Handling
    // Color Handling
    const colorName = product.color;
    // const colorHex = null; // Removed as hex is no longer supported in string-only mode

    return (
        <div className="product-info-container">
            <div className="product-header-group">
                <h1 className="pdp-title">
                    <span className="pdp-brand">{categoryName || 'Marka'}</span>
                    {product.name}
                </h1>
                <div className="pdp-rating">
                    <div className="stars">
                        {[1, 2, 3, 4, 5].map(s => (
                            <span key={s} style={{ color: s <= Math.round(averageRating) ? '#fcc200' : '#ddd' }}>★</span>
                        ))}
                    </div>
                    <span className="rating-text">{averageRating > 0 ? averageRating.toFixed(1) : 'Yeni'} ({reviewCount} Değerlendirme)</span>
                </div>
            </div>

            <div className="pdp-price-card">
                <div className="pdp-price">
                    {/* Show Base Price Strikethrough if Product Specific Discount */}
                    {product.salePrice && product.salePrice < product.price && (
                        <span style={{ textDecoration: 'line-through', color: '#999', fontSize: '1.2rem', marginRight: '1rem' }}>
                            {product.price.toLocaleString('tr-TR')} TL
                        </span>
                    )}

                    {/* Final Price (unit) */}
                    <span style={{ color: product.salePrice ? '#ef4444' : 'inherit' }}>
                        {totalPrice.toLocaleString('tr-TR')} TL
                    </span>

                    {/* Product Specific Discount Badge */}
                    {product.salePrice && product.salePrice < product.price && (
                        <span style={{
                            marginLeft: '1rem',
                            background: '#ef4444',
                            color: 'white',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '0.9rem',
                            fontWeight: 'bold',
                            verticalAlign: 'middle'
                        }}>
                            %{Math.round(((product.price - product.salePrice) / product.price) * 100)} İndirim
                        </span>
                    )}
                </div>
                <div className="pdp-cargo-badge">
                    <span>KARGO BEDAVA</span>
                </div>
                {isOutOfStock && (
                    <div style={{ marginTop: '0.5rem', color: '#ef4444', fontWeight: 'bold' }}>
                        STOKTA YOK
                    </div>
                )}
            </div>

            {/* Dynamic Options */}
            {product.options && product.options.length > 0 && (
                <div className="pdp-variants" style={{ marginTop: '1rem', borderTop: '1px solid #eee', paddingTop: '1rem' }}>
                    <span className="variant-label" style={{ display: 'block', marginBottom: '0.5rem' }}>Ekstra Seçenekler:</span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {product.options.map((option, idx) => (
                            <label key={idx} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '0.5rem' }}>
                                <input
                                    type="checkbox"
                                    checked={selectedOptionIndices.has(idx)}
                                    onChange={() => toggleOption(idx)}
                                    style={{ width: '1.1rem', height: '1.1rem' }}
                                />
                                <span>{option.name}</span>
                                <span style={{ color: '#666', fontSize: '0.9rem' }}>(+{option.price} TL)</span>
                            </label>
                        ))}
                    </div>
                </div>
            )}



            {/* Favorite Count Display */}
            <div style={{ marginBottom: '1rem', color: '#666', fontSize: '0.9rem' }}>
                {product.favoriteCount ? `${product.favoriteCount} kişi bu ürünü favoriledi` : ''}
            </div>

            <div className="pdp-actions" style={{ display: 'flex', gap: '1rem', alignItems: 'stretch' }}>
                {/* Add To Cart - now styled to match Buy Now */}
                <div style={{ flex: 1 }}>
                    <AddToCartButton
                        product={productForCart}
                        disabled={isOutOfStock}
                        label={isOutOfStock ? 'Stok Tükendi' : 'Sepete Ekle'}
                        style={{
                            width: '100%',
                            height: '50px',
                            backgroundColor: isOutOfStock ? '#ccc' : '#65216e',
                            color: 'white',
                            borderRadius: '8px',
                            fontSize: '1rem',
                            fontWeight: '600'
                        }}
                    />
                </div>

                {!isOutOfStock && (
                    <button
                        onClick={handleBuyNow}
                        className="btn"
                        style={{
                            flex: 1,
                            height: '50px',
                            backgroundColor: '#65216e', // Requested Color
                            color: 'white',
                            borderRadius: '8px',
                            fontSize: '1rem',
                            fontWeight: '600',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        Şimdi Al
                    </button>
                )}

                {/* Favorite Button (Icon only) */}
                <div className="pdp-favorite-btn-large">
                    <button
                        className={`btn-fav ${favorited ? 'active' : ''}`}
                        onClick={toggleFavorite}
                        style={{
                            color: favorited ? '#65216e' : '#999',
                            borderColor: favorited ? '#65216e' : '#e2e8f0',
                            height: '50px',
                            width: '50px',
                            borderRadius: '8px',
                            border: '1px solid',
                            background: 'white',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.5rem'
                        }}
                    >
                        <span className="heart-icon">{favorited ? '♥' : '♡'}</span>
                    </button>
                </div>
            </div>

            <div className="pdp-campaigns">
                {discount && discount.isActive && (
                    <div className="campaign-item">
                        <span className="icon">🏷️</span>
                        <span>{discount.name} (%{discount.percentage} İndirim)</span>
                    </div>
                )}
                <div className="campaign-item">
                    <span className="icon">🚚</span>
                    <span>Hızlı Teslimat</span>
                </div>
            </div>

            {/* Product description */}
            {product.description && (
                <div className="product-description" style={{ marginTop: '2rem', borderTop: '1px solid #e2e8f0', paddingTop: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.75rem', color: '#1e293b' }}>Ürün Açıklaması</h3>
                    <p style={{ color: '#555', lineHeight: '1.6', fontSize: '0.95rem' }}>
                        {product.description}
                    </p>
                </div>
            )}

            {/* Product Features */}
            {product.features && product.features.length > 0 && (
                <div className="product-features" style={{ marginTop: '2rem', borderTop: '1px solid #e2e8f0', paddingTop: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1e293b' }}>Ürün Özellikleri</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                        {product.features.map((feature, idx) => (
                            <div key={idx} style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
                                <span style={{ display: 'block', fontWeight: '600', fontSize: '0.9rem', color: '#475569', marginBottom: '0.25rem' }}>{feature.title}</span>
                                <span style={{ display: 'block', color: '#1e293b', fontSize: '0.95rem' }}>{feature.description}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
