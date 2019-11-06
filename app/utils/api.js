var id = "YOUR_CLIENT_ID";
var sec = "YOUR_SECRET_ID";
var params = `?client_id=${id}&client_secret=${sec}`;

const getProfile = async (username) => {
  const response = await fetch(`https://api.github.com/users/${username}${params}`)
  return response.json()
}

const getRepos = async (username) => {
  const response = await fetch(`https://api.github.com/users/${username}/repos${params}&per_page=100`);
  return response.json();
}

const getStarCount = (repos) => {
  return repos.reduce((count, { stargazers_count }) => (count + stargazers_count), 0);
}

const calculateScore = ({ followers }, repos) => {
  let totalStars = getStarCount(repos);

  return (followers * 3) + totalStars;
}

const handleError = (error) => {
  console.warn(error);
  return null;
}

const getUserData = async (player) => {
  const [profile, repos] = await Promise.all([getProfile(player), getRepos(player)])
  return {
    profile: profile,
    score: calculateScore(profile, repos)
  }
}

const sortPlayers = (players) => players.sort((a,b) => (b.score - a.score));

export async function battle (players) {
    const playerResults = await Promise.all(players.map(getUserData))
    return sortPlayers(playerResults)
}

export async function fetchPopularRepos (language) {
    var encodedURI = window.encodeURI(`https://api.github.com/search/repositories?q=stars:>1+language:${language}&sort=stars&order=desc&type=Repositories`);
    const response = await fetch(encodedURI)
    const result = await response.json()
    return result.items
}