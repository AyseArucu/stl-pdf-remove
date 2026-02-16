'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
    QrCode, Download, Palette, User, Link as LinkIcon, Type, Image as ImageIcon,
    Settings, Lock, ChevronDown, ChevronUp, Plus, Trash2, GripVertical,
    Facebook, Instagram, Youtube, Twitter, Linkedin, MessageCircle, Music,
    Globe, Ghost, Gamepad2, Pin, Mail, Phone, Star, ArrowRight, Video,
    MapPin, Calendar, FileText, MoreHorizontal, X, ExternalLink, Share2,
    ArrowLeft, Paintbrush, PenTool, ArrowRightLeft, Info, Eye, Battery, Signal, Wifi
} from 'lucide-react';
import FrameRenderer, { QrDesignState } from '@/components/qr/FrameRenderer';
import QRCodeDesignControl from '@/components/qr/QRCodeDesignControl';
import QrPageHeader from '@/components/qr/QrPageHeader';
import LinkListTemplate from '@/components/qr/LinkListTemplate';
import html2canvas from 'html2canvas';
import { createQrCode } from '@/app/actions/qr';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';


// --- Types ---
// Reusing types where possible, but keeping them local for clarity if they diverge
type SocialItem = {
    id: string;
    platform: 'instagram' | 'tiktok' | 'youtube' | 'facebook' | 'x' | 'whatsapp' | 'telegram' | 'spotify' | 'linkedin' | 'snapchat' | 'pinterest' | 'discord' | 'twitch' | 'website';
    url: string;
    active: boolean;
};

interface SocialMediaQrState {
    design: {
        themeId: string;
        bgColor: string;
        linkBgColor: string;
        linkTextColor: string;
        headerColor: string;
        socialBgColor?: string;
        socialTextColor?: string;
    };
    qrDesign: QrDesignState;
    info: {
        image: string | null;
        images: string[]; // New: Array for slider images
        title: string;
        description: string;
    };
    socials: SocialItem[];
    fonts: {
        header: string;
        text: string;
    };
    welcomeScreen: {
        enabled: boolean;
        image: string | null;
        timeout: number;
    };
    settings: {
        name: string;
        password: string;
    };
}

const INITIAL_STATE: SocialMediaQrState = {
    design: {
        themeId: 'custom',
        bgColor: '#fdf2f8', // pink-50
        linkBgColor: '#ffffff',
        linkTextColor: '#be185d', // pink-700
        headerColor: '#db2777', // pink-600
        socialBgColor: '#ffffff',
        socialTextColor: '#1f2937',
    },
    qrDesign: {
        frame: 'none',
        frameLabel: 'SCAN ME',
        pattern: 'dot',
        cornerStyle: 'dot',
        cornerColor: '#db2777',
        logo: null,
        fgColor: '#000000',
        bgColor: '#ffffff',
        gradient: { enabled: false, start: '#db2777', end: '#831843' }
    },
    info: {
        image: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        images: [
            'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
            'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
            'https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
            'https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        ], // Initialize with reliabe nature images
        title: 'Erashu Gaming',
        description: 'Erashu Gaming dijital merkezine hoş geldiniz. Bu platformda farklı model QR kod tasarımlarını, kişilere özel web sitesi çözümlerini ve 3D yazıcı için STL dosyalarını paylaşıyorum. Güncel tasarımlar ve özel projeler için benimle bağlantıda kalın.',
    },
    socials: [
        { id: 's1', platform: 'facebook', url: 'https://facebook.com', active: true },
        { id: 's2', platform: 'instagram', url: 'https://instagram.com', active: true },
        { id: 's3', platform: 'x', url: 'https://twitter.com', active: true },
    ],
    fonts: {
        header: 'Inter',
        text: 'Inter'
    },
    welcomeScreen: {
        enabled: false,
        image: null,
        timeout: 2000
    },
    settings: {
        name: 'Sosyal Medya QR',
        password: ''
    }
};

const FONT_OPTIONS = ['Inter', 'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Poppins'];

// Redefine locally if needed or reuse from template, sticking to local for self-containment
const SOCIAL_PLATFORMS_LIST = [
    { id: 'instagram', icon: <Instagram size={24} />, color: 'bg-pink-600' },
    {
        id: 'tiktok',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" /></svg>
        ),
        color: 'bg-black'
    },
    { id: 'youtube', icon: <Youtube size={24} />, color: 'bg-red-600' },
    { id: 'facebook', icon: <Facebook size={24} />, color: 'bg-blue-600' },
    { id: 'x', icon: <Twitter size={24} />, color: 'bg-black' },
    { id: 'whatsapp', icon: <MessageCircle size={24} />, color: 'bg-green-500' },
    { id: 'telegram', icon: <div className="font-bold text-sm">Tg</div>, color: 'bg-blue-400' },
    { id: 'spotify', icon: <Music size={24} />, color: 'bg-green-600' },
    { id: 'linkedin', icon: <Linkedin size={24} />, color: 'bg-blue-700' },
    { id: 'snapchat', icon: <Ghost size={24} />, color: 'bg-yellow-400' },
    { id: 'pinterest', icon: <Pin size={24} />, color: 'bg-red-700' },
    { id: 'discord', icon: <Gamepad2 size={24} />, color: 'bg-indigo-600' },
    { id: 'twitch', icon: <Gamepad2 size={24} />, color: 'bg-purple-600' },
    { id: 'website', icon: <Globe size={24} />, color: 'bg-gray-600' },
];

export default function SocialMediaQrPage() {
    const router = useRouter();
    const { user } = useUser();
    const [state, setState] = useState<SocialMediaQrState>(INITIAL_STATE);

    // UI States
    const [activeTab, setActiveTab] = useState<'content' | 'qr'>('content');
    const [expandedSection, setExpandedSection] = useState<string | null>('info');

    // Saving & Generating
    const [createdQr, setCreatedQr] = useState<{ id: string, qrImage: string } | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);
    const qrRef = useRef<HTMLDivElement>(null);

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

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'profile' | 'welcome' | 'gallery') => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const result = event.target?.result as string;
                if (target === 'profile') {
                    updateState('info.image', result);
                    // Also add to gallery if gallery is empty to start with? Or keep separate?
                    // Let's keep separate for now, but maybe user wants the profile image in slider.
                    // Actually, if using slider, 'image' might be the fallback or the first image.
                    // Let's just update 'image' for backward compatibility and 'images' array.
                    setState(prev => ({
                        ...prev,
                        info: {
                            ...prev.info,
                            image: result
                        }
                    }));
                } else if (target === 'gallery') {
                    setState(prev => ({
                        ...prev,
                        info: {
                            ...prev.info,
                            images: [...(prev.info.images || []), result]
                        }
                    }));
                } else {
                    updateState('welcomeScreen.image', result);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const removeGalleryImage = (index: number) => {
        setState(prev => ({
            ...prev,
            info: {
                ...prev.info,
                images: prev.info.images.filter((_, i) => i !== index)
            }
        }));
    };

    // --- Socials Management ---
    const addSocial = (platformId: string) => {
        if (state.socials.find(s => s.platform === platformId)) return;
        const newSocial: SocialItem = {
            id: Date.now().toString(),
            platform: platformId as any,
            url: '',
            active: true
        };
        setState(prev => ({ ...prev, socials: [...prev.socials, newSocial] }));
    };

    const removeSocial = (id: string) => {
        setState(prev => ({ ...prev, socials: prev.socials.filter(s => s.id !== id) }));
    };

    const updateSocial = (id: string, url: string) => {
        setState(prev => ({
            ...prev,
            socials: prev.socials.map(s => s.id === id ? { ...s, url } : s)
        }));
    };

    const handleSave = async () => {
        if (!user) {
            router.push(`/login?callbackUrl=${encodeURIComponent('/qr/sosyal-medya')}`);
            return;
        }

        setIsSaving(true);
        setSaveError(null);

        try {
            const formData = new FormData();
            formData.append('targetUrl', 'SOCIAL_MEDIA');
            formData.append('name', state.settings.name || state.info.title || 'Sosyal Medya QR');
            if (state.settings.password) {
                formData.append('password', state.settings.password);
            }

            const designData = {
                type: 'social_media',
                design: state.design,
                info: state.info,
                socials: state.socials,
                links: [],
                fonts: state.fonts,
                welcomeScreen: state.welcomeScreen,
                qrDesign: state.qrDesign
            };

            formData.append('design', JSON.stringify(designData));

            const res = await createQrCode(formData);

            if (res.error) {
                setSaveError(res.error);
                return;
            }

            if (res.success && res.id) {
                setCreatedQr({ id: res.id, qrImage: '' });
            }

        } catch (error) {
            console.error('Save error:', error);
            setSaveError('Bir hata oluştu. Lütfen tekrar deneyin.');
        } finally {
            setIsSaving(false);
        }
    };

    const downloadQr = async () => {
        if (!qrRef.current) return;
        try {
            const element = document.getElementById('qr-download-target') || qrRef.current;
            if (!element) return;
            const canvas = await html2canvas(element, { backgroundColor: null });
            const url = canvas.toDataURL('image/png');
            const a = document.createElement('a');
            a.href = url;
            a.download = `qr-${state.settings.name || 'social'}.png`;
            a.click();
        } catch (err) {
            console.error('Download failed', err);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-800">
            {/* Header */}
            {/* Header */}
            <QrPageHeader
                title="Sosyal Medya QR"
                icon={<Share2 className="text-pink-600" />}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                onSave={handleSave}
                isSaving={isSaving}
            />

            <div className="flex flex-1 lg:flex-row flex-col max-w-[1600px] mx-auto w-full p-6 gap-8">

                {/* Left Panel: Editor */}
                <div className="flex-1 min-w-[350px] space-y-4 overflow-y-auto max-h-[calc(100vh-120px)] pr-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    <style jsx>{`
                        div::-webkit-scrollbar {
                            display: none;
                        }
                    `}</style>
                    {activeTab === 'content' ? (
                        <>
                            {/* Design Section */}
                            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                                <button onClick={() => toggleSection('design')} className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                            <Palette size={18} />
                                        </div>
                                        <div className="text-left">
                                            <span className="font-semibold block">Tasarım</span>
                                            <span className="text-xs text-gray-500">Renk ve tema ayarları.</span>
                                        </div>
                                    </div>
                                    {expandedSection === 'design' ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
                                </button>
                                {expandedSection === 'design' && (
                                    <div className="p-4 border-t bg-gray-50 space-y-6">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-800 mb-2">Başlık Rengi</label>
                                            <div className="flex items-center gap-2">
                                                <input type="color" value={state.design.headerColor} onChange={(e) => updateState('design.headerColor', e.target.value)} className="w-10 h-10 rounded cursor-pointer border-none p-0" />
                                                <input type="text" value={state.design.headerColor} readOnly className="flex-1 border rounded p-2 text-xs uppercase" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-800 mb-2">Arkaplan Rengi</label>
                                            <div className="flex items-center gap-2">
                                                <input type="color" value={state.design.bgColor} onChange={(e) => updateState('design.bgColor', e.target.value)} className="w-10 h-10 rounded cursor-pointer border-none p-0" />
                                                <input type="text" value={state.design.bgColor} readOnly className="flex-1 border rounded p-2 text-xs uppercase" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-800 mb-2">Sosyal Medya Kart Rengi</label>
                                            <div className="flex items-center gap-2">
                                                <input type="color" value={state.design.socialBgColor || '#ffffff'} onChange={(e) => updateState('design.socialBgColor', e.target.value)} className="w-10 h-10 rounded cursor-pointer border-none p-0" />
                                                <input type="text" value={state.design.socialBgColor || '#ffffff'} readOnly className="flex-1 border rounded p-2 text-xs uppercase" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-800 mb-2">Sosyal Medya Yazı Rengi</label>
                                            <div className="flex items-center gap-2">
                                                <input type="color" value={state.design.socialTextColor || '#1f2937'} onChange={(e) => updateState('design.socialTextColor', e.target.value)} className="w-10 h-10 rounded cursor-pointer border-none p-0" />
                                                <input type="text" value={state.design.socialTextColor || '#1f2937'} readOnly className="flex-1 border rounded p-2 text-xs uppercase" />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Info Section */}
                            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                                <button onClick={() => toggleSection('info')} className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                                            <User size={18} />
                                        </div>
                                        <div className="text-left">
                                            <span className="font-semibold block">Bilgiler</span>
                                            <span className="text-xs text-gray-500">Profil bilgilerinizi düzenleyin.</span>
                                        </div>
                                    </div>
                                    {expandedSection === 'info' ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
                                </button>
                                {expandedSection === 'info' && (
                                    <div className="p-4 border-t bg-gray-50 space-y-4">
                                        {/* Gallery / Images */}
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 mb-2">Profil & Slider Görselleri</label>
                                            <div className="flex flex-wrap gap-2">
                                                {/* Upload Button */}
                                                <label className="w-20 h-20 bg-gray-100 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-200 border-2 border-dashed border-gray-300">
                                                    <Plus className="text-gray-400 mb-1" size={20} />
                                                    <span className="text-[10px] text-gray-500">Ekle</span>
                                                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'gallery')} />
                                                </label>

                                                {/* Image List */}
                                                {(state.info.images || []).map((img, index) => (
                                                    <div key={index} className="w-20 h-20 relative group">
                                                        <img src={img} alt={`Gallery ${index}`} className="w-full h-full object-cover rounded-lg border border-gray-200" />
                                                        <button
                                                            onClick={() => removeGalleryImage(index)}
                                                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                                                        >
                                                            <X size={12} />
                                                        </button>
                                                    </div>
                                                ))}

                                                {/* Fallback to legacy single image if gallery is empty but single image exists */}
                                                {(!state.info.images || state.info.images.length === 0) && state.info.image && (
                                                    <div className="w-20 h-20 relative group">
                                                        <img src={state.info.image} alt="Profile" className="w-full h-full object-cover rounded-lg border border-gray-200" />
                                                        {/* Show as standard image but technically it's the 'image' field, not 'images' array. 
                                                             If user adds proper gallery image, this might disappear if we only map 'images'. 
                                                             Let's make sure 'images' is populated or we display 'image' if 'images' is empty.
                                                             Wait, I am listing state.info.images above. If it's empty, this shows.
                                                         */}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="text-xs text-gray-500 mt-2">
                                                Profilinizde kaydırılabilir alan için birden fazla görsel ekleyebilirsiniz.
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Başlık / İsim</label>
                                            <input type="text" value={state.info.title} onChange={(e) => updateState('info.title', e.target.value)} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
                                            <textarea value={state.info.description} onChange={(e) => updateState('info.description', e.target.value)} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none h-24 resize-none" />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Socials Section */}
                            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                                <button onClick={() => toggleSection('socials')} className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                                            <Share2 size={18} />
                                        </div>
                                        <div className="text-left">
                                            <span className="font-semibold block">Sosyal Ağlar</span>
                                            <span className="text-xs text-gray-500">Hesaplarınızı ekleyin.</span>
                                        </div>
                                    </div>
                                    {expandedSection === 'socials' ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
                                </button>
                                {expandedSection === 'socials' && (
                                    <div className="p-4 border-t bg-gray-50 space-y-4">
                                        {state.socials.length > 0 && (
                                            <div className="space-y-3">
                                                {state.socials.map(social => {
                                                    const platformInfo = SOCIAL_PLATFORMS_LIST.find(p => p.id === social.platform);
                                                    return (
                                                        <div key={social.id} className="bg-white border rounded-lg p-2 flex gap-3 items-center shadow-sm">
                                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white ${platformInfo?.color}`}>{platformInfo?.icon}</div>
                                                            <input type="text" value={social.url} onChange={(e) => updateSocial(social.id, e.target.value)} className="flex-1 text-sm border-b border-transparent hover:border-gray-300 focus:border-blue-500 outline-none bg-transparent" placeholder={`${social.platform} kullanıcı adı veya linki`} />
                                                            <button onClick={() => removeSocial(social.id)} className="text-gray-400 hover:text-red-500 p-2"><Trash2 size={16} /></button>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                        <div className="grid grid-cols-5 sm:grid-cols-7 gap-2 pt-2">
                                            {SOCIAL_PLATFORMS_LIST.map(p => (
                                                <button key={p.id} onClick={() => addSocial(p.id)} className={`aspect-square rounded-lg flex items-center justify-center text-white transition-all hover:scale-110 ${state.socials.find(s => s.platform === p.id) ? 'ring-2 ring-offset-1 ring-blue-500 bg-blue-500/20' : 'hover:opacity-90'} ${p.color}`} title={p.id}>{p.icon}</button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Fonts Section */}
                            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                                <button onClick={() => toggleSection('fonts')} className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                                            <Type size={18} />
                                        </div>
                                        <div className="text-left">
                                            <span className="font-semibold block">Yazı Tipleri</span>
                                            <span className="text-xs text-gray-500">Font seçimi yapın.</span>
                                        </div>
                                    </div>
                                    {expandedSection === 'fonts' ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
                                </button>
                                {expandedSection === 'fonts' && (
                                    <div className="p-4 border-t bg-gray-50 space-y-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 mb-2">Başlık Fontu</label>
                                            <select value={state.fonts.header} onChange={(e) => updateState('fonts.header', e.target.value)} className="w-full border rounded p-2 text-sm bg-white">
                                                {FONT_OPTIONS.map(f => <option key={f} value={f}>{f}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 mb-2">Metin Fontu</label>
                                            <select value={state.fonts.text} onChange={(e) => updateState('fonts.text', e.target.value)} className="w-full border rounded p-2 text-sm bg-white">
                                                {FONT_OPTIONS.map(f => <option key={f} value={f}>{f}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Welcome Screen */}
                            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                                <button onClick={() => toggleSection('welcome')} className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center text-pink-600">
                                            <Eye size={18} />
                                        </div>
                                        <div className="text-left">
                                            <span className="font-semibold block">Karşılama Ekranı</span>
                                            <span className="text-xs text-gray-500">Açılış görseli ekleyin.</span>
                                        </div>
                                    </div>
                                    {expandedSection === 'welcome' ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
                                </button>
                                {expandedSection === 'welcome' && (
                                    <div className="p-4 border-t bg-gray-50 space-y-4">
                                        <div className="flex items-center gap-3">
                                            <input type="checkbox" checked={state.welcomeScreen.enabled} onChange={(e) => updateState('welcomeScreen.enabled', e.target.checked)} className="w-4 h-4 text-pink-600 rounded" />
                                            <label className="text-sm font-medium">Aktif Et</label>
                                        </div>
                                        {state.welcomeScreen.enabled && (
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 mb-2">Görsel Yükle</label>
                                                <div className="flex items-center gap-4">
                                                    <label className="w-full h-32 bg-gray-100 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-200 border-2 border-dashed border-gray-300">
                                                        {state.welcomeScreen.image ? (
                                                            <div className="relative w-full h-full"><img src={state.welcomeScreen.image} alt="Welcome" className="w-full h-full object-cover rounded-lg" /><button onClick={(e) => { e.preventDefault(); updateState('welcomeScreen.image', null); }} className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"><Trash2 size={14} /></button></div>
                                                        ) : (
                                                            <>
                                                                <ImageIcon className="text-gray-400 mb-2" />
                                                                <span className="text-xs text-gray-500">Görsel seçin</span>
                                                            </>
                                                        )}
                                                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'welcome')} />
                                                    </label>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Settings */}
                            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                                <button onClick={() => toggleSection('settings')} className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                                            <Settings size={18} />
                                        </div>
                                        <div className="text-left">
                                            <span className="font-semibold block">Ayarlar</span>
                                            <span className="text-xs text-gray-500">QR Adı ve Şifre.</span>
                                        </div>
                                    </div>
                                    {expandedSection === 'settings' ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
                                </button>
                                {expandedSection === 'settings' && (
                                    <div className="p-4 border-t bg-gray-50 space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">QR Adı</label>
                                            <input type="text" value={state.settings.name} onChange={(e) => updateState('settings.name', e.target.value)} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Şifre (Opsiyonel)</label>
                                            <input type="password" value={state.settings.password} onChange={(e) => updateState('settings.password', e.target.value)} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none" placeholder="Erişim şifresi belirleyin" />
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
                    {activeTab === 'content' ? (
                        <div className="w-[320px] h-[640px] bg-white rounded-[3rem] shadow-2xl border-8 border-gray-900 overflow-hidden relative fade-in" style={{ fontFamily: state.fonts.header }}>
                            {/* Phone Status Bar (Mock) */}
                            <div className="absolute top-0 left-0 w-full h-8 bg-transparent z-10 flex justify-between px-6 pt-2 items-center font-semibold text-white drop-shadow-md">
                                <span className="text-xs">09:05</span>
                                <div className="flex items-center gap-1.5 opacity-90">
                                    <Signal size={14} className="stroke-[2.5]" />
                                    <Wifi size={14} className="stroke-[2.5]" />
                                    <Battery size={16} className="stroke-[2.5]" />
                                </div>
                            </div>

                            {/* Preview Content */}
                            <div className="w-full h-full overflow-y-auto bg-white" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                                <style jsx>{`
                                    div::-webkit-scrollbar {
                                        display: none;
                                    }
                                `}</style>
                                <LinkListTemplate
                                    design={state.design}
                                    info={state.info}
                                    links={[]}
                                    socials={state.socials}
                                    fonts={state.fonts}
                                    welcomeScreen={state.welcomeScreen as any}
                                    headerFontClass={state.fonts.header}
                                    textFontClass={state.fonts.text}
                                    isPreview={true}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-[32px] p-8 h-auto shadow-2xl border border-gray-200 flex flex-col items-center justify-center gap-8">
                            <div className="text-center space-y-2">
                                <h3 className="text-xl font-bold text-gray-800">QR Kod Önizleme</h3>
                                <p className="text-sm text-gray-500">Sayfanız için özel QR kod.</p>
                            </div>
                            <div className="scale-110 p-4 border rounded-xl bg-gray-50" id="qr-download-target">
                                <div ref={qrRef}>
                                    <FrameRenderer
                                        frameId={state.qrDesign.frame}
                                        currentDesign={state.qrDesign}
                                        value="https://example.com"
                                        size={200}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

            </div>

            {/* SUCCESS MODAL */}
            {
                createdQr && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                        <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">Hazır! 🎉</h2>
                                <button onClick={() => setCreatedQr(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                    <X size={24} className="text-gray-500" />
                                </button>
                            </div>

                            <div className="flex flex-col items-center gap-6 mb-8">
                                <div className="p-4 bg-white rounded-xl shadow-lg border border-gray-100 transform transition-transform hover:scale-105 duration-300">
                                    <FrameRenderer
                                        frameId={state.qrDesign.frame}
                                        currentDesign={state.qrDesign}
                                        value={`http://localhost:3000/q/${createdQr.id}`}
                                        size={200}
                                    />
                                </div>
                                <p className="text-center text-gray-600 text-sm">
                                    QR kodunuz başarıyla oluşturuldu.
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <button onClick={() => window.open(`/q/${createdQr.id}`, '_blank')} className="col-span-2 py-3 bg-pink-600 hover:bg-pink-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-pink-200 transition-all active:scale-95 flex items-center justify-center gap-2">
                                    <ExternalLink size={18} />
                                    Görüntüle
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
}

