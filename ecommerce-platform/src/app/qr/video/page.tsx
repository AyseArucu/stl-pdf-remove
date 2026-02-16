
'use client';

import React, { useState, useRef } from 'react';
import {
    QrCode, Download, Palette, Type, AppWindow, Settings, Lock,
    ChevronDown, ChevronUp, Plus, Trash2, Info, Eye, Smartphone,
    ArrowLeft, Video, ShoppingCart, Gamepad2, Globe, Command, Play,
    Wifi, Battery, Signal, Paintbrush, PenTool, ArrowRightLeft,
    Youtube, Facebook, Instagram, Twitter, Linkedin
} from 'lucide-react';
import FrameRenderer, { QrDesignState } from '@/components/qr/FrameRenderer';
import QRCodeDesignControl from '@/components/qr/QRCodeDesignControl';
import html2canvas from 'html2canvas';
import { createQrCode } from '@/app/actions/qr';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';

// Standard social icons mapping
const SOCIAL_ICONS: Record<string, any> = {
    facebook: Facebook,
    instagram: Instagram,
    twitter: Twitter,
    linkedin: Linkedin,
    website: Globe
};

export default function VideoQrPage() {
    const router = useRouter();
    const { user } = useUser();
    const [activeTab, setActiveTab] = useState<'content' | 'qr'>('content');
    const [expandedSection, setExpandedSection] = useState<string | null>('video');
    const [previewMode, setPreviewMode] = useState<'mobile' | 'desktop'>('mobile');
    const qrRef = useRef<HTMLDivElement>(null);

    // Initial State
    const [state, setState] = useState({
        video: {
            url: '',
            type: 'youtube' // or 'vimeo', 'custom'
        },
        design: {
            themeColor: '#000000',
            bgColor: '#f3f4f6',
            textColor: '#000000'
        },
        info: {
            title: '',
            description: '',
            buttonText: 'Daha fazla göster',
            buttonUrl: ''
        },
        socials: {
            facebook: '',
            instagram: '',
            twitter: '',
            website: ''
        },
        fonts: {
            header: 'Inter',
            body: 'Inter'
        },
        welcomeScreen: {
            enabled: false,
            mediaType: 'image', // 'image' | 'video'
            mediaUrl: null as string | null,
            timeout: 2000
        },
        settings: {
            name: '',
            password: ''
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
            gradient: { enabled: false, start: '#000000', end: '#000000', type: 'linear', rotation: 0 }
        } as QrDesignState
    });

    // Helper to update state
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

    const toggleSection = (section: string) => {
        setExpandedSection(expandedSection === section ? null : section);
    };

    const handleWelcomeMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                updateState('welcomeScreen.mediaUrl', reader.result as string);
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
            a.download = `video-qr-${Date.now()}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            // Save to DB if user is logged in
            if (user) {
                await createQrCode({
                    type: 'video',
                    name: state.settings.name || 'Video QR',
                    data: state,
                    userId: user.id
                });
            }
        } catch (err) {
            console.error('Download failed:', err);
        }
    };

    // Helper to extract Video ID (Simplified for standard YouTube/Vimeo)
    const getVideoId = (url: string) => {
        if (!url) return null;
        // Basic parser for YouTube
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const videoId = getVideoId(state.video.url);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-800">
            {/* Header */}
            <header className="bg-white border-b px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.push('/')} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <ArrowLeft size={20} className="text-gray-600" />
                    </button>
                    <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <Video className="text-purple-500" />
                        Video QR Kodu
                    </h1>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex bg-gray-100 p-1 rounded-lg">
                        <button
                            onClick={() => setActiveTab('content')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'content' ? 'bg-white shadow text-purple-600' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            İçerik
                        </button>
                        <button
                            onClick={() => setActiveTab('qr')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'qr' ? 'bg-white shadow text-purple-600' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            QR Kod
                        </button>
                    </div>
                    <button onClick={downloadQr} className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-lg shadow-purple-200">
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
                            <h2 className="text-lg font-bold mb-4">2. QR kodunuza içerik ekleyin</h2>

                            {/* Video Section */}
                            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                                <button
                                    onClick={() => toggleSection('video')}
                                    className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                                            <Video size={18} />
                                        </div>
                                        <div className="text-left">
                                            <span className="font-semibold block">Video <span className="text-red-500">*</span></span>
                                            <span className="text-xs text-gray-500">Sayfanıza bir video ekleyin (YouTube, Vimeo vb.)</span>
                                        </div>
                                    </div>
                                    {expandedSection === 'video' ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
                                </button>
                                {expandedSection === 'video' && (
                                    <div className="p-4 border-t bg-gray-50 space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Video URL</label>
                                            <div className="flex items-center border rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-purple-500">
                                                <div className="bg-gray-50 px-3 py-2 border-r text-gray-500">
                                                    <Globe size={16} />
                                                </div>
                                                <input
                                                    type="url"
                                                    value={state.video.url}
                                                    onChange={(e) => updateState('video.url', e.target.value)}
                                                    className="w-full p-2 outline-none text-sm"
                                                    placeholder="https://www.youtube.com/watch?v=..."
                                                />
                                            </div>
                                            <p className="text-xs text-gray-400 mt-1">YouTube veya Vimeo video bağlantısını yapıştırın.</p>
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
                                            <span className="text-xs text-gray-500">Sayfanız için bir renk teması seçin.</span>
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

                                            <div className="mt-4">
                                                <div className="flex-1">
                                                    <label className="block text-[10px] font-bold text-gray-700 mb-1.5">Yazı Rengi</label>
                                                    <div className="flex items-center border border-gray-200 rounded-lg p-1 bg-white relative">
                                                        <div className="w-6 h-6 rounded flex items-center justify-center shrink-0 mr-2" style={{ backgroundColor: state.design.textColor }}>
                                                            <PenTool size={12} className={`text-white mix-blend-difference`} />
                                                        </div>
                                                        <span className="text-[10px] font-mono font-medium text-gray-600 uppercase flex-1">{state.design.textColor}</span>
                                                        <input
                                                            type="color"
                                                            value={state.design.textColor}
                                                            onChange={(e) => updateState('design.textColor', e.target.value)}
                                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Video Info Section */}
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
                                            <span className="font-semibold block">Video Bilgileri</span>
                                            <span className="text-xs text-gray-500">Video sayfanıza biraz bağlam ekleyin.</span>
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
                                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                                                placeholder="Örn: Yemek Pişirme Dersi"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
                                            <textarea
                                                value={state.info.description}
                                                onChange={(e) => updateState('info.description', e.target.value)}
                                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none h-24"
                                                placeholder="Videonuz hakkında kısa bir açıklama..."
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Buton Metni</label>
                                                <input
                                                    type="text"
                                                    value={state.info.buttonText}
                                                    onChange={(e) => updateState('info.buttonText', e.target.value)}
                                                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Buton URL</label>
                                                <input
                                                    type="url"
                                                    value={state.info.buttonUrl}
                                                    onChange={(e) => updateState('info.buttonUrl', e.target.value)}
                                                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                                                    placeholder="https://..."
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Social Media Section */}
                            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                                <button
                                    onClick={() => toggleSection('socials')}
                                    className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                                            <Globe size={18} />
                                        </div>
                                        <div className="text-left">
                                            <span className="font-semibold block">Sosyal ağlar</span>
                                            <span className="text-xs text-gray-500">Sayfanıza sosyal medya bağlantıları ekleyin.</span>
                                        </div>
                                    </div>
                                    {expandedSection === 'socials' ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
                                </button>
                                {expandedSection === 'socials' && (
                                    <div className="p-4 border-t bg-gray-50 space-y-4">
                                        {Object.keys(state.socials).map((platform) => (
                                            <div key={platform} className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center capitalize text-gray-600">
                                                    {platform === 'website' ? <Globe size={16} /> : platform[0]}
                                                </div>
                                                <div className="flex-1">
                                                    <input
                                                        type="url"
                                                        value={(state.socials as any)[platform]}
                                                        onChange={(e) => updateState(`socials.${platform}`, e.target.value)}
                                                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-sm"
                                                        placeholder={`https://${platform}.com/...`}
                                                    />
                                                </div>
                                            </div>
                                        ))}
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
                                                    className={`p-3 border rounded-lg text-left hover:border-purple-500 transition-colors ${state.fonts.header === font ? 'border-purple-500 bg-purple-50' : 'border-gray-200'}`}
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

                            {/* Welcome Screen Section */}
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
                                            <span className="font-semibold block">QR Kodun Adı</span>
                                            <span className="text-xs text-gray-500">QR kodunuza bir isim verin.</span>
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
                                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Password Section */}
                            <div className="bg-white rounded-xl shadow-sm border overflow-hidden mb-8">
                                <button
                                    onClick={() => toggleSection('password')}
                                    className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 container-icon">
                                            <Lock size={18} />
                                        </div>
                                        <div className="text-left">
                                            <span className="font-semibold block">Şifre</span>
                                            <span className="text-xs text-gray-500">QR kodunuzu şifre ile koruyun.</span>
                                        </div>
                                    </div>
                                    {expandedSection === 'password' ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
                                </button>
                                {expandedSection === 'password' && (
                                    <div className="p-4 border-t bg-gray-50 space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Şifre (Opsiyonel)</label>
                                            <input
                                                type="password"
                                                value={state.settings.password}
                                                onChange={(e) => updateState('settings.password', e.target.value)}
                                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                                                placeholder="******"
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
                            className={`p-2 rounded-lg ${previewMode === 'mobile' ? 'bg-white shadow text-purple-600' : 'text-gray-500 hover:bg-white/50'}`}
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
                            <div className="h-full overflow-y-auto relative flex flex-col no-scrollbar" style={{ backgroundColor: state.design.bgColor }}>
                                {/* Top Header Background */}
                                <div className="w-full h-[35%] rounded-b-[2rem] absolute top-0 left-0 z-0 transition-colors duration-300" style={{ backgroundColor: state.design.themeColor }} />

                                <div className="relative z-10 flex-1 flex flex-col items-center px-6 pt-16 pb-8">
                                    {/* Video Container */}
                                    <div className="w-full aspect-video bg-black rounded-xl overflow-hidden shadow-lg mb-6 z-10">
                                        {videoId ? (
                                            <iframe
                                                width="100%"
                                                height="100%"
                                                src={`https://www.youtube.com/embed/${videoId}`}
                                                title="Video Preview"
                                                frameBorder="0"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                            />
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 bg-gray-100">
                                                <Play size={32} className="opacity-50 mb-2" />
                                                <span className="text-xs">Video Önizleme</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Info Card */}
                                    <div className="bg-white w-full rounded-2xl p-5 shadow-sm text-center -mt-2 mb-4">
                                        {state.info.title && (
                                            <h2 className="text-lg font-bold mb-2" style={{ color: state.design.textColor }}>{state.info.title}</h2>
                                        )}
                                        {state.info.description && (
                                            <p className="text-sm mb-4 leading-relaxed opacity-80 line-clamp-3" style={{ color: state.design.textColor }}>
                                                {state.info.description}
                                            </p>
                                        )}

                                        {state.info.buttonText && (
                                            <a
                                                href={state.info.buttonUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="block w-full py-3 rounded-xl font-bold text-sm transition-transform active:scale-95 shadow-md"
                                                style={{ backgroundColor: state.design.themeColor, color: '#fff' }} // Assuming white text for button
                                            >
                                                {state.info.buttonText}
                                            </a>
                                        )}
                                    </div>

                                    {/* Social Icons */}
                                    <div className="mt-auto pt-4 flex gap-3 flex-wrap justify-center w-full">
                                        {Object.entries(state.socials).map(([key, url]) => {
                                            if (!url) return null;
                                            return (
                                                <a key={key} href={url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center text-gray-700 hover:scale-110 transition-transform">
                                                    {key === 'facebook' && <Facebook size={18} />}
                                                    {key === 'instagram' && <Instagram size={18} />}
                                                    {key === 'twitter' && <Twitter size={18} />}
                                                    {key === 'website' && <Globe size={18} />}
                                                </a>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white p-8 rounded-xl shadow-lg flex flex-col items-center" ref={qrRef}>
                            <FrameRenderer
                                frameId={state.qrDesign.frame}
                                currentDesign={state.qrDesign}
                                value={state.video.url || 'https://example.com'}
                                size={280}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
