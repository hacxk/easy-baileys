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
async function extractMimeType(message: Message): Promise<string | null> {
    try {
        const messageType = Object.keys(message.message || {})[0];
        if (messageType) {
            let mimeType: string | null = null;
            let contextInfo: ContextInfo | undefined;

            switch (messageType) {
                case 'videoMessage':
                case 'audioMessage':
                case 'documentMessage':
                case 'stickerMessage':
                case 'documentWithCaptionMessage':
                case 'imageMessage':  // Handle imageMessage
                    mimeType = message.message![messageType]?.mimetype || null;
                    break;
                case 'extendedTextMessage':
                case 'conversation':
                    contextInfo = message.message![messageType]?.contextInfo;
                    if (contextInfo && contextInfo.quotedMessage) {
                        const quotedMessageType = Object.keys(contextInfo.quotedMessage || {})[0];
                        switch (quotedMessageType) {
                            case 'videoMessage':
                            case 'audioMessage':
                            case 'documentMessage':
                            case 'stickerMessage':
                            case 'documentWithCaptionMessage':
                            case 'imageMessage':  // Handle quoted imageMessage
                                mimeType = contextInfo.quotedMessage[quotedMessageType]?.mimetype || null;
                                break;
                            default:
                                break;
                        }
                    }
                    break;
                default:
                    contextInfo = message.message![messageType]?.contextInfo;
                    if (contextInfo && contextInfo.quotedMessage) {
                        const quotedMessageType = Object.keys(contextInfo.quotedMessage || {})[0];
                        switch (quotedMessageType) {
                            case 'videoMessage':
                            case 'audioMessage':
                            case 'documentMessage':
                            case 'stickerMessage':
                            case 'documentWithCaptionMessage':
                            case 'imageMessage':  // Handle quoted imageMessage
                                mimeType = contextInfo.quotedMessage[quotedMessageType]?.mimetype || null;
                                break;
                            default:
                                break;
                        }
                    }
                    break;
            }

            if (mimeType) {
                return mimeType;
            }
        }
    } catch (error) {
        console.error('Error extracting MIME type:', error);
    }
    return null;
}

export { extractMimeType };
