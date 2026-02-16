'use client';

import { useState, useEffect } from 'react';
import { getServicePageContent, updateServicePageContent } from '@/app/actions/service-actions';
import { FaSave, FaPlus, FaTrash } from 'react-icons/fa';

export default function ServiceContentAdmin() {
    const [content, setContent] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getServicePageContent().then(data => {
            setContent(data);
            setLoading(false);
        });
    }, []);

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setContent((prev: any) => ({ ...prev, [name]: value }));
    };

    const handleArrayChange = (index: number, field: string, value: string, subField?: string) => {
        const list = [...content[field]];
        if (subField) {
            list[index][subField] = value;
        } else {
            list[index] = value;
        }
        setContent((prev: any) => ({ ...prev, [field]: list }));
    };

    const addItem = (field: string, template: any) => {
        setContent((prev: any) => ({ ...prev, [field]: [...prev[field], template] }));
    };

    const removeItem = (field: string, index: number) => {
        const list = [...content[field]];
        list.splice(index, 1);
        setContent((prev: any) => ({ ...prev, [field]: list }));
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('heroTitle', content.heroTitle);
        formData.append('heroDescription', content.heroDescription);
        formData.append('benefits', content.benefits.join('\n'));
        formData.append('whyUsText', content.whyUsText);
        formData.append('whatsappNumber', content.whatsappNumber);
        formData.append('whatsappMessage', content.whatsappMessage);
        formData.append('stats', JSON.stringify(content.stats));
        formData.append('packages', JSON.stringify(content.packages));
        formData.append('faqs', JSON.stringify(content.faqs));

        await updateServicePageContent(formData);
        alert('İçerik güncellendi!');
    };

    if (loading) return <div>Yükleniyor...</div>;

    return (
        <div className="container mx-auto max-w-4xl p-6">
            <h1 className="text-2xl font-bold mb-6">Hizmet Sayfası İçerik Yönetimi</h1>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Hero Section */}
                <section className="bg-white p-6 rounded-xl shadow border">
                    <h2 className="text-lg font-bold mb-4 border-b pb-2 text-purple-700">Giriş Alanı (Hero)</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Büyük Başlık</label>
                            <input name="heroTitle" value={content.heroTitle} onChange={handleChange} className="w-full border p-2 rounded" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Alt Açıklama</label>
                            <textarea name="heroDescription" value={content.heroDescription} onChange={handleChange} className="w-full border p-2 rounded" rows={3} />
                        </div>
                    </div>
                </section>

                {/* Benefits */}
                <section className="bg-white p-6 rounded-xl shadow border">
                    <h2 className="text-lg font-bold mb-4 border-b pb-2 text-purple-700">Hizmet Faydaları ve Biz</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Faydalar (Her satıra bir özellik)</label>
                            <textarea
                                value={content.benefits.join('\n')}
                                onChange={(e) => setContent({ ...content, benefits: e.target.value.split('\n') })}
                                className="w-full border p-2 rounded"
                                rows={6}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Neden Biz? (Kısa Metin)</label>
                            <textarea name="whyUsText" value={content.whyUsText} onChange={handleChange} className="w-full border p-2 rounded" rows={3} />
                        </div>
                    </div>
                </section>

                {/* Packages */}
                <section className="bg-white p-6 rounded-xl shadow border">
                    <div className="flex justify-between items-center mb-4 border-b pb-2">
                        <h2 className="text-lg font-bold text-purple-700">Paketler</h2>
                        <button type="button" onClick={() => addItem('packages', { id: Date.now().toString(), name: 'Yeni Paket', features: ['Özellik 1'], priceDescription: 'Fiyat' })} className="text-sm bg-gray-100 px-3 py-1 rounded hover:bg-gray-200 flex items-center gap-1"><FaPlus /> Ekle</button>
                    </div>
                    <div className="space-y-6">
                        {content.packages.map((pkg: any, idx: number) => (
                            <div key={idx} className="bg-gray-50 p-4 rounded border">
                                <div className="flex justify-between mb-2">
                                    <input value={pkg.name} onChange={(e) => handleArrayChange(idx, 'packages', e.target.value, 'name')} className="font-bold bg-transparent border-b outline-none w-1/2" />
                                    <button type="button" onClick={() => removeItem('packages', idx)} className="text-red-500"><FaTrash /></button>
                                </div>
                                <input value={pkg.priceDescription} onChange={(e) => handleArrayChange(idx, 'packages', e.target.value, 'priceDescription')} className="text-sm text-gray-500 bg-transparent border-b outline-none w-full mb-2" placeholder="Fiyat / Açıklama" />
                                <div>
                                    <label className="text-xs text-gray-400 block">Özellikler (Virgül ile ayırın)</label>
                                    <textarea
                                        value={pkg.features.join(', ')}
                                        onChange={(e) => {
                                            const newFeatures = e.target.value.split(',').map((s: string) => s.trim());
                                            const newPackages = [...content.packages];
                                            newPackages[idx].features = newFeatures;
                                            setContent({ ...content, packages: newPackages });
                                        }}
                                        className="w-full text-sm p-2 border rounded mt-1"
                                        rows={2}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* FAQs */}
                <section className="bg-white p-6 rounded-xl shadow border">
                    <div className="flex justify-between items-center mb-4 border-b pb-2">
                        <h2 className="text-lg font-bold text-purple-700">Sıkça Sorulan Sorular</h2>
                        <button type="button" onClick={() => addItem('faqs', { id: Date.now().toString(), question: 'Soru?', answer: 'Cevap...' })} className="text-sm bg-gray-100 px-3 py-1 rounded hover:bg-gray-200 flex items-center gap-1"><FaPlus /> Ekle</button>
                    </div>
                    <div className="space-y-4">
                        {content.faqs.map((faq: any, idx: number) => (
                            <div key={idx} className="bg-gray-50 p-4 rounded border flex gap-4">
                                <div className="flex-1 space-y-2">
                                    <input value={faq.question} onChange={(e) => handleArrayChange(idx, 'faqs', e.target.value, 'question')} className="w-full border p-2 rounded text-sm font-semibold" placeholder="Soru" />
                                    <textarea value={faq.answer} onChange={(e) => handleArrayChange(idx, 'faqs', e.target.value, 'answer')} className="w-full border p-2 rounded text-sm" rows={2} placeholder="Cevap" />
                                </div>
                                <button type="button" onClick={() => removeItem('faqs', idx)} className="text-red-500 self-start mt-2"><FaTrash /></button>
                            </div>
                        ))}
                    </div>
                </section>

                {/* WhatsApp */}
                <section className="bg-white p-6 rounded-xl shadow border">
                    <h2 className="text-lg font-bold mb-4 border-b pb-2 text-purple-700">WhatsApp Ayarları</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Numara (90 ile başlayın)</label>
                            <input name="whatsappNumber" value={content.whatsappNumber} onChange={handleChange} className="w-full border p-2 rounded" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Varsayılan Mesaj</label>
                            <input name="whatsappMessage" value={content.whatsappMessage} onChange={handleChange} className="w-full border p-2 rounded" />
                        </div>
                    </div>
                </section>

                <button type="submit" className="w-full bg-purple-700 text-white font-bold py-4 rounded-xl hover:bg-purple-800 shadow-lg flex items-center justify-center gap-2">
                    <FaSave /> Kaydet ve Yayınla
                </button>
            </form>
        </div>
    );
}
