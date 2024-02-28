// Use LANG environment variable to choose locale
pref("intl.locale.matchOS", true);

// Disable default browser checking.
pref("browser.shell.checkDefaultBrowser", false);

// Don't disable our bundled extensions in the application directory
pref("extensions.autoDisableScopes", 11);
pref("extensions.shownSelectionUI", true);

// Disable "alt" as a shortcut key to open full menu bar. Conflicts with "alt" as a modifier
pref("ui.key.menuAccessKeyFocuses", false);

// Make sure that Firefox Social stuff are empty
pref("social.whitelist", "");
pref("social.directories", "");
pref("social.shareDirectory", "");

// Disable the GeoLocation API for content
pref("geo.enabled", false);

// Make sure that the request URL of the GeoLocation backend is empty
pref("geo.wifi.uri", "");

// Disable the least secure encryption protocols
pref("security.ssl3.ecdhe_ecdsa_rc4_128_sha", false);
pref("security.ssl3.ecdhe_rsa_rc4_128_sha", false);
pref("security.ssl3.rsa_rc4_128_md5", false);
pref("security.ssl3.rsa_rc4_128_sha", false);

// Disable Sponsored Tiles
pref("browser.newtabpage.directory.source", "data:application/json,{}");
pref("browser.newtabpage.directory.ping", "");

// Disable Firefox Hello and make sure that the request URLs of the Firefox Hello are empty
pref("loop.enabled", false);
pref("loop.feedback.baseUrl", "");
pref("loop.gettingStarted.url", "");
pref("loop.learnMoreUrl", "");
pref("loop.legal.ToS_url", "");
pref("loop.legal.privacy_url", "");
pref("loop.oauth.google.redirect_uri", "");
pref("loop.oauth.google.scope", "");
pref("loop.server", "");
pref("loop.soft_start_hostname", "");
pref("loop.support_url", "");
pref("loop.throttled2", false);

// Disable Pocket and make sure that the request URLs of the Pocket are empty
pref("browser.pocket.enabled", false);
pref("browser.pocket.api", "");
pref("browser.pocket.site", "");
pref("browser.pocket.oAuthConsumerKey", "");
pref("browser.pocket.useLocaleList", false);
pref("browser.pocket.enabledLocales", "");

// Make sure that the request URL of the Discover Apps is empty
pref("browser.apps.URL", "");

// Disable Freedom Violating DRM Feature
pref("browser.eme.ui.enabled", false);
pref("media.eme.enabled", false);
pref("media.eme.apiVisible", false);

// Avoid openh264 being downloaded.
pref("media.gmp-manager.url.override", "data:text/plain,");

// Disable openh264.
pref("media.gmp-provider.enabled", false);
pref("media.gmp-gmpopenh264.provider.enabled", false);

// Default to classic view for about:newtab
pref("browser.newtabpage.enhanced", false);

// Poodle attack
pref("security.tls.version.min", 1);

// Disable plugin installer
pref("plugins.hide_infobar_for_missing_plugin", true);
pref("plugins.hide_infobar_for_outdated_plugin", true);
pref("plugins.notifyMissingFlash", false);

// Speeding it up
pref("network.http.pipelining", true);
pref("network.http.proxy.pipelining", true);
pref("network.http.pipelining.maxrequests", 10);
pref("nglayout.initialpaint.delay", 0);

// Disable third party cookies
pref("network.cookie.cookieBehavior", 1);

// Disable app updater URL
pref("app.update.url", "http://127.0.0.1/");"

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
pref("browser.safebrowsing.malware.enabled", false);
//pref("services.sync.privacyURL", "https://www.gnu.org/software/gnuzilla/");
pref("social.enabled", false);
pref("social.remote-install.enabled", false);
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
//http://grack.com/blog/2010/01/06/3rd-party-cookies-dom-storage-and-privacy/
//pref("dom.storage.enabled", false);
pref("dom.event.clipboardevents.enabled",false);
pref("network.prefetch-next", false);
pref("network.dns.disablePrefetch", true);
pref("network.http.sendSecureXSiteReferrer", false);
pref("toolkit.telemetry.enabled", false);
// Do not tell what plugins do we have enabled: https://mail.mozilla.org/pipermail/firefox-dev/2013-November/001186.html
pref("plugins.enumerable_names", "");
pref("plugin.state.flash", 1);
// Do not autoupdate search engines
pref("browser.search.update", false);
// Warn when the page tries to redirect or refresh
//pref("accessibility.blockautorefresh", true);

// Disable channel updates
pref("app.update.enabled", false);
pref("app.update.auto", false);

// Mobile
pref("privacy.announcements.enabled", false);
pref("browser.snippets.enabled", false);
pref("browser.snippets.syncPromo.enabled", false);
pref("browser.snippets.geoUrl", "http://127.0.0.1/");
pref("browser.snippets.updateUrl", "http://127.0.0.1/");
pref("browser.snippets.statsUrl", "http://127.0.0.1/");
pref("datareporting.policy.firstRunTime", 0);
pref("datareporting.policy.dataSubmissionPolicyVersion", 2);
pref("browser.webapps.checkForUpdates", 0);
pref("browser.webapps.updateCheckUrl", "http://127.0.0.1/");
pref("app.faqURL", "http://libreplanet.org/wiki/Group:IceCat/FAQ");

// PFS URL
pref("pfs.datasource.url", "http://gnuzilla.gnu.org/plugins/PluginFinderService.php?mimetype=%PLUGIN_MIMETYPE%");
pref("pfs.filehint.url", "http://gnuzilla.gnu.org/plugins/PluginFinderService.php?mimetype=%PLUGIN_MIMETYPE%");

// https://directory.fsf.org/wiki/Disable_DHE
pref("security.ssl3.dhe_rsa_aes_128_sha", false);
pref("security.ssl3.dhe_rsa_aes_256_sha", false);
