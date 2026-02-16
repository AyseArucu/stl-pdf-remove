'use client';

import React, { useState, useEffect } from 'react';
import {
    Instagram,
    Youtube,
    Twitter,
    Linkedin,
    MessageCircle,
    Music,
    Globe,
    Ghost,
    Gamepad2,
    Pin,
    Mail,
    Phone,
    Star,
    ArrowRight,
    Video,
    MapPin,
    Calendar,
    FileText,
    MoreHorizontal,
    User,
    Link as LinkIcon,
    Share2
} from 'lucide-react';

// --- Types (Copied/Shared from page) ---
export type LinkItem = {
    id: string;
    icon: string;
    text: string;
    url: string;
    active: boolean;
};

export type SocialItem = {
    id: string;
    platform: 'instagram' | 'tiktok' | 'youtube' | 'facebook' | 'x' | 'whatsapp' | 'telegram' | 'spotify' | 'linkedin' | 'snapchat' | 'pinterest' | 'discord' | 'twitch' | 'website';
    url: string;
    active: boolean;
};

export interface LinkListDesign {
    themeId: string;
    bgColor: string;
    linkBgColor: string;
    linkTextColor: string;
    headerColor: string;
    socialBgColor?: string;
    socialTextColor?: string;
}



export interface LinkListInfo {
    image: string | null;
    images?: string[];
    title: string;
    description: string;
}

export interface LinkListFonts {
    header: string;
    text: string;
}

export interface WelcomeScreen {
    enabled: boolean;
    image: string | null;
    timeout?: number; // Added timeout (optional for backward compatibility if needed)
}

interface LinkListTemplateProps {
    design: LinkListDesign;
    info: LinkListInfo;
    links: LinkItem[];
    socials: SocialItem[];
    fonts: LinkListFonts;
    welcomeScreen: WelcomeScreen;
    headerFontClass?: string;
    textFontClass?: string;
    isPreview?: boolean; // If true, disable links or handle differently
}

// --- Icons Helper ---
export const SOCIAL_PLATFORMS = [
    { id: 'instagram', icon: <Instagram size={24} />, color: 'text-pink-600', bg: 'bg-pink-50', label: 'Instagram' },
    {
        id: 'tiktok',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" /></svg>
        ),
        color: 'text-black',
        bg: 'bg-gray-100',
        label: 'TikTok'
    },
    { id: 'youtube', icon: <Youtube size={24} />, color: 'text-red-600', bg: 'bg-red-50', label: 'YouTube' },
    { id: 'facebook', icon: <div className="font-bold text-xl">f</div>, color: 'text-blue-600', bg: 'bg-blue-50', label: 'Facebook' },
    { id: 'x', icon: <Twitter size={24} />, color: 'text-black', bg: 'bg-gray-100', label: 'X (Twitter)' },
    { id: 'whatsapp', icon: <MessageCircle size={24} />, color: 'text-green-600', bg: 'bg-green-50', label: 'WhatsApp' },
    { id: 'telegram', icon: <div className="font-bold text-lg">tg</div>, color: 'text-blue-500', bg: 'bg-blue-50', label: 'Telegram' },
    { id: 'spotify', icon: <Music size={24} />, color: 'text-green-600', bg: 'bg-green-50', label: 'Spotify' },
    { id: 'linkedin', icon: <Linkedin size={24} />, color: 'text-blue-700', bg: 'bg-blue-50', label: 'LinkedIn' },
    { id: 'snapchat', icon: <Ghost size={24} />, color: 'text-yellow-600', bg: 'bg-yellow-50', label: 'Snapchat' },
    { id: 'pinterest', icon: <Pin size={24} />, color: 'text-red-600', bg: 'bg-red-50', label: 'Pinterest' },
    { id: 'discord', icon: <Gamepad2 size={24} />, color: 'text-indigo-600', bg: 'bg-indigo-50', label: 'Discord' },
    { id: 'twitch', icon: <Video size={24} />, color: 'text-purple-600', bg: 'bg-purple-50', label: 'Twitch' },
    { id: 'website', icon: <Globe size={24} />, color: 'text-gray-600', bg: 'bg-gray-50', label: 'Website' },
];

const GENERIC_ICONS = [
    { id: 'globe', icon: <Globe size={20} />, color: 'text-gray-600' },
    { id: 'link', icon: <LinkIcon size={20} />, color: 'text-blue-500' },
    { id: 'mail', icon: <Mail size={20} />, color: 'text-gray-600' },
    { id: 'phone', icon: <Phone size={20} />, color: 'text-green-600' },
    { id: 'star', icon: <Star size={20} />, color: 'text-yellow-500' },
    { id: 'arrow', icon: <ArrowRight size={20} />, color: 'text-gray-400' },
    { id: 'video', icon: <Video size={20} />, color: 'text-purple-500' },
    { id: 'location', icon: <MapPin size={20} />, color: 'text-red-500' },
    { id: 'calendar', icon: <Calendar size={20} />, color: 'text-orange-500' },
    { id: 'file', icon: <FileText size={20} />, color: 'text-blue-400' },
    { id: 'more', icon: <MoreHorizontal size={20} />, color: 'text-gray-400' },
    // Socials
    { id: 'instagram', icon: <Instagram size={20} />, color: 'text-pink-600' },
    { id: 'youtube', icon: <Youtube size={20} />, color: 'text-red-600' },
    { id: 'tiktok', icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" /></svg>, color: 'text-black' },
    { id: 'twitter', icon: <Twitter size={20} />, color: 'text-black' },
    { id: 'facebook', icon: <div className="font-bold">f</div>, color: 'text-blue-600' },
    { id: 'linkedin', icon: <Linkedin size={20} />, color: 'text-blue-700' },
];

export default function LinkListTemplate({
    design,
    info,
    links,
    socials,
    headerFontClass = '',
    textFontClass = '',
    welcomeScreen,
    isPreview = false
}: LinkListTemplateProps) {
    const [showWelcome, setShowWelcome] = useState(false);

    // Initialize welcome screen state based on props
    useEffect(() => {
        if (welcomeScreen && welcomeScreen.enabled) {
            setShowWelcome(true);
            const timeout = welcomeScreen.timeout || 2000;
            const timer = setTimeout(() => {
                setShowWelcome(false);
            }, timeout);
            return () => clearTimeout(timer);
        } else {
            setShowWelcome(false);
        }
    }, [welcomeScreen]);

    // Helper to detect if a social link is empty
    const validSocials = socials.filter(s => s.url && s.active);

    // Prepare images list (fallback to single image if no array)
    const displayImages = (info.images && info.images.length > 0 ? info.images : [info.image]).filter(Boolean) as string[];

    const handleShare = async () => {
        if (typeof navigator !== 'undefined' && navigator.share) {
            try {
                await navigator.share({
                    title: info.title,
                    text: info.description,
                    url: window.location.href,
                });
            } catch (err) {
                console.log('Share failed', err);
            }
        } else {
            alert('Paylaşım özelliği bu tarayıcıda desteklenmiyor.');
        }
    };

    // Carousel Logic
    const sliderRef = React.useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    // Drag State
    const isDown = React.useRef(false);
    const startX = React.useRef(0);
    const scrollLeft = React.useRef(0);

    const startDrag = (e: React.MouseEvent) => {
        isDown.current = true;
        if (sliderRef.current) {
            sliderRef.current.classList.add('cursor-grabbing');
            sliderRef.current.classList.remove('cursor-grab');
            startX.current = e.pageX - sliderRef.current.offsetLeft;
            scrollLeft.current = sliderRef.current.scrollLeft;
        }
    };

    const stopDrag = () => {
        isDown.current = false;
        if (sliderRef.current) {
            sliderRef.current.classList.remove('cursor-grabbing');
            sliderRef.current.classList.add('cursor-grab');
        }
    };

    const moveDrag = (e: React.MouseEvent) => {
        if (!isDown.current || !sliderRef.current) return;
        e.preventDefault();
        const x = e.pageX - sliderRef.current.offsetLeft;
        const walk = (x - startX.current) * 2; // Scroll-fast
        sliderRef.current.scrollLeft = scrollLeft.current - walk;
    };

    const handleScroll = () => {
        if (sliderRef.current) {
            const container = sliderRef.current;
            const center = container.scrollLeft + container.offsetWidth / 2;
            const children = Array.from(container.children) as HTMLElement[];

            let closestIndex = 0;
            let minDistance = Number.MAX_VALUE;

            children.forEach((child, index) => {
                const childCenter = child.offsetLeft + child.offsetWidth / 2;
                const distance = Math.abs(childCenter - center);
                if (distance < minDistance) {
                    minDistance = distance;
                    closestIndex = index;
                }
            });

            setActiveIndex(closestIndex);
        }
    };

    useEffect(() => {
        const container = sliderRef.current;
        if (container) {
            container.addEventListener('scroll', handleScroll);
            handleScroll(); // Initial check
            return () => container.removeEventListener('scroll', handleScroll);
        }
    }, [displayImages]);

    return (
        <div className="w-full h-full overflow-y-auto no-scrollbar relative flex flex-col" style={{ backgroundColor: design.bgColor }}>

            {/* Header Background */}
            <div className="w-full h-48 rounded-none flex-shrink-0 shadow-sm relative z-0 transition-colors duration-300" style={{ backgroundColor: design.headerColor }}>
                {/* Share Button */}
                <button
                    onClick={handleShare}
                    className="absolute top-9 right-6 p-2 bg-white/20 backdrop-blur-md rounded-xl text-white hover:bg-white/30 transition-colors z-20 shadow-sm border border-white/10"
                >
                    <Share2 size={20} />
                </button>
            </div>

            {/* Profile Section (Carousel) */}
            <div className="flex flex-col items-center text-center px-0 pb-6 -mt-32 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full">

                {/* Image Slider Container */}
                <div
                    ref={sliderRef}
                    className="w-full overflow-x-auto no-scrollbar flex items-center py-8 snap-x snap-mandatory touch-pan-x cursor-grab active:cursor-grabbing"
                    style={{ paddingLeft: 'calc(50% - 5rem)', paddingRight: 'calc(50% - 5rem)' }}
                    onMouseDown={startDrag}
                    onMouseLeave={stopDrag}
                    onMouseUp={stopDrag}
                    onMouseMove={moveDrag}
                >
                    {displayImages.length > 0 ? (
                        displayImages.map((img, index) => {
                            const isActive = index === activeIndex;
                            const isPrev = index === activeIndex - 1;
                            const isNext = index === activeIndex + 1;

                            // Determine styles based on position relative to active
                            let scale = 'scale-90';
                            let zIndex = 'z-0';
                            let opacity = 'opacity-70';
                            let translate = 'translate-x-0';

                            if (isActive) {
                                scale = 'scale-110';
                                zIndex = 'z-20';
                                opacity = 'opacity-100';
                            } else if (isPrev) {
                                scale = 'scale-95';
                                zIndex = 'z-10';
                                translate = 'translate-x-4'; // Tuck behind active
                            } else if (isNext) {
                                scale = 'scale-95';
                                zIndex = 'z-10';
                                translate = '-translate-x-4'; // Tuck behind active
                            }

                            return (
                                <div key={index} className={`snap-center shrink-0 transition-all duration-300 ease-out ${zIndex} ${translate} -mx-4 px-4`}>
                                    <div className={`w-40 h-40 rounded-2xl bg-white p-1.5 shadow-xl transform transition-transform duration-300 ${scale} ${opacity}`}>
                                        <div className="w-full h-full rounded-xl bg-gray-100 overflow-hidden relative pointer-events-none">
                                            <img src={img} alt={`Profile ${index + 1}`} className="w-full h-full object-cover" />
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="snap-center shrink-0 mx-auto z-20">
                            <div className="w-40 h-40 rounded-2xl bg-white p-1.5 shadow-xl scale-110">
                                <div className="w-full h-full rounded-xl bg-gray-100 overflow-hidden flex items-center justify-center">
                                    <User size={48} className="text-gray-400" />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <h2 className={`text-2xl font-bold text-gray-900 mb-2 mt-2 px-6 w-full break-words ${headerFontClass}`}>
                    {info.title || 'İsim Soyisim'}
                </h2>
                <p className={`text-base text-gray-800 font-medium leading-relaxed px-6 w-full break-words whitespace-pre-line ${textFontClass}`}>
                    {info.description || 'Açıklama metni buraya gelecek.'}
                </p>
            </div>

            {/* Links Section */}
            <div className="flex-1 p-4 space-y-3 w-full max-w-sm mx-auto">
                {links.filter(l => l.active).map(link => (
                    <a
                        key={link.id}
                        href={link.url.startsWith('http') ? link.url : `https://${link.url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`relative flex items-center justify-between p-3 rounded-lg shadow-md transition-all hover:scale-[1.02] active:scale-95 cursor-pointer block w-full ${textFontClass}`}
                        style={{ backgroundColor: design.linkBgColor, color: design.linkTextColor, textDecoration: 'none' }}
                    >
                        <div className={`w-10 h-10 flex items-center justify-center rounded-md flex-shrink-0 bg-white/20 text-current`}>
                            {SOCIAL_PLATFORMS.find(p => p.id === link.icon)?.icon || GENERIC_ICONS.find(i => i.id === link.icon)?.icon || <Globe size={20} />}
                        </div>
                        <span className="flex-1 text-center font-bold px-2 truncate">{link.text}</span>
                        <div className="w-10 flex justify-end opacity-80 flex-shrink-0"><ArrowRight size={20} /></div>
                    </a>
                ))}
            </div>

            {/* Social Icons Section */}
            {validSocials.length > 0 && (
                <div className="flex flex-col items-center w-full relative z-20 px-8 pb-12 pt-6">
                    <h3 className={`text-lg font-bold text-gray-800 mb-4 ${headerFontClass}`}>Beni Bulun</h3>
                    <div className="flex flex-col w-full space-y-3 max-w-sm">
                        {validSocials.map(social => {
                            const p = SOCIAL_PLATFORMS.find(x => x.id === social.platform);
                            if (!p) return null;

                            return (
                                <a
                                    key={social.id}
                                    href={social.url.startsWith('http') ? social.url : `https://${social.url}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    title={`Go to ${p.label || social.platform}`}
                                    className="p-3 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between hover:opacity-90 transition-opacity cursor-pointer block text-decoration-none"
                                    style={{
                                        backgroundColor: design.socialBgColor || '#ffffff',
                                    }}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${p.bg} ${p.color}`}>
                                            {p.icon}
                                        </div>
                                        <span className="font-bold text-sm" style={{ color: design.socialTextColor || '#1f2937' }}>{p.label || social.platform}</span>
                                    </div>
                                    <ArrowRight size={16} style={{ color: design.socialTextColor || '#9ca3af' }} />
                                </a>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Welcome Screen Overlay */}
            {welcomeScreen && welcomeScreen.enabled && showWelcome && (
                <div className="absolute inset-0 bg-black/80 z-30 flex items-center justify-center backdrop-blur-sm p-6 animate-in fade-in duration-300">
                    <div className="text-center p-8 bg-white rounded-3xl mx-auto shadow-2xl max-w-sm w-full relative overflow-hidden">
                        {welcomeScreen.image && (
                            <img src={welcomeScreen.image} alt="Welcome" className="w-full h-40 object-cover rounded-xl mb-6 shadow-md" />
                        )}
                        <h3 className={`text-2xl font-bold mb-4 text-gray-900 ${headerFontClass}`}>Hoşgeldiniz</h3>
                        <p className={`text-gray-600 mb-6 ${textFontClass}`}>
                            {info.title} profiline giriş yapıyorsunuz.
                        </p>
                    </div>
                </div>
            )}


        </div>
    );
}
