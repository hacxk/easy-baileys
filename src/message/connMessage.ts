import { WASocket, proto, AnyMessageContent, MiscMessageGenerationOptions, WAMediaUpload, WAProto } from '@whiskeysockets/baileys';

type Templatable = {
    /** add buttons to the message (conflicts with normal buttons) */
    text: string,
    templateButtons?: proto.IHydratedTemplateButton[];
    footer?:
    string;
};

export class ConnMessage {
    [key: string]: any;  // Index signature to allow dynamic properties

    sendTextMessage(this: WASocket & ConnMessage, jid: string, text: string): Promise<proto.WebMessageInfo | undefined> {
        return this.sendMessage(jid, { text });
    }

    reply(this: WASocket & ConnMessage, m: proto.IWebMessageInfo, text: string) {
        const jid = m.key.remoteJid;
        if (!jid) {
            throw new Error('Remote JID is undefined or null');
        }
        return this.sendMessage(jid, { text: text }, { quoted: m });
    }

    react(this: WASocket & ConnMessage, m: proto.IWebMessageInfo, emoji: string) {
        const jid = m.key.remoteJid;
        if (!jid) {
            throw new Error('Remote JID is undefined or null');
        }
        return this.sendMessage(jid, { react: { text: emoji, key: m.key } });
    }

    send(this: WASocket & ConnMessage, jid: string, content: AnyMessageContent, options?: MiscMessageGenerationOptions) {
        return this.sendMessage(jid, content, options);
    }

    sendImage(this: WASocket & ConnMessage, jid: string, image: WAMediaUpload, caption?: string, options?: MiscMessageGenerationOptions) {
        return this.sendMessage(jid, {
            image: image,
            caption: caption,
            ...options
        });
    }

    sendImageReply(this: WASocket & ConnMessage, m: proto.IWebMessageInfo, image: WAMediaUpload, caption?: string, options?: MiscMessageGenerationOptions) {
        const jid = m.key.remoteJid;
        if (!jid) {
            throw new Error('Remote JID is undefined or null');
        }
        return this.sendMessage(jid, {
            image: image,
            caption: caption,
            ...options
        }, { quoted: m });
    }

    sendVideo(this: WASocket & ConnMessage, jid: string, video: WAMediaUpload, caption?: string, options?: MiscMessageGenerationOptions) {
        return this.sendMessage(jid, {
            video: video,
            caption: caption,
            ...options
        });
    }

    sendVideoReply(this: WASocket & ConnMessage, m: proto.IWebMessageInfo, video: WAMediaUpload, caption?: string, options?: MiscMessageGenerationOptions) {
        const jid = m.key.remoteJid;
        if (!jid) {
            throw new Error('Remote JID is undefined or null');
        }
        return this.sendMessage(jid, {
            video: video,
            caption: caption,
            ...options
        }, { quoted: m });
    }

    sendDocument(this: WASocket & ConnMessage, jid: string, document: WAMediaUpload, filename: string, mimeType: string, caption?: string, options?: MiscMessageGenerationOptions) {
        return this.sendMessage(jid, {
            document: document,
            mimetype: mimeType,
            fileName: filename,
            caption: caption,
            ...options
        });
    }

    sendDocumentReply(this: WASocket & ConnMessage, m: proto.IWebMessageInfo, document: WAMediaUpload, filename: string, mimeType: string, caption?: string, options?: MiscMessageGenerationOptions) {
        const jid = m.key.remoteJid;
        if (!jid) {
            throw new Error('Remote JID is undefined or null');
        }
        return this.sendMessage(jid, {
            document: document,
            mimetype: mimeType,
            fileName: filename,
            caption: caption,
            ...options
        }, { quoted: m });
    }

    sendSticker(this: WASocket & ConnMessage, jid: string, sticker: WAMediaUpload, options?: MiscMessageGenerationOptions) {
        return this.sendMessage(jid, { sticker: sticker, ...options });
    }

    sendStickerReply(this: WASocket & ConnMessage, m: proto.IWebMessageInfo, sticker: WAMediaUpload, options?: MiscMessageGenerationOptions) {
        const jid = m.key.remoteJid;
        if (!jid) {
            throw new Error('Remote JID is undefined or null');
        }
        return this.sendMessage(jid, { sticker: sticker, ...options }, { quoted: m });
    }

    sendGIF(this: WASocket & ConnMessage, jid: string, gif: WAMediaUpload, caption?: string, options?: MiscMessageGenerationOptions) {
        return this.sendMessage(jid, {
            video: gif,
            caption: caption,
            gifPlayback: true,
            ...options
        });
    }

    sendGIFReply(this: WASocket & ConnMessage, m: proto.IWebMessageInfo, gif: WAMediaUpload, caption?: string, options?: MiscMessageGenerationOptions) {
        const jid = m.key.remoteJid;
        if (!jid) {
            throw new Error('Remote JID is undefined or null');
        }
        return this.sendMessage(jid, {
            video: gif,
            caption: caption,
            gifPlayback: true,
            ...options
        }, { quoted: m });
    }

    sendAudio(this: WASocket & ConnMessage, jid: string, audio: WAMediaUpload, options?: MiscMessageGenerationOptions) {
        return this.sendMessage(jid, { audio: audio, mimetype: 'audio/mp4', ...options });
    }

    sendAudioReply(this: WASocket & ConnMessage, m: proto.IWebMessageInfo, audio: WAMediaUpload, options?: MiscMessageGenerationOptions) {
        const jid = m.key.remoteJid;
        if (!jid) {
            throw new Error('Remote JID is undefined or null');
        }
        return this.sendMessage(jid, { audio: audio, mimetype: 'audio/mp4', ...options }, { quoted: m });
    }

    sendContact(this: WASocket & ConnMessage, jid: string, contact: { name: string, number: string }, options?: MiscMessageGenerationOptions) {
        return this.sendMessage(jid, {
            contacts: {
                displayName: contact.name,
                contacts: [{ vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:${contact.name}\nTEL;type=CELL;type=VOICE;waid=${contact.number}:${contact.number}\nEND:VCARD` }]
            },
            ...options
        });
    }

    sendContactReply(this: WASocket & ConnMessage, m: proto.IWebMessageInfo, contact: { name: string, number: string }, options?: MiscMessageGenerationOptions) {
        const jid = m.key.remoteJid;
        if (!jid) {
            throw new Error('Remote JID is undefined or null');
        }
        return this.sendMessage(jid, {
            contacts: {
                displayName: contact.name,
                contacts: [{ vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:${contact.name}\nTEL;type=CELL;type=VOICE;waid=${contact.number}:${contact.number}\nEND:VCARD` }]
            },
            ...options
        }, { quoted: m });
    }

    sendPoll(this: WASocket & ConnMessage, jid: string, name: string, values: string[], selectableCount?: number) {
        return this.sendMessage(jid, {
            poll: {
                name,
                values,
                selectableCount
            }
        });
    }

    sendPollReply(this: WASocket & ConnMessage, m: proto.IWebMessageInfo, name: string, values: string[], selectableCount?: number) {
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

    async editMessage(this: WASocket & ConnMessage, jid: string, m: proto.IWebMessageInfo, newContent: string | { text?: string, caption?: string }) {
        const key = {
            remoteJid: jid,
            fromMe: true,
            id: m.key.id,
        };

        let editedMessage: WAProto.IMessage = {};

        if (typeof newContent === 'string') {
            editedMessage = { conversation: newContent };
        } else if (newContent.text) {
            editedMessage = { extendedTextMessage: { text: newContent.text } };
        } else if (newContent.caption) {
            if (m.message?.imageMessage) {
                editedMessage = { imageMessage: { ...m.message.imageMessage, caption: newContent.caption } };
            } else if (m.message?.videoMessage) {
                editedMessage = { videoMessage: { ...m.message.videoMessage, caption: newContent.caption } };
            } else {
                throw new Error('Unsupported message type for caption editing');
            }
        } else {
            throw new Error('Invalid new content for editing');
        }

        const editMessage: WAProto.IMessage = {
            protocolMessage: {
                key,
                type: WAProto.Message.ProtocolMessage.Type.MESSAGE_EDIT,
                editedMessage,
            }
        };

        return this.relayMessage(jid, editMessage, {});
    }

    async deleteMessage(this: WASocket & ConnMessage, jid: string, m: proto.IWebMessageInfo) {
        return this.sendMessage(jid, { delete: m.key });
    }

    sendLocation(this: WASocket & ConnMessage, jid: string, latitude: number, longitude: number, options?: MiscMessageGenerationOptions) {
        return this.sendMessage(jid, {
            location: {
                degreesLatitude: latitude,
                degreesLongitude: longitude
            },
            ...options
        });
    }

    sendLocationReply(this: WASocket & ConnMessage, m: proto.IWebMessageInfo, latitude: number, longitude: number, options?: MiscMessageGenerationOptions) {
        const jid = m.key.remoteJid;
        if (!jid) {
            throw new Error('Remote JID is undefined or null');
        }
        return this.sendMessage(jid, {
            location: {
                degreesLatitude: latitude,
                degreesLongitude: longitude
            },
            ...options
        }, { quoted: m });
    }

    sendLiveLocation(this: WASocket & ConnMessage, jid: string, latitude: number, longitude: number, durationMs: number, options?: MiscMessageGenerationOptions & { comment?: string }) {  // Updated function signature
        return this.sendMessage(jid, {
            location: {
                degreesLatitude: latitude,
                degreesLongitude: longitude,
                accuracyInMeters: 50,
                speedInMps: 0,
                degreesClockwiseFromMagneticNorth: 0,
                name: "Live Location", // Updated comment to name
                isLive: true,
                jpegThumbnail: null,
                comment: options?.comment || null,  // Added comment
            },
            ...options
        });
    }

    sendButton(this: WASocket & ConnMessage, jid: string, contentText: string, buttons: proto.Message.ButtonsMessage.IButton[], options?: MiscMessageGenerationOptions) {
        return this.sendMessage(jid, {
            buttons: buttons.map(button => ({
                buttonId: button.buttonId || ' ', // Ensure a non-null buttonId
                buttonText: button.buttonText || { displayText: 'Button Text' }, // Provide default text if needed
                type: button.type || 1, // Ensure a valid button type
            })), // Map button data to the correct format
            text: contentText, // The main text content of the message
            ...options, // Include any additional options
        });
    }

    sendListMessage(this: WASocket & ConnMessage, jid: string, message: proto.Message.ListMessage, options?: MiscMessageGenerationOptions) {
        return this.sendMessage(jid, {
            listReply: { // Changed to 'list' from 'listReply'
                ...message, // Spread the message object for all properties
                listType: 1, // Hardcoded listType for now (you might want to make this configurable)
            },
            ...options,
        });
    }

    sendTemplateMessage(this: WASocket & ConnMessage, jid: string, content: Templatable, options?: MiscMessageGenerationOptions) {
        const message: AnyMessageContent & Templatable = {
            text: content.text || '',  // Use caption if provided, or empty string
            footer: content.footer,
            templateButtons: content.templateButtons
        };

        return this.sendMessage(jid, message, options);
    }
}