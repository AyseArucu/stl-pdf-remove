const ytdl = require('@distube/ytdl-core');

const videoUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'; // Rick Roll (Very standard video)

async function debugFormats() {
    console.log(`Fetching info for: ${videoUrl}`);
    try {
        const info = await ytdl.getInfo(videoUrl);
        console.log('Video Title:', info.videoDetails.title);

        console.log('\n--- All Formats ---');
        info.formats.forEach(f => {
            console.log(`itag: ${f.itag}, container: ${f.container}, quality: ${f.qualityLabel}, hasAudio: ${f.hasAudio}, hasVideo: ${f.hasVideo}`);
        });

        console.log('\n--- Choosing "audioandvideo" ---');
        try {
            const format = ytdl.chooseFormat(info.formats, { quality: 'highest', filter: 'audioandvideo' });
            console.log('Selected Format:', format);
        } catch (e) {
            console.error('chooseFormat failed:', e.message);
        }

    } catch (error) {
        console.error('Fatal Error:', error.message);
    }
}

debugFormats();
