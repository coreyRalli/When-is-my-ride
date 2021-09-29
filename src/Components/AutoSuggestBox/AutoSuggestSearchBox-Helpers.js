export const generateFilterText = (filters) => {
    let filtersStr = Object.keys(filters).filter(f => (filters[f])).map(f => `${f}=true`).join('&');

    if (filtersStr.length > 0)
        filtersStr = `&${filtersStr}`;

    return filtersStr;
}

export const textValidation = (text, filters) => {
    let isValid = true;
    let helperText = "";

    if (Object.keys(filters).every(f => !filters[f])) {
        // Hide the suggestion box to show validation errors
       isValid = false;
       helperText = "At least one type of transport must be selected";
    }

    // Hidden power-use case: can enter id the user knows it (but hard to surface in UI without overloading information).
    if (text < 3 && isNaN(text)) {
        isValid = false;
        helperText = "Query must be more than 3 characters.";
    }

    return {
        isValid,
        helperText
    }
}