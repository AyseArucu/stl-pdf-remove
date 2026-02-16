import Link from 'next/link';
import { FaCalendar, FaEye, FaChevronRight } from 'react-icons/fa';
import { BlogPost } from '@prisma/client';

interface DarkHorizontalCardProps {
    post: BlogPost;
    categoryTitle?: string;
}

export default function DarkHorizontalCard({ post, categoryTitle = "Teknoloji Haberleri" }: DarkHorizontalCardProps) {

    // Helper for category colors (matching page.tsx logic or custom)
    const getCategoryColor = (cat: string) => {
        if (cat === 'Haber') return 'bg-blue-600 text-white';
        if (cat === 'Teknoloji') return 'bg-green-600 text-white';
        if (cat === 'Yazılım') return 'bg-purple-600 text-white';
        return 'bg-gray-700 text-white';
    };

    return (
        <div className="w-full mb-8">
            {/* Dark Card */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-xl flex flex-col md:flex-row min-h-[300px] border border-gray-200 relative transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">

                {/* Image Side (Left) */}
                <div className="relative w-full md:w-5/12 h-64 md:h-auto group overflow-hidden">
                    <Link href={`/blog/${post.slug}`} className="block w-full h-full">
                        <img
                            src={post.coverImage}
                            alt={post.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500"></div>

                        {/* Category Badge - Bottom Right of Image */}
                        <div className="absolute bottom-4 right-4 z-10">
                            <span className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wide shadow-lg ${getCategoryColor(post.category)}`}>
                                {post.category}
                            </span>
                        </div>
                    </Link>
                </div>

                {/* Content Side (Right) */}
                <div className="w-full md:w-7/12 p-6 md:p-8 flex flex-col justify-center">

                    <div className="mb-2">
                        <span className="text-blue-500 text-sm font-bold uppercase tracking-wider">
                            Haber Detayı
                        </span>
                    </div>

                    <Link href={`/blog/${post.slug}`} className="group">
                        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-tight group-hover:text-blue-600 transition-colors">
                            {post.title}
                        </h3>
                    </Link>

                    <p className="text-gray-700 mb-6 text-sm md:text-base leading-relaxed line-clamp-3">
                        {post.excerpt}
                    </p>

                    <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-6">
                        {/* Meta Data */}
                        <div className="flex items-center gap-4 text-gray-600 text-sm">
                            <div className="flex items-center gap-1.5">
                                <FaCalendar className="text-gray-500" />
                                <time>{new Date(post.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}</time>
                            </div>
                            {post.viewCount !== undefined && post.viewCount !== null && (
                                <div className="flex items-center gap-1.5">
                                    <FaEye className="text-gray-500" />
                                    <span>{post.viewCount}</span>
                                </div>
                            )}
                        </div>

                        {/* Button */}
                        <Link
                            href={`/blog/${post.slug}`}
                            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg shadow-blue-900/20 flex items-center gap-2 group/btn"
                        >
                            Devamını Oku
                            <FaChevronRight size={12} className="group-hover/btn:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
