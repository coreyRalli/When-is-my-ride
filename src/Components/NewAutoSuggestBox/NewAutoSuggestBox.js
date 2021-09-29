import { Autocomplete, Container, useTheme, TextField, Checkbox, FormGroup, FormControlLabel, Typography, InputAdornment } from '@mui/material';
import { useState } from 'react';

import townsAndSuburbs from '../../assets/townsAndSuburbs.json';

const NewAutoSuggestBox = ({ onSearchSubmit, disabled = false }) => {
    const [inputText, setInputText] = useState('');

    const [filters, setFilters] = useState({
        train: true,
        tram: true,
        bus: true,
        vline: true
    })

    const [hasError, setHasError] = useState(false);
    const [errorText, setErrorText] = useState('');

    const onSubmit = (event) => {
        event.preventDefault();

        handleSubmit(inputText);
    }

    const onTextChange = (event) => {
        setHasError(false);
        setErrorText('');

        setInputText(event.target.value);
    }

    const onSuggestionSelected = (event, value) => {
        if (value === null)
            return;

        handleSubmit(value);
    }

    const handleSubmit = (value) => {
        const isValid = textValidation(value, filters);

        if (!isValid.isValid) {
            setHasError(true);
            setErrorText(isValid.helperText);
            return;
        }

        if (typeof onSearchSubmit === 'function') {
            const filterStr = generateFilterText(filters);
            onSearchSubmit({ suburb: value, filters: filterStr });
        }
    }

    const onCheckBoxChange = (event, checked) => {
        const newFilters = { ...filters };

        newFilters[event.target.name.replace('transport-type-', '')] = checked;

        setHasError(false);
        setErrorText('');

        setFilters(newFilters);
    }
    
    return (
        <form onSubmit={onSubmit}>
            <Container sx={{ marginTop: '20px' }}>
                <Autocomplete options={townsAndSuburbs}
                    freeSolo
                    disabled={disabled}
                    onChange={onSuggestionSelected}
                    onInputChange={onTextChange}
                    sx={{ marginBottom: '12px' }}
                    renderInput={(params) => <TextField
                                                error={hasError}
                                                disabled={disabled}
                                                helperText={errorText} 
                                                InputProps={{ 
                                                    ...params.InputProps, 
                                                    type: 'search'
                                                }} 
                                                label={"Search input"} 
                                                {...params} />} />

                <Typography variant="overline">
                    Filter Results
                </Typography>
                
                <FormGroup row>
                    <FormControlLabel control={<Checkbox checked={filters.train} name="transport-type-train" onChange={onCheckBoxChange}/>} label="Train"/>
                    <FormControlLabel control={<Checkbox checked={filters.bus} name="transport-type-bus" onChange={onCheckBoxChange}/>} label="Bus"/>
                    <FormControlLabel control={<Checkbox checked={filters.tram} name="transport-type-tram" onChange={onCheckBoxChange}/>} label="Tram" />
                    <FormControlLabel control={<Checkbox checked={filters.vline} name="transport-type-vline" onChange={onCheckBoxChange}/>} label="VLine" />
                </FormGroup>
            </Container>
        </form>
    )
}

const generateFilterText = (filters) => {
    let filtersStr = Object.keys(filters).filter(f => (filters[f])).map(f => `${f}=true`).join('&');

    if (filtersStr.length > 0)
        filtersStr = `&${filtersStr}`;

    return filtersStr;
}

const textValidation = (text, filters) => {
    let isValid = true;
    let helperText = "";

    if (Object.keys(filters).every(f => !filters[f])) {
        // Hide the suggestion box to show validation errors
       isValid = false;
       helperText = "At least one type of transport must be selected";
    }

    // Hidden power-use case: can enter id the user knows it (but hard to surface in UI without overloading information).
    if (text.length < 3 && isNaN(text)) {
        isValid = false;
        helperText = "Query must be more than 3 characters.";
    }

    return {
        isValid,
        helperText
    }
}

export default NewAutoSuggestBox;