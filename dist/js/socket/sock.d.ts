import { makeInMemoryStore, WASocket, BaileysEventMap, BaileysEventEmitter, SocketConfig } from '@whiskeysockets/baileys';
import { MongoClient, Document } from 'mongodb';
import { ConnMessage } from '../message/connMessage';
type VoteAggregation = {
    name: string;
    voters: string[];
};
interface ExtendedBaileysEventMap extends BaileysEventMap {
    'poll.vote.update': VoteAggregation;
}
type ExtendedBaileysEventEmitter = BaileysEventEmitter & {
    emit: <T extends keyof ExtendedBaileysEventMap>(event: T, arg: ExtendedBaileysEventMap[T]) => boolean;
    on: <T extends keyof ExtendedBaileysEventMap>(event: T, listener: (arg: ExtendedBaileysEventMap[T]) => void) => void;
    process(handler: (events: Partial<BaileysEventMap>) => void | Promise<void>): () => void;
    buffer(): void;
    createBufferedFunction<A extends any[], T_1>(work: (...args: A) => Promise<T_1>): (...args: A) => Promise<T_1>;
    flush(force?: boolean | undefined): boolean;
    isBuffering(): boolean;
};
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
declare class WhatsAppClient {
    private logger;
    private customOptions;
    private state;
    private saveCreds;
    private sock;
    private msgOption;
    constructor(customOptions?: Partial<SocketConfig>);
    connectToMongoDB(pathAuthFile: string, collectionName: string): Promise<{
        client: MongoClient;
        collection: import("mongodb").Collection<AuthDocument>;
    }>;
    initMongoAuth(pathAuthFile: string, collectionName: string): Promise<void>;
    initMultiFileAuth(pathAuthFile: string): Promise<void>;
    initMySQLAuth(mysqlConfig: MySQLConfig): Promise<void>;
    private initSocket;
    private handleConnectionUpdate;
    private handleMessagesUpdate;
    getSocket(): Promise<ExtendedWASocket>;
    getPairingCode(jid: string): Promise<string>;
    static create(authType: 'mongo' | 'multi' | 'mysql', config: string | MySQLConfig, customOptions?: CustomOptions): Promise<WhatsAppClient>;
}
export default WhatsAppClient;
//# sourceMappingURL=sock.d.ts.map