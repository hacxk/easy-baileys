/**
 * Extracts the MIME type from a given message or its quoted message if applicable.
 * 
 * @async
 * @function extractMimeType
 * @param {object} message - The message object from which to extract the MIME type.
 * @returns {Promise<string|null>} The extracted MIME type, or null if not found.
 * @throws {Error} If an error occurs during extraction.
 */
async function extractMimeType(message) {
    try {
        const messageType = Object.keys(message.message || {})[0];
        if (messageType) {
            let mimeType = null;
            let contextInfo;

            switch (messageType) {
                case 'videoMessage':
                case 'audioMessage':
                case 'documentMessage':
                case 'stickerMessage':
                case 'documentWithCaptionMessage':
                case 'imageMessage':  // Handle imageMessage
                    mimeType = message.message[messageType]?.mimetype;
                    break;
                case 'extendedTextMessage':
                case 'conversation':
                    contextInfo = message.message[messageType]?.contextInfo;
                    if (contextInfo && contextInfo.quotedMessage) {
                        const quotedMessageType = Object.keys(contextInfo.quotedMessage || {})[0];
                        switch (quotedMessageType) {
                            case 'videoMessage':
                            case 'audioMessage':
                            case 'documentMessage':
                            case 'stickerMessage':
                            case 'documentWithCaptionMessage':
                            case 'imageMessage':  // Handle quoted imageMessage
                                mimeType = contextInfo.quotedMessage[quotedMessageType]?.mimetype;
                                break;
                            default:
                                break;
                        }
                    }
                    break;
                default:
                    contextInfo = message.message[messageType]?.contextInfo;
                    if (contextInfo && contextInfo.quotedMessage) {
                        const quotedMessageType = Object.keys(contextInfo.quotedMessage || {})[0];
                        switch (quotedMessageType) {
                            case 'videoMessage':
                            case 'audioMessage':
                            case 'documentMessage':
                            case 'stickerMessage':
                            case 'documentWithCaptionMessage':
                            case 'imageMessage':  // Handle quoted imageMessage
                                mimeType = contextInfo.quotedMessage[quotedMessageType]?.mimetype;
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

module.exports = { extractMimeType };
