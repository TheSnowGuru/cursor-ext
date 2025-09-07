# Cursor Code Inspector Chrome Extension

A Chrome extension that allows you to inspect HTML elements on web pages and send them to Cursor for analysis via MCP (Model Context Protocol) integration.

## Features

- **Element Inspection**: Right-click on any element and select "Inspect with Cursor"
- **Visual Highlighting**: Elements are highlighted when you hover over them during inspection
- **HTML Extraction**: Automatically extracts the full HTML code of selected elements
- **User Input**: Add your own message or question about the element
- **Two-Button Interface**: Choose between "Copy to Clipboard" or "Send to Cursor"
- **MCP Integration**: Direct communication with Cursor via Model Context Protocol
- **Fallback Support**: Automatic fallback to clipboard when MCP server unavailable
- **Smart Error Handling**: Clear user feedback and instructions

## Installation

### Quick Start (Chrome Extension Only)
1. **Clone the repository**:
   ```bash
   git clone https://github.com/TheSnowGuru/cursor-ext.git
   cd cursor-ext
   ```

2. **Load in Chrome**:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" in the top right
   - Click "Load unpacked" and select the extension directory
   - The extension should now appear in your extensions list

### Full Setup (With MCP Integration)
For direct communication with Cursor, follow the complete setup guide:

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Configure Cursor MCP**:
   - Add the MCP server to your Cursor configuration
   - See `COMPLETE_SETUP.md` for detailed instructions

3. **Start MCP Server**:
   ```bash
   node mcp-http-bridge.js
   ```

4. **Load Chrome Extension** (as above)

## Usage

### Simple Workflow
1. **Right-click** on any element on any webpage
2. **Select "Inspect with Cursor"** from the context menu
3. **Click on an element** to select it (it will be highlighted in blue)
4. **A modal dialog opens** with:
   - Element information displayed
   - Text area for your message
   - Two buttons: "Copy to Clipboard" and "Send to Cursor"
5. **Enter your message** and choose your action:
   - **"Copy to Clipboard"**: Copies formatted data to clipboard
   - **"Send to Cursor"**: Attempts MCP communication, falls back to clipboard
6. **Paste into Cursor** (if using clipboard) or see direct integration message

### What Gets Copied
The extension copies a formatted message containing:
- Element tag name, class, ID, and text content
- Page title, URL, and domain information
- Full HTML code of the element
- Your message/question
- Timestamp

## File Structure

```
cursor-ext/
├── manifest.json              # Extension configuration
├── background.js              # Background service worker
├── content.js                # Content script for web pages
├── mcp-server.js             # MCP server for Cursor integration
├── mcp-http-bridge.js        # HTTP bridge for Chrome extension
├── package.json              # Node.js dependencies
├── test.html                 # Test page for the extension
├── create_icons.html         # Icon generator tool
├── icons/                    # Extension icons
│   ├── icon.svg              # SVG reference
│   ├── icon16.png            # 16x16 icon
│   ├── icon48.png            # 48x48 icon
│   └── icon128.png           # 128x128 icon
├── COMPLETE_SETUP.md         # Complete setup instructions
├── MCP_SETUP.md              # MCP-specific setup
└── README.md                 # This file
```

## How It Works

1. **Background Script** (`background.js`):
   - Creates the right-click context menu
   - Handles MCP communication with Cursor
   - Manages fallback to clipboard when MCP unavailable

2. **Content Script** (`content.js`):
   - Runs on web pages
   - Handles element inspection and highlighting
   - Shows modal dialog with two-button interface
   - Extracts HTML code from selected elements
   - Sends data to background script for processing

3. **MCP Server** (`mcp-server.js`):
   - Implements Model Context Protocol for Cursor integration
   - Receives messages from Chrome extension via HTTP bridge
   - Processes and forwards data to Cursor

4. **HTTP Bridge** (`mcp-http-bridge.js`):
   - Acts as communication layer between Chrome extension and MCP server
   - Handles CORS and HTTP requests
   - Provides fallback error handling

## Integration with Cursor

The extension supports two integration methods:

### 1. MCP Integration (Recommended)
- **Direct Communication**: Uses Model Context Protocol for real-time communication
- **Automatic Setup**: Configure once in Cursor's MCP settings
- **Real-time Feedback**: Immediate confirmation when messages are sent

### 2. Clipboard Fallback
- **Universal Compatibility**: Works with any Cursor setup
- **Simple Operation**: Just paste the copied data into Cursor
- **No Configuration**: Works out of the box

## Customization

You can customize the extension by modifying:

- **Colors and Styling**: Edit the CSS in `popup.html`
- **Element Selection**: Modify the highlighting logic in `content.js`
- **Data Format**: Change how data is formatted for Cursor in `popup.js`
- **Permissions**: Update `manifest.json` if you need additional permissions

## Troubleshooting

- **Extension not loading**: Check that all files are present and `manifest.json` is valid
- **Icons not showing**: Ensure PNG icon files exist in the `icons` folder
- **Element not selecting**: Make sure the content script is running (check browser console)
- **Popup not opening**: Verify the extension has the necessary permissions

## Development

To modify the extension:

1. Make your changes to the relevant files
2. Go to `chrome://extensions/`
3. Click the refresh icon on the extension card
4. Test your changes

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Repository

- **GitHub**: https://github.com/TheSnowGuru/cursor-ext
- **Issues**: Report bugs or request features on GitHub Issues
- **Discussions**: Join the conversation in GitHub Discussions

## License

This project is open source and available under the MIT License.
