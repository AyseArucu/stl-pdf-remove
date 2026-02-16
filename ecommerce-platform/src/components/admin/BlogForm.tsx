'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaSave, FaArrowLeft, FaImage, FaTrash, FaPlus, FaArrowUp, FaArrowDown, FaAlignLeft } from 'react-icons/fa';
import Link from 'next/link';
import { uploadFile } from '@/app/actions';
import { createBlogPost, updateBlogPost } from '@/app/actions/blog';

type BlockType = 'TEXT' | 'IMAGE';

interface Block {
    id: string;
    type: BlockType;
    content: string; // HTML for text, URL for image
}

type Props = {
    initialData?: {
        id: string;
        title: string;
        content: string;
        excerpt: string;
        coverImage: string;
        category: string;
        author: string | null;
        images: string | null;
    };
    isEdit?: boolean;
};

export default function BlogForm({ initialData, isEdit = false }: Props) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Form State
    const [coverImage, setCoverImage] = useState(initialData?.coverImage || '');
    const [extraImages, setExtraImages] = useState<string[]>(
        initialData?.images ? JSON.parse(initialData.images) : []
    );

    // Blocks State
    const [blocks, setBlocks] = useState<Block[]>([]);

    useEffect(() => {
        if (initialData?.content) {
            // Try to extract blocks from hidden comment
            const match = initialData.content.match(/<!--BLOCKS_DATA:(.*):BLOCKS_DATA-->/);
            if (match && match[1]) {
                try {
                    setBlocks(JSON.parse(match[1]));
                } catch (e) {
                    console.error("Failed to parse blocks, falling back to simple text", e);
                    setBlocks([{ id: '1', type: 'TEXT', content: initialData.content.replace(/<!--BLOCKS_DATA:.*:BLOCKS_DATA-->/, '') }]);
                }
            } else {
                // Legacy content treated as single text block
                setBlocks([{ id: '1', type: 'TEXT', content: initialData.content }]);
            }
        } else {
            // New post starts with one text block
            setBlocks([{ id: crypto.randomUUID(), type: 'TEXT', content: '' }]);
        }
    }, [initialData]);

    const addBlock = (type: BlockType) => {
        setBlocks([...blocks, { id: crypto.randomUUID(), type, content: '' }]);
    };

    const removeBlock = (id: string) => {
        setBlocks(blocks.filter(b => b.id !== id));
    };

    const moveBlock = (index: number, direction: 'up' | 'down') => {
        if (
            (direction === 'up' && index === 0) ||
            (direction === 'down' && index === blocks.length - 1)
        ) return;

        const newBlocks = [...blocks];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        [newBlocks[index], newBlocks[targetIndex]] = [newBlocks[targetIndex], newBlocks[index]];
        setBlocks(newBlocks);
    };

    const updateBlockContent = (id: string, content: string) => {
        setBlocks(blocks.map(b => b.id === id ? { ...b, content } : b));
    };

    const handleBlockImageUpload = async (id: string, file: File) => {
        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const url = await uploadFile(formData);
            updateBlockContent(id, url);
        } catch (error) {
            console.error('Block image upload failed', error);
            alert('Resim yüklenirken hata oluştu');
        } finally {
            setUploading(false);
        }
    };

    const handleCoverImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return;
        setUploading(true);
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('file', file);

        try {
            const url = await uploadFile(formData);
            setCoverImage(url);
        } catch (error) {
            console.error('Cover upload failed', error);
            alert('Kapak resmi yüklenirken hata oluştu');
        } finally {
            setUploading(false);
        }
    };

    const handleExtraImagesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return;
        setUploading(true);
        const files = Array.from(e.target.files);

        try {
            for (const file of files) {
                const formData = new FormData();
                formData.append('file', file);
                const url = await uploadFile(formData);
                setExtraImages(prev => [...prev, url]);
            }
        } catch (error) {
            console.error('Extra images upload failed', error);
            alert('Resimler yüklenirken hata oluştu');
        } finally {
            setUploading(false);
        }
    };

    const removeExtraImage = (index: number) => {
        setExtraImages(prev => prev.filter((_, i) => i !== index));
    };

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);
        const formData = new FormData(event.currentTarget);

        // Serialize Blocks to HTML
        let htmlContent = '';
        blocks.forEach(block => {
            if (block.type === 'TEXT') {
                // Ensure text is wrapped if not already
                // For simplicity, we just save the text content directly, or wrap in div
                htmlContent += `<div class="blog-text mb-6 text-gray-700 leading-relaxed">${block.content.replace(/\n/g, '<br/>')}</div>`;
            } else if (block.type === 'IMAGE') {
                htmlContent += `<div class="blog-image mb-8"><img src="${block.content}" class="w-full rounded-xl shadow-md" alt="Blog Image" /></div>`;
            }
        });

        // Append embedded data for re-editability
        const blocksJson = JSON.stringify(blocks);
        htmlContent += `<!--BLOCKS_DATA:${blocksJson}:BLOCKS_DATA-->`;

        formData.set('content', htmlContent);
        formData.set('coverImage', coverImage);
        formData.set('images', JSON.stringify(extraImages));

        let result;
        if (isEdit && initialData) {
            result = await updateBlogPost(initialData.id, formData);
        } else {
            result = await createBlogPost(formData);
        }

        if (result.success) {
            router.push('/erashu/admin/blog');
            router.refresh();
        } else {
            alert('Hata: ' + result.error);
            setLoading(false);
        }
    }

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
                <Link href="/erashu/admin/blog" className="text-gray-500 hover:text-gray-800">
                    <FaArrowLeft size={20} />
                </Link>
                <h1 className="text-2xl font-bold text-gray-800">
                    {isEdit ? 'Blog Yazısını Düzenle' : 'Yeni Blog Yazısı Ekle'}
                </h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Meta Information Section */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
                    <h2 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4">Genel Bilgiler</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Başlık</label>
                            <input
                                name="title"
                                type="text"
                                required
                                defaultValue={initialData?.title}
                                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                                placeholder="Haber/Blog Başlığı..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
                            <select
                                name="category"
                                defaultValue={initialData?.category || 'Haber'}
                                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                            >
                                <option value="Haber">Haber</option>
                                <option value="Teknoloji">Teknoloji</option>
                                <option value="Yazılım">Yazılım</option>
                                <option value="Blog">Blog</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Yazar</label>
                            <input
                                name="author"
                                type="text"
                                required
                                defaultValue={initialData?.author || ''}
                                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                                placeholder="Yazar Adı"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Özet (Excerpt)</label>
                        <textarea
                            name="excerpt"
                            required
                            rows={3}
                            defaultValue={initialData?.excerpt}
                            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                            placeholder="Kısa özet..."
                        />
                    </div>
                </div>

                {/* Content Editor Section */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
                    <div className="flex justify-between items-center border-b pb-2 mb-4">
                        <h2 className="text-lg font-bold text-gray-800">İçerik Editörü</h2>
                        <div className="flex gap-2">
                            <button type="button" onClick={() => addBlock('TEXT')} className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg flex items-center gap-2 transition-colors">
                                <FaAlignLeft /> Metin Ekle
                            </button>
                            <button type="button" onClick={() => addBlock('IMAGE')} className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg flex items-center gap-2 transition-colors">
                                <FaImage /> Görsel Ekle
                            </button>
                        </div>
                    </div>

                    <div className="space-y-4 min-h-[300px]">
                        {blocks.map((block, index) => (
                            <div key={block.id} className="relative group border border-gray-200 rounded-xl p-4 bg-gray-50 hover:bg-white hover:shadow-md transition-all">
                                {/* Block Controls */}
                                <div className="absolute top-2 right-2 flex gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 backdrop-blur-sm p-1 rounded-lg border border-gray-100 shadow-sm z-10">
                                    <button type="button" onClick={() => moveBlock(index, 'up')} disabled={index === 0} className="p-1.5 hover:bg-gray-100 rounded text-gray-600 disabled:opacity-30">
                                        <FaArrowUp size={12} />
                                    </button>
                                    <button type="button" onClick={() => moveBlock(index, 'down')} disabled={index === blocks.length - 1} className="p-1.5 hover:bg-gray-100 rounded text-gray-600 disabled:opacity-30">
                                        <FaArrowDown size={12} />
                                    </button>
                                    <button type="button" onClick={() => removeBlock(block.id)} className="p-1.5 hover:bg-red-50 text-red-500 rounded">
                                        <FaTrash size={12} />
                                    </button>
                                </div>

                                {/* Block Content */}
                                {block.type === 'TEXT' ? (
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 mb-1 uppercase tracking-wider">Metin Bloğu</label>
                                        <textarea
                                            value={block.content}
                                            onChange={(e) => updateBlockContent(block.id, e.target.value)}
                                            rows={4}
                                            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none transition-all bg-white"
                                            placeholder="Metin içeriğini buraya yazın..."
                                        />
                                    </div>
                                ) : (
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 mb-1 uppercase tracking-wider">Görsel Bloğu</label>
                                        {block.content ? (
                                            <div className="relative mt-2 rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
                                                <img src={block.content} alt="Block" className="w-full h-48 object-contain bg-checkered" />
                                                <button
                                                    type="button"
                                                    onClick={() => updateBlockContent(block.id, '')}
                                                    className="absolute top-2 right-2 bg-white/90 text-red-600 p-2 rounded-full shadow-sm hover:bg-red-50"
                                                >
                                                    <FaTrash size={14} />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-white hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => document.getElementById(`file-${block.id}`)?.click()}>
                                                <FaImage className="mx-auto text-gray-400 text-3xl mb-2" />
                                                <p className="text-sm text-gray-500 font-medium">Görsel yüklemek için tıklayın</p>
                                                <input
                                                    id={`file-${block.id}`}
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={(e) => e.target.files && handleBlockImageUpload(block.id, e.target.files[0])}
                                                />
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}

                        {blocks.length === 0 && (
                            <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl">
                                <p className="text-gray-500">Henüz içerik eklenmedi. Yukarıdaki butonları kullanarak başlayın.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Media Section (Cover & Extra) */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
                    <h2 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4">Medya Ayarları</h2>

                    {/* Cover Image */}
                    <div className="border border-dashed border-gray-300 rounded-xl p-6 bg-gray-50">
                        <label className="block text-sm font-medium text-gray-700 mb-4 flex items-center gap-2">
                            <FaImage /> Kapak Görseli
                        </label>
                        <div className="flex items-start gap-6">
                            <div className="flex-1">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleCoverImageChange}
                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                                    disabled={uploading}
                                />
                                <p className="text-xs text-gray-500 mt-2">Kartlarda görünecek ana resim.</p>
                            </div>
                            {coverImage && (
                                <div className="relative w-32 h-20 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                                    <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Extra Images */}
                    <div className="border border-dashed border-gray-300 rounded-xl p-6 bg-gray-50">
                        <label className="block text-sm font-medium text-gray-700 mb-4 flex items-center gap-2">
                            <FaImage /> Galeri Resimleri (Opsiyonel)
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleExtraImagesChange}
                            className="block w-full text-sm text-gray-500 mb-4 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                            disabled={uploading}
                        />
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {extraImages.map((img, idx) => (
                                <div key={idx} className="relative group rounded-lg overflow-hidden border border-gray-200 h-24">
                                    <img src={img} alt={`Extra ${idx}`} className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => removeExtraImage(idx)}
                                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <FaTrash size={12} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4 sticky bottom-0 bg-white/80 backdrop-blur-sm p-4 border-t border-gray-200 z-20">
                    <button
                        type="submit"
                        disabled={loading || uploading}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-xl font-bold text-lg flex items-center gap-2 transition-all shadow-lg hover:shadow-purple-500/30 disabled:opacity-50"
                    >
                        <FaSave /> {loading ? 'Kaydediliyor...' : 'Yazıyı Yayınla'}
                    </button>
                </div>
            </form>
        </div>
    );
}
