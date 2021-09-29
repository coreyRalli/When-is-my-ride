import Typography from "@mui/material/Typography";
import { Link as RouterLink } from "react-router-dom";

import Link from '@mui/material/Link';

import { formatDate, formatTime } from '../../utils/consts';

const DepartureListItem = ({ departure, line, index, transportType, includeStopName, includeDestinationName }) => {
    return (
        <li className={`search-result ${(index % 2 !== 0) ? 'alternate' : ''}`}>
            <Link component={RouterLink} className="search-result-clickable" to={(line) ? `/run/${departure.runRef}?transportType=${transportType}` : `/stop/${departure.stopId}?transportType=${departure.transportType}`}>
                <div className="search-result-info-container">
                    {
                        (includeDestinationName) &&
                        <Typography component="div" variant="overline">
                            Destination: {line.name}
                        </Typography>
                    }

                    {
                        (includeStopName) &&
                        <Typography component="div" variant="overline">
                            {departure.name}
                        </Typography>
                    }

                    <Typography component="div" variant="h5">
                        { (departure.liveArrivalTimeUTC) ? formatTime(departure.liveArrivalTimeUTC) : formatTime(departure.timetabledArrivalTimeUTC) }
                    </Typography>

                    <Typography component="div" variant="caption">
                        { (departure.liveArrivalTimeUTC) ? formatDate(departure.timetabledArrivalTimeUTC) : formatDate(departure.liveArrivalTimeUTC) }
                    </Typography>
                </div>
            </Link>
        </li>
    )
}

export default DepartureListItem;