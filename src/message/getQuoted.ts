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
async function extractQuotedMessage(message: Message): Promise<object | null> {
    try {
        const messageType = Object.keys(message.message || {})[0];
        if (messageType) {
            let contextInfo: ContextInfo | undefined;

            switch (messageType) {
                case 'extendedTextMessage':
                    contextInfo = message.message?.extendedTextMessage?.contextInfo;
                    break;
                case 'conversation':
                    contextInfo = message.message?.conversation?.contextInfo;
                    break;
                // Add cases for other message types as needed
                default:
                    contextInfo = message.message?.[messageType]?.contextInfo;
                    break;
            }

            if (contextInfo && contextInfo.quotedMessage) {
                return contextInfo.quotedMessage;
            }
        }
    } catch (error) {
        console.error('Error extracting quoted message:', error);
    }
    return null;
}

export { extractQuotedMessage };
