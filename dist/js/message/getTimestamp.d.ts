/**
 * Extracts the timestamp from a given message.
 *
 * @async
 * @function extractTimestamp
 * @param {object} message - The message object from which to extract the timestamp.
 * @returns {Promise<number|null>} The extracted timestamp, or null if no timestamp is found.
 * @throws {Error} If an error occurs during extraction.
 */
declare function extractTimestamp(message: {
    messageTimestamp?: number;
    message?: {
        timestamp?: number;
    };
}): Promise<number | null>;
export { extractTimestamp };
//# sourceMappingURL=getTimestamp.d.ts.map