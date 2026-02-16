
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    console.log('API: generate-image request received');
    const searchParams = request.nextUrl.searchParams;
    const prompt = searchParams.get('prompt');

    if (!prompt) {
        return new NextResponse('Prompt gereklidir.', { status: 400 });
    }

    // DEBUG: Mock Response to verify route connectivity
    if (prompt === 'DEBUG_MOCK') {
        console.log('API: Returning DEBUG_MOCK response');
        // Return a 1x1 pixel transparent gif or similar base64
        return NextResponse.json({
            success: true,
            image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKw66AAAAABJRU5ErkJggg=='
        });
    }

    // Strategy: Try Pollinations (Reliable/Fast) first. Then Hercai, then AI Horde.

    // --- 1. Attempt Pollinations.ai ---
    try {
        console.log('Using Pollinations.ai (Primary)...');
        const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`;

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

        const imageRes = await fetch(pollinationsUrl, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (!imageRes.ok) {
            console.error(`Pollinations Error: ${imageRes.status} ${imageRes.statusText}`);
            throw new Error(`Pollinations failed: ${imageRes.status}`);
        }

        const arrayBuffer = await imageRes.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64Image = buffer.toString('base64');
        const contentType = imageRes.headers.get('content-type') || 'image/jpeg';
        const dataUri = `data:${contentType};base64,${base64Image}`;

        return NextResponse.json({ success: true, image: dataUri });
    } catch (e: any) {
        console.warn('Pollinations Failed, attempting Hercai:', e);
    }

    // --- 2. Attempt Hercai ---
    try {
        console.log('Attempting Hercai (Backup)...');
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout

        const hercaiUrl = `https://hercai.onrender.com/v3/text2image?prompt=${encodeURIComponent(prompt)}`;
        const hercaiRes = await fetch(hercaiUrl, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (hercaiRes.ok) {
            const hercaiJson = await hercaiRes.json();
            if (hercaiJson.url) {
                console.log('Hercai Success:', hercaiJson.url);

                // Fetch Image & Proxy
                const imageRes = await fetch(hercaiJson.url);
                const arrayBuffer = await imageRes.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);
                const base64Image = buffer.toString('base64');
                const contentType = imageRes.headers.get('content-type') || 'image/png';
                const dataUri = `data:${contentType};base64,${base64Image}`;

                return NextResponse.json({ success: true, image: dataUri });
            }
        }
    } catch (error: any) {
        console.warn('Hercai Failed, falling back to Horde:', error);
    }

    // --- 3. Fallback to AI Horde (Slow/Distributed) ---
    const CLUSTER_URL = 'https://stablehorde.net/api/v2';

    try {
        console.log('Using AI Horde (Fallback)...');
        // Submit Request
        const submitResponse = await fetch(`${CLUSTER_URL}/generate/async`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': '0000000000', // Anonymous
                'Client-Agent': 'EcommercePlatform:1.0:Anonymous',
            },
            body: JSON.stringify({
                prompt: prompt,
                params: {
                    n: 1,
                    steps: 20,
                    width: 512,
                    height: 512,
                },
                nsfw: false,
                censor_nsfw: true,
                models: ['stable_diffusion'],
            }),
        });

        if (!submitResponse.ok) {
            const err = await submitResponse.text();
            throw new Error(`Horde Submit Failed (${submitResponse.status}): ${err}`);
        }

        const submitData = await submitResponse.json();
        const generationId = submitData.id;
        console.log(`Horde Job Started: ${generationId}`);

        // Increase timeout to 120s since this is now a fallback
        let imageUrl = null;
        let attempts = 0;

        while (attempts < 40) { // 40 * 3s = 120s max
            await new Promise(r => setTimeout(r, 3000));
            attempts++;

            const statusResponse = await fetch(`${CLUSTER_URL}/generate/check/${generationId}`);
            const statusData = await statusResponse.json();

            if (statusData.done) {
                const resultResponse = await fetch(`${CLUSTER_URL}/generate/status/${generationId}`);
                const resultData = await resultResponse.json();

                if (resultData.generations && resultData.generations.length > 0) {
                    imageUrl = resultData.generations[0].img;
                    break;
                }
            }
        }

        if (!imageUrl) throw new Error('Time out waiting for AI Horde (Fallback).');

        // Fetch Image & Convert
        const imageRes = await fetch(imageUrl);
        const arrayBuffer = await imageRes.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64Image = buffer.toString('base64');
        const mimeType = 'image/webp';
        const dataUri = `data:${mimeType};base64,${base64Image}`;

        return NextResponse.json({ success: true, image: dataUri });

    } catch (error: any) {
        console.error('All Providers Failed detailed:', error);
        return NextResponse.json({
            success: false,
            error: `Sunucu hatası: Görüntü servisleri yanıt vermiyor. Detay: ${error.message}`
        }, { status: 500 });
    }
}
