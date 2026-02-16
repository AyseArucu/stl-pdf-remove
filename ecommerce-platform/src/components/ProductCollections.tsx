'use client';

import { Product, Category, Order, Review } from '@prisma/client';
import ProductCollectionCard from './ProductCollectionCard';

type ReviewDTO = Omit<Review, 'createdAt'> & { createdAt: string | Date };

type Props = {
    products: Product[];
    categories: Category[];
    currentProductId: string;
    reviews?: ReviewDTO[];
    // We could pass orders if we had them to do "Frequently Bought Together"
};

export default function ProductCollections({ products, categories, currentProductId, reviews = [] }: Props) {
    const currentProduct = products.find(p => p.id === currentProductId);
    if (!currentProduct) return null;

    // Helper to get random integer
    const getRandomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

    // 1. High Rated Similar Products
    // Filter: Same category, High Rating (mocked if not enough real data, or > 4)
    const highRated = products.filter(p =>
        p.id !== currentProductId &&
        p.categoryId === currentProduct.categoryId &&
        (p.rating || 0) >= 4
    ).slice(0, 10);

    // If not enough high rated, just fill with same category for visual demo
    const highRatedDisplay = highRated.length > 2 ? highRated : products.filter(p => p.categoryId === currentProduct.categoryId && p.id !== currentProductId).slice(0, 3);


    // 2. User Picks (Kullanıcı Seçimleri)
    // Global high rated or most favorited
    const userPicks = products
        .filter(p => p.id !== currentProductId)
        .sort((a, b) => (b.favoriteCount || 0) - (a.favoriteCount || 0))
        .slice(0, 10);


    // 3. Similar Color (Sevebileceğin Renkteki Benzer Ürünler)
    // Filter by color
    let similarColor = products.filter(p =>
        p.id !== currentProductId &&
        p.color && currentProduct.color &&
        p.color.toLowerCase() === currentProduct.color.toLowerCase()
    );
    // Fallback if no color match: same category
    if (similarColor.length < 3) {
        similarColor = products.filter(p => p.categoryId === currentProduct.categoryId && p.id !== currentProductId).slice(3, 13);
    }


    // 4. Frequently Bought Together (Birlikte Tercih Edilenler)
    // Mock logic: Same subcategory or random check
    const together = products.filter(p => p.id !== currentProductId).sort(() => 0.5 - Math.random()).slice(0, 10);


    return (
        <div className="collections-section">
            <h2 className="collections-title">
                İlgini Çekebilecek Koleksiyonlar
            </h2>

            <div className="collections-grid">
                <ProductCollectionCard
                    title="Yüksek Yıldızlı Benzer Ürünler"
                    products={highRatedDisplay}
                    totalCount={13}
                    viewCount={42}
                    url="/products?sort=rating"
                />

                <ProductCollectionCard
                    title="Kullanıcı Seçimleri"
                    products={userPicks}
                    totalCount={62}
                    viewCount={42}
                    url="/products?sort=favorites"
                />

                <ProductCollectionCard
                    title="Sevebileceğin Renkteki Benzer Ürünler"
                    products={similarColor}
                    totalCount={50}
                    viewCount={160}
                    url={currentProduct.color ? `/collections/renk-${currentProduct.color.toLowerCase()}` : '#'}
                />
            </div>
        </div>
    );
}
