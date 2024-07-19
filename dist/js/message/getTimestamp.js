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
exports.extractTimestamp = extractTimestamp;
/**
 * Extracts the timestamp from a given message.
 *
 * @async
 * @function extractTimestamp
 * @param {object} message - The message object from which to extract the timestamp.
 * @returns {Promise<number|null>} The extracted timestamp, or null if no timestamp is found.
 * @throws {Error} If an error occurs during extraction.
 */
function extractTimestamp(message) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const timestamp = message.messageTimestamp || ((_a = message.message) === null || _a === void 0 ? void 0 : _a.timestamp);
            return timestamp !== undefined ? timestamp : null;
        }
        catch (error) {
            console.error('Error extracting timestamp:', error);
            return null;
        }
    });
}
//# sourceMappingURL=getTimestamp.js.map