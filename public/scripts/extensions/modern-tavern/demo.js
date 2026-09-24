const A = new URL('./assets/', import.meta.url).href;
export class DemoBridge {
    demo = true;
    prompt = null;
    selected = 'seraphina';
    constructor() {
        try { this.settings = JSON.parse(localStorage.getItem('modern-tavern-preview') || '{}'); } catch { this.settings = {}; }
        this.people = [
            { id: 'seraphina', name: 'Seraphina', description: 'A warm-hearted adventurer with a curious mind and a world of stories to tell.', avatar: A + 'seraphina.png', tags: ['Fantasy', 'Adventure'], favorite: true },
            { id: 'narrator', name: 'The Night Chronicler', description: 'Every lantern in the old city holds a story. Which one will you follow?', avatar: A + 'moonlit-city.jpg', tags: ['Narrator', 'Mystery'], favorite: true },
            { id: 'wanderer', name: 'Beyond the Horizon', description: 'A quiet, open-world journey through forgotten mountain kingdoms.', avatar: A + 'mountain-lake.jpg', tags: ['Adventure', 'Open world'], favorite: true },
            { id: 'spring', name: 'A Season of Stories', description: 'Slow afternoons, chance encounters, and a little everyday magic.', avatar: A + 'cherry-path.jpg', tags: ['Slice of life', 'Narrator'], favorite: true },
        ];
        this.histories = {
            seraphina: [{ name: 'Seraphina', is_user: false, mes: '*The lantern flickers as Seraphina looks up from a weathered map, a smile finding its way to her lips.*\n\n"There you are. I was starting to think I’d have to discover this place on my own."\n\n*She slides the map across the table.*\n\n"So… where should we go first?"' }],
            narrator: [{ name: 'The Night Chronicler', is_user: false, mes: '*Midnight settles over the city. Beneath the bridge, a single lantern is still burning.*\n\nA folded letter waits beside it. On the outside, in ink still wet, is your name.' }],
            wanderer: [{ name: 'Beyond the Horizon', is_user: false, mes: '*The mountains open before you. A lake catches the last of the light, and somewhere beyond it, a bell begins to ring.*\n\nYour journey begins here.' }],
            spring: [{ name: 'A Season of Stories', is_user: false, mes: '*Cherry petals drift across the empty path. Someone has left a book open on the bench.*\n\nA handwritten note slips from between the pages.' }],
        };
    }
    persist() { localStorage.setItem('modern-tavern-preview', JSON.stringify(this.settings)); }
    characters() { return [...this.people, ...(this.settings.characters || [])].map(c => ({ ...c, favorite: this.settings.favorites ? this.settings.favorites.includes(c.id) : c.favorite })); }
    status() { return { connected: false, model: 'No model connected', provider: 'Interactive preview' }; }
    async recent() {
        return [
            { id: 'one', character: 'seraphina', name: 'A new adventure', text: 'So… where should we go first?', count: 1, date: 'Sample conversation' },
            { id: 'two', character: 'narrator', name: 'The city after midnight', text: 'A folded letter waits beside the lantern.', count: 1, date: 'Sample conversation' },
            { id: 'three', character: 'wanderer', name: 'Where the mountains end', text: 'Your journey begins here.', count: 1, date: 'Sample conversation' },
        ];
    }
    async openCharacter(id) { this.selected = id; this.settings.recentCharacters = [id, ...(this.settings.recentCharacters || []).filter(x => x !== id)].slice(0, 20); this.persist(); }
    async openChat(c) { return this.openCharacter(c.character); }
    currentName() { return this.characters().find(c => c.id === this.selected)?.name || 'Chat'; }
    currentAvatar() { return this.selected; }
    messages() { return this.histories[this.selected] || [{ name: this.currentName(), is_user: false, mes: this.characters().find(c => c.id === this.selected)?.greeting || 'Your story starts here.' }]; }
    subscribe() {}
    unsubscribe() {}
}
