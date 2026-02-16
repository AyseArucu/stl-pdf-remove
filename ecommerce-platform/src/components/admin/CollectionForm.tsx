'use client';

import { createCollection, updateCollection, uploadFile } from '@/app/actions';
import { Product, Collection } from '@/lib/db';
import { useState } from 'react';

type Props = {
    products: Product[];
    initialData?: Collection & { productIds?: string[] };
};

export default function CollectionForm({ products, initialData }: Props) {
    const [selectedProductIds, setSelectedProductIds] = useState<Set<string>>(new Set(initialData?.productIds || []));
    const [uploading, setUploading] = useState(false);
    const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || '');

    const toggleProduct = (id: string) => {
        const newSet = new Set(selectedProductIds);
        if (newSet.has(id)) {
            newSet.delete(id);
        } else {
            newSet.add(id);
        }
        setSelectedProductIds(newSet);
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return;
        setUploading(true);
        const formData = new FormData();
        formData.append('file', e.target.files[0]);
        try {
            const url = await uploadFile(formData);
            setImageUrl(url);
        } catch (error) {
            console.error('Upload failed', error);
            alert('Resim yüklenirken hata oluştu.');
        } finally {
            setUploading(false);
        }
    };

    // Filter products for search could be added here, currently just list all

    return (
        <form action={createCollection} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '800px', margin: '0 auto' }}>
            <input type="hidden" name="productIds" value={JSON.stringify(Array.from(selectedProductIds))} />
            <input type="hidden" name="imageUrl" value={imageUrl} />

            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1rem' }}>Temel Bilgiler</h2>

                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Koleksiyon Başlığı</label>
                    <input type="text" name="title" required style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #ddd' }} />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Özel URL (Slug) - Opsiyonel</label>
                    <input type="text" name="slug" placeholder="ornek-koleksiyon-slug" style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #ddd' }} />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Açıklama</label>
                    <textarea name="description" rows={3} style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #ddd' }}></textarea>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input type="checkbox" name="isActive" id="isActive" defaultChecked style={{ width: '1.2rem', height: '1.2rem' }} />
                    <label htmlFor="isActive" style={{ fontWeight: '500', cursor: 'pointer' }}>Yayında</label>
                </div>
            </div>

            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1rem' }}>Kapak Görseli</h2>
                <div style={{ border: '2px dashed #ddd', padding: '1.5rem', borderRadius: '8px', textAlign: 'center' }}>
                    {imageUrl ? (
                        <div style={{ marginBottom: '1rem' }}>
                            <img src={imageUrl} alt="Kapak" style={{ maxHeight: '200px', margin: '0 auto', borderRadius: '4px' }} />
                            <button type="button" onClick={() => setImageUrl('')} style={{ color: 'red', marginTop: '0.5rem', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Görseli Kaldır</button>
                        </div>
                    ) : (
                        <>
                            <input type="file" onChange={handleImageUpload} accept="image/*" style={{ display: 'none' }} id="cover-upload" />
                            <label htmlFor="cover-upload" className="btn" style={{ cursor: 'pointer', backgroundColor: '#e2e8f0', color: '#1e293b' }}>
                                {uploading ? 'Yükleniyor...' : 'Görsel Seç'}
                            </label>
                        </>
                    )}
                </div>
            </div>

            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1rem' }}>Ürün Seçimi ({selectedProductIds.size} Seçili)</h2>
                <div style={{ maxHeight: '400px', overflowY: 'auto', border: '1px solid #eee', borderRadius: '6px' }}>
                    {products.map(product => (
                        <label key={product.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem', borderBottom: '1px solid #f3f4f6', cursor: 'pointer', backgroundColor: selectedProductIds.has(product.id) ? '#f0fdf4' : 'transparent' }}>
                            <input
                                type="checkbox"
                                checked={selectedProductIds.has(product.id)}
                                onChange={() => toggleProduct(product.id)}
                                style={{ width: '1.2rem', height: '1.2rem' }}
                            />
                            <div style={{ width: '40px', height: '40px', backgroundColor: '#eee', borderRadius: '4px', overflow: 'hidden' }}>
                                <img src={product.imageUrl} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: '500' }}>{product.name}</div>
                                <div style={{ fontSize: '0.8rem', color: '#666' }}>Stok: {product.stock} | Fiyat: {product.price} TL</div>
                            </div>
                        </label>
                    ))}
                </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ padding: '1rem', fontSize: '1.1rem' }}>
                {initialData ? 'Koleksiyonu Güncelle' : 'Koleksiyonu Oluştur'}
            </button>
        </form>
    );
}
