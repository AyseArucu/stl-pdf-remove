'use client';

import Link from 'next/link';
import AddToCartButton from './AddToCartButton';
import { useFavorites } from '@/context/FavoritesContext';
import { Product } from '@prisma/client';
import { useUser } from '@/context/UserContext';
import { useRouter } from 'next/navigation';

type ProductDTO = Omit<Product, 'createdAt'> & { createdAt: string | Date };

interface ProductCardProps {
    product: Product | ProductDTO;
    categoryName?: string;
}

export default function ProductCard({ product, categoryName }: ProductCardProps) {
    const isOutOfStock = product.stock <= 0;
    const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites();
    const { user } = useUser();
    const router = useRouter();
    const favorited = isFavorite(product.id);

    // Mock rating for visual check
    const rating = product.rating || 0; // Default to 0 if no rating set yet

    const toggleFavorite = async (e: React.MouseEvent) => {
        e.preventDefault();

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
        // Optimistic update handled by context for local state, but action updates global count
        const { toggleProductFavorite } = await import('@/app/actions');
        await toggleProductFavorite(product.id, newStatus);
    };

    return (
        <div className="product-card group">
            <Link href={`/product/${product.id}`} className="product-card-link">
                <div className="product-image-container">
                    <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="product-image"
                    />
                    {isOutOfStock && (
                        <div className="stock-overlay">
                            Tükendi
                        </div>
                    )}
                    {/* Favorite Button */}
                    <button
                        className={`favorite-btn ${favorited ? 'active' : ''}`}
                        onClick={toggleFavorite}
                    >
                        <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill={favorited ? "#a855f7" : "none"}
                            stroke={favorited ? "#a855f7" : "currentColor"}
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                        </svg>
                    </button>

                    {/* Free Shipping Badge - Dynamic */}
                    {product.freeShipping && (
                        <div className="shipping-badge">
                            KARGO BEDAVA
                        </div>
                    )}

                    {/* Discount Badge */}
                    {product.salePrice && product.salePrice < product.price && (
                        <div className="discount-badge">
                            %{Math.round(((product.price - product.salePrice) / product.price) * 100)} İndirim
                        </div>
                    )}
                </div>

                <div className="product-info items-center text-center">
                    <div className="product-header">

                        <span className="product-title" title={product.name}>{product.name}</span>
                    </div>

                    <div className="product-rating">
                        <div className="stars justify-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <svg key={star} className={`star ${star <= Math.round(rating) ? 'filled' : ''}`} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                </svg>
                            ))}
                        </div>
                    </div>

                    {/* Favorite Count */}
                    <div className="favorite-count-text">
                        {product.favoriteCount ? `${product.favoriteCount} kişi favoriledi` : ''}
                    </div>

                    <div className="product-price-box justify-center">
                        {product.salePrice && product.salePrice < product.price ? (
                            <>
                                <div className="product-price old-price">
                                    {product.price.toLocaleString('tr-TR')} TL
                                </div>
                                <div className="product-price new-price">
                                    {product.salePrice.toLocaleString('tr-TR')} TL
                                </div>
                            </>
                        ) : (
                            <div className="product-price">{product.price.toLocaleString('tr-TR')} TL</div>
                        )}
                    </div>

                    {/* Add to cart - Centered and Horizontal */}
                    <div className="add-to-cart-container w-full flex justify-center mt-auto">
                        <AddToCartButton product={product} />
                    </div>
                </div>
            </Link>
        </div>
    );
}
