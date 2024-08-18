/**
 * Extracts the timestamp from a given message.
 * 
 * @async
 * @function extractTimestamp
 * @param {object} message - The message object from which to extract the timestamp.
 * @returns {Promise<number|null>} The extracted timestamp, or null if no timestamp is found.
 * @throws {Error} If an error occurs during extraction.
 */
async function extractTimestamp(message: { messageTimestamp?: number; message?: { timestamp?: number } }): Promise<number | null> {
    try {
        const timestamp = message.messageTimestamp || message.message?.timestamp;
        return timestamp !== undefined ? timestamp : null;
    } catch (error) {
        console.error('Error extracting timestamp:', error);
        return null;
    }
}

export { extractTimestamp };
