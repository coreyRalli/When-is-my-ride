import React from 'react';

import Container from '@mui/material/Container';

import DepartureListItem from '../DepartureListItem/DepartureListItem';

const DeparturesList = ({ departures, lines, transportType, includeStopName = false, includeDestinationName = true }) => (
    <>
        <Container maxWidth="md" component={"ul"} className="search-results-list">
            {
                departures.map((departure, index) => <DepartureListItem includeDestinationName={includeDestinationName} includeStopName={includeStopName} line={lines.find(line => line.id === departure.directionId)} index={index} transportType={transportType} departure={departure} key={departure.id} />)
            }
        </Container>
    </>
);

export default DeparturesList;