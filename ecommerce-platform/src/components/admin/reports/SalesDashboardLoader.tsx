'use client';

import dynamic from 'next/dynamic';
import React from 'react';

const SalesDashboard = dynamic(() => import('./SalesDashboard'), {
    ssr: false,
    loading: () => <p className="p-8 text-gray-500">Rapor yükleniyor...</p>
});

export default function SalesDashboardLoader({ orders }: { orders: any }) {
    return <SalesDashboard orders={orders} />;
}
