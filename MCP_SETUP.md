# 🔗 MCP Setup for Cursor Code Inspector

This guide shows you how to set up the MCP (Model Context Protocol) server to enable direct communication between the Chrome extension and Cursor.

## 🚀 Quick Setup

### 1. Install Dependencies
```bash
cd /Users/shay/Documents/GitHub/cursor-ext
npm install
```

### 2. Start the MCP HTTP Bridge
```bash
node mcp-http-bridge.js
```

This will start:
- MCP server on stdio
- HTTP bridge on http://localhost:3001
- Ready to receive requests from Chrome extension

### 3. Configure Cursor (Optional)
Add this to your Cursor MCP configuration:

```json
{
  "mcpServers": {
    "cursor-inspector": {
      "command": "node",
      "args": ["/Users/shay/Documents/GitHub/cursor-ext/mcp-server.js"]
    }
  }
}
```

## 🔧 How It Works

### Architecture:
```
Chrome Extension → HTTP Bridge → MCP Server → Cursor
```

1. **Chrome Extension** sends element data via HTTP
2. **HTTP Bridge** receives request and forwards to MCP server
3. **MCP Server** processes the data and sends to Cursor
4. **Cursor** receives the formatted message

### Fallback:
If MCP server is not running, the extension falls back to clipboard copy.

## 📋 Available Tools

The MCP server provides these tools:

### `inspect_element`
Inspect an HTML element and send analysis to Cursor.

**Input:**
```json
{
  "elementData": {
    "tagName": "BUTTON",
    "className": "button",
    "id": "test-button",
    "textContent": "Click Me",
    "html": "<button class=\"button\" id=\"test-button\">Click Me</button>",
    "url": "https://example.com",
    "title": "Example Page",
    "domain": "example.com"
  },
  "userMessage": "How can I improve this button?"
}
```

### `send_to_cursor`
Send a formatted message directly to Cursor chat.

**Input:**
```json
{
  "message": "Your formatted message here"
}
```

## 🛠️ Development

### Start in Development Mode
```bash
npm run dev
```

### Test the MCP Server
```bash
# Test HTTP endpoint
curl -X POST http://localhost:3001/mcp \
  -H "Content-Type: application/json" \
  -d '{"method": "send_to_cursor", "params": {"message": "Test message"}}'
```

### View Logs
The MCP server logs all requests and responses to the console.

## 🔍 Troubleshooting

### MCP Server Not Starting
- Check if Node.js is installed: `node --version`
- Install dependencies: `npm install`
- Check port 3001 is not in use: `lsof -i :3001`

### Extension Can't Connect
- Ensure MCP HTTP bridge is running
- Check browser console for errors
- Verify extension has permission to access localhost

### Cursor Not Receiving Messages
- Check Cursor MCP configuration
- Verify MCP server is running
- Check Cursor logs for MCP errors

## 📁 File Structure

```
cursor-ext/
├── mcp-server.js          # MCP server implementation
├── mcp-http-bridge.js     # HTTP bridge for Chrome extension
├── cursor-mcp-config.json # Cursor MCP configuration
├── package.json           # Node.js dependencies
└── MCP_SETUP.md          # This file
```

## 🎯 Benefits of MCP Integration

✅ **Direct Communication** - No clipboard dependency  
✅ **Structured Data** - Proper element analysis format  
✅ **Real-time** - Instant message delivery to Cursor  
✅ **Reliable** - Fallback to clipboard if MCP fails  
✅ **Extensible** - Easy to add new tools and features  

## 🚀 Next Steps

1. **Start the MCP server**: `node mcp-http-bridge.js`
2. **Load the Chrome extension** in Chrome
3. **Test on any website** - right-click → "Inspect with Cursor"
4. **Messages will be sent directly to Cursor** via MCP

The extension will automatically detect if MCP is available and use it, otherwise it falls back to clipboard copy.
