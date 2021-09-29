import axios from "axios";
import { API_BASE_URL } from "../../utils/consts";

export const createFetchRunQueryAsync = async (stopId, transportType, directionId, lineId) => {
    const { data } = await axios.post(`${API_BASE_URL}graphql`, createGetRunQuery(stopId, transportType, lineId, directionId));

    const lineData = data.data.stopsOnLine.filter(stop => (data.data.run.find(run => run.stopId === stop.stop.id))).map(stop => stop.stop);

    data.data.run.forEach((run, index, array) => {
        const gps = data.data.stopsOnLine.find(gpsStop => gpsStop.stop.id === run.stopId);

        if (gps) {
            array[index].stopLat = gps.stop.stopLat;
            array[index].stopLong = gps.stop.stopLong;
        }
    })

    console.log(data.data.run);

    const gpsData = {}
    lineData.forEach(ld => gpsData[ld.id] = ld);

    return { type: 'fetch-results', detail: { stops: data.data.run } }
}

const createGetRunQuery = (runRef, transportType, lineId, directionId) => ({
    query: `query ($runRef: String!, $transportType: Int!, $lineId: Int!, $directionId: Int!) {
            run (runRef: $runRef, transportType: $transportType) {
                timetabledArrivalTimeUTC,
                liveArrivalTimeUTC,
                stopId,
                name,
                transportType
            }
            stopsOnLine(lineId: $lineId, transportType: $transportType, directionId: $directionId) {
                stop {
                    id,
                    stopLat,
                    stopLong
                }
            }
        }`,
    variables: {
        runRef,
        transportType,
        lineId,
        directionId
    }
});