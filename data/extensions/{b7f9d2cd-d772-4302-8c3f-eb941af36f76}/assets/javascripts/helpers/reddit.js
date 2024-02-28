const targets = [
  "www.reddit.com",
  "np.reddit.com",
  "new.reddit.com",
  "amp.reddit.com",
  "i.redd.it",
  "redd.it",
];
const redirects = [
  // libreddit: privacy w/ modern UI
  "https://libreddit.pussthecat.org",
  "https://libreddit.northboot.xyz",
  "https://r.walkx.fyi",
  "https://libreddit.kylrth.com",
  "https://libreddit.tiekoetter.com",
  "https://reddit.rtrace.io",
  "https://libreddit.privacydev.net",
  "https://l.opnxng.com",
  "https://lr.slipfox.xyz",
  "https://libreddit.oxymagnesium.com",
  "https://reddit.utsav2.dev",
  "https://libreddit.freedit.eu",
  "https://lr.artemislena.eu",
  "https://reddit.smnz.de",
  "https://libreddit.bus-hit.me",
  "https://snoo.habedieeh.re",
  // teddit: privacy w/ old UI
  "https://teddit.net",
  "https://teddit.zaggy.nl",
  "https://teddit.pussthecat.org",
  "https://teddit.bus-hit.me",
  "https://teddit.rawbit.ninja",
  "https://teddit.hostux.net",
  "https://teddit.no-logs.com",
  "https://teddit.projectsegfau.lt",
  "https://t.sneed.network",
  "https://old.reddit.com", // desktop
];
const bypassPaths = /\/(gallery\/poll\/rpan\/settings\/topics)/;

export default {
  targets,
  redirects,
  bypassPaths,
};
