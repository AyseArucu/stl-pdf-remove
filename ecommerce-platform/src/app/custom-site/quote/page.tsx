'use client';

import { submitServiceRequest } from '@/app/actions/service-actions';
import { useState } from 'react';

export default function QuotePage() {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);
        setError('');

        const formData = new FormData(event.currentTarget);
        const result = await submitServiceRequest(formData);

        if (result.success) {
            setSuccess(true);
        } else {
            setError(result.message || 'Bir hata oluştu.');
        }
        setLoading(false);
    }

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="text-3xl text-green-600">✓</span>
                    </div>
                    <h2 className="text-2xl font-bold mb-4 text-[#333]">Talebiniz Alındı!</h2>
                    <p className="text-gray-600 mb-8">
                        Bilgilerinizi başarıyla aldık. Ekibimiz incelip en kısa sürede sizinle iletişime geçecek.
                    </p>
                    <a href="/" className="inline-block bg-[#65216e] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#501a57] transition-colors">
                        Anasayfaya Dön
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-[#65216e] p-6 text-white text-center">
                    <h1 className="text-2xl font-bold">Web Tasarım Teklif Formu</h1>
                    <p className="opacity-90 text-sm mt-2">Hayalinizdeki site için ilk adımı atın</p>
                </div>

                <div className="p-8">
                    {error && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Ad Soyad *</label>
                                <input name="name" required type="text" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#65216e] focus:border-transparent outline-none transition-all" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">E-posta *</label>
                                <input name="email" required type="email" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#65216e] focus:border-transparent outline-none transition-all" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Telefon *</label>
                                <input name="phone" required type="tel" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#65216e] focus:border-transparent outline-none transition-all" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Site Türü *</label>
                                <select name="siteType" required className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#65216e] focus:border-transparent outline-none transition-all appearance-none bg-white">
                                    <option value="">Seçiniz</option>
                                    <option value="CORPORATE">Kurumsal Site</option>
                                    <option value="ECOMMERCE">E-Ticaret Sitesi</option>
                                    <option value="PORTFOLIO">Portföy / Kişisel</option>
                                    <option value="BLOG">Blog / Haber</option>
                                    <option value="OTHER">Diğer</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Tahmini Sayfa Sayısı</label>
                                <select name="pageCount" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#65216e] focus:border-transparent outline-none transition-all appearance-none bg-white">
                                    <option value="1-5">1-5 Sayfa</option>
                                    <option value="5-10">5-10 Sayfa</option>
                                    <option value="10-20">10-20 Sayfa</option>
                                    <option value="20+">20+ Sayfa</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Bütçe Aralığı (Opsiyonel)</label>
                                <input name="budget" type="text" placeholder="Örn: 10.000 - 20.000 TL" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#65216e] focus:border-transparent outline-none transition-all" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Özel İstekleriniz & Notlar</label>
                            <textarea name="specialRequests" rows={4} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#65216e] focus:border-transparent outline-none transition-all"></textarea>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#65216e] text-white font-bold py-4 rounded-lg hover:bg-[#501a57] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Gönderiliyor...' : 'Teklif İste'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
