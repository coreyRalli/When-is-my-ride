export const createTogglePinnedAction = (id, name, transportType) => {
    const itemKey = `pinned-stop-${id}`;
    
    if (localStorage.getItem(itemKey)) {
        // Remove
        localStorage.removeItem(itemKey)
    } else {
        // Add
        localStorage.setItem(itemKey, JSON.stringify({ name, transportType, id }));
    }
    
    return { type: 'toggle-pinned', detail: { newItems: Object.keys(localStorage).filter(ps => ps.startsWith('pinned-stop-')) } }
}