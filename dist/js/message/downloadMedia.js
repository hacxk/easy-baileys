"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadMediaMsg = downloadMediaMsg;
exports.downloadQuotedMediaMessage = downloadQuotedMediaMessage;
exports.streamToBuffer = streamToBuffer;
exports.getQuotedMedia = getQuotedMedia;
const baileys_1 = require("@whiskeysockets/baileys");
/**
 * Downloads media message content from a given message.
 *
 * @async
 * @function downloadMediaMsg
 * @param {Message} m - The message object containing the media.
 * @returns {Promise<{ buffer: Buffer, extension: string } | null | string>} The media buffer and its extension, null if no message, or a string if an invalid message type.
 */
function downloadMediaMsg(m) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!m.message)
            return null;
        const messageType = Object.keys(m.message)[0];
        const validTypes = ['imageMessage', 'videoMessage', 'audioMessage', 'documentMessage', 'documentWithCaptionMessage'];
        if (!validTypes.includes(messageType)) {
            return 'Provide a valid message (quoted messages are not valid)';
        }
        const buffer = yield (0, baileys_1.downloadMediaMessage)(m, "buffer", {});
        const getExtension = (type) => {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            const extensions = {
                imageMessage: ((_b = (_a = m.message) === null || _a === void 0 ? void 0 : _a.imageMessage) === null || _b === void 0 ? void 0 : _b.mimetype) === 'image/png' ? '.png' : '.jpeg',
                videoMessage: '.mp4',
                audioMessage: '.mp3',
                documentMessage: `.${(_d = (_c = m.message) === null || _c === void 0 ? void 0 : _c.documentMessage) === null || _d === void 0 ? void 0 : _d.fileName.split('.').pop()}`,
                documentWithCaptionMessage: `.${(_h = (_g = (_f = (_e = m.message) === null || _e === void 0 ? void 0 : _e.documentWithCaptionMessage) === null || _f === void 0 ? void 0 : _f.message) === null || _g === void 0 ? void 0 : _g.documentMessage) === null || _h === void 0 ? void 0 : _h.fileName.split('.').pop()}`
            };
            return extensions[type];
        };
        const extension = getExtension(messageType);
        return { buffer, extension };
    });
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
function downloadQuotedMediaMessage(m) {
    return __awaiter(this, void 0, void 0, function* () {
        const quotedMsg = yield getQuotedMedia(m);
        if (!quotedMsg || typeof quotedMsg === 'boolean')
            throw new Error('No quoted media message found.');
        const getExtension = (type) => {
            const extensions = { imageMessage: 'png', videoMessage: 'mp4', audioMessage: 'mp3' };
            return extensions[type] || 'bin';
        };
        const extension = getExtension(quotedMsg.type);
        const filename = quotedMsg.message.fileName || `media_${Date.now()}.${extension}`;
        const mimeType = quotedMsg.message.mimetype.split('/')[0];
        const mediaData = yield (0, baileys_1.downloadContentFromMessage)(quotedMsg.message, mimeType);
        const buffer = yield streamToBuffer(mediaData);
        return { buffer, extension, filename };
    });
}
/**
 * Converts a stream into a buffer.
 *
 * @async
 * @function streamToBuffer
 * @param {Readable} stream - The stream to convert.
 * @returns {Promise<Buffer>} The buffer containing the stream data.
 */
function streamToBuffer(stream) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            const chunks = [];
            stream.on('data', chunk => chunks.push(chunk));
            stream.on('end', () => resolve(Buffer.concat(chunks)));
            stream.on('error', reject);
        });
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
function getQuotedMedia(m) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const findMediaMessage = (obj) => {
            if (!obj)
                return null;
            const mediaTypes = ['imageMessage', 'videoMessage', 'audioMessage', 'documentMessage'];
            for (const type of mediaTypes) {
                if (obj[type])
                    return { type, message: obj[type] };
            }
            if (typeof obj === 'object') {
                for (const key in obj) {
                    const result = findMediaMessage(obj[key]);
                    if (result)
                        return result;
                }
            }
            return null;
        };
        for (const key in m.message) {
            const msg = m.message[key];
            if ((_a = msg === null || msg === void 0 ? void 0 : msg.contextInfo) === null || _a === void 0 ? void 0 : _a.quotedMessage) {
                const media = findMediaMessage(msg.contextInfo.quotedMessage);
                if (media)
                    return media;
            }
        }
        return false;
    });
}
//# sourceMappingURL=downloadMedia.js.map