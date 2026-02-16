const https = require('https');

const prompt = 'futuristic city';

async function testHercai() {
    console.log('Testing Hercai API...');
    const url = `https://hercai.onrender.com/v3/text2image?prompt=${encodeURIComponent(prompt)}`;

    return new Promise((resolve) => {
        https.get(url, (res) => {
            console.log(`Hercai Status: ${res.statusCode}`);
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    console.log('Hercai Response:', json);
                    if (json.url) resolve(true);
                    else resolve(false);
                } catch (e) {
                    console.error('Hercai Parse Error:', e);
                    resolve(false);
                }
            });
        }).on('error', e => {
            console.error('Hercai Error:', e.message);
            resolve(false);
        });
    });
}

async function testAIHorde() {
    console.log('\nTesting AI Horde (Anonymous)...');
    const postData = JSON.stringify({
        prompt: prompt,
        apikey: "0000000000",
        params: { n: 1 }
    });

    return new Promise((resolve) => {
        const req = https.request('https://stablehorde.net/api/v2/generate/async', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': '0000000000',
                'Client-Agent': 'TestScript:1.0:Anonymous'
            }
        }, (res) => {
            console.log(`Horde Status: ${res.statusCode}`);
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    console.log('Horde Response:', json);
                    if (json.id) resolve(true);
                    else resolve(false);
                } catch (e) {
                    console.error('Horde Parse Error:', e);
                    resolve(false);
                }
            });
        });

        req.on('error', e => {
            console.error('Horde Error:', e.message);
            resolve(false);
        });

        req.write(postData);
        req.end();
    });
}

async function run() {
    await testHercai();
    await testAIHorde();
}

run();
