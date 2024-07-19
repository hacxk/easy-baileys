interface PollUpdate {
    key: MessageKey;
    pollUpdates: any[];
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
declare function extractPollVoteMessage(sock: Sock, update: Update): Promise<object | null>;
export { extractPollVoteMessage };
//# sourceMappingURL=getPollVote.d.ts.map