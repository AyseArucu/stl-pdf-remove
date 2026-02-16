'use client';

import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';

export type PatternType = 'square' | 'rounded' | 'soft' | 'dot' | 'heart' | 'diamond';
export type CornerType = 'square' | 'dot' | 'rounded' | 'extra-rounded';

export type GradientType = {
    start: string;
    end: string;
    enabled: boolean;
};

interface CustomQRCodeProps {
    value: string;
    size?: number;
    fgColor: string;
    bgColor: string;
    pattern: PatternType;
    cornerStyle?: CornerType;
    cornerColor?: string;
    gradient?: GradientType;
    logo?: string | null;
}

const CustomQRCode = ({
    value,
    size = 200,
    fgColor,
    bgColor,
    pattern,
    cornerStyle = 'square',
    cornerColor,
    gradient,
    logo
}: CustomQRCodeProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Generate QR Data
        const qrData = QRCode.create(value, {
            errorCorrectionLevel: 'H'
        });

        const modules = qrData.modules;
        const matrixSize = modules.size;

        // Setup Canvas
        const scale = 4; // internal scale factor
        const pixelSize = size;

        canvas.width = pixelSize * scale;
        canvas.height = pixelSize * scale;
        ctx.scale(scale, scale);

        // 1. Draw Background
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, pixelSize, pixelSize);

        // Prepare Gradients/Colors
        let mainFill: string | CanvasGradient = fgColor;
        if (gradient?.enabled) {
            const grad = ctx.createLinearGradient(0, 0, pixelSize, pixelSize);
            grad.addColorStop(0, gradient.start);
            grad.addColorStop(1, gradient.end);
            mainFill = grad;
        }

        const effectiveCornerColor = cornerColor || (gradient?.enabled ? gradient.start : fgColor);

        // Calculate cell size
        const cellSize = pixelSize / matrixSize;

        // Helper: Is this module part of a corner eye (Finder Pattern)?
        const isEye = (r: number, c: number) => {
            return (r < 7 && c < 7) ||
                (r < 7 && c >= matrixSize - 7) ||
                (r >= matrixSize - 7 && c < 7);
        };

        // Draw Function
        const drawModule = (r: number, c: number, type: PatternType | CornerType, color: string | CanvasGradient) => {
            const x = c * cellSize;
            const y = r * cellSize;
            const w = cellSize;
            const h = cellSize;

            ctx.fillStyle = color;
            ctx.beginPath();

            switch (type) {
                case 'rounded':
                    // Medium rounded
                    roundRectPath(ctx, x, y, w, h, w * 0.25);
                    break;
                case 'extra-rounded':
                case 'soft':
                    roundRectPath(ctx, x, y, w, h, w * 0.15);
                    break;
                case 'dot':
                    ctx.arc(x + w / 2, y + h / 2, (w / 2) * 0.85, 0, Math.PI * 2);
                    break;
                case 'heart':
                    drawHeart(ctx, x, y, w, h);
                    break;
                case 'diamond':
                    drawDiamond(ctx, x, y, w, h);
                    break;
                case 'square':
                default:
                    ctx.rect(x, y, w, h);
                    break;
            }
            ctx.fill();
        };

        // Logo Logic Setup
        let logoZone = { startRow: -1, endRow: -1, startCol: -1, endCol: -1 };
        if (logo) {
            const logoSizeCells = Math.floor(matrixSize * 0.22);
            const center = Math.floor(matrixSize / 2);
            const half = Math.floor(logoSizeCells / 2);
            logoZone = {
                startRow: center - half,
                endRow: center + half,
                startCol: center - half,
                endCol: center + half
            };
        }

        for (let r = 0; r < matrixSize; r++) {
            for (let c = 0; c < matrixSize; c++) {
                if (modules.get(c, r)) {
                    // Skip logo zone
                    if (logo &&
                        r >= logoZone.startRow && r <= logoZone.endRow &&
                        c >= logoZone.startCol && c <= logoZone.endCol) {
                        continue;
                    }

                    if (isEye(r, c)) {
                        continue; // Skip individual module drawing for eyes, we draw them manually
                    }

                    // Main Pattern
                    drawModule(r, c, pattern, mainFill);
                }
            }
        }

        // DRAW EYES MANUALLY
        const drawEyeGroup = (startR: number, startC: number) => {
            const startX = startC * cellSize;
            const startY = startR * cellSize;

            ctx.fillStyle = effectiveCornerColor;

            if (cornerStyle === 'dot') {
                // Dot style: Circle Ring + Inner Circle
                const cx = startX + (3.5 * cellSize);
                const cy = startY + (3.5 * cellSize);

                // Outer Ring
                ctx.beginPath();
                ctx.arc(cx, cy, 3.5 * cellSize, 0, Math.PI * 2); // Outer
                ctx.arc(cx, cy, 2.5 * cellSize, 0, Math.PI * 2, true); // Inner hole
                ctx.fill();

                // Inner Dot
                ctx.beginPath();
                ctx.arc(cx, cy, 1.5 * cellSize, 0, Math.PI * 2);
                ctx.fill();

            } else if (cornerStyle === 'rounded' || cornerStyle === 'extra-rounded') {
                // Rounded Square Ring
                const radius = cornerStyle === 'extra-rounded' ? 2.5 * cellSize : 1.5 * cellSize;
                const innerHoleRadius = radius * 0.6;

                ctx.beginPath();
                // Outer 7x7
                roundRectPath(ctx, startX, startY, 7 * cellSize, 7 * cellSize, radius);
                // Inner 5x5 Hole (Reverse direction for cutout effect in single path if supported, 
                // but let's use the fill-over-fill method for simplicity as used before, but strictly)
                ctx.fill();

                // Clear Hole by drawing BG color
                ctx.fillStyle = bgColor;
                ctx.beginPath();
                roundRectPath(ctx, startX + cellSize, startY + cellSize, 5 * cellSize, 5 * cellSize, innerHoleRadius);
                ctx.fill();

                // Restore Color
                ctx.fillStyle = effectiveCornerColor;

                // Inner 3x3 Block
                const innerBlockRadius = radius * 0.4;
                ctx.beginPath();
                roundRectPath(ctx, startX + 2 * cellSize, startY + 2 * cellSize, 3 * cellSize, 3 * cellSize, innerBlockRadius);
                ctx.fill();

            } else {
                // Square (Classic)
                // Outer 7x7
                ctx.fillRect(startX, startY, 7 * cellSize, 7 * cellSize);
                // Clear 5x5
                ctx.clearRect(startX + cellSize, startY + cellSize, 5 * cellSize, 5 * cellSize);
                // Fill Cleared with BG
                ctx.fillStyle = bgColor;
                ctx.fillRect(startX + cellSize, startY + cellSize, 5 * cellSize, 5 * cellSize);

                ctx.fillStyle = effectiveCornerColor;
                // Inner 3x3
                ctx.fillRect(startX + 2 * cellSize, startY + 2 * cellSize, 3 * cellSize, 3 * cellSize);
            }
        };

        // Draw the 3 eyes
        drawEyeGroup(0, 0); // TL
        drawEyeGroup(0, matrixSize - 7); // TR
        drawEyeGroup(matrixSize - 7, 0); // BL

        // 4. Draw Logo
        if (logo) {
            const img = new Image();
            img.src = logo;
            img.onload = () => {
                const logoSize = size * 0.22;
                const center = size / 2;
                const lx = center - logoSize / 2;
                const ly = center - logoSize / 2;
                ctx.drawImage(img, lx, ly, logoSize, logoSize);
            };
        }

    }, [value, size, fgColor, bgColor, pattern, cornerStyle, cornerColor, gradient, logo]);

    // Helpers
    const roundRectPath = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) => {
        ctx.moveTo(x + r, y);
        ctx.arcTo(x + w, y, x + w, y + h, r);
        ctx.arcTo(x + w, y + h, x, y + h, r);
        ctx.arcTo(x, y + h, x, y, r);
        ctx.arcTo(x, y, x + w, y, r);
    };

    const drawDiamond = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) => {
        ctx.moveTo(x + w / 2, y);
        ctx.lineTo(x + w, y + h / 2);
        ctx.lineTo(x + w / 2, y + h);
        ctx.lineTo(x, y + h / 2);
        ctx.closePath();
    };

    const drawHeart = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) => {
        const scale = 0.9;
        const ox = x + (w * (1 - scale)) / 2;
        const oy = y + (h * (1 - scale)) / 2;
        const sw = w * scale;
        const sh = h * scale;

        ctx.moveTo(ox + sw / 2, oy + sh / 4);
        ctx.bezierCurveTo(ox + sw / 2, oy, ox, oy, ox, oy + sh / 4);
        ctx.bezierCurveTo(ox, oy + sh / 2, ox + sw / 2, oy + sh, ox + sw / 2, oy + sh);
        ctx.bezierCurveTo(ox + sw / 2, oy + sh, ox + sw, oy + sh / 2, ox + sw, oy + sh / 4);
        ctx.bezierCurveTo(ox + sw, oy, ox + sw / 2, oy, ox + sw / 2, oy + sh / 4);
        ctx.closePath();
    };

    return <canvas ref={canvasRef} style={{ width: size, height: size }} />;
};

export default CustomQRCode;
