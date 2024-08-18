import { downloadMediaMessage, downloadContentFromMessage, proto } from '@whiskeysockets/baileys';
import { Readable } from 'stream';

interface Message extends proto.IWebMessageInfo {
    message?: {
        [key: string]: any;
    };
}

interface QuotedMedia {
    type: string;
    message: any;
}

/**
 * Downloads media message content from a given message.
 * 
 * @async
 * @function downloadMediaMsg
 * @param {Message} m - The message object containing the media.
 * @returns {Promise<{ buffer: Buffer, extension: string } | null | string>} The media buffer and its extension, null if no message, or a string if an invalid message type.
 */
async function downloadMediaMsg(m: Message): Promise<{ buffer: Buffer, extension: string } | null | string> {
    if (!m.message) return null;

    const messageType = Object.keys(m.message)[0];
    const validTypes = ['imageMessage', 'videoMessage', 'audioMessage', 'documentMessage', 'documentWithCaptionMessage'];

    if (!validTypes.includes(messageType)) {
        return 'Provide a valid message (quoted messages are not valid)';
    }

    const buffer = await downloadMediaMessage(m, "buffer", {});

    const getExtension = (type: string): string => {
        const extensions: { [key: string]: string } = {
            imageMessage: m.message?.imageMessage?.mimetype === 'image/png' ? '.png' : '.jpeg',
            videoMessage: '.mp4',
            audioMessage: '.mp3',
            documentMessage: `.${m.message?.documentMessage?.fileName.split('.').pop()}`,
            documentWithCaptionMessage: `.${m.message?.documentWithCaptionMessage?.message?.documentMessage?.fileName.split('.').pop()}`
        };
        return extensions[type];
    };

    const extension = getExtension(messageType);
    return { buffer, extension };
}

/**
 * Downloads media content from a quoted message.
 * 
 * @async
 * @function downloadQuotedMediaMessage
 * @param {Message} m - The message object containing the quoted media.
 * @returns {Promise<{ buffer: Buffer, extension: string, filename: string }>} The media buffer, extension, and filename.
 * @throws {Error} If no quoted media message is found.
 */
async function downloadQuotedMediaMessage(m: Message): Promise<{ buffer: Buffer, extension: string, filename: string }> {
    const quotedMsg = await getQuotedMedia(m);
    if (!quotedMsg || typeof quotedMsg === 'boolean') throw new Error('No quoted media message found.');

    const getExtension = (type: string): string => {
        const extensions: { [key: string]: string } = { imageMessage: 'png', videoMessage: 'mp4', audioMessage: 'mp3' };
        return extensions[type] || 'bin';
    };

    const extension = getExtension(quotedMsg.type);
    const filename = quotedMsg.message.fileName || `media_${Date.now()}.${extension}`;
    const mimeType = quotedMsg.message.mimetype.split('/')[0];
    const mediaData = await downloadContentFromMessage(quotedMsg.message, mimeType);
    const buffer = await streamToBuffer(mediaData);

    return { buffer, extension, filename };
}

/**
 * Converts a stream into a buffer.
 * 
 * @async
 * @function streamToBuffer
 * @param {Readable} stream - The stream to convert.
 * @returns {Promise<Buffer>} The buffer containing the stream data.
 */
async function streamToBuffer(stream: Readable): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        const chunks: any[] = [];
        stream.on('data', chunk => chunks.push(chunk));
        stream.on('end', () => resolve(Buffer.concat(chunks)));
        stream.on('error', reject);
    });
}

/**
 * Retrieves quoted media from a message.
 * 
 * @async
 * @function getQuotedMedia
 * @param {Message} m - The message object containing the quoted media.
 * @returns {Promise<QuotedMedia | boolean>} The media type and message object, or false if no media is found.
 */
async function getQuotedMedia(m: Message): Promise<QuotedMedia | boolean> {
    const findMediaMessage = (obj: any): QuotedMedia | null => {
        if (!obj) return null;
        const mediaTypes = ['imageMessage', 'videoMessage', 'audioMessage', 'documentMessage'];
        for (const type of mediaTypes) {
            if (obj[type]) return { type, message: obj[type] };
        }
        if (typeof obj === 'object') {
            for (const key in obj) {
                const result = findMediaMessage(obj[key]);
                if (result) return result;
            }
        }
        return null;
    };

    for (const key in m.message) {
        const msg = m.message[key];
        if (msg?.contextInfo?.quotedMessage) {
            const media = findMediaMessage(msg.contextInfo.quotedMessage);
            if (media) return media;
        }
    }
    return false;
}

export {
    downloadMediaMsg,
    downloadQuotedMediaMessage,
    streamToBuffer,
    getQuotedMedia
};
