import axios from "axios";
import { API_BASE_URL } from "../../utils/consts";

export const createFetchRunQueryAsync = async (stopId, transportType) => {
    const { data } = await axios.post(`${API_BASE_URL}graphql`, createGetRunQuery(stopId, transportType));

    return { type: 'fetch-results', detail: { stops: data.data.run } }
}

const createGetRunQuery = (runRef, transportType) => ({
    query: `query ($runRef: String!, $transportType: Int!) {
            run (runRef: $runRef, transportType: $transportType) {
                timetabledArrivalTimeUTC,
                liveArrivalTimeUTC,
                stopId,
                name,
                transportType
            }
        }`,
    variables: {
        runRef,
        transportType
    }
});