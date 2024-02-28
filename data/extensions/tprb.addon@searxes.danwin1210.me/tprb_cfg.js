var _docbase = 'https://searxes.danwin1210.me/collab/tprb0/getmemo.php?client=searxes-tprb&read=/';
var tprq_i18n_cfg_en = {
	"moreinfo": "More information",
	"udsd_impexp": "Import/Export",
	"udsd_impexpupldwn": "Import/Export/Upload/Download",
	"aon_reset": "Factory defaults",
	"aon_resettxt_1": "Don't reset my whitelist/blacklist",
	"aon_resetme": "Reset addon",
	"aon_tool": "Text Editor",
	"cancelnow": "Cancel",
	"saveme": "Save",
	"saveme2": "Saved",
	"closeme": "Close",
	"showme": "Show",
	"resetme": "Reset",
	"sub_txt_1": "Whitelist",
	"sub_txt_8": "Blacklist",
	"sub_txt_2": "Filter",
	"sub_txt_7": "Contents",
	"sub_txt_6": "Redirect",
	"sub_txt_3": "Script",
	"sub_txt_9": "Browser",
	"sub_txt_4": "Design",
	"sub_txt_5": "Misc.",
	"fqdnordomain": "FQDN or .DOMAIN",
	"yourwhitelist_format": "format: source destination",
	"yourwhitelist_format2": "source, destination -- FQDN, *, or .DOMAIN",
	"yourwhitelist_format3": "valid: '* F', '* .D', 'F F', 'F *', 'F .D', '.D F', '.D *', '.D .D'",
	"yourwhitelist_format4": "extra: '* U', 'F U', '.D U'",
	"yourwhitelist_format5": "extra: '* R', 'F R', '.D R'",
	"yourblacklist_format": "format: destination",
	"yourblacklist_format2": "destination -- FQDN or .DOMAIN",
	"yourblacklist_format3": "extra: RegExp",
	"whiteimpexp": "Import/Export whitelist",
	"whiteimpexp2": "Import/Export Javascript whitelist",
	"whiteimpexp3": "Import/Export blacklist",
	"whiteimpexp4": "Import/Export content filter whitelist",
	"whiteimpexp5": "Import/Export MITM ignore list",
	"whiteimpexp5b": "Import/Export custom redirection rule",
	"whiteimpexp_impt": "Import",
	"whiteimpexp_impttip": "(don't forget to click Save)",
	"whiteimpexp_impt2": "Merge new data instead of replacing current list",
	"whiteimpexp_expt": "Export",
	"listsync": "Upload/Download whitelist",
	"listsync_transid": "Transaction ID",
	"listsync_sysmsg": "System Message",
	"listsync_upload": "New Upload",
	"listsync_downloado": "Download & Replace",
	"listsync_downloadm": "Download & Merge",
	"listsync_destroy": "Destroy Data",
	"listsync_startup": "Ready.",
	"listsync_m_noapi": "API URL is empty!",
	"listsync_m_notid": "Transaction ID is empty!",
	"listsync_m_notid2": "Transaction ID not found.",
	"listsync_m_nosvresp": "Connection failed.",
	"listsync_m_nowlst": "Your whitelist is empty.",
	"listsync_m_dstrydone": "Data destroyed.",
	"listsync_m_connecting": "Connecting. Please wait.",
	"listsync_m_upldone": "Upload complete.",
	"listsync_m_dwndone": "Download complete.",
	"adv_alwaysokay": "Always allow",
	"advanced_css": "Third-party CSS resource",
	"advanced_subdom": "Same domain's subdomain",
	"advanced_aok_wuz": "Widely used domain pattern",
	"advanced_aok_cdnf": "Known CDN FQDN",
	"advanced_aok_cdnd": "Known CDN domain",
	"advanced_aok_ytb": "YouTube",
	"advanced_aok_htps": "only if its protocol is https://",
	"advanced_separatecd": "Forbid clearnet and .onion|.i2p to communicate with each other",
	"adv_geoip": "Load GeoIP database",
	"geo_clear": "Clear data",
	"adv_noprotect": "Disable TPRB's protection",
	"advanced_mixok": "Turn off strict mixed-content protection",
	"advanced_l2iok": "Allow loading internet resource from file://",
	"advanced_blkftp": "Block ftp:// protocol",
	"advanced_csmyaqs": "Custom CSS selectors",
	"advanced_csmyaqs2": "CSS selectors",
	"adv_contentfilter": "Content filtering",
	"advanced_noiframe": "Hide 'IFRAME' html tag",
	"advanced_nocanvas": "Hide 'CANVAS' html tag",
	"adv_dearevilpage": "Stop unethical websites from tracking your activity",
	"acf_ah_rclk": "Right-click event",
	"acf_ah_keys": "Keyboard event",
	"acf_ah_scrl": "Mouse scroll event",
	"acf_ah_mmove": "Mouse movement event",
	"acf_ah_touch": "Touch movement event",
	"acf_ah_zerowc": "Remove zero-width character",
	"adv_dnrcfonpage": "Content filter whitelist",
	"advanced_settemp": "Let user set temporary permissions",
	"advanced_fmtsrcurl": "Enable 'source destination=URL' format",
	"advanced_fmtsrcrxp": "Enable 'source destination=RegExp' format",
	"advanced_fmtsrcrxp2": "Enable 'destination=RegExp' format",
	"advanced_smartref": "Remove identifiable information from outgoing Referer header",
	"advanced_myrecset": "Modify privacy-related settings",
	"advanced_nonotifypop": "Disable notification and popup",
	"dropheader": "Modify header received from server",
	"adv_dropheader0": "Alt-Svc/Alternate-Protocol (Ignore value)",
	"adv_dropheader1": "Expect-CT (Stop reporting)",
	"adv_dropheader2": "X-DNS-Prefetch-Control (Turn off prefetch)",
	"adv_dropheader3": "ETag (Ignore value)",
	"nodownloadok": "Cancel a download automatically (prevent download)",
	"advanced_nodownk_1": "Download from the internet",
	"advanced_nodownk_2": "Any download (file:, blob:, etc)",
	"antiannoyance": "Anti-annoyance",
	"advanced_nogifani": "Play the animation only once",
	"advanced_notabsound": "Mute all tabs by default",
	"autocleaner": "When I close (x) tabs and (y) minutes passed since last time, clean them up",
	"autocln_ct_cookies": "Cookies",
	"autocln_ct_storage": "Local storage created by websites",
	"autocln_ct_cache": "Browser's cache",
	"autocln_ct_fdata": "Autofilling forms and saved password",
	"autocln_ct_history": "Browsing history",
	"autocln_ct_downs": "Download history",
	"autocln_ct_plugin": "Data stored by browser plugins",
	"advanced_usekblnk": "Enable keyboard shortcut",
	"advanced_usekblnk2": "Change Shortcut key",
	"advanced_usekblt0": "Open popup",
	"advanced_usekblt1": "Add to Content filter whitelist",
	"advanced_usekblt2": "Toggle ON|OFF",
	"advanced_letsblkjs": "I want to block Javascript and set permissions",
	"advanced_letsblkjs2": "Javascript Whitelist",
	"advanced_letsblkjs3": "format: FQDN, .DOMAIN, !FQDN, !.DOMAIN",
	"advanced_jsxss": "Block known XSS",
	"advanced_noworker": "Block Web Worker",
	"advanced_jsinline": "Always allow inline script",
	"adv_noscrtag": "'NOSCRIPT' HTML tag",
	"advanced_noscra_1": "Always hide them",
	"advanced_noscra_2": "Show them if scripts are blocked",
	"adv_igwblthem": "Ignore whitelist and block",
	"adv_igwblthem_puny": "Punycode domain",
	"adv_igwblthem_unenc": "Unencrypted requests",
	"adv_igwblthem_abnrml": "Abnormal request method",
	"adv_igwblthem_abnrml2": "allow only GET and POST",
	"adv_igwblthem_wsoks": "WebSocket protocol",
	"adv_igwblthem_wsoks2": "127.0.0.1 is whitelisted",
	"adv_igwblrest": "Ignore whitelist and block resource type",
	"adv_igwblrest_fnt": "beacon, csp_report, font, ping",
	"adv_igwblrest_obj": "object, object_subrequest",
	"adv_igwblrest_med": "media",
	"adv_igwblrest_med2": "video, audio",
	"adv_igwblrest_img": "image",
	"adv_igwblmime": "Ignore whitelist and block MIME type to prevent downloading",
	"adv_igwblmime_av": "video, audio",
	"adv_igwblmime_pdf": "PDF",
	"adv_igwblmime_off": "MS Office, LibreOffice",
	"adv_igwblmime_off2": "application/msword, etc",
	"adv_blkhidedst": "Block & Don't show these destinations in popup menu",
	"adv_blkhidedst_knwn": "Known tracking/ads attempt",
	"adv_blkhidedst_knwn2": "e.g. google-analytics.com",
	"adv_blkhidedst_socl": "Known social media/comment",
	"adv_blkhidedst_socl2": "e.g. Disqus comment system",
	"adv_popmenu": "Popup menu",
	"adv_popmenu_narld": "Apply: Don't reload webpage if rule is not changed",
	"adv_popmenu_uico": "Show useful icons",
	"adv_popmenu_dotf": "Show .DOMAIN",
	"adv_popmenu_btoffon": "Show ON|OFF switch",
	"advanced_btjshttps": "Javascript: Show 'HTTPS only' checkbox",
	"adv_popmenu_showip": "Show IP address",
	"adv_popmenu_showcc": "Show GeoIP Country",
	"adv_popmenu_showsubs": "Show IP|Country for third-party request",
	"adv_popuis_ics": "Useful icons (select up to 3 choices)",
	"adv_popuis_i0": "Custom URL",
	"adv_popuis_i1": "Robtex: Investigate domain",
	"adv_popuis_i2": "Qualys: SSL Server Test",
	"adv_popuis_i3": "Twitter: Share URL",
	"adv_popuis_i4": "Google Translate: Translate URL",
	"adv_popuis_i5": "Reddit: Share URL",
	"adv_popuis_i6": "via.hypothes.is: Proxy",
	"adv_popuis_i7": "Internet Archive: Cache",
	"adv_popuis_pxydns": "If you're using a proxy",
	"adv_popuis_pxydns1": "Use API to resolve FQDN",
	"adv_poprclk": "Popup right-click action",
	"adv_poprclk_1": "Toggle Select|Deselect All",
	"adv_poprclk_2": "Apply rule",
	"adv_poplblclk": "Popup FQDN area click action",
	"adv_poplbla_1": "Show Domain data",
	"adv_prsrtr": "Popup menu list",
	"adv_poprsrt_ck": "Sort by checked/unchecked",
	"adv_poprsrt_ckrr": "Sort by unchecked/checked",
	"adv_poprsrt_azck": "Sort alphabetically + checked/unchecked",
	"adv_poprsrt_azckrr": "Sort alphabetically + unchecked/checked",
	"adv_popstyle": "Popup menu style",
	"adv_popsty_0": "Classic",
	"adv_popsty_0a": "Classic (larger radio/checkbox)",
	"adv_popcolor": "Popup menu theme",
	"adv_popclr_blk": "Black",
	"adv_popclr_big": "Larger",
	"adv_ticotp": "Toolbar icon type",
	"adv_ticotp_def": "Default",
	"adv_tbbgclr": "Badge background color",
	"adv_tbbgclr_pik": "Use this color",
	"redr_cleansrch": "Remove unnecessary data from query string",
	"redr_justhtps": "Redirect http|ws to https|wss",
	"redr_justhtps2": "Ignore Filter - Unencrypted requests",
	"redr_mitmmark": "Change MITMed website's title, favicon, and website border",
	"misc_autoredir_what": "Stop automatic redirection and warn me",
	"misc_autoredir_lv0": "Do nothing",
	"misc_autoredir_lv1": "Known URL shortening services",
	"misc_autoredir_lv2": "All automatic redirection",
	"misc_autoredir_ignr": "Ignore redirection",
	"advanced_rdirno_3": "Same domain redirection",
	"advanced_rdirno_4": "'Domain name without TLD' is same",
	"misc_autoredir_ualert": "Show confirm dialog box instead of webpage",
	"redr_nomitm": "Resist Cloudflare PRISM 2.0",
	"redr_nomitm_lv0": "Submit yourself to Cloudflare.",
	"redr_nomitm_lv1": "Block request immediately.",
	"redr_nomitm_lv2": "Redirect request to Internet Archive.",
	"redr_nomitm_lv2if": "Only when status 403 is returned",
	"redr_nomitm_also": "Also resist",
	"redr_nomitm_giveup": "MITM ignore list",
	"info_fxandroid": "Some settings are hidden because you're using Android."
};
var mylangobj, tmp_ourl;
var _IsDroid = false;
var v_ls = location.search;

function onError(e) {
	console.log(`TPRB_CFG: Error:${e}`);
}

function b64du(str) {
	return decodeURIComponent(Array.prototype.map.call(atob(str), function (c) {
		return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
	}).join(''));
}

function b64eu(str) {
	return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (match, p1) {
		return String.fromCharCode(parseInt(p1, 16))
	}));
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

function get_clntxt(w) {
	return (w.slice().sort(function (a, b) {
		return a > b
	}).reduce(function (a, b) {
		if (a.slice(-1)[0] !== b) {
			a.push(b);
		};
		return a;
	}, [])).filter(v => v != '').join("\n");
}

function getihash(w) {
	var hash = 0;
	for (var i = 0; i < w.length; i++) {
		hash = ((hash << 5) - hash) + w.charCodeAt(i);
		hash |= 0;
	};
	if (hash < 0) {
		hash += 4294967296;
	};
	return hash;
}

function config_save(e) {
	e.preventDefault();
	document.getElementById('savenow').disabled = true;
	var tmp_lstd, rqi, _tryrgx;
	tmp_lstd = document.getElementById('myset_rqblwhitelist').value.split("\n");
	for (var i = 0; i < tmp_lstd.length; i++) {
		rqi = tmp_lstd[i].split(' ', 2);
		if (rqi.length == 2) {
			if (rqi[1].length > 3 && rqi[1].startsWith('*.')) {
				rqi[1] = rqi[1].replace('*.', '.');
			}
			if (rqi[1].startsWith('/')) {
				if (rqi[1].endsWith('/')) {
					rqi[1] = rqi[1].replace(/\/$/, '');
				}
				if (rqi[1].length < 4 || rqi[1].includes('||') || rqi[1].includes('//')) {
					rqi[1] = '';
				}
			} else {
				if (rqi[1].length > 1 && rqi[1].includes('*')) {
					rqi[1] = '';
				}
			}
			if (rqi[0] == '.' || rqi[1] == '.' || rqi[0].includes('..') || rqi[1].includes('..')) {
				rqi[0] = '';
			}
			if (!rqi[0].startsWith('.') && rqi[0] == rqi[1]) {
				rqi[0] = '';
			}
			rqi[0] = rqi[0].toLowerCase();
			rqi[1] = rqi[1].toLowerCase();
			if (rqi[1].startsWith('/')) {
				try {
					if ((new RegExp(rqi[1].replace(/^\//g, ''))).test('hi')) {
						_tryrgx = null;
					}
				} catch (z) {
					console.log(z);
					rqi[1] = '';
				}
			}
			if (/^([0-9a-z.*_\[\]\:-]{1,})$/.test(rqi[0]) && (/^([0-9a-z.*_\[\]\:-]{1,})$/.test(rqi[1]) || /^http(|s):\/\/([0-9a-z.*\+\(\)\/&\^%\$#@\!;_\[\]\:-]{5,})$/.test(rqi[1]) || /^\/([\^\$\|\?\!\\\(\)\{\}\+0-9a-z,.*_\[\]\:-]{3,})$/.test(rqi[1]))) {
				tmp_lstd[i] = rqi[0] + ' ' + rqi[1];
			} else {
				tmp_lstd[i] = '';
			}
		} else {
			tmp_lstd[i] = '';
		}
	}
	tmp_lstd = get_clntxt(tmp_lstd);
	browser.storage.local.set({
		myset_rqblwhitelist: tmp_lstd
	});
	document.getElementById('myset_rqblwhitelist').value = tmp_lstd;
	tmp_lstd = document.getElementById('myset_rqblblacklist').value.split("\n");
	for (var i = 0; i < tmp_lstd.length; i++) {
		tmp_lstd[i] = tmp_lstd[i].toLowerCase();
		if (!/^([0-9a-z._\[\]\:-]{4,})$/.test(tmp_lstd[i]) && !/^\/([\^\$\|\?\!\\\(\)\{\}\+0-9a-z,.*_\[\]\:-]{3,})$/.test(tmp_lstd[i])) {
			tmp_lstd[i] = '';
			continue;
		}
		if (tmp_lstd[i].startsWith('/')) {
			try {
				if ((new RegExp(tmp_lstd[i].replace(/^\//g, ''))).test('hi')) {
					_tryrgx = null;
				}
			} catch (z) {
				console.log(z);
				tmp_lstd[i] = '';
			}
		}
	}
	tmp_lstd = get_clntxt(tmp_lstd);
	browser.storage.local.set({
		myset_rqblblacklist: tmp_lstd
	});
	document.getElementById('myset_rqblblacklist').value = tmp_lstd;
	tmp_lstd = document.getElementById('myset_rqbljsoklist').value.split("\n");
	for (var i = 0; i < tmp_lstd.length; i++) {
		tmp_lstd[i] = tmp_lstd[i].toLowerCase();
		if (!/^([\!0-9a-z._\[\]\:-]{4,})$/.test(tmp_lstd[i])) {
			tmp_lstd[i] = '';
		}
	}
	tmp_lstd = get_clntxt(tmp_lstd);
	browser.storage.local.set({
		myset_rqbljsoklist: tmp_lstd
	});
	document.getElementById('myset_rqbljsoklist').value = tmp_lstd;
	tmp_lstd = document.getElementById('myset_rqblcqsrlist').value.split("\n");
	var _cslr_tmpv;
	for (var i = 0; i < tmp_lstd.length; i++) {
		_cslr_tmpv = tmp_lstd[i].replace(/"/g, "'");
		if (_cslr_tmpv.length <= 1) {
			tmp_lstd[i] = '';
			continue;
		}
		if (_cslr_tmpv.search(/\\/) != -1 || _cslr_tmpv.includes(',')) {
			tmp_lstd[i] = '';
			continue;
		}
		try {
			_tryrgx = document.querySelectorAll(_cslr_tmpv);
		} catch (z) {
			console.log(z);
			_cslr_tmpv = '';
		}
		tmp_lstd[i] = _cslr_tmpv;
	}
	tmp_lstd = get_clntxt(tmp_lstd);
	browser.storage.local.set({
		myset_rqblcqsrlist: b64eu(tmp_lstd)
	});
	document.getElementById('myset_rqblcqsrlist').value = tmp_lstd;
	tmp_lstd = document.getElementById('myset_rqblcftrwhite').value.split("\n");
	for (var i = 0; i < tmp_lstd.length; i++) {
		tmp_lstd[i] = tmp_lstd[i].toLowerCase();
		if (!/^([0-9a-z._\[\]\:-]{4,})$/.test(tmp_lstd[i])) {
			tmp_lstd[i] = '';
		}
	}
	tmp_lstd = get_clntxt(tmp_lstd);
	browser.storage.local.set({
		myset_rqblcftrwhite: tmp_lstd
	});
	document.getElementById('myset_rqblcftrwhite').value = tmp_lstd;
	tmp_lstd = document.getElementById('myset_rqblmitmoklist').value.split("\n");
	for (var i = 0; i < tmp_lstd.length; i++) {
		tmp_lstd[i] = tmp_lstd[i].toLowerCase();
		if (!/^([0-9a-z._\[\]\:-]{4,})$/.test(tmp_lstd[i])) {
			tmp_lstd[i] = '';
		}
	}
	tmp_lstd = get_clntxt(tmp_lstd);
	browser.storage.local.set({
		myset_rqblmitmoklist: tmp_lstd
	});
	document.getElementById('myset_rqblmitmoklist').value = tmp_lstd;
	var _apul = document.getElementById('listsync_apiurl').value;
	if (_apul.startsWith('http://') || _apul.startsWith('https://')) {
		browser.storage.local.set({
			listsync_apiurl: _apul
		});
	} else {
		browser.storage.local.set({
			listsync_apiurl: 'https://searxes.danwin1210.me/collab/tprb_list.php'
		});
	}
	_apul = document.getElementById('myset_rqbluis_curl').value;
	if (_apul.startsWith('http://') || _apul.startsWith('https://')) {
		browser.storage.local.set({
			myset_rqbluis_curl: _apul
		});
	} else {
		browser.storage.local.set({
			myset_rqbluis_curl: ''
		});
		document.getElementById('myset_rqbluis_curl').value = '';
		document.getElementById('myset_rqbluis_0').checked = false;
	}
	_apul = document.getElementById('myset_rqbluis_curl2').value;
	if (_apul.startsWith('http://') || _apul.startsWith('https://')) {
		browser.storage.local.set({
			myset_rqbluis_curl2: _apul
		});
	} else {
		browser.storage.local.set({
			myset_rqbluis_curl2: ''
		});
		document.getElementById('myset_rqbluis_curl2').value = '';
		if (document.getElementById('myset_rqblpoplbl_2').checked) {
			document.getElementById('myset_rqblpoplbl_2').checked = false;
			document.getElementById('myset_rqblpoplbl_0').checked = true;
		}
	}
	_apul = document.getElementById('myset_rqbluis_curl3').value;
	if (_apul.startsWith('http://') || _apul.startsWith('https://')) {
		browser.storage.local.set({
			myset_rqbluis_curl3: _apul
		});
	} else {
		browser.storage.local.set({
			myset_rqbluis_curl3: 'https://searxes.danwin1210.me/collab/gdns.php'
		});
		document.getElementById('myset_rqbluis_curl3').value = 'https://searxes.danwin1210.me/collab/gdns.php';
		if (!document.getElementById('myset_rqblpxydns_1').checked) {
			document.getElementById('myset_rqblpxydns_1').checked = true;
			document.getElementById('myset_rqblpxydns_0').checked = false;
		}
	}
	var _cleantime_x = (parseInt(document.getElementById('myset_autocln_vx').value)) ? parseInt(document.getElementById('myset_autocln_vx').value) : 5;
	if (_cleantime_x < 5 || _cleantime_x > 999) {
		_cleantime_x = 5;
	};
	browser.storage.local.set({
		myset_autocln_vx: _cleantime_x
	});
	document.getElementById('myset_autocln_vx').value = _cleantime_x;
	var _cleantime_y = (parseInt(document.getElementById('myset_autocln_vy').value)) ? parseInt(document.getElementById('myset_autocln_vy').value) : 3;
	if (_cleantime_y < 3 || _cleantime_y > 1440) {
		_cleantime_y = 3;
	};
	browser.storage.local.set({
		myset_autocln_vy: _cleantime_y
	});
	document.getElementById('myset_autocln_vy').value = _cleantime_y;
	//EMPTY
	if (document.getElementById('myset_rqblcqsrlist').value == '') {
		document.getElementById('showusrcssqslr').style.display = 'none';
		document.getElementById('myset_rqbl_csmadqs').checked = false;
	}
	if (document.getElementById('geoip_info4').value == '0') {
		document.getElementById('myset_rqblpmshowcc').checked = false;
	}
	//CONFLICT
	if (document.getElementById('myset_rqblrdr_justhtps').checked) {
		document.getElementById('myset_rqblyestls').checked = false;
	}
	if (!document.getElementById('myset_rqblnoscript').checked) {
		document.getElementById('myset_rqblpmjshps').checked = false;
		document.getElementById('myset_rqblluvinline').checked = false;
		document.getElementById('myset_rqbljsak_wuz').checked = false;
		document.getElementById('myset_rqbljsak_cdnf').checked = false;
		document.getElementById('myset_rqbljsak_cdnd').checked = false;
		document.getElementById('myset_rqblnstag_1').checked = false;
		document.getElementById('myset_rqblnstag_2').checked = false;
		document.getElementById('myset_rqblnstag_0').checked = true;
	}
	if (!document.getElementById('myset_rqbljsak_wuz').checked && !document.getElementById('myset_rqbljsak_cdnf').checked && !document.getElementById('myset_rqbljsak_cdnd').checked) {
		document.getElementById('myset_rqbljsakreqhs').checked = false;
	}
	if (document.getElementById('myset_rqbl_kbrd').checked) {
		if (document.getElementById('myset_rqbl_kbda_1').checked && document.getElementById('chgsubmenu_7').style.display == 'none') {
			document.getElementById('myset_rqbl_kbda_1').checked = false;
			document.getElementById('myset_rqbl_kbda_0').checked = true;
		}
		if (document.getElementById('myset_rqbl_kbda_2').checked) {
			document.getElementById('myset_rqblpmoffon').checked = true;
		}
	}
	if (document.getElementById('myset_rqblaured_0').checked) {
		document.getElementById('myset_rqblrdrign_4').checked = false;
		document.getElementById('myset_rqblrdrign_3').checked = false;
		document.getElementById('myset_rqblrdrign_0').checked = true;
	}
	if (document.getElementById('myset_rqblrdr_mitm_0').checked) {
		document.getElementById('myset_rqblrdr_mitm_inc').checked = false;
		document.getElementById('myset_rqblrdr_mitm_ggl').checked = false;
		document.getElementById('myset_rqblrdr_mitm_scu').checked = false;
	}
	if (document.getElementById('myset_rqblpclr_5').checked) {
		document.getElementById('myset_rqblpmshowip').checked = false;
		document.getElementById('myset_rqblpmshowcc').checked = false;
		document.getElementById('myset_rqblpmshowsubs').checked = false;
		if (document.getElementById('myset_rqblppsty_2').checked) {
			document.getElementById('myset_rqblppsty_2').checked = false;
			document.getElementById('myset_rqblppsty_1').checked = false;
			document.getElementById('myset_rqblppsty_0').checked = true;
		}
	}
	if (!document.getElementById('myset_rqblpmshowip').checked && !document.getElementById('myset_rqblpmshowcc').checked) {
		document.getElementById('myset_rqblpmshowsubs').checked = false;
	}
	//ADVANCED
	browser.storage.local.set({
		myset_rqblcsslover: (document.getElementById('myset_rqblcsslover').checked) ? 'y' : 'n'
	});
	browser.storage.local.set({
		myset_rqblsubdomok: (document.getElementById('myset_rqblsubdomok').checked) ? 'y' : 'n'
	});
	browser.storage.local.set({
		myset_rqblallok_wuz: (document.getElementById('myset_rqblallok_wuz').checked) ? 'y' : 'n'
	});
	browser.storage.local.set({
		myset_rqblaok_cdnf: (document.getElementById('myset_rqblaok_cdnf').checked) ? 'y' : 'n'
	});
	browser.storage.local.set({
		myset_rqblaok_cdnd: (document.getElementById('myset_rqblaok_cdnd').checked) ? 'y' : 'n'
	});
	browser.storage.local.set({
		myset_rqblaok_ytb: (document.getElementById('myset_rqblaok_ytb').checked) ? 'y' : 'n'
	});
	browser.storage.local.set({
		myset_rqblcleardark: (document.getElementById('myset_rqblcleardark').checked) ? 'y' : 'n'
	});
	browser.storage.local.set({
		myset_rqblmixokay: (document.getElementById('myset_rqblmixokay').checked) ? 'y' : 'n'
	});
	browser.storage.local.set({
		myset_rqbll2iokay: (document.getElementById('myset_rqbll2iokay').checked) ? 'y' : 'n'
	});
	browser.storage.local.set({
		myset_rqbl_csmadqs: (document.getElementById('myset_rqbl_csmadqs').checked) ? 'y' : 'n'
	});
	browser.storage.local.set({
		myset_rqbldieframe: (document.getElementById('myset_rqbldieframe').checked) ? 'y' : 'n'
	});
	browser.storage.local.set({
		myset_rqblcftagcanvas: (document.getElementById('myset_rqblcftagcanvas').checked) ? 'y' : 'n'
	});
	browser.storage.local.set({
		myset_rqbl_ah_rclk: (document.getElementById('myset_rqbl_ah_rclk').checked) ? 'y' : 'n'
	});
	browser.storage.local.set({
		myset_rqbl_ah_keys: (document.getElementById('myset_rqbl_ah_keys').checked) ? 'y' : 'n'
	});
	browser.storage.local.set({
		myset_rqbl_ah_scrl: (document.getElementById('myset_rqbl_ah_scrl').checked) ? 'y' : 'n'
	});
	browser.storage.local.set({
		myset_rqbl_ah_mmove: (document.getElementById('myset_rqbl_ah_mmove').checked) ? 'y' : 'n'
	});
	browser.storage.local.set({
		myset_rqbl_ah_touch: (document.getElementById('myset_rqbl_ah_touch').checked) ? 'y' : 'n'
	});
	browser.storage.local.set({
		myset_rqbl_ah_0wchr: (document.getElementById('myset_rqbl_ah_0wchr').checked) ? 'y' : 'n'
	});
	browser.storage.local.set({
		myset_rqblsettemp: (document.getElementById('myset_rqblsettemp').checked) ? 'y' : 'n'
	});
	browser.storage.local.set({
		myset_rqblfmtdsturl: (document.getElementById('myset_rqblfmtdsturl').checked) ? 'y' : 'n'
	});
	browser.storage.local.set({
		myset_rqblfmtdstrxp: (document.getElementById('myset_rqblfmtdstrxp').checked) ? 'y' : 'n'
	});
	browser.storage.local.set({
		myset_rqblsmartref: (document.getElementById('myset_rqblsmartref').checked) ? 'y' : 'n'
	});
	browser.storage.local.set({
		myset_rqblmyrecset: (document.getElementById('myset_rqblmyrecset').checked) ? 'y' : 'n'
	});
	browser.storage.local.set({
		myset_rqblnonotifypop: (document.getElementById('myset_rqblnonotifypop').checked) ? 'y' : 'n'
	});
	browser.storage.local.set({
		myset_rqbl_ignh_altsvc: (document.getElementById('myset_rqbl_ignh_altsvc').checked) ? 'y' : 'n'
	});
	browser.storage.local.set({
		myset_rqbl_ignh_etag: (document.getElementById('myset_rqbl_ignh_etag').checked) ? 'y' : 'n'
	});
	browser.storage.local.set({
		myset_rqbl_ignh_expct: (document.getElementById('myset_rqbl_ignh_expct').checked) ? 'y' : 'n'
	});
	browser.storage.local.set({
		myset_rqbl_ignh_xdnspf: (document.getElementById('myset_rqbl_ignh_xdnspf').checked) ? 'y' : 'n'
	});
	browser.storage.local.set({
		myset_rqblnogifani: (document.getElementById('myset_rqblnogifani').checked) ? 'y' : 'n'
	});
	browser.storage.local.set({
		myset_rqbl_ntb_mute: (document.getElementById('myset_rqbl_ntb_mute').checked) ? 'y' : 'n'
	});
	browser.storage.local.set({
		myset_rqblclnw_ckie: (document.getElementById('myset_rqblclnw_ckie').checked) ? 'y' : 'n'
	});
	browser.storage.local.set({
		myset_rqblclnw_stor: (document.getElementById('myset_rqblclnw_stor').checked) ? 'y' : 'n'
	});
	browser.storage.local.set({
		myset_rqblclnw_cace: (document.getElementById('myset_rqblclnw_cace').checked) ? 'y' : 'n'
	});
	browser.storage.local.set({
		myset_rqblclnw_fdta: (document.getElementById('myset_rqblclnw_fdta').checked) ? 'y' : 'n'
	});
	browser.storage.local.set({
		myset_rqblclnw_hist: (document.getElementById('myset_rqblclnw_hist').checked) ? 'y' : 'n'
	});
	browser.storage.local.set({
		myset_rqblclnw_dwnl: (document.getElementById('myset_rqblclnw_dwnl').checked) ? 'y' : 'n'
	});
	browser.storage.local.set({
		myset_rqblclnw_plug: (document.getElementById('myset_rqblclnw_plug').checked) ? 'y' : 'n'
	});
	if (!_IsDroid) {
		if (document.getElementById('myset_rqbl_kbrd').checked) {
			browser.storage.local.set({
				myset_rqbl_kbrd: 'y'
			});
			if (!/^(Alt|Ctrl|Command|MacCtrl)\+(|Shift\+)(([A-Z0-9]{1})|Comma|Period|Home|End|PageUp|PageDown|Space|Insert|Delete|Up|Down|Left|Right)$/.test(document.getElementById('myset_rqbl_kbrd_k').value)) {
				document.getElementById('myset_rqbl_kbrd_k').value = 'Alt+3';
				browser.commands.update({
					name: 'tprb-key-action',
					shortcut: 'Alt+3'
				}).then(function () {});
			} else {
				browser.commands.update({
					name: 'tprb-key-action',
					shortcut: document.getElementById('myset_rqbl_kbrd_k').value
				}).then(function () {});
			}
		} else {
			browser.storage.local.set({
				myset_rqbl_kbrd: 'n'
			});
		}
	}
	browser.storage.local.set({
		myset_rqblnoscript: (document.getElementById('myset_rqblnoscript').checked) ? 'y' : 'n'
	});
	browser.storage.local.set({
		myset_rqblxssblock: (document.getElementById('myset_rqblxssblock').checked) ? 'y' : 'n'
	});
	browser.storage.local.set({
		myset_rqblnoworker: (document.getElementById('myset_rqblnoworker').checked) ? 'y' : 'n'
	});
	browser.storage.local.set({
		myset_rqblluvinline: (document.getElementById('myset_rqblluvinline').checked) ? 'y' : 'n'
	});
	browser.storage.local.set({
		myset_rqbljsak_wuz: (document.getElementById('myset_rqbljsak_wuz').checked) ? 'y' : 'n'
	});
	browser.storage.local.set({
		myset_rqbljsak_cdnf: (document.getElementById('myset_rqbljsak_cdnf').checked) ? 'y' : 'n'
	});
	browser.storage.local.set({
		myset_rqbljsak_cdnd: (document.getElementById('myset_rqbljsak_cdnd').checked) ? 'y' : 'n'
	});
	browser.storage.local.set({
		myset_rqbljsakreqhs: (document.getElementById('myset_rqbljsakreqhs').checked) ? 'y' : 'n'
	});
	browser.storage.local.set({
		myset_rqblpopnarld: (document.getElementById('myset_rqblpopnarld').checked) ? 'y' : 'n'
	});
	browser.storage.local.set({
		myset_rqblproicon: (document.getElementById('myset_rqblproicon').checked) ? 'y' : 'n'
	});
	var iUsefulCNT = 0;
	if (document.getElementById('myset_rqbluis_0').checked) {
		iUsefulCNT += 1;
		browser.storage.local.set({
			myset_rqbluis_0: 'y'
		});
	} else {
		browser.storage.local.set({
			myset_rqbluis_0: 'n'
		});
	}
	if (document.getElementById('myset_rqbluis_1').checked) {
		iUsefulCNT += 1;
		browser.storage.local.set({
			myset_rqbluis_1: 'y'
		});
	} else {
		browser.storage.local.set({
			myset_rqbluis_1: 'n'
		});
	}
	if (document.getElementById('myset_rqbluis_2').checked) {
		iUsefulCNT += 1;
		browser.storage.local.set({
			myset_rqbluis_2: 'y'
		});
	} else {
		browser.storage.local.set({
			myset_rqbluis_2: 'n'
		});
	}
	if (document.getElementById('myset_rqbluis_3').checked) {
		iUsefulCNT += 1;
		browser.storage.local.set({
			myset_rqbluis_3: 'y'
		});
	} else {
		browser.storage.local.set({
			myset_rqbluis_3: 'n'
		});
	}
	if (document.getElementById('myset_rqbluis_4').checked) {
		iUsefulCNT += 1;
		browser.storage.local.set({
			myset_rqbluis_4: 'y'
		});
	} else {
		browser.storage.local.set({
			myset_rqbluis_4: 'n'
		});
	}
	if (document.getElementById('myset_rqbluis_5').checked) {
		iUsefulCNT += 1;
		browser.storage.local.set({
			myset_rqbluis_5: 'y'
		});
	} else {
		browser.storage.local.set({
			myset_rqbluis_5: 'n'
		});
	}
	if (document.getElementById('myset_rqbluis_6').checked) {
		iUsefulCNT += 1;
		browser.storage.local.set({
			myset_rqbluis_6: 'y'
		});
	} else {
		browser.storage.local.set({
			myset_rqbluis_6: 'n'
		});
	}
	if (document.getElementById('myset_rqbluis_7').checked) {
		iUsefulCNT += 1;
		browser.storage.local.set({
			myset_rqbluis_7: 'y'
		});
	} else {
		browser.storage.local.set({
			myset_rqbluis_7: 'n'
		});
	}
	if (iUsefulCNT == 0 || iUsefulCNT > 3) {
		document.getElementById('myset_rqblproicon').checked = false;
		browser.storage.local.set({
			myset_rqblproicon: 'n'
		});
	}
	browser.storage.local.set({
		myset_rqblpmdotf: (document.getElementById('myset_rqblpmdotf').checked) ? 'y' : 'n'
	});
	browser.storage.local.set({
		myset_rqblpmoffon: (document.getElementById('myset_rqblpmoffon').checked) ? 'y' : 'n'
	});
	browser.storage.local.set({
		myset_rqblpmshowip: (document.getElementById('myset_rqblpmshowip').checked) ? 'y' : 'n'
	});
	browser.storage.local.set({
		myset_rqblpmshowcc: (document.getElementById('myset_rqblpmshowcc').checked) ? 'y' : 'n'
	});
	browser.storage.local.set({
		myset_rqblpmshowsubs: (document.getElementById('myset_rqblpmshowsubs').checked) ? 'y' : 'n'
	});
	browser.storage.local.set({
		myset_rqblpmjshps: (document.getElementById('myset_rqblpmjshps').checked) ? 'y' : 'n'
	});
	browser.storage.local.set({
		myset_rqbl_bldstrxp: (document.getElementById('myset_rqbl_bldstrxp').checked) ? 'y' : 'n'
	});
	browser.storage.local.set({
		myset_rqblnopuny: (document.getElementById('myset_rqblnopuny').checked) ? 'y' : 'n'
	});
	browser.storage.local.set({
		myset_rqblyestls: (document.getElementById('myset_rqblyestls').checked) ? 'y' : 'n'
	});
	browser.storage.local.set({
		myset_rqbljustgp: (document.getElementById('myset_rqbljustgp').checked) ? 'y' : 'n'
	});
	browser.storage.local.set({
		myset_rqblbyesok: (document.getElementById('myset_rqblbyesok').checked) ? 'y' : 'n'
	});
	browser.storage.local.set({
		myset_rqblblockfnt: (document.getElementById('myset_rqblblockfnt').checked) ? 'y' : 'n'
	});
	browser.storage.local.set({
		myset_rqblblockmid: (document.getElementById('myset_rqblblockmid').checked) ? 'y' : 'n'
	});
	browser.storage.local.set({
		myset_rqblblockimg: (document.getElementById('myset_rqblblockimg').checked) ? 'y' : 'n'
	});
	browser.storage.local.set({
		myset_rqblblockobj: (document.getElementById('myset_rqblblockobj').checked) ? 'y' : 'n'
	});
	browser.storage.local.set({
		myset_rqblmimeav: (document.getElementById('myset_rqblmimeav').checked) ? 'y' : 'n'
	});
	browser.storage.local.set({
		myset_rqblmimepdf: (document.getElementById('myset_rqblmimepdf').checked) ? 'y' : 'n'
	});
	browser.storage.local.set({
		myset_rqblmimexls: (document.getElementById('myset_rqblmimexls').checked) ? 'y' : 'n'
	});
	browser.storage.local.set({
		myset_rqblusemybl: (document.getElementById('myset_rqblusemybl').checked) ? 'y' : 'n'
	});
	browser.storage.local.set({
		myset_rqblbyesocial: (document.getElementById('myset_rqblbyesocial').checked) ? 'y' : 'n'
	});
	browser.storage.local.set({
		myset_rqblrdr_clnsrch: (document.getElementById('myset_rqblrdr_clnsrch').checked) ? 'y' : 'n'
	});
	browser.storage.local.set({
		myset_rqblrdr_justhtps: (document.getElementById('myset_rqblrdr_justhtps').checked) ? 'y' : 'n'
	});
	browser.storage.local.set({
		myset_rqblardr_usealrt: (document.getElementById('myset_rqblardr_usealrt').checked) ? 'y' : 'n'
	});
	browser.storage.local.set({
		myset_rqbl_mitmxmark: (document.getElementById('myset_rqbl_mitmxmark').checked) ? 'y' : 'n'
	});
	browser.storage.local.set({
		myset_rqblrdr_mitm_t2oi: (document.getElementById('myset_rqblrdr_mitm_t2oi').checked) ? 'y' : 'n'
	});
	browser.storage.local.set({
		myset_rqblrdr_mitm_inc: (document.getElementById('myset_rqblrdr_mitm_inc').checked) ? 'y' : 'n'
	});
	browser.storage.local.set({
		myset_rqblrdr_mitm_ggl: (document.getElementById('myset_rqblrdr_mitm_ggl').checked) ? 'y' : 'n'
	});
	browser.storage.local.set({
		myset_rqblrdr_mitm_scu: (document.getElementById('myset_rqblrdr_mitm_scu').checked) ? 'y' : 'n'
	});
	if (document.getElementById('myset_rqblnodlact_0').checked) {
		browser.storage.local.set({
			myset_rqblnodlact: 0
		});
	}
	if (document.getElementById('myset_rqblnodlact_1').checked) {
		browser.storage.local.set({
			myset_rqblnodlact: 1
		});
	}
	if (document.getElementById('myset_rqblnodlact_2').checked) {
		browser.storage.local.set({
			myset_rqblnodlact: 2
		});
	}
	if (document.getElementById('myset_rqbl_kbda_0').checked) {
		browser.storage.local.set({
			myset_rqbl_kbda: 0
		});
	}
	if (document.getElementById('myset_rqbl_kbda_1').checked) {
		browser.storage.local.set({
			myset_rqbl_kbda: 1
		});
	}
	if (document.getElementById('myset_rqbl_kbda_2').checked) {
		browser.storage.local.set({
			myset_rqbl_kbda: 2
		});
	}
	if (document.getElementById('myset_rqblnstag_0').checked) {
		browser.storage.local.set({
			myset_rqblnstag: 0
		});
	}
	if (document.getElementById('myset_rqblnstag_1').checked) {
		browser.storage.local.set({
			myset_rqblnstag: 1
		});
	}
	if (document.getElementById('myset_rqblnstag_2').checked) {
		browser.storage.local.set({
			myset_rqblnstag: 2
		});
	}
	if (document.getElementById('myset_rqblpxydns_0').checked) {
		browser.storage.local.set({
			myset_rqblpxydns: 0
		});
	}
	if (document.getElementById('myset_rqblpxydns_1').checked) {
		browser.storage.local.set({
			myset_rqblpxydns: 1
		});
	}
	if (document.getElementById('myset_rqblpoprck_0').checked) {
		browser.storage.local.set({
			myset_rqblpoprck: 0
		});
	}
	if (document.getElementById('myset_rqblpoprck_1').checked) {
		browser.storage.local.set({
			myset_rqblpoprck: 1
		});
	}
	if (document.getElementById('myset_rqblpoprck_2').checked) {
		browser.storage.local.set({
			myset_rqblpoprck: 2
		});
	}
	if (document.getElementById('myset_rqblpoplbl_0').checked) {
		browser.storage.local.set({
			myset_rqblpoplbl: 0
		});
	}
	if (document.getElementById('myset_rqblpoplbl_1').checked) {
		browser.storage.local.set({
			myset_rqblpoplbl: 1
		});
	}
	if (document.getElementById('myset_rqblpoplbl_2').checked) {
		browser.storage.local.set({
			myset_rqblpoplbl: 2
		});
	}
	if (document.getElementById('myset_rqblprsrt_0').checked) {
		browser.storage.local.set({
			myset_rqblprsort: 0
		});
	}
	if (document.getElementById('myset_rqblprsrt_1').checked) {
		browser.storage.local.set({
			myset_rqblprsort: 1
		});
	}
	if (document.getElementById('myset_rqblprsrt_2').checked) {
		browser.storage.local.set({
			myset_rqblprsort: 2
		});
	}
	if (document.getElementById('myset_rqblprsrt_3').checked) {
		browser.storage.local.set({
			myset_rqblprsort: 3
		});
	}
	if (document.getElementById('myset_rqblppsty_0').checked) {
		browser.storage.local.set({
			myset_rqblppsty: 0
		});
	}
	if (document.getElementById('myset_rqblppsty_1').checked) {
		browser.storage.local.set({
			myset_rqblppsty: 1
		});
	}
	if (document.getElementById('myset_rqblppsty_2').checked) {
		browser.storage.local.set({
			myset_rqblppsty: 2
		});
	}
	if (document.getElementById('myset_rqblpclr_0').checked) {
		browser.storage.local.set({
			myset_rqblpcolor: 0
		});
	}
	if (document.getElementById('myset_rqblpclr_1').checked) {
		browser.storage.local.set({
			myset_rqblpcolor: 1
		});
	}
	if (document.getElementById('myset_rqblpclr_5').checked) {
		browser.storage.local.set({
			myset_rqblpcolor: 5
		});
	}
	if (document.getElementById('myset_rqblico_0').checked) {
		browser.storage.local.set({
			myset_rqblmyicon: 0
		});
	}
	if (document.getElementById('myset_rqblico_1').checked) {
		browser.storage.local.set({
			myset_rqblmyicon: 1
		});
	}
	if (document.getElementById('myset_rqblico_2').checked) {
		browser.storage.local.set({
			myset_rqblmyicon: 2
		});
	}
	if (document.getElementById('myset_rqblbgc_0').checked) {
		browser.storage.local.set({
			myset_rqblbgc: 0
		});
	}
	if (document.getElementById('myset_rqblbgc_1').checked) {
		browser.storage.local.set({
			myset_rqblbgc: 1
		});
	}
	if (document.getElementById('myset_rqblaured_0').checked) {
		browser.storage.local.set({
			myset_rqblaured: 0
		});
	}
	if (document.getElementById('myset_rqblaured_1').checked) {
		browser.storage.local.set({
			myset_rqblaured: 1
		});
	}
	if (document.getElementById('myset_rqblaured_2').checked) {
		browser.storage.local.set({
			myset_rqblaured: 2
		});
	}
	if (document.getElementById('myset_rqblrdrign_0').checked) {
		browser.storage.local.set({
			myset_rqblrdrign: 0
		});
	}
	if (document.getElementById('myset_rqblrdrign_3').checked) {
		browser.storage.local.set({
			myset_rqblrdrign: 3
		});
	}
	if (document.getElementById('myset_rqblrdrign_4').checked) {
		browser.storage.local.set({
			myset_rqblrdrign: 4
		});
	}
	if (document.getElementById('myset_rqblrdr_mitm_0').checked) {
		browser.storage.local.set({
			myset_rqblrdr_mitm: 0
		});
	}
	if (document.getElementById('myset_rqblrdr_mitm_1').checked) {
		browser.storage.local.set({
			myset_rqblrdr_mitm: 1
		});
	}
	if (document.getElementById('myset_rqblrdr_mitm_2').checked) {
		browser.storage.local.set({
			myset_rqblrdr_mitm: 2
		});
	}
	var mycolor = document.getElementById('myset_rqblbgc_picker').value;
	if (mycolor.length == 7) {
		browser.storage.local.set({
			myset_rqblbgc_color: mycolor
		});
	}
	browser.runtime.sendMessage(['rld']).then(function (r) {
		document.getElementById('savenow').disabled = false;
		if (document.getElementById('cfgsaved').style.display != 'inline') {
			document.getElementById('cfgsaved').style.display = 'inline';
			setTimeout(function () {
				document.getElementById('cfgsaved').style.display = 'none';
			}, 1400);
		}
	}, onError);
}

function change_menu(x) {
	document.getElementById('chgsubmenu_1').disabled = (x != 1) ? false : true;
	document.getElementById('sub_menu1').style.display = (x != 1) ? 'none' : 'block';
	document.getElementById('chgsubmenu_2').disabled = (x != 2) ? false : true;
	document.getElementById('sub_menu2').style.display = (x != 2) ? 'none' : 'block';
	document.getElementById('chgsubmenu_3').disabled = (x != 3) ? false : true;
	document.getElementById('sub_menu3').style.display = (x != 3) ? 'none' : 'block';
	document.getElementById('chgsubmenu_4').disabled = (x != 4) ? false : true;
	document.getElementById('sub_menu4').style.display = (x != 4) ? 'none' : 'block';
	document.getElementById('chgsubmenu_5').disabled = (x != 5) ? false : true;
	document.getElementById('sub_menu5').style.display = (x != 5) ? 'none' : 'block';
	document.getElementById('chgsubmenu_6').disabled = (x != 6) ? false : true;
	document.getElementById('sub_menu6').style.display = (x != 6) ? 'none' : 'block';
	document.getElementById('chgsubmenu_7').disabled = (x != 7) ? false : true;
	document.getElementById('sub_menu7').style.display = (x != 7) ? 'none' : 'block';
	document.getElementById('chgsubmenu_8').disabled = (x != 8) ? false : true;
	document.getElementById('sub_menu8').style.display = (x != 8) ? 'none' : 'block';
	document.getElementById('chgsubmenu_9').disabled = (x != 9) ? false : true;
	document.getElementById('sub_menu9').style.display = (x != 9) ? 'none' : 'block';
}

function is_safeload(w) {
	var _tw = w.split("\n");
	var _tw_isok = 1;
	var _twv;
	for (var _twi = 0; _twi < _tw.length; _twi++) {
		_twv = _tw[_twi];
		if (_twv != '' && !/^([0-9a-z,.*\+\\\(\)\{\}\/&\^%\$#@\?\!;_\|\[\]\: -]{1,})$/.test(_twv)) {
			_tw_isok = 0;
			break;
		}
	};
	if (_tw_isok == 0) {
		console.log('TPRB_CFG: This text is not safe');
		return false;
	} else {
		return true;
	}
}

function import_me(ia, ib, im) {
	var _tl = im.files[0];
	if (_tl != undefined) {
		if (_tl.size >= 5) {
			var fr = new FileReader();
			fr.addEventListener('load', function (ev) {
				var _rt = ev.target.result.replace(/(?:\r\n|\r|\n)/g, "\n");
				if (_rt.length >= 5 && is_safeload(_rt)) {
					if (document.getElementById(ia).checked) {
						document.getElementById(ib).value += "\n" + _rt;
					} else {
						document.getElementById(ib).value = _rt;
					}
				};
				_rt = null;
			});
			fr.readAsText(_tl);
		}
	};
	im.value = '';
}

function export_me(ia, ib) {
	var _tl = document.getElementById(ia).value;
	if (_tl.length >= 5 && is_safeload(_tl)) {
		tmp_ourl = URL.createObjectURL(new Blob([_tl]));
		browser.downloads.download({
			url: tmp_ourl,
			filename: ib,
			saveAs: true
		}).then(function () {}, function () {
			URL.revokeObjectURL(tmp_ourl);
		});
	}
}

function connect_fin(m) {
	document.getElementById('listsync_sysmsg').value = mylangobj[m];
	document.getElementById('listsync_btnup').disabled = false;
	document.getElementById('listsync_btnds').disabled = false;
	document.getElementById('listsync_btndlo').disabled = false;
	document.getElementById('listsync_btndlm').disabled = false;
	throw new Error('!');
}

function connect_net(n) {
	document.getElementById('listsync_btnup').disabled = true;
	document.getElementById('listsync_btnds').disabled = true;
	document.getElementById('listsync_btndlo').disabled = true;
	document.getElementById('listsync_btndlm').disabled = true;
	var api = document.getElementById('listsync_apiurl').value;
	if ((!api.startsWith('http://') && !api.startsWith('https://')) || api.length < 19) {
		connect_fin('listsync_m_noapi');
	}
	var transid = document.getElementById('listsync_transid').value;
	if (n >= 1) {
		if (transid.length != 19) {
			connect_fin('listsync_m_notid');
		}
	}
	var xhr = new XMLHttpRequest();
	xhr.open("POST", api + "?f=" + Math.random());
	xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhr.onreadystatechange = function () {
		if (xhr.readyState == 4) {
			var xhr_resp = xhr.responseText;
			if (n == 0) {
				if (xhr_resp.startsWith('200|')) {
					xhr_resp = xhr_resp.split('|')[1];
					if (/^([0-9a-z-]{19})$/.test(xhr_resp)) {
						document.getElementById("listsync_transid").value = xhr_resp;
						connect_fin('listsync_m_upldone');
					}
				};
				connect_fin('listsync_m_nosvresp');
			}
			if (n == 1) {
				if (xhr_resp == '200') {
					connect_fin('listsync_m_dstrydone');
				};
				if (xhr_resp == '255') {
					connect_fin('listsync_m_notid2');
				};
				connect_fin('listsync_m_nosvresp');
			}
			if (n == 2 || n == 3) {
				if (xhr_resp == '255') {
					connect_fin('listsync_m_notid2');
				};
				if (xhr_resp.startsWith('200|')) {
					xhr_resp = atob(xhr_resp.split('|')[1]);
					if (xhr_resp.length >= 6) {
						if (n == 2) {
							document.getElementById("myset_rqblwhitelist").value = xhr_resp;
						};
						if (n == 3) {
							document.getElementById("myset_rqblwhitelist").value += "\n" + xhr_resp;
						};
						connect_fin('listsync_m_dwndone');
					}
				};
				connect_fin('listsync_m_nosvresp');
			}
		}
	}
	if (n == 0) {
		var _wlst = document.getElementById("myset_rqblwhitelist").value;
		if (_wlst.length < 6) {
			connect_fin('listsync_m_nowlst');
		};
		xhr.send("u=" + encodeURIComponent(btoa(_wlst)));
	}
	if (n == 1) {
		xhr.send("x=" + transid);
	}
	if (n == 2 || n == 3) {
		xhr.send("g=" + transid);
	}
	document.getElementById('listsync_sysmsg').value = mylangobj['listsync_m_connecting'];
	return false;
}

function pc_open_ntab(p) {
	return new Promise((_a, _d) => {
		if (p) {
			browser.tabs.query({
				title: 'TPRB:[Config]'
			}).then(function (qt) {
				if (v_ls != '?=tprb') {
					var _open = false;
					if (qt.length >= 1) {
						for (var i = 0; i < qt.length; i++) {
							if (/^moz-extension:\/\/(.*)\/tprb_cfg\.html(.*)$/.test(qt[i].url)) {
								_open = true;
								break;
							}
						}
					}
					browser.tabs.query({
						active: true,
						currentWindow: true
					}).then(function (x) {
						if (x[0] != undefined) {
							if (!_open) {
								if (_IsDroid) {
									document.getElementById('open_init').style.display = 'block';
									document.body.style.display = 'block';
									var _xid = x[0].id;
									document.getElementById('opendroid').addEventListener('click', function () {
										browser.tabs.update(_xid, {
											active: true,
											url: browser.extension.getURL('tprb_cfg.html?=tprb')
										});
									});
									throw new Error('!');
								} else {
									browser.tabs.update(x[0].id, {
										active: true,
										url: browser.extension.getURL('tprb_cfg.html?=tprb')
									});
								}
							} else {
								browser.tabs.update(qt[i].id, {
									active: true
								}).then(function () {
									browser.tabs.remove(x[0].id);
								}, function () {});
							}
						}
					}, function () {});
					_d();
				} else {
					document.body.bgColor = '#f9f9fa';
					_a();
				}
			}, _d);
		} else {
			_a();
		}
	});
}
document.addEventListener('DOMContentLoaded', function () {
	if (v_ls != '' && v_ls != '?=tprb') {
		throw new Error('!');
	}
	browser.runtime.getPlatformInfo().then(function (i) {
		if (i.os == 'android') {
			_IsDroid = true;
		}
		browser.storage.local.get().then(function (r) {
			pc_open_ntab(_IsDroid).then(function () {
				document.getElementById('myset_rqblwhitelist').value = r.myset_rqblwhitelist || '';
				document.getElementById('myset_rqbljsoklist').value = r.myset_rqbljsoklist || '';
				document.getElementById('myset_rqblblacklist').value = r.myset_rqblblacklist || '';
				document.getElementById('myset_rqblcqsrlist').value = (r.myset_rqblcqsrlist != undefined) ? b64du(r.myset_rqblcqsrlist) : '';
				document.getElementById('myset_rqblcftrwhite').value = r.myset_rqblcftrwhite || '';
				document.getElementById('myset_rqblmitmoklist').value = r.myset_rqblmitmoklist || '';
				document.getElementById('listsync_apiurl').value = r.listsync_apiurl || '';
				document.getElementById('myset_rqbluis_curl').value = r.myset_rqbluis_curl || '';
				document.getElementById('myset_rqbluis_curl2').value = r.myset_rqbluis_curl2 || '';
				document.getElementById('myset_rqbluis_curl3').value = r.myset_rqbluis_curl3 || '';
				document.getElementById('myset_autocln_vx').value = (r.myset_autocln_vx) ? parseInt(r.myset_autocln_vx) : 5;
				if (document.getElementById('myset_autocln_vx').value < 5 || document.getElementById('myset_autocln_vx').value > 999) {
					document.getElementById('myset_autocln_vx').value = 5;
				}
				document.getElementById('myset_autocln_vy').value = (r.myset_autocln_vy) ? parseInt(r.myset_autocln_vy) : 3;
				if (document.getElementById('myset_autocln_vy').value < 3 || document.getElementById('myset_autocln_vy').value > 1440) {
					document.getElementById('myset_autocln_vy').value = 3;
				}
				document.getElementById('myset_rqblcsslover').checked = (r.myset_rqblcsslover != 'n') ? true : false;
				document.getElementById('myset_rqblsubdomok').checked = (r.myset_rqblsubdomok != 'n') ? true : false;
				document.getElementById('myset_rqblallok_wuz').checked = (r.myset_rqblallok_wuz == 'y') ? true : false;
				document.getElementById('myset_rqblaok_cdnf').checked = (r.myset_rqblaok_cdnf != 'n') ? true : false;
				document.getElementById('myset_rqblaok_cdnd').checked = (r.myset_rqblaok_cdnd != 'n') ? true : false;
				document.getElementById('myset_rqblaok_ytb').checked = (r.myset_rqblaok_ytb != 'n') ? true : false;
				document.getElementById('myset_rqblcleardark').checked = (r.myset_rqblcleardark == 'y') ? true : false;
				document.getElementById('myset_rqblmixokay').checked = (r.myset_rqblmixokay == 'y') ? true : false;
				document.getElementById('myset_rqbll2iokay').checked = (r.myset_rqbll2iokay == 'y') ? true : false;
				document.getElementById('myset_rqbl_csmadqs').checked = (r.myset_rqbl_csmadqs == 'y') ? true : false;
				document.getElementById('showusrcssqslr').style.display = (r.myset_rqbl_csmadqs == 'y') ? 'inline' : 'none';
				document.getElementById('myset_rqbldieframe').checked = (r.myset_rqbldieframe == 'y') ? true : false;
				document.getElementById('myset_rqblcftagcanvas').checked = (r.myset_rqblcftagcanvas == 'y') ? true : false;
				document.getElementById('myset_rqbl_ah_rclk').checked = (r.myset_rqbl_ah_rclk != 'n') ? true : false;
				document.getElementById('myset_rqbl_ah_keys').checked = (r.myset_rqbl_ah_keys == 'y') ? true : false;
				document.getElementById('myset_rqbl_ah_scrl').checked = (r.myset_rqbl_ah_scrl == 'y') ? true : false;
				document.getElementById('myset_rqbl_ah_mmove').checked = (r.myset_rqbl_ah_mmove == 'y') ? true : false;
				document.getElementById('myset_rqbl_ah_touch').checked = (r.myset_rqbl_ah_touch == 'y') ? true : false;
				document.getElementById('myset_rqbl_ah_0wchr').checked = (r.myset_rqbl_ah_0wchr != 'n') ? true : false;
				document.getElementById('myset_rqblsettemp').checked = (r.myset_rqblsettemp == 'y') ? true : false;
				document.getElementById('myset_rqblfmtdsturl').checked = (r.myset_rqblfmtdsturl == 'y') ? true : false;
				document.getElementById('showdsturlfmt').style.display = (r.myset_rqblfmtdsturl == 'y') ? 'inline' : 'none';
				document.getElementById('myset_rqblfmtdstrxp').checked = (r.myset_rqblfmtdstrxp == 'y') ? true : false;
				document.getElementById('showdstrxpfmt').style.display = (r.myset_rqblfmtdstrxp == 'y') ? 'inline' : 'none';
				document.getElementById('myset_rqblsmartref').checked = (r.myset_rqblsmartref == 'y') ? true : false;
				document.getElementById('myset_rqblmyrecset').checked = (r.myset_rqblmyrecset == 'y') ? true : false;
				document.getElementById('myset_rqblnonotifypop').checked = (r.myset_rqblnonotifypop == 'y') ? true : false;
				document.getElementById('myset_rqbl_ignh_altsvc').checked = (r.myset_rqbl_ignh_altsvc == 'y') ? true : false;
				document.getElementById('myset_rqbl_ignh_etag').checked = (r.myset_rqbl_ignh_etag == 'y') ? true : false;
				document.getElementById('myset_rqbl_ignh_expct').checked = (r.myset_rqbl_ignh_expct == 'y') ? true : false;
				document.getElementById('myset_rqbl_ignh_xdnspf').checked = (r.myset_rqbl_ignh_xdnspf == 'y') ? true : false;
				document.getElementById('myset_rqblnogifani').checked = (r.myset_rqblnogifani == 'y') ? true : false;
				document.getElementById('myset_rqbl_ntb_mute').checked = (r.myset_rqbl_ntb_mute == 'y') ? true : false;
				document.getElementById('myset_rqblclnw_ckie').checked = (r.myset_rqblclnw_ckie == 'y') ? true : false;
				document.getElementById('myset_rqblclnw_stor').checked = (r.myset_rqblclnw_stor == 'y') ? true : false;
				document.getElementById('myset_rqblclnw_cace').checked = (r.myset_rqblclnw_cace == 'y') ? true : false;
				document.getElementById('myset_rqblclnw_fdta').checked = (r.myset_rqblclnw_fdta == 'y') ? true : false;
				document.getElementById('myset_rqblclnw_hist').checked = (r.myset_rqblclnw_hist == 'y') ? true : false;
				document.getElementById('myset_rqblclnw_dwnl').checked = (r.myset_rqblclnw_dwnl == 'y') ? true : false;
				document.getElementById('myset_rqblclnw_plug').checked = (r.myset_rqblclnw_plug == 'y') ? true : false;
				document.getElementById('myset_rqbl_kbrd').checked = (r.myset_rqbl_kbrd == 'y') ? true : false;
				document.getElementById('kbd_act').style.display = (r.myset_rqbl_kbrd == 'y') ? 'inline' : 'none';
				if (!_IsDroid) {
					browser.commands.getAll().then(function (g) {
						if (g[0]) {
							document.getElementById('myset_rqbl_kbrd_k').value = g[0].shortcut;
						}
					});
				}
				document.getElementById('myset_rqblnoscript').checked = (r.myset_rqblnoscript == 'y') ? true : false;
				document.getElementById('myset_rqblxssblock').checked = (r.myset_rqblxssblock == 'y') ? true : false;
				document.getElementById('myset_rqblnoworker').checked = (r.myset_rqblnoworker == 'y') ? true : false;
				document.getElementById('myset_rqblluvinline').checked = (r.myset_rqblluvinline == 'y') ? true : false;
				document.getElementById('myset_rqbljsak_wuz').checked = (r.myset_rqbljsak_wuz == 'y') ? true : false;
				document.getElementById('myset_rqbljsak_cdnf').checked = (r.myset_rqbljsak_cdnf == 'y') ? true : false;
				document.getElementById('myset_rqbljsak_cdnd').checked = (r.myset_rqbljsak_cdnd == 'y') ? true : false;
				document.getElementById('myset_rqbljsakreqhs').checked = (r.myset_rqbljsakreqhs == 'y') ? true : false;
				document.getElementById('myset_rqblpopnarld').checked = (r.myset_rqblpopnarld == 'y') ? true : false;
				if (r.myset_rqblproicon == 'y') {
					document.getElementById('myset_rqblproicon').checked = true;
					document.getElementById('myset_rqbluis_0').checked = (r.myset_rqbluis_0 == 'y') ? true : false;
					document.getElementById('myset_rqbluis_1').checked = (r.myset_rqbluis_1 == 'y') ? true : false;
					document.getElementById('myset_rqbluis_2').checked = (r.myset_rqbluis_2 == 'y') ? true : false;
					document.getElementById('myset_rqbluis_3').checked = (r.myset_rqbluis_3 == 'y') ? true : false;
					document.getElementById('myset_rqbluis_4').checked = (r.myset_rqbluis_4 == 'y') ? true : false;
					document.getElementById('myset_rqbluis_5').checked = (r.myset_rqbluis_5 == 'y') ? true : false;
					document.getElementById('myset_rqbluis_6').checked = (r.myset_rqbluis_6 == 'y') ? true : false;
					document.getElementById('myset_rqbluis_7').checked = (r.myset_rqbluis_7 == 'y') ? true : false;
				} else {
					document.getElementById('myset_rqblproicon').checked = false;
				}
				document.getElementById('myset_rqblpmdotf').checked = (r.myset_rqblpmdotf == 'y') ? true : false;
				document.getElementById('myset_rqblpmoffon').checked = (r.myset_rqblpmoffon == 'y') ? true : false;
				document.getElementById('myset_rqblpmshowip').checked = (r.myset_rqblpmshowip == 'y') ? true : false;
				document.getElementById('myset_rqblpmshowcc').checked = (r.myset_rqblpmshowcc == 'y') ? true : false;
				document.getElementById('myset_rqblpmshowsubs').checked = (r.myset_rqblpmshowsubs == 'y') ? true : false;
				document.getElementById('myset_rqblpmjshps').checked = (r.myset_rqblpmjshps == 'y') ? true : false;
				document.getElementById('myset_rqbl_bldstrxp').checked = (r.myset_rqbl_bldstrxp == 'y') ? true : false;
				document.getElementById('showbdrxpfmt').style.display = (r.myset_rqbl_bldstrxp == 'y') ? 'inline' : 'none';
				document.getElementById('myset_rqblnopuny').checked = (r.myset_rqblnopuny == 'y') ? true : false;
				document.getElementById('myset_rqblyestls').checked = (r.myset_rqblyestls == 'y') ? true : false;
				document.getElementById('myset_rqbljustgp').checked = (r.myset_rqbljustgp == 'y') ? true : false;
				document.getElementById('myset_rqblbyesok').checked = (r.myset_rqblbyesok == 'y') ? true : false;
				document.getElementById('myset_rqblblockfnt').checked = (r.myset_rqblblockfnt == 'y') ? true : false;
				document.getElementById('myset_rqblblockmid').checked = (r.myset_rqblblockmid == 'y') ? true : false;
				document.getElementById('myset_rqblblockimg').checked = (r.myset_rqblblockimg == 'y') ? true : false;
				document.getElementById('myset_rqblblockobj').checked = (r.myset_rqblblockobj == 'y') ? true : false;
				document.getElementById('myset_rqblmimeav').checked = (r.myset_rqblmimeav == 'y') ? true : false;
				document.getElementById('myset_rqblmimepdf').checked = (r.myset_rqblmimepdf == 'y') ? true : false;
				document.getElementById('myset_rqblmimexls').checked = (r.myset_rqblmimexls == 'y') ? true : false;
				document.getElementById('myset_rqblusemybl').checked = (r.myset_rqblusemybl == 'y') ? true : false;
				document.getElementById('myset_rqblbyesocial').checked = (r.myset_rqblbyesocial == 'y') ? true : false;
				document.getElementById('myset_rqblrdr_clnsrch').checked = (r.myset_rqblrdr_clnsrch == 'y') ? true : false;
				document.getElementById('myset_rqblrdr_justhtps').checked = (r.myset_rqblrdr_justhtps == 'y') ? true : false;
				document.getElementById('myset_rqblardr_usealrt').checked = (r.myset_rqblardr_usealrt == 'y') ? true : false;
				document.getElementById('myset_rqbl_mitmxmark').checked = (r.myset_rqbl_mitmxmark == 'y') ? true : false;
				document.getElementById('myset_rqblrdr_mitm_t2oi').checked = (r.myset_rqblrdr_mitm_t2oi == 'y') ? true : false;
				document.getElementById('myset_rqblrdr_mitm_inc').checked = (r.myset_rqblrdr_mitm_inc == 'y') ? true : false;
				document.getElementById('myset_rqblrdr_mitm_ggl').checked = (r.myset_rqblrdr_mitm_ggl == 'y') ? true : false;
				document.getElementById('myset_rqblrdr_mitm_scu').checked = (r.myset_rqblrdr_mitm_scu == 'y') ? true : false;
				if (r.myset_rqblpxydns) {
					switch (r.myset_rqblpxydns) {
						case 1:
							document.getElementById('myset_rqblpxydns_1').checked = true;
							break;
						default:
							document.getElementById('myset_rqblpxydns_0').checked = true;
							break;
					}
				} else {
					document.getElementById('myset_rqblpxydns_0').checked = true;
				}
				if (r.myset_rqblnodlact) {
					switch (r.myset_rqblnodlact) {
						case 1:
							document.getElementById('myset_rqblnodlact_1').checked = true;
							break;
						case 2:
							document.getElementById('myset_rqblnodlact_2').checked = true;
							break;
						default:
							document.getElementById('myset_rqblnodlact_0').checked = true;
							break;
					}
				} else {
					document.getElementById('myset_rqblnodlact_0').checked = true;
				}
				if (r.myset_rqbl_kbda) {
					switch (r.myset_rqbl_kbda) {
						case 1:
							document.getElementById('myset_rqbl_kbda_1').checked = true;
							break;
						case 2:
							document.getElementById('myset_rqbl_kbda_2').checked = true;
							break;
						default:
							document.getElementById('myset_rqbl_kbda_0').checked = true;
							break;
					}
				} else {
					document.getElementById('myset_rqbl_kbda_0').checked = true;
				}
				if (r.myset_rqblnstag) {
					switch (r.myset_rqblnstag) {
						case 1:
							document.getElementById('myset_rqblnstag_1').checked = true;
							break;
						case 2:
							document.getElementById('myset_rqblnstag_2').checked = true;
							break;
						default:
							document.getElementById('myset_rqblnstag_0').checked = true;
							break;
					}
				} else {
					document.getElementById('myset_rqblnstag_0').checked = true;
				}
				if (r.myset_rqblpoprck) {
					switch (r.myset_rqblpoprck) {
						case 1:
							document.getElementById('myset_rqblpoprck_1').checked = true;
							break;
						case 2:
							document.getElementById('myset_rqblpoprck_2').checked = true;
							break;
						default:
							document.getElementById('myset_rqblpoprck_0').checked = true;
							break;
					}
				} else {
					document.getElementById('myset_rqblpoprck_0').checked = true;
				}
				if (r.myset_rqblpoplbl) {
					switch (r.myset_rqblpoplbl) {
						case 1:
							document.getElementById('myset_rqblpoplbl_1').checked = true;
							break;
						case 2:
							document.getElementById('myset_rqblpoplbl_2').checked = true;
							break;
						default:
							document.getElementById('myset_rqblpoplbl_0').checked = true;
							break;
					}
				} else {
					document.getElementById('myset_rqblpoplbl_0').checked = true;
				}
				if (r.myset_rqblprsort) {
					switch (r.myset_rqblprsort) {
						case 1:
							document.getElementById('myset_rqblprsrt_1').checked = true;
							break;
						case 2:
							document.getElementById('myset_rqblprsrt_2').checked = true;
							break;
						case 3:
							document.getElementById('myset_rqblprsrt_3').checked = true;
							break;
						default:
							document.getElementById('myset_rqblprsrt_0').checked = true;
							break;
					}
				} else {
					document.getElementById('myset_rqblprsrt_0').checked = true;
				}
				if (r.myset_rqblppsty) {
					switch (r.myset_rqblppsty) {
						case 1:
							document.getElementById('myset_rqblppsty_1').checked = true;
							break;
						case 2:
							document.getElementById('myset_rqblppsty_2').checked = true;
							break;
						default:
							document.getElementById('myset_rqblppsty_0').checked = true;
							break;
					}
				} else {
					document.getElementById('myset_rqblppsty_0').checked = true;
				}
				if (r.myset_rqblpcolor) {
					switch (r.myset_rqblpcolor) {
						case 1:
							document.getElementById('myset_rqblpclr_1').checked = true;
							break;
						case 5:
							document.getElementById('myset_rqblpclr_5').checked = true;
							break;
						default:
							document.getElementById('myset_rqblpclr_0').checked = true;
							break;
					}
				} else {
					document.getElementById('myset_rqblpclr_0').checked = true;
				}
				if (r.myset_rqblmyicon) {
					switch (r.myset_rqblmyicon) {
						case 1:
							document.getElementById('myset_rqblico_1').checked = true;
							break;
						case 2:
							document.getElementById('myset_rqblico_2').checked = true;
							break;
						default:
							document.getElementById('myset_rqblico_0').checked = true;
							break;
					}
				} else {
					document.getElementById('myset_rqblico_0').checked = true;
				}
				if (r.myset_rqblaured) {
					switch (r.myset_rqblaured) {
						case 1:
							document.getElementById('myset_rqblaured_1').checked = true;
							break;
						case 2:
							document.getElementById('myset_rqblaured_2').checked = true;
							break;
						default:
							document.getElementById('myset_rqblaured_0').checked = true;
							break;
					}
				} else {
					document.getElementById('myset_rqblaured_0').checked = true;
				}
				if (r.myset_rqblrdrign) {
					switch (r.myset_rqblrdrign) {
						case 3:
							document.getElementById('myset_rqblrdrign_3').checked = true;
							break;
						case 4:
							document.getElementById('myset_rqblrdrign_4').checked = true;
							break;
						default:
							document.getElementById('myset_rqblrdrign_0').checked = true;
							break;
					}
				} else {
					document.getElementById('myset_rqblrdrign_0').checked = true;
				}
				if (r.myset_rqblrdr_mitm) {
					switch (r.myset_rqblrdr_mitm) {
						case 1:
							document.getElementById('myset_rqblrdr_mitm_1').checked = true;
							break;
						case 2:
							document.getElementById('myset_rqblrdr_mitm_2').checked = true;
							break;
						default:
							document.getElementById('myset_rqblrdr_mitm_0').checked = true;
							break;
					}
				} else {
					document.getElementById('myset_rqblrdr_mitm_0').checked = true;
				}
				if (r.myset_rqblbgc == 1) {
					document.getElementById('myset_rqblbgc_1').checked = true;
				} else {
					document.getElementById('myset_rqblbgc_0').checked = true;
				}
				if (r.myset_rqblbgc_color) {
					if (r.myset_rqblbgc_color.length == 7) {
						document.getElementById('myset_rqblbgc_picker').value = r.myset_rqblbgc_color;
					}
				}
				mylangobj = tprq_i18n_cfg_en;
				var _i8n_k;
				for (var _i8n_n of document.querySelectorAll('span[data-what]')) {
					_i8n_k = _i8n_n.dataset.what;
					if (mylangobj[_i8n_k]) {
						_i8n_n.appendChild(document.createTextNode(mylangobj[_i8n_k]));
					} else {
						console.log('TPRB_CFG: i18n Error:', _i8n_k);
						_i8n_n.appendChild(document.createTextNode('!TRANSLATE_ERROR!'));
					}
				}
				if (_IsDroid) {
					for (var _pco of document.querySelectorAll('span[data-pconly]')) {
						_pco.style.display = 'none';
					};
					document.getElementById('aboutfxandr').style.display = 'inline';
					document.getElementById('aboutfxandr2').style.display = 'inline';
					document.body.id = 'cfgdr';
					document.body.bgColor = '#f9f9fa';
				}
				document.getElementById('listsync_sysmsg').value = mylangobj['listsync_startup'];
				document.getElementById('geoip_info4').value = (r.myset_rqbl_geo) ? Object.keys(JSON.parse(r.myset_rqbl_geo)).length : 0;
				document.getElementById('mainmenu').style.display = 'block';
				document.body.style.display = 'block';
				document.addEventListener('contextmenu', function (z) {
					if (z.target.tagName != 'TEXTAREA' && z.target.tagName != 'INPUT') {
						z.preventDefault();
					}
				});
				for (var _du of document.querySelectorAll("a[href^='%NFOBASE%']")) {
					_du.href = _docbase + _du.href.split('%NFOBASE%')[1];
				}
			}, function () {
				throw new Error('!');
			});
		}, onError);
	});
});
document.querySelector('form').addEventListener('submit', config_save);
document.getElementById('myset_importtxt_wl').addEventListener('change', function () {
	import_me('importMerge_wl', 'myset_rqblwhitelist', this);
});
document.getElementById('myset_importtxt_bl').addEventListener('change', function () {
	import_me('importMerge_bl', 'myset_rqblblacklist', this);
});
document.getElementById('myset_importtxt_mm').addEventListener('change', function () {
	import_me('importMerge_mm', 'myset_rqblmitmoklist', this);
});
document.getElementById('myset_importtxt_cf').addEventListener('change', function () {
	import_me('importMerge_cf', 'myset_rqblcftrwhite', this);
});
document.getElementById('myset_importtxt_js').addEventListener('change', function () {
	import_me('importMerge_js', 'myset_rqbljsoklist', this);
});
document.getElementById('myset_exporttxt_wl').addEventListener('click', function () {
	export_me('myset_rqblwhitelist', 'tprb_wlist.txt');
});
document.getElementById('myset_exporttxt_bl').addEventListener('click', function () {
	export_me('myset_rqblblacklist', 'tprb_blist.txt');
});
document.getElementById('myset_exporttxt_mm').addEventListener('click', function () {
	export_me('myset_rqblmitmoklist', 'tprb_mmlist.txt');
});
document.getElementById('myset_exporttxt_cf').addEventListener('click', function () {
	export_me('myset_rqblcftrwhite', 'tprb_cflist.txt');
});
document.getElementById('myset_exporttxt_js').addEventListener('click', function () {
	export_me('myset_rqbljsoklist', 'tprb_jslist.txt');
});
document.getElementById('myset_rqblfmtdsturl').addEventListener('click', function () {
	document.getElementById('showdsturlfmt').style.display = (this.checked) ? 'inline' : 'none';
});
document.getElementById('myset_rqblfmtdstrxp').addEventListener('click', function () {
	document.getElementById('showdstrxpfmt').style.display = (this.checked) ? 'inline' : 'none';
});
document.getElementById('myset_rqbl_bldstrxp').addEventListener('click', function () {
	document.getElementById('showbdrxpfmt').style.display = (this.checked) ? 'inline' : 'none';
});
document.getElementById('myset_rqbl_kbrd').addEventListener('click', function () {
	document.getElementById('kbd_act').style.display = (this.checked) ? 'inline' : 'none';
});
document.getElementById('myset_rqbl_csmadqs').addEventListener('click', function () {
	document.getElementById('showusrcssqslr').style.display = (this.checked) ? 'inline' : 'none';
});
document.getElementById('listsync_btnup').addEventListener('click', function () {
	connect_net(0);
});
document.getElementById('listsync_btnds').addEventListener('click', function () {
	connect_net(1);
});
document.getElementById('listsync_btndlo').addEventListener('click', function () {
	connect_net(2);
});
document.getElementById('listsync_btndlm').addEventListener('click', function () {
	connect_net(3);
});
document.getElementById('rstKBS').addEventListener('click', function () {
	document.getElementById('myset_rqbl_kbrd_k').value = 'Alt+3';
});
document.getElementById('btnGoResetUI').addEventListener('click', function () {
	document.getElementById('mainmenu').style.display = 'none';
	document.getElementById('reset_page').style.display = 'block';
});
document.getElementById('aonbtn_bset0').addEventListener('click', function () {
	document.getElementById('reset_page').style.display = 'none';
	document.getElementById('aon_dnt_rst_wlst').checked = false;
	document.getElementById('mainmenu').style.display = 'block';
});
document.getElementById('aonbtn_bset1').addEventListener('click', function () {
	document.getElementById('reset_page').style.display = 'none';
	browser.storage.local.get().then(function (_c) {
		var _nowlst_main = '';
		var _nowlst_bl = '';
		var _nowlst_cont = '';
		var _nowlst_mitm = '';
		var _nowlst_js = '';
		var _now_jkeep = (document.getElementById('aon_dnt_rst_wlst').checked) ? true : false;
		if (_now_jkeep) {
			if (_c.myset_rqblwhitelist) {
				_nowlst_main = _c.myset_rqblwhitelist;
			}
			if (_c.myset_rqblblacklist) {
				_nowlst_bl = _c.myset_rqblblacklist;
			}
			if (_c.myset_rqblcftrwhite) {
				_nowlst_cont = _c.myset_rqblcftrwhite;
			}
			if (_c.myset_rqblmitmoklist) {
				_nowlst_mitm = _c.myset_rqblmitmoklist;
			}
			if (_c.myset_rqbljsoklist) {
				_nowlst_js = _c.myset_rqbljsoklist;
			}
		}
		browser.storage.local.clear().then(function () {
			if (_now_jkeep) {
				if (_nowlst_main.length >= 4) {
					browser.storage.local.set({
						myset_rqblwhitelist: _nowlst_main
					});
				}
				if (_nowlst_bl.length >= 4) {
					browser.storage.local.set({
						myset_rqblblacklist: _nowlst_bl
					});
				}
				if (_nowlst_cont.length >= 4) {
					browser.storage.local.set({
						myset_rqblcftrwhite: _nowlst_cont
					});
				}
				if (_nowlst_mitm.length >= 4) {
					browser.storage.local.set({
						myset_rqblmitmoklist: _nowlst_mitm
					});
				}
				if (_nowlst_js.length >= 4) {
					browser.storage.local.set({
						myset_rqbljsoklist: _nowlst_js
					});
				}
			}
			location.reload(true);
		}, onError);
	}, onError);
});
document.getElementById('chgsubmenu_1').addEventListener('click', function () {
	change_menu(1);
});
document.getElementById('chgsubmenu_2').addEventListener('click', function () {
	change_menu(2);
});
document.getElementById('chgsubmenu_3').addEventListener('click', function () {
	change_menu(3);
});
document.getElementById('chgsubmenu_4').addEventListener('click', function () {
	change_menu(4);
});
document.getElementById('chgsubmenu_5').addEventListener('click', function () {
	change_menu(5);
});
document.getElementById('chgsubmenu_6').addEventListener('click', function () {
	change_menu(6);
});
document.getElementById('chgsubmenu_7').addEventListener('click', function () {
	change_menu(7);
});
document.getElementById('chgsubmenu_8').addEventListener('click', function () {
	change_menu(8);
});
document.getElementById('chgsubmenu_9').addEventListener('click', function () {
	change_menu(9);
});
document.getElementById('udsd_menu_1').addEventListener('click', function () {
	this.style.display = 'none';
	document.getElementById('udsd_menu_1_real').style.display = 'inline';
});
document.getElementById('udsd_menu_2').addEventListener('click', function () {
	this.style.display = 'none';
	document.getElementById('udsd_menu_2_real').style.display = 'inline';
});
document.getElementById('udsd_menu_6').addEventListener('click', function () {
	this.style.display = 'none';
	document.getElementById('udsd_menu_6_real').style.display = 'inline';
});
document.getElementById('udsd_menu_7').addEventListener('click', function () {
	this.style.display = 'none';
	document.getElementById('udsd_menu_7_real').style.display = 'inline';
});
document.getElementById('udsd_menu_8').addEventListener('click', function () {
	this.style.display = 'none';
	document.getElementById('udsd_menu_8_real').style.display = 'inline';
});
document.getElementById('droidcls').addEventListener('click', function () {
	browser.tabs.query({
		active: true,
		currentWindow: true
	}).then(function (tabs) {
		browser.tabs.remove(tabs[0].id);
	}, function () {})
});
document.getElementById('myset_import_geoip').addEventListener('change', function () {
	var _tl = this.files[0];
	if (_tl != undefined) {
		if (_tl.size >= 100000) {
			var fr = new FileReader();
			fr.addEventListener('load', function (ev) {
				var _rt = ev.target.result.replace(/(?:\r\n|\r|\n)/g, "\n").split("\n");
				var _rt_len = _rt.length;
				if (_rt_len >= 1000) {
					document.getElementById('myset_import_geoip').disabled = true;
					document.getElementById('btnClrGeoD').disabled = true;
					var _rti, _gd_v4 = {},
						_gct_v4 = 0;
					for (var i = 0; i < _rt_len; i++) {
						_rti = _rt[i];
						if (/^([0-9]{1,10}),([0-9]{1,10}),([A-Z]{2})$/.test(_rti)) {
							_rti = _rti.split(',');
							_rti[0] = parseInt(_rti[0]);
							_rti[1] = parseInt(_rti[1]);
							if (_rti[2].length == 2 && _rti[1] >= _rti[0]) {
								_gd_v4[_rti[0]] = [_rti[1], _rti[2]];
								_gct_v4 += 1;
							}
						}
					}
					if (_gct_v4 > 1000) {
						browser.storage.local.set({
							myset_rqbl_geo: JSON.stringify(_gd_v4)
						});
						_gd_v4 = null;
						document.getElementById('geoip_info4').value = _gct_v4;
					}
					document.getElementById('btnClrGeoD').disabled = false;
					document.getElementById('myset_import_geoip').disabled = false;
				}
				_rt = null;
			});
			fr.readAsText(_tl);
		}
	}
	this.value = '';
});
document.getElementById('btnClrGeoD').addEventListener('click', function () {
	browser.storage.local.set({
		myset_rqbl_geo: ''
	});
	document.getElementById('geoip_info4').value = 0;
});
browser.downloads.onChanged.addListener(function (g) {
	if (g.state) {
		if (g.state.current == 'complete') {
			URL.revokeObjectURL(tmp_ourl);
			tmp_ourl = null;
		}
	}
});
