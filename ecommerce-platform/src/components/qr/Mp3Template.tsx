import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Share2, Repeat, Heart, MoreHorizontal, Download } from 'lucide-react';

interface Mp3TemplateProps {
    design: {
        primaryColor: string;
        backgroundColor: string;
        textColor: string;
        buttonColor?: string; // For the play button background
        buttonTextColor?: string;
        fontFamily?: string;
    };
    info: {
        title: string;
        artist: string;
        coverImage: string | null;
        file: string | null; // Data URL or URL
    };
    socials?: Array<{ id: string, icon: any, url: string, color?: string, name?: string }>;
}

export default function Mp3Template({ design, info, socials = [] }: Mp3TemplateProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(30); // Mock progress for preview
    const [duration, setDuration] = useState(180); // Mock duration (3 mins)
    const [currentTime, setCurrentTime] = useState(54); // Mock current time
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [showVolumeSlider, setShowVolumeSlider] = useState(false);
    const volumeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleVolumeMouseEnter = () => {
        if (volumeTimeoutRef.current) {
            clearTimeout(volumeTimeoutRef.current);
            volumeTimeoutRef.current = null;
        }
        setShowVolumeSlider(true);
    };

    const handleVolumeMouseLeave = () => {
        volumeTimeoutRef.current = setTimeout(() => {
            setShowVolumeSlider(false);
        }, 1500); // 1.5 seconds delay
    };

    // Since this is a template/preview, we might not actually play the audio fully
    // or we might want to if a file is provided.
    // For the preview in the editor, we often just show the UI state.

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.play().catch(e => {
                    console.error("Audio play failed", e);
                    setIsPlaying(false);
                });
            } else {
                audioRef.current.pause();
            }
        }
    }, [isPlaying]);

    useEffect(() => {
        if (info.file && audioRef.current) {
            audioRef.current.src = info.file;
            audioRef.current.load();
            setIsPlaying(false);
            setProgress(0);
            setCurrentTime(0);
        }
    }, [info.file]);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = isMuted ? 0 : volume;
        }
    }, [volume, isMuted]);

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
            setDuration(audioRef.current.duration || 0);
        }
    };

    const handleEnded = () => {
        setIsPlaying(false);
        setCurrentTime(0);
        if (audioRef.current) {
            audioRef.current.currentTime = 0;
        }
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTime = Number(e.target.value);
        if (audioRef.current) {
            audioRef.current.currentTime = newTime;
            setCurrentTime(newTime);
        }
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: info.title || 'Müzik QR',
                    text: `Check out ${info.title} by ${info.artist}`,
                    url: window.location.href,
                });
            } catch (error) {
                console.log('Error sharing:', error);
            }
        } else {
            // Fallback
            alert("Paylaşım özelliği bu tarayıcıda desteklenmiyor.");
        }
    };

    return (
        <div
            className="w-full h-full flex flex-col relative overflow-y-auto custom-scrollbar"
            style={{
                backgroundColor: design.backgroundColor,
                color: design.textColor,
                fontFamily: design.fontFamily || 'inherit'
            }}
        >
            <audio
                ref={audioRef}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
                onEnded={handleEnded}
                onError={(e) => console.error("Audio error", e)}
            />

            {/* Background Blue Top Shape (Matches the design in screenshot) */}
            <div
                className="absolute top-0 left-0 w-full h-64 rounded-b-[40px] z-0"
                style={{ backgroundColor: design.primaryColor, opacity: 0.15 }}
            ></div>
            <div
                className="absolute top-0 left-0 w-full h-60 rounded-b-[50px] z-0"
                style={{ backgroundColor: design.primaryColor }}
            ></div>

            {/* Header Actions */}
            <div className="relative z-10 flex justify-between items-center p-6 pt-8 text-white">
                <div onClick={() => { }} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md cursor-pointer">
                    <span className="text-xs">▼</span>
                </div>
                <div className="flex gap-4">
                    <div onClick={handleShare} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md cursor-pointer hover:bg-white/30 transition-colors">
                        <Share2 size={20} />
                    </div>
                </div>
            </div>

            {/* Cover Art */}
            <div className="relative z-10 px-8 mt-2 flex justify-center">
                <div className="w-64 h-64 rounded-3xl shadow-2xl overflow-hidden bg-gray-200 relative">
                    {info.coverImage ? (
                        <img src={info.coverImage} alt="Album Art" className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-800 text-gray-500">
                            <span className="text-4xl">🎵</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Track Info */}
            <div className="relative z-10 px-8 mt-8 text-center space-y-1">
                <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
                    {info.title || 'Şarkı Adı'}
                </h2>
                <p className="text-sm opacity-70 font-medium">
                    {info.artist || 'Sanatçı Adı'}
                </p>
            </div>

            {/* Progress Bar */}
            <div className="relative z-10 px-8 mt-8">
                <div className="flex justify-between text-xs font-medium opacity-60 mb-2">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                </div>
                <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden relative group cursor-pointer">
                    <div
                        className="h-full rounded-full absolute top-0 left-0 pointer-events-none"
                        style={{ width: `${(currentTime / duration) * 100}%`, backgroundColor: design.primaryColor }}
                    ></div>
                    <input
                        type="range"
                        min="0"
                        max={duration || 100}
                        value={currentTime}
                        onChange={handleSeek}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                </div>
            </div>

            {/* Controls */}
            <div className="relative z-10 px-6 mt-6 flex items-center justify-between">
                <button className="text-gray-400 hover:text-gray-600">
                    <Repeat size={20} />
                </button>

                <div className="flex items-center gap-6">
                    <button className="text-gray-800 hover:text-black" onClick={() => {
                        if (audioRef.current) audioRef.current.currentTime -= 10;
                    }}>
                        <SkipBack size={28} fill="currentColor" />
                    </button>

                    <button
                        className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg shadow-indigo-200 hover:scale-105 transition-transform"
                        style={{
                            backgroundColor: design.primaryColor,
                            color: '#ffffff'
                        }}
                        onClick={() => setIsPlaying(!isPlaying)}
                    >
                        {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="ml-1" />}
                    </button>

                    <button className="text-gray-800 hover:text-black" onClick={() => {
                        if (audioRef.current) audioRef.current.currentTime += 10;
                    }}>
                        <SkipForward size={28} fill="currentColor" />
                    </button>
                </div>

                <div
                    className="relative flex items-center justify-center group"
                    onMouseEnter={handleVolumeMouseEnter}
                    onMouseLeave={handleVolumeMouseLeave}
                >
                    {showVolumeSlider && (
                        <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 p-3 bg-white/95 backdrop-blur-sm rounded-xl shadow-xl border border-gray-100 flex flex-col items-center gap-2 animate-in fade-in slide-in-from-bottom-2 z-50">
                            <div className="h-24 w-1.5 bg-gray-200 rounded-full relative flex items-end justify-center">
                                <div
                                    className="w-full rounded-full bg-gray-800"
                                    style={{ height: `${(isMuted ? 0 : volume) * 100}%` }}
                                />
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.01"
                                    value={isMuted ? 0 : volume}
                                    onChange={(e) => {
                                        const val = parseFloat(e.target.value);
                                        setVolume(val);
                                        if (val > 0) setIsMuted(false);
                                    }}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    style={{
                                        writingMode: 'vertical-lr',
                                        direction: 'rtl',
                                        // Specific vendor prefixes for vertical range
                                        appearance: 'slider-vertical' as any
                                    }}
                                />
                            </div>
                        </div>
                    )}
                    <button
                        className="text-gray-400 hover:text-gray-600 transition-colors p-2"
                        onClick={() => setIsMuted(!isMuted)}
                        title={isMuted ? "Sesi Aç" : "Sesi Kapat"}
                    >
                        {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
                    </button>
                </div>
            </div>

            {/* Bottom Section / More Songs */}
            <div className="mt-auto p-4 w-full text-center">
                <h3 className="text-lg font-bold mb-4" style={{ color: design.textColor }}>
                    Beni Takip Et
                </h3>

                {/* Social Icons Grid */}
                {socials && socials.length > 0 && (
                    <div className="flex flex-wrap justify-center gap-4 pb-4">
                        {socials.map((social) => {
                            const Icon = social.icon || Share2;
                            return (
                                <a
                                    key={social.id}
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex flex-col items-center gap-2 group"
                                >
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform ${social.color || 'bg-gray-500'}`}>
                                        <Icon size={18} />
                                    </div>
                                    <span className="text-[10px] uppercase tracking-wider font-bold opacity-70" style={{ color: design.textColor }}>
                                        {social.name || 'Link'}
                                    </span>
                                </a>
                            );
                        })}
                    </div>
                )}
            </div>

        </div>
    );
}
