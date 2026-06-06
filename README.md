 Fast Emulator Experiment

A browser-based retro console emulator leveraging the [EmulatorJS](https://emulatorjs.org/) framework. This project provides a clean, modern interface for playing classic games with advanced save management and mobile support.

## Supported Consoles
* **Game Boy Advance (GBA)** - Uses `mGBA` core
* **Game Boy / Game Boy Color (GB/GBC)** - Uses `Gambatte` core
* **Nintendo DS (NDS)** - Uses `melonDS` core (Optimized with threaded rendering and frameskipping)

## Features
* **Drag & Drop Loading:** Easily load ROMs (`.gba`, `.gb`, `.gbc`, `.nds`, `.zip`) by dragging them into the browser.
* **Save State Management:** * Export raw battery saves (`.sav`) to your local device.
    * Import existing saves directly (`.sav`, `.srm`, or Eclipse-formatted `.json`/`.eclipse` files).
* **Mobile Ready:** Includes on-screen virtual touch controls (D-Pad, A, B, Start, Select) that automatically appear on smaller screens.
* **Custom BIOS:** Optionally load custom BIOS files (`.bin`) before booting the emulator.
* **True Fullscreen:** Custom CSS patches ensure NDS emulation stretches perfectly to fill modern widescreen displays.

## Setup & Hosting (Important!)

Because modern emulator cores (WebAssembly) require high-performance memory sharing, they rely on a browser feature called `SharedArrayBuffer`. Browsers block this by default for security reasons unless specific server headers are sent.

To fix this on static hosts like **GitHub Pages**, this project uses a Service Worker to inject the required headers.

### Requirements to Run:
1.  Both `index.html` and `coi-serviceworker.js` must be in the same directory.
2.  You **must** serve the files over `https://` (or `localhost` for testing). Opening the HTML file directly from your file system (`file://`) will not work.

### Quick Start (Local)
If you have Python installed, you can quickly test the emulator locally:
