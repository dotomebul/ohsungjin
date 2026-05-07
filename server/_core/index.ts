import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { registerStorageProxy } from "./storageProxy";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  registerStorageProxy(app);
  registerOAuthRoutes(app);

  // Serve PWA manifest and service worker before SPA fallback
  app.get('/manifest.json', (_req, res) => {
    res.setHeader('Content-Type', 'application/manifest+json');
    res.json({
      name: 'Evacora - Emergency Safety App',
      short_name: 'Evacora',
      description: 'Real-time crisis guidance, nearest shelter routing, and one-tap safety check-ins for emergencies.',
      start_url: '/',
      display: 'standalone',
      background_color: '#0f172a',
      theme_color: '#0f172a',
      orientation: 'portrait',
      lang: 'en',
      categories: ['safety', 'navigation', 'utilities'],
      icons: [
        { src: '/manus-storage/icon-48x48_ac94a031.png', sizes: '48x48', type: 'image/png' },
        { src: '/manus-storage/icon-72x72_5d0fdfcb.png', sizes: '72x72', type: 'image/png' },
        { src: '/manus-storage/icon-96x96_4b1d4cf7.png', sizes: '96x96', type: 'image/png' },
        { src: '/manus-storage/icon-144x144_40b37f91.png', sizes: '144x144', type: 'image/png' },
        { src: '/manus-storage/icon-192x192_9c869635.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
        { src: '/manus-storage/icon-512x512_5040cb0f.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
      ],
      shortcuts: [
        {
          name: 'Emergency Map',
          short_name: 'Map',
          description: 'View nearby shelters and danger zones',
          url: '/map',
          icons: [{ src: '/manus-storage/icon-96x96_4b1d4cf7.png', sizes: '96x96' }],
        },
        {
          name: 'Action Guide',
          short_name: 'Guide',
          description: 'Emergency action checklist',
          url: '/action-guide',
          icons: [{ src: '/manus-storage/icon-96x96_4b1d4cf7.png', sizes: '96x96' }],
        },
      ],
    });
  });
  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
