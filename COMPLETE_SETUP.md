# 🎉 Complete Setup Guide - Cursor Code Inspector with MCP

## 🚀 Two Setup Options

### Option 1: Simple Setup (Clipboard Only)
**Quick and easy - works immediately**

1. **Load Chrome Extension:**
   - Go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked" → Select `cursor-ext` folder
   - Extension appears in toolbar

2. **Use the Extension:**
   - Right-click any element → "Inspect with Cursor"
   - Click element to select it
   - Enter message → Click "Send to Cursor"
   - Paste into Cursor (Cmd+V / Ctrl+V)

### Option 2: Advanced Setup (MCP Integration)
**Direct communication with Cursor - no clipboard needed**

1. **Install MCP Dependencies:**
   ```bash
   cd /Users/shay/Documents/GitHub/cursor-ext
   npm install
   ```

2. **Start MCP Server:**
   ```bash
   node mcp-http-bridge.js
   ```
   You should see: `🚀 MCP HTTP Bridge running on http://localhost:3001`

3. **Load Chrome Extension:**
   - Same as Option 1

4. **Configure Cursor (Optional):**
   Add to your Cursor MCP config:
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

5. **Use the Extension:**
   - Same workflow as Option 1
   - Messages sent directly to Cursor via MCP
   - No clipboard needed!

## 🔧 How It Works

### With MCP (Option 2):
```
Chrome Extension → HTTP Bridge → MCP Server → Cursor
```

### Without MCP (Option 1):
```
Chrome Extension → Clipboard → Paste into Cursor
```

## 📋 What Gets Sent to Cursor

```
Element Analysis Request:

Selected Element:
- Tag: BUTTON
- Class: button
- ID: test-button
- Text: Click Me Button

Page Context:
- Title: My Website
- URL: https://example.com
- Domain: example.com

HTML Code:
```html
<button class="button" id="test-button">Click Me Button</button>
```

User Message: How can I improve this button's accessibility?

Timestamp: 2024-01-15T10:30:00.000Z
```

## 🎯 Features

### ✅ Chrome Extension Features:
- **Right-click context menu** - "Inspect with Cursor"
- **Element highlighting** - Blue outline when hovering
- **Element selection** - Click to select any element
- **Modal dialog** - Clean interface with element info
- **Message input** - Text area for your questions
- **Smart feedback** - Shows MCP or clipboard status

### ✅ MCP Server Features:
- **Direct communication** with Cursor
- **Structured data** processing
- **HTTP bridge** for Chrome extension
- **Fallback support** to clipboard
- **Real-time delivery** to Cursor

## 🛠️ Development

### Test MCP Server:
```bash
curl -X POST http://localhost:3001/mcp \
  -H "Content-Type: application/json" \
  -d '{"method": "send_to_cursor", "params": {"message": "Test message"}}'
```

### View Logs:
- MCP server logs to console
- Chrome extension logs to browser console
- Check both for debugging

## 🔍 Troubleshooting

### Extension Not Working:
- Check extension is loaded in Chrome
- Verify right-click menu appears
- Check browser console for errors

### MCP Not Working:
- Ensure MCP server is running: `node mcp-http-bridge.js`
- Check port 3001 is available: `lsof -i :3001`
- Test HTTP endpoint with curl
- Extension will fallback to clipboard

### Cursor Not Receiving:
- Check Cursor MCP configuration
- Verify MCP server is running
- Check Cursor logs for MCP errors
- Use clipboard fallback if needed

## 📁 File Structure

```
cursor-ext/
├── manifest.json              # Chrome extension config
├── background.js              # Extension background script
├── content.js                 # Extension content script
├── test.html                  # Test page
├── mcp-server.js              # MCP server implementation
├── mcp-http-bridge.js         # HTTP bridge for extension
├── cursor-mcp-config.json     # Cursor MCP configuration
├── package.json               # Node.js dependencies
├── MCP_SETUP.md              # MCP setup guide
├── INSTALLATION.md           # Installation guide
└── COMPLETE_SETUP.md         # This file
```

## 🎉 Ready to Use!

### Quick Start:
1. **Choose your setup** (Simple or Advanced)
2. **Load the extension** in Chrome
3. **Start MCP server** (if using Option 2)
4. **Right-click any element** on any website
5. **Select "Inspect with Cursor"**
6. **Enter your message** and send to Cursor

The extension will automatically detect if MCP is available and use it, otherwise it falls back to clipboard copy. Both methods work perfectly!

**Happy coding with Cursor! 🚀**
