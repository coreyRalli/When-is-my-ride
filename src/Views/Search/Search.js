import AutocompleteSearchBox from '../../Components/AutoSuggestBox/AutoSuggestSearchBox';
import SkeletonList from '../../Components/SkeletonList/SkeletonList';

import { useEffect } from "react";
import { useLocation, useHistory } from "react-router";

import { useAsyncReducer } from '../../utils/customHooks';

import * as SearchReducer from './SearchResultReducer';
import * as SearchResultActions from './SearchResultActions';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import './Search.css';
import SearchResultsList from '../../Components/SearchResultList/SearchResultsList';

const Search = () => {
    const location = useLocation();
    const history = useHistory();

    const handleSearch = () => {
        dispatch(SearchResultActions.createDisplayLoadingAction());

        const queryParameters = new URLSearchParams(location.search);
        const searchType = queryParameters.get('type');
        const transportType = SearchResultActions.createTransportTypeArray(queryParameters);

        if (searchType === 'suburb') {
            const suburb = queryParameters.get('suburb');

            dispatch(SearchResultActions.createDisplayResultsAction('suburb', { suburb, transportType }));
        } else if (searchType === 'location') {
            const longitude = queryParameters.get('latitude');
            const latitude = queryParameters.get('longitude');

            dispatch(SearchResultActions.createDisplayResultsAction('location', { transportType, longitude, latitude }));
        } else {
            // Query did not include a type parameter.
            dispatch(SearchResultActions.createDisplayBeginAction());
        }
    }

    const [state, dispatch] = useAsyncReducer(SearchReducer.reducer, SearchReducer.defaultState);

    useEffect(() => {
        handleSearch();
    }, [location])

    const onSearchSubmit = (ev) => {
        console.log("Navigating to: ", `/search?type=suburb&suburb=${ev.suburb}${ev.filters}`);
        history.push(`/search?type=suburb&suburb=${ev.suburb}${ev.filters}`);
    }

    const renderInner = () => {
        switch (state.viewState) {
            case 'loading':
                return <SkeletonList />;
            case 'error':
                return null;
            case 'begin':
                return (
                    <div className="message">
                        <p>Results will show up here!</p>
                    </div>);
            case 'results':
                return (
                    <>
                        <Tabs value={state.currentTabIndex} centered>
                            <Tab label="List" />
                            <Tab label="Map" />
                        </Tabs>

                        {
                            (state.currentTabIndex === 0) &&
                            <SearchResultsList stops={state.results} />
                        }
                    </>
                )
        }
    }

    return (
        <div className="view search">
            <AppBar position="sticky" sx={{ gridArea: 'AppBar' }}>
                <Toolbar>
                    <Typography component="div" variant="h6">
                        Search
                    </Typography>
                </Toolbar>
            </AppBar>
            <AutocompleteSearchBox onSearchSubmit={onSearchSubmit} />
            {renderInner()}
        </div>
    )
}

export default Search;