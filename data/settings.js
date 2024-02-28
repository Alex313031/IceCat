// Default name strings
pref ("distribution.about", "GNU IceCat");
pref ("distribution.id", "gnu");
pref ("distribution.version", "1.0");

// Release notes and vendor URLs
pref("app.releaseNotesURL", "https://savannah.gnu.org/news/?group=gnuzilla");
pref("app.vendorURL", "https://www.gnu.org/software/gnuzilla/");
pref("app.privacyURL", "http://www.gnu.org/software/gnuzilla/");

// Disable plugin installer
pref("plugins.hide_infobar_for_missing_plugin", true);
pref("plugins.hide_infobar_for_outdated_plugin", true);
pref("plugins.notifyMissingFlash", false);

//https://developer.mozilla.org/en-US/docs/Web/API/MediaSource
//pref("media.mediasource.enabled",true);

//Speeding it up
pref("network.http.pipelining", true);
pref("network.http.proxy.pipelining", true);
pref("network.http.pipelining.maxrequests", 10);
pref("nglayout.initialpaint.delay", 0);

// Disable third party cookies
pref("network.cookie.cookieBehavior", 1);

//privacy.firstparty.isolate
pref("privacy.firstparty.isolate", true);

// Extensions cannot be updated without permission
pref("extensions.update.enabled", false);

// Set the default locale to that of the operating system.
pref("intl.locale.requested", "");

// Allow unsigned langpacks
pref("extensions.langpacks.signatures.required", false);
// Disable default browser checking.
pref("browser.shell.checkDefaultBrowser", false);
// Prevent EULA dialog to popup on first run
pref("browser.EULA.override", true);
// Don't disable extensions dropped in to a system
// location, or those owned by the application
pref("extensions.autoDisableScopes", 3);
//pref("extensions.enabledScopes", 15);
// Don't display the one-off addon selection dialog when
// upgrading from a version of Firefox older than 8.0
pref("extensions.shownSelectionUI", true);
// Don't call home for blacklisting
pref("extensions.blocklist.enabled", false);

// disable app updater url
pref("app.update.url", "http://127.0.0.1/");

//pref ("browser.startup.page" , 3);
//pref ("browser.startup.homepage" , "https://www.gnu.org/software/gnuzilla/");
//pref ("startup.homepage_welcome_url", "https://www.gnu.org/software/gnuzilla/");
pref("startup.homepage_welcome_url", "");
//pref ("startup.homepage_override_url" , "https://www.gnu.org/software/gnuzilla/");
pref("browser.startup.homepage_override.mstone", "ignore");

// Help URL
pref ("app.support.baseURL", "http://libreplanet.org/wiki/Group:IceCat/");
pref ("app.support.inputURL", "https://lists.gnu.org/mailman/listinfo/bug-gnuzilla");
pref ("app.feedback.baseURL", "https://lists.gnu.org/mailman/listinfo/bug-gnuzilla");
pref ("browser.uitour.url", "http://libreplanet.org/wiki/Group:IceCat/Tour");
// FIXME: Find a better URL for this:
pref ("browser.uitour.themeOrigin", "");
pref ("plugins.update.url", "https://www.gnu.org/software/gnuzilla/");
pref ("browser.customizemode.tip0.learnMoreUrl", "http://libreplanet.org/wiki/Group:IceCat/Tour");

// Dictionary download preference
pref("browser.dictionaries.download.url", "http://dictionaries.mozdev.org/");
pref("browser.search.searchEnginesURL", "https://mycroftproject.com/");
// Enable Spell Checking In All Text Fields
pref("layout.spellcheckDefault", 2);

// Apturl preferences
pref("network.protocol-handler.app.apt","/usr/bin/apturl");
pref("network.protocol-handler.warn-external.apt",false);
pref("network.protocol-handler.app.apt+http","/usr/bin/apturl");
pref("network.protocol-handler.warn-external.apt+http",false);
pref("network.protocol-handler.external.apt",true);
pref("network.protocol-handler.external.apt+http",true);

// Privacy & Freedom Issues
// https://webdevelopmentaid.wordpress.com/2013/10/21/customize-privacy-settings-in-mozilla-firefox-part-1-aboutconfig/
// https://panopticlick.eff.org
// http://ip-check.info
// http://browserspy.dk
// https://wiki.mozilla.org/Fingerprinting
// http://www.browserleaks.com
// http://fingerprint.pet-portal.eu
pref("privacy.donottrackheader.enabled", true);
pref("privacy.donottrackheader.value", 1);
pref("dom.ipc.plugins.flash.subprocess.crashreporter.enabled", false);
pref("browser.safebrowsing.enabled", false);
pref("browser.safebrowsing.downloads.remote.enabled", false);
pref("browser.safebrowsing.malware.enabled", false);
pref("browser.safebrowsing.provider.google.updateURL", "");
pref("browser.safebrowsing.provider.google.gethashURL", "");
pref("browser.safebrowsing.provider.google4.updateURL", "");
pref("browser.safebrowsing.provider.google4.gethashURL", "");
pref("browser.safebrowsing.provider.mozilla.gethashURL", "");
pref("browser.safebrowsing.provider.mozilla.updateURL", "");
pref("services.sync.privacyURL", "https://www.gnu.org/software/gnuzilla/");
pref("social.enabled", false);
pref("social.remote-install.enabled", false);
pref("datareporting.policy.dataSubmissionEnabled", false);
pref("datareporting.healthreport.uploadEnabled", false);
pref("datareporting.healthreport.about.reportUrl", "127.0.0.1");
pref("datareporting.healthreport.documentServerURI", "127.0.0.1");
pref("healthreport.uploadEnabled", false);
pref("social.toast-notifications.enabled", false);
pref("datareporting.policy.dataSubmissionEnabled", false);
pref("datareporting.healthreport.service.enabled", false);
pref("browser.slowStartup.notificationDisabled", true);
pref("network.http.sendRefererHeader", 2);
pref("network.http.referer.spoofSource", true);
// We don't want to send the Origin header
pref("network.http.originextension", false);
//http://grack.com/blog/2010/01/06/3rd-party-cookies-dom-storage-and-privacy/
//pref("dom.storage.enabled", false);
pref("dom.event.clipboardevents.enabled",false);
pref("network.prefetch-next", false);
pref("network.dns.disablePrefetch", true);
pref("network.http.sendSecureXSiteReferrer", false);
pref("toolkit.telemetry.enabled", false);
pref("toolkit.telemetry.server", "");
pref("experiments.manifest.uri", ""); 
pref("toolkit.telemetry.unified", false);
// Make sure updater telemetry is disabled; see <https://trac.torproject.org/25909>.
pref("toolkit.telemetry.updatePing.enabled", false);
// Do not tell what plugins do we have enabled: https://mail.mozilla.org/pipermail/firefox-dev/2013-November/001186.html
pref("plugins.enumerable_names", "");
pref("plugin.state.flash", 0);
// Do not autoupdate search engines
pref("browser.search.update", false);
// Warn when the page tries to redirect or refresh
//pref("accessibility.blockautorefresh", true);
pref("dom.battery.enabled", false);
pref("device.sensors.enabled", false);
pref("camera.control.face_detection.enabled", false);
pref("camera.control.autofocus_moving_callback.enabled", false);
pref("network.http.speculative-parallel-limit", 0);
// No search suggestions
pref("browser.urlbar.userMadeSearchSuggestionsChoice", true);
pref("browser.urlbar.groupLabels.enabled", false);
pref("browser.urlbar.merino.enabled", false);
pref("browser.search.suggest.enabled", false);
// Always ask before restoring the browsing session
pref("browser.sessionstore.max_resumed_crashes", 0);
// Don't ping Mozilla for MitM detection, see <https://bugs.torproject.org/32321>
pref("security.certerrors.mitm.priming.enabled", false);
pref("security.certerrors.recordEventTelemetry", false);
// Disable shield/heartbeat
pref("extensions.shield-recipe-client.enabled", false);
// Don't download ads for the newtab page
pref("browser.newtabpage.directory.source", "");
pref("browser.newtabpage.directory.ping", "");
pref("browser.newtabpage.introShown", true);
pref("browser.topsites.contile.enabled", false);
pref("browser.topsites.contile.endpoint", "");
pref("browser.topsites.contile.sov.enabled", false);
// Always ask before restoring the browsing session
pref("browser.sessionstore.max_resumed_crashes", 0);
// Disable tracking protection by default, as it makes automated connections to fetch lists (not doing this until the newtab privacy block is reimplemented)
//pref("browser.safebrowsing.provider.mozilla.updateURL", "");
pref("privacy.trackingprotection.enabled", true);
pref("privacy.trackingprotection.pbmode.enabled", true);
pref("urlclassifier.trackingTable", "test-track-simple,base-track-digest256,content-track-digest256");
pref("browser.privacy.trackingprotection.menu", "always");
pref("privacy.trackingprotection.introURL", "https://www.mozilla.org/%LOCALE%/firefox/%VERSION%/tracking-protection/start/");
// Disable geolocation
pref("geo.enabled", false);
pref("geo.wifi.uri", "");
pref("browser.search.geoip.url", "");
pref("browser.search.geoSpecificDefaults", false);
pref("browser.search.geoSpecificDefaults.url", "");
pref("browser.search.modernConfig", false);
// Disable captive portal detection
pref("captivedetect.canonicalURL", "");
pref("network.captive-portal-service.enabled", false);
// Disable shield/heartbeat
pref("extensions.shield-recipe-client.enabled", false);
// Canvas fingerprint protection
// This also enables useragent spoofing
pref("privacy.resistFingerprinting", true);
// Set useragent to Firefox compatible (not needed, the UA is already Firefox)
// pref("general.useragent.compatMode.icecat",true);
// Webgl can be used for fingerprinting
pref("webgl.disabled", true);
pref("privacy.trackingprotection.cryptomining.enabled", true);
pref("privacy.trackingprotection.fingerprinting.enabled", true);

// Services
pref("gecko.handlerService.schemes.mailto.0.name", "");
pref("gecko.handlerService.schemes.mailto.1.name", "");
pref("handlerService.schemes.mailto.1.uriTemplate", "");
pref("gecko.handlerService.schemes.mailto.0.uriTemplate", "");
pref("browser.contentHandlers.types.0.title", "");
pref("browser.contentHandlers.types.0.uri", "");
pref("browser.contentHandlers.types.1.title", "");
pref("browser.contentHandlers.types.1.uri", "");
pref("gecko.handlerService.schemes.webcal.0.name", "");
pref("gecko.handlerService.schemes.webcal.0.uriTemplate", "");
pref("gecko.handlerService.schemes.irc.0.name", "");
pref("gecko.handlerService.schemes.irc.0.uriTemplate", "");
pref("browser.partnerlink.attributionURL", "");

// Disable channel updates
pref("app.update.enabled", false);
pref("app.update.auto", false);

// EME
pref("media.eme.enabled", false);
pref("media.eme.apiVisible", false);

// Firefox Accounts
pref("identity.fxaccounts.enabled", false);

// WebRTC
pref("media.peerconnection.enabled", true);
// Don't reveal your internal IP when WebRTC is enabled
pref("media.peerconnection.ice.no_host", true);
pref("media.peerconnection.ice.default_address_only", true);

// Use the proxy server to do DNS lookups when using SOCKS
// <http://kb.mozillazine.org/Network.proxy.socks_remote_dns>
pref("network.proxy.socks_remote_dns", true);

// Services
pref("gecko.handlerService.schemes.mailto.0.name", "");
pref("gecko.handlerService.schemes.mailto.1.name", "");
pref("handlerService.schemes.mailto.1.uriTemplate", "");
pref("gecko.handlerService.schemes.mailto.0.uriTemplate", "");
pref("browser.contentHandlers.types.0.title", "");
pref("browser.contentHandlers.types.0.uri", "");
pref("browser.contentHandlers.types.1.title", "");
pref("browser.contentHandlers.types.1.uri", "");
pref("gecko.handlerService.schemes.webcal.0.name", "");
pref("gecko.handlerService.schemes.webcal.0.uriTemplate", "");
pref("gecko.handlerService.schemes.irc.0.name", "");
pref("gecko.handlerService.schemes.irc.0.uriTemplate", "");
// https://kiwiirc.com/client/irc.247cdn.net/?nick=Your%20Nickname#underwater-hockey
// Don't call home for blacklisting
pref("extensions.blocklist.enabled", false);
 


pref("font.default.x-western", "sans-serif");

// Preferences for the Get Add-ons panel
pref ("extensions.webservice.discoverURL", "https://gnuzilla.gnu.org/mozzarella");
pref ("extensions.getAddons.search.url", "https://gnuzilla.gnu.org/mozzarella");
pref ("extensions.getAddons.search.browseURL", "https://gnuzilla.gnu.org/mozzarella");
pref ("extensions.getAddons.get.url", "https://gnuzilla.gnu.org/mozzarella");
pref ("extensions.getAddons.link.url", "https://gnuzilla.gnu.org/mozzarella");
pref ("extensions.getAddons.discovery.api_url", "https://gnuzilla.gnu.org/mozzarella");

pref ("extensions.systemAddon.update.url", "");
pref ("extensions.systemAddon.update.enabled", false);

// FIXME: find better URLs for these:
pref ("extensions.getAddons.langpacks.url", "https://gnuzilla.gnu.org/mozzarella");
pref ("lightweightThemes.getMoreURL", "https://gnuzilla.gnu.org/mozzarella");
pref ("browser.geolocation.warning.infoURL", "");
pref ("browser.xr.warning.infoURL", "");
pref ("app.feedback.baseURL", "");

// Mobile
pref("privacy.announcements.enabled", false);
pref("browser.snippets.enabled", false);
pref("browser.snippets.syncPromo.enabled", false);
pref("identity.mobilepromo.android", "https://f-droid.org/repository/browse/?fdid=org.gnu.icecat&");
pref("browser.snippets.geoUrl", "http://127.0.0.1/");
pref("browser.snippets.updateUrl", "http://127.0.0.1/");
pref("browser.snippets.statsUrl", "http://127.0.0.1/");
pref("datareporting.policy.firstRunTime", 0);
pref("datareporting.policy.dataSubmissionPolicyVersion", 2);
pref("browser.webapps.checkForUpdates", 0);
pref("browser.webapps.updateCheckUrl", "http://127.0.0.1/");
pref("app.faqURL", "http://libreplanet.org/wiki/Group:IceCat/FAQ");

// PFS url
pref("pfs.datasource.url", "http://gnuzilla.gnu.org/plugins/PluginFinderService.php?mimetype=%PLUGIN_MIMETYPE%");
pref("pfs.filehint.url", "http://gnuzilla.gnu.org/plugins/PluginFinderService.php?mimetype=%PLUGIN_MIMETYPE%");

// Disable Gecko media plugins: https://wiki.mozilla.org/GeckoMediaPlugins
pref("media.gmp-manager.url.override", "data:text/plain,");
pref("media.gmp-manager.url", "");
pref("media.gmp-manager.updateEnabled", false);
pref("media.gmp-provider.enabled", false);
// Don't install openh264 codec
pref("media.gmp-gmpopenh264.enabled", false);
pref("media.gmp-eme-adobe.enabled", false);

//Disable middle click content load
//Avoid loading urls by mistake 
pref("middlemouse.contentLoadURL", false);

//Disable heartbeat
pref("browser.selfsupport.url", "");

//Disable Link to FireFox Marketplace, currently loaded with non-free "apps"
pref("browser.apps.URL", "");

//Disable Firefox Hello
pref("loop.enabled",false);

// Use old style preferences, that allow javascript to be disabled
pref("browser.preferences.inContent",false);

// Don't download ads for the newtab page
pref("browser.newtabpage.directory.source", "");
pref("browser.newtabpage.directory.ping", "");
pref("browser.newtabpage.introShown", true);
pref("browser.newtabpage.activity-stream.showSponsoredTopSites", false);

// Disable home snippets
pref("browser.aboutHomeSnippets.updateUrl", "data:text/html");

// In <about:preferences>, hide "More from Mozilla"
// (renamed to "More from GNU" by the global renaming)
pref("browser.preferences.moreFromMozilla", false);

// Disable hardware acceleration
//pref("layers.acceleration.disabled", false);
pref("gfx.direct2d.disabled", true);

// Disable SSDP
pref("browser.casting.enabled", false);

//Disable directory service
pref("social.directories", "");

// Don't report TLS errors to Mozilla
pref("security.ssl.errorReporting.enabled", false);

// Crypto hardening
// https://gist.github.com/haasn/69e19fc2fe0e25f3cff5
//General settings
pref("security.tls.unrestricted_rc4_fallback", false);
pref("security.tls.insecure_fallback_hosts.use_static_list", false);
pref("security.tls.version.min", 1);
pref("security.ssl.require_safe_negotiation", false);
pref("security.ssl.treat_unsafe_negotiation_as_broken", true);
pref("security.ssl3.rsa_seed_sha", true);
pref("security.OCSP.enabled", 1);
pref("security.OCSP.require", false); // set to false otherwise it breaks captive portal usage

// Avoid logjam attack
pref("security.ssl3.dhe_rsa_aes_128_sha", false);
pref("security.ssl3.dhe_rsa_aes_256_sha", false);
pref("security.ssl3.dhe_dss_aes_128_sha", false);
pref("security.ssl3.dhe_rsa_des_ede3_sha", false);
pref("security.ssl3.rsa_des_ede3_sha", false);

// Disable Pocket integration
pref("browser.pocket.enabled", false);
pref("extensions.pocket.enabled", false);

// enable extensions by default in private mode
pref("extensions.allowPrivateBrowsingByDefault", true);

// Do not show unicode urls https://www.xudongz.com/blog/2017/idn-phishing/
pref("network.IDN_show_punycode", true);

// disable screenshots extension
pref("extensions.screenshots.disabled", true);
// disable onboarding
pref("browser.onboarding.newtour", "performance,private,addons,customize,default");
pref("browser.onboarding.updatetour", "performance,library,singlesearch,customize");
pref("browser.onboarding.enabled", false);

// Disable firefox-view (renamed to icecat-view by the batch renaming)
pref("browser.tabs.icecat-view", false);

// New tab settings
pref("browser.newtabpage.activity-stream.default.sites", "https://www.gnu.org/,https://www.fsf.org/,https://directory.fsf.org/,https://libreplanet.org/,https://trisquel.info/,https://www.wikipedia.org/,https://www.wikinews.org/");
pref("browser.newtabpage.activity-stream.showTopSites",true);
pref("browser.newtabpage.activity-stream.feeds.section.topstories",false);
pref("browser.newtabpage.activity-stream.feeds.snippets",false);
pref("browser.newtabpage.activity-stream.disableSnippets", true);
user_pref("browser.newtabpage.activity-stream.tippyTop.service.endpoint", "");

// Enable xrender
pref("gfx.xrender.enabled",true);

// Disable push notifications 
pref("dom.webnotifications.enabled",false); 
pref("dom.webnotifications.serviceworker.enabled",false); 
pref("dom.push.enabled",false); 

// Disable recommended extensions
pref("browser.newtabpage.activity-stream.asrouter.userprefs.cfr.addons", false);
pref("browser.newtabpage.activity-stream.asrouter.userprefs.cfr.features", false);
pref("browser.newtabpage.activity-stream.asrouter.providers.snippets", "");
pref("extensions.htmlaboutaddons.discover.enabled", false);
pref("extensions.htmlaboutaddons.recommendations.enabled", false);

// Disable the settings server
pref("services.settings.server", "");

// Disable use of WiFi region/location information
pref("browser.region.network.scan", false);
pref("browser.region.network.url", "");

// Disable VPN/mobile promos
pref("browser.contentblocking.report.hide_vpn_banner", true);
pref("browser.contentblocking.report.mobile-ios.url", "");
pref("browser.contentblocking.report.mobile-android.url", "");
pref("browser.contentblocking.report.show_mobile_app", false);
pref("browser.contentblocking.report.vpn.enabled", false);
pref("browser.contentblocking.report.vpn.url", "");
pref("browser.contentblocking.report.vpn-promo.url", "");
pref("browser.contentblocking.report.vpn-android.url", "");
pref("browser.contentblocking.report.vpn-ios.url", "");
pref("browser.privatebrowsing.promoEnabled", false);
pref("browser.privatebrowsing.vpnpromourl", "");
pref("browser.vpn_promo.enabled", false);
pref("browser.promo.focus.enabled", false);
pref("browser.promo.pin.enabled", false);

// Enable HTTPS-Only Mode
pref("dom.security.https_only_mode", true);

// Make sure that the LibreJS, JShelter, Searxes' Third-party Request Blocker,
// and Privacy Redirect extensions are pinned to the toolbar for new profiles.
pref("browser.uiCustomization.state", "{\"placements\":{\"widget-overflow-fixed-list\":[],\"unified-extensions-area\":[\"gnuzilla-ext-workarounds_gnu_org-browser-action\"],\"nav-bar\":[\"back-button\",\"forward-button\",\"stop-reload-button\",\"customizableui-special-spring1\",\"urlbar-container\",\"customizableui-special-spring2\",\"save-to-pocket-button\",\"downloads-button\",\"fxa-toolbar-menu-button\",\"unified-extensions-button\",\"jid1-ktlzuoiikvffew_jetpack-browser-action\",\"jsr_javascriptrestrictor-browser-action\",\"tprb_addon_searxes_danwin1210_me-browser-action\",\"_b7f9d2cd-d772-4302-8c3f-eb941af36f76_-browser-action\"],\"toolbar-menubar\":[\"menubar-items\"],\"TabsToolbar\":[\"icecat-view-button\",\"tabbrowser-tabs\",\"new-tab-button\",\"alltabs-button\"],\"PersonalToolbar\":[\"import-button\",\"personal-bookmarks\"]},\"seen\":[\"gnuzilla-ext-workarounds_gnu_org-browser-action\",\"jid1-ktlzuoiikvffew_jetpack-browser-action\",\"tprb_addon_searxes_danwin1210_me-browser-action\",\"jsr_javascriptrestrictor-browser-action\",\"_b7f9d2cd-d772-4302-8c3f-eb941af36f76_-browser-action\",\"developer-button\"],\"dirtyAreaCache\":[\"unified-extensions-area\",\"nav-bar\",\"PersonalToolbar\"],\"currentVersion\":19,\"newElementCount\":2}");
