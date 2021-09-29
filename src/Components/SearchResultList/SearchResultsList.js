import React from 'react';

import './SearchResultsList.css';

import SearchResult from '../SearchResult/SearchResult';

import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

const SearchResultsList = ({ stops, showRemoveIcon = false, noResultsMessage = 'No results found', resultsCountText = null }) => (
    <>
        <Typography variant="subtitle1" sx={{ textAlign: 'center', marginTop: "24px", marginBottom: '12px' }}>
            {(resultsCountText) ? resultsCountText : `${stops.length} results`}
        </Typography>

        {
            (stops.length > 0) ?
            <Container maxWidth="md" component={"ul"} className="search-results-list">
                {stops.map((s, index) => <SearchResult showMinusFavInstead={showRemoveIcon} index={index} stop={s} key={s.id} />)}
            </Container> :

            <Container maxWidth="md" component={"ul"} className="search-results-list">
                <Typography variant="body2" sx={{ textAlign: 'center' }}>
                    {noResultsMessage}
                </Typography>
            </Container>
        }
    </>
);

export default SearchResultsList;