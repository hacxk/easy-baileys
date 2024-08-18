import { getAggregateVotesInPollMessage } from "@whiskeysockets/baileys";

interface PollUpdate {
    key: MessageKey;
    pollUpdates: any[]; // Adjust the type as necessary
}

interface MessageKey {
    remoteJid: string;
    id: string;
}

interface Sock {
    ws: {
        config: {
            getMessage: (key: MessageKey) => Promise<any>;
        };
    };
}

type Update = PollUpdate | PollUpdate[];

/**
 * Extracts poll vote message details from a given update.
 * 
 * @async
 * @function extractPollVoteMessage
 * @param {Sock} sock - The socket connection object.
 * @param {Update} update - The update object or array of updates containing poll information.
 * @returns {Promise<object|null>} The aggregated poll votes or null if no poll creation message is found.
 * @throws {Error} If an error occurs during extraction.
 */
async function extractPollVoteMessage(sock: Sock, update: Update): Promise<object | null> {
    // Normalize update to an array
    const updates = Array.isArray(update) ? update : [update];

    for (const u of updates) {
        const pollCreation = await sock.ws.config.getMessage(u.key);
        if (pollCreation) {
            const poll = getAggregateVotesInPollMessage({
                message: pollCreation,
                pollUpdates: u.pollUpdates,
            });
            return poll;
        }
    }
    return null;
}

export { extractPollVoteMessage };
