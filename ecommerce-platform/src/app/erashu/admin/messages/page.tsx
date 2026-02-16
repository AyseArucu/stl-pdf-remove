import MessageRow from '@/components/admin/MessageRow';
import { prisma } from '@/lib/prisma';
import AdminSearch from '@/components/admin/AdminSearch';

export default async function AdminMessagesPage({ searchParams }: { searchParams: { q?: string } }) {
    const query = searchParams.q?.toLowerCase();

    const where: any = {};
    if (query) {
        where.OR = [
            { name: { contains: query } },
            { email: { contains: query } },
            { subject: { contains: query } },
            { message: { contains: query } }
        ];
    }

    const messages = await prisma.contactMessage.findMany({
        where,
        orderBy: { date: 'desc' }
    });

    return (
        <div style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Gelen Mesajlar</h1>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <AdminSearch placeholder="Mesajlarda ara..." />
                </div>
            </div>

            <div className="card" style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid #eee' }}>
                            <th style={{ padding: '1rem', fontWeight: 600 }}>Tarih</th>
                            <th style={{ padding: '1rem', fontWeight: 600 }}>Gönderen</th>
                            <th style={{ padding: '1rem', fontWeight: 600 }}>E-posta</th>
                            <th style={{ padding: '1rem', fontWeight: 600 }}>Konu</th>
                            <th style={{ padding: '1rem', fontWeight: 600 }}>Mesaj</th>
                            <th style={{ padding: '1rem', fontWeight: 600, textAlign: 'right' }}>İşlemler</th>
                        </tr>
                    </thead>
                    <tbody>
                        {messages.length === 0 ? (
                            <tr>
                                <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>
                                    {query ? 'Aradığınız kriterlere uygun mesaj bulunamadı.' : 'Henüz hiç mesaj yok.'}
                                </td>
                            </tr>
                        ) : (
                            messages.map((msg) => (
                                <MessageRow key={msg.id} msg={msg} />
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
