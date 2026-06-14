---
name: serve
description: Launch the dev server so OTHER machines on the network can connect (e.g. another laptop or a phone on the same Wi-Fi), and print the exact IP address to give them. Use when the user wants to host the game for someone else, share it on the local network, "let Oliver connect", "play on another computer", "host it", or asks what IP/address to connect to. For just opening the game locally to play, use the `play` skill instead.
---

# Serve the game on the local network

The dev server binds to `0.0.0.0`, so it's reachable from other machines on the
same network (same Wi-Fi / LAN). This skill starts it and tells the user the
exact address to hand to whoever is connecting.

## Steps

1. **Check if the dev server is already running** on port 5555:

   ```bash
   curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:5555/
   ```

   - `200` → already running, skip to step 3.
   - anything else → start it in step 2.

2. **Start the dev server in the background** (so it keeps running):

   ```bash
   npm run dev
   ```

   On startup it prints a line like:

   ```
     ➜  Other machines on this network connect to:
        http://192.168.2.21:5555/  (via en0)
   ```

3. **Get the connect address** to hand out. The server already printed it, but
   you can also compute it directly without restarting:

   ```bash
   node scripts/lan-address.mjs 5555
   ```

   This picks the network card that owns the **default route** (the one with the
   gateway — usually `en0`), so it works even when the laptop has more than one
   NIC. Do not hardcode the IP or assume a `192.168.2.x` subnet — always read it
   from this command.

4. **Tell the user the address in plain words**, e.g.:
   "Tell Oliver to open **http://192.168.2.21:5555/** in his browser. You both
   need to be on the same Wi-Fi."

## Notes

- **Port 80?** We'd use `http://<ip>/` (port 80) if we could, but binding to
  port 80 needs admin/root rights that `npm run dev` doesn't have. So we use
  **5555** — an easy-to-remember port for the kids — and spell out the full
  `IP:port`. (To change the port, edit `DEV_PORT` in `vite.config.ts`.)
- **Same network required.** The other machine must be on the same LAN/Wi-Fi.
  If they can't connect, the usual culprits are: different Wi-Fi networks, a
  "guest" network that isolates devices, or a macOS firewall prompt — accept the
  incoming-connections prompt for Node if it appears.
- **It's a dev server, not a public site.** This only works on the local
  network; it is not exposed to the internet.
