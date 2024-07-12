const { delay } = require('@whiskeysockets/baileys')

const sendMessage = async (sock, jid, content, options = {}) => {
    try {
        await sock.sendPresenceUpdate('composing', jid);
        await delay(200);
        return await sock.sendMessage(jid, content, options);
    } catch (err) {
        throw new Error(`Error sending message: ${err.message}`);
    }
};

const sendMessageQuoted = async (sock, jid, m, content, options = {}) => {
    try {
        await sock.sendPresenceUpdate('composing', jid);
        await delay(200);
        return await sock.sendMessage(jid, content, { ...options, quoted: m });
    } catch (err) {
        throw new Error(`Error sending quoted message: ${err.message}`);
    }
};

class connMessage {
    constructor() { }

    async sendSticker(sock, m, bufferOrUrl) {
        try {
            const jid = m.key.remoteJid;
            await sendMessage(sock, jid, { sticker: bufferOrUrl });
        } catch (err) {
            throw new Error(`Error in sendSticker: ${err.message}`);
        }
    }

    async sendStickerReply(sock, m, bufferOrUrl) {
        try {
            const jid = m.key.remoteJid;
            await sendMessageQuoted(sock, jid, m, { sticker: bufferOrUrl });
        } catch (err) {
            throw new Error(`Error in sendStickerReply: ${err.message}`);
        }
    }

    async sendImage(sock, m, bufferOrUrl, caption) {
        try {
            const jid = m.key.remoteJid;
            const options = typeof bufferOrUrl === 'string'
                ? { image: { url: bufferOrUrl }, caption }
                : { image: bufferOrUrl, caption };
            await sendMessage(sock, jid, options);
        } catch (err) {
            throw new Error(`Error in sendImage: ${err.message}`);
        }
    }

    async sendImageReply(sock, m, bufferOrUrl, caption) {
        try {
            const jid = m.key.remoteJid;
            const options = typeof bufferOrUrl === 'string'
                ? { image: { url: bufferOrUrl }, caption }
                : { image: bufferOrUrl, caption };
            await sendMessageQuoted(sock, jid, m, options);
        } catch (err) {
            throw new Error(`Error in sendImageReply: ${err.message}`);
        }
    }

    async sendVideo(sock, m, bufferOrUrl, caption) {
        try {
            const jid = m.key.remoteJid;
            const options = typeof bufferOrUrl === 'string'
                ? { video: { url: bufferOrUrl }, caption }
                : { video: bufferOrUrl, caption };
            await sendMessage(sock, jid, options);
        } catch (err) {
            throw new Error(`Error in sendVideo: ${err.message}`);
        }
    }

    async sendVideoReply(sock, m, bufferOrUrl, caption) {
        try {
            const jid = m.key.remoteJid;
            const options = typeof bufferOrUrl === 'string'
                ? { video: { url: bufferOrUrl }, caption }
                : { video: bufferOrUrl, caption };
            await sendMessageQuoted(sock, jid, m, options);
        } catch (err) {
            throw new Error(`Error in sendVideoReply: ${err.message}`);
        }
    }

    async sendDocument(sock, m, bufferOrUrl, mimetype, fileName, caption) {
        try {
            const jid = m.key.remoteJid;
            const options = typeof bufferOrUrl === 'string'
                ? { document: { url: bufferOrUrl }, mimetype, fileName, caption }
                : { document: bufferOrUrl, mimetype, fileName, caption };
            await sendMessage(sock, jid, options);
        } catch (err) {
            throw new Error(`Error in sendDocument: ${err.message}`);
        }
    }

    async sendDocumentReply(sock, m, bufferOrUrl, mimetype, fileName, caption) {
        try {
            const jid = m.key.remoteJid;
            const options = typeof bufferOrUrl === 'string'
                ? { document: { url: bufferOrUrl }, mimetype, fileName, caption }
                : { document: bufferOrUrl, mimetype, fileName, caption };
            await sendMessageQuoted(sock, jid, m, options);
        } catch (err) {
            throw new Error(`Error in sendDocumentReply: ${err.message}`);
        }
    }

    async sendAudio(sock, m, bufferOrUrl, ptt = false) {
        try {
            const jid = m.key.remoteJid;
            const options = typeof bufferOrUrl === 'string'
                ? { audio: { url: bufferOrUrl }, ptt, mimetype: 'audio/mpeg' }
                : { audio: bufferOrUrl, ptt, mimetype: 'audio/mpeg' };
            await sock.sendPresenceUpdate('recording', jid);
            await delay(400);
            await sendMessage(sock, jid, options);
        } catch (err) {
            throw new Error(`Error in sendAudio: ${err.message}`);
        }
    }

    async sendAudioReply(sock, m, bufferOrUrl, ptt = false) {
        try {
            const jid = m.key.remoteJid;
            const options = typeof bufferOrUrl === 'string'
                ? { audio: { url: bufferOrUrl }, ptt, mimetype: 'audio/mpeg' }
                : { audio: bufferOrUrl, ptt, mimetype: 'audio/mpeg' };
            await sock.sendPresenceUpdate('recording', jid);
            await delay(400);
            await sendMessageQuoted(sock, jid, m, options);
        } catch (err) {
            throw new Error(`Error in sendAudioReply: ${err.message}`);
        }
    }

    async sendGif(sock, m, bufferOrUrl, playback = true) {
        try {
            const jid = m.key.remoteJid;
            let gifBuffer;
            if (typeof bufferOrUrl === 'string') {
                const response = await fetch(bufferOrUrl);
                gifBuffer = await response.arrayBuffer();
            } else {
                gifBuffer = bufferOrUrl;
            }
            await sendMessage(sock, jid, { video: gifBuffer, gifPlayback: playback });
        } catch (err) {
            throw new Error(`Error in sendGif: ${err.message}`);
        }
    }

    async sendGifReply(sock, m, bufferOrUrl, playback = true) {
        try {
            const jid = m.key.remoteJid;
            let gifBuffer;
            if (typeof bufferOrUrl === 'string') {
                const response = await fetch(bufferOrUrl);
                gifBuffer = await response.arrayBuffer();
            } else {
                gifBuffer = bufferOrUrl;
            }
            await sendMessageQuoted(sock, jid, m, { video: gifBuffer, gifPlayback: playback });
        } catch (err) {
            throw new Error(`Error in sendGifReply: ${err.message}`);
        }
    }

    async reply(sock, m, text) {
        try {
            await sendMessage(sock, m.key.remoteJid, { text }, { quoted: m });
        } catch (err) {
            throw new Error(`Error in reply: ${err.message}`);
        }
    }

    async send(sock, m, text) {
        try {
            await sendMessage(sock, m.key.remoteJid, { text });
        } catch (err) {
            throw new Error(`Error in send: ${err.message}`);
        }
    }

    async react(sock, m, emoji) {
        try {
            await sendMessage(sock, m.key.remoteJid, { react: { text: emoji, key: m.key } });
        } catch (err) {
            throw new Error(`Error in react: ${err.message}`);
        }
    }

    async editMsg(sock, m, sentMessage, newMessage) {
        try {
            await sendMessage(sock, m.key.remoteJid, { edit: sentMessage.key, text: newMessage, type: "MESSAGE_EDIT" });
        } catch (err) {
            throw new Error(`Error in editMsg: ${err.message}`);
        }
    }

    async deleteMsgGroup(sock, m) {
        try {
            const { remoteJid } = m.key;
            const groupMetadata = await sock.groupMetadata(remoteJid);
            const botId = sock.user.id.replace(/:.*$/, "") + "@s.whatsapp.net";
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

            await sock.sendPresenceUpdate('composing', remoteJid);
            await delay(200);
            const response = await sock.sendMessage(remoteJid, { delete: messageToDelete.key });
            await delay(750);
            await sock.sendMessage(remoteJid, { delete: m.key });
            return response;
        } catch (err) {
            throw new Error(`Error in deleteMsgGroup: ${err.message}`);
        }
    }

    async deleteMsg(sock, m) {
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

            await sock.sendPresenceUpdate('composing', remoteJid);
            await delay(200);
            const response = await sock.sendMessage(remoteJid, { delete: messageToDelete.key });
            await delay(750);
            await sock.sendMessage(remoteJid, { delete: m.key });
            return response;
        } catch (err) {
            throw new Error(`Error in deleteMsg: ${err.message}`);
        }
    }
}

module.exports = connMessage;
