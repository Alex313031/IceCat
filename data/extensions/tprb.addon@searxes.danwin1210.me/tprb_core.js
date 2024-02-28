var tprq_init = 0;
var tprq_mylang = {};
var tprq_whitelist = {};
var tprq_black_nrml = [];
var tprq_black_regx = [];
var tprq_whitetemp = {};
var tprq_tab_dst = {};
var tprq_amdroid = false;
var tprq_mustcleanup = false;
var tprq_cleanup_what = {};
var tprq_tabcls_cnt = 0;
var tprq_acln_x = 999;
var tprq_acln_y = 1440;
var tprq_acln_lastrun = 0;
var tprq_newtab_mute = false;
var tprq_allowcss = 0;
var tprq_separdark = 0;
var tprq_mixignore = 0;
var tprq_l2iignore = 0;
var tprq_tac_ignlst = [];
var tprq_allowsubdom = 0;
var tprq_allowwidedm = 0;
var tprq_allowcdnf = 0;
var tprq_allowcdnd = 0;
var tprq_alloweytb = 0;
var tprq_showtemp = 0;
var tprq_fmtdsturl = 0;
var tprq_fmtdstrxp = 0;
var tprq_smartref = 0;
var tprq_ignh_altsvc = 0;
var tprq_ignh_etag = 0;
var tprq_ignh_expct = 0;
var tprq_ignh_xdnspf = 0;
var tprq_showcntr = 0;
var tprq_kb_act = -1;
var tprq_jsfilter = 0;
var tprq_jsnoxss = 0;
var tprq_noworker = 0;
var tprq_jslineok = 0;
var tprq_jsak_wud = 0;
var tprq_jsak_cdnf = 0;
var tprq_jsak_cdnd = 0;
var tprq_jsakreqhs = 0;
var tprq_oklist_js = [];
var tprq_history_js = [];
var tprq_tmpok_js = [];
var tprq_showicon = 0;
var tprq_myuis = [];
var tprq_showdotf = 0;
var tprq_showxbtn = 0;
var tprq_pop_sort = 0;
var tprq_pop_bid = ['', '#fff'];
var tprq_popstyle = 0;
var tprq_poponoff = 0;
var tprq_poponoff_ison = true;
var tprq_pophtps_js = 0;
var tprq_popshowip = 0;
var tprq_popshowcc = 0;
var tprq_popshowsubs = 0;
var tprq_usednsapi = 0;
var tprq_dnsapi_url = '';
var tprq_dnspair = {};
var tprq_popnarld = 0;
var tprq_poprclk = 0;
var tprq_poplbla = 0;
var tprq_denypuny = 0;
var tprq_secureonly = 0;
var tprq_onlygp = 0;
var tprq_denysocks = 0;
var tprq_fwdom = 0;
var tprq_blockfnt = 0;
var tprq_blockmid = 0;
var tprq_blockimg = 0;
var tprq_blockobj = 0;
var tprq_mime_av = 0;
var tprq_mime_pdf = 0;
var tprq_mime_office = 0;
var tprq_cleanparam = 0;
var tprq_redir2htps = 0;
var tprq_scan_shortu = 0;
var tprq_aured_ignr = 0;
var tprq_aured_confirm = false;
var tprq_usedntme = 0;
var tprq_unsocial = 0;
var tprq_scan_mitm = 0;
var tprq_mitmoklist = [];
var tprq_nomitm_s403 = 0;
var tprq_nomitm_inc = 0;
var tprq_nomitm_ggl = 0;
var tprq_nomitm_scu = 0;
var tprq_bkt_mitms = [];
var tprq_flags = ['icons/icon-32.png', 'icons/i_ylw.png', 'icons/i_red.png'];
var tprq_bl_img = 'R0lGODlhAQABAIAAAP///wAAACH/C05FVFNDQVBFMi4wAwEAAAAh+QQBCgAAACwAAAAAAQABAAACAkQBADs=';
var tprq_dblack_fqdn = [];
var tprq_dblack_dom = [];
var tprq_dsocial_fqdn = [];
var tprq_dsocial_dom = [];
var tprq_db_xss1 = [];
var tprq_db_xss2 = [];
var tprq_db_xss3 = [];
var tprq_geo4_loaded = false;
var tprq_db_geo4 = {};
//===
function onError(e) {
	console.log(`TPRB: Error:${e}`);
}

function text2array(w) {
	var wr = {};
	var wx = w.split("\n");
	var wxy, wxy_a, wxy_b;
	for (var y = 0; y < wx.length; y++) {
		wxy = wx[y].split(' ');
		if (wxy.length == 2) {
			wxy_a = wxy[0];
			wxy_b = wxy[1];
			if (wr[wxy_a] == undefined) {
				wr[wxy_a] = [];
			};
			if (!wr[wxy_a].includes(wxy_b)) {
				wr[wxy_a].push(wxy_b);
			}
		}
	};
	return wr;
}

function array2text(w) {
	var _wr = '';
	var wk, lk;
	for (var k in w) {
		if (k.length >= 1) {
			wk = w[k];
			for (var l in wk) {
				lk = wk[l];
				if (lk.length >= 1) {
					_wr += k + " " + lk + "\n";
				}
			}
		}
	};
	return _wr;
}

function text2array2(w) {
	var wr = {};
	var wx = w.split("\n");
	var wxy, wxy_a, wxy_b;
	for (var y = 0; y < wx.length; y++) {
		wxy = wx[y].split(' ');
		if (wxy.length == 2) {
			wxy_a = wxy[0];
			wxy_b = wxy[1];
			if (wr[wxy_a] == undefined) {
				wr[wxy_a] = wxy_b;
			}
		}
	};
	return wr;
}

function rqbl_loadcfg() {
	browser.storage.local.get().then(function (w) {
		tprq_whitelist = (w.myset_rqblwhitelist) ? text2array(w.myset_rqblwhitelist) : {};
		var _tmpbl = (w.myset_rqblblacklist) ? w.myset_rqblblacklist.split("\n").filter(v => v != '') : [];
		if (_tmpbl.length < 1) {
			tprq_fwdom = 0;
		} else {
			if (w.myset_rqbl_bldstrxp == 'y') {
				tprq_fwdom = 2;
			} else {
				tprq_fwdom = 1;
			}
		}
		tprq_black_nrml = [];
		tprq_black_regx = [];
		if (tprq_fwdom >= 1) {
			for (var i = 0; i < _tmpbl.length; i++) {
				if (_tmpbl[i].startsWith('/')) {
					tprq_black_regx.push(_tmpbl[i]);
				} else {
					tprq_black_nrml.push(_tmpbl[i]);
				}
			}
		}
		tprq_allowcss = (w.myset_rqblcsslover != 'n') ? 1 : 0;
		tprq_allowsubdom = (w.myset_rqblsubdomok != 'n') ? 1 : 0;
		tprq_allowwidedm = (w.myset_rqblallok_wuz == 'y') ? 1 : 0;
		tprq_allowcdnf = (w.myset_rqblaok_cdnf != 'n') ? 1 : 0;
		tprq_allowcdnd = (w.myset_rqblaok_cdnd != 'n') ? 1 : 0;
		tprq_alloweytb = (w.myset_rqblaok_ytb != 'n') ? 1 : 0;
		tprq_separdark = (w.myset_rqblcleardark == 'y') ? 1 : 0;
		tprq_mixignore = (w.myset_rqblmixokay == 'y') ? 1 : 0;
		tprq_l2iignore = (w.myset_rqbll2iokay == 'y') ? 1 : 0;
		tprq_tac_ignlst = (w.myset_rqblcftrwhite) ? w.myset_rqblcftrwhite.split("\n").filter(v => v != '') : [];
		tprq_showtemp = (w.myset_rqblsettemp == 'y') ? 1 : 0;
		tprq_fmtdsturl = (w.myset_rqblfmtdsturl == 'y') ? 1 : 0;
		tprq_fmtdstrxp = (w.myset_rqblfmtdstrxp == 'y') ? 1 : 0;
		tprq_smartref = (w.myset_rqblsmartref == 'y') ? 1 : 0;
		tprq_nodlact = w.myset_rqblnodlact || 0;
		tprq_ignh_altsvc = (w.myset_rqbl_ignh_altsvc == 'y') ? 1 : 0;
		tprq_ignh_etag = (w.myset_rqbl_ignh_etag == 'y') ? 1 : 0;
		tprq_ignh_expct = (w.myset_rqbl_ignh_expct == 'y') ? 1 : 0;
		tprq_ignh_xdnspf = (w.myset_rqbl_ignh_xdnspf == 'y') ? 1 : 0;
		tprq_cleanparam = (w.myset_rqblrdr_clnsrch == 'y') ? 1 : 0;
		tprq_redir2htps = (w.myset_rqblrdr_justhtps == 'y') ? 1 : 0;
		tprq_bl_img = 'R0lGODlhAQABAIAAAP///wAAACH/C05FVFNDQVBFMi4wAwEAAAAh+QQBCgAAACwAAAAAAQABAAACAkQBADs=';
		tprq_scan_shortu = w.myset_rqblaured || 0;
		tprq_aured_ignr = w.myset_rqblrdrign || 0;
		if (tprq_aured_ignr == 1 || tprq_aured_ignr == 2) {
			tprq_aured_ignr = 0;
		}
		tprq_aured_confirm = (w.myset_rqblardr_usealrt == 'y') ? true : false;
		tprq_scan_mitm = w.myset_rqblrdr_mitm || 0;
		if (tprq_scan_mitm != 0) {
			tprq_mitmoklist = (w.myset_rqblmitmoklist) ? w.myset_rqblmitmoklist.split("\n").filter(v => v != '') : [];
		} else {
			tprq_mitmoklist = [];
		}
		tprq_nomitm_s403 = (w.myset_rqblrdr_mitm_t2oi == 'y') ? 1 : 0;
		tprq_nomitm_inc = (w.myset_rqblrdr_mitm_inc == 'y') ? 1 : 0;
		tprq_nomitm_ggl = (w.myset_rqblrdr_mitm_ggl == 'y') ? 1 : 0;
		tprq_nomitm_scu = (w.myset_rqblrdr_mitm_scu == 'y') ? 1 : 0;
		tprq_showcntr = 1;
		if (w.myset_rqblnoscript == 'y') {
			tprq_oklist_js = (w.myset_rqbljsoklist) ? w.myset_rqbljsoklist.split("\n").filter(v => v != '') : [];
			tprq_jsfilter = 1;
		} else {
			tprq_jsfilter = 0;
			tprq_oklist_js = [];
			tprq_history_js = [];
		}
		tprq_jsnoxss = (w.myset_rqblxssblock == 'y') ? 1 : 0;
		tprq_db_xss1 = (w.myset_rqblxssblock == 'y') ? ['%3cscript+', '%3cscript%20', '%3c%2fscript', '%3c/script', 'javascript%3a', 'livescript%3a', 'javascript:', 'livescript:', '<script ', '</script'] : [];
		tprq_db_xss2 = (w.myset_rqblxssblock == 'y') ? ['eval', 'settimeout', 'setinterval', 'function', 'jquery', 'document.', 'innerhtml', 'location.', 'window.', 'worker(', 'alert(', 'atob(', 'worker%28', 'alert%28', 'atob%28'] : [];
		tprq_db_xss3 = (w.myset_rqblxssblock == 'y') ? ["'", '"', ';', '()', '+', '%27', '%22', '%3b', '%28%29', '%2b'] : [];
		tprq_noworker = (w.myset_rqblnoworker == 'y') ? 1 : 0;
		tprq_jslineok = (w.myset_rqblluvinline == 'y') ? 1 : 0;
		tprq_jsak_wud = (w.myset_rqbljsak_wuz == 'y') ? 1 : 0;
		tprq_jsak_cdnf = (w.myset_rqbljsak_cdnf == 'y') ? 1 : 0;
		tprq_jsak_cdnd = (w.myset_rqbljsak_cdnd == 'y') ? 1 : 0;
		tprq_jsakreqhs = (w.myset_rqbljsakreqhs == 'y') ? 1 : 0;
		if (w.myset_rqblproicon == 'y') {
			tprq_showicon = 1;
			tprq_myuis = [];
			var _wmrc = w.myset_rqbluis_curl || '';
			if (w.myset_rqbluis_0 == 'y' && _wmrc.startsWith('http')) {
				tprq_myuis.push(['0', _wmrc.replace('%F%', '%%TPRB_HOST%%').replace('%E%', '%%TPRB_ERL%%').replace('%U%', '%%TPRB_URL%%')]);
			}
			if (w.myset_rqbluis_1 == 'y') {
				tprq_myuis.push(['1', 'https://www.robtex.com/dns-lookup/%%TPRB_HOST%%']);
			}
			if (w.myset_rqbluis_2 == 'y') {
				tprq_myuis.push(['2', 'https://www.ssllabs.com/ssltest/analyze.html?d=%%TPRB_HOST%%']);
			}
			if (w.myset_rqbluis_3 == 'y') {
				tprq_myuis.push(['3', 'https://twitter.com/intent/tweet?url=%%TPRB_ERL%%']);
			}
			if (w.myset_rqbluis_4 == 'y') {
				tprq_myuis.push(['4', 'https://translate.google.com/translate?sl=auto&tl=ru&u=%%TPRB_ERL%%']);
			}
			if (w.myset_rqbluis_5 == 'y') {
				tprq_myuis.push(['5', 'https://reddit.com/submit?url=%%TPRB_ERL%%']);
			}
			if (w.myset_rqbluis_6 == 'y') {
				tprq_myuis.push(['6', 'https://via.hypothes.is/%%TPRB_URL%%']);
			}
			if (w.myset_rqbluis_7 == 'y') {
				tprq_myuis.push(['7', 'https://web.archive.org/cache/%%TPRB_URL%%']);
			}
			if (tprq_myuis.length == 0 || tprq_myuis.length > 3) {
				tprq_showicon = 0;
				tprq_myuis = [];
			}
		} else {
			tprq_showicon = 0;
			tprq_myuis = [];
		}
		if (w.myset_rqblpmoffon == 'y') {
			tprq_poponoff = 1;
		} else {
			tprq_poponoff = 0;
			tprq_poponoff_ison = true;
		}
		tprq_showdotf = (w.myset_rqblpmdotf == 'y') ? 1 : 0;
		tprq_showxbtn = 1;
		tprq_popstyle = w.myset_rqblppsty || 0;
		tprq_pophtps_js = (w.myset_rqblpmjshps == 'y') ? 1 : 0;
		tprq_popshowip = (w.myset_rqblpmshowip == 'y') ? 1 : 0;
		tprq_popshowcc = (w.myset_rqblpmshowcc == 'y') ? 1 : 0;
		tprq_popshowsubs = (w.myset_rqblpmshowsubs == 'y') ? 1 : 0;
		tprq_usednsapi = w.myset_rqblpxydns || 0;
		if (tprq_usednsapi == 1) {
			tprq_dnsapi_url = w.myset_rqbluis_curl3 || '';
		}
		tprq_popnarld = (w.myset_rqblpopnarld == 'y') ? 1 : 0;
		tprq_poprclk = w.myset_rqblpoprck || 0;
		tprq_poplbla = w.myset_rqblpoplbl || 0;
		if (tprq_poplbla == 2) {
			tprq_poplbla = w.myset_rqbluis_curl2 || 0;
		}
		tprq_denypuny = (w.myset_rqblnopuny == 'y') ? 1 : 0;
		tprq_secureonly = (w.myset_rqblyestls == 'y') ? 1 : 0;
		tprq_onlygp = (w.myset_rqbljustgp == 'y') ? 1 : 0;
		tprq_denysocks = (w.myset_rqblbyesok == 'y') ? 1 : 0;
		tprq_blockfnt = (w.myset_rqblblockfnt == 'y') ? 1 : 0;
		tprq_blockmid = (w.myset_rqblblockmid == 'y') ? 1 : 0;
		tprq_blockimg = (w.myset_rqblblockimg == 'y') ? 1 : 0;
		tprq_blockobj = (w.myset_rqblblockobj == 'y') ? 1 : 0;
		tprq_mime_av = (w.myset_rqblmimeav == 'y') ? 1 : 0;
		tprq_mime_pdf = (w.myset_rqblmimepdf == 'y') ? 1 : 0;
		tprq_mime_office = (w.myset_rqblmimexls == 'y') ? 1 : 0;
		tprq_newtab_mute = (w.myset_rqbl_ntb_mute == 'y') ? true : false;
		tprq_usedntme = (w.myset_rqblusemybl == 'y') ? 1 : 0;
		tprq_dblack_fqdn = (w.myset_rqblusemybl == 'y') ? ['a.postrelease.com', 'a.teads.tv', 'adserver.xpanama.net', 'ae.pubmatic.com', 'ak.sail-horizon.com', 'api.inwemo.com', 'api.unthem.com', 'api.viglink.com', 'assets.adobedtm.com', 'autolinkmaker.itunes.apple.com', 'awaps.yandex.ru', 'b.scorecardresearch.com', 'bam.nr-data.net', 'bat.bing.com', 'btrace.qq.com', 'c.go-mpulse.net', 'cdm.cursecdn.com', 'cdn.adless.io', 'cdn.adsafeprotected.com', 'cdn.carbonads.com', 'cdn.cloudcoins.co', 'cdn.heapanalytics.com', 'cdn.krxd.net', 'cdn.livefyre.com', 'cdn.mxpnl.com', 'cdn.nablabee.com', 'cdn.segment.com', 'cdnssl.clicktale.net', 'cfcd.duckdns.org', 'cfceu.duckdns.org', 'cfcs1.duckdns.org', 'cl.webterren.com', 'consent.cookiebot.com', 'counter.yadro.ru', 'cryptown.netlify.com', 'd.line-cdn.net', 'd.line-scdn.net', 'd10lpsik1i8c69.cloudfront.net', 'd1z2jf7jlzjs58.cloudfront.net', 'd3iz6lralvg77g.cloudfront.net', 'dc.ads.linkedin.com', 'dev.visualwebsiteoptimizer.com', 'fonts.gstatic.com', 'fresh-js.bitbucket.io', 'g2.gumgum.com', 'go.megabanners.cf', 'greenindex.dynamic-dns.net', 'gustaver.ddns.net', 'harvest.surge.sh', 'imasdk.googleapis.com', 'js-agent.newrelic.com', 'js-sec.indexww.com', 'lb.statsevent.com', 'load.jsecoin.com', 'may-js.github.io', 'mc.yandex.ru', 'miner.nablabee.com', 'nexus.ensighten.com', 'nunu-001.now.sh', 'o.aolcdn.com', 'pingjs.qq.com', 'pixel.wp.com', 'platform.linkedin.com', 'platform.stumbleupon.com', 'qos.report.qq.com', 'rcm-jp.amazon.co.jp', 'refresh-js.bitbucket.io', 'route.carambo.la', 's.go-mpulse.net', 's.skimresources.com', 'sb.scorecardresearch.com', 'script.crazyegg.com', 'secure-us.imrworldwide.com', 'smartplugin.youbora.com', 'static.addtoany.com', 'static.adziff.com', 'static.hotjar.com', 'static.parsely.com', 'stats.wp.com', 'tags.bluekai.com', 'traffic.adxprtz.com', 'webwidgetz.duckdns.org', 'whos.amung.us', 'worker.salon.com', 'ws.amazon.co.jp', 'wsp.marketgid.com', 'www.adumen.com', 'www.assoc-amazon.jp', 'www.blogsmithmedia.com', 'www.dianomi.com', 'www.googletagmanager.com', 'www.googletagservices.com', 'www.summerhamster.com', 'www.tns-counter.ru', 'yads.c.yimg.jp', 'z.moatads.com', 'b92.yahoo.co.jp', 'cd-ladsp-com.s3.amazonaws.com', 'static.supuv2.com', 'cse.google.com', 'config.seedtag.com', 'cdn.cookielaw.org', 'seal.verisign.com', 'ff.kis.v2.scr.kaspersky-labs.com', 'cdn.translationexchange.com', 'sdk.privacy-center.org', 'api.rollbar.com', 'js.rtoaster.jp', 'cdn.elasticad.net', 'cdn.ravenjs.com', 'cdn.branch.io', 'www.tamgrt.com', 'www.dwin1.com', 'd7d3cf2e81d293050033-3dfc0615b0fd7b49143049256703bfce.ssl.cf1.rackcdn.com'] : [];
		tprq_dblack_dom = (w.myset_rqblusemybl == 'y') ? ['0x1f4b0.com', '101com.com', '123found.com', '123freeavatars.com', '180hits.de', '1q2w3.website', '207.net', '24log.com', '24log.de', '2mdn.net', '2o7.net', '360yield.com', '3lift.com', '4d5.net', '50websads.com', '518ad.com', '51yes.com', '600z.com', '777partner.com', '7bpeople.com', '7search.com', '99count.com', 'a2gw.com', 'a8.net', 'aaddzz.com', 'aalbbh84.info', 'abacho.net', 'abandonedclover.com', 'abruptroad.com', 'absoluteclickscom.com', 'abz.com', 'accesstrade.net', 'actionsplash.com', 'actualdeals.com', 'actuallysheep.com', 'acuityads.com', 'acuty1adsrv.com', 'ad2flash.com', 'ad4game.com', 'adaction.de', 'adadvisor.net', 'adap.tv', 'adapt.tv', 'adbard.net', 'adblade.com', 'adbrite.com', 'adbrn.com', 'adbroker.de', 'adcash.com', 'adcell.de', 'adcentriconline.com', 'adcept.net', 'adcomplete.com', 'adconion.com', 'adcycle.com', 'addme.com', 'adecn.com', 'ademails.com', 'adengage.com', 'adflight.com', 'adforce.com', 'adformdsp.net', 'adgardener.com', 'adgoto.com', 'adgridwork.com', 'adhese.be', 'adhese.com', 'adimpact.com', 'adincube.com', 'adingo.jp', 'adinjector.net', 'adinterax.com', 'adisfy.com', 'adition.com', 'adition.de', 'adition.net', 'adizio.com', 'adjix.com', 'adjug.com', 'adjuggler.com', 'adjustnetwork.com', 'adk2.com', 'adland.ru', 'adlantic.nl', 'adledge.com', 'adlegend.com', 'adless.io', 'adloox.com', 'adlure.net', 'admagnet.net', 'admailtiser.com', 'admanagement.ch', 'admantx.com', 'admarketplace.net', 'admarvel.com', 'adminder.com', 'adminshop.com', 'admized.com', 'admob.com', 'admonitor.com', 'adnotch.com', 'adnxs.com', 'adocean.pl', 'adonspot.com', 'adoperator.com', 'adorigin.com', 'adotmob.com', 'adpenguin.biz', 'adpepper.dk', 'adpepper.nl', 'adperium.com', 'adpia.vn', 'adplus.co.id', 'adplxmd.com', 'adprofile.net', 'adprojekt.pl', 'adrazzi.com', 'adrenali.gq', 'adriver.ru', 'adrolays.de', 'adroll.com', 'adrotate.de', 'adrotator.se', 'adrta.com', 'adsafeprotected.com', 'adscale.de', 'adscholar.com', 'adscience.nl', 'adscpm.com', 'adsdaq.com', 'adsdk.com', 'adsend.de', 'adsensecustomsearchads.com', 'adside.com', 'adsk2.co', 'adskape.ru', 'adskeeper.co.uk', 'adsklick.de', 'adsnative.com', 'adsrevenue.net', 'adsrvr.org', 'adsstat.com', 'adstage.io', 'adsupply.com', 'adswizz.com', 'adsymptotic.com', 'adsynergy.com', 'adtdp.com', 'adtech.de', 'adtechjp.com', 'adtechus.com', 'adtegrity.net', 'adthis.com', 'adtiger.de', 'adtoll.com', 'adtology.com', 'adtoma.com', 'adtrace.org', 'adtrade.net', 'adtrading.de', 'adtrak.net', 'adtriplex.com', 'advariant.com', 'adventory.com', 'advertiserurl.com', 'advertising.com', 'advfromnwl.com', 'advg.jp', 'advnt.com', 'adwareremovergold.com', 'adwhirl.com', 'adwitserver.com', 'adworldnetwork.com', 'adyea.com', 'adz2you.com', 'adzbazar.com', 'adzerk.net', 'adzones.com', 'af-ad.co.uk', 'affbuzzads.com', 'affiliate-b.com', 'agkn.com', 'agreemand.com', 'ahalogy.com', 'aim4media.com', 'aistat.net', 'ajcryptominer.com', 'ajplugins.com', 'alenty.com', 'alipromo.com', 'all4spy.com', 'alladvantage.com', 'allosponsor.com', 'alphonso.tv', 'altavista.ovh', 'amaprop.net', 'amazingcounters.com', 'amazon-adsystem.com', 'ambitiousagreement.com', 'americash.com', 'amoad.com', 'amung.us', 'anahtars.com', 'analytics.blue', 'andlache.com', 'anxiousapples.com', 'apester.com', 'appelamule.com', 'appsflyer.com', 'apture.com', 'apusx.com', 'atdmt.com', 'atom-data.io', 'atwola.com', 'auctionads.com', 'auctionads.net', 'audience2media.com', 'audienceinsights.com', 'augur.io', 'authedmine.com', 'autohits.dk', 'avenuea.com', 'averoconnector.com', 'avocet.io', 'avres.net', 'avsads.com', 'avzadsrv.com', 'awempire.com', 'awin1.com', 'b0b1o.bid', 'bablace.com', 'backbeatmedia.com', 'baskettexture.com', 'bawdybeast.com', 'baypops.com', 'bbelements.com', 'beamincrease.com', 'beamkite.com', 'beemray.com', 'begun.ru', 'behavioralengine.com', 'belstat.com', 'belstat.nl', 'berateveng.ru', 'berp.com', 'bestsearch.net', 'bewaslac.com', 'bhzejltg.info', 'biberukalap.com', 'bidclix.com', 'bidclix.net', 'bidr.io', 'bidswitch.net', 'bidtrk.com', 'bidvertiser.com', 'bigbangmedia.com', 'billboard.cz', 'bitads.net', 'bitmedianetwork.com', 'bizographics.com', 'bizrate.com', 'blingbucks.com', 'blogads.com', 'blogherads.com', 'blogrush.com', 'blogtoplist.se', 'blogtopsites.com', 'blozoo.info', 'blueconic.net', 'bluekai.com', 'bluelithium.com', 'bluewhaleweb.com', 'bmnr.pw', 'bmst.pw', 'boilingbeetle.com', 'boldchat.com', 'boom.ro', 'boomads.com', 'boomtrain.com', 'boudja.com', 'bounceexchange.com', 'bowithow.com', 'bpath.com', 'braincash.com', 'brandreachsys.com', 'brassrule.com', 'bridgetrack.com', 'brightinfo.com', 'broadboundary.com', 'browsermine.com', 'bttrack.com', 'budsinc.com', 'butcalve.com', 'buyhitscheap.com', 'buysellads.com', 'c1exchange.com', 'calmfoot.com', 'caniamedia.com', 'capacitly.com', 'carambo.la', 'carbonads.com', 'carbonads.net', 'casalemedia.com', 'casalmedia.com', 'cbmall.com', 'cdn-code.host', 'cecash.com', 'centerpointmedia.com', 'cetrk.com', 'cfcdist.gdn', 'cfcdist.loan', 'cfcnet.gdn', 'cfcnet.top', 'chainblock.science', 'chameleon.ad', 'channel1vids.com', 'channelintelligence.com', 'chart.dk', 'chartbeat.com', 'chartbeat.net', 'checkm8.com', 'checkstat.nl', 'cherrythread.com', 'chestionar.ro', 'chiefcurrent.com', 'chinchickens.com', 'chitika.net', 'christingel.com', 'cieh.mx', 'cinstein.com', 'cj.com', 'cjbmanagement.com', 'cjlog.com', 'claria.com', 'clicktale.net', 'clicmanager.fr', 'clikerz.net', 'cliksolution.com', 'clixgalore.com', 'clkads.com', 'clkrev.com', 'clod.pw', 'cloudcoins.biz', 'clrstm.com', 'clustrmaps.com', 'cnomy.com', 'coin-have.com', 'coin-hive.com', 'coin-service.com', 'coiner.site', 'coinhive.com', 'coinpirate.cf', 'coinrail.io', 'colonize.com', 'commandwalk.com', 'commissionmonster.com', 'concernrain.com', 'connatix.com', 'connextra.com', 'consciouscabbage.com', 'contaxe.de', 'content.ad', 'contextweb.com', 'conversantmedia.com', 'conversionruler.com', 'copperchickens.com', 'copycarpenter.com', 'copyrightaccesscontrols.com', 'coremetrics.com', 'cottawa.info', 'counted.com', 'cpalead.com', 'cpays.com', 'cpmstar.com', 'cpu2cash.link', 'cpufan.club', 'cpx.to', 'cpxinteractive.com', 'crakmedia.com', 'crawlability.com', 'crawlclocks.com', 'crazypopups.com', 'credishe.com', 'crispads.com', 'criteo.com', 'criteo.net', 'critictruck.com', 'croissed.info', 'crowdgravity.com', 'crownclam.com', 'crwdcntrl.net', 'cryptaloot.pro', 'crypto-loot.com', 'crypto-webminer.com', 'cryptobara.com', 'cryptoloot.pro', 'ctnet2.in', 'ctnetwork.hu', 'cubics.com', 'curtaincows.com', 'cutecushion.com', 'cxense.com', 'cyberbounty.com', 'cybermonitor.com', 'd-ns.ga', 'd2cmedia.ca', 'danban.com', 'dapper.net', 'datasecu.download', 'datashreddergold.com', 'dbbsrv.com', 'de17a.com', 'dealdotcom.com', 'debtbusterloans.com', 'decibelinsight.net', 'decisiveducks.com', 'decknetwork.net', 'delightdriving.com', 'deloo.de', 'deloton.com', 'demandbase.com', 'demdex.net', 'deployads.com', 'dianomi.com', 'didnkinrab.com', 'didtheyreadit.com', 'differentdesk.com', 'digitalmerkat.com', 'digitru.st', 'digxmr.com', 'directivepub.com', 'directleads.com', 'directorym.com', 'directtrack.com', 'displayadsmedia.com', 'disqusads.com', 'dk4ywix.com', 'docksalmon.com', 'domaining.in', 'domainsponsor.com', 'domainsteam.de', 'domdex.com', 'doubleclick.net', 'doublepimp.com', 'doubtfulrainstorm.com', 'dragzebra.com', 'drumcash.com', 'dyntrk.com', 'dzizsih.ru', 'eadexchange.com', 'easyhits4u.com', 'ebocornac.com', 'ebuzzing.com', 'ecoupons.com', 'edgeio.com', 'edgeno.de', 'effectivemeasure.net', 'elasticchange.com', 'elephantqueue.com', 'elitetoplist.com', 'elthamely.com', 'emarketer.com', 'emediate.dk', 'emediate.eu', 'enginenetwork.com', 'enlarget.com', 'enquisite.com', 'ensighten.com', 'entercasino.com', 'eqads.com', 'estat.com', 'estream.to', 'etahub.com', 'etargetnet.com', 'etzbnfuigipwvs.ru', 'eurekster.com', 'eusta.de', 'evengparme.com', 'evergage.com', 'ewtuyytdf45.com', 'exchange.bg', 'exchangead.com', 'exchangeclicksonline.com', 'exclusivebrass.com', 'exelator.com', 'exit76.com', 'exitexchange.com', 'exitfuel.com', 'exogripper.com', 'experteerads.com', 'exponential.com', 'extractorandburner.com', 'eyeblaster.com', 'eyeota.net', 'eyereturn.com', 'eyeviewads.com', 'eyewonder.com', 'ezula.com', 'f5biz.com', 'fatisin.ru', 'feedbackresearch.com', 'feedjit.com', 'fimserve.com', 'findcommerce.com', 'findepended.com', 'findyourcasino.com', 'firstlightera.com', 'flashtalking.com', 'flavordecision.com', 'fleshlightcash.com', 'floodprincipal.com', 'flowgo.com', 'flurry.com', 'fout.jp', 'fpctraffic2.com', 'fqtag.com', 'freecontent.bid', 'freecontent.stream', 'freelogs.com', 'freeonlineusers.com', 'freepay.com', 'freeskreen.com', 'freestats.com', 'freestats.tv', 'fullstory.com', 'functionalclam.com', 'funklicks.com', 'funpageexchange.com', 'fusionads.net', 'fusionquest.com', 'futuristicfairies.com', 'fuzzyflavor.com', 'fxstyle.net', 'g-content.bid', 'ga87z2o.com', 'galaxien.com', 'gamehouse.com', 'gamesites100.net', 'gamesites200.com', 'gamesitestop100.com', 'gator.com', 'geovisite.com', 'getclicky.com', 'giddycoat.com', 'globalismedia.com', 'globaltakeoff.net', 'globe7.com', 'gmads.net', 'goingplatinum.com', 'goldstats.com', 'google-analytics.com', 'googleadservices.com', 'googlesyndication.com', 'gorgeousground.com', 'gostats.com', 'gpr.hu', 'grafstat.ro', 'graftpool.ovh', 'greetzebra.com', 'greystripe.com', 'gridiogrid.com', 'gtop100.com', 'guardedgovernor.com', 'guitarbelieve.com', 'gunggo.com', 'hallaert.online', 'harrenmedia.com', 'harrenmedianetwork.com', 'hashing.win', 'hatcalter.com', 'hatenablog-parts.com', 'hatevery.info', 'havamedia.net', 'hegrinhar.com', 'heias.com', 'hellobar.com', 'herbalaffiliateprogram.com', 'heyos.com', 'hgads.com', 'hhb123.tk', 'hightrafficads.com', 'hilariouszinc.com', 'histats.com', 'hit.bg', 'hit.ua', 'hitbox.com', 'hitcents.com', 'hitfarm.com', 'hitiz.com', 'hitlist.ru', 'hitlounge.com', 'hitometer.com', 'hits4me.com', 'hits4pay.com', 'hitslink.com', 'hittail.com', 'hjnbvg.ru', 'hk.rs', 'hodlers.party', 'hodling.faith', 'homepageking.de', 'hotjar.com', 'hotkeys.com', 'hotlog.ru', 'href.asia', 'htmlhubing.xyz', 'httpool.com', 'hurricanedigitalmedia.com', 'hydramedia.com', 'i1img.com', 'i1media.no', 'iadnet.com', 'iasds01.com', 'iconadserver.com', 'icptrack.com', 'identads.com', 'idtargeting.com', 'ientrymail.com', 'iesnare.com', 'illustriousoatmeal.com', 'imagecash.net', 'imarketservices.com', 'impact-ad.jp', 'imprese.cz', 'impressionmedia.cz', 'imrworldwide.com', 'inboxdollars.com', 'incognitosearches.com', 'incrediblesugar.com', 'indexstats.com', 'indexww.com', 'industrybrains.com', 'inetlog.ru', 'infinityads.com', 'infolinks.com', 'information.com', 'ingorob.com', 'inmobi.com', 'innovid.com', 'inringtone.com', 'insdrbot.com', 'insightexpress.com', 'insightexpressai.com', 'inspectlet.com', 'instantmadness.com', 'instinctiveads.com', 'intelliads.com', 'intellitxt.com', 'intergi.com', 'internetfuel.com', 'interreklame.de', 'interstat.hu', 'ioam.de', 'ip.ro', 'ip193.cn', 'iperceptions.com', 'ipro.com', 'ireklama.cz', 'itfarm.com', 'itop.cz', 'itsptp.com', 'ivwbox.de', 'ivykiosk.com', 'janrain.com', 'jcount.com', 'jewelcheese.com', 'jinkads.de', 'joetec.net', 'joneself.com', 'jquery-cdn.download', 'jquery-uim.download', 'jsecoin.com', 'juicyads.com', 'jumptap.com', 'justpremium.com', 'justrelevant.com', 'justwebads.com', 'jyhfuqoh.info', 'kalipasindra.online', 'kanoodle.com', 'kargo.com', 'karonty.com', 'kedtise.com', 'keymedia.hu', 'kindads.com', 'kissmetrics.com', 'kjli.fi', 'kliks.nl', 'kniverto.com', 'knorex.com', 'koinser.in', 'komoona.com', 'kompasads.com', 'kontera.com', 'l33tsite.info', 'lacerta.space', 'lakequincy.com', 'launchbit.com', 'lbn.ru', 'leadboltads.net', 'leadingedgecash.com', 'leadzupc.com', 'ledhenone.com', 'ledinund.com', 'levelrate.de', 'lfstmedia.com', 'liftdna.com', 'ligatus.com', 'ligatus.de', 'lightminer.co', 'lightningcast.net', 'lightspeedcash.com', 'lijit.com', 'limpingline.com', 'link4ads.com', 'linkadd.de', 'linkbuddies.com', 'linkexchange.com', 'linkprice.com', 'linkrain.com', 'linkreferral.com', 'linkshighway.com', 'linkstorms.com', 'linkswaper.com', 'linktarget.com', 'liqwid.net', 'listat.biz', 'liveadexchanger.com', 'liveintent.com', 'livelyoffers.club', 'liverail.com', 'lizardslaugh.com', 'lmodr.biz', 'loading321.com', 'loggly.com', 'logly.co.jp', 'logua.com', 'lop.com', 'lopsidedspoon.com', 'losital.ru', 'loudloss.com', 'lp3tdqle.com', 'lucidmedia.com', 'lucklayed.info', 'luckyorange.com', 'lumpyleaf.com', 'lzjl.com', 'm32.media', 'm4n.nl', 'macromill.com', 'madisonavenue.com', 'marchex.com', 'mastermind.com', 'mataharirama.xyz', 'matchcows.com', 'matchcraft.com', 'mathtag.com', 'maximumcash.com', 'mbuyu.nl', 'mdotm.com', 'measuremap.com', 'mebablo.com', 'media.net', 'media6degrees.com', 'mediaarea.eu', 'mediabridge.cc', 'mediageneral.com', 'mediaiqdigital.com', 'mediamath.com', 'mediaplazza.com', 'mediaplex.com', 'mediascale.de', 'mediatext.com', 'mediatrking.com', 'mediavine.com', 'mediavoice.com', 'medleyads.com', 'medyanetads.com', 'megacash.de', 'megastats.com', 'megawerbung.de', 'mepirtedic.com', 'metanetwork.com', 'methodcash.com', 'metrilo.com', 'mgid.com', 'miarroba.com', 'microad.jp', 'microad.net', 'microstatic.pl', 'microticker.com', 'midnightclicking.com', 'minero.cc', 'minescripts.info', 'minr.pw', 'misstrends.com', 'mixedreading.com', 'mixpanel.com', 'ml314.com', 'mlm.de', 'mmismm.com', 'mmtro.com', 'moatads.com', 'mobclix.com', 'mobileiconnect.com', 'mocean.mobi', 'moggattice.com', 'monerise.com', 'monerominer.rocks', 'monetate.net', 'moneyexpert.com', 'monsterpops.com', 'moonsade.com', 'mopub.com', 'moradu.com', 'moshimo.com', 'mouseflow.com', 'mowfruit.com', 'mpstat.us', 'mrskincash.com', 'msads.net', 'msg-2.me', 'mstrlytcs.com', 'mtree.com', 'mutuza.win', 'muwmedia.com', 'myadstats.com', 'myaffiliateprogram.com', 'mybloglog.com', 'mybuys.com', 'mymoneymakingapp.com', 'mypowermall.com', 'mystat.pl', 'mytrafficads.com', 'mzbcdn.net', 'n69.com', 'nablabee.com', 'naj.sk', 'nakanohito.jp', 'namimedia.com', 'nastydollars.com', 'nathetsof.com', 'navigator.io', 'navrcholu.cz', 'nbjmp.com', 'ncaudienceexchange.com', 'nddmcconmqsy.ru', 'ndparking.com', 'nebabrop.com', 'nedstat.com', 'nedstat.nl', 'nedstatbasic.net', 'nedstatpro.net', 'nend.net', 'nengu.jp', 'neoffic.com', 'nephritish.com', 'netagent.cz', 'netclickstats.com', 'netcommunities.com', 'netdirect.nl', 'netincap.com', 'netshelter.net', 'neudesicmediagroup.com', 'never.ovh', 'newbie.com', 'newnudecash.com', 'newstarads.com', 'newtopsites.com', 'nexage.com', 'nexttime.ovh', 'ningtoldrop.ru', 'norespar.ru', 'novem.pl', 'npttech.com', 'ns1p.net', 'ntv.io', 'nuggad.net', 'nullrefexcep.com', 'nuseek.com', 'nzaza.com', 'oclasrv.com', 'oewa.at', 'oewabox.at', 'offerforge.com', 'offermatica.com', 'ogrid.org', 'oinkinns.tk', 'okexysylgzo.ru', 'olivebrandresponse.com', 'omniture.com', 'onclasrv.com', 'onclickads.net', 'oneandonlynetwork.com', 'onenetworkdirect.com', 'onesignal.com', 'onestat.com', 'onestatfree.com', 'onlinecash.com', 'onlinecashmethod.com', 'onlinerewardcenter.com', 'openads.org', 'openx.com', 'openx.jp', 'openx.net', 'opienetwork.com', 'opinionstage.com', 'optimizely.com', 'optimost.com', 'optmd.com', 'ordingly.com', 'outbrain.com', 'ovalpigs.com', 'overture.com', 'owebmoney.ru', 'owneriq.net', 'oxado.com', 'oxcash.com', 'pagefair.com', 'pagefair.net', 'papoto.com', 'parsely.com', 'partnercash.de', 'paypopup.com', 'payserve.com', 'pbnet.ru', 'pbterra.com', 'peacepowder.com', 'pearno.com', 'peer39.com', 'pema.cl', 'pennyweb.com', 'pepperjamnetwork.com', 'percentmobile.com', 'perfectaudience.com', 'perfiliate.com', 'performancerevenue.com', 'performancerevenues.com', 'performancing.com', 'permutive.com', 'personagraph.com', 'petametrics.com', 'pgmediaserve.com', 'pgpartner.com', 'pheedo.com', 'photographpan.com', 'phpmyvisites.net', 'picadmedia.com', 'piet2eix3l.com', 'pietexture.com', 'pillscash.com', 'pimproll.com', 'pingdom.net', 'playhaven.com', 'playmobileads.com', 'plista.com', 'plugrush.com', 'pointroll.com', 'popads.net', 'popflawlessads.com', 'popin.cc', 'popub.com', 'popunder.ru', 'popupmoney.com', 'popupnation.com', 'porngraph.com', 'porntrack.com', 'possibleboats.com', 'postrelease.com', 'potenza.cz', 'practicetoothpaste.com', 'praddpro.de', 'prchecker.info', 'predictad.com', 'presetrabbits.com', 'primaryads.com', 'primetime.net', 'privatecash.com', 'privy.com', 'proext.com', 'profero.com', 'profitrumour.com', 'projectwonderful.com', 'promobenef.com', 'propellerads.com', 'provexia.com', 'provideplant.com', 'prsitecheck.com', 'ps7894.com', 'psstt.com', 'pubdirecte.com', 'pubmatic.com', 'puserving.com', 'pushcrew.com', 'pushengage.com', 'pzoifaum.info', 'qctop.com', 'qnsr.com', 'quaintcan.com', 'quantcast.com', 'quantserve.com', 'quantummetric.com', 'quarterserver.de', 'quicksandear.com', 'quigo.com', 'quinst.com', 'quisma.com', 'radarurl.com', 'radiate.com', 'rakuprop.net', 'rampidads.com', 'rankchamp.de', 'rankingchart.de', 'rankingscout.com', 'rankyou.com', 'rate.ru', 'reachjunction.com', 'reactx.com', 'readgoldfish.com', 'readserver.net', 'realcastmedia.com', 'realclever.com', 'realclix.com', 'realnetwrk.com', 'realtechnetwork.com', 'reasedoper.pw', 'receptiveink.com', 'redirectvoluum.com', 'reduxmedia.com', 'referralware.com', 'refunevent.com', 'regnow.com', 'reinvigorate.net', 'reklamcsere.hu', 'relevanz10.de', 'relmaxtop.com', 'remox.com', 'rencohep.com', 'renhertfo.com', 'retadint.com', 'retargeter.com', 'revcontent.com', 'revenue.net', 'revenuedirect.com', 'revsci.net', 'revstats.com', 'richmails.com', 'richwebmaster.com', 'rightstats.com', 'rineventrec.com', 'rintindown.com', 'rintinwa.com', 'rlcdn.com', 'rle.ru', 'roar.com', 'robotreplay.com', 'rocks.io', 'roia.biz', 'ron.si', 'rove.cl', 'rowherthat.ru', 'roxr.net', 'rpxnow.com', 'rtbpop.com', 'rtbpopd.com', 'rtmark.net', 'ru4.com', 'rubiconproject.com', 'rulerabbit.com', 'runads.com', 'rundsp.com', 's2d6.com', 'sageanalyst.net', 'salemove.com', 'samsungacr.com', 'samsungads.com', 'saysidewalk.com', 'scanscout.com', 'scarabresearch.com', 'scarcestream.com', 'scopelight.com', 'scorecardresearch.com', 'scratch2cash.com', 'scrubsky.com', 'scrubswim.com', 'searchfeast.com', 'searchmarketing.com', 'searchramp.com', 'sedoparking.com', 'semrush.com', 'separatesilver.com', 'serv0.com', 'servethis.com', 'sessioncam.com', 'sexinyourcity.com', 'sexlist.com', 'sexystat.com', 'shakesea.com', 'shakytaste.com', 'shareadspace.com', 'shareasale.com', 'sharepointads.com', 'sharethrough.com', 'shelterstraw.com', 'shinobi.jp', 'shinystat.com', 'shinystat.it', 'shiveringsail.com', 'shockingswing.com', 'shoppingads.com', 'sighash.info', 'silimbompom.com', 'simplisticnose.com', 'sinceresofa.com', 'sinoa.com', 'sitemeter.com', 'sitestat.com', 'siteverification.online', 'skimresources.com', 'skylink.vn', 'slopeaota.com', 'smart4ads.com', 'smartadserver.com', 'smartlook.com', 'smowtion.com', 'snakesort.com', 'snapads.com', 'sneaklevel.com', 'sneakystamp.com', 'snoobi.com', 'socialblade.com', 'socialspark.com', 'sonobi.com', 'sortable.com', 'spacash.com', 'sparechange.io', 'sparkstudios.com', 'specially4u.net', 'specificpop.com', 'spectacularsnail.com', 'speedomizer.com', 'speedshiftmedia.com', 'spezialreporte.de', 'spillvacation.com', 'sponsorads.de', 'sponsorpro.de', 'spot.im', 'spotxchange.com', 'spykemediatrack.co', 'spykemediatrack.com', 'spylog.com', 'spywarelabs.com', 'spywarenuker.com', 'spywords.com', 'squeamishscarecrow.com', 'srwww1.com', 'stack-sonar.com', 'starffa.com', 'stat24.com', 'statcounter.com', 'stati.bid', 'static-cnt.bid', 'staticsfs.host', 'statistic.date', 'statxpress.com', 'steelhouse.com', 'steelhousemedia.com', 'stickyadstv.com', 'storesurprise.com', 'stormyachiever.com', 'stormyshock.com', 'stormysponge.com', 'straightnest.com', 'strivesidewalk.com', 'structuresofa.com', 'succeedscene.com', 'sumo.com', 'sumome.com', 'superclix.de', 'superficialsink.com', 'superstats.com', 'supertop.ru', 'supertop100.com', 'swissadsolutions.com', 'switchadhub.com', 'swordfishdc.com', 'synconnector.com', 'taboola.com', 'tacoda.net', 'tagular.com', 'tailsweep.com', 'tailsweep.se', 'takru.com', 'tangerinenet.biz', 'tapad.com', 'tapinfluence.com', 'targad.de', 'targetingnow.com', 'targetnet.com', 'targetpoint.com', 'tcads.net', 'tdxio.com', 'teads.tv', 'teenrevenue.com', 'teliad.de', 'terethat.ru', 'terribleturkey.com', 'textads.biz', 'textlinks.com', 'tfag.de', 'tgknt.com', 'tgtvbngp.ru', 'thathislitt.ru', 'thatresha.com', 'theadhost.com', 'theads.me', 'thebugs.ws', 'therapistla.com', 'therichkids.com', 'thirdrespect.com', 'thrnt.com', 'throattrees.com', 'thruport.com', 'tidytrail.com', 'tinybar.com', 'tinypass.com', 'tizers.net', 'tlvmedia.com', 'tnkexchange.com', 'toftofcal.com', 'top123.ro', 'top20free.com', 'top90.ro', 'topacity.info', 'topbucks.com', 'topforall.com', 'topgamesites.net', 'toplist.cz', 'toplistcity.com', 'toprebates.com', 'topsafelist.net', 'topsearcher.com', 'topsir.com', 'topsite.lv', 'topstats.com', 'torrent.pw', 'totemcash.com', 'touchclarity.com', 'tpnads.com', 'tracedesire.com', 'trackalyzer.com', 'trackmysales.com', 'tradeadexchange.com', 'tradedoubler.com', 'traffic-gate-service.info', 'traffic-info-service.info', 'traffic-optical-service.info', 'traffic-service.info', 'traffic-tech-service.info', 'traffichaus.com', 'traffiq.com', 'trafic.ro', 'treasuredata.com', 'trekblue.com', 'trekdata.com', 'trendmd.com', 'trhunt.com', 'tribalfusion.com', 'trickycelery.com', 'tritetongue.com', 'trix.net', 'trmit.com', 'truehits.net', 'truste.com', 'tsyndicate.com', 'tubemogul.com', 'tulip18.com', 'turn.com', 'twittad.com', 'tyroo.com', 'uarating.com', 'ulnawoyyzbljc.ru', 'ultimateclixx.com', 'ultramercial.com', 'unarmedindustry.com', 'unknowntray.com', 'unrulymedia.com', 'unrummaged.com', 'untd.com', 'unusualtitle.com', 'urlcash.net', 'usapromotravel.com', 'userreplay.com', 'userreplay.net', 'valuead.com', 'valueclickmedia.com', 'valuecommerce.com', 'valuesponsor.com', 'ventivmedia.com', 'veritrol.com', 'verresof.com', 'vertadnet.com', 'veruta.com', 'vervewireless.com', 'vibrantmedia.com', 'videoadex.com', 'videoegg.com', 'vidora.com', 'view4cash.de', 'viewpoint.com', 'vilynx.com', 'visistat.com', 'visitbox.de', 'visualrevenue.com', 'voicefive.com', 'voicevegetable.com', 'vpon.com', 'vrs.cz', 'vungle.com', 'vzhjnorkudcxbiy.com', 'warlog.ru', 'watchingthat.com', 'waust.at', 'webangel.ru', 'webassembly.stream', 'webcash.nl', 'webgains.com', 'webmasterplan.com', 'webmasterplan.de', 'webmine.cz', 'webmine.pro', 'webminepool.com', 'webminepool.tk', 'webminerpool.com', 'weborama.fr', 'webpower.com', 'webreseau.com', 'websponsors.com', 'webtraxx.de', 'webtrendslive.com', 'wetrack.it', 'whaleads.com', 'whathyx.com', 'whenu.com', 'whispa.com', 'whoisonline.net', 'widdit.com', 'widespace.com', 'widgetbucks.com', 'wildianing.ru', 'witthethim.com', 'wlmarketing.com', 'wonderlandads.com', 'wondoads.de', 'woopra.com', 'wpnrtnmrewunrtok.xyz', 'wqgkainysj.ru', 'wronpeci.com', 'wtlive.com', 'wwwpromoter.com', 'xchange.ro', 'xertive.com', 'xg4ken.com', 'xiti.com', 'xmrm.pw', 'xmrminingproxy.com', 'xplusone.com', 'xponsor.com', 'xq1.net', 'xtendmedia.com', 'xtremetop100.com', 'xxxmyself.com', 'yabuka.com', 'yadro.ru', 'yesads.com', 'yieldads.com', 'yieldlab.net', 'yieldmanager.com', 'yieldmanager.net', 'yieldmo.com', 'yjtag.jp', 'yldbt.com', 'yoggrt.com', 'yomereba.com', 'yuyyio.com', 'z5x.net', 'zangocash.com', 'zanox.com', 'zdbb.net', 'zenkreka.com', 'zenzuu.com', 'zintext.com', 'ziyu.net', 'zmedia.com', 'zqtk.net', 'ebis.ne.jp', 'traffic-media.co.uk', 'amgload.net', 'smcheck.org', 'f-tra.com', 'rebel.ai', 's-onetag.com', '3gl.net', 'dpmsrv.com', 'adrecover.com', 'condenastdigital.com', 'omtrdc.net', 'adpopcon.com', 'pages06.net', 'consensu.org', 'im-apps.net', 'bigmining.com', 'oath.com', 'evidon.com', 'addroplet.com', 'getsentry.com', 'sentry.io', 'captifymedia.com', 'contentinsights.com'] : [];
		tprq_unsocial = (w.myset_rqblbyesocial == 'y') ? 1 : 0;
		tprq_dsocial_fqdn = (w.myset_rqblbyesocial == 'y') ? ['an.facebook.com', 'assets.pinterest.com', 'b.hatena.ne.jp', 'connect.facebook.net', 'connect.facebook.com', 'graph.facebook.com', 'graph.instagram.com', 'jsoon.digitiminimi.com', 'platform.instagram.com', 'platform.twitter.com', 's.hatena.ne.jp', 'seccdn.libravatar.org', 'static.evernote.com', 'platform.tumblr.com', 'px.srvcs.tumblr.com', 'jpn2.fukugan.com', 'static.mixi.jp', 'scdn.line-apps.com'] : [];
		tprq_dsocial_dom = (w.myset_rqblbyesocial == 'y') ? ['addthis.com', 'blogmura.com', 'buzzfeed.com', 'disqus.com', 'feedly.com', 'flattr.com', 'gravatar.com', 'instawidget.net', 'pusher.com', 'st-hatena.com', 'with2.net', 'stacksocial.com', 'ghbtns.com'] : [];
		tprq_geo4_loaded = false;
		tprq_db_geo4 = {};
		if (tprq_popshowcc == 1) {
			if (w.myset_rqbl_geo) {
				tprq_db_geo4 = JSON.parse(w.myset_rqbl_geo);
				if (Object.keys(tprq_db_geo4).length > 1000) {
					tprq_geo4_loaded = true;
				}
			}
		}
		tprq_acln_x = (w.myset_autocln_vx) ? parseInt(w.myset_autocln_vx) : 5;
		if (tprq_acln_x <= 0) {
			tprq_acln_x = 5;
		}
		tprq_acln_y = (w.myset_autocln_vy) ? parseInt(w.myset_autocln_vy) : 3;
		tprq_acln_y *= 60;
		if (tprq_acln_y <= 0) {
			tprq_acln_y = 180;
		}
		tprq_pop_sort = (w.myset_rqblprsort) ? parseInt(w.myset_rqblprsort) : 0;
		if (tprq_pop_sort != 0 && tprq_pop_sort != 1 && tprq_pop_sort != 2 && tprq_pop_sort != 3) {
			tprq_pop_sort = 0;
		}
		if (w.myset_rqblpcolor) {
			switch (w.myset_rqblpcolor) {
				case 1:
					tprq_pop_bid = ['black', '#323234'];
					break;
				case 5:
					tprq_pop_bid = ['tlarger', '#f9fafb'];
					break;
				default:
					tprq_pop_bid = ['', '#fff'];
					break;
			}
		} else {
			tprq_pop_bid = ['', '#fff'];
		}
		if (w.myset_rqblmyicon) {
			switch (w.myset_rqblmyicon) {
				case 1:
					tprq_flags[0] = 'icons/s/j_wht.png';
					tprq_flags[1] = 'icons/s/j_ylw.png';
					tprq_flags[2] = 'icons/s/j_red.png';
					break;
				case 2:
					tprq_flags[0] = 'icons/s/ob_grn.png';
					tprq_flags[1] = 'icons/s/ob_ylw.png';
					tprq_flags[2] = 'icons/s/ob_red.png';
					break;
				default:
					tprq_flags[0] = 'icons/icon-32.png';
					tprq_flags[1] = 'icons/i_ylw.png';
					tprq_flags[2] = 'icons/i_red.png';
					break;
			}
		} else {
			tprq_flags[0] = 'icons/icon-32.png';
			tprq_flags[1] = 'icons/i_ylw.png';
			tprq_flags[2] = 'icons/i_red.png';
		}
			tprq_mylang = {
				"v": 0,
				"unknown": "Unknown",
				"offmode": "Add-on is disabled",
				"no3pcon": "No third-party connection",
				"dtthisfqdn": "This FQDN",
				"dlg_apply": "Apply",
				"dlg_bma": "BLK|~|ALW",
				"dlg_bmas": "BLK|~|ALW|HTTPS",
				"allsdom": "All domains",
				"ardir_t": "Automatic redirection detected",
				"ardir_s": "Source",
				"ardir_d": "Destination",
				"ardir_b": "Go Back",
				"ardir_n": "I Accept",
				"ctm_absite": "About this site",
				"ctm_popup": "Open popup",
				"ctm_cdom": "Add to blacklist",
				"ctm_acfw": "Add to content filter whitelist",
				"ctm_mitm": "Add to MITM ignore list",
				"nf_dtmitm": "MITM detected",
				"nf_acted": "The add-on stopped further connection to ",
				"ctxa": "Context menu",
				"ctxa_ae": "Already exist:",
				"kbsa": "Keyboard Shortcut"
			};
		browser.runtime.getPlatformInfo().then(function (i) {
			if (i.os == 'android') {
				tprq_amdroid = true;
				tprq_showcntr = 0;
				tprq_showicon = 0;
				tprq_showxbtn = 0;
				tprq_popstyle = 0;
				tprq_poponoff = 0;
				tprq_poponoff_ison = true;
				if (tprq_pop_bid[0] == 'black') {
					tprq_pop_bid[0] = 'broid';
				} else {
					tprq_pop_bid[0] = 'droid';
				}
			}
		});
		if (!tprq_amdroid) {
			browser.contextMenus.removeAll();
				browser.contextMenus.create({
					id: "tprb_mainmenuroot",
					title: "TPRB: " + tprq_mylang['ctm_absite'],
					contexts: ["page"]
				});
				browser.contextMenus.create({
					id: "tprb_ctxmnu_pop",
					parentId: "tprb_mainmenuroot",
					title: tprq_mylang['ctm_popup'],
					icons: {
						"16": "icons/c/go_16.png"
					},
					contexts: ["page"]
				});
					browser.contextMenus.create({
						parentId: "tprb_mainmenuroot",
						type: "separator",
						contexts: ["page"]
					});
					browser.contextMenus.create({
						id: "tprb_ctxmnu_addcdb",
						parentId: "tprb_mainmenuroot",
						title: tprq_mylang['ctm_cdom'],
						icons: {
							"16": "icons/c/cdb_16.png"
						},
						contexts: ["page"]
					});
					browser.contextMenus.create({
						parentId: "tprb_mainmenuroot",
						type: "separator",
						contexts: ["page"]
					});
					browser.contextMenus.create({
						id: "tprb_ctxmnu_addcfw",
						parentId: "tprb_mainmenuroot",
						title: tprq_mylang['ctm_acfw'],
						icons: {
							"16": "icons/c/wpc_16.png"
						},
						contexts: ["page"]
					});
				if (tprq_scan_mitm >= 1) {
					browser.contextMenus.create({
						parentId: "tprb_mainmenuroot",
						type: "separator",
						contexts: ["page"]
					});
					browser.contextMenus.create({
						id: "tprb_ctxmnu_addmit",
						parentId: "tprb_mainmenuroot",
						title: tprq_mylang['ctm_mitm'],
						icons: {
							"16": "icons/c/mitm_16.png"
						},
						contexts: ["page"]
					});
				}
			if (w.myset_rqblbgc == 1 && w.myset_rqblbgc_color != undefined) {
				browser.browserAction.setBadgeBackgroundColor({
					color: w.myset_rqblbgc_color
				});
			} else {
				browser.browserAction.setBadgeBackgroundColor({
					color: [217, 0, 0, 255]
				});
			}
			if (w.myset_rqbl_kbrd == 'y') {
				tprq_kb_act = w.myset_rqbl_kbda || 0;
			} else {
				tprq_kb_act = -1;
			}
		}
		if (w.myset_rqblmyrecset == 'y') {
			browser.privacy.websites.firstPartyIsolate.set({
				value: true
			});
			browser.privacy.websites.hyperlinkAuditingEnabled.set({
				value: false
			});
			browser.privacy.websites.referrersEnabled.set({
				value: true
			});
			browser.privacy.websites.resistFingerprinting.set({
				value: true
			});
			browser.privacy.network.networkPredictionEnabled.set({
				value: false
			});
			browser.privacy.network.peerConnectionEnabled.set({
				value: false
			});
			browser.privacy.network.webRTCIPHandlingPolicy.set({
				value: 'disable_non_proxied_udp'
			});
			browser.privacy.services.passwordSavingEnabled.set({
				value: false
			});
			browser.privacy.websites.cookieConfig.get({}).then((got) => {
				if (got.value.behavior == 'reject_all') {
					browser.privacy.websites.cookieConfig.set({
						value: {
							'behavior': 'reject_all',
							'nonPersistentCookies': true
						}
					});
				} else {
					browser.privacy.websites.cookieConfig.set({
						value: {
							'behavior': 'reject_third_party',
							'nonPersistentCookies': true
						}
					});
				}
			});
		} else {
			browser.privacy.websites.firstPartyIsolate.clear({});
			browser.privacy.websites.hyperlinkAuditingEnabled.clear({});
			browser.privacy.websites.referrersEnabled.clear({});
			browser.privacy.websites.resistFingerprinting.clear({});
			browser.privacy.network.networkPredictionEnabled.clear({});
			browser.privacy.network.peerConnectionEnabled.clear({});
			browser.privacy.network.webRTCIPHandlingPolicy.clear({});
			browser.privacy.services.passwordSavingEnabled.clear({});
			browser.privacy.websites.cookieConfig.clear({});
		}
		if (w.myset_rqblnonotifypop == 'y') {
			browser.browserSettings.webNotificationsDisabled.set({
				value: true
			});
			browser.browserSettings.allowPopupsForUserEvents.set({
				value: false
			});
		} else {
			browser.browserSettings.webNotificationsDisabled.clear({});
			browser.browserSettings.allowPopupsForUserEvents.clear({});
		}
		if (w.myset_rqblnogifani == 'y') {
			browser.browserSettings.imageAnimationBehavior.set({
				value: 'once'
			});
		} else {
			browser.browserSettings.imageAnimationBehavior.clear({});
		}
		tprq_mustcleanup = false;
		tprq_cleanup_what = {};
		tprq_tabcls_cnt = 0;
		if (w.myset_rqblclnw_ckie == 'y') {
			tprq_cleanup_what['cookie'] = true;
		}
		if (w.myset_rqblclnw_stor == 'y') {
			tprq_cleanup_what['storage'] = true;
		}
		if (w.myset_rqblclnw_cace == 'y') {
			tprq_cleanup_what['cache'] = true;
		}
		if (w.myset_rqblclnw_dwnl == 'y') {
			tprq_cleanup_what['down'] = true;
		}
		if (!tprq_amdroid) {
			if (w.myset_rqblclnw_fdta == 'y') {
				tprq_cleanup_what['formd'] = true;
			}
			if (w.myset_rqblclnw_hist == 'y') {
				tprq_cleanup_what['hist'] = true;
			}
			if (w.myset_rqblclnw_plug == 'y') {
				tprq_cleanup_what['plug'] = true;
			}
		}
		if (Object.keys(tprq_cleanup_what).length >= 1) {
			tprq_mustcleanup = true;
		}
		browser.tabs.query({
			active: true,
			currentWindow: true
		}).then(function (t) {
			tprq_updicon(t[0].id, t[0].url);
		}, onError); //updateicon
		console.log('TPRB: Settings loaded.');
	}, onError);
}

function cleaning_service() {
	tprq_tabcls_cnt += 1;
	if (tprq_tabcls_cnt >= tprq_acln_x) {
		if (Math.abs(Math.round((new Date()).getTime() / 1000) - tprq_acln_lastrun) >= tprq_acln_y) {
			tprq_tabcls_cnt = -500000;
			if (tprq_cleanup_what['cookie']) {
				browser.browsingData.removeCookies({}).then(function () {}, onError);
			}
			if (tprq_cleanup_what['storage']) {
				browser.browsingData.removeLocalStorage({}).then(function () {}, onError);
			}
			if (tprq_cleanup_what['cache']) {
				browser.browsingData.removeCache({}).then(function () {}, onError);
			}
			if (tprq_cleanup_what['down']) {
				browser.browsingData.removeDownloads({}).then(function () {}, onError);
			}
			if (tprq_cleanup_what['formd']) {
				browser.browsingData.removeFormData({}).then(function () {}, onError);
				browser.browsingData.removePasswords({}).then(function () {}, onError);
			}
			if (tprq_cleanup_what['hist']) {
				browser.browsingData.removeHistory({}).then(function () {}, onError);
			}
			if (tprq_cleanup_what['plug']) {
				browser.browsingData.removePluginData({}).then(function () {}, onError);
			}
			console.log('TPRB: Service: Cleanup done', (new Date));
			tprq_acln_lastrun = Math.round((new Date()).getTime() / 1000);
			tprq_tabcls_cnt = 0;
		}
	}
}

function is_ip_addr(w) {
	if (/^([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})$/.test(w) || w.startsWith('[')) {
		return true;
	} else {
		return false;
	}
}

function get_realdomain(w) {
	var wa = w.split('.');
	wa.reverse();
	var wa_l = wa.length; //net0,domain1,sub2
	if (wa_l <= 2) {
		return w;
	}
	if (wa_l >= 3) {
		if (wa[0] == 'by' || wa[0] == 'ki' || wa[0] == 'na' || wa[0] == 'tm' || wa[0] == 'vc') {
			if (wa[1] == 'com') {
				return wa[2] + "." + wa[1] + "." + wa[0];
			}
		}
		if (wa[0] == 'af' || wa[0] == 'bz' || wa[0] == 'lb' || wa[0] == 'lc' || wa[0] == 'mm' || wa[0] == 'mt' || wa[0] == 'ng' || wa[0] == 'sb' || wa[0] == 'sc' || wa[0] == 'sl') {
			if (wa[1] == 'com' || wa[1] == 'edu' || wa[1] == 'gov' || wa[1] == 'net' || wa[1] == 'org') {
				return wa[2] + "." + wa[1] + "." + wa[0];
			}
		}
		if (wa[0] == 'org') {
			if (wa[1] == 'ae') {
				return wa[2] + "." + wa[1] + "." + wa[0];
			}
		}
		if (wa[0] == 'gg' || wa[0] == 'je') {
			if (wa[1] == 'co' || wa[1] == 'net' || wa[1] == 'org') {
				return wa[2] + "." + wa[1] + "." + wa[0];
			}
		}
		if (wa[0] == 'name') {
			return wa[2] + "." + wa[1] + "." + wa[0];
		}
		if (wa[0] == 'ag') {
			if (['com', 'net', 'org', 'co', 'nom', 'edu', 'gov'].includes(wa[1])) {
				return wa[2] + "." + wa[1] + "." + wa[0];
			}
		}
		if (wa[0] == 'ai') {
			if (['off', 'com', 'net', 'org'].includes(wa[1])) {
				return wa[2] + "." + wa[1] + "." + wa[0];
			}
		}
		if (wa[0] == 'ao') {
			if (['co', 'ed', 'it', 'og', 'pb'].includes(wa[1])) {
				return wa[2] + "." + wa[1] + "." + wa[0];
			}
		}
		if (wa[0] == 'ar') {
			if (['com', 'edu', 'gov', 'gob', 'int', 'mil', 'net', 'org', 'tur'].includes(wa[1])) {
				return wa[2] + "." + wa[1] + "." + wa[0];
			}
		}
		if (wa[0] == 'at') {
			if (['gv', 'ac', 'co', 'or'].includes(wa[1])) {
				return wa[2] + "." + wa[1] + "." + wa[0];
			}
		}
		if (wa[0] == 'au') {
			if (['com', 'net', 'org', 'edu', 'gov', 'csiro', 'asn', 'id', 'act', 'nsw', 'nt', 'qld', 'sa', 'tas', 'vic', 'wa'].includes(wa[1])) {
				return wa[2] + "." + wa[1] + "." + wa[0];
			}
		}
		if (wa[0] == 'az') {
			if (['biz', 'com', 'edu', 'gov', 'info', 'int', 'mil', 'name', 'net', 'org', 'pp'].includes(wa[1])) {
				return wa[2] + "." + wa[1] + "." + wa[0];
			}
		}
		if (wa[0] == 'ba') {
			if (['com', 'co', 'rs'].includes(wa[1])) {
				return wa[2] + "." + wa[1] + "." + wa[0];
			}
		}
		if (wa[0] == 'bd') {
			if (['com', 'edu', 'ac', 'net', 'gov', 'org', 'mil'].includes(wa[1])) {
				return wa[2] + "." + wa[1] + "." + wa[0];
			}
		}
		if (wa[0] == 'bh') {
			if (['com', 'info', 'cc', 'edu', 'biz', 'net', 'org', 'gov'].includes(wa[1])) {
				return wa[2] + "." + wa[1] + "." + wa[0];
			}
		}
		if (wa[0] == 'bi') {
			if (['ac', 'co', 'com', 'edu', 'gouv', 'gov', 'int', 'mil', 'net', 'or', 'org'].includes(wa[1])) {
				return wa[2] + "." + wa[1] + "." + wa[0];
			}
		}
		if (wa[0] == 'bn') {
			if (['com', 'net', 'org', 'edu'].includes(wa[1])) {
				return wa[2] + "." + wa[1] + "." + wa[0];
			}
		}
		if (wa[0] == 'bo') {
			if (['com', 'edu', 'gob', 'gov', 'int', 'mil', 'net', 'org', 'tv'].includes(wa[1])) {
				return wa[2] + "." + wa[1] + "." + wa[0];
			}
		}
		if (wa[0] == 'br') {
			if (['adm', 'adv', 'agr', 'am', 'arq', 'art', 'ato', 'bio', 'blog', 'bmd', 'cim', 'cng', 'cnt', 'com', 'coop', 'ecn', 'edu', 'eng', 'esp', 'etc', 'eti', 'far', 'flog', 'fm', 'fnd', 'fot', 'fst', 'g12', 'ggf', 'gov', 'imb', 'ind', 'inf', 'jor', 'lel', 'mat', 'med', 'mil', 'mus', 'net', 'nom', 'not', 'ntr', 'odo', 'org', 'ppg', 'pro', 'psc', 'psi', 'qsl', 'rec', 'slg', 'srv', 'tmp', 'trd', 'tur', 'tv', 'vet', 'vlog', 'wiki', 'zlg'].includes(wa[1])) {
				return wa[2] + "." + wa[1] + "." + wa[0];
			}
		}
		if (wa[0] == 'bw') {
			if (['org', 'ac', 'co', 'gov'].includes(wa[1])) {
				return wa[2] + "." + wa[1] + "." + wa[0];
			}
		}
		if (wa[0] == 'ci') {
			if (['ac', 'co', 'com', 'ed', 'edu', 'go', 'int', 'net', 'or', 'org'].includes(wa[1])) {
				return wa[2] + "." + wa[1] + "." + wa[0];
			}
		}
		if (wa[0] == 'ck') {
			if (['biz', 'co', 'edu', 'gen', 'gov', 'info', 'net', 'org'].includes(wa[1])) {
				return wa[2] + "." + wa[1] + "." + wa[0];
			}
		}
		if (wa[0] == 'cn') {
			if (['ac', 'ah', 'bj', 'com', 'cq', 'edu', 'fj', 'gd', 'gov', 'gs', 'gx', 'gz', 'ha', 'hb', 'he', 'hi', 'hk', 'hl', 'hn', 'jl', 'js', 'jx', 'ln', 'mil', 'mo', 'net', 'nm', 'nx', 'org', 'qh', 'sc', 'sd', 'sh', 'sn', 'sx', 'tj', 'tw', 'xj', 'xz', 'yn', 'zj'].includes(wa[1])) {
				return wa[2] + "." + wa[1] + "." + wa[0];
			}
		}
		if (wa[0] == 'co') {
			if (['com', 'edu', 'gov', 'mil', 'net', 'nom', 'org'].includes(wa[1])) {
				return wa[2] + "." + wa[1] + "." + wa[0];
			}
		}
		if (wa[0] == 'com') {
			if (['ar', 'br', 'cn', 'de', 'eu', 'gr', 'hu', 'jpn', 'kr', 'no', 'qc', 'ru', 'sa', 'se', 'uk', 'us', 'uy', 'za'].includes(wa[1])) {
				return wa[2] + "." + wa[1] + "." + wa[0];
			}
		}
		if (wa[0] == 'cr') {
			if (['ac', 'co', 'ed', 'fi', 'go', 'or', 'sa'].includes(wa[1])) {
				return wa[2] + "." + wa[1] + "." + wa[0];
			}
		}
		if (wa[0] == 'cu') {
			if (['com', 'edu', 'org', 'net', 'gov', 'inf'].includes(wa[1])) {
				return wa[2] + "." + wa[1] + "." + wa[0];
			}
		}
		if (wa[0] == 'cy') {
			if (['ac', 'biz', 'com', 'ekloges', 'gov', 'ltd', 'name', 'net', 'org', 'parliament', 'press', 'pro', 'tm'].includes(wa[1])) {
				return wa[2] + "." + wa[1] + "." + wa[0];
			}
		}
		if (wa[0] == 'do') {
			if (['art', 'com', 'edu', 'gob', 'gov', 'mil', 'net', 'org', 'sld', 'web'].includes(wa[1])) {
				return wa[2] + "." + wa[1] + "." + wa[0];
			}
		}
		if (wa[0] == 'dz') {
			if (['art', 'asso', 'com', 'edu', 'gov', 'net', 'org', 'pol'].includes(wa[1])) {
				return wa[2] + "." + wa[1] + "." + wa[0];
			}
		}
		if (wa[0] == 'ec') {
			if (['com', 'info', 'net', 'fin', 'med', 'pro', 'org', 'edu', 'gob', 'gov', 'mil'].includes(wa[1])) {
				return wa[2] + "." + wa[1] + "." + wa[0];
			}
		}
		if (wa[0] == 'ee') {
			if (['com', 'pri', 'fie', 'med', 'edu', 'lib', 'org'].includes(wa[1])) {
				return wa[2] + "." + wa[1] + "." + wa[0];
			}
		}
		if (wa[0] == 'eg') {
			if (['com', 'edu', 'eun', 'gov', 'mil', 'name', 'net', 'org', 'sci'].includes(wa[1])) {
				return wa[2] + "." + wa[1] + "." + wa[0];
			}
		}
		if (wa[0] == 'es') {
			if (['com', 'nom', 'org', 'gob', 'edu'].includes(wa[1])) {
				return wa[2] + "." + wa[1] + "." + wa[0];
			}
		}
		if (wa[0] == 'et') {
			if (['com', 'gov', 'org', 'edu', 'net', 'biz', 'name', 'info'].includes(wa[1])) {
				return wa[2] + "." + wa[1] + "." + wa[0];
			}
		}
		if (wa[0] == 'fj') {
			if (['ac', 'biz', 'com', 'info', 'mil', 'name', 'net', 'org', 'pro'].includes(wa[1])) {
				return wa[2] + "." + wa[1] + "." + wa[0];
			}
		}
		if (wa[0] == 'ge') {
			if (['com', 'edu', 'gov', 'mil', 'net', 'org', 'pvt'].includes(wa[1])) {
				return wa[2] + "." + wa[1] + "." + wa[0];
			}
		}
		if (wa[0] == 'gh') {
			if (['com', 'edu', 'gov', 'org', 'mil'].includes(wa[1])) {
				return wa[2] + "." + wa[1] + "." + wa[0];
			}
		}
		if (wa[0] == 'gi') {
			if (['com', 'edu', 'gov', 'ltd', 'mod', 'org'].includes(wa[1])) {
				return wa[2] + "." + wa[1] + "." + wa[0];
			}
		}
		if (wa[0] == 'gl') {
			if (wa[1] == 'co' || wa[1] == 'com') {
				return wa[2] + "." + wa[1] + "." + wa[0];
			}
		}
		if (wa[0] == 'gr') {
			if (['co', 'com', 'edu', 'gov', 'mil', 'mod', 'net', 'org', 'sch'].includes(wa[1])) {
				return wa[2] + "." + wa[1] + "." + wa[0];
			}
		}
		if (wa[0] == 'gt') {
			if (['com', 'edu', 'net', 'gob', 'org', 'mil', 'ind'].includes(wa[1])) {
				return wa[2] + "." + wa[1] + "." + wa[0];
			}
		}
		if (wa[0] == 'gy') {
			if (['co', 'com', 'edu', 'gov', 'net', 'org'].includes(wa[1])) {
				return wa[2] + "." + wa[1] + "." + wa[0];
			}
		}
		if (wa[0] == 'hk') {
			if (['com', 'edu', 'gov', 'idv', 'net', 'org'].includes(wa[1])) {
				return wa[2] + "." + wa[1] + "." + wa[0];
			}
		}
		if (wa[0] == 'hn') {
			if (['com', 'edu', 'gob', 'net', 'org'].includes(wa[1])) {
				return wa[2] + "." + wa[1] + "." + wa[0];
			}
		}
		if (wa[0] == 'hr') {
			if (wa[1] == 'com' || wa[1] == 'from') {
				return wa[2] + "." + wa[1] + "." + wa[0];
			}
		}
		if (wa[0] == 'hu') {
			if (['2000', 'agrar', 'bolt', 'casino', 'city', 'co', 'erotica', 'erotika', 'film', 'forum', 'games', 'hotel', 'info', 'ingatlan', 'jogasz', 'konyvelo', 'lakas', 'media', 'news', 'org', 'priv', 'reklam', 'sex', 'shop', 'sport', 'suli', 'szex', 'tm', 'tozsde', 'utazas', 'video'].includes(wa[1])) {
				return wa[2] + "." + wa[1] + "." + wa[0];
			}
		}
		if (wa[0] == 'id') {
			if (['ac', 'co', 'go', 'mil', 'net', 'or', 'sch', 'web'].includes(wa[1])) {
				return wa[2] + "." + wa[1] + "." + wa[0];
			}
		}
		if (wa[0] == 'il') {
			if (['ac', 'co', 'gov', 'idf', 'k12', 'muni', 'net', 'org'].includes(wa[1])) {
				return wa[2] + "." + wa[1] + "." + wa[0];
			}
		}
		if (wa[0] == 'im') {
			if (['ac', 'co', 'com', 'gov', 'net', 'org', 'ro'].includes(wa[1])) {
				return wa[2] + "." + wa[1] + "." + wa[0];
			}
		}
		if (wa[0] == 'in') {
			if (['ac', 'co', 'edu', 'ernet', 'firm', 'gen', 'gov', 'ind', 'mil', 'net', 'org', 'res'].includes(wa[1])) {
				return wa[2] + "." + wa[1] + "." + wa[0];
			}
		}
		if (wa[0] == 'it') {
			if (['co', 'edu', 'gov'].includes(wa[1])) {
				return wa[2] + "." + wa[1] + "." + wa[0];
			}
		}
		if (wa[0] == 'jm') {
			if (['com', 'net', 'org', 'edu', 'gov', 'mil'].includes(wa[1])) {
				return wa[2] + "." + wa[1] + "." + wa[0];
			}
		}
		if (wa[0] == 'jo') {
			if (['com', 'edu', 'gov', 'mil', 'name', 'net', 'org'].includes(wa[1])) {
				return wa[2] + "." + wa[1] + "." + wa[0];
			}
		}
		if (wa[0] == 'jp') {
			if (['ac', 'ad', 'co', 'ed', 'go', 'gr', 'lg', 'ne', 'or'].includes(wa[1])) {
				return wa[2] + "." + wa[1] + "." + wa[0];
			}
		}
		if (wa[0] == 'ke') {
			if (['ac', 'co', 'go', 'ne', 'or', 'sc'].includes(wa[1])) {
				return wa[2] + "." + wa[1] + "." + wa[0];
			}
		}
		if (wa[0] == 'kg') {
			if (['com', 'edu', 'gov', 'mil', 'net', 'org'].includes(wa[1])) {
				return wa[2] + "." + wa[1] + "." + wa[0];
			}
		}
		if (wa[0] == 'kh') {
			if (['com', 'edu', 'gov', 'mil', 'net', 'org', 'per'].includes(wa[1])) {
				return wa[2] + "." + wa[1] + "." + wa[0];
			}
		}
		if (wa[0] == 'kr') {
			if (['ac', 'busan', 'chungbuk', 'chungnam', 'co', 'daegu', 'daejeon', 'es', 'gangwon', 'go', 'gwangju', 'gyeongbuk', 'gyeonggi', 'gyeongnam', 'hs', 'incheon', 'jeju', 'jeonbuk', 'jeonnam', 'kg', 'mil', 'ms', 'ne', 'or', 'pe', 're', 'sc', 'seoul', 'ulsan'].includes(wa[1])) {
				return wa[2] + "." + wa[1] + "." + wa[0];
			}
		}
		if (wa[0] == 'kw') {
			if (['edu', 'com', 'net', 'org', 'gov'].includes(wa[1])) {
				return wa[2] + "." + wa[1] + "." + wa[0];
			}
		}
		if (wa[0] == 'kz') {
			if (['com', 'edu', 'gov', 'mil', 'net', 'org'].includes(wa[1])) {
				return wa[2] + "." + wa[1] + "." + wa[0];
			}
		}
		if (wa[0] == 'lk') {
			if (['assn', 'com', 'edu', 'gov', 'grp', 'hotel', 'int', 'ltd', 'net', 'ngo', 'org', 'sch', 'soc', 'web'].includes(wa[1])) {
				return wa[2] + "." + wa[1] + "." + wa[0];
			}
		}
		if (wa[0] == 'ls') {
			if (['ac', 'co', 'gov', 'net', 'nul', 'org', 'parliament', 'quadrant'].includes(wa[1])) {
				return wa[2] + "." + wa[1] + "." + wa[0];
			}
		}
		if (wa[0] == 'lv') {
			if (['asn', 'com', 'conf', 'edu', 'gov', 'id', 'mil', 'net', 'org'].includes(wa[1])) {
				return wa[2] + "." + wa[1] + "." + wa[0];
			}
		}
		if (wa[0] == 'ly') {
			if (['com', 'edu', 'gov', 'id', 'med', 'net', 'org', 'plc', 'sch'].includes(wa[1])) {
				return wa[2] + "." + wa[1] + "." + wa[0];
			}
		}
		if (wa[0] == 'ma') {
			if (['ac', 'co', 'gov', 'net', 'org', 'press'].includes(wa[1])) {
				return wa[2] + "." + wa[1] + "." + wa[0];
			}
		}
		if (wa[0] == 'mk') {
			if (['com', 'edu', 'gov', 'inf', 'name', 'net', 'org'].includes(wa[1])) {
				return wa[2] + "." + wa[1] + "." + wa[0];
			}
		}
		if (wa[0] == 'mu') {
			if (['ac', 'co', 'com', 'gov', 'net', 'or', 'org'].includes(wa[1])) {
				return wa[2] + "." + wa[1] + "." + wa[0];
			}
		}
		if (wa[0] == 'mx') {
			if (['com', 'edu', 'gob', 'net', 'ngo', 'org'].includes(wa[1])) {
				return wa[2] + "." + wa[1] + "." + wa[0];
			}
		}
		if (wa[0] == 'my') {
			if (['com', 'edu', 'gov', 'mil', 'name', 'net', 'org'].includes(wa[1])) {
				return wa[2] + "." + wa[1] + "." + wa[0];
			}
		}
		if (wa[0] == 'mz') {
			if (['co', 'net', 'org', 'ac', 'gov', 'edu'].includes(wa[1])) {
				return wa[2] + "." + wa[1] + "." + wa[0];
			}
		}
		if (wa[0] == 'net') {
			if (['gb', 'se', 'uk', 'jp'].includes(wa[1])) {
				return wa[2] + "." + wa[1] + "." + wa[0];
			}
		}
		if (wa[0] == 'nf') {
			if (['com', 'net', 'arts', 'store', 'web', 'firm', 'info', 'other', 'per', 'rec'].includes(wa[1])) {
				return wa[2] + "." + wa[1] + "." + wa[0];
			}
		}
		if (wa[0] == 'ni') {
			if (['gob', 'co', 'com', 'ac', 'edu', 'org', 'nom', 'net', 'mil'].includes(wa[1])) {
				return wa[2] + "." + wa[1] + "." + wa[0];
			}
		}
		if (wa[0] == 'np') {
			if (['aero', 'asia', 'biz', 'com', 'coop', 'edu', 'gov', 'info', 'jobs', 'mil', 'mobi', 'museum', 'name', 'net', 'org', 'pro', 'travel'].includes(wa[1])) {
				return wa[2] + "." + wa[1] + "." + wa[0];
			}
		}
		if (wa[0] == 'nr') {
			if (['biz', 'com', 'edu', 'gov', 'info', 'net', 'org'].includes(wa[1])) {
				return wa[2] + "." + wa[1] + "." + wa[0];
			}
		}
		if (wa[0] == 'nz') {
			if (['ac', 'co', 'cri', 'geek', 'gen', 'govt', 'health', 'iwi', 'maori', 'mil', 'net', 'org', 'parliament', 'school'].includes(wa[1])) {
				return wa[2] + "." + wa[1] + "." + wa[0];
			}
		}
		if (wa[0] == 'om') {
			if (['co', 'com', 'edu', 'gov', 'med', 'museum', 'net', 'org', 'pro'].includes(wa[1])) {
				return wa[2] + "." + wa[1] + "." + wa[0];
			}
		}
		if (wa[0] == 'pa') {
			if (['abo', 'ac', 'com', 'edu', 'gob', 'ing', 'med', 'net', 'nom', 'org', 'sld'].includes(wa[1])) {
				return wa[2] + "." + wa[1] + "." + wa[0];
			}
		}
		if (wa[0] == 'pe') {
			if (['com', 'edu', 'gob', 'mil', 'net', 'nom', 'org', 'sld'].includes(wa[1])) {
				return wa[2] + "." + wa[1] + "." + wa[0];
			}
		}
		if (wa[0] == 'pg') {
			if (['com', 'net', 'ac', 'gov', 'mil', 'org'].includes(wa[1])) {
				return wa[2] + "." + wa[1] + "." + wa[0];
			}
		}
		if (wa[0] == 'ph') {
			if (['com', 'edu', 'gov', 'mil', 'net', 'org'].includes(wa[1])) {
				return wa[2] + "." + wa[1] + "." + wa[0];
			}
		}
		if (wa[0] == 'pk') {
			if (['biz', 'com', 'edu', 'fam', 'gob', 'gok', 'gon', 'gop', 'gos', 'gov', 'net', 'org', 'web'].includes(wa[1])) {
				return wa[2] + "." + wa[1] + "." + wa[0];
			}
		}
		if (wa[0] == 'pl') {
			if (['art', 'bialystok', 'biz', 'com', 'edu', 'gda', 'gdansk', 'gov', 'info', 'katowice', 'krakow', 'lodz', 'lublin', 'mil', 'net', 'ngo', 'olsztyn', 'org', 'poznan', 'radom', 'slupsk', 'szczecin', 'torun', 'warszawa', 'waw', 'wroc', 'wroclaw', 'zgora'].includes(wa[1])) {
				return wa[2] + "." + wa[1] + "." + wa[0];
			}
		}
		if (wa[0] == 'pn') {
			if (['in', 'co', 'eu', 'org', 'net', 'me'].includes(wa[1])) {
				return wa[2] + "." + wa[1] + "." + wa[0];
			}
		}
		if (wa[0] == 'pr') {
			if (['ac', 'biz', 'com', 'edu', 'est', 'gov', 'info', 'isla', 'name', 'net', 'org', 'pro', 'prof'].includes(wa[1])) {
				return wa[2] + "." + wa[1] + "." + wa[0];
			}
		}
		if (wa[0] == 'pt') {
			if (['com', 'edu', 'gov', 'int', 'net', 'nome', 'org', 'publ'].includes(wa[1])) {
				return wa[2] + "." + wa[1] + "." + wa[0];
			}
		}
		if (wa[0] == 'py') {
			if (['com', 'coop', 'edu', 'mil', 'gov', 'org', 'net', 'una'].includes(wa[1])) {
				return wa[2] + "." + wa[1] + "." + wa[0];
			}
		}
		if (wa[0] == 'qa') {
			if (['com', 'edu', 'sch', 'gov', 'mil', 'net', 'org'].includes(wa[1])) {
				return wa[2] + "." + wa[1] + "." + wa[0];
			}
		}
		if (wa[0] == 'ru') {
			if (['ac', 'adygeya', 'altai', 'amur', 'amursk', 'arkhangelsk', 'astrakhan', 'baikal', 'bashkiria', 'belgorod', 'bir', 'bryansk', 'buryatia', 'cap', 'cbg', 'chel', 'chelyabinsk', 'chita', 'chukotka', 'cmw', 'com', 'dagestan', 'e-burg', 'edu', 'fareast', 'gov', 'grozny', 'int', 'irkutsk', 'ivanovo', 'izhevsk', 'jamal', 'jar', 'joshkar-ola', 'k-uralsk', 'kalmykia', 'kaluga', 'kamchatka', 'karelia', 'kazan', 'kchr', 'kemerovo', 'khabarovsk', 'khakassia', 'khv', 'kirov', 'kms', 'koenig', 'komi', 'kostroma', 'krasnoyarsk', 'kuban', 'kurgan', 'kursk', 'kustanai', 'kuzbass', 'lipetsk', 'magadan', 'magnitka', 'mari', 'mari-el', 'marine', 'mil', 'mordovia', 'mos', 'mosreg', 'msk', 'murmansk', 'mytis', 'nakhodka', 'nalchik', 'net', 'nkz', 'nnov', 'norilsk', 'nov', 'novosibirsk', 'nsk', 'omsk', 'orenburg', 'org', 'oryol', 'oskol', 'palana', 'penza', 'perm', 'pp', 'pskov', 'ptz', 'pyatigorsk', 'rnd', 'rubtsovsk', 'ryazan', 'sakhalin', 'samara', 'saratov', 'simbirsk', 'smolensk', 'snz', 'spb', 'stavropol', 'stv', 'surgut', 'syzran', 'tambov', 'tatarstan', 'test', 'tlt', 'tom', 'tomsk', 'tsaritsyn', 'tsk', 'tula', 'tuva', 'tver', 'tyumen', 'udm', 'udmurtia', 'ulan-ude', 'vdonsk', 'vladikavkaz', 'vladimir', 'vladivostok', 'volgograd', 'vologda', 'voronezh', 'vrn', 'vyatka', 'yakutia', 'yamal', 'yaroslavl', 'yekaterinburg', 'yuzhno-sakhalinsk', 'zgrad'].includes(wa[1])) {
				return wa[2] + "." + wa[1] + "." + wa[0];
			}
		}
		if (wa[0] == 'sa') {
			if (['com', 'edu', 'gov', 'med', 'net', 'org', 'pub', 'sch'].includes(wa[1])) {
				return wa[2] + "." + wa[1] + "." + wa[0];
			}
		}
		if (wa[0] == 'se') {
			if (['a', 'ac', 'b', 'bd', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'k', 'l', 'm', 'n', 'o', 'org', 'p', 'parti', 'pp', 'press', 'r', 's', 't', 'tm', 'u', 'w', 'x', 'y', 'z'].includes(wa[1])) {
				return wa[2] + "." + wa[1] + "." + wa[0];
			}
		}
		if (wa[0] == 'sg') {
			if (['com', 'edu', 'gov', 'idn', 'net', 'org', 'per'].includes(wa[1])) {
				return wa[2] + "." + wa[1] + "." + wa[0];
			}
		}
		if (wa[0] == 'sv') {
			if (['edu', 'gov', 'com', 'org', 'red'].includes(wa[1])) {
				return wa[2] + "." + wa[1] + "." + wa[0];
			}
		}
		if (wa[0] == 'th') {
			if (['ac', 'co', 'go', 'in', 'mi', 'net', 'or'].includes(wa[1])) {
				return wa[2] + "." + wa[1] + "." + wa[0];
			}
		}
		if (wa[0] == 'tj') {
			if (['ac', 'aero', 'biz', 'co', 'com', 'coop', 'dyn', 'edu', 'go', 'gov', 'info', 'int', 'mil', 'museum', 'my', 'name', 'net', 'nic', 'org', 'per', 'pro', 'test', 'web'].includes(wa[1])) {
				return wa[2] + "." + wa[1] + "." + wa[0];
			}
		}
		if (wa[0] == 'tn') {
			if (['agrinet', 'com', 'defense', 'edunet', 'ens', 'fin', 'gov', 'ind', 'info', 'intl', 'mincom', 'nat', 'net', 'org', 'perso', 'rnrt', 'rns', 'rnu', 'tourism'].includes(wa[1])) {
				return wa[2] + "." + wa[1] + "." + wa[0];
			}
		}
		if (wa[0] == 'tr') {
			if (['av', 'bbs', 'bel', 'biz', 'com', 'dr', 'edu', 'gen', 'gov', 'info', 'k12', 'mil', 'name', 'nc', 'net', 'org', 'pol', 'tel', 'tv', 'web'].includes(wa[1])) {
				return wa[2] + "." + wa[1] + "." + wa[0];
			}
		}
		if (wa[0] == 'tw') {
			if (['club', 'com', 'ebiz', 'edu', 'game', 'gov', 'idv', 'mil', 'net', 'org'].includes(wa[1])) {
				return wa[2] + "." + wa[1] + "." + wa[0];
			}
		}
		if (wa[0] == 'tz') {
			if (['co', 'ac', 'go', 'or', 'mil', 'sc', 'ne', 'hotel', 'mobi', 'tv', 'info', 'me'].includes(wa[1])) {
				return wa[2] + "." + wa[1] + "." + wa[0];
			}
		}
		if (wa[0] == 'ua') {
			if (['at', 'cherkassy', 'chernigov', 'chernovtsy', 'ck', 'cn', 'co', 'com', 'crimea', 'cv', 'dn', 'dnepropetrovsk', 'donetsk', 'dp', 'edu', 'gov', 'if', 'in', 'ivano-frankivsk', 'kh', 'kharkov', 'kherson', 'khmelnitskiy', 'kiev', 'kirovograd', 'km', 'kr', 'ks', 'lg', 'lt', 'lugansk', 'lutsk', 'lviv', 'mk', 'net', 'nikolaev', 'od', 'odessa', 'org', 'pl', 'poltava', 'pp', 'rovno', 'rv', 'sebastopol', 'sumy', 'te', 'ternopil', 'uz', 'uzhgorod', 'vinnica', 'vn', 'yalta', 'zaporizhzhe', 'zhitomir', 'zp', 'zt'].includes(wa[1])) {
				return wa[2] + "." + wa[1] + "." + wa[0];
			}
		}
		if (wa[0] == 'ug') {
			if (['co', 'ac', 'sc', 'go', 'ne', 'or'].includes(wa[1])) {
				return wa[2] + "." + wa[1] + "." + wa[0];
			}
		}
		if (wa[0] == 'uk') {
			if (['ac', 'bl', 'british-library', 'co', 'gov', 'jcpc', 'jet', 'judiciary', 'ltd', 'me', 'mod', 'net', 'nhs', 'nic', 'nls', 'org', 'parliament', 'plc', 'police', 'sch', 'supremecourt'].includes(wa[1])) {
				return wa[2] + "." + wa[1] + "." + wa[0];
			}
		}
		if (wa[0] == 'uy') {
			if (['com', 'edu', 'gub', 'net', 'mil', 'org'].includes(wa[1])) {
				return wa[2] + "." + wa[1] + "." + wa[0];
			}
		}
		if (wa[0] == 'uz') {
			if (['co', 'com', 'org'].includes(wa[1])) {
				return wa[2] + "." + wa[1] + "." + wa[0];
			}
		}
		if (wa[0] == 've') {
			if (['arts', 'co', 'com', 'edu', 'gob', 'gov', 'info', 'int', 'mil', 'net', 'org', 'radio', 'tec', 'web'].includes(wa[1])) {
				return wa[2] + "." + wa[1] + "." + wa[0];
			}
		}
		if (wa[0] == 'vi') {
			if (['co', 'org', 'com', 'net', 'k12'].includes(wa[1])) {
				return wa[2] + "." + wa[1] + "." + wa[0];
			}
		}
		if (wa[0] == 'vn') {
			if (['ac', 'biz', 'com', 'edu', 'gov', 'health', 'info', 'int', 'mil', 'name', 'net', 'org', 'pro'].includes(wa[1])) {
				return wa[2] + "." + wa[1] + "." + wa[0];
			}
		}
		if (wa[0] == 'ws') {
			if (['org', 'gov', 'edu', 'com'].includes(wa[1])) {
				return wa[2] + "." + wa[1] + "." + wa[0];
			}
		}
		if (wa[0] == 'za') {
			if (['ac', 'agric', 'alt', 'bourse', 'city', 'co', 'cybernet', 'db', 'edu', 'gov', 'grondar', 'iaccess', 'imt', 'inca', 'landesign', 'law', 'mil', 'ngo', 'nis', 'nom', 'olivetti', 'org', 'pix', 'school', 'tm', 'web'].includes(wa[1])) {
				return wa[2] + "." + wa[1] + "." + wa[0];
			}
		}
		if (wa[0] == 'zm') {
			if (['ac', 'co', 'com', 'edu', 'gov', 'net', 'org', 'sch'].includes(wa[1])) {
				return wa[2] + "." + wa[1] + "." + wa[0];
			}
		}
		if (wa[0] == 'zw') {
			if (['co', 'ac', 'org'].includes(wa[1])) {
				return wa[2] + "." + wa[1] + "." + wa[0];
			}
		}
		if (wa_l == 4) {
			if (/^([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})$/.test(w)) {
				return w;
			}
		}
	}
	return wa[1] + "." + wa[0];
}

function ipv4_to_num(ip) {
	var a = ip.split('.');
	if (a.length != 4) {
		return 0;
	};
	return parseInt(a[0]) * 16777216 + parseInt(a[1]) * 65536 + parseInt(a[2]) * 256 + parseInt(a[3]);
}

function get_geo_cc(ip) {
	if (ip.startsWith('[')) {
			return '--';
	}
		if (!tprq_geo4_loaded) {
			return '--';
		}
		var inum = ipv4_to_num(ip);
		if (inum < 1 || inum >= 4294967295) {
			return '--';
		}
		var fg_prev = 0;
		for (var fg in tprq_db_geo4) {
			if (fg >= inum) {
				if (fg == inum) {
					if (fg <= inum && inum <= tprq_db_geo4[fg][0]) {
						return tprq_db_geo4[fg][1];
					} else {
						return '--';
					}
				} else {
					if (fg_prev <= inum && inum <= tprq_db_geo4[fg_prev][0]) {
						return tprq_db_geo4[fg_prev][1];
					} else {
						return '--';
					}
				}
				break;
			}
			fg_prev = fg;
		}
	return '--';
}

function is_js_allowed(w, p) { //(0ng) (1tmpok) (2all|3tls)
	if (tprq_jsak_wud == 1) {
		if (/^(asset|assets(|([0-9]{1,2}))|cdn|content(|s|s-cache)|js(|c|([0-9]{1,2}))|scr|script|scripts|static(|([0-9]{1,2})|-files|-files([0-9]{1,2}))|([a-z0-9]{1,20})-cdn|([a-z0-9]{1,20})\.cdn|cdn-([a-z0-9]{1,20}))\.(.*)$/.test(w)) {
			if (tprq_jsakreqhs == 0) {
				return 2;
			} else {
				if (p == 'https:') {
					return 3;
				}
			}
		}
	}
	if (tprq_jsak_cdnf == 1) {
		if (['stackpath.bootstrapcdn.com', 'maxcdn.bootstrapcdn.com', 'netdna.bootstrapcdn.com', 'ajax.aspnetcdn.com', 'ajax.googleapis.com', 'cdn.jsdelivr.net', 'cdnjs.cloudflare.com', 'code.jquery.com', 'lib.sinaapp.com', 'libs.baidu.com', 'u.jimcdn.com', 'upcdn.b0.upaiyun.com', 'yandex.st', 'yastatic.net', 'oss.maxcdn.com', 'cdn.shopify.com', 'js.stripe.com', 'cdn.bootcss.com'].includes(w)) {
			if (tprq_jsakreqhs == 0) {
				return 2;
			} else {
				if (p == 'https:') {
					return 3;
				}
			}
		}
	}
	if (tprq_jsak_cdnd == 1) {
		if (/^([a-z0-9-\.]{3,80})\.(akamaihd\.net|akamaized\.net|cloudfront\.net|vo\.msecnd\.net|core\.windows\.net|servicebus\.windows\.net|s3\.amazonaws\.com|ssl\.fastly\.net|storage\.googleapis\.com|netdna-cdn\.com|netdna-ssl\.com|idcfcloud\.com|azureedge\.net|rawgit\.com|cdn\.softlayer\.net|stream\.ne\.jp|geekzu\.org)$/.test(w)) {
			if (tprq_jsakreqhs == 0) {
				return 2;
			} else {
				if (p == 'https:') {
					return 3;
				}
			}
		}
	}
	if (tprq_oklist_js.includes('!' + w)) {
		if (p == 'https:') {
			return 3;
		} else {
			return 0;
		}
	} // !F
	if (tprq_oklist_js.includes(w)) {
		return 2;
	} // F
	if (tprq_tmpok_js.includes(w)) {
		return 1;
	} // F temp
	var wb = get_realdomain(w);
	if (tprq_oklist_js.includes('!.' + wb)) {
		if (p == 'https:') {
			return 3;
		} else {
			return 0;
		}
	} // !.D
	if (tprq_oklist_js.includes('.' + wb)) {
		return 2;
	} // .D
	return 0;
}

function add_js_history(w) {
	if (tprq_history_js.length > 300) {
		tprq_history_js.shift();
		tprq_history_js.shift();
	}
	if (!tprq_history_js.includes(w)) {
		tprq_history_js.push(w);
	}
}

function is_3p_allowed(s, d) { //[used by main]
	var s_base = '.' + get_realdomain(s);
	var d_base = '.' + get_realdomain(d);
	if (tprq_allowsubdom == 1) {
		if (s_base == d_base) {
			return [true, true];
		}
	}
	if (tprq_allowwidedm == 1) {
		if (/^(asset|assets(|([0-9]{1,2}))|cdn|content(|s|s-cache)|thumbs(|([0-9]{1,2}))|media|mediaproxy|video|vid|img|image|images|static(|([0-9]{1,2})|-files|-files([0-9]{1,2}))|([a-z0-9]{1,10})-(imgs|images)-([a-z0-9]{1,10})|([a-z0-9]{1,20})-images|([a-z0-9]{1,20})-cdn|([a-z0-9]{1,20})\.cdn|cdn-([a-z0-9]{1,20}))\.(.*)$/.test(d)) {
			return [true, true];
		}
	}
	if (tprq_allowcdnf == 1) {
		if (['stackpath.bootstrapcdn.com', 'maxcdn.bootstrapcdn.com', 'netdna.bootstrapcdn.com', 'ajax.aspnetcdn.com', 'ajax.googleapis.com', 'cdn.jsdelivr.net', 'cdnjs.cloudflare.com', 'code.jquery.com', 'i.imgur.com', 'i.redditmedia.com', 'i.ytimg.com', 'image.jimcdn.com', 'lib.sinaapp.com', 'libs.baidu.com', 'u.jimcdn.com', 'upcdn.b0.upaiyun.com', 'us.v-cdn.net', 'images.v-cdn.net', 'yandex.st', 'yastatic.net', 'oss.maxcdn.com', 'i.gyazo.com', 'cdn.discordapp.com', 'img.youtube.com', 'cdn.shopify.com', 'js.stripe.com', 'cdn.bootcss.com'].includes(d)) {
			return [true, true];
		}
	}
	if (tprq_allowcdnd == 1) {
		if (/^([a-z0-9-\.]{3,80})\.(akamaihd\.net|akamaized\.net|cloudfront\.net|vo\.msecnd\.net|core\.windows\.net|servicebus\.windows\.net|s3\.amazonaws\.com|ssl\.fastly\.net|storage\.googleapis\.com|netdna-cdn\.com|netdna-ssl\.com|idcfcloud\.com|azureedge\.net|rawgit\.com|cdn\.softlayer\.net|stream\.ne\.jp|geekzu\.org)$/.test(d)) {
			return [true, true];
		}
	}
	if (tprq_alloweytb == 1) {
		if (/^((.*)\.gstatic|(.*)\.googlevideo|(i|s)\.ytimg|(.*)\.youtube|(.*)\.youtube-nocookie)\.com$/.test(d)) {
			return [true, true];
		}
	}
	if (tprq_whitelist['*'] != undefined) {
		if (tprq_whitelist['*'].includes(d)) {
			return [true, true];
		} // *|F
		if (tprq_whitelist['*'].includes(d_base)) {
			return [true, true];
		} // *|.D
		if (tprq_fmtdstrxp == 1) {
			for (var i = 0; i < tprq_whitelist['*'].length; i++) {
				if (tprq_whitelist['*'][i].startsWith('/')) {
					if ((new RegExp(tprq_whitelist['*'][i].replace(/^\//g, ''))).test(d)) {
						return [true, true];
					}
				}
			}
		}
	}
	if (tprq_whitelist[s] != undefined) {
		if (tprq_whitelist[s].includes(d)) {
			return [true, true];
		} // F|F
		if (tprq_whitelist[s].includes('*')) {
			return [true, true];
		} // F|*
		if (tprq_whitelist[s].includes(d_base)) {
			return [true, true];
		} // F|.D
		if (tprq_fmtdstrxp == 1) {
			for (var i = 0; i < tprq_whitelist[s].length; i++) {
				if (tprq_whitelist[s][i].startsWith('/')) {
					if ((new RegExp(tprq_whitelist[s][i].replace(/^\//g, ''))).test(d)) {
						return [true, true];
					}
				}
			}
		}
	}
	if (tprq_whitelist[s_base] != undefined) {
		if (tprq_whitelist[s_base].includes(d)) {
			return [true, true];
		} // .D|F
		if (tprq_whitelist[s_base].includes('*')) {
			return [true, true];
		} // .D|*
		if (tprq_whitelist[s_base].includes(d_base)) {
			return [true, true];
		} // .D|.D
		if (tprq_fmtdstrxp == 1) {
			for (var i = 0; i < tprq_whitelist[s_base].length; i++) {
				if (tprq_whitelist[s_base][i].startsWith('/')) {
					if ((new RegExp(tprq_whitelist[s_base][i].replace(/^\//g, ''))).test(d)) {
						return [true, true];
					}
				}
			}
		}
	}
	if (tprq_whitetemp[s] != undefined) {
		if (tprq_whitetemp[s].includes(d)) {
			return [true, false];
		}
	} //temporary
	return [false, true];
}

function update_pair_data(_a, _d, _f, _p) {
	var aB = _a;
	var iFound = 0;
	for (var p = 0; p < aB.length; p++) {
		if (aB[p][0] == _d) {
			aB[p][1] = _f;
			aB[p][2] = _p;
			iFound = 1;
			break;
		}
	}
	if (iFound == 0) {
		aB.push([_d, _f, true]);
	} //Dst, Allowed, WriteAllowed
	return aB;
}

function get_3p_rela_level(id, h) {
	if (tprq_tab_dst[id] != undefined) {
		if (tprq_tab_dst[id][h] != undefined) {
			var _tda = tprq_tab_dst[id][h];
			var _tdl = _tda.length;
			if (_tdl > 0) { //has TP
				if (tprq_whitelist[h] != undefined) {
					if (tprq_whitelist[h].includes('*')) {
						return [0, tprq_flags[1]];
					}
				} // FQDN *
				var h_base = '.' + get_realdomain(h);
				if (tprq_whitelist[h_base] != undefined) {
					if (tprq_whitelist[h_base].includes('*')) {
						return [0, tprq_flags[1]];
					}
				} // .DOMAIN *
				var _tac = _tdl;
				for (var n = 0; n < _tdl; n++) {
					if (_tda[n][1]) {
						_tac -= 1;
					}
				}
				if (_tac != _tdl) {
					return [_tac, tprq_flags[1]];
				} else {
					return [_tdl, tprq_flags[2]];
				}
			}
		}
	}
	return [0, tprq_flags[0]];
}

function is_mitm_host(x) {
	if (/^((.*)\.|)(cloudflare\.com|incapsula\.com|withgoogle\.com|google\.com|sucuri\.net)$/.test(x)) {
		return false;
	}
	if (tprq_mitmoklist.includes(x)) {
		return false;
	}
	if (tprq_mitmoklist.includes('.' + get_realdomain(x))) {
		return false;
	}
	return true;
}

function get_decrtd(w, d, i) { //sub,dom,1
	if (w == d) {
		return w;
	}
	var t_w = w.split("").reverse().join("");
	var t_d = d.split("").reverse().join("");
	if (i == 1) {
		return t_w.replace(t_d + ".", ">u/<" + t_d + ">u<.").split("").reverse().join("");
	}
	return t_w.replace(t_d + ".", ">b/<" + t_d + ">b<.").split("").reverse().join("");
}

function getpopline_js(_jslv, _fqdn, _label) {
	var tmpchk_blk, tmpchk_mix, tmpval_mix, tmpchk_alw, tmpval_alw, tmpchk_https, tmpval_https, _res;
	if (_jslv == 0) {
		tmpchk_blk = ' checked';
		tmpchk_mix = '';
		tmpval_mix = 0;
		tmpchk_alw = '';
		tmpval_alw = 0;
		tmpchk_https = '';
		tmpval_https = 0;
	}
	if (_jslv == 1) {
		tmpchk_blk = '';
		tmpchk_mix = ' checked';
		tmpval_mix = 1;
		tmpchk_alw = '';
		tmpval_alw = 0;
		tmpchk_https = '';
		tmpval_https = 0;
	}
	if (_jslv == 2) {
		tmpchk_blk = '';
		tmpchk_mix = '';
		tmpval_mix = 0;
		tmpchk_alw = ' checked';
		tmpval_alw = 1;
		tmpchk_https = '';
		tmpval_https = 0;
	}
	if (_jslv == 3) {
		tmpchk_blk = '';
		tmpchk_mix = '';
		tmpval_mix = 0;
		tmpchk_alw = ' checked';
		tmpval_alw = 1;
		tmpchk_https = ' checked';
		tmpval_https = 1;
	}
	if (tprq_popstyle != 2) {
		_res = "<tr><td><input name=\"js_" + _fqdn + "\" type=\"radio\" value=\"x\"" + tmpchk_blk + "><input name=\"js_" + _fqdn + "\" data-usvxt=\"" + tmpval_mix + "\" type=\"radio\" data-wild=1 value=\"b\"" + tmpchk_mix + "><input name=\"js_" + _fqdn + "\" id=\"jsf_" + _fqdn + "\" data-usv=\"" + tmpval_alw + "\" type=\"radio\" value=\"c\"" + tmpchk_alw + ">";
		if (tprq_pophtps_js == 1) {
			_res += "<input id=\"htps_js_" + _fqdn + "\" type=\"checkbox\" data-prev=\"" + tmpval_https + "\" data-wild=1 " + tmpchk_https + ">";
		}
		_res += " <label for=\"jsf_" + _fqdn + "\" title=\"" + _fqdn + "\">" + _label + "</label></td></tr>";
	} else {
		_res = "<tr><td><span class=\"switch-toggle switch-3 switch-candy\"><input id=\"tjs1_" + _fqdn + "\" name=\"js_" + _fqdn + "\" type=\"radio\" value=\"x\"" + tmpchk_blk + "><label for=\"tjs1_" + _fqdn + "\" class=\"ignr\">00</label><input id=\"tjs2_" + _fqdn + "\" name=\"js_" + _fqdn + "\" type=\"radio\" value=\"b\" data-usvxt=\"" + tmpval_mix + "\" data-wild=1" + tmpchk_mix + "><label for=\"tjs2_" + _fqdn + "\" class=\"ignr\">00</label><input id=\"jsf_" + _fqdn + "\" name=\"js_" + _fqdn + "\" type=\"radio\" value=\"c\" data-usv=\"" + tmpval_alw + "\"" + tmpchk_alw + "><label for=\"jsf_" + _fqdn + "\" class=\"ignr\">00</label><a></a></span>";
		if (tprq_pophtps_js == 1) {
			_res += "<span class=\"switch-toggle switch-1 switch-candy\"><input id=\"htps_js_" + _fqdn + "\" type=\"checkbox\" data-prev=\"" + tmpval_https + "\" data-wild=1 " + tmpchk_https + "><label for=\"htps_js_" + _fqdn + "\" class=\"ignr\">00</label><a></a></span>";
		}
		_res += "&nbsp;<span title=\"" + _fqdn + "\">" + _label + "</span></td></tr>";
	}
	return _res;
}

function getpop_extra(w, t) {
	if (t == 1) {
		if (tprq_popshowcc == 1 && tprq_popshowsubs == 1) {
			if (tprq_dnspair[w]) {
				return "<small>[" + tprq_dnspair[w][1] + "]&nbsp;</small>";
			} else {
				return "<small>[--]&nbsp;</small>";
			}
		} else {
			return '';
		}
	}
	if (t == 2) {
		if (tprq_popshowip == 1 && tprq_popshowsubs == 1) {
			if (tprq_dnspair[w]) {
				return w + ' (' + tprq_dnspair[w][0] + ')';
			} else {
				return w + ' (' + tprq_mylang['unknown'] + ')';
			}
		} else {
			return w;
		}
	}
}

function tprq_make_popup(xid, xhost, xprot) {
	var xdomain = '';
	var xdotdom = '/';
	var xlabel = 'TPRB';
	var xicon = [];
	var _res_sd = '';
	var _tmpSDck1 = [];
	var _tmpSDck0 = [];
	var _res_etc = '';
	var txx_line = '';
	var _tmpETck1 = [];
	var _tmpETck0 = [];
	var _res_js = '';
	var _tmpJSck1 = [];
	var _tmpJSck0 = [];
	var tmp_x_chk = '';
	var tmp_t_chk = '';
	var tmp_a_chk = '';
	var tmp_t_val = 0;
	var tmp_a_val = 0;
	var tmp_3pdom;
	var _tmpJSlv;
	var _dombasket = [];
	var _res = '<table border="0" cellspacing="1" cellpadding="1">';
	if (xhost.length >= 2 && (xprot == 'http:' || xprot == 'https:')) {
		xdomain = get_realdomain(xhost);
		xdotdom = '.' + xdomain;
		if (xdomain.endsWith('.onion')) {
			xlabel = 'Tor Onion Service';
		} else {
			xlabel = get_decrtd(xhost, xdomain, 0);
			if (xlabel.length >= ((tprq_popshowip == 1) ? 38 : 50)) {
				if (xdomain != xhost) {
					xlabel = '~.<b>' + xdomain + '</b>';
				}
			}
			if (!is_ip_addr(xhost)) {
				if (tprq_popshowcc == 1) {
					if (tprq_dnspair[xhost]) {
						xlabel += '<small>&nbsp;[' + tprq_dnspair[xhost][1] + ']</small>';
					} else {
						xlabel += '<small>&nbsp;[--]</small>';
					}
				}
				if (tprq_popshowip == 1) {
					if (tprq_dnspair[xhost]) {
						xlabel += '<small>&nbsp;(<i>' + tprq_dnspair[xhost][0] + '</i>)</small>';
					} else {
						xlabel += '<small>&nbsp;(' + tprq_mylang['unknown'] + ')</small>';
					}
				}
			}
		}
		if (tprq_showicon == 1) {
			if (!is_ip_addr(xhost)) {
				xicon = tprq_myuis;
			}
		}
	}
	if (tprq_tab_dst[xid] == undefined) {
		tprq_tab_dst[xid] = [];
	}
	if ((tprq_poponoff == 1) ? tprq_poponoff_ison : true) {
		if (tprq_tab_dst[xid] != undefined && xdomain != '') {
			var _label_js = (tprq_pophtps_js == 1) ? '<span data-what="dlg_bmas"></span> <i>JS</i>' : '<span data-what="dlg_bma"></span> <i>JS</i>';
			if (tprq_jsfilter == 1) {
				var _xjs = is_js_allowed(xhost, 'https:');
				if (_xjs > 0 && !tprq_history_js.includes(xhost)) {
					add_js_history(xhost);
				}
				if (tprq_history_js.includes(xhost)) {
					_res_js = getpopline_js(_xjs, xhost, '<u><span data-what="dtthisfqdn"></span></u>');
				}
			}
			var txx = (tprq_tab_dst[xid][xhost] != undefined) ? tprq_tab_dst[xid][xhost] : [];
			if (txx.length > 0) {
				if (tprq_showtemp != 1) {
					for (var m in txx) {
						if (txx[m][1]) {
							tmp_a_chk = ' checked';
							tmp_a_val = 1;
						} else {
							tmp_a_chk = '';
							tmp_a_val = 0;
						}
						if (txx[m][0].endsWith(xdotdom)) {
							if (tprq_showdotf == 1) {
								if (!_dombasket.includes(xdomain)) {
									_dombasket.push(xdomain);
								}
							}
							txx_line = (tprq_popstyle == 2) ? "<tr><td><span class=\"switch-toggle switch-1 switch-candy\"><input id=\"idf_" + txx[m][0] + "\" name=\"f_" + txx[m][0] + "\" data-usv=\"" + tmp_a_val + "\" type=\"checkbox\"" + tmp_a_chk + "><label for=\"idf_" + txx[m][0] + "\" class=\"ignr\">00</label><a></a></span>&nbsp;<span title=\"" + getpop_extra(txx[m][0], 2) + "\">" + getpop_extra(txx[m][0], 1) + get_decrtd(txx[m][0], xdomain, 1) + "</span></td></tr>" : "<tr><td><input id=\"idf_" + txx[m][0] + "\" name=\"f_" + txx[m][0] + "\" data-usv=\"" + tmp_a_val + "\" type=\"checkbox\"" + tmp_a_chk + "> <label for=\"idf_" + txx[m][0] + "\" title=\"" + getpop_extra(txx[m][0], 2) + "\">" + getpop_extra(txx[m][0], 1) + get_decrtd(txx[m][0], xdomain, 1) + "</label></td></tr>";
							if (tmp_a_val == 0) {
								_tmpSDck0.push([txx[m][0], txx_line]);
							} else {
								_tmpSDck1.push([txx[m][0], txx_line]);
							}
							if (tprq_jsfilter == 1 && txx[m][1]) {
								if (tprq_history_js.includes(txx[m][0])) {
									_tmpJSlv = is_js_allowed(txx[m][0], 'https:');
									if (_tmpJSlv == 0) {
										_tmpJSck0.push([txx[m][0], getpopline_js(_tmpJSlv, txx[m][0], get_decrtd(txx[m][0], xdomain, 1))]);
									} else {
										_tmpJSck1.push([txx[m][0], getpopline_js(_tmpJSlv, txx[m][0], get_decrtd(txx[m][0], xdomain, 1))]);
									}
								}
							}
						} else {
							if (tprq_showdotf == 1) {
								tmp_3pdom = get_realdomain(txx[m][0]);
								if (!_dombasket.includes(tmp_3pdom)) {
									_dombasket.push(tmp_3pdom);
								}
							}
							txx_line = (tprq_popstyle == 2) ? "<tr><td><span class=\"switch-toggle switch-1 switch-candy\"><input id=\"idf_" + txx[m][0] + "\" name=\"f_" + txx[m][0] + "\" data-usv=\"" + tmp_a_val + "\" type=\"checkbox\"" + tmp_a_chk + "><label for=\"idf_" + txx[m][0] + "\" class=\"ignr\">00</label><a></a></span>&nbsp;<span title=\"" + getpop_extra(txx[m][0], 2) + "\">" + getpop_extra(txx[m][0], 1) + txx[m][0] + "</span></td></tr>" : "<tr><td><input id=\"idf_" + txx[m][0] + "\" name=\"f_" + txx[m][0] + "\" data-usv=\"" + tmp_a_val + "\" type=\"checkbox\"" + tmp_a_chk + "> <label for=\"idf_" + txx[m][0] + "\" title=\"" + getpop_extra(txx[m][0], 2) + "\">" + getpop_extra(txx[m][0], 1) + txx[m][0] + "</label></td></tr>";
							if (tmp_a_val == 0) {
								_tmpETck0.push([txx[m][0], txx_line]);
							} else {
								_tmpETck1.push([txx[m][0], txx_line]);
							}
							if (tprq_jsfilter == 1 && txx[m][1]) {
								if (tprq_history_js.includes(txx[m][0])) {
									_tmpJSlv = is_js_allowed(txx[m][0], 'https:');
									if (_tmpJSlv == 0) {
										_tmpJSck0.push([txx[m][0], getpopline_js(_tmpJSlv, txx[m][0], txx[m][0])]);
									} else {
										_tmpJSck1.push([txx[m][0], getpopline_js(_tmpJSlv, txx[m][0], txx[m][0])]);
									}
								}
							}
						}
					}
				} else {
					_res_sd = "<tr><td><span class=\"minortxt\"><small><span data-what=\"dlg_bma\"></span></small></span></td></tr>";
					for (var m in txx) {
						if (txx[m][1]) {
							if (txx[m][2]) {
								tmp_x_chk = '';
								tmp_a_chk = ' checked';
								tmp_a_val = 1;
								tmp_t_chk = '';
								tmp_t_val = 0;
							} else {
								tmp_x_chk = '';
								tmp_a_chk = '';
								tmp_a_val = 0;
								tmp_t_chk = ' checked';
								tmp_t_val = 1;
							}
						} else {
							tmp_x_chk = ' checked';
							tmp_a_chk = '';
							tmp_a_val = 0;
							tmp_t_chk = '';
							tmp_t_val = 0;
						}
						if (txx[m][0].endsWith(xdotdom)) {
							if (tprq_showdotf == 1) {
								if (!_dombasket.includes(xdomain)) {
									_dombasket.push(xdomain);
								}
							}
							txx_line = (tprq_popstyle == 2) ? "<tr><td><span class=\"switch-toggle switch-3 switch-candy\"><input id=\"txf1_" + txx[m][0] + "\" name=\"f_" + txx[m][0] + "\" type=\"radio\" value=\"x\"" + tmp_x_chk + "><label for=\"txf1_" + txx[m][0] + "\" class=\"ignr\">00</label><input id=\"txf2_" + txx[m][0] + "\" name=\"f_" + txx[m][0] + "\" data-usvxt=\"" + tmp_t_val + "\" type=\"radio\" value=\"b\"" + tmp_t_chk + "><label for=\"txf2_" + txx[m][0] + "\" class=\"ignr\">00</label><input id=\"idf_" + txx[m][0] + "\" name=\"f_" + txx[m][0] + "\" data-usv=\"" + tmp_a_val + "\" type=\"radio\" value=\"c\"" + tmp_a_chk + "><label for=\"idf_" + txx[m][0] + "\" class=\"ignr\">00</label><a></a></span>&nbsp;<span title=\"" + getpop_extra(txx[m][0], 2) + "\">" + getpop_extra(txx[m][0], 1) + get_decrtd(txx[m][0], xdomain, 1) + "</span></td></tr>" : "<tr><td><input name=\"f_" + txx[m][0] + "\" type=\"radio\" value=\"x\"" + tmp_x_chk + "><input name=\"f_" + txx[m][0] + "\" data-usvxt=\"" + tmp_t_val + "\" type=\"radio\" value=\"b\"" + tmp_t_chk + "><input id=\"idf_" + txx[m][0] + "\" name=\"f_" + txx[m][0] + "\" data-usv=\"" + tmp_a_val + "\" type=\"radio\" value=\"c\"" + tmp_a_chk + "> <label for=\"idf_" + txx[m][0] + "\" title=\"" + getpop_extra(txx[m][0], 2) + "\">" + getpop_extra(txx[m][0], 1) + get_decrtd(txx[m][0], xdomain, 1) + "</label></td></tr>";
							if (tmp_a_val == 0 && tmp_t_val == 0) {
								_tmpSDck0.push([txx[m][0], txx_line]);
							} else {
								_tmpSDck1.push([txx[m][0], txx_line]);
							}
							if (tprq_jsfilter == 1 && txx[m][1]) {
								if (tprq_history_js.includes(txx[m][0])) {
									_tmpJSlv = is_js_allowed(txx[m][0], 'https:');
									if (_tmpJSlv == 0) {
										_tmpJSck0.push([txx[m][0], getpopline_js(_tmpJSlv, txx[m][0], get_decrtd(txx[m][0], xdomain, 1))]);
									} else {
										_tmpJSck1.push([txx[m][0], getpopline_js(_tmpJSlv, txx[m][0], get_decrtd(txx[m][0], xdomain, 1))]);
									}
								}
							}
						} else {
							if (tprq_showdotf == 1) {
								tmp_3pdom = get_realdomain(txx[m][0]);
								if (!_dombasket.includes(tmp_3pdom)) {
									_dombasket.push(tmp_3pdom);
								}
							}
							txx_line = (tprq_popstyle == 2) ? "<tr><td><span class=\"switch-toggle switch-3 switch-candy\"><input id=\"txf1_" + txx[m][0] + "\" name=\"f_" + txx[m][0] + "\" type=\"radio\" value=\"x\"" + tmp_x_chk + "><label for=\"txf1_" + txx[m][0] + "\" class=\"ignr\">00</label><input id=\"txf2_" + txx[m][0] + "\" name=\"f_" + txx[m][0] + "\" data-usvxt=\"" + tmp_t_val + "\" type=\"radio\" value=\"b\"" + tmp_t_chk + "><label for=\"txf2_" + txx[m][0] + "\" class=\"ignr\">00</label><input id=\"idf_" + txx[m][0] + "\" name=\"f_" + txx[m][0] + "\" data-usv=\"" + tmp_a_val + "\" type=\"radio\" value=\"c\"" + tmp_a_chk + "><label for=\"idf_" + txx[m][0] + "\" class=\"ignr\">00</label><a></a></span>&nbsp;<span title=\"" + getpop_extra(txx[m][0], 2) + "\">" + getpop_extra(txx[m][0], 1) + txx[m][0] + "</span></td></tr>" : "<tr><td><input name=\"f_" + txx[m][0] + "\" type=\"radio\" value=\"x\"" + tmp_x_chk + "><input name=\"f_" + txx[m][0] + "\" data-usvxt=\"" + tmp_t_val + "\" type=\"radio\" value=\"b\"" + tmp_t_chk + "><input id=\"idf_" + txx[m][0] + "\" name=\"f_" + txx[m][0] + "\" data-usv=\"" + tmp_a_val + "\" type=\"radio\" value=\"c\"" + tmp_a_chk + "> <label for=\"idf_" + txx[m][0] + "\" title=\"" + getpop_extra(txx[m][0], 2) + "\">" + getpop_extra(txx[m][0], 1) + txx[m][0] + "</label></td></tr>";
							if (tmp_a_val == 0 && tmp_t_val == 0) {
								_tmpETck0.push([txx[m][0], txx_line]);
							} else {
								_tmpETck1.push([txx[m][0], txx_line]);
							}
							if (tprq_jsfilter == 1 && txx[m][1]) {
								if (tprq_history_js.includes(txx[m][0])) {
									_tmpJSlv = is_js_allowed(txx[m][0], 'https:');
									if (_tmpJSlv == 0) {
										_tmpJSck0.push([txx[m][0], getpopline_js(_tmpJSlv, txx[m][0], txx[m][0])]);
									} else {
										_tmpJSck1.push([txx[m][0], getpopline_js(_tmpJSlv, txx[m][0], txx[m][0])]);
									}
								}
							}
						}
					}
				}
				if (tprq_pop_sort == 2 || tprq_pop_sort == 3) {
					_tmpSDck1 = _tmpSDck1.sort(function (a, b) {
						if (a[0] < b[0]) {
							return -1;
						} else {
							if (a[0] > b[0]) {
								return 1;
							}
						};
						return 0;
					});
					_tmpSDck0 = _tmpSDck0.sort(function (a, b) {
						if (a[0] < b[0]) {
							return -1;
						} else {
							if (a[0] > b[0]) {
								return 1;
							}
						};
						return 0;
					});
					_tmpETck1 = _tmpETck1.sort(function (a, b) {
						if (a[0] < b[0]) {
							return -1;
						} else {
							if (a[0] > b[0]) {
								return 1;
							}
						};
						return 0;
					});
					_tmpETck0 = _tmpETck0.sort(function (a, b) {
						if (a[0] < b[0]) {
							return -1;
						} else {
							if (a[0] > b[0]) {
								return 1;
							}
						};
						return 0;
					});
					_tmpJSck1 = _tmpJSck1.sort(function (a, b) {
						if (a[0] < b[0]) {
							return -1;
						} else {
							if (a[0] > b[0]) {
								return 1;
							}
						};
						return 0;
					});
					_tmpJSck0 = _tmpJSck0.sort(function (a, b) {
						if (a[0] < b[0]) {
							return -1;
						} else {
							if (a[0] > b[0]) {
								return 1;
							}
						};
						return 0;
					});
				}
				if (tprq_pop_sort == 0 || tprq_pop_sort == 2) {
					_res_sd += (_tmpSDck1.concat(_tmpSDck0)).map(function (v, i) {
						return v[1];
					}).join('');
					_res_etc = (_tmpETck1.concat(_tmpETck0)).map(function (v, i) {
						return v[1];
					}).join('');
					_res_js += (_tmpJSck1.concat(_tmpJSck0)).map(function (v, i) {
						return v[1];
					}).join('');
				}
				if (tprq_pop_sort == 1 || tprq_pop_sort == 3) {
					_res_sd += (_tmpSDck0.concat(_tmpSDck1)).map(function (v, i) {
						return v[1];
					}).join('');
					_res_etc = (_tmpETck0.concat(_tmpETck1)).map(function (v, i) {
						return v[1];
					}).join('');
					_res_js += (_tmpJSck0.concat(_tmpJSck1)).map(function (v, i) {
						return v[1];
					}).join('');
				}
				if (_res_js != '') {
					_res_js = '<tr><td><br></td></tr><tr><td><span class="minortxt"><small>' + _label_js + '</small></span></td></tr>' + _res_js;
				}
				if (tprq_showdotf == 1) {
					var _res_wcd = '';
					var _tmpWDck1 = [];
					var _tmpWDck0 = [];
					var a_must = false;
					var _twlst_xh = tprq_whitelist[xhost];
					var _twlst_dm = tprq_whitelist[xdotdom];
					var _twlst_ak = tprq_whitelist['*'];
					for (var f = 0; f < _dombasket.length; f++) {
						if (is_ip_addr(_dombasket[f])) {
							continue;
						} //ignore IP
						a_must = false;
						if (_twlst_xh != undefined) {
							if (_twlst_xh.includes('.' + _dombasket[f])) {
								a_must = true;
							}
						}
						if (!a_must) {
							if (_twlst_dm != undefined) {
								if (_twlst_dm.includes('.' + _dombasket[f])) {
									a_must = true;
								}
							}
						}
						if (!a_must) {
							if (_twlst_ak != undefined) {
								if (_twlst_ak.includes('.' + _dombasket[f])) {
									a_must = true;
								}
							}
						}
						if (a_must) {
							tmp_a_chk = ' checked';
							tmp_a_val = 1;
						} else {
							tmp_a_chk = '';
							tmp_a_val = 0;
						}
						txx_line = (tprq_popstyle == 2) ? "<tr><td><span class=\"switch-toggle switch-1 switch-candy\"><input id=\"idf_." + _dombasket[f] + "\" name=\"f_." + _dombasket[f] + "\" data-usv=\"" + tmp_a_val + "\" data-wild=1 type=\"checkbox\"" + tmp_a_chk + "><label for=\"idf_." + _dombasket[f] + "\" class=\"ignr\">00</label><a></a></span>&nbsp;<span title=\"*." + _dombasket[f] + "\"><b>*.</b>" + _dombasket[f] + "</span></td></tr>" : "<tr><td><input id=\"idf_." + _dombasket[f] + "\" name=\"f_." + _dombasket[f] + "\" data-usv=\"" + tmp_a_val + "\" data-wild=1 type=\"checkbox\"" + tmp_a_chk + "> <label for=\"idf_." + _dombasket[f] + "\" title=\"*." + _dombasket[f] + "\"><b>*.</b>" + _dombasket[f] + "</label></td></tr>";
						if (tmp_a_val == 0) {
							_tmpWDck0.push([_dombasket[f], txx_line]);
						} else {
							_tmpWDck1.push([_dombasket[f], txx_line]);
						}
					}
					if (tprq_pop_sort == 2 || tprq_pop_sort == 3) {
						_tmpWDck1 = _tmpWDck1.sort(function (a, b) {
							if (a[0] < b[0]) {
								return -1;
							} else {
								if (a[0] > b[0]) {
									return 1;
								}
							};
							return 0;
						});
						_tmpWDck0 = _tmpWDck0.sort(function (a, b) {
							if (a[0] < b[0]) {
								return -1;
							} else {
								if (a[0] > b[0]) {
									return 1;
								}
							};
							return 0;
						});
					}
					if (tprq_pop_sort == 0 || tprq_pop_sort == 2) {
						_res_wcd = (_tmpWDck1.concat(_tmpWDck0)).map(function (v, i) {
							return v[1];
						}).join('');
					}
					if (tprq_pop_sort == 1 || tprq_pop_sort == 3) {
						_res_wcd = (_tmpWDck0.concat(_tmpWDck1)).map(function (v, i) {
							return v[1];
						}).join('');
					}
					if (tprq_showtemp == 1 && _res_wcd != '') {
						_res_wcd = "<tr><td><span class=\"minortxt\"><small><span data-what=\"allsdom\"></span></small></span></td></tr>" + _res_wcd;
					}
					if (!tprq_amdroid) {
						_res += '<tr><td valign="top"><table border="0" cellspacing="1" cellpadding="1">' + _res_sd + _res_etc + _res_js + '</table></td><td valign="top"><table border="0" cellspacing="1" cellpadding="1">' + _res_wcd + '</table></td></tr></table>';
					} else {
						_res += _res_sd + _res_etc + _res_js + '<tr><td><br></td></tr>' + _res_wcd + '</table>';
					}
				} else {
					_res += _res_sd + _res_etc + _res_js + '</table>';
				}
			} else {
				if (_res_js == '') {
					_res += '<tr><td align="center"><i><span data-what="no3pcon"></span></i></td></tr></table>';
				} else {
					_res += '<tr><td><span class="minortxt"><small>' + _label_js + '</small></span></td></tr>' + _res_js + '</table>';
				}
			}
		} else {
			_res += '<tr><td align="center"><i><span data-what="no3pcon"></span></i></td></tr></table>';
		} //not domain
	} else {
		_res += '<tr><td align="center"><i><span data-what="offmode"></span></i></td></tr></table>';
	}
	return [tprq_mylang, xlabel, _res, xicon, tprq_showxbtn, tprq_pop_bid, tprq_poponoff, tprq_popstyle, [tprq_poprclk, tprq_poplbla], [0, 0]];
}

function tprq_updicon(tid, url) {
	if (tprq_poponoff == 1) {
		if (!tprq_poponoff_ison) {
			browser.browserAction.setTitle({
				tabId: tid,
				title: "TPRB (OFF)"
			});
			browser.browserAction.setBadgeText({
				tabId: tid,
				text: "OFF!"
			});
			browser.browserAction.setIcon({
				tabId: tid,
				path: 'icons/icon-32.png'
			});
			return;
		}
	}
	var tmp_iu = new URL(url);
	if ((tmp_iu.protocol != 'http:' && tmp_iu.protocol != 'https:') || tmp_iu.hostname.length < 1) {
		browser.browserAction.setTitle({
			tabId: tid,
			title: "TPRB"
		});
		browser.browserAction.setBadgeText({
			tabId: tid,
			text: ""
		});
		browser.browserAction.setIcon({
			tabId: tid,
			path: tprq_flags[0]
		});
		return;
	} //local resource.
	var gl = get_3p_rela_level(tid, tmp_iu.hostname);
	browser.browserAction.setTitle({
		tabId: tid,
		title: "TPRB (" + gl[0].toString() + ")"
	});
	if (tprq_showcntr == 1 && gl[0] >= 1) {
		if (gl[0] < 1000) {
			browser.browserAction.setBadgeText({
				tabId: tid,
				text: gl[0].toString()
			});
		} else {
			browser.browserAction.setBadgeText({
				tabId: tid,
				text: "1K+"
			});
		}
	} else {
		browser.browserAction.setBadgeText({
			tabId: tid,
			text: ""
		});
	}
	browser.browserAction.setIcon({
		tabId: tid,
		path: gl[1]
	});
	return;
}

function tprq_modwl_add(s, d, tid, okwrite) {
	if (tprq_whitelist[s] == undefined) {
		tprq_whitelist[s] = [];
	}
	if (tprq_whitetemp[s] == undefined) {
		tprq_whitetemp[s] = [];
	}
	if (okwrite) {
		if (!tprq_whitelist[s].includes(d)) {
			tprq_whitelist[s].push(d);
		}
	} else {
		if (!tprq_whitetemp[s].includes(d)) {
			tprq_whitetemp[s].push(d);
		}
	}
	if (!d.startsWith('.')) {
		tprq_tab_dst[tid][s] = update_pair_data(tprq_tab_dst[tid][s], d, true, okwrite);
	} else {
		var tdwu = [];
		var tdts = tprq_tab_dst[tid][s];
		if (tdts.length > 0) {
			for (var g in tdts) {
				if (tdts[g][0].endsWith(d)) {
					tdwu.push(tdts[g][0]);
				}
			}
		}
		for (var h = 0; h < tdwu.length; h++) {
			if (tprq_whitelist[s].includes(tdwu[h])) {
				if (tprq_whitelist[s].indexOf(tdwu[h]) > -1) {
					tprq_whitelist[s].splice(tprq_whitelist[s].indexOf(tdwu[h]), 1);
				}
			}
			if (tprq_whitetemp[s].includes(tdwu[h])) {
				if (tprq_whitetemp[s].indexOf(tdwu[h]) > -1) {
					tprq_whitetemp[s].splice(tprq_whitetemp[s].indexOf(tdwu[h]), 1);
				}
			}
			tprq_tab_dst[tid][s] = update_pair_data(tprq_tab_dst[tid][s], tdwu[h], true, okwrite);
		}
	}
}

function tprq_modwl_remove(s, d, tid, okwrite) {
	if (tprq_whitelist[s] == undefined) {
		tprq_whitelist[s] = [];
	}
	if (tprq_whitetemp[s] == undefined) {
		tprq_whitetemp[s] = [];
	}
	if (okwrite) {
		if (tprq_whitelist[s].includes(d)) {
			if (tprq_whitelist[s].indexOf(d) > -1) {
				tprq_whitelist[s].splice(tprq_whitelist[s].indexOf(d), 1);
			}
		}
	}
	if (tprq_whitetemp[s].includes(d)) {
		if (tprq_whitetemp[s].indexOf(d) > -1) {
			tprq_whitetemp[s].splice(tprq_whitetemp[s].indexOf(d), 1);
		}
	}
	if (!d.startsWith('.')) {
		tprq_tab_dst[tid][s] = update_pair_data(tprq_tab_dst[tid][s], d, false, okwrite);
	} else {
		var tdwu = [];
		var tdts = tprq_tab_dst[tid][s];
		if (tdts.length > 0) {
			for (var g in tdts) {
				if (tdts[g][0].endsWith(d)) {
					tdwu.push(tdts[g][0]);
				}
			}
		}
		for (var h = 0; h < tdwu.length; h++) {
			if (tprq_whitelist[s].includes(tdwu[h])) {
				if (tprq_whitelist[s].indexOf(tdwu[h]) > -1) {
					tprq_whitelist[s].splice(tprq_whitelist[s].indexOf(tdwu[h]), 1);
				}
			}
			if (tprq_whitetemp[s].includes(tdwu[h])) {
				if (tprq_whitetemp[s].indexOf(tdwu[h]) > -1) {
					tprq_whitetemp[s].splice(tprq_whitetemp[s].indexOf(tdwu[h]), 1);
				}
			} //just in case
			tprq_tab_dst[tid][s] = update_pair_data(tprq_tab_dst[tid][s], tdwu[h], false, okwrite);
		}
	}
}

function tprq_modjs_add(d, okwrite, ishttps) {
	if (okwrite) {
		if (ishttps) {
			if (tprq_oklist_js.includes(d)) {
				if (tprq_oklist_js.indexOf(d) > -1) {
					tprq_oklist_js.splice(tprq_oklist_js.indexOf(d), 1);
				}
			};
			if (!tprq_oklist_js.includes('!' + d)) {
				tprq_oklist_js.push('!' + d);
			}
		} else {
			if (tprq_oklist_js.includes('!' + d)) {
				if (tprq_oklist_js.indexOf('!' + d) > -1) {
					tprq_oklist_js.splice(tprq_oklist_js.indexOf('!' + d), 1);
				}
			};
			if (!tprq_oklist_js.includes(d)) {
				tprq_oklist_js.push(d);
			}
		}
	} else {
		if (!tprq_tmpok_js.includes(d)) {
			tprq_tmpok_js.push(d);
		}
	}
}

function tprq_modjs_remove(d, okwrite) {
	if (okwrite) {
		if (tprq_oklist_js.includes(d)) {
			if (tprq_oklist_js.indexOf(d) > -1) {
				tprq_oklist_js.splice(tprq_oklist_js.indexOf(d), 1);
			}
		};
		if (tprq_oklist_js.includes('!' + d)) {
			if (tprq_oklist_js.indexOf('!' + d) > -1) {
				tprq_oklist_js.splice(tprq_oklist_js.indexOf('!' + d), 1);
			}
		}
	}
	if (tprq_tmpok_js.includes(d)) {
		if (tprq_tmpok_js.indexOf(d) > -1) {
			tprq_tmpok_js.splice(tprq_tmpok_js.indexOf(d), 1);
		}
	}
}

function set_cspvalue(x, h, diejs, ijsallow) {
	var ssmode = (tprq_jslineok == 1) ? "'unsafe-inline'" : "'none'";
	var x_src = (diejs) ? false : true;
	var x_reporthost = (diejs) ? h : '0';
	var x_uri = false;
	var y_man = false;
	var y_bamc = (tprq_mixignore == 0) ? false : true;
	var x_worker = (tprq_noworker == 1 && ijsallow == 0) ? false : true;
	var v_font = (tprq_blockfnt == 1) ? false : true;
	var v_object = (tprq_blockobj == 1) ? false : true;
	var v_media = (tprq_blockmid == 1) ? false : true;
	var v_image = (tprq_blockimg == 1) ? false : true;
	var xxxi;
	var xx = x.split(';');
	for (var xi = 0; xi < xx.length; xi++) {
		xxxi = xx[xi].trim().toLowerCase();
		if (xxxi.startsWith('report-uri')) {
			x_uri = true;
			xx[xi] = "report-uri https://0.0.0.0/tprb_csp/" + x_reporthost;
			continue;
		}
		if (xxxi.startsWith('report-to')) {
			xx[xi] = '';
			continue;
		}
		if (xxxi.startsWith('script-src') && !x_src) {
			x_src = true;
			xx[xi] = "script-src " + ssmode;
			continue;
		}
		if (xxxi.startsWith('worker-src') && !x_worker) {
			x_worker = true;
			xx[xi] = "worker-src 'none'";
			continue;
		}
		if (xxxi.startsWith('font-src') && !v_font) {
			v_font = true;
			xx[xi] = "font-src 'none'";
			continue;
		}
		if (xxxi.startsWith('object-src') && !v_object) {
			v_object = true;
			xx[xi] = "object-src 'none'";
			continue;
		}
		if (xxxi.startsWith('media-src') && !v_media) {
			v_media = true;
			xx[xi] = "media-src 'none'";
			continue;
		}
		if (xxxi.startsWith('img-src') && !v_image) {
			v_image = true;
			xx[xi] = "img-src 'none'";
			continue;
		}
		if (xxxi.startsWith('manifest-src')) {
			y_man = true;
			xx[xi] = "manifest-src 'none'";
			continue;
		}
		if (xxxi.startsWith('block-all-mixed-content') && !y_bamc) {
			y_bamc = true;
			xx[xi] = "block-all-mixed-content";
			continue;
		}
	}
	if (!x_src) {
		xx.push("script-src " + ssmode);
	}
	if (!x_uri) {
		xx.push("report-uri https://0.0.0.0/tprb_csp/" + x_reporthost);
	}
	if (!x_worker) {
		xx.push("worker-src 'none'");
	}
	if (!v_font) {
		xx.push("font-src 'none'");
	}
	if (!v_object) {
		xx.push("object-src 'none'");
	}
	if (!v_media) {
		xx.push("media-src 'none'");
	}
	if (!v_image) {
		xx.push("img-src 'none'");
	}
	if (!y_man) {
		xx.push("manifest-src 'none'");
	}
	if (!y_bamc) {
		xx.push("block-all-mixed-content");
	}
	return xx.filter(v => v != '').join(';');
}
if (tprq_init == 0) {
	tprq_init = 1;
	rqbl_loadcfg();
	tprq_init = 2;
}
//===
browser.webRequest.onBeforeRequest.addListener(function (reqinfo) {
	if (tprq_poponoff == 1) {
		if (!tprq_poponoff_ison) {
			return;
		}
	}
	var rqlink_dst = document.createElement('a');
	rqlink_dst.setAttribute('href', reqinfo.url);
	var rq_dst_host = rqlink_dst.hostname;
	var rq_dst_prot = rqlink_dst.protocol;
	var rq_dst_path = rqlink_dst.pathname;
	var rq_dst_srch = rqlink_dst.search;
	rqlink_dst = null;
	var rq_dst_inet = ['http:', 'https:', 'ws:', 'wss:'].includes(rq_dst_prot);
	if (rq_dst_prot == 'ftp:') {
		return;
	}
	if (rq_dst_inet) {
		if (!/^((([a-z0-9_]{1})([a-z0-9_.-]{1,})([a-z]{1}))|(([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3}))|(\[([a-z0-9:\.]{4,45})\]))$/.test(rq_dst_host)) {
			console.log('TPRB: Blocked: Abnormal:', rq_dst_host);
			return {
				cancel: true
			};
		}
	}
	var rq_dst_what = '';
	if (tprq_jsnoxss == 1) {
		if (rq_dst_inet) {
			if (rq_dst_srch.length > 5) {
				rq_dst_what = rq_dst_srch;
			} //GET
			if (reqinfo.requestBody != undefined) {
				if (reqinfo.requestBody['formData'] != undefined) {
					var tmp_rrfd = JSON.stringify(reqinfo.requestBody['formData']);
					if (tmp_rrfd.length > 11) {
						rq_dst_what += tmp_rrfd;
					}
				}
			} //POST
			rq_dst_what = rq_dst_what.toLowerCase();
		}
	}
	//JSBlocking
	if (tprq_jsfilter == 1) {
		if (reqinfo.type == 'csp_report') {
			if (reqinfo.url.startsWith('https://0.0.0.0/tprb_csp/')) {
				var _csp_domain = reqinfo.url.replace('https://0.0.0.0/tprb_csp/', '');
				if (/^([0-9a-z.*_\[\]\:-]{2,})$/.test(_csp_domain)) {
					add_js_history(_csp_domain);
				}
			}
			return {
				cancel: true
			};
		}
	}
	if (tprq_jsnoxss == 1) {
		if (rq_dst_what != '') {
			var _xss_found = 0;
			for (var le = 0; le < tprq_db_xss1.length; le++) {
				if (rq_dst_what.includes(tprq_db_xss1[le])) {
					_xss_found += 1;
					break;
				}
			}
			if (_xss_found >= 1) {
				for (var le = 0; le < tprq_db_xss2.length; le++) {
					if (rq_dst_what.includes(tprq_db_xss2[le])) {
						_xss_found += 1;
						break;
					}
				}
				for (var le = 0; le < tprq_db_xss3.length; le++) {
					if (rq_dst_what.includes(tprq_db_xss3[le])) {
						_xss_found += 1;
						break;
					}
				}
				if (_xss_found >= 3) {
					console.log('TPRB: Blocked: XSS:', reqinfo.url);
					return {
						cancel: true
					};
				}
			}
		}
	}
	//badURL
	if (rq_dst_host == '0.0.0.0' || rq_dst_host == 'noscript-csp.invalid') {
		return {
			cancel: true
		};
	}
	if (tprq_denypuny == 1) {
		if (/^(xn--|([0-9a-z_.-]{1,60})\.xn--)(.*)$/.test(rq_dst_host)) {
			console.log('TPRB: Blocked: Punycode domain:', rq_dst_host);
			return {
				cancel: true
			};
		}
	}
	if (tprq_redir2htps == 1) {
		if (!rq_dst_host.endsWith('.onion') && !rq_dst_host.endsWith('.i2p')) {
			if (rq_dst_prot == 'http:') {
				console.log('TPRB: Redirect: to https:', rq_dst_host);
				return {
					redirectUrl: reqinfo.url.replace('http://', 'https://')
				};
			}
			if (rq_dst_prot == 'ws:') {
				console.log('TPRB: Redirect: to wss:', rq_dst_host);
				return {
					redirectUrl: reqinfo.url.replace('ws://', 'wss://')
				};
			}
		}
	}
	if (tprq_secureonly == 1) {
		if (rq_dst_prot == 'http:' || rq_dst_prot == 'ws:') {
			if (!rq_dst_host.endsWith('.onion') && !rq_dst_host.endsWith('.i2p')) {
				console.log('TPRB: Blocked: Insecure:', reqinfo.url);
				return {
					cancel: true
				};
			}
		}
	}
	if (tprq_onlygp == 1) {
		if (reqinfo.method != undefined && reqinfo.method != 'GET' && reqinfo.method != 'POST') {
			console.log('TPRB: Blocked: Method:', reqinfo.method);
			return {
				cancel: true
			};
		}
	}
	if (tprq_denysocks == 1) {
		if (rq_dst_prot == 'ws:' || rq_dst_prot == 'wss:') {
			if (rq_dst_host != '127.0.0.1') {
				console.log('TPRB: Blocked: WebSocket:', reqinfo.url);
				return {
					cancel: true
				};
			}
		}
	}
	var rq_dst_hbase = get_realdomain(rq_dst_host);
	if (tprq_fwdom >= 1) {
		if (tprq_black_nrml.includes(rq_dst_host)) {
			console.log('TPRB: Blocked: Blacklist:', rq_dst_host);
			if (reqinfo.type == 'image') {
				return {
					redirectUrl: 'data:image/gif;base64,' + tprq_bl_img
				};
			} else {
				return {
					cancel: true
				};
			}
		}
		if (tprq_black_nrml.includes('.' + rq_dst_hbase)) {
			console.log('TPRB: Blocked: Blacklist:', rq_dst_host);
			if (reqinfo.type == 'image') {
				return {
					redirectUrl: 'data:image/gif;base64,' + tprq_bl_img
				};
			} else {
				return {
					cancel: true
				};
			}
		}
		if (tprq_fwdom == 2) {
			for (var i = 0; i < tprq_black_regx.length; i++) {
				if ((new RegExp(tprq_black_regx[i].replace(/^\//g, ''))).test(rq_dst_host)) {
					console.log('TPRB: Blocked: Blacklist:', rq_dst_host);
					if (reqinfo.type == 'image') {
						return {
							redirectUrl: 'data:image/gif;base64,' + tprq_bl_img
						};
					} else {
						return {
							cancel: true
						};
					}
				}
			}
		}
	}
	if (reqinfo.type == 'main_frame') {
		if (tprq_cleanparam == 1) {
			if (rq_dst_srch.length > 7) {
				var _clnprm_must = false;
				var _clnprm = rq_dst_srch.replace('?', '').split('&');
				var _cm_tv;
				for (var _cm = 0; _cm < _clnprm.length; _cm++) {
					_cm_tv = _clnprm[_cm].split('=', 2);
					if (_cm_tv.length != 2 || _cm_tv[0].length < 2) {
						continue;
					}
					if (/^(action_|algo_|fb_|ga_|hmb_|pd_rd_|pf_rd_|utm_)(.*)$/.test(_cm_tv[0])) {
						_clnprm_must = true;
						_clnprm[_cm] = '';
						continue;
					}
					if (_cm_tv[0] == 'sid') {
						if (_cm_tv[1] != undefined) {
							if (_cm_tv[1].length >= 32) {
								_clnprm_must = true;
								_clnprm[_cm] = '';
								continue;
							}
						}
					}
					if (['aspxerrorpath', 'aff_id', 'a_aid', 'btsid', 'cvid', 'feature', 'from', 'gclid', 'gs_l', 'gws_rd', 'ie', 'mbid', 'phpsessid', 'pvid', 'ref_', 'ref_src', 'referer', 'sc', 'sdsrc', 'smid', 'snr', 'spm', 'sr', 'sr_source', 'src', 'trackingid', 'trk', 'ved', 'yclid'].includes(_cm_tv[0].toLowerCase())) {
						_clnprm_must = true;
						_clnprm[_cm] = '';
						continue;
					}
				}
				if (_clnprm_must) {
					_clnprm = '?' + (_clnprm.filter(v => v != '').join('&'));
					if (rq_dst_srch != _clnprm) {
						if (_clnprm == '?') {
							_clnprm = '';
						};
						console.log('TPRB: Redirect: Dirty query:', reqinfo.url);
						return {
							redirectUrl: rq_dst_prot + '//' + rq_dst_host + rq_dst_path + _clnprm
						};
					}
				}
			}
		}
	}
	if (tprq_scan_mitm == 1) {
		if (tprq_bkt_mitms.includes(rq_dst_host)) {
			if (is_mitm_host(rq_dst_host)) {
				browser.tabs.executeScript(reqinfo.tabId, {
					matchAboutBlank: true,
					runAt: 'document_end',
					code: 'window.stop();alert("TPRB: %%WRN_TITLE%%\\n\\n%%WRN_ACTN%%\\n%%WRN_DST%%");'.replace('%%WRN_TITLE%%', tprq_mylang['nf_dtmitm']).replace('%%WRN_ACTN%%', tprq_mylang['nf_acted']).replace('%%WRN_DST%%', rq_dst_host)
				});
				console.log('TPRB: Known MITM Blocked:', rq_dst_host);
				return {
					cancel: true
				};
			}
		}
	}
	//Allow_1P
	var rq_tab_id = reqinfo.tabId;
	if (reqinfo.type == 'main_frame') {
		if (tprq_tab_dst[rq_tab_id] != undefined) { // Remove old DST array
			var _firstkey = '';
			var _rti_cnt = 0;
			for (var o in tprq_tab_dst[rq_tab_id]) {
				if (_firstkey == '') {
					_firstkey = o;
				};
				_rti_cnt += 1;
				if (_rti_cnt >= 6) {
					break;
				}
			}
			if (_rti_cnt >= 6 && _firstkey.length >= 2) {
				if (tprq_tab_dst[rq_tab_id][_firstkey] != undefined) {
					tprq_tab_dst[rq_tab_id][_firstkey] = [];
					delete tprq_tab_dst[rq_tab_id][_firstkey];
				}
			}
		}
		return;
	}
	var rqlink_src = document.createElement('a');
	var rqlink_resolve_src = 0;
	if (reqinfo.frameAncestors != undefined) {
		if (reqinfo.frameAncestors[0] != undefined) {
			if (reqinfo.frameAncestors[reqinfo.frameAncestors.length - 1].url != undefined) {
				rqlink_resolve_src = 1;
				rqlink_src.setAttribute('href', reqinfo.frameAncestors[reqinfo.frameAncestors.length - 1].url);
			}
		}
	}
	if (rqlink_resolve_src == 0) {
		if (reqinfo.documentUrl) {
			rqlink_src.setAttribute('href', reqinfo.documentUrl);
		} else {
			rqlink_src.setAttribute('href', reqinfo.originUrl);
		}
	} //FX52(orgU,A-B|B-C) or FX59+(docU,A-B=C)
	var rq_src_host = rqlink_src.hostname;
	var rq_src_prot = rqlink_src.protocol;
	rqlink_src = null;
	var rq_src_inet = ['http:', 'https:', 'ws:', 'wss:'].includes(rq_src_prot);
	if (rq_src_inet && rq_dst_prot == 'file:') {
		console.log('TPRB: Blocked: I2L');
		return {
			cancel: true
		};
	}
	if (rq_dst_inet && rq_src_prot == 'file:') {
		if (tprq_l2iignore == 0) {
			console.log('TPRB: Blocked: L2I');
			return {
				cancel: true
			};
		} else {
			return;
		}
	}
	if (rq_src_prot == 'https:' && (rq_dst_prot == 'http:' || rq_dst_prot == 'ws:')) {
		if (tprq_mixignore == 0) {
			console.log('TPRB: Blocked: HTTPS-to-insecure');
			return {
				cancel: true
			};
		}
	}
	if (!rq_dst_inet || rq_dst_host.length < 2) {
		return;
	}
	//datatype
	if (tprq_blockfnt == 1) {
		if (['beacon', 'csp_report', 'font', 'ping'].includes(reqinfo.type)) {
			console.log('TPRB: Blocked: bad resource type:', reqinfo.url);
			return {
				cancel: true
			};
		}
		if (['fonts.googleapis.com', 'use.typekit.net', 'use.typekit.com', 'use.edgefonts.net', 'fast.fonts.net', 'use.fontawesome.com', 'use.fortawesome.com', 'use.fonticons.com', 'hello.myfonts.net'].includes(rq_dst_host)) {
			console.log('TPRB: Blocked: Web Fonts');
			return {
				cancel: true
			};
		}
		if (reqinfo.type == 'stylesheet') {
			if (/^(.*)\/(font-awesome|MyFontsWebfontsKit|fonts\.css)(.*)$/.test(rq_dst_path)) {
				console.log('TPRB: Blocked: Fonts CSS');
				return {
					cancel: true
				};
			}
		}
		if (reqinfo.type == 'script') {
			if (rq_dst_path.includes('/webfont')) {
				console.log('TPRB: Blocked: Fonts JS');
				return {
					cancel: true
				};
			}
		}
	}
	if (tprq_blockmid == 1) {
		if (reqinfo.type == 'media') {
			console.log('TPRB: Blocked: media:', reqinfo.url);
			return {
				cancel: true
			};
		}
	}
	if (tprq_blockimg == 1) {
		if (reqinfo.type == 'image' || reqinfo.type == 'imageset') {
			return {
				redirectUrl: 'data:image/gif;base64,' + tprq_bl_img
			};
		}
	}
	if (tprq_blockobj == 1) {
		if (reqinfo.type == 'object' || reqinfo.type == 'object_subrequest') {
			console.log('TPRB: Blocked: object:', reqinfo.url);
			return {
				cancel: true
			};
		}
	}
	if (tprq_jsfilter == 1) {
		var _isScrRsc = ['script', 'xbl', 'xslt'].includes(reqinfo.type);
		if (rq_src_host == rq_dst_host && _isScrRsc) {
			add_js_history(rq_dst_host);
			if (is_js_allowed(rq_dst_host, rq_dst_prot) == 0) {
				return {
					cancel: true
				};
			}
		}
	}
	//rule
	if (rq_src_host == rq_dst_host) {
		return;
	} //same origin
	if (tprq_separdark == 1) {
		if (rq_src_inet) {
			var _sIsDNET = rq_src_host.endsWith('.onion') || rq_src_host.endsWith('.i2p');
			var _dIsDNET = rq_dst_host.endsWith('.onion') || rq_dst_host.endsWith('.i2p');
			if ((_sIsDNET && !_dIsDNET) || (!_sIsDNET && _dIsDNET)) {
				console.log('TPRB: Blocked: Clearnet+Onion:', rq_dst_host);
				return {
					cancel: true
				};
			}
		}
	}
	if (tprq_allowcss == 1) {
		if (reqinfo.type == 'stylesheet') {
			return;
		}
	}
	if (tprq_usedntme == 1) {
		if (tprq_dblack_fqdn.includes(rq_dst_host)) {
			console.log('TPRB: Blocked: known FQDN:', rq_dst_host);
			return {
				cancel: true
			};
		}
		if (tprq_dblack_dom.includes(rq_dst_hbase)) {
			console.log('TPRB: Blocked: known DOMAIN:', rq_dst_host);
			return {
				cancel: true
			};
		}
		if (!rq_src_host.includes('amazon') && rq_src_host != 'www.imdb.com') {
			if (rq_dst_host.endsWith('.images-amazon.com') || rq_dst_host.endsWith('.ssl-images-amazon.com')) {
				console.log('TPRB: Blocked: CallAmazonFromNonAmazon:', rq_dst_host);
				return {
					cancel: true
				};
			}
		}
	}
	if (tprq_unsocial == 1) {
		if (tprq_dsocial_fqdn.includes(rq_dst_host)) {
			console.log('TPRB: Blocked: known FQDN:', rq_dst_host);
			return {
				cancel: true
			};
		}
		if (tprq_dsocial_dom.includes(rq_dst_hbase)) {
			console.log('TPRB: Blocked: known DOMAIN:', rq_dst_host);
			return {
				cancel: true
			};
		}
		if (reqinfo.url.includes('://www.facebook.com/plugins/') || reqinfo.url.includes('://www.facebook.com/tr?') || reqinfo.url.includes('://apis.google.com/js/platform.js') || reqinfo.url.includes('://apis.google.com/js/plusone.js')) {
			console.log('TPRB: Blocked: FB-GP1');
			return {
				cancel: true
			};
		}
	}
	//main
	if (rq_src_inet && rq_src_host.length >= 2) {
		if (tprq_tab_dst[rq_tab_id] == undefined) {
			tprq_tab_dst[rq_tab_id] = [];
		} // new tabID Array
		if (tprq_tab_dst[rq_tab_id][rq_src_host] == undefined) {
			tprq_tab_dst[rq_tab_id][rq_src_host] = [];
		} // tabid->src->[f,ok]
		var rq_3p_allowed = is_3p_allowed(rq_src_host, rq_dst_host);
		if (tprq_fmtdsturl == 1 && !rq_3p_allowed[0]) { //dst_URL rule
			var _tmpsrcbase = '.' + get_realdomain(rq_src_host);
			var _tmpdstburl = rq_dst_prot + '//' + rq_dst_host + rq_dst_path;
			if (tprq_whitelist['*'] != undefined) {
				if (tprq_whitelist['*'].includes(_tmpdstburl)) {
					return;
				}
			}
			if (tprq_whitelist[rq_src_host] != undefined) {
				if (tprq_whitelist[rq_src_host].includes(_tmpdstburl)) {
					return;
				}
			}
			if (tprq_whitelist[_tmpsrcbase] != undefined) {
				if (tprq_whitelist[_tmpsrcbase].includes(_tmpdstburl)) {
					return;
				}
			}
		}
		tprq_tab_dst[rq_tab_id][rq_src_host] = update_pair_data(tprq_tab_dst[rq_tab_id][rq_src_host], rq_dst_host, rq_3p_allowed[0], rq_3p_allowed[1]); //Record TP status
		if (tprq_jsfilter == 1) {
			if (_isScrRsc) {
				add_js_history(rq_dst_host);
				if (is_js_allowed(rq_dst_host, rq_dst_prot) == 0) {
					return {
						cancel: true
					};
				}
			}
		} //Record|Block TP JS
		if (!rq_3p_allowed[0]) {
			console.log('TPRB: Blocked:', rq_src_host, '->', rq_dst_host);
			if (reqinfo.type == 'image') {
				return {
					redirectUrl: 'data:image/gif;base64,' + tprq_bl_img
				};
			}
			return {
				cancel: true
			};
		}
	}
	return;
}, {
	urls: ['http://*/*', 'https://*/*', 'ws://*/*', 'wss://*/*', 'file:///*', 'ftp://*/*']
}, ['blocking', 'requestBody']);
//===
browser.webRequest.onHeadersReceived.addListener(function (reqinfo) {
	if (tprq_poponoff == 1) {
		if (!tprq_poponoff_ison) {
			return;
		}
	}
	if (reqinfo.url == undefined) {
		return;
	}
	var rqlink_dst = document.createElement('a');
	rqlink_dst.setAttribute('href', reqinfo.url);
	var rq_dst_host = rqlink_dst.hostname;
	var rq_dst_prot = rqlink_dst.protocol;
	rqlink_dst = null;
	if (rq_dst_prot != 'http:' && rq_dst_prot != 'https:') {
		return;
	}
	var resphead = reqinfo.responseHeaders;
	var r_isJSallowed = is_js_allowed(rq_dst_host, rq_dst_prot);
	var r_isJSmustdie = (tprq_jsfilter == 1 && r_isJSallowed == 0) ? true : false;
	var r_csp_updated = false;
	var r_xsp_updated = false;
	var r_mitm_found = false;
	var r_name, r_value, _twsv, _tmpCKIE;
	var _blockscr = '';
	for (var i = 0; i < resphead.length; i++) {
		r_name = resphead[i]['name'].toLowerCase();
		if (tprq_scan_mitm >= 1) {
			if (r_name == 'cf-ray' || r_name == 'cf-cache-status' || r_name == 'cf-chl-bypass') {
				r_mitm_found = true;
				continue;
			}
			if (tprq_nomitm_inc == 1) {
				if (r_name == 'x-iinfo' || (r_name.includes('incap_') && !r_name.includes('x-archive-'))) {
					r_mitm_found = true;
					continue;
				}
			}
			if (tprq_nomitm_ggl == 1) {
				if (r_name == 'x-shield-request-id') {
					r_mitm_found = true;
					continue;
				}
			}
			if (tprq_nomitm_scu == 1) {
				if (r_name == 'x-sucuri-cache' || r_name == 'x-sucuri-id') {
					r_mitm_found = true;
					continue;
				}
			}
		}
		if (r_name == 'content-security-policy') {
			resphead[i]['value'] = set_cspvalue(resphead[i]['value'], rq_dst_host, r_isJSmustdie, r_isJSallowed);
			r_csp_updated = true;
			continue;
		}
		if (r_name == 'content-security-policy-report-only') {
			resphead[i]['value'] = '';
			continue;
		}
		if (r_name == 'x-xss-protection') {
			if (tprq_jsnoxss == 1) {
				resphead[i]['value'] = '1; mode=block';
				r_xsp_updated = true;
			};
			continue;
		}
		if (r_name == 'alt-svc' || r_name == 'alternate-protocol') {
			if (tprq_ignh_altsvc == 1) {
				resphead[i]['value'] = 'clear';
				continue;
			}
		}
		if (r_name == 'etag') {
			if (tprq_ignh_etag == 1) {
				resphead[i]['value'] = '';
				continue;
			}
		}
		if (r_name == 'expect-ct') {
			if (tprq_ignh_expct == 1) {
				resphead[i]['value'] = 'max-age=300';
				continue;
			}
		}
		if (r_name == 'x-dns-prefetch-control') {
			if (tprq_ignh_xdnspf == 1) {
				resphead[i]['value'] = 'off';
				continue;
			}
		}
		if (r_name == 'content-type') {
			r_value = resphead[i]['value'].toLowerCase();
			if (tprq_mime_av == 1) {
				if (r_value.startsWith('video/') || r_value.startsWith('audio/') || r_value == 'application/ogg' || r_value == 'text/vtt') {
					console.log('TPRB: MIME Blocked:', r_value, reqinfo.url);
					return {
						cancel: true
					};
					break;
				}
			}
			if (tprq_mime_pdf == 1) {
				if (r_value == 'application/pdf') {
					console.log('TPRB: MIME Blocked:', r_value, reqinfo.url);
					return {
						cancel: true
					};
					break;
				}
			}
			if (tprq_mime_office == 1) {
				if (/^application\/(msaccess|msexcel|mspowerpoint|msword|vnd\.(ms-excel|ms-office|ms-powerpoint|ms-word|oasis\.opendocument|openofficeorg|openxmlformats-officedocument|stardivision|sun\.xml)(.*))$/.test(r_value)) {
					console.log('TPRB: MIME Blocked:', r_value, reqinfo.url);
					return {
						cancel: true
					};
					break;
				}
			}
			if (tprq_jsfilter == 1) {
				if (reqinfo.type == 'script' || r_value.includes('javascript') || r_value.includes('ecmascript')) {
					add_js_history(rq_dst_host);
					if (r_isJSallowed == 0) {
						return {
							cancel: true
						};
						break;
					}
				}
			}
			continue;
		}
		if (r_name == 'location' || r_name == 'refresh') {
			if (tprq_scan_shortu >= 1 && reqinfo.type == 'main_frame') {
				if (tprq_scan_shortu == 1) {
					if (!['0oo.jp', '1drv.ms', '3w.to', '5i5.co', '7.ly', 'adfoc.us', 'admy.link', 'al.ly', 'amzn.to', 'b1t.io', 'bc.vc', 'be.cm', 'bit.do', 'bit.ly', 'bitly.com', 'budurl.com', 'cli.gs', 'clicky.me', 'cur.lv', 'cutt.us', 'djmp.jp', 'doiop.com', 'elbo.in', 'fave.co', 'fb.me', 'flic.kr', 'fur.ly', 'g.co', 'git.io', 'goo.gl', 'hec.su', 'inf.to', 'is.gd', 'ity.im', 'j.mp', 'kl.am', 'lc.chat', 'libr.ae', 'lnked.in', 'mcaf.ee', 'nico.ms', 'nn.bb', 'num.to', 'onl.li', 'onl.social', 'ouo.io', 'ow.ly', 'ph.dog', 'plu.sh', 'po2.red', 'prt.nu', 'qr.net', 'r10.to', 'redd.it', 's.id', 'safe.mn', 'sh.st', 'shar.es', 'shrinkurl.in', 'soo.gd', 'sptfy.com', 'su.pr', 't.co', 'thinfi.com', 'tiny.cc', 'tinyurl.com', 'tldrify.com', 'tr.im', 'u.nu', 'u.to', 'urlr.in', 'urx.blue', 'urx.nu', 'ustre.am', 'v.gd', 'waa.ai', 'xtw.me', 'y2u.be', 'yep.it', 'youtu.be', 'zi.ma', 'zzb.bz', 'mzl.la', 'dlvr.it'].includes(rq_dst_host)) {
						continue;
					}
				}
				r_value = resphead[i]['value'];
				if (r_name == 'refresh') {
					if (r_value.includes(';url=http')) {
						r_value = r_value.split(';url=', 2)[1];
					} else {
						continue;
					}
				}
				if (r_value.startsWith('http://') || r_value.startsWith('https://')) {
					if (tprq_aured_ignr == 3) {
						if (get_realdomain((new URL(r_value)).hostname) == get_realdomain(rq_dst_host)) {
							continue;
						}
					}
					if (tprq_aured_ignr == 4) {
						if (get_realdomain((new URL(r_value)).hostname).split('.')[0] == get_realdomain(rq_dst_host).split('.')[0]) {
							continue;
						}
					}
					var _tmp_ufrm = (reqinfo.originUrl != undefined) ? encodeURI(reqinfo.originUrl) : 'about:blank';
					if (!_tmp_ufrm.startsWith('http')) {
						_tmp_ufrm = 'about:blank';
					}
					if (tprq_aured_confirm) {
						_blockscr = 'window.stop();if (confirm("TPRB: %%SHURL_TITLE%%\\n\\n%%SHURL_OSRC%%:\\n%%SHURL_SRC%%\\n\\n%%SHURL_ODST%%:\\n%%SHURL_DST%%")){setTimeout(function(){location.href=\'%%SHURL_DST%%\';return false;},1);}else{setTimeout(function(){location.href=\'%%SHURL_ORG%%\';return false;},1);}'.replace('%%SHURL_TITLE%%', tprq_mylang['ardir_t']).replace('%%SHURL_OSRC%%', tprq_mylang['ardir_s']).replace('%%SHURL_ODST%%', tprq_mylang['ardir_d']).replace('%%SHURL_SRC%%', encodeURI(reqinfo.url)).replace('%%SHURL_DST%%', encodeURI(r_value)).replace('%%SHURL_DST%%', encodeURI(r_value)).replace('%%SHURL_ORG%%', _tmp_ufrm);
					} else {
						_blockscr = '<html id="resetall"><head><meta charset="utf-8"><title>TPRB:[Alert]</title><meta name="viewport" content="width=device-width,initial-scale=1"><style>#resetall {all:revert}body,td{font:13px Verdana;background-color:#f9f9fa;overflow:hidden}td{vertical-align:middle;text-align:center;word-break:break-all;white-space:normal;max-width:350px;width:350px}a,a:visited,a:hover,a:active{color:inherit;text-decoration:none}</style></head><body><div align="center"><br><br><h3>&#8505;&nbsp;%%SHURL_TITLE%%</h3><br><table border="1" cellspacing="1" cellpadding="1"><tr><td>%%SHURL_SRC%%</td><td>%%SHURL_DST%%</td></tr></table><br><br><a href="%%SHURL_ORG%%" rel="noreferrer"><b>&#215;&nbsp;[</b>&nbsp;%%SHURL_BACK%%&nbsp;<b>]</b></a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href="%%SHURL_DST%%" rel="noreferrer"><b>&#x2713;&nbsp;[</b>&nbsp;%%SHURL_GONOW%%&nbsp;<b>]</b></a></div></body></html>'.replace('%%SHURL_TITLE%%', tprq_mylang['ardir_t']).replace('%%SHURL_BACK%%', tprq_mylang['ardir_b']).replace('%%SHURL_GONOW%%', tprq_mylang['ardir_n']).replace('%%SHURL_SRC%%', encodeURI(reqinfo.url)).replace('%%SHURL_DST%%', encodeURI(r_value)).replace('%%SHURL_DST%%', encodeURI(r_value)).replace('%%SHURL_ORG%%', _tmp_ufrm);
						_blockscr = 'window.stop();document.documentElement.innerHTML=decodeURIComponent(Array.prototype.map.call(atob(\'' + btoa(encodeURIComponent(_blockscr).replace(/%([0-9A-F]{2})/g, function (match, p1) {
							return String.fromCharCode(parseInt(p1, 16))
						})) + '\'),function(c){return \'%\' + (\'00\' + c.charCodeAt(0).toString(16)).slice(-2);}).join(\'\'));window.stop();';
					}
					resphead[i]['value'] = '';
					continue;
				}
			}
		}
	}
	//_Action
	if (r_mitm_found) {
		if (is_mitm_host(rq_dst_host)) {
			if (tprq_bkt_mitms.length > 30) {
				tprq_bkt_mitms.shift();
			}
			if (!tprq_bkt_mitms.includes(rq_dst_host)) {
				tprq_bkt_mitms.push(rq_dst_host);
			}
			if (tprq_scan_mitm == 1) {
				browser.tabs.executeScript(reqinfo.tabId, {
					matchAboutBlank: true,
					runAt: 'document_end',
					code: 'window.stop();alert("TPRB: %%WRN_TITLE%%\\n\\n%%WRN_ACTN%%\\n%%WRN_DST%%");'.replace('%%WRN_TITLE%%', tprq_mylang['nf_dtmitm']).replace('%%WRN_ACTN%%', tprq_mylang['nf_acted']).replace('%%WRN_DST%%', rq_dst_host)
				});
				console.log('TPRB: Blocked: MITM:', rq_dst_host);
				return {
					cancel: true
				};
			} else {
				if (tprq_nomitm_s403 == 0 || (tprq_nomitm_s403 == 1 && reqinfo.statusCode == 403)) {
					console.log('TPRB: MITM Detected:', rq_dst_host);
					return {
						redirectUrl: 'https://web.archive.org/web/' + reqinfo.url
					};
				}
			}
		}
	}
	if (!r_xsp_updated && tprq_jsnoxss == 1) {
		resphead.push({
			'name': 'X-XSS-Protection',
			'value': '1; mode=block'
		});
	}
	if (!r_csp_updated) {
		resphead.push({
			'name': 'Content-Security-Policy',
			'value': set_cspvalue('', rq_dst_host, r_isJSmustdie, r_isJSallowed)
		});
	}
	if (tprq_scan_shortu >= 1 && _blockscr != '') {
		browser.tabs.executeScript(reqinfo.tabId, {
			matchAboutBlank: true,
			runAt: 'document_end',
			code: _blockscr
		});
		console.log('TPRB: Redirection detected:', reqinfo.url);
	}
	return {
		responseHeaders: resphead
	};
}, {
	urls: ['http://*/*', 'https://*/*']
}, ['blocking', 'responseHeaders']);
//===
browser.webRequest.onBeforeSendHeaders.addListener(function (reqinfo) {
	if (tprq_poponoff == 1) {
		if (!tprq_poponoff_ison) {
			return;
		}
	}
	if (reqinfo.url == undefined) {
		return;
	}
	if (tprq_smartref == 0) {
		return;
	}
	var rqlink_dst = document.createElement('a');
	rqlink_dst.setAttribute('href', reqinfo.url);
	var rq_dst_host = rqlink_dst.hostname;
	var rq_dst_prot = rqlink_dst.protocol;
	rqlink_dst = null;
	if (rq_dst_prot != 'http:' && rq_dst_prot != 'https:') {
		return;
	}
	var reqshead = reqinfo.requestHeaders;
	var r_name, r_value;
	for (var i = 0; i < reqshead.length; i++) {
		r_name = reqshead[i]['name'].toLowerCase();
		if (r_name == 'referer') {
			if (tprq_smartref == 1) {
				var rqlink_src = document.createElement('a');
				rqlink_src.setAttribute('href', reqshead[i]['value']);
				var rq_src_host = rqlink_src.hostname;
				var rq_src_prot = rqlink_src.protocol;
				var rq_src_path = rqlink_src.pathname;
				rqlink_src = null;
				if (rq_src_prot != 'http:' && rq_src_prot != 'https:') {
					continue;
				} //abnormal
				if (rq_src_host == rq_dst_host) {
					continue;
				} //same webmaster
				if (get_realdomain(rq_src_host).split('.', 2)[0] == get_realdomain(rq_dst_host).split('.', 2)[0]) {
					continue;
				} //probably same domain owner(moz.com-moz.net)
				if (rq_src_prot != rq_dst_prot) {
					reqshead[i]['value'] = '';
					continue;
				} //switching protocol
				if (reqinfo.type == 'main_frame') {
					reqshead[i]['value'] = '';
				} else {
					if (rq_src_path != '/') {
						reqshead[i]['value'] = rq_src_prot + '//' + rq_src_host + '/';
					}
				}
			};
			continue;
		}
	}
	return {
		requestHeaders: reqshead
	};
}, {
	urls: ['http://*/*', 'https://*/*']
}, ['blocking', 'requestHeaders']);
//===
browser.webRequest.onCompleted.addListener(function (reqinfo) { // collect DNS
	if (tprq_popshowip == 0 && tprq_popshowcc == 0) {
		return;
	}
	if (reqinfo.type != 'main_frame') {
		if (tprq_popshowsubs == 0) {
			return;
		}
	}
	if (reqinfo.ip == null || reqinfo.url == undefined) {
		return;
	}
	if (tprq_usednsapi == 1 && reqinfo.url == tprq_dnsapi_url) {
		return;
	}
	var rqlink_dst = document.createElement('a');
	rqlink_dst.setAttribute('href', reqinfo.url);
	var rq_dst_host = rqlink_dst.hostname;
	rqlink_dst = null;
	if (is_ip_addr(rq_dst_host) || /^(.*)\.(i2p|invalid|localhost|onion|setup|test)$/.test(rq_dst_host)) {
		return;
	}
	if (tprq_dnspair[rq_dst_host] == undefined) {
		if (reqinfo.proxyInfo == null) {
			if (is_ip_addr(reqinfo.ip)) {
				tprq_dnspair[rq_dst_host] = [];
				tprq_dnspair[rq_dst_host][0] = reqinfo.ip;
				tprq_dnspair[rq_dst_host][1] = get_geo_cc(reqinfo.ip);
			}
		} else {
			if (tprq_usednsapi == 1) {
				try {
					fetch(tprq_dnsapi_url, {
						method: 'POST',
						mode: 'cors',
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded'
						},
						referrer: '',
						body: 'f=' + rq_dst_host
					}).then(function (_g0) {
						return _g0.json();
					}).then(function (_g) {
						if (_g[0]) {
							if (is_ip_addr(_g[1])) {
								tprq_dnspair[rq_dst_host] = [];
								tprq_dnspair[rq_dst_host][0] = _g[1];
								tprq_dnspair[rq_dst_host][1] = get_geo_cc(_g[1]);
							}
						} else {
							console.log('TPRB: DNSAPI: BadResponse:', rq_dst_host, _g);
						}
					}).catch(function (e) {
						console.log('TPRB: DNSAPI: Error2:', e);
					});
				} catch (_e) {
					console.log('TPRB: DNSAPI: Error1:', _e);
				}
			}
		}
		if (Object.keys(tprq_dnspair).length >= 230) {
			for (var k in tprq_dnspair) {
				break;
			};
			if (k != '' && tprq_dnspair[k] != undefined) {
				tprq_dnspair[k] = null;
				delete tprq_dnspair[k];
			}
		}
	}
	return;
}, {
	urls: ['http://*/*', 'https://*/*', 'ws://*/*', 'wss://*/*', 'ftp://*/*']
});
//===
browser.runtime.onMessage.addListener(function (r, s, sr) {
	if (r[0] == 'pop') {
		if (tprq_init == 2) {
			if (!tprq_amdroid) {
				sr(tprq_make_popup(r[1], r[2], r[3]));
				tprq_updicon(r[1], r[4]);
			} else {
				sr(tprq_make_popup(r[1], r[2], r[3]));
			}
		} else {
			sr(null);
		}
	}
	if (r[0] == 'rld') {
		rqbl_loadcfg();
		sr(['ok']);
	} // from options
	if (r[0] == 'upd') {
		var tmp_rul = r[2];
		var tmp_rul_len = tmp_rul.length;
		if (tmp_rul_len > 0) {
			for (var j = 0; j < tmp_rul_len; j++) {
				if (tmp_rul[j][0].length >= 1 && tmp_rul[j][1].length >= 1) {
					if (tmp_rul[j][2]) {
						tprq_modwl_add(tmp_rul[j][0], tmp_rul[j][1], r[1], tmp_rul[j][3]);
					} else {
						tprq_modwl_remove(tmp_rul[j][0], tmp_rul[j][1], r[1], tmp_rul[j][3]);
					}
				}
			}
		}
		tmp_rul = r[3];
		tmp_rul_len = tmp_rul.length;
		if (tmp_rul_len > 0) {
			for (var j = 0; j < tmp_rul_len; j++) {
				if (tmp_rul[j][0].length >= 1) {
					if (tmp_rul[j][1]) {
						tprq_modjs_add(tmp_rul[j][0], tmp_rul[j][2], tmp_rul[j][3]);
					} else {
						tprq_modjs_remove(tmp_rul[j][0], tmp_rul[j][2]);
					}
				}
			}
		}
		//junk cleanup
		for (var t in tprq_whitelist) {
			if (tprq_whitelist[t].length == 0) {
				tprq_whitelist[t] = [];
				delete tprq_whitelist[t];
			}
		}
		var _twtk = '';
		var _twti = 0;
		for (var t in tprq_whitetemp) {
			if (_twtk == '') {
				_twtk = t;
			}
			_twti += 1;
			if (_twti == 19) {
				if (tprq_whitetemp[_twtk] != undefined && _twtk != '') {
					tprq_whitetemp[_twtk] = [];
					delete tprq_whitetemp[_twtk];
				}
			} // keep 19 templist
			if (tprq_whitetemp[t].length == 0) {
				tprq_whitetemp[t] = [];
				delete tprq_whitetemp[t];
			}
		}
		if (tprq_tmpok_js.length > 190) {
			tprq_tmpok_js.shift();
			tprq_tmpok_js.shift();
		}
		//save
		browser.storage.local.set({
			myset_rqblwhitelist: array2text(tprq_whitelist)
		});
		browser.storage.local.set({
			myset_rqbljsoklist: tprq_oklist_js.join("\n")
		});
		sr(['ok', (tprq_popnarld != 1 || (r[2].length >= 1 || r[3].length >= 1)) ? true : false]);
	}
	if (r[0] == 'onf') {
		if (tprq_poponoff == 1) {
			tprq_tab_dst[r[1]] = [];
			if (tprq_poponoff_ison) {
				tprq_poponoff_ison = false;
				browser.browserAction.setTitle({
					tabId: r[1],
					title: "TPRB (OFF)"
				});
				browser.browserAction.setBadgeText({
					tabId: r[1],
					text: "OFF!"
				});
				browser.browserAction.setIcon({
					tabId: r[1],
					path: 'icons/icon-32.png'
				});
			} else {
				tprq_poponoff_ison = true;
				browser.browserAction.setTitle({
					tabId: r[1],
					title: "TPRB"
				});
				browser.browserAction.setBadgeText({
					tabId: r[1],
					text: ""
				});
				browser.browserAction.setIcon({
					tabId: r[1],
					path: tprq_flags[0]
				});
			}
		} else {
			tprq_poponoff_ison = true;
		}
		sr(['ok']);
	}
	if (r[0] == 'ison') {
		var tmpisJSActv = (tprq_jsfilter == 1) ? false : true;
		if (!tmpisJSActv) {
			if (tprq_jslineok == 1 || is_js_allowed(r[1], r[2]) > 0) {
				tmpisJSActv = true;
			}
		}
		sr([(tprq_poponoff == 1) ? tprq_poponoff_ison : true, (tprq_tac_ignlst.includes(r[1]) || tprq_tac_ignlst.includes('.' + get_realdomain(r[1]))) ? false : true, tprq_bkt_mitms.includes(r[1]), tmpisJSActv]);
	}
	return true;
});
browser.tabs.onCreated.addListener(function (t) {
	if (tprq_newtab_mute) {
		browser.tabs.update(t.id, {
			muted: true
		});
	}
});
browser.tabs.onActivated.addListener(function (i) {
	browser.tabs.query({
		active: true,
		currentWindow: true
	}).then(function (t) {
		tprq_updicon(t[0].id, t[0].url);
	}, onError);
});
browser.tabs.onRemoved.addListener(function (t, r) {
	tprq_tab_dst[t] = [];
	delete tprq_tab_dst[t];
	if (tprq_mustcleanup) {
		cleaning_service();
	}
});
browser.tabs.onUpdated.addListener(function (td, ci, ti) {
	if (ti.active) {
		tprq_updicon(ti.id, ti.url);
	}
});
browser.webNavigation.onDOMContentLoaded.addListener(function (d) {
	browser.tabs.query({
		active: true,
		currentWindow: true
	}).then(function (t) {
		if (t[0]) {
			tprq_updicon(t[0].id, t[0].url);
		}
	}, onError);
});
browser.webNavigation.onCompleted.addListener(function (d) {
	browser.tabs.query({
		active: true,
		currentWindow: true
	}).then(function (t) {
		if (t[0]) {
			tprq_updicon(t[0].id, t[0].url);
		}
	}, onError);
});
browser.downloads.onCreated.addListener(function (i) {
	if (tprq_poponoff == 0 || (tprq_poponoff == 1 && tprq_poponoff_ison)) {
		if ((tprq_nodlact == 2 && !i.url.startsWith('blob:' + browser.extension.getURL(''))) || (tprq_nodlact == 1 && (i.url.startsWith('http://') || i.url.startsWith('https://')))) {
			browser.downloads.cancel(i.id).then(function () {
				console.log('TPRB: Download Canceled:', i.url);
			}, onError);
		}
	}
});
if (!tprq_amdroid) {
	browser.contextMenus.onClicked.addListener(function (i, t) {
		if (t.active && t.id) {
			var _tuurl = new URL(t.url);
			if ((_tuurl.protocol == 'http:' || _tuurl.protocol == 'https:') && _tuurl.hostname.length >= 2) {
				if (i.menuItemId == 'tprb_ctxmnu_pop') {
					browser.tabs.query({
						title: 'TPRB'
					}).then(function (qt) {
						var _isopen = false;
						if (qt.length >= 1) {
							for (var _i = 0; _i < qt.length; _i++) {
								if (/^moz-extension:\/\/(.*)\/tprb_dlg\.html\?=ctx\/([0-9]{1,})$/.test(qt[_i].url)) {
									_isopen = true;
									break;
								}
							}
						}
						if (!_isopen) {
							browser.tabs.create({
								active: true,
								url: browser.extension.getURL('tprb_dlg.html?=ctx/' + t.id)
							});
						} else {
							browser.tabs.update(qt[_i].id, {
								active: true,
								url: browser.extension.getURL('tprb_dlg.html?=ctx/' + t.id)
							});
						}
					}, onError);
				}
				if (i.menuItemId == 'tprb_ctxmnu_addcdb') {
					if (!tprq_black_nrml.includes(_tuurl.hostname)) {
						tprq_black_nrml.push(_tuurl.hostname);
						browser.storage.local.set({
							myset_rqblblacklist: tprq_black_regx.concat(tprq_black_nrml).join("\n")
						});
						console.log('TPRB: CTX: added:', _tuurl.hostname);
						if (tprq_fwdom == 0) {
							tprq_fwdom = 1;
						};
						browser.tabs.executeScript(t.id, {
							matchAboutBlank: true,
							runAt: 'document_end',
							code: 'history.go(-1);'
						});
					} else {
						browser.tabs.executeScript(t.id, {
							matchAboutBlank: true,
							runAt: 'document_end',
							code: 'window.stop();alert("TPRB: %%NTC_TITLE%%\\n\\n%%NTC_MSG%%\\n%%NTC_DST%%");'.replace('%%NTC_TITLE%%', tprq_mylang['ctxa']).replace('%%NTC_MSG%%', tprq_mylang['ctxa_ae']).replace('%%NTC_DST%%', _tuurl.hostname)
						});
					}
				}
				if (i.menuItemId == 'tprb_ctxmnu_addcfw') {
					if (!tprq_tac_ignlst.includes(_tuurl.hostname)) {
						tprq_tac_ignlst.push(_tuurl.hostname);
						browser.storage.local.set({
							myset_rqblcftrwhite: tprq_tac_ignlst.join("\n")
						});
						console.log('TPRB: CTX: added:', _tuurl.hostname);
						browser.tabs.reload(t.id, {
							bypassCache: true
						});
					} else {
						browser.tabs.executeScript(t.id, {
							matchAboutBlank: true,
							runAt: 'document_end',
							code: 'window.stop();alert("TPRB: %%NTC_TITLE%%\\n\\n%%NTC_MSG%%\\n%%NTC_DST%%");'.replace('%%NTC_TITLE%%', tprq_mylang['ctxa']).replace('%%NTC_MSG%%', tprq_mylang['ctxa_ae']).replace('%%NTC_DST%%', _tuurl.hostname)
						});
					}
				}
				if (i.menuItemId == 'tprb_ctxmnu_addmit') {
					if (!tprq_mitmoklist.includes(_tuurl.hostname)) {
						tprq_mitmoklist.push(_tuurl.hostname);
						browser.storage.local.set({
							myset_rqblmitmoklist: tprq_mitmoklist.join("\n")
						});
						console.log('TPRB: CTX: added:', _tuurl.hostname);
						browser.tabs.reload(t.id, {
							bypassCache: true
						});
					} else {
						browser.tabs.executeScript(t.id, {
							matchAboutBlank: true,
							runAt: 'document_end',
							code: 'window.stop();alert("TPRB: %%NTC_TITLE%%\\n\\n%%NTC_MSG%%\\n%%NTC_DST%%");'.replace('%%NTC_TITLE%%', tprq_mylang['ctxa']).replace('%%NTC_MSG%%', tprq_mylang['ctxa_ae']).replace('%%NTC_DST%%', _tuurl.hostname)
						});
					}
				}
			}
		}
	});
	browser.commands.onCommand.addListener(function (c) {
		if (tprq_kb_act >= 0) {
			browser.tabs.query({
				active: true,
				currentWindow: true
			}).then(function (t) {
				if (t[0]) {
					var _tuurl = new URL(t[0].url);
					if ((_tuurl.protocol == 'http:' || _tuurl.protocol == 'https:') && _tuurl.hostname.length >= 2) {
						if (tprq_kb_act == 0) {
							browser.tabs.query({
								title: 'TPRB'
							}).then(function (qt) {
								var _isopen = false;
								if (qt.length >= 1) {
									for (var _i = 0; _i < qt.length; _i++) {
										if (/^moz-extension:\/\/(.*)\/tprb_dlg\.html\?=ctx\/([0-9]{1,})$/.test(qt[_i].url)) {
											_isopen = true;
											break;
										}
									}
								}
								if (!_isopen) {
									browser.tabs.create({
										active: true,
										url: browser.extension.getURL('tprb_dlg.html?=ctx/' + t[0].id)
									});
								} else {
									browser.tabs.update(qt[_i].id, {
										active: true,
										url: browser.extension.getURL('tprb_dlg.html?=ctx/' + t[0].id)
									});
								}
							}, onError);
						}
						if (tprq_kb_act == 1) {
							if (!tprq_tac_ignlst.includes(_tuurl.hostname)) {
								tprq_tac_ignlst.push(_tuurl.hostname);
								browser.storage.local.set({
									myset_rqblcftrwhite: tprq_tac_ignlst.join("\n")
								});
								console.log('TPRB: CTX: added:', _tuurl.hostname);
								browser.tabs.reload(t[0].id, {
									bypassCache: true
								});
							} else {
								browser.tabs.executeScript(t[0].id, {
									matchAboutBlank: true,
									runAt: 'document_end',
									code: 'window.stop();alert("TPRB: %%NTC_TITLE%%\\n\\n%%NTC_MSG%%\\n%%NTC_DST%%");'.replace('%%NTC_TITLE%%', tprq_mylang['kbsa']).replace('%%NTC_MSG%%', tprq_mylang['ctxa_ae']).replace('%%NTC_DST%%', _tuurl.hostname)
								});
							}
						}
					}
					if (tprq_kb_act == 2) {
						if (tprq_poponoff == 1) {
							tprq_poponoff_ison = !tprq_poponoff_ison;
							browser.tabs.reload(t[0].id, {
								bypassCache: true
							});
						} else {
							tprq_poponoff_ison = true;
						}
					}
				}
			}, onError);
		}
	});
}
