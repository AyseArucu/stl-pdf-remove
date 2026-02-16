'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
    QrCode, Download, Palette, Type, FileText, Settings, Lock,
    ChevronDown, ChevronUp, Plus, Trash2, Info, Eye, Smartphone,
    ArrowLeft, Video, Upload, Link as LinkIcon, AlertCircle
} from 'lucide-react';
import FrameRenderer, { QrDesignState } from '@/components/qr/FrameRenderer';
import QRCodeDesignControl from '@/components/qr/QRCodeDesignControl';
import html2canvas from 'html2canvas';
import { useRouter } from 'next/navigation';
import { pdfjs, Document, Page } from 'react-pdf';

// Initialize PDF worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;


// --- Types ---

interface PdfQrState {
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
        website: string;
    };
    pdf: {
        file: string | null; // Data URL or storage URL
        name: string | null;
        size: string | null;
        showDirectly: boolean;
    };
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

const INITIAL_STATE: PdfQrState = {
    design: {
        themeColor: '#f97316', // Orange-500
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
        title: 'Yıllık Rapor',
        description: 'Şimdiye kadarki en iyi yılımız! Yıllık raporumuzda nasıl rekor başarıya ulaştığımızı görün',
        buttonText: "PDF'i Görün...",
        website: 'www.enterprise.com'
    },
    pdf: {
        file: null,
        name: null,
        size: null,
        showDirectly: false
    },
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
        name: 'PDF QR Kodum',
        password: ''
    }
};

export default function PdfQrPage() {
    const router = useRouter();
    const [state, setState] = useState<PdfQrState>(INITIAL_STATE);
    const [activeTab, setActiveTab] = useState<'content' | 'qr'>('content');
    const [expandedSection, setExpandedSection] = useState<string | null>('pdf');
    const [previewMode, setPreviewMode] = useState<'mobile' | 'desktop'>('mobile');
    const [showWelcome, setShowWelcome] = useState(false);
    const qrRef = useRef<HTMLDivElement>(null);

    // Reset welcome screen when enabled or tab changes
    useEffect(() => {
        if (state.welcomeScreen.enabled && activeTab === 'content') {
            setShowWelcome(true);
            const timer = setTimeout(() => setShowWelcome(false), state.welcomeScreen.timeout);
            return () => clearTimeout(timer);
        }
    }, [state.welcomeScreen.enabled, state.welcomeScreen.timeout, activeTab]);

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

    const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.type !== 'application/pdf') {
                alert('Lütfen geçerli bir PDF dosyası yükleyin.');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                updateState('pdf.file', reader.result as string);
                updateState('pdf.name', file.name);
                updateState('pdf.size', (file.size / 1024 / 1024).toFixed(2) + ' MB');
            };
            reader.readAsDataURL(file);
        }
    };

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

    const downloadQr = async () => {
        if (!qrRef.current) return;
        try {
            const canvas = await html2canvas(qrRef.current);
            const url = canvas.toDataURL('image/png');
            const a = document.createElement('a');
            a.href = url;
            a.download = 'pdf-qr.png';
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
                    <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <ArrowLeft size={20} className="text-gray-600" />
                    </button>
                    <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <FileText className="text-orange-500" />
                        PDF QR Kodu
                    </h1>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex bg-gray-100 p-1 rounded-lg">
                        <button
                            onClick={() => setActiveTab('content')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'content' ? 'bg-white shadow text-orange-600' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            İçerik
                        </button>
                        <button
                            onClick={() => setActiveTab('qr')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'qr' ? 'bg-white shadow text-orange-600' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            QR Kod
                        </button>
                    </div>
                    <button onClick={downloadQr} className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-lg shadow-orange-200">
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
                            {/* PDF File Section */}
                            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                                <button
                                    onClick={() => toggleSection('pdf')}
                                    className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                                            <FileText size={18} />
                                        </div>
                                        <div className="text-left">
                                            <span className="font-semibold block">PDF Dosyası <span className="text-red-500">*</span></span>
                                            <span className="text-xs text-gray-500">Görüntülemek istediğiniz PDF dosyasını yükleyin.</span>
                                        </div>
                                    </div>
                                    {expandedSection === 'pdf' ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
                                </button>
                                {expandedSection === 'pdf' && (
                                    <div className="p-4 border-t bg-gray-50 space-y-4">
                                        <label className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-orange-500 hover:bg-orange-50 transition-colors cursor-pointer block">
                                            {state.pdf.file ? (
                                                <div className="flex flex-col items-center">
                                                    <div className="w-16 h-16 bg-red-100 rounded-xl flex items-center justify-center text-red-600 mb-3">
                                                        <FileText size={32} />
                                                    </div>
                                                    <span className="font-medium text-gray-800 break-all">{state.pdf.name}</span>
                                                    <span className="text-xs text-gray-500 mt-1">{state.pdf.size}</span>
                                                    <span className="text-sm text-orange-600 mt-2 font-medium">Dosyayı Değiştir</span>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center">
                                                    <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 mb-3">
                                                        <Upload size={32} />
                                                    </div>
                                                    <span className="font-medium text-gray-600">PDF Yüklemek için Tıklayın</span>
                                                    <span className="text-xs text-gray-400 mt-1">Maksimum dosya boyutu: 10MB</span>
                                                </div>
                                            )}
                                            <input type="file" onChange={handlePdfUpload} className="hidden" accept="application/pdf" />
                                        </label>
                                        <div className="flex items-center gap-2 px-2">
                                            <input
                                                type="checkbox"
                                                id="showDirectly"
                                                checked={state.pdf.showDirectly}
                                                onChange={(e) => updateState('pdf.showDirectly', e.target.checked)}
                                                className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                                            />
                                            <label htmlFor="showDirectly" className="text-sm text-gray-700 font-medium cursor-pointer">
                                                PDF dosyasını doğrudan göster.
                                            </label>
                                        </div>
                                    </div>
                                )}
                            </div>

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
                                                {['#f97316', '#3b82f6', '#22c55e', '#ef4444', '#8b5cf6', '#ec4899', '#000000'].map(color => (
                                                    <button
                                                        key={color}
                                                        onClick={() => updateState('design.themeColor', color)}
                                                        className={`w-8 h-8 rounded-full border-2 transition-all ${state.design.themeColor === color ? 'border-gray-800 scale-110' : 'border-transparent'}`}
                                                        style={{ backgroundColor: color }}
                                                    />
                                                ))}
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

                            {/* PDF Info Section */}
                            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                                <button
                                    onClick={() => toggleSection('info')}
                                    className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                                            <Info size={18} />
                                        </div>
                                        <div className="text-left">
                                            <span className="font-semibold block">PDF Bilgisi</span>
                                            <span className="text-xs text-gray-500">PDF'nize biraz bağlam ekleyin.</span>
                                        </div>
                                    </div>
                                    {expandedSection === 'info' ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
                                </button>
                                {expandedSection === 'info' && (
                                    <div className="p-4 border-t bg-gray-50 space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Başlık</label>
                                            <input
                                                type="text"
                                                value={state.info.title}
                                                onChange={(e) => updateState('info.title', e.target.value)}
                                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
                                            <textarea
                                                value={state.info.description}
                                                onChange={(e) => updateState('info.description', e.target.value)}
                                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none h-24"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Buton Metni</label>
                                            <input
                                                type="text"
                                                value={state.info.buttonText}
                                                onChange={(e) => updateState('info.buttonText', e.target.value)}
                                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Fonts Section */}
                            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                                <button
                                    onClick={() => toggleSection('fonts')}
                                    className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                                            <Type size={18} />
                                        </div>
                                        <div className="text-left">
                                            <span className="font-semibold block">Yazı Tipleri</span>
                                            <span className="text-xs text-gray-500">Orijinal yazı tipleriyle sayfanızı benzersiz kılın.</span>
                                        </div>
                                    </div>
                                    {expandedSection === 'fonts' ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
                                </button>
                                {expandedSection === 'fonts' && (
                                    <div className="p-4 border-t bg-gray-50 space-y-4">
                                        <div className="grid grid-cols-2 gap-3">
                                            {['Inter', 'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Poppins'].map(font => (
                                                <button
                                                    key={font}
                                                    onClick={() => updateState('fonts.header', font)}
                                                    className={`p-3 border rounded-lg text-left hover:border-orange-500 transition-colors ${state.fonts.header === font ? 'border-orange-500 bg-orange-50' : 'border-gray-200'}`}
                                                    style={{ fontFamily: font }}
                                                >
                                                    <span className="block font-medium">{font}</span>
                                                    <span className="text-xs text-gray-500">The quick brown fox</span>
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
                                                                    {state.welcomeScreen.mediaType === 'video' ? <Video size={24} /> : <Info size={24} />}
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


                            {/* Settings Section */}
                            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                                <button
                                    onClick={() => toggleSection('settings')}
                                    className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 container-icon">
                                            <Settings size={18} />
                                        </div>
                                        <div className="text-left">
                                            <span className="font-semibold block">Ayarlar</span>
                                            <span className="text-xs text-gray-500">QR kodunuzu isimlendirin ve koruyun.</span>
                                        </div>
                                    </div>
                                    {expandedSection === 'settings' ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
                                </button>
                                {expandedSection === 'settings' && (
                                    <div className="p-4 border-t bg-gray-50 space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">QR Kod Adı</label>
                                            <input
                                                type="text"
                                                value={state.settings.name}
                                                onChange={(e) => updateState('settings.name', e.target.value)}
                                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* QR Style Section */}
                            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                                <button
                                    onClick={() => toggleSection('qrStyle')}
                                    className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                                            <QrCode size={18} />
                                        </div>
                                        <div className="text-left">
                                            <span className="font-semibold block">QR Kod Özelleştirme</span>
                                            <span className="text-xs text-gray-500">QR kodunuzun görünümünü düzenleyin.</span>
                                        </div>
                                    </div>
                                    {expandedSection === 'qrStyle' ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
                                </button>
                                {expandedSection === 'qrStyle' && (
                                    <div className="p-4 border-t bg-gray-50">
                                        <QRCodeDesignControl
                                            design={state.qrDesign}
                                            onChange={(newDesign) => updateState('qrDesign', newDesign)}
                                        />
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
                            className={`p-2 rounded-lg ${previewMode === 'mobile' ? 'bg-white shadow text-orange-600' : 'text-gray-500 hover:bg-white/50'}`}
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
                            <div className="h-full overflow-y-auto no-scrollbar relative" style={{ backgroundColor: state.design.themeColor }}>
                                <div className="pt-20 px-6 pb-8 min-h-full flex flex-col items-center text-center text-white">

                                    <h2 className="text-2xl font-bold mb-4 drop-shadow-md">{state.info.title}</h2>
                                    <p className="text-white/90 text-sm mb-8 leading-relaxed font-medium drop-shadow-sm">
                                        {state.info.description}
                                    </p>

                                    {/* PDF Preview Card */}
                                    <div className="w-full bg-white rounded-xl overflow-hidden shadow-2xl mb-8 transform rotate-1">
                                        <div className="aspect-[3/4] bg-gray-100 flex items-center justify-center relative group cursor-pointer hover:bg-gray-50 transition-colors overflow-hidden">
                                            {state.pdf.file ? (
                                                <div className="w-full h-full p-2">
                                                    <Document
                                                        file={state.pdf.file}
                                                        loading={
                                                            <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mb-2"></div>
                                                                <span className="text-xs">Yükleniyor...</span>
                                                            </div>
                                                        }
                                                        error={
                                                            <div className="flex flex-col items-center justify-center h-full text-red-400">
                                                                <AlertCircle size={32} className="mb-2" />
                                                                <span className="text-xs text-center px-4">Önizleme yüklenemedi</span>
                                                            </div>
                                                        }
                                                        className="flex items-center justify-center h-full w-full"
                                                    >
                                                        <Page
                                                            pageNumber={1}
                                                            width={240}
                                                            renderTextLayer={false}
                                                            renderAnnotationLayer={false}
                                                            className="shadow-md"
                                                        />
                                                    </Document>
                                                </div>
                                            ) : (
                                                <div className="p-6 text-center opacity-40">
                                                    <FileText size={64} className="mx-auto text-gray-400 mb-2" />
                                                    <div className="h-2 w-24 bg-gray-300 rounded mb-2 mx-auto"></div>
                                                    <div className="h-2 w-16 bg-gray-300 rounded mb-2 mx-auto"></div>
                                                    <div className="h-2 w-20 bg-gray-300 rounded mx-auto"></div>
                                                </div>
                                            )}

                                            {/* Overlay Button */}
                                            <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/50 to-transparent flex justify-center z-10 pointer-events-none">
                                            </div>
                                        </div>
                                        <div className="p-4 bg-orange-400 relative z-20">
                                            <button
                                                onClick={() => state.pdf.file && window.open(state.pdf.file, '_blank')}
                                                disabled={!state.pdf.file}
                                                className="w-full py-3 bg-white/20 backdrop-blur-sm border border-white/40 rounded-lg text-white font-bold hover:bg-white/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <Eye size={18} />
                                                {state.info.buttonText}
                                            </button>
                                        </div>
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
                                    value={state.pdf.file || 'https://example.com/file.pdf'}
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
