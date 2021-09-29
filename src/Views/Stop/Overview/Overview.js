import React, { useEffect, useState } from 'react';

import './Overview.css';

import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';

import Container from '@mui/material/Container';

import { formatDate, formatTime } from '../../../utils/consts';

const Overview = ({ latestDeparture, latestDepartureLine, stationName }) => {
    const [timerCount, setTimerCount] = useState('');

    useEffect(() => {
        const nextTimer = setInterval(() => {
            const startDate = new Date();
            const endDate = new Date((latestDeparture.liveArrivalTimeUTC !== null) ? latestDeparture.liveArrivalTimeUTC : latestDeparture.timetabledArrivalTimeUTC);
    
            const timeDifference = (endDate.getTime() - startDate.getTime()) / 1000;
    
            const d = new Date(null);
            d.setSeconds(timeDifference);
            setTimerCount(d.toISOString().substr(11,8));
        }, 1000);

        return () => clearInterval(nextTimer);
    }, []);
    
    return (
        <Container maxWidth="md" sx={{ textAlign: 'center', justifyContent: 'center', alignItems: 'center' }}>
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

            <Typography variant="h5">
                Next Departure
            </Typography>

            <Typography variant="h1">
                {formatTime((latestDeparture.liveArrivalTimeUTC !== null) ? latestDeparture.liveArrivalTimeUTC : latestDeparture.timetabledArrivalTimeUTC)}
            </Typography>

            <Typography variant="caption">
                {formatDate((latestDeparture.liveArrivalTimeUTC !== null) ? latestDeparture.liveArrivalTimeUTC : latestDeparture.timetabledArrivalTimeUTC)}
            </Typography>

            <Typography variant="subtitle1">
                Destination: {latestDepartureLine.name}
            </Typography>

            <Typography variant="h6" sx={{ marginBottom: '24px' }}>
                {timerCount}
            </Typography>

            <LinearProgress variant="determinate" value={20} />
        </Container>
    )
}

export default Overview;