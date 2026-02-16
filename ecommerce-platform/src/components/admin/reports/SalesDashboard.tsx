'use client';

import { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { FaFileExcel, FaFilePdf, FaCalendarAlt } from 'react-icons/fa';

interface Order {
    id: string;
    total: number;
    discountTotal?: number;
    status: string;
    date: string;
    items: { productId: string; productName: string; quantity: number; price: number }[];
    type?: 'PRODUCT' | 'SERVICE';
}


export default function SalesDashboard({ orders }: { orders: Order[] }) {
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    const months = [
        'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
        'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
    ];

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

    // Filter Logic
    const filteredOrders = useMemo(() => {
        return orders.filter(order => {
            const d = new Date(order.date);
            return d.getMonth() === selectedMonth &&
                d.getFullYear() === selectedYear &&
                order.status !== 'İptal' && // Exclude cancelled
                order.status !== 'İade'; // Exclude returned if exists
        });
    }, [orders, selectedMonth, selectedYear]);

    // Aggregations
    const stats = useMemo(() => {
        let totalItems = 0;
        let totalOrders = 0;
        let productCheck = 0;
        let serviceCheck = 0;
        let grossRevenue = 0;
        let productRevenue = 0;
        let serviceRevenue = 0;
        let totalDiscount = 0;

        filteredOrders.forEach(order => {
            totalOrders += 1;
            const orderTotal = order.total + (order.discountTotal || 0);
            grossRevenue += orderTotal;
            totalDiscount += (order.discountTotal || 0);

            if (order.type === 'SERVICE') {
                serviceCheck += 1;
                serviceRevenue += orderTotal;
            } else {
                productCheck += 1;
                productRevenue += orderTotal;
                order.items.forEach(item => totalItems += item.quantity);
            }
        });

        return {
            totalItems,
            totalOrders,
            productOrders: productCheck,
            serviceOrders: serviceCheck,
            grossRevenue,
            productRevenue,
            serviceRevenue,
            totalDiscount,
            netRevenue: grossRevenue - totalDiscount
        };
    }, [filteredOrders]);

    // Top Products
    const topProducts = useMemo(() => {
        const productMap = new Map<string, { name: string, qty: number, revenue: number }>();

        filteredOrders.forEach(order => {
            order.items.forEach(item => {
                const existing = productMap.get(item.productId) || { name: item.productName, qty: 0, revenue: 0 };
                existing.qty += item.quantity;
                existing.revenue += item.quantity * item.price;
                productMap.set(item.productId, existing);
            });
        });

        return Array.from(productMap.values())
            .sort((a, b) => b.qty - a.qty)
            .slice(0, 5);
    }, [filteredOrders]);

    // Chart Data
    const chartData = useMemo(() => {
        const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
        const data = Array.from({ length: daysInMonth }, (_, i) => ({
            day: i + 1,
            sales: 0,
            revenue: 0
        }));

        filteredOrders.forEach(order => {
            const day = new Date(order.date).getDate();
            if (data[day - 1]) {
                data[day - 1].sales += 1;
                data[day - 1].revenue += order.total;
            }
        });

        return data;
    }, [filteredOrders, selectedMonth, selectedYear]);

    // Export Functions
    const exportExcel = () => {
        const ws = XLSX.utils.json_to_sheet(filteredOrders.map(o => ({
            ID: o.id,
            Tarih: new Date(o.date).toLocaleDateString('tr-TR'),
            Tutar: o.total,
            İndirim: o.discountTotal || 0,
            Durum: o.status
        })));
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Satış Raporu");
        XLSX.writeFile(wb, `Satis_Raporu_${months[selectedMonth]}_${selectedYear}.xlsx`);
    };

    const exportPDF = () => {
        const doc = new jsPDF();
        doc.text(`Satış Raporu - ${months[selectedMonth]} ${selectedYear}`, 14, 15);

        const tableData = filteredOrders.map(o => [
            o.id.substring(0, 8),
            new Date(o.date).toLocaleDateString('tr-TR'),
            `${o.total.toFixed(2)} TL`,
            o.status
        ]);

        autoTable(doc, {
            head: [['Sipariş ID', 'Tarih', 'Tutar', 'Durum']],
            body: tableData,
            startY: 20
        });

        doc.save(`Satis_Raporu_${months[selectedMonth]}_${selectedYear}.pdf`);
    };

    return (
        <div className="container mx-auto" style={{ padding: '2rem 1rem', maxWidth: '1400px', margin: '0 auto' }}>
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8"
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', backgroundColor: '#fff', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #f3f4f6', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2"
                    style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1f2937', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                    <FaCalendarAlt style={{ color: '#9333ea' }} />
                    Satış Analizi
                </h1>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <select
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(Number(e.target.value))}
                        style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', border: '1px solid #e5e7eb', outline: 'none' }}
                    >
                        {months.map((m, i) => <option key={i} value={i}>{m}</option>)}
                    </select>
                    <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(Number(e.target.value))}
                        style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', border: '1px solid #e5e7eb', outline: 'none' }}
                    >
                        {years.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8"
                style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #f3f4f6', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 500 }}>Toplam Ciro</h3>
                    <p style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1f2937', marginTop: '0.5rem' }}>{stats.netRevenue.toLocaleString('tr-TR')} TL</p>
                </div>
                <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #e0f2fe', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ fontSize: '0.875rem', color: '#0369a1', fontWeight: 500 }}>Ürün Cirosu</h3>
                    <p style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0c4a6e', marginTop: '0.5rem' }}>{stats.productRevenue.toLocaleString('tr-TR')} TL</p>
                    <span className="text-xs text-blue-400">{stats.productOrders} Sipariş</span>
                </div>
                <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #f3e8ff', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ fontSize: '0.875rem', color: '#7e22ce', fontWeight: 500 }}>Hizmet Cirosu</h3>
                    <p style={{ fontSize: '1.25rem', fontWeight: 700, color: '#581c87', marginTop: '0.5rem' }}>{stats.serviceRevenue.toLocaleString('tr-TR')} TL</p>
                    <span className="text-xs text-purple-400">{stats.serviceOrders} Hizmet</span>
                </div>
                <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #f3f4f6', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 500 }}>Satılan Ürün</h3>
                    <p style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1f2937', marginTop: '0.5rem' }}>{stats.totalItems}</p>
                </div>
                <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #fff7ed', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ fontSize: '0.875rem', color: '#c2410c', fontWeight: 500 }}>İndirim Tutarı</h3>
                    <p style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ea580c', marginTop: '0.5rem' }}>{stats.totalDiscount.toLocaleString('tr-TR')} TL</p>
                </div>
            </div>

            {/* Charts Section */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
                {/* Revenue Trend */}
                <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #f3f4f6', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#1f2937', marginBottom: '1.5rem' }}>Günlük Ciro Trendi</h3>
                    <div style={{ height: '300px', width: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#6B7280' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280' }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                    formatter={(value: any) => [`${value} TL`, 'Ciro']}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="#8884d8" fillOpacity={1} fill="url(#colorRevenue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Sales Count Trend */}
                <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #f3f4f6', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#1f2937', marginBottom: '1.5rem' }}>Satış Adedi Dağılımı</h3>
                    <div style={{ height: '300px', width: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#6B7280' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280' }} />
                                <Tooltip
                                    cursor={{ fill: '#F3F4F6' }}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                />
                                <Bar dataKey="sales" fill="#82ca9d" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Bottom Section */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                {/* Top Products */}
                <div style={{ gridColumn: 'span 2', backgroundColor: '#fff', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #f3f4f6', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#1f2937', marginBottom: '1.5rem' }}>En Çok Satan Ürünler</h3>
                    <div className="overflow-x-auto">
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead style={{ backgroundColor: '#f9fafb', color: '#4b5563', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                <tr>
                                    <th style={{ padding: '0.75rem 1rem', borderRadius: '0.5rem 0 0 0.5rem' }}>Ürün Adı</th>
                                    <th style={{ padding: '0.75rem 1rem' }}>Satış Adedi</th>
                                    <th style={{ padding: '0.75rem 1rem', borderRadius: '0 0.5rem 0.5rem 0' }}>Toplam Ciro</th>
                                </tr>
                            </thead>
                            <tbody style={{ fontSize: '0.875rem' }}>
                                {topProducts.map((p, idx) => (
                                    <tr key={idx} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                        <td style={{ padding: '0.75rem 1rem', fontWeight: 500, color: '#1f2937' }}>{p.name}</td>
                                        <td style={{ padding: '0.75rem 1rem', color: '#4b5563' }}>{p.qty}</td>
                                        <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: '#1f2937' }}>{p.revenue.toLocaleString('tr-TR')} TL</td>
                                    </tr>
                                ))}
                                {topProducts.length === 0 && (
                                    <tr>
                                        <td colSpan={3} style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>Bu ay için veri bulunamadı.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Export Actions */}
                <div style={{ backgroundColor: '#faf5ff', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #e9d5ff' }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#1f2937', marginBottom: '1rem' }}>Dışa Aktar</h3>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1.5rem' }}>Raporunuzu farklı formatlarda indirebilirsiniz.</p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <button onClick={exportExcel} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', backgroundColor: '#16a34a', color: 'white', padding: '0.75rem', borderRadius: '0.5rem', fontWeight: 500, border: 'none', cursor: 'pointer', transition: 'background-color 0.2s', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                            <FaFileExcel style={{ fontSize: '1.25rem' }} /> Excel Olarak İndir
                        </button>
                        <button onClick={exportPDF} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', backgroundColor: '#dc2626', color: 'white', padding: '0.75rem', borderRadius: '0.5rem', fontWeight: 500, border: 'none', cursor: 'pointer', transition: 'background-color 0.2s', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                            <FaFilePdf style={{ fontSize: '1.25rem' }} /> PDF Olarak İndir
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
