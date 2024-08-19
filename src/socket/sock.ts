import {
    makeWASocket,
    useMultiFileAuthState,
    DisconnectReason,
    makeInMemoryStore,
    proto,
    WASocket,
    BaileysEventMap,
    BaileysEventEmitter,
    getAggregateVotesInPollMessage,
    AuthenticationState,
    SocketConfig,
    DEFAULT_CONNECTION_CONFIG,
    WAMessageUpdate, decryptPollVote,
    WAMessage
} from '@whiskeysockets/baileys';
import pino from 'pino';
import { MongoClient, Document } from 'mongodb';
import { useMySQLAuthState } from 'mysql-baileys';
import { useMongoDBAuthState } from 'mongo-baileys';
import { ConnMessage } from '../message/connMessage';

// Configure logger
const logger = pino({ level: process.env.LOG_LEVEL || 'info' });

// Create and configure in-memory store
const store = makeInMemoryStore({ logger });

// Define VoteAggregation type
type VoteAggregation = {
    pollTitle: string | null | undefined,
    optionName: string;
    voter: string | null;
    pollCreationMessage: WAMessage
};

// Extend BaileysEventMap to include our custom event
interface ExtendedBaileysEventMap extends BaileysEventMap {
    'poll.vote.update': VoteAggregation;
}

// Create a new type for the extended event emitter, ensuring it includes the necessary methods
type ExtendedBaileysEventEmitter = BaileysEventEmitter & {
    emit: <T extends keyof ExtendedBaileysEventMap>(event: T, arg: ExtendedBaileysEventMap[T]) => boolean;
    on: <T extends keyof ExtendedBaileysEventMap>(event: T, listener: (arg: ExtendedBaileysEventMap[T]) => void) => void;
    process(handler: (events: Partial<BaileysEventMap>) => void | Promise<void>): () => void;
    buffer(): void;
    createBufferedFunction<A extends any[], T_1>(work: (...args: A) => Promise<T_1>):
        (...args: A) => Promise<T_1>;
    flush(force?: boolean | undefined): boolean;
    isBuffering(): boolean;
};

// Extend WASocket interface to include ConnMessage methods, the extended event emitter, and the store property
interface ExtendedWASocket extends WASocket, ConnMessage {
    ev: ExtendedBaileysEventEmitter;
    store: ReturnType<typeof makeInMemoryStore>;
}

interface CustomOptions extends Partial<SocketConfig> {
    browser?: [string, string, string];
    keepAliveIntervalMs?: number;
    downloadHistory?: boolean;
    syncFullHistory?: boolean;
    markOnlineOnConnect?: boolean;
    printQRInTerminal?: boolean;
}

interface MySQLConfig {
    host: string;
    user: string;
    password: string;
    database: string;
    port: number;
    session: string;
}

interface AuthDocument extends Document {
    _id: string;
    creds?: any;
}

class WhatsAppClient {
    private logger = logger;
    private customOptions: SocketConfig;
    private state: AuthenticationState | null = null;
    private saveCreds: any = null;
    private sock!: ExtendedWASocket;
    private msgOption: ConnMessage;

    constructor(customOptions: Partial<SocketConfig> = {}) {
        this.customOptions = { ...DEFAULT_CONNECTION_CONFIG, ...customOptions };
        this.msgOption = new ConnMessage();
    }

    async connectToMongoDB(pathAuthFile: string, collectionName: string) {
        const client = new MongoClient(pathAuthFile);
        await client.connect();
        const db = client.db("whatsappmultidevice");
        const collection = db.collection<AuthDocument>(collectionName);
        return { client, collection };
    }

    async initMongoAuth(pathAuthFile: string, collectionName: string): Promise<void> {
        if (!collectionName) {
            throw new Error('Please provide a Collection name to Save/Retrieve Session!');
        }
        const { collection } = await this.connectToMongoDB(pathAuthFile, collectionName);
        const { state, saveCreds } = await useMongoDBAuthState(collection);
        this.state = state;
        this.saveCreds = saveCreds;

        await this.initSocket();
    }

    async initMultiFileAuth(pathAuthFile: string): Promise<void> {
        const { state, saveCreds } = await useMultiFileAuthState(pathAuthFile);
        this.state = state;
        this.saveCreds = saveCreds;

        await this.initSocket();
    }

    async initMySQLAuth(mysqlConfig: MySQLConfig): Promise<void> {
        const { state, saveCreds } = await useMySQLAuthState(mysqlConfig);
        this.state = state;
        this.saveCreds = saveCreds;

        await this.initSocket();
    }

    private async initSocket(): Promise<void> {
        const getMessage = async (key: proto.IMessageKey) => {
            if (store) {
                const msg = await store.loadMessage(key.remoteJid!, key.id!);
                return msg?.message || undefined;
            }
            return proto.Message.fromObject({});
        };

        try {
            const { auth: customAuth, ...restCustomOptions } = this.customOptions;
            const finalAuth = customAuth ?? this.state;

            const baseSock = makeWASocket({
                auth: finalAuth,
                ...restCustomOptions,
                getMessage
            });

            this.sock = {
                ...baseSock,
                ...this.msgOption,
                store: store,
            } as unknown as ExtendedWASocket;

            store?.bind(this.sock.ev);

            // Binding ConnMessage methods to this.sock

            const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(this.msgOption))

                .filter(method => typeof this.msgOption[method] === 'function' && method !== 'constructor');

            methods.forEach(method => {

                this.sock[method] = this.msgOption[method].bind(this.sock);

            });

            this.sock.ev.on('creds.update', this.saveCreds);
            this.sock.ev.on('connection.update', this.handleConnectionUpdate);
            this.sock.ev.on("messages.update", this.handleMessagesUpdate);

        } catch (error) {
            logger.error('Error initializing socket:', error);
            throw error;
        }
    }

    private handleConnectionUpdate = (update: Partial<{ connection: any, lastDisconnect: any }>) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect?.error as any)?.output?.statusCode !== DisconnectReason.loggedOut;
            logger.info('connection closed due to', lastDisconnect?.error, ', reconnecting', shouldReconnect);
            if (!shouldReconnect) {
                logger.info('Connection closed. You are logged out.');
            }
        } else if (connection === 'open') {
            logger.info('opened connection');
        }
    }

    private handleMessagesUpdate = async (updates: WAMessageUpdate[]) => {
        for (const update of updates) {
            if (update.update.pollUpdates) {
                try {
                    const pollCreation = await this.sock.store?.loadMessage(update.key.remoteJid!, update.key.id!);
                    if (pollCreation) {
                        const voteAggregations = getAggregateVotesInPollMessage({
                            message: pollCreation.message as proto.IMessage,
                            pollUpdates: update.update.pollUpdates,
                        });
                    
                        const emit: VoteAggregation = {
                            pollTitle: pollCreation.message?.pollCreationMessage?.name,
                            optionName: voteAggregations[0].name, 
                            voter: voteAggregations[0].voters.length > 0 ? voteAggregations[0].voters[0] : null, // Handle empty voters
                            pollCreationMessage: pollCreation
                        };
                      
                        this.sock.ev.emit("poll.vote.update", emit);

                    }
                } catch (error) {
                    logger.error("Error processing poll update:", error);
                }
            }
        }
    }

    async getSocket(): Promise<ExtendedWASocket> {
        if (!this.sock) {
            throw new Error('Socket is not initialized yet');
        }
        return this.sock;
    }

    async getPairingCode(jid: string): Promise<string> {
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

            return await this.sock.requestPairingCode(jid);
        } catch (error) {
            logger.error("Error getting pairing code:", error);
            throw error;
        }
    }

    static async create(authType: 'mongo' | 'multi' | 'mysql', config: string | MySQLConfig, customOptions: CustomOptions = {}): Promise<WhatsAppClient> {
        const client = new WhatsAppClient(customOptions);
        switch (authType) {
            case 'mongo':
                if (typeof config !== 'string') throw new Error('MongoDB connection string required');
                await client.initMongoAuth(config, 'sessions');
                break;
            case 'multi':
                if (typeof config !== 'string') throw new Error('Path to auth file required');
                await client.initMultiFileAuth(config);
                break;
            case 'mysql':
                if (typeof config === 'string') throw new Error('MySQL config object required');
                await client.initMySQLAuth(config);
                break;
            default:
                throw new Error('Invalid auth type');
        }
        return client;
    }
}

export default WhatsAppClient;