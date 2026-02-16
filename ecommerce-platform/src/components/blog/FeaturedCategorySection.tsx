import Link from 'next/link';
import { BlogPost } from '@prisma/client';
import { FaCalendar } from 'react-icons/fa';
import AdSpace from './AdSpace';

interface FeaturedCategorySectionProps {
    title?: string;
    posts: BlogPost[];
    adLocation?: string;
}

export default function FeaturedCategorySection({ title, posts, adLocation }: FeaturedCategorySectionProps) {
    if (!posts || posts.length === 0) return null;

    // Helper for category colors
    const getCategoryColor = (cat: string) => {
        if (cat === 'Haber') return 'bg-blue-600 text-white';
        if (cat === 'Teknoloji') return 'bg-green-600 text-white';
        if (cat === 'Yazılım') return 'bg-purple-600 text-white';
        return 'bg-gray-700 text-white';
    };

    const mainPost = posts[0];
    const subPosts = posts.slice(1, 3);

    return (
        <section className="mb-16">
            {title && (
                <div className="border-b border-gray-200 pb-4 mb-8">
                    {adLocation && <AdSpace location={adLocation} />}
                    <h2 className="text-2xl font-bold text-gray-900 uppercase tracking-wider relative">
                        <span className="relative z-10 pr-4 bg-white">{title}</span>
                        <div className="absolute bottom-0 left-0 w-24 h-1 bg-blue-600"></div>
                    </h2>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Large Post (Left - Spans 2 Cols) */}
                <div className="lg:col-span-2 group relative h-[400px] lg:h-[500px] rounded-2xl overflow-hidden shadow-lg">
                    <Link href={`/blog/${mainPost.slug}`} className="block h-full w-full">
                        <img
                            src={mainPost.coverImage}
                            alt={mainPost.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-90" />

                        {/* Content */}
                        <div className="absolute bottom-0 left-0 p-8 w-full">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3 inline-block shadow-md ${getCategoryColor(mainPost.category)}`}>
                                {mainPost.category}
                            </span>
                            <h2 className="text-2xl lg:text-4xl font-bold text-white mb-3 leading-tight group-hover:text-blue-300 transition-colors">
                                {mainPost.title}
                            </h2>
                            <div className="flex items-center gap-4 text-gray-200 text-sm">
                                <div className="flex items-center gap-1">
                                    <FaCalendar size={12} />
                                    <time>{new Date(mainPost.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}</time>
                                </div>
                            </div>
                        </div>
                    </Link>
                </div>

                {/* Sub Featured Posts (Right - Stacked) */}
                <div className="flex flex-col gap-6 h-[500px]">
                    {subPosts.map((post) => (
                        <div key={post.id} className="group relative flex-1 rounded-2xl overflow-hidden shadow-lg">
                            <Link href={`/blog/${post.slug}`} className="block h-full w-full">
                                <img
                                    src={post.coverImage}
                                    alt={post.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90" />
                                <div className="absolute bottom-0 left-0 p-6 w-full">
                                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase mb-2 inline-block ${getCategoryColor(post.category)}`}>
                                        {post.category}
                                    </span>
                                    <h3 className="text-lg font-bold text-white leading-snug group-hover:text-blue-300 transition-colors line-clamp-2">
                                        {post.title}
                                    </h3>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
