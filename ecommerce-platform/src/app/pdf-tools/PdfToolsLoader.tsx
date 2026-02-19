'use client';

import dynamic from 'next/dynamic';
import React from 'react';

const PdfToolsWrapper = dynamic(() => import("./PdfToolsWrapper"), {
    ssr: false
});

export default function PdfToolsLoader() {
    return <PdfToolsWrapper />;
}
