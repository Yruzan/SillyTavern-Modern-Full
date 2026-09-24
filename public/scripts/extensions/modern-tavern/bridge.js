/** All SillyTavern-specific code lives here. Core objects are never replaced. */
export class SillyTavernBridge {
    demo = false;
    listeners = [];
    prompt = null;
    get context() { return window.SillyTavern.getContext(); }
    get settings() {
        const c = this.context;
        return c.extensionSettings.modern_tavern ??= {};
    }
    persist() { this.context.saveSettingsDebounced(); }
    characters() {
        const c = this.context;
        return c.characters.map((ch, i) => ({
            id: ch.avatar, index: i, name: ch.name, description: ch.description || ch.data?.description || '',
            avatar: c.getThumbnailUrl('avatar', ch.avatar),
            tags: (c.tagMap?.[ch.avatar] || []).map(id => c.tags.find(t => t.id === id)?.name).filter(Boolean),
            favorite: !this.settings.hiddenFavorites?.includes(ch.avatar) && Boolean(ch.fav || ch.data?.extensions?.fav || this.settings.favorites?.includes(ch.avatar)),
        }));
    }
    status() {
        const c = this.context;
        return { connected: Boolean(c.onlineStatus && c.onlineStatus !== 'no_connection'),
            model: c.mainApi === 'openai' ? c.getChatCompletionModel() : c.onlineStatus,
            provider: c.mainApi || 'No provider' };
    }
    async recent() {
        const r = await fetch('/api/chats/recent', { method: 'POST', headers: this.context.getRequestHeaders(), body: JSON.stringify({ max: 30 }), cache: 'no-cache' });
        if (!r.ok) throw new Error('Could not load recent chats. Your existing chats have not changed.');
        const data = await r.json();
        return data.filter(r => r.avatar || r.group).map(r => ({
            id: `${r.group || r.avatar}:${r.file_name}`, character: r.avatar, group: r.group,
            file: r.file_name.replace(/\.jsonl$/i, ''), name: r.file_name.replace(/\.jsonl$/i, ''),
            text: r.mes || '', count: r.chat_items || 0, date: r.last_mes,
        }));
    }
    async openCharacter(id) {
        const c = this.context; const index = c.characters.findIndex(x => x.avatar === id);
        if (index < 0) throw new Error('This character is no longer available.');
        await c.selectCharacterById(index, { switchMenu: false });
        if (String(this.context.characterId) !== String(index)) throw new Error('Finish the current generation or wait for the chat to save before switching.');
        this.settings.recentCharacters = [id, ...(this.settings.recentCharacters || []).filter(x => x !== id)].slice(0, 20);
        this.persist();
    }
    async openChat(chat) {
        if (chat.group) await this.context.openGroupChat(chat.group, chat.file);
        else { await this.openCharacter(chat.character); if (this.context.getCurrentChatId() !== chat.file) await this.context.openCharacterChat(chat.file); }
    }
    currentName() { return this.context.name2 || 'Chat'; }
    currentAvatar() { const c = this.context; return c.characters[c.characterId]?.avatar; }
    messages() { return this.context.chat; }
    async tokens(text) { return this.context.getTokenCountAsync(text); }
    subscribe(update) {
        const c = this.context; const types = c.eventTypes || c.event_types;
        const on = (type, fn) => { if (type) { c.eventSource.on(type, fn); this.listeners.push([type, fn]); } };
        for (const event of ['CHAT_CHANGED', 'CHARACTER_EDITED', 'CHARACTER_DELETED', 'SETTINGS_UPDATED', 'MAIN_API_CHANGED', 'CONNECTION_PROFILE_LOADED', 'GENERATION_ENDED']) on(types[event], update);
        const capture = data => {
            if (data.dryRun) return;
            // Snapshot only. Never mutate prompts and never save them to storage.
            this.prompt = { capturedAt: Date.now(), chatId: this.context.getCurrentChatId(), data: structuredClone(data.chat ?? data.prompt) };
        };
        on(types.CHAT_COMPLETION_PROMPT_READY, capture);
        on(types.GENERATE_AFTER_COMBINE_PROMPTS, capture);
    }
    unsubscribe() { for (const [type, fn] of this.listeners) this.context.eventSource.removeListener(type, fn); }
    advanced(section) {
        const drawers = { Characters: '#rightNavHolder', 'World Info': '#WI-SP-button', Personas: '#persona-management-button', Presets: '#ai-config-button', Extensions: '#extensions-settings-button', Connections: '#sys-settings-button', Settings: '#user-settings-button', 'Prompt Studio': '#advanced-formatting-button', Library: '#extensions-settings-button' };
        const holder = document.querySelector(drawers[section] || '');
        const icon = holder?.querySelector('.drawer-icon');
        if (icon?.classList.contains('closedIcon')) icon.click();
    }
    create(kind) {
        const sections = { Character: 'Characters', Persona: 'Personas', Chat: 'Characters', 'Group Chat': 'Characters', 'World Info / Lorebook': 'World Info', Preset: 'Presets' };
        this.advanced(sections[kind] || 'Settings');
        const ids = { Character: '#rm_button_create', 'Group Chat': '#rm_button_group_chats' };
        if (ids[kind]) document.querySelector(ids[kind])?.click();
    }
}
