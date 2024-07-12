async function extractResponseTextContent(sock, m, sentMessage, timeout) {
    const key = m.key
    return new Promise((resolve, reject) => {
        const timer = timeout && timeout > 0 ? setTimeout(() => {
            sock.ev.off('messages.upsert', replyHandler);
            reject(new Error('Timeout exceeded while waiting for response'));
        }, timeout) : null;

        const replyHandler = async ({ messages }) => {
            const msg = messages[0];
            const senderJid = key.key.remoteJid;
            const isValidReply = (
                (msg.message?.extendedTextMessage?.contextInfo?.stanzaId === sentMessage.key.id ||
                    msg.message?.conversation?.contextInfo?.stanzaId === sentMessage.key.id) &&
                (senderJid.endsWith('@g.us') ? key.key.participant : key.key.remoteJid) ===
                (msg.key.remoteJid.endsWith('@g.us') ? msg.key.participant : msg.key.remoteJid)
            );

            if (isValidReply) {
                if (timer) clearTimeout(timer);
                sock.ev.off('messages.upsert', replyHandler);
                const responseText = msg.message?.extendedTextMessage?.text || msg.message?.conversation;
                resolve({ key: msg.key, message: msg.message, response: responseText });
            }
        };

        listeners.push(replyHandler);
        if (listeners.length > MAX_LISTENERS) {
            const oldestListener = listeners.shift();
            sock.ev.off('messages.upsert', oldestListener);
        }

        sock.ev.on('messages.upsert', replyHandler);
    });
}

module.exports = { extractResponseTextContent }