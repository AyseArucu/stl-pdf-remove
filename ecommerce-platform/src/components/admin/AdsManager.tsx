'use client';

import { useState } from 'react';
import { createAd, updateAd, deleteAd } from '@/app/actions/ads';

type Ad = {
    id: string;
    title: string;
    type: string;
    content: string;
    location: string;
    duration: number;
    isActive: boolean;
};

const LOCATIONS = [
    { key: 'BLOG_MAIN_HEADER', label: 'Blog: Diğer Haberler Üstü' },
    { key: 'BLOG_TECH_HEADER', label: 'Blog: Teknoloji Bölümü Üstü' },
    { key: 'BLOG_SOFTWARE_HEADER', label: 'Blog: Yazılım Bölümü Üstü' },
    { key: 'GLOBAL_SIDE_LEFT', label: 'Global: Sol Köşe' },
    { key: 'GLOBAL_SIDE_RIGHT', label: 'Global: Sağ Köşe' },
];

export default function AdsManager({ initialAds }: { initialAds: Ad[] }) {
    const [ads, setAds] = useState<Ad[]>(initialAds);
    const [editingAd, setEditingAd] = useState<Ad | null>(null);

    // This is optimistically updated or re-fetched. Ideally we re-fetch via router.refresh() 
    // or passing new data via server action response if implementing manual state.
    // But for simplicity with Next.js App Router, actions revalidatePath and we rely on parent re-rendering 
    // OR we just use form submission and let the page reload slightly / router.refresh().
    // Since this is a CLIENT component receiving initialAds, it won't auto-update on action unless we refresh.

    // Better strategy: 
    // 1. Submit -> Server Action -> revalidatePath
    // 2. Client -> router.refresh() (imported from next/navigation)

    const [isPending, setIsPending] = useState(false);

    async function handleSubmit(formData: FormData) {
        setIsPending(true);
        if (editingAd) {
            formData.append('id', editingAd.id);
            await updateAd(formData);
        } else {
            await createAd(formData);
        }

        setIsPending(false);
        setEditingAd(null);
        // Force reload to get new data since we are in a client component holding state from props
        window.location.reload();
    }

    async function handleDelete(id: string) {
        if (!confirm('Bu reklamı silmek istediğinize emin misiniz?')) return;
        setIsPending(true);
        await deleteAd(id);
        setIsPending(false);
        window.location.reload();
    }

    return (
        <div>
            {/* Form */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">
                        {editingAd ? 'Reklam Düzenle' : 'Yeni Reklam Ekle'}
                    </h2>
                    {editingAd && (
                        <button
                            onClick={() => setEditingAd(null)}
                            className="text-sm text-gray-500 hover:text-gray-700 underline"
                        >
                            İptal / Yeni Ekle
                        </button>
                    )}
                </div>

                <form key={editingAd ? editingAd.id : 'new'} action={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Başlık</label>
                            <input
                                type="text"
                                name="title"
                                required
                                defaultValue={editingAd?.title || ''}
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Konum</label>
                            <input
                                type="text"
                                name="location"
                                required
                                list="location-options"
                                defaultValue={editingAd?.location || ''}
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                placeholder="Listeden seçin veya yazın..."
                            />
                            <datalist id="location-options">
                                {LOCATIONS.map(loc => (
                                    <option key={loc.key} value={loc.key}>{loc.label}</option>
                                ))}
                                <option value="HOME_BELOW_HERO">Anasayfa: Vitrin Altı</option>
                                <option value="FOOTER_TOP">Site Altı (Footer) Üstü</option>
                                <option value="SIDEBAR_RIGHT">Kenar Çubuğu (Sağ)</option>
                            </datalist>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Tip</label>
                            <select
                                name="type"
                                defaultValue={editingAd?.type || 'IMAGE'}
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                            >
                                <option value="IMAGE">Resim URL</option>
                                <option value="VIDEO">Video URL (MP4)</option>
                                <option value="HTML">HTML / Script Kodu</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Süre (Saniye)</label>
                            <input
                                type="number"
                                name="duration"
                                min="1"
                                defaultValue={editingAd?.duration || 5}
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                            />
                        </div>
                        <div className="flex items-center pt-6">
                            <input
                                type="checkbox"
                                name="isActive"
                                id="isActive"
                                defaultChecked={editingAd ? editingAd.isActive : true}
                                className="mr-2"
                            />
                            <label htmlFor="isActive" className="text-sm font-medium text-gray-700">Aktif</label>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">İçerik (Resim/Video URL veya HTML Kodu)</label>
                        <textarea
                            name="content"
                            required
                            rows={4}
                            defaultValue={editingAd?.content || ''}
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                            placeholder="https://example.com/banner.jpg veya <script>...</script>"
                        ></textarea>
                    </div>
                    <button
                        type="submit"
                        disabled={isPending}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                    >
                        {isPending ? 'İşleniyor...' : (editingAd ? 'Güncelle' : 'Kaydet')}
                    </button>
                </form>
            </div>

            {/* List */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Başlık</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Konum</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tip</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durum</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">İşlem</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {initialAds.map((ad) => (
                            <tr key={ad.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{ad.title}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {LOCATIONS.find(l => l.key === ad.location)?.label || ad.location}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ad.type}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${ad.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {ad.isActive ? 'Aktif' : 'Pasif'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button
                                        onClick={() => {
                                            setEditingAd(ad);
                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                        }}
                                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                                    >
                                        Düzenle
                                    </button>
                                    <button
                                        onClick={() => handleDelete(ad.id)}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        Sil
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {initialAds.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">Henüz reklam eklenmemiş.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
