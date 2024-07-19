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
exports.extractMimeType = extractMimeType;
/**
 * Extracts the MIME type from a given message or its quoted message if applicable.
 *
 * @async
 * @function extractMimeType
 * @param {Message} message - The message object from which to extract the MIME type.
 * @returns {Promise<string|null>} The extracted MIME type, or null if not found.
 * @throws {Error} If an error occurs during extraction.
 */
function extractMimeType(message) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e;
        try {
            const messageType = Object.keys(message.message || {})[0];
            if (messageType) {
                let mimeType = null;
                let contextInfo;
                switch (messageType) {
                    case 'videoMessage':
                    case 'audioMessage':
                    case 'documentMessage':
                    case 'stickerMessage':
                    case 'documentWithCaptionMessage':
                    case 'imageMessage': // Handle imageMessage
                        mimeType = ((_a = message.message[messageType]) === null || _a === void 0 ? void 0 : _a.mimetype) || null;
                        break;
                    case 'extendedTextMessage':
                    case 'conversation':
                        contextInfo = (_b = message.message[messageType]) === null || _b === void 0 ? void 0 : _b.contextInfo;
                        if (contextInfo && contextInfo.quotedMessage) {
                            const quotedMessageType = Object.keys(contextInfo.quotedMessage || {})[0];
                            switch (quotedMessageType) {
                                case 'videoMessage':
                                case 'audioMessage':
                                case 'documentMessage':
                                case 'stickerMessage':
                                case 'documentWithCaptionMessage':
                                case 'imageMessage': // Handle quoted imageMessage
                                    mimeType = ((_c = contextInfo.quotedMessage[quotedMessageType]) === null || _c === void 0 ? void 0 : _c.mimetype) || null;
                                    break;
                                default:
                                    break;
                            }
                        }
                        break;
                    default:
                        contextInfo = (_d = message.message[messageType]) === null || _d === void 0 ? void 0 : _d.contextInfo;
                        if (contextInfo && contextInfo.quotedMessage) {
                            const quotedMessageType = Object.keys(contextInfo.quotedMessage || {})[0];
                            switch (quotedMessageType) {
                                case 'videoMessage':
                                case 'audioMessage':
                                case 'documentMessage':
                                case 'stickerMessage':
                                case 'documentWithCaptionMessage':
                                case 'imageMessage': // Handle quoted imageMessage
                                    mimeType = ((_e = contextInfo.quotedMessage[quotedMessageType]) === null || _e === void 0 ? void 0 : _e.mimetype) || null;
                                    break;
                                default:
                                    break;
                            }
                        }
                        break;
                }
                if (mimeType) {
                    return mimeType;
                }
            }
        }
        catch (error) {
            console.error('Error extracting MIME type:', error);
        }
        return null;
    });
}
//# sourceMappingURL=getMimeType.js.map