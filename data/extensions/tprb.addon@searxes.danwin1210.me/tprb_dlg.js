var current_src = '';
var current_tid = 0;
var current_cktgl = 0;
var _isDroid = false;
var _isctxmenu = false;

function onError(e) {
	console.log(`TPRB_DLG: Error:${e}`);
	window.close();
}
document.addEventListener('DOMContentLoaded', function () {
	var _tabquery;
	if (location.search.startsWith('?=ctx/')) {
		current_tid = parseInt(location.search.replace('?=ctx/', '')) || 0;
		if (current_tid <= 0) {
			throw new Error('!');
		}
		_isctxmenu = true;
		_tabquery = browser.tabs.get(current_tid);
	} else {
		_tabquery = browser.tabs.query({
			active: true,
			currentWindow: true
		});
	}
	_tabquery.then(function (tabs) {
		if (_isctxmenu) {
			var _tt = [];
			_tt.push(tabs);
			tabs = _tt;
		}
		current_tid = tabs[0].id;
		var tmp_iu = new URL(tabs[0].url);
		current_src = tmp_iu.hostname;
		browser.runtime.sendMessage(['pop', current_tid, current_src, tmp_iu.protocol, tmp_iu.href]).then(function (rr) {
			if (!rr) {
				close_popup();
				return;
			}
			document.body.id = rr[5][0];
			document.getElementById('pfoot').style.backgroundColor = rr[5][1];
			document.getElementById('d_fqdn').innerHTML = rr[1];
			document.getElementById('d_res').innerHTML = rr[2];
			var _muis = rr[3];
			var _muis_len = (!_isctxmenu) ? _muis.length : 0;
			if (_muis_len > 0) {
				var _muis_res = '&nbsp;';
				for (var i = 0; i < _muis_len; i++) {
					_muis_res += '&nbsp;<img src="icons/u/' + _muis[i][0] + '.gif" data-url="' + _muis[i][1] + '" width=16 height=16>' + "\n";
				};
				document.getElementById('d_icon').innerHTML = _muis_res;
			} else {
				document.getElementById('d_icon').style.display = 'none';
			}
			if (!_isctxmenu) {
				if (rr[4] == 1) {
					document.getElementById('d_closeme').style.display = 'inline';
				};
				if (rr[6] == 1) {
					document.getElementById('d_onoff').style.display = 'inline';
				}
			} else {
				document.getElementById('openOptn').style.display = 'none';
			}
			if (rr[7] == 1) {
				for (var _qs of document.querySelectorAll("input[type='checkbox'],input[type='radio']")) {
					_qs.className = 'lgr';
				}
			}
			if (rr[5][0] == 'droid' || rr[5][0] == 'broid') {
				document.getElementById('openOptn').style.display = 'none';
				_isDroid = true;
			}
			for (var _qs of document.querySelectorAll('span[data-what]')) {
				_qs.appendChild(document.createTextNode(rr[0][_qs.dataset.what]));
			}
			if (rr[9][0] == 1) {
				for (var _qs of document.querySelectorAll('span.minortxt')) {
					_qs.style.display = 'none';
				}
			}
			if (rr[9][1] == 1) {
				for (var _qs of document.querySelectorAll('div#pfoot,span#pfb')) {
					_qs.style.display = 'none';
				}
			}
			document.body.style.display = 'block';
			current_cktgl = 0;
			if (_muis_len > 0) {
				for (var _z of document.querySelectorAll('img[data-url]')) {
					_z.addEventListener('click', function () {
						browser.tabs.create({
							active: true,
							url: this.dataset.url.replace('%%TPRB_HOST%%', current_src).replace('%%TPRB_ERL%%', encodeURIComponent(tmp_iu.href)).replace('%%TPRB_URL%%', tmp_iu.href)
						});
						window.close();
					});
				}
			}
			var _za = (!_isDroid) ? rr[8][0] : 0;
			document.addEventListener('contextmenu', function (z) {
				if (_za == 1) {
					setallChecked();
				};
				if (_za == 2) {
					saveRule();
				};
				z.preventDefault();
			});
			if (!_isDroid) {
				var _zl = (current_src.includes('.')) ? rr[8][1].toString() : '0';
				if (_zl.startsWith('http')) {
					_zl = _zl.replace('%F%', current_src).replace('%E%', encodeURIComponent(tmp_iu.href)).replace('%U%', tmp_iu.href);
				}
				if (_zl != '0') {
					document.getElementById('d_fqdn').addEventListener('click', function (z) {
						if (_zl == '1') {
							var _fr = [];
							var _fl = document.querySelectorAll("label[for^='idf_'],span[title]");
							for (var _fk = 0; _fk < _fl.length; _fk++) {
								if (_fl[_fk].title) {
									if (!_fl[_fk].title.startsWith('*') && _fl[_fk].title != current_src) {
										_fr.push((_fl[_fk].title.split(' '))[0]);
									}
								}
							}
							_fr = (_fr.slice().sort(function (a, b) {
								return a > b
							}).reduce(function (a, b) {
								if (a.slice(-1)[0] !== b) {
									a.push(b);
								};
								return a;
							}, [])).filter(v => v != '').join("\n");
							if (_fr != '') {
								browser.tabs.create({
									active: true,
									url: 'about:blank'
								}).then(function (t) {
									browser.tabs.executeScript(t.id, {
										matchAboutBlank: true,
										code: "document.documentElement.innerHTML='<html><head><title>TPRB:[Data]</title></head><body><pre>'+atob('" + btoa(current_src + " (" + _fr.split("\n").length + ")\n<hr>" + _fr) + "')+'</pre></body></html>';window.stop();"
									}).then(function (e) {
										window.close();
									}, function () {
										window.close();
									});
								}, function () {
									window.close();
								});
							}
						}
						if (_zl.startsWith('http')) {
							browser.tabs.create({
								active: true,
								url: _zl
							});
							window.close();
						}
					});
				}
			}
		}, onError);
	}, onError);
});

function close_popup() {
	if (!_isDroid) {
		if (_isctxmenu) {
			browser.tabs.query({
				active: true,
				currentWindow: true
			}).then(function (t) {
				browser.tabs.update(current_tid, {
					active: true
				});
				browser.tabs.remove(t[0].id);
			}, onError);
		} else {
			window.close();
		}
	} else {
		browser.tabs.update({
			active: true
		});
	}
}

function setallChecked() {
	var _ckbx = document.querySelectorAll("input[type='checkbox'],input[type='radio'][value='b']");
	if (_ckbx.length == 0) {
		close_popup();
	} else {
		var _ckbx_b = true;
		if (current_cktgl == 0) {
			current_cktgl = 1;
		} else {
			_ckbx_b = false;
			current_cktgl = 0;
		}
		for (var i = 0; i < _ckbx.length; i++) {
			if (_ckbx[i].dataset.wild) {
				continue;
			};
			_ckbx[i].checked = _ckbx_b;
		}
		if (!_ckbx_b) {
			_ckbx = document.querySelectorAll("input[type='radio'][value='x']");
			for (var i = 0; i < _ckbx.length; i++) {
				_ckbx[i].checked = true;
			}
		} //if false, then set all tempmenu=block
	}
}

function saveRule() {
	var ei = document.querySelectorAll("input[type='checkbox'],input[type='radio']");
	if (ei.length == 0) {
		close_popup();
	} else {
		document.getElementById('apply').disabled = true;
		var ei_n;
		var eiO_tmp1 = [];
		var eiO_tmp2 = [];
		var eiO_tmp3 = [];
		var eiO_tmp4 = [];
		var bJSHTTPS = false;
		for (var o = 0; o < ei.length; o++) {
			ei_n = ei[o].name;
			if (ei_n.startsWith('f_')) {
				if (ei[o].dataset.usv != undefined) {
					if ((ei[o].dataset.usv == 0 && ei[o].checked) || (ei[o].dataset.usv == 1 && !ei[o].checked)) {
						eiO_tmp1.push([current_src, ei_n.replace('f_', ''), ei[o].checked, true]);
					}
				} else {
					if (ei[o].dataset.usvxt != undefined) {
						if ((ei[o].dataset.usvxt == 0 && ei[o].checked) || (ei[o].dataset.usvxt == 1 && !ei[o].checked)) {
							eiO_tmp2.push([current_src, ei_n.replace('f_', ''), ei[o].checked, false]);
						}
					}
				}
			}
			if (ei_n.startsWith('js_')) {
				if (ei[o].dataset.usv != undefined) {
					if (document.getElementById('htps_' + ei_n)) {
						bJSHTTPS = document.getElementById('htps_' + ei_n).checked;
						if (ei[o].dataset.usv == 1 && ei[o].checked) {
							if ((document.getElementById('htps_' + ei_n).dataset.prev == 0 && bJSHTTPS) || (document.getElementById('htps_' + ei_n).dataset.prev == 1 && !bJSHTTPS)) {
								eiO_tmp3.push([ei_n.replace('js_', ''), true, true, bJSHTTPS]);
								continue;
							}
						}
						if ((ei[o].dataset.usv == 0 && ei[o].checked) || (ei[o].dataset.usv == 1 && !ei[o].checked)) {
							eiO_tmp3.push([ei_n.replace('js_', ''), ei[o].checked, true, bJSHTTPS]);
						}
					} else {
						if ((ei[o].dataset.usv == 0 && ei[o].checked) || (ei[o].dataset.usv == 1 && !ei[o].checked)) {
							eiO_tmp3.push([ei_n.replace('js_', ''), ei[o].checked, true, false]);
						}
					} // no https cbx
				} else {
					if (ei[o].dataset.usvxt != undefined) {
						if ((ei[o].dataset.usvxt == 0 && ei[o].checked) || (ei[o].dataset.usvxt == 1 && !ei[o].checked)) {
							eiO_tmp4.push([ei_n.replace('js_', ''), ei[o].checked, false, false]);
						}
					}
				} // temp
			}
		}
		browser.runtime.sendMessage(['upd', current_tid, eiO_tmp1.concat(eiO_tmp2), eiO_tmp3.concat(eiO_tmp4)]).then(function (r) {
			if (r[1]) {
				browser.tabs.reload(current_tid, {
					bypassCache: true
				});
			};
			close_popup();
		}, function () {
			close_popup();
		});
	}
}
document.getElementById('tglckAll').addEventListener('click', setallChecked);
document.getElementById('apply').addEventListener('click', saveRule);
document.getElementById('closeMe').addEventListener('click', function () {
	window.close();
});
document.getElementById('openOptn').addEventListener('click', function () {
	this.disabled = true;
	browser.runtime.openOptionsPage().then(function () {
		window.close();
	}, function () {
		window.close();
	});
});
document.getElementById('tglOnOff').addEventListener('click', function () {
	this.disabled = true;
	browser.runtime.sendMessage(['onf', current_tid]).then(function (r) {
		browser.tabs.reload(current_tid, {
			bypassCache: true
		});
		window.close();
	}, function () {
		window.close();
	});
});
