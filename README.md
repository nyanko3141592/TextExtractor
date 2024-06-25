# Text Extractor Chrome Extension

This Chrome extension extracts text from web pages and sends it to a WebSocket server whenever the page is fully loaded or navigated.

## Prerequisites

- Node.js installed on your machine.

## Setup

### WebSocket Server

First, set up the WebSocket server using Node.js:

1. Create a new directory for the server and navigate into it:

   ```sh
   mkdir websocket-server
   cd websocket-server
   ```

2. Initialize a new Node.js project and install the `ws` package:

   ```sh
   npm init -y
   npm install ws
   ```

3. Create a file named `server.js` and add the following code:

   ```javascript
   const WebSocket = require("ws");
   const port = 8765;
   const wss = new WebSocket.Server({ port });

   wss.on("connection", (ws) => {
     console.log("Client connected");

     ws.on("message", (message) => {
       console.log(`Received message: ${message}`);
     });

     ws.on("close", () => {
       console.log("Client disconnected");
     });
   });

   console.log(`WebSocket server is running on ws://localhost:${port}`);
   ```

4. Start the WebSocket server:

   ```sh
   node server.js
   ```

### Chrome Extension

1. Create a new directory for the Chrome extension and navigate into it:

   ```sh
   mkdir text-extractor-extension
   cd text-extractor-extension
   ```

2. Create the following files with the respective content:

#### `manifest.json`

```json
{
  "manifest_version": 3,
  "name": "Text Extractor",
  "version": "1.1",
  "description": "Extracts all text from the webpage and sends it via WebSocket",
  "permissions": [
    "activeTab",
    "webNavigation",
    "scripting",
    "storage",
    "<all_urls>"
  ],
  "background": {
    "service_worker": "background.js"
  },
  "content_scripts": [
    {
      "matches": ["<all_urls>"],
      "js": ["content.js"]
    }
  ]
}
```
