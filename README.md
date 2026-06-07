🎮 Fast Emulator ExperimentA modern, browser-based retro console emulator pipeline leveraging the EmulatorJS framework. This project provides a clean, responsive interface for playing classic games with advanced save management and mobile layout optimization.


🕹️ Supported ConsolesGame Boy Advance (GBA): Powered by the high-accuracy mGBA core.Game Boy / Game Boy Color (GB/GBC): Powered by the lightweight Gambatte core.Nintendo DS (NDS): Powered by the melonDS core, optimized with frameskipping.

🌟 Core Features📂 File & Core ManagementSmart Drag & Drop Loading: Instantly load game files (.gba, .gb, .gbc, .nds, .zip) by dragging them straight into your browser window.Automatic Engine Selection: The application automatically swaps internal emulator cores based on the extension of your dropped file.

Custom BIOS Injection: Load official console BIOS binaries (.bin) to improve game compatibility and boot sequences.


💾 Advanced Save PipelineRaw Battery Export: Download your standard .sav backup files to keep your game saves safe on your local drive.Multi-Format Importing: Read game progress from raw files (.sav, .srm) or cross-platform emulator files (.json, .eclipse).IndexedDB Binary Chunking: Splits heavy game data into small virtual fragments to cleanly bypass the browser's strict 5MB storage limits.

Upstream Cloud Link: Includes an architecture hook (performCloudBackup) ready to bridge your save states to remote storage endpoints.



📱 Mobile & Interface LayoutsDraggable Touch Overlays: Tap and reposition on-screen virtual buttons (D-Pad, A, B, Turbo, Start, Select) anywhere on your screen.Smart Coordinate Memory: Button layouts are automatically saved to localStorage so you do not lose your layout setup on refresh.


Adaptive Visibility: Touch pads automatically hide on desktop displays and scale smoothly across varying mobile viewports.True Fullscreen Scaling: Utilizes custom CSS rules to override standard scaling limits and stretch viewports nicely on widescreen monitors.


⚙️ Performance ControlsDynamic Frameskip Balancing: Select performance profiles ranging from Strict Synchronization up to Max Boost Frame Skipping.One-Tap Turbo Execution: Speed past slow text sequences using a dedicated fast-forward toolbar toggle.

🚨 Critical Hosting SetupBecause modern emulator cores rely on high-performance memory sharing (SharedArrayBuffer), browsers block them by default. This project uses a custom Service Worker pipeline (coi-serviceworker.js) to fix this security lock.

Deployment Rules:Both index.html and coi-serviceworker.js must stay together in the exact same directory.Your website must be served over an encrypted connection (https://) or a local development loop (localhost).Opening the raw file directly via your desktop file directory (file://) will not work.

🚀 Quick Start (Local Development)If you have Python installed on your computer, you can run a quick local server loop to test the code:Open your terminal application inside your project folder.Run the local host server command:bashpython -m http.server 8000. Open your web browser and navigate to: http://localhost:8000

⚠️ Performance Note: Setting the frame cap setting to 3 frames might make gameplay look choppy. A setting of 2 frames is acceptable for slower devices, but it is highly recommended to leave it on the Auto Balance (Default) setting.

