import axios from 'axios';

const getHighscore = async (urlprefix, user, raceId) => {
  console.log('highscoreFunctions::getHighscore: getting highscore for race: ', raceId);
  let config = {};
  if (user) {
    config = {
      headers: { Authorization: 'Bearer ' + user.token }
    };
  }
  try {
    const url = urlprefix + '/race/highscore/' + raceId;
    const result = await axios.get(url, config);
    return result.data.splice(0, 20);
  } catch (err) {
    console.log('Error getting highscore: ', err);
  }
};

export { getHighscore };
