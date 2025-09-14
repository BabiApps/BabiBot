import { downloadMediaMessage } from 'baileys';
import { Sticker, StickerTypes } from 'wa-sticker-formatter';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import ffmpeg from 'fluent-ffmpeg';
ffmpeg.setFfmpegPath(ffmpegInstaller.path);
import { UltimateTextToImage, registerFont, getCanvasImage } from "ultimate-text-to-image";
import { MsgType, getMsgType } from './msgType.js';
import { sendMsgQueue, errorMsgQueue, sendCustomMsgQueue } from '../src/QueueObj.js';
//import { transparentBackground } from "transparent-background";
/*** enable or disable the remove background feature (can take up to 3 minutes on low-spec servers) */
const enableRemoveBackground = false;
import { Jimp } from "jimp";
import { GLOBAL } from '../src/storeMsg.js';

const parameters = {
    colors: [
        {
            nameEN: 'white',
            nameHE: 'לבן',
            hex: '#ffffff'
        },
        {
            nameEN: 'black',
            nameHE: 'שחור',
            hex: '#000000'
        },
        {
            nameEN: 'red',
            nameHE: 'אדום',
            hex: '#ff0000'
        },
        {
            nameEN: 'green',
            nameHE: 'ירוק',
            hex: '#00ff00'
        },
        {
            nameEN: 'blue',
            nameHE: 'כחול',
            hex: '#0000ff'
        },
        {
            nameEN: 'cyan',
            nameHE: 'תכלת',
            hex: '#00ffff'
        },
        {
            nameEN: 'yellow',
            nameHE: 'צהוב',
            hex: '#ffff00'
        },
        {
            nameEN: 'orange',
            nameHE: 'כתום',
            hex: '#ffa500'
        },
        {
            nameEN: 'purple',
            nameHE: 'סגול',
            hex: '#800080'
        },
        {
            nameEN: 'pink',
            nameHE: 'ורוד',
            hex: '#ffc0cb'
        },
        {
            nameEN: 'brown',
            nameHE: 'חום',
            hex: '#a52a2a'
        },
        {
            nameEN: 'gray',
            nameHE: 'אפור',
            hex: '#808080'
        },
        {
            nameEN: 'gold',
            nameHE: 'זהב',
            hex: '#ffd700'
        },
        {
            nameEN: 'silver',
            nameHE: 'כסף',
            hex: '#c0c0c0'
        },
        {
            nameEN: 'bronze',
            nameHE: 'נחושת',
            hex: '#cd7f32'
        }
    ],
    fonts: [
        {
            nameEN: 'Normal',
            nameHE: 'רגיל',
            path: null
        },
        {
            nameEN: 'Alef',
            nameHE: 'אלף',
            path: './src/fonts/Gveret Levin Alef Alef Alef.ttf'
        },
        {
            nameEN: 'BonaNova',
            nameHE: 'בונהנובה',
            path: './src/fonts/BonaNova-Regular.ttf'
        },
        {
            nameEN: 'FrankRuhl',
            nameHE: 'פרנקרוהל',
            path: './src/fonts/FrankRuhlLibre-Regular.ttf'
        },
        {
            nameEN: 'Rubik',
            nameHE: 'רוביק',
            path: './src/fonts/RubikWetPaint-Regular.ttf'
        },
        {
            nameEN: 'Simple',
            nameHE: 'פשוט',
            path: './src/fonts/Simple.ttf'
        },
        {
            nameEN: 'Yeret',
            nameHE: 'ירט',
            path: './src/fonts/Yeret.ttf'
        }
    ],
    shape: [
        {
            nameEN: 'circle',
            nameHE: 'עיגול',
            nameHE2: 'עגול',
            type: StickerTypes.CIRCLE
        },

        {
            nameEN: 'rounded',
            nameHE: 'מעוגל',
            type: StickerTypes.ROUNDED
        },
        {
            nameEN: 'cropped',
            nameHE: 'מרובע',
            nameHE2: 'ריבוע',
            type: StickerTypes.CROPPED
        },
        {
            nameEN: 'full',
            nameHE: 'מלא',
            type: StickerTypes.FULL
        }
    ],
    noBackgroundNames: [
        'הסררקע',
        'ללארקע',
        'nobackground'
    ]

}

registerFonts();

/**
 * 
 * @param {import('baileys').proto.WebMessageInfo} msg 
 */
export default async function sendSticker(msg) {
    let id = msg.key.remoteJid;
    const originalMsg = msg;

    let textMsg = msg.message?.conversation || msg.message?.extendedTextMessage?.text
        || msg.message?.imageMessage?.caption || msg.message?.videoMessage?.caption || "";
    // remove the command
    textMsg = textMsg.replace('!sticker', '').replace('!סטיקר', '').replace('!מדבקה', '').trim();

    // quoted message
    let hasQuoted = msg.message?.extendedTextMessage?.contextInfo?.stanzaId;
    // get the quoted message
    // if can't get it - send to the user a message
    if (msg.message?.extendedTextMessage?.contextInfo?.stanzaId) {
        let quoted = await GLOBAL.store.loadMessage(id, msg.message?.extendedTextMessage?.contextInfo?.stanzaId);
        if (!quoted) {
            console.log("retrying to get quoted message in 3 seconds...")
            await sleep(3000)
            quoted = await GLOBAL.store.loadMessage(id, msg.message?.extendedTextMessage?.contextInfo?.stanzaId);
        }
        if (!quoted) return sendMsgQueue(id, "אופס... לא מצאתי את ההודעה שציטטת\nנסה לצטט שוב בעוד כמה שניות")

        msg = quoted;
    }

    // get the message type
    const messageType = getMsgType(msg).type;

    // text message
    if (messageType === MsgType.TEXT) {
        let quotedText = hasQuoted ? msg.message?.conversation || msg.message?.extendedTextMessage?.text : "";
        return makeTextSticker(id, quotedText, textMsg);
    }

    // media message
    else if (messageType === MsgType.IMAGE || messageType === MsgType.VIDEO || messageType === MsgType.STICKER) {
        // send reaction (it can take a while)
        sendCustomMsgQueue(id, { react: { text: '⏳', key: originalMsg.key } });

        makeMediaSticker(msg, textMsg)
            .then(() => sendCustomMsgQueue(id, { react: { text: '✅', key: originalMsg.key } }))
            .catch((err) => {
                console.log(err)
                errorMsgQueue(err)
                sendCustomMsgQueue(id, { react: { text: '❌', key: originalMsg.key } })
                sendMsgQueue(id, "אופס! משהו השתבש בעת יצירת הסטיקר")
            })
    }


}

async function makeTextSticker(id, quotedText, commandText) {
    const parameterText = commandText.replace("!sticker", "").replace("!סטיקר", "").trim() || quotedText;
    const [params, textWithoutParameters] = getParameters(parameterText);

    console.log("text without parameters:", textWithoutParameters)
    console.log("quoted text:", quotedText)

    // when the user wrote "-help" or "-עזרה"
    if (params.help) return sendMsgQueue(id, helpMessage());

    // no text to make sticker
    if (!(quotedText || textWithoutParameters))
        return sendMsgQueue(id, "אופס! לא נמצא טקסט ליצירת סטיקר\nלקבלת עזרה כתוב !סטיקר -עזרה")

    const sticker = new Sticker(textToSticker(quotedText || textWithoutParameters, params), {
        pack: '🎉',
        author: 'BabiBot',
        categories: ['🤩', '🎉'],
        quality: 20
    });
    const stickerMsg = await sticker.toMessage();

    console.log("adding sticker message to queue, type: text")
    sendCustomMsgQueue(id, stickerMsg)
}

/**
 * 
 * @param {import('baileys').proto.WebMessageInfo} msg
 * @param {String} commandText
 * 
 */
async function makeMediaSticker(msg, commandText) {
    // import sharp here to avoid issues on some systems
    const sharp = (await import('sharp')).default;

    const id = msg.key.remoteJid;
    let buffer;
    try {
        buffer = await downloadMediaMessage(msg, 'buffer');
    } catch (error) {
        errorMsgQueue(error)
        return sendMsgQueue(id, "אופס... נראה שההודעה שציטטת אינה תקינה")
    }

    // not bigger than 1.5MB
    const size = buffer.byteLength / 1024 / 1024
    if (size > 1.5) return sendMsgQueue(id, "אופס... הקובץ גדול מדי, נסה לשלוח קובץ קטן יותר")
    // set quality according to the size
    const quality = 20 - Math.floor(size * 10);

    console.log("making sticker...")

    // get parameters from the text
    const [params, textWithoutParameters] = getParameters(commandText);

    // buffer type
    const bufferType = msg.message?.imageMessage?.mimetype || msg.message?.videoMessage?.mimetype || msg.message?.stickerMessage?.mimetype;
    // can write text only on image
    if (bufferType === 'image/jpeg' || bufferType === 'image/png' || bufferType === 'image/webp') {
        if (bufferType === 'image/webp') {
            buffer = await sharp(buffer).png().toBuffer();
        }
        // if (params.background === "NoBackground" && enableRemoveBackground) {
        //     buffer = await transparentBackground(buffer, "png", { fast: true });
        // }
        let text = msg.message?.imageMessage?.caption || "";

        // if the user wrote the command with text - remove the text
        if (!textWithoutParameters &&
            (text.includes('!sticker') || text.includes('!סטיקר')) || text.includes('!מדבקה'))
            text = "";

        // change the shape of the sticker 
        // TODO: use another library to change the shape
        const sticker = new Sticker(buffer, {
            type: params.shape || StickerTypes.FULL,
            quality: quality
        });
        buffer = await sticker.toBuffer() // return webp buffer

        // to png buffer from webp
        buffer = await sharp(buffer).png().toBuffer();

        // cant work with webp buffer
        buffer = await textOnImage(textWithoutParameters || text, buffer, params)

        sendCustomMsgQueue(id, await new Sticker(buffer, {
            pack: '🎉',
            author: 'BabiBot'
        }).toMessage());
    }
    else {
        const sticker = new Sticker(buffer, {
            pack: '🎉',
            author: 'BabiBot',
            type: params.shape || StickerTypes.FULL,
            quality: quality
        });
        const stickerMsg = await sticker.toMessage();
        sendCustomMsgQueue(id, stickerMsg)
    }
    console.log("adding sticker message to queue, type:", params.shape || StickerTypes.FULL)
}

/**
 * 
 * @param {String} text 
 * @param {{[param: string] : string}} params 
 * @returns 
 */
function textToSticker(text, params) {
    text = putEnterBetweenEmojis(text);
    //text = doubleEnter(text);
    console.log("Making sticker with text:", text)

    return new UltimateTextToImage(text + " ", {
        width: 350,
        maxWidth: 400,
        maxHeight: 400,
        fontFamily: params?.font ?? "Alef",     // default Alef
        // white color
        fontColor: params?.color || "#ffffff", // default white
        fontSize: 150,
        //fontWeight: "bold",
        minFontSize: 25,
        lineHeight: 50,
        autoWrapLineHeightMultiplier: 1.1,
        //autoWrapLineHeight: 2,
        margin: 10,
        marginLeft: 100,
        align: "center",
        valign: "middle",
        strokeSize: 2,
        // backgroud color transparent
        backgroundColor: "#00000000",
    })
        .render().toBuffer("image/png")
}

/**
 * 
 * @param {String} text 
 * @returns 
 */
function putEnterBetweenEmojis(text) {
    const regexAllEmojis = /[\u{1f300}-\u{1f5ff}\u{1f900}-\u{1f9ff}\u{1f600}-\u{1f64f}\u{1f680}-\u{1f6ff}\u{2600}-\u{26ff}\u{2700}-\u{27bf}\u{1f1e6}-\u{1f1ff}\u{1f191}-\u{1f251}\u{1f004}\u{1f0cf}\u{1f170}-\u{1f171}\u{1f17e}-\u{1f17f}\u{1f18e}\u{3030}\u{2b50}\u{2b55}\u{2934}-\u{2935}\u{2b05}-\u{2b07}\u{2b1b}-\u{2b1c}\u{3297}\u{3299}\u{303d}\u{00a9}\u{00ae}\u{2122}\u{23f3}\u{24c2}\u{23e9}-\u{23ef}\u{25b6}\u{23f8}-\u{23fa}\u{200d}]*/ug;
    let match = text.match(regexAllEmojis);
    match = match.filter(i => i != '');

    const arrText = text.split('\n');
    for (let i = 0; i < arrText.length; i++) {
        for (let j = 0; j < match.length; j++) {
            if (arrText[i].endsWith(match[j])
                && arrText[i + 1] && match[j + 1] // if not undefined
                && arrText[i + 1].startsWith(match[j + 1])) {
                arrText[i] += '\n';
            }
        }
    }
    return arrText.join('\n');

}

/**
 * 
 * @param {String} text 
 * @returns 
 */
function doubleEnter(text) {
    if (!text) return text;
    return text.replace(/\n/g, '\n\n');
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * extract the parameters from the command text
 * @param {String} commandText
 * @returns {[{[param: string] : string}, string]}
 */
function getParameters(commandText) {
    let arr = commandText.split(" ").filter(i => i);

    let tempParameters = {};
    let textWithoutParameters = [];

    for (let i = 0; i < arr.length; i++) {
        let word = arr[i]?.toLowerCase();

        // fix when the user wrote "-param" with enter
        word = word.startsWith('\n') ? word.slice(1) : word;

        let isParameter = false;
        if (word.startsWith('-')) {
            let key = word.slice(1);
            let value = arr[i + 1]; // next word, can be undefined

            if (key === "") {
                // if the key is empty, push the original word
                textWithoutParameters.push(arr[i]);
                continue;
            }

            if (value && !value?.startsWith('-')) {
                tempParameters[key] = value;
                i++; // next word is the value
                isParameter = true;
            }

            if (parameters.noBackgroundNames.includes(key)) {
                tempParameters.background = "NoBackground";
                if (value) i--; // the next word exist and is not a value
                isParameter = true;
            }

            if (key === 'help' || key === 'עזרה') {
                tempParameters.help = "asking for help :)";
                break;
            }
        }
        else if (isParameter === false) {
            // if the word is not a parameter, push the original word
            textWithoutParameters.push(arr[i]);
        }
    }
    console.log("parameters:", tempParameters)
    return [formatParameters(tempParameters), textWithoutParameters.join(" ") || ""];
}

/**
 * format the parameters to the right format
 * @param {{[param: string] : string}} params
 * @returns {{[param: string] : string}}
 */
function formatParameters(params) {
    let formatted = {};

    let keys = Object.keys(params);

    for (let param of keys) {
        let key = param.toLowerCase();
        let value = params[param]?.toLowerCase();

        if (key === 'help' || key === 'עזרה') { // || key === 'h'
            formatted.help = "asking for help :)";
            break;
        }

        else if (key === 'color' || key === "צבע") { // || key === 'c'
            let color = parameters.colors.find(i => i.nameEN.toLowerCase() === value
                || i.nameHE === value);
            if (color) formatted.color = color.hex;
        }

        else if (key === 'font' || key === "גופן") { // || key === 'f' 
            let font = parameters.fonts.find(i => i.nameEN.toLowerCase() === value
                || i.nameHE === value);
            if (font) formatted.font = font.nameEN;
        }

        else if (key === 'shape' || key === "צורה") {
            let shape = parameters.shape.find(i => i.nameEN.toLowerCase() === value
                || i.nameHE === value
                || i.nameHE2 === value);
            if (shape) formatted.shape = shape.type;
        }

        else if (parameters.noBackgroundNames.includes(value)) {
            formatted.background = "NoBackground";
        }

    }
    console.log("formatted parameters:", formatted)
    return formatted;
}

function helpMessage() {
    let help = "*איך יוצרים סטיקר?*\n\n";
    help += "*אופציה ראשונה:* \nשליחת הודעת מדיה (תמונה, סרטון קצר או סטיקר) בצירוף הפקודה, או בציטוט הודעת מדיה עם הפקודה\n\n";
    help += "*אופציה שניה:* \nיצירת סטיקר מטקסט, על ידי ציטוט הודעה עם הפקודה, או שליחת הפקודה עם הטקסט הרצוי\n\n";

    help += "----------------------------------\n\n";;

    help += "*פרמטרים:*\n";
    help += "(יש לכתוב את הפרמטרים בצורה הבאה: -פרמטר ערך)\n"
    help += "צבע / color\n";
    help += "גופן / font\n";
    help += "צורה / shape\n";
    if (enableRemoveBackground)
        help += "הסר רקע / no background\n";
    help += "(ייתכן שהטקסט לא יהיה קריא בצורות מסויימות)\n\n";

    help += "*לדוגמא:*\n";
    help += "!סטיקר -צבע כחול אין על באבי בוט!!\n";
    help += "!סטיקר -צבע אדום -גופן אלף באבי בוט הכי בעולם!\n";
    help += "!סטיקר -צורה עיגול\n\n";

    help += "*צבעים:*\n";
    parameters.colors.forEach(i => help += `${i.nameHE} - ${i.nameEN}\n`);

    help += "\n*גופנים:*\n";
    parameters.fonts.forEach(i => help += `${i.nameHE} - ${i.nameEN}\n`);

    help += "\n*צורות:*\n";
    parameters.shape.forEach(i => help += `${i.nameHE} - ${i.nameEN}\n`);

    if (enableRemoveBackground) {
        help += "\n*הסר רקע:*\n";
        help += "יש לכתוב מקף ולאחריו אחת מהמילים הבאות:\n"
        parameters.noBackgroundNames.forEach(i => help += `${i} / `);
        help.slice(0, -3); // remove the last "/"
        help += "\nלדוגמא: -הסררקע";
    }

    help += "\n\n";

    help += "שימוש מהנה :)";
    return help;
}

/**
 * 
 * @param {string} text 
 * @param {Buffer} buffer 
 * @param {{[param: string] : string}} params 
 */
async function textOnImage(text, buffer, params) {
    // resize the image, so the text will be readable
    const bufferResized = await Jimp.read(buffer)
        .then(img => {
            img.getHeight() > img.getWidth()
                ? img.resize(Jimp.AUTO, 400)
                : img.resize(400, Jimp.AUTO);
            return img.getBufferAsync(Jimp.MIME_PNG);
        })
        .catch(err => {
            console.log(err)
            return buffer;
        });

    const canvasImage = await getCanvasImage({ buffer: bufferResized });

    // use various way to draw the image
    return new UltimateTextToImage(text, {
        width: canvasImage.width,
        height: canvasImage.height,
        fontSize: 55,
        fontStyle: "bold",
        fontFamily: params?.font ?? "Alef",     // default Alef
        strokeSize: 3,
        fontColor: params?.color ?? "#ffffff",  // default white
        strokeColor: "#000000",                 // black
        backgroundColor: "#00000000",           // transparent
        align: "center",
        valign: "bottom",
        margin: 10,
        images: [{ canvasImage: canvasImage, layer: 0, repeat: "fit" }],
    })
        .render()
        .toBuffer("image/png");
}

function registerFonts() {
    for (let font of parameters.fonts) {
        if (font.path) registerFont(font.path, { family: font.nameEN })
    }
}