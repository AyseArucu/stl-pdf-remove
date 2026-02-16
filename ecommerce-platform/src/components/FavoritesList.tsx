'use client';

import { Product, Category } from '@prisma/client';
import { useFavorites } from '@/context/FavoritesContext';
import ProductCard from '@/components/ProductCard';

type ProductDTO = Omit<Product, 'createdAt'> & { createdAt: string | Date };

type Props = {
    products: (Product | ProductDTO)[];
    categories: Category[];
};

export default function FavoritesList({ products, categories }: Props) {
    const { favorites } = useFavorites();

    const favoriteProducts = products.filter(p => favorites.includes(p.id));

    if (favoriteProducts.length === 0) {
        return (
            <div className="empty-state" style={{ textAlign: 'center', padding: '4rem 0' }}>
                <p style={{ fontSize: '1.2rem', color: 'var(--text-light)', marginBottom: '1.5rem' }}>Favori listenizde henüz ürün yok.</p>
                <a href="/" className="btn">Alışverişe Başla</a>
            </div>
        );
    }

    return (
        <div className="product-grid">
            {favoriteProducts.map(product => (
                <ProductCard
                    key={product.id}
                    product={product}
                    categoryName={categories.find(c => c.id === product.categoryId)?.name}
                />
            ))}
        </div>
    );
}
