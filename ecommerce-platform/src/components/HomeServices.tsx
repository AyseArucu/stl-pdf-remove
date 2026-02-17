'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Globe,
    FileText,
    Video,
    Image as ImageIcon,
    UserSquare,
    Share2,
    MessageCircle,
    Music,
    Lock,
    List,
    Building2,
    Instagram,
    Utensils,
    AppWindow,
    Ticket,
    Wifi
} from 'lucide-react';

const QR_TYPES = [
    {
        id: 'website',
        label: 'İnternet Sitesi',
        icon: <Globe size={32} />,
        description: 'URL adresine yönlendiren QR kod',
        href: '/qr-kod-olusturucu',
        active: true,
        color: 'text-blue-500',
        bg: 'bg-blue-50',
        border: 'border-blue-100'
    },
    {
        id: 'full-links',
        label: 'Bağlantıların Listesi',
        icon: <List size={32} />,
        description: 'Link-in-bio sayfası',
        href: '/qr/baglanti-listesi',
        active: true,
        color: 'text-cyan-500',
        bg: 'bg-cyan-50',
        border: 'border-cyan-100'
    },
    {
        id: 'services-',
        label: 'Hizmetlerimiz',
        icon: <Building2 size={32} />,
        description: 'Tüm hizmetlerimizi keşfedin',
        href: '/hizmetler',
        active: true,
        color: 'text-purple-600',
        bg: 'bg-purple-50',
        border: 'border-purple-100'
    },
    {
        id: 'custom-site',
        label: 'Web Tasarım',
        icon: <AppWindow size={32} />,
        description: 'Özel web tasarım hizmeti alın',
        href: '/custom-site',
        active: true,
        color: 'text-indigo-600',
        bg: 'bg-indigo-50',
        border: 'border-indigo-100'
    },
    {
        id: '3d-models',
        label: '3D Modeller / STL',
        icon: <Ticket size={32} />,
        description: '3D yazıcı dosyaları indirin',
        href: '/3d-modeller-stl',
        active: true,
        color: 'text-green-600',
        bg: 'bg-green-50',
        border: 'border-green-100'
    },
    {
        id: 'video-downloader',
        label: 'Video İndir',
        icon: <Video size={32} />,
        description: 'YouTube video indirici',
        href: '/tools/video-downloader',
        active: true,
        color: 'text-red-600',
        bg: 'bg-red-50',
        border: 'border-red-100'
    },
    {
        id: 'bg-remover',
        label: 'Remove.AI',
        icon: <ImageIcon size={32} />,
        description: 'Arkaplan silici araç',
        href: '/tools/background-remover',
        active: true,
        color: 'text-pink-600',
        bg: 'bg-pink-50',
        border: 'border-pink-100'
    },
    {
        id: 'pdf-editor',
        label: 'PDF Editor',
        icon: <FileText size={32} />,
        description: 'PDF düzenleme aracı',
        href: '/pdf-editor',
        active: true,
        color: 'text-orange-600',
        bg: 'bg-orange-50',
        border: 'border-orange-100'
    },
    {
        id: 'blog',
        label: 'Haber',
        icon: <FileText size={32} />,
        description: 'Güncel yazılar ve haberler',
        href: '/blog',
        active: true,
        color: 'text-gray-600',
        bg: 'bg-gray-50',
        border: 'border-gray-100'
    },
    {
        id: 'business',
        label: 'İşletme',
        icon: <Building2 size={32} />,
        description: 'İşletme bilgileri ve lokasyon',
        href: '/qr/isletme',
        active: true,
        color: 'text-slate-600',
        bg: 'bg-slate-50',
        border: 'border-slate-100'
    },
    {
        id: 'menu',
        label: 'Menü',
        icon: <Utensils size={32} />,
        description: 'Restoran/Kafe menüsü',
        href: '/qr/menu',
        active: true,
        color: 'text-orange-600',
        bg: 'bg-orange-50',
        border: 'border-orange-100'
    },
    {
        id: 'apps',
        label: 'Uygulamalar',
        icon: <AppWindow size={32} />,
        description: 'App Store veya Google Play',
        href: '/qr/uygulamalar',
        active: true,
        color: 'text-violet-500',
        bg: 'bg-violet-50',
        border: 'border-violet-100'
    },
    {
        id: 'coupon',
        label: 'Kupon',
        icon: <Ticket size={32} />,
        description: 'İndirim kodu ve kampanya',
        href: '/qr/kupon',
        active: true,
        color: 'text-rose-500',
        bg: 'bg-rose-50',
        border: 'border-rose-100'
    },
    {
        id: 'wifi',
        label: 'Kablosuz Ağ',
        icon: <Wifi size={32} />,
        description: 'Wi-Fi ağına otomatik bağlan',
        href: '/qr/wifi',
        active: true,
        color: 'text-indigo-600',
        bg: 'bg-indigo-50',
        border: 'border-indigo-100'
    },
    {
        id: 'pdf-qr',
        label: 'PDF QR',
        icon: <FileText size={32} />,
        description: 'PDF dosyası görüntüleme',
        href: '/qr/pdf',
        active: true,
        color: 'text-red-500',
        bg: 'bg-red-50',
        border: 'border-red-100'
    },
    {
        id: 'video-qr',
        label: 'Video Link',
        icon: <Video size={32} />,
        description: 'Video oynatma sayfası',
        href: '/qr/video',
        active: true,
        color: 'text-purple-500',
        bg: 'bg-purple-50',
        border: 'border-purple-100'
    },
    {
        id: 'image-qr',
        label: 'Görsel Galeri',
        icon: <ImageIcon size={32} />,
        description: 'Fotoğraf galerisi',
        href: '/qr/gorsel',
        active: true,
        color: 'text-green-500',
        bg: 'bg-green-50',
        border: 'border-green-100'
    },
    {
        id: 'vcard',
        label: 'vCard',
        icon: <UserSquare size={32} />,
        description: 'Dijital kartvizit',
        href: '/qr/vcard',
        active: true,
        color: 'text-orange-500',
        bg: 'bg-orange-50',
        border: 'border-orange-100'
    },
    {
        id: 'social',
        label: 'Sosyal Medya',
        icon: <Share2 size={32} />,
        description: 'Tüm hesaplarınız tek yerde',
        href: '/qr/sosyal-medya',
        active: true,
        color: 'text-pink-500',
        bg: 'bg-pink-50',
        border: 'border-pink-100'
    },
    {
        id: 'mp3',
        label: 'MP3',
        icon: <Music size={32} />,
        description: 'Ses dosyası çalma',
        href: '/qr/mp3',
        active: true,
        color: 'text-indigo-500',
        bg: 'bg-indigo-50',
        border: 'border-indigo-100'
    }
];

export default function HomeServices() {
    const pathname = usePathname();

    // Hide on admin routes
    if (pathname?.startsWith('/erashu/admin')) {
        return null;
    }

    return (
        <section className="py-12 bg-gray-50 border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl mb-4">
                        Hizmetlerimiz
                    </h2>
                    <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                        Dijital çözümlerimizle işinizi ve sosyal varlığınızı güçlendirin.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {QR_TYPES.map((type) => (
                        <div key={type.id} className="relative group">
                            {type.active ? (
                                <Link href={type.href} className="block h-full">
                                    <div className={`h-full p-6 rounded-2xl bg-white border-2 ${type.border} shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group-hover:border-opacity-100 flex flex-col items-center text-center`}>
                                        <div className={`w-16 h-16 rounded-xl ${type.bg} ${type.color} flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}>
                                            {type.icon}
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                                            {type.label}
                                        </h3>
                                        <p className="text-gray-500 text-sm">
                                            {type.description}
                                        </p>
                                        <div className="mt-4 flex items-center text-sm font-medium text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                            Keşfet &rarr;
                                        </div>
                                    </div>
                                </Link>
                            ) : (
                                <div className="h-full p-6 rounded-2xl bg-white border border-gray-100 shadow-sm opacity-60 cursor-not-allowed flex flex-col items-center text-center">
                                    <div className="w-16 h-16 rounded-xl bg-gray-50 text-gray-400 flex items-center justify-center mb-4">
                                        {type.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-400 mb-2">
                                        {type.label}
                                    </h3>
                                    <p className="text-gray-400 text-sm">
                                        {type.description}
                                    </p>
                                    <div className="mt-4 flex items-center text-xs font-bold text-orange-500 bg-orange-50 py-1 px-3 rounded-full w-max">
                                        <Lock size={12} className="mr-1" />
                                        Yakında
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
