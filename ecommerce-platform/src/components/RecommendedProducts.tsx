'use client';

import { Product, Category } from '@prisma/client';
import ProductCard from './ProductCard';
import { useUser } from '@/context/UserContext';

type ProductDTO = Omit<Product, 'createdAt'> & { createdAt: string | Date };

type Props = {
    currentProductId: string;
    categoryId: string;
    products: (Product | ProductDTO)[];
    categories?: Category[]; // Added categories to look up names
    title?: string;
};

export default function RecommendedProducts({ currentProductId, categoryId, products, categories = [], title = "Önerilen Ürünler" }: Props) {
    const { user } = useUser();

    // Logic: Filter products by category, exclude current
    // In a real app, this might be "Personalized" based on user history.
    // Here we will mix same category + some random high rated products to mimic "For You"

    const displayTitle = user?.name ? `${user.name}, Sana Özel Ürünler` : title;

    // 1. Same category products
    const sameCategory = products.filter(p => p.categoryId === categoryId && p.id !== currentProductId && p.isActive !== false);

    // 2. Other high rated products (random fillers)
    const others = products.filter(p => p.categoryId !== categoryId && p.id !== currentProductId && p.isActive !== false && (p.rating || 0) >= 4);

    // Combine: prioritized same category, then others. Limit to 5 (or 4 depending on grid)
    // The screenshot shows 5 items in a row (carousel-like) or grid. Let's do 5.
    const recommendations = [...sameCategory, ...others].slice(0, 5);

    if (recommendations.length === 0) return null;

    return (
        <div style={{ marginTop: '3rem', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#111827' }}>
                {displayTitle}
            </h2>

            <div className="product-grid" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                gap: '20px'
            }}>
                {recommendations.map(product => (
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
