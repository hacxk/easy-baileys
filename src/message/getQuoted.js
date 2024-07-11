// src/message/getQuoted.js
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
