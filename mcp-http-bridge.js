#!/usr/bin/env node

/**
 * HTTP Bridge for MCP Server
 * This creates an HTTP endpoint that the Chrome extension can call
 */

import { createServer } from 'http';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class MCPHttpBridge {
  constructor(port = 3001) {
    this.port = port;
    this.mcpProcess = null;
  }

  start() {
    const server = createServer((req, res) => {
      // Enable CORS
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

      if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
      }

      if (req.method === 'POST' && req.url === '/mcp') {
        this.handleMCPRequest(req, res);
      } else {
        res.writeHead(404);
        res.end('Not Found');
      }
    });

    server.listen(this.port, () => {
      console.log(`🚀 MCP HTTP Bridge running on http://localhost:${this.port}`);
      console.log('📡 Ready to receive requests from Chrome extension');
    });

    // Start MCP server process
    this.startMCPServer();
  }

  startMCPServer() {
    const mcpServerPath = join(__dirname, 'mcp-server.js');
    
    this.mcpProcess = spawn('node', [mcpServerPath], {
      stdio: ['pipe', 'pipe', 'pipe']
    });

    this.mcpProcess.stdout.on('data', (data) => {
      console.log('MCP Server:', data.toString());
    });

    this.mcpProcess.stderr.on('data', (data) => {
      console.error('MCP Server Error:', data.toString());
    });

    this.mcpProcess.on('close', (code) => {
      console.log(`MCP Server process exited with code ${code}`);
    });
  }

  handleMCPRequest(req, res) {
    let body = '';
    
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      try {
        const request = JSON.parse(body);
        console.log('📨 Received MCP request:', request);

        // For now, we'll simulate the MCP response
        // In a real implementation, this would communicate with the MCP server
        const response = {
          success: true,
          message: 'Message sent to Cursor via MCP',
          data: request
        };

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(response));

        // Also copy to clipboard as backup
        this.copyToClipboard(request.params.message);

      } catch (error) {
        console.error('Error handling MCP request:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: error.message }));
      }
    });
  }

  async copyToClipboard(text) {
    try {
      // Try to copy to clipboard using system command
      const { exec } = await import('child_process');
      const { promisify } = await import('util');
      const execAsync = promisify(exec);

      // Detect OS and use appropriate clipboard command
      const os = process.platform;
      let command;
      
      if (os === 'darwin') {
        command = `echo "${text.replace(/"/g, '\\"')}" | pbcopy`;
      } else if (os === 'win32') {
        command = `echo "${text.replace(/"/g, '\\"')}" | clip`;
      } else {
        command = `echo "${text.replace(/"/g, '\\"')}" | xclip -selection clipboard`;
      }

      await execAsync(command);
      console.log('📋 Message copied to clipboard');
    } catch (error) {
      console.error('Error copying to clipboard:', error);
    }
  }

  stop() {
    if (this.mcpProcess) {
      this.mcpProcess.kill();
    }
    process.exit(0);
  }
}

// Start the bridge
const bridge = new MCPHttpBridge();
bridge.start();

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down MCP HTTP Bridge...');
  bridge.stop();
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down MCP HTTP Bridge...');
  bridge.stop();
});
