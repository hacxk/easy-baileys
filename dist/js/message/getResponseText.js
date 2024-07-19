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
exports.extractResponseTextContent = extractResponseTextContent;
const listeners = [];
const MAX_LISTENERS = 100;
/**
 * Extracts the response text content from a message within a specified timeout period.
 *
 * @async
 * @function extractResponseTextContent
 * @param {Sock} sock - The socket connection object.
 * @param {Message} m - The message object to track the response for.
 * @param {SentMessage} sentMessage - The original sent message to which the response is expected.
 * @param {number} timeout - The timeout period in milliseconds to wait for the response.
 * @returns {Promise<{ key: MessageKey, message: any, response: string | undefined }>} Resolves with the response message details if a valid response is received within the timeout period.
 * @throws {Error} If the timeout period is exceeded without receiving a valid response.
 */
function extractResponseTextContent(sock, m, sentMessage, timeout) {
    return __awaiter(this, void 0, void 0, function* () {
        const key = m.key;
        return new Promise((resolve, reject) => {
            const timer = timeout && timeout > 0 ? setTimeout(() => {
                sock.ev.off('messages.upsert', replyHandler);
                reject(new Error('Timeout exceeded while waiting for response'));
            }, timeout) : null;
            const replyHandler = (_a) => __awaiter(this, [_a], void 0, function* ({ messages }) {
                var _b, _c, _d, _e, _f, _g;
                const msg = messages[0];
                const senderJid = key.remoteJid;
                const isValidReply = (((_d = (_c = (_b = msg.message) === null || _b === void 0 ? void 0 : _b.extendedTextMessage) === null || _c === void 0 ? void 0 : _c.contextInfo) === null || _d === void 0 ? void 0 : _d.stanzaId) === sentMessage.key.id ||
                    (senderJid.endsWith('@g.us') ? key.participant : key.remoteJid) ===
                        (msg.key.remoteJid.endsWith('@g.us') ? msg.key.participant : msg.key.remoteJid));
                if (isValidReply) {
                    if (timer)
                        clearTimeout(timer);
                    sock.ev.off('messages.upsert', replyHandler);
                    const responseText = ((_f = (_e = msg.message) === null || _e === void 0 ? void 0 : _e.extendedTextMessage) === null || _f === void 0 ? void 0 : _f.text) || ((_g = msg.message) === null || _g === void 0 ? void 0 : _g.conversation);
                    resolve({ key: msg.key, message: msg.message, response: responseText });
                }
            });
            listeners.push(replyHandler);
            if (listeners.length > MAX_LISTENERS) {
                const oldestListener = listeners.shift();
                if (oldestListener) {
                    sock.ev.off('messages.upsert', oldestListener);
                }
            }
            sock.ev.on('messages.upsert', replyHandler);
        });
    });
}
//# sourceMappingURL=getResponseText.js.map