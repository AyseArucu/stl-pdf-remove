import { verifyEmail } from '@/app/actions';
import Link from 'next/link';
import { FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

export default async function VerifyEmailPage({ searchParams }: { searchParams: { token?: string } }) {
    const token = searchParams.token;

    if (!token) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full">
                    <FaExclamationTriangle className="text-yellow-500 text-5xl mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Geçersiz Bağlantı</h1>
                    <p className="text-gray-600 mb-6">Doğrulama bağlantısı hatalı veya eksik.</p>
                    <Link href="/" className="inline-block bg-gray-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors">
                        Anasayfaya Dön
                    </Link>
                </div>
            </div>
        );
    }

    const result = await verifyEmail(token);
    const success = result.success;

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full">
                {success ? (
                    <>
                        <FaCheckCircle className="text-green-500 text-5xl mx-auto mb-4" />
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Hesabınız Doğrulandı!</h1>
                        <p className="text-gray-600 mb-6">E-posta adresiniz başarıyla doğrulandı. Artık giriş yapabilir ve indirme yapabilirsiniz.</p>
                        <Link href="/login" className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors">
                            Giriş Yap
                        </Link>
                    </>
                ) : (
                    <>
                        <FaExclamationTriangle className="text-red-500 text-5xl mx-auto mb-4" />
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Doğrulama Başarısız</h1>
                        <p className="text-gray-600 mb-6">Doğrulama bağlantısı geçersiz veya süresi dolmuş.</p>
                        <Link href="/login" className="inline-block bg-gray-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors">
                            Giriş Yap
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
}
