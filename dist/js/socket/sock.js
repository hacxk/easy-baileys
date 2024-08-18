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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const baileys_1 = require("@whiskeysockets/baileys");
const pino_1 = __importDefault(require("pino"));
const mongodb_1 = require("mongodb");
const mysql_baileys_1 = require("mysql-baileys");
const mongo_baileys_1 = require("mongo-baileys");
const connMessage_1 = require("../message/connMessage");
// Configure logger
const logger = (0, pino_1.default)({ level: process.env.LOG_LEVEL || 'info' });
// Create and configure in-memory store
const store = (0, baileys_1.makeInMemoryStore)({ logger });
class WhatsAppClient {
    constructor(customOptions = {}) {
        this.logger = logger;
        this.state = null;
        this.saveCreds = null;
        this.handleConnectionUpdate = (update) => {
            var _a, _b;
            const { connection, lastDisconnect } = update;
            if (connection === 'close') {
                const shouldReconnect = ((_b = (_a = lastDisconnect === null || lastDisconnect === void 0 ? void 0 : lastDisconnect.error) === null || _a === void 0 ? void 0 : _a.output) === null || _b === void 0 ? void 0 : _b.statusCode) !== baileys_1.DisconnectReason.loggedOut;
                logger.info('connection closed due to', lastDisconnect === null || lastDisconnect === void 0 ? void 0 : lastDisconnect.error, ', reconnecting', shouldReconnect);
                if (!shouldReconnect) {
                    logger.info('Connection closed. You are logged out.');
                }
            }
            else if (connection === 'open') {
                logger.info('opened connection');
            }
        };
        this.handleMessagesUpdate = (updates) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            for (const update of updates) {
                if (update.update.pollUpdates) {
                    try {
                        const pollCreation = yield ((_a = this.sock.store) === null || _a === void 0 ? void 0 : _a.loadMessage(update.key.remoteJid, update.key.id));
                        if (pollCreation) {
                            const voteAggregations = (0, baileys_1.getAggregateVotesInPollMessage)({
                                message: pollCreation.message,
                                pollUpdates: update.update.pollUpdates,
                            });
                            // Emit each aggregation individually
                            voteAggregations.forEach(voteAggregation => {
                                this.sock.ev.emit("poll.vote.update", voteAggregation);
                            });
                        }
                    }
                    catch (error) {
                        logger.error("Error processing poll update:", error);
                    }
                }
            }
        });
        this.customOptions = Object.assign(Object.assign({}, baileys_1.DEFAULT_CONNECTION_CONFIG), customOptions);
        this.msgOption = new connMessage_1.ConnMessage();
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
            const getMessage = (key) => __awaiter(this, void 0, void 0, function* () {
                if (store) {
                    const msg = yield store.loadMessage(key.remoteJid, key.id);
                    return (msg === null || msg === void 0 ? void 0 : msg.message) || undefined;
                }
                return baileys_1.proto.Message.fromObject({});
            });
            try {
                const _a = this.customOptions, { auth: customAuth } = _a, restCustomOptions = __rest(_a, ["auth"]);
                const finalAuth = customAuth !== null && customAuth !== void 0 ? customAuth : this.state;
                const baseSock = (0, baileys_1.makeWASocket)(Object.assign(Object.assign({ auth: finalAuth }, restCustomOptions), { getMessage }));
                this.sock = Object.assign(Object.assign(Object.assign({}, baseSock), this.msgOption), { store: store });
                store === null || store === void 0 ? void 0 : store.bind(this.sock.ev);
                this.sock.ev.on('creds.update', this.saveCreds);
                this.sock.ev.on('connection.update', this.handleConnectionUpdate);
                this.sock.ev.on("messages.update", this.handleMessagesUpdate);
            }
            catch (error) {
                logger.error('Error initializing socket:', error);
                throw error;
            }
        });
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
                return yield this.sock.requestPairingCode(jid);
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