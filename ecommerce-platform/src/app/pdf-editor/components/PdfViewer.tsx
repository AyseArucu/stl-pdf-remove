'use client';

import React, { useState } from 'react';
import { Document, Page } from 'react-pdf';
import { Loader2 } from 'lucide-react';

import { ToolType } from './Toolbar';
import { AnnotationLayer } from './AnnotationLayer';

interface PdfViewerProps {
    pdfUrl: string;
    scale?: number;
    activeTool: ToolType;
    brushColor?: string;
    brushWidth?: number;
    onCanvasReady?: (pageNumber: number, canvas: any) => void;
    annotations: any[];
    onAddAnnotation: (a: any) => void;
    onDeleteAnnotation: (id: string) => void;
    enableTextLayer?: boolean;
}

export const PdfViewer: React.FC<PdfViewerProps> = ({
    pdfUrl,
    scale = 1.0,
    activeTool,
    brushColor,
    brushWidth,
    onCanvasReady,
    annotations,
    onAddAnnotation,
    onDeleteAnnotation,
    enableTextLayer = false,
}) => {
    const [numPages, setNumPages] = useState<number | null>(null);
    const [pageDimensions, setPageDimensions] = useState<{ [key: number]: { width: number, height: number } }>({});

    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        setNumPages(numPages);
    }

    function onPageLoadSuccess(page: any) {
        setPageDimensions(prev => ({
            ...prev,
            [page.pageNumber]: {
                width: page.width,
                height: page.height
            }
        }));
    }

    return (
        <div className="flex flex-col items-center gap-4 py-8">
            <Document
                file={pdfUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                loading={
                    <div className="flex flex-col items-center justify-center p-12">
                        <Loader2 className="animate-spin text-blue-500 mb-2" size={32} />
                        <span className="text-gray-500">PDF Yükleniyor...</span>
                    </div>
                }
                error={
                    <div className="text-red-500 p-4 border border-red-200 bg-red-50 rounded">
                        PDF Yüklenemedi. Lütfen dosyanın geçerli olduğundan emin olun.
                    </div>
                }
                className="pdf-document"
            >
                {Array.from(new Array(numPages), (el, index) => {
                    const pageNum = index + 1;
                    const dims = pageDimensions[pageNum];

                    return (
                        <div id={`page-container-${pageNum}`} key={`page_${pageNum}`} className="relative mb-4 shadow-lg border border-gray-200 bg-white">
                            <Page
                                pageNumber={pageNum}
                                scale={scale}
                                renderTextLayer={enableTextLayer}
                                renderAnnotationLayer={false}
                                className="bg-white pointer-events-none"
                                onLoadSuccess={onPageLoadSuccess}
                            />
                            {/* Overlay Canvas */}
                            {dims && (
                                <div className="absolute inset-0 z-[50]" style={{ width: dims.width, height: dims.height }}>
                                    <AnnotationLayer
                                        width={dims.width}
                                        height={dims.height}
                                        activeTool={activeTool}
                                        brushColor={brushColor}
                                        brushWidth={brushWidth}
                                        pageNumber={pageNum}
                                        onCanvasReady={onCanvasReady}
                                        annotations={annotations}
                                        onAddAnnotation={onAddAnnotation}
                                        onDeleteAnnotation={onDeleteAnnotation}
                                    />
                                </div>
                            )}
                        </div>
                    );
                })}
            </Document>
        </div>
    );
};
