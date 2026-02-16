const ytdl = require('@distube/ytdl-core');

const videoUrl = 'https://www.youtube.com/watch?v=BaW_jenozKc'; // YouTube Rewind 2010 (Safe/Old)

async function test() {
    console.log('Testing @distube/ytdl-core...');
    try {
        const info = await ytdl.getInfo(videoUrl);
        console.log('Success! Found video:', info.videoDetails.title);

        const format = ytdl.chooseFormat(info.formats, { quality: 'highest', filter: 'audioandvideo' });
        if (format) {
            console.log('Found valid format:', format.container, format.qualityLabel);
        } else {
            console.error('No suitable format found.');
        }
    } catch (error) {
        console.error('Error fetching video info:', error.message);
    }
}

test();
