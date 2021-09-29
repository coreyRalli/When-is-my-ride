export const reducer = (prevState, action) => {
    switch (action.type) {
        case 'set-loading':
            return {
                ...prevState,
                currentViewState: 'loading'
            }
        case 'fetch-results':
            return {
                ...prevState,
                currentViewState: 'results',
                stops: action.detail.stops
            }
        case 'set-map':
            return {
                ...prevState,
                mapIsShowing: action.detail.showMap
            }
        default:
            return prevState;
    }
}

export const defaultState = {
    currentViewState: 'loading',
    startingStop: '',
    endingStop: '',
    stops: [],
    mapIsShowing: true
}