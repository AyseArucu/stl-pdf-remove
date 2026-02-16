'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import {
    QrCode, Download, Palette, ChefHat, Clock, MapPin,
    Phone, Globe, ChevronDown, ChevronUp, Trash2,
    Image as ImageIcon, LayoutGrid, Info, Megaphone,
    Facebook, Instagram, Twitter, Youtube, Linkedin, Mail, MessageCircle
} from 'lucide-react';
import FrameRenderer, { QrDesignState } from '@/components/qr/FrameRenderer';
import QRCodeDesignControl from '@/components/qr/QRCodeDesignControl';
import BusinessTemplate, { BUSINESS_FACILITIES, BusinessFacility, CustomBusinessFacility } from '@/components/qr/BusinessTemplate';
import html2canvas from 'html2canvas';

// --- Types ---

type OpeningHoursDay = {
    day: string;
    open: string;
    close: string;
    closed: boolean;
};

type SocialItem = {
    id: string;
    platform: 'instagram' | 'tiktok' | 'youtube' | 'facebook' | 'twitter' | 'whatsapp' | 'website' | 'linkedin' | 'google';
    url: string;
    active: boolean;
};

interface BusinessState {
    design: {
        themeId: string;
        primaryColor: string;
        bgColor: string;
        textColor: string;
        headerColor: string;
        backgroundImage: string | null;
    };
    qrDesign: QrDesignState;
    info: {
        name: string;
        description: string;
        logo: string | null;
        cover: string | null;
    };
    about: {
        enabled: boolean;
        title: string;
        text: string;
    };
    facilities: (BusinessFacility | CustomBusinessFacility)[];
    cta: {
        enabled: boolean;
        text: string;
        url: string;
    };
    openingHours: {
        enabled: boolean;
        days: OpeningHoursDay[];
    };
    contact: {
        phone: string;
        email: string;
        address: string;
        website: string;
    };
    socials: SocialItem[];
    fonts: {
        header: string;
        text: string;
    };
    settings: {
        name: string;
    };
}

const INITIAL_OPENING_HOURS: OpeningHoursDay[] = [
    { day: 'Pazartesi', open: '09:00', close: '18:00', closed: false },
    { day: 'Salı', open: '09:00', close: '18:00', closed: false },
    { day: 'Çarşamba', open: '09:00', close: '18:00', closed: false },
    { day: 'Perşembe', open: '09:00', close: '18:00', closed: false },
    { day: 'Cuma', open: '09:00', close: '18:00', closed: false },
    { day: 'Cumartesi', open: '10:00', close: '14:00', closed: false },
    { day: 'Pazar', open: '10:00', close: '14:00', closed: true },
];

const SOCIAL_PLATFORMS = [
    { id: 'instagram', label: 'Instagram', icon: <Instagram size={20} />, color: 'text-pink-600', bg: 'bg-pink-50' },
    { id: 'facebook', label: 'Facebook', icon: <Facebook size={20} />, color: 'text-blue-600', bg: 'bg-blue-50' },
    { id: 'twitter', label: 'X (Twitter)', icon: <Twitter size={20} />, color: 'text-black', bg: 'bg-gray-100' },
    { id: 'youtube', label: 'YouTube', icon: <Youtube size={20} />, color: 'text-red-600', bg: 'bg-red-50' },
    { id: 'tiktok', label: 'TikTok', icon: <span className="font-bold text-lg leading-none">Tk</span>, color: 'text-black', bg: 'bg-gray-100' },
    { id: 'whatsapp', label: 'WhatsApp', icon: <MessageCircle size={20} />, color: 'text-green-600', bg: 'bg-green-50' },
    { id: 'google', label: 'Google Maps', icon: <MapPin size={20} />, color: 'text-red-500', bg: 'bg-red-50' },
    { id: 'website', label: 'Website', icon: <Globe size={20} />, color: 'text-blue-500', bg: 'bg-blue-50' },
    { id: 'linkedin', label: 'LinkedIn', icon: <Linkedin size={20} />, color: 'text-blue-700', bg: 'bg-blue-50' },
];

const INITIAL_STATE: BusinessState = {
    design: {
        themeId: 'custom',
        primaryColor: '#0F172A', // Slate-900
        bgColor: '#F8FAFC', // Slate-50
        textColor: '#334155', // Slate-700
        headerColor: '#1E293B',
        backgroundImage: null,
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
        name: 'Şirket Adı',
        description: 'Sloganınız veya kısa açıklamanız burada yer alacak.',
        logo: null,
        cover: null,
    },
    about: {
        enabled: true,
        title: 'Hakkımızda',
        text: 'Şirketinizin hikayesini, misyonunu ve vizyonunu buraya yazabilirsiniz. Müşterileriniz sizi daha yakından tanısın.'
    },
    facilities: ['wifi', 'card', 'ac'],
    cta: {
        enabled: true,
        text: 'Menüyü Görüntüle',
        url: 'https://wa.me/905555555555'
    },
    openingHours: {
        enabled: true,
        days: INITIAL_OPENING_HOURS
    },
    contact: {
        phone: '',
        email: '',
        address: '',
        website: ''
    },
    socials: [
        { id: 's1', platform: 'instagram', url: '', active: true },
        { id: 's2', platform: 'website', url: '', active: true },
    ],
    fonts: {
        header: 'Inter',
        text: 'Inter'
    },
    settings: {
        name: '',
    }
};

const AccordionItem = ({ title, icon, children, isOpen, onToggle }: { title: string, icon: React.ReactNode, children: React.ReactNode, isOpen: boolean, onToggle: () => void }) => (
    <div className="bg-white border text-left border-gray-200 rounded-xl overflow-hidden shadow-sm transition-all duration-200">
        <button
            onClick={onToggle}
            className="flex items-center justify-between w-full p-4 hover:bg-gray-50 transition-colors"
        >
            <div className="flex items-center gap-3 font-semibold text-gray-700">
                <span className="text-blue-600">{icon}</span>
                {title}
            </div>
            {isOpen ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
        </button>
        {isOpen && (
            <div className="p-4 border-t border-gray-100 bg-gray-50/30 space-y-4 text-sm animate-in fade-in slide-in-from-top-1 duration-200">
                {children}
            </div>
        )}
    </div>
);

export default function BusinessQRPage() {
    console.log('Rendering BusinessQRPage');
    const router = useRouter();
    const { user } = useUser();
    const [state, setState] = useState<BusinessState>(INITIAL_STATE);
    const [activeSection, setActiveSection] = useState<string | null>('info');
    const [previewTab, setPreviewTab] = useState<'page' | 'qr'>('page');

    const [createdQr, setCreatedQr] = useState<{ id: string, qrImage: string } | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const qrRef = useRef<HTMLDivElement>(null);

    // Custom Facility State
    const [customFacName, setCustomFacName] = useState('');
    const [customFacIcon, setCustomFacIcon] = useState<string | null>(null);
    const customFacInputRef = useRef<HTMLInputElement>(null);

    const toggleSection = (section: string) => {
        setActiveSection(activeSection === section ? null : section);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'logo' | 'cover' | 'background') => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const result = event.target?.result as string;
                if (target === 'logo') {
                    setState(prev => ({ ...prev, info: { ...prev.info, logo: result } }));
                } else if (target === 'cover') {
                    setState(prev => ({ ...prev, info: { ...prev.info, cover: result } }));
                } else if (target === 'background') {
                    setState(prev => ({ ...prev, design: { ...prev.design, backgroundImage: result } }));
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const toggleFacility = (facilityId: BusinessFacility) => {
        setState(prev => {
            const exists = prev.facilities.some(f => typeof f === 'string' && f === facilityId);
            return {
                ...prev,
                facilities: exists
                    ? prev.facilities.filter(f => f !== facilityId)
                    : [...prev.facilities, facilityId]
            };
        });
    };

    const handleCustomFacIconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setCustomFacIcon(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const addCustomFacility = () => {
        if (!customFacName) return;
        const newFac: CustomBusinessFacility = {
            id: `custom-${Date.now()}`,
            label: customFacName,
            icon: customFacIcon || '',
            isCustom: true
        };
        setState(prev => ({ ...prev, facilities: [...prev.facilities, newFac] }));
        setCustomFacName('');
        setCustomFacIcon(null);
        if (customFacInputRef.current) customFacInputRef.current.value = '';
    };

    const removeCustomFacility = (id: string) => {
        setState(prev => ({
            ...prev,
            facilities: prev.facilities.filter(f => typeof f === 'string' || f.id !== id)
        }));
    };

    // --- Social & Contact Management ---
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
        setIsSaving(true);
        setTimeout(() => {
            setCreatedQr({ id: 'dummy-business-id', qrImage: '' });
            setIsSaving(false);
        }, 1000);
    };

    const downloadQrCode = async () => {
        if (!qrRef.current) return;
        try {
            const canvas = await html2canvas(qrRef.current, { backgroundColor: null });
            const url = canvas.toDataURL('image/png');
            const a = document.createElement('a');
            a.href = url;
            a.download = `business-qr.png`;
            a.click();
        } catch (err) {
            console.error('Download failed', err);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <div className="flex-1 flex flex-col lg:flex-row container mx-auto max-w-7xl shadow-xl my-8 rounded-2xl bg-white overflow-hidden">

                {/* LEFT PANEL */}
                <div className="w-full lg:w-1/2 p-4 lg:p-8 space-y-4 overflow-y-auto h-[calc(100vh-64px)] custom-scrollbar">
                    <h1 className="text-3xl font-bold text-gray-800 mb-6">İşletme Kartı Oluştur</h1>

                    {/* 1. TASARIM */}
                    <AccordionItem title="Tasarım" icon={<Palette size={20} />} isOpen={activeSection === 'design'} onToggle={() => toggleSection('design')}>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-2">Ana Renk</label>
                                    <div className="flex items-center gap-2">
                                        <input type="color" value={state.design.primaryColor} onChange={(e) => setState(prev => ({ ...prev, design: { ...prev.design, primaryColor: e.target.value } }))} className="w-10 h-10 rounded cursor-pointer border-none p-0" />
                                        <input type="text" value={state.design.primaryColor} readOnly className="flex-1 border rounded p-2 text-xs" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-2">Arka Plan Rengi</label>
                                    <div className="flex items-center gap-2">
                                        <input type="color" value={state.design.bgColor} onChange={(e) => setState(prev => ({ ...prev, design: { ...prev.design, bgColor: e.target.value, backgroundImage: null } }))} className="w-10 h-10 rounded cursor-pointer border-none p-0" />
                                        <input type="text" value={state.design.bgColor} readOnly className="flex-1 border rounded p-2 text-xs" />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-2">Arka Plan Görseli</label>
                                <div className="flex items-center gap-4">
                                    {state.design.backgroundImage ? (
                                        <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200 group">
                                            <img src={state.design.backgroundImage} className="w-full h-full object-cover" />
                                            <button onClick={() => setState(prev => ({ ...prev, design: { ...prev.design, backgroundImage: null } }))} className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white"><Trash2 size={16} /></button>
                                        </div>
                                    ) : (
                                        <label className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:border-blue-500 hover:text-blue-500 transition-colors">
                                            <ImageIcon size={20} />
                                            <span className="text-[10px] mt-1">Yükle</span>
                                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'background')} />
                                        </label>
                                    )}
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-2">Kapak Görseli</label>
                                <div className="flex items-center gap-4">
                                    {state.info.cover ? (
                                        <div className="relative w-full h-32 rounded-lg overflow-hidden border border-gray-200 group">
                                            <img src={state.info.cover} className="w-full h-full object-cover" />
                                            <button onClick={() => setState(prev => ({ ...prev, info: { ...prev.info, cover: null } }))} className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white"><Trash2 size={20} /></button>
                                        </div>
                                    ) : (
                                        <label className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:border-blue-500 hover:text-blue-500 transition-colors">
                                            <ImageIcon size={32} />
                                            <span className="text-xs mt-2 font-medium">Kapak Görseli Yükle</span>
                                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'cover')} />
                                        </label>
                                    )}
                                </div>
                            </div>
                        </div>
                    </AccordionItem>

                    {/* 2. ŞİRKET BİLGİLERİ */}
                    <AccordionItem title="Şirket Bilgileri" icon={<ChefHat size={20} />} isOpen={activeSection === 'info'} onToggle={() => toggleSection('info')}>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <label className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center cursor-pointer border-2 border-dashed hover:border-blue-500 relative overflow-hidden group">
                                    {state.info.logo ? <img src={state.info.logo} className="w-full h-full object-cover" /> : <div className="text-gray-400 text-center"><ImageIcon size={24} className="mx-auto mb-1" /><span className="text-[10px]">Logo</span></div>}
                                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'logo')} />
                                </label>
                                <div className="flex-1 space-y-2">
                                    <label className="block text-xs font-bold text-gray-500">Kapak Görseli</label>
                                    <label className="block w-full py-2 px-4 border border-dashed rounded-lg text-center text-sm text-gray-500 cursor-pointer hover:bg-gray-50">
                                        {state.info.cover ? 'Görseli Değiştir' : 'Görsel Yükle'}
                                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'cover')} />
                                    </label>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-2">Şirket Adı</label>
                                <input type="text" value={state.info.name} onChange={(e) => setState(prev => ({ ...prev, info: { ...prev.info, name: e.target.value } }))} className="w-full border rounded p-2" placeholder="Şirket Adı" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-2">Slogan / Kısa Açıklama</label>
                                <textarea value={state.info.description} onChange={(e) => setState(prev => ({ ...prev, info: { ...prev.info, description: e.target.value } }))} className="w-full border rounded p-2 h-16 resize-none" placeholder="Kısa bir tanıtım..." />
                            </div>
                        </div>
                    </AccordionItem>

                    {/* 3. HAKKIMIZDA */}
                    <AccordionItem title="Şirket Hakkında" icon={<Info size={20} />} isOpen={activeSection === 'about'} onToggle={() => toggleSection('about')}>
                        <div className="space-y-4">
                            <label className="flex items-center gap-2">
                                <input type="checkbox" checked={state.about.enabled} onChange={(e) => setState(prev => ({ ...prev, about: { ...prev.about, enabled: e.target.checked } }))} className="rounded text-blue-500 focus:ring-blue-500" />
                                <span className="text-sm font-medium">Bu bölümü göster</span>
                            </label>
                            {state.about.enabled && (
                                <>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-2">Başlık</label>
                                        <input type="text" value={state.about.title} onChange={(e) => setState(prev => ({ ...prev, about: { ...prev.about, title: e.target.value } }))} className="w-full border rounded p-2" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-2">İçerik</label>
                                        <textarea value={state.about.text} onChange={(e) => setState(prev => ({ ...prev, about: { ...prev.about, text: e.target.value } }))} className="w-full border rounded p-2 h-32 resize-none" placeholder="Hikayeniz..." />
                                    </div>
                                </>
                            )}
                        </div>
                    </AccordionItem>

                    {/* 4. TESİSLER */}
                    <AccordionItem title="Tesisler & Olanaklar" icon={<LayoutGrid size={20} />} isOpen={activeSection === 'facilities'} onToggle={() => toggleSection('facilities')}>
                        <div className="grid grid-cols-3 gap-3">
                            {BUSINESS_FACILITIES.map(facility => (
                                <button
                                    key={facility.id}
                                    onClick={() => toggleFacility(facility.id)}
                                    className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl border transition-all ${state.facilities.some(f => typeof f === 'string' && f === facility.id) ? 'bg-blue-50 border-blue-500 text-blue-600 shadow-sm' : 'bg-white border-gray-100 text-gray-500 hover:bg-gray-50'}`}
                                >
                                    {facility.icon}
                                    <span className="text-xs font-medium">{facility.label}</span>
                                </button>
                            ))}
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-100">
                            <h4 className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-wider">Özel Tesis Ekle</h4>
                            <div className="flex gap-2 mb-3">
                                <div className="flex-1 space-y-2">
                                    <input
                                        type="text"
                                        placeholder="Tesis Adı (Örn: Havuz)"
                                        value={customFacName}
                                        onChange={(e) => setCustomFacName(e.target.value)}
                                        className="w-full border rounded p-2 text-sm"
                                    />
                                    <div className="flex items-center gap-2">
                                        <label className="cursor-pointer flex items-center justify-center p-2 bg-gray-50 border border-gray-200 rounded text-gray-500 hover:bg-gray-100">
                                            <ImageIcon size={18} />
                                            <input type="file" className="hidden" accept="image/*" ref={customFacInputRef} onChange={handleCustomFacIconUpload} />
                                        </label>
                                        {customFacIcon && (
                                            <img src={customFacIcon} className="w-8 h-8 object-cover rounded" alt="Preview" />
                                        )}
                                        <button
                                            onClick={addCustomFacility}
                                            disabled={!customFacName}
                                            className="flex-1 bg-black text-white text-xs font-bold py-2 rounded hover:bg-gray-800 disabled:opacity-50"
                                        >
                                            Ekle
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* List Custom Facilities */}
                            <div className="space-y-2">
                                {state.facilities.filter(f => typeof f !== 'string').map((f: any) => (
                                    <div key={f.id} className="flex items-center justify-between p-2 bg-gray-50 border border-gray-100 rounded">
                                        <div className="flex items-center gap-2">
                                            {f.icon ? <img src={f.icon} className="w-6 h-6 object-contain" alt={f.label} /> : <div className="w-6 h-6 bg-gray-200 rounded" />}
                                            <span className="text-sm font-medium text-gray-700">{f.label}</span>
                                        </div>
                                        <button onClick={() => removeCustomFacility(f.id)} className="text-red-500 hover:text-red-700 p-1">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </AccordionItem>

                    {/* 5. BUTON (CTA) */}
                    <AccordionItem title="Buton ve Linkler" icon={<Megaphone size={20} />} isOpen={activeSection === 'cta'} onToggle={() => toggleSection('cta')}>
                        <div className="space-y-4">
                            <label className="flex items-center gap-2">
                                <input type="checkbox" checked={state.cta.enabled} onChange={(e) => setState(prev => ({ ...prev, cta: { ...prev.cta, enabled: e.target.checked } }))} className="rounded text-blue-500 focus:ring-blue-500" />
                                <span className="text-sm font-medium">Butonu Göster</span>
                            </label>
                            {state.cta.enabled && (
                                <>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-2">Buton Yazısı</label>
                                        <input type="text" value={state.cta.text} onChange={(e) => setState(prev => ({ ...prev, cta: { ...prev.cta, text: e.target.value } }))} className="w-full border rounded p-2" placeholder="Örn: Menüyü Görüntüle" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-2">Yönlendirme Linki (URL)</label>
                                        <input type="url" value={state.cta.url} onChange={(e) => setState(prev => ({ ...prev, cta: { ...prev.cta, url: e.target.value } }))} className="w-full border rounded p-2" placeholder="https://..." />
                                    </div>
                                </>
                            )}
                        </div>
                    </AccordionItem>

                    {/* 6. ÇALIŞMA SAATLERİ */}
                    <AccordionItem title="Çalışma Saatleri" icon={<Clock size={20} />} isOpen={activeSection === 'hours'} onToggle={() => toggleSection('hours')}>
                        <div className="space-y-4">
                            <label className="flex items-center gap-2">
                                <input type="checkbox" checked={state.openingHours.enabled} onChange={(e) => setState(prev => ({ ...prev, openingHours: { ...prev.openingHours, enabled: e.target.checked } }))} className="rounded text-blue-500 focus:ring-blue-500" />
                                <span className="text-sm font-medium">Saatleri Göster</span>
                            </label>
                            {state.openingHours.enabled && (
                                <div className="space-y-2">
                                    {state.openingHours.days.map((day, idx) => (
                                        <div key={day.day} className="flex items-center gap-4 text-sm">
                                            <span className="w-24 font-medium text-gray-600">{day.day}</span>
                                            <div className="flex items-center gap-2 flex-1">
                                                <input type="time" value={day.open} onChange={(e) => {
                                                    const newDays = [...state.openingHours.days];
                                                    newDays[idx].open = e.target.value;
                                                    setState(prev => ({ ...prev, openingHours: { ...prev.openingHours, days: newDays } }));
                                                }} className="border rounded p-1 text-xs" />
                                                <span>-</span>
                                                <input type="time" value={day.close} onChange={(e) => {
                                                    const newDays = [...state.openingHours.days];
                                                    newDays[idx].close = e.target.value;
                                                    setState(prev => ({ ...prev, openingHours: { ...prev.openingHours, days: newDays } }));
                                                }} className="border rounded p-1 text-xs" />
                                            </div>
                                            <label className="flex items-center gap-1 text-xs text-gray-400">
                                                <input type="checkbox" checked={day.closed} onChange={(e) => {
                                                    const newDays = [...state.openingHours.days];
                                                    newDays[idx].closed = e.target.checked;
                                                    setState(prev => ({ ...prev, openingHours: { ...prev.openingHours, days: newDays } }));
                                                }} />
                                                Kapalı
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </AccordionItem>

                    {/* 7. İLETİŞİM */}
                    <AccordionItem title="İletişim Bilgileri" icon={<Phone size={20} />} isOpen={activeSection === 'contact'} onToggle={() => toggleSection('contact')}>
                        <div className="space-y-4">
                            <div><label className="block text-xs font-bold text-gray-500 mb-2">Telefon</label><input type="tel" value={state.contact.phone} onChange={(e) => setState(prev => ({ ...prev, contact: { ...prev.contact, phone: e.target.value } }))} className="w-full border rounded p-2" /></div>
                            <div><label className="block text-xs font-bold text-gray-500 mb-2">E-posta</label><input type="email" value={state.contact.email} onChange={(e) => setState(prev => ({ ...prev, contact: { ...prev.contact, email: e.target.value } }))} className="w-full border rounded p-2" /></div>
                            <div><label className="block text-xs font-bold text-gray-500 mb-2">Adres</label><textarea value={state.contact.address} onChange={(e) => setState(prev => ({ ...prev, contact: { ...prev.contact, address: e.target.value } }))} className="w-full border rounded p-2 h-20 resize-none" /></div>
                            <div><label className="block text-xs font-bold text-gray-500 mb-2">Web Sitesi</label><input type="url" value={state.contact.website} onChange={(e) => setState(prev => ({ ...prev, contact: { ...prev.contact, website: e.target.value } }))} className="w-full border rounded p-2" /></div>
                        </div>
                    </AccordionItem>

                    {/* 8. SOSYAL AĞLAR */}
                    <AccordionItem title="Sosyal Ağlar" icon={<Globe size={20} />} isOpen={activeSection === 'socials'} onToggle={() => toggleSection('socials')}>
                        <div className="space-y-4">
                            <div className="flex flex-wrap gap-2 mb-4">
                                {SOCIAL_PLATFORMS.map(p => (
                                    <button key={p.id} onClick={() => addSocial(p.id)} className={`p-2 rounded-lg flex items-center justify-center transition-all hover:scale-105 border ${state.socials.find(s => s.platform === p.id) ? 'ring-2 ring-blue-500 border-blue-500 bg-blue-50' : 'border-gray-200 bg-gray-50 hover:bg-gray-100'}`} title={p.label}>
                                        <div className={p.color}>{p.icon}</div>
                                    </button>
                                ))}
                            </div>
                            <div className="space-y-3">
                                {state.socials.map(social => {
                                    const platformInfo = SOCIAL_PLATFORMS.find(p => p.id === social.platform);
                                    return (
                                        <div key={social.id} className="bg-white border rounded-lg p-3 flex gap-3 items-center shadow-sm">
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${platformInfo?.bg} ${platformInfo?.color}`}>{platformInfo?.icon}</div>
                                            <input type="text" value={social.url} onChange={(e) => updateSocial(social.id, e.target.value)} className="flex-1 text-sm border-b border-transparent hover:border-gray-300 focus:border-blue-500 outline-none bg-transparent" placeholder={`${platformInfo?.label} URL`} />
                                            <button onClick={() => removeSocial(social.id)} className="text-gray-400 hover:text-red-500 p-2"><Trash2 size={16} /></button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </AccordionItem>

                    {/* 9. QR TASARIMI */}
                    <AccordionItem title="QR Kod Tasarımı" icon={<QrCode size={20} />} isOpen={activeSection === 'qr'} onToggle={() => { toggleSection('qr'); setPreviewTab('qr'); }}>
                        <QRCodeDesignControl design={state.qrDesign} onChange={(newDesign) => setState(prev => ({ ...prev, qrDesign: newDesign }))} />
                    </AccordionItem>

                    <div className="pt-6">
                        <button onClick={handleSave} disabled={isSaving} className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-blue-200 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2">
                            {isSaving ? <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Kaydediliyor...</> : <><QrCode size={24} /> QR Kod Oluştur</>}
                        </button>
                    </div>

                </div>

                {/* RIGHT PANEL: PREVIEW */}
                <div className="hidden lg:flex flex-col w-1/2 bg-gray-100 items-center p-8 gap-4 h-[calc(100vh-64px)] sticky top-0 overflow-y-auto custom-scrollbar">
                    <div className="bg-white rounded-xl p-1 shadow-sm border border-gray-200 flex w-full max-w-xs mb-4">
                        <button onClick={() => setPreviewTab('page')} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors flex items-center justify-center gap-2 ${previewTab === 'page' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}><ChevronsMobileIcon size={16} /> Önizleme</button>
                        <button onClick={() => setPreviewTab('qr')} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors flex items-center justify-center gap-2 ${previewTab === 'qr' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}><QrCode size={16} /> QR Kod</button>
                    </div>

                    {previewTab === 'page' && (
                        <div className="bg-gray-900 rounded-[50px] p-4 h-[750px] w-full max-w-[380px] shadow-2xl border-8 border-gray-900 ring-1 ring-gray-800 relative overflow-hidden">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-7 w-32 bg-black rounded-b-2xl z-20"></div>
                            <BusinessTemplate
                                design={state.design}
                                info={state.info}
                                about={state.about}
                                facilities={state.facilities}
                                cta={state.cta}
                                contact={state.contact}
                                openingHours={state.openingHours}
                                socials={state.socials}
                                fonts={state.fonts}
                            />
                        </div>
                    )}
                    {previewTab === 'qr' && (
                        <div className="bg-white rounded-[32px] p-8 h-auto shadow-2xl border border-gray-200 flex flex-col items-center justify-center gap-8">
                            <div className="scale-110 p-4 border rounded-xl bg-gray-50">
                                <FrameRenderer frameId={state.qrDesign.frame} currentDesign={state.qrDesign} value="https://business.example.com" size={200} />
                            </div>
                        </div>
                    )}
                </div>

                {/* SUCCESS MODAL */}
                {createdQr && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">Hazır! 🎉</h2>
                                <button onClick={() => setCreatedQr(null)} className="p-2 hover:bg-gray-100 rounded-full"><X size={24} /></button>
                            </div>
                            <div className="flex flex-col items-center gap-6 mb-8">
                                <div ref={qrRef} className="p-4 bg-white rounded-xl shadow-lg border border-gray-100">
                                    <FrameRenderer frameId={state.qrDesign.frame} currentDesign={state.qrDesign} value="https://business.example.com" size={200} />
                                </div>
                            </div>
                            <button onClick={downloadQrCode} className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-200 flex items-center justify-center gap-2"><Download size={18} /> PNG İndir</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function ChevronsMobileIcon({ size }: { size: number }) {
    return <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="20" x="5" y="2" rx="2" ry="2" /><path d="M12 18h.01" /></svg>;
}
function X({ size }: { size: number }) {
    return <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 18 18" /></svg>;
}
