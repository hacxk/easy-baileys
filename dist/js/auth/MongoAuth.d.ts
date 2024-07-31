import { EventEmitter } from 'events';
import { Collection } from "mongodb";
interface AuthCreds {
    noiseKey: KeyPair;
    signedIdentityKey: KeyPair;
    signedPreKey: SignedKeyPair;
    registrationId: number;
    advSecretKey: string;
    processedHistoryMessages: any[];
    nextPreKeyId: number;
    firstUnuploadedPreKeyId: number;
    accountSettings: {
        unarchiveChats: boolean;
        autoUpdateStatus: boolean;
        statusMsgTemplate: string;
    };
    account: {
        details: string;
        accountSignature: string;
        platform: string;
    };
    deviceId: string;
    phoneId: string;
    identityId: string;
    registered: boolean;
    backupToken: string;
    createdAt: number;
}
interface KeyPair {
    public: Uint8Array;
    private: Uint8Array;
}
interface SignedKeyPair extends KeyPair {
    keyId: number;
    signature: Uint8Array;
}
interface AdvancedMongoAuthStateOptions {
    logger?: Console;
    cacheSize?: number;
    cacheTTL?: number;
    retryAttempts?: number;
    retryDelay?: number;
}
declare class AdvancedMongoAuthState extends EventEmitter {
    private collection;
    private logger;
    private cacheSize;
    private cacheTTL;
    private cache;
    private writeQueue;
    private isWriting;
    private retryAttempts;
    private retryDelay;
    creds: AuthCreds;
    constructor(collection: Collection, options?: AdvancedMongoAuthStateOptions);
    init(): Promise<void>;
    private initAuthCreds;
    private generateSignedPreKey;
    private generateDeviceId;
    private generatePhoneId;
    private generateIdentityId;
    private generateBackupToken;
    private startCacheCleanup;
    private startWriteQueueProcessor;
    private performWrite;
    readData<T>(id: string): Promise<T | null>;
    removeData(id: string): Promise<void>;
    private getObjectId;
    private createQuery;
    keys(): Promise<{
        get: <T>(type: string, ids: string[]) => Promise<Record<string, T | null>>;
        set: (data: Record<string, Record<string, any>>) => Promise<void>;
    }>;
    saveCreds(): Promise<void>;
}
interface AuthState {
    state: {
        creds: AuthCreds;
        keys: ReturnType<AdvancedMongoAuthState['keys']>;
    };
    saveCreds: () => Promise<void>;
}
export default function initAuthState(collection: Collection, options?: AdvancedMongoAuthStateOptions): Promise<AuthState>;
export {};
//# sourceMappingURL=MongoAuth.d.ts.map