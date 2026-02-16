import React from 'react';
import CustomQRCode, { PatternType, GradientType, CornerType } from '@/components/CustomQRCode';
import {
    LayoutGrid,
    Box,
    Circle,
    Heart,
    Diamond,
    Square
} from 'lucide-react';

// --- Types ---
export interface QrDesignState {
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

// --- Constants ---
export const FRAME_OPTIONS = [
    // Simple
    { id: 'none', label: 'Yok', category: 'simple', editable: false },
    { id: 'border', label: 'Kare', category: 'simple', editable: false },
    { id: 'border-thick', label: 'Kalın', category: 'simple', editable: false },
    { id: 'rounded', label: 'Yuvarlak', category: 'simple', editable: false },
    { id: 'modern-thin', label: 'Modern', category: 'simple', editable: false },
    // Labeled
    { id: 'label-bottom', label: 'Alt Etiket', defaultLabel: 'SCAN ME', editable: true },
    { id: 'label-top', label: 'Üst Etiket', defaultLabel: 'SCAN ME', editable: true },
    { id: 'bubble-top', label: 'Baloncuk', defaultLabel: 'SCAN ME', editable: true },
    { id: 'handwriting', label: 'El Yazısı', defaultLabel: 'Scan Me', editable: true },
    // Concepts
    { id: 'phone', label: 'Telefon', defaultLabel: 'Instagram', editable: true },
    { id: 'mug', label: 'Kupa', defaultLabel: 'Coffee', editable: true },
    { id: 'cup-coffee', label: 'Kahve', defaultLabel: 'Hot!', editable: true },
    { id: 'bag', label: 'Çanta', defaultLabel: 'Sale', editable: true },
    { id: 'envelope', label: 'Zarf', defaultLabel: 'Open Me', editable: true },
    { id: 'gift', label: 'Hediye', defaultLabel: 'Gift', editable: true },
    { id: 'scooter', label: 'Teslimat', defaultLabel: 'Order', editable: true },
    { id: 'hand', label: 'El', defaultLabel: 'Scan', editable: true },
    { id: 'polaroid', label: 'Polaroid', defaultLabel: 'Memory', editable: true },
];

export const PATTERN_OPTIONS: { id: PatternType; label: string; icon: React.ReactNode }[] = [
    { id: 'square', label: 'Klasik', icon: <LayoutGrid size={20} /> },
    { id: 'rounded', label: 'Yuvarlak', icon: <Box size={20} className="rounded-md" /> },
    { id: 'soft', label: 'Yumuşak', icon: <Box size={20} className="rounded-sm" /> },
    { id: 'dot', label: 'Nokta', icon: <Circle size={20} /> },
    { id: 'heart', label: 'Kalp', icon: <Heart size={20} /> },
    { id: 'diamond', label: 'Elmas', icon: <Diamond size={20} /> },
];

export const CORNER_OPTIONS: { id: CornerType; label: string; icon: React.ReactNode }[] = [
    { id: 'square', label: 'Kare', icon: <Square size={20} /> },
    { id: 'rounded', label: 'Yuvarlak', icon: <Box size={20} className="rounded-lg" /> },
    { id: 'extra-rounded', label: 'Yastık', icon: <Box size={20} className="rounded-2xl" /> },
    { id: 'dot', label: 'Nokta', icon: <Circle size={20} className="border-4" /> },
];

interface FrameRendererProps {
    frameId: string;
    currentDesign: QrDesignState;
    size?: number;
    isSmall?: boolean;
    value: string;
}

const FrameRenderer = ({
    frameId,
    currentDesign,
    size = 200,
    isSmall = false,
    value
}: FrameRendererProps) => {
    const effectiveLabel = currentDesign.frameLabel || 'Scan Me';
    const fg = currentDesign.fgColor;
    const labelColor = currentDesign.gradient.enabled ? currentDesign.gradient.start : fg;

    // Base QR Component
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
    const labelStyle = { color: labelColor, fontSize: fontSize, fontWeight: 'bold' as const };
    const containerStyle = { background: 'white', display: 'flex', flexDirection: 'column' as const, alignItems: 'center' };

    // --- Frame Logic ---

    // 0. No Frame
    if (frameId === 'none') return <div className={`bg-white rounded-xl shadow-sm ${isSmall ? 'p-1' : 'p-4'}`}>{QR}</div>;

    // 1. SIMPLE FRAMES
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
            <div className="flex flex-col items-center">
                <div className={`bg-black text-white px-4 py-2 rounded-full mb-2 relative ${isSmall ? 'text-[8px] px-2 py-1' : 'text-sm'}`} style={{ backgroundColor: labelColor }}>
                    {effectiveLabel}
                    {/* Triangle pointer */}
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45" style={{ backgroundColor: labelColor }}></div>
                </div>
                <div className={`bg-white shadow-md p-4 rounded-xl border-2 border-gray-100`}>{QR}</div>
            </div>
        )
    }

    // 3. CONCEPT FRAMES (Simplified placeholders for now, duplicating logic from CouponQR)
    if (frameId === 'phone') {
        return (
            <div className="relative bg-gray-900 rounded-[30px] p-2 border-4 border-gray-800 shadow-xl">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-4 bg-black rounded-b-lg z-10"></div>
                <div className="bg-white rounded-[24px] overflow-hidden flex flex-col items-center pt-8 pb-4">
                    <div className="text-center mb-2 px-2">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{effectiveLabel}</span>
                    </div>
                    <div className="scale-90">{QR}</div>
                </div>
            </div>
        );
    }

    // Default Fallback
    return <div className={`border-4 border-gray-300 ${isSmall ? 'p-1' : 'p-4'}`}>{QR}</div>;
};

export default FrameRenderer;
