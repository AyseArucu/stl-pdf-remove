'use client';

import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import jsPDF from 'jspdf';

export default function ClientToolsWrapper() {
    const [activeTab, setActiveTab] = useState<'qr' | 'pdf'>('qr');
    const [qrText, setQrText] = useState('');
    const [qrUrl, setQrUrl] = useState('');
    const [pdfText, setPdfText] = useState('');

    // Client-side only check (redundant but good practice)
    const [isClient, setIsClient] = useState(false);
    useEffect(() => {
        setIsClient(true);
    }, []);

    const generateQR = async () => {
        if (!qrText) return;
        try {
            const url = await QRCode.toDataURL(qrText);
            setQrUrl(url);
        } catch (err) {
            console.error(err);
        }
    };

    const generatePDF = () => {
        const doc = new jsPDF();
        doc.text(pdfText || 'Hello world!', 10, 10);
        doc.save('client-generated.pdf');
    };

    if (!isClient) {
        return <div className="p-8 text-center">Loading client tools...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-sm mt-10">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Client-Side Tools</h1>

            <div className="flex gap-4 mb-6 border-b">
                <button
                    onClick={() => setActiveTab('qr')}
                    className={`pb-2 px-4 transition-colors ${activeTab === 'qr'
                            ? 'border-b-2 border-blue-600 text-blue-600 font-medium'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    QR Generator
                </button>
                <button
                    onClick={() => setActiveTab('pdf')}
                    className={`pb-2 px-4 transition-colors ${activeTab === 'pdf'
                            ? 'border-b-2 border-blue-600 text-blue-600 font-medium'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    PDF Generator
                </button>
            </div>

            <div className="min-h-[300px]">
                {activeTab === 'qr' && (
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold mb-4">QR Code Generator</h2>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={qrText}
                                onChange={(e) => setQrText(e.target.value)}
                                placeholder="Enter text for QR code"
                                className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                            <button
                                onClick={generateQR}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                            >
                                Generate
                            </button>
                        </div>
                        {qrUrl && (
                            <div className="mt-8 flex justify-center p-4 border rounded-lg bg-gray-50">
                                <img src={qrUrl} alt="Generated QR Code" className="w-48 h-48" />
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'pdf' && (
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold mb-4">PDF Generator</h2>
                        <textarea
                            value={pdfText}
                            onChange={(e) => setPdfText(e.target.value)}
                            placeholder="Enter text content for your PDF..."
                            rows={4}
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                        <button
                            onClick={generatePDF}
                            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                        >
                            Download PDF
                        </button>
                        <p className="text-sm text-gray-500 mt-2">
                            * This PDF is generated entirely in your browser. No data is sent to the server.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
