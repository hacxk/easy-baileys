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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const baileys_1 = require("@whiskeysockets/baileys");
const pino_1 = __importDefault(require("pino"));
const node_cache_1 = __importDefault(require("node-cache"));
const mongodb_1 = require("mongodb");
const mysql_baileys_1 = require("mysql-baileys");
const mongo_baileys_1 = require("mongo-baileys");
const connMessage_1 = require("../message/connMessage");
const logger = (0, pino_1.default)({ level: process.env.LOG_LEVEL || 'info' });
const store = (0, baileys_1.makeInMemoryStore)({ logger });
class WhatsAppClient {
    constructor(customOptions = {}) {
        this.logger = logger;
        this.msgRetryCounterCache = new node_cache_1.default();
        this.pairingCode = '';
        this.state = null;
        this.saveCreds = null;
        this.handleConnectionUpdate = (update) => {
            var _a, _b;
            const { connection, lastDisconnect } = update;
            if (connection === 'close') {
                const shouldReconnect = ((_b = (_a = lastDisconnect === null || lastDisconnect === void 0 ? void 0 : lastDisconnect.error) === null || _a === void 0 ? void 0 : _a.output) === null || _b === void 0 ? void 0 : _b.statusCode) !== baileys_1.DisconnectReason.loggedOut;
                logger.info('connection closed due to', lastDisconnect === null || lastDisconnect === void 0 ? void 0 : lastDisconnect.error, ', reconnecting', shouldReconnect);
                if (!shouldReconnect) {
                    // this.initSocket();
                    logger.info('Connection closed. You are logged out.');
                }
            }
            else if (connection === 'open') {
                logger.info('opened connection');
            }
        };
        this.customOptions = customOptions;
        this.msgOption = new connMessage_1.ConnMessage(); // Initialize ConnMessage
    }
    connectToMongoDB(pathAuthFile, collectionName) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = new mongodb_1.MongoClient(pathAuthFile);
            yield client.connect();
            const db = client.db("whatsappmultidevice");
            const collection = db.collection(collectionName);
            return { client, collection };
        });
    }
    initMongoAuth(pathAuthFile, collectionName) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!collectionName) {
                throw new Error('Please provide a Collection name to Save/Retrieve Session!');
            }
            const { collection } = yield this.connectToMongoDB(pathAuthFile, collectionName);
            const { state, saveCreds } = yield (0, mongo_baileys_1.useMongoDBAuthState)(collection);
            this.state = state;
            this.saveCreds = saveCreds;
            yield this.initSocket();
        });
    }
    initMultiFileAuth(pathAuthFile) {
        return __awaiter(this, void 0, void 0, function* () {
            const { state, saveCreds } = yield (0, baileys_1.useMultiFileAuthState)(pathAuthFile);
            this.state = state;
            this.saveCreds = saveCreds;
            yield this.initSocket();
        });
    }
    initMySQLAuth(mysqlConfig) {
        return __awaiter(this, void 0, void 0, function* () {
            const { state, saveCreds } = yield (0, mysql_baileys_1.useMySQLAuthState)(mysqlConfig);
            this.state = state;
            this.saveCreds = saveCreds;
            yield this.initSocket();
        });
    }
    initSocket() {
        return __awaiter(this, void 0, void 0, function* () {
            const signalKeyStore = (0, baileys_1.makeCacheableSignalKeyStore)(this.state.keys, logger);
            const getMessage = (key) => __awaiter(this, void 0, void 0, function* () {
                if (store) {
                    const msg = yield store.loadMessage(key.remoteJid, key.id);
                    return (msg === null || msg === void 0 ? void 0 : msg.message) || undefined;
                }
                return baileys_1.proto.Message.fromObject({});
            });
            try {
                const baseSock = yield (0, baileys_1.makeWASocket)(Object.assign({ logger, printQRInTerminal: this.customOptions.printQRInTerminal || true, auth: {
                        creds: this.state.creds,
                        keys: signalKeyStore,
                    }, msgRetryCounterCache: this.msgRetryCounterCache, generateHighQualityLinkPreview: true, getMessage }, this.customOptions));
                // Extend the base socket with ConnMessage methods
                this.sock = baseSock;
                // Binding ConnMessage methods to this.sock
                const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(this.msgOption))
                    .filter(method => typeof this.msgOption[method] === 'function' && method !== 'constructor');
                methods.forEach(method => {
                    this.sock[method] = this.msgOption[method].bind(this.sock);
                });
                const eventEmitter = this.sock.ev;
                store === null || store === void 0 ? void 0 : store.bind(eventEmitter);
                this.sock.ev.on('creds.update', this.saveCreds);
                this.sock.ev.on('connection.update', this.handleConnectionUpdate);
                const failedMessages = new Map();
                const MAX_RETRIES = 3;
                this.sock.ev.on("messages.upsert", (_a) => __awaiter(this, [_a], void 0, function* ({ messages }) {
                    for (const msg of messages) {
                        if (msg.key.fromMe && msg.status === 0) {
                            const retryNode = this.createRetryNode(msg, failedMessages, MAX_RETRIES);
                            if (retryNode) {
                                try {
                                    if (msg.key.remoteJid) {
                                        yield this.sock.relayMessage(msg.key.remoteJid, retryNode, { messageId: retryNode.key.id });
                                    }
                                }
                                catch (error) {
                                    console.error(`Error retrying message ${msg.key.id}:`, error);
                                }
                            }
                        }
                    }
                }));
            }
            catch (error) {
                logger.error('Error initializing socket:', error);
                throw error;
            }
        });
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
    getSocket() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.sock) {
                throw new Error('Socket is not initialized yet');
            }
            return this.sock;
        });
    }
    getPairingCode(jid) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.sock.authState.creds.registered) {
                throw new Error('Device is already registered. Pairing code not needed.');
            }
            if (this.customOptions.printQRInTerminal) {
                throw new Error('Please disable printQRInTerminal before requesting pairing code');
            }
            try {
                const phoneUtil = require('libphonenumber-js');
                const parsedNumber = phoneUtil.parsePhoneNumber('+' + jid);
                if (!parsedNumber.isValid()) {
                    throw new Error('Invalid phone number');
                }
                this.pairingCode = yield this.sock.requestPairingCode(jid);
                return this.pairingCode;
            }
            catch (error) {
                logger.error("Error getting pairing code:", error);
                throw error;
            }
        });
    }
    static create(authType_1, config_1) {
        return __awaiter(this, arguments, void 0, function* (authType, config, customOptions = {}) {
            const client = new WhatsAppClient(customOptions);
            switch (authType) {
                case 'mongo':
                    if (typeof config !== 'string')
                        throw new Error('MongoDB connection string required');
                    yield client.initMongoAuth(config, 'sessions');
                    break;
                case 'multi':
                    if (typeof config !== 'string')
                        throw new Error('Path to auth file required');
                    yield client.initMultiFileAuth(config);
                    break;
                case 'mysql':
                    if (typeof config === 'string')
                        throw new Error('MySQL config object required');
                    yield client.initMySQLAuth(config);
                    break;
                default:
                    throw new Error('Invalid auth type');
            }
            return client;
        });
    }
}
exports.default = WhatsAppClient;
//# sourceMappingURL=sock.js.map