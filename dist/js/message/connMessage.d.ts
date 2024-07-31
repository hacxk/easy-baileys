import { WASocket, proto, AnyMessageContent, MiscMessageGenerationOptions, WAMediaUpload } from '@whiskeysockets/baileys';
type Templatable = {
    /** add buttons to the message (conflicts with normal buttons) */
    text: string;
    templateButtons?: proto.IHydratedTemplateButton[];
    footer?: string;
};
export declare class ConnMessage {
    [key: string]: any;
    sendTextMessage(this: WASocket & ConnMessage, jid: string, text: string): Promise<proto.WebMessageInfo | undefined>;
    reply(this: WASocket & ConnMessage, m: proto.IWebMessageInfo, text: string): Promise<proto.WebMessageInfo | undefined>;
    react(this: WASocket & ConnMessage, m: proto.IWebMessageInfo, emoji: string): Promise<proto.WebMessageInfo | undefined>;
    send(this: WASocket & ConnMessage, jid: string, content: AnyMessageContent, options?: MiscMessageGenerationOptions): Promise<proto.WebMessageInfo | undefined>;
    sendImage(this: WASocket & ConnMessage, jid: string, image: WAMediaUpload, caption?: string, options?: MiscMessageGenerationOptions): Promise<proto.WebMessageInfo | undefined>;
    sendImageReply(this: WASocket & ConnMessage, m: proto.IWebMessageInfo, image: WAMediaUpload, caption?: string, options?: MiscMessageGenerationOptions): Promise<proto.WebMessageInfo | undefined>;
    sendVideo(this: WASocket & ConnMessage, jid: string, video: WAMediaUpload, caption?: string, options?: MiscMessageGenerationOptions): Promise<proto.WebMessageInfo | undefined>;
    sendVideoReply(this: WASocket & ConnMessage, m: proto.IWebMessageInfo, video: WAMediaUpload, caption?: string, options?: MiscMessageGenerationOptions): Promise<proto.WebMessageInfo | undefined>;
    sendDocument(this: WASocket & ConnMessage, jid: string, document: WAMediaUpload, filename: string, mimeType: string, caption?: string, options?: MiscMessageGenerationOptions): Promise<proto.WebMessageInfo | undefined>;
    sendDocumentReply(this: WASocket & ConnMessage, m: proto.IWebMessageInfo, document: WAMediaUpload, filename: string, mimeType: string, caption?: string, options?: MiscMessageGenerationOptions): Promise<proto.WebMessageInfo | undefined>;
    sendSticker(this: WASocket & ConnMessage, jid: string, sticker: WAMediaUpload, options?: MiscMessageGenerationOptions): Promise<proto.WebMessageInfo | undefined>;
    sendStickerReply(this: WASocket & ConnMessage, m: proto.IWebMessageInfo, sticker: WAMediaUpload, options?: MiscMessageGenerationOptions): Promise<proto.WebMessageInfo | undefined>;
    sendGIF(this: WASocket & ConnMessage, jid: string, gif: WAMediaUpload, caption?: string, options?: MiscMessageGenerationOptions): Promise<proto.WebMessageInfo | undefined>;
    sendGIFReply(this: WASocket & ConnMessage, m: proto.IWebMessageInfo, gif: WAMediaUpload, caption?: string, options?: MiscMessageGenerationOptions): Promise<proto.WebMessageInfo | undefined>;
    sendAudio(this: WASocket & ConnMessage, jid: string, audio: WAMediaUpload, options?: MiscMessageGenerationOptions): Promise<proto.WebMessageInfo | undefined>;
    sendAudioReply(this: WASocket & ConnMessage, m: proto.IWebMessageInfo, audio: WAMediaUpload, options?: MiscMessageGenerationOptions): Promise<proto.WebMessageInfo | undefined>;
    sendContact(this: WASocket & ConnMessage, jid: string, contact: {
        name: string;
        number: string;
    }, options?: MiscMessageGenerationOptions): Promise<proto.WebMessageInfo | undefined>;
    sendContactReply(this: WASocket & ConnMessage, m: proto.IWebMessageInfo, contact: {
        name: string;
        number: string;
    }, options?: MiscMessageGenerationOptions): Promise<proto.WebMessageInfo | undefined>;
    sendPoll(this: WASocket & ConnMessage, jid: string, name: string, values: string[], selectableCount?: number): Promise<proto.WebMessageInfo | undefined>;
    sendPollReply(this: WASocket & ConnMessage, m: proto.IWebMessageInfo, name: string, values: string[], selectableCount?: number): Promise<proto.WebMessageInfo | undefined>;
    editMessage(this: WASocket & ConnMessage, jid: string, m: proto.IWebMessageInfo, newContent: string | {
        text?: string;
        caption?: string;
    }): Promise<string>;
    deleteMessage(this: WASocket & ConnMessage, jid: string, m: proto.IWebMessageInfo): Promise<proto.WebMessageInfo | undefined>;
    sendLocation(this: WASocket & ConnMessage, jid: string, latitude: number, longitude: number, options?: MiscMessageGenerationOptions): Promise<proto.WebMessageInfo | undefined>;
    sendLocationReply(this: WASocket & ConnMessage, m: proto.IWebMessageInfo, latitude: number, longitude: number, options?: MiscMessageGenerationOptions): Promise<proto.WebMessageInfo | undefined>;
    sendLiveLocation(this: WASocket & ConnMessage, jid: string, latitude: number, longitude: number, durationMs: number, options?: MiscMessageGenerationOptions & {
        comment?: string;
    }): Promise<proto.WebMessageInfo | undefined>;
    sendButton(this: WASocket & ConnMessage, jid: string, contentText: string, buttons: proto.Message.ButtonsMessage.IButton[], options?: MiscMessageGenerationOptions): Promise<proto.WebMessageInfo | undefined>;
    sendListMessage(this: WASocket & ConnMessage, jid: string, message: proto.Message.ListMessage, options?: MiscMessageGenerationOptions): Promise<proto.WebMessageInfo | undefined>;
    sendTemplateMessage(this: WASocket & ConnMessage, jid: string, content: Templatable, options?: MiscMessageGenerationOptions): Promise<proto.WebMessageInfo | undefined>;
}
export {};
//# sourceMappingURL=connMessage.d.ts.map