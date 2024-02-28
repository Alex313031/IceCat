var _mycssqsl = '';

function onError(e) {
	console.log(`TPRB_CS: Error:${e}`);
}

function cleanup_mycss_cqsl() {
	try {
		var _hostiles_ = document.querySelectorAll(_mycssqsl);
		for (var i = 0; i < _hostiles_.length; i++) {
			if (_hostiles_[i]) {
				if (_hostiles_[i].style) {
					_hostiles_[i].style.display = 'none';
				};
				_hostiles_[i].innerHTML = '';
				_hostiles_[i].outerHTML = '';
			}
		}
	} catch (z) {
		console.log(z);
		console.log('TPRB_CS: Check your CSS selectors!');
		_mycssqsl = '';
	}
}

function remove0WidthChars() {
	if (document.body) {
		var _twv;
		var _tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
		while (_tw.nextNode()) {
			_twv = encodeURIComponent(_tw.currentNode.nodeValue);
			if (_twv) {
				if (/^(.*)(%E2%80%8B|%E2%80%8C|%E2%80%8D|%E2%81%A0|%E2%81%A2|%E2%81%A3|%E2%81%A4|%EF%BB%BF)(.*)$/.test(_twv)) {
					_tw.currentNode.nodeValue = decodeURIComponent(_twv.replace(/(%E2%80%8B|%E2%80%8C|%E2%80%8D|%E2%81%A0|%E2%81%A2|%E2%81%A3|%E2%81%A4|%EF%BB%BF)/g, ''));
				}
			}
		}
	}
}

browser.runtime.sendMessage(['ison', location.hostname, location.protocol]).then(function (rr) {
	if (rr[0]) {
		browser.storage.local.get(['myset_rqbl_ah_0wchr', 'myset_rqbl_ah_keys', 'myset_rqbl_ah_mmove', 'myset_rqbl_ah_rclk', 'myset_rqbl_ah_scrl', 'myset_rqbl_ah_touch', 'myset_rqbl_csmadqs', 'myset_rqbl_mitmxmark', 'myset_rqblblockimg', 'myset_rqblblockmid', 'myset_rqblblockobj', 'myset_rqblcftagcanvas', 'myset_rqblcqsrlist', 'myset_rqbldieframe', 'myset_rqblnstag', 'myset_rqblrdr_mitm']).then(function (r) {
			var _qsa;
			if (rr[1]) { //not in cfw
				if (r.myset_rqbl_csmadqs == 'y') {
					_mycssqsl = (r.myset_rqblcqsrlist) ? decodeURIComponent(Array.prototype.map.call(atob(r.myset_rqblcqsrlist), function (c) {
						return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
					}).join('')).split("\n").join(',') : '';
				}
				if (r.myset_rqblnstag == 2) {
					if (rr[3]) {
						r.myset_rqblnstag = 1;
					} else {
						_qsa = document.querySelectorAll('noscript');
						for (var i = 0; i < _qsa.length; i++) {
							if (_qsa[i]) {
								_qsa[i].outerHTML = _qsa[i].innerHTML;
							}
						};
						_qsa = null;
					}
				}
				if (r.myset_rqblnstag == 1) {
					_qsa = document.querySelectorAll('noscript');
					for (var i = 0; i < _qsa.length; i++) {
						if (_qsa[i]) {
							if (_qsa[i].style) {
								_qsa[i].style.display = 'none';
							};
							_qsa[i].outerHTML = '';
						}
					};
					_qsa = null;
				}
				if (r.myset_rqblblockobj == 'y') {
					_qsa = document.querySelectorAll('object,embed,applet');
					for (var i = 0; i < _qsa.length; i++) {
						if (_qsa[i]) {
							if (_qsa[i].style) {
								_qsa[i].style.display = 'none';
							};
							_qsa[i].outerHTML = '';
						}
					};
					_qsa = null;
				}
				if (r.myset_rqblblockmid == 'y') {
					_qsa = document.querySelectorAll("video,audio,track,source[src*='.']");
					for (var i = 0; i < _qsa.length; i++) {
						if (_qsa[i]) {
							if (_qsa[i].style) {
								_qsa[i].style.display = 'none';
							};
							_qsa[i].outerHTML = '';
						}
					};
					_qsa = null;
				}
				if (r.myset_rqblblockimg == 'y') {
					_qsa = document.querySelectorAll('img');
					for (var i = 0; i < _qsa.length; i++) {
						if (_qsa[i]) {
							if (_qsa[i].style) {
								_qsa[i].style.display = 'none';
							};
							_qsa[i].outerHTML = '';
						}
					};
					_qsa = null;
				}
				if (r.myset_rqbl_ah_rclk != 'n') {
					window.oncontextmenu = null;
					document.oncontextmenu = null;
					document.addEventListener('contextmenu', function (e) {
						e.stopImmediatePropagation();
					}, true);
				}
				if (r.myset_rqbl_ah_keys == 'y') {
					document.onkeydown = null;
					document.onkeypress = null;
					document.onkeyup = null;
					document.addEventListener('keydown', function (e) {
						e.stopImmediatePropagation();
					}, true);
					document.addEventListener('keypress', function (e) {
						e.stopImmediatePropagation();
					}, true);
					document.addEventListener('keyup', function (e) {
						e.stopImmediatePropagation();
					}, true);
				}
				if (r.myset_rqbl_ah_scrl == 'y') {
					window.onscroll = null;
					window.onwheel = null;
					document.onscroll = null;
					document.onwheel = null;
					document.addEventListener('scroll', function (e) {
						e.stopImmediatePropagation();
					}, true);
					document.addEventListener('wheel', function (e) {
						e.stopImmediatePropagation();
					}, true);
				}
				if (r.myset_rqbl_ah_mmove == 'y') {
					window.onmousemove = null;
					window.onmouseenter = null;
					window.onmouseleave = null;
					window.onmouseover = null;
					window.onmouseout = null;
					window.onmouseup = null;
					window.onmousedown = null;
					document.onmousemove = null;
					document.onmouseenter = null;
					document.onmouseleave = null;
					document.onmouseover = null;
					document.onmouseout = null;
					document.onmouseup = null;
					document.onmousedown = null;
					document.addEventListener('mousemove', function (e) {
						e.stopImmediatePropagation();
					}, true);
					document.addEventListener('mouseenter', function (e) {
						e.stopImmediatePropagation();
					}, true);
					document.addEventListener('mouseleave', function (e) {
						e.stopImmediatePropagation();
					}, true);
					document.addEventListener('mouseover', function (e) {
						e.stopImmediatePropagation();
					}, true);
					document.addEventListener('mouseout', function (e) {
						e.stopImmediatePropagation();
					}, true);
					document.addEventListener('mouseup', function (e) {
						e.stopImmediatePropagation();
					}, true);
					document.addEventListener('mousedown', function (e) {
						e.stopImmediatePropagation();
					}, true);
				}
				if (r.myset_rqbl_ah_touch == 'y') {
					document.addEventListener('touchstart', function (e) {
						e.stopImmediatePropagation();
					}, true);
					document.addEventListener('touchend', function (e) {
						e.stopImmediatePropagation();
					}, true);
					document.addEventListener('touchmove', function (e) {
						e.stopImmediatePropagation();
					}, true);
					document.addEventListener('touchcancel', function (e) {
						e.stopImmediatePropagation();
					}, true);
				}
				if (r.myset_rqbl_ah_0wchr != 'n') {
					remove0WidthChars();
				}
				if (r.myset_rqblcftagcanvas == 'y') {
					_qsa = document.querySelectorAll('canvas');
					for (var i = 0; i < _qsa.length; i++) {
						if (_qsa[i]) {
							if (_qsa[i].style) {
								_qsa[i].style.display = 'none';
							};
							_qsa[i].outerHTML = '';
						}
					};
					_qsa = null;
				}
				if (r.myset_rqbldieframe == 'y') {
					if (location.hostname != 'twitter.com') {
						_qsa = document.querySelectorAll('iframe');
						for (var i = 0; i < _qsa.length; i++) {
							if (_qsa[i]) {
								if (_qsa[i].style) {
									_qsa[i].style.display = 'none';
								};
								_qsa[i].outerHTML = '';
							}
						};
						_qsa = null;
					}
				}
				if (_mycssqsl != '') {
					cleanup_mycss_cqsl();
				}
				//_TryAgain
				function tprb_time_a() {
					if (_mycssqsl != '') {
						cleanup_mycss_cqsl();
					}
					if (r.myset_rqblcftagcanvas == 'y') {
						_qsa = document.querySelectorAll('canvas');
						for (var i = 0; i < _qsa.length; i++) {
							if (_qsa[i]) {
								if (_qsa[i].style) {
									_qsa[i].style.display = 'none';
								};
								_qsa[i].outerHTML = '';
							}
						};
						_qsa = null;
					}
					if (r.myset_rqbldieframe == 'y') {
						if (location.hostname != 'twitter.com') {
							_qsa = document.querySelectorAll('iframe');
							for (var i = 0; i < _qsa.length; i++) {
								if (_qsa[i]) {
									if (_qsa[i].style) {
										_qsa[i].style.display = 'none';
									};
									_qsa[i].outerHTML = '';
								}
							};
							_qsa = null;
						}
					}
					if (r.myset_rqbl_ah_0wchr == 'y') {
						remove0WidthChars();
					}
					if (rr[3]) {
						setTimeout(tprb_time_a, 1590);
					}
				}

				function tprb_time_b() {
					if (r.myset_rqbl_ah_rclk == 'y') {
						window.oncontextmenu = null;
						document.oncontextmenu = null;
						document.addEventListener('contextmenu', function (e) {
							e.stopImmediatePropagation();
						}, true);
					}
					if (r.myset_rqbl_ah_keys == 'y') {
						document.onkeydown = null;
						document.onkeypress = null;
						document.onkeyup = null;
						document.addEventListener('keydown', function (e) {
							e.stopImmediatePropagation();
						}, true);
						document.addEventListener('keypress', function (e) {
							e.stopImmediatePropagation();
						}, true);
						document.addEventListener('keyup', function (e) {
							e.stopImmediatePropagation();
						}, true);
					}
					if (r.myset_rqbl_ah_scrl == 'y') {
						window.onscroll = null;
						window.onwheel = null;
						document.onscroll = null;
						document.onwheel = null;
						document.addEventListener('scroll', function (e) {
							e.stopImmediatePropagation();
						}, true);
						document.addEventListener('wheel', function (e) {
							e.stopImmediatePropagation();
						}, true);
					}
					if (r.myset_rqbl_ah_mmove == 'y') {
						window.onmousemove = null;
						window.onmouseenter = null;
						window.onmouseleave = null;
						window.onmouseover = null;
						window.onmouseout = null;
						window.onmouseup = null;
						window.onmousedown = null;
						document.onmousemove = null;
						document.onmouseenter = null;
						document.onmouseleave = null;
						document.onmouseover = null;
						document.onmouseout = null;
						document.onmouseup = null;
						document.onmousedown = null;
						document.addEventListener('mousemove', function (e) {
							e.stopImmediatePropagation();
						}, true);
						document.addEventListener('mouseenter', function (e) {
							e.stopImmediatePropagation();
						}, true);
						document.addEventListener('mouseleave', function (e) {
							e.stopImmediatePropagation();
						}, true);
						document.addEventListener('mouseover', function (e) {
							e.stopImmediatePropagation();
						}, true);
						document.addEventListener('mouseout', function (e) {
							e.stopImmediatePropagation();
						}, true);
						document.addEventListener('mouseup', function (e) {
							e.stopImmediatePropagation();
						}, true);
						document.addEventListener('mousedown', function (e) {
							e.stopImmediatePropagation();
						}, true);
					}
					if (r.myset_rqbl_ah_touch == 'y') {
						document.addEventListener('touchstart', function (e) {
							e.stopImmediatePropagation();
						}, true);
						document.addEventListener('touchend', function (e) {
							e.stopImmediatePropagation();
						}, true);
						document.addEventListener('touchmove', function (e) {
							e.stopImmediatePropagation();
						}, true);
						document.addEventListener('touchcancel', function (e) {
							e.stopImmediatePropagation();
						}, true);
					}
					if (rr[3]) {
						setTimeout(tprb_time_b, 4720);
					}
				}
				tprb_time_a();
				tprb_time_b();
			}
			if (rr[2]) {
				if (r.myset_rqblrdr_mitm == 2 && r.myset_rqbl_mitmxmark == 'y') { //is MITM webpage
					var _tmp_title = document.title;

					function tprb_time_c() {
						if (!document.title.startsWith('[!!') && !document.title.includes('!!]')) {
							document.title = '[!!MITM!!]' + _tmp_title;
						}
						document.body.style = "border:4px dashed #" + ["e74c3c", "9b59b6", "3498db", "17a589", "196f3d", "f4d03f", "f39c12", "d35400"][Math.floor(Math.random() * 8)] + " !important";
						setTimeout(tprb_time_c, 6190);
					}
					tprb_time_c();
				}
			}
		}, onError);
	}
}, onError);
