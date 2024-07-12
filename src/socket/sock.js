const { default: makeWASocket, useMultiFileAuthState, makeCacheableSignalKeyStore, delay, DisconnectReason, makeInMemoryStore, proto } = require("@whiskeysockets/baileys");
const pino = require('pino');
const NodeCache = require('node-cache');
const { MongoClient } = require("mongodb");
const { useMySQLAuthState } = require('mysql-baileys'); // New import for MySQL authentication

const useMongoDBAuthState = require("../auth/MongoAuth");
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
        this.state;
        this.saveCreds;
    }

    async initMongoAuth(pathAuthFile) {
        const mongoClient = new MongoClient(pathAuthFile, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        await mongoClient.connect();

        const db = mongoClient.db("v42ef24t4ew");
        const collection = db.collection("v43vdv4wetds");

        const { state, saveCreds } = await useMongoDBAuthState(collection);
        this.state = state;
        this.saveCreds = saveCreds;

        await this.initSocket(state.creds, makeCacheableSignalKeyStore(state.keys, this.logger));
    }

    async initMultiFileAuth(pathAuthFile) {
        const { state, saveCreds } = await useMultiFileAuthState(pathAuthFile);
        this.state = state;
        this.saveCreds = saveCreds;

        await this.initSocket(state.creds, makeCacheableSignalKeyStore(state.keys, this.logger));
    }

    async initMySQLAuth(mysqlConfig) {
        const { state, saveCreds } = await useMySQLAuthState(mysqlConfig);
        this.state = state;
        this.saveCreds = saveCreds;

        await this.initSocket(state.creds, makeCacheableSignalKeyStore(state.keys, this.logger));
    }

    async initSocket(creds, keys) {
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
                    creds,
                    keys,
                },
                linkPreviewImageThumbnailWidth: 1980,
                generateHighQualityLinkPreview: true,
                getMessage,
                msgOption: msgOption,
                ...this.customOptions
            });

            store?.bind(this.sock.ev);

            this.sock.ev.on('creds.update', this.saveCreds);
            this.sock.ev.on('connection.update', (update) => {
                const { connection, lastDisconnect } = update;
                if (connection === 'close') {
                    const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
                    console.log('connection closed due to', lastDisconnect?.error, ', reconnecting', shouldReconnect);
                    if (shouldReconnect) {
                        // Reconnect logic
                    }
                } else if (connection === 'open') {
                    console.log('opened connection');
                }
            });
        } catch (error) {
            this.logger.error('Error:', error);
            throw error;
        }
    }

    async getSocket() {
        return this.sock;
    }

    async getSocketMsg() {
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
                            this.pairingCode = 'Invalid phone number';
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

    static async createMongoAuth(pathAuthFile, customOptions = {}) {
        const client = new WhatsAppClient(customOptions);
        await client.initMongoAuth(pathAuthFile);
        return client;
    }

    static async createMultiAuth(pathAuthFile, customOptions = {}) {
        const client = new WhatsAppClient(customOptions);
        await client.initMultiFileAuth(pathAuthFile);
        return client;
    }

    static async createMySQLAuth(mysqlConfig, customOptions = {}) {
        const client = new WhatsAppClient(customOptions);
        await client.initMySQLAuth(mysqlConfig);
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
