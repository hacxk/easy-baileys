const { default: makeWASocket, useMultiFileAuthState, makeCacheableSignalKeyStore, delay, DisconnectReason, makeInMemoryStore, proto } = require("@whiskeysockets/baileys");
const pino = require('pino');
const NodeCache = require('node-cache');
const connMessage = require("../message/connMessage");

const logger = pino({ level: process.env.LOG_LEVEL || 'silent' });

const store = makeInMemoryStore({ logger });

const msgOption = new connMessage();

class WhatsAppClient {
    constructor(customOptions = {}) {
        this.logger = pino();
        this.msgRetryCounterCache = new NodeCache();
        this.customOptions = customOptions;
        this.pairingCode = '';
    }

    async init(pathAuthFile) {
        if (!pathAuthFile) throw new Error('Authentication path is required.');

        const { state, saveCreds } = await useMultiFileAuthState(pathAuthFile);
        this.state = state;

        const getMessage = async (key) => {
            if (store) {
                const msg = await store.loadMessage(key.remoteJid, key.id);
                return msg && msg.message ? msg.message : undefined;
            }
            return proto.Message.fromObject({});
        };

        try {
            this.sock = await makeWASocket({
                browser: this.customOptions.browser || ["Ubuntu", "Chrome", "20.0.04"],
                keepAliveIntervalMs: this.customOptions.keepAliveIntervalMs || 10000,
                downloadHistory: this.customOptions.downloadHistory || false,
                msgRetryCounterCache: this.msgRetryCounterCache,
                syncFullHistory: this.customOptions.syncFullHistory || true,
                shouldSyncHistoryMessage: msg => !!msg.syncType,
                markOnlineOnConnect: this.customOptions.markOnlineOnConnect || true,
                defaultQueryTimeoutMs: undefined,
                logger,
                auth: {
                    creds: state.creds,
                    keys: makeCacheableSignalKeyStore(state.keys, this.logger),
                },
                linkPreviewImageThumbnailWidth: 1980,
                generateHighQualityLinkPreview: true,
                getMessage,
                msgOption: msgOption,
                ...this.customOptions
            });

            store?.bind(this.sock.ev);

            this.sock.ev.on('creds.update', saveCreds);
            this.sock.ev.on('connection.update', (update) => {
                const { connection, lastDisconnect } = update;
                if (connection === 'close') {
                    const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
                    console.log('connection closed due to', lastDisconnect?.error, ', reconnecting', shouldReconnect);
                    if (shouldReconnect) {
                        this.init(pathAuthFile);
                    }
                } else if (connection === 'open') {
                    console.log('opened connection');
                }
            });
        } catch (error) {
            this.logger.error('Error:', error);
            throw error;
        }

        return this.sock;
    }

    getSocket() {
        return this.sock;
    }

    getSocketMsg() {
        return this.sock.ws.config.msgOption;
    }

    async getPairingCode(jid) {
        if (this.sock.authState.creds.registered) throw new Error('Device is already registered. Pairing code not needed.');
        if (!this.customOptions.printQRInTerminal) {
            return new Promise((resolve, reject) => {
                setTimeout(async () => {
                    try {
                        const jidString = String(jid);
                        const phoneUtil = require('libphonenumber-js');
                        const parsedNumber = phoneUtil.parsePhoneNumber('+' + jidString);

                        if (parsedNumber.isValid()) {
                            const code = await this.sock.requestPairingCode(jidString);
                            this.pairingCode = `${code}`;
                            resolve(this.pairingCode);
                        } else {
                            this.pairingCode = `Invalid phone number`;
                            reject(new Error('Invalid phone number'));
                        }
                    } catch (error) {
                        console.error("Error parsing phone number:", error);
                        this.pairingCode = `Error: ${error.message}`;
                        reject(error);
                    }
                }, 5000);
            });
        } else {
            throw new Error('Please disable printQRInTerminal before requesting pairing code');
        }
    }

    static async create(pathAuthFile, customOptions = {}) {
        const client = new WhatsAppClient(customOptions);
        await client.init(pathAuthFile);
        return client;
    }

    async deleteMsgGroup(m) {
        try {
            const { remoteJid } = m.key;
            const groupMetadata = await this.sock.groupMetadata(remoteJid);
            const botId = this.sock.user.id.replace(/:.*$/, "") + "@s.whatsapp.net";
            const botIsAdmin = groupMetadata.participants.some(p => p.id.includes(botId) && p.admin);

            if (!botIsAdmin) throw new Error("I cannot delete messages because I am not an admin in this group.");

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

            await this.sock.sendPresenceUpdate('composing', remoteJid);
            await delay(200);
            const response = await this.sock.sendMessage(remoteJid, { delete: messageToDelete.key });
            await delay(750);
            await this.sock.sendMessage(remoteJid, { delete: m.key });
            return response;
        } catch (err) {
            throw new Error(`Error in deleteMsgGroup: ${err.message}`);
        }
    }

    async editMsg(m, sentMessage, newMessage) {
        try {
            await this.sock.sendPresenceUpdate('composing', m.key.remoteJid);
            await delay(200);
            return await this.sock.sendMessage(m.key.remoteJid, { edit: sentMessage.key, text: newMessage, type: "MESSAGE_EDIT" });
        } catch (err) {
            throw new Error(`Error in editMsg: ${err.message}`);
        }
    }
}

module.exports = WhatsAppClient;

