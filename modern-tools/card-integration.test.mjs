import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { SillyTavernBridge } from '../public/scripts/extensions/modern-tavern/bridge.js';

// Disposable data root; never uses the operator's chats, cards or credentials.
const dataRoot = await mkdtemp(join(tmpdir(), 'modern-card-test-'));
const server = spawn(process.execPath, ['server.js', '--port', '8019', '--dataRoot', dataRoot, '--browserLaunchEnabled', 'false'], { stdio: ['ignore', 'pipe', 'pipe'] });
const base = 'http://127.0.0.1:8019';
let logs = '';
server.stdout.on('data', value => { logs += value; });
server.stderr.on('data', value => { logs += value; });
const originalFetch = globalThis.fetch;
try {
    let ready;
    for (let i = 0; i < 120; i++) {
        try { ready = await originalFetch(base + '/csrf-token'); if (ready.ok) break; } catch { /* starting */ }
        if (server.exitCode !== null) throw new Error(logs);
        await new Promise(resolve => setTimeout(resolve, 500));
    }
    assert.ok(ready?.ok, 'Server must start: ' + logs.slice(-1000));
    const cookie = ready.headers.getSetCookie().map(v => v.split(';')[0]).join('; ');
    const { token } = await ready.json();
    const headers = { 'Content-Type': 'application/json', Cookie: cookie, 'X-CSRF-Token': token };
    globalThis.fetch = (url, options) => originalFetch(base + url, options);
    let refreshed = 0;
    globalThis.window = { SillyTavern: { getContext: () => ({ getRequestHeaders: () => headers, getCharacters: async () => refreshed++ }) } };
    const bridge = new SillyTavernBridge();
    const avatar = await bridge.saveCard(null, { name: 'Modern integration test', description: 'Before', first_mes: 'Hello', alternate_greetings: ['One', 'Two'] });
    const post = async (route, body) => {
        const response = await fetch(route, { method: 'POST', headers, body: JSON.stringify(body) });
        assert.ok(response.ok, `${route}: ${await response.clone().text()}`);
        return response;
    };
    await post('/api/characters/merge-attributes', { avatar, data: { extensions: { modern_test_unknown: { value: 'preserve' } }, creator: 'Original creator' } });
    await bridge.saveCard(avatar, { name: 'Modern integration test', description: 'After', alternate_greetings: [] });
    const saved = await (await post('/api/characters/get', { avatar_url: avatar })).json();
    assert.equal(saved.data.description, 'After');
    assert.equal(saved.data.first_mes, 'Hello');
    assert.equal(saved.data.creator, 'Original creator');
    assert.equal(saved.data.extensions.modern_test_unknown.value, 'preserve');
    assert.deepEqual(saved.data.alternate_greetings, []);
    assert.equal(refreshed, 2);
    console.log('PASS: real API create/edit/readback, cleared greetings, preserved unrelated fields; CSRF enabled.');
} finally {
    globalThis.fetch = originalFetch;
    server.kill('SIGTERM');
}
