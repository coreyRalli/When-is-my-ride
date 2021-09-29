import axios from "axios"
import { API_BASE_URL, TRANSPORT_TYPE_IDS } from "../../utils/consts";

export const createDisplayLoadingAction = () => ({ type: 'display-loading', detail: {} });
export const createDisplayBeginAction = () => ({ type: 'display-begin', detail: {} });
export const createDisplayResultsAction = async (searchType, options) => {
    try {
        let query;

        if (searchType === 'suburb')
            query = createStopsBySuburbQuery(options.suburb, options.transportType);
        else if (searchType === 'location') {
            console.log("Transport type in location search: " + options.transportType);
            query = createGetStopsByLocationQuery(options.latitude, options.longitude, options.transportType);
        }
        else
            throw new Error('Incorrect searchType');

        const {
            data: {
                data: {
                    stops
                }
            }
        } = await axios.post(`${API_BASE_URL}graphql`, query);

        return { type: 'display-results', detail: { results: stops } }
    }
    catch (ex) {
        console.log(ex.response.data);
    }
}

export const createTransportTypeArray = (query) => {
    const transportArray = [];

    if (query.get("train"))
        transportArray.push(TRANSPORT_TYPE_IDS.train);
    if (query.get("bus"))
        transportArray.push(TRANSPORT_TYPE_IDS.bus);
    if (query.get("tram"))
        transportArray.push(TRANSPORT_TYPE_IDS.tram);
    if (query.get("vline"))
        transportArray.push(TRANSPORT_TYPE_IDS.vline);

    return transportArray;
}

const createStopsBySuburbQuery = (suburb, transportType) => ({
    query: `query ($suburb: String!, $transportType: [Int!]!) {
            stops: stopsBySuburb(suburb: $suburb, transportType: $transportType) {
                ...SearchResult
            }
        }
        ${resultsGraphQLFragment}`,
    variables: {
        suburb,
        transportType
    }
})

const createGetStopsByLocationQuery = (latitude, longitude, transportType) => {
    console.log(transportType);
    
    return {
        query: ` query($latitude: Float!, $longitude: Float!, $transportType: [Int!]!) {
        stops: stopsByLocation(long: $longitude, lat: $latitude, transportType: $transportType) {
            ...SearchResult
        }
    }
    ${resultsGraphQLFragment}`,
        variables: {
            latitude: +latitude,
            longitude: +longitude,
            transportType: transportType
        }
    }
}

// GraphQL Queries
const resultsGraphQLFragment = `fragment SearchResult on Stop {
    id,
    name,
    transportType,
    stopLat,
    stopLong
}`;