'use client';

import dynamic from 'next/dynamic';
import React from 'react';

const ClientToolsWrapper = dynamic(() => import('./ClientToolsWrapper'), {
    ssr: false,
    loading: () => <div className="min-h-screen flex items-center justify-center">Loading Client Tools...</div>
});

export default function ClientToolsLoader() {
    return <ClientToolsWrapper />;
}
