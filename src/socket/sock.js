const { default: makeWASocket, useMultiFileAuthState, makeCacheableSignalKeyStore, DisconnectReason } = require("@whiskeysockets/baileys");
const pino = require('pino');
const NodeCache = require('node-cache');

class WhatsAppClient {
    constructor(customOptions = {}) {
        this.logger = pino();
        this.msgRetryCounterCache = new NodeCache();
        this.customOptions = customOptions;
        this.pairingCode = '';
    }

    async init(pathAuthFile) {
        if (!pathAuthFile) {
            throw new Error('Authentication path is required.');
        }

        const { state, saveCreds } = await useMultiFileAuthState(pathAuthFile);
        this.state = state;

        try {
            this.sock = await makeWASocket({
                browser: this.customOptions.browser || ["Ubuntu", "Chrome", "20.0.04"],
                keepAliveIntervalMs: this.customOptions.keepAliveIntervalMs || 10000,
                downloadHistory: this.customOptions.downloadHistory || false,
                msgRetryCounterCache: this.msgRetryCounterCache,
                syncFullHistory: this.customOptions.syncFullHistory || true,
                shouldSyncHistoryMessage: msg => {
                    //   console.log(chalk.cyanBright(`Syncing chats..[${msg.progress}%]`));
                    return !!msg.syncType;
                },
                markOnlineOnConnect: this.customOptions.markOnlineOnConnect || true,
                defaultQueryTimeoutMs: undefined,
                logger: this.logger,
                auth: {
                    creds: state.creds,
                    keys: makeCacheableSignalKeyStore(state.keys, this.logger),
                },
                linkPreviewImageThumbnailWidth: 1980,
                generateHighQualityLinkPreview: true,
                ...this.customOptions
            });

            this.sock.ev.on('creds.update', saveCreds);
            this.sock.ev.on('connection.update', (update) => {
                const { connection, lastDisconnect } = update;
                if (connection === 'close') {
                    const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
                    console.log('connection closed due to', lastDisconnect?.error, ', reconnecting', shouldReconnect);
                    // reconnect if not logged out
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

    async getPairingCode(jid) {
        if (this.sock.authState.creds.registered) {
            throw new Error('Device is already registered. Pairing code not needed.');
        }

        if (!this.customOptions.printQRInTerminal) {
            return new Promise((resolve, reject) => {
                setTimeout(async () => {
                    try {
                        // Convert jid to string if necessary
                        const jidString = String(jid);

                        // Sanitize phone number (jidString) using libphonenumber-js
                        const phoneUtil = require('libphonenumber-js');
                        const parsedNumber = phoneUtil.parsePhoneNumber('+' + jidString);

                        if (parsedNumber.isValid()) {
                            // Format in E.164 format (e.g., +1234567890)
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
}

module.exports = WhatsAppClient;
