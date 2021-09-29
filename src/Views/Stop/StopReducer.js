export const reducer = (prevState, action) => {
    switch (action.type) {
        case 'display-overview-data':
        const latestDeparture = action.detail.departures[0] || null;
        const latestDepartureLine = (latestDeparture) ? action.detail.directions.find(dir => dir.id === latestDeparture.directionId) : null;    
        
        return {
                ...prevState,
                latestDeparture,
                latestDepartureLine,
                departures: action.detail.departures,
                directions: action.detail.directions,
                stopLong: action.detail.stopLong,
                stopLat: action.detail.stopLat,
                name: action.detail.name,
                currentView: 'results',
                hasInitLoaded: true,
                transportType: action.detail.transportType
            }
        case 'error':
            return {
                ...prevState,
                currentView: 'error'
            }
        case 'display-loading':
            return {
                ...prevState,
                currentView: 'loading'
            }
        case 'get-initial-pin-state':
            return {
                ...prevState,
                pinStatus: action.detail.favorited
            }
        case 'set-tab':
        return {
                ...prevState,
                currentTabView: action.detail.index
            }
        default:
            return prevState;
    }
}

// TODO: Make basic information it's own property.
export const defaultState = {
    latestDeparture: null,
    latestDepartureLine: null,
    currentView: 'loading',
    currentTabView: 0,
    hasInitLoaded: false,
    errorMessage: '',
    name: '',
    stopLong: 0,
    stopLat: 0,
    departures: [],
    directions: []
}