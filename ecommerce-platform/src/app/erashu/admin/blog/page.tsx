import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { FaPlus, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import { deleteBlogPost } from '@/app/actions/blog';
import { revalidatePath } from 'next/cache';

import { checkUserSession } from '@/app/actions/auth';

export default async function AdminBlogPage() {
    const user = await checkUserSession();

    // Authorization check
    if (!user || (user.role !== 'ADMIN' && user.role !== 'SUB_ADMIN' && user.role !== 'AUTHOR')) {
        return <div>Yetkisiz Erişim</div>;
    }

    // Remove filtering - Authors can see all posts now
    // const whereClause: any = {};
    // if (user.role === 'AUTHOR') {
    //     whereClause.authorId = user.id;
    // }

    const posts = await prisma.blogPost.findMany({
        // where: whereClause, // Show all
        orderBy: { createdAt: 'desc' }
    });

    async function handleDelete(id: string) {
        'use server';
        await deleteBlogPost(id);
        revalidatePath('/erashu/admin/blog');
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Blog ve Haber Yönetimi</h1>
                <div className="flex gap-3">
                    <Link
                        href="/erashu/admin/blog/comments"
                        className="bg-purple-100 text-purple-700 px-4 py-2 rounded-lg hover:bg-purple-200 transition-colors flex items-center gap-2"
                    >
                        Yorumları Yönet
                    </Link>
                    <Link
                        href="/erashu/admin/blog/new"
                        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                    >
                        <FaPlus /> Yeni Yazı Ekle
                    </Link>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="p-4 font-semibold text-gray-600">Başlık</th>
                            <th className="p-4 font-semibold text-gray-600">Kategori</th>
                            <th className="p-4 font-semibold text-gray-600">Yazar</th>
                            <th className="p-4 font-semibold text-gray-600">Durum</th>
                            <th className="p-4 font-semibold text-gray-600">Görüntülenme</th>
                            <th className="p-4 font-semibold text-gray-600 text-right">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {posts.map((post) => {
                            const isOwner = user.role !== 'AUTHOR' || post.authorId === user.id;

                            return (
                                <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4">
                                        <div className="font-medium text-gray-900">{post.title}</div>
                                        <div className="text-xs text-gray-500">{post.slug}</div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-semibold ${post.category === 'Haber' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                                            }`}>
                                            {post.category}
                                        </span>
                                    </td>
                                    <td className="p-4 text-sm text-gray-600">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-bold">
                                                {(post.author || 'A').charAt(0).toUpperCase()}
                                            </div>
                                            <span>{post.author || 'Anonim'}</span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        {post.published ? (
                                            <span className="text-green-600 text-sm flex items-center gap-1">● Yayında</span>
                                        ) : (
                                            <span className="text-gray-400 text-sm flex items-center gap-1">○ Taslak</span>
                                        )}
                                    </td>
                                    <td className="p-4 text-gray-600">
                                        <div className="flex items-center gap-1">
                                            <FaEye size={14} className="text-gray-400" />
                                            {post.viewCount}
                                        </div>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            {isOwner ? (
                                                <>
                                                    <Link
                                                        href={`/erashu/admin/blog/${post.id}`}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                                        title="Düzenle"
                                                    >
                                                        <FaEdit />
                                                    </Link>
                                                    <form action={handleDelete.bind(null, post.id)}>
                                                        <button
                                                            className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                                                            title="Sil"
                                                            type="submit"
                                                        >
                                                            <FaTrash />
                                                        </button>
                                                    </form>
                                                </>
                                            ) : (
                                                <span className="text-gray-400 text-xs py-2 px-3 bg-gray-100 rounded cursor-not-allowed flex items-center gap-1">
                                                    🔒 Salt Okunur
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                        {posts.length === 0 && (
                            <tr>
                                <td colSpan={6} className="p-8 text-center text-gray-500">
                                    Henüz hiç blog yazısı eklenmemiş.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
