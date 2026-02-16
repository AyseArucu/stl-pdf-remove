
import React from 'react';
import { getNewest } from '@/lib/data';
import ProductCard from './ProductCard';
import Link from 'next/link';

export default async function NewestArrivals() {
    const products = await getNewest(5);

    if (products.length === 0) return null;

    return (
        <section className="container py-12">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                    Yeni Eklenenler
                </h2>
                <Link href="/search?sort=newest" className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors">
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
