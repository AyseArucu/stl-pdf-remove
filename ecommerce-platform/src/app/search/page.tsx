
import { prisma } from '@/lib/prisma';
import { Product, Category } from '@/lib/db';
import ProductListing from '@/components/ProductListing';

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
    const resolvedSearchParams = await searchParams;
    const searchTerm = typeof resolvedSearchParams.search === 'string' ? resolvedSearchParams.search.toLowerCase() : '';
    const sort = typeof resolvedSearchParams.sort === 'string' ? resolvedSearchParams.sort : '';

    const categoriesRaw = await prisma.category.findMany({ where: { parentId: null } });

    // Build filter conditions
    const where: any = {
        isActive: true,
    };

    if (searchTerm) {
        where.OR = [
            { name: { contains: searchTerm } },
            { description: { contains: searchTerm } }
        ];
    }

    let orderBy: any = undefined;

    // Sorting Logic
    if (sort === 'bestsellers') {
        // Complex sort usually requires aggregation, but for search page simple listing, 
        // we might just fetch basics or use raw query if strictly needed. 
        // For now, simpler workaround or basic sort if acceptable.
        // Actually, let's try to do it right.
        /* 
           Sorting by relation count or sum is tricky in standard Prisma `findMany` without aggregation.
           Refining approach: Fetch IDs from aggregation then fetch products. (Like in data.ts)
        */
        const topSellingItems = await prisma.orderItem.groupBy({
            by: ['productId'],
            _sum: { quantity: true },
            orderBy: { _sum: { quantity: 'desc' } },
            take: 100 // Reasonable limit for sorted search
        });
        const ids = topSellingItems.map(i => i.productId).filter((id): id is string => id !== null);
        if (ids.length > 0) where.id = { in: ids };
    } else if (sort === 'likes') {
        const topLiked = await prisma.favorite.groupBy({
            by: ['productId'],
            _count: { productId: true },
            orderBy: { _count: { productId: 'desc' } },
            take: 100
        });
        const ids = topLiked.map(i => i.productId).filter((id): id is string => id !== null);
        if (ids.length > 0) where.id = { in: ids };
    } else if (sort === 'rating') {
        const topRated = await prisma.review.groupBy({
            by: ['productId'],
            _avg: { rating: true },
            orderBy: { _avg: { rating: 'desc' } },
            take: 100
        });
        const ids = topRated.map(i => i.productId).filter((id): id is string => id !== null);
        if (ids.length > 0) where.id = { in: ids };
    } else if (sort === 'reviews') {
        const topReviewed = await prisma.review.groupBy({
            by: ['productId'],
            _count: { productId: true },
            orderBy: { _count: { productId: 'desc' } },
            take: 100
        });
        const ids = topReviewed.map(i => i.productId).filter((id): id is string => id !== null);
        if (ids.length > 0) where.id = { in: ids };
    } else if (sort === 'newest') {
        orderBy = { createdAt: 'desc' };
    } else if (sort === 'price_asc') {
        orderBy = { price: 'asc' };
    } else if (sort === 'price_desc') {
        orderBy = { price: 'desc' };
    } else if (sort === 'discount') {
        // Discount sort is hard in SQL/Prisma without calculated field. 
        // Fetching where salePrice is valid and doing in-memory sort or just simple filter.
        where.salePrice = { not: null };
    } else if (sort === 'views' || sort === 'mostViewed') {
        orderBy = { viewCount: 'desc' };
    }

    const productsRaw = await prisma.product.findMany({
        where,
        orderBy,
        include: {
            media: true,
            options: true,
            features: true,
        },
        take: 100 // Safety limit
    });

    let products = productsRaw.map((p: any) => ({
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

    // Post-query sorting for complex cases if IDs weren't used to filter exact order
    // (Prisma `in` filter does NOT guarantee order, so we must re-sort in memory)
    if (sort === 'bestsellers') {
        const topSellingItems = await prisma.orderItem.groupBy({
            by: ['productId'],
            _sum: { quantity: true },
        });
        const map = new Map(topSellingItems.map(i => [i.productId, i._sum.quantity || 0]));
        products.sort((a, b) => (map.get(b.id) || 0) - (map.get(a.id) || 0));
    } else if (sort === 'likes') {
        const topLiked = await prisma.favorite.groupBy({
            by: ['productId'],
            _count: { productId: true },
        });
        const map = new Map(topLiked.map(i => [i.productId, i._count.productId || 0]));
        products.sort((a, b) => (map.get(b.id) || 0) - (map.get(a.id) || 0));
    } else if (sort === 'rating') {
        const topRated = await prisma.review.groupBy({
            by: ['productId'],
            _avg: { rating: true },
        });
        const map = new Map(topRated.map(i => [i.productId, i._avg.rating || 0]));
        products.sort((a, b) => (map.get(b.id) || 0) - (map.get(a.id) || 0));
    } else if (sort === 'discount') {
        // Strict filter: only show products where salePrice exists AND is lower than normal price
        products = products.filter(p => p.salePrice !== null && p.salePrice < p.price);

        products.sort((a, b) => {
            const discountA = a.salePrice ? ((a.price - a.salePrice) / a.price) : 0;
            const discountB = b.salePrice ? ((b.price - b.salePrice) / b.price) : 0;
            return discountB - discountA;
        });
    } else if (sort === 'views' || sort === 'mostViewed') {
        // Sort using memory properties if available, or fetch again. 
        // Since product mapping above doesn't explicitly include 'viewCount' (legacy mapper), 
        // we might need to add it to the map first or use Prisma to sort.
        // Prisma findMany already has `orderBy` option used for 'newest'. 
        // Let's optimize: if sort is views, use database sort!
    }


    const categories: Category[] = categoriesRaw.map(c => ({
        id: c.id,
        name: c.name,
        parentId: c.parentId || null
    }));

    // Titles based on sort
    let pageTitle = 'Arama Sonuçları';
    if (sort === 'bestsellers') pageTitle = 'En Çok Satanlar';
    if (sort === 'likes') pageTitle = 'En Çok Beğenilenler';
    if (sort === 'newest') pageTitle = 'En Yeniler';
    if (sort === 'rating') pageTitle = 'En Yüksek Puanlılar';
    if (sort === 'reviews') pageTitle = 'En Çok Değerlendirilenler';
    if (sort === 'discount') pageTitle = 'Fırsat Ürünleri';

    return (
        <div className="container py-8">
            <h1 className="text-2xl font-bold mb-6">{pageTitle} {searchTerm && `- "${searchTerm}"`}</h1>
            <ProductListing products={products} categories={categories} />
        </div>
    );
}
