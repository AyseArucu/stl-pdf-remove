'use client';

import { useState } from 'react';
import { createStlModel, updateStlModel } from '@/app/actions';
import { useRouter } from 'next/navigation';

interface StlTag {
    id: string;
    name: string;
}

interface StlModelData {
    id?: string;
    name: string;
    description: string;
    price: number;
    isFree: boolean;
    imageUrl?: string;
    fileUrl?: string;
    tags?: StlTag[];
}

export default function StlForm({ initialData }: { initialData?: StlModelData }) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    // Initial values
    const [name, setName] = useState(initialData?.name || '');
    const [description, setDescription] = useState(initialData?.description || '');
    const [price, setPrice] = useState(initialData?.price?.toString() || '0');
    const [isFree, setIsFree] = useState(initialData?.isFree || false);

    const initialTags = initialData?.tags?.map(t => t.name).join(', ') || '';
    const [tags, setTags] = useState(initialTags);

    async function handleSubmit(formData: FormData) {
        setIsLoading(true);

        let res;
        if (initialData?.id) {
            // Update
            formData.append('id', initialData.id);
            res = await updateStlModel(formData);
        } else {
            // Create
            res = await createStlModel(formData);
        }

        setIsLoading(false);

        if (res?.success) {
            alert(initialData?.id ? 'Model güncellendi!' : 'Model eklendi!');
            router.push('/erashu/admin/stl-models');
            router.refresh();
        } else {
            alert(res?.error || 'Bir hata oluştu.');
        }
    }

    return (
        <form action={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', backgroundColor: 'white', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border)', maxWidth: '800px', margin: '0 auto' }}>

            {/* Name Input */}
            <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Model Adı</label>
                <input
                    name="name"
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border)' }}
                />
            </div>

            {/* Description Input */}
            <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Açıklama</label>
                <textarea
                    name="description"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    rows={5}
                    required
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border)' }}
                />
            </div>

            {/* Price & Options Group */}
            <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Fiyat (TL)</label>
                    <input
                        name="price"
                        type="number"
                        step="0.01"
                        value={price}
                        onChange={e => setPrice(e.target.value)}
                        disabled={isFree}
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border)', backgroundColor: isFree ? '#f3f4f6' : 'white', cursor: isFree ? 'not-allowed' : 'text' }}
                    />
                </div>

                <div style={{ flex: 1, paddingTop: '2.2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <input
                            name="isFree"
                            type="checkbox"
                            checked={isFree}
                            onChange={(e) => setIsFree(e.target.checked)}
                            id="isFree"
                            style={{ width: '1.2rem', height: '1.2rem' }}
                        />
                        <label htmlFor="isFree" style={{ cursor: 'pointer', fontWeight: 500, userSelect: 'none' }}>
                            Bu model ücretsizdir
                        </label>
                    </div>
                </div>
            </div>

            {/* Tags Input */}
            <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Etiketler (Virgül ile ayırın)</label>
                <input
                    name="tags"
                    type="text"
                    value={tags}
                    onChange={e => setTags(e.target.value)}
                    placeholder="figür, anime, masaüstü"
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border)' }}
                />
            </div>

            {/* File Upload Section - Styled like "Media Upload" */}
            <div style={{ border: '2px dashed var(--border)', padding: '1.5rem', borderRadius: '12px' }}>
                <label style={{ display: 'block', marginBottom: '1.5rem', fontWeight: 600, textAlign: 'center' }}>Dosya Yükleme</label>

                <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>

                    {/* STL File Input */}
                    <div style={{ flex: 1, minWidth: '250px' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>STL Dosyası (.stl)</label>
                        {initialData?.fileUrl && <p style={{ fontSize: '0.8rem', color: '#666', marginBottom: '0.5rem' }}>Mevcut: {initialData.fileUrl.split('/').pop()}</p>}
                        <input
                            name="file"
                            type="file"
                            accept=".stl"
                            required={!initialData}
                            style={{ width: '100%', padding: '0.5rem', background: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' }}
                        />
                    </div>

                    {/* Image File Input */}
                    <div style={{ flex: 1, minWidth: '250px' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Görsel (.jpg, .png)</label>
                        {initialData?.imageUrl && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                <img src={initialData.imageUrl} alt="Preview" style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover' }} />
                                <span style={{ fontSize: '0.8rem', color: '#666' }}>Mevcut Görsel</span>
                            </div>
                        )}
                        <input
                            name="image"
                            type="file"
                            accept="image/*"
                            required={!initialData}
                            style={{ width: '100%', padding: '0.5rem', background: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' }}
                        />
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="btn"
                    style={{ backgroundColor: 'white', color: '#333', border: '1px solid #ddd' }}
                >
                    İptal
                </button>
                <button
                    type="submit"
                    className="btn"
                    disabled={isLoading}
                    style={{ flex: 1, fontSize: '1.1rem' }}
                >
                    {isLoading ? 'İşleniyor...' : (initialData ? 'Modeli Güncelle' : 'Modeli Kaydet')}
                </button>
            </div>
        </form>
    );
}
