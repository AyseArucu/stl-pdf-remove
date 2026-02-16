import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import ProductForm from '@/components/admin/ProductForm';

export default async function NewProductPage() {
    const session = cookies().get('user_session');
    if (!session) {
        redirect('/erashu/admin/login');
    }

    const categories = await prisma.category.findMany();

    return (
        <main className="container">
            <header className="header" style={{ marginBottom: '2rem' }}>
                <h1 className="title">Yeni Ürün Ekle</h1>
                <Link href="/erashu/admin/products" className="btn" style={{ backgroundColor: 'var(--secondary)' }}>
                    ← Ürünlere Dön
                </Link>
            </header>

            <div style={{
                backgroundColor: 'white',
                padding: '2rem',
                borderRadius: '12px',
                border: '1px solid var(--border)',
                maxWidth: '800px',
                margin: '0 auto'
            }}>
                <ProductForm categories={categories} />
            </div>
        </main>
    );
}
