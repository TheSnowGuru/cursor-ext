// Bridge script to communicate with Cursor
// This script can be injected into Cursor to receive messages from the extension

class CursorExtensionBridge {
  constructor() {
    this.setupMessageListener();
    console.log('🔍 Cursor Extension Bridge initialized');
  }

  setupMessageListener() {
    // Listen for messages from the Chrome extension
    window.addEventListener('message', (event) => {
      if (event.data && event.data.type === 'CURSOR_EXTENSION_MESSAGE') {
        this.handleExtensionMessage(event.data.payload);
      }
    });

    // Also listen for custom events
    document.addEventListener('cursorExtensionMessage', (event) => {
      this.handleExtensionMessage(event.detail);
    });
  }

  handleExtensionMessage(data) {
    console.log('📨 Received message from extension:', data);
    
    // Create a new chat message in Cursor
    this.injectIntoCursor(data);
  }

  injectIntoCursor(message) {
    try {
      // Try to find Cursor's chat input
      const chatInput = this.findCursorChatInput();
      
      if (chatInput) {
        // Set the message in the chat input
        chatInput.value = message;
        chatInput.dispatchEvent(new Event('input', { bubbles: true }));
        
        // Focus the input
        chatInput.focus();
        
        console.log('✅ Message injected into Cursor chat');
      } else {
        // Fallback: create a notification
        this.showNotification('Extension message received', message);
      }
    } catch (error) {
      console.error('❌ Error injecting into Cursor:', error);
      this.showNotification('Error', 'Failed to inject message into Cursor');
    }
  }

  findCursorChatInput() {
    // Try different selectors for Cursor's chat input
    const selectors = [
      'textarea[placeholder*="Ask"]',
      'textarea[placeholder*="chat"]',
      'textarea[placeholder*="message"]',
      '.chat-input textarea',
      '[data-testid="chat-input"]',
      'textarea[role="textbox"]'
    ];

    for (const selector of selectors) {
      const element = document.querySelector(selector);
      if (element) {
        return element;
      }
    }

    return null;
  }

  showNotification(title, message) {
    // Create a notification overlay
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #007acc;
      color: white;
      padding: 15px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      z-index: 10000;
      max-width: 400px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;

    notification.innerHTML = `
      <div style="font-weight: 600; margin-bottom: 8px;">${title}</div>
      <div style="font-size: 14px; opacity: 0.9;">${message.substring(0, 100)}${message.length > 100 ? '...' : ''}</div>
      <button onclick="this.parentElement.remove()" style="
        position: absolute;
        top: 5px;
        right: 8px;
        background: none;
        border: none;
        color: white;
        font-size: 18px;
        cursor: pointer;
        padding: 0;
        width: 20px;
        height: 20px;
      ">×</button>
    `;

    document.body.appendChild(notification);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 5000);
  }

  // Method to send message to extension (if needed)
  sendToExtension(data) {
    window.postMessage({
      type: 'CURSOR_TO_EXTENSION',
      payload: data
    }, '*');
  }
}

// Initialize the bridge when the page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.cursorExtensionBridge = new CursorExtensionBridge();
  });
} else {
  window.cursorExtensionBridge = new CursorExtensionBridge();
}

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CursorExtensionBridge;
}
