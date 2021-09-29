export const appReducer = (prevState, action) => {
    switch (action.type) {
        case 'toggle-pinned':
            return {
                ...prevState,
                pinnedStops: action.detail.newItems
            }
        default:
            return prevState;
    }
}

export const defaultState = {
    pinnedStops: Object.keys(localStorage).filter(ls => ls.startsWith('pinned-stop')),
    favoriteStop: Object.keys(localStorage).find(ls => ls.startsWith('fave-stop'))
}