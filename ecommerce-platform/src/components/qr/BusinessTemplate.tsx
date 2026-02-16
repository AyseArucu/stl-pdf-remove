import React from 'react';
import {
    MapPin, Phone, Globe, Mail, Clock,
    Wifi, Car, Accessibility, Baby, Dog, Sun, Snowflake, CreditCard, Calendar,
    ArrowRight, Star, Info, LayoutGrid, CheckCircle2, XCircle,
    Instagram, Facebook, Twitter, Youtube, Linkedin, MessageCircle
} from 'lucide-react';
import { QrDesignState } from './FrameRenderer';

export type BusinessFacility = 'wifi' | 'parking' | 'wheelchair' | 'baby' | 'pet' | 'outdoor' | 'ac' | 'card' | 'reservation';

export const BUSINESS_FACILITIES: { id: BusinessFacility, label: string, icon: React.ReactNode, color: string, bg: string }[] = [
    { id: 'wifi', label: 'Wi-Fi', icon: <Wifi size={24} />, color: 'text-blue-600', bg: 'bg-blue-100' },
    { id: 'parking', label: 'Otopark', icon: <Car size={24} />, color: 'text-gray-700', bg: 'bg-gray-200' },
    { id: 'wheelchair', label: 'Engelli Uygun', icon: <Accessibility size={24} />, color: 'text-purple-600', bg: 'bg-purple-100' },
    { id: 'baby', label: 'Bebek Bakım', icon: <Baby size={24} />, color: 'text-pink-600', bg: 'bg-pink-100' },
    { id: 'pet', label: 'Evcil Hayvan', icon: <Dog size={24} />, color: 'text-orange-600', bg: 'bg-orange-100' },
    { id: 'outdoor', label: 'Dış Mekan', icon: <Sun size={24} />, color: 'text-yellow-600', bg: 'bg-yellow-100' },
    { id: 'ac', label: 'Klima', icon: <Snowflake size={24} />, color: 'text-cyan-600', bg: 'bg-cyan-100' },
    { id: 'card', label: 'Kredi Kartı', icon: <CreditCard size={24} />, color: 'text-green-600', bg: 'bg-green-100' },
    { id: 'reservation', label: 'Rezervasyon', icon: <Calendar size={24} />, color: 'text-red-600', bg: 'bg-red-100' },
];

export interface CustomBusinessFacility {
    id: string;
    label: string;
    icon: string;
    isCustom: true;
}

interface BusinessTemplateProps {
    design: {
        themeId: string;
        primaryColor: string;
        bgColor: string;
        textColor: string;
        headerColor: string;
        backgroundImage: string | null;
    };
    info: {
        name: string;
        description: string;
        logo: string | null;
        cover: string | null;
    };
    about: {
        title: string;
        text: string;
        enabled: boolean;
    };
    facilities: (BusinessFacility | CustomBusinessFacility)[];
    cta: {
        enabled: boolean;
        text: string;
        url: string;
    };
    contact: {
        phone: string;
        email: string;
        address: string;
        website: string;
    };
    openingHours: {
        enabled: boolean;
        days: { day: string; open: string; close: string; closed: boolean }[];
    };
    socials: { platform: string; url: string; active: boolean }[];
    fonts: {
        header: string;
        text: string;
    };
    headerFontClass?: string;
    textFontClass?: string;
}

export default function BusinessTemplate({
    design,
    info,
    about,
    facilities,
    cta,
    contact,
    openingHours,
    socials,
    headerFontClass = '',
    textFontClass = ''
}: BusinessTemplateProps) {
    const hexToRgba = (hex: string, alpha: number) => {
        if (!hex || typeof hex !== 'string' || !hex.startsWith('#')) return `rgba(0,0,0,${alpha})`;
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };

    // Social Media Icons Mapping
    const getSocialIcon = (platform: string) => {
        // Simplified mapping for brevity, assume icons are handled generic or specific
        // For now using generic MapPin/Globe etc if not specific.
        // In real impl, import proper icons.
        return <Globe size={20} />;
    };

    const isOpenNow = () => {
        if (!openingHours.enabled) return null;
        const now = new Date();
        const days = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
        const currentDayName = days[now.getDay()];
        const todaySchedule = openingHours.days.find(d => d.day === currentDayName);

        if (!todaySchedule || todaySchedule.closed) return false;

        const currentMinutes = now.getHours() * 60 + now.getMinutes();
        const [openHour, openMinute] = todaySchedule.open.split(':').map(Number);
        const [closeHour, closeMinute] = todaySchedule.close.split(':').map(Number);
        const openMinutes = openHour * 60 + openMinute;
        const closeMinutes = closeHour * 60 + closeMinute;

        return currentMinutes >= openMinutes && currentMinutes <= closeMinutes;
    };

    const shopStatus = isOpenNow();

    return (
        <div
            className="w-full h-full rounded-[32px] overflow-y-auto no-scrollbar relative flex flex-col bg-cover bg-center"
            style={{
                backgroundColor: design.bgColor,
                backgroundImage: design.backgroundImage ? `url(${design.backgroundImage})` : 'none',
                color: design.textColor
            }}
        >
            {/* Hero Section */}
            <div className="relative">
                <div className="w-full h-56 bg-gray-200">
                    {info.cover ? (
                        <img src={info.cover} className="w-full h-full object-cover" alt="Cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <LayoutGrid size={48} />
                        </div>
                    )}
                </div>
                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
                    <div className="w-24 h-24 rounded-2xl bg-white p-1 shadow-lg transform rotate-3">
                        <div className="w-full h-full rounded-xl bg-gray-100 overflow-hidden flex items-center justify-center transform -rotate-3">
                            {info.logo ? (
                                <img src={info.logo} className="w-full h-full object-cover" alt="Logo" />
                            ) : (
                                <LayoutGrid size={32} className="text-gray-400" />
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Business Header Info */}
            <div className="mt-14 px-6 text-center">
                <h1 className={`text-2xl font-bold mb-2 ${headerFontClass}`} style={{ color: design.primaryColor }}>
                    {info.name}
                </h1>
                <p className={`text-sm opacity-80 leading-relaxed ${textFontClass}`}>
                    {info.description}
                </p>

                {/* Status Badge */}
                {openingHours.enabled && (
                    <div className="mt-4 flex justify-center">
                        <div className={`px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 ${shopStatus ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {shopStatus ? (
                                <><CheckCircle2 size={14} /> Şimdi Açık</>
                            ) : (
                                <><XCircle size={14} /> Kapalı</>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* CTA Button */}
            {cta.enabled && cta.text && cta.url && (
                <div className="px-6 mt-6">
                    <a
                        href={cta.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-4 rounded-xl font-bold text-center block shadow-lg shadow-orange-500/20 transform transition-transform hover:scale-[1.02] active:scale-[0.98]"
                        style={{ backgroundColor: design.primaryColor, color: '#fff' }}
                    >
                        {cta.text}
                    </a>
                </div>
            )}

            {/* Content Sections */}
            <div className="px-6 py-8 space-y-6">

                {/* Opening Hours */}
                {openingHours.enabled && (
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white/50">
                        <h3 className={`font-bold text-lg mb-4 flex items-center gap-2 ${headerFontClass}`}>
                            <Clock size={20} className="text-gray-400" /> Çalışma Saatleri
                        </h3>
                        <div className="space-y-3">
                            {openingHours.days.map((day) => (
                                <div key={day.day} className="flex justify-between items-center text-sm border-b border-gray-100 last:border-0 pb-2 last:pb-0">
                                    <span className="font-medium text-gray-700">{day.day}</span>
                                    <span className={`px-2 py-0.5 rounded text-xs ${day.closed ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-600'}`}>
                                        {day.closed ? 'Kapalı' : `${day.open} - ${day.close}`}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Address */}
                {contact.address && (
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white/50">
                        <h3 className={`font-bold text-lg mb-4 flex items-center gap-2 ${headerFontClass}`}>
                            <MapPin size={20} className="text-gray-400" /> Adres
                        </h3>
                        <p className={`text-sm text-gray-600 leading-relaxed ${textFontClass}`}>
                            {contact.address}
                        </p>
                    </div>
                )}

                {/* Socials */}
                {socials.length > 0 && (
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white/50">
                        <h3 className={`font-bold text-lg mb-4 flex items-center gap-2 ${headerFontClass}`}>
                            <Globe size={20} className="text-gray-400" /> Sosyal Ağlar
                        </h3>
                        <div className="space-y-3">
                            {socials.filter(s => s.active && s.url).map((s, i) => {
                                const platformInfo = (() => {
                                    switch (s.platform) {
                                        case 'instagram': return { label: 'Instagram', icon: <Instagram size={20} />, color: 'text-pink-600', bg: 'bg-pink-50' };
                                        case 'facebook': return { label: 'Facebook', icon: <Facebook size={20} />, color: 'text-blue-600', bg: 'bg-blue-50' };
                                        case 'twitter': return { label: 'X (Twitter)', icon: <Twitter size={20} />, color: 'text-black', bg: 'bg-gray-100' };
                                        case 'youtube': return { label: 'YouTube', icon: <Youtube size={20} />, color: 'text-red-600', bg: 'bg-red-50' };
                                        case 'linkedin': return { label: 'LinkedIn', icon: <Linkedin size={20} />, color: 'text-blue-700', bg: 'bg-blue-50' };
                                        case 'whatsapp': return { label: 'WhatsApp', icon: <MessageCircle size={20} />, color: 'text-green-600', bg: 'bg-green-50' };
                                        case 'tiktok': return { label: 'TikTok', icon: <span className="font-bold text-lg leading-none">Tk</span>, color: 'text-black', bg: 'bg-gray-100' };
                                        case 'google': return { label: 'Google Maps', icon: <MapPin size={20} />, color: 'text-red-500', bg: 'bg-red-50' };
                                        case 'website': return { label: 'Website', icon: <Globe size={20} />, color: 'text-blue-500', bg: 'bg-blue-50' };
                                        default: return { label: 'Web', icon: <Globe size={20} />, color: 'text-gray-600', bg: 'bg-gray-50' };
                                    }
                                })();

                                return (
                                    <a
                                        key={i}
                                        href={s.url.startsWith('http') ? s.url : `https://${s.url}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between hover:bg-gray-50 transition-colors group"
                                        style={{ textDecoration: 'none' }}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${platformInfo.bg} ${platformInfo.color}`}>
                                                {platformInfo.icon}
                                            </div>
                                            <span className="font-bold text-sm text-gray-800">{platformInfo.label}</span>
                                        </div>
                                        <ArrowRight size={16} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
                                    </a>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Contact Info (Minus Address) */}
                {(contact.phone || contact.email || contact.website) && (
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white/50">
                        <h3 className={`font-bold text-lg mb-4 flex items-center gap-2 ${headerFontClass}`}>
                            <Phone size={20} className="text-gray-400" /> İletişim
                        </h3>
                        <div className="space-y-4">
                            {contact.phone && (
                                <a href={`tel:${contact.phone}`} className="flex items-center gap-3 text-sm text-gray-600 hover:text-orange-500 transition-colors">
                                    <div className="w-8 h-8 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center"><Phone size={16} /></div>
                                    {contact.phone}
                                </a>
                            )}
                            {contact.email && (
                                <a href={`mailto:${contact.email}`} className="flex items-center gap-3 text-sm text-gray-600 hover:text-blue-500 transition-colors">
                                    <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center"><Mail size={16} /></div>
                                    {contact.email}
                                </a>
                            )}
                            {contact.website && (
                                <a href={contact.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-gray-600 hover:text-purple-500 transition-colors">
                                    <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-500 flex items-center justify-center"><Globe size={16} /></div>
                                    {contact.website}
                                </a>
                            )}
                        </div>
                    </div>
                )}

                {/* About Section */}
                {about.enabled && (about.title || about.text) && (
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white/50">
                        <h3 className={`font-bold text-lg mb-3 ${headerFontClass}`} style={{ color: design.textColor }}>
                            {about.title || 'Hakkımızda'}
                        </h3>
                        <p className={`text-sm leading-relaxed opacity-80 ${textFontClass}`}>
                            {about.text}
                        </p>
                    </div>
                )}

                {/* Facilities Grid */}
                {facilities.length > 0 && (
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white/50">
                        <h3 className={`font-bold text-lg mb-4 flex items-center gap-2 ${headerFontClass}`}>
                            <LayoutGrid size={20} className="text-gray-400" /> Tesisler
                        </h3>
                        <div className="flex overflow-x-auto gap-4 pb-2 -mx-2 px-2 scrollbar-hide">
                            {facilities.map((item, index) => {
                                let label = '';
                                let icon: React.ReactNode = null;
                                let bg = 'bg-gray-100';
                                let color = 'text-gray-600';
                                let key = '';

                                if (typeof item === 'string') {
                                    const f = BUSINESS_FACILITIES.find(x => x.id === item);
                                    if (!f) return null;
                                    label = f.label;
                                    icon = f.icon;
                                    bg = f.bg;
                                    color = f.color;
                                    key = f.id;
                                } else {
                                    // Custom Facility
                                    label = item.label;
                                    icon = item.icon ? <img src={item.icon} className="w-full h-full object-cover" alt={label} /> : <LayoutGrid size={24} />;
                                    bg = item.icon ? 'bg-white' : 'bg-indigo-50';
                                    color = 'text-indigo-600';
                                    key = item.id;
                                }

                                return (
                                    <div key={key} className="flex flex-col items-center gap-2 text-center group flex-shrink-0">
                                        <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm overflow-hidden ${bg} ${color}`}>
                                            {icon}
                                        </div>
                                        <span className="text-[10px] font-bold text-gray-600 leading-tight">{label}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            {/* Footer Branding */}
            <div className="pb-8 text-center">
                <p className="text-[10px] opacity-40 uppercase tracking-widest font-bold">Powered by Erashu</p>
            </div>
        </div>
    );
}
