'use client';

import { useState, useEffect } from 'react';
import { getShippingSettings, updateShippingSettings } from '@/app/actions';

export default function ShippingSettingsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const [settings, setSettings] = useState({
        shippingCost: 0,
        freeShippingThreshold: null as number | null,
        isActive: true
    });

    useEffect(() => {
        async function loadSettings() {
            const res = await getShippingSettings();
            if (res.success && res.settings) {
                setSettings({
                    shippingCost: res.settings.shippingCost,
                    freeShippingThreshold: res.settings.freeShippingThreshold,
                    isActive: res.settings.isActive
                });
            }
            setLoading(false);
        }
        loadSettings();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;

        if (type === 'checkbox') {
            setSettings(prev => ({ ...prev, [name]: checked }));
        } else if (name === 'freeShippingThreshold') {
            setSettings(prev => ({ ...prev, [name]: value === '' ? null : parseFloat(value) }));
        } else {
            setSettings(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage(null);

        const res = await updateShippingSettings(settings);

        if (res.success) {
            setMessage({ type: 'success', text: 'Kargo ayarları kaydedildi.' });
        } else {
            setMessage({ type: 'error', text: res.error || 'Bir hata oluştu.' });
        }
        setSaving(false);
    };

    if (loading) return <div className="p-8">Yükleniyor...</div>;

    return (
        <main className="container">
            <header className="header" style={{ marginBottom: '2rem' }}>
                <h1 className="title">Kargo Ayarları</h1>
            </header>

            {message && (
                <div style={{
                    padding: '1rem',
                    marginBottom: '1.5rem',
                    borderRadius: '8px',
                    backgroundColor: message.type === 'success' ? '#dcfce7' : '#fee2e2',
                    color: message.type === 'success' ? '#15803d' : '#b91c1c',
                    border: `1px solid ${message.type === 'success' ? '#bbf7d0' : '#fecaca'}`
                }}>
                    {message.text}
                </div>
            )}

            <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                border: '1px solid var(--border)',
                padding: '2rem',
                maxWidth: '600px'
            }}>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                    {/* Active Status */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
                        <input
                            type="checkbox"
                            id="isActive"
                            name="isActive"
                            checked={settings.isActive}
                            onChange={handleChange}
                            style={{ width: '1.25rem', height: '1.25rem', accentColor: 'var(--primary)' }}
                        />
                        <label htmlFor="isActive" style={{ fontWeight: 500, fontSize: '1rem' }}>Kargo Ücreti Sistemi Aktif</label>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label className="form-label" style={{ fontWeight: 600, fontSize: '0.9rem', color: '#374151' }}>
                            Sabit Kargo Ücreti (TL)
                        </label>
                        <input
                            type="number"
                            name="shippingCost"
                            value={settings.shippingCost}
                            onChange={handleChange}
                            min="0"
                            step="0.01"
                            className="form-input"
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                borderRadius: '8px',
                                border: '1px solid #d1d5db',
                                fontSize: '0.95rem'
                            }}
                        />
                        <p style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                            Standart kargo ücreti bu tutar olarak sepete eklenecektir.
                        </p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label className="form-label" style={{ fontWeight: 600, fontSize: '0.9rem', color: '#374151' }}>
                            Ücretsiz Kargo Limiti (TL)
                        </label>
                        <input
                            type="number"
                            name="freeShippingThreshold"
                            value={settings.freeShippingThreshold === null ? '' : settings.freeShippingThreshold}
                            onChange={handleChange}
                            min="0"
                            step="0.01"
                            placeholder="Örn: 500"
                            className="form-input"
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                borderRadius: '8px',
                                border: '1px solid #d1d5db',
                                fontSize: '0.95rem'
                            }}
                        />
                        <p style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                            Sepet tutarı bu limitin üzerindeyse kargo ücretsiz olur. (Limit yoksa boş bırakın)
                        </p>
                    </div>

                    <div style={{ paddingTop: '1rem' }}>
                        <button
                            type="submit"
                            disabled={saving}
                            className="btn"
                            style={{
                                backgroundColor: 'var(--primary)',
                                color: 'white',
                                padding: '0.75rem 2rem',
                                borderRadius: '8px',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '1rem',
                                opacity: saving ? 0.7 : 1,
                                transition: 'opacity 0.2s'
                            }}
                        >
                            {saving ? 'Kaydediliyor...' : 'Kaydet'}
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}
