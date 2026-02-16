'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Globe, Lock, Type, ChevronDown, ChevronUp, Image as ImageIcon, Download, Palette, Grid, Box, Smartphone, MessageCircle, Coffee, ShoppingBag, Gift, Truck, Zap, Circle, Heart, Diamond, LayoutGrid, Hexagon, Square } from 'lucide-react';
import { createQrCode } from '@/app/actions/qr';
import AuthModal from '@/components/AuthModal';
import { useRouter } from 'next/navigation';
import html2canvas from 'html2canvas';

import CustomQRCode from '@/components/CustomQRCode';
import { FRAME_OPTIONS, PATTERN_OPTIONS, CORNER_OPTIONS, PatternType, CornerType, GradientType } from '@/components/qr/qr-constants';


interface User {
    name: string;
    email?: string;
}

interface DesignState {
    frame: string;
    frameLabel: string;
    pattern: PatternType;
    cornerStyle: CornerType;
    cornerColor: string;
    logo: string | null;
    fgColor: string;
    bgColor: string;
    gradient: GradientType;
}

const FrameRenderer = ({
    frameId,
    currentDesign,
    size = 200,
    isSmall = false,
    value
}: {
    frameId: string,
    currentDesign: DesignState,
    size?: number,
    isSmall?: boolean,
    value: string
}) => {
    const effectiveLabel = currentDesign.frameLabel || 'Scan Me';
    const fg = currentDesign.fgColor;
    const labelColor = currentDesign.gradient.enabled ? currentDesign.gradient.start : fg;

    const QR = (
        <CustomQRCode
            value={value || 'https://example.com'}
            size={size}
            pattern={currentDesign.pattern}
            cornerStyle={currentDesign.cornerStyle}
            cornerColor={currentDesign.cornerColor}
            fgColor={fg}
            bgColor={currentDesign.bgColor}
            logo={currentDesign.logo}
            gradient={currentDesign.gradient}
        />
    );

    const fontSize = isSmall ? '8px' : '16px';
    const labelStyle = { color: labelColor, fontSize, fontWeight: 'bold' as const };
    const containerStyle = { background: 'white', display: 'flex', flexDirection: 'column' as const, alignItems: 'center' };

    // 1. SIMPLE FRAMES
    if (frameId === 'none') return <div className={`bg-white rounded-xl shadow-sm ${isSmall ? 'p-1' : 'p-4'}`}>{QR}</div>;
    if (frameId === 'border') return <div style={{ ...containerStyle }} className={`${isSmall ? 'p-1 border-2' : 'p-4 border-8'} rounded-none border-black`}>{QR}</div>;
    if (frameId === 'border-thick') return <div style={{ ...containerStyle }} className={`${isSmall ? 'p-1 border-4' : 'p-4 border-[16px]'} rounded-none border-black`}>{QR}</div>;
    if (frameId === 'rounded') return <div style={{ ...containerStyle }} className={`${isSmall ? 'p-1 border-2' : 'p-4 border-8'} rounded-3xl border-black`}>{QR}</div>;
    if (frameId === 'modern-thin') return <div style={{ ...containerStyle }} className={`${isSmall ? 'p-1 border' : 'p-6 border-2'} rounded-lg border-black shadow-none`}>{QR}</div>;

    // 2. LABELED FRAMES
    if (frameId === 'label-bottom') {
        return (
            <div className={`bg-white shadow-md relative flex flex-col items-center border-black ${isSmall ? 'p-1 pb-4 border-2 rounded' : 'p-4 pb-12 border-4 rounded-lg'}`}>
                {QR}
                <div className="absolute bottom-1 left-0 right-0 text-center uppercase tracking-wider overflow-hidden px-1" style={labelStyle}>
                    {effectiveLabel}
                </div>
            </div>
        );
    }
    if (frameId === 'label-top') {
        return (
            <div className={`bg-white shadow-md relative flex flex-col items-center border-black ${isSmall ? 'p-1 pt-4 border-2 rounded' : 'p-4 pt-12 border-4 rounded-lg'}`}>
                <div className="absolute top-1 left-0 right-0 text-center uppercase tracking-wider overflow-hidden px-1" style={labelStyle}>
                    {effectiveLabel}
                </div>
                {QR}
            </div>
        );
    }
    if (frameId === 'bubble-top') {
        return (
            <div className="flex flex-col items-center gap-1">
                <div className="bg-black text-white rounded-full relative flex items-center justify-center max-w-full" style={{ padding: isSmall ? '2px 6px' : '8px 24px', ...labelStyle, color: 'white' }}>
                    <span className="truncate max-w-full block">{effectiveLabel}</span>
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-black rotate-45 w-2 h-2"></div>
                </div>
                <div className={`bg-white shadow-lg border-gray-100 ${isSmall ? 'p-1 rounded border' : 'p-2 rounded-xl border-2'}`}>{QR}</div>
            </div>
        )
    }
    // Handwriting
    if (frameId === 'handwriting') {
        return (
            <div className={`bg-white shadow-md relative flex flex-col items-center border-2 border-black ${isSmall ? 'p-1 pb-4 rounded-md' : 'p-4 pb-12 rounded-lg'}`} style={{ borderColor: 'black', borderStyle: 'solid' }}>
                {QR}
                <div className="absolute bottom-1 left-0 right-0 text-center text-gray-800 px-1" style={{ ...labelStyle, fontFamily: 'cursive', textTransform: 'none' }}>
                    {effectiveLabel}
                </div>
            </div>
        );
    }

    // 3. CONCEPT FRAMES
    if (frameId === 'phone') {
        return (
            <div className={`bg-black shadow-xl border-gray-800 relative flex flex-col items-center ${isSmall ? 'p-1 rounded-[12px] border-2' : 'p-3 rounded-[40px] border-4'}`}>
                {!isSmall && <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-5 bg-black rounded-b-xl z-10"></div>}
                <div className={`bg-white overflow-hidden flex flex-col items-center ${isSmall ? 'rounded-[8px] p-1 pt-2' : 'rounded-[32px] p-2 pt-8'}`}>
                    {QR}
                    {!isSmall && <div className="text-center pb-2 text-gray-800 mt-2 truncate max-w-full px-2" style={labelStyle}>{effectiveLabel}</div>}
                </div>
            </div>
        )
    }
    if (frameId === 'mug') {
        return (
            <div className={`bg-white border-black relative flex items-center justify-center ${isSmall ? 'p-2 rounded-l-lg border-2' : 'p-6 rounded-l-2xl border-4'}`} style={{ marginRight: isSmall ? '10px' : '40px' }}>
                <div className="flex flex-col items-center">
                    {QR}
                    <div className="mt-2 text-black font-bold truncate max-w-full" style={labelStyle}>{effectiveLabel}</div>
                </div>
                <div className={`absolute border-black rounded-r-3xl top-1/2 -translate-y-1/2 ${isSmall ? 'right-[-10px] w-3 h-8 border-2 border-l-0' : 'right-[-40px] w-10 h-24 border-4 border-l-0'}`}></div>
            </div>
        )
    }
    if (frameId === 'cup-coffee') {
        return (
            <div className="flex flex-col items-center">
                <div className="flex gap-1 mb-1 opacity-50">
                    <div className={`bg-gray-400 rounded-full animate-pulse ${isSmall ? 'w-1 h-3' : 'w-2 h-8'}`}></div>
                </div>
                <div className={`bg-orange-100 border-orange-800 relative flex flex-col items-center ${isSmall ? 'p-2 pt-4 border-2' : 'p-6 pt-12 border-4'}`} style={{ borderRadius: '0 0 20px 20px' }}>
                    <div className={`absolute top-0 left-0 right-0 bg-white border-b-2 border-orange-800 ${isSmall ? 'h-2' : 'h-8'}`}></div>
                    {QR}
                    <div className="mt-2 text-orange-900 font-bold rotate-[-5deg] truncate max-w-full" style={labelStyle}>{effectiveLabel}</div>
                </div>
            </div>
        )
    }
    if (frameId === 'bag') {
        return (
            <div className={`bg-orange-50 border-orange-500 relative flex flex-col items-center ${isSmall ? 'p-2 pt-4 border-2 rounded' : 'p-6 pt-12 border-4 rounded-lg'}`}>
                <div className={`absolute top-0 left-1/2 -translate-x-1/2 border-orange-500 rounded-t-full ${isSmall ? 'w-8 h-4 border-2 -mt-4' : 'w-24 h-12 border-4 -mt-12'}`}></div>
                {QR}
                <div className="mt-2 text-orange-600 font-bold uppercase truncate max-w-full" style={labelStyle}>{effectiveLabel}</div>
            </div>
        )
    }
    if (frameId === 'scooter') {
        return (
            <div className="flex items-end">
                <div className={`bg-blue-50 border-blue-600 relative flex flex-col items-center ${isSmall ? 'p-1 border-2 rounded-lg' : 'p-4 border-4 rounded-xl'}`}>
                    {QR}
                    <div className="bg-blue-600 text-white rounded px-2 truncate max-w-full" style={{ ...labelStyle, color: 'white' }}>{effectiveLabel}</div>
                </div>
                <div className={`bg-gray-800 rounded-full -ml-4 ${isSmall ? 'w-3 h-3' : 'w-10 h-10'}`}></div>
            </div>
        )
    }
    if (frameId === 'envelope') {
        return (
            <div className={`bg-white border-gray-300 relative flex flex-col items-center shadow-lg ${isSmall ? 'p-2 border pt-4' : 'p-6 border-2 pt-12'}`}>
                <div className="absolute top-0 left-0 right-0 h-0 border-l-transparent border-r-transparent border-t-gray-200"
                    style={{ borderLeftWidth: isSmall ? 35 : 120, borderRightWidth: isSmall ? 35 : 120, borderTopWidth: isSmall ? 25 : 80 }}></div>
                {QR}
                <div className="mt-2 text-gray-500 font-serif truncate max-w-full" style={labelStyle}>{effectiveLabel}</div>
            </div>
        )
    }
    if (frameId === 'gift') {
        return (
            <div className={`bg-red-50 border-red-500 relative flex flex-col items-center ${isSmall ? 'p-2 border-2' : 'p-6 border-4'}`}>
                <div className={`absolute -top-3 left-1/2 -translate-x-1/2 flex ${isSmall ? 'gap-1' : 'gap-2'}`}>
                    <div className={`bg-red-500 rounded-full ${isSmall ? 'w-2 h-2' : 'w-8 h-8'}`}></div>
                    <div className={`bg-red-500 rounded-full ${isSmall ? 'w-2 h-2' : 'w-8 h-8'}`}></div>
                </div>
                <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 bg-red-100 w-1/5 z-0"></div>
                <div className="relative z-10 flex flex-col items-center">
                    {QR}
                    <div className="mt-2 bg-white px-2 text-red-600 font-bold truncate max-w-full" style={labelStyle}>{effectiveLabel}</div>
                </div>
            </div>
        )
    }
    if (frameId === 'hand') {
        return (
            <div className={`bg-white border-black relative flex flex-col items-center ${isSmall ? 'p-2 border-2 rounded' : 'p-6 border-4 rounded-lg'}`}>
                <div className={`absolute -bottom-6 right-0 bg-yellow-200 rounded-full rotate-45 ${isSmall ? 'w-6 h-12' : 'w-16 h-28'}`} style={{ zIndex: -1 }}></div>
                {QR}
                <div className="mt-2 text-black font-bold truncate max-w-full" style={labelStyle}>{effectiveLabel}</div>
            </div>
        )
    }

    if (frameId === 'polaroid') {
        return (
            <div className={`bg-white shadow-xl transform rotate-2 transition-transform hover:rotate-0 flex flex-col items-center ${isSmall ? 'p-2 pb-4' : 'p-4 pb-16'}`} style={{ boxShadow: '0 10px 30px -5px rgba(0,0,0,0.3)' }}>
                <div className="border border-gray-100 mb-2">
                    {QR}
                </div>
                <div className="text-center font-handwriting text-gray-600 font-bold truncate max-w-full px-2" style={{ fontFamily: 'cursive', ...labelStyle }}>
                    {effectiveLabel}
                </div>
            </div>
        )
    }
    return <div className={`border-4 border-gray-300 ${isSmall ? 'p-1' : 'p-4'}`}>{QR}</div>;
};

const QRCodeGenerator = ({ user }: { user: User | null }) => {
    const router = useRouter();

    // Core Data
    const [text, setText] = useState('https://example.com');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');

    // Design Data
    const [design, setDesign] = useState<DesignState>({
        frame: 'none',
        frameLabel: 'Scan Me!',
        pattern: 'square',
        cornerStyle: 'square',
        cornerColor: '', // Empty means inherit from FG/Gradient
        logo: null,
        fgColor: '#000000',
        bgColor: '#ffffff',
        gradient: {
            enabled: false,
            start: '#000000',
            end: '#ff0000'
        }
    });

    // UI States
    const [activeSection, setActiveSection] = useState<string | null>('frame');
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);

    // Auto-Save Logic State
    const [shouldAutoSave, setShouldAutoSave] = useState(false);

    const qrRef = useRef<HTMLDivElement>(null);

    // Accordion Helper
    const toggleSection = (section: string) => {
        setActiveSection(activeSection === section ? null : section);
    };

    // --- EFFECT: Restore State & Trigger Auto-Save ---
    useEffect(() => {
        // Only run on client mount or user change
        const pending = localStorage.getItem('pendingQrDesign');
        if (pending && user) {
            try {
                const data = JSON.parse(pending);
                // Restore state
                setText(data.text || '');
                setName(data.name || '');
                setPassword(data.password || '');
                if (data.design) setDesign(data.design);

                // Set flag to save after render
                setShouldAutoSave(true);

                // Clear storage
                localStorage.removeItem('pendingQrDesign');
            } catch (e) {
                console.error("Error restoring pending QR design", e);
            }
        }
    }, [user]);

    // --- EFFECT: Execute Auto-Save when ready ---
    useEffect(() => {
        if (shouldAutoSave && text) {
            // Need a slight delay to ensure Canvas is fully rendered by React
            const timer = setTimeout(() => {
                handleSave(true);
                setShouldAutoSave(false);
            }, 800);
            return () => clearTimeout(timer);
        }
    }, [shouldAutoSave, text, design]);

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setLogoPreview(event.target?.result as string);
                setDesign(prev => ({ ...prev, logo: event.target?.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async (isAutoAction = false) => {
        if (!isAutoAction && !user) {
            const stateToSave = {
                text,
                name,
                password,
                design
            };
            localStorage.setItem('pendingQrDesign', JSON.stringify(stateToSave));
            router.push(`/login?callbackUrl=${encodeURIComponent('/qr-kod-olusturucu')}`);
            return;
        }

        if (!text.trim()) {
            alert('Lütfen bir URL girin.');
            return;
        }

        setIsGenerating(true);

        try {
            const formData = new FormData();
            formData.append('targetUrl', text);
            formData.append('name', name);
            if (password) formData.append('password', password);
            formData.append('design', JSON.stringify(design));

            const result = await createQrCode(formData);

            if (result.success && result.id) {
                await handleDownload();
                // Redirect to Home as requested -> REMOVED to keep user on QR page
                // router.push('/'); 
            } else {
                alert('Hata: ' + (result.error || 'Oluşturulamadı'));
            }
        } catch (error) {
            console.error(error);
            alert('Bir hata oluştu.');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleDownload = async () => {
        if (!qrRef.current) return;

        try {
            const canvas = await html2canvas(qrRef.current, {
                backgroundColor: null,
                scale: 2
            });

            const image = canvas.toDataURL("image/png");
            const link = document.createElement('a');
            link.href = image;
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            link.download = `qr-code-${timestamp}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (err) {
            console.error("Download error:", err);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />

            {/* 1. TOP PREVIEW AREA */}
            <div className="bg-gradient-to-b from-gray-900 to-gray-800 text-white py-12 px-4 shadow-xl relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-700 via-gray-900 to-black"></div>

                <div className="max-w-4xl mx-auto relative z-10 flex flex-col items-center">
                    <h1 className="text-3xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-pink-500">
                        QR’ı Tasarlayın
                    </h1>

                    <div className="relative group flex items-center justify-center p-8">
                        <div ref={qrRef} className="bg-transparent p-2 inline-block scale-90 sm:scale-100 origin-center">
                            <FrameRenderer
                                frameId={design.frame}
                                currentDesign={design}
                                size={220}
                                value={text}
                            />
                        </div>
                    </div>
                    <p className="mt-6 text-gray-400 text-sm">Canlı Önizleme - {design.frameLabel}</p>
                </div>
            </div>

            {/* 2. BOTTOM DESIGN AREA (Accordion) */}
            <div className="flex-1 max-w-4xl mx-auto w-full p-4 sm:p-6 space-y-4 -mt-6 relative z-20">

                {/* 1. Content Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <button
                        onClick={() => toggleSection('content')}
                        className="w-full p-4 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <Globe className="text-orange-500" size={20} />
                            <span className="font-bold text-gray-800">1. İçerik ve Bilgiler</span>
                        </div>
                        {activeSection === 'content' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>

                    {activeSection === 'content' && (
                        <div className="p-6 border-t border-gray-50 bg-gray-50/50 space-y-4 animate-fade-in-down">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">Hedef URL</label>
                                <input
                                    type="text"
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    placeholder="https://example.com"
                                    className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none"
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* 2. Frame Selection */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <button
                        onClick={() => toggleSection('frame')}
                        className="w-full p-4 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <Box className="text-purple-500" size={20} />
                            <span className="font-bold text-gray-800">2. Çerçeve Stili</span>
                        </div>
                        {activeSection === 'frame' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>

                    {activeSection === 'frame' && (
                        <div className="p-0 border-t border-gray-50 animate-fade-in-down bg-gray-50 relative group/carousel">
                            <button
                                onClick={() => {
                                    const container = document.getElementById('frame-scroll-container');
                                    if (container) container.scrollBy({ left: -200, behavior: 'smooth' });
                                }}
                                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 p-2 rounded-full shadow-lg hover:bg-white text-gray-700 opacity-0 group-hover/carousel:opacity-100 transition-opacity"
                            >
                                <ChevronDown className="rotate-90" size={24} />
                            </button>

                            <div id="frame-scroll-container" className="overflow-x-auto p-6 flex gap-4 no-scrollbar pb-8 snap-x snap-mandatory">
                                {FRAME_OPTIONS.map((f) => (
                                    <button
                                        key={f.id}
                                        onClick={() => setDesign({ ...design, frame: f.id, frameLabel: f.editable ? (design.frameLabel || f.defaultLabel || 'Scan Me') : design.frameLabel })}
                                        className={`flex-shrink-0 relative p-4 rounded-2xl border-2 flex flex-col items-center gap-4 transition-all group w-40 hover:shadow-lg bg-white snap-center
                                            ${design.frame === f.id
                                                ? 'border-green-500 shadow-xl ring-2 ring-green-100 transform -translate-y-1'
                                                : 'border-gray-200 hover:-translate-y-1'
                                            }`}
                                    >
                                        <div className="pointer-events-none transform group-hover:scale-105 transition-transform">
                                            <FrameRenderer
                                                frameId={f.id}
                                                currentDesign={{ ...design, frameLabel: f.editable ? (design.frameLabel || f.defaultLabel || '') : (f.defaultLabel || 'Scan Me') as string }}
                                                size={80}
                                                isSmall={true}
                                                value={text}
                                            />
                                        </div>
                                        <span className={`text-xs font-bold ${design.frame === f.id ? 'text-green-600' : 'text-gray-500'}`}>
                                            {f.label}
                                        </span>

                                        {design.frame === f.id && (
                                            <div className="absolute top-2 right-2 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
                                        )}
                                        {f.editable && (
                                            <div
                                                className="absolute inset-0 bg-black/60 backdrop-blur-[1px] rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <input
                                                    type="text"
                                                    placeholder="Çerçeve metnini gir"
                                                    className="w-3/4 p-2 text-xs rounded shadow-lg border-2 border-green-500 outline-none text-center font-bold text-gray-800"
                                                    value={design.frame === f.id ? design.frameLabel : ''}
                                                    onChange={(e) => setDesign({ ...design, frame: f.id, frameLabel: e.target.value })}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (design.frame !== f.id) setDesign({ ...design, frame: f.id, frameLabel: f.defaultLabel || 'Scan Me' });
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={() => {
                                    const container = document.getElementById('frame-scroll-container');
                                    if (container) container.scrollBy({ left: 200, behavior: 'smooth' });
                                }}
                                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 p-2 rounded-full shadow-lg hover:bg-white text-gray-700 opacity-0 group-hover/carousel:opacity-100 transition-opacity"
                            >
                                <ChevronDown className="-rotate-90" size={24} />
                            </button>
                        </div>
                    )}
                </div>

                {/* 3. Colors & Pattern & Corners */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <button
                        onClick={() => toggleSection('pattern')}
                        className="w-full p-4 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <Palette className="text-pink-500" size={20} />
                            <span className="font-bold text-gray-800">3. Görünüm (Desen ve Renkler)</span>
                        </div>
                        {activeSection === 'pattern' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>

                    {activeSection === 'pattern' && (
                        <div className="p-6 border-t border-gray-50 space-y-8 animate-fade-in-down">

                            {/* PATTERN SELECTION */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-3">Desen Tipleri</label>
                                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                                    {PATTERN_OPTIONS.map((p) => (
                                        <button
                                            key={p.id}
                                            onClick={() => setDesign({ ...design, pattern: p.id })}
                                            className={`p-3 rounded-xl border-2 flex flex-col items-center gap-2 transition-all hover:bg-gray-50 
                                                ${design.pattern === p.id ? 'border-pink-500 bg-pink-50 ring-2 ring-pink-100' : 'border-gray-200'}`}
                                        >
                                            <div className={design.pattern === p.id ? 'text-pink-500' : 'text-gray-400'}>{p.icon}</div>
                                            <span className="text-xs font-semibold text-gray-600">{p.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <hr className="border-gray-100" />

                            {/* CORNER SELECTION */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-3">Köşe (Göz) Stili</label>
                                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                                    {CORNER_OPTIONS.map((c) => (
                                        <button
                                            key={c.id}
                                            onClick={() => setDesign({ ...design, cornerStyle: c.id })}
                                            className={`p-3 rounded-xl border-2 flex flex-col items-center gap-2 transition-all hover:bg-gray-50 
                                                ${design.cornerStyle === c.id ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-100' : 'border-gray-200'}`}
                                        >
                                            <div className={design.cornerStyle === c.id ? 'text-blue-500' : 'text-gray-400'}>{c.icon}</div>
                                            <span className="text-xs font-semibold text-gray-600">{c.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                <label className="block text-xs font-bold text-gray-500 mb-2">Köşe Rengi</label>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="color"
                                        value={design.cornerColor || design.fgColor}
                                        onChange={(e) => setDesign({ ...design, cornerColor: e.target.value })}
                                        className="w-12 h-12 rounded-lg cursor-pointer border-2 border-white shadow-sm p-0"
                                    />
                                    <div className="flex-1">
                                        <input
                                            type="text"
                                            value={design.cornerColor || 'Varsayılan'}
                                            readOnly={!design.cornerColor}
                                            className="w-full text-xs font-mono border border-gray-300 rounded p-2 text-center uppercase"
                                            placeholder="Desenden alınıyor"
                                        />
                                    </div>
                                    {design.cornerColor && (
                                        <button
                                            onClick={() => setDesign({ ...design, cornerColor: '' })}
                                            className="text-xs text-red-500 hover:text-red-700 underline"
                                        >
                                            Sıfırla
                                        </button>
                                    )}
                                </div>
                            </div>

                            <hr className="border-gray-100" />

                            <div className="space-y-4">
                                <h3 className="text-sm font-bold text-gray-700">Desen Rengi</h3>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => setDesign(prev => ({
                                            ...prev,
                                            gradient: { ...prev.gradient, enabled: !prev.gradient.enabled }
                                        }))}
                                        className={`relative w-12 h-6 rounded-full transition-colors ${design.gradient.enabled ? 'bg-purple-600' : 'bg-gray-200'}`}
                                    >
                                        <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${design.gradient.enabled ? 'translate-x-6' : 'translate-x-0'}`}></span>
                                    </button>
                                    <span className="text-sm text-gray-600 font-medium">Gradyan desen rengi kullan</span>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
                                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                        <label className="block text-xs font-bold text-gray-500 mb-2">QR Rengi (Ön Plan)</label>
                                        {!design.gradient.enabled ? (
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="color"
                                                    value={design.fgColor}
                                                    onChange={(e) => setDesign({ ...design, fgColor: e.target.value })}
                                                    className="w-12 h-12 rounded-lg cursor-pointer border-2 border-white shadow-sm p-0"
                                                />
                                                <div className="flex-1">
                                                    <input
                                                        type="text"
                                                        value={design.fgColor}
                                                        onChange={(e) => setDesign({ ...design, fgColor: e.target.value })}
                                                        className="w-full text-xs font-mono border border-gray-300 rounded p-2 text-center uppercase"
                                                    />
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs text-gray-400 w-12">Başlangıç</span>
                                                    <input
                                                        type="color"
                                                        value={design.gradient.start}
                                                        onChange={(e) => setDesign(prev => ({ ...prev, gradient: { ...prev.gradient, start: e.target.value } }))}
                                                        className="w-8 h-8 rounded cursor-pointer border-none p-0"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={design.gradient.start}
                                                        className="flex-1 text-xs font-mono border border-gray-300 rounded p-1"
                                                        readOnly
                                                    />
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs text-gray-400 w-12">Bitiş</span>
                                                    <input
                                                        type="color"
                                                        value={design.gradient.end}
                                                        onChange={(e) => setDesign(prev => ({ ...prev, gradient: { ...prev.gradient, end: e.target.value } }))}
                                                        className="w-8 h-8 rounded cursor-pointer border-none p-0"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={design.gradient.end}
                                                        className="flex-1 text-xs font-mono border border-gray-300 rounded p-1"
                                                        readOnly
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                        <label className="block text-xs font-bold text-gray-500 mb-2">Arka Plan Rengi</label>
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="color"
                                                value={design.bgColor}
                                                onChange={(e) => setDesign({ ...design, bgColor: e.target.value })}
                                                className="w-12 h-12 rounded-lg cursor-pointer border-2 border-white shadow-sm p-0"
                                            />
                                            <div className="flex-1">
                                                <input
                                                    type="text"
                                                    value={design.bgColor}
                                                    onChange={(e) => setDesign({ ...design, bgColor: e.target.value })}
                                                    className="w-full text-xs font-mono border border-gray-300 rounded p-2 text-center uppercase"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* 4. Logo Upload */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <button
                        onClick={() => toggleSection('logo')}
                        className="w-full p-4 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <ImageIcon className="text-blue-500" size={20} />
                            <span className="font-bold text-gray-800">4. Logo Ekleme</span>
                        </div>
                        {activeSection === 'logo' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>

                    {activeSection === 'logo' && (
                        <div className="p-6 border-t border-gray-50 animate-fade-in-down">
                            <p className="text-sm text-gray-500 mb-4">
                                Logo, QR kodunun tam ortasına yerleştirilir. Okunabilirliği korumak için basit logolar kullanın.
                            </p>

                            <div className="flex items-center gap-4">
                                <label className="flex-1 cursor-pointer bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center hover:bg-gray-100 transition-colors">
                                    <ImageIcon className="text-gray-400 mb-2" size={32} />
                                    <span className="text-sm font-bold text-gray-600">Logo Yükle</span>
                                    <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} />
                                </label>

                                {design.logo && (
                                    <div className="relative">
                                        <img src={design.logo} alt="Logo Preview" className="w-20 h-20 object-contain rounded-lg border border-gray-200 bg-white" />
                                        <button
                                            onClick={() => setDesign({ ...design, logo: null })}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                        >
                                            <div className="w-2 h-2 bg-white rounded-full"></div>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* BOTTOM ACTIONS */}
                <div className="pt-8 pb-12 flex flex-col gap-4">
                    <button
                        onClick={() => handleSave(false)}
                        disabled={isGenerating}
                        className="w-full py-4 bg-gray-900 text-white font-bold text-lg rounded-2xl shadow-xl hover:bg-black hover:scale-[1.02] transition-all transform flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isGenerating ? (
                            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            <>
                                <Download size={24} />
                                Kaydet & İndir
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QRCodeGenerator;
