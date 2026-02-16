'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface SliderFormProps {
    slide?: any;
    action: (formData: FormData) => Promise<any>;
    mode: 'create' | 'edit';
}

export default function SliderForm({ slide, action, mode }: SliderFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [preview, setPreview] = useState<string | null>(slide?.imageUrl || null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        if (mode === 'edit' && slide) {
            formData.append('id', slide.id);
        }

        const result = await action(formData);

        if (result?.error) {
            setError(result.error);
            setLoading(false);
        } else {
            router.push('/erashu/admin/slider');
            router.refresh();
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPreview(URL.createObjectURL(file));
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Başlık</label>
                        <input
                            type="text"
                            name="title"
                            defaultValue={slide?.title}
                            required
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Alt Başlık</label>
                        <input
                            type="text"
                            name="subtitle"
                            defaultValue={slide?.subtitle}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Açıklama</label>
                        <textarea
                            name="description"
                            rows={3}
                            defaultValue={slide?.description}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none resize-none"
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Buton Metni</label>
                        <input
                            type="text"
                            name="buttonText"
                            defaultValue={slide?.buttonText || "Koleksiyonu Keşfet"}
                            required
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Buton Linki</label>
                        <input
                            type="text"
                            name="buttonLink"
                            defaultValue={slide?.buttonLink || "/collections"}
                            required
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Sıralama (Opsiyonel)</label>
                        <input
                            type="number"
                            name="order"
                            defaultValue={slide?.order || 0}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                        />
                    </div>
                </div>
            </div>

            <div className="border-t pt-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Görsel (Önerilen: 1920x800px)</label>
                <div className="flex items-start gap-6">
                    <div className="flex-1">
                        <input
                            type="file"
                            name="image"
                            accept="image/*"
                            onChange={handleImageChange}
                            required={mode === 'create'} // Required only on create
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                        />
                        <p className="text-xs text-gray-500 mt-2">PNG, JPG veya WEBP. Maksimum 5MB.</p>
                    </div>
                    {preview && (
                        <div className="w-64 h-32 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 relative">
                            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                    )}
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-6 py-2.5 text-gray-700 font-medium hover:bg-gray-50 rounded-lg transition"
                >
                    İptal
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2.5 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition shadow-sm disabled:opacity-50 flex items-center gap-2"
                >
                    {loading ? (
                        <>
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                            Kaydediliyor...
                        </>
                    ) : (
                        mode === 'create' ? 'Oluştur' : 'Güncelle'
                    )}
                </button>
            </div>
        </form>
    );
}
