const WhatsAppClient = require('easy-baileys');


(async () => {
    try {
        const customOptions = {
            browser: ["Ubuntu", "Chrome", "20.0.04"],
            printQRInTerminal: true, // Set to true for QR code in terminal
            mobile: false,
        };


        // Example using MultiFile authentication
        const client = await WhatsAppClient.createMultiAuth('./hacxk', customOptions);
        const sock = await client.getSocket();
        
        sock.ev.on("messages.upsert", async ({ messages }) => {
            for (const m of messages) {
                console.log(m)
                if (m.message?.conversation.toLowerCase() === 'hi') {
                    await sock.reply(m, 'Hello! 👋');
                }
            }
        });

    } catch (error) {
        console.error('Error initializing WhatsApp client:', error.message);
    }
})();
