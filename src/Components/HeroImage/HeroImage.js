import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../utils/consts';

import './HeroImage.css';

import Typography from '@mui/material/Typography';

const HeroImage = ({ children }) => {
    const [uImg, setUImg] = useState(null)

    useEffect(() => {
        const fetchImage = async () => {
            const { data } = await axios.get(`${API_BASE_URL}randomImage`);

            setUImg(data);
        }

        fetchImage()
            .catch(ex => console.log(ex));
    }, [])

    return (
        <header className="header-image" style={{ backgroundImage: (uImg) ? `url(${uImg.imageUrl})` : '' }}>
            <div className="header-image-title-container">
                <Typography variant="h1">
                    When Is My Ride?
                </Typography>
            </div>

            {uImg &&
                (
                    <a className="img-profile-link" target="_blank" rel="noreferrer" href={`${uImg.userProfileLink}?utm_source=when_is_my_ride&utm_medium=referral`}>
                        {uImg.authorName} via Unsplash
                    </a>
                )
            }

            {children}
        </header>
    )
}

export default HeroImage;