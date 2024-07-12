const { downloadContentFromMessage, downloadMediaMessage } = require('@whiskeysockets/baileys');

// Function to handle media messages
async function downloadMediaMsg(m) {
    if (!m.message) return null;

    const messageType = Object.keys(m.message)[0];
    const validTypes = ['imageMessage', 'videoMessage', 'audioMessage', 'documentMessage', 'documentWithCaptionMessage'];

    if (!validTypes.includes(messageType)) {
        return 'Provide a valid message (quoted messages are not valid)';
    }

    const buffer = await downloadMediaMessage(m, "buffer", {});

    const getExtension = (type) => {
        const extensions = {
            imageMessage: m.message.imageMessage.mimetype === 'image/png' ? '.png' : '.jpeg',
            videoMessage: '.mp4',
            audioMessage: '.mp3',
            documentMessage: `.${m.message.documentMessage.fileName.split('.').pop()}`,
            documentWithCaptionMessage: `.${m.message.documentWithCaptionMessage.message.documentMessage.fileName.split('.').pop()}`
        };
        return extensions[type];
    };

    const extension = getExtension(messageType);
    return { buffer, extension };
}

// Function to handle quoted media messages
async function downloadQuotedMediaMessage(m) {
    const quotedMsg = await getQuotedMedia(m);
    if (!quotedMsg) throw new Error('No quoted media message found.');

    const getExtension = (type) => {
        const extensions = { imageMessage: 'png', videoMessage: 'mp4', audioMessage: 'mp3' };
        return extensions[type] || 'bin';
    };

    const extension = getExtension(quotedMsg.type);
    const filename = quotedMsg.message.fileName || `media_${Date.now()}.${extension}`;
    const mimeType = quotedMsg.message.mimetype.split('/')[0];
    const mediaData = await downloadContentFromMessage(quotedMsg.message, mimeType);
    const buffer = await streamToBuffer(mediaData);

    return { buffer, extension, filename };
}

// Utility function to convert stream to buffer
async function streamToBuffer(stream) {
    return new Promise((resolve, reject) => {
        const chunks = [];
        stream.on('data', chunk => chunks.push(chunk));
        stream.on('end', () => resolve(Buffer.concat(chunks)));
        stream.on('error', reject);
    });
}

// Function to get quoted media
async function getQuotedMedia(m) {
    const findMediaMessage = (obj) => {
        if (!obj) return null;
        const mediaTypes = ['imageMessage', 'videoMessage', 'audioMessage', 'documentMessage'];
        for (const type of mediaTypes) {
            if (obj[type]) return { type, message: obj[type] };
        }
        if (typeof obj === 'object') {
            for (const key in obj) {
                const result = findMediaMessage(obj[key]);
                if (result) return result;
            }
        }
        return null;
    };

    for (const key in m.message) {
        const msg = m.message[key];
        if (msg?.contextInfo?.quotedMessage) {
            const media = findMediaMessage(msg.contextInfo.quotedMessage);
            if (media) return media;
        }
    }
    return false;
}

module.exports = {
    downloadMediaMsg,
    downloadQuotedMediaMessage,
    streamToBuffer,
    getQuotedMedia
};
