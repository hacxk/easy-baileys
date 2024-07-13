/**
 * Extracts the quoted message from a given message.
 * 
 * @async
 * @function extractQuotedMessage
 * @param {object} message - The message object containing the quoted message information.
 * @returns {Promise<object|null>} The quoted message object, or null if no quoted message is found.
 * @throws {Error} If an error occurs during extraction.
 */
async function extractQuotedMessage(message) {
    try {
        const messageType = Object.keys(message.message || {})[0];
        if (messageType) {
            let contextInfo;

            switch (messageType) {
                case 'extendedTextMessage':
                    contextInfo = message.message.extendedTextMessage?.contextInfo;
                    break;
                case 'conversation':
                    contextInfo = message.message.conversation?.contextInfo;
                    break;
                // Add cases for other message types as needed
                default:
                    contextInfo = message.message[messageType]?.contextInfo;
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

module.exports = { extractQuotedMessage };
