import { prisma } from '@/lib/prisma';
import { Product, Category } from '@/lib/db';
import FavoritesList from '@/components/FavoritesList';


export const metadata = {
    title: 'Favorilerim'
};

export default async function FavoritesPage() {
    const categoriesRaw = await prisma.category.findMany();
    const productsRaw = await prisma.product.findMany({
        where: { isActive: true },
        include: {
            media: true,
            options: true,
            features: true,
        }
    });

    const categories: Category[] = categoriesRaw.map(c => ({
        id: c.id,
        name: c.name,
        parentId: c.parentId || null
    }));

    const products: Product[] = productsRaw.map((p: any) => ({
        ...p,
        categoryId: p.categoryId,
        subcategoryIds: [],
        createdAt: p.createdAt.toISOString(),
        media: p.media.map((m: any) => ({
            type: m.type as 'image' | 'video',
            url: m.url,
            thumbnail: m.thumbnail || undefined
        }))
    }));

    const productsFixed: any = products; // Cast to avoid transient type error while refactoring downstream

    return (
        <div className="container" style={{ padding: '2rem 1rem' }}>
            <h1 className="title" style={{ marginBottom: '2rem' }}>Favorilerim</h1>
            <FavoritesList products={productsFixed} categories={categories} />
        </div>
    );
}
