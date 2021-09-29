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

const Run = () => {
    const { id } = useParams();
    const location = useLocation();

    const [state, dispatch] = useAsyncReducer(RunReducer.reducer, RunReducer.defaultState);

    const fetchRunResults = () => {
        dispatch({ type: 'set-loading', detail: {} });

        const transportType = new URLSearchParams(location.search);

        const value = transportType.get('transportType');

        dispatch(RunActions.createFetchRunQueryAsync(id, +value));
    }

    useEffect(() => {
        fetchRunResults();
    }, [location]);

    const renderInner = () => {
        switch (state.currentViewState) {
            case 'loading':
                return <SkeletonList />

            case 'results':
                return (
                    <DeparturesList includeStopName={true} includeDestinationName={false} lines={[]} departures={state.stops} />
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