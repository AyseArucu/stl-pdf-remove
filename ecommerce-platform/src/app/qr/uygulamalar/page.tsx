'use client';

import React, { useState, useRef } from 'react';
import {
    QrCode, Download, Palette, Type, AppWindow, Settings, Lock,
    ChevronDown, ChevronUp, Plus, Trash2, Info, Eye, Smartphone,
    ArrowLeft, Video, ShoppingCart, Gamepad2, Globe, Command, Play,
    Wifi, Battery, Signal, Paintbrush, PenTool, ArrowRightLeft
} from 'lucide-react';
import FrameRenderer, { QrDesignState } from '@/components/qr/FrameRenderer';
import QRCodeDesignControl from '@/components/qr/QRCodeDesignControl';
import html2canvas from 'html2canvas'; // Ensure this is installed or available
import { createQrCode } from '@/app/actions/qr'; // Verify path
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext'; // Verify path

// --- Types ---

interface AppQrState {
    design: {
        themeColor: string;
        bgColor: string;
        textColor: string;
    };
    qrDesign: QrDesignState;
    info: {
        name: string;
        description: string;
        logo: string | null;
    };
    platforms: {
        appStore: string;
        googlePlay: string;
        amazon: string;
        website: string;
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

const INITIAL_STATE: AppQrState = {
    design: {
        themeColor: '#ef4444', // Red as in screenshot
        bgColor: '#f3f4f6', // Light gray default for bottom part
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
        name: 'Sağlık ve Sağlıklı Yaşam Uygulaması',
        description: 'Nourish uygulamasıyla öğününüzü takip edip beslenme hedeflerinizi kontrol edin',
        logo: null
    },
    platforms: {
        appStore: 'https://www.apple.com/tr/app-store/',
        googlePlay: 'https://play.google.com/',
        amazon: 'https://www.amazon.com/',
        website: 'www.erashugaming.com'
    },
    fonts: {
        header: 'Inter',
        text: 'Inter'
    },
    welcomeScreen: {
        enabled: true,
        mediaType: 'image',
        mediaUrl: null,
        timeout: 2000
    },
    settings: {
        name: 'Uygulama QR Kodum',
        password: ''
    }
};

export default function AppQrPage() {
    const { user } = useUser();
    const router = useRouter();
    const [state, setState] = useState<AppQrState>(INITIAL_STATE);
    const [activeTab, setActiveTab] = useState<'content' | 'qr'>('content');
    const [expandedSection, setExpandedSection] = useState<string | null>('info');
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

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                updateState('info.logo', reader.result as string);
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
            a.download = 'app-qr.png';
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
                        <AppWindow className="text-red-500" />
                        Uygulama QR Kodu
                    </h1>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex bg-gray-100 p-1 rounded-lg">
                        <button
                            onClick={() => setActiveTab('content')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'content' ? 'bg-white shadow text-red-600' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            İçerik
                        </button>
                        <button
                            onClick={() => setActiveTab('qr')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'qr' ? 'bg-white shadow text-red-600' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            QR Kod
                        </button>
                    </div>
                    <button onClick={downloadQr} className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-lg shadow-red-200">
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
                                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 container-icon">
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
                                    <div className="p-4 border-t bg-gray-50 space-y-6">
                                        <div className="flex items-start gap-3 bg-blue-50/50 p-3 rounded-xl">
                                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                                                <Paintbrush size={18} />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-800 text-sm">Tasarım</h3>
                                                <p className="text-xs text-gray-500 mt-1">Sayfanız için bir renk teması seçin.</p>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-gray-800 mb-2">Renk paleti</label>
                                            <div className="flex flex-wrap gap-1.5 mb-4">
                                                {[
                                                    { p: '#3b82f6', s: '#22c55e' },
                                                    { p: '#ffffff', s: '#000000' },
                                                    { p: '#eff6ff', s: '#1e40af' },
                                                    { p: '#ca8a04', s: '#000000' },
                                                    { p: '#a855f7', s: '#111827' },
                                                    { p: '#ef4444', s: '#ffffff' },
                                                    { p: '#f59e0b', s: '#fffbeb' },
                                                    { p: '#10b981', s: '#064e3b' },
                                                    { p: '#6366f1', s: '#e0e7ff' },
                                                    { p: '#ec4899', s: '#831843' },
                                                ].map((palette, i) => (
                                                    <button
                                                        key={i}
                                                        onClick={() => setState(prev => ({
                                                            ...prev,
                                                            design: { ...prev.design, themeColor: palette.p, bgColor: palette.s }
                                                        }))}
                                                        className={`w-6 h-6 rounded-md border-2 overflow-hidden flex relative transition-all hover:scale-110 active:scale-95 ${state.design.themeColor === palette.p && state.design.bgColor === palette.s ? 'border-green-500 ring-2 ring-green-100 scale-110 shadow-sm' : 'border-gray-200'}`}
                                                    >
                                                        <div className="w-1/2 h-full" style={{ backgroundColor: palette.p }} />
                                                        <div className="w-1/2 h-full" style={{ backgroundColor: palette.s }} />
                                                    </button>
                                                ))}
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <div className="flex-1">
                                                    <label className="block text-[10px] font-bold text-gray-700 mb-1.5">Ana renk</label>
                                                    <div className="flex items-center border border-gray-200 rounded-lg p-1 bg-white relative">
                                                        <div className="w-6 h-6 rounded flex items-center justify-center shrink-0 mr-2" style={{ backgroundColor: state.design.themeColor }}>
                                                            <PenTool size={12} className={`text-white mix-blend-difference`} />
                                                        </div>
                                                        <span className="text-[10px] font-mono font-medium text-gray-600 uppercase flex-1">{state.design.themeColor}</span>
                                                        <input
                                                            type="color"
                                                            value={state.design.themeColor}
                                                            onChange={(e) => updateState('design.themeColor', e.target.value)}
                                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                        />
                                                    </div>
                                                </div>

                                                <button
                                                    onClick={() => setState(prev => ({
                                                        ...prev,
                                                        design: { ...prev.design, themeColor: prev.design.bgColor, bgColor: prev.design.themeColor }
                                                    }))}
                                                    className="w-8 h-8 rounded-full border border-gray-200 text-green-500 hover:border-green-500 hover:bg-green-50 flex items-center justify-center transition-all mt-5 shrink-0"
                                                >
                                                    <ArrowRightLeft size={14} />
                                                </button>

                                                <div className="flex-1">
                                                    <label className="block text-[10px] font-bold text-gray-700 mb-1.5">İkincil renk</label>
                                                    <div className="flex items-center border border-gray-200 rounded-lg p-1 bg-white relative">
                                                        <div className="w-6 h-6 rounded flex items-center justify-center shrink-0 mr-2" style={{ backgroundColor: state.design.bgColor }}>
                                                            <PenTool size={12} className={`text-white mix-blend-difference`} />
                                                        </div>
                                                        <span className="text-[10px] font-mono font-medium text-gray-600 uppercase flex-1">{state.design.bgColor}</span>
                                                        <input
                                                            type="color"
                                                            value={state.design.bgColor}
                                                            onChange={(e) => updateState('design.bgColor', e.target.value)}
                                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* App Info Section */}
                            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                                <button
                                    onClick={() => toggleSection('info')}
                                    className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 container-icon">
                                            <Info size={18} />
                                        </div>
                                        <div className="text-left">
                                            <span className="font-semibold block">Uygulama Bilgileri <span className="text-red-500">*</span></span>
                                            <span className="text-xs text-gray-500">Uygulamanız hakkında bilgi verin.</span>
                                        </div>
                                    </div>
                                    {expandedSection === 'info' ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
                                </button>
                                {expandedSection === 'info' && (
                                    <div className="p-4 border-t bg-gray-50 space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Uygulama Adı</label>
                                            <input
                                                type="text"
                                                value={state.info.name}
                                                onChange={(e) => updateState('info.name', e.target.value)}
                                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                                                placeholder="Örn: My Awesome App"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
                                            <textarea
                                                value={state.info.description}
                                                onChange={(e) => updateState('info.description', e.target.value)}
                                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none h-24"
                                                placeholder="Uygulamanızı kısaca tanıtın..."
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Uygulama Logosu</label>
                                            <div className="flex items-center gap-4">
                                                {state.info.logo ? (
                                                    <div className="w-20 h-20 rounded-xl overflow-hidden border relative group">
                                                        <img src={state.info.logo} alt="Logo" className="w-full h-full object-cover" />
                                                        <button
                                                            onClick={() => updateState('info.logo', null)}
                                                            className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity"
                                                        >
                                                            <Trash2 size={20} />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <label className="w-20 h-20 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-red-500 hover:bg-red-50 transition-colors">
                                                        <Plus size={24} className="text-gray-400" />
                                                        <span className="text-[10px] text-gray-500 mt-1">Yükle</span>
                                                        <input type="file" onChange={handleLogoUpload} className="hidden" accept="image/*" />
                                                    </label>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Platforms Section */}
                            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                                <button
                                    onClick={() => toggleSection('platforms')}
                                    className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 container-icon">
                                            <AppWindow size={18} />
                                        </div>
                                        <div className="text-left">
                                            <span className="font-semibold block">Farklı Platformlara Bağlantılar <span className="text-red-500">*</span></span>
                                            <span className="text-xs text-gray-500">Uygulamanızı farklı uygulama mağazalarına bağlayın.</span>
                                        </div>
                                    </div>
                                    {expandedSection === 'platforms' ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
                                </button>
                                {expandedSection === 'platforms' && (
                                    <div className="p-4 border-t bg-gray-50 space-y-4">
                                        {/* Google Play */}
                                        <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-gray-100 shadow-sm transition-all hover:shadow-md hover:border-red-100 group">
                                            <div className="w-10 h-10 flex items-center justify-center shrink-0">
                                                <svg viewBox="0 0 512 512" width="28" height="28" fill="currentColor">
                                                    <path fill="#ea4335" d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1z" />
                                                    <path fill="#fbbc04" d="M47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0z" />
                                                    <path fill="#4285f4" d="M425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8z" />
                                                    <path fill="#34a853" d="M104.6 499l280.8-161.2-60.1-60.1L104.6 499z" />
                                                </svg>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <label className="block text-sm font-bold text-gray-800 mb-1">Google Play</label>
                                                <input
                                                    type="url"
                                                    value={state.platforms.googlePlay}
                                                    onChange={(e) => updateState('platforms.googlePlay', e.target.value)}
                                                    className="w-full text-sm text-gray-600 outline-none bg-transparent placeholder:text-gray-300"
                                                    placeholder="Örn. https://play.google.com/store/apps/..."
                                                />
                                            </div>
                                            <button
                                                onClick={() => updateState('platforms.googlePlay', '')}
                                                className="w-8 h-8 flex items-center justify-center rounded-lg border border-red-100 text-red-500 hover:bg-red-50 transition-colors shrink-0"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>

                                        {/* App Store */}
                                        <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-gray-100 shadow-sm transition-all hover:shadow-md hover:border-blue-100 group">
                                            <div className="w-10 h-10 bg-[#007AFF] rounded-lg flex items-center justify-center text-white shrink-0">
                                                <svg viewBox="0 0 384 512" width="20" height="20" fill="currentColor">
                                                    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 52.3-11.4 69.5-34.3z" />
                                                </svg>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <label className="block text-sm font-bold text-gray-800 mb-1">App Store</label>
                                                <input
                                                    type="url"
                                                    value={state.platforms.appStore}
                                                    onChange={(e) => updateState('platforms.appStore', e.target.value)}
                                                    className="w-full text-sm text-gray-600 outline-none bg-transparent placeholder:text-gray-300"
                                                    placeholder="Örn. https://apps.apple.com/us/app/..."
                                                />
                                            </div>
                                            <button
                                                onClick={() => updateState('platforms.appStore', '')}
                                                className="w-8 h-8 flex items-center justify-center rounded-lg border border-red-100 text-red-500 hover:bg-red-50 transition-colors shrink-0"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>

                                        {/* Amazon */}
                                        <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-gray-100 shadow-sm transition-all hover:shadow-md hover:border-orange-100 group">
                                            <div className="w-10 h-10 bg-[#FF9900] rounded-lg flex items-center justify-center text-white shrink-0">
                                                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                                                    <path d="M15.5 11.8c.8 0 1.2-.4 1.2-.8 0-.4-.3-.7-.9-.7-1.3 0-2.4.4-3.4 1-.1 0-.1.1-.2.1-.2 0-.3-.1-.3-.3 0-.1 0-.2.1-.3 1.2-1.3 2.7-1.9 4.3-1.9 1.5 0 2.6.9 2.6 2.3v3c0 .2 0 .5.1.7l.1.1h-1.9c-.1-.2-.1-.4-.1-.8-.6.7-1.5 1.1-2.4 1.1-1.4 0-2.5-.9-2.5-2.2 0-1.4 1.3-2.3 3.3-2.3zm2.5 5.8c1.9-.3 3.6-1.1 5.1-2.3.2-.2.2-.4.1-.6-.2-.2-.4-.2-.6-.1-1.3 1.1-2.9 1.8-4.6 2.1-.2 0-.4 0-.4.3 0 .2.2.5.4.6zM17.1 12.3c-.8 0-1.7.3-1.7 1.1 0 .6.5.9 1.1.9.6 0 1.2-.3 1.2-.9v-1.1h-.6z" />
                                                </svg>
                                                <span className="font-bold text-lg -mt-1 ml-0.5">a</span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <label className="block text-sm font-bold text-gray-800 mb-1">Amazon</label>
                                                <input
                                                    type="url"
                                                    value={state.platforms.amazon}
                                                    onChange={(e) => updateState('platforms.amazon', e.target.value)}
                                                    className="w-full text-sm text-gray-600 outline-none bg-transparent placeholder:text-gray-300"
                                                    placeholder="Örne. https://amazon.com/..."
                                                />
                                            </div>
                                            <button
                                                onClick={() => updateState('platforms.amazon', '')}
                                                className="w-8 h-8 flex items-center justify-center rounded-lg border border-red-100 text-red-500 hover:bg-red-50 transition-colors shrink-0"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>

                                        {/* Website */}
                                        <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-gray-100 shadow-sm transition-all hover:shadow-md hover:border-blue-100 group">
                                            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white shrink-0">
                                                <Globe size={20} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <label className="block text-sm font-bold text-gray-800 mb-1">Web Sitesi</label>
                                                <input
                                                    type="text"
                                                    value={state.platforms.website}
                                                    onChange={(e) => updateState('platforms.website', e.target.value)}
                                                    className="w-full text-sm text-gray-600 outline-none bg-transparent placeholder:text-gray-300"
                                                    placeholder="www.example.com"
                                                />
                                            </div>
                                            <button
                                                onClick={() => updateState('platforms.website', '')}
                                                className="w-8 h-8 flex items-center justify-center rounded-lg border border-red-100 text-red-500 hover:bg-red-50 transition-colors shrink-0"
                                            >
                                                <Trash2 size={16} />
                                            </button>
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
                                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 container-icon">
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
                                                    onClick={() => updateState('fonts.header', font)} // Simplification: set both?
                                                    className={`p-3 border rounded-lg text-left hover:border-red-500 transition-colors ${state.fonts.header === font ? 'border-red-500 bg-red-50' : 'border-gray-200'}`}
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
                                            <span className="font-semibold block">QR Kod Adı</span>
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
                                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                                            />
                                        </div>
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
                            className={`p-2 rounded-lg ${previewMode === 'mobile' ? 'bg-white shadow text-red-600' : 'text-gray-500 hover:bg-white/50'}`}
                        >
                            <Smartphone size={20} />
                        </button>
                    </div>

                    {activeTab === 'content' ? (
                        <div className="w-[320px] h-[640px] bg-white rounded-[3rem] shadow-2xl border-8 border-gray-900 overflow-hidden relative" style={{ fontFamily: state.fonts.header }}>
                            {/* Phone Status Bar (Mock) */}
                            <div className="absolute top-0 left-0 w-full h-8 bg-transparent z-10 flex justify-between px-6 pt-2 items-center font-semibold text-white">
                                <span className="text-xs">09:05</span>
                                <div className="flex items-center gap-1.5 opacity-90">
                                    <Signal size={14} className="stroke-[2.5]" />
                                    <Wifi size={14} className="stroke-[2.5]" />
                                    <Battery size={16} className="stroke-[2.5]" />
                                </div>
                            </div>

                            {/* Dynamic Content */}
                            <div className="h-full overflow-y-auto no-scrollbar relative" style={{ backgroundColor: state.design.bgColor }}>
                                <div className="absolute top-0 left-0 w-full h-[35%] rounded-b-[2.5rem] transition-colors duration-300" style={{ backgroundColor: state.design.themeColor }} />

                                <div className="relative z-10 pt-20 px-6 pb-8 min-h-full flex flex-col items-center">

                                    {/* App Info Card */}
                                    {/* Logo Card */}
                                    {state.info.logo && (
                                        <div className="w-24 h-24 bg-white rounded-2xl p-2 shadow-lg mb-6 z-10 transition-transform hover:scale-105 active:scale-95 duration-200">
                                            <img src={state.info.logo} alt="App Logo" className="w-full h-full object-cover rounded-xl" />
                                        </div>
                                    )}

                                    {/* Main Card */}
                                    <div className="bg-white w-full rounded-2xl p-6 shadow-xl flex flex-col items-center text-center -mt-12 pt-16">
                                        <h2 className="text-xl font-bold mb-2" style={{ color: state.design.textColor }}>{state.info.name}</h2>
                                        <p className="text-sm mb-6 leading-relaxed opacity-80" style={{ color: state.design.textColor }}>
                                            {state.info.description}
                                        </p>

                                        <div className="w-full space-y-3">
                                            {state.platforms.appStore && (
                                                <a href={state.platforms.appStore} target="_blank" className="bg-black text-white w-full py-3 px-4 rounded-xl flex items-center justify-center gap-3 hover:opacity-90 transition-opacity">
                                                    <svg viewBox="0 0 384 512" width="24" height="24" fill="currentColor">
                                                        <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 52.3-11.4 69.5-34.3z" />
                                                    </svg>
                                                    <div className="text-left">
                                                        <div className="text-[10px] font-medium opacity-80 uppercase leading-none">Şuradan indirin</div>
                                                        <div className="text-sm font-bold leading-none mt-1">App Store</div>
                                                    </div>
                                                </a>
                                            )}
                                            {state.platforms.googlePlay && (
                                                <a href={state.platforms.googlePlay} target="_blank" className="bg-black text-white w-full py-3 px-4 rounded-xl flex items-center justify-center gap-3 hover:opacity-90 transition-opacity">
                                                    <svg viewBox="0 0 512 512" width="24" height="24" fill="currentColor">
                                                        <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z" />
                                                    </svg>
                                                    <div className="text-left">
                                                        <div className="text-[10px] font-medium opacity-80 uppercase leading-none">Şurada bulabilirsiniz</div>
                                                        <div className="text-sm font-bold leading-none mt-1">Google Play</div>
                                                    </div>
                                                </a>
                                            )}
                                            {state.platforms.amazon && (
                                                <a href={state.platforms.amazon} target="_blank" className="bg-black text-white w-full py-3 px-4 rounded-xl flex items-center justify-center gap-3 hover:opacity-90 transition-opacity">
                                                    <ShoppingCart size={24} />
                                                    <div className="text-left">
                                                        <div className="text-[10px] font-medium opacity-80 uppercase leading-none">Mevcut</div>
                                                        <div className="text-sm font-bold leading-none mt-1">Amazon.com</div>
                                                    </div>
                                                </a>
                                            )}
                                        </div>
                                    </div>

                                    {/* Website Link */}
                                    {state.platforms.website && (
                                        <div className="mt-6 w-full px-4">
                                            <a
                                                href={state.platforms.website.startsWith('http') ? state.platforms.website : `https://${state.platforms.website}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="bg-white/90 backdrop-blur rounded-xl p-3 flex items-center justify-between text-sm text-gray-600 shadow-sm hover:bg-white transition-colors cursor-pointer block"
                                            >
                                                <Globe size={16} />
                                                <span className="truncate flex-1 mx-2">{state.platforms.website}</span>
                                                <ArrowLeft size={16} className="rotate-180" />
                                            </a>
                                        </div>
                                    )}

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
                                    value={state.platforms.website || state.platforms.appStore || 'https://example.com'}
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
