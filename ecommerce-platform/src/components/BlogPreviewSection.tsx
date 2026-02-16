import { getBlogPosts } from '@/app/actions/blog';
import Link from 'next/link';

import { withTimeout } from "@/lib/timeout";

export default async function BlogPreviewSection() {
    try {
        const posts = await withTimeout(
            getBlogPosts(3),
            3000,
            [] // Fallback to empty array
        );

        if (!posts || posts.length === 0) return null;

        return (
            <section className="container py-12 border-t border-gray-100">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900">
                        Son Yazılar
                    </h2>
                    <Link href="/blog" className="text-sm font-medium text-purple-600 hover:text-purple-800 transition-colors">
                        Tümünü Gör
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {posts.map((post: any) => (
                        <article key={post.id} className="group bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300">
                            <Link href={`/blog/${post.slug}`} className="block relative h-48 overflow-hidden">
                                <img
                                    src={post.coverImage}
                                    alt={post.title}
                                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute top-3 left-3">
                                    <span className={`px-2 py-1 rounded text-xs font-bold shadow-sm ${post.category === 'Haber'
                                        ? 'bg-blue-600/90 text-white'
                                        : 'bg-purple-600/90 text-white'
                                        }`}>
                                        {post.category}
                                    </span>
                                </div>
                            </Link>

                            <div className="p-5">
                                <div className="text-xs text-gray-500 mb-2">
                                    {new Date(post.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </div>

                                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
                                    <Link href={`/blog/${post.slug}`}>
                                        {post.title}
                                    </Link>
                                </h3>

                                <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                                    {post.excerpt}
                                </p>

                                <Link
                                    href={`/blog/${post.slug}`}
                                    className="text-purple-600 text-sm font-semibold hover:underline"
                                >
                                    Devamını Oku
                                </Link>
                            </div>
                        </article>
                    ))}
                </div>
            </section>
        );
    } catch (error) {
        console.error('[DEBUG] BlogPreviewSection: Error:', error);
        return null;
    }
}
