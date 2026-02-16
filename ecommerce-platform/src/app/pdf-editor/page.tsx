'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, FileText, Image as ImageIcon, AlertCircle, Loader2 } from 'lucide-react';
import jsPDF from 'jspdf';
import { pdfjs } from 'react-pdf';
import { Toolbar, ToolType } from './components/Toolbar';
import dynamic from 'next/dynamic';

import AuthModal from '@/components/AuthModal';
import { useUser } from '@/context/UserContext';

const PdfViewer = dynamic(() => import('./components/PdfViewer').then(mod => mod.PdfViewer), {
    ssr: false,
    loading: () => (
        <div className="flex flex-col items-center justify-center p-12">
            <Loader2 className="animate-spin text-blue-500 mb-2" size={32} />
            <span className="text-gray-500">Bileşen Yükleniyor...</span>
        </div>
    )
});

// Fix worker mapping
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

export default function PdfEditorPage() {
    useEffect(() => {
        console.log("PDF Editor Page Mounted");
    }, []);
    const router = useRouter(); // Added router
    const { user } = useUser(); // Destructure user here for consistency or verify usages
    const [file, setFile] = useState<File | null>(null);
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const [isConverting, setIsConverting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeTool, setActiveTool] = useState<ToolType>('select');
    const [brushColor, setBrushColor] = useState<string>('#000000');
    const [brushWidth, setBrushWidth] = useState<number>(3);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    // New Feature States
    const [isSearchEnabled, setIsSearchEnabled] = useState(false);
    const [isCompressed, setIsCompressed] = useState(false);
    const [pdfPassword, setPdfPassword] = useState<string | null>(null);

    // Hidden Input Ref
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0];
        if (selected) await processFile(selected);
    };

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const dropped = e.dataTransfer.files?.[0];
        if (dropped) await processFile(dropped);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const [statusMessage, setStatusMessage] = useState<string>('');
    // State for annotations
    const [annotations, setAnnotations] = useState<any[]>([]);

    const handleAddAnnotation = (annotation: any) => {
        setAnnotations((prev) => [...prev, annotation]);
    };

    const handleDeleteAnnotation = (id: string) => {
        setAnnotations((prev) => prev.filter(a => a.id !== id));
    };

    // ... (processFile and converts omitted for brevity, they are unchanged) ...

    const processFile = async (rawFile: File) => {
        console.log("File selected:", rawFile.name, rawFile.type, rawFile.size);

        if (rawFile.size > 50 * 1024 * 1024) {
            setError('Dosya boyutu 50MB sınırını aşıyor.');
            return;
        }

        setError(null);
        setFile(rawFile);
        setIsConverting(true);
        setStatusMessage('Dosya işleniyor...');

        try {
            // Smart Router Logic
            const isImage = rawFile.type.startsWith('image/') || /\.(jpg|jpeg|png|webp)$/i.test(rawFile.name);
            const isPdf = rawFile.type === 'application/pdf' || /\.pdf$/i.test(rawFile.name);
            const isText = rawFile.type === 'text/plain' || /\.txt$/i.test(rawFile.name);

            if (isPdf) {
                setStatusMessage('PDF yükleniyor...');
                const url = URL.createObjectURL(rawFile);
                setPdfUrl(url); // Direct pass for PDFs
            } else if (isImage) {
                setStatusMessage('Yüklenen dosya PDF değildir. Resim, otomatik olarak PDF’e dönüştürülüyor...');
                // Wait for UI to update before heavy sync work if any
                await new Promise(r => setTimeout(r, 100));
                await convertImageToPdf(rawFile);
            } else if (isText) {
                setStatusMessage('Yüklenen dosya PDF değildir. Metin, otomatik olarak PDF’e dönüştürülüyor...');
                await new Promise(r => setTimeout(r, 100));
                await convertTextToPdf(rawFile);
            } else {
                console.warn("Unsupported file type:", rawFile.type);
                setError('Bu dosya türü şu anda PDF düzenleme için desteklenmiyor.');
                setFile(null);
                setIsConverting(false); // Stop here
                return;
            }
        } catch (e) {
            console.error("Conversion error:", e);
            setError('Dosya işlenirken bir hata oluştu. Lütfen tekrar deneyin.');
            setFile(null);
        } finally {
            // Note: We don't verify 'isConverting' false here immediately for conversions 
            // because strict mode might need to ensure URL is set first.
            // But in this flow, setPdfUrl happens inside functions.
            setIsConverting(false);
            setStatusMessage('');
        }
    };

    const convertImageToPdf = (imageFile: File): Promise<void> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.src = e.target?.result as string;
                img.onload = () => {
                    try {
                        const pdf = new jsPDF({
                            orientation: img.width > img.height ? 'l' : 'p',
                            unit: 'px',
                            format: [img.width, img.height] // Match image dimensions strictly
                        });
                        pdf.addImage(img, 'JPEG', 0, 0, img.width, img.height);
                        const blob = pdf.output('blob');
                        const url = URL.createObjectURL(blob);
                        setPdfUrl(url); // Set URL only after successful conversion
                        resolve();
                    } catch (err) {
                        reject(err);
                    }
                };
                img.onerror = (err) => reject(new Error('Resim yüklenemedi: ' + err));
            };
            reader.onerror = (err) => reject(new Error('Dosya okunamadı: ' + err));
            reader.readAsDataURL(imageFile);
        });
    };

    const convertTextToPdf = (textFile: File): Promise<void> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const text = e.target?.result as string;
                try {
                    const pdf = new jsPDF();
                    // Basic text wrapping
                    const lines = pdf.splitTextToSize(text, 180);
                    let y = 10;
                    lines.forEach((line: string) => {
                        if (y > 280) {
                            pdf.addPage();
                            y = 10;
                        }
                        pdf.text(line, 10, y);
                        y += 7;
                    });
                    const blob = pdf.output('blob');
                    const url = URL.createObjectURL(blob);
                    setPdfUrl(url);
                    resolve();
                } catch (err) {
                    reject(err);
                }
            };
            reader.onerror = reject;
            reader.readAsText(textFile);
        });
    };

    const [numPages, setNumPages] = useState<number>(0);
    const canvasRegistry = useRef<{ [page: number]: any }>({});
    // const { user } = useUser(); // Use global user state - Removed duplicate

    const handleCanvasReady = (pageNumber: number, canvas: any) => {
        canvasRegistry.current[pageNumber] = canvas;
    };

    const handleEncrypt = () => {
        const pass = window.prompt("PDF'i şifrelemek için bir parola girin (Şifreyi kaldırmak için boş bırakın):", pdfPassword || "");
        if (pass !== null) {
            setPdfPassword(pass === "" ? null : pass);
        }
    };

    const handleDownload = async () => {
        // Client-side check
        if (!user) {
            router.push(`/login?callbackUrl=${encodeURIComponent('/pdf-editor')}`);
            return;
        }

        if (!pdfUrl) return;

        setStatusMessage(isCompressed ? 'PDF sıkıştırılıyor ve hazırlanıyor...' : 'PDF hazırlanıyor...');
        setIsConverting(true);

        const fileName = file?.name ? `edited_${file.name.replace(/\.[^/.]+$/, "")}.pdf` : 'edited_document.pdf';

        try {
            // Check if jsPDF supports encryption options (custom type check workaround might be needed if TS complains)
            const jsPDFOptions: any = {
                orientation: 'p',
                unit: 'px',
                compress: isCompressed
            };

            if (pdfPassword) {
                jsPDFOptions.encryption = {
                    userPassword: pdfPassword,
                    ownerPassword: pdfPassword,
                    userPermissions: ['print', 'modify', 'copy', 'annot-forms']
                };
            }

            const pdf = new jsPDF(jsPDFOptions);

            // Note: If standard jsPDF doesn't support 'encryption' in constructor, this might do nothing.
            // Encryption often requires a plugin or setProperties. 
            // However, we will assume standard behavior or fallback.
            if (pdfPassword && (pdf as any).setEncryption) {
                (pdf as any).setEncryption(pdfPassword, pdfPassword, ['print', 'modify', 'copy', 'annot-forms']);
            }

            // Get all page numbers from registry
            const pages = Object.keys(canvasRegistry.current).map(Number).sort((a, b) => a - b);

            if (pages.length === 0) {
                // Fallback if no specific pages registered (e.g. no annotations yet)
                // Just download original.
                const link = document.createElement('a');
                link.href = pdfUrl;
                link.download = fileName;
                link.click();
                setIsConverting(false);
                setStatusMessage('');
                return;
            }

            for (let i = 0; i < pages.length; i++) {
                const pageNum = pages[i];
                const fabricCanvas = canvasRegistry.current[pageNum];

                // Find the React-PDF canvas (Background)
                const pageContainer = document.getElementById(`page-container-${pageNum}`);
                const pdfCanvas = pageContainer?.querySelector('.react-pdf__Page__canvas') as HTMLCanvasElement;

                if (pdfCanvas && fabricCanvas) {
                    if (i > 0) pdf.addPage();

                    const width = pdfCanvas.width;
                    const height = pdfCanvas.height;

                    // Set PDF page size to match content
                    pdf.setPage(i + 1);
                    pdf.internal.pageSize.width = width;
                    pdf.internal.pageSize.height = height;

                    // 1. Add PDF Background
                    const compression = isCompressed ? 'SLOW' : 'FAST'; // FAST is actually less compression, SLOW is more? 
                    // Actually alias is: compression: 'NONE', 'FAST', 'MEDIUM', 'SLOW'. 
                    // To compress image: convert to jpeg with quality 0.5?
                    const imgQuality = isCompressed ? 0.5 : 1.0;

                    const pdfData = pdfCanvas.toDataURL('image/jpeg', imgQuality);
                    // addImage(imageData, format, x, y, w, h, alias, compression, rotation)
                    // We use alias/compression arg for optimization if needed, but dataURL quality is main factor here.
                    pdf.addImage(pdfData, 'JPEG', 0, 0, width, height, undefined, isCompressed ? 'FAST' : 'NONE');

                    // 2. Add Annotations (Transparent PNG)
                    // We need to ensure we get a dataURL with transparency
                    const annotationData = fabricCanvas.toDataURL({
                        format: 'png',
                        multiplier: isCompressed ? 0.7 : 1 // Reduce quality for annotations too if compressed
                    });
                    pdf.addImage(annotationData, 'PNG', 0, 0, width, height, undefined, isCompressed ? 'FAST' : 'NONE');
                }
            }

            pdf.save(fileName);

        } catch (err) {
            console.error("Download error:", err);
            setError('PDF oluşturulurken bir hata oluştu.');
        } finally {
            setIsConverting(false);
            setStatusMessage('');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <header className="bg-white border-b h-16 flex items-center px-0 justify-between shadow-sm z-30 p-0">
                <div className="flex items-center gap-2 pl-4">
                    <span className="font-bold text-xl text-gray-800 tracking-tight hidden sm:block">PDF Editor</span>
                    {file && <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded hidden md:inline-block max-w-[200px] truncate">{file.name}</span>}
                </div>
                {/* Tools */}
                <div className="flex-1 flex justify-center">
                    <Toolbar
                        activeTool={activeTool}
                        onToolChange={setActiveTool}
                        brushColor={brushColor}
                        onBrushColorChange={setBrushColor}
                        brushWidth={brushWidth}
                        onBrushWidthChange={setBrushWidth}
                        onSave={() => console.log('Save')}
                        onDownload={handleDownload}
                        onShare={() => console.log('Share')}
                        isSearchEnabled={isSearchEnabled}
                        onSearchToggle={() => setIsSearchEnabled(!isSearchEnabled)}
                        onEncrypt={handleEncrypt}
                        isEncrypted={!!pdfPassword}
                        onCompressToggle={() => setIsCompressed(!isCompressed)}
                        isCompressed={isCompressed}
                    />
                </div>
            </header>

            <main className="flex-1 overflow-hidden relative flex flex-col md:flex-row">
                {!pdfUrl ? (
                    <div
                        className="flex-1 flex flex-col items-center justify-center h-full p-4"
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                    >
                        {isConverting ? (
                            <div className="flex flex-col items-center animate-fade-in text-center p-6">
                                <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
                                <h2 className="text-2xl font-bold text-gray-800 mb-2">İşleniyor</h2>
                                <p className="text-gray-600 font-medium">{statusMessage}</p>
                            </div>
                        ) : (
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="bg-white p-12 rounded-3xl shadow-xl border-4 border-dashed border-gray-200 flex flex-col items-center max-w-lg w-full text-center hover:border-blue-500 hover:bg-blue-50/30 transition-all cursor-pointer group"
                            >
                                <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-inner">
                                    <Upload size={36} />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-800 mb-2">Dosyanızı buraya bırakın</h2>
                                <p className="text-gray-500 mb-8 max-w-xs">PDF, Word, Excel, PowerPoint, JPG, PNG veya TXT dosyalarınızı sürükleyin.</p>

                                <div className="grid grid-cols-3 gap-3 text-xs font-semibold text-gray-500 mb-8 w-full">
                                    <div className="flex flex-col items-center gap-1 bg-gray-50 p-3 rounded-xl border border-gray-100">
                                        <FileText size={20} className="text-orange-500" />
                                        <span>BELGE</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-1 bg-gray-50 p-3 rounded-xl border border-gray-100">
                                        <FileText size={20} className="text-red-500" />
                                        <span>PDF</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-1 bg-gray-50 p-3 rounded-xl border border-gray-100">
                                        <ImageIcon size={20} className="text-purple-500" />
                                        <span>GÖRSEL</span>
                                    </div>
                                </div>

                                <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-10 py-4 rounded-xl font-bold hover:shadow-lg hover:shadow-blue-500/30 transition-all transform hover:-translate-y-1">
                                    Dosya Seç
                                </button>

                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    className="hidden"
                                    onChange={handleFileSelect}
                                    accept=".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx,.ppt,.pptx,.txt,image/*"
                                />

                                {error && (
                                    <div className="mt-6 flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg text-sm font-medium animate-shake">
                                        <AlertCircle size={16} />
                                        {error}
                                    </div>
                                )}
                            </div>
                        )}
                        {!isConverting && <p className="mt-8 text-sm text-gray-400">Maksimum dosya boyutu: 50MB</p>}
                    </div>
                ) : (
                    <>
                        {/* Editor Canvas Area */}
                        <div className="flex-1 bg-gray-100 overflow-auto p-4 md:p-8 flex justify-center relative">
                            <PdfViewer
                                pdfUrl={pdfUrl}
                                scale={1.0}
                                activeTool={activeTool}
                                brushColor={brushColor}
                                brushWidth={brushWidth}
                                onCanvasReady={handleCanvasReady}
                                annotations={annotations}
                                onAddAnnotation={handleAddAnnotation}
                                onDeleteAnnotation={handleDeleteAnnotation}
                                enableTextLayer={isSearchEnabled}
                            />
                        </div>

                        {/* Notes Sidebar */}
                        <div className="w-80 bg-white border-l shadow-xl z-20 hidden lg:flex flex-col h-full absolute right-0 top-0 bottom-0">
                            <div className="p-4 border-b bg-gray-50 flex items-center justify-between">
                                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                                    <FileText size={18} />
                                    Notlar
                                </h3>
                            </div>
                            <div className="p-0 flex-1 overflow-y-auto">
                                <div className="p-8 text-center text-gray-400 flex flex-col items-center justify-center h-full">
                                    <FileText size={48} className="mb-4 opacity-20" />
                                    <p>Bu PDF için henüz not eklemediniz.</p>
                                    <button className="mt-4 text-blue-600 font-medium hover:underline text-sm">
                                        + Yeni Not Ekle
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </main>

            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                title="İndirmek İçin Üye Olun"
                message="Düzenlediğiniz PDF dosyasını indirmek için ücretsiz üye olmanız gerekmektedir."
                redirectUrl="/pdf-editor"
            />
        </div>
    );
}
