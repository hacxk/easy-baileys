interface Message {
    message?: {
        conversation?: string;
        extendedTextMessage?: {
            text?: string;
        };
        imageMessage?: {
            caption?: string;
        };
        videoMessage?: {
            caption?: string;
        };
        documentMessage?: {
            caption?: string;
        };
        stickerMessage?: {
            caption?: string;
        };
        documentWithCaptionMessage?: {
            caption?: string;
        };
    };
}
/**
 * Extracts text content from a given message.
 *
 * @async
 * @function extractTextContent
 * @param {object} message - The message object from which to extract text content.
 * @returns {Promise<string|null>} The extracted text content, or null if no text content is found.
 * @throws {Error} If an error occurs during extraction.
 */
declare function extractTextContent(message: Message): Promise<string | null>;
export { extractTextContent };
//# sourceMappingURL=getTextContent.d.ts.map