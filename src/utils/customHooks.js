import { useReducer, useState } from "react";
import { useLocation } from "react-router-dom";

export function useQuery() {
    return new URLSearchParams(useLocation().search);
}

export const useGeolocationCheck = () => ('geolocation' in navigator);

export const useAsyncReducer = (reducer, defaultState) => {
    const [state, dispatch] = useReducer(reducer, defaultState);

    const customDispatch = (action) => {
        // If the action is a promise, await it before dispatching.
        if (!!action && typeof action.then === 'function') {
            action.then(value => dispatch(value))
                .catch(ex => ({ type: 'error', detail: { errorMessage: ex } }));
        } else {
            dispatch(action);
        }
    }

    return [state, customDispatch];
}

export function useLocalStorage(key, initialValue) {
    // State to store our value
    // Pass initial state function to useState so logic is only executed once
    const [storedValue, setStoredValue] = useState(() => {
        try {
            // Get from local storage by key
            const item = window.localStorage.getItem(key);
            // Parse stored json or if none return initialValue
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            // If error also return initialValue
            console.log(error);
            return initialValue;
        }
    });
    // Return a wrapped version of useState's setter function that ...
    // ... persists the new value to localStorage.
    const setValue = (value) => {
        try {
            // Allow value to be a function so we have same API as useState
            const valueToStore =
                value instanceof Function ? value(storedValue) : value;
            // Save state
            setStoredValue(valueToStore);
            // Save to local storage
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            // A more advanced implementation would handle the error case
            console.log(error);
        }
    };
    return [storedValue, setValue];
}