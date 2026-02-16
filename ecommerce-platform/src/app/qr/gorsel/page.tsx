'use client';

import React, { useState, useRef } from 'react';
import { QrCode, Download, Palette, Type, Image as ImageIcon, Settings, Lock, ChevronDown, ChevronUp, Plus, Trash2, GripVertical, Info, Eye, Smartphone, ArrowLeft, Video } from 'lucide-react';
import { useRouter } from 'next/navigation';
import FrameRenderer, { QrDesignState } from '@/components/qr/FrameRenderer';
import QRCodeDesignControl from '@/components/qr/QRCodeDesignControl';
import html2canvas from 'html2canvas';

// --- Types ---
interface ImageItem {
    id: string;
    url: string;
    caption?: string;
}

interface ImageQrState {
    design: {
        themeColor: string;
        bgColor: string;
        textColor: string;
    };
    qrDesign: QrDesignState;
    info: {
        title: string;
        description: string;
        buttonText: string;
        buttonUrl: string;
    };
    images: ImageItem[];
    fonts: {
        header: string;
        text: string;
    };
    welcomeScreen: {
        enabled: boolean;
        mediaType: 'image' | 'video';
        mediaUrl: string | null;
        timeout: number;
    };
    settings: {
        name: string;
        password: string;
    };
}

const INITIAL_STATE: ImageQrState = {
    design: {
        themeColor: '#22c55e', // Green as in screenshot
        bgColor: '#ffffff',
        textColor: '#000000',
    },
    qrDesign: {
        frame: 'none',
        frameLabel: 'SCAN ME',
        pattern: 'square',
        cornerStyle: 'square',
        cornerColor: '#000000',
        logo: null,
        fgColor: '#000000',
        bgColor: '#ffffff',
        gradient: { enabled: false, start: '#000000', end: '#000000' }
    },
    info: {
        title: 'Resimlerim',
        description: 'Hayatın anlarını tek seferde yakalıyoruz. Bana katıl!',
        buttonText: 'Daha fazla göster',
        buttonUrl: '#',
    },
    images: [
        { id: '1', url: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=600&auto=format&fit=crop&q=60' },
        { id: '2', url: 'https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?w=600&auto=format&fit=crop&q=60' },
        { id: '3', url: 'https://images.unsplash.com/photo-1546514355-7fdc90ccbd03?w=600&auto=format&fit=crop&q=60' },
    ],
    fonts: {
        header: 'Inter',
        text: 'Inter'
    },
    welcomeScreen: {
        enabled: false,
        mediaType: 'image',
        mediaUrl: null,
        timeout: 2000
    },
    settings: {
        name: 'Görsel Galerim',
        password: ''
    }
};

export default function ImageQrPage() {
    const router = useRouter();
    const [state, setState] = useState<ImageQrState>(INITIAL_STATE);
    const [activeTab, setActiveTab] = useState<'content' | 'qr'>('content');
    const [expandedSection, setExpandedSection] = useState<string | null>('images');
    const [previewMode, setPreviewMode] = useState<'mobile' | 'desktop'>('mobile');
    const [showWelcome, setShowWelcome] = useState(false);
    const qrRef = useRef<HTMLDivElement>(null);

    // Reset welcome screen when enabled or tab changes
    React.useEffect(() => {
        if (state.welcomeScreen.enabled && activeTab === 'content') {
            setShowWelcome(true);
            const timer = setTimeout(() => setShowWelcome(false), state.welcomeScreen.timeout);
            return () => clearTimeout(timer);
        }
    }, [state.welcomeScreen.enabled, state.welcomeScreen.timeout, activeTab]);

    const handleWelcomeMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                updateState('welcomeScreen.mediaUrl', reader.result as string);
                updateState('welcomeScreen.enabled', true);
            };
            reader.readAsDataURL(file);
        }
    };

    const toggleSection = (section: string) => {
        setExpandedSection(expandedSection === section ? null : section);
    };

    const updateState = (path: string, value: any) => {
        setState(prev => {
            const newState = { ...prev };
            const parts = path.split('.');
            let current: any = newState;
            for (let i = 0; i < parts.length - 1; i++) {
                current = current[parts[i]];
            }
            current[parts[parts.length - 1]] = value;
            return newState;
        });
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const newImage: ImageItem = {
                    id: Date.now().toString(),
                    url: reader.result as string
                };
                setState(prev => ({
                    ...prev,
                    images: [...prev.images, newImage]
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = (id: string) => {
        setState(prev => ({
            ...prev,
            images: prev.images.filter(img => img.id !== id)
        }));
    };

    const downloadQr = async () => {
        if (!qrRef.current) return;
        try {
            const canvas = await html2canvas(qrRef.current);
            const url = canvas.toDataURL('image/png');
            const a = document.createElement('a');
            a.href = url;
            a.download = 'erashu-qr-image.png';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        } catch (err) {
            console.error('Download failed', err);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-800">
            {/* Header */}
            <header className="bg-white border-b px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.push('/')} className="p-2 hover:bg-gray-100 rounded-full transition-colors flex items-center gap-2 group">
                        <ArrowLeft size={20} className="text-gray-600 group-hover:text-green-600 transition-colors" />
                        <span className="text-xl font-bold text-gray-800 group-hover:text-green-600 transition-colors">Geri</span>
                    </button>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setActiveTab('content')}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeTab === 'content' ? 'bg-green-100 text-green-700' : 'text-gray-500 hover:bg-gray-100'}`}
                    >
                        İçerik Düzenle
                    </button>
                    <button
                        onClick={() => setActiveTab('qr')}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeTab === 'qr' ? 'bg-green-100 text-green-700' : 'text-gray-500 hover:bg-gray-100'}`}
                    >
                        QR Tasarla
                    </button>
                    <button className="btn btn-primary bg-green-600 hover:bg-green-700 text-white px-6 rounded-full flex items-center gap-2" onClick={downloadQr}>
                        <Download size={18} />
                        İndir
                    </button>
                </div>
            </header>

            <div className="flex flex-1 lg:flex-row flex-col max-w-[1600px] mx-auto w-full p-6 gap-8">

                {/* Left Panel: Editor */}
                <div className="flex-1 min-w-[350px] space-y-4 overflow-y-auto max-h-[calc(100vh-120px)] pr-2 custom-scrollbar">

                    {activeTab === 'content' ? (
                        <>
                            {/* Design Section */}
                            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                                <button
                                    onClick={() => toggleSection('design')}
                                    className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                            <Palette size={18} />
                                        </div>
                                        <div className="text-left">
                                            <span className="font-semibold block">Tasarım</span>
                                            <span className="text-xs text-gray-500">Sayfanız için renk teması seçin.</span>
                                        </div>
                                    </div>
                                    {expandedSection === 'design' ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
                                </button>

                                {expandedSection === 'design' && (
                                    <div className="p-4 border-t bg-gray-50 space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Tema Rengi</label>
                                            <div className="flex gap-3">
                                                {['#22c55e', '#3b82f6', '#ef4444', '#f59e0b', '#8b5cf6', '#ec4899', '#000000'].map(color => (
                                                    <button
                                                        key={color}
                                                        onClick={() => updateState('design.themeColor', color)}
                                                        className={`w-8 h-8 rounded-full border-2 transition-all ${state.design.themeColor === color ? 'border-gray-800 scale-110' : 'border-transparent'}`}
                                                        style={{ backgroundColor: color }}
                                                    />
                                                ))}
                                                <input
                                                    type="color"
                                                    value={state.design.themeColor}
                                                    onChange={(e) => updateState('design.themeColor', e.target.value)}
                                                    className="w-8 h-8 rounded-full cursor-pointer opacity-0 absolute"
                                                />
                                                <div className="w-8 h-8 rounded-full border border-gray-300 bg-white flex items-center justify-center cursor-pointer relative">
                                                    <Plus size={14} className="text-gray-500" />
                                                    <input
                                                        type="color"
                                                        value={state.design.themeColor}
                                                        onChange={(e) => updateState('design.themeColor', e.target.value)}
                                                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Images Section */}
                            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                                <button
                                    onClick={() => toggleSection('images')}
                                    className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                            <ImageIcon size={18} />
                                        </div>
                                        <div className="text-left">
                                            <span className="font-semibold block">Görsel <span className="text-red-500">*</span></span>
                                            <span className="text-xs text-gray-500">Görselleri yükleyin veya sürükleyip bırakın.</span>
                                        </div>
                                    </div>
                                    {expandedSection === 'images' ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
                                </button>

                                {expandedSection === 'images' && (
                                    <div className="p-4 border-t bg-gray-50 space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            {state.images.map(img => (
                                                <div key={img.id} className="relative group aspect-square rounded-xl overflow-hidden shadow-sm border border-gray-200">
                                                    <img src={img.url} alt="Gallery" className="w-full h-full object-cover" />
                                                    <button
                                                        onClick={() => removeImage(img.id)}
                                                        className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            ))}

                                            <label className="flex flex-col items-center justify-center aspect-square rounded-xl border-2 border-dashed border-gray-300 hover:border-green-500 hover:bg-green-50 transition-all cursor-pointer">
                                                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 mb-2">
                                                    <Plus size={20} />
                                                </div>
                                                <span className="text-sm font-medium text-gray-600">Görsel Ekle</span>
                                                <input type="file" onChange={handleImageUpload} className="hidden" accept="image/*" />
                                            </label>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Info Section */}
                            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                                <button
                                    onClick={() => toggleSection('info')}
                                    className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                                            <Info size={18} />
                                        </div>
                                        <div className="text-left">
                                            <span className="font-semibold block">Görsel Bilgileri</span>
                                            <span className="text-xs text-gray-500">Görsel galerinize bağlam ekleyin.</span>
                                        </div>
                                    </div>
                                    {expandedSection === 'info' ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
                                </button>

                                {expandedSection === 'info' && (
                                    <div className="p-4 border-t bg-gray-50 space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Başlık</label>
                                            <input
                                                type="text"
                                                value={state.info.title}
                                                onChange={(e) => updateState('info.title', e.target.value)}
                                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Açıklama</label>
                                            <textarea
                                                value={state.info.description}
                                                onChange={(e) => updateState('info.description', e.target.value)}
                                                rows={3}
                                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none resize-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Buton Metni</label>
                                            <input
                                                type="text"
                                                value={state.info.buttonText}
                                                onChange={(e) => updateState('info.buttonText', e.target.value)}
                                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Buton Bağlantısı</label>
                                            <input
                                                type="text"
                                                value={state.info.buttonUrl}
                                                onChange={(e) => updateState('info.buttonUrl', e.target.value)}
                                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                                                placeholder="https://"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Fonts */}
                            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                                <button
                                    onClick={() => toggleSection('fonts')}
                                    className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600">
                                            <Type size={18} />
                                        </div>
                                        <div className="text-left">
                                            <span className="font-semibold block">Yazı tipleri</span>
                                            <span className="text-xs text-gray-500">Orijinal yazı tipleriyle sayfanızı benzersiz kılın.</span>
                                        </div>
                                    </div>
                                    {expandedSection === 'fonts' ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
                                </button>

                                {expandedSection === 'fonts' && (
                                    <div className="p-4 border-t bg-gray-50 space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            {['Inter', 'Roboto', 'Playfair Display', 'Montserrat', 'Lato', 'Open Sans'].map(font => (
                                                <button
                                                    key={font}
                                                    onClick={() => updateState('fonts.header', font)}
                                                    className={`p-3 border rounded-lg text-left hover:bg-gray-50 ${state.fonts.header === font ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}
                                                    style={{ fontFamily: font }}
                                                >
                                                    {font}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Welcome Screen */}
                            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                                <button
                                    onClick={() => toggleSection('welcome')}
                                    className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center text-pink-600">
                                            <Eye size={18} />
                                        </div>
                                        <div className="text-left">
                                            <span className="font-semibold block">Karşılama ekranı</span>
                                            <span className="text-xs text-gray-500">Sayfanız yüklenirken bir görsel görüntüleyin.</span>
                                        </div>
                                    </div>
                                    {expandedSection === 'welcome' ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
                                </button>

                                {expandedSection === 'welcome' && (
                                    <div className="p-4 border-t bg-gray-50 space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium text-sm">Karşılama Ekranı Aktif</span>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={state.welcomeScreen.enabled}
                                                    onChange={(e) => updateState('welcomeScreen.enabled', e.target.checked)}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                                            </label>
                                        </div>

                                        {state.welcomeScreen.enabled && (
                                            <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                                                <div>
                                                    <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Medya Türü</label>
                                                    <div className="flex bg-gray-200 p-1 rounded-lg">
                                                        <button
                                                            onClick={() => updateState('welcomeScreen.mediaType', 'image')}
                                                            className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${state.welcomeScreen.mediaType === 'image' ? 'bg-white shadow text-green-700' : 'text-gray-500 hover:text-gray-700'}`}
                                                        >
                                                            Görsel
                                                        </button>
                                                        <button
                                                            onClick={() => updateState('welcomeScreen.mediaType', 'video')}
                                                            className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${state.welcomeScreen.mediaType === 'video' ? 'bg-white shadow text-green-700' : 'text-gray-500 hover:text-gray-700'}`}
                                                        >
                                                            Video
                                                        </button>
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Dosya Yükle</label>
                                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-500 hover:bg-green-50 transition-colors relative cursor-pointer">
                                                        <div className="flex flex-col items-center">
                                                            {state.welcomeScreen.mediaUrl ? (
                                                                state.welcomeScreen.mediaType === 'video' ? (
                                                                    <video src={state.welcomeScreen.mediaUrl} className="h-32 w-auto rounded object-cover mb-2" controls />
                                                                ) : (
                                                                    <img src={state.welcomeScreen.mediaUrl} alt="Welcome" className="h-32 w-auto rounded object-cover mb-2" />
                                                                )
                                                            ) : (
                                                                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-2">
                                                                    {state.welcomeScreen.mediaType === 'video' ? <Video size={24} /> : <ImageIcon size={24} />}
                                                                </div>
                                                            )}
                                                            <span className="text-sm font-medium text-green-600">
                                                                {state.welcomeScreen.mediaUrl ? 'Medyayı Değiştir' : 'Yüklemek için tıklayın'}
                                                            </span>
                                                            <input
                                                                type="file"
                                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                                                accept={state.welcomeScreen.mediaType === 'video' ? "video/*" : "image/*"}
                                                                onChange={handleWelcomeMediaUpload}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Süre (ms)</label>
                                                    <input
                                                        type="number"
                                                        value={state.welcomeScreen.timeout}
                                                        onChange={(e) => updateState('welcomeScreen.timeout', parseInt(e.target.value) || 2000)}
                                                        className="w-full p-2 border rounded-lg"
                                                        step={500}
                                                        min={1000}
                                                        max={10000}
                                                    />
                                                    <p className="text-xs text-gray-400 mt-1">Örn: 2000 = 2 saniye</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>


                        </>
                    ) : (
                        <div className="bg-white rounded-xl shadow-sm border p-6">
                            <h2 className="text-lg font-bold mb-4">QR Kod Tasarımı</h2>
                            <QRCodeDesignControl
                                design={state.qrDesign}
                                onChange={(newDesign) => updateState('qrDesign', newDesign)}
                            />
                        </div>
                    )}
                </div>

                {/* Right Panel: Preview */}
                <div className="flex-1 flex flex-col items-center justify-center bg-gray-100 rounded-3xl p-8 border border-gray-200 relative min-h-[600px]">
                    <div className="absolute top-4 right-4 flex gap-2">
                        <button
                            onClick={() => setPreviewMode('mobile')}
                            className={`p-2 rounded-lg ${previewMode === 'mobile' ? 'bg-white shadow text-green-600' : 'text-gray-500 hover:bg-white/50'}`}
                        >
                            <Smartphone size={20} />
                        </button>
                    </div>

                    {activeTab === 'content' ? (
                        <div className="w-[320px] h-[640px] bg-white rounded-[3rem] shadow-2xl border-8 border-gray-900 overflow-hidden relative" style={{ fontFamily: state.fonts.header }}>
                            {/* Phone Status Bar (Mock) */}
                            <div className="absolute top-0 left-0 w-full h-7 bg-black/10 z-10 flex justify-between px-6 items-center text-[10px] font-bold text-white">
                                <span>9:41</span>
                                <div className="flex gap-1">
                                    <span>Signal</span>
                                    <span>Wifi</span>
                                    <span>Batt</span>
                                </div>
                            </div>

                            {/* Dynamic Content */}
                            <div className="h-full overflow-y-auto no-scrollbar" style={{ backgroundColor: state.design.themeColor }}>
                                <div className="pt-16 pb-8 px-6 text-center text-white">
                                    <h2 className="text-2xl font-bold mb-3">{state.info.title}</h2>
                                    <p className="text-white/90 text-sm leading-relaxed mb-6">{state.info.description}</p>

                                    <a
                                        href={state.info.buttonUrl}
                                        className="inline-block w-full py-3 px-6 bg-white/20 backdrop-blur-sm border border-white/40 rounded-xl font-medium hover:bg-white/30 transition-colors"
                                    >
                                        {state.info.buttonText}
                                    </a>
                                </div>

                                <div className="bg-white rounded-t-[2rem] min-h-[400px] p-6 space-y-4">
                                    {state.images.length > 0 ? (
                                        state.images.map((img, index) => (
                                            <div key={img.id} className="aspect-square rounded-2xl overflow-hidden shadow-md relative">
                                                <img src={img.url} alt={`Gallery ${index}`} className="w-full h-full object-cover" />
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-10 text-gray-400">
                                            <ImageIcon size={48} className="mx-auto mb-2 opacity-50" />
                                            <p>Henüz görsel eklenmedi</p>
                                        </div>
                                    )}

                                    {/* Footer Branding */}
                                    <div className="pt-8 pb-4 text-center">
                                        <p className="text-xs text-gray-400 font-medium">Powered by Erashu</p>
                                    </div>
                                </div>
                            </div>


                            {/* Welcome Screen Overlay */}
                            {state.welcomeScreen.enabled && showWelcome && state.welcomeScreen.mediaUrl && (
                                <div className="absolute inset-0 z-50 bg-black flex items-center justify-center animate-in fade-in duration-300">
                                    {state.welcomeScreen.mediaType === 'video' ? (
                                        <video
                                            src={state.welcomeScreen.mediaUrl}
                                            autoPlay
                                            muted
                                            className="w-full h-full object-cover"
                                            onEnded={() => setShowWelcome(false)}
                                        />
                                    ) : (
                                        <img
                                            src={state.welcomeScreen.mediaUrl}
                                            alt="Welcome"
                                            className="w-full h-full object-cover"
                                        />
                                    )}
                                </div>
                            )}

                            {/* Replay Button for Preview */}
                            {state.welcomeScreen.enabled && !showWelcome && (
                                <button
                                    onClick={() => { setShowWelcome(true); setTimeout(() => setShowWelcome(false), state.welcomeScreen.timeout); }}
                                    className="absolute top-20 right-4 z-40 bg-white/20 hover:bg-white/40 p-2 rounded-full backdrop-blur-md text-white transition-all"
                                    title="Karşılama Ekranını Oynat"
                                >
                                    <Eye size={16} />
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-6">
                            <div ref={qrRef} className="bg-white p-6 rounded-xl shadow-lg">
                                <FrameRenderer
                                    frameId={state.qrDesign.frame}
                                    currentDesign={state.qrDesign}
                                    value="https://erashu.com/demo-gallery"
                                    size={280}
                                />
                            </div>
                            <p className="text-sm text-gray-500 max-w-[280px] text-center">
                                QR kodunuzu özelleştirin ve indirin. Bağlantınız otomatik olarak oluşturulacaktır.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}


