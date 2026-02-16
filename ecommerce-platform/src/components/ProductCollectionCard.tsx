'use client';

import { Product } from '@/lib/db';
import Link from 'next/link';

type Props = {
    title: string;
    products: Product[];
    totalCount: number;
    viewCount?: number;
    url?: string;
};

export default function ProductCollectionCard({ title, products, totalCount, viewCount, url = '#' }: Props) {
    // Take first 3 products for the preview
    const previewProducts = products.slice(0, 3);

    return (
        <div className="collection-card">
            <h3 className="collection-card-title">
                {title}
            </h3>

            <div className="collection-preview-images">
                {previewProducts.map((product) => (
                    <div key={product.id} className="collection-preview-image-wrapper">
                        <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="collection-preview-image"
                        />
                    </div>
                ))}
            </div>

            <div className="collection-metrics">
                <div className="collection-metrics-left">
                    <span>{totalCount} Ürün</span>
                    {viewCount && <span>• {viewCount} 👁</span>}
                </div>
            </div>

            <Link href={url} className="collection-link-btn">
                Koleksiyona Git
            </Link>
        </div>
    );
}
