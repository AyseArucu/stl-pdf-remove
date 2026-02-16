
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { createQuote } from '@/app/actions/service-actions';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export default async function CustomRequestsPage() {
    const session = cookies().get('user_session');
    if (!session) {
        redirect('/erashu/admin/login');
    }

    const requests = await prisma.serviceRequest.findMany({
        orderBy: { createdAt: 'desc' }
    });

    return (
        <div className="container mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Özel Site Talepleri</h1>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="p-4 font-semibold text-gray-600">Tarih</th>
                            <th className="p-4 font-semibold text-gray-600">Müşteri</th>
                            <th className="p-4 font-semibold text-gray-600">Site Türü / Sayfa</th>
                            <th className="p-4 font-semibold text-gray-600">Bütçe</th>
                            <th className="p-4 font-semibold text-gray-600">Durum</th>
                            <th className="p-4 font-semibold text-gray-600">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="p-8 text-center text-gray-400">
                                    Henüz talep bulunmuyor.
                                </td>
                            </tr>
                        ) : (
                            requests.map((req) => (
                                <tr key={req.id} className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="p-4 text-sm text-gray-600">
                                        {new Date(req.createdAt).toLocaleDateString('tr-TR')}
                                    </td>
                                    <td className="p-4">
                                        <div className="font-medium text-gray-900">{req.name}</div>
                                        <div className="text-xs text-gray-500">{req.email}</div>
                                        <div className="text-xs text-gray-500">{req.phone}</div>
                                    </td>
                                    <td className="p-4 text-sm">
                                        <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs font-semibold mr-2">
                                            {req.siteType}
                                        </span>
                                        <span className="text-gray-500">{req.pageCount}</span>
                                    </td>
                                    <td className="p-4 text-sm text-gray-600">
                                        {req.budget || '-'}
                                    </td>
                                    <td className="p-4">
                                        <StatusBadge status={req.status} />
                                    </td>
                                    <td className="p-4">
                                        {/* Simple Detail/Action Area */}
                                        <Link
                                            href={`/erashu/admin/custom-requests/${req.id}`}
                                            className="inline-flex items-center text-purple-600 font-medium hover:text-purple-800 transition-colors bg-purple-50 px-3 py-1.5 rounded-lg hover:bg-purple-100"
                                        >
                                            <span className="mr-1">Detayları Gör</span>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const styles: Record<string, string> = {
        NEW: 'bg-blue-100 text-blue-700',
        REVIEWING: 'bg-yellow-100 text-yellow-700',
        QUOTE_SENT: 'bg-purple-100 text-purple-700',
        APPROVED: 'bg-green-100 text-green-700',
        COMPLETED: 'bg-gray-100 text-gray-700'
    };

    const labels: Record<string, string> = {
        NEW: 'Yeni',
        REVIEWING: 'İnceleniyor',
        QUOTE_SENT: 'Teklif Gönderildi',
        APPROVED: 'Onaylandı',
        COMPLETED: 'Tamamlandı'
    };

    return (
        <span className={`px-2 py-1 rounded text-xs font-medium ${styles[status] || 'bg-gray-100'}`}>
            {labels[status] || status}
        </span>
    );
}
