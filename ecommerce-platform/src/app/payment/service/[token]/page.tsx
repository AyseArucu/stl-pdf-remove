
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import ServicePaymentForm from './ServicePaymentForm';

interface PageProps {
    params: {
        token: string;
    }
}

export default async function ServicePaymentPage({ params }: { params: Promise<{ token: string }> }) {
    const { token } = await params;
    const request = await prisma.serviceRequest.findFirst({
        where: { paymentToken: token }
    });

    if (!request) {
        notFound();
    }

    if (request.status === 'APPROVED' || request.status === 'COMPLETED') {
        return (
            <div className="container mx-auto py-12 px-4 text-center">
                <div className="bg-green-50 text-green-800 p-8 rounded-xl inline-block max-w-lg">
                    <h1 className="text-2xl font-bold mb-4">Ödeme Zaten Yapıldı</h1>
                    <p>Bu hizmet talebi için ödeme zaten başarıyla tamamlanmıştır.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Summary */}
                <div className="bg-white p-6 rounded-xl shadow-sm h-fit">
                    <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-4">Hizmet Detayları</h2>
                    <div className="space-y-4">
                        <div>
                            <span className="text-sm text-gray-500 block">Hizmet Türü</span>
                            <span className="font-medium text-lg">Web Tasarım ({request.siteType})</span>
                        </div>
                        <div>
                            <span className="text-sm text-gray-500 block">Sayfa Sayısı</span>
                            <span className="font-medium">{request.pageCount}</span>
                        </div>
                        {request.offerDescription && (
                            <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-800">
                                {request.offerDescription}
                            </div>
                        )}
                        <div className="pt-4 border-t flex justify-between items-center">
                            <span className="text-gray-600 font-bold">Toplam Tutar</span>
                            <span className="text-2xl font-bold text-purple-700">{request.offerPrice} TL</span>
                        </div>
                    </div>
                </div>

                {/* Payment Form */}
                <div className="bg-white p-6 rounded-xl shadow-sm">
                    <h2 className="text-xl font-bold text-gray-800 mb-6">Kart Bilgileri</h2>
                    <ServicePaymentForm
                        token={token}
                        amount={request.offerPrice || 0}
                        requestName={request.siteType}
                    />
                </div>
            </div>
        </div>
    );
}
