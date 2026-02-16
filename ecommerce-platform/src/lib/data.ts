
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export type ProductWithDetails = Prisma.ProductGetPayload<{
    include: { media: true }
}>;

export async function getBestSellers(limit: number = 5): Promise<ProductWithDetails[]> {
    try {
        const topSellingItems = await prisma.orderItem.groupBy({
            by: ['productId'],
            _sum: { quantity: true },
            orderBy: { _sum: { quantity: 'desc' } },
            take: limit * 2, // Fetch more to account for nulls/inactive
        });

        const productIds = topSellingItems
            .map(item => item.productId)
            .filter((id): id is string => id !== null);

        if (productIds.length === 0) return [];

        const products = await prisma.product.findMany({
            where: {
                id: { in: productIds },
                isActive: true,
            },
            include: { media: true },
        });

        // Sort by sales quantity order
        const sortedProducts = productIds
            .map(id => products.find(p => p.id === id))
            .filter((p): p is ProductWithDetails => p !== undefined)
            .slice(0, limit);

        return sortedProducts;
    } catch (error) {
        console.error('Error fetching best sellers:', error);
        return [];
    }
}

export async function getMostLiked(limit: number = 5): Promise<ProductWithDetails[]> {
    try {
        const topLikedItems = await prisma.favorite.groupBy({
            by: ['productId'],
            _count: { productId: true },
            orderBy: { _count: { productId: 'desc' } },
            take: limit * 2,
        });

        const productIds = topLikedItems
            .map(item => item.productId)
            .filter((id): id is string => id !== null); // Should not be null but safe check

        if (productIds.length === 0) return [];

        const products = await prisma.product.findMany({
            where: {
                id: { in: productIds },
                isActive: true,
            },
            include: { media: true },
        });

        const sortedProducts = productIds
            .map(id => products.find(p => p.id === id))
            .filter((p): p is ProductWithDetails => p !== undefined)
            .slice(0, limit);

        return sortedProducts;
    } catch (error) {
        console.error('Error fetching most liked products:', error);
        return [];
    }
}

export async function getNewest(limit: number = 5): Promise<ProductWithDetails[]> {
    try {
        const products = await prisma.product.findMany({
            where: { isActive: true },
            orderBy: { createdAt: 'desc' },
            take: limit,
            include: { media: true },
        });

        return products;
    } catch (error) {
        console.error('Error fetching newest products:', error);
        return [];
    }
}

export async function getHighestRated(limit: number = 5): Promise<ProductWithDetails[]> {
    try {
        const topRatedProduts = await prisma.review.groupBy({
            by: ['productId'],
            _avg: { rating: true },
            orderBy: { _avg: { rating: 'desc' } },
            take: limit * 2
        });

        const productIds = topRatedProduts
            .map(item => item.productId)
            .filter((id): id is string => id !== null);

        if (productIds.length === 0) return [];

        const products = await prisma.product.findMany({
            where: {
                id: { in: productIds },
                isActive: true
            },
            include: { media: true }
        });

        const sortedProducts = productIds
            .map(id => products.find(p => p.id === id))
            .filter((p): p is ProductWithDetails => p !== undefined)
            .slice(0, limit);

        return sortedProducts;

    } catch (error) {
        console.error('Error fetching highest rated products:', error);
        return [];
    }
}

export async function getTopDiscounts(limit: number = 5): Promise<ProductWithDetails[]> {
    try {
        const products = await prisma.product.findMany({
            where: {
                isActive: true,
                salePrice: { not: null }
            },
            include: { media: true }
        });

        // Filter valid discounts (salePrice < price) and sort by discount percentage
        const sortedProducts = products
            .filter(p => p.salePrice !== null && p.salePrice < p.price)
            .sort((a, b) => {
                const discountA = ((a.price - (a.salePrice as number)) / a.price);
                const discountB = ((b.price - (b.salePrice as number)) / b.price);
                return discountB - discountA; // Descending
            })
            .slice(0, limit);

        return sortedProducts as unknown as ProductWithDetails[];

    } catch (error) {
        console.error('Error fetching top discount products:', error);
        return [];
    }
}

export async function getMostReviewed(limit: number = 5): Promise<ProductWithDetails[]> {
    try {
        const topReviewedProducts = await prisma.review.groupBy({
            by: ['productId'],
            _count: { productId: true },
            orderBy: { _count: { productId: 'desc' } },
            take: limit * 2
        });

        const productIds = topReviewedProducts
            .map(item => item.productId)
            .filter((id): id is string => id !== null);

        if (productIds.length === 0) return [];

        const products = await prisma.product.findMany({
            where: {
                id: { in: productIds },
                isActive: true
            },
            include: { media: true }
        });

        const sortedProducts = productIds
            .map(id => products.find(p => p.id === id))
            .filter((p): p is ProductWithDetails => p !== undefined)
            .slice(0, limit);

        return sortedProducts;
    } catch (error) {
        console.error('Error fetching most reviewed products:', error);
        return [];
    }
}

export async function getMostViewed(limit: number = 5): Promise<ProductWithDetails[]> {
    try {
        const products = await prisma.product.findMany({
            where: { isActive: true },
            orderBy: { viewCount: 'desc' },
            take: limit,
            include: { media: true }
        });

        return products as unknown as ProductWithDetails[];
    } catch (error) {
        console.error('Error fetching most viewed products:', error);
        return [];
    }
}
