/*
    Please remember to also update the src/manifest.json file 
    (content_scripts > matches, 'remove-twitter-sw.js') 
    when updating this list:
  */
const targets = [
  "twitter.com",
  "www.twitter.com",
  "mobile.twitter.com",
  "pbs.twimg.com",
  "video.twimg.com",
];
/*
    Please remember to also update the 
    src/assets/javascripts/remove-twitter-sw.js file 
    (const nitterInstances) when updating this list:
  */
const redirects = [
  "https://nitter.net",
  "https://nitter.unixfox.eu",
  "https://nitter.poast.org",
  "https://nitter.cz",
  "https://nitter.privacydev.net",
  "https://nitter.services.woodland.cafe",
  "https://nitter.salastil.com",
  "http://4g47cxugkohbweao2x66nnxxfoe3k7gdfzxej537nhdbwr522sbjxeqd.onion",
  "http://nitter.g4c3eya4clenolymqbpgwz3q3tawoxw56yhzk4vugqrl6dtu3ejvhjid.onion",
  "http://nitter.pjsfkvpxlinjamtawaksbnnaqs2fc2mtvmozrzckxh7f3kis6yea25ad.onion",
  "http://nitter.coffee2m3bjsrrqqycx6ghkxrnejl2q6nl7pjw2j4clchjj6uk5zozad.onion",
];

export default {
  targets,
  redirects,
};
