
import React from 'react';
import CustomQRCode from '@/components/CustomQRCode';
import { DesignState } from './constants';

interface FrameRendererProps {
    frameId: string;
    currentDesign: DesignState;
    size?: number;
    isSmall?: boolean;
    value: string;
}

const FrameRenderer: React.FC<FrameRendererProps> = ({
    frameId,
    currentDesign,
    size = 200,
    isSmall = false,
    value
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

export default FrameRenderer;
