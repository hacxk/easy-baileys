/**
 * Extracts text content from a given message.
 * 
 * @async
 * @function extractTextContent
 * @param {object} message - The message object from which to extract text content.
 * @returns {Promise<string|null>} The extracted text content, or null if no text content is found.
 * @throws {Error} If an error occurs during extraction.
 */
async function extractTextContent(message) {
    try {
        const messageType = Object.keys(message.message || {})[0];
        if (messageType) {
            let textContent = null;

            switch (messageType) {
                case 'conversation':
                    textContent = message.message.conversation;
                    break;
                case 'extendedTextMessage':
                    textContent = message.message.extendedTextMessage.text;
                    break;
                case 'imageMessage':
                case 'videoMessage':
                case 'documentMessage':
                case 'stickerMessage':
                case 'documentWithCaptionMessage':
                    textContent = message.message[messageType]?.caption;
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

module.exports = { extractTextContent };
