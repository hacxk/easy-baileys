interface MessageContent {
    sticker?: Buffer | string;
    image?: {
        url: string;
    } | Buffer;
    caption?: string;
}
interface SendMessageOptions {
    quoted?: object;
}
declare class connMessage {
    private sock;
    constructor();
    send(m: {
        key: {
            remoteJid: string;
        };
    }, text: string): Promise<object>;
}
//# sourceMappingURL=connMessage.d.ts.map