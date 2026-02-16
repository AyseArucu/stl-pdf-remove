'use client';

import { Category, Product } from '@prisma/client';
import ProductCard from './ProductCard';

type ProductDTO = Omit<Product, 'createdAt'> & { createdAt: string | Date };

type Props = {
    products: (Product | ProductDTO)[];
    categories: Category[];
    currentProductId: string;
};

export default function SimilarProducts({ products, categories, currentProductId }: Props) {
    // If products are passed pre-filtered, use them. 
    // Otherwise fallback to filtering (though parent should handle exclusion now)

    // Check if we need to filter or if 'products' is already the target list.
    // To be safe and support both, we can just slice if it's too long, but let's assume parent sends the right list.

    // However, the prop name is 'products'. If parent passes ALL products, this breaks.
    // Let's assume parent will pass the filtered list.
    // But we still need to filter out currentProductId just in case parent passed all.

    // WAIT: To support the new logic, let's just make this component dumb.
    // It renders what it gets. But we should double check we don't render currentProduct.

    const similar = products.filter(p => p.id !== currentProductId).slice(0, 4);

    if (similar.length === 0) return null;

    return (
        <div className="similar-products-container">
            <h2 className="section-title">Benzer Ürünler</h2>
            <div className="product-grid">
                {similar.map(product => (
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
