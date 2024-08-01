import { WASocket } from '@whiskeysockets/baileys';
import { MongoClient, Collection, Document } from 'mongodb';
import { ConnMessage } from '../message/connMessage';
import { AuthenticationCreds } from "@whiskeysockets/baileys";
interface ExtendedWASocket extends WASocket, ConnMessage {
}
interface CustomOptions {
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
    creds?: AuthenticationCreds;
}
declare class WhatsAppClient {
    private logger;
    private msgRetryCounterCache;
    private customOptions;
    private pairingCode;
    private state;
    private saveCreds;
    private sock;
    private msgOption;
    constructor(customOptions?: CustomOptions);
    connectToMongoDB(pathAuthFile: string, collectionName: string): Promise<{
        client: MongoClient;
        collection: Collection<AuthDocument>;
    }>;
    initMongoAuth(pathAuthFile: string, collectionName: string): Promise<void>;
    initMultiFileAuth(pathAuthFile: string): Promise<void>;
    initMySQLAuth(mysqlConfig: MySQLConfig): Promise<void>;
    private initSocket;
    private handleConnectionUpdate;
    getSocket(): Promise<ExtendedWASocket>;
    getPairingCode(jid: string): Promise<string>;
    static create(authType: 'mongo' | 'multi' | 'mysql', config: string | MySQLConfig, customOptions?: CustomOptions): Promise<WhatsAppClient>;
}
export default WhatsAppClient;
//# sourceMappingURL=sock.d.ts.map