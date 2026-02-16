'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import {
    QrCode, Download, Palette, Utensils, Clock, MapPin,
    Phone, Globe, ChevronDown, ChevronUp, Plus, Trash2,
    GripVertical, Image as ImageIcon, ExternalLink, X,
    Smartphone, ChefHat, Coffee, Pizza, Search, ArrowRight, ArrowLeft,
    Facebook, Instagram, Twitter, Youtube, Linkedin, Mail, MessageCircle,
    Wheat, Milk, Leaf, Nut, Flame // Allergen Icons
} from 'lucide-react';
import QrPageHeader from '@/components/qr/QrPageHeader';
import FrameRenderer, { QrDesignState } from '@/components/qr/FrameRenderer';
import QRCodeDesignControl from '@/components/qr/QRCodeDesignControl';
import MenuTemplate from '@/components/qr/MenuTemplate';
import html2canvas from 'html2canvas';

// --- Types ---

type Allergen = 'gluten' | 'lactose' | 'vegan' | 'nuts' | 'spicy';

type MenuItem = {
    id: string;
    name: string;
    description: string;
    price: string;
    image: string | null;
    allergens: Allergen[]; // Changed from string[] to specific type
};

type MenuCategory = {
    id: string;
    name: string;
    items: MenuItem[];
};

type OpeningHoursDay = {
    day: string;
    open: string;
    close: string;
    closed: boolean;
};

type SocialItem = {
    id: string;
    platform: 'instagram' | 'tiktok' | 'youtube' | 'facebook' | 'twitter' | 'whatsapp' | 'website' | 'linkedin' | 'google';
    url: string;
    active: boolean;
};

interface MenuState {
    design: {
        themeId: string;
        primaryColor: string;
        bgColor: string;
        textColor: string;
        headerColor: string;
        backgroundImage: string | null;
    };
    qrDesign: QrDesignState;
    restaurantInfo: {
        name: string;
        description: string;
        logo: string | null;
        coverImage: string | null;
    };
    menu: {
        categories: MenuCategory[];
    };
    openingHours: {
        enabled: boolean;
        days: OpeningHoursDay[];
    };
    contact: {
        phone: string;
        email: string;
        address: string;
        website: string;
    };
    socials: SocialItem[];
    fonts: {
        header: string;
        text: string;
    };
    welcomeScreen: {
        enabled: boolean;
        image: string | null;
    };
    settings: {
        name: string;
        password: string;
    };
}

const INITIAL_OPENING_HOURS: OpeningHoursDay[] = [
    { day: 'Pazartesi', open: '09:00', close: '22:00', closed: false },
    { day: 'Salı', open: '09:00', close: '22:00', closed: false },
    { day: 'Çarşamba', open: '09:00', close: '22:00', closed: false },
    { day: 'Perşembe', open: '09:00', close: '22:00', closed: false },
    { day: 'Cuma', open: '09:00', close: '23:00', closed: false },
    { day: 'Cumartesi', open: '10:00', close: '23:00', closed: false },
    { day: 'Pazar', open: '10:00', close: '22:00', closed: false },
];

const SOCIAL_PLATFORMS = [
    { id: 'instagram', label: 'Instagram', icon: <Instagram size={20} />, color: 'text-pink-600', bg: 'bg-pink-50' },
    { id: 'facebook', label: 'Facebook', icon: <Facebook size={20} />, color: 'text-blue-600', bg: 'bg-blue-50' },
    { id: 'twitter', label: 'X (Twitter)', icon: <Twitter size={20} />, color: 'text-black', bg: 'bg-gray-100' },
    { id: 'youtube', label: 'YouTube', icon: <Youtube size={20} />, color: 'text-red-600', bg: 'bg-red-50' },
    { id: 'tiktok', label: 'TikTok', icon: <span className="font-bold text-lg leading-none">Tk</span>, color: 'text-black', bg: 'bg-gray-100' }, // Placeholder icon
    { id: 'whatsapp', label: 'WhatsApp', icon: <MessageCircle size={20} />, color: 'text-green-600', bg: 'bg-green-50' },
    { id: 'google', label: 'Google Maps', icon: <MapPin size={20} />, color: 'text-red-500', bg: 'bg-red-50' },
    { id: 'website', label: 'Website', icon: <Globe size={20} />, color: 'text-blue-500', bg: 'bg-blue-50' },
];

const ALLERGENS: { id: Allergen, label: string, icon: React.ReactNode, color: string, bg: string }[] = [
    { id: 'gluten', label: 'Gluten', icon: <Wheat size={14} />, color: 'text-yellow-600', bg: 'bg-yellow-100' },
    { id: 'lactose', label: 'Laktoz', icon: <Milk size={14} />, color: 'text-blue-600', bg: 'bg-blue-100' },
    { id: 'vegan', label: 'Vegan', icon: <Leaf size={14} />, color: 'text-green-600', bg: 'bg-green-100' },
    { id: 'nuts', label: 'Kuruyemiş', icon: <Nut size={14} />, color: 'text-brown-600', bg: 'bg-orange-100' },
    { id: 'spicy', label: 'Acı', icon: <Flame size={14} />, color: 'text-red-600', bg: 'bg-red-100' },
];

const INITIAL_STATE: MenuState = {
    design: {
        themeId: 'custom',
        primaryColor: '#F97316', // Orange-500
        bgColor: '#FDFBF7', // Stone-50
        textColor: '#1F2937', // Gray-800
        headerColor: '#FFFFFF',
        backgroundImage: null,
    },
    qrDesign: {
        frame: 'none',
        frameLabel: 'SCAN MENU',
        pattern: 'square',
        cornerStyle: 'square',
        cornerColor: '#000000',
        logo: null,
        fgColor: '#000000',
        bgColor: '#ffffff',
        gradient: { enabled: false, start: '#000000', end: '#000000' }
    },
    restaurantInfo: {
        name: 'Lezzet Durağı',
        description: 'Yerel kaynaklı malzemelerle hazırlanan taze, lezzetli ve besleyici yemekler.',
        logo: null,
        coverImage: null,
    },
    menu: {
        categories: [
            {
                id: 'cat1',
                name: 'Başlangıçlar',
                items: [
                    { id: 'item1', name: 'Günün Çorbası', description: 'Mevsim sebzeleri ile hazırlanan özel çorba.', price: '80 ₺', image: null, allergens: ['vegan'] },
                    { id: 'item2', name: 'Bruschetta', description: 'Domates, fesleğen ve sarımsaklı ekmek.', price: '120 ₺', image: null, allergens: ['gluten'] },
                ]
            },
            {
                id: 'cat2',
                name: 'Ana Yemekler',
                items: [
                    { id: 'item3', name: 'Izgara Köfte', description: 'Özel baharatlarla hazırlanmış dana köfte, pilav ile.', price: '280 ₺', image: null, allergens: [] },
                ]
            }
        ]
    },
    openingHours: {
        enabled: true,
        days: INITIAL_OPENING_HOURS
    },
    contact: {
        phone: '05396649999',
        email: 'erashugaming@gmail.com',
        address: 'İstanbul Üsküdar',
        website: 'https://www.erashugaming.com'
    },
    socials: [
        { id: 's1', platform: 'instagram', url: '', active: true },
        { id: 's2', platform: 'google', url: '', active: true },
    ],
    fonts: {
        header: 'Inter',
        text: 'Inter'
    },
    welcomeScreen: {
        enabled: false,
        image: null
    },
    settings: {
        name: '',
        password: ''
    }
};

const AccordionItem = ({ title, icon, children, isOpen, onToggle }: { title: string, icon: React.ReactNode, children: React.ReactNode, isOpen: boolean, onToggle: () => void }) => (
    <div className="bg-white border text-left border-gray-200 rounded-xl overflow-hidden shadow-sm transition-all duration-200">
        <button
            onClick={onToggle}
            className="flex items-center justify-between w-full p-4 hover:bg-gray-50 transition-colors"
        >
            <div className="flex items-center gap-3 font-semibold text-gray-700">
                <span className="text-orange-500">{icon}</span>
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

export default function MenuQRPage() {
    const router = useRouter();
    const { user } = useUser();
    const [state, setState] = useState<MenuState>(INITIAL_STATE);
    const [activeTab, setActiveTab] = useState<'content' | 'qr'>('content');
    const [activeSection, setActiveSection] = useState<string | null>('restaurant');
    // Navigation State for Preview
    const [activeCategory, setActiveCategory] = useState<string | null>(null);

    const [createdQr, setCreatedQr] = useState<{ id: string, qrImage: string } | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const qrRef = useRef<HTMLDivElement>(null);

    const toggleSection = (section: string) => {
        setActiveSection(activeSection === section ? null : section);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'logo' | 'cover' | 'welcome' | 'background' | { type: 'item', catId: string, itemId: string }) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const result = event.target?.result as string;
                if (target === 'logo') {
                    setState(prev => ({ ...prev, restaurantInfo: { ...prev.restaurantInfo, logo: result } }));
                } else if (target === 'cover') {
                    setState(prev => ({ ...prev, restaurantInfo: { ...prev.restaurantInfo, coverImage: result } }));
                } else if (target === 'welcome') {
                    setState(prev => ({ ...prev, welcomeScreen: { ...prev.welcomeScreen, image: result } }));
                } else if (target === 'background') {
                    setState(prev => ({ ...prev, design: { ...prev.design, backgroundImage: result } }));
                } else if (typeof target === 'object' && target.type === 'item') {
                    setState(prev => {
                        const newCategories = prev.menu.categories.map(cat => {
                            if (cat.id === target.catId) {
                                return {
                                    ...cat,
                                    items: cat.items.map(item => item.id === target.itemId ? { ...item, image: result } : item)
                                };
                            }
                            return cat;
                        });
                        return { ...prev, menu: { ...prev.menu, categories: newCategories } };
                    });
                }
            };
            reader.readAsDataURL(file);
        }
    };

    // --- Menu Management ---
    const addCategory = () => {
        setState(prev => ({
            ...prev,
            menu: {
                categories: [
                    ...prev.menu.categories,
                    { id: Date.now().toString(), name: 'Yeni Kategori', items: [] }
                ]
            }
        }));
    };

    const deleteCategory = (id: string) => {
        setState(prev => ({
            ...prev,
            menu: { categories: prev.menu.categories.filter(c => c.id !== id) }
        }));
    };

    const updateCategory = (id: string, name: string) => {
        setState(prev => ({
            ...prev,
            menu: {
                categories: prev.menu.categories.map(c => c.id === id ? { ...c, name } : c)
            }
        }));
    };

    const addItem = (catId: string) => {
        setState(prev => ({
            ...prev,
            menu: {
                categories: prev.menu.categories.map(c => {
                    if (c.id === catId) {
                        return {
                            ...c,
                            items: [
                                ...c.items,
                                { id: Date.now().toString(), name: 'Yeni Ürün', description: '', price: '', image: null, allergens: [] }
                            ]
                        };
                    }
                    return c;
                })
            }
        }));
    };

    const deleteItem = (catId: string, itemId: string) => {
        setState(prev => ({
            ...prev,
            menu: {
                categories: prev.menu.categories.map(c => {
                    if (c.id === catId) {
                        return { ...c, items: c.items.filter(i => i.id !== itemId) };
                    }
                    return c;
                })
            }
        }));
    };

    const updateItem = (catId: string, itemId: string, field: keyof MenuItem, value: any) => {
        setState(prev => ({
            ...prev,
            menu: {
                categories: prev.menu.categories.map(c => {
                    if (c.id === catId) {
                        return {
                            ...c,
                            items: c.items.map(i => i.id === itemId ? { ...i, [field]: value } : i)
                        };
                    }
                    return c;
                })
            }
        }));
    };

    const toggleAllergen = (catId: string, itemId: string, allergen: Allergen) => {
        setState(prev => ({
            ...prev,
            menu: {
                categories: prev.menu.categories.map(c => {
                    if (c.id === catId) {
                        return {
                            ...c,
                            items: c.items.map(i => {
                                if (i.id === itemId) {
                                    const hasAllergen = i.allergens.includes(allergen);
                                    return {
                                        ...i,
                                        allergens: hasAllergen
                                            ? i.allergens.filter(a => a !== allergen)
                                            : [...i.allergens, allergen]
                                    };
                                }
                                return i;
                            })
                        };
                    }
                    return c;
                })
            }
        }));
    };

    // --- Social & Contact Management ---
    const addSocial = (platformId: string) => {
        if (state.socials.find(s => s.platform === platformId)) return;
        const newSocial: SocialItem = {
            id: Date.now().toString(),
            platform: platformId as any,
            url: '',
            active: true
        };
        setState(prev => ({ ...prev, socials: [...prev.socials, newSocial] }));
    };

    const removeSocial = (id: string) => {
        setState(prev => ({ ...prev, socials: prev.socials.filter(s => s.id !== id) }));
    };

    const updateSocial = (id: string, url: string) => {
        setState(prev => ({
            ...prev,
            socials: prev.socials.map(s => s.id === id ? { ...s, url } : s)
        }));
    };


    // --- Actions ---
    const handleSave = async () => {
        setIsSaving(true);
        setTimeout(() => {
            setCreatedQr({ id: 'dummy-id', qrImage: '' });
            setIsSaving(false);
        }, 1000);
    };

    const downloadQrCode = async () => {
        if (!qrRef.current) return;
        try {
            const canvas = await html2canvas(qrRef.current, { backgroundColor: null });
            const url = canvas.toDataURL('image/png');
            const a = document.createElement('a');
            a.href = url;
            a.download = `menu-qr.png`;
            a.click();
        } catch (err) {
            console.error('Download failed', err);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <QrPageHeader
                title="Dijital Menü"
                icon={<Utensils className="text-orange-600" />}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                onSave={handleSave}
                isSaving={isSaving}
                saveLabel="QR Oluştur"
            />

            <div className="flex flex-1 lg:flex-row flex-col max-w-[1600px] mx-auto w-full p-6 gap-8">
                {/* LEFT PANEL: EDITOR */}
                <div className="flex-1 min-w-[350px] space-y-4 overflow-y-auto max-h-[calc(100vh-120px)] pr-2 custom-scrollbar">
                    {activeTab === 'content' ? (
                        <>
                            <h2 className="text-lg font-bold mb-4">Menü İçeriğini Düzenle</h2>

                            {/* 1. TASARIM */}
                            <AccordionItem title="Tasarım" icon={<Palette size={20} />} isOpen={activeSection === 'design'} onToggle={() => toggleSection('design')}>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 mb-2">Ana Renk</label>
                                            <div className="flex items-center gap-2">
                                                <input type="color" value={state.design.primaryColor} onChange={(e) => setState(prev => ({ ...prev, design: { ...prev.design, primaryColor: e.target.value } }))} className="w-10 h-10 rounded cursor-pointer border-none p-0" />
                                                <input type="text" value={state.design.primaryColor} readOnly className="flex-1 border rounded p-2 text-xs" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 mb-2">Arka Plan Rengi</label>
                                            <div className="flex items-center gap-2">
                                                <input type="color" value={state.design.bgColor} onChange={(e) => setState(prev => ({ ...prev, design: { ...prev.design, bgColor: e.target.value, backgroundImage: null } }))} className="w-10 h-10 rounded cursor-pointer border-none p-0" />
                                                <input type="text" value={state.design.bgColor} readOnly className="flex-1 border rounded p-2 text-xs" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Background Image Upload */}
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-2">Arka Plan Görseli</label>
                                        <div className="flex items-center gap-4">
                                            {state.design.backgroundImage ? (
                                                <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200 group">
                                                    <img src={state.design.backgroundImage} className="w-full h-full object-cover" />
                                                    <button
                                                        onClick={() => setState(prev => ({ ...prev, design: { ...prev.design, backgroundImage: null } }))}
                                                        className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <label className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:border-orange-500 hover:text-orange-500 transition-colors">
                                                    <ImageIcon size={20} />
                                                    <span className="text-[10px] mt-1">Yükle</span>
                                                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'background')} />
                                                </label>
                                            )}
                                            <div className="text-xs text-gray-400 flex-1">
                                                Sayfanın arka planına görsel ekleyebilirsiniz. Görsel eklendiğinde arka plan rengi yerine geçer.
                                            </div>
                                        </div>
                                    </div>

                                    {/* Header/Cover Image Upload */}
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-2">Üst Kısım (Kapak) Görseli</label>
                                        <div className="flex items-center gap-4">
                                            {state.restaurantInfo.coverImage ? (
                                                <div className="relative w-full h-24 rounded-lg overflow-hidden border border-gray-200 group">
                                                    <img src={state.restaurantInfo.coverImage} className="w-full h-full object-cover" />
                                                    <button
                                                        onClick={() => setState(prev => ({ ...prev, restaurantInfo: { ...prev.restaurantInfo, coverImage: null } }))}
                                                        className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <label className="w-full h-24 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:border-orange-500 hover:text-orange-500 transition-colors">
                                                    <ImageIcon size={24} />
                                                    <span className="text-xs mt-2">Kapak Görseli Yükle</span>
                                                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'cover')} />
                                                </label>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </AccordionItem>

                            {/* 2. RESTORAN BİLGİLERİ */}
                            <AccordionItem title="Restoran Bilgileri" icon={<ChefHat size={20} />} isOpen={activeSection === 'restaurant'} onToggle={() => toggleSection('restaurant')}>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4">
                                        <label className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center cursor-pointer border-2 border-dashed hover:border-orange-500 relative overflow-hidden group">
                                            {state.restaurantInfo.logo ? (
                                                <img src={state.restaurantInfo.logo} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="text-gray-400 text-center"><ImageIcon size={24} className="mx-auto mb-1" /><span className="text-[10px]">Logo</span></div>
                                            )}
                                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'logo')} />
                                        </label>
                                        <div className="flex-1 space-y-2">
                                            <label className="block text-xs font-bold text-gray-500">Kapak Görseli</label>
                                            <label className="block w-full py-2 px-4 border border-dashed rounded-lg text-center text-sm text-gray-500 cursor-pointer hover:bg-gray-50">
                                                {state.restaurantInfo.coverImage ? 'Görseli Değiştir' : 'Görsel Yükle'}
                                                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'cover')} />
                                            </label>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-2">Restoran Adı</label>
                                        <input type="text" value={state.restaurantInfo.name} onChange={(e) => setState(prev => ({ ...prev, restaurantInfo: { ...prev.restaurantInfo, name: e.target.value } }))} className="w-full border rounded p-2" placeholder="Örn: Lezzet Durağı" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-2">Açıklama</label>
                                        <textarea value={state.restaurantInfo.description} onChange={(e) => setState(prev => ({ ...prev, restaurantInfo: { ...prev.restaurantInfo, description: e.target.value } }))} className="w-full border rounded p-2 h-20 resize-none" placeholder="Kısa bir tanıtım yazısı..." />
                                    </div>
                                </div>
                            </AccordionItem>

                            {/* 3. MENÜ İÇERİĞİ */}
                            <AccordionItem title="Menü" icon={<Utensils size={20} />} isOpen={activeSection === 'menu'} onToggle={() => toggleSection('menu')}>
                                <div className="space-y-6">
                                    {state.menu.categories.map((cat, catIndex) => (
                                        <div key={cat.id} className="border border-gray-200 rounded-xl p-4 bg-gray-50/50">
                                            <div className="flex items-center gap-2 mb-4">
                                                <GripVertical size={16} className="text-gray-400 cursor-grab" />
                                                <input
                                                    type="text"
                                                    value={cat.name}
                                                    onChange={(e) => updateCategory(cat.id, e.target.value)}
                                                    className="flex-1 font-bold text-lg bg-transparent border-b border-transparent focus:border-orange-500 outline-none"
                                                    placeholder="Kategori Adı (Örn: Başlangıçlar)"
                                                />
                                                <button onClick={() => deleteCategory(cat.id)} className="text-gray-400 hover:text-red-500 p-2"><Trash2 size={16} /></button>
                                            </div>

                                            <div className="space-y-3 pl-4 border-l-2 border-gray-200">
                                                {cat.items.map((item) => (
                                                    <div key={item.id} className="bg-white rounded-lg p-3 shadow-sm border border-gray-100 flex gap-3 items-start flex-col">
                                                        <div className="flex gap-3 w-full items-start">
                                                            <label className="w-16 h-16 bg-gray-100 rounded-md flex-shrink-0 flex items-center justify-center cursor-pointer overflow-hidden relative group">
                                                                {item.image ? (
                                                                    <img src={item.image} className="w-full h-full object-cover" />
                                                                ) : (
                                                                    <ImageIcon size={20} className="text-gray-300" />
                                                                )}
                                                                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, { type: 'item', catId: cat.id, itemId: item.id })} />
                                                            </label>
                                                            <div className="flex-1 space-y-2">
                                                                <div className="flex gap-2">
                                                                    <input type="text" value={item.name} onChange={(e) => updateItem(cat.id, item.id, 'name', e.target.value)} className="flex-1 font-medium text-sm border-b border-gray-100 focus:border-orange-500 outline-none" placeholder="Ürün Adı" />
                                                                    <input type="text" value={item.price} onChange={(e) => updateItem(cat.id, item.id, 'price', e.target.value)} className="w-16 font-medium text-sm text-right border-b border-gray-100 focus:border-orange-500 outline-none" placeholder="Fiyat" />
                                                                </div>
                                                                <textarea value={item.description} onChange={(e) => updateItem(cat.id, item.id, 'description', e.target.value)} className="w-full text-xs text-gray-500 bg-transparent resize-none border-b border-transparent focus:border-orange-500 outline-none h-12" placeholder="Ürün açıklaması..." />
                                                            </div>
                                                            <button onClick={() => deleteItem(cat.id, item.id)} className="text-gray-300 hover:text-red-500"><X size={16} /></button>
                                                        </div>

                                                        {/* Allergen Selection */}
                                                        <div className="flex gap-2 pt-2 border-t border-gray-50 w-full overflow-x-auto pb-1">
                                                            {ALLERGENS.map(allergen => (
                                                                <button
                                                                    key={allergen.id}
                                                                    onClick={() => toggleAllergen(cat.id, item.id, allergen.id)}
                                                                    className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs border transition-colors ${item.allergens.includes(allergen.id) ? 'bg-orange-50 border-orange-200 text-orange-700' : 'bg-white border-gray-100 text-gray-400 hover:bg-gray-50'}`}
                                                                >
                                                                    {allergen.icon}
                                                                    <span>{allergen.label}</span>
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                                <button onClick={() => addItem(cat.id)} className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 py-1"><Plus size={14} /> Ürün Ekle</button>
                                            </div>
                                        </div>
                                    ))}
                                    <button onClick={addCategory} className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 font-bold hover:border-orange-500 hover:text-orange-500 flex items-center justify-center gap-2 transition-colors"><Plus size={20} /> Kategori Ekle</button>
                                </div>
                            </AccordionItem>

                            {/* 4. AÇILIŞ SAATLERİ */}
                            <AccordionItem title="Açılış Saatleri" icon={<Clock size={20} />} isOpen={activeSection === 'hours'} onToggle={() => toggleSection('hours')}>
                                <div className="space-y-4">
                                    <label className="flex items-center gap-2">
                                        <input type="checkbox" checked={state.openingHours.enabled} onChange={(e) => setState(prev => ({ ...prev, openingHours: { ...prev.openingHours, enabled: e.target.checked } }))} className="rounded text-orange-500 focus:ring-orange-500" />
                                        <span className="text-sm font-medium">Çalışma Saatlerini Göster</span>
                                    </label>
                                    {state.openingHours.enabled && (
                                        <div className="space-y-2">
                                            {state.openingHours.days.map((day, idx) => (
                                                <div key={day.day} className="flex items-center gap-4 text-sm">
                                                    <span className="w-24 font-medium text-gray-600">{day.day}</span>
                                                    <div className="flex items-center gap-2 flex-1">
                                                        <input type="time" value={day.open} onChange={(e) => {
                                                            const newDays = [...state.openingHours.days];
                                                            newDays[idx].open = e.target.value;
                                                            setState(prev => ({ ...prev, openingHours: { ...prev.openingHours, days: newDays } }));
                                                        }} className="border rounded p-1 text-xs" />
                                                        <span>-</span>
                                                        <input type="time" value={day.close} onChange={(e) => {
                                                            const newDays = [...state.openingHours.days];
                                                            newDays[idx].close = e.target.value;
                                                            setState(prev => ({ ...prev, openingHours: { ...prev.openingHours, days: newDays } }));
                                                        }} className="border rounded p-1 text-xs" />
                                                    </div>
                                                    <label className="flex items-center gap-1 text-xs text-gray-400">
                                                        <input type="checkbox" checked={day.closed} onChange={(e) => {
                                                            const newDays = [...state.openingHours.days];
                                                            newDays[idx].closed = e.target.checked;
                                                            setState(prev => ({ ...prev, openingHours: { ...prev.openingHours, days: newDays } }));
                                                        }} />
                                                        Kapalı
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </AccordionItem>

                            {/* 5. İLETİŞİM BİLGİLERİ (NEW) */}
                            <AccordionItem title="İletişim Bilgileri" icon={<Phone size={20} />} isOpen={activeSection === 'contact'} onToggle={() => toggleSection('contact')}>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-2">Telefon</label>
                                        <input type="tel" value={state.contact.phone} onChange={(e) => setState(prev => ({ ...prev, contact: { ...prev.contact, phone: e.target.value } }))} className="w-full border rounded p-2" placeholder="0555 555 55 55" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-2">E-posta</label>
                                        <input type="email" value={state.contact.email} onChange={(e) => setState(prev => ({ ...prev, contact: { ...prev.contact, email: e.target.value } }))} className="w-full border rounded p-2" placeholder="info@restoran.com" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-2">Adres</label>
                                        <textarea value={state.contact.address} onChange={(e) => setState(prev => ({ ...prev, contact: { ...prev.contact, address: e.target.value } }))} className="w-full border rounded p-2 h-20 resize-none" placeholder="Açık adres..." />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-2">Web Sitesi</label>
                                        <input type="url" value={state.contact.website} onChange={(e) => setState(prev => ({ ...prev, contact: { ...prev.contact, website: e.target.value } }))} className="w-full border rounded p-2" placeholder="https://www.restoran.com" />
                                    </div>
                                </div>
                            </AccordionItem>

                            {/* 6. SOSYAL AĞLAR (NEW) */}
                            <AccordionItem title="Sosyal Ağlar" icon={<Globe size={20} />} isOpen={activeSection === 'socials'} onToggle={() => toggleSection('socials')}>
                                <div className="space-y-4">
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {SOCIAL_PLATFORMS.map(p => (
                                            <button key={p.id} onClick={() => addSocial(p.id)} className={`p-2 rounded-lg flex items-center justify-center transition-all hover:scale-105 border ${state.socials.find(s => s.platform === p.id) ? 'ring-2 ring-orange-500 border-orange-500 bg-orange-50' : 'border-gray-200 bg-gray-50 hover:bg-gray-100'}`} title={p.label}>
                                                <div className={p.color}>{p.icon}</div>
                                            </button>
                                        ))}
                                    </div>

                                    {state.socials.length > 0 ? (
                                        <div className="space-y-3">
                                            {state.socials.map(social => {
                                                const platformInfo = SOCIAL_PLATFORMS.find(p => p.id === social.platform);
                                                return (
                                                    <div key={social.id} className="bg-white border rounded-lg p-3 flex gap-3 items-center shadow-sm">
                                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${platformInfo?.bg} ${platformInfo?.color}`}>{platformInfo?.icon}</div>
                                                        <input type="text" value={social.url} onChange={(e) => updateSocial(social.id, e.target.value)} className="flex-1 text-sm border-b border-transparent hover:border-gray-300 focus:border-orange-500 outline-none bg-transparent" placeholder={`${platformInfo?.label} URL`} />
                                                        <button onClick={() => removeSocial(social.id)} className="text-gray-400 hover:text-red-500 p-2"><Trash2 size={16} /></button>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <div className="text-center py-6 text-gray-400 text-sm">Henüz sosyal medya hesabı eklemediniz.</div>
                                    )}
                                </div>
                            </AccordionItem>
                        </>
                    ) : (
                        <div className="bg-white rounded-xl shadow-sm border p-6">
                            <h2 className="text-lg font-bold mb-4">QR Kod Tasarımı</h2>
                            <QRCodeDesignControl
                                design={state.qrDesign}
                                onChange={(newDesign) => setState(prev => ({ ...prev, qrDesign: newDesign }))}
                            />
                        </div>
                    )}
                </div>

                {/* RIGHT PANEL: PREVIEW */}
                <div className="flex-1 flex flex-col items-center justify-center bg-gray-100 rounded-3xl p-8 border border-gray-200 relative min-h-[600px]">
                    {activeTab === 'content' ? (
                        <div className="w-[320px] h-[640px] bg-gray-900 rounded-[3rem] shadow-2xl border-8 border-gray-900 overflow-hidden relative font-sans flex flex-col">
                            {/* Scrollable Container for Preview */}
                            <div className="w-full h-full overflow-y-auto no-scrollbar bg-white">
                                <MenuTemplate
                                    design={state.design}
                                    restaurantInfo={state.restaurantInfo}
                                    menu={state.menu}
                                    openingHours={state.openingHours}
                                    contact={state.contact}
                                    socials={state.socials}
                                    fonts={state.fonts}
                                    welcomeScreen={state.welcomeScreen}
                                    headerFontClass={state.fonts.header}
                                    textFontClass={state.fonts.text}
                                    isPreview={true}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-[32px] p-8 h-auto shadow-2xl border border-gray-200 flex flex-col items-center justify-center gap-8">
                            <div className="text-center space-y-2">
                                <h3 className="text-xl font-bold text-gray-800">QR Kod Önizleme</h3>
                                <p className="text-sm text-gray-500">Menünüz için özel QR kod.</p>
                            </div>
                            <div className="scale-110 p-4 border rounded-xl bg-gray-50">
                                <FrameRenderer
                                    frameId={state.qrDesign.frame}
                                    currentDesign={state.qrDesign}
                                    value="https://menu.example.com"
                                    size={200}
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* SUCCESS MODAL (Reusable) */}
                {createdQr && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">Hazır! 🎉</h2>
                                <button onClick={() => setCreatedQr(null)} className="p-2 hover:bg-gray-100 rounded-full"><X size={24} /></button>
                            </div>
                            <div className="flex flex-col items-center gap-6 mb-8">
                                <div ref={qrRef} className="p-4 bg-white rounded-xl shadow-lg border border-gray-100">
                                    <FrameRenderer
                                        frameId={state.qrDesign.frame}
                                        currentDesign={state.qrDesign}
                                        value="https://menu.example.com"
                                        size={200}
                                    />
                                </div>
                                <p className="text-center text-gray-600 text-sm">QR kodunuz hazır. İndirin ve masalarınıza yapıştırın.</p>
                            </div>
                            <button onClick={downloadQrCode} className="w-full py-3 bg-orange-600 text-white rounded-xl font-bold shadow-lg shadow-orange-200 flex items-center justify-center gap-2">
                                <Download size={18} /> PNG İndir
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
