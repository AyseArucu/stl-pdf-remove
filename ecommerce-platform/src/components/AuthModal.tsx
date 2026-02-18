'use client';

import React from 'react';
import Link from 'next/link';
import { X, Loader2 } from 'lucide-react';
import { useUser } from '@/context/UserContext';
import { loginUserClient } from '@/app/actions/auth-client';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    message?: string;
    redirectUrl?: string;
}

const AuthModal = ({
    isOpen,
    onClose,
    title = "Devam Etmek İçin Giriş Yapın",
    message = "İşleme devam etmek için giriş yapmanız gerekir",
    redirectUrl = "/qr-kod-olusturucu"
}: AuthModalProps) => {
    const [view, setView] = React.useState<'choice' | 'login'>('choice');
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const { setUser } = useUser();

    // Reset view when opened
    React.useEffect(() => {
        if (isOpen) {
            setView('choice');
            setError(null);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);

        try {
            const result = await loginUserClient(formData);
            if (result.success && result.user) {
                // Update Global State
                setUser(result.user as any);
                onClose();
                // Redirect if redirectUrl is provided
                if (redirectUrl) {
                    window.location.href = redirectUrl;
                }
            } else {
                setError(result.message || 'Giriş başarısız.');
            }
        } catch (err) {
            setError('Bir hata oluştu.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-zoom-in relative">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-1 z-10"
                >
                    <X size={24} />
                </button>

                <div className="p-8 text-center">
                    {/* Header Icon */}
                    <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                    </div>

                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                        {title}
                    </h2>

                    {view === 'choice' ? (
                        <>
                            <p className="text-gray-500 mb-8">{message}</p>
                            <div className="space-y-3">
                                <button
                                    onClick={() => setView('login')}
                                    className="block w-full py-3.5 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition-colors shadow-lg hover:shadow-xl transform active:scale-95"
                                >
                                    Giriş Yap
                                </button>
                                <Link
                                    href={`/register?callbackUrl=${encodeURIComponent(typeof window !== 'undefined' ? window.location.pathname : redirectUrl)}`}
                                    className="block w-full py-3.5 bg-gray-50 text-gray-800 font-bold rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors"
                                >
                                    Üye Ol
                                </Link>
                            </div>
                        </>
                    ) : (
                        <form onSubmit={handleLogin} className="space-y-4 text-left">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">E-posta</label>
                                <input name="email" type="email" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" placeholder="ornek@email.com" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Şifre</label>
                                <input name="password" type="password" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" placeholder="••••••••" />
                            </div>

                            {error && <div className="text-red-500 text-sm font-medium bg-red-50 p-2 rounded">{error}</div>}

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full py-3 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-700 transition-colors disabled:opacity-50 flex justify-center"
                                >
                                    {isLoading ? <Loader2 className="animate-spin" /> : 'Giriş Yap'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setView('choice')}
                                    className="w-full mt-2 py-2 text-gray-500 text-sm hover:text-gray-800"
                                >
                                    Geri Dön
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AuthModal;
