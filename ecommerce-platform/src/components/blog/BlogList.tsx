'use client';

import React, { useState } from 'react';
import { BlogPost } from '@prisma/client';
import DarkHorizontalCard from './DarkHorizontalCard';
import { getPaginatedPosts } from '@/app/actions/blog';
import { Loader2 } from 'lucide-react';

interface BlogListProps {
    initialPosts: BlogPost[];
    initialOffset: number;
}

export default function BlogList({ initialPosts, initialOffset }: BlogListProps) {
    const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
    const [offset, setOffset] = useState(initialOffset);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const LIMIT = 8;

    const loadMorePosts = async () => {
        if (loading) return;

        setLoading(true);
        try {
            const newPosts = await getPaginatedPosts(offset, LIMIT);

            if (newPosts.length === 0) {
                setHasMore(false);
            } else {
                setPosts((prev) => [...prev, ...newPosts]);
                setOffset((prev) => prev + LIMIT);

                if (newPosts.length < LIMIT) {
                    setHasMore(false);
                }
            }
        } catch (error) {
            console.error('Failed to load more posts:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            {posts.map((post) => (
                <DarkHorizontalCard key={post.id} post={post} />
            ))}

            {hasMore && (
                <div className="flex justify-center mt-12">
                    <button
                        onClick={loadMorePosts}
                        disabled={loading}
                        className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full transition-all duration-300 transform hover:-translate-y-1 shadow-lg shadow-blue-500/30 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin" size={20} />
                                Yükleniyor...
                            </>
                        ) : (
                            <>
                                Daha Fazla Göster
                            </>
                        )}
                    </button>
                </div>
            )}
        </div>
    );
}
