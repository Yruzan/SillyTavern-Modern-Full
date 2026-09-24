export function registerNavigationTool(app) {
    const context = document.modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    const pages = ['Home', 'Chats', 'Characters', 'Library', 'World Info', 'Personas', 'Presets', 'Extensions', 'Theme Studio', 'Prompt Studio', 'Connections', 'Settings'];
    try {
        Promise.resolve(context.registerTool({
            name: 'navigate_modern_tavern', title: 'Open a Modern Tavern page',
            description: 'Navigate the visible Modern Tavern workspace. Does not send messages, change provider credentials, or modify chat data.',
            inputSchema: { type: 'object', properties: { page: { type: 'string', enum: pages } }, required: ['page'], additionalProperties: false },
            annotations: { readOnlyHint: false, untrustedContentHint: false },
            async execute(input) {
                if (!input || !pages.includes(input.page) || Object.keys(input).some(k => k !== 'page')) throw new Error('Choose a supported Modern Tavern page.');
                app.classic = false; await app.navigate(input.page);
                return { page: app.page, mode: app.bridge.demo ? 'preview' : 'SillyTavern' };
            },
        }, { signal: lifecycle.signal })).catch(error => console.warn('[Modern Tavern] Optional navigation tool unavailable', error));
        window.addEventListener('pagehide', () => lifecycle.abort(), { once: true });
    } catch (error) { console.warn('[Modern Tavern] Optional navigation tool unavailable', error); }
}
