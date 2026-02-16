import { getBlogPosts } from '@/app/actions/blog';
import Link from 'next/link';
import { FaCalendar, FaEye, FaChevronRight } from 'react-icons/fa';
import DarkHorizontalCard from '@/components/blog/DarkHorizontalCard';
import ServiceCardsGrid from '@/components/blog/ServiceCardsGrid';
import BlogList from '@/components/blog/BlogList';
import FeaturedCategorySection from '@/components/blog/FeaturedCategorySection';
import AdSpace from '@/components/blog/AdSpace';

export const dynamic = 'force-dynamic';

export const metadata = {
    title: 'Blog & Haberler | Erashu Gaming',
    description: 'En güncel teknoloji haberleri, yazılım dünyasından gelişmeler ve 3D modelleme rehberleri.',
};

export default async function BlogPage() {
    // Fetch first 11 posts (3 Featured + 8 for Initial List)
    const posts = await getBlogPosts(11);

    // Split posts: Featured (First 3) & Regular (Rest)
    const featuredPosts = posts.slice(0, 3);
    const regularPosts = posts.slice(3);

    // Fetch specific categories for bottom sections
    const techPosts = await getBlogPosts(3, 'Teknoloji');
    const softwarePosts = await getBlogPosts(3, 'Yazılım');

    // Helper for category colors
    const getCategoryColor = (cat: string) => {
        if (cat === 'Haber') return 'bg-blue-600 text-white';
        if (cat === 'Teknoloji') return 'bg-green-600 text-white';
        if (cat === 'Yazılım') return 'bg-purple-600 text-white';
        return 'bg-gray-700 text-white';
    };

    return (
        <div className="min-h-screen bg-white text-gray-800 font-sans">
            {/* Page Header */}
            <div className="border-b border-gray-200 bg-gray-50">
                <div className="container mx-auto px-4 py-8">
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                        <span className="text-blue-600">Erashu</span> Blog & Haberler
                    </h1>
                    <p className="text-gray-600 mt-2 text-sm">
                        Teknoloji ve tasarım dünyasındaki son gelişmeler.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">

                {/* --- Featured Section (Grid) --- */}
                <FeaturedCategorySection posts={featuredPosts} />

                {/* --- Regular Posts List --- */}
                {regularPosts.length > 0 && (
                    <div className="space-y-16">
                        <div className="space-y-8">
                            <div className="border-b border-gray-200 pb-4 mb-6">
                                <AdSpace location="BLOG_MAIN_HEADER" />
                                <h2 className="text-xl font-bold text-blue-600 uppercase tracking-wider">
                                    Diğer Haberler
                                </h2>
                            </div>

                            {/* --- Service Cards Grid --- */}
                            <ServiceCardsGrid />

                            {/* --- Dark Horizontal Cards Section (Paginated List) --- */}
                            {regularPosts.length > 0 && (
                                <div className="mt-8">
                                    <BlogList initialPosts={regularPosts} initialOffset={11} />
                                </div>
                            )}
                        </div>

                        {/* --- Category Sections --- */}
                        <div className="space-y-16">
                            <FeaturedCategorySection title="TEKNOLOJİ" posts={techPosts} adLocation="BLOG_TECH_HEADER" />
                            <FeaturedCategorySection title="YAZILIM" posts={softwarePosts} adLocation="BLOG_SOFTWARE_HEADER" />
                        </div>
                    </div>
                )}

                {posts.length === 0 && (
                    <div className="text-center py-24 bg-gray-50 rounded-2xl border border-gray-200">
                        <div className="text-gray-500 text-lg">Henüz hiç haber eklenmemiş.</div>
                    </div>
                )}
            </div>
        </div>
    );
}
