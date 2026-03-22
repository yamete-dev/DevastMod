# DevastMod API

The DevastMod API is a TypeScript-based framework specifically designed to manage and spawn bots into devast.io servers. 

## Structure & Architecture

The framework operates by simulating WebSocket (`ws`) connections to the server, mimicking real game clients. 
- Core logic handles bypassing the login/bot protections.
- It uses external proxy agents (`https-proxy-agent`) to spawn multiple instances seamlessly and bypass IP-rate limits seamlessly.
- Includes `bot.ts` to manage instance logic, state, and connections.
- Uses `engine.js` for some of the shared game logic payloads.

## Installation

1. Make sure you have [Node.js](https://nodejs.org/) installed along with `npm`.
2. Navigate to this directory:
   ```bash
   cd devastmod-api-main
   ```
3. Install the dependencies:
   ```bash
   npm install
   ```

## Usage

To start the bot framework controller via `ts-node`:

```bash
npm install -g ts-node typescript
npx ts-node index.ts
```

Your bots will configure their connection and attempt joining the game server defined in your scripts.
