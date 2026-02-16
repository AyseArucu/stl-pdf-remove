'use client';

import React, { useState, useRef, useEffect } from 'react';
import { QrCode, Download, Palette, User, Link as LinkIcon, Type, Image as ImageIcon, Settings, Lock, ChevronDown, ChevronUp, Plus, Trash2, GripVertical, Facebook, Instagram, Youtube, Twitter, Linkedin, MessageCircle, Music, Globe, Ghost, Gamepad2, Pin, Mail, Phone, Star, ArrowRight, Video, MapPin, Calendar, FileText, MoreHorizontal, X, ExternalLink, Smartphone } from 'lucide-react';
import FrameRenderer, { QrDesignState } from '@/components/qr/FrameRenderer';
import QRCodeDesignControl from '@/components/qr/QRCodeDesignControl';
import LinkListTemplate from '@/components/qr/LinkListTemplate';
import QrPageHeader from '@/components/qr/QrPageHeader';
import html2canvas from 'html2canvas';
import { createQrCode } from '@/app/actions/qr';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';

// --- Types ---
type LinkItem = {
    id: string;
    icon: string;
    text: string;
    url: string;
    active: boolean;
};

type SocialItem = {
    id: string;
    platform: 'instagram' | 'tiktok' | 'youtube' | 'facebook' | 'x' | 'whatsapp' | 'telegram' | 'spotify' | 'linkedin' | 'snapchat' | 'pinterest' | 'discord' | 'twitch' | 'website';
    url: string;
    active: boolean;
};

interface LinkListState {
    design: {
        themeId: string;
        bgColor: string;
        linkBgColor: string;
        linkTextColor: string;
        headerColor: string;
    };
    qrDesign: QrDesignState;
    info: {
        image: string | null;
        title: string;
        description: string;
    };
    links: LinkItem[];
    socials: SocialItem[];
    fonts: {
        header: string;
        text: string;
    };
    welcomeScreen: {
        enabled: boolean;
        image: string | null;
    };
    settings: {
        name: string;
        password: string;
    };
}

const INITIAL_STATE: LinkListState = {
    design: {
        themeId: 'custom',
        bgColor: '#f3f4f6', // gray-100
        linkBgColor: '#2dd4bf', // teal-400
        linkTextColor: '#ffffff',
        headerColor: '#40E0D0', // turquoise
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
        image: null,
        title: 'Erashu Gaming',
        description: 'Günlük ilham, pozitiflik ve eğlence için sosyal medya yolculuğumda bana katılın!',
    },
    links: [
        { id: '1', icon: 'instagram', text: 'Instagram', url: 'https://instagram.com', active: true },
        { id: '2', icon: 'tiktok', text: 'TikTok', url: 'https://tiktok.com', active: true },
        { id: '3', icon: 'youtube', text: 'YouTube', url: 'https://youtube.com', active: true },
    ],
    socials: [
        { id: 's1', platform: 'tiktok', url: 'https://tiktok.com', active: true },
        { id: 's2', platform: 'spotify', url: 'https://spotify.com', active: true },
        { id: 's3', platform: 'discord', url: 'https://discord.com', active: true },
        { id: 's4', platform: 'x', url: 'https://x.com', active: true },
    ],
    fonts: {
        header: 'Inter',
        text: 'Inter'
    },
    welcomeScreen: {
        enabled: false,
        image: null
    },
    settings: {
        name: '',
        password: ''
    }
};

// --- Mock Data ---
const FONT_OPTIONS = ['Inter', 'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Poppins'];

const SOCIAL_PLATFORMS = [
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
    { id: 'telegram', icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.198 2.433a2.242 2.242 0 0 0-1.022.215l-8.609 3.33c-2.068.8-4.133 1.598-5.724 2.21a405.15 405.15 0 0 1-2.849 1.09c-.42.147-.99.332-1.481.908a1.546 1.546 0 0 0-.229 1.318c.11.56.591.867 1.056 1.054.437.177 1.136.426 2.067.753.805.283 1.764.62 2.657.935l1.988 5.624c.264.746.85 1.157 1.639 1.157.94 0 1.258-.696 1.438-1.096l2.126-4.717 4.14 3.033c.96.704 2.083.626 2.766-.08.682-.705.882-1.796.536-2.658L16.48 3.51a2.234 2.234 0 0 0-1.282-1.077z" /></svg>, color: 'bg-blue-400' },
    { id: 'spotify', icon: <Music size={24} />, color: 'bg-green-600' },
    { id: 'linkedin', icon: <Linkedin size={24} />, color: 'bg-blue-700' },
    { id: 'snapchat', icon: <Ghost size={24} />, color: 'bg-yellow-400' },
    { id: 'pinterest', icon: <Pin size={24} />, color: 'bg-red-700' },
    { id: 'discord', icon: <Gamepad2 size={24} />, color: 'bg-indigo-600' },
    { id: 'twitch', icon: <Gamepad2 size={24} />, color: 'bg-purple-600' },
    { id: 'website', icon: <Globe size={24} />, color: 'bg-gray-600' },
];

const GENERIC_ICONS = [
    { id: 'globe', icon: <Globe size={18} />, color: 'text-gray-600' },
    { id: 'link', icon: <LinkIcon size={18} />, color: 'text-blue-500' },
    { id: 'mail', icon: <Mail size={18} />, color: 'text-gray-600' },
    { id: 'phone', icon: <Phone size={18} />, color: 'text-green-600' },
    { id: 'star', icon: <Star size={18} />, color: 'text-yellow-500' },
    { id: 'arrow', icon: <ArrowRight size={18} />, color: 'text-gray-400' },
    { id: 'video', icon: <Video size={18} />, color: 'text-purple-500' },
    { id: 'location', icon: <MapPin size={18} />, color: 'text-red-500' },
    { id: 'calendar', icon: <Calendar size={18} />, color: 'text-orange-500' },
    { id: 'file', icon: <FileText size={18} />, color: 'text-blue-400' },
    { id: 'more', icon: <MoreHorizontal size={18} />, color: 'text-gray-400' },
    // Socials
    { id: 'instagram', icon: <Instagram size={18} />, color: 'text-pink-600' },
    { id: 'youtube', icon: <Youtube size={18} />, color: 'text-red-600' },
    { id: 'tiktok', icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" /></svg>, color: 'text-black' },
    { id: 'twitter', icon: <Twitter size={18} />, color: 'text-black' },
    { id: 'facebook', icon: <Facebook size={18} />, color: 'text-blue-600' },
    { id: 'linkedin', icon: <Linkedin size={18} />, color: 'text-blue-700' },
];

const AccordionItem = ({ title, icon, children, isOpen, onToggle }: { title: string, icon: React.ReactNode, children: React.ReactNode, isOpen: boolean, onToggle: () => void }) => (
    <div className="bg-white border text-left border-gray-200 rounded-xl overflow-hidden shadow-sm">
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
            <div className="p-4 border-t border-gray-100 bg-gray-50/50 space-y-4 text-sm animate-in fade-in slide-in-from-top-2 duration-200">
                {children}
            </div>
        )}
    </div>
);

export default function LinkListPage() {
    const router = useRouter();
    const { user } = useUser();
    const [state, setState] = useState<LinkListState>(INITIAL_STATE);
    const [activeSection, setActiveSection] = useState<string | null>('design');
    const [activeIconSelector, setActiveIconSelector] = useState<string | null>(null);
    const [previewTab, setPreviewTab] = useState<'page' | 'qr'>('page');
    const [createdQr, setCreatedQr] = useState<{ id: string, qrImage: string } | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);

    // Ref for QR Generation
    const qrRef = useRef<HTMLDivElement>(null);
    const [shouldAutoSave, setShouldAutoSave] = useState(false);
    const [isAutoDownloading, setIsAutoDownloading] = useState(false);

    // --- EFFECT: Restore State & Trigger Auto-Save ---
    useEffect(() => {
        const pending = localStorage.getItem('pendingQrDesign');
        if (pending && user) {
            try {
                const data = JSON.parse(pending);
                if (data.type === 'link_list') {
                    setState(data.state);
                    setShouldAutoSave(true);
                    localStorage.removeItem('pendingQrDesign');
                }
            } catch (e) {
                console.error("Error restoring pending QR design", e);
            }
        }
    }, [user]);

    // --- EFFECT: Execute Auto-Save when ready ---
    useEffect(() => {
        if (shouldAutoSave && state.links.length > 0) {
            const timer = setTimeout(() => {
                handleSave(true);
                setShouldAutoSave(false);
            }, 800);
            return () => clearTimeout(timer);
        }
    }, [shouldAutoSave, state]);

    // --- EFFECT: Auto Download when Modal Opens ---
    useEffect(() => {
        if (createdQr && isAutoDownloading && qrRef.current) {
            const timer = setTimeout(() => {
                downloadQrCode();
                setIsAutoDownloading(false);
            }, 1000); // Wait for modal animation/render
            return () => clearTimeout(timer);
        }
    }, [createdQr, isAutoDownloading]);

    const toggleSection = (section: string) => {
        setActiveSection(activeSection === section ? null : section);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'profile' | 'welcome') => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const result = event.target?.result as string;
                if (target === 'profile') {
                    setState(prev => ({ ...prev, info: { ...prev.info, image: result } }));
                } else {
                    setState(prev => ({ ...prev, welcomeScreen: { ...prev.welcomeScreen, image: result } }));
                }
            };
            reader.readAsDataURL(file);
        }
    };

    // --- Link Management ---
    const addLink = () => {
        const newLink: LinkItem = {
            id: Date.now().toString(),
            icon: 'globe',
            text: 'Yeni Bağlantı',
            url: '',
            active: true
        };
        setState(prev => ({ ...prev, links: [...prev.links, newLink] }));
    };

    const removeLink = (id: string) => {
        setState(prev => ({ ...prev, links: prev.links.filter(l => l.id !== id) }));
    };

    const detectIconFromUrl = (url: string): string | null => {
        const lowerUrl = url.toLowerCase();
        if (lowerUrl.includes('instagram.com')) return 'instagram';
        if (lowerUrl.includes('tiktok.com')) return 'tiktok';
        if (lowerUrl.includes('twitter.com') || lowerUrl.includes('x.com')) return 'twitter';
        if (lowerUrl.includes('facebook.com')) return 'facebook';
        if (lowerUrl.includes('youtube.com') || lowerUrl.includes('youtu.be')) return 'youtube';
        if (lowerUrl.includes('linkedin.com')) return 'linkedin';
        return null;
    };

    const updateLink = (id: string, field: keyof LinkItem, value: string) => {
        setState(prev => {
            const newLinks = prev.links.map(l => {
                if (l.id === id) {
                    const updatedLink = { ...l, [field]: value };
                    if (field === 'url') {
                        const detectedIcon = detectIconFromUrl(value);
                        if (detectedIcon) {
                            updatedLink.icon = detectedIcon;
                        }
                    }
                    return updatedLink;
                }
                return l;
            });
            return { ...prev, links: newLinks };
        });
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

    // --- Save Logic ---
    const handleSave = async (isAutoAction = false) => {
        if (!isAutoAction && !user) {
            const stateToSave = {
                type: 'link_list',
                state: state
            };
            localStorage.setItem('pendingQrDesign', JSON.stringify(stateToSave));
            router.push(`/login?callbackUrl=${encodeURIComponent('/qr/baglanti-listesi')}`);
            return;
        }

        setIsSaving(true);
        setSaveError(null);

        try {
            const formData = new FormData();
            formData.append('targetUrl', 'LINK_LIST'); // Placeholder, logic handles lookup by ID
            formData.append('name', state.settings.name || state.info.title || 'Bağlantı Listesi');
            if (state.settings.password) {
                formData.append('password', state.settings.password);
            }

            const designData = {
                type: 'link_list',
                design: state.design,
                info: state.info,
                links: state.links,
                socials: state.socials,
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
                // Generate QR Image for Modal
                // We need to temporarily render the QR to capture it if it's not visible
                // But simplified: we will just show the modal with the live renderer
                // Or use html2canvas on the preview if we want to "freeze" it.
                // For now, let's just Open the Modal
                // To support "Download", we'll likely need to render it in the modal.
                setCreatedQr({ id: res.id, qrImage: '' }); // Image generated in modal
                if (isAutoAction) setIsAutoDownloading(true);
            }

        } catch (error) {
            console.error('Save error:', error);
            setSaveError('Bir hata oluştu. Lütfen tekrar deneyin.');
        } finally {
            setIsSaving(false);
        }
    };

    const downloadQrCode = async () => {
        if (!qrRef.current) return;
        try {
            const canvas = await html2canvas(qrRef.current, { backgroundColor: null });
            const url = canvas.toDataURL('image/png');
            const a = document.createElement('a');
            a.href = url;
            a.download = `qr-${state.settings.name || 'code'}.png`;
            a.click();
        } catch (err) {
            console.error('Download failed', err);
        }
    };


    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <QrPageHeader
                title="Bağlantı Listesi"
                icon={<LinkIcon className="text-pink-600" />}
                activeTab={previewTab === 'page' ? 'content' : 'qr'}
                onTabChange={(tab) => setPreviewTab(tab === 'content' ? 'page' : 'qr')}
                onSave={handleSave}
                isSaving={isSaving}
            />

            <div className="flex flex-1 lg:flex-row flex-col max-w-[1600px] mx-auto w-full p-6 gap-8">
                {/* LEFT: EDITOR */}
                <div className="flex-1 min-w-[350px] space-y-4 overflow-y-auto max-h-[calc(100vh-120px)] pr-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    <style jsx>{`
                        div::-webkit-scrollbar {
                            display: none;
                        }
                    `}</style>

                    {/* 1. TASARIM */}
                    <AccordionItem title="Sayfa Tasarımı" icon={<Palette size={20} />} isOpen={activeSection === 'design'} onToggle={() => toggleSection('design')}>
                        {/* ... Color inputs ... */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-2">Arka Plan Rengi</label>
                                <div className="flex items-center gap-2">
                                    <input type="color" value={state.design.bgColor} onChange={(e) => setState(prev => ({ ...prev, design: { ...prev.design, bgColor: e.target.value } }))} className="w-10 h-10 rounded cursor-pointer border-none p-0" />
                                    <input type="text" value={state.design.bgColor} readOnly className="flex-1 border rounded p-2 text-xs" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-2">Başlık Arka Planı</label>
                                    <div className="flex items-center gap-2">
                                        <input type="color" value={state.design.headerColor} onChange={(e) => setState(prev => ({ ...prev, design: { ...prev.design, headerColor: e.target.value } }))} className="w-10 h-10 rounded cursor-pointer border-none p-0" />
                                        <input type="text" value={state.design.headerColor} readOnly className="flex-1 border rounded p-2 text-xs" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-2">Bağlantı Arka Planı</label>
                                    <div className="flex items-center gap-2">
                                        <input type="color" value={state.design.linkBgColor} onChange={(e) => setState(prev => ({ ...prev, design: { ...prev.design, linkBgColor: e.target.value } }))} className="w-10 h-10 rounded cursor-pointer border-none p-0" />
                                        <input type="text" value={state.design.linkBgColor} readOnly className="flex-1 border rounded p-2 text-xs" />
                                    </div>
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-xs font-bold text-gray-500 mb-2">Bağlantı Metin Rengi</label>
                                    <div className="flex items-center gap-2">
                                        <input type="color" value={state.design.linkTextColor} onChange={(e) => setState(prev => ({ ...prev, design: { ...prev.design, linkTextColor: e.target.value } }))} className="w-10 h-10 rounded cursor-pointer border-none p-0" />
                                        <input type="text" value={state.design.linkTextColor} readOnly className="flex-1 border rounded p-2 text-xs" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </AccordionItem>

                    {/* 2. QR TASARIMI (New) */}
                    <AccordionItem title="QR Kod Tasarımı" icon={<QrCode size={20} />} isOpen={activeSection === 'qr'} onToggle={() => { toggleSection('qr'); setPreviewTab('qr'); }}>
                        <QRCodeDesignControl
                            design={state.qrDesign}
                            onChange={(newDesign) => setState(prev => ({ ...prev, qrDesign: newDesign }))}
                        />
                    </AccordionItem>

                    {/* 3. BİLGİLERİ LİSTELE */}
                    <AccordionItem title="Bilgiler & Profil" icon={<User size={20} />} isOpen={activeSection === 'info'} onToggle={() => toggleSection('info')}>
                        <div className="flex items-start gap-4">
                            <label className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-300 overflow-hidden border-2 border-dashed border-gray-400">
                                {state.info.image ? (
                                    <img src={state.info.image} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <ImageIcon className="text-gray-500" />
                                )}
                                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'profile')} />
                            </label>
                            <div className="flex-1 space-y-3">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">Başlık <span className="text-red-500">*</span></label>
                                    <input type="text" value={state.info.title} onChange={(e) => setState(prev => ({ ...prev, info: { ...prev.info, title: e.target.value } }))} className="w-full border rounded p-2" placeholder="Adınız veya Markanız" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">Açıklama</label>
                                    <textarea value={state.info.description} onChange={(e) => setState(prev => ({ ...prev, info: { ...prev.info, description: e.target.value } }))} className="w-full border rounded p-2 h-20 resize-none" placeholder="Kısa bir biyografi..." />
                                </div>
                            </div>
                        </div>
                    </AccordionItem>

                    {/* 4. BAĞLANTILAR */}
                    <AccordionItem title="Bağlantılar" icon={<LinkIcon size={20} />} isOpen={activeSection === 'links'} onToggle={() => toggleSection('links')}>
                        <div className="space-y-4">
                            {state.links.map((link) => (
                                <div key={link.id} className="bg-white border rounded-lg p-3 flex gap-3 items-center shadow-sm group">
                                    <div className="text-gray-400 cursor-grab"><GripVertical size={16} /></div>
                                    <div className="relative">
                                        <button onClick={() => setActiveIconSelector(activeIconSelector === link.id ? null : link.id)} className={`w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors ${GENERIC_ICONS.find(i => i.id === link.icon)?.color || 'text-gray-500'}`}>
                                            {GENERIC_ICONS.find(i => i.id === link.icon)?.icon || <Globe size={20} />}
                                        </button>
                                        {activeIconSelector === link.id && (
                                            <div className="absolute top-12 left-0 z-10 bg-white border border-gray-200 shadow-xl rounded-xl p-3 w-64 grid grid-cols-5 gap-2">
                                                {GENERIC_ICONS.map(iconOption => (
                                                    <button key={iconOption.id} onClick={() => { updateLink(link.id, 'icon', iconOption.id); setActiveIconSelector(null); }} className={`p-2 rounded hover:bg-gray-100 flex items-center justify-center ${link.icon === iconOption.id ? 'bg-blue-50 ring-1 ring-blue-500' : ''} ${iconOption.color || 'text-gray-600'}`}>{iconOption.icon}</button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        <input type="text" value={link.text} onChange={(e) => updateLink(link.id, 'text', e.target.value)} className="w-full text-sm font-bold border-b border-transparent hover:border-gray-300 focus:border-blue-500 outline-none bg-transparent" placeholder="Bağlantı Metni" />
                                        <input type="text" value={link.url} onChange={(e) => updateLink(link.id, 'url', e.target.value)} className="w-full text-xs text-gray-500 border-b border-transparent hover:border-gray-300 focus:border-blue-500 outline-none bg-transparent" placeholder="https://" />
                                    </div>
                                    <button onClick={() => removeLink(link.id)} className="text-gray-400 hover:text-red-500 p-2"><Trash2 size={16} /></button>
                                </div>
                            ))}
                            <button onClick={addLink} className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 font-bold hover:border-blue-500 hover:text-blue-500 flex items-center justify-center gap-2 transition-colors"><Plus size={20} /> Bağlantı Ekle</button>

                            <div className="pt-4 border-t border-gray-100">
                                {state.socials.length > 0 && (
                                    <div className="mb-4 space-y-3">
                                        <h3 className="text-xs font-bold text-gray-500">EKLENEN SOSYAL HESAPLAR</h3>
                                        {state.socials.map(social => {
                                            const platformInfo = SOCIAL_PLATFORMS.find(p => p.id === social.platform);
                                            return (
                                                <div key={social.id} className="bg-white border rounded-lg p-2 flex gap-3 items-center shadow-sm">
                                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white ${platformInfo?.color}`}>{platformInfo?.icon}</div>
                                                    <input type="text" value={social.url} onChange={(e) => updateSocial(social.id, e.target.value)} className="flex-1 text-sm border-b border-transparent hover:border-gray-300 focus:border-blue-500 outline-none bg-transparent" placeholder={`${social.platform} linki`} />
                                                    <button onClick={() => removeSocial(social.id)} className="text-gray-400 hover:text-red-500 p-2"><Trash2 size={16} /></button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                                <h3 className="text-xs font-bold text-gray-500 mb-3">SOSYAL AĞ EKLE</h3>
                                <div className="grid grid-cols-5 sm:grid-cols-7 gap-2">
                                    {SOCIAL_PLATFORMS.map(p => (
                                        <button key={p.id} onClick={() => addSocial(p.id)} className={`aspect-square rounded-lg flex items-center justify-center text-white transition-all hover:scale-110 ${state.socials.find(s => s.platform === p.id) ? 'ring-2 ring-offset-1 ring-blue-500 bg-blue-500/20' : 'hover:opacity-100'} ${p.color}`} title={p.id}>{p.icon}</button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </AccordionItem>

                    {/* 5. YAZI TİPLERİ */}
                    <AccordionItem title="Yazı Tipleri" icon={<Type size={20} />} isOpen={activeSection === 'fonts'} onToggle={() => toggleSection('fonts')}>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-2">Başlık Yazı Tipi</label>
                                <select value={state.fonts.header} onChange={(e) => setState(prev => ({ ...prev, fonts: { ...prev.fonts, header: e.target.value } }))} className="w-full border rounded p-2">
                                    {FONT_OPTIONS.map(f => <option key={f} value={f}>{f}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-2">Metin Yazı Tipi</label>
                                <select value={state.fonts.text} onChange={(e) => setState(prev => ({ ...prev, fonts: { ...prev.fonts, text: e.target.value } }))} className="w-full border rounded p-2">
                                    {FONT_OPTIONS.map(f => <option key={f} value={f}>{f}</option>)}
                                </select>
                            </div>
                        </div>
                    </AccordionItem>

                    {/* 6. SETTINGS */}
                    <AccordionItem title="Ayarlar" icon={<Settings size={20} />} isOpen={activeSection === 'settings'} onToggle={() => toggleSection('settings')}>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-2">Karşılama Ekranı</label>
                                <div className="flex items-center gap-3">
                                    <input type="checkbox" checked={state.welcomeScreen.enabled} onChange={(e) => setState(prev => ({ ...prev, welcomeScreen: { ...prev.welcomeScreen, enabled: e.target.checked } }))} className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                                    <span className="text-sm font-medium text-gray-700">Aktif Et</span>
                                </div>
                                {state.welcomeScreen.enabled && (
                                    <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center bg-gray-50">
                                        {state.welcomeScreen.image ? (
                                            <div className="relative w-full h-32 bg-gray-200 rounded overflow-hidden"><img src={state.welcomeScreen.image} className="w-full h-full object-cover" /><button onClick={() => setState(prev => ({ ...prev, welcomeScreen: { ...prev.welcomeScreen, image: null } }))} className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"><Trash2 size={14} /></button></div>
                                        ) : (
                                            <label className="cursor-pointer flex flex-col items-center gap-2 text-gray-500 hover:text-blue-500"><ImageIcon size={24} /><span className="text-xs font-bold">Görsel Yükle</span><input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'welcome')} /></label>
                                        )}
                                    </div>
                                )}
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-2">QR Adı</label>
                                <input type="text" value={state.settings.name} onChange={(e) => setState(prev => ({ ...prev, settings: { ...prev.settings, name: e.target.value } }))} placeholder="Örn: Instagram Kampanyam" className="w-full border rounded p-2" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-2">Şifre Koruma</label>
                                <input type="password" value={state.settings.password} onChange={(e) => setState(prev => ({ ...prev, settings: { ...prev.settings, password: e.target.value } }))} placeholder="Opsiyonel" className="w-full border rounded p-2" />
                            </div>
                        </div>
                    </AccordionItem>
                </div>

                {/* RIGHT: PREVIEW COLUMN */}
                <div className="hidden lg:flex flex-col w-[350px] h-[calc(100vh-64px)] sticky top-8 flex-shrink-0 gap-4 justify-center">

                    {/* Tabs */}
                    <div className="bg-white rounded-xl p-1 shadow-sm border border-gray-200 flex">
                        <button
                            onClick={() => setPreviewTab('page')}
                            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors flex items-center justify-center gap-2 ${previewTab === 'page' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            <Smartphone size={16} /> Sayfa
                        </button>
                        <button
                            onClick={() => setPreviewTab('qr')}
                            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors flex items-center justify-center gap-2 ${previewTab === 'qr' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            <QrCode size={16} /> QR Kod
                        </button>
                    </div>

                    {/* 1. Page Preview */}
                    {previewTab === 'page' && (
                        <div className="bg-gray-900 rounded-[50px] p-4 h-[700px] w-full shadow-2xl border-8 border-gray-900 ring-1 ring-gray-800 relative overflow-hidden animate-in fade-in slide-in-from-right-4">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-7 w-32 bg-black rounded-b-2xl z-20"></div>
                            <div className="w-full h-full bg-white rounded-[32px] overflow-hidden relative flex flex-col">
                                <LinkListTemplate
                                    design={state.design}
                                    info={state.info}
                                    links={state.links}
                                    socials={state.socials}
                                    fonts={state.fonts}
                                    welcomeScreen={state.welcomeScreen}
                                    headerFontClass={state.fonts.header}
                                    textFontClass={state.fonts.text}
                                    isPreview={true}
                                />
                            </div>
                        </div>
                    )}

                    {/* 2. QR Preview */}
                    {previewTab === 'qr' && (
                        <div className="bg-white rounded-[32px] p-8 h-auto shadow-2xl border border-gray-200 flex flex-col items-center justify-center gap-8 animate-in fade-in slide-in-from-right-4">
                            <div className="text-center space-y-2">
                                <h3 className="text-xl font-bold text-gray-800">QR Kod Önizleme</h3>
                                <p className="text-sm text-gray-500">Tasarımınız anlık olarak güncellenir.</p>
                            </div>

                            <div className="scale-110 p-4 border rounded-xl bg-gray-50">
                                <FrameRenderer
                                    frameId={state.qrDesign.frame}
                                    currentDesign={state.qrDesign}
                                    value="https://example.com"
                                    size={200}
                                />
                            </div>

                            <div className="text-xs text-center text-gray-400 max-w-xs">
                                Not: Bu sadece bir önizlemedir. Gerçek QR kodunuz "QR Kod Oluştur" butonuna bastığınızda oluşturulacaktır.
                            </div>
                        </div>
                    )}

                </div>

                {/* Success Modal */}
                {createdQr && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-fade-in">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-scale-in">
                            <div className="p-6 text-center space-y-6">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600">
                                    <QrCode size={32} />
                                </div>

                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">QR Kodunuz Hazır!</h3>
                                    <p className="text-gray-500">Bağlantı listeniz başarıyla oluşturuldu.</p>
                                </div>

                                <div className="flex justify-center bg-gray-50 p-6 rounded-xl border border-gray-100 relative">
                                    <div ref={qrRef} className="bg-white p-4 rounded-xl shadow-sm transform hover:scale-105 transition-transform duration-300">
                                        <FrameRenderer
                                            frameId={state.qrDesign.frame}
                                            currentDesign={state.qrDesign}
                                            size={200}
                                            value={`http://localhost:3000/q/${createdQr.id}`}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-3">
                                    <button
                                        onClick={downloadQrCode}
                                        className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2 shadow-lg shadow-purple-200"
                                    >
                                        <Download size={20} />
                                        QR Kodu İndir (PNG)
                                    </button>

                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            onClick={() => window.open(`/q/${createdQr.id}`, '_blank')}
                                            className="py-3 border-2 border-gray-200 hover:border-gray-800 text-gray-700 rounded-xl font-bold transition-colors"
                                        >
                                            Görüntüle
                                        </button>
                                        <button
                                            onClick={() => {
                                                setCreatedQr(null);
                                                setState(INITIAL_STATE);
                                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                            }}
                                            className="py-3 border-2 border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl font-bold transition-colors"
                                        >
                                            Yeni Oluştur
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
