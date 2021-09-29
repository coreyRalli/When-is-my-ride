import React, { useState } from 'react';
import { textValidation, generateFilterText } from './AutoSuggestSearchBox-Helpers';

import './AutoSuggestSearchBox.css';
import searchIcon from '../../assets/search_icon.svg';

import suburbsAndTowns from '../../assets/townsAndSuburbs.json';

import { Button } from '@mui/material';

const AutoSuggestSearchBox = ({ initialText = '',
    compact = false,
    canUseLocation = true,
    onSearchSubmit,
    onLocationUsed,
    initialFilters = { train: true, tram: true, bus: true, vline: true }
}) => {
    const [state, setState] = useState({
        inputText: initialText,
        filters: {
            train: initialFilters.train || false,
            tram: initialFilters.tram || false,
            bus: initialFilters.bus || false,
            vline: initialFilters.vline || false
        },
        oldInputText: '',
        helperText: '',
        filteredSuggestions: [],
        autoCompleteShowing: false,
        currentlySelectedAutoSuggest: -1
    });

    const onTextUpdate = (ev) => {
        // Update suggestions. Start showing suggestions on first match. If auto-complete is
        // showing but there are no new matches on this update, show the last results instead
        // (useful if user makes a typo). Close the auto-suggest when input is empty.
        if (ev.target.value === '') {
            setState(prev => ({ ...prev, currentlySelectedAutoSuggest: -1, autoCompleteShowing: false, helperText: '', inputText: ev.target.value }));
            return;
        }

        // TODO: Change the search criteria from startsWith to includes as search results start to narrow.
        const f = suburbsAndTowns.filter(st => (st.toLowerCase().startsWith(ev.target.value.toLowerCase())))
            .sort((a, b) => a.localeCompare(b))
            .slice(0, 7);

        if (f.length === 0) {
            setState(prev => ({ ...prev, inputText: ev.target.value }));
            return;
        }

        setState(prev => ({ ...prev, inputText: ev.target.value, filteredSuggestions: f, autoCompleteShowing: true, helperText: '', oldInputText: (prev.currentlySelectedAutoSuggest !== -1) ? prev.oldInputText : ev.target.value }));
    }

    const onCheckboxUpdated = (ev) => {
        const newFilters = { ...state.filters };
        newFilters[ev.target.id.replace('transport-type-', '')] = ev.target.checked;

        setState(prev => ({ ...prev, helperText: '', filters: newFilters }));
    }

    const onKeyDown = (ev) => {
        if (ev.keyCode === 27) {
            ev.preventDefault();

            setState(prev => ({ ...prev, autoCompleteShowing: false, inputText: (prev.currentlySelectedAutoSuggest !== -1) ? prev.oldInputText : prev.inputText }));

            return;
        }

        if (ev.keyCode !== 40 && ev.keyCode !== 38)
            return;

        if (!state.autoCompleteShowing) {
            return;
        }

        let newIndex = -1;

        // User presses down key
        if (ev.keyCode === 40) {
            newIndex = state.currentlySelectedAutoSuggest + 1;

            if (newIndex > (state.filteredSuggestions.length - 1))
                // Clears the suggestion box
                newIndex = -1;
        } else if (ev.keyCode === 38) { // User presses up key
            newIndex = state.currentlySelectedAutoSuggest - 1;

            if (newIndex < -1) {
                newIndex = (state.filteredSuggestions.length - 1)
            }
        }

        // If the last index was -1 (nothing), save the old input text so the user can easily get back
        // to it.
        const oldText = (state.currentlySelectedAutoSuggest === -1) ? state.inputText : state.oldInputText;

        const newInputText = (newIndex !== -1) ? state.filteredSuggestions[newIndex] : state.oldInputText;

        setState(prev => ({ ...prev, currentlySelectedAutoSuggest: newIndex, inputText: newInputText, oldInputText: oldText }));
    }

    const onTextInputFocus = () => {
        if (state.inputText.length > 0 && state.filteredSuggestions.length > 0) {
            setState(prev => ({ ...prev, autoCompleteShowing: true }));
        }
    }

    const onTextInputBlur = (ev) => {
        // Required as the onclick event happens after the blur event. Easiest way to handle it while keeping
        // accessiblity.
        setTimeout(() => setState(prev => ({ ...prev, autoCompleteShowing: false, currentlySelectedAutoSuggest: -1 })), 100);
    };

    const onFormSubmit = (ev) => {
        ev.preventDefault();

        if (state.inputText === '')
            return;

        const validity = textValidation(state.inputText, state.filters);

        if (!validity.isValid) {
            setState(prev => ({ ...prev, currentlySelectedAutoSuggest: -1, autoCompleteShowing: false, helperText: validity.helperText }));
            return;
        }

        if (typeof onSearchSubmit === 'function') {
            setState(prev => ({ ...prev, currentlySelectedAutoSuggest: -1, autoCompleteShowing: false }));
            
            const filterStr = generateFilterText(state.filters);

            onSearchSubmit({ suburb: state.inputText, filters: filterStr });
        }
    }

    const onUseLocatonBtnClicked = (ev) => {
        if (Object.keys(state.filters).every(f => !state.filters[f])) {
            setState(prev => ({ ...prev, helperText: "At least one type of transport must be selected" }));
            return;
        }

        if (canUseLocation) {
            navigator.geolocation.getCurrentPosition((pos) => {
                const filterStr = generateFilterText(state.filters);

                if (typeof onLocationUsed === 'function')
                    onLocationUsed({ filterStr, latitude: pos.coords.latitude, longitude: pos.coords.longitude, filters: filterStr });
            });
        }
    }

    const onSuggestionMouseEnter = (ev) => setState(prev => ({ ...prev, currentlySelectedAutoSuggest: ev }));
    const onSuggestionClick = (ev) => {
        // Edge-case: User can select suggestions using the keyboard even if hovering over an item, leading to no visual feedback when the user
        // clicks (the suggestion only displays as active on mouseEnter). Researching how other websites handle this behavior, 
        // the standard seems to just accept it.
        const item = state.filteredSuggestions[ev];

        const validity = textValidation(state.inputText, state.filters);

        if (!validity.isValid) {
            setState(prev => ({ ...prev, currentlySelectedAutoSuggest: -1, autoCompleteShowing: false, helperText: validity.helperText }));
            return;
        }

        if (typeof onSearchSubmit === 'function') {
            const filterStr = generateFilterText(state.filters);
            onSearchSubmit({ suburb: item, filters: filterStr });
        }
    }

    const onSuggestionBoxMouseLeave = () => setState(prev => ({ ...prev, currentlySelectedAutoSuggest: -1 }));

    return (
        <form role="search" autoComplete="off" onSubmit={onFormSubmit} className="search-box">
            <div className="search-box-content-wrapper">
                <div className="suburb-input-container">
                    {(!compact) && <label htmlFor="suburb-input" className="suburb-input-label">Enter Suburb or Town</label>}

                    <div className="input-wrapper">
                        <div className="suburb-input">
                            <input
                                type="search"
                                onChange={onTextUpdate}
                                onFocus={onTextInputFocus}
                                onBlur={onTextInputBlur}
                                value={state.inputText}
                                onKeyDown={onKeyDown}
                                autoComplete="off"
                                autoFocus
                                role="combobox"
                                aria-autocomplete="both"
                                aria-owns="suggestions-list"
                                name="suburb-input"
                                className="suburb-input-text"
                                id="suburb-input"
                                placeholder="e.g. Docklands, Bendigo" />

                            <button className="search-btn">
                                <div className="search-btn-img-container">
                                    <img alt={""} height={24} width={24} src={searchIcon} />
                                </div>
                            </button>

                        </div>

                        <div className={`auto-complete-wrapper ${(!state.autoCompleteShowing) ? 'hidden' : ''}`}>
                            <ul id="suggestions-list" role="listbox" onMouseLeave={onSuggestionBoxMouseLeave} className="auto-complete">
                                {
                                    state.filteredSuggestions.map((suggestion, index) => (
                                        <li key={index}
                                            role="option"
                                            id={`suggestion-${index}`}
                                            onClick={() => onSuggestionClick(index)}
                                            onMouseEnter={() => onSuggestionMouseEnter(index)}
                                            className={`suggestion ${(state.currentlySelectedAutoSuggest === index) ? 'active' : ''}`}>
                                            {suggestion}
                                        </li>
                                    ))
                                }
                            </ul>
                        </div>
                    </div>
                </div>

                {(canUseLocation) && <Button variant="contained" sx={{ marginBottom: '12px' }} onClick={onUseLocatonBtnClicked} type="button" className="use-location-button">Use Location</Button>}

                {
                    (state.helperText.length > 0) && <p className={"search-box-helper-text"}>{state.helperText}</p>
                }

                {
                    (!compact) &&
                    <fieldset>
                        <legend>Show</legend>

                        <label>
                            <input className="checkbox"
                                onChange={onCheckboxUpdated}
                                checked={state.filters.train}
                                type="checkbox"
                                name="transport-type"
                                id="transport-type-train" />
                            <span>Train</span>
                        </label>

                        <label>
                            <input className="checkbox"
                                onChange={onCheckboxUpdated}
                                checked={state.filters.tram}
                                type="checkbox"
                                name="transport-type"
                                id="transport-type-tram" />
                            <span>Tram</span>
                        </label>

                        <label>
                            <input className="checkbox"
                                onChange={onCheckboxUpdated}
                                checked={state.filters.bus}
                                type="checkbox"
                                name="transport-type"
                                id="transport-type-bus" />
                            <span>Bus</span>
                        </label>

                        <label>
                            <input className="checkbox"
                                onChange={onCheckboxUpdated}
                                checked={state.filters.vline}
                                type="checkbox"
                                name="transport-type"
                                id="transport-type-vline" />
                            <span>VLine</span>
                        </label>
                    </fieldset>
                }
            </div>
        </form>
    )
}

export default AutoSuggestSearchBox;