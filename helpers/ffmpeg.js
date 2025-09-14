import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';

/**
 * Convert a mp3 to ogg
 * @param {string} inputPath 
 */
export function convertMp3ToOgg(inputPath) {
    return new Promise((resolve, reject) => {
        const outputPath = inputPath.replace('.mp3', '.ogg');

        ffmpeg()
            .audioCodec('libopus')
            .toFormat('ogg')
            .audioChannels(1)
            .addOutputOptions('-avoid_negative_ts make_zero')
            .input(inputPath)
            .save(outputPath)
            .on('error', (err) => {
                console.log('An error occurred: ' + err.message);
                reject(err)
            })
            .on('progress', (progress) => {
                console.log('Processing... '+ progress.percent + '% done');
            })
            .on('end', () => {
                console.log('Processing finished!');
                console
                resolve(outputPath);
            })
    });
}
