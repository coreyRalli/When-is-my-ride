import { useContext } from 'react';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import AppContext from '../../AppContext';

import SearchResultsList from '../../Components/SearchResultList/SearchResultsList';

import HeroImage from '../../Components/HeroImage/HeroImage';

import Container from '@mui/material/Container';

const Home = () => {
    const context = useContext(AppContext);

    const getStops = () => {
        return context.appState.pinnedStops.map(stop => JSON.parse(localStorage.getItem(stop)));
    }

    return (
        <div className="view home">
            <AppBar position="sticky">
                <Toolbar>
                    <Typography component="div" variant="h6" sx={{ flexGrow: 1 }}>
                        Home
                    </Typography>
                </Toolbar>
                <HeroImage />
            </AppBar>

            <SearchResultsList resultsCountText={"Pinned stops"} noResultsMessage={"Pin your favorite stops for easy access!"} showRemoveIcon={true} stops={getStops()} />

            <Container sx={{ marginTop: '32px', textAlign: 'center' }} maxWidth="md">
                <Typography variant="caption">
                    PTV Timetable API Data Licensed from Public Transport Victoria under a Creative Commons Attribution 4.0 International Licence
                </Typography>
            </Container>
        </div>
    )
}

export default Home;