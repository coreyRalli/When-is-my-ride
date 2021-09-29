import React, { useEffect, useState } from 'react';

import './Overview.css';

import Typography from '@mui/material/Typography';

import Container from '@mui/material/Container';
import Button from '@mui/material/Button';

import { formatDate, formatTime, TRANSPORT_ICONS, TRANSPORT_TYPES } from '../../../utils/consts';

const Overview = ({ latestDeparture, latestDepartureLine, stopLong, stopLat, latestRoute, stationName, transportType }) => {
    const [timerCount, setTimerCount] = useState('');

    useEffect(() => {
        const nextTimer = setInterval(() => {
            const startDate = new Date();
            const endDate = new Date((latestDeparture.liveArrivalTimeUTC !== null) ? latestDeparture.liveArrivalTimeUTC : latestDeparture.timetabledArrivalTimeUTC);
    
            const timeDifference = (endDate.getTime() - startDate.getTime()) / 1000;

            if (timeDifference <= 60) {
                setTimerCount('Less than a minute');
                return;
            }
    
            const d = new Date(null);
            d.setSeconds(timeDifference);
            setTimerCount(d.toISOString().substr(11,8));
        }, 1000);

        return () => clearInterval(nextTimer);
    }, []);
    
    return (
        <Container maxWidth="md" sx={{ textAlign: 'center', justifyContent: 'center', alignItems: 'center', paddingTop: '12px' }}>
            {
                (latestDeparture.liveArrivalTimeUTC) &&
                <div className="live-indicator-container">
                    <div className="live-indicator">

                    </div>

                    <span>LIVE</span>
                </div>
            }

            <Typography variant="overline">
                {stationName}
            </Typography>

            <div style={{ marginBottom: '42px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <img width={48} height={48} src={TRANSPORT_ICONS[transportType]} alt={TRANSPORT_TYPES[transportType]} />
                <Typography variant="caption">({TRANSPORT_TYPES[transportType]})</Typography>
            </div>

            <Typography variant="h5">
                Next Departure
            </Typography>

            <Typography variant="h1">
                {formatTime((latestDeparture.liveArrivalTimeUTC !== null) ? latestDeparture.liveArrivalTimeUTC : latestDeparture.timetabledArrivalTimeUTC)}
            </Typography>

            <Typography variant="h6" sx={{ marginBottom: '24px' }}>
                {timerCount}
            </Typography>

            <Typography variant="caption">
                {formatDate((latestDeparture.liveArrivalTimeUTC !== null) ? latestDeparture.liveArrivalTimeUTC : latestDeparture.timetabledArrivalTimeUTC)}
            </Typography>

            <Typography variant="subtitle1">
                Destination: {latestDepartureLine.name}
            </Typography>

            <Typography variant="subtitle2">
                Line/Service: {latestRoute.name}
            </Typography>

            <Button target="_blank" href={`https://google.com/maps/search?api=1&query=${stopLat}-${stopLong}`} component={"a"} sx={{ marginTop: '12px' }} variant="contained">
                View on Google Maps
            </Button>
        </Container>
    )
}

export default Overview;