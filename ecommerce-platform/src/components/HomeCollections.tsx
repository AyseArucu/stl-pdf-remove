'use client';

import { Product } from '@/lib/db';
import ProductCollectionCard from './ProductCollectionCard';

type Props = {
    highRated: Product[];
    userPicks: Product[];
    randomMix: Product[];
    totalProductCount: number;
};

export default function HomeCollections({ highRated, userPicks, randomMix, totalProductCount }: Props) {
    return (
        <div className="collections-section container" style={{ marginTop: '3rem', marginBottom: '3rem' }}>
            <h2 className="collections-title" style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#111827' }}>
                İlgini Çekebilecek Koleksiyonlar
            </h2>

            <div className="collections-grid" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '20px'
            }}>
                <ProductCollectionCard
                    title="Yüksek Yıldızlı Ürünler"
                    products={highRated}
                    totalCount={highRated.length}
                    viewCount={120}
                    url="/products?sort=rating"
                />

                <ProductCollectionCard
                    title="Kullanıcı Seçimleri"
                    products={userPicks}
                    totalCount={userPicks.length}
                    viewCount={350}
                    url="/products?sort=favorites"
                />

                <ProductCollectionCard
                    title="Sizin İçin Seçtiklerimiz"
                    products={randomMix}
                    totalCount={totalProductCount}
                    viewCount={85}
                    url="/products" // General store
                />
            </div>
        </div>
    );
}
