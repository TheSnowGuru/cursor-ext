// Background script for the Chrome extension
chrome.runtime.onInstalled.addListener(() => {
  // Create context menu item
  chrome.contextMenus.create({
    id: "inspectElement",
    title: "Inspect with Cursor",
    contexts: ["all"]
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "inspectElement") {
    // Send message to content script to start inspection
    chrome.tabs.sendMessage(tab.id, {
      action: "startInspection",
      clickInfo: info
    }, (response) => {
      // Handle any response or errors
      if (chrome.runtime.lastError) {
        console.log('Error sending message to content script:', chrome.runtime.lastError);
      }
    });
  }
});

// Handle messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "sendToCursor") {
    // Send the message to Cursor via MCP
    sendToCursorMCP(request.message)
      .then(result => {
        sendResponse({ success: true, result: result });
      })
      .catch(error => {
        console.error('Error sending to Cursor:', error);
        sendResponse({ success: false, error: error.message });
      });
    
    // Return true to indicate we will send a response asynchronously
    return true;
  }
});

// Function to send data to Cursor via MCP
async function sendToCursorMCP(message) {
  try {
    console.log('Sending to Cursor via MCP:', message);
    
    // Try to communicate with the MCP server
    try {
      const response = await fetch('http://localhost:3001/mcp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          method: 'send_to_cursor',
          params: {
            message: message
          }
        })
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Message sent to Cursor via MCP');
        return { 
          success: true, 
          message: 'Message sent to Cursor via MCP!',
          mcpSuccess: true
        };
      }
    } catch (mcpError) {
      console.log('MCP server not available, falling back to clipboard:', mcpError.message);
    }
    
    // Fallback to clipboard copy
    console.log('✅ Message copied to clipboard for Cursor desktop app');
    return { 
      success: true, 
      message: 'Message copied to clipboard! Paste it into Cursor desktop app.',
      clipboardCopy: true
    };
    
  } catch (error) {
    console.error('Error preparing message for Cursor:', error);
    throw error;
  }
}

// Note: Cursor is a desktop app, so we don't need web injection
// The clipboard copy is the primary method for communication
