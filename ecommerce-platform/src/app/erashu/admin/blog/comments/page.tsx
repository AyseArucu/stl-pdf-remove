'use client';

import { useState, useEffect } from 'react';
import { getAllBlogComments, deleteBlogComment, replyToCommentAsAdmin } from '@/app/actions/blog-comments';
import { FaTrash, FaEye, FaArrowLeft, FaReply } from 'react-icons/fa';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminBlogCommentsPage() {
    const router = useRouter();
    const [comments, setComments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [replyingId, setReplyingId] = useState<string | null>(null);
    const [replyContent, setReplyContent] = useState('');
    const [sendingReply, setSendingReply] = useState(false);

    useEffect(() => {
        loadComments();
    }, []);

    async function loadComments() {
        setLoading(true);
        const data = await getAllBlogComments();
        setComments(data);
        setLoading(false);
    }

    async function handleDelete(id: string) {
        if (!confirm('Bu yorumu silmek istediğinize emin misiniz?')) return;

        setDeletingId(id);
        const result = await deleteBlogComment(id);
        if (result.success) {
            setComments(comments.filter(c => c.id !== id));
        } else {
            alert(result.error || 'Silme işlemi başarısız.');
        }
        setDeletingId(null);
    }

    async function handleReply(e: React.FormEvent) {
        e.preventDefault();
        if (!replyingId || !replyContent.trim()) return;

        setSendingReply(true);
        // Find the comment to get postId
        const comment = comments.find(c => c.id === replyingId);
        if (!comment) return;

        const result = await replyToCommentAsAdmin(replyingId, replyContent, comment.postId);
        if (result.success) {
            alert('Yanıt başarıyla gönderildi.');
            setReplyingId(null);
            setReplyContent('');
            // Optional: reload comments to show update if we were showing replies
        } else {
            alert(result.error || 'Yanıt gönderilemedi.');
        }
        setSendingReply(false);
    }

    if (loading) return <div className="p-8 text-center text-gray-500">Yükleniyor...</div>;

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Link href="/erashu/admin/blog" className="text-gray-500 hover:text-gray-900 transition-colors">
                        <FaArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Blog Yorumları</h1>
                        <p className="text-sm text-gray-500">Toplam {comments.length} yorum</p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="px-6 py-4 font-semibold text-gray-700 text-sm">Yazar</th>
                                <th className="px-6 py-4 font-semibold text-gray-700 text-sm">Yorum</th>
                                <th className="px-6 py-4 font-semibold text-gray-700 text-sm">İçerik (Haber)</th>
                                <th className="px-6 py-4 font-semibold text-gray-700 text-sm">Tarih</th>
                                <th className="px-6 py-4 font-semibold text-gray-700 text-sm text-right">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {comments.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500 italic">
                                        Henüz hiç yorum yapılmamış.
                                    </td>
                                </tr>
                            ) : (
                                comments.map((comment) => (
                                    <>
                                        <tr key={comment.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-gray-900">
                                                    {comment.authorName && comment.authorSurname
                                                        ? `${comment.authorName} ${comment.authorSurname}`
                                                        : (comment.user.name || 'Misafir')}
                                                </div>
                                                <div className="text-xs text-gray-500">{comment.user.email}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-sm text-gray-600 line-clamp-2 max-w-md" title={comment.content}>
                                                    {comment.content}
                                                </p>
                                            </td>
                                            <td className="px-6 py-4">
                                                {comment.post ? (
                                                    <Link href={`/blog/${comment.post.slug}`} target="_blank" className="text-purple-600 hover:underline text-sm font-medium">
                                                        {comment.post.title}
                                                    </Link>
                                                ) : (
                                                    <span className="text-red-500 text-xs">Silinmiş İçerik</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {new Date(comment.createdAt).toLocaleDateString('tr-TR', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => {
                                                            setReplyingId(replyingId === comment.id ? null : comment.id);
                                                            setReplyContent('');
                                                        }}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title="Yanıtla"
                                                    >
                                                        <FaReply size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(comment.id)}
                                                        disabled={deletingId === comment.id}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Sil"
                                                    >
                                                        {deletingId === comment.id ? (
                                                            <span className="animate-spin inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
                                                        ) : (
                                                            <FaTrash size={16} />
                                                        )}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                        {replyingId === comment.id && (
                                            <tr key={`${comment.id}-reply`} className="bg-blue-50">
                                                <td colSpan={5} className="px-6 py-4">
                                                    <form onSubmit={handleReply} className="flex gap-2 items-start">
                                                        <textarea
                                                            value={replyContent}
                                                            onChange={(e) => setReplyContent(e.target.value)}
                                                            placeholder="Yanıtınızı yazın..."
                                                            className="flex-1 p-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                                            rows={2}
                                                            autoFocus
                                                        />
                                                        <div className="flex flex-col gap-2">
                                                            <button
                                                                type="submit"
                                                                disabled={!replyContent.trim() || sendingReply}
                                                                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                                                            >
                                                                {sendingReply ? 'Gönderiliyor...' : 'Gönder'}
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => setReplyingId(null)}
                                                                className="px-4 py-2 text-gray-600 text-sm hover:text-gray-800"
                                                            >
                                                                İptal
                                                            </button>
                                                        </div>
                                                    </form>
                                                </td>
                                            </tr>
                                        )}
                                    </>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
