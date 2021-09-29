import React from 'react';

import Container from '@mui/material/Container';

import DepartureListItem from '../DepartureListItem/DepartureListItem';

const DeparturesList = ({ departures, lines, services, transportType, includeStopName = false, includeDestinationName = true, includeServiceName = false }) => {

    const serviceList = services || [];

   return(<>
        <Container maxWidth="md" component={"ul"} className="search-results-list">
            {
                departures.map((departure, index) => 
                    <DepartureListItem service={serviceList.find(s => s.id === departure.lineId)} 
                    includeServiceName={includeServiceName} 
                    includeDestinationName={includeDestinationName} 
                    includeStopName={includeStopName} 
                    line={lines.find(line => line.id === departure.directionId)} 
                    index={index} transportType={transportType} 
                    departure={departure} key={departure.id} />)
            }
        </Container>
    </>)
};

export default DeparturesList;