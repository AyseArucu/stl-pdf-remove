'use server';

export async function checkInstagramUser(username: string): Promise<{ exists: boolean }> {
    if (!username) return { exists: false };

    // Instagram does not have a public unauthenticated API for this.
    // However, we can try to fetch the profile page.
    // Note: This is liable to be blocked by Instagram's anti-scraping.
    // As a fallback/mock for this demo, we will return true for any non-empty username
    // to simulate a successful find, unless the username is explicitly 'invalid' for testing.

    // In a production app, you would use the Instagram Basic Display API or Graph API
    // which requires user authentication (OAuth).

    // Simulation:
    if (username.toLowerCase() === 'invalid') {
        return { exists: false };
    }

    /* 
    // Real implementation attempt (often 302 redirect to login):
    try {
        const response = await fetch(`https://www.instagram.com/${username}/`, {
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            },
            next: { revalidate: 3600 } // Cache for 1 hour
        });
        
        // If 200, user likely exists. If 404, not.
        return { exists: response.status === 200 };
    } catch (e) {
        console.error('Instagram check failed', e);
        return { exists: true }; // Fallback to avoid blocking user
    }
    */

    return { exists: true };
}
