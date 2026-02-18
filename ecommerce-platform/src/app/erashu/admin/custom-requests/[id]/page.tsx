import { prisma } from '@/lib/prisma';
import { createQuote } from '@/app/actions/service-actions';
import { redirect, notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import Link from 'next/link';

export default async function RequestDetailPage({ params }: { params: { id: string } }) {
    const session = (await cookies()).get('user_session');
    if (!session) {
        redirect('/erashu/admin/login');
    }

    const request = await prisma.serviceRequest.findUnique({
        where: { id: params.id }
    });

    if (!request) {
        notFound();
    }

    return (
        <div className="container mx-auto p-6">
            <div className="mb-6 flex items-center justify-between">
                <Link href="/erashu/admin/custom-requests" className="text-gray-600 hover:text-gray-900 flex items-center group">
                    <span className="mr-2 group-hover:-translate-x-1 transition-transform">←</span> Listeye Dön
                </Link>
                <div className="text-sm text-gray-500">
                    Talep Tarihi: {new Date(request.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="bg-gray-50 p-6 border-b border-gray-100">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800 mb-2">Talep Detayı</h1>
                            <StatusBadge status={request.status} />
                        </div>
                        <div className="text-right">
                            {/* Optional header actions */}
                        </div>
                    </div>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Customer Info */}
                    <div>
                        <h2 className="text-lg font-bold text-purple-800 mb-4 border-b pb-2 flex items-center">
                            Müşteri Bilgileri
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Ad Soyad</label>
                                <div className="text-gray-900 font-medium text-lg">{request.name}</div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">E-posta</label>
                                <a href={`mailto:${request.email}`} className="text-blue-600 hover:underline flex items-center">
                                    {request.email}
                                </a>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Telefon</label>
                                <a href={`tel:${request.phone}`} className="text-blue-600 hover:underline flex items-center">
                                    {request.phone}
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Project Details */}
                    <div>
                        <h2 className="text-lg font-bold text-purple-800 mb-4 border-b pb-2">Proje Detayları</h2>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Site Türü</label>
                                    <div className="text-gray-900 bg-purple-50 px-3 py-1 rounded inline-block font-medium">{request.siteType}</div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Sayfa Sayısı</label>
                                    <div className="text-gray-900 font-medium">{request.pageCount}</div>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Bütçe Beklentisi</label>
                                <div className="text-gray-900 font-medium">{request.budget || 'Belirtilmedi'}</div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Özel İstekler / Notlar</label>
                                <div className="p-4 bg-yellow-50 rounded-lg text-gray-700 text-sm whitespace-pre-wrap border border-yellow-100">
                                    {request.specialRequests || 'Ekstra not bulunmuyor.'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quote Section */}
                <div className="p-6 bg-gray-50 border-t border-gray-100">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">Teklif & İşlemler</h2>

                    {request.status === 'NEW' || request.status === 'REVIEWING' ? (
                        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                            <h3 className="font-semibold text-gray-700 mb-4 border-b pb-2">Teklif Oluştur</h3>
                            <form action={createQuote as any} className="space-y-4">
                                <input type="hidden" name="requestId" value={request.id} />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Teklif Edilen Fiyat (TL)</label>
                                        <div className="relative">
                                            <input name="offerPrice" type="number" required placeholder="0.00" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none pl-8" />
                                            <span className="absolute left-3 top-2 text-gray-400">₺</span>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Teklif Açıklaması</label>
                                    <textarea name="offerDescription" required rows={4} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" placeholder="Fiyata dahil olan hizmetler, teslimat süresi vb. detayları yazınız..."></textarea>
                                </div>
                                <div className="pt-2">
                                    <button type="submit" className="bg-purple-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-purple-700 transition-colors shadow-lg shadow-purple-200">
                                        Teklifi Gönder ve Onayla
                                    </button>
                                    <p className="text-xs text-gray-500 mt-2">Teklif gönderildiğinde müşteriye otomatik bilgilendirme yapılacaktır.</p>
                                </div>
                            </form>
                        </div>
                    ) : (
                        <div className="bg-green-50 p-6 rounded-lg border border-green-100 shadow-sm">
                            <div className="flex items-center mb-4">
                                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-bold text-green-800 text-lg">Teklif Başarıyla Oluşturuldu</h3>
                                    <p className="text-green-600 text-sm">Müşteriye teklif detayları iletilmiştir.</p>
                                </div>
                            </div>

                            <div className="bg-white p-4 rounded border border-green-100 grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Verilen Fiyat</label>
                                    <div className="text-2xl font-bold text-gray-800">{request.offerPrice} <span className="text-sm font-normal text-gray-500">TL</span></div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Açıklama</label>
                                    <div className="text-gray-700">{request.offerDescription}</div>
                                </div>
                            </div>

                            {request.paymentToken && (
                                <div className="mt-4 pt-4 border-t border-green-200/50">
                                    <label className="block text-xs font-bold text-green-700 uppercase tracking-wide mb-2">Ödeme Sayfası Bağlantısı</label>
                                    <div className="flex items-center space-x-2">
                                        <code className="flex-1 bg-white p-3 rounded border border-green-200 text-sm text-gray-600 break-all font-mono">
                                            {process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/payment/service/{request.paymentToken}
                                        </code>
                                    </div>
                                    <p className="text-xs text-green-600 mt-2">Bu linki müşteriye ileterek ödeme alabilirsiniz.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const styles: Record<string, string> = {
        NEW: 'bg-blue-100 text-blue-700 border-blue-200',
        REVIEWING: 'bg-yellow-100 text-yellow-700 border-yellow-200',
        QUOTE_SENT: 'bg-purple-100 text-purple-700 border-purple-200',
        APPROVED: 'bg-green-100 text-green-700 border-green-200',
        COMPLETED: 'bg-gray-100 text-gray-700 border-gray-200'
    };

    const labels: Record<string, string> = {
        NEW: 'Yeni Talep',
        REVIEWING: 'İnceleniyor',
        QUOTE_SENT: 'Teklif Gönderildi',
        APPROVED: 'Onaylandı',
        COMPLETED: 'Tamamlandı'
    };

    return (
        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${styles[status] || 'bg-gray-100 border-gray-200'}`}>
            {labels[status] || status}
        </span>
    );
}
