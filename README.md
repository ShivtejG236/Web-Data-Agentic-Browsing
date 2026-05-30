# NemoForge - Secure AI Web Data Agent Platform

NemoForge is a production-ready, secure AI agent platform built for the **Bright Data AI Agents Web Data Hackathon**. It uses Nvidia NemoClaw paradigms integrated natively with the Bright Data Scraping Browser to orchestrate secure, anti-bot resistant automated web tasks.

## Features
- **Neumorphic Interface**: A premium, tactile dark-mode UI with smooth micro-interactions.
- **Agent Orchestrator**: Create, configure, and monitor AI scraping tasks via WebSocket streams.
- **Bright Data Native**: Built-in integrations for Scraping Browser and Web Unlocker.
- **Local Stealth Simulator**: Sandboxed Chromium instances for testing and demoing without active keys.

## Quick Start (Hackathon Demo)

1. Clone or unpack the repository.
2. Run the one-click launch script:
   ```bash
   chmod +x scripts/launch.sh
   ./scripts/launch.sh
   ```
3. The platform will be available at `http://localhost:5173`.

### Environment Configuration
To enable the full Bright Data integration, edit the generated `.env` file at the root:
```env
BRIGHTDATA_WS_ENDPOINT=wss://brd-customer-[YOUR_ID]-zone-[YOUR_ZONE]:[YOUR_PASS]@brd.superproxy.com:9222
```

## Structure
- `/backend`: Node.js, Express, Puppeteer (with Stealth/BrightData), SQLite, WebSockets.
- `/frontend`: React 19, Vite, Tailwind CSS v4, shadcn/ui, Zustand, Framer Motion.
