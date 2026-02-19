'use client';

import { createProduct, updateProduct, uploadFile } from '@/app/actions';
import { useState } from 'react';
import { Category, Product } from '@/lib/db';

type Props = {
    categories: Category[];
    initialData?: Product & {
        options?: import('@/lib/db').ProductOption[];
        features?: import('@/lib/db').ProductFeature[];
        media?: any;
        subcategoryIds?: string[];
    };
    isEdit?: boolean;
};

type MediaItem = {
    type: 'image' | 'video';
    url: string;
    thumbnail?: string;
};

export default function ProductForm({ categories, initialData, isEdit = false }: Props) {
    const [uploading, setUploading] = useState(false);
    const [mediaItems, setMediaItems] = useState<MediaItem[]>(initialData?.media || []);
    const [selectedCategoryId, setSelectedCategoryId] = useState(initialData?.categoryId || '');
    const [selectedSubIds, setSelectedSubIds] = useState<string[]>(initialData?.subcategoryIds || []);
    const [options, setOptions] = useState<import('@/lib/db').ProductOption[]>(initialData?.options || []);

    // Initialize color state properly handling undefined or string legacy (though db.ts changed, legacy data might be string? assume empty object if not present)
    const initialColor = initialData?.color && typeof initialData.color === 'object' ? initialData.color : { name: '', hex: '#000000' };
    const [color, setColor] = useState<{ name: string, hex: string }>(initialColor);
    const [features, setFeatures] = useState<{ title: string; description: string }[]>(initialData?.features || []);

    // Filter categories
    const mainCategories = categories.filter(c => !c.parentId);
    const availableSubCategories = categories.filter(c => c.parentId === selectedCategoryId);

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCategoryId(e.target.value);
        setSelectedSubIds([]); // Reset subcategories when main category changes
    };

    const handleSubCategoryChange = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
        if (e.target.checked) {
            setSelectedSubIds(prev => [...prev, id]);
        } else {
            setSelectedSubIds(prev => prev.filter(sid => sid !== id));
        }
    };

    // Fallback for string images
    if (initialData?.imageUrl && mediaItems.length === 0 && !isEdit) {
        // Don't auto-fill for now, let users add new media
    } else if (initialData?.imageUrl && mediaItems.length === 0 && isEdit) {
        // Auto populate for existing legacy products if needed, but risky for hydration.
        // Let's assume initialData.media handles it or user manually adds.
    }

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return;

        setUploading(true);
        const files = Array.from(e.target.files);

        try {
            for (const file of files) {
                const formData = new FormData();
                formData.append('file', file);

                const url = await uploadFile(formData);
                const type = file.type.startsWith('video') ? 'video' : 'image';

                setMediaItems(prev => [...prev, { type, url }]);
            }
        } catch (error: any) {
            console.error('Upload failed', error);
            alert(error.message || 'Dosya yüklenirken hata oluştu');
        } finally {
            setUploading(false);
        }
    };

    const removeMedia = (index: number) => {
        setMediaItems(prev => prev.filter((_, i) => i !== index));
    };

    const addOption = () => {
        setOptions([...options, { name: '', price: 0 } as any]);
    };

    const removeOption = (index: number) => {
        setOptions(options.filter((_, i) => i !== index));
    };

    const addFeature = () => {
        setFeatures([...features, { title: '', description: '' }]);
    };

    const updateFeature = (index: number, field: 'title' | 'description', value: string) => {
        const newFeatures = [...features];
        newFeatures[index][field] = value;
        setFeatures(newFeatures);
    };

    const removeFeature = (index: number) => {
        setFeatures(features.filter((_, i) => i !== index));
    };

    const updateOption = (index: number, field: keyof import('@/lib/db').ProductOption, value: string | number) => {
        const newOptions = [...options];
        newOptions[index] = { ...newOptions[index], [field]: value };
        setOptions(newOptions);
    };

    const formAction = isEdit ? updateProduct : createProduct;

    return (
        <form action={formAction} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {isEdit && <input type="hidden" name="id" value={initialData?.id} />}
            {/* Hidden Input for Media JSON */}
            <input type="hidden" name="media" value={JSON.stringify(mediaItems)} />
            {/* Hidden Input for Subcategories JSON */}
            <input type="hidden" name="subcategoryIds" value={JSON.stringify(selectedSubIds)} />
            {/* Hidden Input for Options JSON */}
            <input type="hidden" name="options" value={JSON.stringify(options)} />
            {/* Hidden Input for Color JSON */}
            <input type="hidden" name="color" value={JSON.stringify(color)} />

            {/* Use first image as main imageUrl for backward compatibility */}
            <input type="hidden" name="imageUrl" value={mediaItems.find(m => m.type === 'image')?.url || initialData?.imageUrl || ''} />

            <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Ürün Adı</label>
                <input
                    name="name"
                    defaultValue={initialData?.name}
                    type="text"
                    required
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border)' }}
                />
            </div>

            <div style={{ display: 'flex', gap: '2rem' }}>
                <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Ana Kategori</label>
                    <select
                        name="categoryId"
                        value={selectedCategoryId}
                        onChange={handleCategoryChange}
                        required
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border)', backgroundColor: 'white' }}
                    >
                        <option value="" disabled>Kategori Seçin</option>
                        {mainCategories.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                </div>

                {/* Subcategories Selection */}
                {selectedCategoryId && (
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Alt Kategoriler</label>
                        <div style={{
                            border: '1px solid var(--border)',
                            borderRadius: '6px',
                            padding: '0.75rem',
                            maxHeight: '150px',
                            overflowY: 'auto',
                            backgroundColor: '#f9f9f9'
                        }}>
                            {availableSubCategories.length === 0 ? (
                                <p style={{ color: 'gray', fontSize: '0.9rem' }}>Bu kategoriye ait alt kategori yok.</p>
                            ) : (
                                availableSubCategories.map(sub => (
                                    <div key={sub.id} style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center' }}>
                                        <input
                                            type="checkbox"
                                            id={`sub-${sub.id}`}
                                            checked={selectedSubIds.includes(sub.id)}
                                            onChange={(e) => handleSubCategoryChange(e, sub.id)}
                                            style={{ marginRight: '0.5rem' }}
                                        />
                                        <label htmlFor={`sub-${sub.id}`} style={{ cursor: 'pointer', fontSize: '0.9rem' }}>{sub.name}</label>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>

            <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Açıklama</label>
                <textarea
                    name="description"
                    defaultValue={initialData?.description}
                    required
                    rows={5}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border)' }}
                />
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Fiyat (TL)</label>
                    <input
                        name="price"
                        defaultValue={initialData?.price}
                        type="number"
                        step="0.01"
                        required
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border)' }}
                    />
                </div>
                <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>İndirimli Fiyat (Opsiyonel)</label>
                    <input
                        name="salePrice"
                        defaultValue={initialData?.salePrice ?? undefined}
                        type="number"
                        step="0.01"
                        placeholder="Boş bırakılırsa indirim görünmez"
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border)' }}
                    />
                </div>
                <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Stok</label>
                    <input
                        name="stock"
                        defaultValue={initialData?.stock}
                        type="number"
                        required
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border)' }}
                    />
                </div>
            </div>

            <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Değerlendirme (Rating)</label>
                    <input
                        name="rating"
                        defaultValue={initialData?.rating || 5}
                        type="number"
                        step="0.1"
                        min="0"
                        max="5"
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border)' }}
                    />
                </div>
                <div style={{ flex: 1, paddingTop: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <input
                            type="checkbox"
                            name="freeShipping"
                            id="freeShipping"
                            defaultChecked={initialData?.freeShipping}
                            style={{ width: '1.2rem', height: '1.2rem' }}
                        />
                        <label htmlFor="freeShipping" style={{ cursor: 'pointer', fontWeight: 500 }}>
                            Hızlı Teslimat & Kargo Bedava
                        </label>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem' }}>
                        <input
                            type="checkbox"
                            name="isActive"
                            id="isActive"
                            defaultChecked={initialData?.isActive ?? true}
                            style={{ width: '1.2rem', height: '1.2rem' }}
                        />
                        <label htmlFor="isActive" style={{ cursor: 'pointer', fontWeight: 500 }}>
                            Ürün Satışa Açık (Aktif)
                        </label>
                    </div>
                </div>
                <div style={{ flex: 1 }}>{/* Spacer */}</div>
            </div>

            {/* Color Selection */}
            <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start', marginTop: '1rem', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
                <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Renk Adı</label>
                    <input
                        type="text"
                        placeholder="Örn: Gece Mavisi"
                        value={color.name}
                        onChange={(e) => setColor({ ...color, name: e.target.value })}
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border)' }}
                    />
                </div>
                <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Renk Kodu (Hex)</label>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <input
                            type="color"
                            value={color.hex}
                            onChange={(e) => setColor({ ...color, hex: e.target.value })}
                            style={{ width: '50px', height: '42px', padding: '0', border: 'none', background: 'none' }}
                        />
                        <input
                            type="text"
                            placeholder="#000000"
                            value={color.hex}
                            onChange={(e) => setColor({ ...color, hex: e.target.value })}
                            style={{ flex: 1, padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border)' }}
                        />
                    </div>
                </div>
            </div>

            {/* Features Selection */}
            <div style={{ border: '1px solid var(--border)', padding: '1.5rem', borderRadius: '12px', marginTop: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <label style={{ fontWeight: 600 }}>Ürün Özellikleri (Materyal, Yaka Tipi vb.)</label>
                    <input type="hidden" name="features" value={JSON.stringify(features)} />
                    <button type="button" onClick={addFeature} className="btn" style={{ fontSize: '0.8rem', padding: '0.3rem 0.8rem' }}>+ Özellik Ekle</button>
                </div>

                {features.map((feature, index) => (
                    <div key={index} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                        <div style={{ flex: 1 }}>
                            <input
                                type="text"
                                placeholder="Başlık (Örn: Materyal)"
                                value={feature.title}
                                onChange={(e) => updateFeature(index, 'title', e.target.value)}
                                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)' }}
                                required
                            />
                        </div>
                        <div style={{ flex: 2 }}>
                            <input
                                type="text"
                                placeholder="Açıklama (Örn: %100 Pamuk)"
                                value={feature.description}
                                onChange={(e) => updateFeature(index, 'description', e.target.value)}
                                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)' }}
                                required
                            />
                        </div>
                        <button
                            type="button"
                            onClick={() => removeFeature(index)}
                            style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer', fontSize: '1.2rem', marginTop: '0.3rem' }}
                        >
                            &times;
                        </button>
                    </div>
                ))}
            </div>

            {/* Options Section */}
            <div style={{ border: '1px solid var(--border)', padding: '1.5rem', borderRadius: '12px', marginTop: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <label style={{ fontWeight: 600 }}>Ürün Opsiyonları (Beden YOK - Sadece Ekstra Özellikler)</label>
                    <button type="button" onClick={addOption} className="btn" style={{ fontSize: '0.8rem', padding: '0.3rem 0.8rem' }}>+ Opsiyon Ekle</button>
                </div>
                {options.length === 0 && <p style={{ color: 'gray', fontStyle: 'italic', fontSize: '0.9rem' }}>Eklenmiş opsiyon yok.</p>}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {options.map((option, idx) => (
                        <div key={idx} style={{ display: 'flex', gap: '1rem', alignItems: 'center', backgroundColor: '#f9f9f9', padding: '0.75rem', borderRadius: '6px' }}>
                            <div style={{ flex: 2 }}>
                                <input
                                    type="text"
                                    placeholder="Opsiyon Adı (örn: Büyük Boy)"
                                    value={option.name}
                                    onChange={(e) => updateOption(idx, 'name', e.target.value)}
                                    required
                                    style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)' }}
                                />
                            </div>
                            <div style={{ flex: 1 }}>
                                <input
                                    type="number"
                                    placeholder="Ek Fiyat (+TL)"
                                    value={option.price}
                                    onChange={(e) => updateOption(idx, 'price', parseFloat(e.target.value) || 0)}
                                    style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)' }}
                                />
                            </div>
                            <button
                                type="button"
                                onClick={() => removeOption(idx)}
                                style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer', fontSize: '1.2rem' }}
                            >
                                &times;
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Media Upload Section */}
            <div style={{ border: '2px dashed var(--border)', padding: '1.5rem', borderRadius: '12px', textAlign: 'center' }}>
                <label style={{ display: 'block', marginBottom: '1rem', fontWeight: 600 }}>Medya Yükle (Resim/Video)</label>
                <input
                    type="file"
                    onChange={handleFileChange}
                    multiple
                    accept="image/*,video/*"
                    style={{ display: 'none' }}
                    id="file-upload"
                />
                <label htmlFor="file-upload" className="btn" style={{ cursor: 'pointer', backgroundColor: '#e2e8f0', color: '#1e293b' }}>
                    {uploading ? 'Yükleniyor...' : 'Dosya Seç'}
                </label>

                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1.5rem', justifyContent: 'center' }}>
                    {mediaItems.map((item, index) => (
                        <div key={index} style={{ position: 'relative', width: '100px', height: '100px', borderRadius: '8px', overflow: 'hidden' }}>
                            {item.type === 'image' ? (
                                <img src={item.url} alt="Product Media" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <video src={item.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            )}
                            <button
                                type="button"
                                onClick={() => removeMedia(index)}
                                style={{
                                    position: 'absolute',
                                    top: '4px',
                                    right: '4px',
                                    background: 'red',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '50%',
                                    width: '20px',
                                    height: '20px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '12px'
                                }}
                            >
                                X
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <button type="submit" className="btn" disabled={uploading} style={{ marginTop: '1rem', width: '100%', fontSize: '1.1rem' }}>
                {isEdit ? 'Ürünü Güncelle' : 'Ürünü Oluştur'}
            </button>
        </form>
    );
}
