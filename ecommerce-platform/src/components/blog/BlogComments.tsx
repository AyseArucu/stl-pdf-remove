'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FaUserCircle, FaReply } from 'react-icons/fa';
import { submitBlogComment } from '@/app/actions/blog-comments';
import { useRouter } from 'next/navigation';

interface User {
    id: string;
    name: string | null;
    image: string | null;
}

interface Comment {
    id: string;
    content: string;
    createdAt: Date;
    user: User;
    authorName?: string | null;
    authorSurname?: string | null;
    replies?: Comment[];
}

interface Props {
    postId: string;
    currentUser: User | null;
    existingComments: Comment[];
}

export default function BlogComments({ postId, currentUser, existingComments }: Props) {
    const router = useRouter();
    const [comment, setComment] = useState('');
    const [authorName, setAuthorName] = useState('');
    const [authorSurname, setAuthorSurname] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [saveInfo, setSaveInfo] = useState(true);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentUser) {
            router.push('/login?callbackUrl=' + window.location.pathname);
            return;
        }

        if (!comment.trim() || !authorName.trim() || !authorSurname.trim()) return;

        setIsSubmitting(true);
        const formData = new FormData();
        formData.append('postId', postId);
        formData.append('content', comment);
        formData.append('authorName', authorName);
        formData.append('authorSurname', authorSurname);

        const result = await submitBlogComment(formData);

        if (result?.success) {
            setComment('');
            if (!saveInfo) {
                setAuthorName('');
                setAuthorSurname('');
            }
            router.refresh();
        } else {
            alert(result?.error || 'Bir hata oluştu.');
        }
        setIsSubmitting(false);
    };

    const renderComment = (bgComment: Comment, isReply = false) => (
        <div key={bgComment.id} className={`flex gap-4 ${isReply ? 'ml-12 mt-4' : ''}`}>
            <div className="flex-shrink-0">
                {bgComment.user.image ? (
                    <img src={bgComment.user.image} alt={bgComment.user.name || 'User'} className="w-12 h-12 rounded-full object-cover border border-gray-200" />
                ) : (
                    <FaUserCircle className="w-12 h-12 text-gray-300" />
                )}
            </div>
            <div className={`flex-1 ${isReply ? 'bg-purple-50 border-purple-100' : 'bg-white border-gray-100'} p-4 rounded-xl border shadow-sm`}>
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h4 className="font-bold text-gray-900 flex items-center gap-2">
                            {bgComment.authorName && bgComment.authorSurname
                                ? `${bgComment.authorName} ${bgComment.authorSurname}`
                                : (bgComment.user.name || 'Misafir')}
                            {bgComment.authorName === 'Erashu' && bgComment.authorSurname === 'Admin' && (
                                <span className="bg-purple-600 text-white text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">Yönetici</span>
                            )}
                        </h4>
                        <time className="text-xs text-gray-500">
                            {new Date(bgComment.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </time>
                    </div>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">{bgComment.content}</p>
            </div>
        </div>
    );

    return (
        <div className="mt-12 bg-gray-50 rounded-2xl p-6 md:p-8 border border-gray-100" id="comments">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 border-b border-gray-200 pb-4">
                Yorumlar ({existingComments.length})
            </h3>

            {/* Existing Comments List */}
            <div className="space-y-8 mb-12">
                {existingComments.length > 0 ? (
                    existingComments.map((bgComment) => (
                        <div key={bgComment.id}>
                            {renderComment(bgComment)}
                            {bgComment.replies && bgComment.replies.length > 0 && (
                                <div className="space-y-4">
                                    {bgComment.replies.map(reply => renderComment(reply, true))}
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 text-sm italic py-4 text-center">Henüz yorum yapılmamış. İlk yorumu siz yapın!</p>
                )}
            </div>

            {/* Comment Form */}
            <div className="bg-white p-6 rounded-xl border border-purple-100 shadow-sm">
                <h4 className="text-xl font-bold text-gray-800 mb-1">Bir Yanıt Yazın</h4>
                <p className="text-sm text-gray-500 mb-6">E-posta adresiniz yayınlanmayacak. Gerekli alanlar * ile işaretlenmişlerdir</p>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label htmlFor="authorName" className="block text-sm font-medium text-gray-700 mb-2">Ad *</label>
                            <input
                                type="text"
                                id="authorName"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-sm"
                                placeholder="Adınız"
                                value={authorName}
                                onChange={(e) => setAuthorName(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="authorSurname" className="block text-sm font-medium text-gray-700 mb-2">Soyad *</label>
                            <input
                                type="text"
                                id="authorSurname"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-sm"
                                placeholder="Soyadınız"
                                value={authorSurname}
                                onChange={(e) => setAuthorSurname(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">Yorumunuz *</label>
                        <textarea
                            id="comment"
                            rows={5}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all resize-y text-sm"
                            placeholder="Düşüncelerinizi paylaşın..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            required
                        ></textarea>
                    </div>

                    {!currentUser && (
                        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800 flex items-start gap-2">
                            <span>🔒</span>
                            <div>
                                <strong>Giriş Yapmalısınız</strong>
                                <p>Yorum yapabilmek için lütfen <Link href={`/login?callbackUrl=/blog/`} className="text-purple-600 underline font-semibold hover:text-purple-800">giriş yapın</Link> veya <Link href="/register" className="text-purple-600 underline font-semibold hover:text-purple-800">kayıt olun</Link>.</p>
                            </div>
                        </div>
                    )}

                    {currentUser && (
                        <div className="mb-6">
                            <div className="flex items-start gap-3">
                                <input
                                    id="save-info"
                                    type="checkbox"
                                    className="mt-1 w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                                    checked={saveInfo}
                                    onChange={(e) => setSaveInfo(e.target.checked)}
                                />
                                <label htmlFor="save-info" className="text-sm text-gray-600 leading-snug cursor-pointer select-none">
                                    Daha sonraki yorumlarımda kullanılması için adım, e-posta adresim ve site adresim bu tarayıcıya kaydedilsin.
                                </label>
                            </div>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting || !currentUser}
                        className={`px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg transition-all shadow-md hover:shadow-lg transform active:scale-95 ${(!currentUser || isSubmitting) ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {isSubmitting ? 'Gönderiliyor...' : 'Yorumu Gönder'}
                    </button>
                </form>
            </div>
        </div>
    );
}
