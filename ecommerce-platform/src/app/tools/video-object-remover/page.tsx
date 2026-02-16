'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { FaUpload, FaVideo, FaSpinner, FaEraser, FaPlay, FaPause, FaDownload, FaUndo, FaImage } from 'react-icons/fa';
import { useUser } from '@/context/UserContext';
import { useRouter } from 'next/navigation';

interface Point {
    x: number;
    y: number;
}

export default function VideoObjectRemoverPage() {
    const [videoSrc, setVideoSrc] = useState<string | null>(null);
    const [processedVideoSrc, setProcessedVideoSrc] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);

    const { user } = useUser();
    const router = useRouter();

    // Canvas & Video Refs
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null); // For drawing masks
    const processCanvasRef = useRef<HTMLCanvasElement>(null); // For processing output
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Drawing State
    const [isDrawing, setIsDrawing] = useState(false);
    const [maskPoints, setMaskPoints] = useState<Point[]>([]); // Current stroke
    const [masks, setMasks] = useState<Point[][]>([]); // All masks (paths)
    const [brushSize, setBrushSize] = useState(20);

    const handleFile = (file: File) => {
        if (!file) return;
        if (!file.type.startsWith('video/')) {
            alert('Lütfen geçerli bir video dosyası seçin (MP4, WEBM, MOV).');
            return;
        }

        // 1. Size Constraint: 1GB
        if (file.size > 1024 * 1024 * 1024) {
            alert('Video dosya boyutu 1GB\'dan büyük olamaz.');
            return;
        }

        const url = URL.createObjectURL(file);

        // Check duration by creating a temp video element
        const tempVideo = document.createElement('video');
        tempVideo.preload = 'metadata';
        tempVideo.onloadedmetadata = () => {
            window.URL.revokeObjectURL(tempVideo.src);
            // 2. Duration Constraint: 60s
            if (tempVideo.duration > 60) {
                alert('Video süresi 60 saniyeden uzun olamaz.');
                return;
            }

            // If valid:
            setVideoSrc(url);
            setProcessedVideoSrc(null);
            setMasks([]);
            setMaskPoints([]);
        };
        tempVideo.src = url;
    };

    // Drawing Logic
    const getPoint = (e: React.MouseEvent | React.TouchEvent) => {
        if (!canvasRef.current) return { x: 0, y: 0 };
        const rect = canvasRef.current.getBoundingClientRect();
        const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;

        // Scale appropriately if canvas display size differs from internal size
        const scaleX = canvasRef.current.width / rect.width;
        const scaleY = canvasRef.current.height / rect.height;

        return {
            x: (clientX - rect.left) * scaleX,
            y: (clientY - rect.top) * scaleY
        };
    };

    const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
        setIsDrawing(true);
        const p = getPoint(e);
        setMaskPoints([p]);
    };

    const draw = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing) return;
        const p = getPoint(e);
        setMaskPoints(prev => [...prev, p]);
    };

    const stopDrawing = () => {
        if (!isDrawing) return;
        setIsDrawing(false);
        if (maskPoints.length > 2) {
            setMasks(prev => [...prev, maskPoints]);
        }
        setMaskPoints([]);
    };

    // Render Masks Overlay
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Clear only if video isn't playing? 
        // Actually we want to draw masks continuously over the video
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';

        // Draw saved masks
        masks.forEach(path => {
            if (path.length < 2) return;
            ctx.beginPath();
            ctx.moveTo(path[0].x, path[0].y);
            path.forEach(p => ctx.lineTo(p.x, p.y));
            ctx.closePath();
            ctx.fillStyle = 'rgba(239, 68, 68, 0.5)'; // Red semi-transparent
            ctx.fill();
            ctx.strokeStyle = 'rgba(239, 68, 68, 0.8)';
            ctx.lineWidth = 2;
            ctx.stroke();
        });

        // Draw current stroke
        if (maskPoints.length > 0) {
            ctx.beginPath();
            ctx.moveTo(maskPoints[0].x, maskPoints[0].y);
            maskPoints.forEach(p => ctx.lineTo(p.x, p.y));
            ctx.strokeStyle = '#ef4444';
            ctx.lineWidth = brushSize; // Use as brush or lasso? 
            // Treating as Lasso for now
            ctx.stroke();
        }

    }, [masks, maskPoints, brushSize]);

    // Resize canvas to match video
    const handleLoadedMetadata = () => {
        if (videoRef.current && canvasRef.current) {
            canvasRef.current.width = videoRef.current.videoWidth;
            canvasRef.current.height = videoRef.current.videoHeight;
            if (processCanvasRef.current) {
                processCanvasRef.current.width = videoRef.current.videoWidth;
                processCanvasRef.current.height = videoRef.current.videoHeight;
            }
        }
    };

    // Processing Logic (MediaRecorder approach)
    const processVideo = async () => {
        const video = videoRef.current;
        const pCanvas = processCanvasRef.current;
        if (!video || !pCanvas || masks.length === 0) {
            alert("Lütfen önce bir video yükleyin ve silinecek alanları seçin.");
            return;
        }

        setIsProcessing(true);
        setIsLoading(true);

        // Prepare MediaRecorder and Context
        const stream = pCanvas.captureStream(30); // 30 FPS target
        const mediaRecorder = new MediaRecorder(stream, {
            mimeType: 'video/webm; codecs=vp9',
            videoBitsPerSecond: 5000000 // 5 Mbps for quality
        });
        const chunks: Blob[] = [];

        mediaRecorder.ondataavailable = (e) => {
            if (e.data.size > 0) chunks.push(e.data);
        };

        mediaRecorder.onstop = () => {
            const blob = new Blob(chunks, { type: 'video/webm' });
            const url = URL.createObjectURL(blob);
            setProcessedVideoSrc(url);
            setIsProcessing(false);
            setIsLoading(false);
            setProgress(0);
        };

        mediaRecorder.start();

        const ctx = pCanvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) return;

        // Reset video to start
        video.currentTime = 0;
        await new Promise(r => video.onseeked = r); // Wait for seek

        video.play();

        const drawFrame = () => {
            if (video.paused || video.ended) {
                if (video.ended) mediaRecorder.stop();
                return;
            }

            // 1. Draw original frame
            ctx.drawImage(video, 0, 0, pCanvas.width, pCanvas.height);

            // 2. Apply Inpainting (Blurred Mask with Feathering)
            masks.forEach(path => {
                if (path.length < 2) return;

                const pathObj = new Path2D();
                pathObj.moveTo(path[0].x, path[0].y);
                path.forEach(p => pathObj.lineTo(p.x, p.y));
                pathObj.closePath();

                ctx.save();

                // Create a soft clipping region
                // Since standard clip() is aliased, we use shadowBlur trick or just layer blurring.
                // Strategy: 
                // 1. Clip to path
                // 2. Draw the frame again but BLURRED heavily
                // 3. Use ShadowBlur to soften edges of the stroke

                ctx.clip(pathObj);

                // Apply heavy blur to "remove" object details.
                // We use 'backdrop-filter' logic simulation by redrawing canvas.
                ctx.filter = 'blur(20px)';
                // scaling up blur to cover large objects
                ctx.drawImage(pCanvas, 0, 0);
                ctx.filter = 'none';

                ctx.restore();

                // Edge Feathering (Inner Shadow/Blur)
                // Draw the stroke with a blur to blend the edge
                ctx.save();
                ctx.beginPath();
                ctx.moveTo(path[0].x, path[0].y);
                path.forEach(p => pathObj.lineTo(p.x, p.y)); // Redundant but safe

                ctx.shadowColor = "rgba(0,0,0,0.5)"; // Use average color ideally, but transparent allows blurring? 
                // Actually, best "feather" is drawing the blurred image slightly larger.
                // For client side simple feathering:
                ctx.strokeStyle = 'rgba(0,0,0,0.1)'; // faint border
                ctx.lineWidth = 4;
                ctx.filter = 'blur(2px)';
                ctx.stroke(pathObj);
                ctx.restore();
            });

            // Calculate progress
            if (video.duration) {
                setProgress(Math.round((video.currentTime / video.duration) * 100));
            }

            requestAnimationFrame(drawFrame);
        };

        video.addEventListener('play', () => {
            drawFrame();
        }, { once: true });

        // Safety: Stop if it takes too long or loops?
        // video.onended is handled in drawFrame loop logic implicitly/explicitly
    };

    return (
        <div style={{
            minHeight: 'calc(100vh - 80px)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: '#f9fafb',
            color: '#333',
            fontFamily: '"Inter", sans-serif'
        }}>
            <div style={{ padding: '2rem', maxWidth: '1200px', width: '100%', margin: '0 auto' }}>

                {/* Tools Navigation */}
                <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginBottom: '2rem', gap: '1rem' }}>
                    <Link href="/tools/background-remover" style={{
                        padding: '0.75rem 1.5rem',
                        borderRadius: '999px',
                        backgroundColor: 'white',
                        color: '#4b5563',
                        fontWeight: '600',
                        textDecoration: 'none',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                        border: '1px solid #e5e7eb',
                        transition: 'all 0.2s',
                        display: 'flex',
                        alignItems: 'center'
                    }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                    >
                        <FaImage style={{ marginRight: '8px' }} /> Remove.AI
                    </Link>
                    <div style={{
                        padding: '0.75rem 1.5rem',
                        borderRadius: '999px',
                        backgroundColor: '#d946ef',
                        color: 'white',
                        fontWeight: '600',
                        cursor: 'default',
                        boxShadow: '0 4px 6px -1px rgba(217, 70, 239, 0.4)',
                        display: 'flex',
                        alignItems: 'center'
                    }}>
                        <FaVideo style={{ marginRight: '8px' }} /> Video Nesne Silici
                    </div>
                </div>

                <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
                    <h1 style={{ fontSize: '3rem', fontWeight: '800', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', color: '#1f2937' }}>
                        Video Nesne Silici
                        <span style={{ fontSize: '1rem', background: '#d946ef', color: 'white', padding: '4px 12px', borderRadius: '12px', verticalAlign: 'middle' }}>BETA</span>
                    </h1>
                    <p style={{ color: '#6b7280', marginTop: '0.5rem', fontSize: '1.1rem' }}>
                        Videolardan istenmeyen nesneleri seçin ve yapay zeka ile silin.
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: '2rem' }}>

                    {/* Upload Section */}
                    {!videoSrc && (
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            style={{
                                border: '3px dashed #e5e7eb',
                                borderRadius: '24px',
                                padding: '5rem',
                                textAlign: 'center',
                                cursor: 'pointer',
                                backgroundColor: 'white',
                                transition: 'all 0.2s',
                                maxWidth: '600px',
                                margin: '0 auto',
                                width: '100%'
                            }}
                            onMouseOver={e => { e.currentTarget.style.borderColor = '#d946ef'; e.currentTarget.style.backgroundColor = '#fdf4ff'; }}
                            onMouseOut={e => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.backgroundColor = 'white'; }}
                        >
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={(e) => e.target.files && handleFile(e.target.files[0])}
                                style={{ display: 'none' }}
                                accept="video/*"
                            />
                            <div style={{ width: '80px', height: '80px', background: '#fce7f3', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
                                <FaUpload style={{ fontSize: '2.5rem', color: '#d946ef' }} />
                            </div>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#374151', marginBottom: '0.5rem' }}>Video Yükle</h3>
                            <p style={{ color: '#9ca3af' }}>MP4, MOV (Maks. 50MB önerilir)</p>
                        </div>
                    )}

                    {/* Workbench */}
                    {videoSrc && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', backgroundColor: 'white', padding: '2rem', borderRadius: '24px', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.1)' }}>

                            {/* Toolbar */}
                            <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                                <button
                                    type="button"
                                    onClick={processVideo}
                                    disabled={isProcessing || masks.length === 0}
                                    style={{
                                        backgroundColor: isProcessing ? '#9ca3af' : '#d946ef',
                                        color: 'white', border: 'none', padding: '0.75rem 2rem',
                                        borderRadius: '50px', fontWeight: 'bold', cursor: isProcessing ? 'not-allowed' : 'pointer',
                                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                                        boxShadow: isProcessing ? 'none' : '0 4px 12px rgba(217, 70, 239, 0.4)',
                                        transition: 'transform 0.1s'
                                    }}
                                    onMouseDown={e => !isProcessing && (e.currentTarget.style.transform = 'scale(0.98)')}
                                    onMouseUp={e => !isProcessing && (e.currentTarget.style.transform = 'scale(1)')}
                                >
                                    {isProcessing ? <FaSpinner className="animate-spin" /> : <FaEraser />}
                                    {isProcessing ? `İşleniyor %${progress}` : 'Seçili Alanları Sil'}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setMasks(prev => prev.slice(0, -1))}
                                    style={{ background: 'white', border: '1px solid #e5e7eb', color: '#4b5563', padding: '0.75rem 1.5rem', borderRadius: '50px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '500' }}
                                >
                                    <FaUndo /> Geri Al
                                </button>

                                <div style={{ marginLeft: 'auto', fontSize: '0.9rem', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f3f4f6', padding: '0.5rem 1rem', borderRadius: '8px' }}>
                                    <span style={{ width: '10px', height: '10px', background: '#ef4444', borderRadius: '50%', display: 'inline-block' }}></span>
                                    Alan seçmek için videonun üzerine çizin.
                                </div>
                            </div>

                            {/* Editor Area */}
                            <div style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', backgroundColor: '#000', margin: '0 auto', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                                {/* The Hidden/Source Video */}
                                <video
                                    ref={videoRef}
                                    src={videoSrc}
                                    onLoadedMetadata={handleLoadedMetadata}
                                    style={{ maxWidth: '100%', display: isProcessing ? 'none' : 'block', maxHeight: '60vh' }}
                                    controls={false}
                                    muted
                                />

                                {/* Overlay Canvas for input */}
                                <canvas
                                    ref={canvasRef}
                                    onMouseDown={startDrawing}
                                    onMouseMove={draw}
                                    onMouseUp={stopDrawing}
                                    onMouseLeave={stopDrawing}
                                    onTouchStart={startDrawing}
                                    onTouchMove={draw}
                                    onTouchEnd={stopDrawing}
                                    style={{
                                        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                                        cursor: 'crosshair', touchAction: 'none',
                                        display: isProcessing ? 'none' : 'block'
                                    }}
                                />

                                {/* Processing Canvas (Hidden or shown during processing) */}
                                <canvas
                                    ref={processCanvasRef}
                                    style={{
                                        display: isProcessing ? 'block' : 'none',
                                        maxWidth: '100%', maxHeight: '60vh'
                                    }}
                                />
                            </div>

                            {/* Result Area */}
                            {processedVideoSrc && (
                                <div style={{ marginTop: '2rem', padding: '2rem', backgroundColor: '#f0fdf4', borderRadius: '24px', border: '1px solid #bbf7d0' }}>
                                    <h3 style={{ marginBottom: '1.5rem', color: '#16a34a', fontWeight: 'bold', fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        ✅ İşlem Tamamlandı!
                                    </h3>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
                                        <div>
                                            <h4 style={{ marginBottom: '0.5rem', color: '#374151' }}>Sonuç</h4>
                                            <video src={processedVideoSrc} controls style={{ width: '100%', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }} />
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '1rem' }}>
                                            <p style={{ color: '#4b5563' }}>Video temizlendi ve indirilmeye hazır.</p>
                                            <button
                                                onClick={() => {
                                                    if (!user) {
                                                        router.push(`/login?callbackUrl=${encodeURIComponent('/tools/video-object-remover')}`);
                                                        return;
                                                    }
                                                    if (!processedVideoSrc) return;
                                                    const link = document.createElement('a');
                                                    link.href = processedVideoSrc;
                                                    link.download = `cleaned_video_${Date.now()}.webm`;
                                                    document.body.appendChild(link);
                                                    link.click();
                                                    document.body.removeChild(link);
                                                }}
                                                style={{
                                                    backgroundColor: '#22c55e', color: 'white',
                                                    textAlign: 'center', padding: '1rem', borderRadius: '50px',
                                                    textDecoration: 'none', fontWeight: 'bold',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                                                    boxShadow: '0 10px 20px -5px rgba(34, 197, 94, 0.4)',
                                                    cursor: 'pointer',
                                                    border: 'none',
                                                    fontSize: '1rem'
                                                }}
                                            >
                                                <FaDownload /> Videoyu İndir
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => { setVideoSrc(null); setMasks([]); }}
                                                style={{ backgroundColor: 'white', border: '1px solid #d1d5db', color: '#4b5563', padding: '1rem', borderRadius: '50px', cursor: 'pointer', fontWeight: '600' }}
                                            >
                                                Yeni Video Yükle
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
