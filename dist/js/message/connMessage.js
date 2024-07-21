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
exports.ConnMessage = exports.sendMessageQuoted = exports.sendMessage = void 0;
/**
 * Sends a message with a presence update.
 * @param {object} sock - The WhatsApp socket instance.
 * @param {string} jid - The JID of the recipient.
 * @param {object} content - The content of the message.
 * @param {object} [options={}] - Additional options for the message.
 * @returns {Promise<object>} - The response from the sendMessage function.
 * @throws {Error} - If there is an error sending the message.
 */
const sendMessage = (sock_1, jid_1, content_1, ...args_1) => __awaiter(void 0, [sock_1, jid_1, content_1, ...args_1], void 0, function* (sock, jid, content, options = {}) {
    try {
        return yield sock.sendMessage(jid, content, options);
    }
    catch (err) {
        throw new Error(`Error sending message: ${err.message}`);
    }
});
exports.sendMessage = sendMessage;
/**
 * Sends a quoted message with a presence update.
 * @param {object} sock - The WhatsApp socket instance.
 * @param {string} jid - The JID of the recipient.
 * @param {object} m - The message object to quote.
 * @param {object} content - The content of the message.
 * @param {object} [options={}] - Additional options for the message.
 * @returns {Promise<object>} - The response from the sendMessageQuoted function.
 * @throws {Error} - If there is an error sending the quoted message.
 */
const sendMessageQuoted = (sock_1, jid_1, m_1, content_1, ...args_1) => __awaiter(void 0, [sock_1, jid_1, m_1, content_1, ...args_1], void 0, function* (sock, jid, m, content, options = {}) {
    try {
        return yield sock.sendMessage(jid, content, Object.assign(Object.assign({}, options), { quoted: m }));
    }
    catch (err) {
        throw new Error(`Error sending quoted message: ${err.message}`);
    }
});
exports.sendMessageQuoted = sendMessageQuoted;
class ConnMessage {
    constructor() {
        this.scheduledMessages = [];
        // Bind methods if necessary
        const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(this));
        methods.forEach(method => {
            const originalMethod = this[method];
            if (typeof originalMethod === 'function' && method !== 'constructor') {
                this[method] = originalMethod.bind(this);
            }
        });
    }
    /**
     * Sends a sticker message.
     * @param {object} m - The message object.
     * @param {Buffer|string} bufferOrUrl - The buffer or URL of the sticker.
     * @throws {Error} - If there is an error sending the sticker.
     */
    sendSticker(m, bufferOrUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const jid = m.key.remoteJid;
                yield sendMessage(this, jid, { sticker: bufferOrUrl });
            }
            catch (err) {
                throw new Error(`Error in sendSticker: ${err.message}`);
            }
        });
    }
    /**
     * Sends a sticker reply message.
     * @param {object} m - The message object to quote.
     * @param {Buffer|string} bufferOrUrl - The buffer or URL of the sticker.
     * @throws {Error} - If there is an error sending the sticker reply.
     */
    sendStickerReply(m, bufferOrUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const jid = m.key.remoteJid;
                yield sendMessageQuoted(this, jid, m, { sticker: bufferOrUrl });
            }
            catch (err) {
                throw new Error(`Error in sendStickerReply: ${err.message}`);
            }
        });
    }
    /**
     * Sends an image message.
     * @param {object} m - The message object.
     * @param {Buffer|string} bufferOrUrl - The buffer or URL of the image.
     * @param {string} caption - The caption for the image.
     * @throws {Error} - If there is an error sending the image.
     */
    sendImage(m, bufferOrUrl, caption) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const jid = m.key.remoteJid;
                const options = typeof bufferOrUrl === 'string'
                    ? { image: { url: bufferOrUrl }, caption }
                    : { image: bufferOrUrl, caption };
                yield sendMessage(this, jid, options);
            }
            catch (err) {
                throw new Error(`Error in sendImage: ${err.message}`);
            }
        });
    }
    /**
  * Sends an image reply message.
  * @param {object} m - The message object to quote.
  * @param {Buffer|string} bufferOrUrl - The buffer or URL of the image.
  * @param {string} caption - The caption for the image.
  * @throws {Error} - If there is an error sending the image reply.
  */
    sendImageReply(m, bufferOrUrl, caption) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const jid = m.key.remoteJid;
                const options = typeof bufferOrUrl === 'string'
                    ? { image: { url: bufferOrUrl }, caption }
                    : { image: bufferOrUrl, caption };
                yield sendMessageQuoted(this, jid, m, options);
            }
            catch (err) {
                throw new Error(`Error in sendImageReply: ${err.message}`);
            }
        });
    }
    /**
    * Sends a video message.
    * @param {object} m - The message object.
    * @param {Buffer|string} bufferOrUrl - The buffer or URL of the video.
    * @param {string} caption - The caption for the video.
    * @throws {Error} - If there is an error sending the video.
    */
    sendVideo(m, bufferOrUrl, caption) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const jid = m.key.remoteJid;
                const options = typeof bufferOrUrl === 'string'
                    ? { video: { url: bufferOrUrl }, caption }
                    : { video: bufferOrUrl, caption };
                yield sendMessage(this, jid, options);
            }
            catch (err) {
                throw new Error(`Error in sendVideo: ${err.message}`);
            }
        });
    }
    /**
     * Sends a video reply message.
     * @param {object} m - The message object to quote.
     * @param {Buffer|string} bufferOrUrl - The buffer or URL of the video.
     * @param {string} caption - The caption for the video.
     * @throws {Error} - If there is an error sending the video reply.
     */
    sendVideoReply(m, bufferOrUrl, caption) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const jid = m.key.remoteJid;
                const options = typeof bufferOrUrl === 'string'
                    ? { video: { url: bufferOrUrl }, caption }
                    : { video: bufferOrUrl, caption };
                yield sendMessageQuoted(this, jid, m, options);
            }
            catch (err) {
                throw new Error(`Error in sendVideoReply: ${err.message}`);
            }
        });
    }
    /**
      * Sends a document message.
      * @param {object} m - The message object.
      * @param {Buffer|string} bufferOrUrl - The buffer or URL of the document.
      * @param {string} mimetype - The MIME type of the document.
      * @param {string} fileName - The file name of the document.
      * @param {string} caption - The caption for the document.
      * @throws {Error} - If there is an error sending the document.
      */
    sendDocument(m, bufferOrUrl, mimetype, fileName, caption) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const jid = m.key.remoteJid;
                const options = typeof bufferOrUrl === 'string'
                    ? { document: { url: bufferOrUrl }, mimetype, fileName, caption }
                    : { document: bufferOrUrl, mimetype, fileName, caption };
                yield sendMessage(this, jid, options);
            }
            catch (err) {
                throw new Error(`Error in sendDocument: ${err.message}`);
            }
        });
    }
    /**
       * Sends a document reply message.
       * @param {object} m - The message object to quote.
       * @param {Buffer|string} bufferOrUrl - The buffer or URL of the document.
       * @param {string} mimetype - The MIME type of the document.
       * @param {string} fileName - The file name of the document.
       * @param {string} caption - The caption for the document.
       * @throws {Error} - If there is an error sending the document reply.
       */
    sendDocumentReply(m, bufferOrUrl, mimetype, fileName, caption) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const jid = m.key.remoteJid;
                const options = typeof bufferOrUrl === 'string'
                    ? { document: { url: bufferOrUrl }, mimetype, fileName, caption }
                    : { document: bufferOrUrl, mimetype, fileName, caption };
                yield sendMessageQuoted(this, jid, m, options);
            }
            catch (err) {
                throw new Error(`Error in sendDocumentReply: ${err.message}`);
            }
        });
    }
    /**
  * Sends an audio message.
  * @param {object} m - The message object.
  * @param {Buffer|string} bufferOrUrl - The buffer or URL of the audio.
  * @param {boolean} [ptt=false] - Whether the audio is a push-to-talk message.
  * @throws {Error} - If there is an error sending the audio.
  */
    sendAudio(m_1, bufferOrUrl_1) {
        return __awaiter(this, arguments, void 0, function* (m, bufferOrUrl, ptt = false) {
            try {
                const jid = m.key.remoteJid;
                const options = typeof bufferOrUrl === 'string'
                    ? { audio: { url: bufferOrUrl }, ptt, mimetype: 'audio/mpeg' }
                    : { audio: bufferOrUrl, ptt, mimetype: 'audio/mpeg' };
                yield sendMessage(this, jid, options);
            }
            catch (err) {
                throw new Error(`Error in sendAudio: ${err.message}`);
            }
        });
    }
    /**
     * Sends an audio reply message.
     * @param {object} m - The message object to quote.
     * @param {Buffer|string} bufferOrUrl - The buffer or URL of the audio.
     * @param {boolean} [ptt=false] - Whether the audio is a push-to-talk message.
     * @throws {Error} - If there is an error sending the audio reply.
     */
    sendAudioReply(m_1, bufferOrUrl_1) {
        return __awaiter(this, arguments, void 0, function* (m, bufferOrUrl, ptt = false) {
            try {
                const jid = m.key.remoteJid;
                const options = typeof bufferOrUrl === 'string'
                    ? { audio: { url: bufferOrUrl }, ptt, mimetype: 'audio/mpeg' }
                    : { audio: bufferOrUrl, ptt, mimetype: 'audio/mpeg' };
                yield sendMessageQuoted(this, jid, m, options);
            }
            catch (err) {
                throw new Error(`Error in sendAudioReply: ${err.message}`);
            }
        });
    }
    /**
     * Sends a GIF message.
     * @param {object} m - The message object.
     * @param {Buffer|string} bufferOrUrl - The buffer or URL of the GIF.
     * @param {boolean} [playback=true] - Whether the GIF should play back.
     * @throws {Error} - If there is an error sending the GIF.
     */
    sendGif(m_1, bufferOrUrl_1) {
        return __awaiter(this, arguments, void 0, function* (m, bufferOrUrl, playback = true) {
            try {
                const jid = m.key.remoteJid;
                let gifBuffer;
                if (typeof bufferOrUrl === 'string') {
                    const response = yield fetch(bufferOrUrl);
                    gifBuffer = yield response.arrayBuffer();
                }
                else {
                    gifBuffer = bufferOrUrl;
                }
                yield sendMessage(this, jid, { video: gifBuffer, gifPlayback: playback });
            }
            catch (err) {
                throw new Error(`Error in sendGif: ${err.message}`);
            }
        });
    }
    /**
     * Sends a GIF reply message.
     * @param {object} m - The message object to quote.
     * @param {Buffer|string} bufferOrUrl - The buffer or URL of the GIF.
     * @param {boolean} [playback=true] - Whether the GIF should play back.
     * @throws {Error} - If there is an error sending the GIF reply.
     */
    sendGifReply(m_1, bufferOrUrl_1) {
        return __awaiter(this, arguments, void 0, function* (m, bufferOrUrl, playback = true) {
            try {
                const jid = m.key.remoteJid;
                let gifBuffer;
                if (typeof bufferOrUrl === 'string') {
                    const response = yield fetch(bufferOrUrl);
                    gifBuffer = yield response.arrayBuffer();
                }
                else {
                    gifBuffer = bufferOrUrl;
                }
                yield sendMessageQuoted(this, jid, m, { video: gifBuffer, gifPlayback: playback });
            }
            catch (err) {
                throw new Error(`Error in sendGifReply: ${err.message}`);
            }
        });
    }
    /**
     * Replies to a message with text.
     * @param {object} m - The message object to quote.
     * @param {string} text - The text to reply with.
     * @throws {Error} - If there is an error replying to the message.
     */
    reply(m, text) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield sendMessage(this, m.key.remoteJid, { text }, { quoted: m });
            }
            catch (err) {
                throw new Error(`Error in reply: ${err.message}`);
            }
        });
    }
    /**
     * Sends a text message.
     * @param {object} m - The message object.
     * @param {string} text - The text to send.
     * @throws {Error} - If there is an error sending the text.
     */
    send(m, text) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield sendMessage(this, m.key.remoteJid, { text });
            }
            catch (err) {
                throw new Error(`Error in send: ${err.message}`);
            }
        });
    }
    /**
     * Reacts to a message with an emoji.
     * @param {object} m - The message object to react to.
     * @param {string} emoji - The emoji to react with.
     * @throws {Error} - If there is an error reacting to the message.
     */
    react(m, emoji) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield sendMessage(this, m.key.remoteJid, { react: { text: emoji, key: m.key } });
            }
            catch (err) {
                throw new Error(`Error in react: ${err.message}`);
            }
        });
    }
    /**
     * Edits a sent message.
     * @param {object} m - The original message object.
     * @param {object} sentMessage - The sent message object.
     * @param {string} newMessage - The new message text.
     * @throws {Error} - If there is an error editing the message.
     */
    editMsg(m, sentMessage, newMessage) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield sendMessage(this, m.key.remoteJid, { edit: sentMessage.key, text: newMessage, type: "MESSAGE_EDIT" });
            }
            catch (err) {
                throw new Error(`Error in editMsg: ${err.message}`);
            }
        });
    }
}
exports.ConnMessage = ConnMessage;
//# sourceMappingURL=connMessage.js.map