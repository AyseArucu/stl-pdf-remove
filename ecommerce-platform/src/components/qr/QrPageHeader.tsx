import React from 'react';
import { ArrowLeft, Download, Share2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface QrPageHeaderProps {
    title: string;
    icon?: React.ReactNode;
    activeTab: 'content' | 'qr';
    onTabChange: (tab: 'content' | 'qr') => void;
    onSave: () => void;
    isSaving: boolean;
    saveLabel?: string;
}

export default function QrPageHeader({
    title,
    icon,
    activeTab,
    onTabChange,
    onSave,
    isSaving,
    saveLabel = 'Oluştur'
}: QrPageHeaderProps) {
    const router = useRouter();

    return (
        <header className="bg-white border-b px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
            <div className="flex items-center gap-4">
                <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <ArrowLeft size={20} className="text-gray-600" />
                </button>
                <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    {icon}
                    {title}
                </h1>
            </div>
            <div className="flex items-center gap-3">
                <div className="flex bg-gray-100 p-1 rounded-lg">
                    <button
                        onClick={() => onTabChange('content')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'content' ? 'bg-white shadow text-pink-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        İçerik
                    </button>
                    <button
                        onClick={() => onTabChange('qr')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'qr' ? 'bg-white shadow text-pink-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        QR Kod
                    </button>
                </div>
                <button onClick={onSave} disabled={isSaving} className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-lg shadow-pink-200">
                    {isSaving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Download size={18} />}
                    {isSaving ? 'Kaydediliyor...' : saveLabel}
                </button>
            </div>
        </header>
    );
}
