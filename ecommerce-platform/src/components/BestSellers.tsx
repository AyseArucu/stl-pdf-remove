
import React from 'react';
import { getBestSellers } from '@/lib/data';
import ProductCard from './ProductCard';
import Link from 'next/link';

export default async function BestSellers() {
    const products = await getBestSellers(5);

    if (products.length === 0) return null;

    return (
        <section className="container py-12">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    En Çok Satanlar
                </h2>
                <Link href="/search?sort=bestsellers" className="text-sm font-medium text-purple-600 hover:text-purple-800 transition-colors">
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
