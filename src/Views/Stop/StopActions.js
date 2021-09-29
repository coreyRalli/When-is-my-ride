import axios from "axios";
import { API_BASE_URL } from "../../utils/consts";

export const createGetOverviewInfoActions = async (stopId, transportType) => {
  const { data } = await axios.post(`${API_BASE_URL}graphql`, createGetDeparturesQuery(stopId, transportType));

  const stop = data.data.stop;

  let directions = [];
  stop.routes.forEach(route => route.directions.forEach(dir => directions.push(dir)));

  const {
    departures,
    id,
    stopLong,
    stopLat,
    name
  } = stop;

  return { type: 'display-overview-data', detail: { departures, id, stopLong, stopLat, name, directions, transportType }}
}

export const createSetTabAction = (tabIndex) => {
  return {
    type: 'set-tab',
    detail: {
      index: tabIndex
    }
  }
}

export const createGetDeparturesQuery = (stopId, transportType) => ({
  query: `query StopSearchQuery($stopId: Int!, $transportType: Int!) {
        stop (stopId: $stopId, transportType: $transportType) {
          name,
          id,
          transportType,
          routes {
            directions {
              id,
              name
            }
          },
          stopLat,
          stopLong,
          departures {
            timetabledArrivalTimeUTC,
            liveArrivalTimeUTC
            directionId,
            runRef,
            transportType
          }
        }
      }`,
  variables: {
    stopId,
    transportType
  }
});