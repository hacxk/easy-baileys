const { delay } = require('@whiskeysockets/baileys');

let socks;

/**
 * Sends a message with a presence update.
 * @param {object} sock - The WhatsApp socket instance.
 * @param {string} jid - The JID of the recipient.
 * @param {object} content - The content of the message.
 * @param {object} [options={}] - Additional options for the message.
 * @returns {Promise<object>} - The response from the sendMessage function.
 * @throws {Error} - If there is an error sending the message.
 */
const sendMessage = async (jid, content, options = {}) => {
    try {
        return await socks.sendMessage(jid, content, options);
    } catch (err) {
        throw new Error(`Error sending message: ${err.message}`);
    }
};

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
const sendMessageQuoted = async (jid, m, content, options = {}) => {
    try {
        return await socks.sendMessage(jid, content, { ...options, quoted: m });
    } catch (err) {
        throw new Error(`Error sending quoted message: ${err.message}`);
    }
};

/**
 * connMessage class for sending different types of messages.
 */
class connMessage {
    /**
   * Creates a new connMessage instance.
   * @param {object} sock - The Baileys socket instance.
   */
    constructor(sock) { // Add sock as a parameter
        this.sock = sock;
        socks = sock;
    }

    /**
     * Sends a sticker message.
     * @param {object} sock - The WhatsApp socket instance.
     * @param {object} m - The message object.
     * @param {Buffer|string} bufferOrUrl - The buffer or URL of the sticker.
     * @throws {Error} - If there is an error sending the sticker.
     */
    async sendSticker(m, bufferOrUrl) {
        try {
            const jid = m.key.remoteJid;
            await sendMessage(jid, { sticker: bufferOrUrl });
        } catch (err) {
            throw new Error(`Error in sendSticker: ${err.message}`);
        }
    }

    /**
     * Sends a sticker reply message.
     * @param {object} sock - The WhatsApp socket instance.
     * @param {object} m - The message object to quote.
     * @param {Buffer|string} bufferOrUrl - The buffer or URL of the sticker.
     * @throws {Error} - If there is an error sending the sticker reply.
     */
    async sendStickerReply(m, bufferOrUrl) {
        try {
            const jid = m.key.remoteJid;
            await sendMessageQuoted(jid, m, { sticker: bufferOrUrl });
        } catch (err) {
            throw new Error(`Error in sendStickerReply: ${err.message}`);
        }
    }

    /**
     * Sends an image message.
     * @param {object} sock - The WhatsApp socket instance.
     * @param {object} m - The message object.
     * @param {Buffer|string} bufferOrUrl - The buffer or URL of the image.
     * @param {string} caption - The caption for the image.
     * @throws {Error} - If there is an error sending the image.
     */
    async sendImage(m, bufferOrUrl, caption) {
        try {
            const jid = m.key.remoteJid;
            const options = typeof bufferOrUrl === 'string'
                ? { image: { url: bufferOrUrl }, caption }
                : { image: bufferOrUrl, caption };
            await sendMessage(jid, options);
        } catch (err) {
            throw new Error(`Error in sendImage: ${err.message}`);
        }
    }

    /**
     * Sends an image reply message.
     * @param {object} sock - The WhatsApp socket instance.
     * @param {object} m - The message object to quote.
     * @param {Buffer|string} bufferOrUrl - The buffer or URL of the image.
     * @param {string} caption - The caption for the image.
     * @throws {Error} - If there is an error sending the image reply.
     */
    async sendImageReply(m, bufferOrUrl, caption) {
        try {
            const jid = m.key.remoteJid;
            const options = typeof bufferOrUrl === 'string'
                ? { image: { url: bufferOrUrl }, caption }
                : { image: bufferOrUrl, caption };
            await sendMessageQuoted(jid, m, options);
        } catch (err) {
            throw new Error(`Error in sendImageReply: ${err.message}`);
        }
    }

    /**
     * Sends a video message.
     * @param {object} sock - The WhatsApp socket instance.
     * @param {object} m - The message object.
     * @param {Buffer|string} bufferOrUrl - The buffer or URL of the video.
     * @param {string} caption - The caption for the video.
     * @throws {Error} - If there is an error sending the video.
     */
    async sendVideo(m, bufferOrUrl, caption) {
        try {
            const jid = m.key.remoteJid;
            const options = typeof bufferOrUrl === 'string'
                ? { video: { url: bufferOrUrl }, caption }
                : { video: bufferOrUrl, caption };
            await sendMessage(jid, options);
        } catch (err) {
            throw new Error(`Error in sendVideo: ${err.message}`);
        }
    }

    /**
     * Sends a video reply message.
     * @param {object} sock - The WhatsApp socket instance.
     * @param {object} m - The message object to quote.
     * @param {Buffer|string} bufferOrUrl - The buffer or URL of the video.
     * @param {string} caption - The caption for the video.
     * @throws {Error} - If there is an error sending the video reply.
     */
    async sendVideoReply(m, bufferOrUrl, caption) {
        try {
            const jid = m.key.remoteJid;
            const options = typeof bufferOrUrl === 'string'
                ? { video: { url: bufferOrUrl }, caption }
                : { video: bufferOrUrl, caption };
            await sendMessageQuoted(jid, m, options);
        } catch (err) {
            throw new Error(`Error in sendVideoReply: ${err.message}`);
        }
    }

    /**
     * Sends a document message.
     * @param {object} sock - The WhatsApp socket instance.
     * @param {object} m - The message object.
     * @param {Buffer|string} bufferOrUrl - The buffer or URL of the document.
     * @param {string} mimetype - The MIME type of the document.
     * @param {string} fileName - The file name of the document.
     * @param {string} caption - The caption for the document.
     * @throws {Error} - If there is an error sending the document.
     */
    async sendDocument(m, bufferOrUrl, mimetype, fileName, caption) {
        try {
            const jid = m.key.remoteJid;
            const options = typeof bufferOrUrl === 'string'
                ? { document: { url: bufferOrUrl }, mimetype, fileName, caption }
                : { document: bufferOrUrl, mimetype, fileName, caption };
            await sendMessage(jid, options);
        } catch (err) {
            throw new Error(`Error in sendDocument: ${err.message}`);
        }
    }

    /**
     * Sends a document reply message.
     * @param {object} sock - The WhatsApp socket instance.
     * @param {object} m - The message object to quote.
     * @param {Buffer|string} bufferOrUrl - The buffer or URL of the document.
     * @param {string} mimetype - The MIME type of the document.
     * @param {string} fileName - The file name of the document.
     * @param {string} caption - The caption for the document.
     * @throws {Error} - If there is an error sending the document reply.
     */
    async sendDocumentReply(m, bufferOrUrl, mimetype, fileName, caption) {
        try {
            const jid = m.key.remoteJid;
            const options = typeof bufferOrUrl === 'string'
                ? { document: { url: bufferOrUrl }, mimetype, fileName, caption }
                : { document: bufferOrUrl, mimetype, fileName, caption };
            await sendMessageQuoted(jid, m, options);
        } catch (err) {
            throw new Error(`Error in sendDocumentReply: ${err.message}`);
        }
    }

    /**
     * Sends an audio message.
     * @param {object} sock - The WhatsApp socket instance.
     * @param {object} m - The message object.
     * @param {Buffer|string} bufferOrUrl - The buffer or URL of the audio.
     * @param {boolean} [ptt=false] - Whether the audio is a push-to-talk message.
     * @throws {Error} - If there is an error sending the audio.
     */
    async sendAudio(m, bufferOrUrl, ptt = false) {
        try {
            const jid = m.key.remoteJid;
            const options = typeof bufferOrUrl === 'string'
                ? { audio: { url: bufferOrUrl }, ptt, mimetype: 'audio/mpeg' }
                : { audio: bufferOrUrl, ptt, mimetype: 'audio/mpeg' };
            await sendMessage(jid, options);
        } catch (err) {
            throw new Error(`Error in sendAudio: ${err.message}`);
        }
    }

    /**
     * Sends an audio reply message.
     * @param {object} sock - The WhatsApp socket instance.
     * @param {object} m - The message object to quote.
     * @param {Buffer|string} bufferOrUrl - The buffer or URL of the audio.
     * @param {boolean} [ptt=false] - Whether the audio is a push-to-talk message.
     * @throws {Error} - If there is an error sending the audio reply.
     */
    async sendAudioReply(m, bufferOrUrl, ptt = false) {
        try {
            const jid = m.key.remoteJid;
            const options = typeof bufferOrUrl === 'string'
                ? { audio: { url: bufferOrUrl }, ptt, mimetype: 'audio/mpeg' }
                : { audio: bufferOrUrl, ptt, mimetype: 'audio/mpeg' };
            await sendMessageQuoted(jid, m, options);
        } catch (err) {
            throw new Error(`Error in sendAudioReply: ${err.message}`);
        }
    }

    /**
     * Sends a GIF message.
     * @param {object} sock - The WhatsApp socket instance.
     * @param {object} m - The message object.
     * @param {Buffer|string} bufferOrUrl - The buffer or URL of the GIF.
     * @param {boolean} [playback=true] - Whether the GIF should play back.
     * @throws {Error} - If there is an error sending the GIF.
     */
    async sendGif(m, bufferOrUrl, playback = true) {
        try {
            const jid = m.key.remoteJid;
            let gifBuffer;
            if (typeof bufferOrUrl === 'string') {
                const response = await fetch(bufferOrUrl);
                gifBuffer = await response.arrayBuffer();
            } else {
                gifBuffer = bufferOrUrl;
            }
            await sendMessage(jid, { video: gifBuffer, gifPlayback: playback });
        } catch (err) {
            throw new Error(`Error in sendGif: ${err.message}`);
        }
    }

    /**
     * Sends a GIF reply message.
     * @param {object} sock - The WhatsApp socket instance.
     * @param {object} m - The message object to quote.
     * @param {Buffer|string} bufferOrUrl - The buffer or URL of the GIF.
     * @param {boolean} [playback=true] - Whether the GIF should play back.
     * @throws {Error} - If there is an error sending the GIF reply.
     */
    async sendGifReply(m, bufferOrUrl, playback = true) {
        try {
            const jid = m.key.remoteJid;
            let gifBuffer;
            if (typeof bufferOrUrl === 'string') {
                const response = await fetch(bufferOrUrl);
                gifBuffer = await response.arrayBuffer();
            } else {
                gifBuffer = bufferOrUrl;
            }
            await sendMessageQuoted(jid, m, { video: gifBuffer, gifPlayback: playback });
        } catch (err) {
            throw new Error(`Error in sendGifReply: ${err.message}`);
        }
    }

    /**
     * Replies to a message with text.
     * @param {object} sock - The WhatsApp socket instance.
     * @param {object} m - The message object to quote.
     * @param {string} text - The text to reply with.
     * @throws {Error} - If there is an error replying to the message.
     */
    async reply(m, text) {
        try {
            await sendMessage(m.key.remoteJid, { text }, { quoted: m });
        } catch (err) {
            throw new Error(`Error in reply: ${err.message}`);
        }
    }

    /**
     * Sends a text message.
     * @param {object} sock - The WhatsApp socket instance.
     * @param {object} m - The message object.
     * @param {string} text - The text to send.
     * @throws {Error} - If there is an error sending the text.
     */
    async send(m, text) {
        try {
            await sendMessage(m.key.remoteJid, { text });
        } catch (err) {
            throw new Error(`Error in send: ${err.message}`);
        }
    }

    /**
     * Reacts to a message with an emoji.
     * @param {object} sock - The WhatsApp socket instance.
     * @param {object} m - The message object to react to.
     * @param {string} emoji - The emoji to react with.
     * @throws {Error} - If there is an error reacting to the message.
     */
    async react(m, emoji) {
        try {
            await sendMessage(m.key.remoteJid, { react: { text: emoji, key: m.key } });
        } catch (err) {
            throw new Error(`Error in react: ${err.message}`);
        }
    }

    /**
     * Edits a sent message.
     * @param {object} sock - The WhatsApp socket instance.
     * @param {object} m - The original message object.
     * @param {object} sentMessage - The sent message object.
     * @param {string} newMessage - The new message text.
     * @throws {Error} - If there is an error editing the message.
     */
    async editMsg(m, sentMessage, newMessage) {
        try {
            await sendMessage(m.key.remoteJid, { edit: sentMessage.key, text: newMessage, type: "MESSAGE_EDIT" });
        } catch (err) {
            throw new Error(`Error in editMsg: ${err.message}`);
        }
    }

    /**
     * Deletes a message in a group.
     * @param {object} sock - The WhatsApp socket instance.
     * @param {object} m - The message object to delete.
     * @returns {Promise<object>} - The response from the delete operation.
     * @throws {Error} - If there is an error deleting the message.
     */
    async deleteMsgGroup(m) {
        try {
            const { remoteJid } = m.key;
            const groupMetadata = await socks.groupMetadata(remoteJid);
            const botId = socks.user.id.replace(/:.*$/, "") + "@s.whatsapp.net";
            const botIsAdmin = groupMetadata.participants.some(p => p.id.includes(botId) && p.admin);

            if (!botIsAdmin) {
                throw new Error("I cannot delete messages because I am not an admin in this group.");
            }

            const isOwnMessage = m.key.participant === m?.message?.extendedTextMessage?.contextInfo?.participant;
            const stanId = m?.message?.extendedTextMessage?.contextInfo?.stanzaId;

            const messageToDelete = {
                key: {
                    remoteJid: m.key.remoteJid,
                    fromMe: isOwnMessage,
                    id: stanId,
                    participant: m?.message?.extendedTextMessage?.contextInfo?.participant
                }
            };

            const response = await socks.sendMessage(remoteJid, { delete: messageToDelete.key });
            await socks.sendMessage(remoteJid, { delete: m.key });
            return response;
        } catch (err) {
            throw new Error(`Error in deleteMsgGroup: ${err.message}`);
        }
    }

    /**
     * Deletes a message.
     * @param {object} sock - The WhatsApp socket instance.
     * @param {object} m - The message object to delete.
     * @returns {Promise<object>} - The response from the delete operation.
     * @throws {Error} - If there is an error deleting the message.
     */
    async deleteMsg(m) {
        try {
            const { remoteJid } = m.key;
            const isOwnMessage = m.key.participant === m?.message?.extendedTextMessage?.contextInfo?.participant;
            const stanId = m?.message?.extendedTextMessage?.contextInfo?.stanzaId;

            const messageToDelete = {
                key: {
                    remoteJid: m.key.remoteJid,
                    fromMe: isOwnMessage,
                    id: stanId,
                    participant: m?.message?.extendedTextMessage?.contextInfo?.participant
                }
            };


            const response = await socks.sendMessage(remoteJid, { delete: messageToDelete.key });
            await socks.sendMessage(remoteJid, { delete: m.key });
            return response;
        } catch (err) {
            throw new Error(`Error in deleteMsg: ${err.message}`);
        }
    }

    /**
  * Recursively finds a path in an object where a specified value is located.
  * @param {object} obj - The object to search.
  * @param {any} targetValue - The value to search for within the object.
  * @param {string} [currentPath=""] - The current path within the object (used internally for recursion).
  * @returns {Promise<string|null>} - The path to the value if found, otherwise null.
  * @throws {Error} - Throws an error if there's an issue during the search process.
  */
    async findValue(obj, targetValue, currentPath = "") {
        try {
            if (typeof obj !== "object" || obj === null) {
                return null;
            }

            for (const key in obj) {
                const newPath = currentPath ? `${currentPath}.${key}` : key;

                if (obj[key] === targetValue) {
                    return newPath;
                } else {
                    const result = await this.findValue(obj[key], targetValue, newPath); // Corrected to use `this.findValue`
                    if (result) {
                        return result;
                    }
                }
            }

            return null;
        } catch (err) {
            throw new Error(`Error in findValue: ${err.message}`);
        }
    }

    /**
 * Recursively finds an object in another object where a specified value is located.
 * @param {object} obj - The object to search.
 * @param {any} targetValue - The value to search for within the object.
 * @returns {Promise<any|null>} - The object value if found, otherwise null.
 * @throws {Error} - Throws an error if there's an issue during the search process.
 */
    async findObject(obj, targetValue) {
        try {
            if (typeof obj !== "object" || obj === null) {
                return null;
            }

            for (const key in obj) {
                if (obj[key] === targetValue) {
                    return obj; // Return the current object if value matches
                } else if (typeof obj[key] === "object") {
                    const result = await this.findObject(obj[key], targetValue);
                    if (result !== null) {
                        return result;
                    }
                }
            }

            return null;
        } catch (err) {
            throw new Error(`Error in findObject: ${err.message}`);
        }
    }

    /**
   * Adds a participant to a group.
   * @param {string} groupJid - The JID of the group.
   * @param {string} participantJid - The JID of the participant to add.
   * @throws {Error} - If the bot is not an admin or there's an error adding the participant.
   */
    async add(groupJid, participantJid) {
        try {
            const groupMetadata = await socks.groupMetadata(groupJid);

            // Check if the bot is an admin
            if (!await this.isAdmin(groupJid)) {
                throw new Error("I'm not an admin in this group.");
            }

            await socks.groupParticipantsUpdate(groupJid, [participantJid], "add");
        } catch (err) {
            throw new Error(`Error adding participant: ${err.message}`);
        }
    }

    /**
     * Removes a participant from a group.
     * @param {string} groupJid - The JID of the group.
     * @param {string} participantJid - The JID of the participant to remove.
     * @throws {Error} - If the bot is not an admin or there's an error removing the participant.
     */
    async remove(groupJid, participantJid) {
        try {
            const groupMetadata = await socks.groupMetadata(groupJid);

            // Check if the bot is an admin
            if (!await this.isAdmin(groupJid)) {
                throw new Error("I'm not an admin in this group.");
            }

            await socks.groupParticipantsUpdate(groupJid, [participantJid], "remove");
        } catch (err) {
            throw new Error(`Error removing participant: ${err.message}`);
        }
    }

    /**
     * Checks if the bot is an admin in a group.
     * @param {string} groupJid - The JID of the group.
     * @returns {Promise<boolean>} - True if the bot is an admin, false otherwise.
     * @throws {Error} - If there's an error fetching group metadata.
     */
    async isAdmin(groupJid) {
        try {
            const groupMetadata = await socks.groupMetadata(groupJid);
            const botJid = socks.user.id.replace(/:.*$/, "") + "@s.whatsapp.net";
            return groupMetadata.participants.some(p => p.id === botJid && p.admin);
        } catch (err) {
            throw new Error(`Error checking admin status: ${err.message}`);
        }
    }

    /**
     * Promotes or demotes a participant in a group.
     * @param {string} groupJid - The JID of the group.
     * @param {string} participantJid - The JID of the participant to promote/demote.
     * @param {string} action - Either "promote" or "demote".
     * @throws {Error} - If the bot is not an admin or there's an error updating the participant's status.
     */
    async updateParticipantStatus(groupJid, participantJid, action) {
        try {
            if (!await this.isAdmin(groupJid)) {
                throw new Error("I'm not an admin in this group.");
            }

            if (action !== "promote" && action !== "demote") {
                throw new Error("Invalid action. Use 'promote' or 'demote'.");
            }

            await socks.groupParticipantsUpdate(groupJid, [participantJid], action);
        } catch (err) {
            throw new Error(`Error ${action}ing participant: ${err.message}`);
        }
    }

    /**
     * Updates group settings.
     * @param {string} groupJid - The JID of the group.
     * @param {object} settings - An object containing the settings to update.
     * @throws {Error} - If the bot is not an admin or there's an error updating the group settings.
     */
    async updateGroupSettings(groupJid, settings) {
        try {
            if (!await this.isAdmin(groupJid)) {
                throw new Error("I'm not an admin in this group.");
            }

            await socks.groupSettingUpdate(groupJid, settings);
        } catch (err) {
            throw new Error(`Error updating group settings: ${err.message}`);
        }
    }

    /**
     * Bans a user from joining a group.
     * @param {string} groupJid - The JID of the group.
     * @param {string} userJid - The JID of the user to ban.
     * @throws {Error} - If the bot is not an admin or there's an error banning the user.
     */
    async banUser(groupJid, userJid) {
        try {
            if (!await this.isAdmin(groupJid)) {
                throw new Error("I'm not an admin in this group.");
            }

            await socks.groupParticipantsUpdate(groupJid, [userJid], "remove");
            // Note: There's no direct "ban" function in Baileys, so we remove and then could maintain a ban list
        } catch (err) {
            throw new Error(`Error banning user: ${err.message}`);
        }
    }

    /**
     * Unbans a user from a group.
     * @param {string} groupJid - The JID of the group.
     * @param {string} userJid - The JID of the user to unban.
     * @throws {Error} - If the bot is not an admin or there's an error unbanning the user.
     */
    async unbanUser(groupJid, userJid) {
        try {
            if (!await this.isAdmin(groupJid)) {
                throw new Error("I'm not an admin in this group.");
            }

            // Note: This would involve removing the user from a maintained ban list
            // For now, we'll just simulate unbanning by allowing them to be added back
            await socks.groupParticipantsUpdate(groupJid, [userJid], "add");
        } catch (err) {
            throw new Error(`Error unbanning user: ${err.message}`);
        }
    }

    /**
     * Generates a new invite link for a group.
     * @param {string} groupJid - The JID of the group.
     * @returns {Promise<string>} - The new invite link.
     * @throws {Error} - If the bot is not an admin or there's an error generating the invite link.
     */
    async generateInviteLink(groupJid) {
        try {
            if (!await this.isAdmin(groupJid)) {
                throw new Error("I'm not an admin in this group.");
            }

            const inviteCode = await socks.groupInviteCode(groupJid);
            return `https://chat.whatsapp.com/${inviteCode}`;
        } catch (err) {
            throw new Error(`Error generating invite link: ${err.message}`);
        }
    }

    /**
     * Revokes the current invite link for a group.
     * @param {string} groupJid - The JID of the group.
     * @returns {Promise<string>} - The new invite link after revocation.
     * @throws {Error} - If the bot is not an admin or there's an error revoking the invite link.
     */
    async revokeInviteLink(groupJid) {
        try {
            if (!await this.isAdmin(groupJid)) {
                throw new Error("I'm not an admin in this group.");
            }

            await socks.groupRevokeInvite(groupJid);
            return await this.generateInviteLink(groupJid);
        } catch (err) {
            throw new Error(`Error revoking invite link: ${err.message}`);
        }
    }

    /**
     * Updates the group subject (name).
     * @param {string} groupJid - The JID of the group.
     * @param {string} newSubject - The new subject for the group.
     * @throws {Error} - If the bot is not an admin or there's an error updating the group subject.
     */
    async updateGroupSubject(groupJid, newSubject) {
        try {
            if (!await this.isAdmin(groupJid)) {
                throw new Error("I'm not an admin in this group.");
            }

            await socks.groupUpdateSubject(groupJid, newSubject);
        } catch (err) {
            throw new Error(`Error updating group subject: ${err.message}`);
        }
    }

    /**
     * Updates the group description.
     * @param {string} groupJid - The JID of the group.
     * @param {string} newDescription - The new description for the group.
     * @throws {Error} - If the bot is not an admin or there's an error updating the group description.
     */
    async updateGroupDescription(groupJid, newDescription) {
        try {
            if (!await this.isAdmin(groupJid)) {
                throw new Error("I'm not an admin in this group.");
            }

            await socks.groupUpdateDescription(groupJid, newDescription);
        } catch (err) {
            throw new Error(`Error updating group description: ${err.message}`);
        }
    }

    /**
     * Updates who can send messages in the group.
     * @param {string} groupJid - The JID of the group.
     * @param {string} setting - The new setting: 'all' or 'admin'.
     * @throws {Error} - If the bot is not an admin or there's an error updating the group settings.
     */
    async updateGroupMessagesSettings(groupJid, setting) {
        try {
            if (!await this.isAdmin(groupJid)) {
                throw new Error("I'm not an admin in this group.");
            }

            if (setting !== 'all' && setting !== 'admin') {
                throw new Error("Invalid setting. Use 'all' or 'admin'.");
            }

            await socks.groupSettingUpdate(groupJid, setting);
        } catch (err) {
            throw new Error(`Error updating group message settings: ${err.message}`);
        }
    }

    /**
    * Schedules a message to be sent at a specific time.
    * @param {string} jid - The JID of the recipient.
    * @param {object} content - The content of the message.
    * @param {Date} sendTime - The time to send the message.
    * @throws {Error} - If there's an error scheduling the message.
    */
    async scheduleMessage(jid, content, sendTime) {
        try {
            const now = new Date();
            if (sendTime <= now) {
                throw new Error("Scheduled time must be in the future.");
            }

            const timeoutId = setTimeout(async () => {
                await this.send({ key: { remoteJid: jid } }, content);
                this.scheduledMessages = this.scheduledMessages.filter(msg => msg.timeoutId !== timeoutId);
            }, sendTime - now);

            this.scheduledMessages.push({ jid, content, sendTime, timeoutId });
        } catch (err) {
            throw new Error(`Error scheduling message: ${err.message}`);
        }
    }

    /**
     * Cancels a scheduled message.
     * @param {number} index - The index of the scheduled message to cancel.
     * @throws {Error} - If there's an error cancelling the scheduled message.
     */
    cancelScheduledMessage(index) {
        try {
            if (index < 0 || index >= this.scheduledMessages.length) {
                throw new Error("Invalid scheduled message index.");
            }

            clearTimeout(this.scheduledMessages[index].timeoutId);
            this.scheduledMessages.splice(index, 1);
        } catch (err) {
            throw new Error(`Error cancelling scheduled message: ${err.message}`);
        }
    }

    /**
     * Sends a message to multiple recipients.
     * @param {string[]} jids - Array of JIDs to send the message to.
     * @param {object} content - The content of the message.
     * @throws {Error} - If there's an error sending the bulk message.
     */
    async sendBulkMessage(jids, content) {
        try {
            const results = await Promise.allSettled(
                jids.map(jid => this.send({ key: { remoteJid: jid } }, content))
            );

            const failures = results.filter(result => result.status === 'rejected');
            if (failures.length > 0) {
                console.warn(`Failed to send message to ${failures.length} recipients.`);
            }
        } catch (err) {
            throw new Error(`Error sending bulk message: ${err.message}`);
        }
    }

    /**
     * Downloads media from a message.
     * @param {object} m - The message object containing media.
     * @returns {Promise<Buffer>} - The downloaded media as a buffer.
     * @throws {Error} - If there's an error downloading the media.
     */
    async downloadMedia(m) {
        try {
            const buffer = await socks.downloadMediaMessage(m);
            return buffer;
        } catch (err) {
            throw new Error(`Error downloading media: ${err.message}`);
        }
    }


    /**
     * Creates a poll in a group chat.
     * @param {string} groupJid - The JID of the group.
     * @param {string} question - The poll question.
     * @param {string[]} options - Array of poll options.
     * @throws {Error} - If there's an error creating the poll.
     */
    async createPoll(groupJid, question, options) {
        try {
            await socks.sendMessage(groupJid, {
                poll: {
                    name: question,
                    values: options,
                    selectableCount: 1
                }
            });
        } catch (err) {
            throw new Error(`Error creating poll: ${err.message}`);
        }
    }

    /**
     * Updates the bot's status.
     * @param {string} status - The new status text.
     * @throws {Error} - If there's an error updating the status.
     */
    async updateStatus(status) {
        try {
            await socks.updateProfileStatus(status);
        } catch (err) {
            throw new Error(`Error updating status: ${err.message}`);
        }
    }

}

module.exports = connMessage;