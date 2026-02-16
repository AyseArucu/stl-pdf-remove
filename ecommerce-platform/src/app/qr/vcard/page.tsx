
'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
    QrCode, Download, Palette, Type, AppWindow, Settings, Lock,
    ChevronDown, ChevronUp, Plus, Trash2, Info, Eye, Smartphone,
    ArrowLeft, User, Phone, Mail, Globe, MapPin, Building2,
    Linkedin, Twitter, Instagram, Facebook, Share2, Briefcase, Contact, ArrowRight
} from 'lucide-react';
import FrameRenderer, { QrDesignState } from '@/components/qr/FrameRenderer';
import QRCodeDesignControl from '@/components/qr/QRCodeDesignControl';
import html2canvas from 'html2canvas';
import { createQrCode } from '@/app/actions/qr';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import Link from 'next/link';
import QrPageHeader from '@/components/qr/QrPageHeader';

// Fix pattern type to match QrDesignState
import { PatternType, CornerType } from '@/components/CustomQRCode';

export default function VCardQrPage() {
    const router = useRouter();
    const { user } = useUser();
    const [activeTab, setActiveTab] = useState<'content' | 'qr'>('content');
    const [expandedSection, setExpandedSection] = useState<string | null>('personal');
    const qrRef = useRef<HTMLDivElement>(null);
    const [shouldAutoSave, setShouldAutoSave] = useState(false);
    const [isAutoDownloading, setIsAutoDownloading] = useState(false);

    // --- EFFECT: Restore State & Trigger Auto-Save ---
    useEffect(() => {
        const pending = localStorage.getItem('pendingQrDesign');
        if (pending && user) {
            try {
                const data = JSON.parse(pending);
                if (data.type === 'vcard') {
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
        if (shouldAutoSave) {
            const timer = setTimeout(() => {
                handleSave(true);
                setShouldAutoSave(false);
            }, 800);
            return () => clearTimeout(timer);
        }
    }, [shouldAutoSave]);

    // --- EFFECT: Auto Download ---
    useEffect(() => {
        if (isAutoDownloading && qrRef.current) {
            const timer = setTimeout(() => {
                // Trigger download if marked for auto-download
                // Since downloadQr handles both, we might just rely on handleSave(true) calling downloadQr
                // But downloadQr is async.
                setIsAutoDownloading(false);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [isAutoDownloading]);

    const [isSaving, setIsSaving] = useState(false);

    // Initial State
    const [state, setState] = useState({
        personal: {
            firstName: 'Erashu',
            lastName: 'Gaming',
            title: 'Digital Creator',
            photo: 'https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
            bio: 'Erashu Gaming dijital dünyasına hoş geldiniz.'
        },
        contact: {
            mobile: '05396649999',
            work: '',
            email: 'erashugaming@gmail.com',
            website: 'https://www.erashugaming.com'
        },
        location: {
            address: 'Üsküdar',
            city: 'İstanbul',
            country: 'Türkiye',
            mapUrl: ''
        },
        company: {
            name: 'Erashu Gaming',
            department: 'Digital Media',
            website: 'https://www.erashugaming.com'
        },
        socials: {
            linkedin: '',
            twitter: 'erashugaming',
            instagram: 'erashugaming',
            facebook: 'erashugaming'
        },
        design: {
            themeColor: '#0f393b',
            bgColor: '#ffffff',
            textColor: '#000000',
            iconColor: '#0f393b',
            cardBgColor: '#ffffff',
            buttonBgColor: '#ffffff',
            buttonShape: 'circle'
        },
        fonts: {
            header: 'Inter',
            body: 'Inter'
        },
        welcomeScreen: {
            enabled: false,
            mediaType: 'image',
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

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                updateState('personal.photo', reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async (isAutoAction = false) => {
        if (!isAutoAction && !user) {
            const stateToSave = {
                type: 'vcard',
                state: state
            };
            localStorage.setItem('pendingQrDesign', JSON.stringify(stateToSave));
            router.push(`/login?callbackUrl=${encodeURIComponent('/qr/vcard')}`);
            return;
        }

        // Here we simulate saving or downloading
        if (!qrRef.current) return;

        setIsSaving(true);
        try {
            await downloadQr(); // Reuse current download logic
        } finally {
            setIsSaving(false);
        }
    };

    const downloadQr = async () => {
        if (!qrRef.current) return;

        try {
            const canvas = await html2canvas(qrRef.current);
            const url = canvas.toDataURL('image/png');
            const a = document.createElement('a');
            a.href = url;
            a.download = `vcard-qr-${Date.now()}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            if (user) {
                await createQrCode({
                    type: 'vcard', // We might map this to existing types or handle as 'vcard'
                    name: state.settings.name || `${state.personal.firstName} vCard`,
                    data: state,
                    userId: user.id
                });
            }
        } catch (err) {
            console.error('Download failed:', err);
        }
    };

    // Helper for generating vCard content (for download button in preview)
    const generateVCardData = () => {
        // Simple VCF generation logic would go here
        // For now, this is just a placeholder action in the UI
        alert("Rehbere ekleme özelliği bu demoda simüle edilmiştir.");
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-800">
            <QrPageHeader
                title="vCard QR Kodu"
                icon={<Contact className="text-teal-600" />}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                onSave={handleSave}
                isSaving={isSaving}
                saveLabel="İndir"
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
                            <h2 className="text-lg font-bold mb-4">Dijital Kartvizitinizi oluşturun</h2>

                            {/* Personal Info */}
                            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                                <button
                                    onClick={() => toggleSection('personal')}
                                    className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-600">
                                            <User size={18} />
                                        </div>
                                        <div className="text-left">
                                            <span className="font-semibold block">Kişisel Bilgi</span>
                                            <span className="text-xs text-gray-500">Bilgilerinizi doldurun.</span>
                                        </div>
                                    </div>
                                    {expandedSection === 'personal' ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
                                </button>
                                {expandedSection === 'personal' && (
                                    <div className="p-4 border-t bg-gray-50 space-y-4">
                                        <div className="flex items-center gap-4">
                                            <div onClick={() => document.getElementById('photo-upload')?.click()} className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center cursor-pointer hover:bg-gray-200 transition relative overflow-hidden border-2 border-dashed border-gray-300">
                                                {state.personal.photo ? (
                                                    <img src={state.personal.photo} alt="Profile" className="w-full h-full object-cover" />
                                                ) : (
                                                    <CameraIcon />
                                                )}
                                                <input id="photo-upload" type="file" onChange={handlePhotoUpload} className="hidden" accept="image/*" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium">Profil Fotoğrafı</p>
                                                <p className="text-xs text-gray-500">Kare veya yuvarlak, max 2MB.</p>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Ad <span className="text-red-500">*</span></label>
                                                <input
                                                    type="text"
                                                    value={state.personal.firstName}
                                                    onChange={(e) => updateState('personal.firstName', e.target.value)}
                                                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                                                    placeholder="John"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Soyad</label>
                                                <input
                                                    type="text"
                                                    value={state.personal.lastName}
                                                    onChange={(e) => updateState('personal.lastName', e.target.value)}
                                                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                                                    placeholder="Doe"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Ünvan / Meslek</label>
                                            <input
                                                type="text"
                                                value={state.personal.title}
                                                onChange={(e) => updateState('personal.title', e.target.value)}
                                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                                                placeholder="Yazılım Geliştirici"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Hakkımda / Biyografi</label>
                                            <textarea
                                                value={state.personal.bio}
                                                onChange={(e) => updateState('personal.bio', e.target.value)}
                                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none h-20 text-sm"
                                                placeholder="Kendinizden kısaca bahsedin..."
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Contact Details */}
                            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                                <button
                                    onClick={() => toggleSection('contact')}
                                    className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                            <Phone size={18} />
                                        </div>
                                        <div className="text-left">
                                            <span className="font-semibold block">İletişim Detayları</span>
                                            <span className="text-xs text-gray-500">Telefon, e-posta ve website.</span>
                                        </div>
                                    </div>
                                    {expandedSection === 'contact' ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
                                </button>
                                {expandedSection === 'contact' && (
                                    <div className="p-4 border-t bg-gray-50 space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Cep Telefonu</label>
                                            <input
                                                type="tel"
                                                value={state.contact.mobile}
                                                onChange={(e) => updateState('contact.mobile', e.target.value)}
                                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                                                placeholder="+90 555 123 45 67"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">İş Telefonu</label>
                                            <input
                                                type="tel"
                                                value={state.contact.work}
                                                onChange={(e) => updateState('contact.work', e.target.value)}
                                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                                                placeholder="+90 212 123 45 67"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">E-posta</label>
                                            <input
                                                type="email"
                                                value={state.contact.email}
                                                onChange={(e) => updateState('contact.email', e.target.value)}
                                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                                                placeholder="ornek@sirket.com"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Web Sitesi</label>
                                            <input
                                                type="url"
                                                value={state.contact.website}
                                                onChange={(e) => updateState('contact.website', e.target.value)}
                                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                                                placeholder="https://www.sirketim.com"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Company Details */}
                            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                                <button
                                    onClick={() => toggleSection('company')}
                                    className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                                            <Building2 size={18} />
                                        </div>
                                        <div className="text-left">
                                            <span className="font-semibold block">Şirket Detayları</span>
                                            <span className="text-xs text-gray-500">Çalıştığınız kurum bilgileri.</span>
                                        </div>
                                    </div>
                                    {expandedSection === 'company' ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
                                </button>
                                {expandedSection === 'company' && (
                                    <div className="p-4 border-t bg-gray-50 space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Şirket Adı</label>
                                            <input
                                                type="text"
                                                value={state.company.name}
                                                onChange={(e) => updateState('company.name', e.target.value)}
                                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                                                placeholder="Acme Inc."
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Departman</label>
                                            <input
                                                type="text"
                                                value={state.company.department}
                                                onChange={(e) => updateState('company.department', e.target.value)}
                                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                                                placeholder="Pazarlama"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Location */}
                            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                                <button
                                    onClick={() => toggleSection('location')}
                                    className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                                            <MapPin size={18} />
                                        </div>
                                        <div className="text-left">
                                            <span className="font-semibold block">Konum</span>
                                            <span className="text-xs text-gray-500">Adres ve konum bilgileriniz.</span>
                                        </div>
                                    </div>
                                    {expandedSection === 'location' ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
                                </button>
                                {expandedSection === 'location' && (
                                    <div className="p-4 border-t bg-gray-50 space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Adres</label>
                                            <textarea
                                                value={state.location.address}
                                                onChange={(e) => updateState('location.address', e.target.value)}
                                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none h-20"
                                                placeholder="Mahalle, Cadde, No..."
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Şehir</label>
                                                <input
                                                    type="text"
                                                    value={state.location.city}
                                                    onChange={(e) => updateState('location.city', e.target.value)}
                                                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Ülke</label>
                                                <input
                                                    type="text"
                                                    value={state.location.country}
                                                    onChange={(e) => updateState('location.country', e.target.value)}
                                                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                                                />
                                            </div>
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
                                        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                                            <Palette size={18} />
                                        </div>
                                        <div className="text-left">
                                            <span className="font-semibold block">Tasarım</span>
                                            <span className="text-xs text-gray-500">Renk teması seçin.</span>
                                        </div>
                                    </div>
                                    {expandedSection === 'design' ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
                                </button>
                                {expandedSection === 'design' && (
                                    <div className="p-4 border-t bg-gray-50 space-y-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-800 mb-2">Tema Rengi</label>
                                            <div className="flex flex-wrap gap-2 mb-3">
                                                {[
                                                    '#0f393b', '#1e40af', '#b91c1c', '#047857',
                                                    '#6d28d9', '#be185d', '#111827', '#b45309'
                                                ].map((color) => (
                                                    <button
                                                        key={color}
                                                        onClick={() => updateState('design.themeColor', color)}
                                                        className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${state.design.themeColor === color ? 'border-gray-500 scale-110' : 'border-transparent'}`}
                                                        style={{ backgroundColor: color }}
                                                    >
                                                        {state.design.themeColor === color && <div className="w-2 h-2 bg-white rounded-full" />}
                                                    </button>
                                                ))}
                                            </div>
                                            <div className="flex items-center border border-gray-200 rounded-lg p-1 bg-white relative">
                                                <div className="w-6 h-6 rounded flex items-center justify-center shrink-0 mr-2" style={{ backgroundColor: state.design.themeColor }}></div>
                                                <span className="text-xs font-mono text-gray-500 flex-1">{state.design.themeColor}</span>
                                                <input
                                                    type="color"
                                                    value={state.design.themeColor}
                                                    onChange={(e) => updateState('design.themeColor', e.target.value)}
                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-bold text-gray-800 mb-2">Arkaplan Rengi</label>
                                                <div className="flex items-center border border-gray-200 rounded-lg p-1 bg-white relative">
                                                    <div className="w-6 h-6 rounded flex items-center justify-center shrink-0 mr-2 border" style={{ backgroundColor: state.design.bgColor }}></div>
                                                    <span className="text-xs font-mono text-gray-500 flex-1">{state.design.bgColor}</span>
                                                    <input
                                                        type="color"
                                                        value={state.design.bgColor}
                                                        onChange={(e) => updateState('design.bgColor', e.target.value)}
                                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-800 mb-2">Metin Rengi</label>
                                                <div className="flex items-center border border-gray-200 rounded-lg p-1 bg-white relative">
                                                    <div className="w-6 h-6 rounded flex items-center justify-center shrink-0 mr-2 border" style={{ backgroundColor: state.design.textColor }}></div>
                                                    <span className="text-xs font-mono text-gray-500 flex-1">{state.design.textColor}</span>
                                                    <input
                                                        type="color"
                                                        value={state.design.textColor}
                                                        onChange={(e) => updateState('design.textColor', e.target.value)}
                                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-800 mb-2">İkon Rengi</label>
                                                <div className="flex items-center border border-gray-200 rounded-lg p-1 bg-white relative">
                                                    <div className="w-6 h-6 rounded flex items-center justify-center shrink-0 mr-2 border" style={{ backgroundColor: state.design.iconColor }}></div>
                                                    <span className="text-xs font-mono text-gray-500 flex-1">{state.design.iconColor}</span>
                                                    <input
                                                        type="color"
                                                        value={state.design.iconColor}
                                                        onChange={(e) => updateState('design.iconColor', e.target.value)}
                                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-800 mb-2">Kart Arkaplanı</label>
                                                <div className="flex items-center border border-gray-200 rounded-lg p-1 bg-white relative">
                                                    <div className="w-6 h-6 rounded flex items-center justify-center shrink-0 mr-2 border" style={{ backgroundColor: state.design.cardBgColor }}></div>
                                                    <span className="text-xs font-mono text-gray-500 flex-1">{state.design.cardBgColor}</span>
                                                    <input
                                                        type="color"
                                                        value={state.design.cardBgColor}
                                                        onChange={(e) => updateState('design.cardBgColor', e.target.value)}
                                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-800 mb-2">Buton Arkaplanı</label>
                                                <div className="flex items-center border border-gray-200 rounded-lg p-1 bg-white relative">
                                                    <div className="w-6 h-6 rounded flex items-center justify-center shrink-0 mr-2 border" style={{ backgroundColor: state.design.buttonBgColor }}></div>
                                                    <span className="text-xs font-mono text-gray-500 flex-1">{state.design.buttonBgColor}</span>
                                                    <input
                                                        type="color"
                                                        value={state.design.buttonBgColor}
                                                        onChange={(e) => updateState('design.buttonBgColor', e.target.value)}
                                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                    />
                                                </div>
                                            </div>
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


                    <div className="w-[320px] h-[640px] bg-white rounded-[3rem] shadow-2xl border-8 border-gray-900 overflow-hidden relative font-sans flex flex-col" style={{ background: `linear-gradient(135deg, ${state.design.themeColor} 45%, ${state.design.bgColor} 45%)` }}>
                        <div className="w-full h-full overflow-y-auto flex flex-col relative" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                            <style jsx>{`
                                div::-webkit-scrollbar {
                                    display: none;
                                }
                            `}</style>

                            {/* Transparent Spacer for Header Area */}
                            <div className="w-full h-32 relative shrink-0 bg-transparent"></div>

                            {/* Profile Content */}
                            <div className="px-6 flex flex-col items-center relative z-10 -mt-20 pb-8">
                                {/* Photo */}
                                <div className="w-32 h-32 rounded-full border-4 border-white bg-white shadow-lg overflow-hidden shrink-0 mb-4">
                                    {state.personal.photo ? (
                                        <img src={state.personal.photo} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                                            <User size={48} />
                                        </div>
                                    )}
                                </div>

                                {/* Name & Title */}
                                <div className="text-center mb-6">
                                    <h2 className="text-2xl font-bold mb-1" style={{ color: state.design.themeColor }}>
                                        {state.personal.firstName || 'Ad'} {state.personal.lastName || 'Soyad'}
                                    </h2>
                                    {state.personal.title && (
                                        <p className="text-sm font-semibold uppercase tracking-wide" style={{ color: state.design.textColor, opacity: 0.8 }}>{state.personal.title}</p>
                                    )}
                                </div>

                                {/* Action Buttons Row (Circle) */}
                                <div className="flex justify-center gap-6 mb-8 w-full">
                                    {state.contact.mobile && (
                                        <a href={`tel:${state.contact.mobile}`} className="w-12 h-12 rounded-full shadow-md flex items-center justify-center hover:scale-110 transition-transform" style={{ backgroundColor: state.design.buttonBgColor, color: state.design.iconColor }}>
                                            <Phone size={20} />
                                        </a>
                                    )}
                                    {state.contact.email && (
                                        <a href={`mailto:${state.contact.email}`} className="w-12 h-12 rounded-full shadow-md flex items-center justify-center hover:scale-110 transition-transform" style={{ backgroundColor: state.design.buttonBgColor, color: state.design.iconColor }}>
                                            <Mail size={20} />
                                        </a>
                                    )}
                                    {state.location.address && (
                                        <a href="#" className="w-12 h-12 rounded-full shadow-md flex items-center justify-center hover:scale-110 transition-transform" style={{ backgroundColor: state.design.buttonBgColor, color: state.design.iconColor }}>
                                            <MapPin size={20} />
                                        </a>
                                    )}
                                </div>

                                {/* Bio */}
                                {(state.personal.bio) && (
                                    <div className="w-full mb-8 text-center px-2">
                                        <p className="text-sm leading-relaxed" style={{ color: state.design.textColor, opacity: 0.8 }}>
                                            {state.personal.bio}
                                        </p>
                                    </div>
                                )}

                                {/* Contact List */}
                                <div className="w-full space-y-4 mb-8">
                                    {state.contact.mobile && (
                                        <div className="flex items-center gap-4 p-2 rounded-xl" style={{ backgroundColor: state.design.cardBgColor }}>
                                            <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ color: state.design.iconColor, backgroundColor: state.design.themeColor + '20' }}>
                                                <Phone size={18} />
                                            </div>
                                            <div className="overflow-hidden border-b border-gray-100 flex-1 pb-2">
                                                <p className="text-xs mb-0.5" style={{ color: state.design.textColor, opacity: 0.5 }}>Telefon</p>
                                                <p className="text-sm font-medium" style={{ color: state.design.textColor }}>{state.contact.mobile}</p>
                                            </div>
                                        </div>
                                    )}
                                    {state.contact.email && (
                                        <div className="flex items-center gap-4 p-2 rounded-xl" style={{ backgroundColor: state.design.cardBgColor }}>
                                            <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ color: state.design.iconColor, backgroundColor: state.design.themeColor + '20' }}>
                                                <Mail size={18} />
                                            </div>
                                            <div className="overflow-hidden border-b border-gray-100 flex-1 pb-2">
                                                <p className="text-xs mb-0.5" style={{ color: state.design.textColor, opacity: 0.5 }}>E-posta</p>
                                                <p className="text-sm font-medium" style={{ color: state.design.textColor }}>{state.contact.email}</p>
                                            </div>
                                        </div>
                                    )}
                                    {state.contact.website && (
                                        <div className="flex items-center gap-4 p-2 rounded-xl" style={{ backgroundColor: state.design.cardBgColor }}>
                                            <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ color: state.design.iconColor, backgroundColor: state.design.themeColor + '20' }}>
                                                <Globe size={18} />
                                            </div>
                                            <div className="overflow-hidden border-b border-gray-100 flex-1 pb-2">
                                                <p className="text-xs mb-0.5" style={{ color: state.design.textColor, opacity: 0.5 }}>İnternet sitesi</p>
                                                <p className="text-sm font-medium" style={{ color: state.design.textColor }}>{state.contact.website.replace(/^https?:\/\//, '')}</p>
                                            </div>
                                        </div>
                                    )}
                                    {state.location.address && (
                                        <div className="flex items-center gap-4 p-2 rounded-xl" style={{ backgroundColor: state.design.cardBgColor }}>
                                            <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ color: state.design.iconColor, backgroundColor: state.design.themeColor + '20' }}>
                                                <MapPin size={18} />
                                            </div>
                                            <div className="overflow-hidden border-b border-gray-100 flex-1 pb-2">
                                                <p className="text-xs mb-0.5" style={{ color: state.design.textColor, opacity: 0.5 }}>Konum</p>
                                                <p className="text-sm font-medium leading-snug" style={{ color: state.design.textColor }}>{state.location.address}</p>
                                                <div className="mt-2">
                                                    <a href={state.location.mapUrl || "https://www.google.com/maps"} target="_blank" rel="noopener noreferrer" className="inline-block px-3 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-600 hover:bg-gray-200 transition-colors">Haritada Göster</a>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    {state.company.name && (
                                        <div className="flex items-center gap-4 p-2 rounded-xl" style={{ backgroundColor: state.design.cardBgColor }}>
                                            <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ color: state.design.iconColor, backgroundColor: state.design.themeColor + '20' }}>
                                                <Briefcase size={18} />
                                            </div>
                                            <div className="overflow-hidden border-b border-gray-100 flex-1 pb-2">
                                                <p className="text-xs mb-0.5" style={{ color: state.design.textColor, opacity: 0.5 }}>Şirket adı</p>
                                                <p className="text-sm font-medium" style={{ color: state.design.textColor }}>{state.company.name}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Social Follow */}
                                <div className="w-full mb-6">
                                    <h3 className="text-lg font-medium mb-4 px-2" style={{ color: state.design.textColor }}>Beni takip edin</h3>
                                    <div className="space-y-3">
                                        {state.socials.linkedin && (
                                            <div className="flex items-center justify-between p-3 rounded-xl" style={{ backgroundColor: state.design.cardBgColor }}>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white" style={{ backgroundColor: '#0077b5' }}><Linkedin size={20} /></div>
                                                    <div>
                                                        <p className="text-sm font-bold" style={{ color: state.design.textColor }}>LinkedIn</p>
                                                        <p className="text-xs text-gray-500">Sosyal Hesap</p>
                                                    </div>
                                                </div>
                                                <ArrowRight size={16} style={{ color: state.design.iconColor, opacity: 0.5 }} />
                                            </div>
                                        )}
                                        {/* Demo Social Card for specific "Erashu" Request */}
                                        {state.socials.facebook && (
                                            <div className="flex items-center justify-between p-3 rounded-xl" style={{ backgroundColor: state.design.cardBgColor }}>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white" style={{ backgroundColor: '#1877F2' }}><Facebook size={20} /></div>
                                                    <div>
                                                        <p className="text-sm font-bold" style={{ color: state.design.textColor }}>Facebook</p>
                                                        <p className="text-xs text-gray-500">Sosyal Hesap</p>
                                                    </div>
                                                </div>
                                                <ArrowRight size={16} style={{ color: state.design.iconColor, opacity: 0.5 }} />
                                            </div>
                                        )}
                                        {/* Instagram is usually key for creators */}
                                        {state.socials.instagram && (
                                            <div className="flex items-center justify-between p-3 rounded-xl" style={{ backgroundColor: state.design.cardBgColor }}>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white" style={{ backgroundColor: '#E4405F' }}><Instagram size={20} /></div>
                                                    <div>
                                                        <p className="text-sm font-bold" style={{ color: state.design.textColor }}>Instagram</p>
                                                        <p className="text-xs text-gray-500">Sosyal Hesap</p>
                                                    </div>
                                                </div>
                                                <ArrowRight size={16} style={{ color: state.design.iconColor, opacity: 0.5 }} />
                                            </div>
                                        )}
                                        {/* Manual addition to match image vibe if needed, but sticking to state */}
                                    </div>
                                </div>

                                {/* Add Contact Button (Moved from Sticky Bottom) */}
                                <div className="w-full mb-8 px-2">
                                    <button
                                        onClick={generateVCardData}
                                        className="w-full py-3.5 rounded-xl text-white font-bold text-base shadow-lg transform transition active:scale-95 flex items-center justify-center gap-2"
                                        style={{ backgroundColor: state.design.themeColor }}
                                    >
                                        <User size={18} />
                                        Kişi Ekle
                                    </button>
                                </div>

                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    );
}

function ContactItem({ icon, label, value, truncate }: { icon: any, label: string, value: string, truncate?: boolean }) {
    return (
        <div className="flex items-center gap-3 bg-white p-2.5 rounded-lg border border-gray-100 shadow-sm">
            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 shrink-0">
                {icon}
            </div>
            <div className="overflow-hidden">
                <p className="text-[10px] text-gray-400 font-medium uppercase">{label}</p>
                <p className={`text-sm text-gray-800 font-medium ${truncate ? 'truncate' : ''}`}>{value}</p>
            </div>
        </div>
    );
}

function CameraIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" /><circle cx="12" cy="13" r="3" /></svg>
    )
}
