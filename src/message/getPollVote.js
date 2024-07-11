const { getAggregateVotesInPollMessage } = require('@whiskeysockets/baileys')

async function extractPollVoteMessage(sock, update) {
    // Check if update is iterable
    if (Symbol.iterator in Object(update)) {
        for (const u of update) {
            const pollCreation = await sock.ws.config.getMessage(u.key);
            if (pollCreation) {
                const poll = getAggregateVotesInPollMessage({
                    message: pollCreation,
                    pollUpdates: u.pollUpdates,
                })
                return poll
            }
        }
    } else {
    }
}

module.exports = { extractPollVoteMessage }