// src/index.js
const WhatsAppClient = require('./socket/sock');
const useMongoDBAuthState = require("./auth/MongoAuth");
const { extractMimeType } = require('./message/getMimeType');
const { extractQuotedMessage } = require('./message/getQuoted');
const { extractTextContent } = require('./message/getTextContent');
const { extractTimestamp } = require('./message/getTimestamp');
const { extractPollVoteMessage } = require('./message/getPollVote');
const { extractResponseTextContent } = require('./message/getResponseText');
const {
    downloadMediaMsg,
    downloadQuotedMediaMessage,
    streamToBuffer,
    getQuotedMedia
} = require('./message/downloadMedia');
const connMessage = require('./message/connMessage');
const {
    loadCommands,
    getCommand,
    getAllCommands
} = require('./utils/loadCommand');

module.exports = {
    WhatsAppClient,
    useMongoDBAuthState,
    connMessage,
    extractMimeType,
    extractQuotedMessage,
    extractTextContent,
    extractTimestamp,
    extractPollVoteMessage,
    downloadMediaMsg,
    downloadQuotedMediaMessage,
    streamToBuffer,
    getQuotedMedia,
    extractResponseTextContent,
    loadCommands,
    getCommand,
    getAllCommands
};
