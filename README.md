
# easy-baileys 🤖

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![npm version](https://img.shields.io/npm/v/easy-baileys.svg)](https://www.npmjs.com/package/easy-baileys)
[![baileys](https://img.shields.io/npm/v/baileys?logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB0AAAAdCAYAAABWk2cPAAAAIGNIUk0AAHomAACAhAAA+gAAAIDoAAB1MAAA6mAAADqYAAAXcJy6UTwAAAAGYktHRAD/AP8A/6C9p5MAAAAHdElNRQfoBRQUFQLjzPBjAAAIe0lEQVRIx22WbXBU1RmAn3M/djf7kWyyu9kkYEKCIlAUBQQBE4EglU5rHautglWG4FR/1FFHq9NOx/aPU6fV1v5RVLCOOm1n6h+dVoghBEILIklNrEQEEkIgyWazSXazu9mPe+/pj7vZJLR3Z/fsvfO+93m/zvsewTVX+PhhnCrE8nl+FAxz8Nxp58b6Fbeu95Tdfb3L3RjSHCu8qhpUhdANKfMpy4hFzezXF3LJE6dnJg6fjPR2PV7XOHNw6hJB1UFCGiTXPLiAIRYAO1p5pCrM0alJzvSd1u6+ZVPTjrJAy2qPb5tXVcJRMyMuGykiRoaMNHEqCiHVRZ3uoVJ1ybRlRXszUx2Hk5EDnwweP7pu8Yb8q5Wr2Xmlk9Sah/4XWtX+KaO/fp5H//gWrfFYTUu45tnt/oo9QrHKW5MjHElFGMgnSUsDEwuJRApQBbgVlVrdw1Z3mJ3uGnTUeFtq7P23JgdevsdXM7T/7J/xLN5UBAuA6vZ2Rn71HD97/V064pOrWqqq/7Cu1Nd8ODnCe1OXGDLSSCRCFBSEBCGRUIBLTCwsJDVaCQ+X1nOvt5YvZuKd+yf7n9pdWtv9dM8BvDW3k1z7IGJxewcPhILEjDx96dSqJxctPrDM41z/yvg3tCZHMZEoBdCsd2BDLeyvEFCpO1nqLOU/mQniVo6t7ip+Xr6KwfxM7+9j3+xd56roavE3sG2wAzX46F7GjRw9qWT104uve3OVz9X4YuQs7ckxBAIh5jIhBEjALDwJaE5u94Z4LLiMF8KrURF0JEewpOSiMU1fLs79vtpwne5d+cZk/5Fj6bF4zrJQrV0/pr/nK/XJ1Te9eFeFf/er0fO0T0dRhSgk3I6pZftHmeZgnSfAo8Hreb76Jp4ILafJV8VIPs0vRrqJGRkUIVCE4IqZZtic4SFfXa1HaK6/Dhz7NOfym9q9wQCR29c3bi8v33MkGaE1MYYq5hW1lEgEK0vKuKd8EVtKw3zL7adM1YsiU2aOl0Z7GcymUIQCUiIQaELhaHqUNc4K7vLW7P68dvNHSxzuQ8q7Z/qczeX+Fl2zKt6fuIIlQcg5LwV2TAOak/sqatnkCy0AArwzfoG2+AgqoqArCmkXIAUfJAYwsEp3eMP79g+ecisblzesvsXnaT6WHGcoN4NSBM2BFQT/TETZd/EUR+KjWMgi8GQyyutj58gXjZ3VtVcFwYiR4VB6mFtcZU0bKlesU9b6vDv8uho+Oj2OlMLOoWQBWBTAX6aneG6wm4uZJAAxI8vLw18xXDCWecAC1r6X0J6K4FbV4G0l5Tu1pSUld8StnDKQmUEpFo+dy2K5ClnwWCFhGGQtu37fHrvAsUQEDQWJLS+RzAZCIEBIFASX8ymiZkbcoPsatZBDXzmcz5CyTFRm5cUCsL1IBKALBZei0jk9xttjFzChkJKCst09kNLey7a9grRlcjmfIqS5b1S8mhKIGTnMQsWJIlLMu5/7OIXKeD7Lb6/2MZbLUqroqIWw2j1kno6c/WfbEzWyeBWtQtGF0HPSsoXlfMw1eZVzL35nrJ+TiXHCuosfBupwKuqczDW1UNSTkJUWuhCKYljkXUIt5nO+pcwDA6gIxvJZPpq4igU8EmqgyVeJac1FQ5ELdWbBQgpcQiUvpaUkTTMW1Bzo88M539IFgQZDSrKWxUZfkMerbsCSIKWc8xK7Wq8FqyiEVRfTpjGhRHPG2RrdhU/VigLK/wXaq5RQqbt4tmYFQc1J2jKxZr0sFqENVgpeSsCr6NTqHiL53DllIJ074VMc1lKXB2thNouNQgBKId+qEOytbKCpLARAhebAq2hISaEZzL1jbr/DEt1DQHXKC5l0p9KTmGmdzFqRraUBNCEKM3O+f3P5tSQ0loZoCTcUmgFs91fxUu1qFjnc9naTCw2ejV6zJ0zSsMa7U4lPlI6vh3t6EjNHNnsC1DvcACjiWo/tq1p38UzNcgK6s9gGHUJhV2gJr9Wvpd7pLWzVhUW4WHNzl7eKL1LTx09dvXRG2bumPts5kTyQzomJXcFF6EIp5me+tbpQ2FfVwMbSQBFoSclQNs2HsSE+jA2RNk07AnJOT0XwsL8O0xSJtnjs7ceW3pzWOmNJzp+90nlzacmfflATeGZn2TQfT0UKYNvuvISt/kr2VNUDMJKboSs5SXs8wmfTMS5nU2QsE0WAWmiFUoIlYIcvzLe91Xw4PvbBoQtftVeEF6OV6Spb1tabfxuZ+t0il776sWBtc9zMc3x6oujRdc4SdlXW8vl0jLapMU4mxrmUTTFjGcVzky6UIswe+pJN7iBPBZdxOjF94oPo6G821C7PRc0s4tbWbjaUe8hZksF0btWe6yoOrCpzrH9rfJBD8Sg5y2KR04Vf0+nPpEhbxuxhAilmj2azvzZMEbC9NMRPA9fTl8r0vjFyZe9Kj7uruaKcF/ovoI6+tx/rgb3846W/c/93bx77JJo4Va7rN34/UNlQ53JxNZ9hKDdDJJfFEtI+isxW9+xcKMwGBNQ63PwkVM8ufx1nEqnOg6PDT3ynItj9StdnnJGSy0075ibZuk//zZnX2mj55ff4PJ6qua/K/+yWgHePW5fl/0pNcGw6Rn82zbRpYBSOmwi7UDyqyhJHCXf6AjR6gmQNET8yOfn+X6KRl5v8/qGDvV3U19UzcGfz/BlWALd1s6ncw9lkhrYvL2v3r6lv2lzubbnJV7Kt3KGEkzInRvIZYkaOjLRwKIIK1UG17qJUOORU3oz2JJMdHVNTBz4+f/7o5oa6/O5QDa8MD3Dxzm1FzgIowG1t3ahCkDBM7qjw8GbfkHNHfeWtq7wldy8pcTaGHNoKj6oEVSF0U8p8yjJj0Vz+6/5M5kRvMnm4/crVrn3LGmZaJycoUzVy0uTcli0LGP8F7DHAgNsp7ioAAAAldEVYdGRhdGU6Y3JlYXRlADIwMjQtMDUtMjBUMjA6MjA6NTkrMDA6MDDe8d5UAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDI0LTA1LTIwVDIwOjIwOjU5KzAwOjAwr6xm6AAAACh0RVh0ZGF0ZTp0aW1lc3RhbXAAMjAyNC0wNS0yMFQyMDoyMTowMiswMDowMF2cdpcAAAAASUVORK5CYII=&label=baileys&color=rgb(0,165,135))](https://github.com/WhiskeySockets/Baileys)
[![GitHub Issues or Pull Requests](https://img.shields.io/github/issues-raw/hacxk/easy-baileys?logo=circle&logoColor=white)](https://github.com/hacxk/easy-baileys/issues)

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

    // Example event listener for incoming messages
    sockMongo.ev.on("messages.upsert", async ({ messages }) => {
      for (const m of messages) {
        if (m.message?.conversation.toLowerCase() === 'hi') {
          await sockMongo.reply(m, 'Hello! 👋');
        }
      }
    });

  } catch (error) {
    console.error('Error initializing WhatsApp client with MongoDB authentication:', error.message);
  }
})();
```

### 3. Creating a Client Instance with MySQL Authentication

```javascript
const WhatsAppClient = require('easy-baileys');

// Example MySQL configuration
const mysqlConfig = {
    session: 'session1', // Required
    host: 'localhost', // Required
    port: 3306, // Optional
    user: 'your_mysql_user', // Optional
    password: 'your_mysql_password', // Optional
    database: 'your_database_name', // Optional
    tableName: 'auth' // Optional
};

const customOptions = {
  browser: ["Ubuntu", "Chrome", "20.0.04"],
  printQRInTerminal: false, // Set to true for QR code in terminal
  mobile: false,
};

(async () => {
  try {
    // Initialize WhatsAppClient with MySQL authentication
    const client = await WhatsAppClient.createMySQLAuth(mysqlConfig, customOptions);
    const sockMySQL = await client.getSocket();

    // Example event listener for incoming messages
    sockMySQL.ev.on("messages.upsert", async ({ messages }) => {
      for (const m of messages) {
        if (m.message?.conversation.toLowerCase() === 'hi') {
          await sockMySQL.reply(m, 'Hello! 👋');
        }
      }
    });

  } catch (error) {
    console.error('Error initializing WhatsApp client with MySQL authentication:', error.message);
  }
})();
```

### 4. Creating a Client Instance with MultiFile Authentication

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

    // Example event listener for incoming messages
    sockMulti.ev.on("messages.upsert", async ({ messages }) => {
      for (const m of messages) {
        if (m.message?.conversation.toLowerCase() === 'hi') {
          await sockMulti.reply(m, 'Hello! 👋');
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

### 5. Obtain a pairing code (Optional)

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
        const conn = await client.getSocket();

        conn.ev.on("messages.upsert", async ({ messages }) => {
            for (const m of messages) {
                if (m.message?.conversation.toLowerCase() === 'hi') {
                    await conn.reply(m, 'Hello! 👋');
                }
            }
        });

    } catch (error) {
        console.error('Error initializing WhatsApp client:', error.message);
    }
})();
```



---



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



---






### Overview: 📱💬

The `connMessage` class provides methods to interact with WhatsApp messages, including sending various media types, replying, reacting, editing, and deleting messages.

### Methods

See [API Documentation](#configuration-options-%E2%9A%99%EF%B8%8F) for detailed method explanations.

1. **`sendSticker(m, bufferOrUrl)`** 🎨
   - **Description**: Sends a sticker message to the given chat.
   - **Parameters**:
     - `m` (`object`): Message object containing chat information.
     - `bufferOrUrl` (`string`, `Buffer`, or `filepath`): URL, buffer, or filepath containing the sticker data.
   - **Usage Example**:
     ```javascript
     await conn.sendSticker(m, 'https://example.com/sticker.webp');
     ```

2. **`sendStickerReply(m, bufferOrUrl)`** 🎉
   - **Description**: Sends a sticker as a reply to a specific message.
   - **Parameters**: Same as `sendSticker`.
   - **Usage Example**:
     ```javascript
     await conn.sendStickerReply(m, 'https://example.com/sticker.webp');
     ```

3. **`sendImage(m, bufferOrUrl, caption)`** 🖼️
   - **Description**: Sends an image message with an optional caption.
   - **Parameters**:
     - `m` (`object`): Message object containing chat information.
     - `bufferOrUrl` (`string`, `Buffer`, or `filepath`): URL, buffer, or filepath containing the image data.
     - `caption` (`string`): Optional caption for the image.
   - **Usage Example**:
     ```javascript
     await conn.sendImage(m, 'https://example.com/image.jpg', 'Beautiful scenery!');
     ```

4. **`sendImageReply(m, bufferOrUrl, caption)`** 🌄
   - **Description**: Sends an image as a reply to a specific message.
   - **Parameters**: Same as `sendImage`.
   - **Usage Example**:
     ```javascript
     await conn.sendImageReply(m, 'https://example.com/image.jpg', 'Replying with an image.');
     ```

5. **`sendVideo(m, bufferOrUrl, caption)`** 📹
   - **Description**: Sends a video message with an optional caption.
   - **Parameters**: Same as `sendImage`.
   - **Usage Example**:
     ```javascript
     await conn.sendVideo(m, 'https://example.com/video.mp4', 'Check out this video!');
     ```

6. **`sendVideoReply(m, bufferOrUrl, caption)`** 🎥
   - **Description**: Sends a video as a reply to a specific message.
   - **Parameters**: Same as `sendVideo`.
   - **Usage Example**:
     ```javascript
     await conn.sendVideoReply(m, 'https://example.com/video.mp4', 'Replying with a video.');
     ```

7. **`sendDocument(m, bufferOrUrl, mimetype, fileName, caption)`** 📄
   - **Description**: Sends a document (file) message with an optional caption.
   - **Parameters**:
     - `m` (`object`): Message object containing chat information.
     - `bufferOrUrl` (`string`, `Buffer`, or `filepath`): URL, buffer, or filepath containing the document data.
     - `mimetype` (`string`): MIME type of the document.
     - `fileName` (`string`): Name of the file.
     - `caption` (`string`): Optional caption for the document.
   - **Usage Example**:
     ```javascript
     await conn.sendDocument(m, 'https://example.com/document.pdf', 'application/pdf', 'document.pdf', 'Check out this document!');
     ```

8. **`sendDocumentReply(m, bufferOrUrl, mimetype, fileName, caption)`** 📝
   - **Description**: Sends a document as a reply to a specific message.
   - **Parameters**: Same as `sendDocument`.
   - **Usage Example**:
     ```javascript
     await conn.sendDocumentReply(m, 'https://example.com/document.pdf', 'application/pdf', 'document.pdf', 'Replying with a document.');
     ```

9. **`sendAudio(m, bufferOrUrl, ptt)`** 🎵
   - **Description**: Sends an audio message or voice note.
   - **Parameters**:
     - `m` (`object`): Message object containing chat information.
     - `bufferOrUrl` (`string`, `Buffer`, or `filepath`): URL, buffer, or filepath containing the audio data.
     - `ptt` (`boolean`): Whether the audio is a voice note (push-to-talk).
   - **Usage Example**:
     ```javascript
     await conn.sendAudio(m, 'https://example.com/audio.mp3', true);
     ```

10. **`sendAudioReply(m, bufferOrUrl, ptt)`** 🎤
    - **Description**: Sends an audio message as a reply to a specific message.
    - **Parameters**: Same as `sendAudio`.
    - **Usage Example**:
      ```javascript
      await conn.sendAudioReply(m, 'https://example.com/audio.mp3', true);
      ```

11. **`sendGif(m, bufferOrUrl, playback)`** 🎬
    - **Description**: Sends a GIF message.
    - **Parameters**:
      - `m` (`object`): Message object containing chat information.
      - `bufferOrUrl` (`string`, `Buffer`, or `filepath`): URL, buffer, or filepath containing the GIF data.
      - `playback` (`boolean`): Whether to enable GIF playback.
    - **Usage Example**:
      ```javascript
      await conn.sendGif(m, 'https://example.com/animated.gif', true);
      ```

12. **`sendGifReply(m, bufferOrUrl, playback)`** 🎞️
    - **Description**: Sends a GIF as a reply to a specific message.
    - **Parameters**: Same as `sendGif`.
    - **Usage Example**:
      ```javascript
      await conn.sendGifReply(m, 'https://example.com/animated.gif', true);
      ```

13. **`reply(m, text)`** 💬
    - **Description**: Replies to a message with text.
    - **Parameters**:
      - `m` (`object`): Message object containing chat information.
      - `text` (`string`): Text message to reply with.
    - **Usage Example**:
      ```javascript
      await conn.reply(m, 'Your reply message.');
      ```

14. **`send(m, text)`** ✉️
    - **Description**: Sends a text message to a chat.
    - **Parameters**: Same as `reply`.
    - **Usage Example**:
      ```javascript
      await conn.send(m, 'Your message.');
      ```

15. **`react(m, emoji)`** 🎭
    - **Description**: Reacts to a message with an emoji.
    - **Parameters**:
      - `m` (`object`): Message object containing chat information.
      - `emoji` (`string`): Emoji reaction.
    - **Usage Example**:
      ```javascript
      await conn.react(m, '😄');
      ```

16. **`editMsg(m, sentMessage, newMessage)`** 📝
    - **Description**: Edits a previously sent message with a new message.
    - **Parameters**:
      - `m` (`object`): Message object containing chat information.
      - `sentMessage` (`object`): Previously sent message object.
      - `newMessage` (`string`): New message content.
    - **Usage Example**:
      ```javascript
      await conn.editMsg(m, sentMessage, 'Updated message.');
      ```

17. **`deleteMsgGroup(m)`** 🗑️
    - **Description**: Deletes a message in a group chat (requires admin privileges).
    - **Parameters**:
      - `m` (`object`): Message object containing chat information.
    - **Usage Example**:
      ```javascript
      await conn.deleteMsgGroup(m);
      ```

18. **`deleteMsg(m)`** 🚫
    - **Description**: Deletes a message (self-message or sent to you).
    - **Parameters**: Same as `deleteMsgGroup`.
    - **Usage Example**:
      ```javascript
      await conn.deleteMsg(m);
      ```


---



### Configuration Options ⚙️

- `browser`: An array specifying the browser information (e.g., `["Ubuntu", "Chrome", "20.0.04"]`).
- `printQRInTerminal`: (Boolean) Display the QR code in the terminal (default: `false`).
- `mobile`: (Boolean) Set to `true` if connecting from a mobile device.
- **Refer to the `@whiskeysockets/baileys` documentation for additional options.**

## Contributing 🤝

Contributions are welcome! Please feel free to submit issues and pull requests.

## Thanks to

[![WhiskeySockets](https://github.com/WhiskeySockets.png?size=100)](https://github.com/WhiskeySockets/Baileys)
[![bobslavtriev](https://github.com/bobslavtriev.png?size=100)](https://github.com/bobslavtriev/mysql-baileys)

## License 📄

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.