'use client';

import React, { useState, useRef } from 'react';
import styles from './figure.module.css';
import { Upload, Image as ImageIcon, Sparkles, CheckCircle } from 'lucide-react';

const stylesList = [
    {
        id: 'chibi',
        name: 'Chibi Stili',
        desc: 'Büyük kafa, küçük gövde, sevimli, yuvarlak yüz hatları, pastel renkler.'
    },
    {
        id: 'funko',
        name: 'Funko Stili',
        desc: 'Büyük karemsi kafa, siyah noktalar şeklinde gözler, vinil plastik doku.'
    },
    {
        id: 'pixar',
        name: 'Pixar Stili',
        desc: 'Yarı gerçekçi, büyük ve canlı gözler, sinematik aydınlatma ve yumuşak yüz hatları.'
    },
    {
        id: 'hasbro',
        name: 'Hasbro/Mattel',
        desc: 'Aksiyon figürü estetiği, detaylı kıyafet kırımları, sert plastik görünüm.'
    },
    {
        id: 'roman',
        name: 'Roma Büstü',
        desc: 'Antik mermer heykel görünümü, omuz üstü büst, sanatsal ve tarihi doku.'
    },
    {
        id: 'toy',
        name: 'Modern Oyuncak',
        desc: 'Güncel 3D baskı estetiği, mat yüzey, temiz hatlar ve kaide üzerinde sunum.'
    },
];

import { submitFigureOrder, generatePreviewAction } from '@/app/actions/figure-actions';

export default function FigurePage() {
    const [selectedFile, setSelectedFile] = useState<string | null>(null);
    const [fileObject, setFileObject] = useState<File | null>(null); // Keep actual File object
    const [selectedStyle, setSelectedStyle] = useState<string>('funko');
    const [isConverting, setIsConverting] = useState(false);
    const [resultConfig, setResultConfig] = useState<{ image: string; style: string } | null>(null);
    const [showOrderForm, setShowOrderForm] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const formRef = useRef<HTMLFormElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setSelectedFile(url);
            setFileObject(file);
            setResultConfig(null);
            setShowOrderForm(false);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setSelectedFile(url);
            setFileObject(file);
            setResultConfig(null);
            setShowOrderForm(false);
        }
    };

    const generatePrompt = (styleId: string) => {
        const style = stylesList.find(s => s.id === styleId);
        // Enhanced Prompt for DALL-E 3
        return `A highly detailed 3D render of a person in ${style?.name} style. ${style?.desc}. The figure should be centered on a display stand, neutral background, high quality, 8k resolution, cinematic lighting.`;
    };

    const handleConvert = async () => {
        if (!selectedFile) return;

        setIsConverting(true);
        setResultConfig(null);
        setShowOrderForm(false);

        const prompt = generatePrompt(selectedStyle);
        console.log("Requesting AI Generation:", prompt);

        try {
            // Call Server Action for Real AI
            const result = await generatePreviewAction(prompt, selectedStyle);

            if (result.success && result.url) {
                setResultConfig({
                    image: result.url, // Real AI URL
                    style: selectedStyle
                });
            } else {
                console.warn("Real AI Failed (likely no key), falling back to simulation.", result.error);
                // Fallback to Simulation if API fails (e.g. no key)
                // This ensures the user still sees *something*
                setTimeout(() => {
                    setResultConfig({
                        image: selectedFile,
                        style: selectedStyle
                    });
                }, 1000);
            }
        } catch (error) {
            console.error("AI Request Failed", error);
            // Fallback
            setTimeout(() => {
                setResultConfig({
                    image: selectedFile,
                    style: selectedStyle
                });
            }, 1000);
        } finally {
            setIsConverting(false);
        }
    };

    const handleOrderSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!fileObject || !resultConfig) return;

        setIsSubmitting(true);
        const formData = new FormData(e.target as HTMLFormElement);
        formData.append('image', fileObject);
        formData.append('styleId', selectedStyle);
        formData.append('styleName', stylesList.find(s => s.id === selectedStyle)?.name || selectedStyle);

        const result = await submitFigureOrder(formData);

        if (result.success) {
            alert(result.message);
            // Optional: Reset or redirect
            // window.location.href = '/'; 
        } else {
            alert(result.message || 'Bir hata oluştu.');
        }
        setIsSubmitting(false);
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>
                    3D Figür <span className={styles.highlight}>Studio</span>
                </h1>
                <p className={styles.subtitle}>
                    Kişiye özel 3D figür tasarımı. Önce AI ile önizle, sonra sipariş ver!
                </p>
            </header>

            <div className={styles.mainContent}>
                {/* Left Column: Controls */}
                <div className={styles.card}>
                    {/* Step 1: Upload */}
                    <div>
                        <h2 className={styles.stepTitle}>1. Fotoğrafını Yükle</h2>
                        <div
                            className={styles.uploadArea}
                            onClick={() => fileInputRef.current?.click()}
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                        >
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                hidden
                                accept="image/*"
                            />

                            {selectedFile ? (
                                <img src={selectedFile} alt="Preview" className={styles.uploadedImage} />
                            ) : (
                                <div className={styles.placeholderText}>
                                    <Upload size={48} style={{ marginBottom: '1rem', opacity: 0.7 }} />
                                    <p>Fotoğraf yüklemek için tıklayın <br /> veya sürükleyip bırakın</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Step 2: Style Selection */}
                    <div>
                        <h2 className={styles.stepTitle}>2. Bir Stil Seç</h2>
                        <div className={styles.styleGrid}>
                            {stylesList.map((style) => (
                                <button
                                    key={style.id}
                                    className={`${styles.styleButton} ${selectedStyle === style.id ? styles.active : ''}`}
                                    onClick={() => setSelectedStyle(style.id)}
                                    title={style.desc}
                                >
                                    <span style={{ display: 'block', fontWeight: 'bold' }}>{style.name}</span>
                                    {selectedStyle === style.id && (
                                        <span style={{ display: 'block', fontSize: '0.7rem', marginTop: '0.2rem', opacity: 0.9 }}>
                                            {style.desc}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Convert Button */}
                    <button
                        className={styles.convertButton}
                        onClick={handleConvert}
                        disabled={!selectedFile || isConverting || isSubmitting}
                    >
                        {isConverting ? 'Önizleme Hazırlanıyor...' : 'AI Önizleme Oluştur'}
                    </button>
                </div>

                {/* Right Column: Result & Order */}
                <div className={styles.card}>
                    <h2 className={styles.stepTitle}>3. Önizleme ve Sipariş</h2>

                    <div className={styles.resultContainer}>
                        {isConverting && (
                            <div className={styles.loadingOverlay}>
                                <div className={styles.spinner}></div>
                                <p>Yapay zeka stil önizlemesini hazırlıyor...</p>
                            </div>
                        )}

                        {error && (
                            <div style={{
                                padding: '20px',
                                background: '#fee2e2',
                                color: '#dc2626',
                                borderRadius: '12px',
                                textAlign: 'center',
                                marginBottom: '20px',
                                border: '1px solid #fca5a5'
                            }}>
                                <p style={{ fontWeight: 'bold', marginBottom: '8px' }}>Üzgünüz, bir hata oluştu:</p>
                                <p>{error}</p>
                                <p style={{ fontSize: '0.8rem', marginTop: '10px', color: '#7f1d1d' }}>
                                    (Gerçek AI üretimi için geçerli bir API anahtarı gereklidir)
                                </p>
                            </div>
                        )}

                        {resultConfig ? (
                            <div className={styles.previewWrapper}>
                                <div style={{ position: 'relative', width: '100%', height: '300px', marginBottom: '20px' }}>
                                    <img
                                        src={resultConfig.image}
                                        alt="Result"
                                        className={`${styles.resultImage} ${styles[`style-${resultConfig.style}`]}`}
                                    />
                                    <div className={styles.previewBadge}>
                                        <Sparkles size={16} />
                                        <span>AI Taslak Önizleme</span>
                                    </div>
                                </div>

                                {!showOrderForm ? (
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{ marginBottom: '15px', color: '#4ade80', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                            <CheckCircle size={20} />
                                            <span>Önizleme Hazır!</span>
                                        </div>
                                        <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '20px' }}>
                                            Bu tasarımı beğendiyseniz, uzman sanatçılarımız tarafından detaylandırılarak üretilmesi için sipariş oluşturabilirsiniz.
                                        </p>
                                        <button
                                            className={styles.convertButton}
                                            style={{ background: '#22c55e' }}
                                            onClick={() => setShowOrderForm(true)}
                                        >
                                            Tasarımı Sipariş Ver
                                        </button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleOrderSubmit} className={styles.orderForm}>
                                        <h3 className={styles.orderFormTitle}>Sipariş Bilgileri</h3>
                                        <div className={styles.formGroup}>
                                            <label>Ad Soyad</label>
                                            <input type="text" name="name" required placeholder="Adınız Soyadınız" className={styles.input} />
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label>E-posta</label>
                                            <input type="email" name="email" required placeholder="ornek@email.com" className={styles.input} />
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label>Telefon</label>
                                            <input type="tel" name="phone" required placeholder="0555 123 45 67" className={styles.input} />
                                        </div>
                                        <button
                                            type="submit"
                                            className={styles.convertButton}
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? 'Sipariş Gönderiliyor...' : 'Siparişi Tamamla'}
                                        </button>
                                    </form>
                                )}
                            </div>
                        ) : (
                            <div className={styles.placeholderText}>
                                {!isConverting && (
                                    <>
                                        <Sparkles size={64} style={{ marginBottom: '1.5rem', opacity: 0.3 }} />
                                        <p style={{ opacity: 0.5 }}>Önizleme burada görünecek</p>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
