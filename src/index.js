// src/index.js
const WhatsAppClient = require('./socket/sock');
const { extractMimeType } = require('./message/getMimeType');
const { extractQuotedMessage } = require('./message/getQuoted');
const { extractTextContent } = require('./message/getTextContent');
const { extractTimestamp } = require('./message/getTimestamp');
const { extractPollVoteMessage } = require('./message/getPollVote');

module.exports = {
    WhatsAppClient,
    extractMimeType,
    extractQuotedMessage,
    extractTextContent,
    extractTimestamp,
    extractPollVoteMessage
};
