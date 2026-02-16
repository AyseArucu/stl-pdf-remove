import Link from 'next/link';
import { BlogPost } from '@prisma/client';
import { Calendar, Eye, ArrowRight } from 'lucide-react';

interface BlogGridCardProps {
    post: BlogPost;
}

export default function BlogGridCard({ post }: BlogGridCardProps) {
    // Helper for category colors (consistent with other components)
    const getCategoryColor = (cat: string) => {
        if (cat === 'Haber') return 'text-blue-600 bg-blue-50 border-blue-100';
        if (cat === 'Teknoloji') return 'text-green-600 bg-green-50 border-green-100';
        if (cat === 'Yazılım') return 'text-purple-600 bg-purple-50 border-purple-100';
        return 'text-gray-600 bg-gray-50 border-gray-100';
    };

    const catStyle = getCategoryColor(post.category);

    return (
        <Link href={`/blog/${post.slug}`} className="group block h-full">
            <div className="h-full bg-white rounded-2xl border-2 border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden flex flex-col">
                {/* Image Section */}
                <div className="relative h-48 w-full overflow-hidden">
                    <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-300" />
                    <div className="absolute top-3 right-3">
                        <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${catStyle}`}>
                            {post.category}
                        </span>
                    </div>
                </div>

                {/* Content Section */}
                <div className="p-5 flex flex-col flex-grow">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight">
                        {post.title}
                    </h3>

                    <p className="text-gray-500 text-sm line-clamp-2 mb-4 flex-grow">
                        {post.excerpt}
                    </p>

                    {/* Meta & Button */}
                    <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-auto">
                        <div className="flex items-center gap-3 text-xs text-gray-400">
                            <div className="flex items-center gap-1">
                                <Calendar size={12} />
                                <time>{new Date(post.createdAt).toLocaleDateString('tr-TR')}</time>
                            </div>
                        </div>

                        <div className="flex items-center text-sm font-bold text-blue-600 opacity-100 group-hover:translate-x-1 transition-transform">
                            Oku <ArrowRight size={14} className="ml-1" />
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
