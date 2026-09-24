import test from 'node:test';
import assert from 'node:assert/strict';
import { SillyTavernBridge } from '../public/scripts/extensions/modern-tavern/bridge.js';

test('Modern card editor uses native creation and partial updates', async () => {
    let request;
    let refreshed = 0;
    const previousWindow = globalThis.window;
    const previousFetch = globalThis.fetch;
    globalThis.window = { SillyTavern: { getContext: () => ({
        getRequestHeaders: () => ({ 'Content-Type': 'application/json' }),
        getCharacters: async () => refreshed++,
    }) } };
    globalThis.fetch = async (url, options) => {
        request = { url, body: JSON.parse(options.body) };
        return { ok: true, text: async () => 'Test.png' };
    };
    try {
        const bridge = new SillyTavernBridge();
        assert.equal(await bridge.saveCard(null, { name: 'Test' }), 'Test.png');
        assert.equal(request.url, '/api/characters/create');
        assert.equal(request.body.ch_name, 'Test');
        await bridge.saveCard('Existing.png', { name: 'Test', description: 'Edited' });
        assert.equal(request.url, '/api/characters/merge-attributes');
        assert.equal(request.body.avatar, 'Existing.png');
        assert.equal(request.body.data.description, 'Edited');
        assert.equal('extensions' in request.body.data, false);
        assert.equal('character_book' in request.body.data, false);
        assert.equal(refreshed, 2);
        globalThis.fetch = async () => ({ ok: false });
        await assert.rejects(() => bridge.saveCard(null, { name: 'Test' }), /could not be saved/);
    } finally {
        globalThis.window = previousWindow;
        globalThis.fetch = previousFetch;
    }
});
