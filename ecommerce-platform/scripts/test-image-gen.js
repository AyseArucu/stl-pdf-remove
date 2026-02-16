
const http = require('http');

console.log('Testing Image Generation API...');

const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/generate-image?prompt=sunset',
    method: 'GET',
    headers: {
        'Content-Type': 'application/json'
    }
};

const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    res.setEncoding('utf8');
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    res.on('end', () => {
        console.log('BODY:', data.substring(0, 500) + (data.length > 500 ? '...' : ''));
    });
});

req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
});

req.end();
