
# easy-baileys 🤖

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![npm version](https://img.shields.io/npm/v/easy-baileys.svg)](https://www.npmjs.com/package/easy-baileys)

**easy-baileys** is a Node.js package designed to streamline WhatsApp connectivity and automate message handling, offering robust flexibility. It leverages the powerful capabilities of [@whiskeysockets/baileys](https://github.com/WhiskeySockets/Baileys).

## Installation 📦

```bash
npm install easy-baileys
```

## Usage 🛠️

### 1. Importing the Module

```javascript
const WhatsAppClient = require('easy-baileys');
```

### 2. Creating a Client Instance with MongoDB Authentication

```javascript
const WhatsAppClient = require('easy-baileys');

const customOptions = {
  browser: ["Ubuntu", "Chrome", "20.0.04"],
  printQRInTerminal: false, // Set to true for QR code in terminal
  mobile: false,
};

(async () => {
  try {
    // Initialize WhatsAppClient with MongoDB authentication
    const clientMongo = await WhatsAppClient.createMongoAuth('MongoDBURLHERE', customOptions);
    const sockMongo = await clientMongo.getSocket();
    const connMongo = await clientMongo.getSocketMsg();

    // Example event listener for incoming messages
    sockMongo.ev.on("messages.upsert", async ({ messages }) => {
      for (const m of messages) {
        if (m.message?.conversation.toLowerCase() === 'hi') {
          await connMongo.reply(sockMongo, m, 'Hello! 👋');
        }
      }
    });

  } catch (error) {
    console.error('Error initializing WhatsApp client with MongoDB authentication:', error.message);
  }
})();
```

### 3. Creating a Client Instance with MultiFile Authentication

```javascript
const WhatsAppClient = require('easy-baileys');

const customOptions = {
  browser: ["Ubuntu", "Chrome", "20.0.04"],
  printQRInTerminal: false, // Set to true for QR code in terminal
  mobile: false,
};

(async () => {
  try {
    // Initialize WhatsAppClient with MultiFile authentication
    const clientMulti = await WhatsAppClient.createMultiAuth('./authFiles', customOptions);
    const sockMulti = await clientMulti.getSocket();
    const connMulti = await clientMulti.getSocketMsg();

    // Example event listener for incoming messages
    sockMulti.ev.on("messages.upsert", async ({ messages }) => {
      for (const m of messages) {
        if (m.message?.conversation.toLowerCase() === 'hi') {
          await connMulti.reply(sockMulti, m, 'Hello! 👋');
        }
      }
    });

  } catch (error) {
    console.error('Error initializing WhatsApp client with MultiFile authentication:', error.message);
  }
})();
```

### Explanation

- **MongoDB Authentication Example**: Initializes the `WhatsAppClient` instance using MongoDB credentials and sets up event listeners to respond to messages.
- **MultiFile Authentication Example**: Initializes the `WhatsAppClient` instance using authentication files stored locally and handles incoming messages similarly.

### 4. Obtain a pairing code (Optional)

```javascript
const sock = client.getSocket();
const code = await client.getPairingCode(123456789); // Your WhatsApp number (Without +)
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

    const client = await WhatsAppClient.createMultiAuth('./auth', customOptions);
    const sock = await client.getSocket();
    const code = await client.getPairingCode(123456789); // Your WhatsApp number (Without +)
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
    const client = await WhatsAppClient.createMultiAuth('./auth', customOptions);
    const sock = await client.getSocket();
  } catch (error) {
    console.error('Error initializing WhatsApp client:', error.message);
  }
})();
```

The QR code will be printed directly in your terminal.

---

## Simple Example Code

```javascript
const WhatsAppClient = require('easy-baileys');

(async () => {
    try {
        const customOptions = {
            browser: ["Ubuntu", "Chrome", "20.0.04"],
            printQRInTerminal: true,
            mobile: false,
        };

        const client = await WhatsAppClient.createMultiAuth('./hacxk', customOptions);
        const sock = await client.getSocket();
        const conn = await client.getSocketMsg();

        sock.ev.on("messages.upsert", async ({ messages }) => {
            for (const m of messages) {
                if (m.message?.conversation.toLowerCase() === 'hi') {
                    await conn.reply(sock, m, 'Hello! 👋');
                }
            }
        });

    } catch (error) {
        console.error('Error initializing WhatsApp client:', error.message);
    }
})();
```

### Handling Message Upserts

One of the key features of `@whiskeysockets/baileys` is the ability to handle incoming messages. The library provides an event called `messages.upsert` that you can listen to for new messages. Here’s how you can set up a listener for this event:

```javascript
sock.ev.on("messages.upsert", async ({ messages }) => {
    for (const m of messages) {
        console.log(m);
    }
});
```

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
        }
    }
});
```

### Overview: 📱💬

The `connMessage` class provides methods to interact with WhatsApp messages, including sending various media types, replying, reacting, editing, and deleting messages.

### Methods

See [API Documentation](#configuration-options-%E2%9A%99%EF%B8%8F) for detailed method explanations.

1. **`sendSticker(sock, m, bufferOrUrl)`** 🎨
   - **Description**: Sends a sticker message to the given chat.
   - **Parameters**:
     - `sock` (`object`): Baileys socket instance.
     - `m` (`object`): Message object containing chat information.
     - `bufferOrUrl` (`string` or `Buffer`): URL or buffer containing the sticker data.
   - **Usage Example**:
     ```javascript
     await conn.sendSticker(sock, m, 'https://example.com/sticker.webp');
     ```

2. **`sendStickerReply(sock, m, bufferOrUrl)`** 🎉
   - **Description**: Sends a sticker as a reply to a specific message.
   - **Parameters**: Same as `sendSticker`.
   - **Usage Example**:
     ```javascript
     await conn.sendStickerReply(sock, m, 'https://example.com/sticker.webp');
     ```

3. **`sendImage(sock, m, bufferOrUrl, caption)`** 🖼️
   - **Description**: Sends an image message with an optional caption.
   - **Parameters**:
     - `sock` (`object`): Baileys socket instance.
     - `m` (`object`): Message object containing chat information.
     - `bufferOrUrl` (`string` or `Buffer`): URL or buffer containing the image data.
     - `caption` (`string`): Optional caption for the image.
   - **Usage Example**:
     ```javascript
     await conn.sendImage(sock, m, 'https://example.com/image.jpg', 'Beautiful scenery!');
     ```

4. **`sendImageReply(sock, m, bufferOrUrl, caption)`** 🌄
   - **Description**: Sends an image as a reply to a specific message.
   - **Parameters**: Same as `sendImage`.
   - **Usage Example**:
     ```javascript
     await conn.sendImageReply(sock, m, 'https://example.com/image.jpg', 'Replying with an image.');
     ```

5. **`sendVideo(sock, m, bufferOrUrl, caption)`** 📹
   - **Description**: Sends a video message with an optional caption.
   - **Parameters**: Same as `sendImage`.
   - **Usage Example**:
     ```javascript
     await conn.sendVideo(sock, m, 'https://example.com/video.mp4', 'Check out this video!');
     ```

6. **`sendVideoReply(sock, m, bufferOrUrl, caption)`** 🎥
   - **Description**: Sends a video as a reply to a specific message.
   - **Parameters**: Same as `sendVideo`.
   - **Usage Example**:
     ```javascript
     await conn.sendVideoReply(sock, m, 'https://example.com/video.mp4', 'Replying with a video.');
     ```

7. **`sendDocument(sock, m, bufferOrUrl, mimetype, fileName, caption)`** 📄
   - **Description**: Sends a document (file) message with an optional caption.
   - **Parameters**:
     - `sock` (`object`): Baileys socket instance.
     - `m` (`object`): Message object containing chat information.
     - `bufferOrUrl` (`string` or `Buffer`): URL or buffer containing the document data.
     - `mimetype` (`string`): MIME type of the document.
     - `fileName` (`string`): Name of the file.
     - `caption` (`string`): Optional caption for the document.
   - **Usage Example**:
     ```javascript
     await conn.sendDocument(sock, m, 'https://example.com/document.pdf', 'application/pdf', 'document.pdf', 'Check out this document!');
     ```

8. **`sendDocumentReply(sock, m, bufferOrUrl, mimetype, fileName, caption)`** 📝
   - **Description**: Sends a document as a reply to a specific message.
   - **Parameters**: Same as `sendDocument`.
   - **Usage Example**:
     ```javascript
     await conn.sendDocumentReply(sock, m, 'https://example.com/document.pdf', 'application/pdf', 'document.pdf', 'Replying with a document.');
     ```

9. **`sendAudio(sock, m, bufferOrUrl, ptt)`** 🎵
   - **Description**: Sends an audio message or voice note.
   - **Parameters**:
     - `sock` (`object`): Baileys socket instance.
     - `m` (`object`): Message object containing chat information.
     - `bufferOrUrl` (`string` or `Buffer`): URL or buffer containing the audio data.
     - `ptt` (`boolean`): Whether the audio is a voice note (push-to-talk).
   - **Usage Example**:
     ```javascript
     await conn.sendAudio(sock, m, 'https://example.com/audio.mp3', true);
     ```

10. **`sendAudioReply(sock, m, bufferOrUrl, ptt)`** 🎤
    - **Description**: Sends an audio message as a reply to a specific message.
    - **Parameters**: Same as `sendAudio`.
    - **Usage Example**:
      ```javascript
      await conn.sendAudioReply(sock, m, 'https://example.com/audio.mp3', true);
      ```

11. **`sendGif(sock, m, bufferOrUrl, playback)`** 🎬
    - **Description**: Sends a GIF message.
    - **Parameters**:
      - `sock` (`object`): Baileys socket instance.
      - `m` (`object`): Message object containing chat information.
      - `bufferOrUrl` (`string` or `Buffer`): URL or buffer containing the GIF data.
      - `playback` (`boolean`): Whether to enable GIF playback.
    - **Usage Example**:
      ```javascript
      await conn.sendGif(sock, m, 'https://example.com/animated.gif', true);
      ```

12. **`sendGifReply(sock, m, bufferOrUrl, playback)`** 🎞️
    - **Description**: Sends a GIF as a reply to a specific message.
    - **Parameters**: Same as `sendGif`.
    - **Usage Example**:
      ```javascript
      await conn.sendGifReply(sock, m, 'https://example.com/animated.gif', true);
      ```

13. **`reply(sock, m, text)`** 💬
    - **Description**: Replies to a message with text.
    - **Parameters**:
      - `sock` (`object`): Baileys socket instance.
      - `m` (`object`): Message object containing chat information.
      - `text` (`string`): Text message to reply with.
    - **Usage Example**:
      ```javascript
      await conn.reply(sock, m, 'Your reply message.');
      ```

14. **`send(sock, m, text)`** ✉️
    - **Description**: Sends a text message to a chat.
    - **Parameters**: Same as `reply`.
    - **Usage Example**:
      ```javascript
      await conn.send(sock, m, 'Your message.');
      ```

15. **`react(sock, m, emoji)`** 🎭
    - **Description**: Reacts to a message with an emoji.
    - **Parameters**:
      - `sock` (`object`): Baileys socket instance.
      - `m` (`object`): Message object containing chat information.
      - `emoji` (`string`): Emoji reaction.
    - **Usage Example**:
      ```javascript
      await conn.react(sock, m, '😄');
      ```

16. **`editMsg(sock, m, sentMessage, newMessage)`** 📝
    - **Description**: Edits a previously sent message with a new message.
    - **Parameters**:
      - `sock` (`object`): Baileys socket instance.
      - `m` (`object`): Message object containing chat information.
      - `sentMessage` (`object`): Previously sent message object.
      - `newMessage` (`string`): New message content.
    - **Usage Example**:
      ```javascript
      await conn.editMsg(sock, m, sentMessage, 'Updated message.');
      ```

17. **`deleteMsgGroup(sock, m)`** 🗑️
    - **Description**: Deletes a message in a group chat (requires admin privileges).
    - **Parameters**:
      - `sock` (`object`): Baileys socket instance.
      - `m` (`object`): Message object containing chat information.
    - **Usage Example**:
      ```javascript
      await conn.deleteMsgGroup(sock, m);
      ```

18. **`deleteMsg(sock, m)`** 🚫
    - **Description**: Deletes a message (self-message or sent to you).
    - **Parameters**: Same as `deleteMsgGroup`.
    - **Usage Example**:
      ```javascript
      await conn.deleteMsg(sock, m);
      ```

### Configuration Options ⚙️

- `browser`: An array specifying the browser information (e.g., `["Ubuntu", "Chrome", "20.0.04"]`).
- `printQRInTerminal`: (Boolean) Display the QR code in the terminal (default: `false`).
- `mobile`: (Boolean) Set to `true` if connecting from a mobile device.
- **Refer to the `@whiskeysockets/baileys` documentation for additional options.**

## Contributing 🤝

Contributions are welcome! Please feel free to submit issues and pull requests.

## Thanks to

[![WhiskeySockets](https://github.com/WhiskeySockets.png?size=100)](https://github.com/WhiskeySockets/Baileys)

## License 📄

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.