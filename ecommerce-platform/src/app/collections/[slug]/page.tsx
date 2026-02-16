import { prisma } from '@/lib/prisma';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Product, Collection } from '@prisma/client';

interface PageProps {
    params: {
        slug: string;
    }
}

export default async function CollectionPage({ params }: PageProps) {
    const slug = params.slug.toLowerCase();

    // Define a unified Collection type for UI
    type UICollection = {
        title: string;
        description?: string | null;
        products: Product[];
    };

    let collection: UICollection | undefined;

    // 1. Check for Virtual Collections
    if (slug === 'yuksek-yildizli') {
        const products = await prisma.product.findMany({
            where: {
                rating: { gte: 4 },
                isActive: true
            },
            include: { category: true }
        });
        collection = {
            title: 'Yüksek Yıldızlı Ürünler',
            description: 'Kullanıcılarımızdan tam not almış, en beğenilen ürünler.',
            products
        };
    } else if (slug === 'kullanici-secimleri') {
        const products = await prisma.product.findMany({
            where: { isActive: true },
            orderBy: { favoriteCount: 'desc' },
            take: 50,
            include: { category: true }
        });
        collection = {
            title: 'Kullanıcı Seçimleri',
            description: 'Topluluğumuzun favori listelerine en çok eklediği ürünler.',
            products
        };
    } else if (slug.startsWith('renk-')) {
        const colorName = slug.replace('renk-', '');
        // Helper to capitalize first letter
        const colorTitle = colorName.charAt(0).toUpperCase() + colorName.slice(1);

        const products = await prisma.product.findMany({
            where: {
                // Note: This matches exactly. If color needs fuzzy match, use contains.
                // Assuming color data is normalized or consistent.
                color: colorName,
                isActive: true
            },
            include: { category: true }
        });

        collection = {
            title: `${colorTitle} Renkli Ürünler`,
            description: `${colorTitle} sevenler için seçtiğimiz özel parçalar.`,
            products
        };
    } else {
        // 2. Check for DB Collections
        // We need to fetch the collection AND its products.
        // Prisma schema: products Product[] @relation("CollectionProducts")
        const dbCollection = await prisma.collection.findUnique({
            where: { slug },
            include: {
                products: {
                    where: { isActive: true },
                    include: { category: true }
                }
            }
        });

        if (dbCollection && dbCollection.isActive) {
            collection = {
                title: dbCollection.title,
                description: dbCollection.description,
                products: dbCollection.products
            };
        }
    }

    if (!collection) {
        notFound();
    }

    const collectionProducts = collection.products || [];

    // Helper to get category name - simplified for now or fetch if needed
    // Fetching categories for lookup might be expensive if many products.
    // Optimal: Include category in product query.
    // Let's refactor queries to include category if possible.
    // But ProductCard might handle it or we can just pass categoryName if included.
    // For now, let's include category in queries above.
    // Re-writing queries to include category.

    return (
        <div className="page-wrapper">
            <div className="container mx-auto px-4 py-8">
                {/* Breadcrumb */}
                <div className="text-sm breadcrumbs mb-6 text-gray-500">
                    <Link href="/" className="hover:text-primary transition-colors">Ana Sayfa</Link>
                    <span className="mx-2">/</span>
                    <span className="text-gray-900 font-medium">{collection.title}</span>
                </div>

                {/* Collection Header */}
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold mb-4">{collection.title}</h1>
                    {collection.description && (
                        <p className="text-gray-600 max-w-2xl mx-auto">{collection.description}</p>
                    )}
                </div>

                {/* Product Grid */}
                {collectionProducts.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        Bu koleksiyonda henüz ürün bulunmuyor.
                    </div>
                ) : (
                    <div className="product-grid" style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                        gap: '24px'
                    }}>
                        {collectionProducts.map(product => (
                            <ProductCard
                                key={product.id}
                                product={product as any} // Cast to match expected type if strictly typed
                                categoryName={(product as any).category?.name}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
