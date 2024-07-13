/**
 * Extracts poll vote message details from a given update.
 * 
 * @async
 * @function extractPollVoteMessage
 * @param {object} sock - The socket connection object.
 * @param {object|Array} update - The update object or array of updates containing poll information.
 * @returns {Promise<object|null>} The aggregated poll votes or null if no poll creation message is found.
 * @throws {Error} If an error occurs during extraction.
 */
async function extractPollVoteMessage(sock, update) {
    // Check if update is iterable
    if (Symbol.iterator in Object(update)) {
        for (const u of update) {
            const pollCreation = await sock.ws.config.getMessage(u.key);
            if (pollCreation) {
                const poll = getAggregateVotesInPollMessage({
                    message: pollCreation,
                    pollUpdates: u.pollUpdates,
                });
                return poll;
            }
        }
    }
    return null;
}

module.exports = { extractPollVoteMessage };
