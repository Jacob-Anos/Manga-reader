<script type="text/plain" id="readme-md">
# Manga / Manhwa Tracker (PWA)
Lehká PWA aplikace pro sledování rozčtených mang/manhwy. Funguje offline (service worker), lze nainstalovat na plochu (manifest), data ukládá do `localStorage` na zařízení.


## 🗂 Struktura
```
index.html
manifest.webmanifest
service-worker.js
icon-192.png
icon-512.png
```


## 🚀 Lokální spuštění (macOS / Windows / Linux)
1. Nakopíruj soubory do jedné složky.
2. Spusť lokální server (vyžadováno pro PWA):
```bash
npx serve -s
```
3. Otevři `http://localhost:3000`.
4. (Volitelné) Nainstaluj jako aplikaci:
- Chrome/Edge: ikona „Install“ v adresním řádku.
- iOS Safari: Sdílet → Přidat na plochu.


## 🌐 Nasazení na GitHub Pages
1. Vytvoř public repo (např. `manga-tracker`).
2. Nahraj obsah rootu repo (`index.html`, manifest, SW, ikony).
3. Settings → Pages → *Deploy from a branch* → `main` / root.
4. Otevři URL `https://<uživatel>.github.io/manga-tracker/`.


## 🧩 Poznámky k PWA
- `manifest.webmanifest` má `start_url: "./"` → funguje i v podadresáři.
- `service-worker.js` cacheuje základní soubory (offline). Při změnách **zvyš verzi**:
```js
const CACHE_NAME = 'manga-tracker-v2';
```
- Ikony přidej do rootu (`icon-192.png`, `icon-512.png`).


## 💾 Kde jsou data?
- V `localStorage` prohlížeče (zůstávají jen v zařízení). Export/Import dat je přes JSON v aplikaci.


## 🔧 Skript pro rychlý start (volitelné)
Ulož jako `start.sh` a udělej spustitelný: `chmod +x start.sh`
```bash
#!/usr/bin/env bash
set -euo pipefail
PORT=${PORT:-3000}
if ! command -v npx >/dev/null 2>&1; then
echo "Prosím nainstaluj Node.js (https://nodejs.org)."; exit 1
fi
npx serve -l $PORT -s . &
PID=$!
open "http://localhost:$PORT" 2>/dev/null || xdg-open "http://localhost:$PORT" || true
wait $PID
```
</script>
