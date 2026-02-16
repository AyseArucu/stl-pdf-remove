'use client';

import React, { useState } from 'react';
import {
    Utensils,
    Clock,
    MapPin,
    Phone,
    Globe,
    ChevronDown,
    ChevronUp,
    Image as ImageIcon,
    ArrowRight,
    ArrowLeft,
    Facebook,
    Instagram,
    Twitter,
    Youtube,
    MessageCircle,
    LayoutGrid,
    Wheat,
    Milk,
    Leaf,
    Nut,
    Flame,
    ChefHat,
    Mail
} from 'lucide-react';

// --- Types ---

export type Allergen = 'gluten' | 'lactose' | 'vegan' | 'nuts' | 'spicy';

export type MenuItem = {
    id: string;
    name: string;
    description: string;
    price: string;
    image: string | null;
    allergens: Allergen[];
};

export type MenuCategory = {
    id: string;
    name: string;
    items: MenuItem[];
};

export type OpeningHoursDay = {
    day: string;
    open: string;
    close: string;
    closed: boolean;
};

export type SocialItem = {
    id: string;
    platform: 'instagram' | 'tiktok' | 'youtube' | 'facebook' | 'twitter' | 'whatsapp' | 'website' | 'linkedin' | 'google';
    url: string;
    active: boolean;
};

export interface MenuDesign {
    themeId: string;
    primaryColor: string;
    bgColor: string;
    textColor: string;
    headerColor: string;
    backgroundImage: string | null;
}

export interface RestaurantInfo {
    name: string;
    description: string;
    logo: string | null;
    coverImage: string | null;
}

export interface MenuData {
    categories: MenuCategory[];
}

export interface OpeningHours {
    enabled: boolean;
    days: OpeningHoursDay[];
}

export interface ContactInfo {
    phone: string;
    email: string;
    address: string;
    website: string;
}

export interface MenuFonts {
    header: string;
    text: string;
}

export interface WelcomeScreen {
    enabled: boolean;
    image: string | null;
}

interface MenuTemplateProps {
    design: MenuDesign;
    restaurantInfo: RestaurantInfo;
    menu: MenuData;
    openingHours: OpeningHours;
    contact: ContactInfo;
    socials: SocialItem[];
    fonts: MenuFonts;
    welcomeScreen: WelcomeScreen;
    headerFontClass?: string;
    textFontClass?: string;
    isPreview?: boolean;
}

const SOCIAL_PLATFORMS = [
    { id: 'instagram', label: 'Instagram', icon: <Instagram size={20} />, color: 'text-pink-600', bg: 'bg-pink-50' },
    { id: 'facebook', label: 'Facebook', icon: <Facebook size={20} />, color: 'text-blue-600', bg: 'bg-blue-50' },
    { id: 'twitter', label: 'X (Twitter)', icon: <Twitter size={20} />, color: 'text-black', bg: 'bg-gray-100' },
    { id: 'youtube', label: 'YouTube', icon: <Youtube size={20} />, color: 'text-red-600', bg: 'bg-red-50' },
    { id: 'tiktok', label: 'TikTok', icon: <span className="font-bold text-lg leading-none">Tk</span>, color: 'text-black', bg: 'bg-gray-100' },
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

export default function MenuTemplate({
    design,
    restaurantInfo,
    menu,
    openingHours,
    contact,
    socials,
    fonts,
    welcomeScreen,
    headerFontClass = '',
    textFontClass = '',
    isPreview = false
}: MenuTemplateProps) {
    const [activeCategory, setActiveCategory] = useState<string | null>(null);

    const hexToRgba = (hex: string, alpha: number) => {
        if (!hex || typeof hex !== 'string' || !hex.startsWith('#')) {
            return `rgba(0, 0, 0, ${alpha})`;
        }
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };

    return (
        <div
            className="w-full h-full rounded-[32px] overflow-y-auto no-scrollbar relative flex flex-col transition-all duration-300 bg-cover bg-center"
            style={{
                backgroundColor: design.bgColor,
                backgroundImage: design.backgroundImage ? `url(${design.backgroundImage})` : 'none',
                color: design.textColor
            }}
        >
            {/* --- SINGLE PAGE ACCORDION LAYOUT --- */}
            <div className="flex flex-col h-full bg-transparent">
                {/* Hero Section */}
                <div className="relative">
                    <div className="w-full h-48 bg-gray-200">
                        {restaurantInfo.coverImage ? (
                            <img src={restaurantInfo.coverImage} className="w-full h-full object-cover" alt="Cover" />
                        ) : (
                            <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-500"><ImageIcon size={48} /></div>
                        )}
                    </div>
                    <div className="absolute -bottom-12 left-0 right-0 px-6 flex justify-center">
                        <div className="w-24 h-24 rounded-full bg-white p-1 shadow-lg ring-4 ring-white/50">
                            <div className="w-full h-full rounded-full bg-gray-100 overflow-hidden flex items-center justify-center">
                                {restaurantInfo.logo ? (
                                    <img src={restaurantInfo.logo} className="w-full h-full object-cover" alt="Logo" />
                                ) : (
                                    <ChefHat size={32} className="text-gray-400" />
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Restaurant Info */}
                <div className="mt-14 px-6 text-center mb-8">
                    <h2 className={`text-2xl font-bold mb-2 ${headerFontClass}`}>{restaurantInfo.name}</h2>
                    <p className={`text-sm opacity-80 leading-relaxed ${textFontClass}`}>{restaurantInfo.description}</p>
                </div>


                {/* Category List (Accordion) */}
                <div className="px-6 space-y-4 pb-8">
                    {menu.categories.map((cat) => {
                        const isOpen = activeCategory === cat.id;

                        return (
                            <div key={cat.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300">
                                <button
                                    onClick={() => setActiveCategory(isOpen ? null : cat.id)}
                                    className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="w-10 h-10 rounded-full flex items-center justify-center"
                                            style={{ backgroundColor: hexToRgba(design.primaryColor, 0.1), color: design.primaryColor }}
                                        >
                                            <Utensils size={18} />
                                        </div>
                                        <span className="font-bold text-lg text-gray-800">{cat.name}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-400">
                                        <span className="text-xs bg-gray-50 px-2 py-1 rounded-full">{cat.items.length} Ürün</span>
                                        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                    </div>
                                </button>

                                {/* Expanded Content */}
                                {isOpen && (
                                    <div className="px-4 pb-4 animate-in slide-in-from-top-2 duration-200">
                                        <div className="space-y-4 pt-2 border-t border-gray-100">
                                            {cat.items.map((item) => (
                                                <div key={item.id} className="flex gap-4">
                                                    {/* Item Image */}
                                                    <div className="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                                                        {item.image ? (
                                                            <img src={item.image} className="w-full h-full object-cover" alt={item.name} />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-gray-300"><ImageIcon size={16} /></div>
                                                        )}
                                                    </div>

                                                    {/* Item Details */}
                                                    <div className="flex-1">
                                                        <div className="flex justify-between items-start mb-1">
                                                            <h4 className={`font-bold text-gray-900 ${textFontClass}`}>{item.name}</h4>
                                                            <span className="font-bold whitespace-nowrap" style={{ color: design.primaryColor }}>{item.price}</span>
                                                        </div>
                                                        <p className={`text-xs text-gray-500 line-clamp-2 mb-2 ${textFontClass}`}>{item.description}</p>

                                                        {/* Allergens */}
                                                        {item.allergens.length > 0 && (
                                                            <div className="flex flex-wrap gap-1">
                                                                {item.allergens.map(slug => {
                                                                    const a = ALLERGENS.find(x => x.id === slug);
                                                                    if (!a) return null;
                                                                    return (
                                                                        <div key={slug} className={`flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] ${a.bg} ${a.color}`} title={a.label}>
                                                                            {a.icon}
                                                                            <span>{a.label}</span>
                                                                        </div>
                                                                    )
                                                                })}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Socials & Contact Footer */}
                <div className="mt-auto px-6 pb-6 space-y-6">
                    {/* SOCIAL NETWORKS LIST */}
                    {socials.length > 0 && (
                        <div className="w-full">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="p-2 bg-gray-100 rounded-lg"><Globe size={16} className="text-gray-600" /></div>
                                <span className="font-bold text-gray-800">Sosyal Ağlar</span>
                            </div>
                            <div className="space-y-3 relative z-20">
                                {socials.map(social => {
                                    const p = SOCIAL_PLATFORMS.find(x => x.id === social.platform);
                                    if (!p) return null;
                                    return (
                                        <a
                                            key={social.id}
                                            href={social.url.startsWith('http') ? social.url : `https://${social.url}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            title={`Go to ${p.label}`}
                                            className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer block"
                                            style={{ textDecoration: 'none' }}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${p.bg} ${p.color}`}>
                                                    {p.icon}
                                                </div>
                                                <span className="font-bold text-sm text-gray-800">{p.label}</span>
                                            </div>
                                            <ArrowRight size={16} className="text-gray-400" />
                                        </a>
                                    )
                                })}
                            </div>
                        </div>
                    )}

                    {/* Opening Hours Footer */}
                    {openingHours.enabled && (
                        <div className="bg-gray-100/50 p-6 rounded-xl border border-gray-100">
                            <h3 className="font-bold text-sm mb-3 flex items-center gap-2"><Clock size={16} /> Çalışma Saatleri</h3>
                            <div className="space-y-1 text-xs opacity-70">
                                {openingHours.days.map((day) => (
                                    <div key={day.day} className="flex justify-between">
                                        <span>{day.day}</span>
                                        <span>{day.closed ? 'Kapalı' : `${day.open} - ${day.close}`}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* CONTACT INFO CARD */}
                    {(contact.phone || contact.email || contact.website || contact.address) && (
                        <div className="w-full">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="p-2 bg-gray-100 rounded-lg"><LayoutGrid size={16} className="text-gray-600" /></div>
                                    <span className="font-bold text-gray-800">İletişim</span>
                                </div>
                                <div className="space-y-4">
                                    {contact.phone && (
                                        <div className="border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                                            <span className="text-xs text-gray-400 block mb-1">Telefon</span>
                                            <div className="text-sm font-bold text-gray-800 flex items-center gap-2"><Phone size={14} className="text-gray-400" /> {contact.phone}</div>
                                        </div>
                                    )}
                                    {contact.email && (
                                        <div className="border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                                            <span className="text-xs text-gray-400 block mb-1">E-posta</span>
                                            <div className="text-sm font-bold text-gray-800 flex items-center gap-2"><Mail size={14} className="text-gray-400" /> {contact.email}</div>
                                        </div>
                                    )}
                                    {contact.website && (
                                        <div className="border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                                            <span className="text-xs text-gray-400 block mb-1">İnternet sitesi</span>
                                            <div className="text-sm font-bold text-gray-800 flex items-center gap-2"><Globe size={14} className="text-gray-400" /> {contact.website}</div>
                                        </div>
                                    )}
                                    {contact.address && (
                                        <div className="border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                                            <span className="text-xs text-gray-400 block mb-1">Adres</span>
                                            <div className="text-sm font-bold text-gray-800 flex items-center gap-2"><MapPin size={14} className="text-gray-400" /> {contact.address}</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
