import { Innertube, UniversalCache, Utils } from 'youtubei.js';
import { existsSync, mkdirSync, createWriteStream, rmSync } from 'fs';
import { sendMsgQueue, sendCustomMsgQueue } from '../src/QueueObj.js';
import { info } from './globals.js';

const yt = await Innertube.create({ cache: new UniversalCache(false), generate_session_locally: true });
const youtubeBaseUrl = "https://www.youtube.com/watch?v="
const dir = "./youtubeDL";
existsSync(dir) || mkdirSync(dir);


/**
 * This function handles YouTube download requests.
 * It first checks if the query is a link or a search term.
 * if it's a search term, it searches YouTube and presents the user with options.
 * if it's a link or only one search result, it proceeds to download the audio.
 * 
 * @param {string} jid
 * @param {string} query
 * @return {Promise<void>}
 */
export async function YouTubeDownload(jid, query) {
    const params = getParams(query);
    if (params.help) return sendMsgQueue(jid, helpMessage());

    if (!isIncludeLink(query)) {
        const results = await searchYouTube(query);
        if (results.length === 0) {
            return sendMsgQueue(jid, "אופס! לא מצאתי סרטון תואם לחיפוש שלך");
        } else if (results.length === 1) {
            query = results[0].url;
        } else {
            let response = "אנא בחר מהרשימה:\n\n";
            results.forEach((video, index) => {
                response += `${index + 1}. ${video.title}\n${video.url}\n\n`;
            });
            // save the search result
            results.type = params.type;
            info.YTsetSearch(jid, results);

            return sendMsgQueue(jid, response.trim());
        }
    }

    // it's a link or only one search result
    return downloadFromLink(jid, query, params.type);
}

/**
 * 
 * @param {string} jid 
 * @param {string} link 
 * @param {'audio'|'video'} type
 */
export async function downloadFromLink(jid, link, type = 'audio') {
    let clientType = 'YTMUSIC';
    let videoId = (link.split("v=")[1] || link.split("youtu.be/")[1])?.split(/[& ]/)[0].split("?")[0];

    // check if it's a shorts link
    if (!videoId) {
        videoId = link.split("https://youtube.com/shorts/")[1].split("?")[0];
        clientType = 'ANDROID';
        type = 'video'; // shorts are always video

        // if still no videoId, return error
        if (!videoId)
            return sendMsgQueue(jid, "❌ הקישור שסיפקת לא תקין.");
    }

    const filename = `${dir}/${jid.split("@")[0]}-${videoId}-${new Date().toLocaleDateString("en-US").replace(/\//g, "-")}.${type === 'audio' ? 'mp3' : 'mp4'}`;

    console.log(`Downloading audio for video ID: ${videoId} to file: ${filename}`);

    const stream = await yt.download(videoId, { client: clientType });
    const file = createWriteStream(`${filename}`);

    file.on('finish', () => {
        file.close();
        if (type === 'audio')
            sendCustomMsgQueue(jid, { audio: { url: filename }, mimetype: 'audio/mpeg', ptt: true });
        else
            sendCustomMsgQueue(jid, { video: { url: filename }, mimetype: 'video/mp4' });

        // remove the file after 1 minute
        setTimeout(() => {
            rmSync(filename, { force: true });
        }, 60000);
    });
    file.on('error', (err) => {
        console.error(err);
        sendMsgQueue(jid, "❌ שגיאה בהורדה של הסרטון מיוטיוב");
    });

    try {
        for await (const chunk of Utils.streamToIterable(stream)) {
            file.write(chunk);
        }
        file.end();
    } catch (err) {
        console.error(err);
        sendMsgQueue(jid, "❌ שגיאה בהורדה של הסרטון מיוטיוב");
        file.close();
    }
}

async function searchYouTube(query) {
    const search = await yt.search(query, { type: 'video' });
    const videos = search.videos.slice(0, 5).map(video => ({
        title: video.title?.text,
        videoId: video.id,
        url: youtubeBaseUrl + video.id
    }));
    return videos;
}

/**
 * @param {String} str
 * @returns {Boolean}
 */
function isIncludeLink(str) {
    return str.includes("http") || str.includes("https") || str.includes("www.");
}

/**
 * @param {string} text
 * @returns {{type: 'audio'|'video', help: boolean}}
 */
function getParams(text) {
    const params = {
        type: 'audio',
        help: false
    }

    const args = text.split(" ").slice(1); // split by space and remove the first element (the command itself)
    args.forEach(arg => {
        if (arg === '-video' || arg === '-וידאו' || arg === '-סרטון') {
            params.type = 'video';
        } else if (arg === '-audio' || arg === '-אודיו') {
            params.type = 'audio';
        } else if (arg === '-help' || arg === '-עזרה') {
            params.help = true;
        }
    });

    return params;
}

function helpMessage() {
    return `איך מורידים סרטון או אודיו מיוטיוב?
    ניתן לשלוח קישור ישיר לסרטון או לחפש ישירות מהבוט.
    לדוגמה:
    - להורדת אודיו:
      !יוטיוב <קישור לסרטון>
      או
      !יוטיוב <מילות חיפוש>
    - להורדת וידאו:
      !יוטיוב <קישור לסרטון> -וידאו
      או
      !יוטיוב <מילות חיפוש> -וידאו`;
}