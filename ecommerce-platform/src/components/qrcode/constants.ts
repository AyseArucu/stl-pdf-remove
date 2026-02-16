
import React from 'react';
import { LayoutGrid, Box, Circle, Heart, Diamond, Square } from 'lucide-react';
import { PatternType, CornerType } from '@/components/CustomQRCode';

export const FRAME_OPTIONS = [
    // Simple
    { id: 'none', label: 'Yok', category: 'simple', editable: false },
    { id: 'border', label: 'Kare', category: 'simple', editable: false },
    { id: 'border-thick', label: 'Kalın', category: 'simple', editable: false },
    { id: 'rounded', label: 'Yuvarlak', category: 'simple', editable: false },
    { id: 'modern-thin', label: 'Modern', category: 'simple', editable: false },

    // Labeled
    { id: 'label-bottom', label: 'Alt Etiket', defaultLabel: 'SCAN ME', editable: true },
    { id: 'label-top', label: 'Üst Etiket', defaultLabel: 'SCAN ME', editable: true },
    { id: 'bubble-top', label: 'Baloncuk', defaultLabel: 'SCAN ME', editable: true },
    { id: 'handwriting', label: 'El Yazısı', defaultLabel: 'Scan Me', editable: true },

    // Concepts
    { id: 'phone', label: 'Telefon', defaultLabel: 'Instagram', editable: true },
    { id: 'mug', label: 'Kupa', defaultLabel: 'Coffee', editable: true },
    { id: 'cup-coffee', label: 'Kahve', defaultLabel: 'Hot!', editable: true },
    { id: 'bag', label: 'Çanta', defaultLabel: 'Sale', editable: true },
    { id: 'envelope', label: 'Zarf', defaultLabel: 'Open Me', editable: true },
    { id: 'gift', label: 'Hediye', defaultLabel: 'Gift', editable: true },
    { id: 'scooter', label: 'Teslimat', defaultLabel: 'Order', editable: true },
    { id: 'hand', label: 'El', defaultLabel: 'Scan', editable: true },
    { id: 'polaroid', label: 'Polaroid', defaultLabel: 'Memory', editable: true },
];

export const PATTERN_OPTIONS: { id: PatternType; label: string; icon: any }[] = [
    { id: 'square', label: 'Klasik', icon: LayoutGrid },
    { id: 'rounded', label: 'Yuvarlak', icon: Box },
    { id: 'soft', label: 'Yumuşak', icon: Box }, // You might want different icons but re-using Box is fine if styled diff
    { id: 'dot', label: 'Nokta', icon: Circle },
    { id: 'heart', label: 'Kalp', icon: Heart },
    { id: 'diamond', label: 'Elmas', icon: Diamond },
];

export const CORNER_OPTIONS: { id: CornerType; label: string; icon: any }[] = [
    { id: 'square', label: 'Kare', icon: Square },
    { id: 'rounded', label: 'Yuvarlak', icon: Box },
    { id: 'extra-rounded', label: 'Yastık', icon: Box },
    { id: 'dot', label: 'Nokta', icon: Circle },
];

export interface DesignState {
    frame: string;
    frameLabel: string;
    pattern: PatternType;
    cornerStyle: CornerType;
    cornerColor: string;
    logo: string | null;
    fgColor: string;
    bgColor: string;
    gradient: {
        enabled: boolean;
        start: string;
        end: string;
    };
}
