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
exports.default = initAuthState;
const baileys_1 = require("@whiskeysockets/baileys");
const generics_1 = require("@whiskeysockets/baileys/lib/Utils/generics");
const crypto_1 = require("crypto");
const perf_hooks_1 = require("perf_hooks");
const events_1 = require("events");
const mongodb_1 = require("mongodb");
// Type guard to check if the value has a 'keyData' property
function hasKeyData(value) {
    return value && typeof value === 'object' && 'keyData' in value;
}
class AdvancedMongoAuthState extends events_1.EventEmitter {
    constructor(collection, options = {}) {
        super();
        this.collection = collection;
        this.logger = options.logger || console;
        this.cacheSize = options.cacheSize || 100;
        this.cacheTTL = options.cacheTTL || 300000; // 5 minutes
        this.cache = new Map();
        this.writeQueue = [];
        this.isWriting = false;
        this.retryAttempts = options.retryAttempts || 3;
        this.retryDelay = options.retryDelay || 1000;
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            this.creds = (yield this.readData("creds")) || this.initAuthCreds();
            this.startWriteQueueProcessor();
            this.startCacheCleanup();
        });
    }
    initAuthCreds() {
        const identityKey = baileys_1.Curve.generateKeyPair();
        // **TypeScript Fix:** Correctly construct SignedKeyPair
        const signedPreKey = {
            keyId: 1,
            signature: (0, baileys_1.signedKeyPair)(identityKey, 1).signature,
            public: identityKey.public,
            private: identityKey.private
        };
        return {
            noiseKey: baileys_1.Curve.generateKeyPair(),
            signedIdentityKey: identityKey,
            signedPreKey: signedPreKey,
            registrationId: (0, generics_1.generateRegistrationId)(),
            advSecretKey: (0, crypto_1.randomBytes)(32).toString("base64"),
            processedHistoryMessages: [],
            nextPreKeyId: 1,
            firstUnuploadedPreKeyId: 1,
            accountSettings: {
                unarchiveChats: false,
                autoUpdateStatus: true,
                statusMsgTemplate: "Hey there! I'm using whatsapp.",
            },
            account: {
                details: "CaffeineOS",
                accountSignature: (0, crypto_1.randomBytes)(32).toString("base64"),
                platform: "android",
            },
            deviceId: (0, crypto_1.randomBytes)(16).toString("hex"),
            phoneId: (0, crypto_1.randomBytes)(16).toString("hex"),
            identityId: (0, crypto_1.randomBytes)(20).toString("base64"),
            registered: false,
            backupToken: (0, crypto_1.randomBytes)(20).toString("base64"),
            createdAt: Date.now(),
        };
    }
    startCacheCleanup() {
        setInterval(() => {
            const now = Date.now();
            for (const [key, { timestamp }] of this.cache) {
                if (now - timestamp > this.cacheTTL) {
                    this.cache.delete(key);
                }
            }
        }, this.cacheTTL);
    }
    startWriteQueueProcessor() {
        setInterval(() => __awaiter(this, void 0, void 0, function* () {
            if (this.isWriting || this.writeQueue.length === 0)
                return;
            this.isWriting = true;
            const { data, id, resolve, reject } = this.writeQueue.shift();
            try {
                yield this.performWrite(data, id);
                resolve();
            }
            catch (error) {
                reject(error);
            }
            finally {
                this.isWriting = false;
            }
        }), 100);
    }
    performWrite(data_1, id_1) {
        return __awaiter(this, arguments, void 0, function* (data, id, attempt = 1) {
            const start = perf_hooks_1.performance.now();
            try {
                const informationToStore = JSON.parse(JSON.stringify(data, BufferJSON.replacer));
                const update = {
                    $set: Object.assign(Object.assign({}, informationToStore), { updatedAt: new Date() }),
                };
                // Updated line for ObjectId conversion
                yield this.collection.updateOne({ _id: new mongodb_1.ObjectId(id) }, update, { upsert: true });
                this.cache.set(id, { data, timestamp: Date.now() });
                if (this.cache.size > this.cacheSize) {
                    this.cache.delete(this.cache.keys().next().value);
                }
                this.emit('write', { id, duration: perf_hooks_1.performance.now() - start });
            }
            catch (error) {
                if (attempt < this.retryAttempts) {
                    this.logger.warn(`Retrying write for ${id}, attempt ${attempt + 1}`);
                    yield new Promise(resolve => setTimeout(resolve, this.retryDelay));
                    return this.performWrite(data, id, attempt + 1);
                }
                this.logger.error(`Failed to write data for ${id}:`, error);
                throw error;
            }
            finally {
                this.logger.debug(`writeData took ${perf_hooks_1.performance.now() - start}ms`);
            }
        });
    }
    readData(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const start = perf_hooks_1.performance.now();
            try {
                if (this.cache.has(id)) {
                    this.emit('cacheHit', { id });
                    return this.cache.get(id).data;
                }
                // **TypeScript Fix:**  Use ObjectId for MongoDB queries
                const data = yield this.collection.findOne({ _id: new mongodb_1.ObjectId(id) });
                if (!data)
                    return null;
                const parsed = JSON.parse(JSON.stringify(data), BufferJSON.reviver);
                this.cache.set(id, { data: parsed, timestamp: Date.now() });
                this.emit('cacheMiss', { id });
                return parsed;
            }
            catch (error) {
                this.logger.error(`Failed to read data for ${id}:`, error);
                return null;
            }
            finally {
                this.logger.debug(`readData took ${perf_hooks_1.performance.now() - start}ms`);
            }
        });
    }
    removeData(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const start = perf_hooks_1.performance.now();
            try {
                yield this.collection.deleteOne({ _id: new mongodb_1.ObjectId(id) });
                this.cache.delete(id);
                this.emit('remove', { id });
            }
            catch (error) {
                this.logger.error(`Failed to remove data for ${id}:`, error);
            }
            finally {
                this.logger.debug(`removeData took ${perf_hooks_1.performance.now() - start}ms`);
            }
        });
    }
    keys() {
        return __awaiter(this, void 0, void 0, function* () {
            return {
                get: (type, ids) => __awaiter(this, void 0, void 0, function* () {
                    const data = {};
                    yield Promise.all(ids.map((id) => __awaiter(this, void 0, void 0, function* () {
                        let value = yield this.readData(`${type}-${id}`);
                        if (type === "app-state-sync-key" && value) {
                            // Ensure that value is correctly cast and compatible
                            value = baileys_1.proto.Message.AppStateSyncKeyData.fromObject(value);
                        }
                        data[id] = value;
                    })));
                    return data;
                }),
                set: (data) => __awaiter(this, void 0, void 0, function* () {
                    const tasks = Object.entries(data).flatMap(([category, items]) => Object.entries(items).map(([id, value]) => new Promise((resolve, reject) => {
                        this.writeQueue.push({
                            data: value,
                            id: `${category}-${id}`,
                            resolve,
                            reject
                        });
                    })));
                    yield Promise.all(tasks);
                }),
            };
        });
    }
    saveCreds() {
        return new Promise((resolve, reject) => {
            this.writeQueue.push({
                data: this.creds,
                id: "creds",
                resolve,
                reject
            });
        });
    }
}
const BufferJSON = {
    replacer: (_, value) => {
        if (Buffer.isBuffer(value) || value instanceof Uint8Array || (value === null || value === void 0 ? void 0 : value.type) === "Buffer") {
            return { type: "Buffer", data: Buffer.from((value === null || value === void 0 ? void 0 : value.data) || value).toString("base64") };
        }
        if (value instanceof Map) {
            return { type: "Map", data: Array.from(value.entries()) };
        }
        if (value instanceof Set) {
            return { type: "Set", data: Array.from(value) };
        }
        if (typeof value === 'bigint') {
            return { type: "BigInt", data: value.toString() };
        }
        return value;
    },
    reviver: (_, value) => {
        if (typeof value === "object" && value !== null) {
            if (value.buffer === true || value.type === "Buffer") {
                return Buffer.from(value.data || value.value, "base64");
            }
            if (value.type === "Map") {
                return new Map(value.data);
            }
            if (value.type === "Set") {
                return new Set(value.data);
            }
            if (value.type === "BigInt") {
                return BigInt(value.data);
            }
        }
        return value;
    },
};
function initAuthState(collection_1) {
    return __awaiter(this, arguments, void 0, function* (collection, options = {}) {
        const authState = new AdvancedMongoAuthState(collection, options);
        yield authState.init();
        return {
            state: {
                creds: authState.creds,
                keys: new Promise((resolve) => resolve(authState.keys())),
            },
            saveCreds: () => authState.saveCreds(),
        };
    });
}
//# sourceMappingURL=MongoAuth.js.map