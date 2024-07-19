interface MessageKey {
    remoteJid: string;
    participant?: string;
    id: string;
}
interface Message {
    key: MessageKey;
    message?: {
        extendedTextMessage?: {
            contextInfo?: {
                stanzaId: string;
            };
            text?: string;
        };
        conversation?: string;
    };
}
interface SentMessage {
    key: MessageKey;
}
interface UpsertEvent {
    messages: Message[];
}
interface Sock {
    ev: {
        on(event: 'messages.upsert', listener: (event: UpsertEvent) => void): void;
        off(event: 'messages.upsert', listener: (event: UpsertEvent) => void): void;
    };
}
/**
 * Extracts the response text content from a message within a specified timeout period.
 *
 * @async
 * @function extractResponseTextContent
 * @param {Sock} sock - The socket connection object.
 * @param {Message} m - The message object to track the response for.
 * @param {SentMessage} sentMessage - The original sent message to which the response is expected.
 * @param {number} timeout - The timeout period in milliseconds to wait for the response.
 * @returns {Promise<{ key: MessageKey, message: any, response: string | undefined }>} Resolves with the response message details if a valid response is received within the timeout period.
 * @throws {Error} If the timeout period is exceeded without receiving a valid response.
 */
declare function extractResponseTextContent(sock: Sock, m: Message, sentMessage: SentMessage, timeout: number): Promise<{
    key: MessageKey;
    message: any;
    response: string | undefined;
}>;
export { extractResponseTextContent };
//# sourceMappingURL=getResponseText.d.ts.map