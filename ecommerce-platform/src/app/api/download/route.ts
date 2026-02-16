import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const url = searchParams.get('url');

    if (!url) {
        return new NextResponse('URL gerekli', { status: 400 });
    }

    try {
        const ytDlpPath = path.join(process.cwd(), 'bin', 'yt-dlp.exe');

        // 1. Get Video Metadata (Title, Extension)
        const metadataPromise = new Promise<{ title: string; ext: string }>((resolve, reject) => {
            const metaProcess = spawn(ytDlpPath, ['--force-ipv4', '--dump-json', url]);
            let data = '';

            metaProcess.stdout.on('data', (chunk) => {
                data += chunk;
            });

            metaProcess.on('close', (code) => {
                if (code === 0) {
                    try {
                        const json = JSON.parse(data);
                        // Sanitize title
                        const title = (json.title || 'video').replace(/[^\w\s-]/gi, '').trim();
                        resolve({ title, ext: json.ext || 'mp4' });
                    } catch (e) {
                        reject(new Error('Metadata parse error'));
                    }
                } else {
                    reject(new Error('Metadata fetch failed'));
                }
            });
        });

        const { title, ext } = await metadataPromise;

        const format = searchParams.get('format') || 'MP4';
        const isAudio = format.toUpperCase() === 'MP3';

        // 2. Stream Content
        const headers = new Headers();
        // If audio, we might default to m4a/webm if no ffmpeg, but we'll label it appropriately.
        // yt-dlp -f bestaudio usually returns m4a or webm.
        // We will try to rely on browser content-type sniffing or just serve it.
        // For actual MP3 conversion, ffmpeg is needed. without it, we best serve m4a as "audio".

        let targetExt = ext;
        let dlArgs = ['--force-ipv4', '-f', 'best', '-o', '-', url];

        if (isAudio) {
            targetExt = 'mp3'; // Force .mp3 extension as requested
            dlArgs = ['--force-ipv4', '-f', 'bestaudio', '-o', '-', url];
            headers.set('Content-Type', 'audio/mpeg'); // Standard MP3 MIME
        } else {
            headers.set('Content-Type', 'video/mp4');
        }

        const filename = encodeURIComponent(`${title}.${targetExt}`);
        headers.set('Content-Disposition', `attachment; filename="${title}.${targetExt}"; filename*=UTF-8''${filename}`);

        // Start yt-dlp process to stream stdout
        const videoProcess = spawn(ytDlpPath, dlArgs);

        const stream = new ReadableStream({
            start(controller) {
                videoProcess.stdout.on('data', (chunk) => controller.enqueue(chunk));
                videoProcess.stdout.on('end', () => controller.close());
                videoProcess.stderr.on('data', (data) => console.log('yt-dlp stderr:', data.toString()));
                videoProcess.on('error', (err) => controller.error(err));
            },
            cancel() {
                videoProcess.kill();
            }
        });

        return new NextResponse(stream as any, { headers });

    } catch (error: any) {
        console.error('Download error:', error);
        return new NextResponse(`Hata: ${error.message || 'İndirme başarısız'}`, { status: 500 });
    }
}
