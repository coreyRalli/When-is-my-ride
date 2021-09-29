import Typography from "@mui/material/Typography";
import { Link as RouterLink } from "react-router-dom";

import Link from '@mui/material/Link';

import { formatDate, formatTime } from '../../utils/consts';

const DepartureListItem = ({ departure, line, service, index, transportType, includeServiceName, includeStopName, includeDestinationName }) => {
    console.log(service);

    return (
        <li className={`search-result ${(index % 2 !== 0) ? 'alternate' : ''}`}>
            <Link component={RouterLink} 
                className="search-result-clickable" 
                to={(line) ? `/run/${departure.runRef}?transportType=${transportType}&lineId=${service.id}&directionId=${departure.directionId}&mapStartId=${departure.stopId}` : `/stop/${departure.stopId}?transportType=${departure.transportType}`}>
                <div className="search-result-info-container departure">
                    <div style={{ padding: 12, display: 'flex', alignContent: 'center', justifyContent: 'center' }}>
                        <Typography component="div" variant="h5">
                            {(departure.liveArrivalTimeUTC) ? formatTime(departure.liveArrivalTimeUTC) : formatTime(departure.timetabledArrivalTimeUTC)}
                        </Typography>
                    </div>

                    <div style={{ flex: 1, paddingLeft: '12px' }}>
                        {
                            (includeDestinationName) &&
                            <Typography component="div" variant="overline">
                                Destination: {line.name}
                            </Typography>
                        }

                        {
                            (includeServiceName) &&
                            <Typography>
                                <Typography component="div" variant="overline">
                                    Service: {service.name}
                                </Typography>
                            </Typography>
                        }

                        {
                            (includeStopName) &&
                            <Typography component="div" variant="overline">
                                {departure.name}
                            </Typography>
                        }

                        <Typography component="div" variant="caption">
                            {(departure.liveArrivalTimeUTC) ? formatDate(departure.timetabledArrivalTimeUTC) : formatDate(departure.liveArrivalTimeUTC)}
                        </Typography>
                    </div>
                </div>
            </Link>
        </li>
    )
}

export default DepartureListItem;