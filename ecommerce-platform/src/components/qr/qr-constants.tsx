import React from 'react';
import { LayoutGrid, Box, Circle, Heart, Diamond, Square } from 'lucide-react';

export type PatternType = 'square' | 'rounded' | 'soft' | 'dot' | 'heart' | 'diamond';
export type CornerType = 'square' | 'rounded' | 'extra-rounded' | 'dot';
export type GradientType = { enabled: boolean; start: string; end: string; };

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
    { id: 'hand', label: 'El', defaultLabel: 'Scan', editable: true },
    { id: 'polaroid', label: 'Polaroid', defaultLabel: 'Memory', editable: true },
];

export const PATTERN_OPTIONS: { id: PatternType; label: string; icon: any }[] = [
    { id: 'square', label: 'Klasik', icon: <LayoutGrid size={20} /> },
    { id: 'rounded', label: 'Yuvarlak', icon: <Box size={20} className="rounded-md" /> },
    { id: 'soft', label: 'Yumuşak', icon: <Box size={20} className="rounded-sm" /> },
    { id: 'dot', label: 'Nokta', icon: <Circle size={20} /> },
    { id: 'heart', label: 'Kalp', icon: <Heart size={20} /> },
    { id: 'diamond', label: 'Elmas', icon: <Diamond size={20} /> },
];

export const CORNER_OPTIONS: { id: CornerType; label: string; icon: any }[] = [
    { id: 'square', label: 'Kare', icon: <Square size={20} /> },
    { id: 'rounded', label: 'Yuvarlak', icon: <Box size={20} className="rounded-lg" /> },
    { id: 'extra-rounded', label: 'Yastık', icon: <Box size={20} className="rounded-2xl" /> },
    { id: 'dot', label: 'Nokta', icon: <Circle size={20} className="border-4" /> },
];
