import WhatsAppClient from './socket/sock';
import { extractMimeType } from './message/getMimeType';
import { extractQuotedMessage } from './message/getQuoted';
import { extractTextContent } from './message/getTextContent';
import { extractTimestamp } from './message/getTimestamp';
import { extractPollVoteMessage } from './message/getPollVote';
import { extractResponseTextContent } from './message/getResponseText';
import { downloadMediaMsg, downloadQuotedMediaMessage, streamToBuffer, getQuotedMedia } from './message/downloadMedia';
declare const connMessage: any;
import { loadCommands, getCommand, getAllCommands } from './utils/loadCommand';
export { WhatsAppClient, connMessage, extractMimeType, extractQuotedMessage, extractTextContent, extractTimestamp, extractPollVoteMessage, downloadMediaMsg, downloadQuotedMediaMessage, streamToBuffer, getQuotedMedia, extractResponseTextContent, loadCommands, getCommand, getAllCommands };
//# sourceMappingURL=index.d.ts.map