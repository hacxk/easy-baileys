const { default: makeWASocket, useMultiFileAuthState, makeCacheableSignalKeyStore, delay, DisconnectReason, makeInMemoryStore, proto } = require("@whiskeysockets/baileys");
const pino = require('pino');
const NodeCache = require('node-cache');
const { useMySQLAuthState } = require('mysql-baileys'); // Import for MySQL authentication
const { useMongoDBAuthState } = require('mongo-baileys');
const connMessage = require("../message/connMessage");
const { MongoClient } = require('mongodb')
const logger = pino({ level: process.env.LOG_LEVEL || 'debug' });
const store = makeInMemoryStore({ logger });

/**
 * WhatsAppClient class for handling WhatsApp Web client.
 */
class WhatsAppClient {
    /**
     * Creates an instance of WhatsAppClient.
     * @param {object} [customOptions={}] - Custom options for the client.
     */
    constructor(
        customOptions = {},
    ) {
        this.logger = pino();
        this.msgRetryCounterCache = new NodeCache();
        this.customOptions = customOptions;
        this.pairingCode = '';
        this.state = null;
        this.saveCreds = null;
    }

    /**
     * Initializes MongoDB authentication.
     * @param {string} pathAuthFile - Path to the MongoDB authentication file.
     */
    async initMongoAuth(pathAuthFile, collectionName) {
        if (!collectionName) {
            throw new Error('Please provide a Collection name to Save/Retrive Session!')
        }
        const dbName = "whatsappmultidevice";
        const client = new MongoClient(pathAuthFile);
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        const { state, saveCreds } = await useMongoDBAuthState(collection);
        this.state = state;
        this.saveCreds = saveCreds;
        await this.initSocket(state.creds, makeCacheableSignalKeyStore(state.keys, this.logger));
    }

    /**
     * Initializes multi-file authentication.
     * @param {string} pathAuthFile - Path to the multi-file authentication file.
     */
    async initMultiFileAuth(pathAuthFile) {
        const { state, saveCreds } = await useMultiFileAuthState(pathAuthFile);
        this.state = state;
        this.saveCreds = saveCreds;

        await this.initSocket(state.creds, makeCacheableSignalKeyStore(state.keys, this.logger));
    }

    /**
     * Initializes MySQL authentication.
     * @param {object} mysqlConfig - MySQL configuration object.
     */
    async initMySQLAuth(mysqlConfig) {
        const { state, saveCreds } = await useMySQLAuthState(mysqlConfig);
        this.state = state;
        this.saveCreds = saveCreds;

        await this.initSocket(state.creds, makeCacheableSignalKeyStore(state.keys, this.logger));
    }

    /**
     * Initializes the WhatsApp socket.
     * @param {object} creds - Credentials for authentication.
     * @param {object} keys - Keys for authentication.
     */
    async initSocket(creds, keys) {
        const getMessage = async (key) => {
            if (store) {
                const msg = await store.loadMessage(key.remoteJid, key.id);
                return msg?.message || undefined;
            }

            // only if store is present
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
                ...this.customOptions
            });

            this.msgOption = new connMessage();

            for (const funcName of Object.getOwnPropertyNames(connMessage.prototype)) {
                if (funcName !== 'constructor') {
                    this.sock[funcName] = connMessage.prototype[funcName].bind(this.sock);
                }
            }


            store?.bind(this.sock.ev);

            this.sock.ev.on('creds.update', this.saveCreds);
            this.sock.ev.on('connection.update', (update) => {
                const { connection, lastDisconnect } = update;
                if (connection === 'close') {
                    const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
                    console.log('connection closed due to', lastDisconnect?.error, ', reconnecting', shouldReconnect);
                    if (!shouldReconnect) {
                        // this.initSocket(creds, keys);
                        console.log('Connection closed. You are logged out.')
                    }
                } else if (connection === 'open') {
                    console.log('opened connection');
                }
            });

            const failedMessages = new Map();
            const MAX_RETRIES = 3;

            this.sock.ev.on("messages.upsert", async ({ messages }) => {
                for (const msg of messages) {
                    if (msg.key.fromMe && msg.status === 0) {
                        const retryNode = this.createRetryNode(msg, failedMessages, MAX_RETRIES);
                        if (retryNode) {
                            try {
                                await this.sock.relayMessage(msg.key.remoteJid, retryNode, { messageId: msg.key.id });
                            } catch (error) {
                                console.error(`Error retrying message ${msg.key.id}:`, error);
                            }
                        }
                    }
                }
            });
        } catch (error) {
            this.logger.error('Error:', error);
            throw error;
        }
    }

    createRetryNode(msg, failedMessages, MAX_RETRIES) {
        const messageId = msg.key.id;
        let retryCount = failedMessages.get(messageId) || 0;
        if (retryCount >= MAX_RETRIES) {
            failedMessages.delete(messageId);
            return null;
        }
        retryCount++;
        failedMessages.set(messageId, retryCount);

        return {
            key: {
                id: messageId,
                remoteJid: msg.key.remoteJid,
                participant: msg.key.participant,
            },
            message: msg.message,
            messageTimestamp: msg.messageTimestamp,
            status: msg.status,
        };
    }


    /**
     * Gets the socket instance.
     * @returns {Promise<object>} - The socket instance.
     */
    async getSocket() {
        return this.sock;
    }

    /**
     * Gets the pairing code.
     * @param {string} jid - The JID of the device.
     * @returns {Promise<string>} - The pairing code.
     */
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

    /**
     * Creates a WhatsAppClient instance with MongoDB authentication.
     * @param {string} pathAuthFile - Path to the MongoDB authentication file.
     * @param {object} [customOptions={}] - Custom options for the client.
     * @returns {Promise<WhatsAppClient>} - A new WhatsAppClient instance.
     */
    static async createMongoAuth(pathAuthFile, collection, customOptions = {}) {
        const client = new WhatsAppClient(customOptions);
        await client.initMongoAuth(pathAuthFile, collection);
        return client;
    }

    /**
     * Creates a WhatsAppClient instance with multi-file authentication.
     * @param {string} pathAuthFile - Path to the multi-file authentication file.
     * @param {object} [customOptions={}] - Custom options for the client.
     * @returns {Promise<WhatsAppClient>} - A new WhatsAppClient instance.
     */
    static async createMultiAuth(pathAuthFile, customOptions = {}) {
        const client = new WhatsAppClient(customOptions);
        await client.initMultiFileAuth(pathAuthFile);
        return client;
    }

    /**
     * Creates a WhatsAppClient instance with MySQL authentication.
     * @param {object} mysqlConfig - MySQL configuration object.
     * @param {object} [customOptions={}] - Custom options for the client.
     * @returns {Promise<WhatsAppClient>} - A new WhatsAppClient instance.
     */
    static async createMySQLAuth(mysqlConfig, customOptions = {}) {
        const client = new WhatsAppClient(customOptions);
        await client.initMySQLAuth(mysqlConfig);
        return client;
    }
}

module.exports = WhatsAppClient;