import { useEffect } from 'react';

import { useParams, useLocation } from 'react-router';

import { useAsyncReducer } from '../../utils/customHooks';

import * as RunActions from './RunActions';
import * as RunReducer from './RunReducer';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import SkeletonList from '../../Components/SkeletonList/SkeletonList';
import DeparturesList from '../../Components/DepartureList/DepartureList';

import IconButton from '@mui/material/IconButton';
import RefreshIcon from '@mui/icons-material/Refresh';

import Button from '@mui/material/Button';

import Container from '@mui/material/Container';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

import { formatTime } from '../../utils/consts';

const Run = () => {
    const { id , lineId, directionId, transportType } = useParams();
    const location = useLocation();

    const [state, dispatch] = useAsyncReducer(RunReducer.reducer, RunReducer.defaultState);

    const fetchRunResults = () => {
        dispatch({ type: 'set-loading', detail: {} });

        console.log("Id: ", id);
        console.log("TransportType: ", transportType);
        console.log("Direction ID: ", directionId);
        console.log("Line ID: ", lineId);

        dispatch(RunActions.createFetchRunQueryAsync(id, +transportType, +directionId, +lineId));
    }

    useEffect(() => {
        fetchRunResults();
    }, [location]);

    const mapBtnClick = () => {
        dispatch({ type: 'set-map', detail: { showMap: !state.mapIsShowing } });
    }

    const getInitCenter = () => {
        const query = new URLSearchParams(location.search);

        const mapStartId = query.get('mapStartId');

        if (mapStartId) {
            const mapStartStop = state.stops.find(stop => stop.stopId === +mapStartId);

            if (mapStartStop) {
                return [mapStartStop.stopLat, mapStartStop.stopLong];
            }
        }

        const firstStop = state.stops[0];

        if (firstStop) {

            return [firstStop.stopLat, firstStop.stopLong];
        }

        // If not found, default to flinders street.
        return [
            -37.818078,
            144.96681
        ]
    }

    const renderInner = () => {
        switch (state.currentViewState) {
            case 'loading':
                return <SkeletonList />

            case 'results':
                return (
                    <>
                        <Container maxWidth="md">
                            <Typography variant="h5" sx={{ marginLeft: "8px", marginTop: "12px" }}>
                                <b>{state.stops[0].name}</b> to <b>{state.stops[state.stops.length - 1].name}</b>
                            </Typography>

                            <Button onClick={mapBtnClick} sx={{ marginTop: '12px' }}>
                                {(state.mapIsShowing) ? "Hide Map" : "Show Map"}
                            </Button>

                            {(state.mapIsShowing) &&
                                <div style={{ width: "100%", height: '300px' }}>
                                    <MapContainer center={getInitCenter()} zoom={12} scrollWheelZoom={false}>
                                        <TileLayer
                                            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        />

                                        {
                                            state.stops.map((stop, index) => <Marker key={stop.id}
                                                position={
                                                    [
                                                        stop.stopLat,
                                                        stop.stopLong
                                                    ]
                                                }>
                                                <Popup>
                                                    <Typography sx={{ textAlign: 'center' }}>
                                                        {stop.name}
                                                    </Typography>

                                                    <Typography sx={{ textAlign: 'center' }}>
                                                        {formatTime((stop.liveArrivalTimeUTC) ? stop.liveArrivalTimeUTC : stop.timetabledArrivalTimeUTC)}
                                                    </Typography>
                                                </Popup>
                                            </Marker>)
                                        }
                                    </MapContainer>
                                </div>}
                        </Container>

                        <DeparturesList includeServiceName={false} includeStopName={true} includeDestinationName={false} lines={[]} departures={state.stops} />
                    </>
                )

            case 'error':
                return null;
            default:
                return null;
        }
    }

    const onRefreshBtnClick = () => {
        fetchRunResults();
    }

    return (
        <div className="view run">
            <AppBar position="sticky">
                <Toolbar>
                    <Typography component="div" variant="h6" sx={{ flexGrow: 1 }}>
                        Run
                    </Typography>

                    {
                        (state.currentViewState !== 'loading' && state.currentViewState !== "error") &&
                        <div>
                            <IconButton onClick={onRefreshBtnClick}>
                                <RefreshIcon />
                            </IconButton>
                        </div>
                    }
                </Toolbar>
            </AppBar>

            {renderInner()}
        </div>
    )
}

export default Run;