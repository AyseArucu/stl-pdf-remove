
import React from 'react';
import { getTopDiscounts } from '@/lib/data';
import ProductCard from './ProductCard';
import Link from 'next/link';

export default async function TopDiscounts() {
    const products = await getTopDiscounts(5);

    if (products.length === 0) return null;

    return (
        <section className="container py-12 bg-red-50/50 rounded-3xl my-8">
            <div className="flex justify-between items-center mb-8 px-4">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent">
                    Fırsat Ürünleri
                </h2>
                <Link href="/search?sort=discount" className="text-sm font-medium text-red-600 hover:text-red-800 transition-colors">
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
