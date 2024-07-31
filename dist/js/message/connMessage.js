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
exports.ConnMessage = void 0;
const baileys_1 = require("@whiskeysockets/baileys");
class ConnMessage {
    sendTextMessage(jid, text) {
        return this.sendMessage(jid, { text });
    }
    reply(m, text) {
        const jid = m.key.remoteJid;
        if (!jid) {
            throw new Error('Remote JID is undefined or null');
        }
        return this.sendMessage(jid, { text: text }, { quoted: m });
    }
    react(m, emoji) {
        const jid = m.key.remoteJid;
        if (!jid) {
            throw new Error('Remote JID is undefined or null');
        }
        return this.sendMessage(jid, { react: { text: emoji, key: m.key } });
    }
    send(jid, content, options) {
        return this.sendMessage(jid, content, options);
    }
    sendImage(jid, image, caption, options) {
        return this.sendMessage(jid, Object.assign({ image: image, caption: caption }, options));
    }
    sendImageReply(m, image, caption, options) {
        const jid = m.key.remoteJid;
        if (!jid) {
            throw new Error('Remote JID is undefined or null');
        }
        return this.sendMessage(jid, Object.assign({ image: image, caption: caption }, options), { quoted: m });
    }
    sendVideo(jid, video, caption, options) {
        return this.sendMessage(jid, Object.assign({ video: video, caption: caption }, options));
    }
    sendVideoReply(m, video, caption, options) {
        const jid = m.key.remoteJid;
        if (!jid) {
            throw new Error('Remote JID is undefined or null');
        }
        return this.sendMessage(jid, Object.assign({ video: video, caption: caption }, options), { quoted: m });
    }
    sendDocument(jid, document, filename, mimeType, caption, options) {
        return this.sendMessage(jid, Object.assign({ document: document, mimetype: mimeType, fileName: filename, caption: caption }, options));
    }
    sendDocumentReply(m, document, filename, mimeType, caption, options) {
        const jid = m.key.remoteJid;
        if (!jid) {
            throw new Error('Remote JID is undefined or null');
        }
        return this.sendMessage(jid, Object.assign({ document: document, mimetype: mimeType, fileName: filename, caption: caption }, options), { quoted: m });
    }
    sendSticker(jid, sticker, options) {
        return this.sendMessage(jid, Object.assign({ sticker: sticker }, options));
    }
    sendStickerReply(m, sticker, options) {
        const jid = m.key.remoteJid;
        if (!jid) {
            throw new Error('Remote JID is undefined or null');
        }
        return this.sendMessage(jid, Object.assign({ sticker: sticker }, options), { quoted: m });
    }
    sendGIF(jid, gif, caption, options) {
        return this.sendMessage(jid, Object.assign({ video: gif, caption: caption, gifPlayback: true }, options));
    }
    sendGIFReply(m, gif, caption, options) {
        const jid = m.key.remoteJid;
        if (!jid) {
            throw new Error('Remote JID is undefined or null');
        }
        return this.sendMessage(jid, Object.assign({ video: gif, caption: caption, gifPlayback: true }, options), { quoted: m });
    }
    sendAudio(jid, audio, options) {
        return this.sendMessage(jid, Object.assign({ audio: audio, mimetype: 'audio/mp4' }, options));
    }
    sendAudioReply(m, audio, options) {
        const jid = m.key.remoteJid;
        if (!jid) {
            throw new Error('Remote JID is undefined or null');
        }
        return this.sendMessage(jid, Object.assign({ audio: audio, mimetype: 'audio/mp4' }, options), { quoted: m });
    }
    sendContact(jid, contact, options) {
        return this.sendMessage(jid, Object.assign({ contacts: {
                displayName: contact.name,
                contacts: [{ vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:${contact.name}\nTEL;type=CELL;type=VOICE;waid=${contact.number}:${contact.number}\nEND:VCARD` }]
            } }, options));
    }
    sendContactReply(m, contact, options) {
        const jid = m.key.remoteJid;
        if (!jid) {
            throw new Error('Remote JID is undefined or null');
        }
        return this.sendMessage(jid, Object.assign({ contacts: {
                displayName: contact.name,
                contacts: [{ vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:${contact.name}\nTEL;type=CELL;type=VOICE;waid=${contact.number}:${contact.number}\nEND:VCARD` }]
            } }, options), { quoted: m });
    }
    sendPoll(jid, name, values, selectableCount) {
        return this.sendMessage(jid, {
            poll: {
                name,
                values,
                selectableCount
            }
        });
    }
    sendPollReply(m, name, values, selectableCount) {
        const jid = m.key.remoteJid;
        if (!jid) {
            throw new Error('Remote JID is undefined or null');
        }
        return this.sendMessage(jid, {
            poll: {
                name,
                values,
                selectableCount
            }
        }, { quoted: m });
    }
    editMessage(jid, m, newContent) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const key = {
                remoteJid: jid,
                fromMe: true,
                id: m.key.id,
            };
            let editedMessage = {};
            if (typeof newContent === 'string') {
                editedMessage = { conversation: newContent };
            }
            else if (newContent.text) {
                editedMessage = { extendedTextMessage: { text: newContent.text } };
            }
            else if (newContent.caption) {
                if ((_a = m.message) === null || _a === void 0 ? void 0 : _a.imageMessage) {
                    editedMessage = { imageMessage: Object.assign(Object.assign({}, m.message.imageMessage), { caption: newContent.caption }) };
                }
                else if ((_b = m.message) === null || _b === void 0 ? void 0 : _b.videoMessage) {
                    editedMessage = { videoMessage: Object.assign(Object.assign({}, m.message.videoMessage), { caption: newContent.caption }) };
                }
                else {
                    throw new Error('Unsupported message type for caption editing');
                }
            }
            else {
                throw new Error('Invalid new content for editing');
            }
            const editMessage = {
                protocolMessage: {
                    key,
                    type: baileys_1.WAProto.Message.ProtocolMessage.Type.MESSAGE_EDIT,
                    editedMessage,
                }
            };
            return this.relayMessage(jid, editMessage, {});
        });
    }
    deleteMessage(jid, m) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.sendMessage(jid, { delete: m.key });
        });
    }
    sendLocation(jid, latitude, longitude, options) {
        return this.sendMessage(jid, Object.assign({ location: {
                degreesLatitude: latitude,
                degreesLongitude: longitude
            } }, options));
    }
    sendLocationReply(m, latitude, longitude, options) {
        const jid = m.key.remoteJid;
        if (!jid) {
            throw new Error('Remote JID is undefined or null');
        }
        return this.sendMessage(jid, Object.assign({ location: {
                degreesLatitude: latitude,
                degreesLongitude: longitude
            } }, options), { quoted: m });
    }
    sendLiveLocation(jid, latitude, longitude, durationMs, options) {
        return this.sendMessage(jid, Object.assign({ location: {
                degreesLatitude: latitude,
                degreesLongitude: longitude,
                accuracyInMeters: 50,
                speedInMps: 0,
                degreesClockwiseFromMagneticNorth: 0,
                name: "Live Location", // Updated comment to name
                isLive: true,
                jpegThumbnail: null,
                comment: (options === null || options === void 0 ? void 0 : options.comment) || null, // Added comment
            } }, options));
    }
    sendButton(jid, contentText, buttons, options) {
        return this.sendMessage(jid, Object.assign({ buttons: buttons.map(button => ({
                buttonId: button.buttonId || ' ', // Ensure a non-null buttonId
                buttonText: button.buttonText || { displayText: 'Button Text' }, // Provide default text if needed
                type: button.type || 1, // Ensure a valid button type
            })), text: contentText }, options));
    }
    sendListMessage(jid, message, options) {
        return this.sendMessage(jid, Object.assign({ listReply: Object.assign(Object.assign({}, message), { listType: 1 }) }, options));
    }
    sendTemplateMessage(jid, content, options) {
        const message = {
            text: content.text || '', // Use caption if provided, or empty string
            footer: content.footer,
            templateButtons: content.templateButtons
        };
        return this.sendMessage(jid, message, options);
    }
}
exports.ConnMessage = ConnMessage;
//# sourceMappingURL=connMessage.js.map