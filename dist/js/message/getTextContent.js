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
exports.extractTextContent = extractTextContent;
/**
 * Extracts text content from a given message.
 *
 * @async
 * @function extractTextContent
 * @param {object} message - The message object from which to extract text content.
 * @returns {Promise<string|null>} The extracted text content, or null if no text content is found.
 * @throws {Error} If an error occurs during extraction.
 */
function extractTextContent(message) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e;
        try {
            const messageType = Object.keys(message.message || {})[0];
            if (messageType) {
                let textContent = null;
                switch (messageType) {
                    case 'conversation':
                        textContent = ((_a = message.message) === null || _a === void 0 ? void 0 : _a.conversation) || null;
                        break;
                    case 'extendedTextMessage':
                        textContent = ((_c = (_b = message.message) === null || _b === void 0 ? void 0 : _b.extendedTextMessage) === null || _c === void 0 ? void 0 : _c.text) || null;
                        break;
                    case 'imageMessage':
                    case 'videoMessage':
                    case 'documentMessage':
                    case 'stickerMessage':
                    case 'documentWithCaptionMessage':
                        textContent = ((_e = (_d = message.message) === null || _d === void 0 ? void 0 : _d[messageType]) === null || _e === void 0 ? void 0 : _e.caption) || null;
                        break;
                    // Add cases for other message types as needed
                    default:
                        break;
                }
                if (textContent) {
                    return textContent;
                }
            }
        }
        catch (error) {
            console.error('Error extracting text content:', error);
        }
        return null;
    });
}
//# sourceMappingURL=getTextContent.js.map