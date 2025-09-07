# 🚀 Installation Guide - Cursor Code Inspector

## Quick Setup

### 1. Load the Extension in Chrome
1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked"
4. Select the `cursor-ext` folder
5. The extension should appear in your extensions list

### 2. Test the Extension
1. Open the `test.html` file in Chrome: `file:///path/to/cursor-ext/test.html`
2. Right-click on any element (like the "Click Me Button")
3. Select "Inspect with Cursor" from the context menu
4. Click on an element to select it
5. Enter your message in the modal dialog
6. Click "Send to Cursor"

### 3. Use with Real Websites
1. Navigate to any website
2. Right-click on any element you want to analyze
3. Select "Inspect with Cursor"
4. Click on the element to select it
5. Enter your question or request
6. Click "Send to Cursor"

## How It Works

### The Complete Workflow:
1. **Right-click** → Context menu appears
2. **Select "Inspect with Cursor"** → Element inspection mode starts
3. **Click on element** → Element gets highlighted and selected
4. **Modal dialog opens** → Shows element info + text input
5. **Enter your message** → Type your question or request
6. **Click "Send to Cursor"** → Message is:
   - Copied to clipboard
   - Injected into Cursor's chat (if Cursor is open)
   - Formatted with all element details

### What Gets Sent to Cursor:
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

User Message: How can I improve this button?

Timestamp: 2024-01-15T10:30:00.000Z
```

## Troubleshooting

### Extension Not Loading
- Check that all files are present in the extension folder
- Ensure `manifest.json` is valid
- Try refreshing the extension in `chrome://extensions/`

### Context Menu Not Appearing
- Make sure the extension is enabled
- Try refreshing the page
- Check browser console for errors

### Element Selection Not Working
- Ensure the content script is running
- Check that the page allows content scripts
- Try on a different website

### Message Not Reaching Cursor
- Make sure Cursor is open in a browser tab
- Check that Cursor's chat input is visible
- The message will always be copied to clipboard as backup

## Features

✅ **Right-click context menu**  
✅ **Visual element highlighting**  
✅ **HTML extraction**  
✅ **User message input**  
✅ **Clipboard copy**  
✅ **Direct Cursor injection**  
✅ **Comprehensive element data**  
✅ **Page context information**  

## File Structure

```
cursor-ext/
├── manifest.json          # Extension configuration
├── background.js          # Background service worker
├── content.js            # Content script for web pages
├── test.html             # Test page with simulation
├── cursor-bridge.js      # Bridge for Cursor communication
├── create_icons.html     # Icon generator (optional)
└── README.md             # Documentation
```

## Next Steps

1. **Test thoroughly** on different websites
2. **Customize selectors** in `background.js` if needed for your Cursor setup
3. **Add icons** using the `create_icons.html` tool
4. **Share feedback** on what works and what doesn't

The extension is now ready to use! 🎉
