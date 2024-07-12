const { delay } = require('@whiskeysockets/baileys');

let socks;

/**
 * Sends a message with a presence update.
 * @param {object} sock - The WhatsApp socket instance.
 * @param {string} jid - The JID of the recipient.
 * @param {object} content - The content of the message.
 * @param {object} [options={}] - Additional options for the message.
 * @returns {Promise<object>} - The response from the sendMessage function.
 * @throws {Error} - If there is an error sending the message.
 */
const sendMessage = async (jid, content, options = {}) => {
    console.log(socks, '[[[[[[[[[[[[[[[[[[[[[[[[')
    try {
        return await socks.sendMessage(jid, content, options);
    } catch (err) {
        throw new Error(`Error sending message: ${err.message}`);
    }
};

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
const sendMessageQuoted = async (jid, m, content, options = {}) => {
    try {
        return await socks.sendMessage(jid, content, { ...options, quoted: m });
    } catch (err) {
        throw new Error(`Error sending quoted message: ${err.message}`);
    }
};

/**
 * connMessage class for sending different types of messages.
 */
class connMessage {
    constructor(sock) { // Add sock as a parameter
        this.sock = sock;
        socks = sock;
    }

    /**
     * Sends a sticker message.
     * @param {object} sock - The WhatsApp socket instance.
     * @param {object} m - The message object.
     * @param {Buffer|string} bufferOrUrl - The buffer or URL of the sticker.
     * @throws {Error} - If there is an error sending the sticker.
     */
    async sendSticker(m, bufferOrUrl) {
        try {
            const jid = m.key.remoteJid;
            await sendMessage(jid, { sticker: bufferOrUrl });
        } catch (err) {
            throw new Error(`Error in sendSticker: ${err.message}`);
        }
    }

    /**
     * Sends a sticker reply message.
     * @param {object} sock - The WhatsApp socket instance.
     * @param {object} m - The message object to quote.
     * @param {Buffer|string} bufferOrUrl - The buffer or URL of the sticker.
     * @throws {Error} - If there is an error sending the sticker reply.
     */
    async sendStickerReply(m, bufferOrUrl) {
        try {
            const jid = m.key.remoteJid;
            await sendMessageQuoted(jid, m, { sticker: bufferOrUrl });
        } catch (err) {
            throw new Error(`Error in sendStickerReply: ${err.message}`);
        }
    }

    /**
     * Sends an image message.
     * @param {object} sock - The WhatsApp socket instance.
     * @param {object} m - The message object.
     * @param {Buffer|string} bufferOrUrl - The buffer or URL of the image.
     * @param {string} caption - The caption for the image.
     * @throws {Error} - If there is an error sending the image.
     */
    async sendImage(m, bufferOrUrl, caption) {
        try {
            const jid = m.key.remoteJid;
            const options = typeof bufferOrUrl === 'string'
                ? { image: { url: bufferOrUrl }, caption }
                : { image: bufferOrUrl, caption };
            await sendMessage(jid, options);
        } catch (err) {
            throw new Error(`Error in sendImage: ${err.message}`);
        }
    }

    /**
     * Sends an image reply message.
     * @param {object} sock - The WhatsApp socket instance.
     * @param {object} m - The message object to quote.
     * @param {Buffer|string} bufferOrUrl - The buffer or URL of the image.
     * @param {string} caption - The caption for the image.
     * @throws {Error} - If there is an error sending the image reply.
     */
    async sendImageReply(m, bufferOrUrl, caption) {
        try {
            const jid = m.key.remoteJid;
            const options = typeof bufferOrUrl === 'string'
                ? { image: { url: bufferOrUrl }, caption }
                : { image: bufferOrUrl, caption };
            await sendMessageQuoted(jid, m, options);
        } catch (err) {
            throw new Error(`Error in sendImageReply: ${err.message}`);
        }
    }

    /**
     * Sends a video message.
     * @param {object} sock - The WhatsApp socket instance.
     * @param {object} m - The message object.
     * @param {Buffer|string} bufferOrUrl - The buffer or URL of the video.
     * @param {string} caption - The caption for the video.
     * @throws {Error} - If there is an error sending the video.
     */
    async sendVideo(m, bufferOrUrl, caption) {
        try {
            const jid = m.key.remoteJid;
            const options = typeof bufferOrUrl === 'string'
                ? { video: { url: bufferOrUrl }, caption }
                : { video: bufferOrUrl, caption };
            await sendMessage(jid, options);
        } catch (err) {
            throw new Error(`Error in sendVideo: ${err.message}`);
        }
    }

    /**
     * Sends a video reply message.
     * @param {object} sock - The WhatsApp socket instance.
     * @param {object} m - The message object to quote.
     * @param {Buffer|string} bufferOrUrl - The buffer or URL of the video.
     * @param {string} caption - The caption for the video.
     * @throws {Error} - If there is an error sending the video reply.
     */
    async sendVideoReply(m, bufferOrUrl, caption) {
        try {
            const jid = m.key.remoteJid;
            const options = typeof bufferOrUrl === 'string'
                ? { video: { url: bufferOrUrl }, caption }
                : { video: bufferOrUrl, caption };
            await sendMessageQuoted(jid, m, options);
        } catch (err) {
            throw new Error(`Error in sendVideoReply: ${err.message}`);
        }
    }

    /**
     * Sends a document message.
     * @param {object} sock - The WhatsApp socket instance.
     * @param {object} m - The message object.
     * @param {Buffer|string} bufferOrUrl - The buffer or URL of the document.
     * @param {string} mimetype - The MIME type of the document.
     * @param {string} fileName - The file name of the document.
     * @param {string} caption - The caption for the document.
     * @throws {Error} - If there is an error sending the document.
     */
    async sendDocument(m, bufferOrUrl, mimetype, fileName, caption) {
        try {
            const jid = m.key.remoteJid;
            const options = typeof bufferOrUrl === 'string'
                ? { document: { url: bufferOrUrl }, mimetype, fileName, caption }
                : { document: bufferOrUrl, mimetype, fileName, caption };
            await sendMessage(jid, options);
        } catch (err) {
            throw new Error(`Error in sendDocument: ${err.message}`);
        }
    }

    /**
     * Sends a document reply message.
     * @param {object} sock - The WhatsApp socket instance.
     * @param {object} m - The message object to quote.
     * @param {Buffer|string} bufferOrUrl - The buffer or URL of the document.
     * @param {string} mimetype - The MIME type of the document.
     * @param {string} fileName - The file name of the document.
     * @param {string} caption - The caption for the document.
     * @throws {Error} - If there is an error sending the document reply.
     */
    async sendDocumentReply(m, bufferOrUrl, mimetype, fileName, caption) {
        try {
            const jid = m.key.remoteJid;
            const options = typeof bufferOrUrl === 'string'
                ? { document: { url: bufferOrUrl }, mimetype, fileName, caption }
                : { document: bufferOrUrl, mimetype, fileName, caption };
            await sendMessageQuoted(jid, m, options);
        } catch (err) {
            throw new Error(`Error in sendDocumentReply: ${err.message}`);
        }
    }

    /**
     * Sends an audio message.
     * @param {object} sock - The WhatsApp socket instance.
     * @param {object} m - The message object.
     * @param {Buffer|string} bufferOrUrl - The buffer or URL of the audio.
     * @param {boolean} [ptt=false] - Whether the audio is a push-to-talk message.
     * @throws {Error} - If there is an error sending the audio.
     */
    async sendAudio(m, bufferOrUrl, ptt = false) {
        try {
            const jid = m.key.remoteJid;
            const options = typeof bufferOrUrl === 'string'
                ? { audio: { url: bufferOrUrl }, ptt, mimetype: 'audio/mpeg' }
                : { audio: bufferOrUrl, ptt, mimetype: 'audio/mpeg' };
            await sendMessage(jid, options);
        } catch (err) {
            throw new Error(`Error in sendAudio: ${err.message}`);
        }
    }

    /**
     * Sends an audio reply message.
     * @param {object} sock - The WhatsApp socket instance.
     * @param {object} m - The message object to quote.
     * @param {Buffer|string} bufferOrUrl - The buffer or URL of the audio.
     * @param {boolean} [ptt=false] - Whether the audio is a push-to-talk message.
     * @throws {Error} - If there is an error sending the audio reply.
     */
    async sendAudioReply(m, bufferOrUrl, ptt = false) {
        try {
            const jid = m.key.remoteJid;
            const options = typeof bufferOrUrl === 'string'
                ? { audio: { url: bufferOrUrl }, ptt, mimetype: 'audio/mpeg' }
                : { audio: bufferOrUrl, ptt, mimetype: 'audio/mpeg' };
            await sendMessageQuoted(jid, m, options);
        } catch (err) {
            throw new Error(`Error in sendAudioReply: ${err.message}`);
        }
    }

    /**
     * Sends a GIF message.
     * @param {object} sock - The WhatsApp socket instance.
     * @param {object} m - The message object.
     * @param {Buffer|string} bufferOrUrl - The buffer or URL of the GIF.
     * @param {boolean} [playback=true] - Whether the GIF should play back.
     * @throws {Error} - If there is an error sending the GIF.
     */
    async sendGif(m, bufferOrUrl, playback = true) {
        try {
            const jid = m.key.remoteJid;
            let gifBuffer;
            if (typeof bufferOrUrl === 'string') {
                const response = await fetch(bufferOrUrl);
                gifBuffer = await response.arrayBuffer();
            } else {
                gifBuffer = bufferOrUrl;
            }
            await sendMessage(jid, { video: gifBuffer, gifPlayback: playback });
        } catch (err) {
            throw new Error(`Error in sendGif: ${err.message}`);
        }
    }

    /**
     * Sends a GIF reply message.
     * @param {object} sock - The WhatsApp socket instance.
     * @param {object} m - The message object to quote.
     * @param {Buffer|string} bufferOrUrl - The buffer or URL of the GIF.
     * @param {boolean} [playback=true] - Whether the GIF should play back.
     * @throws {Error} - If there is an error sending the GIF reply.
     */
    async sendGifReply(m, bufferOrUrl, playback = true) {
        try {
            const jid = m.key.remoteJid;
            let gifBuffer;
            if (typeof bufferOrUrl === 'string') {
                const response = await fetch(bufferOrUrl);
                gifBuffer = await response.arrayBuffer();
            } else {
                gifBuffer = bufferOrUrl;
            }
            await sendMessageQuoted(jid, m, { video: gifBuffer, gifPlayback: playback });
        } catch (err) {
            throw new Error(`Error in sendGifReply: ${err.message}`);
        }
    }

    /**
     * Replies to a message with text.
     * @param {object} sock - The WhatsApp socket instance.
     * @param {object} m - The message object to quote.
     * @param {string} text - The text to reply with.
     * @throws {Error} - If there is an error replying to the message.
     */
    async reply(m, text) {
        try {
            await sendMessage(m.key.remoteJid, { text }, { quoted: m });
        } catch (err) {
            throw new Error(`Error in reply: ${err.message}`);
        }
    }

    /**
     * Sends a text message.
     * @param {object} sock - The WhatsApp socket instance.
     * @param {object} m - The message object.
     * @param {string} text - The text to send.
     * @throws {Error} - If there is an error sending the text.
     */
    async send(m, text) {
        try {
            await sendMessage(m.key.remoteJid, { text });
        } catch (err) {
            throw new Error(`Error in send: ${err.message}`);
        }
    }

    /**
     * Reacts to a message with an emoji.
     * @param {object} sock - The WhatsApp socket instance.
     * @param {object} m - The message object to react to.
     * @param {string} emoji - The emoji to react with.
     * @throws {Error} - If there is an error reacting to the message.
     */
    async react(m, emoji) {
        try {
            await sendMessage(m.key.remoteJid, { react: { text: emoji, key: m.key } });
        } catch (err) {
            throw new Error(`Error in react: ${err.message}`);
        }
    }

    /**
     * Edits a sent message.
     * @param {object} sock - The WhatsApp socket instance.
     * @param {object} m - The original message object.
     * @param {object} sentMessage - The sent message object.
     * @param {string} newMessage - The new message text.
     * @throws {Error} - If there is an error editing the message.
     */
    async editMsg(m, sentMessage, newMessage) {
        try {
            await sendMessage(m.key.remoteJid, { edit: sentMessage.key, text: newMessage, type: "MESSAGE_EDIT" });
        } catch (err) {
            throw new Error(`Error in editMsg: ${err.message}`);
        }
    }

    /**
     * Deletes a message in a group.
     * @param {object} sock - The WhatsApp socket instance.
     * @param {object} m - The message object to delete.
     * @returns {Promise<object>} - The response from the delete operation.
     * @throws {Error} - If there is an error deleting the message.
     */
    async deleteMsgGroup(m) {
        try {
            const { remoteJid } = m.key;
            const groupMetadata = await socks.groupMetadata(remoteJid);
            const botId = socks.user.id.replace(/:.*$/, "") + "@s.whatsapp.net";
            const botIsAdmin = groupMetadata.participants.some(p => p.id.includes(botId) && p.admin);

            if (!botIsAdmin) {
                throw new Error("I cannot delete messages because I am not an admin in this group.");
            }

            const isOwnMessage = m.key.participant === m?.message?.extendedTextMessage?.contextInfo?.participant;
            const stanId = m?.message?.extendedTextMessage?.contextInfo?.stanzaId;

            const messageToDelete = {
                key: {
                    remoteJid: m.key.remoteJid,
                    fromMe: isOwnMessage,
                    id: stanId,
                    participant: m?.message?.extendedTextMessage?.contextInfo?.participant
                }
            };

            const response = await socks.sendMessage(remoteJid, { delete: messageToDelete.key });
            await socks.sendMessage(remoteJid, { delete: m.key });
            return response;
        } catch (err) {
            throw new Error(`Error in deleteMsgGroup: ${err.message}`);
        }
    }

    /**
     * Deletes a message.
     * @param {object} sock - The WhatsApp socket instance.
     * @param {object} m - The message object to delete.
     * @returns {Promise<object>} - The response from the delete operation.
     * @throws {Error} - If there is an error deleting the message.
     */
    async deleteMsg(m) {
        try {
            const { remoteJid } = m.key;
            const isOwnMessage = m.key.participant === m?.message?.extendedTextMessage?.contextInfo?.participant;
            const stanId = m?.message?.extendedTextMessage?.contextInfo?.stanzaId;

            const messageToDelete = {
                key: {
                    remoteJid: m.key.remoteJid,
                    fromMe: isOwnMessage,
                    id: stanId,
                    participant: m?.message?.extendedTextMessage?.contextInfo?.participant
                }
            };


            const response = await socks.sendMessage(remoteJid, { delete: messageToDelete.key });
            await socks.sendMessage(remoteJid, { delete: m.key });
            return response;
        } catch (err) {
            throw new Error(`Error in deleteMsg: ${err.message}`);
        }
    }
}

module.exports = connMessage;
