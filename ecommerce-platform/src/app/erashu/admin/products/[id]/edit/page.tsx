import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import ProductForm from '@/components/admin/ProductForm';

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = (await cookies()).get('user_session');
    if (!session) {
        redirect('/erashu/admin/login');
    }

    const product = await prisma.product.findUnique({
        where: { id },
        include: {
            options: true,
            features: true,
            media: true
        }
    });
    const categories = await prisma.category.findMany();

    if (!product) {
        notFound();
    }

    return (
        <main className="container">
            <header className="header" style={{ marginBottom: '2rem' }}>
                <h1 className="title">Ürünü Düzenle: {product.name}</h1>
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
                <ProductForm initialData={product} categories={categories} isEdit={true} />
            </div>
        </main>
    );
}
