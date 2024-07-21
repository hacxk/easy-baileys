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
const MongoAuth_1 = __importDefault(require("../auth/MongoAuth"));
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
                if (shouldReconnect) {
                    this.initSocket();
                }
                else {
                    logger.info('Connection closed. You are logged out.');
                }
            }
            else if (connection === 'open') {
                logger.info('opened connection');
            }
        };
        this.customOptions = customOptions;
        this.msgOption = new connMessage_1.ConnMessage; // Initialize ConnMessage
    }
    initMongoAuth(pathAuthFile, collectionName) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!collectionName) {
                throw new Error('Please provide a Collection name to Save/Retrieve Session!');
            }
            const mongoClient = new mongodb_1.MongoClient(pathAuthFile);
            yield mongoClient.connect();
            const db = mongoClient.db("v42ef24t4ew");
            const collection = db.collection(collectionName);
            const { state, saveCreds } = yield (0, MongoAuth_1.default)(collection);
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
                this.sock = yield (0, baileys_1.makeWASocket)(Object.assign({ logger, printQRInTerminal: this.customOptions.printQRInTerminal, auth: {
                        creds: this.state.creds,
                        keys: signalKeyStore,
                    }, msgRetryCounterCache: this.msgRetryCounterCache, generateHighQualityLinkPreview: true, getMessage }, this.customOptions));
                const eventEmitter = this.sock.ev;
                store === null || store === void 0 ? void 0 : store.bind(eventEmitter);
                this.sock.ev.on('creds.update', this.saveCreds);
                this.sock.ev.on('connection.update', this.handleConnectionUpdate);
            }
            catch (error) {
                logger.error('Error initializing socket:', error);
                throw error;
            }
        });
    }
    getSocket() {
        return __awaiter(this, void 0, void 0, function* () {
            this.msgOption = new connMessage_1.ConnMessage();
            // Binding ConnMessage methods to this.sock
            for (const method of Object.getOwnPropertyNames(connMessage_1.ConnMessage.prototype)) {
                if (method !== 'constructor') {
                    this.sock[method] = this.msgOption[method].bind(this.sock);
                }
            }
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