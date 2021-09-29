export const reducer = (prevState, action) => {
    switch (action.type) {
        case 'display-results':
            return {
                ...prevState,
                results: action.detail.results,
                viewState: 'results',
                currentTabIndex: 0
            }
        case 'display-loading':
            return {
                ...prevState,
                viewState: 'loading',
                errorMessage: ''
            }
        case 'set-view-tab':
            return {
                ...prevState,
                currentTabIndex: action.detail.tabIndex
            }
        case 'error':
            return {
                ...prevState,
                viewState: 'error',
                errorMessage: action.detail.errorMessage
            }
        case 'display-begin':
            return {
                ...prevState,
                viewState: 'begin'
            }
        default:
            return prevState;
    }
}

export const defaultState = {
    viewState: 'loading',
    results: [],
    errorMessage: '',
    currentTabIndex: 0
}