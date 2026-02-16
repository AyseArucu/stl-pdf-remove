'use client';

import { useState } from 'react';

type MediaItem = {
    type: 'image' | 'video';
    url: string;
    thumbnail?: string;
};

type Props = {
    media?: MediaItem[];
    images?: string[];
};

export default function ProductGallery({ media, images }: Props) {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const items: MediaItem[] = media || (images ? images.map(url => ({ type: 'image', url })) : []);

    // Safety check
    if (items.length === 0) {
        return <div className="p-4 text-center text-gray-400">Görsel yok</div>;
    }

    const selectedItem = items[selectedIndex];

    return (
        <div className="product-gallery">
            <div className="gallery-main">
                <div className="gallery-image-wrapper" style={{ maxHeight: '2000px' }}>
                    {selectedItem.type === 'video' ? (
                        <video
                            src={selectedItem.url}
                            controls
                            className="gallery-image-main w-full h-auto object-contain"
                            style={{ maxHeight: '2000px' }}
                            poster={selectedItem.thumbnail}
                        />
                    ) : (
                        <img
                            src={selectedItem.url}
                            alt="Product View"
                            className="gallery-image-main w-full h-auto object-contain"
                            style={{ maxHeight: '2000px' }}
                        />
                    )}
                </div>
            </div>
            {items.length > 1 && (
                <div className="gallery-thumbs">
                    {items.map((item, idx) => (
                        <div
                            key={idx}
                            className={`gallery-thumb ${idx === selectedIndex ? 'active' : ''}`}
                            onMouseEnter={() => setSelectedIndex(idx)} // keep mouse enter logic? maybe click for video
                            onClick={() => setSelectedIndex(idx)}
                        >
                            {item.type === 'video' ? (
                                <div className="relative w-full h-full flex items-center justify-center bg-gray-100">
                                    <span className="text-xl">▶</span>
                                </div>
                            ) : (
                                <img src={item.url} alt={`Thumbnail ${idx}`} />
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
