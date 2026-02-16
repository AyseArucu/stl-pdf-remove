import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import CollectionForm from '@/components/admin/CollectionForm';

export default async function NewCollectionPage() {
    const products = await prisma.product.findMany({
        select: {
            id: true,
            name: true,
            price: true,
            stock: true,
            imageUrl: true
        }
    });

    return (
        <div style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>Yeni Koleksiyon Oluştur</h1>
                <Link href="/erashu/admin/collections" className="btn" style={{ backgroundColor: '#6cbd7e' }}>&larr; Listeye Dön</Link>
            </div>

            <CollectionForm products={products as any} />
        </div>
    );
}
