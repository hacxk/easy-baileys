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
        // Add other message types as needed
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
async function extractTextContent(message: Message): Promise<string | null> {
    try {
        const messageType = Object.keys(message.message || {})[0];
        if (messageType) {
            let textContent: string | null = null;

            switch (messageType) {
                case 'conversation':
                    textContent = message.message?.conversation || null;
                    break;
                case 'extendedTextMessage':
                    textContent = message.message?.extendedTextMessage?.text || null;
                    break;
                case 'imageMessage':
                case 'videoMessage':
                case 'documentMessage':
                case 'stickerMessage':
                case 'documentWithCaptionMessage':
                    textContent = message.message?.[messageType]?.caption || null;
                    break;
                // Add cases for other message types as needed
                default:
                    break;
            }

            if (textContent) {
                return textContent;
            }
        }
    } catch (error) {
        console.error('Error extracting text content:', error);
    }
    return null;
}

export { extractTextContent };
