import { defineConfig, type Plugin } from "vite";
import { getLanIp } from "./scripts/lan-address.mjs";

// The dev server we want other machines on the network to reach. We bind to
// 0.0.0.0 (all interfaces) so phones/laptops on the same Wi-Fi can connect.
//
// Port note: we'd use :80 if we could, but binding to port 80 needs admin
// (root) rights, which `npm run dev` doesn't have. So we use an easy-to-remember
// port for the kids and spell out the full address below.
const DEV_PORT = 5555;

// Prints a clear "other machines connect here" line every time the dev server
// starts, using the NIC that owns the default route (not a hardcoded one).
function printLanUrl(): Plugin {
  return {
    name: "print-lan-url",
    configureServer(server) {
      server.httpServer?.once("listening", () => {
        const addr = server.httpServer?.address();
        const port = addr && typeof addr === "object" && addr ? addr.port : DEV_PORT;
        const { ip, iface } = getLanIp();
        // Defer so this prints just below Vite's own startup banner.
        setTimeout(() => {
          const log = server.config.logger;
          if (ip) {
            log.info("");
            log.info("  ➜  \x1b[1mOther machines on this network connect to:\x1b[0m");
            log.info(`     \x1b[36mhttp://${ip}:${port}/\x1b[0m  \x1b[2m(via ${iface})\x1b[0m`);
            log.info("");
          } else {
            log.warn("  Could not detect a LAN IP address to share.");
          }
        }, 60);
      });
    },
  };
}

export default defineConfig({
  root: ".",
  base: "./",
  plugins: [printLanUrl()],
  server: {
    host: true, // listen on 0.0.0.0 — reachable from other machines
    port: DEV_PORT,
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
});
