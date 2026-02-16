'use client';

import { useState, useEffect } from 'react';
import { createStlModel, getStlCategories } from '@/app/actions';

interface Category {
    id: string;
    name: string;
}

export default function AdminStlUpload() {
    const [isLoading, setIsLoading] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    // Form States
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('0');
    const [isFree, setIsFree] = useState(false);

    // Category States
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState('');
    const [isNewCategory, setIsNewCategory] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');

    useEffect(() => {
        if (isExpanded) {
            getStlCategories().then(setCategories);
        }
    }, [isExpanded]);

    async function handleSubmit(formData: FormData) {
        setIsLoading(true);
        const res = await createStlModel(formData);
        setIsLoading(false);
        if (res?.success) {
            alert('Model başarıyla eklendi!');
            setIsExpanded(false);
            window.location.reload();
        } else {
            alert(res?.error || 'Hata oluştu');
        }
    }

    if (!isExpanded) {
        return (
            <div className="container" style={{ marginTop: '2rem', textAlign: 'center' }}>
                <button
                    onClick={() => setIsExpanded(true)}
                    className="btn"
                    style={{ backgroundColor: '#333', color: 'white' }}
                >
                    + Yeni 3D Model Ekle (STL/3MF) (Admin)
                </button>
            </div>
        );
    }

    return (
        <div className="card" style={{ maxWidth: '600px', margin: '2rem auto', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ margin: 0 }}>Yeni 3D Model Ekle</h3>
                <button onClick={() => setIsExpanded(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
            </div>

            <form action={handleSubmit}>
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                    <label className="form-label">Model Adı</label>
                    <input name="name" type="text" className="form-input" required />
                </div>

                <div className="form-group" style={{ marginBottom: '1rem' }}>
                    <label className="form-label">Açıklama</label>
                    <textarea name="description" className="form-input" rows={3} required />
                </div>

                {/* Category Section */}
                <div className="form-group" style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
                    <label className="form-label">Kategori</label>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', cursor: 'pointer' }}>
                            <input
                                type="radio"
                                checked={!isNewCategory}
                                onChange={() => setIsNewCategory(false)}
                            />
                            Mevcut Seç
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', cursor: 'pointer' }}>
                            <input
                                type="radio"
                                checked={isNewCategory}
                                onChange={() => setIsNewCategory(true)}
                            />
                            Yeni Ekle
                        </label>
                    </div>

                    {!isNewCategory ? (
                        <select
                            name="categoryId"
                            className="form-input"
                            onChange={(e) => setSelectedCategoryId(e.target.value)}
                            value={selectedCategoryId}
                        >
                            <option value="">Kategori Seçin...</option>
                            {categories.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    ) : (
                        <input
                            name="newCategory"
                            type="text"
                            className="form-input"
                            placeholder="Yeni kategori adı girin"
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                        />
                    )}
                </div>

                <div className="form-group" style={{ marginBottom: '1rem' }}>
                    <label className="form-label">STL/3MF Dosyası</label>
                    <input name="file" type="file" accept=".stl,.3mf" className="form-input" required />
                </div>

                <div className="form-group" style={{ marginBottom: '1rem' }}>
                    <label className="form-label">Önizleme Görseli</label>
                    <input name="image" type="file" accept="image/*" className="form-input" required />
                </div>

                <div className="form-group" style={{ marginBottom: '1rem' }}>
                    <label className="form-label">Etiketler (Virgül ile ayırın)</label>
                    <input name="tags" type="text" className="form-input" placeholder="figür, anime, masaüstü" />
                </div>

                <div className="form-group" style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                        <input
                            name="isFree"
                            type="checkbox"
                            onChange={(e) => setIsFree(e.target.checked)}
                        />
                        <span>Ücretsiz</span>
                    </label>
                </div>

                {!isFree && (
                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                        <label className="form-label">Fiyat (TL)</label>
                        <input name="price" type="number" step="0.01" className="form-input" />
                    </div>
                )}

                <button
                    type="submit"
                    className="btn"
                    disabled={isLoading}
                    style={{ width: '100%', backgroundColor: 'var(--primary)', color: 'white' }}
                >
                    {isLoading ? 'Yükleniyor...' : 'Kaydet'}
                </button>
            </form>
        </div>
    );
}
