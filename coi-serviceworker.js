/*! coi-serviceworker v0.1.7 - Extended Offline & PWA Pre-caching Support */
let coepCredentialless = false;
const CACHE_NAME = "gba-cloud-offline-cache-v3";

const PRECACHE_ASSETS = [
    "/",
    "/index.html",
    "/coi-serviceworker.js",
    "https://cdn.emulatorjs.org/stable/data/loader.js"
];

// Helper to inject isolation security headers into any response stream
function injectSecurityHeaders(response) {
    if (response.status === 0) return response;

    const newHeaders = new Headers(response.headers);
    newHeaders.set("Cross-Origin-Embedder-Policy", coepCredentialless ? "credentialless" : "require-corp");
    if (!coepCredentialless) {
        newHeaders.set("Cross-Origin-Resource-Policy", "cross-origin");
    }
    newHeaders.set("Cross-Origin-Opener-Policy", "same-origin");

    return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: newHeaders,
    });
}

if (typeof window === 'undefined') {
    // PWA Pre-caching Core Files
    self.addEventListener("install", (event) => {
        self.skipWaiting();
        event.waitUntil(
            caches.open(CACHE_NAME).then((cache) => {
                return cache.addAll(PRECACHE_ASSETS).catch(err => console.warn("Background precache skipped some items."));
            })
        );
    });

    self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));

    self.addEventListener("message", (ev) => {
        if (!ev.data) return;
        if (ev.data.type === "deregister") {
            self.registration.unregister().then(() => self.clients.matchAll()).then(clients => {
                clients.forEach((client) => client.navigate(client.url));
            });
        } else if (ev.data.type === "coepCredentialless") {
            coepCredentialless = ev.data.value;
        }
    });

    // Highly persistent Offline-First proxy
    self.addEventListener("fetch", function (event) {
        const r = event.request;
        if (r.cache === "only-if-cached" && r.mode !== "same-origin") return;

        const request = (coepCredentialless && r.mode === "no-cors")
            ? new Request(r, { credentials: "omit" })
            : r;

        const isCacheableTarget = r.url.includes("emulatorjs.org") || r.url.includes("jsdelivr.net") || r.url.includes(self.location.origin);

        if (isCacheableTarget && r.method === "GET") {
            event.respondWith(
                caches.match(request).then((cachedResponse) => {
                    if (cachedResponse) {
                        return injectSecurityHeaders(cachedResponse);
                    }
                    return fetch(request).then((networkResponse) => {
                        const copy = networkResponse.clone();
                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put(request, copy);
                        });
                        return injectSecurityHeaders(networkResponse);
                    });
                }).catch((err) => {
                    console.error("[Offline SW] Fetch fallback triggered, attempting to run offline:", err);
                    return fetch(request); // Fails gracefully 
                })
            );
        } else {
            event.respondWith(fetch(request).then((res) => injectSecurityHeaders(res)).catch((e) => console.error(e)));
        }
    });

} else {
    (() => {
        const reloadedBySelf = window.sessionStorage.getItem("coiReloadedBySelf");
        window.sessionStorage.removeItem("coiReloadedBySelf");
        const coepDegrading = (reloadedBySelf == "coepdegrade");

        const coi = {
            shouldRegister: () => !reloadedBySelf,
            shouldDeregister: () => false,
            coepCredentialless: () => true,
            coepDegrade: () => true,
            doReload: () => window.location.reload(),
            quiet: false,
            ...window.coi
        };

        const n = navigator;
        const controlling = n.serviceWorker && n.serviceWorker.controller;

        if (controlling && !window.crossOriginIsolated) {
            window.sessionStorage.setItem("coiCoepHasFailed", "true");
        }
        const coepHasFailed = window.sessionStorage.getItem("coiCoepHasFailed");

        if (controlling) {
            const reloadToDegrade = coi.coepDegrade() && !(coepDegrading || window.crossOriginIsolated);
            n.serviceWorker.controller.postMessage({
                type: "coepCredentialless",
                value: (reloadToDegrade || coepHasFailed && coi.coepDegrade()) ? false : coi.coepCredentialless(),
            });
            if (reloadToDegrade) {
                !coi.quiet && console.log("Reloading page to degrade COEP.");
                window.sessionStorage.setItem("coiReloadedBySelf", "coepdegrade");
                coi.doReload("coepdegrade");
            }
            if (coi.shouldDeregister()) {
                n.serviceWorker.controller.postMessage({ type: "deregister" });
            }
        }

        if (window.crossOriginIsolated !== false || !coi.shouldRegister()) return;
        if (!window.isSecureContext) return;
        if (!n.serviceWorker) return;

        n.serviceWorker.register(window.document.currentScript.src).then(
            (registration) => {
                registration.addEventListener("updatefound", () => {
                    window.sessionStorage.setItem("coiReloadedBySelf", "updatefound");
                    coi.doReload();
                });
                if (registration.active && !n.serviceWorker.controller) {
                    window.sessionStorage.setItem("coiReloadedBySelf", "notcontrolling");
                    coi.doReload();
                }
            },
            (err) => { !coi.quiet && console.error("COOP/COEP Service Worker failed to register:", err); }
        );
    })();
}
