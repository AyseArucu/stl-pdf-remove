import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import CollectionForm from '@/components/admin/CollectionForm';
import { notFound } from 'next/navigation';

interface PageProps {
    params: {
        id: string;
    };
}

export default async function EditCollectionPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const collection = await prisma.collection.findUnique({
        where: { id },
        include: { products: { select: { id: true } } }
    });

    const products = await prisma.product.findMany({
        select: {
            id: true,
            name: true,
            price: true,
            stock: true,
            imageUrl: true
        }
    });

    if (!collection) {
        notFound();
    }

    // Transform Prisma collection to match what CollectionForm might expect (productIds array)
    // CollectionForm usually expects { ...collection, productIds: [] } if it was built for flat file DB
    const transformedCollection = {
        ...collection,
        productIds: collection.products.map(p => p.id)
    };

    return (
        <div style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>Koleksiyonu Düzenle</h1>
                <Link href="/erashu/admin/collections" className="btn" style={{ backgroundColor: '#6cbd7e' }}>&larr; Listeye Dön</Link>
            </div>

            <CollectionForm products={products as any} initialData={transformedCollection as any} />
        </div>
    );
}
