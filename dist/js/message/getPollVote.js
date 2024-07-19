"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractPollVoteMessage = extractPollVoteMessage;
const baileys_1 = require("@whiskeysockets/baileys");
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
function extractPollVoteMessage(sock, update) {
    return __awaiter(this, void 0, void 0, function* () {
        // Normalize update to an array
        const updates = Array.isArray(update) ? update : [update];
        for (const u of updates) {
            const pollCreation = yield sock.ws.config.getMessage(u.key);
            if (pollCreation) {
                const poll = (0, baileys_1.getAggregateVotesInPollMessage)({
                    message: pollCreation,
                    pollUpdates: u.pollUpdates,
                });
                return poll;
            }
        }
        return null;
    });
}
//# sourceMappingURL=getPollVote.js.map