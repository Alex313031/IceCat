
## IceCat-specific privacy settings

icecat-privacy-group-header = IceCat-specific privacy settings

disable-javascript-option =
    .label = Disable JavaScript
disable-javascript-description = Disabling Javascript greatly improves privacy, security and <a href=\"https://www.gnu.org/philosophy/javascript-trap.html\">freedom</a>, but it will break many sites.

disable-custom-fonts-option =
    .label = Do not load custom fonts
disable-custom-fonts-description = Custom fonts can be used for <a href=\"https://en.wikipedia.org/wiki/Device_fingerprint\">fingerprinting</a>. Disabling them improves privacy but may make some sites look wrong.

isolate-request-first-party-option =
    .label = Isolate requests to First Party domains
isolate-request-first-party-description = This <a href=\"https://www.torproject.org/projects/torbrowser/design/#identifier-linkability\">improves privacy</a>, but it may interfere with login into some sites.

auto-update-extensions-option =
    .label = Automatically update extensions
auto-update-extensions-description = Enabling automated updates is good for security, but would start Internet connections in the background.

spoof-referers-option =
    .label = Spoof Referers
spoof-referers-description = <a href=\"https://en.wikipedia.org/wiki/HTTP_referer\">Referers</a> tell sites what link brought you there. This feature greatly improves your privacy, but it may break functionality on some sites.

resist-fingerprinting-option =
    .label = Resist Fingerprinting
resist-fingerprinting-description = Enable several measures to prevent fingerprinting.

detect-captive-portal-option =
    .label = Detect captive portal
detect-captive-portal-description = <a href=\"https://en.wikipedia.org/wiki/Captive_portal\">Captive portals</a> are the sites that control access to public wireless networks in hotels, airports, cafes, etc. The detection service is useful if you connect to such netwoks, but it will start connections automatically.

detect-network-connectivity-option =
    .label = Detect network connectivity
detect-network-connectivity-description = The network connectivity service checks if IPv4/v6 DNS lookups work on the current network, whether connecting to IPv4/v6 addresses work on the current network, and whether a NAT64 gateway is detected on the network. These help the browser assess the network connectivity state, but will result in automatic DNS queries and HTTP connections being made for those checks.

geolocation-option =
    .label = Enable Geolocation
geolocation-description = This is commonly used for maps, weather sites, and some stores. It is better to keep it off unless you really need it.

webgl-option =
    .label = Enable WebGL
webgl-description = Needed to visualize 3D graphics, but it may expose you to security threats. Enable it only if you really use it.
