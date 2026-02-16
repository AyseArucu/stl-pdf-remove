
import React from 'react';
import { getMostReviewed } from '@/lib/data';
import ProductCard from './ProductCard';
import Link from 'next/link';

export default async function MostReviewed() {
    const products = await getMostReviewed(5);

    if (products.length === 0) return null;

    return (
        <section className="container py-12 bg-indigo-50/50 rounded-3xl my-8">
            <div className="flex justify-between items-center mb-8 px-4">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-500 bg-clip-text text-transparent">
                    En Çok Değerlendirilenler
                </h2>
                <Link href="/search?sort=reviews" className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors">
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
