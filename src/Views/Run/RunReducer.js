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
        default:
            return prevState;
    }
}

export const defaultState = {
    currentViewState: 'loading',
    startingStop: '',
    endingStop: '',
    stops: []
}