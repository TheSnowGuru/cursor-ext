# Cursor Code Inspector Chrome Extension

A Chrome extension that allows you to inspect HTML elements on web pages and send them to Cursor for analysis.

## Features

- **Element Inspection**: Right-click on any element and select "Inspect with Cursor"
- **Visual Highlighting**: Elements are highlighted when you hover over them during inspection
- **HTML Extraction**: Automatically extracts the full HTML code of selected elements
- **User Input**: Add your own message or question about the element
- **Workspace Detection**: Specify your Cursor workspace path for better context
- **Smart Suggestions**: Auto-suggests workspace paths based on the current website
- **Cursor Integration**: Sends formatted data to Cursor (currently via clipboard)

## Installation

1. **Download the Extension**:
   - Clone or download this repository
   - Ensure you have all the files in the extension directory

2. **Create Icons** (Required):
   - Create an `icons` folder in the extension directory
   - Create three PNG files: `icon16.png`, `icon48.png`, and `icon128.png`
   - You can use the provided `icon.svg` as a reference
   - Recommended sizes: 16x16, 48x48, and 128x128 pixels

3. **Load in Chrome**:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" in the top right
   - Click "Load unpacked" and select the extension directory
   - The extension should now appear in your extensions list

## Usage

### Simple Workflow
1. **Right-click** on any element on any webpage
2. **Select "Inspect with Cursor"** from the context menu
3. **Click on an element** to select it (it will be highlighted in blue)
4. **A modal dialog opens** with:
   - Element information displayed
   - Text area for your message
   - "Copy to Clipboard" button
5. **Enter your message** and click "Copy to Clipboard"
6. **Everything is copied** to your clipboard in a formatted way
7. **Paste into Cursor** and you're done!

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
├── manifest.json          # Extension configuration
├── background.js          # Background service worker
├── content.js            # Content script for web pages
├── test.html             # Test page for the extension
├── create_icons.html     # Icon generator tool
├── icons/                # Extension icons (optional)
│   └── icon.svg          # SVG reference
└── README.md             # This file
```

## How It Works

1. **Background Script** (`background.js`):
   - Creates the right-click context menu
   - Handles communication between different parts of the extension

2. **Content Script** (`content.js`):
   - Runs on web pages
   - Handles element inspection and highlighting
   - Shows modal dialog for user input
   - Extracts HTML code from selected elements
   - Copies formatted data to clipboard

## Integration with Cursor

Currently, the extension copies formatted data to the clipboard. For full integration with Cursor, you would need to:

1. **Use Cursor's API** (if available):
   - Replace the clipboard functionality with direct API calls
   - Implement authentication if required

2. **Use Cursor's Extension API**:
   - If Cursor supports Chrome extension communication
   - Send messages directly to the Cursor application

3. **File-based Integration**:
   - Write data to a file that Cursor can monitor
   - Use a shared file system or database

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

## License

This project is open source and available under the MIT License.
