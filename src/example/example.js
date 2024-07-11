// This is a Example Code How You Can Create a Succesfull Socket Connection With Whatsapp and Get a Pairing Code

const WhatsAppClient = require('../socket/sock')

    (async () => {
        try {
            const customOptions = {
                browser: ["Ubuntu", "Chrome", "20.0.04"],
                printQRInTerminal: false,
                mobile: false,
            };

            const client = await WhatsAppClient.create('./auth', customOptions);
            const sock = client.getSocket();
            const code = await client.getPairingCode(94773255188);
            console.log(code); // This should now log the correct pairing code

        } catch (error) {
            console.error('Error initializing WhatsApp client:', error.message);
        }
    })();

// ----------------------------------------------------------------------------------------------------------------------------------------- \\

// This is a Example Code Shows How You Can Create a Succesfull Socket Connection With Whatsapp and Get a QR CODE. (QR CODE LOGO ON CONSOLE/TERMINAL)

(async () => {
    try {
        const customOptions = {
            browser: ["Ubuntu", "Chrome", "20.0.04"],
            printQRInTerminal: true,
            mobile: false,
        };

        const client = await WhatsAppClient.create('./auth', customOptions);
        const sock = client.getSocket();

    } catch (error) {
        console.error('Error initializing WhatsApp client:', error.message);
    }
})();
