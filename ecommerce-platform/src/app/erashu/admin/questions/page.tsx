import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { answerQuestion, deleteQuestion } from '@/app/actions';
import AdminSearch from '@/components/admin/AdminSearch';

export default async function AdminQuestionsPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
    const { q } = await searchParams;
    const query = q?.toLowerCase();

    const where: any = {};
    if (query) {
        where.OR = [
            { userName: { contains: query } },
            { question: { contains: query } },
            { product: { name: { contains: query } } }
        ];
    }

    const questions = await prisma.question.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        include: { product: true }
    });

    return (
        <div style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Soru & Cevap Yönetimi</h1>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <AdminSearch placeholder="Soru, ürün veya kullanıcı ara..." />
                    <Link href="/erashu/admin" className="btn" style={{ backgroundColor: '#6cbd7e' }}>&larr; Panele Dön</Link>
                </div>
            </div>

            <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ backgroundColor: '#f9fafb' }}>
                        <tr>
                            <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.9rem', color: '#666' }}>Ürün ID</th>
                            <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.9rem', color: '#666' }}>Kullanıcı</th>
                            <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.9rem', color: '#666', width: '30%' }}>Soru</th>
                            <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.9rem', color: '#666', width: '30%' }}>Cevap</th>
                            <th style={{ padding: '1rem', textAlign: 'right', fontSize: '0.9rem', color: '#666' }}>İşlem</th>
                        </tr>
                    </thead>
                    <tbody>
                        {questions.length === 0 ? (
                            <tr>
                                <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: '#999' }}>
                                    {query ? 'Aradığınız kriterlere uygun soru bulunamadı.' : 'Henüz soru sorulmamış.'}
                                </td>
                            </tr>
                        ) : (
                            questions.map(q => {
                                const productName = q.product ? q.product.name : 'Silinmiş Ürün';

                                return (
                                    <tr key={q.id} style={{ borderTop: '1px solid #eee' }}>
                                        <td style={{ padding: '1rem', fontSize: '0.85rem' }}>
                                            <div style={{ fontWeight: 'bold' }}>{productName}</div>
                                            <div style={{ color: '#999' }}>{q.productId.substring(0, 8)}...</div>
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <div style={{ fontWeight: '500' }}>{q.userName}</div>
                                            <div style={{ fontSize: '0.8rem', color: '#999' }}>{new Date(q.createdAt).toLocaleDateString('tr-TR')}</div>
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <p style={{ margin: 0 }}>{q.question}</p>
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <form action={answerQuestion} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                                <input type="hidden" name="id" value={q.id} />
                                                <textarea
                                                    name="answer"
                                                    defaultValue={q.answer || ''}
                                                    placeholder="Cevap yaz..."
                                                    rows={3}
                                                    style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd', fontSize: '0.9rem' }}
                                                ></textarea>
                                                <button
                                                    type="submit"
                                                    className="btn"
                                                    style={{
                                                        alignSelf: 'flex-start',
                                                        padding: '4px 12px',
                                                        fontSize: '0.85rem',
                                                        backgroundColor: q.answer ? '#3b82f6' : '#10b981'
                                                    }}
                                                >
                                                    {q.answer ? 'Cevabı Güncelle' : 'Cevapla & Yayınla'}
                                                </button>
                                            </form>
                                        </td>
                                        <td style={{ padding: '1rem', textAlign: 'right' }}>
                                            <form action={deleteQuestion}>
                                                <input type="hidden" name="id" value={q.id} />
                                                <button
                                                    type="submit"
                                                    style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}
                                                // Note: We cannot use onClick confirm in server actions forms easily without client component or preventing default.
                                                // Since this is becoming a server component, we accept the limitation or move to client component for interactivity.
                                                // For now, keeping as is, but removing onClick alert as it won't work in server component efficiently if not handled.
                                                // Actually, we can keep it if we don't mind it not working or use a client wrapper for delete button.
                                                // Given the constraint, I'll remove the onClick confirm for now or let it be (it won't execute in server render).
                                                // Wait, this is a server component, `onClick` handler will NOT work.
                                                // I will remove the onClick handler for now to avoid confusion.
                                                >
                                                    Sil
                                                </button>
                                            </form>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
