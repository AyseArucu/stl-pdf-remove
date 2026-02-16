'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { Wifi, ChevronDown, ChevronUp, ArrowRight, ArrowLeft, Palette, Grid, Box, Circle, Download, ChevronRight } from 'lucide-react';
import FrameRenderer from '@/components/qrcode/FrameRenderer';
import { FRAME_OPTIONS, PATTERN_OPTIONS, CORNER_OPTIONS, DesignState } from '@/components/qrcode/constants';
import html2canvas from 'html2canvas';
import { useUser } from '@/context/UserContext';
import { useRouter } from 'next/navigation';

export default function WifiQRPage() {
    // Content State
    const [ssid, setSsid] = useState('');
    const [password, setPassword] = useState('');
    const [encryption, setEncryption] = useState('WPA');
    const [hidden, setHidden] = useState(false);
    const [qrName, setQrName] = useState('');

    // UI State
    const [isWifiOpen, setIsWifiOpen] = useState(true);
    const [activeTab, setActiveTab] = useState<'preview' | 'qr'>('preview');
    const [previewStatus, setPreviewStatus] = useState<'prompt' | 'connecting' | 'success' | 'hidden'>('prompt');

    // Ref for Download
    const qrRef = useRef<HTMLDivElement>(null);
    const { user } = useUser();
    const router = useRouter();

    // Reset preview when content changes
    React.useEffect(() => {
        setPreviewStatus('prompt');
    }, [ssid, password, encryption, hidden]);

    const handleConnect = () => {
        setPreviewStatus('connecting');
        setTimeout(() => {
            setPreviewStatus('success');
        }, 1500);
    };

    const handleDownload = async () => {
        if (!user) {
            router.push(`/login?callbackUrl=${encodeURIComponent('/qr/wifi')}`);
            return;
        }

        if (!qrRef.current) return;
        try {
            const canvas = await html2canvas(qrRef.current, {
                backgroundColor: null,
                scale: 2 // Higher resolution
            });

            const image = canvas.toDataURL("image/png");
            const link = document.createElement('a');
            link.href = image;
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            link.download = `wifi - qr - ${qrName || 'code'} -${timestamp}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (err) {
            console.error("Download error:", err);
            alert("QR kodu indirilirken bir hata oluştu.");
        }
    };

    // Design State
    const [design, setDesign] = useState<DesignState>({
        frame: 'none',
        frameLabel: 'SCAN ME',
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

    const [activeDesignSection, setActiveDesignSection] = useState<string | null>('frame');

    // Helper to generate Wi-Fi String
    // Format: WIFI:S:SSID;T:Type;P:Password;H:Hidden;;
    const wifiString = `WIFI: S:${ssid}; T:${encryption}; P:${password}; H:${hidden ? 'true' : 'false'};; `;

    const handleDesignChange = (field: keyof DesignState, value: any) => {
        setDesign(prev => ({ ...prev, [field]: value }));
    };

    const toggleSection = (section: string) => {
        setActiveDesignSection(activeDesignSection === section ? null : section);
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <div className="flex-1 flex flex-col lg:flex-row container mx-auto max-w-7xl shadow-xl my-8 rounded-2xl bg-white">

                {/* LEFT PANEL: Editor */}
                <div className="w-full lg:w-1/2 p-4 lg:p-8 space-y-4">

                    {/* 1. Wi-Fi Bilgileri Kartı */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <button
                            onClick={() => setIsWifiOpen(!isWifiOpen)}
                            className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center">
                                    <Wifi size={20} />
                                </div>
                                <div className="text-left">
                                    <h3 className="font-bold text-gray-900">Wi-Fi Bilgileri</h3>
                                    <p className="text-xs text-gray-500">Ağ bilgilerinizi girin</p>
                                </div>
                            </div>
                            {isWifiOpen ? <ChevronDown className="text-gray-400" /> : <ChevronRight className="text-gray-400" />}
                        </button>

                        {isWifiOpen && (
                            <div className="p-5 pt-0 border-t border-gray-100 bg-gray-50/50 space-y-4 animate-in fade-in">
                                {/* Network Name (SSID) */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">
                                        Ağ adı (SSID) <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={ssid}
                                        onChange={(e) => setSsid(e.target.value)}
                                        placeholder="Örneğin: Wi-Fi adı"
                                        className="w-full p-3 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>

                                {/* Password */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">
                                        Ağ şifresi
                                    </label>
                                    <input
                                        type="text"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Örneğin: Kablosuz ağ şifresi"
                                        className="w-full p-3 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>

                                {/* Encryption & Hidden */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">
                                            Şifreleme tipi
                                        </label>
                                        <div className="relative">
                                            <select
                                                value={encryption}
                                                onChange={(e) => setEncryption(e.target.value)}
                                                className="w-full p-3 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none appearance-none bg-white"
                                            >
                                                <option value="WPA">WPA/WPA2</option>
                                                <option value="WEP">WEP</option>
                                                <option value="nopass">None</option>
                                            </select>
                                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                                        </div>
                                    </div>

                                    <div className="flex items-center pt-8">
                                        <label className="flex items-center gap-3 cursor-pointer group select-none">
                                            <div className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-colors ${hidden ? 'bg-blue-600 border-blue-600' : 'border-gray-300 group-hover:border-blue-400'}`}>
                                                {hidden && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                                            </div>
                                            <input
                                                type="checkbox"
                                                checked={hidden}
                                                onChange={(e) => setHidden(e.target.checked)}
                                                className="hidden"
                                            />
                                            <span className="text-sm font-bold text-gray-700">Gizli ağ</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* QR Kodun Adı */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                        <div className="flex items-center gap-4 mb-3">
                            <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center">
                                <Box size={20} />
                            </div>
                            <div className="text-left">
                                <h3 className="font-bold text-gray-900">QR Kodun Adı</h3>
                                <p className="text-xs text-gray-500">İsteğe bağlı isim verin</p>
                            </div>
                        </div>
                        <input
                            type="text"
                            value={qrName}
                            onChange={(e) => setQrName(e.target.value)}
                            placeholder="Örn: Ev Wi-Fi"
                            className="w-full p-3 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>

                    {/* 2. Frames */}
                    <div className={`bg-white rounded-xl shadow-sm border ${activeDesignSection === 'frame' ? 'border-purple-500 ring-1 ring-purple-500' : 'border-gray-200'} overflow-hidden`}>
                        <button onClick={() => toggleSection('frame')} className="w-full p-5 flex items-center justify-between hover:bg-gray-50">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-500 flex items-center justify-center">
                                    <Box size={20} />
                                </div>
                                <div className="text-left">
                                    <h3 className="font-bold text-gray-900">Çerçeve</h3>
                                    <p className="text-xs text-gray-500">QR kodunuz için çerçeve seçin</p>
                                </div>
                            </div>
                            {activeDesignSection === 'frame' ? <ChevronDown className="text-gray-400" /> : <ChevronRight className="text-gray-400" />}
                        </button>
                        {activeDesignSection === 'frame' && (
                            <div className="p-5 pt-0 border-t border-gray-100 bg-gray-50/50 animate-in fade-in">
                                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 py-4">
                                    {FRAME_OPTIONS.map((frame) => (
                                        <button
                                            key={frame.id}
                                            onClick={() => handleDesignChange('frame', frame.id)}
                                            className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${design.frame === frame.id ? 'border-purple-600 bg-purple-50' : 'border-gray-200 hover:border-purple-200 hover:bg-white'}`}
                                        >
                                            <div className="w-8 h-8 bg-white border border-gray-200 rounded-lg flex items-center justify-center shadow-sm">
                                                <Box size={16} className="text-gray-600" />
                                            </div>
                                            <span className="text-[10px] font-bold text-gray-600 text-center">{frame.label}</span>
                                        </button>
                                    ))}
                                </div>
                                {/* Label Input if applicable */}
                                {FRAME_OPTIONS.find(f => f.id === design.frame)?.editable && (
                                    <div className="mt-2">
                                        <label className="block text-xs font-bold text-gray-700 mb-2">Çerçeve Metni</label>
                                        <input
                                            type="text"
                                            value={design.frameLabel}
                                            onChange={(e) => handleDesignChange('frameLabel', e.target.value)}
                                            className="w-full p-2.5 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                                        />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* 3. Patterns & Corners */}
                    <div className={`bg-white rounded-xl shadow-sm border ${activeDesignSection === 'pattern' ? 'border-indigo-500 ring-1 ring-indigo-500' : 'border-gray-200'} overflow-hidden`}>
                        <button onClick={() => toggleSection('pattern')} className="w-full p-5 flex items-center justify-between hover:bg-gray-50">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-500 flex items-center justify-center">
                                    <Grid size={20} />
                                </div>
                                <div className="text-left">
                                    <h3 className="font-bold text-gray-900">Desen ve Köşeler</h3>
                                    <p className="text-xs text-gray-500">Desen ve köşe stilini özelleştirin</p>
                                </div>
                            </div>
                            {activeDesignSection === 'pattern' ? <ChevronDown className="text-gray-400" /> : <ChevronRight className="text-gray-400" />}
                        </button>
                        {activeDesignSection === 'pattern' && (
                            <div className="p-5 pt-0 border-t border-gray-100 bg-gray-50/50 space-y-6 animate-in fade-in py-4">
                                <div>
                                    <h4 className="text-xs font-bold text-gray-900 mb-3 uppercase tracking-wider">Desen Stili</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {PATTERN_OPTIONS.map((pattern) => (
                                            <button
                                                key={pattern.id}
                                                onClick={() => handleDesignChange('pattern', pattern.id)}
                                                className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all ${design.pattern === pattern.id ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm' : 'border-gray-200 hover:border-indigo-300 bg-white'}`}
                                            >
                                                {React.createElement(pattern.icon, { size: 14 })}
                                                <span className="text-xs font-bold">{pattern.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-gray-900 mb-3 uppercase tracking-wider">Köşe Stili</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {CORNER_OPTIONS.map((corner) => (
                                            <button
                                                key={corner.id}
                                                onClick={() => handleDesignChange('cornerStyle', corner.id)}
                                                className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all ${design.cornerStyle === corner.id ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm' : 'border-gray-200 hover:border-indigo-300 bg-white'}`}
                                            >
                                                {React.createElement(corner.icon, { size: 14 })}
                                                <span className="text-xs font-bold">{corner.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* 4. Colors */}
                    <div className={`bg-white rounded-xl shadow-sm border ${activeDesignSection === 'color' ? 'border-pink-500 ring-1 ring-pink-500' : 'border-gray-200'} overflow-hidden`}>
                        <button onClick={() => toggleSection('color')} className="w-full p-5 flex items-center justify-between hover:bg-gray-50">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-pink-50 text-pink-500 flex items-center justify-center">
                                    <Palette size={20} />
                                </div>
                                <div className="text-left">
                                    <h3 className="font-bold text-gray-900">Renkler</h3>
                                    <p className="text-xs text-gray-500">Renkleri özelleştirin</p>
                                </div>
                            </div>
                            {activeDesignSection === 'color' ? <ChevronDown className="text-gray-400" /> : <ChevronRight className="text-gray-400" />}
                        </button>
                        {activeDesignSection === 'color' && (
                            <div className="p-5 pt-0 border-t border-gray-100 bg-gray-50/50 animate-in fade-in py-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 mb-2">QR Rengi</label>
                                        <div className="flex items-center gap-3 bg-white p-2 rounded-lg border border-gray-200">
                                            <input
                                                type="color"
                                                value={design.fgColor}
                                                onChange={(e) => handleDesignChange('fgColor', e.target.value)}
                                                className="w-8 h-8 rounded cursor-pointer border-0 p-0"
                                            />
                                            <span className="text-xs font-mono text-gray-500 uppercase">{design.fgColor}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 mb-2">Arka Plan</label>
                                        <div className="flex items-center gap-3 bg-white p-2 rounded-lg border border-gray-200">
                                            <input
                                                type="color"
                                                value={design.bgColor}
                                                onChange={(e) => handleDesignChange('bgColor', e.target.value)}
                                                className="w-8 h-8 rounded cursor-pointer border-0 p-0"
                                            />
                                            <span className="text-xs font-mono text-gray-500 uppercase">{design.bgColor}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                </div>

                {/* RIGHT PANEL: Preview */}
                <div className="hidden lg:flex flex-col w-1/2 bg-gray-100 items-center p-8 gap-4 h-[calc(100vh-64px)] sticky top-0 overflow-y-auto custom-scrollbar">

                    {/* Preview Toggle */}
                    <div className="bg-white rounded-xl p-1 shadow-sm border border-gray-200 flex w-[340px]">
                        <button
                            onClick={() => setActiveTab('preview')}
                            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors flex items-center justify-center gap-2 ${activeTab === 'preview' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            <ArrowRight size={16} /> Önizleme
                        </button>
                        <button
                            onClick={() => setActiveTab('qr')}
                            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors flex items-center justify-center gap-2 ${activeTab === 'qr' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            <Grid size={16} /> QR Kod
                        </button>
                    </div>

                    {activeTab === 'preview' ? (
                        // PHONE MOCKUP
                        <div className="relative mx-auto border-gray-900 bg-gray-900 border-[12px] rounded-[3rem] h-[600px] w-[300px] shadow-2xl animate-in fade-in duration-300 transform scale-90 sm:scale-100">
                            <div className="h-[32px] w-[3px] bg-gray-900 absolute -start-[15px] top-[72px] rounded-s-lg"></div>
                            <div className="h-[46px] w-[3px] bg-gray-900 absolute -start-[15px] top-[124px] rounded-s-lg"></div>
                            <div className="h-[46px] w-[3px] bg-gray-900 absolute -start-[15px] top-[178px] rounded-s-lg"></div>
                            <div className="h-[64px] w-[3px] bg-gray-900 absolute -end-[15px] top-[142px] rounded-e-lg"></div>
                            <div className="absolute top-0 inset-x-0 h-8 bg-gray-900 rounded-b-3xl w-40 mx-auto z-10"></div>

                            <div className="rounded-[2.4rem] overflow-hidden w-full h-full bg-white relative">
                                <div className="absolute inset-0 bg-blue-50 flex items-center justify-center p-6 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-b from-white via-purple-50 to-indigo-100 opacity-80"></div>

                                    {previewStatus !== 'hidden' && (
                                        <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 w-full shadow-2xl text-center relative z-10 transform translate-y-[-20px] border border-white/50 transition-all duration-300">
                                            {previewStatus === 'prompt' && (
                                                <>
                                                    <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-5 text-white shadow-lg shadow-blue-500/30">
                                                        <Wifi size={32} strokeWidth={2.5} />
                                                    </div>
                                                    <h3 className="text-gray-900 font-bold text-lg mb-2 leading-tight">
                                                        "{ssid || 'Wi-Fi Adı'}" kablosuz ağına bağlanılsın mı?
                                                    </h3>
                                                    <p className="text-gray-500 text-sm mb-6">
                                                        Ağ şifresi otomatik olarak paylaşılacaktır.
                                                    </p>
                                                    <div className="space-y-3">
                                                        <button
                                                            onClick={handleConnect}
                                                            className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold text-base shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-colors"
                                                        >
                                                            Bağlan
                                                        </button>
                                                        <button
                                                            onClick={() => setPreviewStatus('hidden')}
                                                            className="w-full py-3 text-blue-600 font-semibold text-base hover:bg-blue-50 rounded-xl transition-colors"
                                                        >
                                                            Vazgeç
                                                        </button>
                                                    </div>
                                                </>
                                            )}

                                            {previewStatus === 'connecting' && (
                                                <div className="py-8 flex flex-col items-center">
                                                    <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                                                    <p className="font-semibold text-gray-600">Bağlanılıyor...</p>
                                                </div>
                                            )}

                                            {previewStatus === 'success' && (
                                                <div className="py-2 animate-in fade-in zoom-in duration-300">
                                                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white shadow-lg shadow-green-500/30">
                                                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    </div>
                                                    <h3 className="text-gray-900 font-bold text-lg mb-2">Bağlandı!</h3>
                                                    <div className="bg-gray-100 rounded-lg p-3 mb-4">
                                                        <p className="text-xs text-gray-500 uppercase font-bold mb-1">Ağ Şifresi</p>
                                                        <p className="font-mono text-gray-800 text-lg tracking-wider">{password || 'Şifre Yok'}</p>
                                                    </div>
                                                    <button
                                                        onClick={() => setPreviewStatus('hidden')}
                                                        className="text-blue-600 font-semibold text-sm hover:underline"
                                                    >
                                                        Kapat
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        // QR CODE
                        <div className="bg-white rounded-[32px] p-8 w-[340px] h-auto shadow-2xl border border-gray-200 flex flex-col items-center justify-center gap-8 animate-in fade-in">
                            <h3 className="text-xl font-bold text-gray-800">QR Kod Önizleme</h3>
                            <div ref={qrRef} className="scale-110 p-4 border rounded-xl bg-gray-50">
                                <FrameRenderer
                                    frameId={design.frame}
                                    currentDesign={design}
                                    size={200}
                                    value={wifiString}
                                />
                            </div>
                            <div className="w-full space-y-3">
                                <button
                                    onClick={handleDownload}
                                    className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 hover:bg-blue-700 transition-all hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    <Download size={20} />
                                    PNG İndir
                                </button>
                                <p className="text-xs text-center text-gray-400">
                                    Yüksek çözünürlüklü .png formatında indirilir
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
