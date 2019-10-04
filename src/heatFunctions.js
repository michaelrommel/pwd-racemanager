import axios from 'axios';

const getLaneStatus = async (urlprefix, user, raceId) => {
  console.log('heatFunctions::getLaneStatus: data for:', raceId);
  let config = {};
  if (user) {
    config = {
      headers: { Authorization: 'Bearer ' + user.token }
    };
  }
  try {
    const url = urlprefix + '/race/lanes/' + raceId;
    const results = await axios.get(url, config);
    return results.data.lanes;
  } catch (err) {
    console.log('Error getting current heat: ', err);
  }
};

const getCurrentHeat = async (urlprefix, user, raceId) => {
  console.log('heatFunctions::getCurrentHeat: data for:', raceId);
  let config = {};
  if (user) {
    config = {
      headers: { Authorization: 'Bearer ' + user.token }
    };
  }
  try {
    const url = urlprefix + '/heat/current/' + raceId;
    const results = await axios.get(url, config);
    const lanes = results.data;
    if (lanes.results === undefined) return lanes;
    const laneStatus = await getLaneStatus(urlprefix, user, raceId);
    // now mix in the status information into to original heat info
    for (let i = 0; i < lanes.results.length; i++) {
      for (let j = 0; j < laneStatus.length; j++) {
        if (laneStatus[j].lane === i) {
          // this is the status for the i-th lane
          lanes.results[i].status = laneStatus[j].status;
        }
      }
    }
    return lanes;
  } catch (err) {
    console.log('Error getting current heat: ', err);
  }
};

const getNextHeat = async (urlprefix, user, raceId) => {
  console.log('heatFunctions::getnextHeat: getting data for:', raceId);
  let config = {};
  if (user) {
    config = {
      headers: { Authorization: 'Bearer ' + user.token }
    };
  }
  try {
    const url = urlprefix + '/heat/next/' + raceId;
    const result = await axios.get(url, config);
    return result.data;
  } catch (err) {
    console.log('Error getting next heat: ', err);
  }
};

export { getCurrentHeat, getNextHeat };

/* getLaneStatus
"lanes": [
    {
            "rf": "B7C33383DDE217",
            "lane": 0,
            "status": "unknown"
          },
    {
            "rf": "31F745FA3AB297",
            "lane": 1,
            "status": "unknown"
          },
    {
            "rf": "350254FD9B49A9",
            "lane": 2,
            "status": "unknown"
          },
    {
            "rf": "CD9E5837F88D3B",
            "lane": 3,
            "status": "unknown"
          }
  ] */
