const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const binPath = path.join(process.cwd(), 'bin', 'yt-dlp.exe');
console.log('Testing yt-dlp at:', binPath);

if (!fs.existsSync(binPath)) {
    console.error('ERROR: yt-dlp.exe not found at path!');
    process.exit(1);
}

const testUrl = 'https://www.youtube.com/watch?v=jNQXAC9IVRw'; // Me at the zoo (Reliable)
console.log('Running dump-json on:', testUrl);

const ytProcess = spawn(binPath, ['--dump-json', testUrl]);

let stdout = '';
let stderr = '';

ytProcess.stdout.on('data', (data) => stdout += data);
ytProcess.stderr.on('data', (data) => stderr += data);

ytProcess.on('close', (code) => {
    console.log('Process exited with code:', code);
    if (code !== 0) {
        console.error('STDERR:', stderr);
    } else {
        try {
            const json = JSON.parse(stdout);
            console.log('SUCCESS: Fetched title:', json.title);
        } catch (e) {
            console.error('ERROR JSON parse failed');
        }
    }
});
