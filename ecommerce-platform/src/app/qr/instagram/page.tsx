'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
    QrCode, Download, Palette, ChevronDown, ChevronUp,
    Instagram, User, Grid, MonitorPlay, Tag, Home, Search, PlusSquare, Heart, Settings
} from 'lucide-react';
import FrameRenderer, { QrDesignState } from '@/components/qr/FrameRenderer';
import QRCodeDesignControl from '@/components/qr/QRCodeDesignControl';
import html2canvas from 'html2canvas';
import { checkInstagramUser } from '@/app/actions/instagram';

// --- State & Types ---
interface InstagramState {
    username: string;
    qrName: string;
    design: QrDesignState;
}

const INITIAL_STATE: InstagramState = {
    username: '', // Default empty
    qrName: '',
    design: {
        frame: 'none',
        frameLabel: 'SCAN ME',
        pattern: 'square',
        cornerStyle: 'square',
        cornerColor: '#000000',
        logo: null,
        fgColor: '#000000',
        bgColor: '#ffffff',
        gradient: { enabled: false, start: '#000000', end: '#000000' }
    }
};

const AccordionItem = ({ title, icon, children, isOpen, onToggle }: { title: string, icon: React.ReactNode, children: React.ReactNode, isOpen: boolean, onToggle: () => void }) => (
    <div className="bg-white border text-left border-gray-200 rounded-xl overflow-hidden shadow-sm transition-all duration-200">
        <button
            onClick={onToggle}
            className="flex items-center justify-between w-full p-4 hover:bg-gray-50 transition-colors"
        >
            <div className="flex items-center gap-3 font-semibold text-gray-700">
                <span className="text-pink-600">{icon}</span>
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

export default function InstagramQRPage() {
    const [state, setState] = useState<InstagramState>(INITIAL_STATE);
    const [activeSection, setActiveSection] = useState<string | null>('info');
    const [previewTab, setPreviewTab] = useState<'page' | 'qr'>('page');
    const [isSaving, setIsSaving] = useState(false);

    // Validation State
    const [isValidating, setIsValidating] = useState(false);
    const [isValidUser, setIsValidUser] = useState<boolean | null>(null);

    const qrRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    const toggleSection = (section: string) => {
        setActiveSection(activeSection === section ? null : section);
    };

    const handleSave = async () => {
        if (!state.username) return;
        setIsSaving(true);

        // Switch to QR tab to ensure it is rendered
        setPreviewTab('qr');

        // Wait for render
        setTimeout(async () => {
            // Create download
            if (qrRef.current) {
                try {
                    const canvas = await html2canvas(qrRef.current, { backgroundColor: null });
                    const url = canvas.toDataURL('image/png');
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `instagram-qr-${state.username}.png`;
                    a.click();
                } catch (err) {
                    console.error('Download failed', err);
                }
            }
            setIsSaving(false);
        }, 500);
    };

    const handleUsernameChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        const username = val.replace(/^@/, '');
        setState(prev => ({ ...prev, username }));
        setIsValidUser(null);

        if (username.length > 2) {
            setIsValidating(true);
            try {
                // Debounce simple simulation
                const result = await checkInstagramUser(username);
                setIsValidUser(result.exists);
            } catch (err) {
                console.error(err);
            } finally {
                setIsValidating(false);
            }
        } else {
            setIsValidating(false);
            setIsValidUser(null);
        }
    };

    // --- Mock Data Helpers ---
    const displayUsername = state.username || 'kullanici_adi';

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <div className="flex-1 flex flex-col lg:flex-row container mx-auto max-w-7xl shadow-xl my-8 rounded-2xl bg-white overflow-hidden">

                {/* LEFT PANEL: EDITOR */}
                <div className="w-full lg:w-1/2 p-4 lg:p-8 space-y-4 overflow-y-auto h-[calc(100vh-64px)] custom-scrollbar">
                    <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                        <Instagram className="text-pink-600" size={32} />
                        Instagram QR Kodu
                    </h1>

                    {/* 1. TEMEL BİLGİLER */}
                    <AccordionItem title="Temel Bilgiler" icon={<Instagram size={20} />} isOpen={activeSection === 'info'} onToggle={() => toggleSection('info')}>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">Kullanıcı Adı <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">@</span>
                                    <input
                                        type="text"
                                        value={state.username}
                                        onChange={handleUsernameChange}
                                        className={`w-full pl-8 pr-10 py-3 border rounded-xl focus:ring-2 outline-none transition-all ${isValidUser === false ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-pink-500 focus:ring-pink-500/20'}`}
                                        placeholder="instagram_kullanici_adi"
                                    />
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                        {isValidating ? (
                                            <div className="w-4 h-4 border-2 border-pink-200 border-t-pink-600 rounded-full animate-spin"></div>
                                        ) : isValidUser === true ? (
                                            <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                                        ) : isValidUser === false ? (
                                            <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                        ) : null}
                                    </div>
                                </div>
                                {isValidUser === false && <p className="text-[10px] text-red-500 mt-1 font-medium">Bu kullanıcı adı bulunamadı veya gizli.</p>}
                                <p className="text-[10px] text-gray-400 mt-1">Profilinize yönlendirecek QR kod için kullanıcı adınızı girin.</p>
                            </div>
                        </div>
                    </AccordionItem>

                    {/* 2. QR KODUN ADI */}
                    <AccordionItem title="QR Kodun Adı" icon={<Tag size={20} />} isOpen={activeSection === 'name'} onToggle={() => toggleSection('name')}>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-2">QR Koduna İsim Verin</label>
                            <input
                                type="text"
                                value={state.qrName}
                                onChange={(e) => setState(prev => ({ ...prev, qrName: e.target.value }))}
                                className="w-full border rounded p-2"
                                placeholder="Örn: Kişisel Instagram"
                            />
                        </div>
                    </AccordionItem>

                    {/* 3. QR TASARIMI */}
                    <AccordionItem title="QR Kod Tasarımı" icon={<QrCode size={20} />} isOpen={activeSection === 'qr'} onToggle={() => { toggleSection('qr'); setPreviewTab('qr'); }}>
                        <QRCodeDesignControl design={state.design} onChange={(newDesign) => setState(prev => ({ ...prev, design: newDesign }))} />
                    </AccordionItem>

                    {/* Action Buttons */}
                    <div className="pt-6">
                        <button onClick={handleSave} disabled={isSaving || !state.username} className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-pink-200 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2">
                            {isSaving ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><QrCode size={24} /> Oluştur ve İndir</>}
                        </button>
                    </div>

                    {/* Banner */}
                    <div className="mt-8 p-6 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-2xl text-white relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="font-bold text-lg mb-1">Tüm profillerinizi tek yerde toplayın?</h3>
                            <p className="text-sm opacity-90 mb-4">Bunun için özel 'Bağlantı Listesi' QR kodumuz var!</p>
                            <button onClick={() => router.push('/qr/baglanti-listesi')} className="bg-white text-blue-500 px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-50 transition-colors">Şimdi dene!</button>
                        </div>
                        <div className="absolute right-0 bottom-0 opacity-20 transform translate-x-1/4 translate-y-1/4">
                            <Grid size={120} />
                        </div>
                    </div>
                </div>

                {/* RIGHT PANEL: PREVIEW */}
                <div className="hidden lg:flex flex-col w-1/2 bg-gray-100 items-center p-8 gap-4 h-[calc(100vh-64px)] sticky top-0 overflow-y-auto custom-scrollbar justify-center">

                    {/* Phone Frame */}
                    <div className="relative w-[320px] h-[640px] bg-white rounded-[40px] border-[8px] border-gray-900 overflow-hidden shadow-2xl">
                        {/* Dynamic Island / Notch */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-7 bg-black rounded-b-2xl z-20"></div>

                        {/* Content Scrollable Area */}
                        <div className="h-full w-full overflow-y-auto bg-white custom-scrollbar flex flex-col pt-10 pb-16">

                            {/* Instagram Header */}
                            <div className="px-4 pb-2 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
                                <span className="font-bold text-lg">{displayUsername}</span>
                                <div className="flex gap-4">
                                    <Settings size={24} />
                                </div>
                            </div>

                            {/* Profile Info */}
                            <div className="px-4 py-4">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 p-[2px]">
                                        <div className="w-full h-full rounded-full bg-white p-[2px]">
                                            <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
                                                <User size={32} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-1 justify-around text-center">
                                        <div>
                                            <div className="font-bold">142</div>
                                            <div className="text-xs">Gönderi</div>
                                        </div>
                                        <div>
                                            <div className="font-bold">2.4K</div>
                                            <div className="text-xs">Takipçi</div>
                                        </div>
                                        <div>
                                            <div className="font-bold">345</div>
                                            <div className="text-xs">Takip</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <div className="font-bold">{displayUsername}</div>
                                    <div className="text-sm text-gray-600">Dijital İçerik Üreticisi</div>
                                    <div className="text-sm">📍 İstanbul, TR</div>
                                </div>

                                <div className="flex gap-2 mb-6">
                                    <button className="flex-1 bg-blue-500 text-white py-1.5 rounded-lg text-sm font-semibold">Takip Et</button>
                                    <button className="flex-1 bg-gray-100 text-black py-1.5 rounded-lg text-sm font-semibold">Mesaj</button>
                                </div>

                                {/* Story Highlights Placeholder */}
                                <div className="flex gap-4 overflow-x-auto pb-4 mb-2 scrollbar-hide">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="flex flex-col items-center gap-1 flex-shrink-0">
                                            <div className="w-16 h-16 rounded-full bg-gray-100 border border-gray-200"></div>
                                            <span className="text-xs text-black">Öne Çıkan</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Tab Bar */}
                            <div className="flex border-t border-gray-200">
                                <button className="flex-1 py-3 flex justify-center border-b-2 border-black"><Grid size={24} /></button>
                                <button className="flex-1 py-3 flex justify-center text-gray-400"><MonitorPlay size={24} /></button>
                                <button className="flex-1 py-3 flex justify-center text-gray-400"><Tag size={24} /></button>
                            </div>

                            {/* Grid Photos Placeholder */}
                            <div className="grid grid-cols-3 gap-0.5">
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => (
                                    <div key={i} className="aspect-square bg-gray-100 relative group cursor-pointer hover:opacity-90">
                                        {/* Random colored placeholder to simulate images */}
                                        <div className={`w-full h-full opacity-20 ${['bg-red-200', 'bg-blue-200', 'bg-green-200', 'bg-yellow-200'][i % 4]}`}></div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Bottom Nav */}
                        <div className="absolute bottom-0 w-full h-16 bg-white border-t border-gray-100 flex items-center justify-around px-2 pb-2 z-10">
                            <Home size={24} strokeWidth={2.5} />
                            <Search size={24} strokeWidth={2.5} />
                            <PlusSquare size={24} strokeWidth={2.5} />
                            <MonitorPlay size={24} strokeWidth={2.5} />
                            <div className="w-7 h-7 rounded-full bg-gray-200 border border-black"></div>
                        </div>
                    </div>

                    {/* QR Code Overlay (Optional/Tabbed) */}
                    {previewTab === 'qr' && (
                        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
                            <div className="bg-white p-6 rounded-2xl shadow-2xl border" ref={qrRef}>
                                <FrameRenderer
                                    frameId={state.design.frame}
                                    currentDesign={state.design}
                                    value={`https://instagram.com/${state.username}`}
                                    size={200}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
