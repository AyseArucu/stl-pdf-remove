const { spawn } = require('child_process');
const path = require('path');

const binPath = path.join(process.cwd(), 'bin', 'yt-dlp.exe');
const videoId = '7537034125258018053';
const testUrl = `https://www.tiktok.com/@tiktok/video/${videoId}`;

console.log('Debugging utils at:', binPath);
console.log('Target URL:', testUrl);

// Using the same flags as in the app + verbose
const args = [
    '--force-ipv4',
    '--dns-servers', '8.8.8.8',
    '--dump-json',
    '--verbose', // Add verbose to see everything
    testUrl
];

console.log('Spawning:', args.join(' '));

const ytProcess = spawn(binPath, args);

let stdout = '';
let stderr = '';

ytProcess.stdout.on('data', (data) => stdout += data);
ytProcess.stderr.on('data', (data) => stderr += data);

ytProcess.on('close', (code) => {
    console.log('Exited with:', code);
    if (code !== 0) {
        console.error('STDERR DUMP:');
        console.error(stderr);
    } else {
        console.log('SUCCESS. Title:', JSON.parse(stdout).title);
    }
});
