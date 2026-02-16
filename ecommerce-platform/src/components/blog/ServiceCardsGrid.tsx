import React from 'react';
import Link from 'next/link';
import {
    Building2,
    AppWindow,
    Ticket,
    Video
} from 'lucide-react';

const SERVICE_CARDS = [
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
    }
];

export default function ServiceCardsGrid() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {SERVICE_CARDS.map((type) => (
                <div key={type.id} className="relative group">
                    <Link href={type.href} className="block h-full">
                        <div className={`h-full p-6 rounded-2xl bg-white border-2 ${type.border} shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group-hover:border-opacity-100`}>
                            <div className={`w-16 h-16 rounded-xl ${type.bg} ${type.color} flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}>
                                {type.icon}
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                                {type.label}
                            </h3>
                            <p className="text-gray-500">
                                {type.description}
                            </p>
                            <div className="mt-4 flex items-center text-sm font-medium text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                Göster &rarr;
                            </div>
                        </div>
                    </Link>
                </div>
            ))}
        </div>
    );
}
