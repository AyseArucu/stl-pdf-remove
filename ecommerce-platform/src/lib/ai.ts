import OpenAI from 'openai';

// Initialize OpenAI client
// Note: This requires OPENAI_API_KEY environment variable to be set
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || 'dummy-key', // Prevent crash if key is missing, but calls will fail
    dangerouslyAllowBrowser: false, // Server-side only
});

export interface GenerateFigureParams {
    prompt: string;
    style: string;
}

/**
 * Generates a 3D figure image using OpenAI DALL-E 3
 */
export async function generate3DFigure(params: GenerateFigureParams): Promise<{ success: boolean; url?: string; error?: string }> {
    try {
        if (!process.env.OPENAI_API_KEY) {
            console.warn('OPENAI_API_KEY is not set. Creating mock response.');
            return {
                success: false,
                error: 'API Anahtarı eksik (OPENAI_API_KEY). Lütfen sistem yöneticisi ile iletişime geçin.'
            };
        }

        console.log('Generating image with prompt:', params.prompt);

        const response = await openai.images.generate({
            model: "dall-e-3",
            prompt: params.prompt,
            n: 1,
            size: "1024x1024",
            quality: "standard", // or "hd"
            style: "vivid", // DALL-E 3 specific
        });

        const url = response.data?.[0]?.url;

        if (!url) {
            return { success: false, error: 'Görsel oluşturulamadı.' };
        }

        return { success: true, url };

    } catch (error: any) {
        console.error('AI Generation Error:', error);
        return {
            success: false,
            error: error.message || 'AI servisine bağlanırken bir hata oluştu.'
        };
    }
}
