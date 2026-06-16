/**
 * Vercel serverless function entry point.
 *
 * Exports the Express app without starting the server.
 * Vercel's serverless runtime wraps Express apps automatically.
 *
 * This file is built by esbuild (see build.mjs) into api/index.js
 * so Vercel doesn't need to compile TypeScript itself.
 */
import app from "./app.js";

export default app;
