import { prisma } from '@/lib/prisma';
import { Product, Category, Review, Question } from '@/lib/db';
import { incrementProductView } from '@/app/actions';
import Header from '@/components/Header';
import ProductGallery from '@/components/ProductGallery';
import ProductInfo from '@/components/ProductInfo';
import ProductTabs from '@/components/ProductTabs';
import SimilarProducts from '@/components/SimilarProducts';
import ProductQuestions from '@/components/ProductQuestions';
import RecommendedProducts from '@/components/RecommendedProducts';
import ProductCollections from '@/components/ProductCollections';
import { notFound } from 'next/navigation';

interface PageProps {
    params: {
        id: string;
    };
}

export default async function ProductDetailPage({ params }: PageProps) {
    const productId = params.id;

    // Increment View Count (Fire and forget, or await if critical)
    await incrementProductView(productId);

    const productRaw = await prisma.product.findUnique({
        where: { id: productId },
        include: {
            media: true,
            options: true,
            features: true,
            category: true,
        }
    });

    if (!productRaw || !productRaw.isActive) {
        notFound();
    }

    // Fetch all active products for recommendations algorithms
    // TODO: Optimize this to fetch only needed subsets in future
    const allProductsRaw = await prisma.product.findMany({
        where: { isActive: true },
        include: {
            media: true,
            options: true,
            features: true,
        }
    });

    const categoriesRaw = await prisma.category.findMany();

    // Fetch reviews for this product specifically for the tabs
    const reviewsRaw = await prisma.review.findMany({
        where: { productId: productId }
    });

    // Fetch questions for this product
    const questionsRaw = await prisma.question.findMany({
        where: { productId: productId }
    });


    // --- MAPPING TO LEGACY INTERFACES ---
    const mapProduct = (p: any) => ({
        ...p,
        categoryId: p.categoryId,
        subcategoryIds: [],
        createdAt: p.createdAt.toISOString(),
        media: p.media.map((m: any) => ({
            type: m.type as 'image' | 'video',
            url: m.url,
            thumbnail: m.thumbnail || undefined
        }))
    });

    const product = mapProduct(productRaw);
    const allProducts = allProductsRaw.map(mapProduct);

    const categories: Category[] = categoriesRaw.map(c => ({
        id: c.id,
        name: c.name,
        parentId: c.parentId || null
    }));

    const reviews = reviewsRaw.map(r => ({
        ...r,
        createdAt: r.createdAt.toISOString()
    }));

    // Start Question Mapping
    // Question interface in db.ts has userId? and answer?
    const questions = questionsRaw.map(q => ({
        ...q,
        userId: q.userId || null,
        answer: q.answer || null,
        createdAt: q.createdAt.toISOString()
    }));
    // End Question Mapping


    // Mock multiple images using the single image we have (fallback)
    // Legacy logic used product.imageUrl 4 times
    const images = [
        product.imageUrl,
        product.imageUrl,
        product.imageUrl,
        product.imageUrl, // Added one more
    ];

    // Calculate average rating
    const averageRating = reviews.length > 0
        ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
        : 0;


    // --- MUTUALLY EXCLUSIVE LISTS LOGIC ---

    // 1. Recommended (Personalized / High Rated / Same Category) - Get 5
    const sameCategory = allProducts.filter(p => p.categoryId === product.categoryId && p.id !== product.id);
    const othersHighRated = allProducts.filter(p => p.categoryId !== product.categoryId && p.id !== product.id && (p.rating || 0) >= 4);

    // Prioritize same category, then high rated others
    const recommendedList = [...sameCategory.slice(0, 3), ...othersHighRated].slice(0, 5);
    const recommendedIds = recommendedList.map(p => p.id);

    // 2. Similar (Strictly Same Category if possible), EXCLUDING Recommended - Get 4
    let similarList = sameCategory.filter(p => !recommendedIds.includes(p.id));

    // If not enough same category, fill with others
    if (similarList.length < 4) {
        const remainingOthers = allProducts.filter(p =>
            p.id !== product.id &&
            !recommendedIds.includes(p.id) &&
            !similarList.map(s => s.id).includes(p.id)
        );
        similarList = [...similarList, ...remainingOthers].slice(0, 4);
    } else {
        similarList = similarList.slice(0, 4);
    }

    return (
        <div className="pdp-page-wrapper">
            <div className="container">
                <div className="pdp-layout">
                    {/* Left Column: Gallery */}
                    <div className="pdp-left">
                        <ProductGallery media={product.media} images={images} />
                    </div>

                    {/* Right Column: Info */}
                    <div className="pdp-right">
                        <ProductInfo
                            product={product}
                            reviewCount={reviews.length}
                            averageRating={averageRating}
                            categoryName={productRaw.category?.name}
                        />
                    </div>
                </div>

                {/* Q&A and Reviews - Side by Side */}
                <div className="pdp-content-grid" style={{ marginTop: '2rem' }}>

                    {/* Left: Reviews (Tabs) */}
                    <div>
                        <h2 className="section-title">Değerlendirmeler</h2>
                        <ProductTabs reviews={reviews} productId={product.id} />
                    </div>

                    {/* Right: Q&A */}
                    <div>
                        <h2 className="section-title">Soru & Cevap</h2>
                        <ProductQuestions productId={product.id} questions={questions} />
                    </div>
                </div>

                {/* NEW: Collections Section */}
                <ProductCollections
                    products={allProducts}
                    categories={categories}
                    currentProductId={product.id}
                    reviews={reviews}
                />

                {/* Recommended Products - "Ayşe, Sana Özel Ürünler" style */}
                <RecommendedProducts
                    currentProductId={product.id}
                    categoryId={product.categoryId}
                    products={recommendedList}
                    categories={categories}
                    title="Sana Özel Ürünler" // Fallback title
                />

                {/* Similar Products */}
                <div className="pdp-similar">
                    <SimilarProducts
                        products={similarList}
                        categories={categories}
                        currentProductId={product.id}
                    />
                </div>
            </div>
        </div>
    );
}
