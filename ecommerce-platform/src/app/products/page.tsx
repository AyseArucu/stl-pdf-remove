import { prisma } from '@/lib/prisma';
import ProductListing from '@/components/ProductListing';
import { Product, Category } from '@/lib/db';

export const metadata = {
    title: 'Tüm Ürünler | E-Ticaret',
    description: 'En yeni ve en popüler ürünlerimizi keşfedin.',
};

export default async function ProductsPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
    const searchTerm = typeof searchParams.search === 'string' ? searchParams.search.toLowerCase() : '';

    const categories = await prisma.category.findMany();

    // Build filter conditions
    const where: any = {
        isActive: true,
    };

    if (searchTerm) {
        where.OR = [
            { name: { contains: searchTerm } }, // SQLite is case-sensitive by default usually, but we can verify. OR use contains
            { description: { contains: searchTerm } }
        ];
    }

    const products = await prisma.product.findMany({
        where,
        include: {
            media: true,
            options: true,
            features: true,
        }
    });

    // Map Prisma result to match legacy types if necessary, mostly dealing with Date vs String and optional fields
    const mappedProducts = products.map(p => ({
        ...p,
        categoryId: p.categoryId,
        subcategoryIds: [], // Schema doesn't have subcategoryIds array, logic logic handles it via category.parentId likely? Or we missed this field in schema?
        // Wait, schema has categoryId. db.ts has subcategoryIds[]?
        // In schema: category is a single relation.
        // In data.json: subcategoryIds exists.
        // We ignored subcategoryIds in schema Product model? 
        // Let's check schema again. Product has categoryId.
        // data.json has subcategoryIds. The seed script used subcategoryIds[0] as categoryId.
        // So for now, we can pass empty array or try to reconstruct it if needed. 
        // For ProductListing filtering, it uses filters.categoryIds.includes(product.categoryId). 
        // So single categoryId is enough for basic filtering.
        createdAt: p.createdAt.toISOString(),
        media: p.media.map(m => ({
            type: m.type as 'image' | 'video',
            url: m.url,
            thumbnail: m.thumbnail || undefined
        }))
    }));

    // Re-map categories to legacy type (mostly ensuring partial compatibility)
    const mappedCategories: Category[] = categories.map(c => ({
        id: c.id,
        name: c.name,
        parentId: c.parentId || null
    }));

    return (
        <div className="container" style={{ marginTop: '2rem' }}>
            <ProductListing products={mappedProducts} categories={mappedCategories} />
        </div>
    );
}
