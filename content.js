// Content script that runs on web pages
let isInspecting = false;
let highlightedElement = null;

// Function to send data to Cursor
async function sendToCursor(message) {
  try {
    // Send message to background script which will communicate with Cursor
    const response = await chrome.runtime.sendMessage({
      action: "sendToCursor",
      message: message
    });
    
    if (response && response.success) {
      console.log('Successfully sent to Cursor');
    } else {
      throw new Error(response?.error || 'Failed to send to Cursor');
    }
  } catch (error) {
    console.error('Error sending to Cursor:', error);
    throw error;
  }
}

// Listen for messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "startInspection") {
    startElementInspection();
  }
});

function startElementInspection() {
  isInspecting = true;
  document.body.style.cursor = 'crosshair';
  
  // Add event listeners for mouse events
  document.addEventListener('mouseover', highlightElement, true);
  document.addEventListener('mouseout', removeHighlight, true);
  document.addEventListener('click', selectElement, true);
  
  // Show instruction overlay
  showInstructionOverlay();
}

function highlightElement(event) {
  if (!isInspecting) return;
  
  removeHighlight();
  highlightedElement = event.target;
  highlightedElement.style.outline = '2px solid #007acc';
  highlightedElement.style.backgroundColor = 'rgba(0, 122, 204, 0.1)';
}

function removeHighlight(event) {
  if (highlightedElement && (!event || event.target !== highlightedElement)) {
    highlightedElement.style.outline = '';
    highlightedElement.style.backgroundColor = '';
  }
}

function selectElement(event) {
  if (!isInspecting) return;
  
  event.preventDefault();
  event.stopPropagation();
  
  const element = event.target;
  const elementHTML = element.outerHTML;
  const elementInfo = {
    tagName: element.tagName,
    className: element.className,
    id: element.id,
    textContent: element.textContent?.substring(0, 200) + (element.textContent?.length > 200 ? '...' : ''),
    html: elementHTML,
    url: window.location.href,
    title: document.title,
    domain: window.location.hostname
  };
  
  // Stop inspection
  stopInspection();
  
  // Show prompt for user input
  showPromptDialog(elementInfo);
}

function stopInspection() {
  isInspecting = false;
  document.body.style.cursor = '';
  document.removeEventListener('mouseover', highlightElement, true);
  document.removeEventListener('mouseout', removeHighlight, true);
  document.removeEventListener('click', selectElement, true);
  removeHighlight();
  hideInstructionOverlay();
}

function showInstructionOverlay() {
  const overlay = document.createElement('div');
  overlay.id = 'cursor-inspector-overlay';
  overlay.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: #007acc;
    color: white;
    padding: 10px 20px;
    border-radius: 5px;
    font-family: Arial, sans-serif;
    font-size: 14px;
    z-index: 10000;
    box-shadow: 0 2px 10px rgba(0,0,0,0.3);
  `;
  overlay.textContent = 'Click on an element to inspect it';
  document.body.appendChild(overlay);
  
  // Auto-hide after 3 seconds
  setTimeout(() => {
    if (document.getElementById('cursor-inspector-overlay')) {
      hideInstructionOverlay();
    }
  }, 3000);
}

function hideInstructionOverlay() {
  const overlay = document.getElementById('cursor-inspector-overlay');
  if (overlay) {
    overlay.remove();
  }
}

function showPromptDialog(elementInfo) {
  // Create modal overlay
  const modal = document.createElement('div');
  modal.id = 'cursor-inspector-modal';
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 10001;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  `;
  
  // Create dialog box
  const dialog = document.createElement('div');
  dialog.style.cssText = `
    background: white;
    border-radius: 8px;
    padding: 20px;
    width: 500px;
    max-width: 90vw;
    max-height: 80vh;
    overflow-y: auto;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  `;
  
  // Create content
  dialog.innerHTML = `
    <h3 style="margin: 0 0 15px 0; color: #333; font-size: 18px;">🔍 Cursor Code Inspector</h3>
    
    <div style="background: #f8f9fa; border: 1px solid #e9ecef; border-radius: 4px; padding: 10px; margin-bottom: 15px; font-family: monospace; font-size: 12px;">
      <strong>Selected Element:</strong><br>
      Tag: ${elementInfo.tagName}<br>
      Class: ${elementInfo.className || 'none'}<br>
      ID: ${elementInfo.id || 'none'}<br>
      Text: ${elementInfo.textContent || 'none'}<br><br>
      <strong>Page:</strong> ${elementInfo.title}<br>
      <strong>URL:</strong> ${elementInfo.url}
    </div>
    
    <label style="display: block; margin-bottom: 5px; font-weight: 500; color: #333;">Your message or question:</label>
    <textarea id="cursor-user-message" placeholder="Enter your message or question about this element..." style="
      width: 100%;
      height: 80px;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-family: inherit;
      font-size: 14px;
      resize: vertical;
      box-sizing: border-box;
    "></textarea>
    
    <div style="margin-top: 15px; display: flex; gap: 10px; justify-content: flex-end;">
      <button id="cursor-cancel-btn" style="
        padding: 8px 16px;
        border: 1px solid #ddd;
        border-radius: 4px;
        background: white;
        cursor: pointer;
        font-size: 14px;
      ">Cancel</button>
      <button id="cursor-copy-btn" style="
        padding: 8px 16px;
        border: 1px solid #28a745;
        border-radius: 4px;
        background: white;
        color: #28a745;
        cursor: pointer;
        font-size: 14px;
      ">Copy to Clipboard</button>
      <button id="cursor-send-btn" style="
        padding: 8px 16px;
        border: none;
        border-radius: 4px;
        background: #007acc;
        color: white;
        cursor: pointer;
        font-size: 14px;
      ">Send to Cursor</button>
    </div>
  `;
  
  modal.appendChild(dialog);
  document.body.appendChild(modal);
  
  // Focus on textarea
  const textarea = dialog.querySelector('#cursor-user-message');
  textarea.focus();
  
  // Event listeners
  const cancelBtn = dialog.querySelector('#cursor-cancel-btn');
  const copyBtn = dialog.querySelector('#cursor-copy-btn');
  const sendBtn = dialog.querySelector('#cursor-send-btn');
  
  cancelBtn.addEventListener('click', () => {
    document.body.removeChild(modal);
  });
  
  // Copy to Clipboard button
  copyBtn.addEventListener('click', async () => {
    const userMessage = textarea.value.trim();
    
    if (!userMessage) {
      alert('Please enter a message before copying.');
      return;
    }
    
    // Create the formatted message
    const cursorMessage = `Element Analysis Request:

Selected Element:
- Tag: ${elementInfo.tagName}
- Class: ${elementInfo.className || 'none'}
- ID: ${elementInfo.id || 'none'}
- Text: ${elementInfo.textContent || 'none'}

Page Context:
- Title: ${elementInfo.title}
- URL: ${elementInfo.url}
- Domain: ${elementInfo.domain}

HTML Code:
\`\`\`html
${elementInfo.html}
\`\`\`

User Message: ${userMessage}

Timestamp: ${new Date().toISOString()}`;

    try {
      // Copy to clipboard
      await navigator.clipboard.writeText(cursorMessage);
      console.log('✅ Message copied to clipboard');
      
      // Show success message
      copyBtn.textContent = 'Copied!';
      copyBtn.style.background = '#28a745';
      copyBtn.style.color = 'white';
      
      // Show clipboard instruction
      const instruction = document.createElement('div');
      instruction.style.cssText = `
        margin-top: 10px;
        padding: 8px;
        background: #d4edda;
        color: #155724;
        border: 1px solid #c3e6cb;
        border-radius: 4px;
        font-size: 12px;
        text-align: center;
      `;
      instruction.textContent = '📋 Message copied to clipboard! Paste into Cursor (Cmd+V / Ctrl+V)';
      dialog.appendChild(instruction);
      
      setTimeout(() => {
        document.body.removeChild(modal);
      }, 2000);
      
    } catch (error) {
      console.error('Error:', error);
      alert('Error copying to clipboard: ' + error.message);
    }
  });
  
  // Send to Cursor button
  sendBtn.addEventListener('click', async () => {
    const userMessage = textarea.value.trim();
    
    if (!userMessage) {
      alert('Please enter a message before sending.');
      return;
    }
    
    // Create the formatted message
    const cursorMessage = `Element Analysis Request:

Selected Element:
- Tag: ${elementInfo.tagName}
- Class: ${elementInfo.className || 'none'}
- ID: ${elementInfo.id || 'none'}
- Text: ${elementInfo.textContent || 'none'}

Page Context:
- Title: ${elementInfo.title}
- URL: ${elementInfo.url}
- Domain: ${elementInfo.domain}

HTML Code:
\`\`\`html
${elementInfo.html}
\`\`\`

User Message: ${userMessage}

Timestamp: ${new Date().toISOString()}`;

    try {
      // Send to Cursor (desktop app)
      const result = await sendToCursor(cursorMessage);
      
      // Show success message
      if (result && result.success) {
        if (result.mcpSuccess) {
          sendBtn.textContent = 'Sent to Cursor!';
          sendBtn.style.background = '#28a745';
          
          // Show MCP success instruction
          const instruction = document.createElement('div');
          instruction.style.cssText = `
            margin-top: 10px;
            padding: 8px;
            background: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
            border-radius: 4px;
            font-size: 12px;
            text-align: center;
          `;
          instruction.textContent = '✅ Message sent directly to Cursor via MCP!';
          dialog.appendChild(instruction);
        } else {
          sendBtn.textContent = 'Sent!';
          sendBtn.style.background = '#28a745';
          
          // Show fallback instruction
          const instruction = document.createElement('div');
          instruction.style.cssText = `
            margin-top: 10px;
            padding: 8px;
            background: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
            border-radius: 4px;
            font-size: 12px;
            text-align: center;
          `;
          instruction.textContent = '📋 Message copied to clipboard! Paste into Cursor (Cmd+V / Ctrl+V)';
          dialog.appendChild(instruction);
        }
      } else {
        sendBtn.textContent = 'Sent!';
        sendBtn.style.background = '#28a745';
      }
      
      setTimeout(() => {
        document.body.removeChild(modal);
      }, 2000);
      
    } catch (error) {
      console.error('Error:', error);
      alert('Error sending to Cursor: ' + error.message);
    }
  });
  
  // Close on escape key
  const handleEscape = (event) => {
    if (event.key === 'Escape') {
      document.body.removeChild(modal);
      document.removeEventListener('keydown', handleEscape);
    }
  };
  document.addEventListener('keydown', handleEscape);
  
  // Close on backdrop click
  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      document.body.removeChild(modal);
      document.removeEventListener('keydown', handleEscape);
    }
  });
}

// Handle escape key to cancel inspection
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && isInspecting) {
    stopInspection();
  }
});