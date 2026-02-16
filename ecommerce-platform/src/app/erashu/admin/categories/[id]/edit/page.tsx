import { prisma } from '@/lib/prisma';
import { updateCategory } from '@/app/actions';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect, notFound } from 'next/navigation';

interface PageProps {
    params: {
        id: string;
    };
}

export default async function EditCategoryPage({ params }: PageProps) {
    const session = cookies().get('user_session');
    if (!session) {
        redirect('/erashu/admin/login');
    }

    const category = await prisma.category.findUnique({
        where: { id: params.id }
    });

    if (!category) {
        notFound();
    }

    return (
        <main className="container">
            <header className="header" style={{ marginBottom: '2rem' }}>
                <h1 className="title">Kategoriyi Düzenle</h1>
                <Link href="/admin/categories" className="btn" style={{ backgroundColor: 'var(--secondary)' }}>
                    ← Kategorilere Dön
                </Link>
            </header>

            <div style={{
                backgroundColor: 'white',
                padding: '2rem',
                borderRadius: '12px',
                border: '1px solid var(--border)',
                maxWidth: '600px',
                margin: '0 auto'
            }}>
                <form action={updateCategory} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <input type="hidden" name="id" value={category.id} />

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Kategori Adı</label>
                        <input
                            name="name"
                            type="text"
                            defaultValue={category.name}
                            required
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border)' }}
                        />
                    </div>

                    <button type="submit" className="btn" style={{ marginTop: '1rem', width: '100%', fontSize: '1.1rem' }}>
                        Değişiklikleri Kaydet
                    </button>
                </form>
            </div>
        </main>
    );
}
