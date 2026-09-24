import { SillyTavernBridge } from './bridge.js';
import { ModernTavern } from './app.js';
let app;
const context = SillyTavern.getContext();
context.eventSource.on((context.eventTypes || context.event_types).APP_READY, () => {
    // Defer UI setup so the core application lifecycle remains unblocked.
    setTimeout(async () => {
        if (app) return;
        try { app = new ModernTavern(new SillyTavernBridge()); await app.mount(); }
        catch (error) { console.error('[Modern Tavern] Unable to initialize. The original interface is available.', error); document.querySelector('modern-tavern')?.remove(); delete document.body.dataset.modernView; }
    }, 0);
});
