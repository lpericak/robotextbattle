// Figure out which LAN IP address other machines should use to reach this
// dev server. The laptop may have more than one network card (NIC), so we pick
// the one that owns the default route (the gateway) rather than guessing en0 or
// assuming a 192.168.2.x subnet.
//
// Usage:
//   import { getLanIp } from "./scripts/lan-address.mjs"
//   node scripts/lan-address.mjs [port]   # prints a connect URL

import { execSync } from "node:child_process";
import os from "node:os";

/** Return the name of the network interface that holds the default route. */
function defaultRouteInterface() {
  try {
    if (process.platform === "darwin") {
      // macOS: `route -n get default` prints a line like "  interface: en0"
      const out = execSync("route -n get default 2>/dev/null", { encoding: "utf8" });
      const m = out.match(/interface:\s*(\S+)/);
      if (m) return m[1];
    } else {
      // Linux: `ip route show default` prints "default via X dev eth0 ..."
      const out = execSync("ip route show default 2>/dev/null", { encoding: "utf8" });
      const m = out.match(/\bdev\s+(\S+)/);
      if (m) return m[1];
    }
  } catch {
    // fall through to the scan below
  }
  return null;
}

/** First non-internal IPv4 address on the given interface, or null. */
function ipv4For(ifaceName) {
  const ifaces = os.networkInterfaces();
  const addrs = ifaceName ? ifaces[ifaceName] : null;
  if (!addrs) return null;
  for (const a of addrs) {
    if (a.family === "IPv4" && !a.internal) return a.address;
  }
  return null;
}

/**
 * Best-guess LAN IPv4 for this machine. Prefers the interface that owns the
 * default route; falls back to the first private, non-internal IPv4 found.
 * Returns { ip, iface } or { ip: null, iface: null } if nothing usable.
 */
export function getLanIp() {
  const routeIface = defaultRouteInterface();
  const routeIp = ipv4For(routeIface);
  if (routeIp) return { ip: routeIp, iface: routeIface };

  // Fallback: scan every interface for a private IPv4 we could share.
  const ifaces = os.networkInterfaces();
  for (const [name, addrs] of Object.entries(ifaces)) {
    for (const a of addrs ?? []) {
      if (a.family === "IPv4" && !a.internal) return { ip: a.address, iface: name };
    }
  }
  return { ip: null, iface: null };
}

// Run directly: print a single connect URL (used by tooling / the skill).
if (import.meta.url === `file://${process.argv[1]}`) {
  const port = process.argv[2] ?? "5555";
  const { ip } = getLanIp();
  if (ip) console.log(`http://${ip}:${port}/`);
  else process.exit(1);
}
