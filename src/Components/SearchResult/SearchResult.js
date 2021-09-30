import React, { useContext } from 'react';

import { TRANSPORT_ICONS, TRANSPORT_TYPES } from '../../utils/consts';
import { Link as RouterLink } from 'react-router-dom';

import Typography from '@mui/material/Typography';

import Link from '@mui/material/Link';

import AppContext from '../../AppContext';

import IconButton from '@mui/material/IconButton';

import StarOutline from '@mui/icons-material/StarOutline';
import Star from '@mui/icons-material/Star';
import Remove from '@mui/icons-material/Remove';

import './SearchResult.css';

import * as AppActions from '../../AppActions';

const SearchResult = ({ stop, index, showMinusFavInstead = false }) => {
    const context = useContext(AppContext);

    const onFaveButtonPress = () => {
        context.appDispatcher(AppActions.createTogglePinnedAction(stop.id, stop.name, stop.transportType));
    }

    return (
        <li className={`search-result ${(index % 2 !== 0) ? 'alternate' : ''}`}>
            <Link component={RouterLink} className="search-result-clickable" to={`/stop/${stop.id}/${stop.transportType}`}>
                <div className="search-result-icon-container">
                    <img width={48} height={48} src={TRANSPORT_ICONS[stop.transportType]} alt={TRANSPORT_TYPES[stop.transportType]} />
                </div>

                <div className="search-result-info-container">
                    <Typography component="div" variant="h5">
                        {stop.name}
                    </Typography>

                    <Typography component="div" variant="caption">
                        {TRANSPORT_TYPES[stop.transportType]}
                    </Typography>
                </div>
            </Link>

            <div className="fav-container">
                {(context.appState.pinnedStops.indexOf(`pinned-stop-${stop.id}`) !== -1) ?
                    <IconButton onClick={onFaveButtonPress}>
                        {(showMinusFavInstead) ? <Remove /> : <Star />}
                    </IconButton> :

                    <IconButton onClick={onFaveButtonPress}>
                        <StarOutline />
                    </IconButton>}
            </div>
        </li>
    )
}

// TODO: Since the component doesn't have any internal state nor does it's
// props change, inside a list that only changes when the user starts a new search,
// SearchResult is a good candidate for memoization to improve performance.

export default SearchResult;