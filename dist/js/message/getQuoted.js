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
exports.extractQuotedMessage = extractQuotedMessage;
/**
 * Extracts the quoted message from a given message.
 *
 * @async
 * @function extractQuotedMessage
 * @param {Message} message - The message object containing the quoted message information.
 * @returns {Promise<object|null>} The quoted message object, or null if no quoted message is found.
 * @throws {Error} If an error occurs during extraction.
 */
function extractQuotedMessage(message) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f;
        try {
            const messageType = Object.keys(message.message || {})[0];
            if (messageType) {
                let contextInfo;
                switch (messageType) {
                    case 'extendedTextMessage':
                        contextInfo = (_b = (_a = message.message) === null || _a === void 0 ? void 0 : _a.extendedTextMessage) === null || _b === void 0 ? void 0 : _b.contextInfo;
                        break;
                    case 'conversation':
                        contextInfo = (_d = (_c = message.message) === null || _c === void 0 ? void 0 : _c.conversation) === null || _d === void 0 ? void 0 : _d.contextInfo;
                        break;
                    // Add cases for other message types as needed
                    default:
                        contextInfo = (_f = (_e = message.message) === null || _e === void 0 ? void 0 : _e[messageType]) === null || _f === void 0 ? void 0 : _f.contextInfo;
                        break;
                }
                if (contextInfo && contextInfo.quotedMessage) {
                    return contextInfo.quotedMessage;
                }
            }
        }
        catch (error) {
            console.error('Error extracting quoted message:', error);
        }
        return null;
    });
}
//# sourceMappingURL=getQuoted.js.map