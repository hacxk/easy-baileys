import { proto } from '@whiskeysockets/baileys';
import { Readable } from 'stream';
interface Message extends proto.IWebMessageInfo {
    message?: {
        [key: string]: any;
    };
}
interface QuotedMedia {
    type: string;
    message: any;
}
/**
 * Downloads media message content from a given message.
 *
 * @async
 * @function downloadMediaMsg
 * @param {Message} m - The message object containing the media.
 * @returns {Promise<{ buffer: Buffer, extension: string } | null | string>} The media buffer and its extension, null if no message, or a string if an invalid message type.
 */
declare function downloadMediaMsg(m: Message): Promise<{
    buffer: Buffer;
    extension: string;
} | null | string>;
/**
 * Downloads media content from a quoted message.
 *
 * @async
 * @function downloadQuotedMediaMessage
 * @param {Message} m - The message object containing the quoted media.
 * @returns {Promise<{ buffer: Buffer, extension: string, filename: string }>} The media buffer, extension, and filename.
 * @throws {Error} If no quoted media message is found.
 */
declare function downloadQuotedMediaMessage(m: Message): Promise<{
    buffer: Buffer;
    extension: string;
    filename: string;
}>;
/**
 * Converts a stream into a buffer.
 *
 * @async
 * @function streamToBuffer
 * @param {Readable} stream - The stream to convert.
 * @returns {Promise<Buffer>} The buffer containing the stream data.
 */
declare function streamToBuffer(stream: Readable): Promise<Buffer>;
/**
 * Retrieves quoted media from a message.
 *
 * @async
 * @function getQuotedMedia
 * @param {Message} m - The message object containing the quoted media.
 * @returns {Promise<QuotedMedia | boolean>} The media type and message object, or false if no media is found.
 */
declare function getQuotedMedia(m: Message): Promise<QuotedMedia | boolean>;
export { downloadMediaMsg, downloadQuotedMediaMessage, streamToBuffer, getQuotedMedia };
//# sourceMappingURL=downloadMedia.d.ts.map