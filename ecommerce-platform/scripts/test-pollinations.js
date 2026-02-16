const https = require('https');

const prompt = 'futuristic city';
const encodedPrompt = encodeURIComponent(prompt);
const seed = Math.floor(Math.random() * 1000000);

// Test Cases
const urls = [
    `https://image.pollinations.ai/prompt/${encodedPrompt}?seed=${seed}`, // Basic
    `https://image.pollinations.ai/prompt/${encodedPrompt}?seed=${seed}&nologo=true`, // With params
    `https://image.pollinations.ai/prompt/${encodedPrompt}?seed=${seed}&model=flux`, // Flux
];

async function testUrl(url) {
    console.log(`Testing: ${url}`);
    return new Promise((resolve) => {
        const req = https.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        }, (res) => {
            console.log(`Status: ${res.statusCode}`);
            if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                console.log(`Redirect to: ${res.headers.location}`);
                testUrl(res.headers.location).then(resolve);
                return;
            }
            res.on('data', () => { }); // Consume
            res.on('end', () => resolve(res.statusCode));
        });

        req.on('error', (e) => {
            console.error(`Error: ${e.message}`);
            resolve(500);
        });
    });
}

async function run() {
    for (const url of urls) {
        await testUrl(url);
    }
}

run();
