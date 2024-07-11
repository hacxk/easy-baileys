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
const code = await client.getPairingCode(94773255188); // Your phone number
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
    const code = await client.getPairingCode(94773255188); // Example phone number
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