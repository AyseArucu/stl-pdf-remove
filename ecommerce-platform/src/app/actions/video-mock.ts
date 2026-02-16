'use server';

interface VideoMetadata {
    title: string;
    duration: string;
    thumbnail: string;
    platform: 'youtube' | 'tiktok' | 'instagram' | 'generic';
    resolutions: string[];
}

export async function fetchVideoMetadata(url: string): Promise<{ success: boolean; data?: VideoMetadata; error?: string }> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
        const lowerUrl = url.toLowerCase();

        // Basic Metadata Mock
        let metadata: VideoMetadata = {
            title: 'Mock Video Title',
            duration: '00:00',
            thumbnail: '',
            platform: 'generic',
            resolutions: ['720p', '480p']
        };

        if (lowerUrl.includes('youtube.com') || lowerUrl.includes('youtu.be')) {
            metadata = {
                title: 'Amazing Nature Documentary | 4K HDR',
                duration: '12:45',
                thumbnail: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80',
                platform: 'youtube',
                resolutions: ['1080p', '720p', '480p', '360p']
            };
        } else if (lowerUrl.includes('tiktok.com')) {
            metadata = {
                title: 'Viral Dance Challenge #fyp',
                duration: '00:59',
                thumbnail: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80',
                platform: 'tiktok',
                resolutions: ['Original', 'No Watermark']
            };
        } else if (lowerUrl.includes('instagram.com')) {
            metadata = {
                title: 'Instagram Reel: Daily Vlog',
                duration: '01:30',
                thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80',
                platform: 'instagram',
                resolutions: ['Original']
            };
        } else {
            metadata = {
                title: 'Generic Video File',
                duration: '--:--',
                thumbnail: 'https://images.unsplash.com/photo-1492694069818-47bc83cb0703?w=800&q=80',
                platform: 'generic',
                resolutions: ['HD', 'SD']
            };
        }

        return { success: true, data: metadata };
    } catch (error) {
        return { success: false, error: 'Failed to process URL' };
    }
}

export async function simulateDownload(format: string, resolution: string): Promise<{ success: boolean; message: string }> {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    return { success: true, message: `Download started for ${resolution} ${format}` };
}
