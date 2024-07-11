// src/message/getTimestamp.js
async function extractTimestamp(message) {
    try {
        const timestamp = message.messageTimestamp || message.message?.timestamp;
        return timestamp;
    } catch (error) {
        console.error('Error extracting timestamp:', error);
    }
    return null;
}

module.exports = { extractTimestamp };
