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
import { Autocomplete, Container, useTheme, TextField, Checkbox } from '@mui/material';

import NewAutoSuggestBox from '../../Components/NewAutoSuggestBox/NewAutoSuggestBox';

import SwipeableViews from 'react-swipeable-views';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

const Search = () => {
    const location = useLocation();
    const history = useHistory();

    const theme = useTheme();

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

            console.log("The transport type is: " + transportType);

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

    const onLocationSearch = (ev) => {
        history.push(`/search?type=location&latitude=${ev.latitude}&longitude=${ev.longitude}${ev.filters}`);
    }

    const onSwipeChange = (index) => {
        dispatch({ type: 'set-view-tab', detail: { tabIndex: index } })
    }

    const onTabChange = (event, newValue) => {
        dispatch({ type: 'set-view-tab', detail: { tabIndex: newValue } })
    }

    const getInitCenter = () => {
        const firstStop = state.results[0];

        if (firstStop) {
            return [firstStop.stopLat, firstStop.stopLong];
        }

        // Otherwise return flinders street
        return [
            -37.818078,
            144.96681
        ]
    }

    const renderInner = () => {
        switch (state.viewState) {
            case 'loading':
                return <SkeletonList />;
            case 'error':
                return null;
            case 'begin':
                return (
                    <Container maxWidth={"md"} sx={{ marginTop: "44px" }}>
                        <Typography variant="body2" sx={{ textAlign: 'center' }}>Search results will appear here!</Typography>
                    </Container>);
            case 'results':
                return (
                    <>
                        <Tabs onChange={onTabChange} value={state.currentTabIndex} centered>
                            <Tab label="List" />
                            <Tab label="Map" />
                        </Tabs>

                        <SwipeableViews onChange={onSwipeChange} axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                            index={state.currentTabIndex}>
                            <div>
                                {
                                    (state.currentTabIndex === 0) &&
                                    <SearchResultsList stops={state.results} />
                                }
                            </div>

                            <div>
                                {
                                    (state.currentTabIndex === 1) &&
                                    <Container maxWidth={"md"}>
                                        <div style={{ width: "100%", height: '320px' }}>
                                            <MapContainer center={getInitCenter()} zoom={15}>
                                                <TileLayer
                                                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                                />

                                                {
                                                    state.results.map(stop => <Marker position={[stop.stopLat, stop.stopLong]}></Marker>)
                                                }
                                            </MapContainer>
                                        </div>
                                    </Container>
                                }
                            </div>
                        </SwipeableViews>
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

            <NewAutoSuggestBox disabled={(state.viewState === 'loading')} onSearchSubmit={onSearchSubmit}/>

            {renderInner()}
        </div>
    )
}

export default Search;