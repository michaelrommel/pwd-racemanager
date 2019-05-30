import axios from 'axios'

const getHighscore = async (urlprefix, user, raceId) => {
  console.log('highscoreFunctions::getHighscore: getting highscore for race: ', raceId)
  let config = {}
  if (user) {
    config = {
      headers: { 'Authorization': 'Bearer ' + user.token }
    }
  }
  try {
    let url = urlprefix + '/race/highscore/' + raceId
    let result = await axios.get(url, config)
    return result.data.splice(0, 15)
  } catch (err) {
    console.log('Error getting highscore: ', err)
  }
}

export { getHighscore }
