import axios from 'axios';

const getLeaderboard = async (urlprefix, user, raceId) => {
  if (raceId === undefined) return [];
  console.log('LeaderBoard: getting leaderboard for race: ', raceId);
  let config = {};
  if (user) {
    config = {
      headers: { Authorization: 'Bearer ' + user.token }
    };
  }
  try {
    const url = urlprefix + '/race/leaderboard/' + raceId;
    const result = await axios.get(url, config);
    return result.data.splice(0, 20);
  } catch (err) {
    console.log('Error getting race list: ', err);
  }
};

export { getLeaderboard };
