const https = require('https');

const prompt = 'cat'; // Simple prompt

async function testHercai() {
    console.log('--- Testing Hercai ---');
    // Try different models
    const models = ['v3', 'lexica', 'prodia', 'simurg'];
    for (const model of models) {
        const url = `https://hercai.onrender.com/${model}/text2image?prompt=${prompt}`;
        console.log(`Trying model: ${model}`);
        await new Promise(resolve => {
            https.get(url, res => {
                console.log(`Status: ${res.statusCode}`);
                let data = '';
                res.on('data', c => data += c);
                res.on('end', () => {
                    try {
                        console.log('Body:', data.substring(0, 100));
                        const json = JSON.parse(data);
                        if (json.url) console.log('SUCCESS');
                    } catch (e) {
                        console.log('Invalid JSON');
                    }
                    resolve();
                });
            }).on('error', e => {
                console.error('Error:', e.message);
                resolve();
            });
        });
    }
}

async function testHorde() {
    console.log('\n--- Testing AI Horde ---');
    // Just check maintenance mode or general stats
    const url = 'https://stablehorde.net/api/v2/status/performance';
    await new Promise(resolve => {
        https.get(url, res => {
            let data = '';
            res.on('data', c => data += c);
            res.on('end', () => {
                console.log('Performance:', data.substring(0, 200));
                resolve();
            });
        });
    });
}

async function run() {
    await testHercai();
    await testHorde();
}

run();
