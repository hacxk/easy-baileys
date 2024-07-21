interface SendMessageOptions {
    [key: string]: any;
}
/**
 * Sends a message with a presence update.
 * @param {object} sock - The WhatsApp socket instance.
 * @param {string} jid - The JID of the recipient.
 * @param {object} content - The content of the message.
 * @param {object} [options={}] - Additional options for the message.
 * @returns {Promise<object>} - The response from the sendMessage function.
 * @throws {Error} - If there is an error sending the message.
 */
declare const sendMessage: (sock: any, jid: string, content: any, options?: SendMessageOptions) => Promise<object>;
/**
 * Sends a quoted message with a presence update.
 * @param {object} sock - The WhatsApp socket instance.
 * @param {string} jid - The JID of the recipient.
 * @param {object} m - The message object to quote.
 * @param {object} content - The content of the message.
 * @param {object} [options={}] - Additional options for the message.
 * @returns {Promise<object>} - The response from the sendMessageQuoted function.
 * @throws {Error} - If there is an error sending the quoted message.
 */
declare const sendMessageQuoted: (sock: any, jid: string, m: any, content: any, options?: SendMessageOptions) => Promise<object>;
declare class ConnMessage {
    private scheduledMessages;
    constructor();
    /**
     * Sends a sticker message.
     * @param {object} m - The message object.
     * @param {Buffer|string} bufferOrUrl - The buffer or URL of the sticker.
     * @throws {Error} - If there is an error sending the sticker.
     */
    sendSticker(m: any, bufferOrUrl: Buffer | string): Promise<void>;
    /**
     * Sends a sticker reply message.
     * @param {object} m - The message object to quote.
     * @param {Buffer|string} bufferOrUrl - The buffer or URL of the sticker.
     * @throws {Error} - If there is an error sending the sticker reply.
     */
    sendStickerReply(m: any, bufferOrUrl: Buffer | string): Promise<void>;
    /**
     * Sends an image message.
     * @param {object} m - The message object.
     * @param {Buffer|string} bufferOrUrl - The buffer or URL of the image.
     * @param {string} caption - The caption for the image.
     * @throws {Error} - If there is an error sending the image.
     */
    sendImage(m: any, bufferOrUrl: Buffer | string, caption: string): Promise<void>;
    /**
  * Sends an image reply message.
  * @param {object} m - The message object to quote.
  * @param {Buffer|string} bufferOrUrl - The buffer or URL of the image.
  * @param {string} caption - The caption for the image.
  * @throws {Error} - If there is an error sending the image reply.
  */
    sendImageReply(m: any, bufferOrUrl: Buffer | string, caption: string): Promise<void>;
    /**
    * Sends a video message.
    * @param {object} m - The message object.
    * @param {Buffer|string} bufferOrUrl - The buffer or URL of the video.
    * @param {string} caption - The caption for the video.
    * @throws {Error} - If there is an error sending the video.
    */
    sendVideo(m: any, bufferOrUrl: Buffer | string, caption: string): Promise<void>;
    /**
     * Sends a video reply message.
     * @param {object} m - The message object to quote.
     * @param {Buffer|string} bufferOrUrl - The buffer or URL of the video.
     * @param {string} caption - The caption for the video.
     * @throws {Error} - If there is an error sending the video reply.
     */
    sendVideoReply(m: any, bufferOrUrl: Buffer | string, caption: string): Promise<void>;
    /**
      * Sends a document message.
      * @param {object} m - The message object.
      * @param {Buffer|string} bufferOrUrl - The buffer or URL of the document.
      * @param {string} mimetype - The MIME type of the document.
      * @param {string} fileName - The file name of the document.
      * @param {string} caption - The caption for the document.
      * @throws {Error} - If there is an error sending the document.
      */
    sendDocument(m: any, bufferOrUrl: Buffer | string, mimetype: string, fileName: string, caption: string): Promise<void>;
    /**
       * Sends a document reply message.
       * @param {object} m - The message object to quote.
       * @param {Buffer|string} bufferOrUrl - The buffer or URL of the document.
       * @param {string} mimetype - The MIME type of the document.
       * @param {string} fileName - The file name of the document.
       * @param {string} caption - The caption for the document.
       * @throws {Error} - If there is an error sending the document reply.
       */
    sendDocumentReply(m: any, bufferOrUrl: Buffer | string, mimetype: string, fileName: string, caption: string): Promise<void>;
    /**
  * Sends an audio message.
  * @param {object} m - The message object.
  * @param {Buffer|string} bufferOrUrl - The buffer or URL of the audio.
  * @param {boolean} [ptt=false] - Whether the audio is a push-to-talk message.
  * @throws {Error} - If there is an error sending the audio.
  */
    sendAudio(m: any, bufferOrUrl: Buffer | string, ptt?: boolean): Promise<void>;
    /**
     * Sends an audio reply message.
     * @param {object} m - The message object to quote.
     * @param {Buffer|string} bufferOrUrl - The buffer or URL of the audio.
     * @param {boolean} [ptt=false] - Whether the audio is a push-to-talk message.
     * @throws {Error} - If there is an error sending the audio reply.
     */
    sendAudioReply(m: any, bufferOrUrl: Buffer | string, ptt?: boolean): Promise<void>;
    /**
     * Sends a GIF message.
     * @param {object} m - The message object.
     * @param {Buffer|string} bufferOrUrl - The buffer or URL of the GIF.
     * @param {boolean} [playback=true] - Whether the GIF should play back.
     * @throws {Error} - If there is an error sending the GIF.
     */
    sendGif(m: any, bufferOrUrl: Buffer | string, playback?: boolean): Promise<void>;
    /**
     * Sends a GIF reply message.
     * @param {object} m - The message object to quote.
     * @param {Buffer|string} bufferOrUrl - The buffer or URL of the GIF.
     * @param {boolean} [playback=true] - Whether the GIF should play back.
     * @throws {Error} - If there is an error sending the GIF reply.
     */
    sendGifReply(m: any, bufferOrUrl: Buffer | string, playback?: boolean): Promise<void>;
    /**
     * Replies to a message with text.
     * @param {object} m - The message object to quote.
     * @param {string} text - The text to reply with.
     * @throws {Error} - If there is an error replying to the message.
     */
    reply(m: any, text: string): Promise<void>;
    /**
     * Sends a text message.
     * @param {object} m - The message object.
     * @param {string} text - The text to send.
     * @throws {Error} - If there is an error sending the text.
     */
    send(m: any, text: string): Promise<void>;
    /**
     * Reacts to a message with an emoji.
     * @param {object} m - The message object to react to.
     * @param {string} emoji - The emoji to react with.
     * @throws {Error} - If there is an error reacting to the message.
     */
    react(m: any, emoji: string): Promise<void>;
    /**
     * Edits a sent message.
     * @param {object} m - The original message object.
     * @param {object} sentMessage - The sent message object.
     * @param {string} newMessage - The new message text.
     * @throws {Error} - If there is an error editing the message.
     */
    editMsg(m: any, sentMessage: any, newMessage: string): Promise<void>;
}
export { sendMessage, sendMessageQuoted, ConnMessage };
//# sourceMappingURL=connMessage.d.ts.map