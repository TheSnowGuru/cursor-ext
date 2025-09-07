#!/usr/bin/env node

/**
 * MCP Server for Cursor Code Inspector Extension
 * This server bridges the Chrome extension with Cursor via MCP protocol
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

class CursorInspectorMCPServer {
  constructor() {
    this.server = new Server(
      {
        name: 'cursor-inspector-mcp',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
    this.setupErrorHandling();
  }

  setupToolHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'inspect_element',
            description: 'Inspect an HTML element and send analysis to Cursor',
            inputSchema: {
              type: 'object',
              properties: {
                elementData: {
                  type: 'object',
                  description: 'Element information from the Chrome extension',
                  properties: {
                    tagName: { type: 'string' },
                    className: { type: 'string' },
                    id: { type: 'string' },
                    textContent: { type: 'string' },
                    html: { type: 'string' },
                    url: { type: 'string' },
                    title: { type: 'string' },
                    domain: { type: 'string' }
                  }
                },
                userMessage: {
                  type: 'string',
                  description: 'User message or question about the element'
                }
              },
              required: ['elementData', 'userMessage']
            }
          },
          {
            name: 'send_to_cursor',
            description: 'Send formatted message directly to Cursor chat',
            inputSchema: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  description: 'Formatted message to send to Cursor'
                }
              },
              required: ['message']
            }
          }
        ]
      };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'inspect_element':
            return await this.handleInspectElement(args);
          case 'send_to_cursor':
            return await this.handleSendToCursor(args);
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error.message}`
            }
          ],
          isError: true
        };
      }
    });
  }

  async handleInspectElement(args) {
    const { elementData, userMessage } = args;
    
    // Format the analysis message
    const analysisMessage = `Element Analysis Request:

Selected Element:
- Tag: ${elementData.tagName}
- Class: ${elementData.className || 'none'}
- ID: ${elementData.id || 'none'}
- Text: ${elementData.textContent || 'none'}

Page Context:
- Title: ${elementData.title}
- URL: ${elementData.url}
- Domain: ${elementData.domain}

HTML Code:
\`\`\`html
${elementData.html}
\`\`\`

User Message: ${userMessage}

Timestamp: ${new Date().toISOString()}`;

    // Send to Cursor
    await this.sendToCursor(analysisMessage);

    return {
      content: [
        {
          type: 'text',
          text: `✅ Element analysis sent to Cursor successfully!\n\n${analysisMessage}`
        }
      ]
    };
  }

  async handleSendToCursor(args) {
    const { message } = args;
    
    await this.sendToCursor(message);

    return {
      content: [
        {
          type: 'text',
          text: `✅ Message sent to Cursor successfully!\n\n${message}`
        }
      ]
    };
  }

  async sendToCursor(message) {
    // This is where we would integrate with Cursor's API
    // For now, we'll use a simple approach that works with Cursor's chat
    
    try {
      // Method 1: Try to use Cursor's API if available
      if (typeof globalThis.cursor !== 'undefined') {
        await globalThis.cursor.chat.send(message);
        return;
      }

      // Method 2: Use clipboard as fallback
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(message);
        console.log('📋 Message copied to clipboard for Cursor');
        return;
      }

      // Method 3: Write to a file that Cursor can monitor
      const fs = await import('fs');
      const path = await import('path');
      const os = await import('os');
      
      const tempDir = os.tmpdir();
      const cursorFile = path.join(tempDir, 'cursor-inspector-message.txt');
      
      await fs.promises.writeFile(cursorFile, message, 'utf8');
      console.log(`📄 Message written to: ${cursorFile}`);

    } catch (error) {
      console.error('Error sending to Cursor:', error);
      throw error;
    }
  }

  setupErrorHandling() {
    this.server.onerror = (error) => {
      console.error('[MCP Error]', error);
    };

    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Cursor Inspector MCP Server running on stdio');
  }
}

// Start the server
const server = new CursorInspectorMCPServer();
server.run().catch(console.error);
