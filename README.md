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
        }
    }
});
```

In this example:
- We first check if the message contains a `conversation` field, which holds the text of the message.
- We then extract the sender's ID and the message text.



---


#### Overview: 📱💬
The `connMessage` class provides methods to interact with WhatsApp messages, including sending various media types, replying, reacting, editing, and deleting messages.

#### Methods:

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

#### Usage Example:
```javascript
const WhatsAppClient = require('easy-baileys');

(async () => {
    try {
        const customOptions = {
            browser:

 ["Ubuntu", "Chrome", "20.0.04"],
            printQRInTerminal: true,
            mobile: false,
        };

        const client = await WhatsAppClient.create('./hacxk', customOptions);
        const sock = client.getSocket();
        const conn = client.getSocketMsg();

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

### Notes:
- Ensure the `sock` and `m` parameters are correctly initialized and provided for each method.
- Use appropriate message formats (`Buffer` or `string`) for media types like stickers, images, videos, documents, and GIFs


---



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