const targets = [
  "m.youtube.com",
  "youtube.com",
  "img.youtube.com",
  "www.youtube.com",
  "youtube-nocookie.com",
  "www.youtube-nocookie.com",
  "youtu.be",
  "s.ytimg.com",
  "music.youtube.com",
];
/*
    Please remember to also update the manifest.json file
    (content_scripts > matches, 'persist-invidious-prefs.js')
    when updating this list:
  */
const redirects = [
  "https://yt.artemislena.eu",
  "https://invidious.slipfox.xyz",
  "https://invidious.privacydev.net",
  "https://iv.ggtyler.dev",
  "https://inv.zzls.xyz",
  "https://inv.tux.pizza",
  "https://inv.citw.lgbt",
  "https://invidious.io.lol",
  "https://yt.drgnz.club",
  "https://invidious.asir.dev",
  "https://anontube.lvkaszus.pl",
  "http://ng27owmagn5amdm7l5s3rsqxwscl5ynppnis5dqcasogkyxcfqn7psid.onion",
  "http://inv.zzlsghu6mvvwyy75mvga6gaf4znbp3erk5xwfzedb4gg6qqh2j6rlvid.onion",
];

export default {
  targets,
  redirects,
};
