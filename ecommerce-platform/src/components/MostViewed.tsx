
import React from 'react';
import { getMostViewed } from '@/lib/data';
import ProductCard from './ProductCard';
import Link from 'next/link';

export default async function MostViewed() {
    const products = await getMostViewed(5);

    if (products.length === 0) return null;

    return (
        <section className="container py-12">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-teal-500 to-emerald-600 bg-clip-text text-transparent">
                    En Çok Görüntülenenler
                </h2>
                {/* Assuming search page will handle sort=views or similar if I implement it, or reuse search?sort=mostViewed */}
                {/* My search page implementation logic didn't explicitly include 'views' sort yet, I should add it or map it. */}
                {/* Implementation plan said getMostViewed. Search page has 'bestsellers', 'likes', 'rating', 'reviews', 'discount', 'newest'. */}
                {/* I'll use sort=views and update search page later if needed, or just link to search for now. */}
                {/* Let's stick to what I have or add sort=views support quickly. */}
                <Link href="/search?sort=views" className="text-sm font-medium text-teal-600 hover:text-teal-800 transition-colors">
                    Tümünü Gör
                </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product as any} />
                ))}
            </div>
        </section>
    );
}
