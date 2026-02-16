'use client';

import { Product, Category } from '@/lib/db';
import ProductCard from './ProductCard';
import { useUser } from '@/context/UserContext';
import { useEffect, useState } from 'react';

type Props = {
    products: Product[];
    categories: Category[];
};

export default function HomeRecommended({ products, categories }: Props) {
    const { user } = useUser();
    const [displayProducts, setDisplayProducts] = useState<Product[]>([]);

    useEffect(() => {
        // Shuffle products to show variety on homepage
        const activeProducts = products.filter(p => p.isActive !== false);
        const shuffled = [...activeProducts].sort(() => 0.5 - Math.random());
        setDisplayProducts(shuffled.slice(0, 5));
    }, [products]);

    if (displayProducts.length === 0) return null;

    const displayTitle = user?.name
        ? `${user.name}, Sana Özel Ürünler`
        : "Sizin İçin Seçtiklerimiz";

    return (
        <div className="container" style={{ marginTop: '3rem', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#111827' }}>
                {displayTitle}
            </h2>

            <div className="product-grid" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                gap: '20px'
            }}>
                {displayProducts.map(product => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        categoryName={categories.find(c => c.id === product.categoryId)?.name}
                    />
                ))}
            </div>
        </div>
    );
}
