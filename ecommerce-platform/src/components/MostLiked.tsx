
import React from 'react';
import { getMostLiked } from '@/lib/data';
import ProductCard from './ProductCard';
import Link from 'next/link';

export default async function MostLiked() {
    const products = await getMostLiked(5);

    if (products.length === 0) return null;

    return (
        <section className="container py-12 bg-gray-50/50 rounded-3xl my-8">
            <div className="flex justify-between items-center mb-8 px-4">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-red-500 bg-clip-text text-transparent">
                    En Çok Beğenilenler
                </h2>
                <Link href="/search?sort=likes" className="text-sm font-medium text-pink-600 hover:text-pink-800 transition-colors">
                    Tümünü Gör
                </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 px-4">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product as any} />
                ))}
            </div>
        </section>
    );
}
