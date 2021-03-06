import axios from 'axios';

const getCurrentRace = async (urlprefix, user) => {
  console.log('raceFunctions::getCurrentRace: getting current race');
  let config = {};
  if (user) {
    config = {
      headers: { Authorization: 'Bearer ' + user.token }
    };
  }
  try {
    const url = urlprefix + '/race/current';
    const result = await axios.get(url, config);
    return result.data.raceId;
  } catch (err) {
    console.log('Error getting current race: ', err);
  }
};

export { getCurrentRace };
