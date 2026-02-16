import React from 'react';
import { Pen, Type, Highlighter, Eraser, Image as ImageIcon, MousePointer2, Save, Download, Share2, Search, Lock, Minimize2, Trash2 } from 'lucide-react';

export type ToolType = 'select' | 'draw' | 'text' | 'highlight' | 'eraser' | 'shape';

interface ToolbarProps {
    activeTool: ToolType;
    onToolChange: (tool: ToolType) => void;
    brushColor?: string;
    onBrushColorChange?: (color: string) => void;
    brushWidth?: number;
    onBrushWidthChange?: (width: number) => void;
    onSave: () => void;
    onDownload: () => void;
    onShare: () => void;

    // New Features
    isSearchEnabled?: boolean;
    onSearchToggle?: () => void;
    onEncrypt?: () => void;
    isEncrypted?: boolean;
    onCompressToggle?: () => void;
    isCompressed?: boolean;
}

export const Toolbar: React.FC<ToolbarProps> = ({
    activeTool,
    onToolChange,
    brushColor = '#000000',
    onBrushColorChange,
    brushWidth = 3,
    onBrushWidthChange,
    onSave,
    onDownload,
    onShare,
    isSearchEnabled,
    onSearchToggle,
    onEncrypt,
    isEncrypted,
    onCompressToggle,
    isCompressed
}) => {

    const tools = [
        { id: 'select', icon: <MousePointer2 size={20} />, label: 'Seç' },
        { id: 'draw', icon: <Pen size={20} />, label: 'Çiz' },
        { id: 'text', icon: <Type size={20} />, label: 'Yazı' },
        { id: 'highlight', icon: <Highlighter size={20} />, label: 'Vurgula' },
        { id: 'eraser', icon: <Eraser size={20} />, label: 'Sil' },
    ];

    const colors = ['#000000', '#ef4444', '#3b82f6', '#22c55e', '#eab308', '#a855f7'];
    const widths = [2, 4, 8, 12];

    const showDrawingControls = activeTool === 'draw' || activeTool === 'highlight';

    return (
        <div className="h-16 bg-white border-b flex items-center px-4 justify-between shadow-sm z-20">
            <div>
                <div className="flex items-center gap-2">
                    {tools.map((t) => (
                        <button
                            key={t.id}
                            onClick={() => onToolChange(t.id as ToolType)}
                            className={`p-2 rounded-lg flex flex-col items-center gap-1 min-w-[60px] transition-all
                                ${activeTool === t.id ? 'bg-blue-50 text-blue-600 ring-2 ring-blue-100' : 'hover:bg-gray-50 text-gray-600'}`}
                        >
                            {t.icon}
                            <span className="text-[10px] font-medium">{t.label}</span>
                        </button>
                    ))}
                </div>

                {showDrawingControls && onBrushColorChange && onBrushWidthChange && (
                    <>
                        <div className="w-px h-8 bg-gray-200"></div>

                        {/* Colors */}
                        <div className="flex items-center gap-2">
                            {colors.map(c => (
                                <button
                                    key={c}
                                    onClick={() => onBrushColorChange(c)}
                                    className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${brushColor === c ? 'border-gray-400 scale-110' : 'border-transparent'}`}
                                    style={{ backgroundColor: c }}
                                    title={c}
                                />
                            ))}
                        </div>

                        <div className="w-px h-8 bg-gray-200"></div>

                        {/* Widths */}
                        <div className="flex items-center gap-2">
                            {widths.map(w => (
                                <button
                                    key={w}
                                    onClick={() => onBrushWidthChange(w)}
                                    className={`w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 ${brushWidth === w ? 'bg-gray-100 ring-1 ring-gray-300' : ''}`}
                                    title={`${w}px`}
                                >
                                    <div
                                        className="rounded-full bg-gray-800"
                                        style={{ width: w, height: w }}
                                    />
                                </button>
                            ))}
                        </div>
                    </>
                )}
            </div>

            <div className="flex items-center gap-3">
                <button
                    onClick={onSearchToggle}
                    className={`p-2 rounded-full hidden sm:block transition-colors ${isSearchEnabled ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100 text-gray-500'}`}
                    title="Metin Seçimi / Arama (Ctrl+F)"
                >
                    <Search size={20} />
                </button>
                <button
                    onClick={onEncrypt}
                    className={`p-2 rounded-full hidden sm:block transition-colors ${isEncrypted ? 'bg-green-100 text-green-600' : 'hover:bg-gray-100 text-gray-500'}`}
                    title={isEncrypted ? "Şifrelendi" : "Şifrele"}
                >
                    <Lock size={20} />
                </button>
                <button
                    onClick={onCompressToggle}
                    className={`p-2 rounded-full hidden sm:block transition-colors ${isCompressed ? 'bg-orange-100 text-orange-600' : 'hover:bg-gray-100 text-gray-500'}`}
                    title={isCompressed ? "Sıkıştırma Açık" : "Sıkıştır (Küçült)"}
                >
                    <Minimize2 size={20} />
                </button>

                <div className="w-px h-8 bg-gray-200 mx-2"></div>

                <button
                    onClick={onDownload}
                    className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-black transition-colors"
                >
                    <Download size={18} />
                    <span className="font-bold text-sm hidden sm:inline">İndir</span>
                </button>

                <button
                    onClick={onShare}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Share2 size={18} />
                    <span className="font-bold text-sm hidden sm:inline">Paylaş</span>
                </button>
            </div>
        </div>
    );
};
