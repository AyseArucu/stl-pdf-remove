'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import QrPageHeader from '@/components/qr/QrPageHeader';
import {
    ChevronLeft,
    ChevronRight,
    ChevronDown,
    Palette,
    Info,
    Type,
    QrCode,
    Lock,
    Smartphone,
    Music,
    Upload,
    Share2,
    Globe,
    Smile,
    Download,
    X,
    ExternalLink,
    Instagram,
    Twitter,
    Facebook,
    Youtube,
    Globe as Website,
    Dribbble,
    Github,
    Linkedin,
    Twitch,
    MessageCircle,
    Send,
    Phone,
    Mail,
    MapPin,
    Link as LinkIcon,
    Chrome,
    Slack,
    Figma,
    Gitlab,
    Trello,
    Video,
    Camera,
    Mic,
    ShoppingBag,
    Coffee,
    Cloud,
    FileText,
    Trash2,
    MoveUp,
    MoveDown,
    Signal,
    Battery,
    Wifi
} from 'lucide-react';
import {
    Inter,
    Roboto,
    Open_Sans,
    Lato,
    Montserrat,
    Playfair_Display,
    Oswald,
    Raleway
} from 'next/font/google';

import FrameRenderer, { QrDesignState } from '@/components/qr/FrameRenderer';
import QRCodeDesignControl from '@/components/qr/QRCodeDesignControl';
import Mp3Template from '@/components/qr/Mp3Template';
import html2canvas from 'html2canvas';

// --- Font Base ---
const inter = Inter({ subsets: ['latin'] });
const roboto = Roboto({ weight: ['400', '700'], subsets: ['latin'] });
const openSans = Open_Sans({ subsets: ['latin'] });
const lato = Lato({ weight: ['400', '700'], subsets: ['latin'] });
const montserrat = Montserrat({ subsets: ['latin'] });
const playfair = Playfair_Display({ subsets: ['latin'] });
const oswald = Oswald({ subsets: ['latin'] });
const raleway = Raleway({ subsets: ['latin'] });

const FONTS = [
    { id: 'inter', name: 'Inter', font: inter },
    { id: 'roboto', name: 'Roboto', font: roboto },
    { id: 'open-sans', name: 'Open Sans', font: openSans },
    { id: 'lato', name: 'Lato', font: lato },
    { id: 'montserrat', name: 'Montserrat', font: montserrat },
    { id: 'playfair', name: 'Playfair Display', font: playfair },
    { id: 'oswald', name: 'Oswald', font: oswald },
    { id: 'raleway', name: 'Raleway', font: raleway },
];

const SOCIAL_PLATFORMS = [
    { id: 'instagram', name: 'Instagram', color: 'bg-gradient-to-tr from-yellow-400 to-purple-600', icon: Instagram, prefix: 'instagram.com/', placeholder: 'kullaniciadi' },
    { id: 'facebook', name: 'Facebook', color: 'bg-blue-600', icon: Facebook, prefix: 'facebook.com/', placeholder: 'kullaniciadi' },
    { id: 'github', name: 'GitHub', color: 'bg-gray-900', icon: Github, prefix: 'github.com/', placeholder: 'kullaniciadi' },
    { id: 'google', name: 'Google', color: 'bg-blue-500', icon: Chrome, placeholder: 'https://google.com/...' },
    { id: 'linkedin', name: 'LinkedIn', color: 'bg-blue-700', icon: Linkedin, prefix: 'linkedin.com/in/', placeholder: 'kullaniciadi' },
    { id: 'pinterest', name: 'Pinterest', color: 'bg-red-700', icon: Camera, prefix: 'pinterest.com/', placeholder: 'kullaniciadi' },
    { id: 'reddit', name: 'Reddit', color: 'bg-orange-600', icon: MessageCircle, prefix: 'reddit.com/user/', placeholder: 'kullaniciadi' },
    { id: 'skype', name: 'Skype', color: 'bg-blue-400', icon: Phone, prefix: 'skype:', placeholder: 'kullaniciadi?chat' },
    { id: 'snapchat', name: 'Snapchat', color: 'bg-yellow-400 text-black', icon: Camera, prefix: 'snapchat.com/add/', placeholder: 'kullaniciadi' },
    { id: 'tumblr', name: 'Tumblr', color: 'bg-blue-900', icon: Type, prefix: 'tumblr.com/', placeholder: 'kullaniciadi' },
    { id: 'twitter', name: 'X', color: 'bg-black', icon: Twitter, prefix: 'x.com/', placeholder: 'kullaniciadi' },
    { id: 'vimeo', name: 'Vimeo', color: 'bg-blue-400', icon: Video, prefix: 'vimeo.com/', placeholder: 'kullaniciadi' },
    { id: 'vk', name: 'VK', color: 'bg-blue-600', icon: Globe, prefix: 'vk.com/', placeholder: 'kullaniciadi' },
    { id: 'youtube', name: 'YouTube', color: 'bg-red-600', icon: Youtube, prefix: 'youtube.com/@', placeholder: 'kanaladi' },
    { id: 'tiktok', name: 'TikTok', color: 'bg-black', icon: Video, prefix: 'tiktok.com/@', placeholder: 'kullaniciadi' },
    { id: 'whatsapp', name: 'WhatsApp', color: 'bg-green-500', icon: Phone, prefix: 'wa.me/', placeholder: '90555...' },
    { id: 'telegram', name: 'Telegram', color: 'bg-blue-400', icon: Send, prefix: 't.me/', placeholder: 'kullaniciadi' },
    { id: 'messenger', name: 'Messenger', color: 'bg-blue-500', icon: MessageCircle, prefix: 'm.me/', placeholder: 'kullaniciadi' },
    { id: 'yelp', name: 'Yelp', color: 'bg-red-600', icon: MapPin, prefix: 'yelp.com/biz/', placeholder: 'isletme-adi' },
    { id: 'ubereats', name: 'Uber Eats', color: 'bg-green-500', icon: Coffee, placeholder: 'https://ubereats.com/...' },
    { id: 'spotify', name: 'Spotify', color: 'bg-green-600', icon: Music, prefix: 'open.spotify.com/artist/', placeholder: 'sanatciid' },
    { id: 'soundcloud', name: 'SoundCloud', color: 'bg-orange-500', icon: Cloud, prefix: 'soundcloud.com/', placeholder: 'kullaniciadi' },
    { id: 'applemusic', name: 'Apple Music', color: 'bg-red-500', icon: Music, placeholder: 'https://music.apple.com/...' },
    { id: 'wechat', name: 'WeChat', color: 'bg-green-600', icon: MessageCircle, placeholder: 'WeChat ID' },
    { id: 'website', name: 'Web Sitesi', color: 'bg-gray-800', icon: Website, placeholder: 'https://ornek.com' },
    { id: 'location', name: 'Konum', color: 'bg-red-500', icon: MapPin, placeholder: 'Google Maps Linki' },
    { id: 'email', name: 'E-posta', color: 'bg-gray-600', icon: Mail, prefix: 'mailto:', placeholder: 'ornek@email.com' },
    { id: 'phone', name: 'Telefon', color: 'bg-green-600', icon: Phone, prefix: 'tel:', placeholder: '+90...' },
    { id: 'discord', name: 'Discord', color: 'bg-indigo-600', icon: MessageCircle, placeholder: 'Davet Linki' },
    { id: 'twitch', name: 'Twitch', color: 'bg-purple-600', icon: Twitch, prefix: 'twitch.tv/', placeholder: 'kullaniciadi' },
    { id: 'dribbble', name: 'Dribbble', color: 'bg-pink-500', icon: Dribbble, prefix: 'dribbble.com/', placeholder: 'kullaniciadi' },
    { id: 'medium', name: 'Medium', color: 'bg-black', icon: FileText, prefix: 'medium.com/@', placeholder: 'kullaniciadi' },
    { id: 'custom', name: 'Özel Link', color: 'bg-gray-500', icon: LinkIcon, placeholder: 'https://...' },
];

// --- Types ---
interface DesignState {
    primaryColor: string;
    backgroundColor: string;
    textColor: string;
    fontId: string;
}

interface Mp3InfoState {
    file: string | null;     // DataURL
    fileName: string | null;
    coverImage: string | null; // DataURL
    title: string;
    artist: string;
    description?: string;
}

interface MetaState {
    qrName: string;
    isPasswordEnabled: boolean;
    password?: string;
}

interface SocialLink {
    id: string;
    platform: string;
    url: string;
    value?: string; // User input value (username, phone, etc.)
    text?: string;  // Custom display text
}

interface WelcomeScreenState {
    enabled: boolean;
    image: string | null;
}

export default function Mp3QrPage() {
    const router = useRouter();
    const { user } = useUser();
    const qrRef = useRef<HTMLDivElement>(null);
    const [createdQr, setCreatedQr] = useState<{ id: string, url: string } | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    // --- State Management ---
    const [activeSection, setActiveSection] = useState<string | null>('upload');
    const [previewTab, setPreviewTab] = useState<'page' | 'qr'>('page');

    const [mp3Info, setMp3Info] = useState<Mp3InfoState>({
        file: null,
        fileName: null,
        coverImage: null, // Default placeholder if needed
        title: '',
        artist: '',
        description: ''
    });

    const [design, setDesign] = useState<DesignState>({
        primaryColor: '#6366f1', // Indigo-500 default
        backgroundColor: '#ffffff',
        textColor: '#1f2937',
        fontId: 'inter'
    });

    const [socials, setSocials] = useState<SocialLink[]>([]);

    const [welcomeScreen, setWelcomeScreen] = useState<WelcomeScreenState>({
        enabled: false,
        image: null
    });

    const [meta, setMeta] = useState<MetaState>({
        qrName: '',
        isPasswordEnabled: false,
        password: ''
    });

    const [qrDesign, setQrDesign] = useState<QrDesignState>({
        frame: 'none',
        frameLabel: 'Scan Me',
        pattern: 'square',
        cornerStyle: 'square',
        cornerColor: '#000000',
        logo: null,
        fgColor: '#000000',
        bgColor: '#ffffff',
        gradient: { enabled: false, start: '#000000', end: '#ff0000' }
    });

    const [shouldAutoSave, setShouldAutoSave] = useState(false);

    // --- EFFECT: Restore State & Trigger Auto-Save ---
    useEffect(() => {
        const pending = localStorage.getItem('pendingQrDesign');
        if (pending && user) {
            try {
                const data = JSON.parse(pending);
                if (data.type === 'mp3') {
                    setMp3Info(data.state.mp3Info);
                    setDesign(data.state.design);
                    setSocials(data.state.socials);
                    setWelcomeScreen(data.state.welcomeScreen);
                    setMeta(data.state.meta);
                    setQrDesign(data.state.qrDesign);
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
        if (shouldAutoSave && mp3Info.file) { // Ensure file is present
            const timer = setTimeout(() => {
                handleCreateQr(true);
                setShouldAutoSave(false);
            }, 800);
            return () => clearTimeout(timer);
        }
    }, [shouldAutoSave, mp3Info.file]);

    // --- Helpers ---
    const toggleSection = (id: string) => activeSection === id ? setActiveSection(null) : setActiveSection(id);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'audio' | 'image' | 'welcome') => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const result = event.target?.result as string;
            if (type === 'audio') {
                setMp3Info({ ...mp3Info, file: result, fileName: file.name });
            } else if (type === 'image') {
                setMp3Info({ ...mp3Info, coverImage: result });
            } else if (type === 'welcome') {
                setWelcomeScreen({ ...welcomeScreen, image: result });
            }
        };
        reader.readAsDataURL(file);
    };

    const addSocial = (platformId: string) => {
        const platform = SOCIAL_PLATFORMS.find(p => p.id === platformId);
        if (!platform) return;

        setSocials([...socials, {
            id: Math.random().toString(36).substr(2, 9),
            platform: platformId,
            url: '',
            value: '', // Initialize value
            text: platform.name // Initialize text
        }]);
    };

    const updateSocial = (id: string, field: 'value' | 'text', content: string) => {
        setSocials(socials.map(s => {
            if (s.id !== id) return s;

            const platform = SOCIAL_PLATFORMS.find(p => p.id === s.platform);
            if (!platform) return s;

            const updates: any = { [field]: content };
            if (field === 'value') {
                // Update URL based on prefix
                if (platform.prefix) {
                    updates.url = content.startsWith('http') ? content : `https://${platform.prefix}${content}`;
                } else {
                    updates.url = content;
                }
            }
            return { ...s, ...updates };
        }));
    };

    const removeSocial = (id: string) => {
        setSocials(socials.filter(s => s.id !== id));
    };

    const moveSocial = (id: string, direction: 'up' | 'down') => {
        const index = socials.findIndex(s => s.id === id);
        if (index === -1) return;

        const newSocials = [...socials];
        if (direction === 'up' && index > 0) {
            [newSocials[index], newSocials[index - 1]] = [newSocials[index - 1], newSocials[index]];
        } else if (direction === 'down' && index < newSocials.length - 1) {
            [newSocials[index], newSocials[index + 1]] = [newSocials[index + 1], newSocials[index]];
        }
        setSocials(newSocials);
    };

    const handleCreateQr = async (isAutoAction = false) => {
        if (!isAutoAction && !user) {
            const stateToSave = {
                type: 'mp3',
                state: {
                    mp3Info,
                    design,
                    socials,
                    welcomeScreen,
                    meta,
                    qrDesign
                }
            };
            try {
                // Warning: LocalStorage has size limits. Large MP3/Image DataURLs might fail.
                // In a real app, we'd want to handle large files differently.
                localStorage.setItem('pendingQrDesign', JSON.stringify(stateToSave));
                router.push(`/login?callbackUrl=${encodeURIComponent('/qr/mp3')}`);
            } catch (e) {
                alert('Dosya boyutu oturum saklama için çok büyük. Lütfen önce giriş yapın.');
                router.push(`/login?callbackUrl=${encodeURIComponent('/qr/mp3')}`);
            }
            return;
        }

        if (!mp3Info.file) {
            alert('Lütfen bir MP3 dosyası yükleyin.');
            return;
        }

        setIsSaving(true);
        // Mock API Call - Replace with real implementation
        try {
            // In a real app, we would upload the MP3 file to storage (S3/Blob) first
            // and get a URL. For this demo, we might hit size limits sending DataURL.
            // We'll simulate the process.

            // Construct Payload
            const payload = {
                type: 'mp3',
                name: meta.qrName || mp3Info.title || 'MP3 QR',
                password: meta.isPasswordEnabled ? meta.password : undefined,
                content: {
                    mp3Info,
                    design,
                    socials,
                    welcomeScreen
                },
                qrDesign
            };

            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Since we don't have the backend endpoint for MP3 specifically yet, 
            // we'll just show success for the UI demo. 
            // In production: await fetch('/api/qr/create', ...)

            setCreatedQr({
                id: 'demo-id-' + Date.now(),
                url: 'http://localhost:3000/q/demo'
            });

        } catch (error) {
            console.error('Error creating QR:', error);
            alert('Bir hata oluştu.');
        } finally {
            setIsSaving(false);
        }
    };

    const pathname = usePathname();

    const downloadQrCode = async () => {
        if (!user) {
            const loginUrl = `/login?callbackUrl=${encodeURIComponent(pathname)}`;
            router.push(loginUrl);
            return;
        }

        if (!qrRef.current) return;
        try {
            const canvas = await html2canvas(qrRef.current, { backgroundColor: null });
            const url = canvas.toDataURL('image/png');
            const a = document.createElement('a');
            a.href = url;
            a.download = `qr-${meta.qrName || 'mp3'}.png`;
            a.click();
        } catch (err) {
            console.error('Download failed', err);
        }
    };


    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-800">
            <QrPageHeader
                title="MP3 QR"
                icon={<Music className="text-pink-600" />}
                activeTab={previewTab === 'page' ? 'content' : 'qr'}
                onTabChange={(tab) => setPreviewTab(tab === 'content' ? 'page' : 'qr')}
                onSave={handleCreateQr}
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


                    {/* 1. MP3 Upload */}
                    <div className={`bg-white rounded-xl shadow-sm border ${activeSection === 'upload' ? 'border-indigo-500 ring-1 ring-indigo-500' : 'border-gray-200'} overflow-hidden`}>
                        <button onClick={() => toggleSection('upload')} className="w-full p-5 flex items-center justify-between hover:bg-gray-50">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center">
                                    <Info size={20} />
                                </div>
                                <div className="text-left">
                                    <h3 className="font-bold text-gray-900 flex items-center gap-2">MP3 <span className="text-red-500">*</span></h3>
                                    <p className="text-xs text-gray-500">Cihazınızdan bir ses dosyası yükleyin.</p>
                                </div>
                            </div>
                            {activeSection === 'upload' ? <ChevronDown className="text-gray-400" /> : <ChevronRight className="text-gray-400" />}
                        </button>
                        {activeSection === 'upload' && (
                            <div className="p-5 border-t border-gray-100 bg-gray-50/50 space-y-4 animate-in fade-in">
                                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center bg-white text-center hover:bg-gray-50 transition-colors relative">
                                    <input
                                        type="file"
                                        accept="audio/mp3,audio/mpeg"
                                        onChange={(e) => handleFileUpload(e, 'audio')}
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                    />
                                    {mp3Info.file ? (
                                        <>
                                            <Music size={48} className="text-green-500 mb-4" />
                                            <p className="font-bold text-gray-800">{mp3Info.fileName}</p>
                                            <p className="text-xs text-green-600 mt-2">Dosya yüklendi</p>
                                            <button className="mt-4 text-xs text-red-500 underline z-10 relative" onClick={(e) => {
                                                e.stopPropagation();
                                                e.preventDefault(); // Stop creating file dialog
                                                setMp3Info({ ...mp3Info, file: null, fileName: null });
                                            }}>Dosyayı Kaldır</button>
                                        </>
                                    ) : (
                                        <>
                                            <Upload size={48} className="text-gray-300 mb-4" />
                                            <p className="font-bold text-gray-700">MP3 Dosyanızı Buraya Sürükleyin</p>
                                            <p className="text-xs text-gray-500 mt-2">veya dosya seçmek için tıklayın</p>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* 2. Design (Colors) */}
                    <div className={`bg-white rounded-xl shadow-sm border ${activeSection === 'design' ? 'border-indigo-500 ring-1 ring-indigo-500' : 'border-gray-200'} overflow-hidden`}>
                        <button onClick={() => toggleSection('design')} className="w-full p-5 flex items-center justify-between hover:bg-gray-50">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-500 flex items-center justify-center">
                                    <Palette size={20} />
                                </div>
                                <div className="text-left">
                                    <h3 className="font-bold text-gray-900">Tasarım</h3>
                                    <p className="text-xs text-gray-500">Sayfanız için bir renk teması seçin.</p>
                                </div>
                            </div>
                            {activeSection === 'design' ? <ChevronDown className="text-gray-400" /> : <ChevronRight className="text-gray-400" />}
                        </button>
                        {activeSection === 'design' && (
                            <div className="p-5 border-t border-gray-100 bg-gray-50/50 space-y-4 animate-in fade-in">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-2">Ana Renk (Primary)</label>
                                    <div className="flex items-center gap-3">
                                        <input type="color" value={design.primaryColor} onChange={(e) => setDesign({ ...design, primaryColor: e.target.value })} className="w-10 h-10 rounded cursor-pointer border p-0" />
                                        <span className="text-xs text-gray-500 font-mono">{design.primaryColor}</span>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-2">Arka Plan Rengi</label>
                                    <div className="flex items-center gap-3">
                                        <input type="color" value={design.backgroundColor} onChange={(e) => setDesign({ ...design, backgroundColor: e.target.value })} className="w-10 h-10 rounded cursor-pointer border p-0" />
                                        <span className="text-xs text-gray-500 font-mono">{design.backgroundColor}</span>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-2">Metin Rengi</label>
                                    <div className="flex items-center gap-3">
                                        <input type="color" value={design.textColor} onChange={(e) => setDesign({ ...design, textColor: e.target.value })} className="w-10 h-10 rounded cursor-pointer border p-0" />
                                        <span className="text-xs text-gray-500 font-mono">{design.textColor}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* 3. Basic Info */}
                    <div className={`bg-white rounded-xl shadow-sm border ${activeSection === 'info' ? 'border-indigo-500 ring-1 ring-indigo-500' : 'border-gray-200'} overflow-hidden`}>
                        <button onClick={() => toggleSection('info')} className="w-full p-5 flex items-center justify-between hover:bg-gray-50">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center">
                                    <Info size={20} />
                                </div>
                                <div className="text-left">
                                    <h3 className="font-bold text-gray-900">Temel Bilgiler</h3>
                                    <p className="text-xs text-gray-500">MP3 dosyanıza bir bağlam ekleyin.</p>
                                </div>
                            </div>
                            {activeSection === 'info' ? <ChevronDown className="text-gray-400" /> : <ChevronRight className="text-gray-400" />}
                        </button>
                        {activeSection === 'info' && (
                            <div className="p-5 border-t border-gray-100 bg-gray-50/50 space-y-4 animate-in fade-in">
                                {/* Cover Image Upload */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-2">Kapak Görseli</label>
                                    <div className="flex items-center gap-4">
                                        <div className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center relative border shadow-sm">
                                            {mp3Info.coverImage ? (
                                                <img src={mp3Info.coverImage} className="w-full h-full object-cover" />
                                            ) : (
                                                <Music className="text-gray-400" />
                                            )}
                                            <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'image')} className="absolute inset-0 opacity-0 cursor-pointer" />
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            <p>Önerilen: 500x500px</p>
                                            <p>JPG veya PNG</p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-2">Şarkı Başlığı</label>
                                    <input
                                        type="text"
                                        value={mp3Info.title}
                                        onChange={(e) => setMp3Info({ ...mp3Info, title: e.target.value })}
                                        className="w-full p-3 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                        placeholder="Şarkı adı"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-2">Sanatçı</label>
                                    <input
                                        type="text"
                                        value={mp3Info.artist}
                                        onChange={(e) => setMp3Info({ ...mp3Info, artist: e.target.value })}
                                        className="w-full p-3 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                        placeholder="Sanatçı adı"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* 4. Social Networks */}
                    <div className={`bg-white rounded-xl shadow-sm border ${activeSection === 'socials' ? 'border-indigo-500 ring-1 ring-indigo-500' : 'border-gray-200'} overflow-hidden`}>
                        <button onClick={() => toggleSection('socials')} className="w-full p-5 flex items-center justify-between hover:bg-gray-50">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center">
                                    <Globe size={20} />
                                </div>
                                <div className="text-left">
                                    <h3 className="font-bold text-gray-900">Sosyal Ağlar</h3>
                                    <p className="text-xs text-gray-500">Sayfanıza sosyal medya bağlantıları ekleyin.</p>
                                </div>
                            </div>
                            {activeSection === 'socials' ? <ChevronDown className="text-gray-400" /> : <ChevronRight className="text-gray-400" />}
                        </button>
                        {activeSection === 'socials' && (
                            <div className="p-5 border-t border-gray-100 bg-gray-50/50 space-y-6 animate-in fade-in">

                                {/* Active Socials List */}
                                <div className="space-y-4">
                                    {socials.map((social, index) => {
                                        const platform = SOCIAL_PLATFORMS.find(p => p.id === social.platform);
                                        return (
                                            <div key={social.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm animate-in slide-in-from-top-2">
                                                <div className="flex items-center justify-between mb-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${platform?.color || 'bg-gray-500'}`}>
                                                            {platform?.icon && <platform.icon size={16} />}
                                                        </div>
                                                        <span className="font-bold text-sm text-gray-800">{platform?.name}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <button
                                                            onClick={() => moveSocial(social.id, 'up')}
                                                            disabled={index === 0}
                                                            className="p-1.5 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-600 disabled:opacity-30"
                                                        >
                                                            <MoveUp size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => moveSocial(social.id, 'down')}
                                                            disabled={index === socials.length - 1}
                                                            className="p-1.5 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-600 disabled:opacity-30"
                                                        >
                                                            <MoveDown size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => removeSocial(social.id)}
                                                            className="p-1.5 hover:bg-red-50 rounded text-red-400 hover:text-red-600 ml-1"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-xs font-bold text-gray-700 mb-1">Kullanıcı kimliği / URL*</label>
                                                        <input
                                                            type="text"
                                                            value={social.value}
                                                            onChange={(e) => updateSocial(social.id, 'value', e.target.value)}
                                                            className="w-full p-2.5 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                                            placeholder={platform?.placeholder}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-bold text-gray-700 mb-1">Metin</label>
                                                        <input
                                                            type="text"
                                                            value={social.text || ''}
                                                            onChange={(e) => updateSocial(social.id, 'text', e.target.value)}
                                                            className="w-full p-2.5 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                                            placeholder={`Örn: ${platform?.name}`}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Active Socials */}
                                <div className="space-y-2 mb-4">
                                    {socials.map(social => (
                                        <div key={social.id} className="flex gap-2 items-center bg-white p-2 rounded-lg border">
                                            <div className={`w-8 h-8 rounded shrink-0 ${SOCIAL_PLATFORMS.find(p => p.id === social.platform)?.color}`}></div>
                                            <input
                                                type="text"
                                                value={social.value}
                                                onChange={(e) => updateSocial(social.id, 'value', e.target.value)}
                                                placeholder={SOCIAL_PLATFORMS.find(p => p.id === social.platform)?.placeholder || 'Değer'}
                                                className="flex-1 text-sm outline-none bg-transparent"
                                            />
                                            <button onClick={() => removeSocial(social.id)} className="p-2 text-gray-400 hover:text-red-500">
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                <div className="border-t border-gray-200 pt-4">
                                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Platform Ekle</h4>
                                    <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-1 max-h-52 overflow-y-auto p-1 no-scrollbar">
                                        {SOCIAL_PLATFORMS.map(p => (
                                            <button
                                                key={p.id}
                                                onClick={() => addSocial(p.id)}
                                                className="flex flex-col items-center justify-center p-1 rounded-lg hover:bg-gray-100 transition-all group relative"
                                                title={p.name}
                                            >
                                                <div className={`w-8 h-8 rounded-full ${p.color} flex items-center justify-center text-white mb-0.5 group-hover:scale-110 group-hover:shadow-md transition-all shadow-sm`}>
                                                    <p.icon size={15} />
                                                </div>
                                                <span className="text-[9px] font-medium text-gray-600 truncate w-full text-center leading-tight">{p.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* 5. Fonts */}
                    <div className={`bg-white rounded-xl shadow-sm border ${activeSection === 'fonts' ? 'border-indigo-500 ring-1 ring-indigo-500' : 'border-gray-200'} overflow-hidden`}>
                        <button onClick={() => toggleSection('fonts')} className="w-full p-5 flex items-center justify-between hover:bg-gray-50">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-500 flex items-center justify-center">
                                    <Type size={20} />
                                </div>
                                <div className="text-left">
                                    <h3 className="font-bold text-gray-900">Yazı Tipleri</h3>
                                    <p className="text-xs text-gray-500">Orijinal yazı tipleriyle sayfanızı benzersiz kılın.</p>
                                </div>
                            </div>
                            {activeSection === 'fonts' ? <ChevronDown className="text-gray-400" /> : <ChevronRight className="text-gray-400" />}
                        </button>
                        {activeSection === 'fonts' && (
                            <div className="p-5 border-t border-gray-100 bg-gray-50/50 grid grid-cols-2 gap-2 animate-in fade-in">
                                {FONTS.map(font => (
                                    <button
                                        key={font.id}
                                        onClick={() => setDesign({ ...design, fontId: font.id })}
                                        className={`p-3 rounded-lg border text-sm text-center transition-all ${design.fontId === font.id ? 'border-indigo-500 bg-indigo-50 text-indigo-700 ring-1 ring-indigo-500' : 'border-gray-200 hover:border-gray-300 text-gray-600'}`}
                                    >
                                        <span className={font.font.className}>{font.name}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* 6. Welcome Screen */}
                    <div className={`bg-white rounded-xl shadow-sm border ${activeSection === 'welcome' ? 'border-indigo-500 ring-1 ring-indigo-500' : 'border-gray-200'} overflow-hidden`}>
                        <button onClick={() => toggleSection('welcome')} className="w-full p-5 flex items-center justify-between hover:bg-gray-50">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-yellow-50 text-yellow-500 flex items-center justify-center">
                                    <Smile size={20} />
                                </div>
                                <div className="text-left">
                                    <h3 className="font-bold text-gray-900">Karşılama Ekranı</h3>
                                    <p className="text-xs text-gray-500">Sayfanız yüklenirken bir görsel görüntüleyin.</p>
                                </div>
                            </div>
                            {activeSection === 'welcome' ? <ChevronDown className="text-gray-400" /> : <ChevronRight className="text-gray-400" />}
                        </button>
                        {activeSection === 'welcome' && (
                            <div className="p-5 border-t border-gray-100 bg-gray-50/50 space-y-4 animate-in fade-in">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-bold text-gray-700">Aktif</label>
                                    <input type="checkbox" checked={welcomeScreen.enabled} onChange={(e) => setWelcomeScreen({ ...welcomeScreen, enabled: e.target.checked })} className="w-5 h-5 cursor-pointer" />
                                </div>
                                {welcomeScreen.enabled && (
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center bg-white relative">
                                        {welcomeScreen.image ? (
                                            <div className="relative w-full h-32">
                                                <img src={welcomeScreen.image} className="w-full h-full object-cover rounded-lg" />
                                                <button onClick={() => setWelcomeScreen({ ...welcomeScreen, image: null })} className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"><X size={14} /></button>
                                            </div>
                                        ) : (
                                            <>
                                                <Upload size={24} className="text-gray-400 mb-2" />
                                                <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'welcome')} className="absolute inset-0 opacity-0 cursor-pointer" />
                                                <span className="text-xs text-gray-500">Görsel Yükle</span>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* 7. QR Name */}
                    <div className={`bg-white rounded-xl shadow-sm border ${activeSection === 'qrname' ? 'border-indigo-500 ring-1 ring-indigo-500' : 'border-gray-200'} overflow-hidden`}>
                        <button onClick={() => toggleSection('qrname')} className="w-full p-5 flex items-center justify-between hover:bg-gray-50">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center">
                                    <QrCode size={20} />
                                </div>
                                <div className="text-left">
                                    <h3 className="font-bold text-gray-900">QR Kodun Adı</h3>
                                    <p className="text-xs text-gray-500">QR kodunuza bir isim verin.</p>
                                </div>
                            </div>
                            {activeSection === 'qrname' ? <ChevronDown className="text-gray-400" /> : <ChevronRight className="text-gray-400" />}
                        </button>
                        {activeSection === 'qrname' && (
                            <div className="p-5 border-t border-gray-100 bg-gray-50/50 animate-in fade-in">
                                <input
                                    type="text"
                                    value={meta.qrName}
                                    onChange={(e) => setMeta({ ...meta, qrName: e.target.value })}
                                    placeholder="Örn: Yaz Şarkısı"
                                    className="w-full p-3 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                        )}
                    </div>

                    {/* 8. Password */}
                    <div className={`bg-white rounded-xl shadow-sm border ${activeSection === 'password' ? 'border-indigo-500 ring-1 ring-indigo-500' : 'border-gray-200'} overflow-hidden`}>
                        <button onClick={() => toggleSection('password')} className="w-full p-5 flex items-center justify-between hover:bg-gray-50">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center">
                                    <Lock size={20} />
                                </div>
                                <div className="text-left">
                                    <h3 className="font-bold text-gray-900">Şifre</h3>
                                </div>
                            </div>
                            {activeSection === 'password' ? <ChevronDown className="text-gray-400" /> : <ChevronRight className="text-gray-400" />}
                        </button>
                        {activeSection === 'password' && (
                            <div className="p-5 border-t border-gray-100 bg-gray-50/50 animate-in fade-in space-y-4">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-medium text-gray-700">Şifre Koruması</label>
                                    <input type="checkbox" checked={meta.isPasswordEnabled} onChange={(e) => setMeta({ ...meta, isPasswordEnabled: e.target.checked })} className="w-5 h-5 cursor-pointer" />
                                </div>
                                {meta.isPasswordEnabled && (
                                    <input
                                        type="password"
                                        value={meta.password}
                                        onChange={(e) => setMeta({ ...meta, password: e.target.value })}
                                        className="w-full p-3 rounded-lg border border-gray-200 text-sm outline-none"
                                        placeholder="Şifre belirleyin"
                                    />
                                )}
                            </div>
                        )}
                    </div>

                </div>

                {/* Right Panel: Preview */}
                <div className="flex-1 flex flex-col items-center justify-center bg-gray-100 rounded-3xl p-8 border border-gray-200 relative min-h-[600px] sticky top-8">
                    <div className="absolute top-4 right-4 flex gap-2">
                        <button
                            onClick={() => setPreviewTab('page')}
                            className={`p-2 rounded-lg ${previewTab === 'page' ? 'bg-white shadow text-pink-600' : 'text-gray-500 hover:bg-white/50'}`}
                        >
                            <Smartphone size={20} />
                        </button>
                        <button
                            onClick={() => setPreviewTab('qr')}
                            className={`p-2 rounded-lg ${previewTab === 'qr' ? 'bg-white shadow text-pink-600' : 'text-gray-500 hover:bg-white/50'}`}
                        >
                            <QrCode size={20} />
                        </button>
                    </div>

                    {previewTab === 'page' ? (
                        <div className="w-[320px] h-[640px] bg-white rounded-[3rem] shadow-2xl border-8 border-gray-900 overflow-hidden relative fade-in">
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
                            <div className="h-full overflow-hidden relative bg-white">
                                <Mp3Template
                                    design={{
                                        ...design,
                                        fontFamily: FONTS.find(f => f.id === design.fontId)?.font.className
                                    }}
                                    info={mp3Info}
                                    socials={socials.map(s => {
                                        const platform = SOCIAL_PLATFORMS.find(p => p.id === s.platform);
                                        return {
                                            id: s.id,
                                            url: s.url,
                                            platform: platform?.id || 'website',
                                            active: true
                                        } as any;
                                    })}
                                />
                            </div>
                        </div>
                    ) : (
                        // QR Preview Card
                        <div className="bg-white p-8 rounded-2xl shadow-xl flex flex-col items-center gap-6" id="qr-download-target">
                            <div ref={qrRef}>
                                <FrameRenderer
                                    frameId={qrDesign.frame}
                                    currentDesign={qrDesign}
                                    value="https://example.com"
                                    size={250}
                                />
                            </div>
                            <p className="text-sm text-gray-500 text-center max-w-[200px]">QR Kodunuz anlık olarak güncellenir.</p>
                        </div>
                    )}
                </div>
            </div>
            {/* Success Modal */}
            {createdQr && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl scale-100 animate-in zoom-in-95">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">Hazır! 🎉</h2>
                            <button onClick={() => setCreatedQr(null)} className="p-2 hover:bg-gray-100 rounded-full">
                                <X size={24} className="text-gray-500" />
                            </button>
                        </div>
                        <div className="flex flex-col items-center gap-6 mb-8">
                            <div className="p-4 bg-white rounded-xl shadow-lg border border-gray-100">
                                <FrameRenderer
                                    frameId={qrDesign.frame}
                                    currentDesign={qrDesign}
                                    value={createdQr.url}
                                    size={200}
                                />
                            </div>
                            <p className="text-center text-gray-600 text-sm">QR kodunuz başarıyla oluşturuldu.</p>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <button onClick={downloadQrCode} className="col-span-2 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-purple-200">
                                <Download size={18} className="inline mr-2" /> PNG İndir
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
