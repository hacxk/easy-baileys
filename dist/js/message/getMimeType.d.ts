interface ContextInfo {
    quotedMessage?: {
        [key: string]: {
            mimetype?: string;
        };
    };
}
interface MessageContent {
    mimetype?: string;
    contextInfo?: ContextInfo;
}
interface Message {
    message?: {
        [key: string]: MessageContent;
    };
}
/**
 * Extracts the MIME type from a given message or its quoted message if applicable.
 *
 * @async
 * @function extractMimeType
 * @param {Message} message - The message object from which to extract the MIME type.
 * @returns {Promise<string|null>} The extracted MIME type, or null if not found.
 * @throws {Error} If an error occurs during extraction.
 */
declare function extractMimeType(message: Message): Promise<string | null>;
export { extractMimeType };
//# sourceMappingURL=getMimeType.d.ts.map