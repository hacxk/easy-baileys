# easy-baileys 🤖

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![npm version](https://img.shields.io/npm/v/easy-baileys.svg)](https://www.npmjs.com/package/easy-baileys)

**easy-baileys** is a Node.js package designed to streamline WhatsApp connectivity and automate message handling, offering robust flexibility. At its core, it leverages the powerful capabilities of [@whiskeysockets/baileys](https://github.com/WhiskeySockets/Baileys).

## Installation 📦

```bash
npm install easy-baileys
```

## Usage 🛠️

### 1. Import the module:

```javascript
const WhatsAppClient = require('easy-baileys');
```

### 2. Create a client instance:

```javascript
const customOptions = {
  browser: ["Ubuntu", "Chrome", "20.0.04"],
  printQRInTerminal: false, // Set to true for QR code in terminal
  mobile: false,
};

const client = await WhatsAppClient.create('./auth', customOptions);
```

### 3. Obtain a pairing code (Optional):

```javascript
const sock = client.getSocket();
const code = await client.getPairingCode(123456789); // Your whatsapp number (Without +)
console.log(code); 
```

## Example: Pairing Code with Validated Phone Number 📞

```javascript
const WhatsAppClient = require('easy-baileys');

(async () => {
  try {
    const customOptions = {
        browser: ["Ubuntu", "Chrome", "20.0.04"],
        printQRInTerminal: false, // Set to true for QR code in terminal
        mobile: false,
    };

    const client = await WhatsAppClient.create('./auth', customOptions);
    const sock = client.getSocket();
    const code = await client.getPairingCode(123456789); // Your whatsapp number (Without +)
    console.log(code); // Outputs code with validated phone number
  } catch (error) {
    console.error('Error initializing WhatsApp client:', error.message);
  }
})();
```

## Example: Display QR Code in Terminal 📱

```javascript
(async () => {
  try {
    const customOptions = {
      // ... other options
      printQRInTerminal: true, 
    };
    const client = await WhatsAppClient.create('./auth', customOptions);
    const sock = client.getSocket();
  } catch (error) {
    console.error('Error initializing WhatsApp client:', error.message);
  }
})();
```

The QR code will be printed directly in your terminal.

### Handling Message Upserts

One of the key features of `@whiskeysockets/baileys` is the ability to handle incoming messages. The library provides an event called `messages.upsert` that you can listen to for new messages. Here’s how you can set up a listener for this event:

```javascript
sock.ev.on("messages.upsert", async ({ messages }) => {
    for (const m of messages) {
        console.log(m);
    }
});
```

### Detailed Example

Let's break down the example to understand how it works:

1. **Event Listener Setup**:
    ```javascript
    sock.ev.on("messages.upsert", async ({ messages }) => {
    ```
    This line sets up an event listener for the `messages.upsert` event. The `async` keyword indicates that the function will be asynchronous, allowing you to use `await` within it.

2. **Iterating Through Messages**:
    ```javascript
    for (const m of messages) {
    ```
    This line starts a loop that will iterate over each message in the `messages` array. This is useful because `messages.upsert` can provide multiple messages at once.

3. **Logging Each Message**:
    ```javascript
    console.log(m);
    ```
    This line logs each message to the console. In a real application, you might want to process the message, save it to a database, or perform some other action.

### Real-World Use Case

In a real-world scenario, you might want to do more than just log the messages. Here's an extended example that checks if the message contains text and replies to the sender:

```javascript
sock.ev.on("messages.upsert", async ({ messages }) => {
    for (const m of messages) {
        console.log(m);
        
        if (m.message && m.message.conversation) {
            const sender = m.key.remoteJid;
            const messageText = m.message.conversation;
            
            console.log(`Message from ${sender}: ${messageText}`);
            
            // Reply to the sender
            await sock.sendMessage(sender, { text: `You said: ${messageText}` });
        }
    }
});
```

In this example:
- We first check if the message contains a `conversation` field, which holds the text of the message.
- We then extract the sender's ID and the message text.
- Finally, we use the `sendMessage` function to reply to the sender with their own message.

### Conclusion

The `@whiskeysockets/baileys` library makes it straightforward to handle WhatsApp messages in a Node.js environment. By setting up event listeners and processing incoming messages, you can build robust applications that interact with WhatsApp users in real-time.

For more detailed information and advanced usage, refer to the official [Baileys documentation](https://github.com/@whiskeysockets/Baileys).


## Configuration Options ⚙️

- `browser`: An array specifying the browser information (e.g., `["Ubuntu", "Chrome", "20.0.04"]`).
- `printQRInTerminal`: (Boolean) Display the QR code in the terminal (default: `false`).
- `mobile`: (Boolean) Set to `true` if connecting from a mobile device.
- **Refer to the `@whiskeysockets/baileys` documentation for additional options.**

## Contributing 🤝

Contributions are welcome! Please feel free to submit issues and pull requests.

## License 📄

This project is licensed under the MIT License. See the [LICENSE.md](LICENSE.md) file for details.

---