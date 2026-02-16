'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { verifyQrPassword } from '@/app/actions/qr'; // We'll need to update imports
import { Lock } from 'lucide-react';
import Image from 'next/image';

export default function PasswordPage({ params }: { params: { id: string } }) {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const result = await verifyQrPassword(params.id, password);

        if (result.success) {
            router.refresh();
        } else {
            setError('Hatalı şifre, lütfen tekrar deneyin.');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 space-y-8">
                <div className="text-center">
                    <div className="bg-orange-100 p-4 rounded-full inline-block mb-4">
                        <Lock size={48} className="text-orange-500" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800">Şifre Korumalı İçerik</h1>
                    <p className="text-gray-500 mt-2">Bu içeriği görüntülemek için şifre girmeniz gerekmektedir.</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Şifre</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                            placeholder="••••••••"
                        />
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-black transition-colors shadow-lg disabled:opacity-70 flex justify-center items-center"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : 'Giriş Yap'}
                    </button>

                    {/* Visual cue that it won't open if wrong */}
                    <p className="text-xs text-center text-gray-400">Yanlış şifre girerseniz sayfa açılmaz.</p>
                </form>
            </div>
        </div>
    );
}
