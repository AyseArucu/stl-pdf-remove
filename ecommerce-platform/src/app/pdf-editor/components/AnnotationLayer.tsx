'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ToolType } from './Toolbar';

export interface Annotation {
    id: string;
    type: 'highlight' | 'draw' | 'text';
    page: number;
    color: string;
    points?: string; // For path
    rect?: { x: number, y: number, w: number, h: number }; // For highlight
    text?: string;
}

interface AnnotationLayerProps {
    width: number;
    height: number;
    activeTool: ToolType;
    brushColor?: string;
    brushWidth?: number;
    pageNumber: number;
    onCanvasReady?: (pageNumber: number, canvas: any) => void;
    annotations: Annotation[];
    onAddAnnotation: (annotation: Annotation) => void;
    onDeleteAnnotation: (id: string) => void;
}

export const AnnotationLayer: React.FC<AnnotationLayerProps> = ({
    width,
    height,
    activeTool,
    brushColor = 'black',
    brushWidth = 3,
    pageNumber,
    onCanvasReady,
    annotations,
    onAddAnnotation,
    onDeleteAnnotation
}) => {
    // Refs
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fabricLibRef = useRef<any>(null);
    const [fabricCanvas, setFabricCanvas] = useState<any>(null);

    // Filter annotations for this page
    const pageAnnotations = annotations.filter(a => a.page === pageNumber);

    // Initialize Canvas & Library
    useEffect(() => {
        if (!canvasRef.current || fabricCanvas) return;

        const initFabric = async () => {
            try {
                if (!fabricLibRef.current) {
                    const fabricModule: any = await import('fabric');
                    const fabric = fabricModule.default?.fabric || fabricModule.default || fabricModule.fabric || fabricModule;
                    if (!fabric || !fabric.Canvas) return;
                    fabricLibRef.current = fabric;
                }

                const fabric = fabricLibRef.current;
                const canvas = new fabric.Canvas(canvasRef.current, {
                    width,
                    height,
                    isDrawingMode: false,
                    selection: true,
                    backgroundColor: 'transparent',
                });

                canvas.setWidth(width);
                canvas.setHeight(height);

                // Handle Drawing Events
                canvas.on('path:created', (e: any) => {
                    if (activeTool === 'draw') {
                        // Normalize Path Data
                        const pathObj = e.path;
                        // Get generic SVG path d
                        const d = pathObj.path.map((cmd: any[]) => cmd.join(' ')).join(' ');

                        onAddAnnotation({
                            id: crypto.randomUUID(),
                            type: 'draw',
                            page: pageNumber,
                            color: pathObj.stroke || 'black',
                            points: d
                        });

                        // Clear from fabric immediately (rendered by SVG)
                        canvas.remove(pathObj);
                        canvas.requestRenderAll();
                    }
                });

                // Custom Highlight Logic (Rect)
                let isDragging = false;
                let origX = 0;
                let origY = 0;
                let rect: any = null;

                canvas.on('mouse:down', (o: any) => {
                    if (activeTool === 'highlight') {
                        isDragging = true;
                        const pointer = canvas.getPointer(o.e);
                        origX = pointer.x;
                        origY = pointer.y;

                        rect = new fabric.Rect({
                            left: origX,
                            top: origY,
                            originX: 'left',
                            originY: 'top',
                            width: 0,
                            height: 0,
                            fill: 'yellow',
                            opacity: 0.35,
                            selectable: false
                        });
                        canvas.add(rect);
                    }
                });

                canvas.on('mouse:move', (o: any) => {
                    if (!isDragging || !rect || activeTool !== 'highlight') return;
                    const pointer = canvas.getPointer(o.e);

                    if (origX > pointer.x) {
                        rect.set({ left: Math.abs(pointer.x) });
                    }
                    if (origY > pointer.y) {
                        rect.set({ top: Math.abs(pointer.y) });
                    }

                    rect.set({ width: Math.abs(origX - pointer.x) });
                    rect.set({ height: Math.abs(origY - pointer.y) });

                    canvas.requestRenderAll();
                });

                canvas.on('mouse:up', () => {
                    if (isDragging && activeTool === 'highlight' && rect) {
                        isDragging = false;
                        // Save
                        onAddAnnotation({
                            id: crypto.randomUUID(),
                            type: 'highlight',
                            page: pageNumber,
                            color: 'yellow',
                            rect: {
                                x: rect.left,
                                y: rect.top,
                                w: rect.width,
                                h: rect.height
                            }
                        });

                        canvas.remove(rect);
                        rect = null;
                        canvas.requestRenderAll();
                    }
                });


                setFabricCanvas(canvas);
                if (onCanvasReady) onCanvasReady(pageNumber, canvas);

            } catch (err: any) {
                console.error("Error loading fabric:", err);
            }
        };

        initFabric();
    }, [width, height, pageNumber, onCanvasReady]);

    // Tool Updates
    useEffect(() => {
        if (!fabricCanvas || !fabricLibRef.current) return;
        const fabric = fabricLibRef.current;

        fabricCanvas.isDrawingMode = false;
        fabricCanvas.selection = (activeTool === 'select' || activeTool === 'eraser'); // Enable selection for eraser too

        if (activeTool === 'draw') {
            fabricCanvas.isDrawingMode = true;
            if (!fabricCanvas.freeDrawingBrush) {
                fabricCanvas.freeDrawingBrush = new fabric.PencilBrush(fabricCanvas);
            }
            fabricCanvas.freeDrawingBrush.color = brushColor;
            fabricCanvas.freeDrawingBrush.width = brushWidth;
        } else if (activeTool === 'highlight') {
            // Custom logic handled in mouse events
            fabricCanvas.defaultCursor = 'crosshair';
            fabricCanvas.selection = false;
        } else if (activeTool === 'eraser') {
            fabricCanvas.defaultCursor = 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'24\' height=\'24\' viewport=\'0 0 24 24\' fill=\'none\' stroke=\'black\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'><path d=\'M20 20H7L3 16C2 15 2 13 3 12L13 2L22 11L20 20Z\'/><line x1=\'9\' y1=\'7\' x2=\'20\' y2=\'7\'/></svg>") 12 12, auto';
        }
    }, [fabricCanvas, activeTool, brushColor, brushWidth]);

    const handleAnnotationClick = (id: string) => {
        if (activeTool === 'eraser') {
            onDeleteAnnotation(id);
        }
    };

    return (
        <div className="absolute inset-0">
            {/* SVG Overlay - Render Logic */}
            <svg
                viewBox={`0 0 ${width} ${height}`}
                className={`absolute inset-0 z-50 pointer-events-none ${activeTool === 'eraser' ? 'cursor-cell' : ''}`}
                style={{ width, height }}
            >
                {pageAnnotations.map(ann => {
                    const commonProps = {
                        key: ann.id,
                        onClick: () => handleAnnotationClick(ann.id),
                        className: `pointer-events-auto transition-opacity ${activeTool === 'eraser' ? 'cursor-cell hover:opacity-20' : 'cursor-pointer hover:opacity-80'}`
                    };

                    if (ann.type === 'highlight' && ann.rect) {
                        return (
                            <rect
                                {...commonProps}
                                x={ann.rect.x}
                                y={ann.rect.y}
                                width={ann.rect.w}
                                height={ann.rect.h}
                                fill={ann.color}
                                opacity={0.35}
                            />
                        );
                    }
                    if (ann.type === 'draw' && ann.points) {
                        return (
                            <path
                                {...commonProps}
                                d={ann.points}
                                stroke={ann.color}
                                strokeWidth={3}
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        );
                    }
                    return null;
                })}
            </svg>

            {/* Fabric Canvas (Interaction Layer) */}
            <div className="relative z-10 w-full h-full">
                <canvas ref={canvasRef} />
            </div>
        </div>
    );
};
