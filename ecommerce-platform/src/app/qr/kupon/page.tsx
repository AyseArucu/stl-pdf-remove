
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import {
    ChevronLeft,
    ArrowRight,
    Palette,
    Tag,
    Type,
    Image as ImageIcon,
    QrCode,
    Lock,
    ChevronRight,
    Info,
    Share2,
    ChevronDown,
    Download,
    Smartphone,
    Trash2
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
import CustomQRCode from '@/components/CustomQRCode';
import CouponTemplate from '@/components/qr/CouponTemplate';
import FrameRenderer, { QrDesignState } from '@/components/qr/FrameRenderer';
import QRCodeDesignControl from '@/components/qr/QRCodeDesignControl';

import html2canvas from 'html2canvas';

// --- Font Configurations ---
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

// --- Types ---
interface DesignState {
    primaryColor: string;
    backgroundColor: string;
    textColor: string;
    heroImage?: string | null;
    // Extended Colors
    headerTextColor?: string;
    heroTitleColor?: string;
    badgeBgColor?: string;
    badgeTextColor?: string;
    couponBorderColor?: string;
    couponLabelColor?: string;
    couponCodeColor?: string;
    buttonBgColor?: string;
    buttonTextColor?: string;
    footerTextColor?: string;
    titleFontId: string;
    textFontId: string;
}

interface OfferState {
    companyName: string;
    title: string;
    description: string;
}

interface CouponState {
    discount: string;
    code: string;
    buttonText: string;
}

interface MetaState {
    qrName: string;
    isPasswordEnabled: boolean;
    password?: string;
}

export default function CouponQRPage() {
    // --- State ---
    const router = useRouter();
    const { user } = useUser();
    const qrRef = React.useRef<HTMLDivElement>(null);
    const [createdQr, setCreatedQr] = useState<{ id: string, url: string } | null>(null);
    const [shouldAutoSave, setShouldAutoSave] = useState(false);

    // --- EFFECT: Restore State & Trigger Auto-Save ---
    useEffect(() => {
        const pending = localStorage.getItem('pendingQrDesign');
        if (pending && user) {
            try {
                const data = JSON.parse(pending);
                if (data.type === 'coupon') {
                    setDesign(data.state.design);
                    setQrDesign(data.state.qrDesign);
                    setOffer(data.state.offer);
                    setCoupon(data.state.coupon);
                    setMeta(data.state.meta);
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
                handleCreateQr(true);
                setShouldAutoSave(false);
            }, 800);
            return () => clearTimeout(timer);
        }
    }, [shouldAutoSave]);

    const handleCreateQr = async (isAutoAction = false) => {
        if (!isAutoAction && !user) {
            const stateToSave = {
                type: 'coupon',
                state: {
                    design,
                    qrDesign,
                    offer,
                    coupon,
                    meta
                }
            };
            localStorage.setItem('pendingQrDesign', JSON.stringify(stateToSave));
            router.push(`/login?callbackUrl=${encodeURIComponent('/qr/kupon')}`);
            return;
        }

        const targetUrl = 'https://example.com/coupon';
        const password = meta.isPasswordEnabled && meta.password ? meta.password : undefined;

        const designData = JSON.stringify({
            type: 'coupon',
            design,
            offer,
            coupon
        });

        try {
            // Use API Route instead of Server Action
            const response = await fetch('/api/qr/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    targetUrl,
                    name: offer.title || 'Kupon QR',
                    password: password || undefined,
                    design: designData,
                    // Include QrDesign in payload
                    qrDesign: JSON.stringify(qrDesign)
                }),
            });

            const result = await response.json();

            if (response.ok && result.success) {
                // Show Modal instead of Redirect
                setCreatedQr({
                    id: result.id,
                    url: result.shortUrl // Assuming API returns this
                });
            } else {
                alert('Hata: ' + (result.error || 'Oluşturulamadı'));
            }
        } catch (error) {
            console.error('Create error:', error);
            alert('Bir hata oluştu.');
        }
    };

    const [design, setDesign] = useState<DesignState>({
        primaryColor: '#6366f1',
        backgroundColor: '#ffffff',
        textColor: '#1f2937',
        heroImage: null,
        headerTextColor: '#ffffff',
        heroTitleColor: '#ffffff',
        badgeBgColor: '#a7f3d0',
        badgeTextColor: '#065f46',
        couponBorderColor: '#d1d5db',
        couponLabelColor: '#9ca3af',
        couponCodeColor: '#1f2937',
        buttonTextColor: '#064e3b',
        footerTextColor: '#9ca3af',
        titleFontId: 'inter',
        textFontId: 'inter'
    });

    const [qrDesign, setQrDesign] = useState<QrDesignState>({
        frame: 'none',
        frameLabel: 'Scan Me!',
        pattern: 'square',
        cornerStyle: 'square',
        cornerColor: '',
        logo: null,
        fgColor: '#000000',
        bgColor: '#ffffff',
        gradient: {
            enabled: false,
            start: '#000000',
            end: '#ff0000'
        }
    });

    const [offer, setOffer] = useState<OfferState>({
        companyName: '',
        title: '',
        description: ''
    });

    const [coupon, setCoupon] = useState<CouponState>({
        discount: '',
        code: '',
        buttonText: ''
    });

    const [meta, setMeta] = useState<MetaState>({
        qrName: '',
        isPasswordEnabled: false,
        password: ''
    });

    const [activeFontSection, setActiveFontSection] = useState<'title' | 'text' | null>('title');

    // UI State for Accordion
    const [activeSection, setActiveSection] = useState<string | null>('design');
    // UI State for Color Sub-Accordion
    const [activeColorSection, setActiveColorSection] = useState<'general' | 'header' | 'coupon' | null>('general');
    // Preview Tab State
    const [previewTab, setPreviewTab] = useState<'page' | 'qr'>('page');

    const toggleSection = (id: string) => {
        setActiveSection(activeSection === id ? null : id);
    };

    const getFontClass = (fontId: string) => {
        const font = FONTS.find(f => f.id === fontId);
        return font ? font.font.className : inter.className;
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <div className="flex-1 flex flex-col lg:flex-row">
                <div className="w-full lg:w-1/2 p-4 lg:p-8 space-y-4 overflow-y-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    <style jsx>{`
                        div::-webkit-scrollbar {
                            display: none;
                        }
                    `}</style>
                    {/* Design Card */}
                    <div className={`bg-white rounded-xl shadow-sm border ${activeSection === 'design' ? 'border-indigo-500 ring-1 ring-indigo-500' : 'border-gray-200'} overflow-hidden transition-all text-left`}>
                        <button
                            onClick={() => toggleSection('design')}
                            className="w-full p-5 flex items-center justify-between hover:bg-gray-50 transition-colors"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-500 flex items-center justify-center">
                                    <Palette size={20} />
                                </div>
                                <div className="text-left">
                                    <h3 className="font-bold text-gray-900">Tasarım</h3>
                                    <p className="text-xs text-gray-500">Renkleri ve temayı özelleştirin.</p>
                                </div>
                            </div>
                            {activeSection === 'design' ? <ChevronDown className="text-gray-400" /> : <ChevronRight className="text-gray-400" />}
                        </button>

                        {
                            activeSection === 'design' && (
                                <div className="p-5 border-t border-gray-100 bg-gray-50/50 space-y-4 animate-in fade-in slide-in-from-top-2">

                                    {/* 1. General Colors (Default Open) */}
                                    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                                        <button
                                            onClick={() => setActiveColorSection(activeColorSection === 'general' ? null : 'general')}
                                            className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors"
                                        >
                                            <span className="text-sm font-bold text-gray-700">Genel Renkler</span>
                                            {activeColorSection === 'general' ? <ChevronDown size={16} className="text-gray-400" /> : <ChevronRight size={16} className="text-gray-400" />}
                                        </button>

                                        {activeColorSection === 'general' && (
                                            <div className="p-3 border-t border-gray-100 grid grid-cols-1 gap-3 animate-in fade-in slide-in-from-top-1">
                                                <div>
                                                    <label className="block text-xs font-bold text-gray-700 mb-2">Ana Renk (Primary)</label>
                                                    <div className="flex items-center gap-3">
                                                        <input type="color" value={design.primaryColor} onChange={(e) => setDesign({ ...design, primaryColor: e.target.value })} className="w-8 h-8 rounded-lg border cursor-pointer p-0" />
                                                        <span className="text-xs font-mono text-gray-500">{design.primaryColor}</span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-gray-700 mb-2">Arka Plan Rengi</label>
                                                    <div className="flex items-center gap-3">
                                                        <input type="color" value={design.backgroundColor} onChange={(e) => setDesign({ ...design, backgroundColor: e.target.value })} className="w-8 h-8 rounded-lg border cursor-pointer p-0" />
                                                        <span className="text-xs font-mono text-gray-500">{design.backgroundColor}</span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-gray-700 mb-2">Metin Rengi</label>
                                                    <div className="flex items-center gap-3">
                                                        <input type="color" value={design.textColor} onChange={(e) => setDesign({ ...design, textColor: e.target.value })} className="w-8 h-8 rounded-lg border cursor-pointer p-0" />
                                                        <span className="text-xs font-mono text-gray-500">{design.textColor}</span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-gray-700 mb-2">Alt Bilgi Rengi</label>
                                                    <div className="flex items-center gap-3">
                                                        <input type="color" value={design.footerTextColor} onChange={(e) => setDesign({ ...design, footerTextColor: e.target.value })} className="w-8 h-8 rounded-lg border cursor-pointer p-0" />
                                                        <span className="text-xs font-mono text-gray-500">{design.footerTextColor}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* 2. Header & Hero Colors */}
                                    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                                        <button
                                            onClick={() => setActiveColorSection(activeColorSection === 'header' ? null : 'header')}
                                            className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors"
                                        >
                                            <span className="text-sm font-bold text-gray-700">Başlık ve Görsel</span>
                                            {activeColorSection === 'header' ? <ChevronDown size={16} className="text-gray-400" /> : <ChevronRight size={16} className="text-gray-400" />}
                                        </button>

                                        {activeColorSection === 'header' && (
                                            <div className="p-3 border-t border-gray-100 grid grid-cols-1 gap-3 animate-in fade-in slide-in-from-top-1">
                                                <div>
                                                    <label className="block text-xs font-bold text-gray-700 mb-2">Başlık Metin Rengi</label>
                                                    <div className="flex items-center gap-3">
                                                        <input type="color" value={design.headerTextColor} onChange={(e) => setDesign({ ...design, headerTextColor: e.target.value })} className="w-8 h-8 rounded-lg border cursor-pointer p-0" />
                                                        <span className="text-xs font-mono text-gray-500">{design.headerTextColor}</span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-gray-700 mb-2">Hero Başlık Rengi</label>
                                                    <div className="flex items-center gap-3">
                                                        <input type="color" value={design.heroTitleColor} onChange={(e) => setDesign({ ...design, heroTitleColor: e.target.value })} className="w-8 h-8 rounded-lg border cursor-pointer p-0" />
                                                        <span className="text-xs font-mono text-gray-500">{design.heroTitleColor}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* 3. Coupon Card Colors */}
                                    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                                        <button
                                            onClick={() => setActiveColorSection(activeColorSection === 'coupon' ? null : 'coupon')}
                                            className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors"
                                        >
                                            <span className="text-sm font-bold text-gray-700">Kupon Kartı Detayları</span>
                                            {activeColorSection === 'coupon' ? <ChevronDown size={16} className="text-gray-400" /> : <ChevronRight size={16} className="text-gray-400" />}
                                        </button>

                                        {activeColorSection === 'coupon' && (
                                            <div className="p-3 border-t border-gray-100 grid grid-cols-1 gap-3 animate-in fade-in slide-in-from-top-1">
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div>
                                                        <label className="block text-[10px] font-bold text-gray-500 mb-1">Etiket Arka Plan</label>
                                                        <div className="flex items-center gap-2">
                                                            <input type="color" value={design.badgeBgColor} onChange={(e) => setDesign({ ...design, badgeBgColor: e.target.value })} className="w-6 h-6 rounded border cursor-pointer p-0" />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <label className="block text-[10px] font-bold text-gray-500 mb-1">Etiket Metin</label>
                                                        <div className="flex items-center gap-2">
                                                            <input type="color" value={design.badgeTextColor} onChange={(e) => setDesign({ ...design, badgeTextColor: e.target.value })} className="w-6 h-6 rounded border cursor-pointer p-0" />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-3 border-t border-dashed pt-2">
                                                    <div>
                                                        <label className="block text-[10px] font-bold text-gray-500 mb-1">Kupon Kenarlık</label>
                                                        <div className="flex items-center gap-2">
                                                            <input type="color" value={design.couponBorderColor} onChange={(e) => setDesign({ ...design, couponBorderColor: e.target.value })} className="w-6 h-6 rounded border cursor-pointer p-0" />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <label className="block text-[10px] font-bold text-gray-500 mb-1">Etiket Rengi</label>
                                                        <div className="flex items-center gap-2">
                                                            <input type="color" value={design.couponLabelColor} onChange={(e) => setDesign({ ...design, couponLabelColor: e.target.value })} className="w-6 h-6 rounded border cursor-pointer p-0" />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <label className="block text-[10px] font-bold text-gray-500 mb-1">Kupon Kodu</label>
                                                        <div className="flex items-center gap-2">
                                                            <input type="color" value={design.couponCodeColor} onChange={(e) => setDesign({ ...design, couponCodeColor: e.target.value })} className="w-6 h-6 rounded border cursor-pointer p-0" />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-3 border-t border-dashed pt-2">
                                                    <div>
                                                        <label className="block text-[10px] font-bold text-gray-500 mb-1">Buton Arka Plan</label>
                                                        <div className="flex items-center gap-2">
                                                            <input type="color" value={design.buttonBgColor} onChange={(e) => setDesign({ ...design, buttonBgColor: e.target.value })} className="w-6 h-6 rounded border cursor-pointer p-0" />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <label className="block text-[10px] font-bold text-gray-500 mb-1">Buton Metin</label>
                                                        <div className="flex items-center gap-2">
                                                            <input type="color" value={design.buttonTextColor} onChange={(e) => setDesign({ ...design, buttonTextColor: e.target.value })} className="w-6 h-6 rounded border cursor-pointer p-0" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                </div>
                            )
                        }
                    </div >

                    {/* Offer Info Card */}
                    < div className={`bg-white rounded-xl shadow-sm border ${activeSection === 'offer' ? 'border-indigo-500 ring-1 ring-indigo-500' : 'border-gray-200'} overflow-hidden transition-all`}>
                        <button
                            onClick={() => toggleSection('offer')}
                            className="w-full p-5 flex items-center justify-between hover:bg-gray-50 transition-colors"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-pink-50 text-pink-500 flex items-center justify-center">
                                    <Tag size={20} />
                                </div>
                                <div className="text-left">
                                    <h3 className="font-bold text-gray-900">Teklif Bilgileri</h3>
                                    <p className="text-xs text-gray-500">Şirketiniz hakkında bilgi verin.</p>
                                </div>
                            </div>
                            {activeSection === 'offer' ? <ChevronDown className="text-gray-400" /> : <ChevronRight className="text-gray-400" />}
                        </button>

                        {
                            activeSection === 'offer' && (
                                <div className="p-5 border-t border-gray-100 bg-gray-50/50 space-y-4 animate-in fade-in slide-in-from-top-2">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 mb-2">Şirket Adı</label>
                                        <input
                                            type="text"
                                            value={offer.companyName}
                                            onChange={(e) => setOffer({ ...offer, companyName: e.target.value })}
                                            className="w-full p-3 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                            placeholder="Örn: Erashu Store"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 mb-2">Kampanya Başlığı</label>
                                        <input
                                            type="text"
                                            value={offer.title}
                                            onChange={(e) => setOffer({ ...offer, title: e.target.value })}
                                            className="w-full p-3 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                            placeholder="Örn: YAZ İNDİRİMİ"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 mb-2">Açıklama</label>
                                        <textarea
                                            value={offer.description}
                                            onChange={(e) => setOffer({ ...offer, description: e.target.value })}
                                            className="w-full p-3 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none h-24 resize-none"
                                            placeholder="Kampanya detaylarını giriniz..."
                                        />
                                    </div>
                                </div>
                            )
                        }
                    </div >

                    {/* Coupon Info Card */}
                    < div className={`bg-white rounded-xl shadow-sm border ${activeSection === 'coupon' ? 'border-indigo-500 ring-1 ring-indigo-500' : 'border-gray-200'} overflow-hidden transition-all`}>
                        <button
                            onClick={() => toggleSection('coupon')}
                            className="w-full p-5 flex items-center justify-between hover:bg-gray-50 transition-colors"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center">
                                    <Info size={20} />
                                </div>
                                <div className="text-left">
                                    <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                        Kupon Bilgileri
                                        <span className="text-red-500">*</span>
                                    </h3>
                                    <p className="text-xs text-gray-500">Bu kupon hakkında bilgi verin.</p>
                                </div>
                            </div>
                            {activeSection === 'coupon' ? <ChevronDown className="text-gray-400" /> : <ChevronRight className="text-gray-400" />}
                        </button>

                        {
                            activeSection === 'coupon' && (
                                <div className="p-5 border-t border-gray-100 bg-gray-50/50 space-y-4 animate-in fade-in slide-in-from-top-2">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 mb-2">Kupon İndirim Metni</label>
                                        <input
                                            type="text"
                                            value={coupon.discount}
                                            onChange={(e) => setCoupon({ ...coupon, discount: e.target.value })}
                                            className="w-full p-3 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                            placeholder="Örn: %25 İNDİRİM"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 mb-2">Kupon Kodu</label>
                                        <input
                                            type="text"
                                            value={coupon.code}
                                            onChange={(e) => setCoupon({ ...coupon, code: e.target.value })}
                                            className="w-full p-3 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none font-mono uppercase"
                                            placeholder="Örn: YAZ2024"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 mb-2">Buton Metni</label>
                                        <input
                                            type="text"
                                            value={coupon.buttonText}
                                            onChange={(e) => setCoupon({ ...coupon, buttonText: e.target.value })}
                                            className="w-full p-3 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                            placeholder="Örn: KUPON AL"
                                        />
                                    </div>
                                </div>
                            )
                        }
                    </div >

                    {/* Fonts Card */}
                    < div className={`bg-white rounded-xl shadow-sm border ${activeSection === 'fonts' ? 'border-indigo-500 ring-1 ring-indigo-500' : 'border-gray-200'} overflow-hidden transition-all`}>
                        <button
                            onClick={() => toggleSection('fonts')}
                            className="w-full p-5 flex items-center justify-between hover:bg-gray-50 transition-colors"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center">
                                    <Type size={20} />
                                </div>
                                <div className="text-left">
                                    <h3 className="font-bold text-gray-900">Yazı Tipleri</h3>
                                    <p className="text-xs text-gray-500">Orijinal yazı tipleriyle sayfanızı benzersiz kılın.</p>
                                </div>
                            </div>
                            {activeSection === 'fonts' ? <ChevronDown className="text-gray-400" /> : <ChevronRight className="text-gray-400" />}
                        </button>
                        {
                            activeSection === 'fonts' && (
                                <div className="p-5 border-t border-gray-100 bg-gray-50/50 space-y-4 animate-in fade-in slide-in-from-top-2">
                                    {/* Title Font Selection - Collapsible */}
                                    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                                        <button
                                            onClick={() => setActiveFontSection(activeFontSection === 'title' ? null : 'title')}
                                            className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors"
                                        >
                                            <span className="text-sm font-bold text-gray-700">Başlık Yazı Tipi</span>
                                            {activeFontSection === 'title' ? <ChevronDown size={16} className="text-gray-400" /> : <ChevronRight size={16} className="text-gray-400" />}
                                        </button>

                                        {activeFontSection === 'title' && (
                                            <div className="p-3 border-t border-gray-100 grid grid-cols-2 gap-2 animate-in fade-in slide-in-from-top-1">
                                                {FONTS.map((font) => (
                                                    <button
                                                        key={`title-${font.id}`}
                                                        onClick={() => setDesign({ ...design, titleFontId: font.id })}
                                                        className={`p-3 rounded-lg border text-sm text-center transition-all ${design.titleFontId === font.id
                                                            ? 'border-indigo-500 bg-indigo-50 text-indigo-700 ring-1 ring-indigo-500'
                                                            : 'border-gray-200 hover:border-gray-300 text-gray-600'
                                                            }`}
                                                    >
                                                        <span className={font.font.className}>{font.name}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Text Font Selection - Collapsible */}
                                    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                                        <button
                                            onClick={() => setActiveFontSection(activeFontSection === 'text' ? null : 'text')}
                                            className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors"
                                        >
                                            <span className="text-sm font-bold text-gray-700">Metin Yazı Tipi</span>
                                            {activeFontSection === 'text' ? <ChevronDown size={16} className="text-gray-400" /> : <ChevronRight size={16} className="text-gray-400" />}
                                        </button>

                                        {activeFontSection === 'text' && (
                                            <div className="p-3 border-t border-gray-100 grid grid-cols-2 gap-2 animate-in fade-in slide-in-from-top-1">
                                                {FONTS.map((font) => (
                                                    <button
                                                        key={`text-${font.id}`}
                                                        onClick={() => setDesign({ ...design, textFontId: font.id })}
                                                        className={`p-3 rounded-lg border text-sm text-center transition-all ${design.textFontId === font.id
                                                            ? 'border-indigo-500 bg-indigo-50 text-indigo-700 ring-1 ring-indigo-500'
                                                            : 'border-gray-200 hover:border-gray-300 text-gray-600'
                                                            }`}
                                                    >
                                                        <span className={font.font.className}>{font.name}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )
                        }
                    </div>

                    {/* QR Design Card - NEW */}
                    <div className={`bg-white rounded-xl shadow-sm border ${activeSection === 'qr-design' ? 'border-indigo-500 ring-1 ring-indigo-500' : 'border-gray-200'} overflow-hidden transition-all text-left`}>
                        <button
                            onClick={() => toggleSection('qr-design')}
                            className="w-full p-5 flex items-center justify-between hover:bg-gray-50 transition-colors"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
                                    <QrCode size={20} />
                                </div>
                                <div className="text-left">
                                    <h3 className="font-bold text-gray-900">QR Kod Tasarımı</h3>
                                    <p className="text-xs text-gray-500">Logo, desen ve renkleri düzenleyin.</p>
                                </div>
                            </div>
                            {activeSection === 'qr-design' ? <ChevronDown className="text-gray-400" /> : <ChevronRight className="text-gray-400" />}
                        </button>

                        {activeSection === 'qr-design' && (
                            <div className="p-5 border-t border-gray-100 bg-gray-50/50 space-y-4 animate-in fade-in slide-in-from-top-2">
                                <QRCodeDesignControl design={qrDesign} onChange={setQrDesign} />
                                {/* Preview in Accordion */}
                                <div className="mt-4 p-4 bg-white rounded-xl border border-gray-200 flex justify-center">
                                    <FrameRenderer
                                        frameId={qrDesign.frame}
                                        currentDesign={qrDesign}
                                        size={160}
                                        value="https://example.com/preview"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Splash Screen Card */}


                    {/* QR Name Card */}
                    < div className={`bg-white rounded-xl shadow-sm border ${activeSection === 'meta' ? 'border-indigo-500 ring-1 ring-indigo-500' : 'border-gray-200'} overflow-hidden transition-all`}>
                        <button
                            onClick={() => toggleSection('meta')}
                            className="w-full p-5 flex items-center justify-between hover:bg-gray-50 transition-colors"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-gray-50 text-gray-500 flex items-center justify-center">
                                    <QrCode size={20} />
                                </div>
                                <div className="text-left">
                                    <h3 className="font-bold text-gray-900">QR Kodun Adı</h3>
                                    <p className="text-xs text-gray-500">QR kodunuza bir isim verin.</p>
                                </div>
                            </div>
                            {activeSection === 'meta' ? <ChevronDown className="text-gray-400" /> : <ChevronRight className="text-gray-400" />}
                        </button>

                        {
                            activeSection === 'meta' && (
                                <div className="p-5 border-t border-gray-100 bg-gray-50/50 space-y-4 animate-in fade-in slide-in-from-top-2">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 mb-2">QR İsim</label>
                                        <input
                                            type="text"
                                            value={meta.qrName}
                                            onChange={(e) => setMeta({ ...meta, qrName: e.target.value })}
                                            className="w-full p-3 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                            placeholder="Kupon Kampanyam"
                                        />
                                    </div>
                                </div>
                            )
                        }
                    </div >

                    {/* Password Card */}
                    < div className={`bg-white rounded-xl shadow-sm border ${activeSection === 'password' ? 'border-indigo-500 ring-1 ring-indigo-500' : 'border-gray-200'} overflow-hidden transition-all`}>
                        <button
                            onClick={() => toggleSection('password')}
                            className="w-full p-5 flex items-center justify-between hover:bg-gray-50 transition-colors"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-gray-50 text-gray-500 flex items-center justify-center">
                                    <Lock size={20} />
                                </div>
                                <div className="text-left">
                                    <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                        Şifre
                                        <Info size={14} className="text-gray-400" />
                                    </h3>
                                </div>
                            </div>
                            {activeSection === 'password' ? <ChevronDown className="text-gray-400" /> : <ChevronRight className="text-gray-400" />}
                        </button>

                        {
                            activeSection === 'password' && (
                                <div className="p-5 border-t border-gray-100 bg-gray-50/50 space-y-4 animate-in fade-in slide-in-from-top-2">
                                    <div className="flex items-center justify-between">
                                        <label className="text-sm font-medium text-gray-700">Şifre Korumasını Etkinleştir</label>
                                        <button
                                            onClick={() => setMeta({ ...meta, isPasswordEnabled: !meta.isPasswordEnabled })}
                                            className={`w-11 h-6 flex items-center rounded-full transition-colors duration-200 ease-in-out ${meta.isPasswordEnabled ? 'bg-indigo-600' : 'bg-gray-200'}`}
                                        >
                                            <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${meta.isPasswordEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                                        </button>
                                    </div>

                                    {meta.isPasswordEnabled && (
                                        <div>
                                            <label className="block text-xs font-bold text-gray-700 mb-2">Şifre</label>
                                            <input
                                                type="text"
                                                value={meta.password || ''}
                                                onChange={(e) => setMeta({ ...meta, password: e.target.value })}
                                                className="w-full p-3 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none font-mono"
                                                placeholder="Şifrenizi girin"
                                            />
                                            <p className="text-xs text-gray-400 mt-1">Bu QR kodu tarayan kullanıcılar, içeriği görmek için bu şifreyi girmek zorunda kalacaklar.</p>
                                        </div>
                                    )}
                                </div>
                            )
                        }
                    </div >

                </div >

                {/* RIGHT PANEL: Live Preview (Sticky) */}
                <div className="hidden lg:flex flex-col w-1/2 bg-gray-100 items-center p-8 gap-4 h-[calc(100vh-64px)] sticky top-0 overflow-hidden">

                    {/* Tabs */}
                    <div className="bg-white rounded-xl p-1 shadow-sm border border-gray-200 flex w-[340px]">
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

                    {/* 1. Page Preview (Phone Mockup) */}
                    {previewTab === 'page' && (
                        <div className="relative w-[340px] h-[680px] bg-gray-900 rounded-[50px] shadow-2xl border-[8px] border-gray-900 overflow-hidden ring-4 ring-gray-200/50 animate-in fade-in zoom-in-95 duration-200">
                            {/* Dynamic Island / Notch */}
                            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-7 bg-black rounded-b-3xl z-30"></div>

                            {/* UI Header Mock */}
                            <div className="h-12 bg-white flex items-center justify-between px-6 pt-2 z-20 relative text-xs font-semibold text-black">
                                <span>9:41</span>
                                <div className="flex gap-1.5">
                                    <div className="w-4 h-2.5 bg-black rounded-sm"></div>
                                    <div className="w-3 h-2.5 bg-black rounded-sm"></div>
                                </div>
                            </div>

                            <CouponTemplate
                                design={design}
                                offer={offer}
                                coupon={coupon}
                                titleFontClass={getFontClass(design.titleFontId)}
                                textFontClass={getFontClass(design.textFontId)}
                            />

                            {/* Home Indicator */}
                            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gray-800 rounded-full z-30"></div>
                        </div>
                    )}

                    {/* 2. QR Preview */}
                    {previewTab === 'qr' && (
                        <div className="bg-white rounded-[32px] p-8 w-[340px] h-auto shadow-2xl border border-gray-200 flex flex-col items-center justify-center gap-8 animate-in fade-in slide-in-from-right-4">
                            <div className="text-center space-y-2">
                                <h3 className="text-xl font-bold text-gray-800">QR Kod Önizleme</h3>
                                <p className="text-sm text-gray-500">Tasarımınız anlık olarak güncellenir.</p>
                            </div>

                            <div className="scale-110 p-4 border rounded-xl bg-gray-50">
                                <FrameRenderer
                                    frameId={qrDesign.frame}
                                    currentDesign={qrDesign}
                                    value="https://example.com"
                                    size={200}
                                />
                            </div>

                            <div className="text-xs text-center text-gray-400 max-w-xs">
                                Not: Bu sadece bir önizlemedir. Gerçek QR kodunuz kütüphanenizde saklanacaktır.
                            </div>
                        </div>
                    )}

                </div>

            </div >

            {/* 3. Bottom Navigation Bar (Sticky Footer) */}
            < div className="border-t border-gray-200 bg-white p-4 sticky bottom-0 z-40" >
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <Link
                        href="/qr"
                        className="px-6 py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition-colors flex items-center gap-2"
                    >
                        <ChevronLeft size={20} />
                        QR Türleri
                    </Link>

                    <button
                        onClick={() => handleCreateQr()}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-indigo-200 transition-all transform hover:scale-105 flex items-center gap-2"
                    >
                        <Download size={20} />
                        Kaydet ve İndir
                    </button>

                </div>
            </div>

            {/* Success Modal */}
            {
                createdQr && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-fade-in">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-scale-in">
                            <div className="p-6 text-center space-y-6">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600">
                                    <QrCode size={32} />
                                </div>

                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">QR Kodunuz Hazır!</h3>
                                    <p className="text-gray-500">Kuponunuz başarıyla oluşturuldu.</p>
                                </div>

                                <div className="flex justify-center bg-gray-50 p-6 rounded-xl border border-gray-100 relative">
                                    <div ref={qrRef} className="bg-white p-4 rounded-xl shadow-sm">
                                        <FrameRenderer
                                            frameId={qrDesign.frame}
                                            currentDesign={qrDesign}
                                            size={200}
                                            value={createdQr.url}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-3">
                                    <button
                                        onClick={async () => {
                                            if (!qrRef.current) return;
                                            const canvas = await html2canvas(qrRef.current, { backgroundColor: null, scale: 2 });
                                            const image = canvas.toDataURL("image/png");
                                            const link = document.createElement('a');
                                            link.href = image;
                                            link.download = `kupon-qr-${createdQr.id}.png`;
                                            link.click();
                                        }}
                                        className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Download size={20} />
                                        QR Kodu İndir (PNG)
                                    </button>

                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            onClick={() => router.push(`/q/${createdQr.id}`)}
                                            className="py-3 border-2 border-gray-200 hover:border-gray-800 text-gray-700 rounded-xl font-bold transition-colors"
                                        >
                                            Görüntüle
                                        </button>
                                        <button
                                            onClick={() => window.location.reload()}
                                            className="py-3 border-2 border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl font-bold transition-colors"
                                        >
                                            Yeni Oluştur
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
}
