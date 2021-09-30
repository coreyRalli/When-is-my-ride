import { Container, Typography, Link } from "@mui/material"

import { Link as RouterLink } from 'react-router-dom';

const NoRoute = () => {
    return(
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
            <Typography>
                Whoops! The page you're looking for has left the platform!
            </Typography>

            <Link to="/" component={RouterLink}>Take the train home</Link>
        </Container>
    )
}

export default NoRoute;