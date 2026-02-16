'use client';

import { useState } from 'react';
import { processServicePayment } from '@/app/actions/service-actions';
import { useRouter } from 'next/navigation';

export default function ServicePaymentForm({ token, amount, requestName }: { token: string, amount: number, requestName: string }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    async function handlePayment(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Mock card info
        const cardInfo = {
            number: '0000',
            expiry: '00/00',
            cvc: '000'
        };

        const result = await processServicePayment(token, cardInfo);

        if (result.success) {
            alert('Ödeme başarıyla alındı! Siparişiniz oluşturuldu.');
            router.push('/custom-site/success'); // Create this or redirect home
        } else {
            setError(result.message || 'Ödeme sırasında hata oluştu.');
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handlePayment} className="space-y-4">
            {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded text-sm mb-4">
                    {error}
                </div>
            )}

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kart Sahibi</label>
                <input type="text" required className="w-full border rounded-lg p-3 outline-none focus:border-purple-600" placeholder="Ad Soyad" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kart Numarası</label>
                <input type="text" required className="w-full border rounded-lg p-3 outline-none focus:border-purple-600" placeholder="0000 0000 0000 0000" />
            </div>
            <div className="flex gap-4">
                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">SKT</label>
                    <input type="text" required className="w-full border rounded-lg p-3 outline-none focus:border-purple-600" placeholder="AA/YY" />
                </div>
                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">CVC</label>
                    <input type="text" required className="w-full border rounded-lg p-3 outline-none focus:border-purple-600" placeholder="123" />
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-purple-600 text-white font-bold py-4 rounded-lg mt-4 hover:bg-purple-700 transition-colors"
            >
                {loading ? 'İşleniyor...' : `Ödeme Yap (${amount} TL)`}
            </button>
            <p className="text-xs text-center text-gray-500 mt-4">
                Güvenli Ödeme Altyapısı ile korunmaktadır.
            </p>
        </form>
    );
}
