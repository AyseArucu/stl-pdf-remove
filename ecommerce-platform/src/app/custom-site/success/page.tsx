import Link from 'next/link';

export default function CustomSiteSuccessPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="bg-white p-12 rounded-2xl shadow-xl max-w-lg text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-4xl text-green-600">✓</span>
                </div>
                <h1 className="text-3xl font-bold mb-4 text-[#333]">Siparişiniz Oluşturuldu!</h1>
                <p className="text-gray-600 mb-8 text-lg">
                    Ödemeniz başarıyla alındı ve projeniz onaylandı. Ekibimiz sizinle en kısa sürede iletişime geçerek tasarım sürecini başlatacak.
                </p>
                <div className="flex gap-4 justify-center">
                    <Link href="/" className="bg-[#65216e] text-white px-8 py-3 rounded-full font-bold hover:bg-[#501a57] transition-colors">
                        Anasayfa
                    </Link>
                    <Link href="/account" className="bg-gray-100 text-gray-700 px-8 py-3 rounded-full font-bold hover:bg-gray-200 transition-colors">
                        Siparişlerim
                    </Link>
                </div>
            </div>
        </div>
    );
}
