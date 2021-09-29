import { useEffect, useContext } from 'react';

import AppContext from '../../AppContext';

import * as StopActions from './StopActions';
import * as StopReducer from './StopReducer';

import Overview from './Overview/Overview';
import About from './About/About';
import DepartureList from '../../Components/DepartureList/DepartureList';

import Loading from '../../Components/Loading/Loading';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import RefreshIcon from '@mui/icons-material/Refresh';
import Star from '@mui/icons-material/Star';
import StarOutline from '@mui/icons-material/StarOutline';

import SwipeableViews from 'react-swipeable-views';

import { useAsyncReducer } from '../../utils/customHooks';
import { useLocation, useParams } from 'react-router-dom';

import useTheme from '@mui/system/useTheme';

import * as AppActions from '../../AppActions';
import { MenuItem, Select, Container, InputLabel, FormControl } from '@mui/material';

const Stop = () => {
    const [state, dispatch] = useAsyncReducer(StopReducer.reducer, StopReducer.defaultState);
    const { id } = useParams();
    const location = useLocation();

    const context = useContext(AppContext);

    const theme = useTheme();

    useEffect(() => {
        dispatch({ type: 'display-loading', detail: {} });

        const params = new URLSearchParams(location.search);
        const stopId = +id;
        const transportType = +params.get('transportType');

        dispatch(StopActions.createGetOverviewInfoActions(stopId, transportType));
    }, [id]);

    useEffect(() => {
        // This is one of the few cases where we need to implement something like
        // shouldComponentUpdate() as useState can't compare nested objects.
        if (!state.hasInitLoaded) {
            return;
        }

        // If it has loaded, create a timer that fetches the data every 5 seconds or so.
        // TODO: If I time, use WebSockets instead of polling.
        const fetchTimer = setInterval(() => {
            const params = new URLSearchParams(location.search);
            const stopId = +id;
            const transportType = +params.get('transportType');

            dispatch(StopActions.createGetOverviewInfoActions(stopId, transportType));
        }, 5000);

        return () => clearInterval(fetchTimer);
    }, [state])

    const onTabChange = (event, index) => {
        dispatch(StopActions.createSetTabAction(index));
    }

    const onSwipeTabChange = (index) => {
        dispatch(StopActions.createSetTabAction(index));
    }

    const renderInner = () => {
        switch (state.currentView) {
            case 'loading':
                return <Loading />
            case 'results':
                return (
                    <>
                        <Tabs onChange={onTabChange} value={state.currentTabView} centered>
                            <Tab value={0} label="Overview" />
                            <Tab value={1} label="Departures" />
                        </Tabs>

                        <SwipeableViews axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                            index={state.currentTabView}
                            onChangeIndex={onSwipeTabChange}>
                            <div>
                                {
                                    (state.currentTabView === 0) &&
                                    <Overview   latestRoute={state.latestRoute}
                                                transportType={state.transportType} 
                                                latestDeparture={state.latestDeparture} 
                                                latestDepartureLine={state.latestDepartureLine} 
                                                stationName={state.name}
                                                stopLong={state.stopLong}
                                                stopLat={state.stopLat} />
                                }
                            </div>

                            <div>
                                {
                                    (state.currentTabView === 1) &&
                                    <>
                                        <Container maxWidth="md" sx={{ marginTop: '12px', marginBottom: '6px' }}>
                                            <FormControl fullWidth>
                                                <InputLabel id="line-filter-label">Filter by Line</InputLabel>
                                                <Select id="line-filter-select"
                                                    labelId="line-filter-label"
                                                    value={-1}
                                                    label="Filter by Line">
                                                    <MenuItem value={-1}>All</MenuItem>

                                                    {state.routes.map((route,index) => <MenuItem value={index}>{route.name}</MenuItem>)}
                                                </Select>
                                            </FormControl>
                                        </Container>
                                        <DepartureList includeServiceName={true} services={state.routes} departures={state.departures} transportType={state.transportType} lines={state.directions} />
                                    </>
                                }
                            </div>
                        </SwipeableViews>
                    </>
                )
        }
    }

    const onPinnedPressed = () => {
        context.appDispatcher(AppActions.createTogglePinnedAction(id, state.name, state.transportType));
    }

    const onRefreshBtnClick = () => {
        const transportType = +new URLSearchParams(location.search).get('transportType');

        dispatch({ type: 'display-loading', detail: {} })

        dispatch(StopActions.createGetOverviewInfoActions(+id, transportType))
    }

    return (
        <div className="view stop">
            <AppBar position="sticky" sx={{ gridArea: 'AppBar' }}>
                <Toolbar>
                    <Typography component="div" variant="h6" sx={{ flexGrow: 1 }}>
                        {(state.name) ? state.name : 'Stop'}
                    </Typography>

                    {
                        (state.currentView !== 'loading' && state.currentView !== 'error') &&
                        <>
                            <IconButton onClick={onPinnedPressed}>
                                {
                                    (context.appState.pinnedStops.indexOf(`pinned-stop-${id}`) !== -1) ? <Star /> : <StarOutline />
                                }
                            </IconButton>

                            <div>
                                <IconButton onClick={onRefreshBtnClick}>
                                    <RefreshIcon />
                                </IconButton>
                            </div>
                        </>
                    }

                </Toolbar>
            </AppBar>
            {renderInner()}
        </div>
    )
}

export default Stop;