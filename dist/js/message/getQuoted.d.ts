interface ContextInfo {
    quotedMessage?: object;
}
interface ExtendedTextMessage {
    contextInfo?: ContextInfo;
}
interface Conversation {
    contextInfo?: ContextInfo;
}
interface Message {
    message?: {
        extendedTextMessage?: ExtendedTextMessage;
        conversation?: Conversation;
        [key: string]: any;
    };
}
/**
 * Extracts the quoted message from a given message.
 *
 * @async
 * @function extractQuotedMessage
 * @param {Message} message - The message object containing the quoted message information.
 * @returns {Promise<object|null>} The quoted message object, or null if no quoted message is found.
 * @throws {Error} If an error occurs during extraction.
 */
declare function extractQuotedMessage(message: Message): Promise<object | null>;
export { extractQuotedMessage };
//# sourceMappingURL=getQuoted.d.ts.map