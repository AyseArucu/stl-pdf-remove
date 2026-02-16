'use server';

import { spawn } from 'child_process';
import path from 'path';

interface VideoMetadata {
    title: string;
    duration: string;
    thumbnail: string;
    platform: string;
    resolutions: string[];
}

function formatDuration(seconds: number): string {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;

    if (h > 0) {
        return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${m}:${s.toString().padStart(2, '0')}`;
}

export async function fetchVideoMetadata(url: string): Promise<{ success: boolean; data?: VideoMetadata; error?: string }> {
    try {
        if (!url) return { success: false, error: 'URL gerekli.' };

        const ytDlpPath = path.join(process.cwd(), 'bin', 'yt-dlp.exe');

        // Use a promise wrapper for the spawn process
        const data = await new Promise<any>((resolve, reject) => {
            // --force-ipv4: Fixes IPv6 issues (curl 28)
            // Removed --dns-servers as it is not supported by this binary build
            const process = spawn(ytDlpPath, ['--force-ipv4', '--dump-json', url]);
            let output = '';
            let errorOutput = '';

            process.stdout.on('data', (chunk) => {
                output += chunk;
            });

            process.stderr.on('data', (chunk) => {
                errorOutput += chunk;
            });

            process.on('close', (code) => {
                if (code === 0) {
                    try {
                        resolve(JSON.parse(output));
                    } catch (e) {
                        reject(new Error('Invalid JSON from yt-dlp'));
                    }
                } else {
                    reject(new Error(errorOutput || 'yt-dlp failed'));
                }
            });
        });

        // Map yt-dlp JSON to our VideoMetadata interface
        // yt-dlp extractor names: 'youtube', 'tiktok', 'instagram', 'facebook', etc.
        const platform = data.extractor_key?.toLowerCase() || 'generic';

        // Safe duration parsing
        const durationSecs = parseInt(data.duration) || 0;

        // Resolutions: yt-dlp formats can be complex. We'll simplify.
        // If formats are available, identifying height/quality.
        let resolutions: string[] = ['Varsayılan'];
        if (data.formats && Array.isArray(data.formats)) {
            const heights = new Set<string>();
            data.formats.forEach((f: any) => {
                if (f.height) heights.add(`${f.height}p`);
            });

            if (heights.size > 0) {
                resolutions = Array.from(heights).sort((a, b) => parseInt(b) - parseInt(a));
            }
        }

        return {
            success: true,
            data: {
                title: data.title || 'Video',
                duration: formatDuration(durationSecs),
                thumbnail: data.thumbnail || '',
                platform: platform,
                resolutions: resolutions
            }
        };

    } catch (error: any) {
        console.error('Metadata fetch error:', error);
        // Return the actual error message (sanitized if needed, but usually safe from yt-dlp stderr)
        const userMessage = error.message?.includes('yt-dlp') ? 'İndirme aracı hatası' : error.message;
        const cleanMessage = userMessage?.replace(/ERROR:\s*/g, '') || 'Video bilgileri alınamadı.';
        return { success: false, error: `${cleanMessage} (Lütfen bağlantının herkese açık olduğunu kontrol edin)` };
    }
}
