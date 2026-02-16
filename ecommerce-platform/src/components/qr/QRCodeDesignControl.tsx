import React from 'react';
import FrameRenderer, { QrDesignState } from './FrameRenderer';
import { FRAME_OPTIONS, PATTERN_OPTIONS, CORNER_OPTIONS } from './qr-constants';
import { ChevronDown, ChevronUp, Trash2, Image as ImageIcon } from 'lucide-react';

interface ColorPickerProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
}

const ColorPicker = ({ label, value, onChange }: ColorPickerProps) => (
    <div>
        <label className="block text-xs font-bold text-gray-500 mb-1">{label}</label>
        <div className="flex items-center gap-2">
            <input
                type="color"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-10 h-10 rounded-lg cursor-pointer border-2 border-gray-200 p-0.5"
            />
            <span className="text-xs text-gray-400 font-mono">{value}</span>
        </div>
    </div>
);

const MiniAccordion = ({ title, children }: { title: string, children: React.ReactNode }) => {
    const [isOpen, setIsOpen] = React.useState(false);
    return (
        <div className="border border-gray-100 rounded-lg overflow-hidden bg-white">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-2.5 bg-gray-50 hover:bg-gray-100 transition-colors text-xs font-bold text-gray-600"
            >
                {title}
                {isOpen ? <ChevronUp size={14} className="text-gray-400" /> : <ChevronDown size={14} className="text-gray-400" />}
            </button>
            {isOpen && <div className="p-2 border-t border-gray-100">{children}</div>}
        </div>
    );
};

interface QRCodeDesignControlProps {
    design: QrDesignState;
    onChange: (newDesign: QrDesignState) => void;
}

export default function QRCodeDesignControl({ design, onChange }: QRCodeDesignControlProps) {
    const updateDesign = (field: keyof QrDesignState, value: any) => {
        onChange({ ...design, [field]: value });
    };

    const updateGradient = (field: keyof typeof design.gradient, value: any) => {
        onChange({
            ...design,
            gradient: { ...design.gradient, [field]: value }
        });
    };

    return (
        <div className="space-y-6">
            {/* 1. Frames */}
            <div className="space-y-3 relative group/carousel">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Çerçeve Seçin</h3>

                <button
                    onClick={() => {
                        const container = document.getElementById('frame-scroll-container-mini');
                        if (container) container.scrollBy({ left: -150, behavior: 'smooth' });
                    }}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 p-1.5 rounded-full shadow-md hover:bg-white text-gray-700 opacity-0 group-hover/carousel:opacity-100 transition-opacity"
                >
                    <ChevronDown className="rotate-90" size={20} />
                </button>

                <div id="frame-scroll-container-mini" className="overflow-x-auto flex gap-3 pb-4 px-1 no-scrollbar snap-x snap-mandatory">
                    {FRAME_OPTIONS.map(option => (
                        <button
                            key={option.id}
                            onClick={() => updateDesign('frame', option.id)}
                            className={`flex-shrink-0 relative w-28 p-3 rounded-xl border-2 flex flex-col items-center gap-3 transition-all group hover:shadow-md bg-white snap-center
                                ${design.frame === option.id
                                    ? 'border-purple-600 shadow-lg ring-2 ring-purple-50 transform -translate-y-1'
                                    : 'border-gray-200 hover:-translate-y-1'
                                }`}
                        >
                            <div className="pointer-events-none transform group-hover:scale-105 transition-transform">
                                <FrameRenderer
                                    frameId={option.id}
                                    currentDesign={{ ...design, frame: option.id, frameLabel: option.editable ? (design.frameLabel || option.defaultLabel || '') : (option.defaultLabel || 'Scan Me') as string }}
                                    size={60}
                                    isSmall={true}
                                    value="https://example.com"
                                />
                            </div>
                            <span className={`text-[10px] font-bold ${design.frame === option.id ? 'text-purple-700' : 'text-gray-500'}`}>
                                {option.label}
                            </span>

                            {design.frame === option.id && (
                                <div className="absolute top-2 right-2 w-2 h-2 bg-purple-600 rounded-full border-2 border-white animate-pulse"></div>
                            )}

                            {option.editable && design.frame === option.id && (
                                <div
                                    className="absolute inset-x-0 bottom-0 bg-white/90 backdrop-blur-[1px] rounded-b-xl flex items-center justify-center p-2 z-20 animate-in fade-in slide-in-from-bottom-2"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <input
                                        type="text"
                                        placeholder="Etiket"
                                        className="w-full p-1 text-[10px] rounded border border-purple-300 outline-none text-center font-bold text-gray-800 focus:ring-1 focus:ring-purple-500"
                                        value={design.frameLabel}
                                        onChange={(e) => updateDesign('frameLabel', e.target.value)}
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                </div>
                            )}
                        </button>
                    ))}
                </div>

                <button
                    onClick={() => {
                        const container = document.getElementById('frame-scroll-container-mini');
                        if (container) container.scrollBy({ left: 150, behavior: 'smooth' });
                    }}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 p-1.5 rounded-full shadow-md hover:bg-white text-gray-700 opacity-0 group-hover/carousel:opacity-100 transition-opacity"
                >
                    <ChevronDown className="-rotate-90" size={20} />
                </button>
            </div>

            {/* 2. Patterns & Corners */}
            <div className="space-y-3 pt-4 border-t border-gray-100">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Desen & Köşe</h3>

                {/* Patterns */}
                <MiniAccordion title="Desen Tipi">
                    <div className="grid grid-cols-10 gap-1">
                        {PATTERN_OPTIONS.map(option => (
                            <button
                                key={option.id}
                                onClick={() => updateDesign('pattern', option.id)}
                                className={`aspect-square flex flex-col items-center justify-center p-0.5 rounded-md border transition-all ${design.pattern === option.id
                                    ? 'border-purple-600 bg-purple-50 text-purple-700'
                                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                                    }`}
                                title={option.label}
                            >
                                <div className="transform scale-125">
                                    {option.icon}
                                </div>
                            </button>
                        ))}
                    </div>
                </MiniAccordion>

                {/* Corners */}
                <MiniAccordion title="Köşe Stili">
                    <div className="grid grid-cols-10 gap-1">
                        {CORNER_OPTIONS.map(option => (
                            <button
                                key={option.id}
                                onClick={() => updateDesign('cornerStyle', option.id)}
                                className={`aspect-square flex flex-col items-center justify-center p-0.5 rounded-md border transition-all ${design.cornerStyle === option.id
                                    ? 'border-purple-600 bg-purple-50 text-purple-700'
                                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                                    }`}
                                title={option.label}
                            >
                                <div className="transform scale-125">
                                    {option.icon}
                                </div>
                            </button>
                        ))}
                    </div>
                </MiniAccordion>
            </div>

            {/* 3. Logo */}
            <div className="space-y-4 pt-4 border-t border-gray-100">
                <MiniAccordion title="Logo Ekle">
                    <div className="flex items-center gap-4">
                        {design.logo ? (
                            <div className="relative w-16 h-16 border rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center group">
                                <img src={design.logo} alt="Logo" className="w-full h-full object-contain" />
                                <button
                                    onClick={() => updateDesign('logo', null)}
                                    className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ) : (
                            <label className="flex flex-col items-center justify-center w-16 h-16 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition-colors">
                                <ImageIcon size={20} className="text-gray-400" />
                                <span className="text-[10px] text-gray-500 font-bold mt-1">Yükle</span>
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            const reader = new FileReader();
                                            reader.onload = (ev) => updateDesign('logo', ev.target?.result as string);
                                            reader.readAsDataURL(file);
                                        }
                                    }}
                                />
                            </label>
                        )}
                        <div className="flex-1">
                            <p className="text-xs text-gray-500">
                                QR kodun ortasına logonuzu ekleyin.
                                <br />
                                <span className="text-[10px] text-gray-400">Şeffaf arkaplanlı PNG önerilir.</span>
                            </p>
                        </div>
                    </div>
                </MiniAccordion>
            </div>

            {/* 4. Colors */}
            <div className="space-y-4 pt-4 border-t border-gray-100">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Renkler</h3>

                <div className="grid grid-cols-2 gap-4">
                    <ColorPicker label="QR Rengi" value={design.fgColor} onChange={(v) => updateDesign('fgColor', v)} />
                    <ColorPicker label="Arka Plan" value={design.bgColor} onChange={(v) => updateDesign('bgColor', v)} />
                    <ColorPicker label="Köşe Rengi" value={design.cornerColor} onChange={(v) => updateDesign('cornerColor', v)} />
                </div>

                {/* Gradient Toggle */}
                <div className="pt-2">
                    <label className="flex items-center gap-2 cursor-pointer mb-2">
                        <input
                            type="checkbox"
                            checked={design.gradient.enabled}
                            onChange={(e) => updateGradient('enabled', e.target.checked)}
                            className="rounded text-purple-600"
                        />
                        <span className="text-sm font-bold text-gray-700">Gradient Kullan</span>
                    </label>

                    {design.gradient.enabled && (
                        <div className="grid grid-cols-2 gap-4 animate-in fade-in">
                            <ColorPicker label="Başlangıç" value={design.gradient.start} onChange={(v) => updateGradient('start', v)} />
                            <ColorPicker label="Bitiş" value={design.gradient.end} onChange={(v) => updateGradient('end', v)} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
