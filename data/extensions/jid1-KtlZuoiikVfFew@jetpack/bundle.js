(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
/**
* GNU LibreJS - A browser add-on to block nonfree nontrivial JavaScript.
*
* Copyright (C) 2018 Giorgio Maone <giorgio@maone.net>
* Copyright (C) 2022 Yuchen Pei <id@ypei.org>
*
* This file is part of GNU LibreJS.
*
* GNU LibreJS is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.
*
* GNU LibreJS is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU General Public License for more details.
*
* You should have received a copy of the GNU General Public License
* along with GNU LibreJS.  If not, see <http://www.gnu.org/licenses/>.
*/

/**
  Singleton to handle external licenses, e.g. WebLabels
*/

'use strict';

const licenses = require('../common/license_definitions.json')
const licensesByLabel = new Map(Object.entries(licenses).map(([id, license]) =>
  [
    [license.identifier.toUpperCase(), license],
    [id.toUpperCase(), license],
    [license.licenseName.toUpperCase(), license]
  ]).flat());
const licensesByUrl = new Map(Object.values(licenses).map(license =>
  license.canonicalUrl.map(url => [url, license])).flat());
for (const [id, license] of Object.entries(licenses)) {
  if (!license.identifier) {
    license.identifier = id;
  }
}

const cachedHrefs = new Map();

const ExternalLicenses = {
  purgeCache(tabId) {
    cachedHrefs.delete(tabId);
  },

  /**
   * Checks external script using web labels
   * 
   * If the script cannot be found in the web labels table, returns null.
   * 
   * If the script can be found in the web labels table, and at least
   * one of its licenses can be found in our free license DB, returns
   * "free".
   *
   * Otherwise returns "nonfree".
   */
  async check(script) {
    const { url, tabId, frameId, documentUrl } = script;
    const tabCache = cachedHrefs.get(tabId);
    const frameCache = tabCache && tabCache.get(frameId);
    const cache = frameCache && frameCache.get(documentUrl);
    const scriptInfo = await browser.tabs.sendMessage(tabId, {
      action: 'checkLicensedScript',
      url,
      cache,
    }, { frameId });

    if (!(scriptInfo && scriptInfo.licenseLinks.length)) {
      return null;
    }
    scriptInfo.licenses = new Set(scriptInfo.licenseLinks.map(
      ({ label, url }) => {
        const uLabel = label.trim().toUpperCase();
        const license = licensesByLabel.get(uLabel) || licensesByUrl.get(url) ||
          licensesByLabel.get(uLabel.replace(/^GNU-|-(?:OR-LATER|ONLY)$/, ''));
        return license ? [license] : [];
      }).flat());
    scriptInfo.free = scriptInfo.licenses.size > 0;
    return scriptInfo;
  },

  /**
  * moves / creates external license references before any script in the page
  * if needed, to have them ready when the first script load is triggered.
  * It also caches the external licens href by page URL, to help not actually
  * modify the rendered HTML but rather feed the content script on demand.
  * Returns true if the document has been actually modified, false otherwise.
  */
  optimizeDocument(doc, cachePointer) {
    const cache = {};
    const { tabId, frameId, documentUrl } = cachePointer;
    const frameCache = cachedHrefs.get(tabId) || new Map();
    cachedHrefs.set(tabId, frameCache);
    frameCache.set(frameId, new Map([[documentUrl, cache]]));

    const link = doc.querySelector('link[rel="jslicense"], link[data-jslicense="1"], a[rel="jslicense"], a[data-jslicense="1"]');
    if (link) {
      const href = link.getAttribute('href');
      cache.webLabels = { href };
      const move = (link) => !!doc.head.insertBefore(link, doc.head.firstChild);
      if (link.parentNode === doc.head) {
        // TODO: eliminate let
        let node = link.previousElementSibling;
        for (; node; node = node.previousElementSibling) {
          if (node.tagName.toUpperCase() === 'SCRIPT') {
            return move(link);
          }
        }
      } else { // the reference is only in the body
        if (link.tagName.toUpperCase() === 'A') {
          const newLink = doc.createElement('link');
          newLink.rel = 'jslicense';
          newLink.setAttribute('href', href);
          return move(newLink);
        }
        return move(link);
      }
    }

    return false;
  }
};


module.exports = { ExternalLicenses };

},{"../common/license_definitions.json":10}],2:[function(require,module,exports){
/**
* GNU LibreJS - A browser add-on to block nonfree nontrivial JavaScript.
*
* Copyright (C) 2018 Giorgio Maone <giorgio@maone.net>
* Copyright (C) 2022 Yuchen Pei <id@ypei.org>
*
* This file is part of GNU LibreJS.
*
* GNU LibreJS is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.
*
* GNU LibreJS is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU General Public License for more details.
*
* You should have received a copy of the GNU General Public License
* along with GNU LibreJS.  If not, see <http://www.gnu.org/licenses/>.
*/

/*
  A class to manage whitelist/blacklist operations
*/

const { ListStore } = require('../common/Storage');

class ListManager {
  constructor(whitelist, blacklist, builtInHashes) {
    this.lists = { whitelist, blacklist };
    this.builtInHashes = new Set(builtInHashes);
  }

  static async move(fromList, toList, ...keys) {
    await Promise.all([fromList.remove(...keys), toList.store(...keys)]);
  }

  async whitelist(...keys) {
    await ListManager.move(this.lists.blacklist, this.lists.whitelist, ...keys);
  }
  async blacklist(...keys) {
    await ListManager.move(this.lists.whitelist, this.lists.blacklist, ...keys);
  }
  async forget(...keys) {
    await Promise.all(Object.values(this.lists).map(async l => await l.remove(...keys)));
  }
  /* key is a string representing either a URL or an optional path
    with a trailing (hash).
    Returns "blacklisted", "whitelisted" or defValue
  */
  getStatus(key, defValue = 'unknown') {
    const { blacklist, whitelist } = this.lists;
    const inline = ListStore.inlineItem(key);
    if (inline) {
      return blacklist.contains(inline)
        ? 'blacklisted'
        : whitelist.contains(inline) ? 'whitelisted'
          : defValue;
    }

    const match = key.match(/\(([^)]+)\)(?=[^()]*$)/);
    if (!match) {
      const url = ListStore.urlItem(key);
      const site = ListStore.siteItem(key);
      return (blacklist.contains(url) || ListManager.siteMatch(site, blacklist)
        ? 'blacklisted'
        : whitelist.contains(url) || ListManager.siteMatch(site, whitelist)
          ? 'whitelisted' : defValue
      );
    }

    const [hashItem, srcHash] = match; // (hash), hash
    return blacklist.contains(hashItem) ? 'blacklisted'
      : this.builtInHashes.has(srcHash) || whitelist.contains(hashItem)
        ? 'whitelisted'
        : defValue;
  }

  /*
    Matches by whole site ("http://some.domain.com/*") supporting also
    wildcarded subdomains ("https://*.domain.com/*").
  */
  static siteMatch(url, list) {
    const site = ListStore.siteItem(url);
    if (list.contains(site)) return site;
    // TODO: get rid of let
    for (let replaced = site.replace(/^([\w-]+:\/\/)?(\w)/, '$1*.$2'); ;) {
      if (list.contains(replaced)) return replaced;
      const oldKey = replaced;
      replaced = replaced.replace(/(?:\*\.)*\w+(?=\.)/, '*');
      if (oldKey === replaced) return null;
    }
  }
}

module.exports = { ListManager };

},{"../common/Storage":5}],3:[function(require,module,exports){
/**
* GNU LibreJS - A browser add-on to block nonfree nontrivial JavaScript.
*
* Copyright (C) 2018 Giorgio Maone <giorgio@maone.net>
*
* This file is part of GNU LibreJS.
*
* GNU LibreJS is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.
*
* GNU LibreJS is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU General Public License for more details.
*
* You should have received a copy of the GNU General Public License
* along with GNU LibreJS.  If not, see <http://www.gnu.org/licenses/>.
*/

/**
  This class parses HTTP response headers to extract both the
  MIME Content-type and the character set to be used, if specified,
  to parse textual data through a decoder.
*/

const BOM = [0xEF, 0xBB, 0xBF];
const DECODER_PARAMS = { stream: true };

class ResponseMetaData {
  constructor(request) {
    let { responseHeaders } = request;
    this.headers = {};
    for (let h of responseHeaders) {
      if (/^\s*Content-(Type|Disposition)\s*$/i.test(h.name)) {
        let propertyName = h.name.split('-')[1].trim();
        propertyName = `content${propertyName.charAt(0).toUpperCase()}${propertyName.substring(1).toLowerCase()}`;
        this[propertyName] = h.value;
        this.headers[propertyName] = h;
      }
    }
    this.computedCharset = '';
  }

  get charset() {
    let charset = '';
    if (this.contentType) {
      let m = this.contentType.match(/;\s*charset\s*=\s*(\S+)/);
      if (m) {
        charset = m[1];
      }
    }
    Object.defineProperty(this, 'charset', { value: charset, writable: false, configurable: true });
    return this.computedCharset = charset;
  }

  decode(data) {
    let charset = this.charset;
    let decoder = this.createDecoder();
    let text = decoder.decode(data, DECODER_PARAMS);
    if (!charset && /html/i.test(this.contentType)) {
      // missing HTTP charset, sniffing in content...

      if (data[0] === BOM[0] && data[1] === BOM[1] && data[2] === BOM[2]) {
        // forced UTF-8, nothing to do
        return text;
      }

      // let's try figuring out the charset from <meta> tags
      let parser = new DOMParser();
      let doc = parser.parseFromString(text, 'text/html');
      let meta = doc.querySelectorAll('meta[charset], meta[http-equiv="content-type"], meta[content*="charset"]');
      for (let m of meta) {
        charset = m.getAttribute('charset');
        if (!charset) {
          let match = m.getAttribute('content').match(/;\s*charset\s*=\s*([\w-]+)/i)
          if (match) charset = match[1];
        }
        if (charset) {
          decoder = this.createDecoder(charset, null);
          if (decoder) {
            this.computedCharset = charset;
            return decoder.decode(data, DECODER_PARAMS);
          }
        }
      }
    }
    return text;
  }

  createDecoder(charset = this.charset, def = 'latin1') {
    if (charset) {
      try {
        return new TextDecoder(charset);
      } catch (e) {
        console.error(e);
      }
    }
    return def ? new TextDecoder(def) : null;
  }
}
ResponseMetaData.UTF8BOM = new Uint8Array(BOM);

module.exports = { ResponseMetaData };

},{}],4:[function(require,module,exports){
/**
* GNU LibreJS - A browser add-on to block nonfree nontrivial JavaScript.
*
* Copyright (C) 2018 Giorgio Maone <giorgio@maone.net>
* Copyright (C) 2022 Yuchen Pei <id@ypei.org>
*
* This file is part of GNU LibreJS.
*
* GNU LibreJS is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.
*
* GNU LibreJS is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU General Public License for more details.
*
* You should have received a copy of the GNU General Public License
* along with GNU LibreJS.  If not, see <http://www.gnu.org/licenses/>.
*/

/**
  An abstraction layer over the StreamFilter API, allowing its clients to process
  only the "interesting" HTML and script requests and leaving the other alone
*/

const { ResponseMetaData } = require('./ResponseMetaData');

const listeners = new WeakMap();
const webRequestEvent = browser.webRequest.onHeadersReceived;
// Some hardcoded return values for the onHeadersReceived callback.
const BLOCKING_RESPONSES = {
  ACCEPT: {}, // Do nothing
  REJECT: { cancel: true }, // Cancel the request.  See docs of BlockingResponse
};

class ResponseProcessor {

  static install(handler, types = ['main_frame', 'sub_frame', 'script']) {
    if (listeners.has(handler)) return false;
    const listener =
      async request => await new ResponseTextFilter(request).process(handler);
    listeners.set(handler, listener);
    webRequestEvent.addListener(
      listener,
      { urls: ['<all_urls>'], types },
      ['blocking', 'responseHeaders']
    );
    return true;
  }

  static uninstall(handler) {
    const listener = listeners.get(handler);
    if (listener) {
      webRequestEvent.removeListener(listener);
    }
  }
}

class ResponseTextFilter {
  constructor(request) {
    this.request = request;
    const { type, statusCode } = request;
    const md = this.metaData = new ResponseMetaData(request);
    this.canProcess = // we want to process html documents and scripts only
      (statusCode < 300 || statusCode >= 400) && // skip redirections
      !md.disposition && // skip forced downloads
      (type === 'script' || /\bhtml\b/i.test(md.contentType));
  }

  async process(handler) {
    if (!this.canProcess) return BlockingResponses.ACCEPT;
    const { metaData, request } = this;
    const response = { request, metaData }; // we keep it around allowing callbacks to store state

    if (typeof handler.pre !== 'function' || typeof handler.post !== 'function') {
      throw new Error('handler should have a pre and post function.');
    }

    // If can determine without checking and filtering response
    // payload then return.
    const res = await handler.pre(response);
    if (res) return res;

    const { requestId } = request;
    // create a filter to modify response data, see
    // Mozilla/Add-ons/WebExtensions/API/webRequest/filterResponseData
    const filter = browser.webRequest.filterResponseData(requestId);
    let buffer = [];

    filter.ondata = event => {
      buffer.push(event.data);
    };

    filter.onstop = async _ => {
      // concatenate chunks
      const size = buffer.reduce((sum, chunk) => sum + chunk.byteLength, 0)
      let allBytes = new Uint8Array(size);
      let pos = 0;
      for (const chunk of buffer) {
        allBytes.set(new Uint8Array(chunk), pos);
        pos += chunk.byteLength;
      }
      buffer = null; // allow garbage collection
      if (allBytes.indexOf(0) !== -1) {
        console.debug('Warning: zeroes in bytestream, probable cached encoding mismatch.', request);
        if (request.type === 'script') {
          console.debug('It\'s a script, trying to refetch it.');
          response.text = await (await fetch(request.url, { cache: 'reload', credentials: 'include' })).text();
        } else {
          console.debug('It\'s a %s, trying to decode it as UTF-16.', request.type);
          response.text = new TextDecoder('utf-16be').decode(allBytes, { stream: true });
        }
      } else {
        response.text = metaData.decode(allBytes);
      }
      let editedText = null;
      try {
        editedText = await handler.post(response);
      } catch (e) {
        console.error(e);
      }
      if (editedText !== null && editedText !== response.text) {
        // we changed the content, let's re-encode
        const encoded = new TextEncoder().encode(editedText);
        // pre-pending the UTF-8 BOM will force the charset per HTML 5 specs
        allBytes = new Uint8Array(encoded.byteLength + 3);
        allBytes.set(ResponseMetaData.UTF8BOM, 0); // UTF-8 BOM
        allBytes.set(encoded, 3);
      }
      filter.write(allBytes);
      filter.close();
    }

    // Accepting the filtered payload.
    return BLOCKING_RESPONSES.ACCEPT;
  }
}

module.exports = { ResponseProcessor, BLOCKING_RESPONSES };

},{"./ResponseMetaData":3}],5:[function(require,module,exports){
/**
* GNU LibreJS - A browser add-on to block nonfree nontrivial JavaScript.
*
* Copyright (C) 2018 Giorgio Maone <giorgio@maone.net>
* Copyright (C) 2022 Yuchen Pei <id@ypei.org>
*
* This file is part of GNU LibreJS.
*
* GNU LibreJS is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.
*
* GNU LibreJS is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU General Public License for more details.
*
* You should have received a copy of the GNU General Public License
* along with GNU LibreJS.  If not, see <http://www.gnu.org/licenses/>.
*/

/**
 A tiny wrapper around extensions storage API, supporting CSV serialization for
 retro-compatibility
*/
'use strict';


const Storage = {
  ARRAY: {
    async load(key, array = undefined) {
      const result = array === undefined ?
        (await browser.storage.local.get(key))[key] : array;
      return result ? new Set(result) : new Set();
    },
    async save(key, list) {
      return await browser.storage.local.set({ [key]: [...list] });
    },
  },

  CSV: {
    async load(key) {
      const csv = (await browser.storage.local.get(key))[key];
      return csv ? new Set(csv.split(/\s*,\s*/)) : new Set();
    },

    async save(key, list) {
      return await browser.storage.local.set({ [key]: [...list].join(',') });
    }
  }
};

/**
  A class to hold and persist blacklists and whitelists
*/

class ListStore {
  constructor(key, storage = Storage.ARRAY) {
    this.key = key;
    this.storage = storage;
    this.items = new Set();
    browser.storage.onChanged.addListener(changes => {
      if (!this.saving && this.key in changes) {
        this.load(changes[this.key].newValue);
      }
    });
  }

  static inlineItem(url) {
    // here we simplify and hash inline script references
    return url.startsWith('inline:') ? url
      : url.startsWith('view-source:')
      && url.replace(/^view-source:[\w-+]+:\/+([^/]+).*#line\d+/, 'inline://$1#')
        .replace(/\n[^]*/, s => s.replace(/\s+/g, ' ').substring(0, 16) + '…' + hash(s.trim()));
  }
  static hashItem(hash) {
    return hash.startsWith('(') ? hash : `(${hash})`;
  }
  static urlItem(url) {
    const queryPos = url.indexOf('?');
    return queryPos === -1 ? url : url.substring(0, queryPos);
  }
  static siteItem(url) {
    if (url.endsWith('/*')) return url;
    try {
      return `${new URL(url).origin}/*`;
    } catch (e) {
      return `${url}/*`;
    }
  }

  async save() {
    this._saving = true;
    try {
      return await this.storage.save(this.key, this.items);
    } finally {
      this._saving = false;
    }
  }

  async load(values = undefined) {
    try {
      this.items = await this.storage.load(this.key, values);
    } catch (e) {
      console.error(e);
    }
    return this.items;
  }

  async store(...items) {
    const size = this.items.size;
    const changed = items.reduce((current, item) => size !== this.items.add(item).size || current, false);
    changed && await this.save();
  }

  async remove(...items) {
    const changed = items.reduce((current, item) => this.items.delete(item) || current, false);
    changed && await this.save();
  }

  contains(item) {
    return this.items.has(item);
  }
}

function hash(source) {
  const shaObj = new jssha('SHA-256', 'TEXT')
  shaObj.update(source);
  return shaObj.getHash('HEX');
}

if (typeof module === 'object') {
  module.exports = { ListStore, Storage, hash };
  // TODO: eliminate the var
  var jssha = require('jssha');
}

},{"jssha":14}],6:[function(require,module,exports){
/**
* GNU LibreJS - A browser add-on to block nonfree nontrivial JavaScript.
*
* Copyright (C) 2018 Giorgio Maone <giorgio@maone.net>
* Copyright (C) 2022 Yuchen Pei <id@ypei.org>
*
* This file is part of GNU LibreJS.
*
* GNU LibreJS is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.
*
* GNU LibreJS is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU General Public License for more details.
*
* You should have received a copy of the GNU General Public License
* along with GNU LibreJS.  If not, see <http://www.gnu.org/licenses/>.
*/

'use strict';
const Test = (() => {
  const RUNNER_URL = browser.runtime.getURL('/test/SpecRunner.html');
  return {
    /*
      returns RUNNER_URL if it's a test-enabled build or an about:debugging
      temporary extension session, null otherwise
    */
    async getURL() {
      try {
        await fetch(RUNNER_URL);
        return RUNNER_URL;
      } catch (e) {
        return null;
      }
    },

    async getTab(activate = false) {
      const url = await this.getURL();
      const tab = url ? (await browser.tabs.query({ url }))[0] ||
        (await browser.tabs.create({ url }))
        : null;
      if (tab && activate) {
        await browser.tabs.update(tab.id, { active: true });
      }
      return tab;
    }
  };
})();
if (typeof module === 'object') {
  module.exports = Test;
}

},{}],7:[function(require,module,exports){
/**
* GNU LibreJS - A browser add-on to block nonfree nontrivial JavaScript.
* *
* Copyright (C) 2018 Nathan Nichols
* Copyright (C) 2022 Yuchen Pei
*
* This file is part of GNU LibreJS.
*
* GNU LibreJS is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.
*
* GNU LibreJS is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU General Public License for more details.
*
* You should have received a copy of the GNU General Public License
* along with GNU LibreJS.  If not, see <http://www.gnu.org/licenses/>.
*/

const acorn = require('acorn');
const licenses = require('./license_definitions.json');
const { patternUtils } = require('./pattern_utils.js');
const { makeDebugLogger } = require('./debug.js');
const fnameData = require('./fname_data.json').fname_data;

const LIC_RE = /@licstartThefollowingistheentirelicensenoticefortheJavaScriptcodeinthis(?:page|file)(.*)?@licendTheaboveistheentirelicensenoticefortheJavaScriptcodeinthis(?:page|file)/mi;

/*
  NONTRIVIAL THINGS:
  - Fetch
  - XMLhttpRequest
  - eval()
  - ?
  JAVASCRIPT CAN BE FOUND IN:
  - Event handlers (onclick, onload, onsubmit, etc.)
  - <script>JS</script>
  - <script src="/JS.js"></script>
  WAYS TO DETERMINE PASS/FAIL:
  - "// @license [magnet link] [identifier]" then "// @license-end" (may also use /* comments)
  - Automatic whitelist: (http://bzr.savannah.gnu.org/lh/librejs/dev/annotate/head:/data/script_libraries/script-libraries.json_
*/
// These are objects that it will search for in an initial regex pass over non-free scripts.
const RESERVED_OBJECTS = [
  //"document",
  //"window",
  'fetch',
  'XMLHttpRequest',
  'chrome', // only on chrome
  'browser', // only on firefox
  'eval'
];
const LOOPKEYS = new Set(['for', 'if', 'while', 'switch']);
const OPERATORS = new Set(['||', '&&', '=', '==', '++', '--', '+=', '-=', '*']);
// @license match, second and third capture groups are canonicalUrl
// and license name
// Caveat: will not work in a commented out star comments:
// '// /* @license */ ... /* @license-end */' will be checked, though
// the whole thing is a comment
const OPENING_LICENSE_RE1 = /^\s*\/\/\s*@license\s+(\S+)\s+(\S+).*$/mi;
const OPENING_LICENSE_RE2 = /\/\*\s*?@license\s+(\S+)\s+([^/*]+).*\*\//mi;
const CLOSING_LICENSE_RE1 = /^\s*\/\/\s*@license-end\s*/mi;
const CLOSING_LICENSE_RE2 = /\/\*\s*@license-end\s*\*\//mi;
/**
*	If this is true, it evaluates entire scripts instead of returning as soon as it encounters a violation.
*
*	Also, it controls whether or not this part of the code logs to the console.
*
*/
const DEBUG = false; // debug the JS evaluation
const PRINT_DEBUG = false;
const dbg_print = makeDebugLogger('checks.js', PRINT_DEBUG, Date.now());

/**
 * stripLicenseToRegexp
 *
 * Removes all non-alphanumeric characters except for the 
 * special tokens, and replace the text values that are 
 * hardcoded in license_definitions.js.  Puts the result in
 * the regex field of the fragments.
 *
 */
const stripLicenseToRegexp = function(license) {
  for (const frag of license.licenseFragments) {
    frag.regex = patternUtils.removeNonalpha(frag.text);
    frag.regex = new RegExp(
      patternUtils.replaceTokens(frag.regex), '');
  }
};

const init = function() {
  console.log('initializing regexes');
  for (const key in licenses) {
    stripLicenseToRegexp(licenses[key]);
  }
}

/**
*
*	Takes in the declaration that has been preprocessed and 
*	tests it against regexes in licenses.
*/
const searchTable = function(strippedComment) {
  const stripped = patternUtils.removeNonalpha(strippedComment);
  // looking up license
  for (const key in licenses) {
    const license = licenses[key];
    for (const frag of license.licenseFragments) {
      if (frag.regex.test(stripped)) {
        return license.licenseName;
      }
    }
  }
  console.log('No global license found.');
  return null;
}

/**
 * Checks whether licenseText, modulo whitespace, starts with
 * a @licstart .. @licend with a free license, returns the license name
 * if so, and null otherwise.
 */
const checkLicenseText = function(licenseText) {
  if (licenseText === undefined || licenseText === null) {
    return null;
  }
  // remove whitespace
  const stripped = patternUtils.removeWhitespace(licenseText);
  // Search for @licstart/@licend
  const matches = stripped.match(LIC_RE);
  return matches && searchTable(matches[0]);
};

//************************this part can be tested in the HTML file index.html's script test.js****************************

/**
 * Checks whether script is trivial by analysing its tokens.
 *
 * Returns an array of
 * [flag (boolean, true if trivial), reason (string, human readable report)].
 */
function fullEvaluate(script) {
  if (script === undefined || script == '') {
    return [true, 'Harmless null script'];
  }

  let tokens;

  try {
    tokens = acorn.tokenizer(script);
  } catch (e) {
    console.warn('Tokenizer could not be initiated (probably invalid code)');
    return [false, 'Tokenizer could not be initiated (probably invalid code)'];
  }
  try {
    var toke = tokens.getToken();
  } catch (e) {
    console.log(script);
    console.log(e);
    console.warn('couldn\'t get first token (probably invalid code)');
    console.warn('Continuing evaluation');
  }

  let amtloops = 0;
  let definesFunctions = false;

  /**
  * Given the end of an identifer token, it tests for parentheses
  */
  function is_bsn(end) {
    let i = 0;
    while (script.charAt(end + i).match(/\s/g) !== null) {
      i++;
      if (i >= script.length - 1) {
        return false;
      }
    }
    return script.charAt(end + i) == '[';
  }

  function evaluateByTokenValue(toke) {
    const value = toke.value;
    if (OPERATORS.has(value)) {
      // It's just an operator. Javascript doesn't have operator overloading so it must be some
      // kind of primitive (I.e. a number)
    } else {
      const status = fnameData[value];
      if (status === true) { // is the identifier banned?
        dbg_print('%c NONTRIVIAL: nontrivial token: \'' + value + '\'', 'color:red');
        if (DEBUG == false) {
          return [false, 'NONTRIVIAL: nontrivial token: \'' + value + '\''];
        }
      } else if (status === false || status === undefined) {// is the identifier not banned or user defined?
        // Is there bracket suffix notation?
        if (is_bsn(toke.end)) {
          dbg_print('%c NONTRIVIAL: Bracket suffix notation on variable \'' + value + '\'', 'color:red');
          if (DEBUG == false) {
            return [false, '%c NONTRIVIAL: Bracket suffix notation on variable \'' + value + '\''];
          }
        }
      } else {
        dbg_print('trivial token:' + value);
      }
    }
    return [true, ''];
  }

  function evaluateByTokenTypeKeyword(keyword) {
    if (toke.type.keyword == 'function') {
      dbg_print('%c NOTICE: Function declaration.', 'color:green');
      definesFunctions = true;
    }

    if (LOOPKEYS.has(keyword)) {
      amtloops++;
      if (amtloops > 3) {
        dbg_print('%c NONTRIVIAL: Too many loops/conditionals.', 'color:red');
        if (DEBUG == false) {
          return [false, 'NONTRIVIAL: Too many loops/conditionals.'];
        }
      }
    }
    return [true, ''];
  }

  while (toke !== undefined && toke.type != acorn.tokTypes.eof) {
    if (toke.type.keyword !== undefined) {
      //dbg_print("Keyword:");
      //dbg_print(toke);

      // This type of loop detection ignores functional loop alternatives and ternary operators
      const tokeTypeRes = evaluateByTokenTypeKeyword(toke.type.keyword);
      if (tokeTypeRes[0] === false) {
        return tokeTypeRes;
      }
    } else if (toke.value !== undefined) {
      const tokeValRes = evaluateByTokenValue(toke);
      if (tokeValRes[0] === false) {
        return tokeValRes;
      }
    }
    // If not a keyword or an identifier it's some kind of operator, field parenthesis, brackets
    try {
      toke = tokens.getToken();
    } catch (e) {
      dbg_print('Denied script because it cannot be parsed.');
      return [false, 'NONTRIVIAL: Cannot be parsed. This could mean it is a 404 error.'];
    }
  }

  dbg_print('%cAppears to be trivial.', 'color:green;');
  if (definesFunctions === true)
    return [true, 'Script appears to be trivial but defines functions.'];
  else
    return [true, 'Script appears to be trivial.'];
}


//****************************************************************************************************
/**
*	This is the entry point for full code evaluation for triviality.
*
*	Performs the initial pass on code to see if it needs to be completely parsed
*
*	This can only determine if a script is bad, not if it's good
*
*	If it passes the intitial pass, it runs the full pass and returns the result

*	It returns an array of [flag (boolean, false if "bad"), reason (string, human readable report)]
*
*/
function evaluate(script, name) {
  const reservedResult = evaluateForReservedObj(script, name);
  if (reservedResult[0] === true) {
    dbg_print('%c pass', 'color:green;');
  } else {
    return reservedResult;
  }

  return fullEvaluate(script);
}

function evaluateForReservedObj(script, name) {
  function reservedObjectRegex(object) {
    const arithOperators = '\\+\\-\\*\\/\\%\\=';
    return new RegExp('(?:[^\\w\\d]|^|(?:' + arithOperators + '))' + object + '(?:\\s*?(?:[\\;\\,\\.\\(\\[])\\s*?)', 'g');
  }
  const mlComment = /\/\*([\s\S]+?)\*\//g;
  const ilComment = /\/\/.+/gm;
  const temp = script.replace(/'.+?'+/gm, '\'string\'').replace(/".+?"+/gm, '"string"').replace(mlComment, '').replace(ilComment, '');
  dbg_print('%c ------evaluation results for ' + name + '------', 'color:white');
  dbg_print('Script accesses reserved objects?');

  // 	This is where individual "passes" are made over the code
  for (const reserved of RESERVED_OBJECTS) {
    if (reservedObjectRegex(reserved).exec(temp) != null) {
      dbg_print('%c fail', 'color:red;');
      return [false, 'Script uses a reserved object (' + reserved + ')'];
    }
  }
  return [true, 'Reserved object not found.'];
}

/**
 * Checks whether url is the magnet link of a license.
 * 
 * Returns the licenseName if so, otherwise returns null.  If a key is
 * supplied, checks for the license with the key only.
 */
function checkMagnet(url, key = null) {
  const fixedUrl = url.replace(/&amp;/g, '&');
  // Match by magnet link
  const checkLicenseMagnet = license => {
    for (const cUrl of license.canonicalUrl) {
      if (cUrl.startsWith('magnet:') && fixedUrl === cUrl) {
        return license.licenseName;
      }
    }
    return null;
  }

  if (key) {
    try {
      return checkLicenseMagnet(licenses[key]);
    } catch (error) {
      return null;
    }
  } else {
    for (const key in licenses) {
      const result = checkLicenseMagnet(licenses[key]);
      if (result) return result;
    }
    return null;
  }
}


/**
 *
 *	Evaluates the content of a script for licenses and triviality
 * scriptSrc: content of the script; name: script name; external:
 * whether the script is external
 *
 *	Returns
 *	[
 *		true (accepted) or false (denied),
 *		edited content,
 *		reason text
 *	]
 */
function checkScriptSource(scriptSrc, name, external = false) {
  let inSrc = scriptSrc.trim();
  if (!inSrc) return [true, scriptSrc, 'Empty source.'];

  // Check for @licstart .. @licend method
  const license = checkLicenseText(scriptSrc);
  if (license) {
    return [true, scriptSrc, `Licensed under: ${license}`];
  }

  let outSrc = '';
  let reason = '';
  let partsDenied = false;
  let partsAccepted = false;

  function checkTriviality(s) {
    if (!patternUtils.removeJsComments(s).trim()) {
      return true; // empty, ignore it
    }
    const [trivial, message] = external ?
      [false, 'External script with no known license']
      : evaluate(s, name);
    if (trivial) {
      partsAccepted = true;
      outSrc += s;
    } else {
      partsDenied = true;
      if (s.startsWith('javascript:'))
        outSrc += `# LIBREJS BLOCKED: ${message}`;
      else
        outSrc += `/*\nLIBREJS BLOCKED: ${message}\n*/`;
    }
    reason += `\n${message}`;
  }

  // Consume inSrc by checking licenses in all @license / @license-end
  // blocks and triviality outside these blocks
  while (inSrc) {
    const openingMatch1 = OPENING_LICENSE_RE1.exec(inSrc);
    const openingMatch2 = OPENING_LICENSE_RE2.exec(inSrc);
    const openingMatch =
      (openingMatch1 && openingMatch2) ?
        (openingMatch1.index < openingMatch2.index ? openingMatch1
          : openingMatch2)
        : (openingMatch1 || openingMatch2);
    const openingIndex = openingMatch ? openingMatch.index : inSrc.length;
    // checks the triviality of the code before the license tag, if any
    checkTriviality(inSrc.substring(0, openingIndex));
    inSrc = inSrc.substring(openingIndex);
    if (!inSrc) break;

    // checks the remaining part, that starts with an @license
    const closureMatch1 = CLOSING_LICENSE_RE1.exec(inSrc);
    const closureMatch2 = CLOSING_LICENSE_RE2.exec(inSrc);
    const closureMatch =
      (closureMatch1 && closureMatch2) ?
        (closureMatch1.index < closureMatch2.index ? closureMatch1
          : closureMatch2)
        : (closureMatch1 || closureMatch2);
    if (!closureMatch) {
      const msg = 'ERROR: @license with no @license-end';
      return [false, `\n/*\n ${msg} \n*/\n`, msg];
    }
    const closureEndIndex = closureMatch.index + closureMatch[0].length;

    if (!(Array.isArray(openingMatch) && openingMatch.length >= 3)) {
      return [false, 'Malformed or unrecognized license tag.'];
    }
    const licenseName = checkMagnet(openingMatch[1]);
    let message;
    if (licenseName) {
      outSrc += inSrc.substr(0, closureEndIndex);
      partsAccepted = true;
      message = `Recognized license: "${licenseName}".`
    } else {
      outSrc += `\n/*\n${message}\n*/\n`;
      partsDenied = true;
      message = `Unrecognized license tag: "${openingMatch[0]}"`;
    }
    reason += `\n${message}`;

    // trim off everything we just evaluated
    inSrc = inSrc.substring(closureEndIndex).trim();
  }

  if (partsDenied) {
    if (partsAccepted) {
      reason = `Some parts of the script have been disabled (check the source for details).\n^--- ${reason}`;
    }
    return [false, outSrc, reason];
  }

  return [true, scriptSrc, reason];
}

module.exports = { init, checkLicenseText, checkMagnet, checkScriptSource };

},{"./debug.js":8,"./fname_data.json":9,"./license_definitions.json":10,"./pattern_utils.js":11,"acorn":13}],8:[function(require,module,exports){
/**
* GNU LibreJS - A browser add-on to block nonfree nontrivial JavaScript.
* *
* Copyright (C) 2017, 2018 Nathan Nichols
* Copyright (C) 2018 Ruben Rodriguez <ruben@gnu.org>
* Copyright (C) 2022 Yuchen Pei <id@ypei.org>
*
* This file is part of GNU LibreJS.
*
* GNU LibreJS is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.
*
* GNU LibreJS is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU General Public License for more details.
*
* You should have received a copy of the GNU General Public License
* along with GNU LibreJS.  If not, see <http://www.gnu.org/licenses/>.
*/

const makeDebugLogger = (origin, enabled, time) => {
  return (a, b) => {
    if (enabled) {
      console.log('[' + origin + '] Time spent so far: ' + (Date.now() - time) / 1000 + ' seconds');
      if (b === undefined) {
        console.log(a);
      } else {
        console.log(a, b);
      }
    }
  }
}

module.exports = { makeDebugLogger };

},{}],9:[function(require,module,exports){
module.exports={
	"fname_data": {
		"WebGLShader": true,
		"WebGLShaderPrecisionFormat": true,
		"WebGLQuery": true,
		"WebGLRenderbuffer": true,
		"WebGLSampler": true,
		"WebGLUniformLocation": true,
		"WebGLFramebuffer": true,
		"WebGLProgram": true,
		"WebGLContextEvent": true,
		"WebGL2RenderingContext": true,
		"WebGLTexture": true,
		"WebGLRenderingContext": true,
		"WebGLVertexArrayObject": true,
		"WebGLActiveInfo": true,
		"WebGLTransformFeedback": true,
		"WebGLSync": true,
		"WebGLBuffer": true,
		"cat_svg": true,
		"SVGPoint": true,
		"SVGEllipseElement": true,
		"SVGRadialGradientElement": true,
		"SVGComponentTransferFunctionElement": true,
		"SVGPathSegCurvetoQuadraticAbs": true,
		"SVGAnimatedNumberList": true,
		"SVGPathSegCurvetoQuadraticSmoothRel": true,
		"SVGFEColorMatrixElement": true,
		"SVGPathSegLinetoHorizontalAbs": true,
		"SVGLinearGradientElement": true,
		"SVGStyleElement": true,
		"SVGPathSegMovetoRel": true,
		"SVGStopElement": true,
		"SVGPathSegLinetoRel": true,
		"SVGFEConvolveMatrixElement": true,
		"SVGAnimatedAngle": true,
		"SVGPathSegLinetoAbs": true,
		"SVGPreserveAspectRatio": true,
		"SVGFEOffsetElement": true,
		"SVGFEImageElement": true,
		"SVGFEDiffuseLightingElement": true,
		"SVGAnimatedNumber": true,
		"SVGTextElement": true,
		"SVGFESpotLightElement": true,
		"SVGFEMorphologyElement": true,
		"SVGAngle": true,
		"SVGScriptElement": true,
		"SVGFEDropShadowElement": true,
		"SVGPathSegArcRel": true,
		"SVGNumber": true,
		"SVGPathSegLinetoHorizontalRel": true,
		"SVGFEFuncBElement": true,
		"SVGClipPathElement": true,
		"SVGPathSeg": true,
		"SVGUseElement": true,
		"SVGPathSegArcAbs": true,
		"SVGPathSegCurvetoQuadraticSmoothAbs": true,
		"SVGRect": true,
		"SVGAnimatedPreserveAspectRatio": true,
		"SVGImageElement": true,
		"SVGAnimatedEnumeration": true,
		"SVGAnimatedLengthList": true,
		"SVGFEFloodElement": true,
		"SVGFECompositeElement": true,
		"SVGAElement": true,
		"SVGAnimatedBoolean": true,
		"SVGMaskElement": true,
		"SVGFilterElement": true,
		"SVGPathSegLinetoVerticalRel": true,
		"SVGAnimatedInteger": true,
		"SVGTSpanElement": true,
		"SVGMarkerElement": true,
		"SVGStringList": true,
		"SVGTransform": true,
		"SVGTitleElement": true,
		"SVGFEBlendElement": true,
		"SVGTextPositioningElement": true,
		"SVGFEFuncGElement": true,
		"SVGFEPointLightElement": true,
		"SVGAnimateElement": true,
		"SVGPolylineElement": true,
		"SVGDefsElement": true,
		"SVGPathSegList": true,
		"SVGAnimatedTransformList": true,
		"SVGPathSegClosePath": true,
		"SVGGradientElement": true,
		"SVGSwitchElement": true,
		"SVGViewElement": true,
		"SVGUnitTypes": true,
		"SVGPathSegMovetoAbs": true,
		"SVGSymbolElement": true,
		"SVGFEFuncAElement": true,
		"SVGAnimatedString": true,
		"SVGFEMergeElement": true,
		"SVGPathSegLinetoVerticalAbs": true,
		"SVGAnimationElement": true,
		"SVGPathSegCurvetoCubicAbs": true,
		"SVGLength": true,
		"SVGTextPathElement": true,
		"SVGPolygonElement": true,
		"SVGAnimatedRect": true,
		"SVGPathSegCurvetoCubicRel": true,
		"SVGFEFuncRElement": true,
		"SVGLengthList": true,
		"SVGTextContentElement": true,
		"SVGFETurbulenceElement": true,
		"SVGMatrix": true,
		"SVGZoomAndPan": true,
		"SVGMetadataElement": true,
		"SVGFEDistantLightElement": true,
		"SVGAnimateMotionElement": true,
		"SVGDescElement": true,
		"SVGPathSegCurvetoCubicSmoothRel": true,
		"SVGFESpecularLightingElement": true,
		"SVGFEGaussianBlurElement": true,
		"SVGFEComponentTransferElement": true,
		"SVGNumberList": true,
		"SVGTransformList": true,
		"SVGForeignObjectElement": true,
		"SVGRectElement": true,
		"SVGFEDisplacementMapElement": true,
		"SVGAnimateTransformElement": true,
		"SVGAnimatedLength": true,
		"SVGPointList": true,
		"SVGPatternElement": true,
		"SVGPathSegCurvetoCubicSmoothAbs": true,
		"SVGCircleElement": true,
		"SVGSetElement": true,
		"SVGFETileElement": true,
		"SVGMPathElement": true,
		"SVGFEMergeNodeElement": true,
		"SVGPathSegCurvetoQuadraticRel": true,
		"SVGElement": true,
		"SVGGraphicsElement": true,
		"SVGSVGElement": true,
		"SVGGElement": true,
		"SVGGeometryElement": true,
		"SVGPathElement": true,
		"SVGLineElement": true,
		"cat_html": true,
		"HTMLTimeElement": true,
		"HTMLPictureElement": true,
		"HTMLMenuItemElement": true,
		"HTMLFormElement": true,
		"HTMLOptionElement": true,
		"HTMLCanvasElement": true,
		"HTMLTableSectionElement": true,
		"HTMLSelectElement": true,
		"HTMLUListElement": true,
		"HTMLMetaElement": true,
		"HTMLLinkElement": true,
		"HTMLBaseElement": true,
		"HTMLDataListElement": true,
		"HTMLInputElement": true,
		"HTMLMeterElement": true,
		"HTMLSourceElement": true,
		"HTMLTrackElement": true,
		"HTMLTableColElement": true,
		"HTMLFieldSetElement": true,
		"HTMLDirectoryElement": true,
		"HTMLTableCellElement": true,
		"HTMLStyleElement": true,
		"HTMLAudioElement": true,
		"HTMLLegendElement": true,
		"HTMLOListElement": true,
		"HTMLEmbedElement": true,
		"HTMLQuoteElement": true,
		"HTMLMenuElement": true,
		"HTMLHeadElement": true,
		"HTMLUnknownElement": true,
		"HTMLBRElement": true,
		"HTMLProgressElement": true,
		"HTMLMediaElement": true,
		"HTMLFormControlsCollection": true,
		"HTMLCollection": true,
		"HTMLLIElement": true,
		"HTMLDetailsElement": true,
		"HTMLObjectElement": true,
		"HTMLHeadingElement": true,
		"HTMLTableCaptionElement": true,
		"HTMLPreElement": true,
		"HTMLAllCollection": true,
		"HTMLFrameSetElement": true,
		"HTMLFontElement": true,
		"HTMLFrameElement": true,
		"HTMLAnchorElement": true,
		"HTMLOptGroupElement": true,
		"HTMLVideoElement": true,
		"HTMLModElement": true,
		"HTMLBodyElement": true,
		"HTMLTableElement": true,
		"HTMLButtonElement": true,
		"HTMLTableRowElement": true,
		"HTMLAreaElement": true,
		"HTMLDataElement": true,
		"HTMLParamElement": true,
		"HTMLLabelElement": true,
		"HTMLTemplateElement": true,
		"HTMLOptionsCollection": true,
		"HTMLIFrameElement": true,
		"HTMLTitleElement": true,
		"HTMLMapElement": true,
		"HTMLOutputElement": true,
		"HTMLDListElement": true,
		"HTMLParagraphElement": true,
		"HTMLHRElement": true,
		"HTMLImageElement": true,
		"HTMLDocument": true,
		"HTMLElement": true,
		"HTMLScriptElement": true,
		"HTMLHtmlElement": true,
		"HTMLTextAreaElement": true,
		"HTMLDivElement": true,
		"HTMLSpanElement": true,
		"cat_css": true,
		"CSSStyleRule": true,
		"CSSFontFaceRule": true,
		"CSSPrimitiveValue": true,
		"CSSStyleDeclaration": true,
		"CSSStyleSheet": true,
		"CSSPageRule": true,
		"CSSSupportsRule": true,
		"CSSMozDocumentRule": true,
		"CSSKeyframeRule": true,
		"CSSGroupingRule": true,
		"CSS2Properties": true,
		"CSSFontFeatureValuesRule": true,
		"CSSRuleList": true,
		"CSSPseudoElement": true,
		"CSSMediaRule": true,
		"CSSCounterStyleRule": true,
		"CSSImportRule": true,
		"CSSTransition": true,
		"CSSAnimation": true,
		"CSSValue": true,
		"CSSNamespaceRule": true,
		"CSSRule": true,
		"CSS": true,
		"CSSKeyframesRule": true,
		"CSSConditionRule": true,
		"CSSValueList": true,
		"cat_event": true,
		"ondevicemotion": true,
		"ondeviceorientation": true,
		"onabsolutedeviceorientation": true,
		"ondeviceproximity": true,
		"onuserproximity": true,
		"ondevicelight": true,
		"onvrdisplayconnect": true,
		"onvrdisplaydisconnect": true,
		"onvrdisplayactivate": true,
		"onvrdisplaydeactivate": true,
		"onvrdisplaypresentchange": true,
		"onabort": true,
		"onblur": true,
		"onfocus": true,
		"onauxclick": true,
		"oncanplay": true,
		"oncanplaythrough": true,
		"onchange": true,
		"onclick": true,
		"onclose": true,
		"oncontextmenu": true,
		"ondblclick": true,
		"ondrag": true,
		"ondragend": true,
		"ondragenter": true,
		"ondragexit": true,
		"ondragleave": true,
		"ondragover": true,
		"ondragstart": true,
		"ondrop": true,
		"ondurationchange": true,
		"onemptied": true,
		"onended": true,
		"oninput": true,
		"oninvalid": true,
		"onkeydown": true,
		"onkeypress": true,
		"onkeyup": true,
		"onload": true,
		"onloadeddata": true,
		"onloadedmetadata": true,
		"onloadend": true,
		"onloadstart": true,
		"onmousedown": true,
		"onmouseenter": true,
		"onmouseleave": true,
		"onmousemove": true,
		"onmouseout": true,
		"onmouseover": true,
		"onmouseup": true,
		"onwheel": true,
		"onpause": true,
		"onplay": true,
		"onplaying": true,
		"onprogress": true,
		"onratechange": true,
		"onreset": true,
		"onresize": true,
		"onscroll": true,
		"onseeked": true,
		"onseeking": true,
		"onselect": true,
		"onshow": true,
		"onstalled": true,
		"onsubmit": true,
		"onsuspend": true,
		"ontimeupdate": true,
		"onvolumechange": true,
		"onwaiting": true,
		"onselectstart": true,
		"ontoggle": true,
		"onpointercancel": true,
		"onpointerdown": true,
		"onpointerup": true,
		"onpointermove": true,
		"onpointerout": true,
		"onpointerover": true,
		"onpointerenter": true,
		"onpointerleave": true,
		"ongotpointercapture": true,
		"onlostpointercapture": true,
		"onmozfullscreenchange": true,
		"onmozfullscreenerror": true,
		"onanimationcancel": true,
		"onanimationend": true,
		"onanimationiteration": true,
		"onanimationstart": true,
		"ontransitioncancel": true,
		"ontransitionend": true,
		"ontransitionrun": true,
		"ontransitionstart": true,
		"onwebkitanimationend": true,
		"onwebkitanimationiteration": true,
		"onwebkitanimationstart": true,
		"onwebkittransitionend": true,
		"onerror": false,
		"onafterprint": true,
		"onbeforeprint": true,
		"onbeforeunload": true,
		"onhashchange": true,
		"onlanguagechange": true,
		"onmessage": true,
		"onmessageerror": true,
		"onoffline": true,
		"ononline": true,
		"onpagehide": true,
		"onpageshow": true,
		"onpopstate": true,
		"onstorage": true,
		"onunload": true,
		"cat_rtc": true,
		"RTCDTMFSender": true,
		"RTCStatsReport": true,
		"RTCTrackEvent": true,
		"RTCDataChannelEvent": true,
		"RTCPeerConnectionIceEvent": true,
		"RTCCertificate": true,
		"RTCDTMFToneChangeEvent": true,
		"RTCPeerConnection": true,
		"RTCIceCandidate": true,
		"RTCRtpReceiver": true,
		"RTCRtpSender": true,
		"RTCSessionDescription": true,
		"cat_vr": true,
		"VRStageParameters": true,
		"VRFrameData": true,
		"VRDisplay": true,
		"VRDisplayEvent": true,
		"VRFieldOfView": true,
		"VRDisplayCapabilities": true,
		"VREyeParameters": true,
		"VRPose": true,
		"cat_dom": true,
		"DOMStringMap": true,
		"DOMRectReadOnly": true,
		"DOMException": true,
		"DOMRect": true,
		"DOMMatrix": true,
		"DOMMatrixReadOnly": true,
		"DOMPointReadOnly": true,
		"DOMPoint": true,
		"DOMQuad": true,
		"DOMRequest": true,
		"DOMParser": true,
		"DOMTokenList": true,
		"DOMStringList": true,
		"DOMImplementation": true,
		"DOMError": true,
		"DOMRectList": true,
		"DOMCursor": true,
		"cat_idb": true,
		"IDBFileRequest": true,
		"IDBTransaction": true,
		"IDBCursor": true,
		"IDBFileHandle": true,
		"IDBMutableFile": true,
		"IDBKeyRange": true,
		"IDBVersionChangeEvent": true,
		"IDBObjectStore": true,
		"IDBFactory": true,
		"IDBCursorWithValue": true,
		"IDBOpenDBRequest": true,
		"IDBRequest": true,
		"IDBIndex": true,
		"IDBDatabase": true,
		"cat_audio": true,
		"AudioContext": true,
		"AudioBuffer": true,
		"AudioBufferSourceNode": true,
		"Audio": true,
		"MediaElementAudioSourceNode": true,
		"AudioNode": true,
		"BaseAudioContext": true,
		"AudioListener": true,
		"MediaStreamAudioSourceNode": true,
		"OfflineAudioContext": true,
		"AudioDestinationNode": true,
		"AudioParam": true,
		"MediaStreamAudioDestinationNode": true,
		"OfflineAudioCompletionEvent": true,
		"AudioStreamTrack": true,
		"AudioScheduledSourceNode": true,
		"AudioProcessingEvent": true,
		"cat_gamepad": true,
		"GamepadButton": true,
		"GamepadHapticActuator": true,
		"GamepadAxisMoveEvent": true,
		"GamepadPose": true,
		"GamepadEvent": true,
		"Gamepad": true,
		"GamepadButtonEvent": true,
		"cat_media": true,
		"MediaKeys": true,
		"MediaKeyError": true,
		"MediaSource": true,
		"MediaDevices": true,
		"MediaKeyStatusMap": true,
		"MediaStreamTrackEvent": true,
		"MediaRecorder": true,
		"MediaQueryListEvent": true,
		"MediaStream": true,
		"MediaEncryptedEvent": true,
		"MediaStreamTrack": true,
		"MediaError": true,
		"MediaStreamEvent": true,
		"MediaQueryList": true,
		"MediaKeySystemAccess": true,
		"MediaDeviceInfo": true,
		"MediaKeySession": true,
		"MediaList": true,
		"MediaRecorderErrorEvent": true,
		"MediaKeyMessageEvent": true,
		"cat_event2": true,
		"SpeechSynthesisErrorEvent": true,
		"BeforeUnloadEvent": true,
		"CustomEvent": true,
		"PageTransitionEvent": true,
		"PopupBlockedEvent": true,
		"CloseEvent": true,
		"ProgressEvent": true,
		"MutationEvent": true,
		"MessageEvent": true,
		"FocusEvent": true,
		"TrackEvent": true,
		"DeviceMotionEvent": true,
		"TimeEvent": true,
		"PointerEvent": true,
		"UserProximityEvent": true,
		"StorageEvent": true,
		"DragEvent": true,
		"MouseScrollEvent": true,
		"EventSource": true,
		"PopStateEvent": true,
		"DeviceProximityEvent": true,
		"SpeechSynthesisEvent": true,
		"XMLHttpRequestEventTarget": true,
		"ClipboardEvent": true,
		"AnimationPlaybackEvent": true,
		"DeviceLightEvent": true,
		"BlobEvent": true,
		"MouseEvent": true,
		"WheelEvent": true,
		"InputEvent": true,
		"HashChangeEvent": true,
		"DeviceOrientationEvent": true,
		"CompositionEvent": true,
		"KeyEvent": true,
		"ScrollAreaEvent": true,
		"KeyboardEvent": true,
		"TransitionEvent": true,
		"ErrorEvent": true,
		"AnimationEvent": true,
		"FontFaceSetLoadEvent": true,
		"EventTarget": true,
		"captureEvents": true,
		"releaseEvents": true,
		"Event": true,
		"UIEvent": true,
		"cat_other": false,
		"undefined": false,
		"Array": false,
		"Boolean": false,
		"JSON": false,
		"Date": false,
		"Math": false,
		"Number": false,
		"String": false,
		"RegExp": false,
		"Error": false,
		"InternalError": false,
		"EvalError": false,
		"RangeError": false,
		"ReferenceError": false,
		"SyntaxError": false,
		"TypeError": false,
		"URIError": false,
		"ArrayBuffer": true,
		"Int8Array": true,
		"Uint8Array": true,
		"Int16Array": true,
		"Uint16Array": true,
		"Int32Array": true,
		"Uint32Array": true,
		"Float32Array": true,
		"Float64Array": true,
		"Uint8ClampedArray": true,
		"Proxy": true,
		"WeakMap": true,
		"Map": true,
		"Set": true,
		"DataView": false,
		"Symbol": false,
		"SharedArrayBuffer": true,
		"Intl": false,
		"TypedObject": true,
		"Reflect": true,
		"SIMD": true,
		"WeakSet": true,
		"Atomics": true,
		"Promise": true,
		"WebAssembly": true,
		"NaN": false,
		"Infinity": false,
		"isNaN": false,
		"isFinite": false,
		"parseFloat": false,
		"parseInt": false,
		"escape": false,
		"unescape": false,
		"decodeURI": false,
		"encodeURI": false,
		"decodeURIComponent": false,
		"encodeURIComponent": false,
		"uneval": false,
		"BatteryManager": true,
		"CanvasGradient": true,
		"TextDecoder": true,
		"Plugin": true,
		"PushManager": true,
		"ChannelMergerNode": true,
		"PerformanceResourceTiming": true,
		"ServiceWorker": true,
		"TextTrackCueList": true,
		"PerformanceEntry": true,
		"TextTrackList": true,
		"StyleSheet": true,
		"PerformanceMeasure": true,
		"DesktopNotificationCenter": true,
		"Comment": true,
		"DelayNode": true,
		"XPathResult": true,
		"CDATASection": true,
		"MessageChannel": true,
		"BiquadFilterNode": true,
		"SpeechSynthesisUtterance": true,
		"Crypto": true,
		"Navigator": true,
		"FileList": true,
		"URLSearchParams": false,
		"ServiceWorkerContainer": true,
		"ValidityState": true,
		"ProcessingInstruction": true,
		"AbortSignal": true,
		"FontFace": true,
		"FileReader": true,
		"Worker": true,
		"External": true,
		"ImageBitmap": true,
		"TimeRanges": true,
		"Option": true,
		"TextTrack": true,
		"Image": true,
		"AnimationTimeline": true,
		"VideoPlaybackQuality": true,
		"VTTCue": true,
		"Storage": true,
		"XPathExpression": true,
		"CharacterData": false,
		"TextMetrics": true,
		"AnimationEffectReadOnly": true,
		"PerformanceTiming": false,
		"PerformanceMark": true,
		"ImageBitmapRenderingContext": true,
		"Headers": true,
		"Range": false,
		"Rect": true,
		"AnimationEffectTimingReadOnly": true,
		"KeyframeEffect": true,
		"Permissions": true,
		"TextEncoder": true,
		"ImageData": true,
		"SpeechSynthesisVoice": true,
		"StorageManager": true,
		"TextTrackCue": true,
		"WebSocket": true,
		"DocumentType": true,
		"XPathEvaluator": true,
		"PerformanceNavigationTiming": true,
		"IdleDeadline": true,
		"FileSystem": true,
		"FileSystemFileEntry": true,
		"CacheStorage": true,
		"MimeType": true,
		"PannerNode": true,
		"NodeFilter": true,
		"StereoPannerNode": true,
		"console": false,
		"DynamicsCompressorNode": true,
		"PaintRequest": true,
		"RGBColor": true,
		"FontFaceSet": false,
		"PaintRequestList": true,
		"FileSystemEntry": true,
		"XMLDocument": false,
		"SourceBuffer": false,
		"Screen": true,
		"NamedNodeMap": false,
		"History": true,
		"Response": true,
		"AnimationEffectTiming": true,
		"ServiceWorkerRegistration": true,
		"CanvasRenderingContext2D": true,
		"ScriptProcessorNode": true,
		"FileSystemDirectoryReader": true,
		"MimeTypeArray": true,
		"CanvasCaptureMediaStream": true,
		"Directory": true,
		"mozRTCPeerConnection": true,
		"PerformanceObserverEntryList": true,
		"PushSubscriptionOptions": true,
		"Text": false,
		"IntersectionObserverEntry": true,
		"SubtleCrypto": true,
		"Animation": true,
		"DataTransfer": true,
		"TreeWalker": true,
		"XMLHttpRequest": true,
		"LocalMediaStream": true,
		"ConvolverNode": true,
		"WaveShaperNode": true,
		"DataTransferItemList": false,
		"Request": true,
		"SourceBufferList": false,
		"XSLTProcessor": true,
		"XMLHttpRequestUpload": true,
		"SharedWorker": true,
		"Notification": false,
		"DataTransferItem": true,
		"AnalyserNode": true,
		"mozRTCIceCandidate": true,
		"PerformanceObserver": true,
		"OfflineResourceList": true,
		"FileSystemDirectoryEntry": true,
		"DesktopNotification": false,
		"DataChannel": true,
		"IIRFilterNode": true,
		"ChannelSplitterNode": true,
		"File": true,
		"ConstantSourceNode": true,
		"CryptoKey": true,
		"GainNode": true,
		"AbortController": true,
		"Attr": true,
		"SpeechSynthesis": true,
		"PushSubscription": false,
		"XMLStylesheetProcessingInstruction": false,
		"NodeIterator": true,
		"VideoStreamTrack": true,
		"XMLSerializer": true,
		"CaretPosition": true,
		"FormData": true,
		"CanvasPattern": true,
		"mozRTCSessionDescription": true,
		"Path2D": true,
		"PerformanceNavigation": true,
		"URL": false,
		"PluginArray": true,
		"MutationRecord": true,
		"WebKitCSSMatrix": true,
		"PeriodicWave": true,
		"DocumentFragment": true,
		"DocumentTimeline": false,
		"ScreenOrientation": true,
		"BroadcastChannel": true,
		"PermissionStatus": true,
		"IntersectionObserver": true,
		"Blob": true,
		"MessagePort": true,
		"BarProp": true,
		"OscillatorNode": true,
		"Cache": true,
		"RadioNodeList": true,
		"KeyframeEffectReadOnly": true,
		"InstallTrigger": true,
		"Function": true,
		"Object": false,
		"eval": true,
		"Window": false,
		"close": false,
		"stop": false,
		"focus": false,
		"blur": false,
		"open": true,
		"alert": false,
		"confirm": false,
		"prompt": false,
		"print": false,
		"postMessage": true,
		"getSelection": true,
		"getComputedStyle": true,
		"matchMedia": true,
		"moveTo": false,
		"moveBy": false,
		"resizeTo": false,
		"resizeBy": false,
		"scroll": false,
		"scrollTo": false,
		"scrollBy": false,
		"requestAnimationFrame": true,
		"cancelAnimationFrame": true,
		"getDefaultComputedStyle": false,
		"scrollByLines": false,
		"scrollByPages": false,
		"sizeToContent": false,
		"updateCommands": true,
		"find": false,
		"dump": true,
		"setResizable": false,
		"requestIdleCallback": false,
		"cancelIdleCallback": false,
		"btoa": true,
		"atob": true,
		"setTimeout": true,
		"clearTimeout": true,
		"setInterval": true,
		"clearInterval": true,
		"createImageBitmap": true,
		"fetch": true,
		"self": true,
		"name": false,
		"history": true,
		"locationbar": true,
		"menubar": true,
		"personalbar": true,
		"scrollbars": true,
		"statusbar": true,
		"toolbar": true,
		"status": true,
		"closed": true,
		"frames": true,
		"length": false,
		"opener": true,
		"parent": true,
		"frameElement": true,
		"navigator": true,
		"external": true,
		"applicationCache": true,
		"screen": true,
		"innerWidth": true,
		"innerHeight": true,
		"scrollX": true,
		"pageXOffset": true,
		"scrollY": true,
		"pageYOffset": true,
		"screenX": true,
		"screenY": true,
		"outerWidth": true,
		"outerHeight": true,
		"performance": true,
		"mozInnerScreenX": true,
		"mozInnerScreenY": true,
		"devicePixelRatio": true,
		"scrollMaxX": true,
		"scrollMaxY": true,
		"fullScreen": false,
		"mozPaintCount": true,
		"sidebar": false,
		"crypto": true,
		"speechSynthesis": true,
		"localStorage": true,
		"origin": true,
		"isSecureContext": false,
		"indexedDB": true,
		"caches": true,
		"sessionStorage": true,
		"window": false,
		"document": true,
		"location": false,
		"top": false,
		"netscape": true,
		"Node": true,
		"Document": true,
		"Performance": false,
		"startProfiling": true,
		"stopProfiling": true,
		"pauseProfilers": true,
		"resumeProfilers": true,
		"dumpProfile": true,
		"getMaxGCPauseSinceClear": true,
		"clearMaxGCPauseAccumulator": true,
		"Location": true,
		"StyleSheetList": false,
		"Selection": false,
		"Element": true,
		"AnonymousContent": false,
		"MutationObserver": true,
		"NodeList": true,
		"StopIteration": true
	}
}

},{}],10:[function(require,module,exports){
module.exports={
  "AGPL-3.0": {
    "licenseName": "GNU AFFERO GENERAL PUBLIC LICENSE version 3",
    "identifier": "AGPL-3.0",
    "canonicalUrl": [
      "http://www.gnu.org/licenses/agpl-3.0.html",
      "magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt"
    ],
    "licenseFragments": [
      {
        "text": "<THISPROGRAM> is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.",
        "type": "short"
      }
    ]
  },
  "Apache-2.0": {
    "licenseName": "Apache License, Version 2.0",
    "identifier": "Apache-2.0",
    "canonicalUrl": [
      "http://www.apache.org/licenses/LICENSE-2.0",
      "magnet:?xt=urn:btih:8e4f440f4c65981c5bf93c76d35135ba5064d8b7&dn=apache-2.0.txt"
    ],
    "licenseFragments": [
      {
        "text": "Licensed under the Apache License, Version 2.0 (the \"License\"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0",
        "type": "short"
      }
    ]
  },
  "Artistic-2.0": {
    "licenseName": "Artistic License 2.0",
    "identifier": "Artistic-2.0",
    "canonicalUrl": [
      "http://www.perlfoundation.org/artistic_license_2_0",
      "magnet:?xt=urn:btih:54fd2283f9dbdf29466d2df1a98bf8f65cafe314&dn=artistic-2.0.txt"
    ],
    "licenseFragments": []
  },
  "BSD-2-Clause": {
    "licenseName": "BSD 2-Clause License",
    "identifier": "BSD-2-Clause",
    "canonicalUrl": [
      "http://www.freebsd.org/copyright/freebsd-license.html",
      "magnet:?xt=urn:btih:87f119ba0b429ba17a44b4bffcab33165ebdacc0&dn=freebsd.txt"
    ],
    "licenseFragments": [
      {
        "text": "Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met: Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.",
        "type": "short"
      }
    ]
  },
  "BSD-3-Clause": {
    "licenseName": "BSD 3-Clause License",
    "identifier": "BSD-3-Clause",
    "canonicalUrl": [
      "http://opensource.org/licenses/BSD-3-Clause",
      "magnet:?xt=urn:btih:c80d50af7d3db9be66a4d0a86db0286e4fd33292&dn=bsd-3-clause.txt"
    ],
    "licenseFragments": [
      {
        "text": "Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met: Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution. Neither the name of <ORGANIZATION> nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.",
        "type": "short"
      }
    ]
  },
  "BSL-1.0": {
    "licenseName": "Boost Software License 1.0",
    "identifier": "BSL-1.0",
    "canonicalUrl": [
      "http://www.boost.org/LICENSE_1_0.txt",
      "magnet:?xt=urn:btih:89a97c535628232f2f3888c2b7b8ffd4c078cec0&dn=Boost-1.0.txt"
    ],
    "licenseFragments": [
      {
        "text": "Boost Software License <VERSION> <DATE> Permission is hereby granted, free of charge, to any person or organization obtaining a copy of the software and accompanying documentation covered by this license (the \"Software\") to use, reproduce, display, distribute, execute, and transmit the Software, and to prepare derivative works of the Software, and to permit third-parties to whom the Software is furnished to do so, all subject to the following",
        "type": "short"
      }
    ]
  },
  "CC-BY-1.0": {
    "licenseName": "Creative Commons Attribution 1.0 Generic",
    "identifier": "CC-BY-1.0",
    "canonicalUrl": [
      "https://creativecommons.org/licenses/by/1.0/"
    ],
    "licenseFragments": []
  },
  "CC-BY-2.0": {
    "licenseName": "Creative Commons Attribution 2.0 Generic",
    "identifier": "CC-BY-2.0",
    "canonicalUrl": [
      "https://creativecommons.org/licenses/by/2.0/"
    ],
    "licenseFragments": []
  },
  "CC-BY-2.5": {
    "licenseName": "Creative Commons Attribution 2.5 Generic",
    "identifier": "CC-BY-2.5",
    "canonicalUrl": [
      "https://creativecommons.org/licenses/by/2.5/"
    ],
    "licenseFragments": []
  },
  "CC-BY-3.0": {
    "licenseName": "Creative Commons Attribution 3.0 Unported",
    "identifier": "CC-BY-3.0",
    "canonicalUrl": [
      "https://creativecommons.org/licenses/by/3.0/"
    ],
    "licenseFragments": []
  },
  "CC-BY-4.0": {
    "licenseName": "Creative Commons Attribution 4.0 International",
    "identifier": "CC-BY-4.0",
    "canonicalUrl": [
      "https://creativecommons.org/licenses/by/4.0/"
    ],
    "licenseFragments": []
  },
  "CC-BY-SA-1.0": {
    "licenseName": "Creative Commons Attribution-ShareAlike 1.0 Generic",
    "identifier": "CC-BY-SA-1.0",
    "canonicalUrl": [
      "https://creativecommons.org/licenses/by-sa/1.0/"
    ],
    "licenseFragments": []
  },
  "CC-BY-SA-2.0": {
    "licenseName": "Creative Commons Attribution-ShareAlike 2.0 Generic",
    "identifier": "CC-BY-SA-2.0",
    "canonicalUrl": [
      "https://creativecommons.org/licenses/by-sa/2.0/"
    ],
    "licenseFragments": []
  },
  "CC-BY-SA-2.5": {
    "licenseName": "Creative Commons Attribution-ShareAlike 2.5 Generic",
    "identifier": "CC-BY-SA-2.5",
    "canonicalUrl": [
      "https://creativecommons.org/licenses/by-sa/2.5/"
    ],
    "licenseFragments": []
  },
  "CC-BY-SA-3.0": {
    "licenseName": "Creative Commons Attribution-ShareAlike 3.0 Unported",
    "identifier": "CC-BY-SA-3.0",
    "canonicalUrl": [
      "https://creativecommons.org/licenses/by-sa/3.0/"
    ],
    "licenseFragments": []
  },
  "CC-BY-SA-4.0": {
    "licenseName": "Creative Commons Attribution-ShareAlike 4.0 International",
    "identifier": "CC-BY-SA-4.0",
    "canonicalUrl": [
      "https://creativecommons.org/licenses/by-sa/4.0/"
    ],
    "licenseFragments": []
  },
  "CC0-1.0": {
    "licenseName": "Creative Commons CC0 1.0 Universal",
    "identifier": "CC0-1.0",
    "canonicalUrl": [
      "http://creativecommons.org/publicdomain/zero/1.0/legalcode",
      "magnet:?xt=urn:btih:90dc5c0be029de84e523b9b3922520e79e0e6f08&dn=cc0.txt"
    ],
    "licenseFragments": []
  },
  "CECILL-2.0": {
    "licenseName": "CeCILL Free Software License Agreement v2.0",
    "identifier": "CECILL-2.0",
    "canonicalUrl": [
      "https://www.cecill.info/licences/Licence_CeCILL_V2-en.txt",
      "magnet:?xt=urn:btih:dda0473d240d7febeac8fa265da27286ead0b1ce&dn=cecill-2.0.txt"
    ],
    "licenseFragments": []
  },
  "CPAL-1.0": {
    "licenseName": "Common Public Attribution License Version 1.0 (CPAL)",
    "identifier": "CPAL-1.0",
    "canonicalUrl": [
      "http://opensource.org/licenses/cpal_1.0",
      "magnet:?xt=urn:btih:84143bc45939fc8fa42921d619a95462c2031c5c&dn=cpal-1.0.txt"
    ],
    "licenseFragments": [
      {
        "text": "The contents of this file are subject to the Common Public Attribution License Version 1.0",
        "type": "short"
      },
      {
        "text": "The term \"External Deployment\" means the use, distribution, or communication of the Original Code or Modifications in any way such that the Original Code or Modifications may be used by anyone other than You, whether those works are distributed or communicated to those persons or made available as an application intended for use over a network. As an express condition for the grants of license hereunder, You must treat any External Deployment by You of the Original Code or Modifications as a distribution under section 3.1 and make Source Code available under Section 3.2.",
        "type": "short"
      }
    ]
  },
  "EPL-1.0": {
    "licenseName": "Eclipse Public License Version 1.0",
    "identifier": "EPL-1.0",
    "canonicalUrl": [
      "http://www.eclipse.org/legal/epl-v10.html",
      "magnet:?xt=urn:btih:4c6a2ad0018cd461e9b0fc44e1b340d2c1828b22&dn=epl-1.0.txt"
    ],
    "licenseFragments": [
      {
        "text": "THE ACCOMPANYING PROGRAM IS PROVIDED UNDER THE TERMS OF THIS ECLIPSE PUBLIC LICENSE (\"AGREEMENT\"). ANY USE, REPRODUCTION OR DISTRIBUTION OF THE PROGRAM CONSTITUTES RECIPIENT'S ACCEPTANCE OF THIS AGREEMENT.",
        "type": "short"
      }
    ]
  },
  "Expat": {
    "licenseName": "Expat License (sometimes called MIT Licensed)",
    "identifier": "Expat",
    "canonicalUrl": [
      "http://www.jclark.com/xml/copying.txt",
      "magnet:?xt=urn:btih:d3d9a9a6595521f9666a5e94cc830dab83b65699&dn=expat.txt"
    ],
    "licenseFragments": [
      {
        "text": "Copyright <YEAR> <NAME> Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the \"Software\"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.",
        "type": "short"
      }
    ]
  },
  "FreeBSD": {
    "licenseName": "FreeBSD License",
    "identifier": "FreeBSD",
    "canonicalUrl": [
      "http://www.freebsd.org/copyright/freebsd-license.html",
      "magnet:?xt=urn:btih:87f119ba0b429ba17a44b4bffcab33165ebdacc0&dn=freebsd.txt"
    ],
    "licenseFragments": [
      {
        "text": "Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:\n\nRedistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.\n\nRedistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.",
        "type": "short"
      }
    ]
  },
  "GNU-All-Permissive": {
    "licenseName": "GNU All-Permissive License",
    "identifier": "GNU-All-Permissive",
    "canonicalUrl": [],
    "licenseFragments": [
      {
        "text": "Copying and distribution of this file, with or without modification, are permitted in any medium without royalty provided the copyright notice and this notice are preserved. This file is offered as-is, without any warranty.",
        "type": "short"
      }
    ]
  },
  "GPL-2.0": {
    "licenseName": "GNU General Public License (GPL) version 2",
    "identifier": "GPL-2.0",
    "canonicalUrl": [
      "http://www.gnu.org/licenses/gpl-2.0.html",
      "magnet:?xt=urn:btih:cf05388f2679ee054f2beb29a391d25f4e673ac3&dn=gpl-2.0.txt"
    ],
    "licenseFragments": [
      {
        "text": "<THISPROGRAM> is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation; either version 2 of the License, or (at your option) any later version.",
        "type": "short"
      },
      {
        "text": "Alternatively, the contents of this file may be used under the terms of either the GNU General Public License Version 2 or later (the \"GPL\"), or the GNU Lesser General Public License Version 2.1 or later (the \"LGPL\"), in which case the provisions of the GPL or the LGPL are applicable instead of those above. If you wish to allow use of your version of this file only under the terms of either the GPL or the LGPL, and not to allow others to use your version of this file under the terms of the MPL, indicate your decision by deleting the provisions above and replace them with the notice and other provisions required by the GPL or the LGPL. If you do not delete the provisions above, a recipient may use your version of this file under the terms of any one of the MPL, the GPL or the LGPL.",
        "type": "short"
      }
    ]
  },
  "GPL-3.0": {
    "licenseName": "GNU General Public License (GPL) version 3",
    "identifier": "GPL-3.0",
    "canonicalUrl": [
      "http://www.gnu.org/licenses/gpl-3.0.html",
      "magnet:?xt=urn:btih:1f739d935676111cfff4b4693e3816e664797050&dn=gpl-3.0.txt"
    ],
    "licenseFragments": [
      {
        "text": "<THISPROGRAM> is free software: you can redistribute it and/or modify it under the terms of the GNU  General Public License (GNU GPL) as published by the Free Software  Foundation, either version 3 of the License, or (at your option)  any later version. The code is distributed WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU GPL for more details. As additional permission under GNU GPL version 3 section 7, you may distribute non-source (e.g., minimized or compacted) forms of that code without the copy of the GNU GPL normally required by section 4, provided you include this license notice and a URL through which recipients can access the Corresponding Source.",
        "type": "short"
      },
      {
        "text": "<THISPROGRAM> is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.",
        "type": "short"
      }
    ]
  },
  "ISC": {
    "licenseName": "The ISC License",
    "identifier": "ISC",
    "canonicalUrl": [
      "https://www.isc.org/downloads/software-support-policy/isc-license/",
      "magnet:?xt=urn:btih:b8999bbaf509c08d127678643c515b9ab0836bae&dn=ISC.txt"
    ],
    "licenseFragments": [
      {
        "text": "Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\" AND ISC DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL ISC BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.",
        "type": "short"
      },
      {
        "text": "Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.THE SOFTWARE IS PROVIDED \"AS IS\" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.",
        "type": "short"
      }
    ]
  },
  "jQueryTools": {
    "licenseName": "jQuery Tools",
    "identifier": "jQueryTools",
    "canonicalUrl": [],
    "licenseFragments": [
      {
        "text": "NO COPYRIGHTS OR LICENSES. DO WHAT YOU LIKE.",
        "type": "short"
      }
    ]
  },
  "LGPL-2.1": {
    "licenseName": "GNU Lesser General Public License, version 2.1",
    "identifier": "LGPL-2.1",
    "canonicalUrl": [
      "http://www.gnu.org/licenses/lgpl-2.1.html",
      "magnet:?xt=urn:btih:5de60da917303dbfad4f93fb1b985ced5a89eac2&dn=lgpl-2.1.txt"
    ],
    "licenseFragments": [
      {
        "text": "<THISLIBRARY> is free software; you can redistribute it and/or modify it under the terms of the GNU Lesser General Public License as published by the Free Software Foundation; either version 2.1 of the License, or (at your option) any later version.",
        "type": "short"
      }
    ]
  },
  "LGPL-3.0": {
    "licenseName": "GNU Lesser General Public License, version 3",
    "identifier": "LGPL-3.0",
    "canonicalUrl": [
      "http://www.gnu.org/licenses/lgpl-3.0.html",
      "magnet:?xt=urn:btih:0ef1b8170b3b615170ff270def6427c317705f85&dn=lgpl-3.0.txt"
    ],
    "licenseFragments": [
      {
        "text": "<THISPROGRAM> is free software: you can redistribute it and/or modify it under the terms of the GNU Lesser General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.",
        "type": "short"
      }
    ]
  },
  "MPL-2.0": {
    "licenseName": "Mozilla Public License Version 2.0",
    "identifier": "MPL-2.0",
    "canonicalUrl": [
      "http://www.mozilla.org/MPL/2.0",
      "magnet:?xt=urn:btih:3877d6d54b3accd4bc32f8a48bf32ebc0901502a&dn=mpl-2.0.txt"
    ],
    "licenseFragments": [
      {
        "text": "This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.",
        "type": "short"
      }
    ]
  },
  "PublicDomain": {
    "licenseName": "Public Domain",
    "identifier": "PublicDomain",
    "canonicalUrl": [
      "magnet:?xt=urn:btih:e95b018ef3580986a04669f1b5879592219e2a7a&dn=public-domain.txt"
    ],
    "licenseFragments": []
  },
  "Unlicense": {
    "licenseName": "Unlicense",
    "identifier": "Unlicense",
    "canonicalUrl": [
      "http://unlicense.org/UNLICENSE",
      "magnet:?xt=urn:btih:5ac446d35272cc2e4e85e4325b146d0b7ca8f50c&dn=unlicense.txt"
    ],
    "licenseFragments": [
      {
        "text": "This is free and unencumbered software released into the public domain.",
        "type": "short"
      }
    ]
  },
  "UPL": {
    "licenseName": "Universal Permissive License",
    "identifier": "UPL-1.0",
    "canonicalUrl": [
      "https://oss.oracle.com/licenses/upl/",
      "magnet:?xt=urn:btih:478974f4d41c3fa84c4befba25f283527fad107d&dn=upl-1.0.txt"
    ],
    "licenseFragments": [
      {
        "text": "The Universal Permissive License (UPL), Version 1.0",
        "type": "short"
      }
    ]
  },
  "WTFPL": {
    "licenseName": "Do What The F*ck You Want To Public License (WTFPL)",
    "identifier": "WTFPL",
    "canonicalUrl": [
      "http://www.wtfpl.net/txt/copying/",
      "magnet:?xt=urn:btih:723febf9f6185544f57f0660a41489c7d6b4931b&dn=wtfpl.txt"
    ],
    "licenseFragments": [
      {
        "text": "DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE",
        "type": "short"
      },
      {
        "text": "0. You just DO WHAT THE FUCK YOU WANT TO.",
        "type": "short"
      }
    ]
  },
  "X11": {
    "licenseName": "X11 License",
    "identifier": "X11",
    "canonicalUrl": [
      "magnet:?xt=urn:btih:5305d91886084f776adcf57509a648432709a7c7&dn=x11.txt"
    ],
    "licenseFragments": [
      {
        "text": "Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the \"Software\"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.",
        "type": "short"
      }
    ]
  },
  "XFree86-1.1": {
    "licenseName": "XFree86 1.1 License",
    "identifier": "XFree86-1.1",
    "canonicalUrl": [
      "http://www.xfree86.org/3.3.6/COPYRIGHT2.html#3",
      "http://www.xfree86.org/current/LICENSE4.html",
      "magnet:?xt=urn:btih:12f2ec9e8de2a3b0002a33d518d6010cc8ab2ae9&dn=xfree86.txt"
    ],
    "licenseFragments": [
      {
        "text": "All rights reserved.\nPermission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the \"Software\"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:\n1. Redistributions of source code must retain the above copyright notice, this list of conditions, and the following disclaimer.\n2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution, and in the same place and form as other copyright, license and disclaimer information.\n3. The end-user documentation included with the redistribution, if any, must include the following acknowledgment: \"This product includes software developed by The XFree86 Project, Inc (http://www.xfree86.org/) and its contributors\", in the same place and form as other third-party acknowledgments. Alternately, this acknowledgment may appear in the software itself, in the same form and location as other such third-party acknowledgments.4. Except as contained in this notice, the name of The XFree86 Project, Inc shall not be used in advertising or otherwise to promote the sale, use or other dealings in this Software without prior written authorization from The XFree86 Project, Inc.",
        "type": "short"
      }
    ]
  },
  "Zlib": {
    "licenseName": "zlib License",
    "canonicalUrl": [
      "https://www.zlib.net/zlib_license.html",
      "https://spdx.org/licenses/Zlib.txt",
      "magnet:?xt=urn:btih:922bd98043fa3daf4f9417e3e8fec8406b1961a3&dn=zlib.txt"
    ],
    "identifier": "Zlib",
    "licenseFragments": []
  }
}

},{}],11:[function(require,module,exports){
/**
 * GNU LibreJS - A browser add-on to block nonfree nontrivial JavaScript.
 * *
 * Copyright (C) 2011, 2012, 2013, 2014 Loic J. Duros
 * Copyright (C) 2014, 2015 Nik Nyby
 * Copyright (C) 2022 Yuchen Pei
 *
 * This file is part of GNU LibreJS.
 *
 * GNU LibreJS is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * GNU LibreJS is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with GNU LibreJS.  If not, see <http://www.gnu.org/licenses/>.
 */

exports.patternUtils = {
  /**
   * removeNonalpha
   *
   * Remove all nonalphanumeric values, except for
   * < and >, since they are what we use for tokens.
   *
   */
  removeNonalpha: function(str) {
    return str.replace(/[^a-z0-9<>@]+/gi, '');
  },

  removeWhitespace: function(str) {
    return str.replace(/\/\//gmi, '').replace(/\*/gmi, '').replace(/\s+/gmi, '');
  },

  replaceTokens: function(str) {
    return str.replace(/<.*?>/gi, '.*?');
  },

  removeJsComments: function(str) {
    const ml_comments = /\/\*.*?(\*\/)/g;
    const il_comments = /\/\/.*/gm;
    return str.replace(ml_comments, '').replace(il_comments, '');
  }
};

},{}],12:[function(require,module,exports){
/**
* GNU LibreJS - A browser add-on to block nonfree nontrivial JavaScript.
* *
* Copyright (C) 2017, 2018 Nathan Nichols
* Copyright (C) 2018 Ruben Rodriguez <ruben@gnu.org>
* Copyright (C) 2022 Yuchen Pei <id@ypei.org>
*
* This file is part of GNU LibreJS.
*
* GNU LibreJS is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.
*
* GNU LibreJS is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU General Public License for more details.
*
* You should have received a copy of the GNU General Public License
* along with GNU LibreJS.  If not, see <http://www.gnu.org/licenses/>.
*/

const checkLib = require('./common/checks.js');
const { ResponseProcessor, BLOCKING_RESPONSES } = require('./bg/ResponseProcessor');
const { Storage, ListStore, hash } = require('./common/Storage');
const { ListManager } = require('./bg/ListManager');
const { ExternalLicenses } = require('./bg/ExternalLicenses');
const { makeDebugLogger } = require('./common/debug.js');

const PRINT_DEBUG = false;
const dbgPrint = makeDebugLogger('main_background.js', PRINT_DEBUG, Date.now());

/*
*
*	Called when something changes the persistent data of the add-on.
*
*	The only things that should need to change this data are:
*	a) The "Whitelist this page" button
*	b) The options screen
*
*	When the actual blocking is implemented, this will need to comminicate
*	with its code to update accordingly
*
*/
function optionsListener(changes, area) {
  dbgPrint('Items updated in area' + area + ': ');
  dbgPrint(Object.keys(changes).join(','));
}

const activeMessagePorts = {};
const activityReports = {};

async function createReport(initializer) {
  if (!(initializer && (initializer.url || initializer.tabId))) {
    throw new Error('createReport() needs an URL or a tabId at least');
  }
  let template = {
    'accepted': [],
    'blocked': [],
    'blacklisted': [],
    'whitelisted': [],
    'unknown': [],
  };
  template = Object.assign(template, initializer);
  let [url] = (template.url || (await browser.tabs.get(initializer.tabId)).url).split('#');
  template.url = url;
  template.site = ListStore.siteItem(url);
  template.siteStatus = listManager.getStatus(template.site);
  const list = { 'whitelisted': whitelist, 'blacklisted': blacklist }[template.siteStatus];
  if (list) {
    template.listedSite = ListManager.siteMatch(template.site, list);
  }
  return template;
}

/**
*	Executes the "Display this report in new tab" function
*	by opening a new tab with whatever HTML is in the popup
*	at the moment.
*/
async function openReportInTab(data) {
  const popupURL = await browser.browserAction.getPopup({});
  const tab = await browser.tabs.create({ url: `${popupURL}#fromTab=${data.tabId}` });
  activityReports[tab.id] = await createReport(data);
}

/**
*	Clears local storage (the persistent data)
*/
function debugDeleteLocal() {
  browser.storage.local.clear();
  dbgPrint('Local storage cleared');
}

/**
*
*	Prints local storage (the persistent data) as well as the temporary popup object
*
*/
function debugPrintLocal() {
  function storageGot(items) {
    console.log('%c Local storage: ', 'color: red;');
    for (const i in items) {
      console.log('%c ' + i + ' = ' + items[i], 'color: blue;');
    }
  }
  console.log('%c Variable \'activityReports\': ', 'color: red;');
  console.log(activityReports);
  browser.storage.local.get(storageGot);
}

/**
*
*
*	Sends a message to the content script that sets the popup entries for a tab.
*
*	var example_blocked_info = {
*		"accepted": [["REASON 1","SOURCE 1"],["REASON 2","SOURCE 2"]],
*		"blocked": [["REASON 1","SOURCE 1"],["REASON 2","SOURCE 2"]],
*		"url": "example.com"
*	}
*
*	NOTE: This WILL break if you provide inconsistent URLs to it.
*	Make sure it will use the right URL when refering to a certain script.
*
*/
async function updateReport(tabId, oldReport, updateUI = false) {
  const { url } = oldReport;
  const newReport = await createReport({ url, tabId });
  for (const property of Object.keys(oldReport)) {
    const entries = oldReport[property];
    if (!Array.isArray(entries)) continue;
    const defValue = property === 'accepted' || property === 'blocked' ? property : 'unknown';
    for (const script of entries) {
      const status = listManager.getStatus(script[0], defValue);
      if (Array.isArray(newReport[status])) newReport[status].push(script);
    }
  }
  activityReports[tabId] = newReport;
  if (browser.sessions) browser.sessions.setTabValue(tabId, url, newReport);
  dbgPrint(newReport);
  if (updateUI && activeMessagePorts[tabId]) {
    dbgPrint(`[TABID: ${tabId}] Sending script blocking report directly to browser action.`);
    activeMessagePorts[tabId].postMessage({ show_info: newReport });
  }
}

/** Updates the report for tab with tabId with action.
 *
 *	This is what you call when a page gets changed to update the info
 *	box.
 * 
 *	Sends a message to the content script that adds a popup entry for
 *	a tab.
 *
 *	The action argument is an object with two properties: one named of
 * "accepted","blocked", "whitelisted", "blacklisted", whose value is
 * the array [scriptName, reason], and another named "url". Example:
 * action =
 *   {
 *     "accepted": ["jquery.js (someHash)", "Whitelisted by user"],
 *     "url": "https://example.com/js/jquery.js"
 *   }
 *
 *  Overrides the action type with the white/blacklist status for
 *  scriptName, if any.  Then add the entry if scriptName is not
 *  already in the entries associated with the action type.
 *
 *	Returns one of "whitelisted", "blacklisted", "blocked", "accepted"
 *	or "unknown"
 *
 *	NOTE: This WILL break if you provide inconsistent URLs to it.
 *	Make sure it will use the right URL when refering to a certain
 *	script.
 *
 */
async function addReportEntry(tabId, action) {

  const actionPair = Object.entries(action).find(
    ([k, _]) => ['accepted', 'blocked', 'whitelisted', 'blacklisted'].indexOf(k) != -1);
  if (!actionPair) {
    console.debug('Wrong action', action);
    return 'unknown';
  }
  const [actionType, actionValue] = actionPair;
  const scriptName = actionValue[0];

  const report = activityReports[tabId] || (activityReports[tabId] = await createReport({ tabId }));
  let entryType;
  // Update the report if the scriptName is new for the entryType.
  try {
    entryType = listManager.getStatus(scriptName, actionType);
    const entries = report[entryType];
    if (!entries.find(e => e[0] === scriptName)) {
      dbgPrint(activityReports);
      dbgPrint(activityReports[tabId]);
      dbgPrint(entryType);
      entries.push(actionValue);
    }
  } catch (e) {
    console.error('action %o, type %s, entryType %s', action, actionType, entryType, e);
    entryType = 'unknown';
  }

  // Refresh the main panel script list.
  if (activeMessagePorts[tabId]) {
    activeMessagePorts[tabId].postMessage({ show_info: report });
  }

  if (browser.sessions) browser.sessions.setTabValue(tabId, report.url, report);
  updateBadge(tabId, report);
  return entryType;
}


function getDomain(url) {
  let domain = url.replace('http://', '').replace('https://', '').split(/[/?#]/)[0];
  if (url.indexOf('http://') == 0) {
    domain = 'http://' + domain;
  }
  else if (url.indexOf('https://') == 0) {
    domain = 'https://' + domain;
  }
  domain = domain + '/';
  domain = domain.replace(/ /g, '');
  return domain;
}

/**
 *
 *	This is the callback where the content scripts of the browser action
 *	will contact the background script.
 *
 */
async function connected(p) {
  if (p.name === 'contact_finder') {
    // style the contact finder panel
    await browser.tabs.insertCSS(p.sender.tab.id, {
      file: '/content/dialog.css',
      cssOrigin: 'user',
      matchAboutBlank: true,
      allFrames: true
    });

    // Send a message back with the relevant settings
    p.postMessage(await browser.storage.local.get(['pref_subject', 'pref_body']));
    return;
  }
  p.onMessage.addListener(async function(m) {
    let update = false;
    let contactFinder = false;

    for (const action of ['whitelist', 'blacklist', 'forget']) {
      if (m[action]) {
        let [key] = m[action];
        if (m.site) {
          key = ListStore.siteItem(m.site);
        } else {
          key = ListStore.inlineItem(key) || key;
        }
        await listManager[action](key);
        update = true;
      }
    }

    if (m.report_tab) {
      openReportInTab(m.report_tab);
    }
    // a debug feature
    if (m['printlocalstorage'] !== undefined) {
      console.log('Print local storage');
      debugPrintLocal();
    }
    // invoke_contact_finder
    if (m['invoke_contact_finder'] !== undefined) {
      contactFinder = true;
      await injectContactFinder();
    }
    // a debug feature (maybe give the user an option to do this?)
    if (m['deletelocalstorage'] !== undefined) {
      console.log('Delete local storage');
      debugDeleteLocal();
    }

    const tabs = await browser.tabs.query({ active: true, currentWindow: true });

    if (contactFinder) {
      const tab = tabs.pop();
      dbgPrint(`[TABID:${tab.id}] Injecting contact finder`);
    }
    if (update || m.update && activityReports[m.tabId]) {
      const tabId = 'tabId' in m ? m.tabId : tabs.pop().id;
      dbgPrint(`%c updating tab ${tabId}`, 'color: red;');
      activeMessagePorts[tabId] = p;
      await updateReport(tabId, activityReports[tabId], true);
    } else {
      for (const tab of tabs) {
        if (activityReports[tab.id]) {
          // If we have some data stored here for this tabID, send it
          dbgPrint(`[TABID: ${tab.id}] Sending stored data associated with browser action'`);
          p.postMessage({ 'show_info': activityReports[tab.id] });
        } else {
          // create a new entry
          const report = activityReports[tab.id] = await createReport({ 'url': tab.url, tabId: tab.id });
          p.postMessage({ show_info: report });
          dbgPrint(`[TABID: ${tab.id}] No data found, creating a new entry for this window.`);
        }
      }
    }
  });
}

/**
*	Loads the contact finder on the given tab ID.
*/
async function injectContactFinder(tabId) {
  await Promise.all([
    browser.tabs.insertCSS(tabId, { file: '/content/overlay.css', cssOrigin: 'user' }),
    browser.tabs.executeScript(tabId, { file: '/content/contactFinder.js' }),
  ]);
}

/**
*	The callback for tab closings.
*
*	Delete the info we are storing about this tab if there is any.
*
*/
function deleteRemovedTabInfo(tab_id, _) {
  dbgPrint('[TABID:' + tab_id + ']' + 'Deleting stored info about closed tab');
  if (activityReports[tab_id] !== undefined) {
    delete activityReports[tab_id];
  }
  if (activeMessagePorts[tab_id] !== undefined) {
    delete activeMessagePorts[tab_id];
  }
  ExternalLicenses.purgeCache(tab_id);
}

/**
*	Called when the tab gets updated / activated
*
*	Here we check if  new tab's url matches activityReports[tabId].url, and if
* it doesn't we use the session cached value (if any).
*
*/

async function onTabUpdated(tabId, _, tab) {
  const [url] = tab.url.split('#');
  const report = activityReports[tabId];
  if (!(report && report.url === url)) {
    const cache = browser.sessions &&
      await browser.sessions.getTabValue(tabId, url) || null;
    // on session restore tabIds may change
    if (cache && cache.tabId !== tabId) cache.tabId = tabId;
    updateBadge(tabId, activityReports[tabId] = cache);
  }
}

async function onTabActivated({ tabId }) {
  await onTabUpdated(tabId, {}, await browser.tabs.get(tabId));
}

/* *********************************************************************************************** */
// TODO: Test if this script is being loaded from another domain compared to activityReports[tabid]["url"]

/**
 * Checks script and updates the report entry accordingly.
 *
 * Asynchronous function, returns the final edited script as a string,
 * or unedited script if passAccWlist is true and the script is
 * accepted or whitelisted.
 */
async function checkScriptAndUpdateReport(scriptSrc, url, tabId, whitelisted, isExternal = false, passAccWlist = false) {
  const scriptName = url.split('/').pop();
  if (whitelisted) {
    if (tabId !== -1) {
      const site = ListManager.siteMatch(url, whitelist);
      // Accept without reading script, it was explicitly whitelisted
      const reason = site
        ? `All ${site} whitelisted by user`
        : 'Address whitelisted by user';
      addReportEntry(tabId, { 'whitelisted': [site || url, reason], url });
    }
    if (scriptSrc.startsWith('javascript:') || passAccWlist)
      return scriptSrc;
    else
      return `/* LibreJS: script whitelisted by user preference. */\n${scriptSrc}`;
  }

  const [accepted, editedSource, reason] = listManager.builtInHashes.has(hash(scriptSrc)) ? [true, scriptSrc, 'Common script known to be free software.'] : checkLib.checkScriptSource(scriptSrc, scriptName, isExternal);

  if (tabId < 0) {
    return editedSource;
  }

  const domain = getDomain(url);
  const report = activityReports[tabId] || (activityReports[tabId] = await createReport({ tabId }));
  updateBadge(tabId, report, !accepted);
  const actionType = await addReportEntry(tabId, { 'url': domain, [accepted ? 'accepted' : 'blocked']: [url, reason] });
  switch (actionType) {
    case 'blacklisted': {
      const edited = `/* LibreJS: script ${actionType} by user. */`;
      return scriptSrc.startsWith('javascript:')
        ? `javascript:void(${encodeURIComponent(edited)})` : edited;
    }
    case 'whitelisted':
    case 'accepted':
      {
        return (scriptSrc.startsWith('javascript:') || passAccWlist)
          ? scriptSrc : `/* LibreJS: script ${actionType} by user. */\n${scriptSrc}`;
      }
    // blocked
    default: {
      return scriptSrc.startsWith('javascript:')
        ? `javascript:void(/* ${editedSource} */)`
        : `/* LibreJS: script ${actionType}. */\n${editedSource}`;
    }
  }
}

// Updates the extension icon in the toolbar.
function updateBadge(tabId, report = null, forceRed = false) {
  const blockedCount = report ? report.blocked.length + report.blacklisted.length : 0;
  const [text, color] = blockedCount > 0 || forceRed
    ? [blockedCount && blockedCount.toString() || '!', 'red'] : ['✓', 'green']
  const { browserAction } = browser;
  if ('setBadgeText' in browserAction) {
    browserAction.setBadgeText({ text, tabId });
    browserAction.setBadgeBackgroundColor({ color, tabId });
  } else {
    // Mobile
    browserAction.setTitle({ title: `LibreJS (${text})`, tabId });
  }
}

// TODO: is this the only way google analytics can show up?
function blockGoogleAnalytics(request) {
  const { url } = request;
  const res = {};
  if (url === 'https://www.google-analytics.com/analytics.js' ||
    /^https:\/\/www\.google\.com\/analytics\/[^#]/.test(url)
  ) {
    res.cancel = true;
  }
  return res;
}

async function blockBlacklistedScripts(request) {
  const { tabId, documentUrl } = request;
  const url = ListStore.urlItem(request.url);
  const status = listManager.getStatus(url);
  if (status !== 'blacklisted') return {};
  const blacklistedSite = ListManager.siteMatch(url, blacklist);
  await addReportEntry(tabId, {
    url: documentUrl,
    'blacklisted': [url, /\*/.test(blacklistedSite) ? `User blacklisted ${blacklistedSite}` : 'Blacklisted by user']
  });
  return BLOCKING_RESPONSES.REJECT;
}

/**
 * An onHeadersReceived handler.  See bg/ResponseProcessor.js for how
 * it is used.
 * 
 *	This listener gets called as soon as we've got all the HTTP
 * headers, can guess content type and encoding, and therefore
 * correctly parse HTML documents and external script inclusions in
 * search of non-free JavaScript
 */
const ResponseHandler = {
  /**
   * Checks black/whitelists and web labels.  Returns a
   * BlockingResponse (if we can determine) or null (if further work
   * is needed).
   * 
   * Enforce white/black lists for url/site early (hashes will be
   * handled later)
   */
  async pre(response) {
    const { request } = response;
    const { type, tabId, frameId, documentUrl } = request;
    const fullUrl = request.url;
    const url = ListStore.urlItem(fullUrl);
    const site = ListStore.siteItem(url);
    const blacklistedSite = ListManager.siteMatch(site, blacklist);
    const blacklisted = blacklistedSite || blacklist.contains(url);
    const topUrl = type === 'sub_frame' && request.frameAncestors && request.frameAncestors.pop() || documentUrl;

    if (blacklisted) {
      if (type === 'script') {
        // this shouldn't happen, because we intercept earlier in blockBlacklistedScripts()
        return BLOCKING_RESPONSES.REJECT;
      }
      // we handle the page change here too, since we won't call editHtml()
      if (type === 'main_frame') {
        activityReports[tabId] = await createReport({ url: fullUrl, tabId });
        // Go on without parsing the page: it was explicitly blacklisted
        const reason = blacklistedSite
          ? `All ${blacklistedSite} blacklisted by user`
          : 'Address blacklisted by user';
        await addReportEntry(tabId, { 'blacklisted': [blacklistedSite || url, reason], url: fullUrl });
      }
      // use CSP to restrict JavaScript execution in the page
      request.responseHeaders.unshift({
        name: 'Content-security-policy',
        value: 'script-src \'none\';'
      });
      // let's skip the inline script parsing, since we block by CSP
      return { responseHeaders: request.responseHeaders };
    } else {
      const whitelistedSite = ListManager.siteMatch(site, whitelist);
      const whitelisted = response.whitelisted = whitelistedSite || whitelist.contains(url);
      if (type === 'script') {
        if (whitelisted) {
          // accept the script and stop processing
          addReportEntry(tabId, {
            url: topUrl,
            'whitelisted': [url, whitelistedSite ? `User whitelisted ${whitelistedSite}` : 'Whitelisted by user']
          });
          return BLOCKING_RESPONSES.ACCEPT;
        } else {
          // Check the web labels
          const scriptInfo = await ExternalLicenses.check({ url: fullUrl, tabId, frameId, documentUrl });
          if (scriptInfo) {
            const [verdict, ret] = scriptInfo.free ? ['accepted', BLOCKING_RESPONSES.ACCEPT] : ['blocked', BLOCKING_RESPONSES.REJECT];
            const licenseIds = [...scriptInfo.licenses].map(l => l.identifier).sort().join(', ');
            const msg = licenseIds
              ? `Free license${scriptInfo.licenses.size > 1 ? 's' : ''} (${licenseIds})`
              : 'Unknown license(s)';
            addReportEntry(tabId, { url, [verdict]: [url, msg] });
            return ret;
          }
        }
      }
    }
    // it's a page (it's too early to report) or an unknown script:
    //  let's keep processing
    return null;
  },

  /**
  *	Here we do the heavylifting, analyzing unknown scripts
  */
  async post(response) {
    const { type } = response.request;
    const handler = type === 'script' ? handleScript : handleHtml;
    return await handler(response, response.whitelisted);
  }
}

/**
* Here we handle external script requests
*/
async function handleScript(response, whitelisted) {
  const { text, request } = response;
  const { url, tabId } = request;
  return await checkScriptAndUpdateReport(text, ListStore.urlItem(url), tabId, whitelisted, isExternal = true, passAccWlist = true);
}

/**
* Serializes HTMLDocument objects including the root element and
*	the DOCTYPE declaration
*/
function doc2HTML(doc) {
  let s = doc.documentElement.outerHTML;
  if (doc.doctype) {
    const dt = doc.doctype;
    let sDoctype = `<!DOCTYPE ${dt.name || 'html'}`;
    if (dt.publicId) sDoctype += ` PUBLIC "${dt.publicId}"`;
    if (dt.systemId) sDoctype += ` "${dt.systemId}"`;
    s = `${sDoctype}>\n${s}`;
  }
  return s;
}

/**
* Shortcut to create a correctly namespaced DOM HTML elements
*/
function createHTMLElement(doc, name) {
  return doc.createElementNS('http://www.w3.org/1999/xhtml', name);
}

/**
* Replace any element with a span having the same content (useful to force
* NOSCRIPT elements to visible the same way as NoScript and uBlock do)
*/
function forceElement(doc, element) {
  const replacement = createHTMLElement(doc, 'span');
  replacement.innerHTML = element.innerHTML;
  element.replaceWith(replacement);
  return replacement;
}

/**
 *	Forces displaying any noscript element not having the "data-librejs-nodisplay" attribute on pages.
 * returns number of elements forced, mutates doc.
*/
function forceNoscriptElements(doc) {
  let shown = 0;
  // inspired by NoScript's onScriptDisabled.js
  for (const noscript of doc.querySelectorAll('noscript:not([data-librejs-nodisplay])')) {
    const replacement = forceElement(doc, noscript);
    // emulate meta-refresh
    const meta = replacement.querySelector('meta[http-equiv="refresh"]');
    if (meta) {
      doc.head.appendChild(meta);
    }
    shown++;
  }
  return shown;
}

/**
*	Forces displaying any element having the "data-librejs-display" attribute.
*/
function showConditionalElements(doc) {
  let shown = 0;
  for (const element of document.querySelectorAll('[data-librejs-display]')) {
    forceElement(doc, element);
    shown++;
  }
  return shown;
}

/**
*	Tests to see if the intrinsic events on the page are free or not.
*	returns true if they are, false if they're not
*/
function readMetadata(metaElement) {

  if (metaElement === undefined || metaElement === null) {
    return false;
  }

  console.log('metadata found');

  let metadata = {};

  try {
    metadata = JSON.parse(metaElement.innerHTML);
  } catch (error) {
    console.log('Could not parse metadata on page.')
    return false;
  }

  const licenseStr = metadata['intrinsic-events'];
  if (licenseStr === undefined) {
    console.log('No intrinsic events license');
    return false;
  }
  console.log(licenseStr);

  const parts = licenseStr.split(' ');
  if (parts.length != 2) {
    console.log('invalid (>2 tokens)');
    return false;
  }

  if (checkLib.checkMagnet(parts[0])) {
    return true;
  } else {
    console.log('invalid (doesn\'t match licenses or key didn\'t exist)');
    return false;
  }
}
/**
 * 	Reads/changes the HTML of a page and the scripts within it.
 * Returns string or null.
 */
async function editHtml(html, documentUrl, tabId, frameId, whitelisted) {
  const htmlDoc = new DOMParser().parseFromString(html, 'text/html');
  // moves external licenses reference, if any, before any <SCRIPT> element
  ExternalLicenses.optimizeDocument(htmlDoc, { tabId, frameId, documentUrl });
  const url = ListStore.urlItem(documentUrl);

  if (whitelisted) { // don't bother rewriting
    await checkScriptAndUpdateReport(html, url, tabId, whitelisted); // generates whitelisted report
    return null;
  }
  if (checkFullHtml(html, documentUrl, url, tabId, htmlDoc)) return null;
  const dejaVu = new Map(); // deduplication map & edited script cache
  let modified = await checkIntrinsicEvents(html, documentUrl, tabId, htmlDoc, dejaVu);
  let modifiedInline = await checkInlineScripts(html, documentUrl, tabId, htmlDoc, dejaVu);

  modified = showConditionalElements(htmlDoc) > 0 || modified || modifiedInline;
  if (modified) {
    if (modifiedInline) {
      forceNoscriptElements(htmlDoc);
    }
    return doc2HTML(htmlDoc);
  }
  return null;
}

/**
 * Checks LibreJS-info element (undocumented) or licensing js in
 * entire html using @licstart/@licend ("JavaScript embedded on your
 * page..." in
 * https://www.gnu.org/software/librejs/free-your-javascript.html)
 * Returns true if handled, false otherwise.
 */
function checkFullHtml(html, documentUrl, url, tabId, htmlDoc) {
  const firstInlineScript = Array.from(htmlDoc.scripts).find(script => script && !script.src);
  const firstScriptSrc = firstInlineScript ? firstInlineScript.textContent : '';
  const licenseName = checkLib.checkLicenseText(firstScriptSrc);
  const metaElement = htmlDoc.getElementById('LibreJS-info');
  if (readMetadata(metaElement) || licenseName) {
    console.log('Valid license for the whole page found (LibreJS-info or @licstart/@licend)');
    const [line, extras] = metaElement ?
      [findLine(/id\s*=\s*['"]?LibreJS-info\b/gi, html), '(0)'] :
      [html.substring(0, html.indexOf(firstScriptSrc)).split(/\n/).length,
      '\n' + firstScriptSrc];
    let viewUrl = line ? `view-source:${documentUrl}#line${line}(<${metaElement ? metaElement.tagName : 'SCRIPT'}>)${extras}` : url;
    addReportEntry(tabId, { url, 'accepted': [viewUrl, `Global license for the page: ${licenseName}`] });
    return true;
  }
  return false;
}

/**
 * Checks intrinsic events, i.e. in event handlers or the href
 * attribute.
 * Returns true if htmlDoc is modified, false otherwise.
 * Mutates htmlDoc and dejaVu.
 */
async function checkIntrinsicEvents(html, documentUrl, tabId, htmlDoc, dejaVu) {
  let modified = false;
  const intrinsicFinder = /<[a-z][^>]*\b(on\w+|href\s*=\s*['"]?javascript:)/gi;
  for (const element of htmlDoc.querySelectorAll('*')) {
    let line = -1;
    for (const attr of element.attributes) {
      let { name, value } = attr;
      value = value.trim();
      if (name.startsWith('on') || (name === 'href' && value.toLowerCase().startsWith('javascript:'))) {
        if (line === -1) {
          line = findLine(intrinsicFinder, html);
        }
        try {
          const key = `<${element.tagName} ${name}="${value}">`;
          let edited;
          if (dejaVu.has(key)) {
            edited = dejaVu.get(key);
          } else {
            const url = `view-source:${documentUrl}#line${line}(<${element.tagName} ${name}>)\n${value.trim()}`;
            if (name === 'href') value = decodeURIComponent(value);
            edited = await checkScriptAndUpdateReport(value, url, tabId, whitelist.contains(url));
            dejaVu.set(key, edited);
          }
          if (edited && edited !== value) {
            modified = true;
            attr.value = edited;
          }
        } catch (e) {
          console.error(e);
        }
      }
    }
  }
  return modified;
}

/**
 * Checks inline scripts.
 * Mutates dejaVu and htmlDoc.
 */
async function checkInlineScripts(html, documentUrl, tabId, htmlDoc, dejaVu) {
  let modifiedInline = false;
  const scriptFinder = /<script\b/ig;
  for (const script of htmlDoc.scripts) {
    const line = findLine(scriptFinder, html);
    if (!script.src && !(script.type && script.type !== 'text/javascript')) {
      const source = script.textContent.trim();
      let editedSource;
      if (dejaVu.has(source)) {
        editedSource = dejaVu.get(source);
      } else {
        const url = `view-source:${documentUrl}#line${line}(<SCRIPT>)\n${source}`;
        const edited = await checkScriptAndUpdateReport(source, url, tabId, false);
        editedSource = edited.trim();
        dejaVu.set(url, editedSource);
      }
      if (editedSource) {
        if (source !== editedSource) {
          script.textContent = editedSource;
          modifiedInline = true;
        }
      }
    }
  }
  return modifiedInline;
}

/**
 * Returns the line of next match for finder.
 * May mutate finder if it is stateful.
 */
const findLine = (finder, html) => finder.test(html) && html.substring(0, finder.lastIndex).split(/\n/).length || 0;


/**
* Here we handle html document responses
*/
async function handleHtml(response, whitelisted) {
  const { text, request } = response;
  const { url, tabId, frameId, type } = request;
  if (type === 'main_frame') {
    activityReports[tabId] = await createReport({ url, tabId });
    updateBadge(tabId);
  }
  return await editHtml(text, url, tabId, frameId, whitelisted);
}

const whitelist = new ListStore('pref_whitelist', Storage.CSV);
const blacklist = new ListStore('pref_blacklist', Storage.CSV);
const listManager = new ListManager(whitelist, blacklist,
  // built-in whitelist of script hashes, e.g. jQuery
  Object.values(require('./utilities/hash_script/whitelist').whitelist)
    .reduce((a, b) => a.concat(b)) // as a flat array
    .map(script => script.hash)
);


async function initDefaults() {
  const defaults = {
    pref_subject: 'Issues with Javascript on your website',
    pref_body: `Please consider using a free license for the Javascript on your website.

[Message generated by LibreJS. See https://www.gnu.org/software/librejs/ for more information]
`
  };
  const keys = Object.keys(defaults);
  const prefs = await browser.storage.local.get(keys);
  let changed = false;
  for (let k of keys) {
    if (!(k in prefs)) {
      prefs[k] = defaults[k];
      changed = true;
    }
  }
  if (changed) {
    await browser.storage.local.set(prefs);
  }
}

/**
*	Initializes various add-on functions
*	only meant to be called once when the script starts
*/
async function initAddon() {
  await initDefaults();
  await whitelist.load();
  browser.runtime.onConnect.addListener(connected);
  browser.storage.onChanged.addListener(optionsListener);
  browser.tabs.onRemoved.addListener(deleteRemovedTabInfo);
  browser.tabs.onUpdated.addListener(onTabUpdated);
  browser.tabs.onActivated.addListener(onTabActivated);
  // Prevents Google Analytics from being loaded from Google servers
  const all_types = [
    'beacon', 'csp_report', 'font', 'image', 'imageset', 'main_frame', 'media',
    'object', 'object_subrequest', 'ping', 'script', 'stylesheet', 'sub_frame',
    'web_manifest', 'websocket', 'xbl', 'xml_dtd', 'xmlhttprequest', 'xslt',
    'other'
  ];
  browser.webRequest.onBeforeRequest.addListener(blockGoogleAnalytics,
    { urls: ['<all_urls>'], types: all_types },
    ['blocking']
  );
  browser.webRequest.onBeforeRequest.addListener(blockBlacklistedScripts,
    { urls: ['<all_urls>'], types: ['script'] },
    ['blocking']
  );
  browser.webRequest.onResponseStarted.addListener(request => {
    const { tabId } = request;
    const report = activityReports[tabId];
    if (report) {
      updateBadge(tabId, activityReports[tabId]);
    }
  }, { urls: ['<all_urls>'], types: ['main_frame'] });

  // Analyzes all the html documents and external scripts as they're loaded
  ResponseProcessor.install(ResponseHandler);

  checkLib.init();

  const Test = require('./common/Test');
  if (Test.getURL()) {
    // export testable functions to the global scope
    this.LibreJS = {
      editHtml,
      handleScript,
      ExternalLicenses,
      ListManager, ListStore, Storage,
    };
    // create or focus the autotest tab if it's a debugging session
    if ((await browser.management.getSelf()).installType === 'development') {
      Test.getTab(true);
    }
  }
}

initAddon();

},{"./bg/ExternalLicenses":1,"./bg/ListManager":2,"./bg/ResponseProcessor":4,"./common/Storage":5,"./common/Test":6,"./common/checks.js":7,"./common/debug.js":8,"./utilities/hash_script/whitelist":15}],13:[function(require,module,exports){
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.acorn = {}));
})(this, (function (exports) { 'use strict';

  // This file was generated. Do not modify manually!
  var astralIdentifierCodes = [509, 0, 227, 0, 150, 4, 294, 9, 1368, 2, 2, 1, 6, 3, 41, 2, 5, 0, 166, 1, 574, 3, 9, 9, 370, 1, 154, 10, 50, 3, 123, 2, 54, 14, 32, 10, 3, 1, 11, 3, 46, 10, 8, 0, 46, 9, 7, 2, 37, 13, 2, 9, 6, 1, 45, 0, 13, 2, 49, 13, 9, 3, 2, 11, 83, 11, 7, 0, 161, 11, 6, 9, 7, 3, 56, 1, 2, 6, 3, 1, 3, 2, 10, 0, 11, 1, 3, 6, 4, 4, 193, 17, 10, 9, 5, 0, 82, 19, 13, 9, 214, 6, 3, 8, 28, 1, 83, 16, 16, 9, 82, 12, 9, 9, 84, 14, 5, 9, 243, 14, 166, 9, 71, 5, 2, 1, 3, 3, 2, 0, 2, 1, 13, 9, 120, 6, 3, 6, 4, 0, 29, 9, 41, 6, 2, 3, 9, 0, 10, 10, 47, 15, 406, 7, 2, 7, 17, 9, 57, 21, 2, 13, 123, 5, 4, 0, 2, 1, 2, 6, 2, 0, 9, 9, 49, 4, 2, 1, 2, 4, 9, 9, 330, 3, 19306, 9, 87, 9, 39, 4, 60, 6, 26, 9, 1014, 0, 2, 54, 8, 3, 82, 0, 12, 1, 19628, 1, 4706, 45, 3, 22, 543, 4, 4, 5, 9, 7, 3, 6, 31, 3, 149, 2, 1418, 49, 513, 54, 5, 49, 9, 0, 15, 0, 23, 4, 2, 14, 1361, 6, 2, 16, 3, 6, 2, 1, 2, 4, 262, 6, 10, 9, 357, 0, 62, 13, 1495, 6, 110, 6, 6, 9, 4759, 9, 787719, 239];

  // This file was generated. Do not modify manually!
  var astralIdentifierStartCodes = [0, 11, 2, 25, 2, 18, 2, 1, 2, 14, 3, 13, 35, 122, 70, 52, 268, 28, 4, 48, 48, 31, 14, 29, 6, 37, 11, 29, 3, 35, 5, 7, 2, 4, 43, 157, 19, 35, 5, 35, 5, 39, 9, 51, 13, 10, 2, 14, 2, 6, 2, 1, 2, 10, 2, 14, 2, 6, 2, 1, 68, 310, 10, 21, 11, 7, 25, 5, 2, 41, 2, 8, 70, 5, 3, 0, 2, 43, 2, 1, 4, 0, 3, 22, 11, 22, 10, 30, 66, 18, 2, 1, 11, 21, 11, 25, 71, 55, 7, 1, 65, 0, 16, 3, 2, 2, 2, 28, 43, 28, 4, 28, 36, 7, 2, 27, 28, 53, 11, 21, 11, 18, 14, 17, 111, 72, 56, 50, 14, 50, 14, 35, 349, 41, 7, 1, 79, 28, 11, 0, 9, 21, 43, 17, 47, 20, 28, 22, 13, 52, 58, 1, 3, 0, 14, 44, 33, 24, 27, 35, 30, 0, 3, 0, 9, 34, 4, 0, 13, 47, 15, 3, 22, 0, 2, 0, 36, 17, 2, 24, 85, 6, 2, 0, 2, 3, 2, 14, 2, 9, 8, 46, 39, 7, 3, 1, 3, 21, 2, 6, 2, 1, 2, 4, 4, 0, 19, 0, 13, 4, 159, 52, 19, 3, 21, 2, 31, 47, 21, 1, 2, 0, 185, 46, 42, 3, 37, 47, 21, 0, 60, 42, 14, 0, 72, 26, 38, 6, 186, 43, 117, 63, 32, 7, 3, 0, 3, 7, 2, 1, 2, 23, 16, 0, 2, 0, 95, 7, 3, 38, 17, 0, 2, 0, 29, 0, 11, 39, 8, 0, 22, 0, 12, 45, 20, 0, 19, 72, 264, 8, 2, 36, 18, 0, 50, 29, 113, 6, 2, 1, 2, 37, 22, 0, 26, 5, 2, 1, 2, 31, 15, 0, 328, 18, 190, 0, 80, 921, 103, 110, 18, 195, 2637, 96, 16, 1070, 4050, 582, 8634, 568, 8, 30, 18, 78, 18, 29, 19, 47, 17, 3, 32, 20, 6, 18, 689, 63, 129, 74, 6, 0, 67, 12, 65, 1, 2, 0, 29, 6135, 9, 1237, 43, 8, 8936, 3, 2, 6, 2, 1, 2, 290, 46, 2, 18, 3, 9, 395, 2309, 106, 6, 12, 4, 8, 8, 9, 5991, 84, 2, 70, 2, 1, 3, 0, 3, 1, 3, 3, 2, 11, 2, 0, 2, 6, 2, 64, 2, 3, 3, 7, 2, 6, 2, 27, 2, 3, 2, 4, 2, 0, 4, 6, 2, 339, 3, 24, 2, 24, 2, 30, 2, 24, 2, 30, 2, 24, 2, 30, 2, 24, 2, 30, 2, 24, 2, 7, 1845, 30, 482, 44, 11, 6, 17, 0, 322, 29, 19, 43, 1269, 6, 2, 3, 2, 1, 2, 14, 2, 196, 60, 67, 8, 0, 1205, 3, 2, 26, 2, 1, 2, 0, 3, 0, 2, 9, 2, 3, 2, 0, 2, 0, 7, 0, 5, 0, 2, 0, 2, 0, 2, 2, 2, 1, 2, 0, 3, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 1, 2, 0, 3, 3, 2, 6, 2, 3, 2, 3, 2, 0, 2, 9, 2, 16, 6, 2, 2, 4, 2, 16, 4421, 42719, 33, 4152, 8, 221, 3, 5761, 15, 7472, 3104, 541, 1507, 4938];

  // This file was generated. Do not modify manually!
  var nonASCIIidentifierChars = "\u200c\u200d\xb7\u0300-\u036f\u0387\u0483-\u0487\u0591-\u05bd\u05bf\u05c1\u05c2\u05c4\u05c5\u05c7\u0610-\u061a\u064b-\u0669\u0670\u06d6-\u06dc\u06df-\u06e4\u06e7\u06e8\u06ea-\u06ed\u06f0-\u06f9\u0711\u0730-\u074a\u07a6-\u07b0\u07c0-\u07c9\u07eb-\u07f3\u07fd\u0816-\u0819\u081b-\u0823\u0825-\u0827\u0829-\u082d\u0859-\u085b\u0898-\u089f\u08ca-\u08e1\u08e3-\u0903\u093a-\u093c\u093e-\u094f\u0951-\u0957\u0962\u0963\u0966-\u096f\u0981-\u0983\u09bc\u09be-\u09c4\u09c7\u09c8\u09cb-\u09cd\u09d7\u09e2\u09e3\u09e6-\u09ef\u09fe\u0a01-\u0a03\u0a3c\u0a3e-\u0a42\u0a47\u0a48\u0a4b-\u0a4d\u0a51\u0a66-\u0a71\u0a75\u0a81-\u0a83\u0abc\u0abe-\u0ac5\u0ac7-\u0ac9\u0acb-\u0acd\u0ae2\u0ae3\u0ae6-\u0aef\u0afa-\u0aff\u0b01-\u0b03\u0b3c\u0b3e-\u0b44\u0b47\u0b48\u0b4b-\u0b4d\u0b55-\u0b57\u0b62\u0b63\u0b66-\u0b6f\u0b82\u0bbe-\u0bc2\u0bc6-\u0bc8\u0bca-\u0bcd\u0bd7\u0be6-\u0bef\u0c00-\u0c04\u0c3c\u0c3e-\u0c44\u0c46-\u0c48\u0c4a-\u0c4d\u0c55\u0c56\u0c62\u0c63\u0c66-\u0c6f\u0c81-\u0c83\u0cbc\u0cbe-\u0cc4\u0cc6-\u0cc8\u0cca-\u0ccd\u0cd5\u0cd6\u0ce2\u0ce3\u0ce6-\u0cef\u0d00-\u0d03\u0d3b\u0d3c\u0d3e-\u0d44\u0d46-\u0d48\u0d4a-\u0d4d\u0d57\u0d62\u0d63\u0d66-\u0d6f\u0d81-\u0d83\u0dca\u0dcf-\u0dd4\u0dd6\u0dd8-\u0ddf\u0de6-\u0def\u0df2\u0df3\u0e31\u0e34-\u0e3a\u0e47-\u0e4e\u0e50-\u0e59\u0eb1\u0eb4-\u0ebc\u0ec8-\u0ecd\u0ed0-\u0ed9\u0f18\u0f19\u0f20-\u0f29\u0f35\u0f37\u0f39\u0f3e\u0f3f\u0f71-\u0f84\u0f86\u0f87\u0f8d-\u0f97\u0f99-\u0fbc\u0fc6\u102b-\u103e\u1040-\u1049\u1056-\u1059\u105e-\u1060\u1062-\u1064\u1067-\u106d\u1071-\u1074\u1082-\u108d\u108f-\u109d\u135d-\u135f\u1369-\u1371\u1712-\u1715\u1732-\u1734\u1752\u1753\u1772\u1773\u17b4-\u17d3\u17dd\u17e0-\u17e9\u180b-\u180d\u180f-\u1819\u18a9\u1920-\u192b\u1930-\u193b\u1946-\u194f\u19d0-\u19da\u1a17-\u1a1b\u1a55-\u1a5e\u1a60-\u1a7c\u1a7f-\u1a89\u1a90-\u1a99\u1ab0-\u1abd\u1abf-\u1ace\u1b00-\u1b04\u1b34-\u1b44\u1b50-\u1b59\u1b6b-\u1b73\u1b80-\u1b82\u1ba1-\u1bad\u1bb0-\u1bb9\u1be6-\u1bf3\u1c24-\u1c37\u1c40-\u1c49\u1c50-\u1c59\u1cd0-\u1cd2\u1cd4-\u1ce8\u1ced\u1cf4\u1cf7-\u1cf9\u1dc0-\u1dff\u203f\u2040\u2054\u20d0-\u20dc\u20e1\u20e5-\u20f0\u2cef-\u2cf1\u2d7f\u2de0-\u2dff\u302a-\u302f\u3099\u309a\ua620-\ua629\ua66f\ua674-\ua67d\ua69e\ua69f\ua6f0\ua6f1\ua802\ua806\ua80b\ua823-\ua827\ua82c\ua880\ua881\ua8b4-\ua8c5\ua8d0-\ua8d9\ua8e0-\ua8f1\ua8ff-\ua909\ua926-\ua92d\ua947-\ua953\ua980-\ua983\ua9b3-\ua9c0\ua9d0-\ua9d9\ua9e5\ua9f0-\ua9f9\uaa29-\uaa36\uaa43\uaa4c\uaa4d\uaa50-\uaa59\uaa7b-\uaa7d\uaab0\uaab2-\uaab4\uaab7\uaab8\uaabe\uaabf\uaac1\uaaeb-\uaaef\uaaf5\uaaf6\uabe3-\uabea\uabec\uabed\uabf0-\uabf9\ufb1e\ufe00-\ufe0f\ufe20-\ufe2f\ufe33\ufe34\ufe4d-\ufe4f\uff10-\uff19\uff3f";

  // This file was generated. Do not modify manually!
  var nonASCIIidentifierStartChars = "\xaa\xb5\xba\xc0-\xd6\xd8-\xf6\xf8-\u02c1\u02c6-\u02d1\u02e0-\u02e4\u02ec\u02ee\u0370-\u0374\u0376\u0377\u037a-\u037d\u037f\u0386\u0388-\u038a\u038c\u038e-\u03a1\u03a3-\u03f5\u03f7-\u0481\u048a-\u052f\u0531-\u0556\u0559\u0560-\u0588\u05d0-\u05ea\u05ef-\u05f2\u0620-\u064a\u066e\u066f\u0671-\u06d3\u06d5\u06e5\u06e6\u06ee\u06ef\u06fa-\u06fc\u06ff\u0710\u0712-\u072f\u074d-\u07a5\u07b1\u07ca-\u07ea\u07f4\u07f5\u07fa\u0800-\u0815\u081a\u0824\u0828\u0840-\u0858\u0860-\u086a\u0870-\u0887\u0889-\u088e\u08a0-\u08c9\u0904-\u0939\u093d\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098c\u098f\u0990\u0993-\u09a8\u09aa-\u09b0\u09b2\u09b6-\u09b9\u09bd\u09ce\u09dc\u09dd\u09df-\u09e1\u09f0\u09f1\u09fc\u0a05-\u0a0a\u0a0f\u0a10\u0a13-\u0a28\u0a2a-\u0a30\u0a32\u0a33\u0a35\u0a36\u0a38\u0a39\u0a59-\u0a5c\u0a5e\u0a72-\u0a74\u0a85-\u0a8d\u0a8f-\u0a91\u0a93-\u0aa8\u0aaa-\u0ab0\u0ab2\u0ab3\u0ab5-\u0ab9\u0abd\u0ad0\u0ae0\u0ae1\u0af9\u0b05-\u0b0c\u0b0f\u0b10\u0b13-\u0b28\u0b2a-\u0b30\u0b32\u0b33\u0b35-\u0b39\u0b3d\u0b5c\u0b5d\u0b5f-\u0b61\u0b71\u0b83\u0b85-\u0b8a\u0b8e-\u0b90\u0b92-\u0b95\u0b99\u0b9a\u0b9c\u0b9e\u0b9f\u0ba3\u0ba4\u0ba8-\u0baa\u0bae-\u0bb9\u0bd0\u0c05-\u0c0c\u0c0e-\u0c10\u0c12-\u0c28\u0c2a-\u0c39\u0c3d\u0c58-\u0c5a\u0c5d\u0c60\u0c61\u0c80\u0c85-\u0c8c\u0c8e-\u0c90\u0c92-\u0ca8\u0caa-\u0cb3\u0cb5-\u0cb9\u0cbd\u0cdd\u0cde\u0ce0\u0ce1\u0cf1\u0cf2\u0d04-\u0d0c\u0d0e-\u0d10\u0d12-\u0d3a\u0d3d\u0d4e\u0d54-\u0d56\u0d5f-\u0d61\u0d7a-\u0d7f\u0d85-\u0d96\u0d9a-\u0db1\u0db3-\u0dbb\u0dbd\u0dc0-\u0dc6\u0e01-\u0e30\u0e32\u0e33\u0e40-\u0e46\u0e81\u0e82\u0e84\u0e86-\u0e8a\u0e8c-\u0ea3\u0ea5\u0ea7-\u0eb0\u0eb2\u0eb3\u0ebd\u0ec0-\u0ec4\u0ec6\u0edc-\u0edf\u0f00\u0f40-\u0f47\u0f49-\u0f6c\u0f88-\u0f8c\u1000-\u102a\u103f\u1050-\u1055\u105a-\u105d\u1061\u1065\u1066\u106e-\u1070\u1075-\u1081\u108e\u10a0-\u10c5\u10c7\u10cd\u10d0-\u10fa\u10fc-\u1248\u124a-\u124d\u1250-\u1256\u1258\u125a-\u125d\u1260-\u1288\u128a-\u128d\u1290-\u12b0\u12b2-\u12b5\u12b8-\u12be\u12c0\u12c2-\u12c5\u12c8-\u12d6\u12d8-\u1310\u1312-\u1315\u1318-\u135a\u1380-\u138f\u13a0-\u13f5\u13f8-\u13fd\u1401-\u166c\u166f-\u167f\u1681-\u169a\u16a0-\u16ea\u16ee-\u16f8\u1700-\u1711\u171f-\u1731\u1740-\u1751\u1760-\u176c\u176e-\u1770\u1780-\u17b3\u17d7\u17dc\u1820-\u1878\u1880-\u18a8\u18aa\u18b0-\u18f5\u1900-\u191e\u1950-\u196d\u1970-\u1974\u1980-\u19ab\u19b0-\u19c9\u1a00-\u1a16\u1a20-\u1a54\u1aa7\u1b05-\u1b33\u1b45-\u1b4c\u1b83-\u1ba0\u1bae\u1baf\u1bba-\u1be5\u1c00-\u1c23\u1c4d-\u1c4f\u1c5a-\u1c7d\u1c80-\u1c88\u1c90-\u1cba\u1cbd-\u1cbf\u1ce9-\u1cec\u1cee-\u1cf3\u1cf5\u1cf6\u1cfa\u1d00-\u1dbf\u1e00-\u1f15\u1f18-\u1f1d\u1f20-\u1f45\u1f48-\u1f4d\u1f50-\u1f57\u1f59\u1f5b\u1f5d\u1f5f-\u1f7d\u1f80-\u1fb4\u1fb6-\u1fbc\u1fbe\u1fc2-\u1fc4\u1fc6-\u1fcc\u1fd0-\u1fd3\u1fd6-\u1fdb\u1fe0-\u1fec\u1ff2-\u1ff4\u1ff6-\u1ffc\u2071\u207f\u2090-\u209c\u2102\u2107\u210a-\u2113\u2115\u2118-\u211d\u2124\u2126\u2128\u212a-\u2139\u213c-\u213f\u2145-\u2149\u214e\u2160-\u2188\u2c00-\u2ce4\u2ceb-\u2cee\u2cf2\u2cf3\u2d00-\u2d25\u2d27\u2d2d\u2d30-\u2d67\u2d6f\u2d80-\u2d96\u2da0-\u2da6\u2da8-\u2dae\u2db0-\u2db6\u2db8-\u2dbe\u2dc0-\u2dc6\u2dc8-\u2dce\u2dd0-\u2dd6\u2dd8-\u2dde\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303c\u3041-\u3096\u309b-\u309f\u30a1-\u30fa\u30fc-\u30ff\u3105-\u312f\u3131-\u318e\u31a0-\u31bf\u31f0-\u31ff\u3400-\u4dbf\u4e00-\ua48c\ua4d0-\ua4fd\ua500-\ua60c\ua610-\ua61f\ua62a\ua62b\ua640-\ua66e\ua67f-\ua69d\ua6a0-\ua6ef\ua717-\ua71f\ua722-\ua788\ua78b-\ua7ca\ua7d0\ua7d1\ua7d3\ua7d5-\ua7d9\ua7f2-\ua801\ua803-\ua805\ua807-\ua80a\ua80c-\ua822\ua840-\ua873\ua882-\ua8b3\ua8f2-\ua8f7\ua8fb\ua8fd\ua8fe\ua90a-\ua925\ua930-\ua946\ua960-\ua97c\ua984-\ua9b2\ua9cf\ua9e0-\ua9e4\ua9e6-\ua9ef\ua9fa-\ua9fe\uaa00-\uaa28\uaa40-\uaa42\uaa44-\uaa4b\uaa60-\uaa76\uaa7a\uaa7e-\uaaaf\uaab1\uaab5\uaab6\uaab9-\uaabd\uaac0\uaac2\uaadb-\uaadd\uaae0-\uaaea\uaaf2-\uaaf4\uab01-\uab06\uab09-\uab0e\uab11-\uab16\uab20-\uab26\uab28-\uab2e\uab30-\uab5a\uab5c-\uab69\uab70-\uabe2\uac00-\ud7a3\ud7b0-\ud7c6\ud7cb-\ud7fb\uf900-\ufa6d\ufa70-\ufad9\ufb00-\ufb06\ufb13-\ufb17\ufb1d\ufb1f-\ufb28\ufb2a-\ufb36\ufb38-\ufb3c\ufb3e\ufb40\ufb41\ufb43\ufb44\ufb46-\ufbb1\ufbd3-\ufd3d\ufd50-\ufd8f\ufd92-\ufdc7\ufdf0-\ufdfb\ufe70-\ufe74\ufe76-\ufefc\uff21-\uff3a\uff41-\uff5a\uff66-\uffbe\uffc2-\uffc7\uffca-\uffcf\uffd2-\uffd7\uffda-\uffdc";

  // These are a run-length and offset encoded representation of the

  // Reserved word lists for various dialects of the language

  var reservedWords = {
    3: "abstract boolean byte char class double enum export extends final float goto implements import int interface long native package private protected public short static super synchronized throws transient volatile",
    5: "class enum extends super const export import",
    6: "enum",
    strict: "implements interface let package private protected public static yield",
    strictBind: "eval arguments"
  };

  // And the keywords

  var ecma5AndLessKeywords = "break case catch continue debugger default do else finally for function if return switch throw try var while with null true false instanceof typeof void delete new in this";

  var keywords$1 = {
    5: ecma5AndLessKeywords,
    "5module": ecma5AndLessKeywords + " export import",
    6: ecma5AndLessKeywords + " const class extends export import super"
  };

  var keywordRelationalOperator = /^in(stanceof)?$/;

  // ## Character categories

  var nonASCIIidentifierStart = new RegExp("[" + nonASCIIidentifierStartChars + "]");
  var nonASCIIidentifier = new RegExp("[" + nonASCIIidentifierStartChars + nonASCIIidentifierChars + "]");

  // This has a complexity linear to the value of the code. The
  // assumption is that looking up astral identifier characters is
  // rare.
  function isInAstralSet(code, set) {
    var pos = 0x10000;
    for (var i = 0; i < set.length; i += 2) {
      pos += set[i];
      if (pos > code) { return false }
      pos += set[i + 1];
      if (pos >= code) { return true }
    }
  }

  // Test whether a given character code starts an identifier.

  function isIdentifierStart(code, astral) {
    if (code < 65) { return code === 36 }
    if (code < 91) { return true }
    if (code < 97) { return code === 95 }
    if (code < 123) { return true }
    if (code <= 0xffff) { return code >= 0xaa && nonASCIIidentifierStart.test(String.fromCharCode(code)) }
    if (astral === false) { return false }
    return isInAstralSet(code, astralIdentifierStartCodes)
  }

  // Test whether a given character is part of an identifier.

  function isIdentifierChar(code, astral) {
    if (code < 48) { return code === 36 }
    if (code < 58) { return true }
    if (code < 65) { return false }
    if (code < 91) { return true }
    if (code < 97) { return code === 95 }
    if (code < 123) { return true }
    if (code <= 0xffff) { return code >= 0xaa && nonASCIIidentifier.test(String.fromCharCode(code)) }
    if (astral === false) { return false }
    return isInAstralSet(code, astralIdentifierStartCodes) || isInAstralSet(code, astralIdentifierCodes)
  }

  // ## Token types

  // The assignment of fine-grained, information-carrying type objects
  // allows the tokenizer to store the information it has about a
  // token in a way that is very cheap for the parser to look up.

  // All token type variables start with an underscore, to make them
  // easy to recognize.

  // The `beforeExpr` property is used to disambiguate between regular
  // expressions and divisions. It is set on all token types that can
  // be followed by an expression (thus, a slash after them would be a
  // regular expression).
  //
  // The `startsExpr` property is used to check if the token ends a
  // `yield` expression. It is set on all token types that either can
  // directly start an expression (like a quotation mark) or can
  // continue an expression (like the body of a string).
  //
  // `isLoop` marks a keyword as starting a loop, which is important
  // to know when parsing a label, in order to allow or disallow
  // continue jumps to that label.

  var TokenType = function TokenType(label, conf) {
    if ( conf === void 0 ) conf = {};

    this.label = label;
    this.keyword = conf.keyword;
    this.beforeExpr = !!conf.beforeExpr;
    this.startsExpr = !!conf.startsExpr;
    this.isLoop = !!conf.isLoop;
    this.isAssign = !!conf.isAssign;
    this.prefix = !!conf.prefix;
    this.postfix = !!conf.postfix;
    this.binop = conf.binop || null;
    this.updateContext = null;
  };

  function binop(name, prec) {
    return new TokenType(name, {beforeExpr: true, binop: prec})
  }
  var beforeExpr = {beforeExpr: true}, startsExpr = {startsExpr: true};

  // Map keyword names to token types.

  var keywords = {};

  // Succinct definitions of keyword token types
  function kw(name, options) {
    if ( options === void 0 ) options = {};

    options.keyword = name;
    return keywords[name] = new TokenType(name, options)
  }

  var types$1 = {
    num: new TokenType("num", startsExpr),
    regexp: new TokenType("regexp", startsExpr),
    string: new TokenType("string", startsExpr),
    name: new TokenType("name", startsExpr),
    privateId: new TokenType("privateId", startsExpr),
    eof: new TokenType("eof"),

    // Punctuation token types.
    bracketL: new TokenType("[", {beforeExpr: true, startsExpr: true}),
    bracketR: new TokenType("]"),
    braceL: new TokenType("{", {beforeExpr: true, startsExpr: true}),
    braceR: new TokenType("}"),
    parenL: new TokenType("(", {beforeExpr: true, startsExpr: true}),
    parenR: new TokenType(")"),
    comma: new TokenType(",", beforeExpr),
    semi: new TokenType(";", beforeExpr),
    colon: new TokenType(":", beforeExpr),
    dot: new TokenType("."),
    question: new TokenType("?", beforeExpr),
    questionDot: new TokenType("?."),
    arrow: new TokenType("=>", beforeExpr),
    template: new TokenType("template"),
    invalidTemplate: new TokenType("invalidTemplate"),
    ellipsis: new TokenType("...", beforeExpr),
    backQuote: new TokenType("`", startsExpr),
    dollarBraceL: new TokenType("${", {beforeExpr: true, startsExpr: true}),

    // Operators. These carry several kinds of properties to help the
    // parser use them properly (the presence of these properties is
    // what categorizes them as operators).
    //
    // `binop`, when present, specifies that this operator is a binary
    // operator, and will refer to its precedence.
    //
    // `prefix` and `postfix` mark the operator as a prefix or postfix
    // unary operator.
    //
    // `isAssign` marks all of `=`, `+=`, `-=` etcetera, which act as
    // binary operators with a very low precedence, that should result
    // in AssignmentExpression nodes.

    eq: new TokenType("=", {beforeExpr: true, isAssign: true}),
    assign: new TokenType("_=", {beforeExpr: true, isAssign: true}),
    incDec: new TokenType("++/--", {prefix: true, postfix: true, startsExpr: true}),
    prefix: new TokenType("!/~", {beforeExpr: true, prefix: true, startsExpr: true}),
    logicalOR: binop("||", 1),
    logicalAND: binop("&&", 2),
    bitwiseOR: binop("|", 3),
    bitwiseXOR: binop("^", 4),
    bitwiseAND: binop("&", 5),
    equality: binop("==/!=/===/!==", 6),
    relational: binop("</>/<=/>=", 7),
    bitShift: binop("<</>>/>>>", 8),
    plusMin: new TokenType("+/-", {beforeExpr: true, binop: 9, prefix: true, startsExpr: true}),
    modulo: binop("%", 10),
    star: binop("*", 10),
    slash: binop("/", 10),
    starstar: new TokenType("**", {beforeExpr: true}),
    coalesce: binop("??", 1),

    // Keyword token types.
    _break: kw("break"),
    _case: kw("case", beforeExpr),
    _catch: kw("catch"),
    _continue: kw("continue"),
    _debugger: kw("debugger"),
    _default: kw("default", beforeExpr),
    _do: kw("do", {isLoop: true, beforeExpr: true}),
    _else: kw("else", beforeExpr),
    _finally: kw("finally"),
    _for: kw("for", {isLoop: true}),
    _function: kw("function", startsExpr),
    _if: kw("if"),
    _return: kw("return", beforeExpr),
    _switch: kw("switch"),
    _throw: kw("throw", beforeExpr),
    _try: kw("try"),
    _var: kw("var"),
    _const: kw("const"),
    _while: kw("while", {isLoop: true}),
    _with: kw("with"),
    _new: kw("new", {beforeExpr: true, startsExpr: true}),
    _this: kw("this", startsExpr),
    _super: kw("super", startsExpr),
    _class: kw("class", startsExpr),
    _extends: kw("extends", beforeExpr),
    _export: kw("export"),
    _import: kw("import", startsExpr),
    _null: kw("null", startsExpr),
    _true: kw("true", startsExpr),
    _false: kw("false", startsExpr),
    _in: kw("in", {beforeExpr: true, binop: 7}),
    _instanceof: kw("instanceof", {beforeExpr: true, binop: 7}),
    _typeof: kw("typeof", {beforeExpr: true, prefix: true, startsExpr: true}),
    _void: kw("void", {beforeExpr: true, prefix: true, startsExpr: true}),
    _delete: kw("delete", {beforeExpr: true, prefix: true, startsExpr: true})
  };

  // Matches a whole line break (where CRLF is considered a single
  // line break). Used to count lines.

  var lineBreak = /\r\n?|\n|\u2028|\u2029/;
  var lineBreakG = new RegExp(lineBreak.source, "g");

  function isNewLine(code) {
    return code === 10 || code === 13 || code === 0x2028 || code === 0x2029
  }

  function nextLineBreak(code, from, end) {
    if ( end === void 0 ) end = code.length;

    for (var i = from; i < end; i++) {
      var next = code.charCodeAt(i);
      if (isNewLine(next))
        { return i < end - 1 && next === 13 && code.charCodeAt(i + 1) === 10 ? i + 2 : i + 1 }
    }
    return -1
  }

  var nonASCIIwhitespace = /[\u1680\u2000-\u200a\u202f\u205f\u3000\ufeff]/;

  var skipWhiteSpace = /(?:\s|\/\/.*|\/\*[^]*?\*\/)*/g;

  var ref = Object.prototype;
  var hasOwnProperty = ref.hasOwnProperty;
  var toString = ref.toString;

  var hasOwn = Object.hasOwn || (function (obj, propName) { return (
    hasOwnProperty.call(obj, propName)
  ); });

  var isArray = Array.isArray || (function (obj) { return (
    toString.call(obj) === "[object Array]"
  ); });

  function wordsRegexp(words) {
    return new RegExp("^(?:" + words.replace(/ /g, "|") + ")$")
  }

  function codePointToString(code) {
    // UTF-16 Decoding
    if (code <= 0xFFFF) { return String.fromCharCode(code) }
    code -= 0x10000;
    return String.fromCharCode((code >> 10) + 0xD800, (code & 1023) + 0xDC00)
  }

  var loneSurrogate = /(?:[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])/;

  // These are used when `options.locations` is on, for the
  // `startLoc` and `endLoc` properties.

  var Position = function Position(line, col) {
    this.line = line;
    this.column = col;
  };

  Position.prototype.offset = function offset (n) {
    return new Position(this.line, this.column + n)
  };

  var SourceLocation = function SourceLocation(p, start, end) {
    this.start = start;
    this.end = end;
    if (p.sourceFile !== null) { this.source = p.sourceFile; }
  };

  // The `getLineInfo` function is mostly useful when the
  // `locations` option is off (for performance reasons) and you
  // want to find the line/column position for a given character
  // offset. `input` should be the code string that the offset refers
  // into.

  function getLineInfo(input, offset) {
    for (var line = 1, cur = 0;;) {
      var nextBreak = nextLineBreak(input, cur, offset);
      if (nextBreak < 0) { return new Position(line, offset - cur) }
      ++line;
      cur = nextBreak;
    }
  }

  // A second argument must be given to configure the parser process.
  // These options are recognized (only `ecmaVersion` is required):

  var defaultOptions = {
    // `ecmaVersion` indicates the ECMAScript version to parse. Must be
    // either 3, 5, 6 (or 2015), 7 (2016), 8 (2017), 9 (2018), 10
    // (2019), 11 (2020), 12 (2021), 13 (2022), or `"latest"` (the
    // latest version the library supports). This influences support
    // for strict mode, the set of reserved words, and support for
    // new syntax features.
    ecmaVersion: null,
    // `sourceType` indicates the mode the code should be parsed in.
    // Can be either `"script"` or `"module"`. This influences global
    // strict mode and parsing of `import` and `export` declarations.
    sourceType: "script",
    // `onInsertedSemicolon` can be a callback that will be called
    // when a semicolon is automatically inserted. It will be passed
    // the position of the comma as an offset, and if `locations` is
    // enabled, it is given the location as a `{line, column}` object
    // as second argument.
    onInsertedSemicolon: null,
    // `onTrailingComma` is similar to `onInsertedSemicolon`, but for
    // trailing commas.
    onTrailingComma: null,
    // By default, reserved words are only enforced if ecmaVersion >= 5.
    // Set `allowReserved` to a boolean value to explicitly turn this on
    // an off. When this option has the value "never", reserved words
    // and keywords can also not be used as property names.
    allowReserved: null,
    // When enabled, a return at the top level is not considered an
    // error.
    allowReturnOutsideFunction: false,
    // When enabled, import/export statements are not constrained to
    // appearing at the top of the program, and an import.meta expression
    // in a script isn't considered an error.
    allowImportExportEverywhere: false,
    // By default, await identifiers are allowed to appear at the top-level scope only if ecmaVersion >= 2022.
    // When enabled, await identifiers are allowed to appear at the top-level scope,
    // but they are still not allowed in non-async functions.
    allowAwaitOutsideFunction: null,
    // When enabled, super identifiers are not constrained to
    // appearing in methods and do not raise an error when they appear elsewhere.
    allowSuperOutsideMethod: null,
    // When enabled, hashbang directive in the beginning of file
    // is allowed and treated as a line comment.
    allowHashBang: false,
    // When `locations` is on, `loc` properties holding objects with
    // `start` and `end` properties in `{line, column}` form (with
    // line being 1-based and column 0-based) will be attached to the
    // nodes.
    locations: false,
    // A function can be passed as `onToken` option, which will
    // cause Acorn to call that function with object in the same
    // format as tokens returned from `tokenizer().getToken()`. Note
    // that you are not allowed to call the parser from the
    // callback—that will corrupt its internal state.
    onToken: null,
    // A function can be passed as `onComment` option, which will
    // cause Acorn to call that function with `(block, text, start,
    // end)` parameters whenever a comment is skipped. `block` is a
    // boolean indicating whether this is a block (`/* */`) comment,
    // `text` is the content of the comment, and `start` and `end` are
    // character offsets that denote the start and end of the comment.
    // When the `locations` option is on, two more parameters are
    // passed, the full `{line, column}` locations of the start and
    // end of the comments. Note that you are not allowed to call the
    // parser from the callback—that will corrupt its internal state.
    onComment: null,
    // Nodes have their start and end characters offsets recorded in
    // `start` and `end` properties (directly on the node, rather than
    // the `loc` object, which holds line/column data. To also add a
    // [semi-standardized][range] `range` property holding a `[start,
    // end]` array with the same numbers, set the `ranges` option to
    // `true`.
    //
    // [range]: https://bugzilla.mozilla.org/show_bug.cgi?id=745678
    ranges: false,
    // It is possible to parse multiple files into a single AST by
    // passing the tree produced by parsing the first file as
    // `program` option in subsequent parses. This will add the
    // toplevel forms of the parsed file to the `Program` (top) node
    // of an existing parse tree.
    program: null,
    // When `locations` is on, you can pass this to record the source
    // file in every node's `loc` object.
    sourceFile: null,
    // This value, if given, is stored in every node, whether
    // `locations` is on or off.
    directSourceFile: null,
    // When enabled, parenthesized expressions are represented by
    // (non-standard) ParenthesizedExpression nodes
    preserveParens: false
  };

  // Interpret and default an options object

  var warnedAboutEcmaVersion = false;

  function getOptions(opts) {
    var options = {};

    for (var opt in defaultOptions)
      { options[opt] = opts && hasOwn(opts, opt) ? opts[opt] : defaultOptions[opt]; }

    if (options.ecmaVersion === "latest") {
      options.ecmaVersion = 1e8;
    } else if (options.ecmaVersion == null) {
      if (!warnedAboutEcmaVersion && typeof console === "object" && console.warn) {
        warnedAboutEcmaVersion = true;
        console.warn("Since Acorn 8.0.0, options.ecmaVersion is required.\nDefaulting to 2020, but this will stop working in the future.");
      }
      options.ecmaVersion = 11;
    } else if (options.ecmaVersion >= 2015) {
      options.ecmaVersion -= 2009;
    }

    if (options.allowReserved == null)
      { options.allowReserved = options.ecmaVersion < 5; }

    if (isArray(options.onToken)) {
      var tokens = options.onToken;
      options.onToken = function (token) { return tokens.push(token); };
    }
    if (isArray(options.onComment))
      { options.onComment = pushComment(options, options.onComment); }

    return options
  }

  function pushComment(options, array) {
    return function(block, text, start, end, startLoc, endLoc) {
      var comment = {
        type: block ? "Block" : "Line",
        value: text,
        start: start,
        end: end
      };
      if (options.locations)
        { comment.loc = new SourceLocation(this, startLoc, endLoc); }
      if (options.ranges)
        { comment.range = [start, end]; }
      array.push(comment);
    }
  }

  // Each scope gets a bitset that may contain these flags
  var
      SCOPE_TOP = 1,
      SCOPE_FUNCTION = 2,
      SCOPE_ASYNC = 4,
      SCOPE_GENERATOR = 8,
      SCOPE_ARROW = 16,
      SCOPE_SIMPLE_CATCH = 32,
      SCOPE_SUPER = 64,
      SCOPE_DIRECT_SUPER = 128,
      SCOPE_CLASS_STATIC_BLOCK = 256,
      SCOPE_VAR = SCOPE_TOP | SCOPE_FUNCTION | SCOPE_CLASS_STATIC_BLOCK;

  function functionFlags(async, generator) {
    return SCOPE_FUNCTION | (async ? SCOPE_ASYNC : 0) | (generator ? SCOPE_GENERATOR : 0)
  }

  // Used in checkLVal* and declareName to determine the type of a binding
  var
      BIND_NONE = 0, // Not a binding
      BIND_VAR = 1, // Var-style binding
      BIND_LEXICAL = 2, // Let- or const-style binding
      BIND_FUNCTION = 3, // Function declaration
      BIND_SIMPLE_CATCH = 4, // Simple (identifier pattern) catch binding
      BIND_OUTSIDE = 5; // Special case for function names as bound inside the function

  var Parser = function Parser(options, input, startPos) {
    this.options = options = getOptions(options);
    this.sourceFile = options.sourceFile;
    this.keywords = wordsRegexp(keywords$1[options.ecmaVersion >= 6 ? 6 : options.sourceType === "module" ? "5module" : 5]);
    var reserved = "";
    if (options.allowReserved !== true) {
      reserved = reservedWords[options.ecmaVersion >= 6 ? 6 : options.ecmaVersion === 5 ? 5 : 3];
      if (options.sourceType === "module") { reserved += " await"; }
    }
    this.reservedWords = wordsRegexp(reserved);
    var reservedStrict = (reserved ? reserved + " " : "") + reservedWords.strict;
    this.reservedWordsStrict = wordsRegexp(reservedStrict);
    this.reservedWordsStrictBind = wordsRegexp(reservedStrict + " " + reservedWords.strictBind);
    this.input = String(input);

    // Used to signal to callers of `readWord1` whether the word
    // contained any escape sequences. This is needed because words with
    // escape sequences must not be interpreted as keywords.
    this.containsEsc = false;

    // Set up token state

    // The current position of the tokenizer in the input.
    if (startPos) {
      this.pos = startPos;
      this.lineStart = this.input.lastIndexOf("\n", startPos - 1) + 1;
      this.curLine = this.input.slice(0, this.lineStart).split(lineBreak).length;
    } else {
      this.pos = this.lineStart = 0;
      this.curLine = 1;
    }

    // Properties of the current token:
    // Its type
    this.type = types$1.eof;
    // For tokens that include more information than their type, the value
    this.value = null;
    // Its start and end offset
    this.start = this.end = this.pos;
    // And, if locations are used, the {line, column} object
    // corresponding to those offsets
    this.startLoc = this.endLoc = this.curPosition();

    // Position information for the previous token
    this.lastTokEndLoc = this.lastTokStartLoc = null;
    this.lastTokStart = this.lastTokEnd = this.pos;

    // The context stack is used to superficially track syntactic
    // context to predict whether a regular expression is allowed in a
    // given position.
    this.context = this.initialContext();
    this.exprAllowed = true;

    // Figure out if it's a module code.
    this.inModule = options.sourceType === "module";
    this.strict = this.inModule || this.strictDirective(this.pos);

    // Used to signify the start of a potential arrow function
    this.potentialArrowAt = -1;
    this.potentialArrowInForAwait = false;

    // Positions to delayed-check that yield/await does not exist in default parameters.
    this.yieldPos = this.awaitPos = this.awaitIdentPos = 0;
    // Labels in scope.
    this.labels = [];
    // Thus-far undefined exports.
    this.undefinedExports = Object.create(null);

    // If enabled, skip leading hashbang line.
    if (this.pos === 0 && options.allowHashBang && this.input.slice(0, 2) === "#!")
      { this.skipLineComment(2); }

    // Scope tracking for duplicate variable names (see scope.js)
    this.scopeStack = [];
    this.enterScope(SCOPE_TOP);

    // For RegExp validation
    this.regexpState = null;

    // The stack of private names.
    // Each element has two properties: 'declared' and 'used'.
    // When it exited from the outermost class definition, all used private names must be declared.
    this.privateNameStack = [];
  };

  var prototypeAccessors = { inFunction: { configurable: true },inGenerator: { configurable: true },inAsync: { configurable: true },canAwait: { configurable: true },allowSuper: { configurable: true },allowDirectSuper: { configurable: true },treatFunctionsAsVar: { configurable: true },allowNewDotTarget: { configurable: true },inClassStaticBlock: { configurable: true } };

  Parser.prototype.parse = function parse () {
    var node = this.options.program || this.startNode();
    this.nextToken();
    return this.parseTopLevel(node)
  };

  prototypeAccessors.inFunction.get = function () { return (this.currentVarScope().flags & SCOPE_FUNCTION) > 0 };

  prototypeAccessors.inGenerator.get = function () { return (this.currentVarScope().flags & SCOPE_GENERATOR) > 0 && !this.currentVarScope().inClassFieldInit };

  prototypeAccessors.inAsync.get = function () { return (this.currentVarScope().flags & SCOPE_ASYNC) > 0 && !this.currentVarScope().inClassFieldInit };

  prototypeAccessors.canAwait.get = function () {
    for (var i = this.scopeStack.length - 1; i >= 0; i--) {
      var scope = this.scopeStack[i];
      if (scope.inClassFieldInit || scope.flags & SCOPE_CLASS_STATIC_BLOCK) { return false }
      if (scope.flags & SCOPE_FUNCTION) { return (scope.flags & SCOPE_ASYNC) > 0 }
    }
    return (this.inModule && this.options.ecmaVersion >= 13) || this.options.allowAwaitOutsideFunction
  };

  prototypeAccessors.allowSuper.get = function () {
    var ref = this.currentThisScope();
      var flags = ref.flags;
      var inClassFieldInit = ref.inClassFieldInit;
    return (flags & SCOPE_SUPER) > 0 || inClassFieldInit || this.options.allowSuperOutsideMethod
  };

  prototypeAccessors.allowDirectSuper.get = function () { return (this.currentThisScope().flags & SCOPE_DIRECT_SUPER) > 0 };

  prototypeAccessors.treatFunctionsAsVar.get = function () { return this.treatFunctionsAsVarInScope(this.currentScope()) };

  prototypeAccessors.allowNewDotTarget.get = function () {
    var ref = this.currentThisScope();
      var flags = ref.flags;
      var inClassFieldInit = ref.inClassFieldInit;
    return (flags & (SCOPE_FUNCTION | SCOPE_CLASS_STATIC_BLOCK)) > 0 || inClassFieldInit
  };

  prototypeAccessors.inClassStaticBlock.get = function () {
    return (this.currentVarScope().flags & SCOPE_CLASS_STATIC_BLOCK) > 0
  };

  Parser.extend = function extend () {
      var plugins = [], len = arguments.length;
      while ( len-- ) plugins[ len ] = arguments[ len ];

    var cls = this;
    for (var i = 0; i < plugins.length; i++) { cls = plugins[i](cls); }
    return cls
  };

  Parser.parse = function parse (input, options) {
    return new this(options, input).parse()
  };

  Parser.parseExpressionAt = function parseExpressionAt (input, pos, options) {
    var parser = new this(options, input, pos);
    parser.nextToken();
    return parser.parseExpression()
  };

  Parser.tokenizer = function tokenizer (input, options) {
    return new this(options, input)
  };

  Object.defineProperties( Parser.prototype, prototypeAccessors );

  var pp$9 = Parser.prototype;

  // ## Parser utilities

  var literal = /^(?:'((?:\\.|[^'\\])*?)'|"((?:\\.|[^"\\])*?)")/;
  pp$9.strictDirective = function(start) {
    if (this.options.ecmaVersion < 5) { return false }
    for (;;) {
      // Try to find string literal.
      skipWhiteSpace.lastIndex = start;
      start += skipWhiteSpace.exec(this.input)[0].length;
      var match = literal.exec(this.input.slice(start));
      if (!match) { return false }
      if ((match[1] || match[2]) === "use strict") {
        skipWhiteSpace.lastIndex = start + match[0].length;
        var spaceAfter = skipWhiteSpace.exec(this.input), end = spaceAfter.index + spaceAfter[0].length;
        var next = this.input.charAt(end);
        return next === ";" || next === "}" ||
          (lineBreak.test(spaceAfter[0]) &&
           !(/[(`.[+\-/*%<>=,?^&]/.test(next) || next === "!" && this.input.charAt(end + 1) === "="))
      }
      start += match[0].length;

      // Skip semicolon, if any.
      skipWhiteSpace.lastIndex = start;
      start += skipWhiteSpace.exec(this.input)[0].length;
      if (this.input[start] === ";")
        { start++; }
    }
  };

  // Predicate that tests whether the next token is of the given
  // type, and if yes, consumes it as a side effect.

  pp$9.eat = function(type) {
    if (this.type === type) {
      this.next();
      return true
    } else {
      return false
    }
  };

  // Tests whether parsed token is a contextual keyword.

  pp$9.isContextual = function(name) {
    return this.type === types$1.name && this.value === name && !this.containsEsc
  };

  // Consumes contextual keyword if possible.

  pp$9.eatContextual = function(name) {
    if (!this.isContextual(name)) { return false }
    this.next();
    return true
  };

  // Asserts that following token is given contextual keyword.

  pp$9.expectContextual = function(name) {
    if (!this.eatContextual(name)) { this.unexpected(); }
  };

  // Test whether a semicolon can be inserted at the current position.

  pp$9.canInsertSemicolon = function() {
    return this.type === types$1.eof ||
      this.type === types$1.braceR ||
      lineBreak.test(this.input.slice(this.lastTokEnd, this.start))
  };

  pp$9.insertSemicolon = function() {
    if (this.canInsertSemicolon()) {
      if (this.options.onInsertedSemicolon)
        { this.options.onInsertedSemicolon(this.lastTokEnd, this.lastTokEndLoc); }
      return true
    }
  };

  // Consume a semicolon, or, failing that, see if we are allowed to
  // pretend that there is a semicolon at this position.

  pp$9.semicolon = function() {
    if (!this.eat(types$1.semi) && !this.insertSemicolon()) { this.unexpected(); }
  };

  pp$9.afterTrailingComma = function(tokType, notNext) {
    if (this.type === tokType) {
      if (this.options.onTrailingComma)
        { this.options.onTrailingComma(this.lastTokStart, this.lastTokStartLoc); }
      if (!notNext)
        { this.next(); }
      return true
    }
  };

  // Expect a token of a given type. If found, consume it, otherwise,
  // raise an unexpected token error.

  pp$9.expect = function(type) {
    this.eat(type) || this.unexpected();
  };

  // Raise an unexpected token error.

  pp$9.unexpected = function(pos) {
    this.raise(pos != null ? pos : this.start, "Unexpected token");
  };

  var DestructuringErrors = function DestructuringErrors() {
    this.shorthandAssign =
    this.trailingComma =
    this.parenthesizedAssign =
    this.parenthesizedBind =
    this.doubleProto =
      -1;
  };

  pp$9.checkPatternErrors = function(refDestructuringErrors, isAssign) {
    if (!refDestructuringErrors) { return }
    if (refDestructuringErrors.trailingComma > -1)
      { this.raiseRecoverable(refDestructuringErrors.trailingComma, "Comma is not permitted after the rest element"); }
    var parens = isAssign ? refDestructuringErrors.parenthesizedAssign : refDestructuringErrors.parenthesizedBind;
    if (parens > -1) { this.raiseRecoverable(parens, "Parenthesized pattern"); }
  };

  pp$9.checkExpressionErrors = function(refDestructuringErrors, andThrow) {
    if (!refDestructuringErrors) { return false }
    var shorthandAssign = refDestructuringErrors.shorthandAssign;
    var doubleProto = refDestructuringErrors.doubleProto;
    if (!andThrow) { return shorthandAssign >= 0 || doubleProto >= 0 }
    if (shorthandAssign >= 0)
      { this.raise(shorthandAssign, "Shorthand property assignments are valid only in destructuring patterns"); }
    if (doubleProto >= 0)
      { this.raiseRecoverable(doubleProto, "Redefinition of __proto__ property"); }
  };

  pp$9.checkYieldAwaitInDefaultParams = function() {
    if (this.yieldPos && (!this.awaitPos || this.yieldPos < this.awaitPos))
      { this.raise(this.yieldPos, "Yield expression cannot be a default value"); }
    if (this.awaitPos)
      { this.raise(this.awaitPos, "Await expression cannot be a default value"); }
  };

  pp$9.isSimpleAssignTarget = function(expr) {
    if (expr.type === "ParenthesizedExpression")
      { return this.isSimpleAssignTarget(expr.expression) }
    return expr.type === "Identifier" || expr.type === "MemberExpression"
  };

  var pp$8 = Parser.prototype;

  // ### Statement parsing

  // Parse a program. Initializes the parser, reads any number of
  // statements, and wraps them in a Program node.  Optionally takes a
  // `program` argument.  If present, the statements will be appended
  // to its body instead of creating a new node.

  pp$8.parseTopLevel = function(node) {
    var exports = Object.create(null);
    if (!node.body) { node.body = []; }
    while (this.type !== types$1.eof) {
      var stmt = this.parseStatement(null, true, exports);
      node.body.push(stmt);
    }
    if (this.inModule)
      { for (var i = 0, list = Object.keys(this.undefinedExports); i < list.length; i += 1)
        {
          var name = list[i];

          this.raiseRecoverable(this.undefinedExports[name].start, ("Export '" + name + "' is not defined"));
        } }
    this.adaptDirectivePrologue(node.body);
    this.next();
    node.sourceType = this.options.sourceType;
    return this.finishNode(node, "Program")
  };

  var loopLabel = {kind: "loop"}, switchLabel = {kind: "switch"};

  pp$8.isLet = function(context) {
    if (this.options.ecmaVersion < 6 || !this.isContextual("let")) { return false }
    skipWhiteSpace.lastIndex = this.pos;
    var skip = skipWhiteSpace.exec(this.input);
    var next = this.pos + skip[0].length, nextCh = this.input.charCodeAt(next);
    // For ambiguous cases, determine if a LexicalDeclaration (or only a
    // Statement) is allowed here. If context is not empty then only a Statement
    // is allowed. However, `let [` is an explicit negative lookahead for
    // ExpressionStatement, so special-case it first.
    if (nextCh === 91 || nextCh === 92 || nextCh > 0xd7ff && nextCh < 0xdc00) { return true } // '[', '/', astral
    if (context) { return false }

    if (nextCh === 123) { return true } // '{'
    if (isIdentifierStart(nextCh, true)) {
      var pos = next + 1;
      while (isIdentifierChar(nextCh = this.input.charCodeAt(pos), true)) { ++pos; }
      if (nextCh === 92 || nextCh > 0xd7ff && nextCh < 0xdc00) { return true }
      var ident = this.input.slice(next, pos);
      if (!keywordRelationalOperator.test(ident)) { return true }
    }
    return false
  };

  // check 'async [no LineTerminator here] function'
  // - 'async /*foo*/ function' is OK.
  // - 'async /*\n*/ function' is invalid.
  pp$8.isAsyncFunction = function() {
    if (this.options.ecmaVersion < 8 || !this.isContextual("async"))
      { return false }

    skipWhiteSpace.lastIndex = this.pos;
    var skip = skipWhiteSpace.exec(this.input);
    var next = this.pos + skip[0].length, after;
    return !lineBreak.test(this.input.slice(this.pos, next)) &&
      this.input.slice(next, next + 8) === "function" &&
      (next + 8 === this.input.length ||
       !(isIdentifierChar(after = this.input.charCodeAt(next + 8)) || after > 0xd7ff && after < 0xdc00))
  };

  // Parse a single statement.
  //
  // If expecting a statement and finding a slash operator, parse a
  // regular expression literal. This is to handle cases like
  // `if (foo) /blah/.exec(foo)`, where looking at the previous token
  // does not help.

  pp$8.parseStatement = function(context, topLevel, exports) {
    var starttype = this.type, node = this.startNode(), kind;

    if (this.isLet(context)) {
      starttype = types$1._var;
      kind = "let";
    }

    // Most types of statements are recognized by the keyword they
    // start with. Many are trivial to parse, some require a bit of
    // complexity.

    switch (starttype) {
    case types$1._break: case types$1._continue: return this.parseBreakContinueStatement(node, starttype.keyword)
    case types$1._debugger: return this.parseDebuggerStatement(node)
    case types$1._do: return this.parseDoStatement(node)
    case types$1._for: return this.parseForStatement(node)
    case types$1._function:
      // Function as sole body of either an if statement or a labeled statement
      // works, but not when it is part of a labeled statement that is the sole
      // body of an if statement.
      if ((context && (this.strict || context !== "if" && context !== "label")) && this.options.ecmaVersion >= 6) { this.unexpected(); }
      return this.parseFunctionStatement(node, false, !context)
    case types$1._class:
      if (context) { this.unexpected(); }
      return this.parseClass(node, true)
    case types$1._if: return this.parseIfStatement(node)
    case types$1._return: return this.parseReturnStatement(node)
    case types$1._switch: return this.parseSwitchStatement(node)
    case types$1._throw: return this.parseThrowStatement(node)
    case types$1._try: return this.parseTryStatement(node)
    case types$1._const: case types$1._var:
      kind = kind || this.value;
      if (context && kind !== "var") { this.unexpected(); }
      return this.parseVarStatement(node, kind)
    case types$1._while: return this.parseWhileStatement(node)
    case types$1._with: return this.parseWithStatement(node)
    case types$1.braceL: return this.parseBlock(true, node)
    case types$1.semi: return this.parseEmptyStatement(node)
    case types$1._export:
    case types$1._import:
      if (this.options.ecmaVersion > 10 && starttype === types$1._import) {
        skipWhiteSpace.lastIndex = this.pos;
        var skip = skipWhiteSpace.exec(this.input);
        var next = this.pos + skip[0].length, nextCh = this.input.charCodeAt(next);
        if (nextCh === 40 || nextCh === 46) // '(' or '.'
          { return this.parseExpressionStatement(node, this.parseExpression()) }
      }

      if (!this.options.allowImportExportEverywhere) {
        if (!topLevel)
          { this.raise(this.start, "'import' and 'export' may only appear at the top level"); }
        if (!this.inModule)
          { this.raise(this.start, "'import' and 'export' may appear only with 'sourceType: module'"); }
      }
      return starttype === types$1._import ? this.parseImport(node) : this.parseExport(node, exports)

      // If the statement does not start with a statement keyword or a
      // brace, it's an ExpressionStatement or LabeledStatement. We
      // simply start parsing an expression, and afterwards, if the
      // next token is a colon and the expression was a simple
      // Identifier node, we switch to interpreting it as a label.
    default:
      if (this.isAsyncFunction()) {
        if (context) { this.unexpected(); }
        this.next();
        return this.parseFunctionStatement(node, true, !context)
      }

      var maybeName = this.value, expr = this.parseExpression();
      if (starttype === types$1.name && expr.type === "Identifier" && this.eat(types$1.colon))
        { return this.parseLabeledStatement(node, maybeName, expr, context) }
      else { return this.parseExpressionStatement(node, expr) }
    }
  };

  pp$8.parseBreakContinueStatement = function(node, keyword) {
    var isBreak = keyword === "break";
    this.next();
    if (this.eat(types$1.semi) || this.insertSemicolon()) { node.label = null; }
    else if (this.type !== types$1.name) { this.unexpected(); }
    else {
      node.label = this.parseIdent();
      this.semicolon();
    }

    // Verify that there is an actual destination to break or
    // continue to.
    var i = 0;
    for (; i < this.labels.length; ++i) {
      var lab = this.labels[i];
      if (node.label == null || lab.name === node.label.name) {
        if (lab.kind != null && (isBreak || lab.kind === "loop")) { break }
        if (node.label && isBreak) { break }
      }
    }
    if (i === this.labels.length) { this.raise(node.start, "Unsyntactic " + keyword); }
    return this.finishNode(node, isBreak ? "BreakStatement" : "ContinueStatement")
  };

  pp$8.parseDebuggerStatement = function(node) {
    this.next();
    this.semicolon();
    return this.finishNode(node, "DebuggerStatement")
  };

  pp$8.parseDoStatement = function(node) {
    this.next();
    this.labels.push(loopLabel);
    node.body = this.parseStatement("do");
    this.labels.pop();
    this.expect(types$1._while);
    node.test = this.parseParenExpression();
    if (this.options.ecmaVersion >= 6)
      { this.eat(types$1.semi); }
    else
      { this.semicolon(); }
    return this.finishNode(node, "DoWhileStatement")
  };

  // Disambiguating between a `for` and a `for`/`in` or `for`/`of`
  // loop is non-trivial. Basically, we have to parse the init `var`
  // statement or expression, disallowing the `in` operator (see
  // the second parameter to `parseExpression`), and then check
  // whether the next token is `in` or `of`. When there is no init
  // part (semicolon immediately after the opening parenthesis), it
  // is a regular `for` loop.

  pp$8.parseForStatement = function(node) {
    this.next();
    var awaitAt = (this.options.ecmaVersion >= 9 && this.canAwait && this.eatContextual("await")) ? this.lastTokStart : -1;
    this.labels.push(loopLabel);
    this.enterScope(0);
    this.expect(types$1.parenL);
    if (this.type === types$1.semi) {
      if (awaitAt > -1) { this.unexpected(awaitAt); }
      return this.parseFor(node, null)
    }
    var isLet = this.isLet();
    if (this.type === types$1._var || this.type === types$1._const || isLet) {
      var init$1 = this.startNode(), kind = isLet ? "let" : this.value;
      this.next();
      this.parseVar(init$1, true, kind);
      this.finishNode(init$1, "VariableDeclaration");
      if ((this.type === types$1._in || (this.options.ecmaVersion >= 6 && this.isContextual("of"))) && init$1.declarations.length === 1) {
        if (this.options.ecmaVersion >= 9) {
          if (this.type === types$1._in) {
            if (awaitAt > -1) { this.unexpected(awaitAt); }
          } else { node.await = awaitAt > -1; }
        }
        return this.parseForIn(node, init$1)
      }
      if (awaitAt > -1) { this.unexpected(awaitAt); }
      return this.parseFor(node, init$1)
    }
    var startsWithLet = this.isContextual("let"), isForOf = false;
    var refDestructuringErrors = new DestructuringErrors;
    var init = this.parseExpression(awaitAt > -1 ? "await" : true, refDestructuringErrors);
    if (this.type === types$1._in || (isForOf = this.options.ecmaVersion >= 6 && this.isContextual("of"))) {
      if (this.options.ecmaVersion >= 9) {
        if (this.type === types$1._in) {
          if (awaitAt > -1) { this.unexpected(awaitAt); }
        } else { node.await = awaitAt > -1; }
      }
      if (startsWithLet && isForOf) { this.raise(init.start, "The left-hand side of a for-of loop may not start with 'let'."); }
      this.toAssignable(init, false, refDestructuringErrors);
      this.checkLValPattern(init);
      return this.parseForIn(node, init)
    } else {
      this.checkExpressionErrors(refDestructuringErrors, true);
    }
    if (awaitAt > -1) { this.unexpected(awaitAt); }
    return this.parseFor(node, init)
  };

  pp$8.parseFunctionStatement = function(node, isAsync, declarationPosition) {
    this.next();
    return this.parseFunction(node, FUNC_STATEMENT | (declarationPosition ? 0 : FUNC_HANGING_STATEMENT), false, isAsync)
  };

  pp$8.parseIfStatement = function(node) {
    this.next();
    node.test = this.parseParenExpression();
    // allow function declarations in branches, but only in non-strict mode
    node.consequent = this.parseStatement("if");
    node.alternate = this.eat(types$1._else) ? this.parseStatement("if") : null;
    return this.finishNode(node, "IfStatement")
  };

  pp$8.parseReturnStatement = function(node) {
    if (!this.inFunction && !this.options.allowReturnOutsideFunction)
      { this.raise(this.start, "'return' outside of function"); }
    this.next();

    // In `return` (and `break`/`continue`), the keywords with
    // optional arguments, we eagerly look for a semicolon or the
    // possibility to insert one.

    if (this.eat(types$1.semi) || this.insertSemicolon()) { node.argument = null; }
    else { node.argument = this.parseExpression(); this.semicolon(); }
    return this.finishNode(node, "ReturnStatement")
  };

  pp$8.parseSwitchStatement = function(node) {
    this.next();
    node.discriminant = this.parseParenExpression();
    node.cases = [];
    this.expect(types$1.braceL);
    this.labels.push(switchLabel);
    this.enterScope(0);

    // Statements under must be grouped (by label) in SwitchCase
    // nodes. `cur` is used to keep the node that we are currently
    // adding statements to.

    var cur;
    for (var sawDefault = false; this.type !== types$1.braceR;) {
      if (this.type === types$1._case || this.type === types$1._default) {
        var isCase = this.type === types$1._case;
        if (cur) { this.finishNode(cur, "SwitchCase"); }
        node.cases.push(cur = this.startNode());
        cur.consequent = [];
        this.next();
        if (isCase) {
          cur.test = this.parseExpression();
        } else {
          if (sawDefault) { this.raiseRecoverable(this.lastTokStart, "Multiple default clauses"); }
          sawDefault = true;
          cur.test = null;
        }
        this.expect(types$1.colon);
      } else {
        if (!cur) { this.unexpected(); }
        cur.consequent.push(this.parseStatement(null));
      }
    }
    this.exitScope();
    if (cur) { this.finishNode(cur, "SwitchCase"); }
    this.next(); // Closing brace
    this.labels.pop();
    return this.finishNode(node, "SwitchStatement")
  };

  pp$8.parseThrowStatement = function(node) {
    this.next();
    if (lineBreak.test(this.input.slice(this.lastTokEnd, this.start)))
      { this.raise(this.lastTokEnd, "Illegal newline after throw"); }
    node.argument = this.parseExpression();
    this.semicolon();
    return this.finishNode(node, "ThrowStatement")
  };

  // Reused empty array added for node fields that are always empty.

  var empty$1 = [];

  pp$8.parseTryStatement = function(node) {
    this.next();
    node.block = this.parseBlock();
    node.handler = null;
    if (this.type === types$1._catch) {
      var clause = this.startNode();
      this.next();
      if (this.eat(types$1.parenL)) {
        clause.param = this.parseBindingAtom();
        var simple = clause.param.type === "Identifier";
        this.enterScope(simple ? SCOPE_SIMPLE_CATCH : 0);
        this.checkLValPattern(clause.param, simple ? BIND_SIMPLE_CATCH : BIND_LEXICAL);
        this.expect(types$1.parenR);
      } else {
        if (this.options.ecmaVersion < 10) { this.unexpected(); }
        clause.param = null;
        this.enterScope(0);
      }
      clause.body = this.parseBlock(false);
      this.exitScope();
      node.handler = this.finishNode(clause, "CatchClause");
    }
    node.finalizer = this.eat(types$1._finally) ? this.parseBlock() : null;
    if (!node.handler && !node.finalizer)
      { this.raise(node.start, "Missing catch or finally clause"); }
    return this.finishNode(node, "TryStatement")
  };

  pp$8.parseVarStatement = function(node, kind) {
    this.next();
    this.parseVar(node, false, kind);
    this.semicolon();
    return this.finishNode(node, "VariableDeclaration")
  };

  pp$8.parseWhileStatement = function(node) {
    this.next();
    node.test = this.parseParenExpression();
    this.labels.push(loopLabel);
    node.body = this.parseStatement("while");
    this.labels.pop();
    return this.finishNode(node, "WhileStatement")
  };

  pp$8.parseWithStatement = function(node) {
    if (this.strict) { this.raise(this.start, "'with' in strict mode"); }
    this.next();
    node.object = this.parseParenExpression();
    node.body = this.parseStatement("with");
    return this.finishNode(node, "WithStatement")
  };

  pp$8.parseEmptyStatement = function(node) {
    this.next();
    return this.finishNode(node, "EmptyStatement")
  };

  pp$8.parseLabeledStatement = function(node, maybeName, expr, context) {
    for (var i$1 = 0, list = this.labels; i$1 < list.length; i$1 += 1)
      {
      var label = list[i$1];

      if (label.name === maybeName)
        { this.raise(expr.start, "Label '" + maybeName + "' is already declared");
    } }
    var kind = this.type.isLoop ? "loop" : this.type === types$1._switch ? "switch" : null;
    for (var i = this.labels.length - 1; i >= 0; i--) {
      var label$1 = this.labels[i];
      if (label$1.statementStart === node.start) {
        // Update information about previous labels on this node
        label$1.statementStart = this.start;
        label$1.kind = kind;
      } else { break }
    }
    this.labels.push({name: maybeName, kind: kind, statementStart: this.start});
    node.body = this.parseStatement(context ? context.indexOf("label") === -1 ? context + "label" : context : "label");
    this.labels.pop();
    node.label = expr;
    return this.finishNode(node, "LabeledStatement")
  };

  pp$8.parseExpressionStatement = function(node, expr) {
    node.expression = expr;
    this.semicolon();
    return this.finishNode(node, "ExpressionStatement")
  };

  // Parse a semicolon-enclosed block of statements, handling `"use
  // strict"` declarations when `allowStrict` is true (used for
  // function bodies).

  pp$8.parseBlock = function(createNewLexicalScope, node, exitStrict) {
    if ( createNewLexicalScope === void 0 ) createNewLexicalScope = true;
    if ( node === void 0 ) node = this.startNode();

    node.body = [];
    this.expect(types$1.braceL);
    if (createNewLexicalScope) { this.enterScope(0); }
    while (this.type !== types$1.braceR) {
      var stmt = this.parseStatement(null);
      node.body.push(stmt);
    }
    if (exitStrict) { this.strict = false; }
    this.next();
    if (createNewLexicalScope) { this.exitScope(); }
    return this.finishNode(node, "BlockStatement")
  };

  // Parse a regular `for` loop. The disambiguation code in
  // `parseStatement` will already have parsed the init statement or
  // expression.

  pp$8.parseFor = function(node, init) {
    node.init = init;
    this.expect(types$1.semi);
    node.test = this.type === types$1.semi ? null : this.parseExpression();
    this.expect(types$1.semi);
    node.update = this.type === types$1.parenR ? null : this.parseExpression();
    this.expect(types$1.parenR);
    node.body = this.parseStatement("for");
    this.exitScope();
    this.labels.pop();
    return this.finishNode(node, "ForStatement")
  };

  // Parse a `for`/`in` and `for`/`of` loop, which are almost
  // same from parser's perspective.

  pp$8.parseForIn = function(node, init) {
    var isForIn = this.type === types$1._in;
    this.next();

    if (
      init.type === "VariableDeclaration" &&
      init.declarations[0].init != null &&
      (
        !isForIn ||
        this.options.ecmaVersion < 8 ||
        this.strict ||
        init.kind !== "var" ||
        init.declarations[0].id.type !== "Identifier"
      )
    ) {
      this.raise(
        init.start,
        ((isForIn ? "for-in" : "for-of") + " loop variable declaration may not have an initializer")
      );
    }
    node.left = init;
    node.right = isForIn ? this.parseExpression() : this.parseMaybeAssign();
    this.expect(types$1.parenR);
    node.body = this.parseStatement("for");
    this.exitScope();
    this.labels.pop();
    return this.finishNode(node, isForIn ? "ForInStatement" : "ForOfStatement")
  };

  // Parse a list of variable declarations.

  pp$8.parseVar = function(node, isFor, kind) {
    node.declarations = [];
    node.kind = kind;
    for (;;) {
      var decl = this.startNode();
      this.parseVarId(decl, kind);
      if (this.eat(types$1.eq)) {
        decl.init = this.parseMaybeAssign(isFor);
      } else if (kind === "const" && !(this.type === types$1._in || (this.options.ecmaVersion >= 6 && this.isContextual("of")))) {
        this.unexpected();
      } else if (decl.id.type !== "Identifier" && !(isFor && (this.type === types$1._in || this.isContextual("of")))) {
        this.raise(this.lastTokEnd, "Complex binding patterns require an initialization value");
      } else {
        decl.init = null;
      }
      node.declarations.push(this.finishNode(decl, "VariableDeclarator"));
      if (!this.eat(types$1.comma)) { break }
    }
    return node
  };

  pp$8.parseVarId = function(decl, kind) {
    decl.id = this.parseBindingAtom();
    this.checkLValPattern(decl.id, kind === "var" ? BIND_VAR : BIND_LEXICAL, false);
  };

  var FUNC_STATEMENT = 1, FUNC_HANGING_STATEMENT = 2, FUNC_NULLABLE_ID = 4;

  // Parse a function declaration or literal (depending on the
  // `statement & FUNC_STATEMENT`).

  // Remove `allowExpressionBody` for 7.0.0, as it is only called with false
  pp$8.parseFunction = function(node, statement, allowExpressionBody, isAsync, forInit) {
    this.initFunction(node);
    if (this.options.ecmaVersion >= 9 || this.options.ecmaVersion >= 6 && !isAsync) {
      if (this.type === types$1.star && (statement & FUNC_HANGING_STATEMENT))
        { this.unexpected(); }
      node.generator = this.eat(types$1.star);
    }
    if (this.options.ecmaVersion >= 8)
      { node.async = !!isAsync; }

    if (statement & FUNC_STATEMENT) {
      node.id = (statement & FUNC_NULLABLE_ID) && this.type !== types$1.name ? null : this.parseIdent();
      if (node.id && !(statement & FUNC_HANGING_STATEMENT))
        // If it is a regular function declaration in sloppy mode, then it is
        // subject to Annex B semantics (BIND_FUNCTION). Otherwise, the binding
        // mode depends on properties of the current scope (see
        // treatFunctionsAsVar).
        { this.checkLValSimple(node.id, (this.strict || node.generator || node.async) ? this.treatFunctionsAsVar ? BIND_VAR : BIND_LEXICAL : BIND_FUNCTION); }
    }

    var oldYieldPos = this.yieldPos, oldAwaitPos = this.awaitPos, oldAwaitIdentPos = this.awaitIdentPos;
    this.yieldPos = 0;
    this.awaitPos = 0;
    this.awaitIdentPos = 0;
    this.enterScope(functionFlags(node.async, node.generator));

    if (!(statement & FUNC_STATEMENT))
      { node.id = this.type === types$1.name ? this.parseIdent() : null; }

    this.parseFunctionParams(node);
    this.parseFunctionBody(node, allowExpressionBody, false, forInit);

    this.yieldPos = oldYieldPos;
    this.awaitPos = oldAwaitPos;
    this.awaitIdentPos = oldAwaitIdentPos;
    return this.finishNode(node, (statement & FUNC_STATEMENT) ? "FunctionDeclaration" : "FunctionExpression")
  };

  pp$8.parseFunctionParams = function(node) {
    this.expect(types$1.parenL);
    node.params = this.parseBindingList(types$1.parenR, false, this.options.ecmaVersion >= 8);
    this.checkYieldAwaitInDefaultParams();
  };

  // Parse a class declaration or literal (depending on the
  // `isStatement` parameter).

  pp$8.parseClass = function(node, isStatement) {
    this.next();

    // ecma-262 14.6 Class Definitions
    // A class definition is always strict mode code.
    var oldStrict = this.strict;
    this.strict = true;

    this.parseClassId(node, isStatement);
    this.parseClassSuper(node);
    var privateNameMap = this.enterClassBody();
    var classBody = this.startNode();
    var hadConstructor = false;
    classBody.body = [];
    this.expect(types$1.braceL);
    while (this.type !== types$1.braceR) {
      var element = this.parseClassElement(node.superClass !== null);
      if (element) {
        classBody.body.push(element);
        if (element.type === "MethodDefinition" && element.kind === "constructor") {
          if (hadConstructor) { this.raise(element.start, "Duplicate constructor in the same class"); }
          hadConstructor = true;
        } else if (element.key && element.key.type === "PrivateIdentifier" && isPrivateNameConflicted(privateNameMap, element)) {
          this.raiseRecoverable(element.key.start, ("Identifier '#" + (element.key.name) + "' has already been declared"));
        }
      }
    }
    this.strict = oldStrict;
    this.next();
    node.body = this.finishNode(classBody, "ClassBody");
    this.exitClassBody();
    return this.finishNode(node, isStatement ? "ClassDeclaration" : "ClassExpression")
  };

  pp$8.parseClassElement = function(constructorAllowsSuper) {
    if (this.eat(types$1.semi)) { return null }

    var ecmaVersion = this.options.ecmaVersion;
    var node = this.startNode();
    var keyName = "";
    var isGenerator = false;
    var isAsync = false;
    var kind = "method";
    var isStatic = false;

    if (this.eatContextual("static")) {
      // Parse static init block
      if (ecmaVersion >= 13 && this.eat(types$1.braceL)) {
        this.parseClassStaticBlock(node);
        return node
      }
      if (this.isClassElementNameStart() || this.type === types$1.star) {
        isStatic = true;
      } else {
        keyName = "static";
      }
    }
    node.static = isStatic;
    if (!keyName && ecmaVersion >= 8 && this.eatContextual("async")) {
      if ((this.isClassElementNameStart() || this.type === types$1.star) && !this.canInsertSemicolon()) {
        isAsync = true;
      } else {
        keyName = "async";
      }
    }
    if (!keyName && (ecmaVersion >= 9 || !isAsync) && this.eat(types$1.star)) {
      isGenerator = true;
    }
    if (!keyName && !isAsync && !isGenerator) {
      var lastValue = this.value;
      if (this.eatContextual("get") || this.eatContextual("set")) {
        if (this.isClassElementNameStart()) {
          kind = lastValue;
        } else {
          keyName = lastValue;
        }
      }
    }

    // Parse element name
    if (keyName) {
      // 'async', 'get', 'set', or 'static' were not a keyword contextually.
      // The last token is any of those. Make it the element name.
      node.computed = false;
      node.key = this.startNodeAt(this.lastTokStart, this.lastTokStartLoc);
      node.key.name = keyName;
      this.finishNode(node.key, "Identifier");
    } else {
      this.parseClassElementName(node);
    }

    // Parse element value
    if (ecmaVersion < 13 || this.type === types$1.parenL || kind !== "method" || isGenerator || isAsync) {
      var isConstructor = !node.static && checkKeyName(node, "constructor");
      var allowsDirectSuper = isConstructor && constructorAllowsSuper;
      // Couldn't move this check into the 'parseClassMethod' method for backward compatibility.
      if (isConstructor && kind !== "method") { this.raise(node.key.start, "Constructor can't have get/set modifier"); }
      node.kind = isConstructor ? "constructor" : kind;
      this.parseClassMethod(node, isGenerator, isAsync, allowsDirectSuper);
    } else {
      this.parseClassField(node);
    }

    return node
  };

  pp$8.isClassElementNameStart = function() {
    return (
      this.type === types$1.name ||
      this.type === types$1.privateId ||
      this.type === types$1.num ||
      this.type === types$1.string ||
      this.type === types$1.bracketL ||
      this.type.keyword
    )
  };

  pp$8.parseClassElementName = function(element) {
    if (this.type === types$1.privateId) {
      if (this.value === "constructor") {
        this.raise(this.start, "Classes can't have an element named '#constructor'");
      }
      element.computed = false;
      element.key = this.parsePrivateIdent();
    } else {
      this.parsePropertyName(element);
    }
  };

  pp$8.parseClassMethod = function(method, isGenerator, isAsync, allowsDirectSuper) {
    // Check key and flags
    var key = method.key;
    if (method.kind === "constructor") {
      if (isGenerator) { this.raise(key.start, "Constructor can't be a generator"); }
      if (isAsync) { this.raise(key.start, "Constructor can't be an async method"); }
    } else if (method.static && checkKeyName(method, "prototype")) {
      this.raise(key.start, "Classes may not have a static property named prototype");
    }

    // Parse value
    var value = method.value = this.parseMethod(isGenerator, isAsync, allowsDirectSuper);

    // Check value
    if (method.kind === "get" && value.params.length !== 0)
      { this.raiseRecoverable(value.start, "getter should have no params"); }
    if (method.kind === "set" && value.params.length !== 1)
      { this.raiseRecoverable(value.start, "setter should have exactly one param"); }
    if (method.kind === "set" && value.params[0].type === "RestElement")
      { this.raiseRecoverable(value.params[0].start, "Setter cannot use rest params"); }

    return this.finishNode(method, "MethodDefinition")
  };

  pp$8.parseClassField = function(field) {
    if (checkKeyName(field, "constructor")) {
      this.raise(field.key.start, "Classes can't have a field named 'constructor'");
    } else if (field.static && checkKeyName(field, "prototype")) {
      this.raise(field.key.start, "Classes can't have a static field named 'prototype'");
    }

    if (this.eat(types$1.eq)) {
      // To raise SyntaxError if 'arguments' exists in the initializer.
      var scope = this.currentThisScope();
      var inClassFieldInit = scope.inClassFieldInit;
      scope.inClassFieldInit = true;
      field.value = this.parseMaybeAssign();
      scope.inClassFieldInit = inClassFieldInit;
    } else {
      field.value = null;
    }
    this.semicolon();

    return this.finishNode(field, "PropertyDefinition")
  };

  pp$8.parseClassStaticBlock = function(node) {
    node.body = [];

    var oldLabels = this.labels;
    this.labels = [];
    this.enterScope(SCOPE_CLASS_STATIC_BLOCK | SCOPE_SUPER);
    while (this.type !== types$1.braceR) {
      var stmt = this.parseStatement(null);
      node.body.push(stmt);
    }
    this.next();
    this.exitScope();
    this.labels = oldLabels;

    return this.finishNode(node, "StaticBlock")
  };

  pp$8.parseClassId = function(node, isStatement) {
    if (this.type === types$1.name) {
      node.id = this.parseIdent();
      if (isStatement)
        { this.checkLValSimple(node.id, BIND_LEXICAL, false); }
    } else {
      if (isStatement === true)
        { this.unexpected(); }
      node.id = null;
    }
  };

  pp$8.parseClassSuper = function(node) {
    node.superClass = this.eat(types$1._extends) ? this.parseExprSubscripts(false) : null;
  };

  pp$8.enterClassBody = function() {
    var element = {declared: Object.create(null), used: []};
    this.privateNameStack.push(element);
    return element.declared
  };

  pp$8.exitClassBody = function() {
    var ref = this.privateNameStack.pop();
    var declared = ref.declared;
    var used = ref.used;
    var len = this.privateNameStack.length;
    var parent = len === 0 ? null : this.privateNameStack[len - 1];
    for (var i = 0; i < used.length; ++i) {
      var id = used[i];
      if (!hasOwn(declared, id.name)) {
        if (parent) {
          parent.used.push(id);
        } else {
          this.raiseRecoverable(id.start, ("Private field '#" + (id.name) + "' must be declared in an enclosing class"));
        }
      }
    }
  };

  function isPrivateNameConflicted(privateNameMap, element) {
    var name = element.key.name;
    var curr = privateNameMap[name];

    var next = "true";
    if (element.type === "MethodDefinition" && (element.kind === "get" || element.kind === "set")) {
      next = (element.static ? "s" : "i") + element.kind;
    }

    // `class { get #a(){}; static set #a(_){} }` is also conflict.
    if (
      curr === "iget" && next === "iset" ||
      curr === "iset" && next === "iget" ||
      curr === "sget" && next === "sset" ||
      curr === "sset" && next === "sget"
    ) {
      privateNameMap[name] = "true";
      return false
    } else if (!curr) {
      privateNameMap[name] = next;
      return false
    } else {
      return true
    }
  }

  function checkKeyName(node, name) {
    var computed = node.computed;
    var key = node.key;
    return !computed && (
      key.type === "Identifier" && key.name === name ||
      key.type === "Literal" && key.value === name
    )
  }

  // Parses module export declaration.

  pp$8.parseExport = function(node, exports) {
    this.next();
    // export * from '...'
    if (this.eat(types$1.star)) {
      if (this.options.ecmaVersion >= 11) {
        if (this.eatContextual("as")) {
          node.exported = this.parseModuleExportName();
          this.checkExport(exports, node.exported, this.lastTokStart);
        } else {
          node.exported = null;
        }
      }
      this.expectContextual("from");
      if (this.type !== types$1.string) { this.unexpected(); }
      node.source = this.parseExprAtom();
      this.semicolon();
      return this.finishNode(node, "ExportAllDeclaration")
    }
    if (this.eat(types$1._default)) { // export default ...
      this.checkExport(exports, "default", this.lastTokStart);
      var isAsync;
      if (this.type === types$1._function || (isAsync = this.isAsyncFunction())) {
        var fNode = this.startNode();
        this.next();
        if (isAsync) { this.next(); }
        node.declaration = this.parseFunction(fNode, FUNC_STATEMENT | FUNC_NULLABLE_ID, false, isAsync);
      } else if (this.type === types$1._class) {
        var cNode = this.startNode();
        node.declaration = this.parseClass(cNode, "nullableID");
      } else {
        node.declaration = this.parseMaybeAssign();
        this.semicolon();
      }
      return this.finishNode(node, "ExportDefaultDeclaration")
    }
    // export var|const|let|function|class ...
    if (this.shouldParseExportStatement()) {
      node.declaration = this.parseStatement(null);
      if (node.declaration.type === "VariableDeclaration")
        { this.checkVariableExport(exports, node.declaration.declarations); }
      else
        { this.checkExport(exports, node.declaration.id, node.declaration.id.start); }
      node.specifiers = [];
      node.source = null;
    } else { // export { x, y as z } [from '...']
      node.declaration = null;
      node.specifiers = this.parseExportSpecifiers(exports);
      if (this.eatContextual("from")) {
        if (this.type !== types$1.string) { this.unexpected(); }
        node.source = this.parseExprAtom();
      } else {
        for (var i = 0, list = node.specifiers; i < list.length; i += 1) {
          // check for keywords used as local names
          var spec = list[i];

          this.checkUnreserved(spec.local);
          // check if export is defined
          this.checkLocalExport(spec.local);

          if (spec.local.type === "Literal") {
            this.raise(spec.local.start, "A string literal cannot be used as an exported binding without `from`.");
          }
        }

        node.source = null;
      }
      this.semicolon();
    }
    return this.finishNode(node, "ExportNamedDeclaration")
  };

  pp$8.checkExport = function(exports, name, pos) {
    if (!exports) { return }
    if (typeof name !== "string")
      { name = name.type === "Identifier" ? name.name : name.value; }
    if (hasOwn(exports, name))
      { this.raiseRecoverable(pos, "Duplicate export '" + name + "'"); }
    exports[name] = true;
  };

  pp$8.checkPatternExport = function(exports, pat) {
    var type = pat.type;
    if (type === "Identifier")
      { this.checkExport(exports, pat, pat.start); }
    else if (type === "ObjectPattern")
      { for (var i = 0, list = pat.properties; i < list.length; i += 1)
        {
          var prop = list[i];

          this.checkPatternExport(exports, prop);
        } }
    else if (type === "ArrayPattern")
      { for (var i$1 = 0, list$1 = pat.elements; i$1 < list$1.length; i$1 += 1) {
        var elt = list$1[i$1];

          if (elt) { this.checkPatternExport(exports, elt); }
      } }
    else if (type === "Property")
      { this.checkPatternExport(exports, pat.value); }
    else if (type === "AssignmentPattern")
      { this.checkPatternExport(exports, pat.left); }
    else if (type === "RestElement")
      { this.checkPatternExport(exports, pat.argument); }
    else if (type === "ParenthesizedExpression")
      { this.checkPatternExport(exports, pat.expression); }
  };

  pp$8.checkVariableExport = function(exports, decls) {
    if (!exports) { return }
    for (var i = 0, list = decls; i < list.length; i += 1)
      {
      var decl = list[i];

      this.checkPatternExport(exports, decl.id);
    }
  };

  pp$8.shouldParseExportStatement = function() {
    return this.type.keyword === "var" ||
      this.type.keyword === "const" ||
      this.type.keyword === "class" ||
      this.type.keyword === "function" ||
      this.isLet() ||
      this.isAsyncFunction()
  };

  // Parses a comma-separated list of module exports.

  pp$8.parseExportSpecifiers = function(exports) {
    var nodes = [], first = true;
    // export { x, y as z } [from '...']
    this.expect(types$1.braceL);
    while (!this.eat(types$1.braceR)) {
      if (!first) {
        this.expect(types$1.comma);
        if (this.afterTrailingComma(types$1.braceR)) { break }
      } else { first = false; }

      var node = this.startNode();
      node.local = this.parseModuleExportName();
      node.exported = this.eatContextual("as") ? this.parseModuleExportName() : node.local;
      this.checkExport(
        exports,
        node.exported,
        node.exported.start
      );
      nodes.push(this.finishNode(node, "ExportSpecifier"));
    }
    return nodes
  };

  // Parses import declaration.

  pp$8.parseImport = function(node) {
    this.next();
    // import '...'
    if (this.type === types$1.string) {
      node.specifiers = empty$1;
      node.source = this.parseExprAtom();
    } else {
      node.specifiers = this.parseImportSpecifiers();
      this.expectContextual("from");
      node.source = this.type === types$1.string ? this.parseExprAtom() : this.unexpected();
    }
    this.semicolon();
    return this.finishNode(node, "ImportDeclaration")
  };

  // Parses a comma-separated list of module imports.

  pp$8.parseImportSpecifiers = function() {
    var nodes = [], first = true;
    if (this.type === types$1.name) {
      // import defaultObj, { x, y as z } from '...'
      var node = this.startNode();
      node.local = this.parseIdent();
      this.checkLValSimple(node.local, BIND_LEXICAL);
      nodes.push(this.finishNode(node, "ImportDefaultSpecifier"));
      if (!this.eat(types$1.comma)) { return nodes }
    }
    if (this.type === types$1.star) {
      var node$1 = this.startNode();
      this.next();
      this.expectContextual("as");
      node$1.local = this.parseIdent();
      this.checkLValSimple(node$1.local, BIND_LEXICAL);
      nodes.push(this.finishNode(node$1, "ImportNamespaceSpecifier"));
      return nodes
    }
    this.expect(types$1.braceL);
    while (!this.eat(types$1.braceR)) {
      if (!first) {
        this.expect(types$1.comma);
        if (this.afterTrailingComma(types$1.braceR)) { break }
      } else { first = false; }

      var node$2 = this.startNode();
      node$2.imported = this.parseModuleExportName();
      if (this.eatContextual("as")) {
        node$2.local = this.parseIdent();
      } else {
        this.checkUnreserved(node$2.imported);
        node$2.local = node$2.imported;
      }
      this.checkLValSimple(node$2.local, BIND_LEXICAL);
      nodes.push(this.finishNode(node$2, "ImportSpecifier"));
    }
    return nodes
  };

  pp$8.parseModuleExportName = function() {
    if (this.options.ecmaVersion >= 13 && this.type === types$1.string) {
      var stringLiteral = this.parseLiteral(this.value);
      if (loneSurrogate.test(stringLiteral.value)) {
        this.raise(stringLiteral.start, "An export name cannot include a lone surrogate.");
      }
      return stringLiteral
    }
    return this.parseIdent(true)
  };

  // Set `ExpressionStatement#directive` property for directive prologues.
  pp$8.adaptDirectivePrologue = function(statements) {
    for (var i = 0; i < statements.length && this.isDirectiveCandidate(statements[i]); ++i) {
      statements[i].directive = statements[i].expression.raw.slice(1, -1);
    }
  };
  pp$8.isDirectiveCandidate = function(statement) {
    return (
      statement.type === "ExpressionStatement" &&
      statement.expression.type === "Literal" &&
      typeof statement.expression.value === "string" &&
      // Reject parenthesized strings.
      (this.input[statement.start] === "\"" || this.input[statement.start] === "'")
    )
  };

  var pp$7 = Parser.prototype;

  // Convert existing expression atom to assignable pattern
  // if possible.

  pp$7.toAssignable = function(node, isBinding, refDestructuringErrors) {
    if (this.options.ecmaVersion >= 6 && node) {
      switch (node.type) {
      case "Identifier":
        if (this.inAsync && node.name === "await")
          { this.raise(node.start, "Cannot use 'await' as identifier inside an async function"); }
        break

      case "ObjectPattern":
      case "ArrayPattern":
      case "AssignmentPattern":
      case "RestElement":
        break

      case "ObjectExpression":
        node.type = "ObjectPattern";
        if (refDestructuringErrors) { this.checkPatternErrors(refDestructuringErrors, true); }
        for (var i = 0, list = node.properties; i < list.length; i += 1) {
          var prop = list[i];

        this.toAssignable(prop, isBinding);
          // Early error:
          //   AssignmentRestProperty[Yield, Await] :
          //     `...` DestructuringAssignmentTarget[Yield, Await]
          //
          //   It is a Syntax Error if |DestructuringAssignmentTarget| is an |ArrayLiteral| or an |ObjectLiteral|.
          if (
            prop.type === "RestElement" &&
            (prop.argument.type === "ArrayPattern" || prop.argument.type === "ObjectPattern")
          ) {
            this.raise(prop.argument.start, "Unexpected token");
          }
        }
        break

      case "Property":
        // AssignmentProperty has type === "Property"
        if (node.kind !== "init") { this.raise(node.key.start, "Object pattern can't contain getter or setter"); }
        this.toAssignable(node.value, isBinding);
        break

      case "ArrayExpression":
        node.type = "ArrayPattern";
        if (refDestructuringErrors) { this.checkPatternErrors(refDestructuringErrors, true); }
        this.toAssignableList(node.elements, isBinding);
        break

      case "SpreadElement":
        node.type = "RestElement";
        this.toAssignable(node.argument, isBinding);
        if (node.argument.type === "AssignmentPattern")
          { this.raise(node.argument.start, "Rest elements cannot have a default value"); }
        break

      case "AssignmentExpression":
        if (node.operator !== "=") { this.raise(node.left.end, "Only '=' operator can be used for specifying default value."); }
        node.type = "AssignmentPattern";
        delete node.operator;
        this.toAssignable(node.left, isBinding);
        break

      case "ParenthesizedExpression":
        this.toAssignable(node.expression, isBinding, refDestructuringErrors);
        break

      case "ChainExpression":
        this.raiseRecoverable(node.start, "Optional chaining cannot appear in left-hand side");
        break

      case "MemberExpression":
        if (!isBinding) { break }

      default:
        this.raise(node.start, "Assigning to rvalue");
      }
    } else if (refDestructuringErrors) { this.checkPatternErrors(refDestructuringErrors, true); }
    return node
  };

  // Convert list of expression atoms to binding list.

  pp$7.toAssignableList = function(exprList, isBinding) {
    var end = exprList.length;
    for (var i = 0; i < end; i++) {
      var elt = exprList[i];
      if (elt) { this.toAssignable(elt, isBinding); }
    }
    if (end) {
      var last = exprList[end - 1];
      if (this.options.ecmaVersion === 6 && isBinding && last && last.type === "RestElement" && last.argument.type !== "Identifier")
        { this.unexpected(last.argument.start); }
    }
    return exprList
  };

  // Parses spread element.

  pp$7.parseSpread = function(refDestructuringErrors) {
    var node = this.startNode();
    this.next();
    node.argument = this.parseMaybeAssign(false, refDestructuringErrors);
    return this.finishNode(node, "SpreadElement")
  };

  pp$7.parseRestBinding = function() {
    var node = this.startNode();
    this.next();

    // RestElement inside of a function parameter must be an identifier
    if (this.options.ecmaVersion === 6 && this.type !== types$1.name)
      { this.unexpected(); }

    node.argument = this.parseBindingAtom();

    return this.finishNode(node, "RestElement")
  };

  // Parses lvalue (assignable) atom.

  pp$7.parseBindingAtom = function() {
    if (this.options.ecmaVersion >= 6) {
      switch (this.type) {
      case types$1.bracketL:
        var node = this.startNode();
        this.next();
        node.elements = this.parseBindingList(types$1.bracketR, true, true);
        return this.finishNode(node, "ArrayPattern")

      case types$1.braceL:
        return this.parseObj(true)
      }
    }
    return this.parseIdent()
  };

  pp$7.parseBindingList = function(close, allowEmpty, allowTrailingComma) {
    var elts = [], first = true;
    while (!this.eat(close)) {
      if (first) { first = false; }
      else { this.expect(types$1.comma); }
      if (allowEmpty && this.type === types$1.comma) {
        elts.push(null);
      } else if (allowTrailingComma && this.afterTrailingComma(close)) {
        break
      } else if (this.type === types$1.ellipsis) {
        var rest = this.parseRestBinding();
        this.parseBindingListItem(rest);
        elts.push(rest);
        if (this.type === types$1.comma) { this.raise(this.start, "Comma is not permitted after the rest element"); }
        this.expect(close);
        break
      } else {
        var elem = this.parseMaybeDefault(this.start, this.startLoc);
        this.parseBindingListItem(elem);
        elts.push(elem);
      }
    }
    return elts
  };

  pp$7.parseBindingListItem = function(param) {
    return param
  };

  // Parses assignment pattern around given atom if possible.

  pp$7.parseMaybeDefault = function(startPos, startLoc, left) {
    left = left || this.parseBindingAtom();
    if (this.options.ecmaVersion < 6 || !this.eat(types$1.eq)) { return left }
    var node = this.startNodeAt(startPos, startLoc);
    node.left = left;
    node.right = this.parseMaybeAssign();
    return this.finishNode(node, "AssignmentPattern")
  };

  // The following three functions all verify that a node is an lvalue —
  // something that can be bound, or assigned to. In order to do so, they perform
  // a variety of checks:
  //
  // - Check that none of the bound/assigned-to identifiers are reserved words.
  // - Record name declarations for bindings in the appropriate scope.
  // - Check duplicate argument names, if checkClashes is set.
  //
  // If a complex binding pattern is encountered (e.g., object and array
  // destructuring), the entire pattern is recursively checked.
  //
  // There are three versions of checkLVal*() appropriate for different
  // circumstances:
  //
  // - checkLValSimple() shall be used if the syntactic construct supports
  //   nothing other than identifiers and member expressions. Parenthesized
  //   expressions are also correctly handled. This is generally appropriate for
  //   constructs for which the spec says
  //
  //   > It is a Syntax Error if AssignmentTargetType of [the production] is not
  //   > simple.
  //
  //   It is also appropriate for checking if an identifier is valid and not
  //   defined elsewhere, like import declarations or function/class identifiers.
  //
  //   Examples where this is used include:
  //     a += …;
  //     import a from '…';
  //   where a is the node to be checked.
  //
  // - checkLValPattern() shall be used if the syntactic construct supports
  //   anything checkLValSimple() supports, as well as object and array
  //   destructuring patterns. This is generally appropriate for constructs for
  //   which the spec says
  //
  //   > It is a Syntax Error if [the production] is neither an ObjectLiteral nor
  //   > an ArrayLiteral and AssignmentTargetType of [the production] is not
  //   > simple.
  //
  //   Examples where this is used include:
  //     (a = …);
  //     const a = …;
  //     try { … } catch (a) { … }
  //   where a is the node to be checked.
  //
  // - checkLValInnerPattern() shall be used if the syntactic construct supports
  //   anything checkLValPattern() supports, as well as default assignment
  //   patterns, rest elements, and other constructs that may appear within an
  //   object or array destructuring pattern.
  //
  //   As a special case, function parameters also use checkLValInnerPattern(),
  //   as they also support defaults and rest constructs.
  //
  // These functions deliberately support both assignment and binding constructs,
  // as the logic for both is exceedingly similar. If the node is the target of
  // an assignment, then bindingType should be set to BIND_NONE. Otherwise, it
  // should be set to the appropriate BIND_* constant, like BIND_VAR or
  // BIND_LEXICAL.
  //
  // If the function is called with a non-BIND_NONE bindingType, then
  // additionally a checkClashes object may be specified to allow checking for
  // duplicate argument names. checkClashes is ignored if the provided construct
  // is an assignment (i.e., bindingType is BIND_NONE).

  pp$7.checkLValSimple = function(expr, bindingType, checkClashes) {
    if ( bindingType === void 0 ) bindingType = BIND_NONE;

    var isBind = bindingType !== BIND_NONE;

    switch (expr.type) {
    case "Identifier":
      if (this.strict && this.reservedWordsStrictBind.test(expr.name))
        { this.raiseRecoverable(expr.start, (isBind ? "Binding " : "Assigning to ") + expr.name + " in strict mode"); }
      if (isBind) {
        if (bindingType === BIND_LEXICAL && expr.name === "let")
          { this.raiseRecoverable(expr.start, "let is disallowed as a lexically bound name"); }
        if (checkClashes) {
          if (hasOwn(checkClashes, expr.name))
            { this.raiseRecoverable(expr.start, "Argument name clash"); }
          checkClashes[expr.name] = true;
        }
        if (bindingType !== BIND_OUTSIDE) { this.declareName(expr.name, bindingType, expr.start); }
      }
      break

    case "ChainExpression":
      this.raiseRecoverable(expr.start, "Optional chaining cannot appear in left-hand side");
      break

    case "MemberExpression":
      if (isBind) { this.raiseRecoverable(expr.start, "Binding member expression"); }
      break

    case "ParenthesizedExpression":
      if (isBind) { this.raiseRecoverable(expr.start, "Binding parenthesized expression"); }
      return this.checkLValSimple(expr.expression, bindingType, checkClashes)

    default:
      this.raise(expr.start, (isBind ? "Binding" : "Assigning to") + " rvalue");
    }
  };

  pp$7.checkLValPattern = function(expr, bindingType, checkClashes) {
    if ( bindingType === void 0 ) bindingType = BIND_NONE;

    switch (expr.type) {
    case "ObjectPattern":
      for (var i = 0, list = expr.properties; i < list.length; i += 1) {
        var prop = list[i];

      this.checkLValInnerPattern(prop, bindingType, checkClashes);
      }
      break

    case "ArrayPattern":
      for (var i$1 = 0, list$1 = expr.elements; i$1 < list$1.length; i$1 += 1) {
        var elem = list$1[i$1];

      if (elem) { this.checkLValInnerPattern(elem, bindingType, checkClashes); }
      }
      break

    default:
      this.checkLValSimple(expr, bindingType, checkClashes);
    }
  };

  pp$7.checkLValInnerPattern = function(expr, bindingType, checkClashes) {
    if ( bindingType === void 0 ) bindingType = BIND_NONE;

    switch (expr.type) {
    case "Property":
      // AssignmentProperty has type === "Property"
      this.checkLValInnerPattern(expr.value, bindingType, checkClashes);
      break

    case "AssignmentPattern":
      this.checkLValPattern(expr.left, bindingType, checkClashes);
      break

    case "RestElement":
      this.checkLValPattern(expr.argument, bindingType, checkClashes);
      break

    default:
      this.checkLValPattern(expr, bindingType, checkClashes);
    }
  };

  // The algorithm used to determine whether a regexp can appear at a

  var TokContext = function TokContext(token, isExpr, preserveSpace, override, generator) {
    this.token = token;
    this.isExpr = !!isExpr;
    this.preserveSpace = !!preserveSpace;
    this.override = override;
    this.generator = !!generator;
  };

  var types = {
    b_stat: new TokContext("{", false),
    b_expr: new TokContext("{", true),
    b_tmpl: new TokContext("${", false),
    p_stat: new TokContext("(", false),
    p_expr: new TokContext("(", true),
    q_tmpl: new TokContext("`", true, true, function (p) { return p.tryReadTemplateToken(); }),
    f_stat: new TokContext("function", false),
    f_expr: new TokContext("function", true),
    f_expr_gen: new TokContext("function", true, false, null, true),
    f_gen: new TokContext("function", false, false, null, true)
  };

  var pp$6 = Parser.prototype;

  pp$6.initialContext = function() {
    return [types.b_stat]
  };

  pp$6.curContext = function() {
    return this.context[this.context.length - 1]
  };

  pp$6.braceIsBlock = function(prevType) {
    var parent = this.curContext();
    if (parent === types.f_expr || parent === types.f_stat)
      { return true }
    if (prevType === types$1.colon && (parent === types.b_stat || parent === types.b_expr))
      { return !parent.isExpr }

    // The check for `tt.name && exprAllowed` detects whether we are
    // after a `yield` or `of` construct. See the `updateContext` for
    // `tt.name`.
    if (prevType === types$1._return || prevType === types$1.name && this.exprAllowed)
      { return lineBreak.test(this.input.slice(this.lastTokEnd, this.start)) }
    if (prevType === types$1._else || prevType === types$1.semi || prevType === types$1.eof || prevType === types$1.parenR || prevType === types$1.arrow)
      { return true }
    if (prevType === types$1.braceL)
      { return parent === types.b_stat }
    if (prevType === types$1._var || prevType === types$1._const || prevType === types$1.name)
      { return false }
    return !this.exprAllowed
  };

  pp$6.inGeneratorContext = function() {
    for (var i = this.context.length - 1; i >= 1; i--) {
      var context = this.context[i];
      if (context.token === "function")
        { return context.generator }
    }
    return false
  };

  pp$6.updateContext = function(prevType) {
    var update, type = this.type;
    if (type.keyword && prevType === types$1.dot)
      { this.exprAllowed = false; }
    else if (update = type.updateContext)
      { update.call(this, prevType); }
    else
      { this.exprAllowed = type.beforeExpr; }
  };

  // Used to handle egde case when token context could not be inferred correctly in tokenize phase
  pp$6.overrideContext = function(tokenCtx) {
    if (this.curContext() !== tokenCtx) {
      this.context[this.context.length - 1] = tokenCtx;
    }
  };

  // Token-specific context update code

  types$1.parenR.updateContext = types$1.braceR.updateContext = function() {
    if (this.context.length === 1) {
      this.exprAllowed = true;
      return
    }
    var out = this.context.pop();
    if (out === types.b_stat && this.curContext().token === "function") {
      out = this.context.pop();
    }
    this.exprAllowed = !out.isExpr;
  };

  types$1.braceL.updateContext = function(prevType) {
    this.context.push(this.braceIsBlock(prevType) ? types.b_stat : types.b_expr);
    this.exprAllowed = true;
  };

  types$1.dollarBraceL.updateContext = function() {
    this.context.push(types.b_tmpl);
    this.exprAllowed = true;
  };

  types$1.parenL.updateContext = function(prevType) {
    var statementParens = prevType === types$1._if || prevType === types$1._for || prevType === types$1._with || prevType === types$1._while;
    this.context.push(statementParens ? types.p_stat : types.p_expr);
    this.exprAllowed = true;
  };

  types$1.incDec.updateContext = function() {
    // tokExprAllowed stays unchanged
  };

  types$1._function.updateContext = types$1._class.updateContext = function(prevType) {
    if (prevType.beforeExpr && prevType !== types$1._else &&
        !(prevType === types$1.semi && this.curContext() !== types.p_stat) &&
        !(prevType === types$1._return && lineBreak.test(this.input.slice(this.lastTokEnd, this.start))) &&
        !((prevType === types$1.colon || prevType === types$1.braceL) && this.curContext() === types.b_stat))
      { this.context.push(types.f_expr); }
    else
      { this.context.push(types.f_stat); }
    this.exprAllowed = false;
  };

  types$1.backQuote.updateContext = function() {
    if (this.curContext() === types.q_tmpl)
      { this.context.pop(); }
    else
      { this.context.push(types.q_tmpl); }
    this.exprAllowed = false;
  };

  types$1.star.updateContext = function(prevType) {
    if (prevType === types$1._function) {
      var index = this.context.length - 1;
      if (this.context[index] === types.f_expr)
        { this.context[index] = types.f_expr_gen; }
      else
        { this.context[index] = types.f_gen; }
    }
    this.exprAllowed = true;
  };

  types$1.name.updateContext = function(prevType) {
    var allowed = false;
    if (this.options.ecmaVersion >= 6 && prevType !== types$1.dot) {
      if (this.value === "of" && !this.exprAllowed ||
          this.value === "yield" && this.inGeneratorContext())
        { allowed = true; }
    }
    this.exprAllowed = allowed;
  };

  // A recursive descent parser operates by defining functions for all

  var pp$5 = Parser.prototype;

  // Check if property name clashes with already added.
  // Object/class getters and setters are not allowed to clash —
  // either with each other or with an init property — and in
  // strict mode, init properties are also not allowed to be repeated.

  pp$5.checkPropClash = function(prop, propHash, refDestructuringErrors) {
    if (this.options.ecmaVersion >= 9 && prop.type === "SpreadElement")
      { return }
    if (this.options.ecmaVersion >= 6 && (prop.computed || prop.method || prop.shorthand))
      { return }
    var key = prop.key;
    var name;
    switch (key.type) {
    case "Identifier": name = key.name; break
    case "Literal": name = String(key.value); break
    default: return
    }
    var kind = prop.kind;
    if (this.options.ecmaVersion >= 6) {
      if (name === "__proto__" && kind === "init") {
        if (propHash.proto) {
          if (refDestructuringErrors) {
            if (refDestructuringErrors.doubleProto < 0) {
              refDestructuringErrors.doubleProto = key.start;
            }
          } else {
            this.raiseRecoverable(key.start, "Redefinition of __proto__ property");
          }
        }
        propHash.proto = true;
      }
      return
    }
    name = "$" + name;
    var other = propHash[name];
    if (other) {
      var redefinition;
      if (kind === "init") {
        redefinition = this.strict && other.init || other.get || other.set;
      } else {
        redefinition = other.init || other[kind];
      }
      if (redefinition)
        { this.raiseRecoverable(key.start, "Redefinition of property"); }
    } else {
      other = propHash[name] = {
        init: false,
        get: false,
        set: false
      };
    }
    other[kind] = true;
  };

  // ### Expression parsing

  // These nest, from the most general expression type at the top to
  // 'atomic', nondivisible expression types at the bottom. Most of
  // the functions will simply let the function(s) below them parse,
  // and, *if* the syntactic construct they handle is present, wrap
  // the AST node that the inner parser gave them in another node.

  // Parse a full expression. The optional arguments are used to
  // forbid the `in` operator (in for loops initalization expressions)
  // and provide reference for storing '=' operator inside shorthand
  // property assignment in contexts where both object expression
  // and object pattern might appear (so it's possible to raise
  // delayed syntax error at correct position).

  pp$5.parseExpression = function(forInit, refDestructuringErrors) {
    var startPos = this.start, startLoc = this.startLoc;
    var expr = this.parseMaybeAssign(forInit, refDestructuringErrors);
    if (this.type === types$1.comma) {
      var node = this.startNodeAt(startPos, startLoc);
      node.expressions = [expr];
      while (this.eat(types$1.comma)) { node.expressions.push(this.parseMaybeAssign(forInit, refDestructuringErrors)); }
      return this.finishNode(node, "SequenceExpression")
    }
    return expr
  };

  // Parse an assignment expression. This includes applications of
  // operators like `+=`.

  pp$5.parseMaybeAssign = function(forInit, refDestructuringErrors, afterLeftParse) {
    if (this.isContextual("yield")) {
      if (this.inGenerator) { return this.parseYield(forInit) }
      // The tokenizer will assume an expression is allowed after
      // `yield`, but this isn't that kind of yield
      else { this.exprAllowed = false; }
    }

    var ownDestructuringErrors = false, oldParenAssign = -1, oldTrailingComma = -1, oldDoubleProto = -1;
    if (refDestructuringErrors) {
      oldParenAssign = refDestructuringErrors.parenthesizedAssign;
      oldTrailingComma = refDestructuringErrors.trailingComma;
      oldDoubleProto = refDestructuringErrors.doubleProto;
      refDestructuringErrors.parenthesizedAssign = refDestructuringErrors.trailingComma = -1;
    } else {
      refDestructuringErrors = new DestructuringErrors;
      ownDestructuringErrors = true;
    }

    var startPos = this.start, startLoc = this.startLoc;
    if (this.type === types$1.parenL || this.type === types$1.name) {
      this.potentialArrowAt = this.start;
      this.potentialArrowInForAwait = forInit === "await";
    }
    var left = this.parseMaybeConditional(forInit, refDestructuringErrors);
    if (afterLeftParse) { left = afterLeftParse.call(this, left, startPos, startLoc); }
    if (this.type.isAssign) {
      var node = this.startNodeAt(startPos, startLoc);
      node.operator = this.value;
      if (this.type === types$1.eq)
        { left = this.toAssignable(left, false, refDestructuringErrors); }
      if (!ownDestructuringErrors) {
        refDestructuringErrors.parenthesizedAssign = refDestructuringErrors.trailingComma = refDestructuringErrors.doubleProto = -1;
      }
      if (refDestructuringErrors.shorthandAssign >= left.start)
        { refDestructuringErrors.shorthandAssign = -1; } // reset because shorthand default was used correctly
      if (this.type === types$1.eq)
        { this.checkLValPattern(left); }
      else
        { this.checkLValSimple(left); }
      node.left = left;
      this.next();
      node.right = this.parseMaybeAssign(forInit);
      if (oldDoubleProto > -1) { refDestructuringErrors.doubleProto = oldDoubleProto; }
      return this.finishNode(node, "AssignmentExpression")
    } else {
      if (ownDestructuringErrors) { this.checkExpressionErrors(refDestructuringErrors, true); }
    }
    if (oldParenAssign > -1) { refDestructuringErrors.parenthesizedAssign = oldParenAssign; }
    if (oldTrailingComma > -1) { refDestructuringErrors.trailingComma = oldTrailingComma; }
    return left
  };

  // Parse a ternary conditional (`?:`) operator.

  pp$5.parseMaybeConditional = function(forInit, refDestructuringErrors) {
    var startPos = this.start, startLoc = this.startLoc;
    var expr = this.parseExprOps(forInit, refDestructuringErrors);
    if (this.checkExpressionErrors(refDestructuringErrors)) { return expr }
    if (this.eat(types$1.question)) {
      var node = this.startNodeAt(startPos, startLoc);
      node.test = expr;
      node.consequent = this.parseMaybeAssign();
      this.expect(types$1.colon);
      node.alternate = this.parseMaybeAssign(forInit);
      return this.finishNode(node, "ConditionalExpression")
    }
    return expr
  };

  // Start the precedence parser.

  pp$5.parseExprOps = function(forInit, refDestructuringErrors) {
    var startPos = this.start, startLoc = this.startLoc;
    var expr = this.parseMaybeUnary(refDestructuringErrors, false, false, forInit);
    if (this.checkExpressionErrors(refDestructuringErrors)) { return expr }
    return expr.start === startPos && expr.type === "ArrowFunctionExpression" ? expr : this.parseExprOp(expr, startPos, startLoc, -1, forInit)
  };

  // Parse binary operators with the operator precedence parsing
  // algorithm. `left` is the left-hand side of the operator.
  // `minPrec` provides context that allows the function to stop and
  // defer further parser to one of its callers when it encounters an
  // operator that has a lower precedence than the set it is parsing.

  pp$5.parseExprOp = function(left, leftStartPos, leftStartLoc, minPrec, forInit) {
    var prec = this.type.binop;
    if (prec != null && (!forInit || this.type !== types$1._in)) {
      if (prec > minPrec) {
        var logical = this.type === types$1.logicalOR || this.type === types$1.logicalAND;
        var coalesce = this.type === types$1.coalesce;
        if (coalesce) {
          // Handle the precedence of `tt.coalesce` as equal to the range of logical expressions.
          // In other words, `node.right` shouldn't contain logical expressions in order to check the mixed error.
          prec = types$1.logicalAND.binop;
        }
        var op = this.value;
        this.next();
        var startPos = this.start, startLoc = this.startLoc;
        var right = this.parseExprOp(this.parseMaybeUnary(null, false, false, forInit), startPos, startLoc, prec, forInit);
        var node = this.buildBinary(leftStartPos, leftStartLoc, left, right, op, logical || coalesce);
        if ((logical && this.type === types$1.coalesce) || (coalesce && (this.type === types$1.logicalOR || this.type === types$1.logicalAND))) {
          this.raiseRecoverable(this.start, "Logical expressions and coalesce expressions cannot be mixed. Wrap either by parentheses");
        }
        return this.parseExprOp(node, leftStartPos, leftStartLoc, minPrec, forInit)
      }
    }
    return left
  };

  pp$5.buildBinary = function(startPos, startLoc, left, right, op, logical) {
    if (right.type === "PrivateIdentifier") { this.raise(right.start, "Private identifier can only be left side of binary expression"); }
    var node = this.startNodeAt(startPos, startLoc);
    node.left = left;
    node.operator = op;
    node.right = right;
    return this.finishNode(node, logical ? "LogicalExpression" : "BinaryExpression")
  };

  // Parse unary operators, both prefix and postfix.

  pp$5.parseMaybeUnary = function(refDestructuringErrors, sawUnary, incDec, forInit) {
    var startPos = this.start, startLoc = this.startLoc, expr;
    if (this.isContextual("await") && this.canAwait) {
      expr = this.parseAwait(forInit);
      sawUnary = true;
    } else if (this.type.prefix) {
      var node = this.startNode(), update = this.type === types$1.incDec;
      node.operator = this.value;
      node.prefix = true;
      this.next();
      node.argument = this.parseMaybeUnary(null, true, update, forInit);
      this.checkExpressionErrors(refDestructuringErrors, true);
      if (update) { this.checkLValSimple(node.argument); }
      else if (this.strict && node.operator === "delete" &&
               node.argument.type === "Identifier")
        { this.raiseRecoverable(node.start, "Deleting local variable in strict mode"); }
      else if (node.operator === "delete" && isPrivateFieldAccess(node.argument))
        { this.raiseRecoverable(node.start, "Private fields can not be deleted"); }
      else { sawUnary = true; }
      expr = this.finishNode(node, update ? "UpdateExpression" : "UnaryExpression");
    } else if (!sawUnary && this.type === types$1.privateId) {
      if (forInit || this.privateNameStack.length === 0) { this.unexpected(); }
      expr = this.parsePrivateIdent();
      // only could be private fields in 'in', such as #x in obj
      if (this.type !== types$1._in) { this.unexpected(); }
    } else {
      expr = this.parseExprSubscripts(refDestructuringErrors, forInit);
      if (this.checkExpressionErrors(refDestructuringErrors)) { return expr }
      while (this.type.postfix && !this.canInsertSemicolon()) {
        var node$1 = this.startNodeAt(startPos, startLoc);
        node$1.operator = this.value;
        node$1.prefix = false;
        node$1.argument = expr;
        this.checkLValSimple(expr);
        this.next();
        expr = this.finishNode(node$1, "UpdateExpression");
      }
    }

    if (!incDec && this.eat(types$1.starstar)) {
      if (sawUnary)
        { this.unexpected(this.lastTokStart); }
      else
        { return this.buildBinary(startPos, startLoc, expr, this.parseMaybeUnary(null, false, false, forInit), "**", false) }
    } else {
      return expr
    }
  };

  function isPrivateFieldAccess(node) {
    return (
      node.type === "MemberExpression" && node.property.type === "PrivateIdentifier" ||
      node.type === "ChainExpression" && isPrivateFieldAccess(node.expression)
    )
  }

  // Parse call, dot, and `[]`-subscript expressions.

  pp$5.parseExprSubscripts = function(refDestructuringErrors, forInit) {
    var startPos = this.start, startLoc = this.startLoc;
    var expr = this.parseExprAtom(refDestructuringErrors, forInit);
    if (expr.type === "ArrowFunctionExpression" && this.input.slice(this.lastTokStart, this.lastTokEnd) !== ")")
      { return expr }
    var result = this.parseSubscripts(expr, startPos, startLoc, false, forInit);
    if (refDestructuringErrors && result.type === "MemberExpression") {
      if (refDestructuringErrors.parenthesizedAssign >= result.start) { refDestructuringErrors.parenthesizedAssign = -1; }
      if (refDestructuringErrors.parenthesizedBind >= result.start) { refDestructuringErrors.parenthesizedBind = -1; }
      if (refDestructuringErrors.trailingComma >= result.start) { refDestructuringErrors.trailingComma = -1; }
    }
    return result
  };

  pp$5.parseSubscripts = function(base, startPos, startLoc, noCalls, forInit) {
    var maybeAsyncArrow = this.options.ecmaVersion >= 8 && base.type === "Identifier" && base.name === "async" &&
        this.lastTokEnd === base.end && !this.canInsertSemicolon() && base.end - base.start === 5 &&
        this.potentialArrowAt === base.start;
    var optionalChained = false;

    while (true) {
      var element = this.parseSubscript(base, startPos, startLoc, noCalls, maybeAsyncArrow, optionalChained, forInit);

      if (element.optional) { optionalChained = true; }
      if (element === base || element.type === "ArrowFunctionExpression") {
        if (optionalChained) {
          var chainNode = this.startNodeAt(startPos, startLoc);
          chainNode.expression = element;
          element = this.finishNode(chainNode, "ChainExpression");
        }
        return element
      }

      base = element;
    }
  };

  pp$5.parseSubscript = function(base, startPos, startLoc, noCalls, maybeAsyncArrow, optionalChained, forInit) {
    var optionalSupported = this.options.ecmaVersion >= 11;
    var optional = optionalSupported && this.eat(types$1.questionDot);
    if (noCalls && optional) { this.raise(this.lastTokStart, "Optional chaining cannot appear in the callee of new expressions"); }

    var computed = this.eat(types$1.bracketL);
    if (computed || (optional && this.type !== types$1.parenL && this.type !== types$1.backQuote) || this.eat(types$1.dot)) {
      var node = this.startNodeAt(startPos, startLoc);
      node.object = base;
      if (computed) {
        node.property = this.parseExpression();
        this.expect(types$1.bracketR);
      } else if (this.type === types$1.privateId && base.type !== "Super") {
        node.property = this.parsePrivateIdent();
      } else {
        node.property = this.parseIdent(this.options.allowReserved !== "never");
      }
      node.computed = !!computed;
      if (optionalSupported) {
        node.optional = optional;
      }
      base = this.finishNode(node, "MemberExpression");
    } else if (!noCalls && this.eat(types$1.parenL)) {
      var refDestructuringErrors = new DestructuringErrors, oldYieldPos = this.yieldPos, oldAwaitPos = this.awaitPos, oldAwaitIdentPos = this.awaitIdentPos;
      this.yieldPos = 0;
      this.awaitPos = 0;
      this.awaitIdentPos = 0;
      var exprList = this.parseExprList(types$1.parenR, this.options.ecmaVersion >= 8, false, refDestructuringErrors);
      if (maybeAsyncArrow && !optional && !this.canInsertSemicolon() && this.eat(types$1.arrow)) {
        this.checkPatternErrors(refDestructuringErrors, false);
        this.checkYieldAwaitInDefaultParams();
        if (this.awaitIdentPos > 0)
          { this.raise(this.awaitIdentPos, "Cannot use 'await' as identifier inside an async function"); }
        this.yieldPos = oldYieldPos;
        this.awaitPos = oldAwaitPos;
        this.awaitIdentPos = oldAwaitIdentPos;
        return this.parseArrowExpression(this.startNodeAt(startPos, startLoc), exprList, true, forInit)
      }
      this.checkExpressionErrors(refDestructuringErrors, true);
      this.yieldPos = oldYieldPos || this.yieldPos;
      this.awaitPos = oldAwaitPos || this.awaitPos;
      this.awaitIdentPos = oldAwaitIdentPos || this.awaitIdentPos;
      var node$1 = this.startNodeAt(startPos, startLoc);
      node$1.callee = base;
      node$1.arguments = exprList;
      if (optionalSupported) {
        node$1.optional = optional;
      }
      base = this.finishNode(node$1, "CallExpression");
    } else if (this.type === types$1.backQuote) {
      if (optional || optionalChained) {
        this.raise(this.start, "Optional chaining cannot appear in the tag of tagged template expressions");
      }
      var node$2 = this.startNodeAt(startPos, startLoc);
      node$2.tag = base;
      node$2.quasi = this.parseTemplate({isTagged: true});
      base = this.finishNode(node$2, "TaggedTemplateExpression");
    }
    return base
  };

  // Parse an atomic expression — either a single token that is an
  // expression, an expression started by a keyword like `function` or
  // `new`, or an expression wrapped in punctuation like `()`, `[]`,
  // or `{}`.

  pp$5.parseExprAtom = function(refDestructuringErrors, forInit) {
    // If a division operator appears in an expression position, the
    // tokenizer got confused, and we force it to read a regexp instead.
    if (this.type === types$1.slash) { this.readRegexp(); }

    var node, canBeArrow = this.potentialArrowAt === this.start;
    switch (this.type) {
    case types$1._super:
      if (!this.allowSuper)
        { this.raise(this.start, "'super' keyword outside a method"); }
      node = this.startNode();
      this.next();
      if (this.type === types$1.parenL && !this.allowDirectSuper)
        { this.raise(node.start, "super() call outside constructor of a subclass"); }
      // The `super` keyword can appear at below:
      // SuperProperty:
      //     super [ Expression ]
      //     super . IdentifierName
      // SuperCall:
      //     super ( Arguments )
      if (this.type !== types$1.dot && this.type !== types$1.bracketL && this.type !== types$1.parenL)
        { this.unexpected(); }
      return this.finishNode(node, "Super")

    case types$1._this:
      node = this.startNode();
      this.next();
      return this.finishNode(node, "ThisExpression")

    case types$1.name:
      var startPos = this.start, startLoc = this.startLoc, containsEsc = this.containsEsc;
      var id = this.parseIdent(false);
      if (this.options.ecmaVersion >= 8 && !containsEsc && id.name === "async" && !this.canInsertSemicolon() && this.eat(types$1._function)) {
        this.overrideContext(types.f_expr);
        return this.parseFunction(this.startNodeAt(startPos, startLoc), 0, false, true, forInit)
      }
      if (canBeArrow && !this.canInsertSemicolon()) {
        if (this.eat(types$1.arrow))
          { return this.parseArrowExpression(this.startNodeAt(startPos, startLoc), [id], false, forInit) }
        if (this.options.ecmaVersion >= 8 && id.name === "async" && this.type === types$1.name && !containsEsc &&
            (!this.potentialArrowInForAwait || this.value !== "of" || this.containsEsc)) {
          id = this.parseIdent(false);
          if (this.canInsertSemicolon() || !this.eat(types$1.arrow))
            { this.unexpected(); }
          return this.parseArrowExpression(this.startNodeAt(startPos, startLoc), [id], true, forInit)
        }
      }
      return id

    case types$1.regexp:
      var value = this.value;
      node = this.parseLiteral(value.value);
      node.regex = {pattern: value.pattern, flags: value.flags};
      return node

    case types$1.num: case types$1.string:
      return this.parseLiteral(this.value)

    case types$1._null: case types$1._true: case types$1._false:
      node = this.startNode();
      node.value = this.type === types$1._null ? null : this.type === types$1._true;
      node.raw = this.type.keyword;
      this.next();
      return this.finishNode(node, "Literal")

    case types$1.parenL:
      var start = this.start, expr = this.parseParenAndDistinguishExpression(canBeArrow, forInit);
      if (refDestructuringErrors) {
        if (refDestructuringErrors.parenthesizedAssign < 0 && !this.isSimpleAssignTarget(expr))
          { refDestructuringErrors.parenthesizedAssign = start; }
        if (refDestructuringErrors.parenthesizedBind < 0)
          { refDestructuringErrors.parenthesizedBind = start; }
      }
      return expr

    case types$1.bracketL:
      node = this.startNode();
      this.next();
      node.elements = this.parseExprList(types$1.bracketR, true, true, refDestructuringErrors);
      return this.finishNode(node, "ArrayExpression")

    case types$1.braceL:
      this.overrideContext(types.b_expr);
      return this.parseObj(false, refDestructuringErrors)

    case types$1._function:
      node = this.startNode();
      this.next();
      return this.parseFunction(node, 0)

    case types$1._class:
      return this.parseClass(this.startNode(), false)

    case types$1._new:
      return this.parseNew()

    case types$1.backQuote:
      return this.parseTemplate()

    case types$1._import:
      if (this.options.ecmaVersion >= 11) {
        return this.parseExprImport()
      } else {
        return this.unexpected()
      }

    default:
      this.unexpected();
    }
  };

  pp$5.parseExprImport = function() {
    var node = this.startNode();

    // Consume `import` as an identifier for `import.meta`.
    // Because `this.parseIdent(true)` doesn't check escape sequences, it needs the check of `this.containsEsc`.
    if (this.containsEsc) { this.raiseRecoverable(this.start, "Escape sequence in keyword import"); }
    var meta = this.parseIdent(true);

    switch (this.type) {
    case types$1.parenL:
      return this.parseDynamicImport(node)
    case types$1.dot:
      node.meta = meta;
      return this.parseImportMeta(node)
    default:
      this.unexpected();
    }
  };

  pp$5.parseDynamicImport = function(node) {
    this.next(); // skip `(`

    // Parse node.source.
    node.source = this.parseMaybeAssign();

    // Verify ending.
    if (!this.eat(types$1.parenR)) {
      var errorPos = this.start;
      if (this.eat(types$1.comma) && this.eat(types$1.parenR)) {
        this.raiseRecoverable(errorPos, "Trailing comma is not allowed in import()");
      } else {
        this.unexpected(errorPos);
      }
    }

    return this.finishNode(node, "ImportExpression")
  };

  pp$5.parseImportMeta = function(node) {
    this.next(); // skip `.`

    var containsEsc = this.containsEsc;
    node.property = this.parseIdent(true);

    if (node.property.name !== "meta")
      { this.raiseRecoverable(node.property.start, "The only valid meta property for import is 'import.meta'"); }
    if (containsEsc)
      { this.raiseRecoverable(node.start, "'import.meta' must not contain escaped characters"); }
    if (this.options.sourceType !== "module" && !this.options.allowImportExportEverywhere)
      { this.raiseRecoverable(node.start, "Cannot use 'import.meta' outside a module"); }

    return this.finishNode(node, "MetaProperty")
  };

  pp$5.parseLiteral = function(value) {
    var node = this.startNode();
    node.value = value;
    node.raw = this.input.slice(this.start, this.end);
    if (node.raw.charCodeAt(node.raw.length - 1) === 110) { node.bigint = node.raw.slice(0, -1).replace(/_/g, ""); }
    this.next();
    return this.finishNode(node, "Literal")
  };

  pp$5.parseParenExpression = function() {
    this.expect(types$1.parenL);
    var val = this.parseExpression();
    this.expect(types$1.parenR);
    return val
  };

  pp$5.parseParenAndDistinguishExpression = function(canBeArrow, forInit) {
    var startPos = this.start, startLoc = this.startLoc, val, allowTrailingComma = this.options.ecmaVersion >= 8;
    if (this.options.ecmaVersion >= 6) {
      this.next();

      var innerStartPos = this.start, innerStartLoc = this.startLoc;
      var exprList = [], first = true, lastIsComma = false;
      var refDestructuringErrors = new DestructuringErrors, oldYieldPos = this.yieldPos, oldAwaitPos = this.awaitPos, spreadStart;
      this.yieldPos = 0;
      this.awaitPos = 0;
      // Do not save awaitIdentPos to allow checking awaits nested in parameters
      while (this.type !== types$1.parenR) {
        first ? first = false : this.expect(types$1.comma);
        if (allowTrailingComma && this.afterTrailingComma(types$1.parenR, true)) {
          lastIsComma = true;
          break
        } else if (this.type === types$1.ellipsis) {
          spreadStart = this.start;
          exprList.push(this.parseParenItem(this.parseRestBinding()));
          if (this.type === types$1.comma) { this.raise(this.start, "Comma is not permitted after the rest element"); }
          break
        } else {
          exprList.push(this.parseMaybeAssign(false, refDestructuringErrors, this.parseParenItem));
        }
      }
      var innerEndPos = this.lastTokEnd, innerEndLoc = this.lastTokEndLoc;
      this.expect(types$1.parenR);

      if (canBeArrow && !this.canInsertSemicolon() && this.eat(types$1.arrow)) {
        this.checkPatternErrors(refDestructuringErrors, false);
        this.checkYieldAwaitInDefaultParams();
        this.yieldPos = oldYieldPos;
        this.awaitPos = oldAwaitPos;
        return this.parseParenArrowList(startPos, startLoc, exprList, forInit)
      }

      if (!exprList.length || lastIsComma) { this.unexpected(this.lastTokStart); }
      if (spreadStart) { this.unexpected(spreadStart); }
      this.checkExpressionErrors(refDestructuringErrors, true);
      this.yieldPos = oldYieldPos || this.yieldPos;
      this.awaitPos = oldAwaitPos || this.awaitPos;

      if (exprList.length > 1) {
        val = this.startNodeAt(innerStartPos, innerStartLoc);
        val.expressions = exprList;
        this.finishNodeAt(val, "SequenceExpression", innerEndPos, innerEndLoc);
      } else {
        val = exprList[0];
      }
    } else {
      val = this.parseParenExpression();
    }

    if (this.options.preserveParens) {
      var par = this.startNodeAt(startPos, startLoc);
      par.expression = val;
      return this.finishNode(par, "ParenthesizedExpression")
    } else {
      return val
    }
  };

  pp$5.parseParenItem = function(item) {
    return item
  };

  pp$5.parseParenArrowList = function(startPos, startLoc, exprList, forInit) {
    return this.parseArrowExpression(this.startNodeAt(startPos, startLoc), exprList, false, forInit)
  };

  // New's precedence is slightly tricky. It must allow its argument to
  // be a `[]` or dot subscript expression, but not a call — at least,
  // not without wrapping it in parentheses. Thus, it uses the noCalls
  // argument to parseSubscripts to prevent it from consuming the
  // argument list.

  var empty = [];

  pp$5.parseNew = function() {
    if (this.containsEsc) { this.raiseRecoverable(this.start, "Escape sequence in keyword new"); }
    var node = this.startNode();
    var meta = this.parseIdent(true);
    if (this.options.ecmaVersion >= 6 && this.eat(types$1.dot)) {
      node.meta = meta;
      var containsEsc = this.containsEsc;
      node.property = this.parseIdent(true);
      if (node.property.name !== "target")
        { this.raiseRecoverable(node.property.start, "The only valid meta property for new is 'new.target'"); }
      if (containsEsc)
        { this.raiseRecoverable(node.start, "'new.target' must not contain escaped characters"); }
      if (!this.allowNewDotTarget)
        { this.raiseRecoverable(node.start, "'new.target' can only be used in functions and class static block"); }
      return this.finishNode(node, "MetaProperty")
    }
    var startPos = this.start, startLoc = this.startLoc, isImport = this.type === types$1._import;
    node.callee = this.parseSubscripts(this.parseExprAtom(), startPos, startLoc, true, false);
    if (isImport && node.callee.type === "ImportExpression") {
      this.raise(startPos, "Cannot use new with import()");
    }
    if (this.eat(types$1.parenL)) { node.arguments = this.parseExprList(types$1.parenR, this.options.ecmaVersion >= 8, false); }
    else { node.arguments = empty; }
    return this.finishNode(node, "NewExpression")
  };

  // Parse template expression.

  pp$5.parseTemplateElement = function(ref) {
    var isTagged = ref.isTagged;

    var elem = this.startNode();
    if (this.type === types$1.invalidTemplate) {
      if (!isTagged) {
        this.raiseRecoverable(this.start, "Bad escape sequence in untagged template literal");
      }
      elem.value = {
        raw: this.value,
        cooked: null
      };
    } else {
      elem.value = {
        raw: this.input.slice(this.start, this.end).replace(/\r\n?/g, "\n"),
        cooked: this.value
      };
    }
    this.next();
    elem.tail = this.type === types$1.backQuote;
    return this.finishNode(elem, "TemplateElement")
  };

  pp$5.parseTemplate = function(ref) {
    if ( ref === void 0 ) ref = {};
    var isTagged = ref.isTagged; if ( isTagged === void 0 ) isTagged = false;

    var node = this.startNode();
    this.next();
    node.expressions = [];
    var curElt = this.parseTemplateElement({isTagged: isTagged});
    node.quasis = [curElt];
    while (!curElt.tail) {
      if (this.type === types$1.eof) { this.raise(this.pos, "Unterminated template literal"); }
      this.expect(types$1.dollarBraceL);
      node.expressions.push(this.parseExpression());
      this.expect(types$1.braceR);
      node.quasis.push(curElt = this.parseTemplateElement({isTagged: isTagged}));
    }
    this.next();
    return this.finishNode(node, "TemplateLiteral")
  };

  pp$5.isAsyncProp = function(prop) {
    return !prop.computed && prop.key.type === "Identifier" && prop.key.name === "async" &&
      (this.type === types$1.name || this.type === types$1.num || this.type === types$1.string || this.type === types$1.bracketL || this.type.keyword || (this.options.ecmaVersion >= 9 && this.type === types$1.star)) &&
      !lineBreak.test(this.input.slice(this.lastTokEnd, this.start))
  };

  // Parse an object literal or binding pattern.

  pp$5.parseObj = function(isPattern, refDestructuringErrors) {
    var node = this.startNode(), first = true, propHash = {};
    node.properties = [];
    this.next();
    while (!this.eat(types$1.braceR)) {
      if (!first) {
        this.expect(types$1.comma);
        if (this.options.ecmaVersion >= 5 && this.afterTrailingComma(types$1.braceR)) { break }
      } else { first = false; }

      var prop = this.parseProperty(isPattern, refDestructuringErrors);
      if (!isPattern) { this.checkPropClash(prop, propHash, refDestructuringErrors); }
      node.properties.push(prop);
    }
    return this.finishNode(node, isPattern ? "ObjectPattern" : "ObjectExpression")
  };

  pp$5.parseProperty = function(isPattern, refDestructuringErrors) {
    var prop = this.startNode(), isGenerator, isAsync, startPos, startLoc;
    if (this.options.ecmaVersion >= 9 && this.eat(types$1.ellipsis)) {
      if (isPattern) {
        prop.argument = this.parseIdent(false);
        if (this.type === types$1.comma) {
          this.raise(this.start, "Comma is not permitted after the rest element");
        }
        return this.finishNode(prop, "RestElement")
      }
      // To disallow parenthesized identifier via `this.toAssignable()`.
      if (this.type === types$1.parenL && refDestructuringErrors) {
        if (refDestructuringErrors.parenthesizedAssign < 0) {
          refDestructuringErrors.parenthesizedAssign = this.start;
        }
        if (refDestructuringErrors.parenthesizedBind < 0) {
          refDestructuringErrors.parenthesizedBind = this.start;
        }
      }
      // Parse argument.
      prop.argument = this.parseMaybeAssign(false, refDestructuringErrors);
      // To disallow trailing comma via `this.toAssignable()`.
      if (this.type === types$1.comma && refDestructuringErrors && refDestructuringErrors.trailingComma < 0) {
        refDestructuringErrors.trailingComma = this.start;
      }
      // Finish
      return this.finishNode(prop, "SpreadElement")
    }
    if (this.options.ecmaVersion >= 6) {
      prop.method = false;
      prop.shorthand = false;
      if (isPattern || refDestructuringErrors) {
        startPos = this.start;
        startLoc = this.startLoc;
      }
      if (!isPattern)
        { isGenerator = this.eat(types$1.star); }
    }
    var containsEsc = this.containsEsc;
    this.parsePropertyName(prop);
    if (!isPattern && !containsEsc && this.options.ecmaVersion >= 8 && !isGenerator && this.isAsyncProp(prop)) {
      isAsync = true;
      isGenerator = this.options.ecmaVersion >= 9 && this.eat(types$1.star);
      this.parsePropertyName(prop, refDestructuringErrors);
    } else {
      isAsync = false;
    }
    this.parsePropertyValue(prop, isPattern, isGenerator, isAsync, startPos, startLoc, refDestructuringErrors, containsEsc);
    return this.finishNode(prop, "Property")
  };

  pp$5.parsePropertyValue = function(prop, isPattern, isGenerator, isAsync, startPos, startLoc, refDestructuringErrors, containsEsc) {
    if ((isGenerator || isAsync) && this.type === types$1.colon)
      { this.unexpected(); }

    if (this.eat(types$1.colon)) {
      prop.value = isPattern ? this.parseMaybeDefault(this.start, this.startLoc) : this.parseMaybeAssign(false, refDestructuringErrors);
      prop.kind = "init";
    } else if (this.options.ecmaVersion >= 6 && this.type === types$1.parenL) {
      if (isPattern) { this.unexpected(); }
      prop.kind = "init";
      prop.method = true;
      prop.value = this.parseMethod(isGenerator, isAsync);
    } else if (!isPattern && !containsEsc &&
               this.options.ecmaVersion >= 5 && !prop.computed && prop.key.type === "Identifier" &&
               (prop.key.name === "get" || prop.key.name === "set") &&
               (this.type !== types$1.comma && this.type !== types$1.braceR && this.type !== types$1.eq)) {
      if (isGenerator || isAsync) { this.unexpected(); }
      prop.kind = prop.key.name;
      this.parsePropertyName(prop);
      prop.value = this.parseMethod(false);
      var paramCount = prop.kind === "get" ? 0 : 1;
      if (prop.value.params.length !== paramCount) {
        var start = prop.value.start;
        if (prop.kind === "get")
          { this.raiseRecoverable(start, "getter should have no params"); }
        else
          { this.raiseRecoverable(start, "setter should have exactly one param"); }
      } else {
        if (prop.kind === "set" && prop.value.params[0].type === "RestElement")
          { this.raiseRecoverable(prop.value.params[0].start, "Setter cannot use rest params"); }
      }
    } else if (this.options.ecmaVersion >= 6 && !prop.computed && prop.key.type === "Identifier") {
      if (isGenerator || isAsync) { this.unexpected(); }
      this.checkUnreserved(prop.key);
      if (prop.key.name === "await" && !this.awaitIdentPos)
        { this.awaitIdentPos = startPos; }
      prop.kind = "init";
      if (isPattern) {
        prop.value = this.parseMaybeDefault(startPos, startLoc, this.copyNode(prop.key));
      } else if (this.type === types$1.eq && refDestructuringErrors) {
        if (refDestructuringErrors.shorthandAssign < 0)
          { refDestructuringErrors.shorthandAssign = this.start; }
        prop.value = this.parseMaybeDefault(startPos, startLoc, this.copyNode(prop.key));
      } else {
        prop.value = this.copyNode(prop.key);
      }
      prop.shorthand = true;
    } else { this.unexpected(); }
  };

  pp$5.parsePropertyName = function(prop) {
    if (this.options.ecmaVersion >= 6) {
      if (this.eat(types$1.bracketL)) {
        prop.computed = true;
        prop.key = this.parseMaybeAssign();
        this.expect(types$1.bracketR);
        return prop.key
      } else {
        prop.computed = false;
      }
    }
    return prop.key = this.type === types$1.num || this.type === types$1.string ? this.parseExprAtom() : this.parseIdent(this.options.allowReserved !== "never")
  };

  // Initialize empty function node.

  pp$5.initFunction = function(node) {
    node.id = null;
    if (this.options.ecmaVersion >= 6) { node.generator = node.expression = false; }
    if (this.options.ecmaVersion >= 8) { node.async = false; }
  };

  // Parse object or class method.

  pp$5.parseMethod = function(isGenerator, isAsync, allowDirectSuper) {
    var node = this.startNode(), oldYieldPos = this.yieldPos, oldAwaitPos = this.awaitPos, oldAwaitIdentPos = this.awaitIdentPos;

    this.initFunction(node);
    if (this.options.ecmaVersion >= 6)
      { node.generator = isGenerator; }
    if (this.options.ecmaVersion >= 8)
      { node.async = !!isAsync; }

    this.yieldPos = 0;
    this.awaitPos = 0;
    this.awaitIdentPos = 0;
    this.enterScope(functionFlags(isAsync, node.generator) | SCOPE_SUPER | (allowDirectSuper ? SCOPE_DIRECT_SUPER : 0));

    this.expect(types$1.parenL);
    node.params = this.parseBindingList(types$1.parenR, false, this.options.ecmaVersion >= 8);
    this.checkYieldAwaitInDefaultParams();
    this.parseFunctionBody(node, false, true, false);

    this.yieldPos = oldYieldPos;
    this.awaitPos = oldAwaitPos;
    this.awaitIdentPos = oldAwaitIdentPos;
    return this.finishNode(node, "FunctionExpression")
  };

  // Parse arrow function expression with given parameters.

  pp$5.parseArrowExpression = function(node, params, isAsync, forInit) {
    var oldYieldPos = this.yieldPos, oldAwaitPos = this.awaitPos, oldAwaitIdentPos = this.awaitIdentPos;

    this.enterScope(functionFlags(isAsync, false) | SCOPE_ARROW);
    this.initFunction(node);
    if (this.options.ecmaVersion >= 8) { node.async = !!isAsync; }

    this.yieldPos = 0;
    this.awaitPos = 0;
    this.awaitIdentPos = 0;

    node.params = this.toAssignableList(params, true);
    this.parseFunctionBody(node, true, false, forInit);

    this.yieldPos = oldYieldPos;
    this.awaitPos = oldAwaitPos;
    this.awaitIdentPos = oldAwaitIdentPos;
    return this.finishNode(node, "ArrowFunctionExpression")
  };

  // Parse function body and check parameters.

  pp$5.parseFunctionBody = function(node, isArrowFunction, isMethod, forInit) {
    var isExpression = isArrowFunction && this.type !== types$1.braceL;
    var oldStrict = this.strict, useStrict = false;

    if (isExpression) {
      node.body = this.parseMaybeAssign(forInit);
      node.expression = true;
      this.checkParams(node, false);
    } else {
      var nonSimple = this.options.ecmaVersion >= 7 && !this.isSimpleParamList(node.params);
      if (!oldStrict || nonSimple) {
        useStrict = this.strictDirective(this.end);
        // If this is a strict mode function, verify that argument names
        // are not repeated, and it does not try to bind the words `eval`
        // or `arguments`.
        if (useStrict && nonSimple)
          { this.raiseRecoverable(node.start, "Illegal 'use strict' directive in function with non-simple parameter list"); }
      }
      // Start a new scope with regard to labels and the `inFunction`
      // flag (restore them to their old value afterwards).
      var oldLabels = this.labels;
      this.labels = [];
      if (useStrict) { this.strict = true; }

      // Add the params to varDeclaredNames to ensure that an error is thrown
      // if a let/const declaration in the function clashes with one of the params.
      this.checkParams(node, !oldStrict && !useStrict && !isArrowFunction && !isMethod && this.isSimpleParamList(node.params));
      // Ensure the function name isn't a forbidden identifier in strict mode, e.g. 'eval'
      if (this.strict && node.id) { this.checkLValSimple(node.id, BIND_OUTSIDE); }
      node.body = this.parseBlock(false, undefined, useStrict && !oldStrict);
      node.expression = false;
      this.adaptDirectivePrologue(node.body.body);
      this.labels = oldLabels;
    }
    this.exitScope();
  };

  pp$5.isSimpleParamList = function(params) {
    for (var i = 0, list = params; i < list.length; i += 1)
      {
      var param = list[i];

      if (param.type !== "Identifier") { return false
    } }
    return true
  };

  // Checks function params for various disallowed patterns such as using "eval"
  // or "arguments" and duplicate parameters.

  pp$5.checkParams = function(node, allowDuplicates) {
    var nameHash = Object.create(null);
    for (var i = 0, list = node.params; i < list.length; i += 1)
      {
      var param = list[i];

      this.checkLValInnerPattern(param, BIND_VAR, allowDuplicates ? null : nameHash);
    }
  };

  // Parses a comma-separated list of expressions, and returns them as
  // an array. `close` is the token type that ends the list, and
  // `allowEmpty` can be turned on to allow subsequent commas with
  // nothing in between them to be parsed as `null` (which is needed
  // for array literals).

  pp$5.parseExprList = function(close, allowTrailingComma, allowEmpty, refDestructuringErrors) {
    var elts = [], first = true;
    while (!this.eat(close)) {
      if (!first) {
        this.expect(types$1.comma);
        if (allowTrailingComma && this.afterTrailingComma(close)) { break }
      } else { first = false; }

      var elt = (void 0);
      if (allowEmpty && this.type === types$1.comma)
        { elt = null; }
      else if (this.type === types$1.ellipsis) {
        elt = this.parseSpread(refDestructuringErrors);
        if (refDestructuringErrors && this.type === types$1.comma && refDestructuringErrors.trailingComma < 0)
          { refDestructuringErrors.trailingComma = this.start; }
      } else {
        elt = this.parseMaybeAssign(false, refDestructuringErrors);
      }
      elts.push(elt);
    }
    return elts
  };

  pp$5.checkUnreserved = function(ref) {
    var start = ref.start;
    var end = ref.end;
    var name = ref.name;

    if (this.inGenerator && name === "yield")
      { this.raiseRecoverable(start, "Cannot use 'yield' as identifier inside a generator"); }
    if (this.inAsync && name === "await")
      { this.raiseRecoverable(start, "Cannot use 'await' as identifier inside an async function"); }
    if (this.currentThisScope().inClassFieldInit && name === "arguments")
      { this.raiseRecoverable(start, "Cannot use 'arguments' in class field initializer"); }
    if (this.inClassStaticBlock && (name === "arguments" || name === "await"))
      { this.raise(start, ("Cannot use " + name + " in class static initialization block")); }
    if (this.keywords.test(name))
      { this.raise(start, ("Unexpected keyword '" + name + "'")); }
    if (this.options.ecmaVersion < 6 &&
      this.input.slice(start, end).indexOf("\\") !== -1) { return }
    var re = this.strict ? this.reservedWordsStrict : this.reservedWords;
    if (re.test(name)) {
      if (!this.inAsync && name === "await")
        { this.raiseRecoverable(start, "Cannot use keyword 'await' outside an async function"); }
      this.raiseRecoverable(start, ("The keyword '" + name + "' is reserved"));
    }
  };

  // Parse the next token as an identifier. If `liberal` is true (used
  // when parsing properties), it will also convert keywords into
  // identifiers.

  pp$5.parseIdent = function(liberal, isBinding) {
    var node = this.startNode();
    if (this.type === types$1.name) {
      node.name = this.value;
    } else if (this.type.keyword) {
      node.name = this.type.keyword;

      // To fix https://github.com/acornjs/acorn/issues/575
      // `class` and `function` keywords push new context into this.context.
      // But there is no chance to pop the context if the keyword is consumed as an identifier such as a property name.
      // If the previous token is a dot, this does not apply because the context-managing code already ignored the keyword
      if ((node.name === "class" || node.name === "function") &&
          (this.lastTokEnd !== this.lastTokStart + 1 || this.input.charCodeAt(this.lastTokStart) !== 46)) {
        this.context.pop();
      }
    } else {
      this.unexpected();
    }
    this.next(!!liberal);
    this.finishNode(node, "Identifier");
    if (!liberal) {
      this.checkUnreserved(node);
      if (node.name === "await" && !this.awaitIdentPos)
        { this.awaitIdentPos = node.start; }
    }
    return node
  };

  pp$5.parsePrivateIdent = function() {
    var node = this.startNode();
    if (this.type === types$1.privateId) {
      node.name = this.value;
    } else {
      this.unexpected();
    }
    this.next();
    this.finishNode(node, "PrivateIdentifier");

    // For validating existence
    if (this.privateNameStack.length === 0) {
      this.raise(node.start, ("Private field '#" + (node.name) + "' must be declared in an enclosing class"));
    } else {
      this.privateNameStack[this.privateNameStack.length - 1].used.push(node);
    }

    return node
  };

  // Parses yield expression inside generator.

  pp$5.parseYield = function(forInit) {
    if (!this.yieldPos) { this.yieldPos = this.start; }

    var node = this.startNode();
    this.next();
    if (this.type === types$1.semi || this.canInsertSemicolon() || (this.type !== types$1.star && !this.type.startsExpr)) {
      node.delegate = false;
      node.argument = null;
    } else {
      node.delegate = this.eat(types$1.star);
      node.argument = this.parseMaybeAssign(forInit);
    }
    return this.finishNode(node, "YieldExpression")
  };

  pp$5.parseAwait = function(forInit) {
    if (!this.awaitPos) { this.awaitPos = this.start; }

    var node = this.startNode();
    this.next();
    node.argument = this.parseMaybeUnary(null, true, false, forInit);
    return this.finishNode(node, "AwaitExpression")
  };

  var pp$4 = Parser.prototype;

  // This function is used to raise exceptions on parse errors. It
  // takes an offset integer (into the current `input`) to indicate
  // the location of the error, attaches the position to the end
  // of the error message, and then raises a `SyntaxError` with that
  // message.

  pp$4.raise = function(pos, message) {
    var loc = getLineInfo(this.input, pos);
    message += " (" + loc.line + ":" + loc.column + ")";
    var err = new SyntaxError(message);
    err.pos = pos; err.loc = loc; err.raisedAt = this.pos;
    throw err
  };

  pp$4.raiseRecoverable = pp$4.raise;

  pp$4.curPosition = function() {
    if (this.options.locations) {
      return new Position(this.curLine, this.pos - this.lineStart)
    }
  };

  var pp$3 = Parser.prototype;

  var Scope = function Scope(flags) {
    this.flags = flags;
    // A list of var-declared names in the current lexical scope
    this.var = [];
    // A list of lexically-declared names in the current lexical scope
    this.lexical = [];
    // A list of lexically-declared FunctionDeclaration names in the current lexical scope
    this.functions = [];
    // A switch to disallow the identifier reference 'arguments'
    this.inClassFieldInit = false;
  };

  // The functions in this module keep track of declared variables in the current scope in order to detect duplicate variable names.

  pp$3.enterScope = function(flags) {
    this.scopeStack.push(new Scope(flags));
  };

  pp$3.exitScope = function() {
    this.scopeStack.pop();
  };

  // The spec says:
  // > At the top level of a function, or script, function declarations are
  // > treated like var declarations rather than like lexical declarations.
  pp$3.treatFunctionsAsVarInScope = function(scope) {
    return (scope.flags & SCOPE_FUNCTION) || !this.inModule && (scope.flags & SCOPE_TOP)
  };

  pp$3.declareName = function(name, bindingType, pos) {
    var redeclared = false;
    if (bindingType === BIND_LEXICAL) {
      var scope = this.currentScope();
      redeclared = scope.lexical.indexOf(name) > -1 || scope.functions.indexOf(name) > -1 || scope.var.indexOf(name) > -1;
      scope.lexical.push(name);
      if (this.inModule && (scope.flags & SCOPE_TOP))
        { delete this.undefinedExports[name]; }
    } else if (bindingType === BIND_SIMPLE_CATCH) {
      var scope$1 = this.currentScope();
      scope$1.lexical.push(name);
    } else if (bindingType === BIND_FUNCTION) {
      var scope$2 = this.currentScope();
      if (this.treatFunctionsAsVar)
        { redeclared = scope$2.lexical.indexOf(name) > -1; }
      else
        { redeclared = scope$2.lexical.indexOf(name) > -1 || scope$2.var.indexOf(name) > -1; }
      scope$2.functions.push(name);
    } else {
      for (var i = this.scopeStack.length - 1; i >= 0; --i) {
        var scope$3 = this.scopeStack[i];
        if (scope$3.lexical.indexOf(name) > -1 && !((scope$3.flags & SCOPE_SIMPLE_CATCH) && scope$3.lexical[0] === name) ||
            !this.treatFunctionsAsVarInScope(scope$3) && scope$3.functions.indexOf(name) > -1) {
          redeclared = true;
          break
        }
        scope$3.var.push(name);
        if (this.inModule && (scope$3.flags & SCOPE_TOP))
          { delete this.undefinedExports[name]; }
        if (scope$3.flags & SCOPE_VAR) { break }
      }
    }
    if (redeclared) { this.raiseRecoverable(pos, ("Identifier '" + name + "' has already been declared")); }
  };

  pp$3.checkLocalExport = function(id) {
    // scope.functions must be empty as Module code is always strict.
    if (this.scopeStack[0].lexical.indexOf(id.name) === -1 &&
        this.scopeStack[0].var.indexOf(id.name) === -1) {
      this.undefinedExports[id.name] = id;
    }
  };

  pp$3.currentScope = function() {
    return this.scopeStack[this.scopeStack.length - 1]
  };

  pp$3.currentVarScope = function() {
    for (var i = this.scopeStack.length - 1;; i--) {
      var scope = this.scopeStack[i];
      if (scope.flags & SCOPE_VAR) { return scope }
    }
  };

  // Could be useful for `this`, `new.target`, `super()`, `super.property`, and `super[property]`.
  pp$3.currentThisScope = function() {
    for (var i = this.scopeStack.length - 1;; i--) {
      var scope = this.scopeStack[i];
      if (scope.flags & SCOPE_VAR && !(scope.flags & SCOPE_ARROW)) { return scope }
    }
  };

  var Node = function Node(parser, pos, loc) {
    this.type = "";
    this.start = pos;
    this.end = 0;
    if (parser.options.locations)
      { this.loc = new SourceLocation(parser, loc); }
    if (parser.options.directSourceFile)
      { this.sourceFile = parser.options.directSourceFile; }
    if (parser.options.ranges)
      { this.range = [pos, 0]; }
  };

  // Start an AST node, attaching a start offset.

  var pp$2 = Parser.prototype;

  pp$2.startNode = function() {
    return new Node(this, this.start, this.startLoc)
  };

  pp$2.startNodeAt = function(pos, loc) {
    return new Node(this, pos, loc)
  };

  // Finish an AST node, adding `type` and `end` properties.

  function finishNodeAt(node, type, pos, loc) {
    node.type = type;
    node.end = pos;
    if (this.options.locations)
      { node.loc.end = loc; }
    if (this.options.ranges)
      { node.range[1] = pos; }
    return node
  }

  pp$2.finishNode = function(node, type) {
    return finishNodeAt.call(this, node, type, this.lastTokEnd, this.lastTokEndLoc)
  };

  // Finish node at given position

  pp$2.finishNodeAt = function(node, type, pos, loc) {
    return finishNodeAt.call(this, node, type, pos, loc)
  };

  pp$2.copyNode = function(node) {
    var newNode = new Node(this, node.start, this.startLoc);
    for (var prop in node) { newNode[prop] = node[prop]; }
    return newNode
  };

  // This file contains Unicode properties extracted from the ECMAScript
  // specification. The lists are extracted like so:
  // $$('#table-binary-unicode-properties > figure > table > tbody > tr > td:nth-child(1) code').map(el => el.innerText)

  // #table-binary-unicode-properties
  var ecma9BinaryProperties = "ASCII ASCII_Hex_Digit AHex Alphabetic Alpha Any Assigned Bidi_Control Bidi_C Bidi_Mirrored Bidi_M Case_Ignorable CI Cased Changes_When_Casefolded CWCF Changes_When_Casemapped CWCM Changes_When_Lowercased CWL Changes_When_NFKC_Casefolded CWKCF Changes_When_Titlecased CWT Changes_When_Uppercased CWU Dash Default_Ignorable_Code_Point DI Deprecated Dep Diacritic Dia Emoji Emoji_Component Emoji_Modifier Emoji_Modifier_Base Emoji_Presentation Extender Ext Grapheme_Base Gr_Base Grapheme_Extend Gr_Ext Hex_Digit Hex IDS_Binary_Operator IDSB IDS_Trinary_Operator IDST ID_Continue IDC ID_Start IDS Ideographic Ideo Join_Control Join_C Logical_Order_Exception LOE Lowercase Lower Math Noncharacter_Code_Point NChar Pattern_Syntax Pat_Syn Pattern_White_Space Pat_WS Quotation_Mark QMark Radical Regional_Indicator RI Sentence_Terminal STerm Soft_Dotted SD Terminal_Punctuation Term Unified_Ideograph UIdeo Uppercase Upper Variation_Selector VS White_Space space XID_Continue XIDC XID_Start XIDS";
  var ecma10BinaryProperties = ecma9BinaryProperties + " Extended_Pictographic";
  var ecma11BinaryProperties = ecma10BinaryProperties;
  var ecma12BinaryProperties = ecma11BinaryProperties + " EBase EComp EMod EPres ExtPict";
  var ecma13BinaryProperties = ecma12BinaryProperties;
  var unicodeBinaryProperties = {
    9: ecma9BinaryProperties,
    10: ecma10BinaryProperties,
    11: ecma11BinaryProperties,
    12: ecma12BinaryProperties,
    13: ecma13BinaryProperties
  };

  // #table-unicode-general-category-values
  var unicodeGeneralCategoryValues = "Cased_Letter LC Close_Punctuation Pe Connector_Punctuation Pc Control Cc cntrl Currency_Symbol Sc Dash_Punctuation Pd Decimal_Number Nd digit Enclosing_Mark Me Final_Punctuation Pf Format Cf Initial_Punctuation Pi Letter L Letter_Number Nl Line_Separator Zl Lowercase_Letter Ll Mark M Combining_Mark Math_Symbol Sm Modifier_Letter Lm Modifier_Symbol Sk Nonspacing_Mark Mn Number N Open_Punctuation Ps Other C Other_Letter Lo Other_Number No Other_Punctuation Po Other_Symbol So Paragraph_Separator Zp Private_Use Co Punctuation P punct Separator Z Space_Separator Zs Spacing_Mark Mc Surrogate Cs Symbol S Titlecase_Letter Lt Unassigned Cn Uppercase_Letter Lu";

  // #table-unicode-script-values
  var ecma9ScriptValues = "Adlam Adlm Ahom Anatolian_Hieroglyphs Hluw Arabic Arab Armenian Armn Avestan Avst Balinese Bali Bamum Bamu Bassa_Vah Bass Batak Batk Bengali Beng Bhaiksuki Bhks Bopomofo Bopo Brahmi Brah Braille Brai Buginese Bugi Buhid Buhd Canadian_Aboriginal Cans Carian Cari Caucasian_Albanian Aghb Chakma Cakm Cham Cham Cherokee Cher Common Zyyy Coptic Copt Qaac Cuneiform Xsux Cypriot Cprt Cyrillic Cyrl Deseret Dsrt Devanagari Deva Duployan Dupl Egyptian_Hieroglyphs Egyp Elbasan Elba Ethiopic Ethi Georgian Geor Glagolitic Glag Gothic Goth Grantha Gran Greek Grek Gujarati Gujr Gurmukhi Guru Han Hani Hangul Hang Hanunoo Hano Hatran Hatr Hebrew Hebr Hiragana Hira Imperial_Aramaic Armi Inherited Zinh Qaai Inscriptional_Pahlavi Phli Inscriptional_Parthian Prti Javanese Java Kaithi Kthi Kannada Knda Katakana Kana Kayah_Li Kali Kharoshthi Khar Khmer Khmr Khojki Khoj Khudawadi Sind Lao Laoo Latin Latn Lepcha Lepc Limbu Limb Linear_A Lina Linear_B Linb Lisu Lisu Lycian Lyci Lydian Lydi Mahajani Mahj Malayalam Mlym Mandaic Mand Manichaean Mani Marchen Marc Masaram_Gondi Gonm Meetei_Mayek Mtei Mende_Kikakui Mend Meroitic_Cursive Merc Meroitic_Hieroglyphs Mero Miao Plrd Modi Mongolian Mong Mro Mroo Multani Mult Myanmar Mymr Nabataean Nbat New_Tai_Lue Talu Newa Newa Nko Nkoo Nushu Nshu Ogham Ogam Ol_Chiki Olck Old_Hungarian Hung Old_Italic Ital Old_North_Arabian Narb Old_Permic Perm Old_Persian Xpeo Old_South_Arabian Sarb Old_Turkic Orkh Oriya Orya Osage Osge Osmanya Osma Pahawh_Hmong Hmng Palmyrene Palm Pau_Cin_Hau Pauc Phags_Pa Phag Phoenician Phnx Psalter_Pahlavi Phlp Rejang Rjng Runic Runr Samaritan Samr Saurashtra Saur Sharada Shrd Shavian Shaw Siddham Sidd SignWriting Sgnw Sinhala Sinh Sora_Sompeng Sora Soyombo Soyo Sundanese Sund Syloti_Nagri Sylo Syriac Syrc Tagalog Tglg Tagbanwa Tagb Tai_Le Tale Tai_Tham Lana Tai_Viet Tavt Takri Takr Tamil Taml Tangut Tang Telugu Telu Thaana Thaa Thai Thai Tibetan Tibt Tifinagh Tfng Tirhuta Tirh Ugaritic Ugar Vai Vaii Warang_Citi Wara Yi Yiii Zanabazar_Square Zanb";
  var ecma10ScriptValues = ecma9ScriptValues + " Dogra Dogr Gunjala_Gondi Gong Hanifi_Rohingya Rohg Makasar Maka Medefaidrin Medf Old_Sogdian Sogo Sogdian Sogd";
  var ecma11ScriptValues = ecma10ScriptValues + " Elymaic Elym Nandinagari Nand Nyiakeng_Puachue_Hmong Hmnp Wancho Wcho";
  var ecma12ScriptValues = ecma11ScriptValues + " Chorasmian Chrs Diak Dives_Akuru Khitan_Small_Script Kits Yezi Yezidi";
  var ecma13ScriptValues = ecma12ScriptValues + " Cypro_Minoan Cpmn Old_Uyghur Ougr Tangsa Tnsa Toto Vithkuqi Vith";
  var unicodeScriptValues = {
    9: ecma9ScriptValues,
    10: ecma10ScriptValues,
    11: ecma11ScriptValues,
    12: ecma12ScriptValues,
    13: ecma13ScriptValues
  };

  var data = {};
  function buildUnicodeData(ecmaVersion) {
    var d = data[ecmaVersion] = {
      binary: wordsRegexp(unicodeBinaryProperties[ecmaVersion] + " " + unicodeGeneralCategoryValues),
      nonBinary: {
        General_Category: wordsRegexp(unicodeGeneralCategoryValues),
        Script: wordsRegexp(unicodeScriptValues[ecmaVersion])
      }
    };
    d.nonBinary.Script_Extensions = d.nonBinary.Script;

    d.nonBinary.gc = d.nonBinary.General_Category;
    d.nonBinary.sc = d.nonBinary.Script;
    d.nonBinary.scx = d.nonBinary.Script_Extensions;
  }

  for (var i = 0, list = [9, 10, 11, 12, 13]; i < list.length; i += 1) {
    var ecmaVersion = list[i];

    buildUnicodeData(ecmaVersion);
  }

  var pp$1 = Parser.prototype;

  var RegExpValidationState = function RegExpValidationState(parser) {
    this.parser = parser;
    this.validFlags = "gim" + (parser.options.ecmaVersion >= 6 ? "uy" : "") + (parser.options.ecmaVersion >= 9 ? "s" : "") + (parser.options.ecmaVersion >= 13 ? "d" : "");
    this.unicodeProperties = data[parser.options.ecmaVersion >= 13 ? 13 : parser.options.ecmaVersion];
    this.source = "";
    this.flags = "";
    this.start = 0;
    this.switchU = false;
    this.switchN = false;
    this.pos = 0;
    this.lastIntValue = 0;
    this.lastStringValue = "";
    this.lastAssertionIsQuantifiable = false;
    this.numCapturingParens = 0;
    this.maxBackReference = 0;
    this.groupNames = [];
    this.backReferenceNames = [];
  };

  RegExpValidationState.prototype.reset = function reset (start, pattern, flags) {
    var unicode = flags.indexOf("u") !== -1;
    this.start = start | 0;
    this.source = pattern + "";
    this.flags = flags;
    this.switchU = unicode && this.parser.options.ecmaVersion >= 6;
    this.switchN = unicode && this.parser.options.ecmaVersion >= 9;
  };

  RegExpValidationState.prototype.raise = function raise (message) {
    this.parser.raiseRecoverable(this.start, ("Invalid regular expression: /" + (this.source) + "/: " + message));
  };

  // If u flag is given, this returns the code point at the index (it combines a surrogate pair).
  // Otherwise, this returns the code unit of the index (can be a part of a surrogate pair).
  RegExpValidationState.prototype.at = function at (i, forceU) {
      if ( forceU === void 0 ) forceU = false;

    var s = this.source;
    var l = s.length;
    if (i >= l) {
      return -1
    }
    var c = s.charCodeAt(i);
    if (!(forceU || this.switchU) || c <= 0xD7FF || c >= 0xE000 || i + 1 >= l) {
      return c
    }
    var next = s.charCodeAt(i + 1);
    return next >= 0xDC00 && next <= 0xDFFF ? (c << 10) + next - 0x35FDC00 : c
  };

  RegExpValidationState.prototype.nextIndex = function nextIndex (i, forceU) {
      if ( forceU === void 0 ) forceU = false;

    var s = this.source;
    var l = s.length;
    if (i >= l) {
      return l
    }
    var c = s.charCodeAt(i), next;
    if (!(forceU || this.switchU) || c <= 0xD7FF || c >= 0xE000 || i + 1 >= l ||
        (next = s.charCodeAt(i + 1)) < 0xDC00 || next > 0xDFFF) {
      return i + 1
    }
    return i + 2
  };

  RegExpValidationState.prototype.current = function current (forceU) {
      if ( forceU === void 0 ) forceU = false;

    return this.at(this.pos, forceU)
  };

  RegExpValidationState.prototype.lookahead = function lookahead (forceU) {
      if ( forceU === void 0 ) forceU = false;

    return this.at(this.nextIndex(this.pos, forceU), forceU)
  };

  RegExpValidationState.prototype.advance = function advance (forceU) {
      if ( forceU === void 0 ) forceU = false;

    this.pos = this.nextIndex(this.pos, forceU);
  };

  RegExpValidationState.prototype.eat = function eat (ch, forceU) {
      if ( forceU === void 0 ) forceU = false;

    if (this.current(forceU) === ch) {
      this.advance(forceU);
      return true
    }
    return false
  };

  /**
   * Validate the flags part of a given RegExpLiteral.
   *
   * @param {RegExpValidationState} state The state to validate RegExp.
   * @returns {void}
   */
  pp$1.validateRegExpFlags = function(state) {
    var validFlags = state.validFlags;
    var flags = state.flags;

    for (var i = 0; i < flags.length; i++) {
      var flag = flags.charAt(i);
      if (validFlags.indexOf(flag) === -1) {
        this.raise(state.start, "Invalid regular expression flag");
      }
      if (flags.indexOf(flag, i + 1) > -1) {
        this.raise(state.start, "Duplicate regular expression flag");
      }
    }
  };

  /**
   * Validate the pattern part of a given RegExpLiteral.
   *
   * @param {RegExpValidationState} state The state to validate RegExp.
   * @returns {void}
   */
  pp$1.validateRegExpPattern = function(state) {
    this.regexp_pattern(state);

    // The goal symbol for the parse is |Pattern[~U, ~N]|. If the result of
    // parsing contains a |GroupName|, reparse with the goal symbol
    // |Pattern[~U, +N]| and use this result instead. Throw a *SyntaxError*
    // exception if _P_ did not conform to the grammar, if any elements of _P_
    // were not matched by the parse, or if any Early Error conditions exist.
    if (!state.switchN && this.options.ecmaVersion >= 9 && state.groupNames.length > 0) {
      state.switchN = true;
      this.regexp_pattern(state);
    }
  };

  // https://www.ecma-international.org/ecma-262/8.0/#prod-Pattern
  pp$1.regexp_pattern = function(state) {
    state.pos = 0;
    state.lastIntValue = 0;
    state.lastStringValue = "";
    state.lastAssertionIsQuantifiable = false;
    state.numCapturingParens = 0;
    state.maxBackReference = 0;
    state.groupNames.length = 0;
    state.backReferenceNames.length = 0;

    this.regexp_disjunction(state);

    if (state.pos !== state.source.length) {
      // Make the same messages as V8.
      if (state.eat(0x29 /* ) */)) {
        state.raise("Unmatched ')'");
      }
      if (state.eat(0x5D /* ] */) || state.eat(0x7D /* } */)) {
        state.raise("Lone quantifier brackets");
      }
    }
    if (state.maxBackReference > state.numCapturingParens) {
      state.raise("Invalid escape");
    }
    for (var i = 0, list = state.backReferenceNames; i < list.length; i += 1) {
      var name = list[i];

      if (state.groupNames.indexOf(name) === -1) {
        state.raise("Invalid named capture referenced");
      }
    }
  };

  // https://www.ecma-international.org/ecma-262/8.0/#prod-Disjunction
  pp$1.regexp_disjunction = function(state) {
    this.regexp_alternative(state);
    while (state.eat(0x7C /* | */)) {
      this.regexp_alternative(state);
    }

    // Make the same message as V8.
    if (this.regexp_eatQuantifier(state, true)) {
      state.raise("Nothing to repeat");
    }
    if (state.eat(0x7B /* { */)) {
      state.raise("Lone quantifier brackets");
    }
  };

  // https://www.ecma-international.org/ecma-262/8.0/#prod-Alternative
  pp$1.regexp_alternative = function(state) {
    while (state.pos < state.source.length && this.regexp_eatTerm(state))
      { }
  };

  // https://www.ecma-international.org/ecma-262/8.0/#prod-annexB-Term
  pp$1.regexp_eatTerm = function(state) {
    if (this.regexp_eatAssertion(state)) {
      // Handle `QuantifiableAssertion Quantifier` alternative.
      // `state.lastAssertionIsQuantifiable` is true if the last eaten Assertion
      // is a QuantifiableAssertion.
      if (state.lastAssertionIsQuantifiable && this.regexp_eatQuantifier(state)) {
        // Make the same message as V8.
        if (state.switchU) {
          state.raise("Invalid quantifier");
        }
      }
      return true
    }

    if (state.switchU ? this.regexp_eatAtom(state) : this.regexp_eatExtendedAtom(state)) {
      this.regexp_eatQuantifier(state);
      return true
    }

    return false
  };

  // https://www.ecma-international.org/ecma-262/8.0/#prod-annexB-Assertion
  pp$1.regexp_eatAssertion = function(state) {
    var start = state.pos;
    state.lastAssertionIsQuantifiable = false;

    // ^, $
    if (state.eat(0x5E /* ^ */) || state.eat(0x24 /* $ */)) {
      return true
    }

    // \b \B
    if (state.eat(0x5C /* \ */)) {
      if (state.eat(0x42 /* B */) || state.eat(0x62 /* b */)) {
        return true
      }
      state.pos = start;
    }

    // Lookahead / Lookbehind
    if (state.eat(0x28 /* ( */) && state.eat(0x3F /* ? */)) {
      var lookbehind = false;
      if (this.options.ecmaVersion >= 9) {
        lookbehind = state.eat(0x3C /* < */);
      }
      if (state.eat(0x3D /* = */) || state.eat(0x21 /* ! */)) {
        this.regexp_disjunction(state);
        if (!state.eat(0x29 /* ) */)) {
          state.raise("Unterminated group");
        }
        state.lastAssertionIsQuantifiable = !lookbehind;
        return true
      }
    }

    state.pos = start;
    return false
  };

  // https://www.ecma-international.org/ecma-262/8.0/#prod-Quantifier
  pp$1.regexp_eatQuantifier = function(state, noError) {
    if ( noError === void 0 ) noError = false;

    if (this.regexp_eatQuantifierPrefix(state, noError)) {
      state.eat(0x3F /* ? */);
      return true
    }
    return false
  };

  // https://www.ecma-international.org/ecma-262/8.0/#prod-QuantifierPrefix
  pp$1.regexp_eatQuantifierPrefix = function(state, noError) {
    return (
      state.eat(0x2A /* * */) ||
      state.eat(0x2B /* + */) ||
      state.eat(0x3F /* ? */) ||
      this.regexp_eatBracedQuantifier(state, noError)
    )
  };
  pp$1.regexp_eatBracedQuantifier = function(state, noError) {
    var start = state.pos;
    if (state.eat(0x7B /* { */)) {
      var min = 0, max = -1;
      if (this.regexp_eatDecimalDigits(state)) {
        min = state.lastIntValue;
        if (state.eat(0x2C /* , */) && this.regexp_eatDecimalDigits(state)) {
          max = state.lastIntValue;
        }
        if (state.eat(0x7D /* } */)) {
          // SyntaxError in https://www.ecma-international.org/ecma-262/8.0/#sec-term
          if (max !== -1 && max < min && !noError) {
            state.raise("numbers out of order in {} quantifier");
          }
          return true
        }
      }
      if (state.switchU && !noError) {
        state.raise("Incomplete quantifier");
      }
      state.pos = start;
    }
    return false
  };

  // https://www.ecma-international.org/ecma-262/8.0/#prod-Atom
  pp$1.regexp_eatAtom = function(state) {
    return (
      this.regexp_eatPatternCharacters(state) ||
      state.eat(0x2E /* . */) ||
      this.regexp_eatReverseSolidusAtomEscape(state) ||
      this.regexp_eatCharacterClass(state) ||
      this.regexp_eatUncapturingGroup(state) ||
      this.regexp_eatCapturingGroup(state)
    )
  };
  pp$1.regexp_eatReverseSolidusAtomEscape = function(state) {
    var start = state.pos;
    if (state.eat(0x5C /* \ */)) {
      if (this.regexp_eatAtomEscape(state)) {
        return true
      }
      state.pos = start;
    }
    return false
  };
  pp$1.regexp_eatUncapturingGroup = function(state) {
    var start = state.pos;
    if (state.eat(0x28 /* ( */)) {
      if (state.eat(0x3F /* ? */) && state.eat(0x3A /* : */)) {
        this.regexp_disjunction(state);
        if (state.eat(0x29 /* ) */)) {
          return true
        }
        state.raise("Unterminated group");
      }
      state.pos = start;
    }
    return false
  };
  pp$1.regexp_eatCapturingGroup = function(state) {
    if (state.eat(0x28 /* ( */)) {
      if (this.options.ecmaVersion >= 9) {
        this.regexp_groupSpecifier(state);
      } else if (state.current() === 0x3F /* ? */) {
        state.raise("Invalid group");
      }
      this.regexp_disjunction(state);
      if (state.eat(0x29 /* ) */)) {
        state.numCapturingParens += 1;
        return true
      }
      state.raise("Unterminated group");
    }
    return false
  };

  // https://www.ecma-international.org/ecma-262/8.0/#prod-annexB-ExtendedAtom
  pp$1.regexp_eatExtendedAtom = function(state) {
    return (
      state.eat(0x2E /* . */) ||
      this.regexp_eatReverseSolidusAtomEscape(state) ||
      this.regexp_eatCharacterClass(state) ||
      this.regexp_eatUncapturingGroup(state) ||
      this.regexp_eatCapturingGroup(state) ||
      this.regexp_eatInvalidBracedQuantifier(state) ||
      this.regexp_eatExtendedPatternCharacter(state)
    )
  };

  // https://www.ecma-international.org/ecma-262/8.0/#prod-annexB-InvalidBracedQuantifier
  pp$1.regexp_eatInvalidBracedQuantifier = function(state) {
    if (this.regexp_eatBracedQuantifier(state, true)) {
      state.raise("Nothing to repeat");
    }
    return false
  };

  // https://www.ecma-international.org/ecma-262/8.0/#prod-SyntaxCharacter
  pp$1.regexp_eatSyntaxCharacter = function(state) {
    var ch = state.current();
    if (isSyntaxCharacter(ch)) {
      state.lastIntValue = ch;
      state.advance();
      return true
    }
    return false
  };
  function isSyntaxCharacter(ch) {
    return (
      ch === 0x24 /* $ */ ||
      ch >= 0x28 /* ( */ && ch <= 0x2B /* + */ ||
      ch === 0x2E /* . */ ||
      ch === 0x3F /* ? */ ||
      ch >= 0x5B /* [ */ && ch <= 0x5E /* ^ */ ||
      ch >= 0x7B /* { */ && ch <= 0x7D /* } */
    )
  }

  // https://www.ecma-international.org/ecma-262/8.0/#prod-PatternCharacter
  // But eat eager.
  pp$1.regexp_eatPatternCharacters = function(state) {
    var start = state.pos;
    var ch = 0;
    while ((ch = state.current()) !== -1 && !isSyntaxCharacter(ch)) {
      state.advance();
    }
    return state.pos !== start
  };

  // https://www.ecma-international.org/ecma-262/8.0/#prod-annexB-ExtendedPatternCharacter
  pp$1.regexp_eatExtendedPatternCharacter = function(state) {
    var ch = state.current();
    if (
      ch !== -1 &&
      ch !== 0x24 /* $ */ &&
      !(ch >= 0x28 /* ( */ && ch <= 0x2B /* + */) &&
      ch !== 0x2E /* . */ &&
      ch !== 0x3F /* ? */ &&
      ch !== 0x5B /* [ */ &&
      ch !== 0x5E /* ^ */ &&
      ch !== 0x7C /* | */
    ) {
      state.advance();
      return true
    }
    return false
  };

  // GroupSpecifier ::
  //   [empty]
  //   `?` GroupName
  pp$1.regexp_groupSpecifier = function(state) {
    if (state.eat(0x3F /* ? */)) {
      if (this.regexp_eatGroupName(state)) {
        if (state.groupNames.indexOf(state.lastStringValue) !== -1) {
          state.raise("Duplicate capture group name");
        }
        state.groupNames.push(state.lastStringValue);
        return
      }
      state.raise("Invalid group");
    }
  };

  // GroupName ::
  //   `<` RegExpIdentifierName `>`
  // Note: this updates `state.lastStringValue` property with the eaten name.
  pp$1.regexp_eatGroupName = function(state) {
    state.lastStringValue = "";
    if (state.eat(0x3C /* < */)) {
      if (this.regexp_eatRegExpIdentifierName(state) && state.eat(0x3E /* > */)) {
        return true
      }
      state.raise("Invalid capture group name");
    }
    return false
  };

  // RegExpIdentifierName ::
  //   RegExpIdentifierStart
  //   RegExpIdentifierName RegExpIdentifierPart
  // Note: this updates `state.lastStringValue` property with the eaten name.
  pp$1.regexp_eatRegExpIdentifierName = function(state) {
    state.lastStringValue = "";
    if (this.regexp_eatRegExpIdentifierStart(state)) {
      state.lastStringValue += codePointToString(state.lastIntValue);
      while (this.regexp_eatRegExpIdentifierPart(state)) {
        state.lastStringValue += codePointToString(state.lastIntValue);
      }
      return true
    }
    return false
  };

  // RegExpIdentifierStart ::
  //   UnicodeIDStart
  //   `$`
  //   `_`
  //   `\` RegExpUnicodeEscapeSequence[+U]
  pp$1.regexp_eatRegExpIdentifierStart = function(state) {
    var start = state.pos;
    var forceU = this.options.ecmaVersion >= 11;
    var ch = state.current(forceU);
    state.advance(forceU);

    if (ch === 0x5C /* \ */ && this.regexp_eatRegExpUnicodeEscapeSequence(state, forceU)) {
      ch = state.lastIntValue;
    }
    if (isRegExpIdentifierStart(ch)) {
      state.lastIntValue = ch;
      return true
    }

    state.pos = start;
    return false
  };
  function isRegExpIdentifierStart(ch) {
    return isIdentifierStart(ch, true) || ch === 0x24 /* $ */ || ch === 0x5F /* _ */
  }

  // RegExpIdentifierPart ::
  //   UnicodeIDContinue
  //   `$`
  //   `_`
  //   `\` RegExpUnicodeEscapeSequence[+U]
  //   <ZWNJ>
  //   <ZWJ>
  pp$1.regexp_eatRegExpIdentifierPart = function(state) {
    var start = state.pos;
    var forceU = this.options.ecmaVersion >= 11;
    var ch = state.current(forceU);
    state.advance(forceU);

    if (ch === 0x5C /* \ */ && this.regexp_eatRegExpUnicodeEscapeSequence(state, forceU)) {
      ch = state.lastIntValue;
    }
    if (isRegExpIdentifierPart(ch)) {
      state.lastIntValue = ch;
      return true
    }

    state.pos = start;
    return false
  };
  function isRegExpIdentifierPart(ch) {
    return isIdentifierChar(ch, true) || ch === 0x24 /* $ */ || ch === 0x5F /* _ */ || ch === 0x200C /* <ZWNJ> */ || ch === 0x200D /* <ZWJ> */
  }

  // https://www.ecma-international.org/ecma-262/8.0/#prod-annexB-AtomEscape
  pp$1.regexp_eatAtomEscape = function(state) {
    if (
      this.regexp_eatBackReference(state) ||
      this.regexp_eatCharacterClassEscape(state) ||
      this.regexp_eatCharacterEscape(state) ||
      (state.switchN && this.regexp_eatKGroupName(state))
    ) {
      return true
    }
    if (state.switchU) {
      // Make the same message as V8.
      if (state.current() === 0x63 /* c */) {
        state.raise("Invalid unicode escape");
      }
      state.raise("Invalid escape");
    }
    return false
  };
  pp$1.regexp_eatBackReference = function(state) {
    var start = state.pos;
    if (this.regexp_eatDecimalEscape(state)) {
      var n = state.lastIntValue;
      if (state.switchU) {
        // For SyntaxError in https://www.ecma-international.org/ecma-262/8.0/#sec-atomescape
        if (n > state.maxBackReference) {
          state.maxBackReference = n;
        }
        return true
      }
      if (n <= state.numCapturingParens) {
        return true
      }
      state.pos = start;
    }
    return false
  };
  pp$1.regexp_eatKGroupName = function(state) {
    if (state.eat(0x6B /* k */)) {
      if (this.regexp_eatGroupName(state)) {
        state.backReferenceNames.push(state.lastStringValue);
        return true
      }
      state.raise("Invalid named reference");
    }
    return false
  };

  // https://www.ecma-international.org/ecma-262/8.0/#prod-annexB-CharacterEscape
  pp$1.regexp_eatCharacterEscape = function(state) {
    return (
      this.regexp_eatControlEscape(state) ||
      this.regexp_eatCControlLetter(state) ||
      this.regexp_eatZero(state) ||
      this.regexp_eatHexEscapeSequence(state) ||
      this.regexp_eatRegExpUnicodeEscapeSequence(state, false) ||
      (!state.switchU && this.regexp_eatLegacyOctalEscapeSequence(state)) ||
      this.regexp_eatIdentityEscape(state)
    )
  };
  pp$1.regexp_eatCControlLetter = function(state) {
    var start = state.pos;
    if (state.eat(0x63 /* c */)) {
      if (this.regexp_eatControlLetter(state)) {
        return true
      }
      state.pos = start;
    }
    return false
  };
  pp$1.regexp_eatZero = function(state) {
    if (state.current() === 0x30 /* 0 */ && !isDecimalDigit(state.lookahead())) {
      state.lastIntValue = 0;
      state.advance();
      return true
    }
    return false
  };

  // https://www.ecma-international.org/ecma-262/8.0/#prod-ControlEscape
  pp$1.regexp_eatControlEscape = function(state) {
    var ch = state.current();
    if (ch === 0x74 /* t */) {
      state.lastIntValue = 0x09; /* \t */
      state.advance();
      return true
    }
    if (ch === 0x6E /* n */) {
      state.lastIntValue = 0x0A; /* \n */
      state.advance();
      return true
    }
    if (ch === 0x76 /* v */) {
      state.lastIntValue = 0x0B; /* \v */
      state.advance();
      return true
    }
    if (ch === 0x66 /* f */) {
      state.lastIntValue = 0x0C; /* \f */
      state.advance();
      return true
    }
    if (ch === 0x72 /* r */) {
      state.lastIntValue = 0x0D; /* \r */
      state.advance();
      return true
    }
    return false
  };

  // https://www.ecma-international.org/ecma-262/8.0/#prod-ControlLetter
  pp$1.regexp_eatControlLetter = function(state) {
    var ch = state.current();
    if (isControlLetter(ch)) {
      state.lastIntValue = ch % 0x20;
      state.advance();
      return true
    }
    return false
  };
  function isControlLetter(ch) {
    return (
      (ch >= 0x41 /* A */ && ch <= 0x5A /* Z */) ||
      (ch >= 0x61 /* a */ && ch <= 0x7A /* z */)
    )
  }

  // https://www.ecma-international.org/ecma-262/8.0/#prod-RegExpUnicodeEscapeSequence
  pp$1.regexp_eatRegExpUnicodeEscapeSequence = function(state, forceU) {
    if ( forceU === void 0 ) forceU = false;

    var start = state.pos;
    var switchU = forceU || state.switchU;

    if (state.eat(0x75 /* u */)) {
      if (this.regexp_eatFixedHexDigits(state, 4)) {
        var lead = state.lastIntValue;
        if (switchU && lead >= 0xD800 && lead <= 0xDBFF) {
          var leadSurrogateEnd = state.pos;
          if (state.eat(0x5C /* \ */) && state.eat(0x75 /* u */) && this.regexp_eatFixedHexDigits(state, 4)) {
            var trail = state.lastIntValue;
            if (trail >= 0xDC00 && trail <= 0xDFFF) {
              state.lastIntValue = (lead - 0xD800) * 0x400 + (trail - 0xDC00) + 0x10000;
              return true
            }
          }
          state.pos = leadSurrogateEnd;
          state.lastIntValue = lead;
        }
        return true
      }
      if (
        switchU &&
        state.eat(0x7B /* { */) &&
        this.regexp_eatHexDigits(state) &&
        state.eat(0x7D /* } */) &&
        isValidUnicode(state.lastIntValue)
      ) {
        return true
      }
      if (switchU) {
        state.raise("Invalid unicode escape");
      }
      state.pos = start;
    }

    return false
  };
  function isValidUnicode(ch) {
    return ch >= 0 && ch <= 0x10FFFF
  }

  // https://www.ecma-international.org/ecma-262/8.0/#prod-annexB-IdentityEscape
  pp$1.regexp_eatIdentityEscape = function(state) {
    if (state.switchU) {
      if (this.regexp_eatSyntaxCharacter(state)) {
        return true
      }
      if (state.eat(0x2F /* / */)) {
        state.lastIntValue = 0x2F; /* / */
        return true
      }
      return false
    }

    var ch = state.current();
    if (ch !== 0x63 /* c */ && (!state.switchN || ch !== 0x6B /* k */)) {
      state.lastIntValue = ch;
      state.advance();
      return true
    }

    return false
  };

  // https://www.ecma-international.org/ecma-262/8.0/#prod-DecimalEscape
  pp$1.regexp_eatDecimalEscape = function(state) {
    state.lastIntValue = 0;
    var ch = state.current();
    if (ch >= 0x31 /* 1 */ && ch <= 0x39 /* 9 */) {
      do {
        state.lastIntValue = 10 * state.lastIntValue + (ch - 0x30 /* 0 */);
        state.advance();
      } while ((ch = state.current()) >= 0x30 /* 0 */ && ch <= 0x39 /* 9 */)
      return true
    }
    return false
  };

  // https://www.ecma-international.org/ecma-262/8.0/#prod-CharacterClassEscape
  pp$1.regexp_eatCharacterClassEscape = function(state) {
    var ch = state.current();

    if (isCharacterClassEscape(ch)) {
      state.lastIntValue = -1;
      state.advance();
      return true
    }

    if (
      state.switchU &&
      this.options.ecmaVersion >= 9 &&
      (ch === 0x50 /* P */ || ch === 0x70 /* p */)
    ) {
      state.lastIntValue = -1;
      state.advance();
      if (
        state.eat(0x7B /* { */) &&
        this.regexp_eatUnicodePropertyValueExpression(state) &&
        state.eat(0x7D /* } */)
      ) {
        return true
      }
      state.raise("Invalid property name");
    }

    return false
  };
  function isCharacterClassEscape(ch) {
    return (
      ch === 0x64 /* d */ ||
      ch === 0x44 /* D */ ||
      ch === 0x73 /* s */ ||
      ch === 0x53 /* S */ ||
      ch === 0x77 /* w */ ||
      ch === 0x57 /* W */
    )
  }

  // UnicodePropertyValueExpression ::
  //   UnicodePropertyName `=` UnicodePropertyValue
  //   LoneUnicodePropertyNameOrValue
  pp$1.regexp_eatUnicodePropertyValueExpression = function(state) {
    var start = state.pos;

    // UnicodePropertyName `=` UnicodePropertyValue
    if (this.regexp_eatUnicodePropertyName(state) && state.eat(0x3D /* = */)) {
      var name = state.lastStringValue;
      if (this.regexp_eatUnicodePropertyValue(state)) {
        var value = state.lastStringValue;
        this.regexp_validateUnicodePropertyNameAndValue(state, name, value);
        return true
      }
    }
    state.pos = start;

    // LoneUnicodePropertyNameOrValue
    if (this.regexp_eatLoneUnicodePropertyNameOrValue(state)) {
      var nameOrValue = state.lastStringValue;
      this.regexp_validateUnicodePropertyNameOrValue(state, nameOrValue);
      return true
    }
    return false
  };
  pp$1.regexp_validateUnicodePropertyNameAndValue = function(state, name, value) {
    if (!hasOwn(state.unicodeProperties.nonBinary, name))
      { state.raise("Invalid property name"); }
    if (!state.unicodeProperties.nonBinary[name].test(value))
      { state.raise("Invalid property value"); }
  };
  pp$1.regexp_validateUnicodePropertyNameOrValue = function(state, nameOrValue) {
    if (!state.unicodeProperties.binary.test(nameOrValue))
      { state.raise("Invalid property name"); }
  };

  // UnicodePropertyName ::
  //   UnicodePropertyNameCharacters
  pp$1.regexp_eatUnicodePropertyName = function(state) {
    var ch = 0;
    state.lastStringValue = "";
    while (isUnicodePropertyNameCharacter(ch = state.current())) {
      state.lastStringValue += codePointToString(ch);
      state.advance();
    }
    return state.lastStringValue !== ""
  };
  function isUnicodePropertyNameCharacter(ch) {
    return isControlLetter(ch) || ch === 0x5F /* _ */
  }

  // UnicodePropertyValue ::
  //   UnicodePropertyValueCharacters
  pp$1.regexp_eatUnicodePropertyValue = function(state) {
    var ch = 0;
    state.lastStringValue = "";
    while (isUnicodePropertyValueCharacter(ch = state.current())) {
      state.lastStringValue += codePointToString(ch);
      state.advance();
    }
    return state.lastStringValue !== ""
  };
  function isUnicodePropertyValueCharacter(ch) {
    return isUnicodePropertyNameCharacter(ch) || isDecimalDigit(ch)
  }

  // LoneUnicodePropertyNameOrValue ::
  //   UnicodePropertyValueCharacters
  pp$1.regexp_eatLoneUnicodePropertyNameOrValue = function(state) {
    return this.regexp_eatUnicodePropertyValue(state)
  };

  // https://www.ecma-international.org/ecma-262/8.0/#prod-CharacterClass
  pp$1.regexp_eatCharacterClass = function(state) {
    if (state.eat(0x5B /* [ */)) {
      state.eat(0x5E /* ^ */);
      this.regexp_classRanges(state);
      if (state.eat(0x5D /* ] */)) {
        return true
      }
      // Unreachable since it threw "unterminated regular expression" error before.
      state.raise("Unterminated character class");
    }
    return false
  };

  // https://www.ecma-international.org/ecma-262/8.0/#prod-ClassRanges
  // https://www.ecma-international.org/ecma-262/8.0/#prod-NonemptyClassRanges
  // https://www.ecma-international.org/ecma-262/8.0/#prod-NonemptyClassRangesNoDash
  pp$1.regexp_classRanges = function(state) {
    while (this.regexp_eatClassAtom(state)) {
      var left = state.lastIntValue;
      if (state.eat(0x2D /* - */) && this.regexp_eatClassAtom(state)) {
        var right = state.lastIntValue;
        if (state.switchU && (left === -1 || right === -1)) {
          state.raise("Invalid character class");
        }
        if (left !== -1 && right !== -1 && left > right) {
          state.raise("Range out of order in character class");
        }
      }
    }
  };

  // https://www.ecma-international.org/ecma-262/8.0/#prod-ClassAtom
  // https://www.ecma-international.org/ecma-262/8.0/#prod-ClassAtomNoDash
  pp$1.regexp_eatClassAtom = function(state) {
    var start = state.pos;

    if (state.eat(0x5C /* \ */)) {
      if (this.regexp_eatClassEscape(state)) {
        return true
      }
      if (state.switchU) {
        // Make the same message as V8.
        var ch$1 = state.current();
        if (ch$1 === 0x63 /* c */ || isOctalDigit(ch$1)) {
          state.raise("Invalid class escape");
        }
        state.raise("Invalid escape");
      }
      state.pos = start;
    }

    var ch = state.current();
    if (ch !== 0x5D /* ] */) {
      state.lastIntValue = ch;
      state.advance();
      return true
    }

    return false
  };

  // https://www.ecma-international.org/ecma-262/8.0/#prod-annexB-ClassEscape
  pp$1.regexp_eatClassEscape = function(state) {
    var start = state.pos;

    if (state.eat(0x62 /* b */)) {
      state.lastIntValue = 0x08; /* <BS> */
      return true
    }

    if (state.switchU && state.eat(0x2D /* - */)) {
      state.lastIntValue = 0x2D; /* - */
      return true
    }

    if (!state.switchU && state.eat(0x63 /* c */)) {
      if (this.regexp_eatClassControlLetter(state)) {
        return true
      }
      state.pos = start;
    }

    return (
      this.regexp_eatCharacterClassEscape(state) ||
      this.regexp_eatCharacterEscape(state)
    )
  };

  // https://www.ecma-international.org/ecma-262/8.0/#prod-annexB-ClassControlLetter
  pp$1.regexp_eatClassControlLetter = function(state) {
    var ch = state.current();
    if (isDecimalDigit(ch) || ch === 0x5F /* _ */) {
      state.lastIntValue = ch % 0x20;
      state.advance();
      return true
    }
    return false
  };

  // https://www.ecma-international.org/ecma-262/8.0/#prod-HexEscapeSequence
  pp$1.regexp_eatHexEscapeSequence = function(state) {
    var start = state.pos;
    if (state.eat(0x78 /* x */)) {
      if (this.regexp_eatFixedHexDigits(state, 2)) {
        return true
      }
      if (state.switchU) {
        state.raise("Invalid escape");
      }
      state.pos = start;
    }
    return false
  };

  // https://www.ecma-international.org/ecma-262/8.0/#prod-DecimalDigits
  pp$1.regexp_eatDecimalDigits = function(state) {
    var start = state.pos;
    var ch = 0;
    state.lastIntValue = 0;
    while (isDecimalDigit(ch = state.current())) {
      state.lastIntValue = 10 * state.lastIntValue + (ch - 0x30 /* 0 */);
      state.advance();
    }
    return state.pos !== start
  };
  function isDecimalDigit(ch) {
    return ch >= 0x30 /* 0 */ && ch <= 0x39 /* 9 */
  }

  // https://www.ecma-international.org/ecma-262/8.0/#prod-HexDigits
  pp$1.regexp_eatHexDigits = function(state) {
    var start = state.pos;
    var ch = 0;
    state.lastIntValue = 0;
    while (isHexDigit(ch = state.current())) {
      state.lastIntValue = 16 * state.lastIntValue + hexToInt(ch);
      state.advance();
    }
    return state.pos !== start
  };
  function isHexDigit(ch) {
    return (
      (ch >= 0x30 /* 0 */ && ch <= 0x39 /* 9 */) ||
      (ch >= 0x41 /* A */ && ch <= 0x46 /* F */) ||
      (ch >= 0x61 /* a */ && ch <= 0x66 /* f */)
    )
  }
  function hexToInt(ch) {
    if (ch >= 0x41 /* A */ && ch <= 0x46 /* F */) {
      return 10 + (ch - 0x41 /* A */)
    }
    if (ch >= 0x61 /* a */ && ch <= 0x66 /* f */) {
      return 10 + (ch - 0x61 /* a */)
    }
    return ch - 0x30 /* 0 */
  }

  // https://www.ecma-international.org/ecma-262/8.0/#prod-annexB-LegacyOctalEscapeSequence
  // Allows only 0-377(octal) i.e. 0-255(decimal).
  pp$1.regexp_eatLegacyOctalEscapeSequence = function(state) {
    if (this.regexp_eatOctalDigit(state)) {
      var n1 = state.lastIntValue;
      if (this.regexp_eatOctalDigit(state)) {
        var n2 = state.lastIntValue;
        if (n1 <= 3 && this.regexp_eatOctalDigit(state)) {
          state.lastIntValue = n1 * 64 + n2 * 8 + state.lastIntValue;
        } else {
          state.lastIntValue = n1 * 8 + n2;
        }
      } else {
        state.lastIntValue = n1;
      }
      return true
    }
    return false
  };

  // https://www.ecma-international.org/ecma-262/8.0/#prod-OctalDigit
  pp$1.regexp_eatOctalDigit = function(state) {
    var ch = state.current();
    if (isOctalDigit(ch)) {
      state.lastIntValue = ch - 0x30; /* 0 */
      state.advance();
      return true
    }
    state.lastIntValue = 0;
    return false
  };
  function isOctalDigit(ch) {
    return ch >= 0x30 /* 0 */ && ch <= 0x37 /* 7 */
  }

  // https://www.ecma-international.org/ecma-262/8.0/#prod-Hex4Digits
  // https://www.ecma-international.org/ecma-262/8.0/#prod-HexDigit
  // And HexDigit HexDigit in https://www.ecma-international.org/ecma-262/8.0/#prod-HexEscapeSequence
  pp$1.regexp_eatFixedHexDigits = function(state, length) {
    var start = state.pos;
    state.lastIntValue = 0;
    for (var i = 0; i < length; ++i) {
      var ch = state.current();
      if (!isHexDigit(ch)) {
        state.pos = start;
        return false
      }
      state.lastIntValue = 16 * state.lastIntValue + hexToInt(ch);
      state.advance();
    }
    return true
  };

  // Object type used to represent tokens. Note that normally, tokens
  // simply exist as properties on the parser object. This is only
  // used for the onToken callback and the external tokenizer.

  var Token = function Token(p) {
    this.type = p.type;
    this.value = p.value;
    this.start = p.start;
    this.end = p.end;
    if (p.options.locations)
      { this.loc = new SourceLocation(p, p.startLoc, p.endLoc); }
    if (p.options.ranges)
      { this.range = [p.start, p.end]; }
  };

  // ## Tokenizer

  var pp = Parser.prototype;

  // Move to the next token

  pp.next = function(ignoreEscapeSequenceInKeyword) {
    if (!ignoreEscapeSequenceInKeyword && this.type.keyword && this.containsEsc)
      { this.raiseRecoverable(this.start, "Escape sequence in keyword " + this.type.keyword); }
    if (this.options.onToken)
      { this.options.onToken(new Token(this)); }

    this.lastTokEnd = this.end;
    this.lastTokStart = this.start;
    this.lastTokEndLoc = this.endLoc;
    this.lastTokStartLoc = this.startLoc;
    this.nextToken();
  };

  pp.getToken = function() {
    this.next();
    return new Token(this)
  };

  // If we're in an ES6 environment, make parsers iterable
  if (typeof Symbol !== "undefined")
    { pp[Symbol.iterator] = function() {
      var this$1$1 = this;

      return {
        next: function () {
          var token = this$1$1.getToken();
          return {
            done: token.type === types$1.eof,
            value: token
          }
        }
      }
    }; }

  // Toggle strict mode. Re-reads the next number or string to please
  // pedantic tests (`"use strict"; 010;` should fail).

  // Read a single token, updating the parser object's token-related
  // properties.

  pp.nextToken = function() {
    var curContext = this.curContext();
    if (!curContext || !curContext.preserveSpace) { this.skipSpace(); }

    this.start = this.pos;
    if (this.options.locations) { this.startLoc = this.curPosition(); }
    if (this.pos >= this.input.length) { return this.finishToken(types$1.eof) }

    if (curContext.override) { return curContext.override(this) }
    else { this.readToken(this.fullCharCodeAtPos()); }
  };

  pp.readToken = function(code) {
    // Identifier or keyword. '\uXXXX' sequences are allowed in
    // identifiers, so '\' also dispatches to that.
    if (isIdentifierStart(code, this.options.ecmaVersion >= 6) || code === 92 /* '\' */)
      { return this.readWord() }

    return this.getTokenFromCode(code)
  };

  pp.fullCharCodeAtPos = function() {
    var code = this.input.charCodeAt(this.pos);
    if (code <= 0xd7ff || code >= 0xdc00) { return code }
    var next = this.input.charCodeAt(this.pos + 1);
    return next <= 0xdbff || next >= 0xe000 ? code : (code << 10) + next - 0x35fdc00
  };

  pp.skipBlockComment = function() {
    var startLoc = this.options.onComment && this.curPosition();
    var start = this.pos, end = this.input.indexOf("*/", this.pos += 2);
    if (end === -1) { this.raise(this.pos - 2, "Unterminated comment"); }
    this.pos = end + 2;
    if (this.options.locations) {
      for (var nextBreak = (void 0), pos = start; (nextBreak = nextLineBreak(this.input, pos, this.pos)) > -1;) {
        ++this.curLine;
        pos = this.lineStart = nextBreak;
      }
    }
    if (this.options.onComment)
      { this.options.onComment(true, this.input.slice(start + 2, end), start, this.pos,
                             startLoc, this.curPosition()); }
  };

  pp.skipLineComment = function(startSkip) {
    var start = this.pos;
    var startLoc = this.options.onComment && this.curPosition();
    var ch = this.input.charCodeAt(this.pos += startSkip);
    while (this.pos < this.input.length && !isNewLine(ch)) {
      ch = this.input.charCodeAt(++this.pos);
    }
    if (this.options.onComment)
      { this.options.onComment(false, this.input.slice(start + startSkip, this.pos), start, this.pos,
                             startLoc, this.curPosition()); }
  };

  // Called at the start of the parse and after every token. Skips
  // whitespace and comments, and.

  pp.skipSpace = function() {
    loop: while (this.pos < this.input.length) {
      var ch = this.input.charCodeAt(this.pos);
      switch (ch) {
      case 32: case 160: // ' '
        ++this.pos;
        break
      case 13:
        if (this.input.charCodeAt(this.pos + 1) === 10) {
          ++this.pos;
        }
      case 10: case 8232: case 8233:
        ++this.pos;
        if (this.options.locations) {
          ++this.curLine;
          this.lineStart = this.pos;
        }
        break
      case 47: // '/'
        switch (this.input.charCodeAt(this.pos + 1)) {
        case 42: // '*'
          this.skipBlockComment();
          break
        case 47:
          this.skipLineComment(2);
          break
        default:
          break loop
        }
        break
      default:
        if (ch > 8 && ch < 14 || ch >= 5760 && nonASCIIwhitespace.test(String.fromCharCode(ch))) {
          ++this.pos;
        } else {
          break loop
        }
      }
    }
  };

  // Called at the end of every token. Sets `end`, `val`, and
  // maintains `context` and `exprAllowed`, and skips the space after
  // the token, so that the next one's `start` will point at the
  // right position.

  pp.finishToken = function(type, val) {
    this.end = this.pos;
    if (this.options.locations) { this.endLoc = this.curPosition(); }
    var prevType = this.type;
    this.type = type;
    this.value = val;

    this.updateContext(prevType);
  };

  // ### Token reading

  // This is the function that is called to fetch the next token. It
  // is somewhat obscure, because it works in character codes rather
  // than characters, and because operator parsing has been inlined
  // into it.
  //
  // All in the name of speed.
  //
  pp.readToken_dot = function() {
    var next = this.input.charCodeAt(this.pos + 1);
    if (next >= 48 && next <= 57) { return this.readNumber(true) }
    var next2 = this.input.charCodeAt(this.pos + 2);
    if (this.options.ecmaVersion >= 6 && next === 46 && next2 === 46) { // 46 = dot '.'
      this.pos += 3;
      return this.finishToken(types$1.ellipsis)
    } else {
      ++this.pos;
      return this.finishToken(types$1.dot)
    }
  };

  pp.readToken_slash = function() { // '/'
    var next = this.input.charCodeAt(this.pos + 1);
    if (this.exprAllowed) { ++this.pos; return this.readRegexp() }
    if (next === 61) { return this.finishOp(types$1.assign, 2) }
    return this.finishOp(types$1.slash, 1)
  };

  pp.readToken_mult_modulo_exp = function(code) { // '%*'
    var next = this.input.charCodeAt(this.pos + 1);
    var size = 1;
    var tokentype = code === 42 ? types$1.star : types$1.modulo;

    // exponentiation operator ** and **=
    if (this.options.ecmaVersion >= 7 && code === 42 && next === 42) {
      ++size;
      tokentype = types$1.starstar;
      next = this.input.charCodeAt(this.pos + 2);
    }

    if (next === 61) { return this.finishOp(types$1.assign, size + 1) }
    return this.finishOp(tokentype, size)
  };

  pp.readToken_pipe_amp = function(code) { // '|&'
    var next = this.input.charCodeAt(this.pos + 1);
    if (next === code) {
      if (this.options.ecmaVersion >= 12) {
        var next2 = this.input.charCodeAt(this.pos + 2);
        if (next2 === 61) { return this.finishOp(types$1.assign, 3) }
      }
      return this.finishOp(code === 124 ? types$1.logicalOR : types$1.logicalAND, 2)
    }
    if (next === 61) { return this.finishOp(types$1.assign, 2) }
    return this.finishOp(code === 124 ? types$1.bitwiseOR : types$1.bitwiseAND, 1)
  };

  pp.readToken_caret = function() { // '^'
    var next = this.input.charCodeAt(this.pos + 1);
    if (next === 61) { return this.finishOp(types$1.assign, 2) }
    return this.finishOp(types$1.bitwiseXOR, 1)
  };

  pp.readToken_plus_min = function(code) { // '+-'
    var next = this.input.charCodeAt(this.pos + 1);
    if (next === code) {
      if (next === 45 && !this.inModule && this.input.charCodeAt(this.pos + 2) === 62 &&
          (this.lastTokEnd === 0 || lineBreak.test(this.input.slice(this.lastTokEnd, this.pos)))) {
        // A `-->` line comment
        this.skipLineComment(3);
        this.skipSpace();
        return this.nextToken()
      }
      return this.finishOp(types$1.incDec, 2)
    }
    if (next === 61) { return this.finishOp(types$1.assign, 2) }
    return this.finishOp(types$1.plusMin, 1)
  };

  pp.readToken_lt_gt = function(code) { // '<>'
    var next = this.input.charCodeAt(this.pos + 1);
    var size = 1;
    if (next === code) {
      size = code === 62 && this.input.charCodeAt(this.pos + 2) === 62 ? 3 : 2;
      if (this.input.charCodeAt(this.pos + size) === 61) { return this.finishOp(types$1.assign, size + 1) }
      return this.finishOp(types$1.bitShift, size)
    }
    if (next === 33 && code === 60 && !this.inModule && this.input.charCodeAt(this.pos + 2) === 45 &&
        this.input.charCodeAt(this.pos + 3) === 45) {
      // `<!--`, an XML-style comment that should be interpreted as a line comment
      this.skipLineComment(4);
      this.skipSpace();
      return this.nextToken()
    }
    if (next === 61) { size = 2; }
    return this.finishOp(types$1.relational, size)
  };

  pp.readToken_eq_excl = function(code) { // '=!'
    var next = this.input.charCodeAt(this.pos + 1);
    if (next === 61) { return this.finishOp(types$1.equality, this.input.charCodeAt(this.pos + 2) === 61 ? 3 : 2) }
    if (code === 61 && next === 62 && this.options.ecmaVersion >= 6) { // '=>'
      this.pos += 2;
      return this.finishToken(types$1.arrow)
    }
    return this.finishOp(code === 61 ? types$1.eq : types$1.prefix, 1)
  };

  pp.readToken_question = function() { // '?'
    var ecmaVersion = this.options.ecmaVersion;
    if (ecmaVersion >= 11) {
      var next = this.input.charCodeAt(this.pos + 1);
      if (next === 46) {
        var next2 = this.input.charCodeAt(this.pos + 2);
        if (next2 < 48 || next2 > 57) { return this.finishOp(types$1.questionDot, 2) }
      }
      if (next === 63) {
        if (ecmaVersion >= 12) {
          var next2$1 = this.input.charCodeAt(this.pos + 2);
          if (next2$1 === 61) { return this.finishOp(types$1.assign, 3) }
        }
        return this.finishOp(types$1.coalesce, 2)
      }
    }
    return this.finishOp(types$1.question, 1)
  };

  pp.readToken_numberSign = function() { // '#'
    var ecmaVersion = this.options.ecmaVersion;
    var code = 35; // '#'
    if (ecmaVersion >= 13) {
      ++this.pos;
      code = this.fullCharCodeAtPos();
      if (isIdentifierStart(code, true) || code === 92 /* '\' */) {
        return this.finishToken(types$1.privateId, this.readWord1())
      }
    }

    this.raise(this.pos, "Unexpected character '" + codePointToString(code) + "'");
  };

  pp.getTokenFromCode = function(code) {
    switch (code) {
    // The interpretation of a dot depends on whether it is followed
    // by a digit or another two dots.
    case 46: // '.'
      return this.readToken_dot()

    // Punctuation tokens.
    case 40: ++this.pos; return this.finishToken(types$1.parenL)
    case 41: ++this.pos; return this.finishToken(types$1.parenR)
    case 59: ++this.pos; return this.finishToken(types$1.semi)
    case 44: ++this.pos; return this.finishToken(types$1.comma)
    case 91: ++this.pos; return this.finishToken(types$1.bracketL)
    case 93: ++this.pos; return this.finishToken(types$1.bracketR)
    case 123: ++this.pos; return this.finishToken(types$1.braceL)
    case 125: ++this.pos; return this.finishToken(types$1.braceR)
    case 58: ++this.pos; return this.finishToken(types$1.colon)

    case 96: // '`'
      if (this.options.ecmaVersion < 6) { break }
      ++this.pos;
      return this.finishToken(types$1.backQuote)

    case 48: // '0'
      var next = this.input.charCodeAt(this.pos + 1);
      if (next === 120 || next === 88) { return this.readRadixNumber(16) } // '0x', '0X' - hex number
      if (this.options.ecmaVersion >= 6) {
        if (next === 111 || next === 79) { return this.readRadixNumber(8) } // '0o', '0O' - octal number
        if (next === 98 || next === 66) { return this.readRadixNumber(2) } // '0b', '0B' - binary number
      }

    // Anything else beginning with a digit is an integer, octal
    // number, or float.
    case 49: case 50: case 51: case 52: case 53: case 54: case 55: case 56: case 57: // 1-9
      return this.readNumber(false)

    // Quotes produce strings.
    case 34: case 39: // '"', "'"
      return this.readString(code)

    // Operators are parsed inline in tiny state machines. '=' (61) is
    // often referred to. `finishOp` simply skips the amount of
    // characters it is given as second argument, and returns a token
    // of the type given by its first argument.
    case 47: // '/'
      return this.readToken_slash()

    case 37: case 42: // '%*'
      return this.readToken_mult_modulo_exp(code)

    case 124: case 38: // '|&'
      return this.readToken_pipe_amp(code)

    case 94: // '^'
      return this.readToken_caret()

    case 43: case 45: // '+-'
      return this.readToken_plus_min(code)

    case 60: case 62: // '<>'
      return this.readToken_lt_gt(code)

    case 61: case 33: // '=!'
      return this.readToken_eq_excl(code)

    case 63: // '?'
      return this.readToken_question()

    case 126: // '~'
      return this.finishOp(types$1.prefix, 1)

    case 35: // '#'
      return this.readToken_numberSign()
    }

    this.raise(this.pos, "Unexpected character '" + codePointToString(code) + "'");
  };

  pp.finishOp = function(type, size) {
    var str = this.input.slice(this.pos, this.pos + size);
    this.pos += size;
    return this.finishToken(type, str)
  };

  pp.readRegexp = function() {
    var escaped, inClass, start = this.pos;
    for (;;) {
      if (this.pos >= this.input.length) { this.raise(start, "Unterminated regular expression"); }
      var ch = this.input.charAt(this.pos);
      if (lineBreak.test(ch)) { this.raise(start, "Unterminated regular expression"); }
      if (!escaped) {
        if (ch === "[") { inClass = true; }
        else if (ch === "]" && inClass) { inClass = false; }
        else if (ch === "/" && !inClass) { break }
        escaped = ch === "\\";
      } else { escaped = false; }
      ++this.pos;
    }
    var pattern = this.input.slice(start, this.pos);
    ++this.pos;
    var flagsStart = this.pos;
    var flags = this.readWord1();
    if (this.containsEsc) { this.unexpected(flagsStart); }

    // Validate pattern
    var state = this.regexpState || (this.regexpState = new RegExpValidationState(this));
    state.reset(start, pattern, flags);
    this.validateRegExpFlags(state);
    this.validateRegExpPattern(state);

    // Create Literal#value property value.
    var value = null;
    try {
      value = new RegExp(pattern, flags);
    } catch (e) {
      // ESTree requires null if it failed to instantiate RegExp object.
      // https://github.com/estree/estree/blob/a27003adf4fd7bfad44de9cef372a2eacd527b1c/es5.md#regexpliteral
    }

    return this.finishToken(types$1.regexp, {pattern: pattern, flags: flags, value: value})
  };

  // Read an integer in the given radix. Return null if zero digits
  // were read, the integer value otherwise. When `len` is given, this
  // will return `null` unless the integer has exactly `len` digits.

  pp.readInt = function(radix, len, maybeLegacyOctalNumericLiteral) {
    // `len` is used for character escape sequences. In that case, disallow separators.
    var allowSeparators = this.options.ecmaVersion >= 12 && len === undefined;

    // `maybeLegacyOctalNumericLiteral` is true if it doesn't have prefix (0x,0o,0b)
    // and isn't fraction part nor exponent part. In that case, if the first digit
    // is zero then disallow separators.
    var isLegacyOctalNumericLiteral = maybeLegacyOctalNumericLiteral && this.input.charCodeAt(this.pos) === 48;

    var start = this.pos, total = 0, lastCode = 0;
    for (var i = 0, e = len == null ? Infinity : len; i < e; ++i, ++this.pos) {
      var code = this.input.charCodeAt(this.pos), val = (void 0);

      if (allowSeparators && code === 95) {
        if (isLegacyOctalNumericLiteral) { this.raiseRecoverable(this.pos, "Numeric separator is not allowed in legacy octal numeric literals"); }
        if (lastCode === 95) { this.raiseRecoverable(this.pos, "Numeric separator must be exactly one underscore"); }
        if (i === 0) { this.raiseRecoverable(this.pos, "Numeric separator is not allowed at the first of digits"); }
        lastCode = code;
        continue
      }

      if (code >= 97) { val = code - 97 + 10; } // a
      else if (code >= 65) { val = code - 65 + 10; } // A
      else if (code >= 48 && code <= 57) { val = code - 48; } // 0-9
      else { val = Infinity; }
      if (val >= radix) { break }
      lastCode = code;
      total = total * radix + val;
    }

    if (allowSeparators && lastCode === 95) { this.raiseRecoverable(this.pos - 1, "Numeric separator is not allowed at the last of digits"); }
    if (this.pos === start || len != null && this.pos - start !== len) { return null }

    return total
  };

  function stringToNumber(str, isLegacyOctalNumericLiteral) {
    if (isLegacyOctalNumericLiteral) {
      return parseInt(str, 8)
    }

    // `parseFloat(value)` stops parsing at the first numeric separator then returns a wrong value.
    return parseFloat(str.replace(/_/g, ""))
  }

  function stringToBigInt(str) {
    if (typeof BigInt !== "function") {
      return null
    }

    // `BigInt(value)` throws syntax error if the string contains numeric separators.
    return BigInt(str.replace(/_/g, ""))
  }

  pp.readRadixNumber = function(radix) {
    var start = this.pos;
    this.pos += 2; // 0x
    var val = this.readInt(radix);
    if (val == null) { this.raise(this.start + 2, "Expected number in radix " + radix); }
    if (this.options.ecmaVersion >= 11 && this.input.charCodeAt(this.pos) === 110) {
      val = stringToBigInt(this.input.slice(start, this.pos));
      ++this.pos;
    } else if (isIdentifierStart(this.fullCharCodeAtPos())) { this.raise(this.pos, "Identifier directly after number"); }
    return this.finishToken(types$1.num, val)
  };

  // Read an integer, octal integer, or floating-point number.

  pp.readNumber = function(startsWithDot) {
    var start = this.pos;
    if (!startsWithDot && this.readInt(10, undefined, true) === null) { this.raise(start, "Invalid number"); }
    var octal = this.pos - start >= 2 && this.input.charCodeAt(start) === 48;
    if (octal && this.strict) { this.raise(start, "Invalid number"); }
    var next = this.input.charCodeAt(this.pos);
    if (!octal && !startsWithDot && this.options.ecmaVersion >= 11 && next === 110) {
      var val$1 = stringToBigInt(this.input.slice(start, this.pos));
      ++this.pos;
      if (isIdentifierStart(this.fullCharCodeAtPos())) { this.raise(this.pos, "Identifier directly after number"); }
      return this.finishToken(types$1.num, val$1)
    }
    if (octal && /[89]/.test(this.input.slice(start, this.pos))) { octal = false; }
    if (next === 46 && !octal) { // '.'
      ++this.pos;
      this.readInt(10);
      next = this.input.charCodeAt(this.pos);
    }
    if ((next === 69 || next === 101) && !octal) { // 'eE'
      next = this.input.charCodeAt(++this.pos);
      if (next === 43 || next === 45) { ++this.pos; } // '+-'
      if (this.readInt(10) === null) { this.raise(start, "Invalid number"); }
    }
    if (isIdentifierStart(this.fullCharCodeAtPos())) { this.raise(this.pos, "Identifier directly after number"); }

    var val = stringToNumber(this.input.slice(start, this.pos), octal);
    return this.finishToken(types$1.num, val)
  };

  // Read a string value, interpreting backslash-escapes.

  pp.readCodePoint = function() {
    var ch = this.input.charCodeAt(this.pos), code;

    if (ch === 123) { // '{'
      if (this.options.ecmaVersion < 6) { this.unexpected(); }
      var codePos = ++this.pos;
      code = this.readHexChar(this.input.indexOf("}", this.pos) - this.pos);
      ++this.pos;
      if (code > 0x10FFFF) { this.invalidStringToken(codePos, "Code point out of bounds"); }
    } else {
      code = this.readHexChar(4);
    }
    return code
  };

  pp.readString = function(quote) {
    var out = "", chunkStart = ++this.pos;
    for (;;) {
      if (this.pos >= this.input.length) { this.raise(this.start, "Unterminated string constant"); }
      var ch = this.input.charCodeAt(this.pos);
      if (ch === quote) { break }
      if (ch === 92) { // '\'
        out += this.input.slice(chunkStart, this.pos);
        out += this.readEscapedChar(false);
        chunkStart = this.pos;
      } else if (ch === 0x2028 || ch === 0x2029) {
        if (this.options.ecmaVersion < 10) { this.raise(this.start, "Unterminated string constant"); }
        ++this.pos;
        if (this.options.locations) {
          this.curLine++;
          this.lineStart = this.pos;
        }
      } else {
        if (isNewLine(ch)) { this.raise(this.start, "Unterminated string constant"); }
        ++this.pos;
      }
    }
    out += this.input.slice(chunkStart, this.pos++);
    return this.finishToken(types$1.string, out)
  };

  // Reads template string tokens.

  var INVALID_TEMPLATE_ESCAPE_ERROR = {};

  pp.tryReadTemplateToken = function() {
    this.inTemplateElement = true;
    try {
      this.readTmplToken();
    } catch (err) {
      if (err === INVALID_TEMPLATE_ESCAPE_ERROR) {
        this.readInvalidTemplateToken();
      } else {
        throw err
      }
    }

    this.inTemplateElement = false;
  };

  pp.invalidStringToken = function(position, message) {
    if (this.inTemplateElement && this.options.ecmaVersion >= 9) {
      throw INVALID_TEMPLATE_ESCAPE_ERROR
    } else {
      this.raise(position, message);
    }
  };

  pp.readTmplToken = function() {
    var out = "", chunkStart = this.pos;
    for (;;) {
      if (this.pos >= this.input.length) { this.raise(this.start, "Unterminated template"); }
      var ch = this.input.charCodeAt(this.pos);
      if (ch === 96 || ch === 36 && this.input.charCodeAt(this.pos + 1) === 123) { // '`', '${'
        if (this.pos === this.start && (this.type === types$1.template || this.type === types$1.invalidTemplate)) {
          if (ch === 36) {
            this.pos += 2;
            return this.finishToken(types$1.dollarBraceL)
          } else {
            ++this.pos;
            return this.finishToken(types$1.backQuote)
          }
        }
        out += this.input.slice(chunkStart, this.pos);
        return this.finishToken(types$1.template, out)
      }
      if (ch === 92) { // '\'
        out += this.input.slice(chunkStart, this.pos);
        out += this.readEscapedChar(true);
        chunkStart = this.pos;
      } else if (isNewLine(ch)) {
        out += this.input.slice(chunkStart, this.pos);
        ++this.pos;
        switch (ch) {
        case 13:
          if (this.input.charCodeAt(this.pos) === 10) { ++this.pos; }
        case 10:
          out += "\n";
          break
        default:
          out += String.fromCharCode(ch);
          break
        }
        if (this.options.locations) {
          ++this.curLine;
          this.lineStart = this.pos;
        }
        chunkStart = this.pos;
      } else {
        ++this.pos;
      }
    }
  };

  // Reads a template token to search for the end, without validating any escape sequences
  pp.readInvalidTemplateToken = function() {
    for (; this.pos < this.input.length; this.pos++) {
      switch (this.input[this.pos]) {
      case "\\":
        ++this.pos;
        break

      case "$":
        if (this.input[this.pos + 1] !== "{") {
          break
        }

      // falls through
      case "`":
        return this.finishToken(types$1.invalidTemplate, this.input.slice(this.start, this.pos))

      // no default
      }
    }
    this.raise(this.start, "Unterminated template");
  };

  // Used to read escaped characters

  pp.readEscapedChar = function(inTemplate) {
    var ch = this.input.charCodeAt(++this.pos);
    ++this.pos;
    switch (ch) {
    case 110: return "\n" // 'n' -> '\n'
    case 114: return "\r" // 'r' -> '\r'
    case 120: return String.fromCharCode(this.readHexChar(2)) // 'x'
    case 117: return codePointToString(this.readCodePoint()) // 'u'
    case 116: return "\t" // 't' -> '\t'
    case 98: return "\b" // 'b' -> '\b'
    case 118: return "\u000b" // 'v' -> '\u000b'
    case 102: return "\f" // 'f' -> '\f'
    case 13: if (this.input.charCodeAt(this.pos) === 10) { ++this.pos; } // '\r\n'
    case 10: // ' \n'
      if (this.options.locations) { this.lineStart = this.pos; ++this.curLine; }
      return ""
    case 56:
    case 57:
      if (this.strict) {
        this.invalidStringToken(
          this.pos - 1,
          "Invalid escape sequence"
        );
      }
      if (inTemplate) {
        var codePos = this.pos - 1;

        this.invalidStringToken(
          codePos,
          "Invalid escape sequence in template string"
        );

        return null
      }
    default:
      if (ch >= 48 && ch <= 55) {
        var octalStr = this.input.substr(this.pos - 1, 3).match(/^[0-7]+/)[0];
        var octal = parseInt(octalStr, 8);
        if (octal > 255) {
          octalStr = octalStr.slice(0, -1);
          octal = parseInt(octalStr, 8);
        }
        this.pos += octalStr.length - 1;
        ch = this.input.charCodeAt(this.pos);
        if ((octalStr !== "0" || ch === 56 || ch === 57) && (this.strict || inTemplate)) {
          this.invalidStringToken(
            this.pos - 1 - octalStr.length,
            inTemplate
              ? "Octal literal in template string"
              : "Octal literal in strict mode"
          );
        }
        return String.fromCharCode(octal)
      }
      if (isNewLine(ch)) {
        // Unicode new line characters after \ get removed from output in both
        // template literals and strings
        return ""
      }
      return String.fromCharCode(ch)
    }
  };

  // Used to read character escape sequences ('\x', '\u', '\U').

  pp.readHexChar = function(len) {
    var codePos = this.pos;
    var n = this.readInt(16, len);
    if (n === null) { this.invalidStringToken(codePos, "Bad character escape sequence"); }
    return n
  };

  // Read an identifier, and return it as a string. Sets `this.containsEsc`
  // to whether the word contained a '\u' escape.
  //
  // Incrementally adds only escaped chars, adding other chunks as-is
  // as a micro-optimization.

  pp.readWord1 = function() {
    this.containsEsc = false;
    var word = "", first = true, chunkStart = this.pos;
    var astral = this.options.ecmaVersion >= 6;
    while (this.pos < this.input.length) {
      var ch = this.fullCharCodeAtPos();
      if (isIdentifierChar(ch, astral)) {
        this.pos += ch <= 0xffff ? 1 : 2;
      } else if (ch === 92) { // "\"
        this.containsEsc = true;
        word += this.input.slice(chunkStart, this.pos);
        var escStart = this.pos;
        if (this.input.charCodeAt(++this.pos) !== 117) // "u"
          { this.invalidStringToken(this.pos, "Expecting Unicode escape sequence \\uXXXX"); }
        ++this.pos;
        var esc = this.readCodePoint();
        if (!(first ? isIdentifierStart : isIdentifierChar)(esc, astral))
          { this.invalidStringToken(escStart, "Invalid Unicode escape"); }
        word += codePointToString(esc);
        chunkStart = this.pos;
      } else {
        break
      }
      first = false;
    }
    return word + this.input.slice(chunkStart, this.pos)
  };

  // Read an identifier or keyword token. Will check for reserved
  // words when necessary.

  pp.readWord = function() {
    var word = this.readWord1();
    var type = types$1.name;
    if (this.keywords.test(word)) {
      type = keywords[word];
    }
    return this.finishToken(type, word)
  };

  // Acorn is a tiny, fast JavaScript parser written in JavaScript.

  var version = "8.7.1";

  Parser.acorn = {
    Parser: Parser,
    version: version,
    defaultOptions: defaultOptions,
    Position: Position,
    SourceLocation: SourceLocation,
    getLineInfo: getLineInfo,
    Node: Node,
    TokenType: TokenType,
    tokTypes: types$1,
    keywordTypes: keywords,
    TokContext: TokContext,
    tokContexts: types,
    isIdentifierChar: isIdentifierChar,
    isIdentifierStart: isIdentifierStart,
    Token: Token,
    isNewLine: isNewLine,
    lineBreak: lineBreak,
    lineBreakG: lineBreakG,
    nonASCIIwhitespace: nonASCIIwhitespace
  };

  // The main exported interface (under `self.acorn` when in the
  // browser) is a `parse` function that takes a code string and
  // returns an abstract syntax tree as specified by [Mozilla parser
  // API][api].
  //
  // [api]: https://developer.mozilla.org/en-US/docs/SpiderMonkey/Parser_API

  function parse(input, options) {
    return Parser.parse(input, options)
  }

  // This function tries to parse a single expression at a given
  // offset in a string. Useful for parsing mixed-language formats
  // that embed JavaScript expressions.

  function parseExpressionAt(input, pos, options) {
    return Parser.parseExpressionAt(input, pos, options)
  }

  // Acorn is organized as a tokenizer and a recursive-descent parser.
  // The `tokenizer` export provides an interface to the tokenizer.

  function tokenizer(input, options) {
    return Parser.tokenizer(input, options)
  }

  exports.Node = Node;
  exports.Parser = Parser;
  exports.Position = Position;
  exports.SourceLocation = SourceLocation;
  exports.TokContext = TokContext;
  exports.Token = Token;
  exports.TokenType = TokenType;
  exports.defaultOptions = defaultOptions;
  exports.getLineInfo = getLineInfo;
  exports.isIdentifierChar = isIdentifierChar;
  exports.isIdentifierStart = isIdentifierStart;
  exports.isNewLine = isNewLine;
  exports.keywordTypes = keywords;
  exports.lineBreak = lineBreak;
  exports.lineBreakG = lineBreakG;
  exports.nonASCIIwhitespace = nonASCIIwhitespace;
  exports.parse = parse;
  exports.parseExpressionAt = parseExpressionAt;
  exports.tokContexts = types;
  exports.tokTypes = types$1;
  exports.tokenizer = tokenizer;
  exports.version = version;

  Object.defineProperty(exports, '__esModule', { value: true });

}));

},{}],14:[function(require,module,exports){
/**
 * A JavaScript implementation of the SHA family of hashes - defined in FIPS PUB 180-4, FIPS PUB 202,
 * and SP 800-185 - as well as the corresponding HMAC implementation as defined in FIPS PUB 198-1.
 *
 * Copyright 2008-2023 Brian Turek, 1998-2009 Paul Johnston & Contributors
 * Distributed under the BSD License
 * See http://caligatio.github.com/jsSHA/ for more information
 *
 * Two ECMAScript polyfill functions carry the following license:
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, EITHER EXPRESS OR IMPLIED,
 * INCLUDING WITHOUT LIMITATION ANY IMPLIED WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
 * MERCHANTABLITY OR NON-INFRINGEMENT.
 *
 * See the Apache Version 2.0 License for specific language governing permissions and limitations under the License.
 */
!function(n,r){"object"==typeof exports&&"undefined"!=typeof module?module.exports=r():"function"==typeof define&&define.amd?define(r):(n="undefined"!=typeof globalThis?globalThis:n||self).jsSHA=r()}(this,(function(){"use strict";var n="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",r="ARRAYBUFFER not supported by this environment",t="UINT8ARRAY not supported by this environment";function e(n,r,t,e){var i,o,u,f=r||[0],s=(t=t||0)>>>3,w=-1===e?3:0;for(i=0;i<n.length;i+=1)o=(u=i+s)>>>2,f.length<=o&&f.push(0),f[o]|=n[i]<<8*(w+e*(u%4));return{value:f,binLen:8*n.length+t}}function i(i,o,u){switch(o){case"UTF8":case"UTF16BE":case"UTF16LE":break;default:throw new Error("encoding must be UTF8, UTF16BE, or UTF16LE")}switch(i){case"HEX":return function(n,r,t){return function(n,r,t,e){var i,o,u,f;if(0!=n.length%2)throw new Error("String of HEX type must be in byte increments");var s=r||[0],w=(t=t||0)>>>3,a=-1===e?3:0;for(i=0;i<n.length;i+=2){if(o=parseInt(n.substr(i,2),16),isNaN(o))throw new Error("String of HEX type contains invalid characters");for(u=(f=(i>>>1)+w)>>>2;s.length<=u;)s.push(0);s[u]|=o<<8*(a+e*(f%4))}return{value:s,binLen:4*n.length+t}}(n,r,t,u)};case"TEXT":return function(n,r,t){return function(n,r,t,e,i){var o,u,f,s,w,a,h,c,v=0,A=t||[0],E=(e=e||0)>>>3;if("UTF8"===r)for(h=-1===i?3:0,f=0;f<n.length;f+=1)for(u=[],128>(o=n.charCodeAt(f))?u.push(o):2048>o?(u.push(192|o>>>6),u.push(128|63&o)):55296>o||57344<=o?u.push(224|o>>>12,128|o>>>6&63,128|63&o):(f+=1,o=65536+((1023&o)<<10|1023&n.charCodeAt(f)),u.push(240|o>>>18,128|o>>>12&63,128|o>>>6&63,128|63&o)),s=0;s<u.length;s+=1){for(w=(a=v+E)>>>2;A.length<=w;)A.push(0);A[w]|=u[s]<<8*(h+i*(a%4)),v+=1}else for(h=-1===i?2:0,c="UTF16LE"===r&&1!==i||"UTF16LE"!==r&&1===i,f=0;f<n.length;f+=1){for(o=n.charCodeAt(f),!0===c&&(o=(s=255&o)<<8|o>>>8),w=(a=v+E)>>>2;A.length<=w;)A.push(0);A[w]|=o<<8*(h+i*(a%4)),v+=2}return{value:A,binLen:8*v+e}}(n,o,r,t,u)};case"B64":return function(r,t,e){return function(r,t,e,i){var o,u,f,s,w,a,h=0,c=t||[0],v=(e=e||0)>>>3,A=-1===i?3:0,E=r.indexOf("=");if(-1===r.search(/^[a-zA-Z0-9=+/]+$/))throw new Error("Invalid character in base-64 string");if(r=r.replace(/=/g,""),-1!==E&&E<r.length)throw new Error("Invalid '=' found in base-64 string");for(o=0;o<r.length;o+=4){for(s=r.substr(o,4),f=0,u=0;u<s.length;u+=1)f|=n.indexOf(s.charAt(u))<<18-6*u;for(u=0;u<s.length-1;u+=1){for(w=(a=h+v)>>>2;c.length<=w;)c.push(0);c[w]|=(f>>>16-8*u&255)<<8*(A+i*(a%4)),h+=1}}return{value:c,binLen:8*h+e}}(r,t,e,u)};case"BYTES":return function(n,r,t){return function(n,r,t,e){var i,o,u,f,s=r||[0],w=(t=t||0)>>>3,a=-1===e?3:0;for(o=0;o<n.length;o+=1)i=n.charCodeAt(o),u=(f=o+w)>>>2,s.length<=u&&s.push(0),s[u]|=i<<8*(a+e*(f%4));return{value:s,binLen:8*n.length+t}}(n,r,t,u)};case"ARRAYBUFFER":try{new ArrayBuffer(0)}catch(n){throw new Error(r)}return function(n,r,t){return function(n,r,t,i){return e(new Uint8Array(n),r,t,i)}(n,r,t,u)};case"UINT8ARRAY":try{new Uint8Array(0)}catch(n){throw new Error(t)}return function(n,r,t){return e(n,r,t,u)};default:throw new Error("format must be HEX, TEXT, B64, BYTES, ARRAYBUFFER, or UINT8ARRAY")}}function o(e,i,o,u){switch(e){case"HEX":return function(n){return function(n,r,t,e){var i,o,u="0123456789abcdef",f="",s=r/8,w=-1===t?3:0;for(i=0;i<s;i+=1)o=n[i>>>2]>>>8*(w+t*(i%4)),f+=u.charAt(o>>>4&15)+u.charAt(15&o);return e.outputUpper?f.toUpperCase():f}(n,i,o,u)};case"B64":return function(r){return function(r,t,e,i){var o,u,f,s,w,a="",h=t/8,c=-1===e?3:0;for(o=0;o<h;o+=3)for(s=o+1<h?r[o+1>>>2]:0,w=o+2<h?r[o+2>>>2]:0,f=(r[o>>>2]>>>8*(c+e*(o%4))&255)<<16|(s>>>8*(c+e*((o+1)%4))&255)<<8|w>>>8*(c+e*((o+2)%4))&255,u=0;u<4;u+=1)a+=8*o+6*u<=t?n.charAt(f>>>6*(3-u)&63):i.b64Pad;return a}(r,i,o,u)};case"BYTES":return function(n){return function(n,r,t){var e,i,o="",u=r/8,f=-1===t?3:0;for(e=0;e<u;e+=1)i=n[e>>>2]>>>8*(f+t*(e%4))&255,o+=String.fromCharCode(i);return o}(n,i,o)};case"ARRAYBUFFER":try{new ArrayBuffer(0)}catch(n){throw new Error(r)}return function(n){return function(n,r,t){var e,i=r/8,o=new ArrayBuffer(i),u=new Uint8Array(o),f=-1===t?3:0;for(e=0;e<i;e+=1)u[e]=n[e>>>2]>>>8*(f+t*(e%4))&255;return o}(n,i,o)};case"UINT8ARRAY":try{new Uint8Array(0)}catch(n){throw new Error(t)}return function(n){return function(n,r,t){var e,i=r/8,o=-1===t?3:0,u=new Uint8Array(i);for(e=0;e<i;e+=1)u[e]=n[e>>>2]>>>8*(o+t*(e%4))&255;return u}(n,i,o)};default:throw new Error("format must be HEX, B64, BYTES, ARRAYBUFFER, or UINT8ARRAY")}}var u=4294967296,f=[1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298],s=[3238371032,914150663,812702999,4144912697,4290775857,1750603025,1694076839,3204075428],w=[1779033703,3144134277,1013904242,2773480762,1359893119,2600822924,528734635,1541459225],a="Chosen SHA variant is not supported",h="Cannot set numRounds with MAC";function c(n,r){var t,e,i=n.binLen>>>3,o=r.binLen>>>3,u=i<<3,f=4-i<<3;if(i%4!=0){for(t=0;t<o;t+=4)e=i+t>>>2,n.value[e]|=r.value[t>>>2]<<u,n.value.push(0),n.value[e+1]|=r.value[t>>>2]>>>f;return(n.value.length<<2)-4>=o+i&&n.value.pop(),{value:n.value,binLen:n.binLen+r.binLen}}return{value:n.value.concat(r.value),binLen:n.binLen+r.binLen}}function v(n){var r={outputUpper:!1,b64Pad:"=",outputLen:-1},t=n||{},e="Output length must be a multiple of 8";if(r.outputUpper=t.outputUpper||!1,t.b64Pad&&(r.b64Pad=t.b64Pad),t.outputLen){if(t.outputLen%8!=0)throw new Error(e);r.outputLen=t.outputLen}else if(t.shakeLen){if(t.shakeLen%8!=0)throw new Error(e);r.outputLen=t.shakeLen}if("boolean"!=typeof r.outputUpper)throw new Error("Invalid outputUpper formatting option");if("string"!=typeof r.b64Pad)throw new Error("Invalid b64Pad formatting option");return r}function A(n,r,t,e){var o=n+" must include a value and format";if(!r){if(!e)throw new Error(o);return e}if(void 0===r.value||!r.format)throw new Error(o);return i(r.format,r.encoding||"UTF8",t)(r.value)}var E=function(){function n(n,r,t){var e=t||{};if(this.t=r,this.i=e.encoding||"UTF8",this.numRounds=e.numRounds||1,isNaN(this.numRounds)||this.numRounds!==parseInt(this.numRounds,10)||1>this.numRounds)throw new Error("numRounds must a integer >= 1");this.o=n,this.u=[],this.h=0,this.v=!1,this.A=0,this.l=!1,this.S=[],this.H=[]}return n.prototype.update=function(n){var r,t=0,e=this.p>>>5,i=this.m(n,this.u,this.h),o=i.binLen,u=i.value,f=o>>>5;for(r=0;r<f;r+=e)t+this.p<=o&&(this.U=this.R(u.slice(r,r+e),this.U),t+=this.p);return this.A+=t,this.u=u.slice(t>>>5),this.h=o%this.p,this.v=!0,this},n.prototype.getHash=function(n,r){var t,e,i=this.T,u=v(r);if(this.C){if(-1===u.outputLen)throw new Error("Output length must be specified in options");i=u.outputLen}var f=o(n,i,this.F,u);if(this.l&&this.K)return f(this.K(u));for(e=this.g(this.u.slice(),this.h,this.A,this.L(this.U),i),t=1;t<this.numRounds;t+=1)this.C&&i%32!=0&&(e[e.length-1]&=16777215>>>24-i%32),e=this.g(e,i,0,this.B(this.o),i);return f(e)},n.prototype.setHMACKey=function(n,r,t){if(!this.k)throw new Error("Variant does not support HMAC");if(this.v)throw new Error("Cannot set MAC key after calling update");var e=i(r,(t||{}).encoding||"UTF8",this.F);this.Y(e(n))},n.prototype.Y=function(n){var r,t=this.p>>>3,e=t/4-1;if(1!==this.numRounds)throw new Error(h);if(this.l)throw new Error("MAC key already set");for(t<n.binLen/8&&(n.value=this.g(n.value,n.binLen,0,this.B(this.o),this.T));n.value.length<=e;)n.value.push(0);for(r=0;r<=e;r+=1)this.S[r]=909522486^n.value[r],this.H[r]=1549556828^n.value[r];this.U=this.R(this.S,this.U),this.A=this.p,this.l=!0},n.prototype.getHMAC=function(n,r){var t=v(r);return o(n,this.T,this.F,t)(this.N())},n.prototype.N=function(){var n;if(!this.l)throw new Error("Cannot call getHMAC without first setting MAC key");var r=this.g(this.u.slice(),this.h,this.A,this.L(this.U),this.T);return n=this.R(this.H,this.B(this.o)),n=this.g(r,this.T,this.p,n,this.T)},n}(),l=function(n,r){return l=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(n,r){n.__proto__=r}||function(n,r){for(var t in r)Object.prototype.hasOwnProperty.call(r,t)&&(n[t]=r[t])},l(n,r)};function b(n,r){if("function"!=typeof r&&null!==r)throw new TypeError("Class extends value "+String(r)+" is not a constructor or null");function t(){this.constructor=n}l(n,r),n.prototype=null===r?Object.create(r):(t.prototype=r.prototype,new t)}function S(n,r){return n<<r|n>>>32-r}function H(n,r){return n>>>r|n<<32-r}function d(n,r){return n>>>r}function p(n,r,t){return n^r^t}function y(n,r,t){return n&r^~n&t}function m(n,r,t){return n&r^n&t^r&t}function U(n){return H(n,2)^H(n,13)^H(n,22)}function R(n,r){var t=(65535&n)+(65535&r);return(65535&(n>>>16)+(r>>>16)+(t>>>16))<<16|65535&t}function T(n,r,t,e){var i=(65535&n)+(65535&r)+(65535&t)+(65535&e);return(65535&(n>>>16)+(r>>>16)+(t>>>16)+(e>>>16)+(i>>>16))<<16|65535&i}function C(n,r,t,e,i){var o=(65535&n)+(65535&r)+(65535&t)+(65535&e)+(65535&i);return(65535&(n>>>16)+(r>>>16)+(t>>>16)+(e>>>16)+(i>>>16)+(o>>>16))<<16|65535&o}function F(n){return H(n,7)^H(n,18)^d(n,3)}function K(n){return H(n,6)^H(n,11)^H(n,25)}function g(n){return[1732584193,4023233417,2562383102,271733878,3285377520]}function L(n,r){var t,e,i,o,u,f,s,w=[];for(t=r[0],e=r[1],i=r[2],o=r[3],u=r[4],s=0;s<80;s+=1)w[s]=s<16?n[s]:S(w[s-3]^w[s-8]^w[s-14]^w[s-16],1),f=s<20?C(S(t,5),y(e,i,o),u,1518500249,w[s]):s<40?C(S(t,5),p(e,i,o),u,1859775393,w[s]):s<60?C(S(t,5),m(e,i,o),u,2400959708,w[s]):C(S(t,5),p(e,i,o),u,3395469782,w[s]),u=o,o=i,i=S(e,30),e=t,t=f;return r[0]=R(t,r[0]),r[1]=R(e,r[1]),r[2]=R(i,r[2]),r[3]=R(o,r[3]),r[4]=R(u,r[4]),r}function B(n,r,t,e){for(var i,o=15+(r+65>>>9<<4),f=r+t;n.length<=o;)n.push(0);for(n[r>>>5]|=128<<24-r%32,n[o]=4294967295&f,n[o-1]=f/u|0,i=0;i<n.length;i+=16)e=L(n.slice(i,i+16),e);return e}"function"==typeof SuppressedError&&SuppressedError;var k=function(n){function r(r,t,e){var o=this;if("SHA-1"!==r)throw new Error(a);var u=e||{};return(o=n.call(this,r,t,e)||this).k=!0,o.K=o.N,o.F=-1,o.m=i(o.t,o.i,o.F),o.R=L,o.L=function(n){return n.slice()},o.B=g,o.g=B,o.U=[1732584193,4023233417,2562383102,271733878,3285377520],o.p=512,o.T=160,o.C=!1,u.hmacKey&&o.Y(A("hmacKey",u.hmacKey,o.F)),o}return b(r,n),r}(E);function Y(n){return"SHA-224"==n?s.slice():w.slice()}function N(n,r){var t,e,i,o,u,s,w,a,h,c,v,A,E=[];for(t=r[0],e=r[1],i=r[2],o=r[3],u=r[4],s=r[5],w=r[6],a=r[7],v=0;v<64;v+=1)E[v]=v<16?n[v]:T(H(A=E[v-2],17)^H(A,19)^d(A,10),E[v-7],F(E[v-15]),E[v-16]),h=C(a,K(u),y(u,s,w),f[v],E[v]),c=R(U(t),m(t,e,i)),a=w,w=s,s=u,u=R(o,h),o=i,i=e,e=t,t=R(h,c);return r[0]=R(t,r[0]),r[1]=R(e,r[1]),r[2]=R(i,r[2]),r[3]=R(o,r[3]),r[4]=R(u,r[4]),r[5]=R(s,r[5]),r[6]=R(w,r[6]),r[7]=R(a,r[7]),r}var I=function(n){function r(r,t,e){var o=this;if("SHA-224"!==r&&"SHA-256"!==r)throw new Error(a);var f=e||{};return(o=n.call(this,r,t,e)||this).K=o.N,o.k=!0,o.F=-1,o.m=i(o.t,o.i,o.F),o.R=N,o.L=function(n){return n.slice()},o.B=Y,o.g=function(n,t,e,i){return function(n,r,t,e,i){for(var o,f=15+(r+65>>>9<<4),s=r+t;n.length<=f;)n.push(0);for(n[r>>>5]|=128<<24-r%32,n[f]=4294967295&s,n[f-1]=s/u|0,o=0;o<n.length;o+=16)e=N(n.slice(o,o+16),e);return"SHA-224"===i?[e[0],e[1],e[2],e[3],e[4],e[5],e[6]]:e}(n,t,e,i,r)},o.U=Y(r),o.p=512,o.T="SHA-224"===r?224:256,o.C=!1,f.hmacKey&&o.Y(A("hmacKey",f.hmacKey,o.F)),o}return b(r,n),r}(E),M=function(n,r){this.I=n,this.M=r};function X(n,r){var t;return r>32?(t=64-r,new M(n.M<<r|n.I>>>t,n.I<<r|n.M>>>t)):0!==r?(t=32-r,new M(n.I<<r|n.M>>>t,n.M<<r|n.I>>>t)):n}function z(n,r){var t;return r<32?(t=32-r,new M(n.I>>>r|n.M<<t,n.M>>>r|n.I<<t)):(t=64-r,new M(n.M>>>r|n.I<<t,n.I>>>r|n.M<<t))}function O(n,r){return new M(n.I>>>r,n.M>>>r|n.I<<32-r)}function j(n,r,t){return new M(n.I&r.I^~n.I&t.I,n.M&r.M^~n.M&t.M)}function _(n,r,t){return new M(n.I&r.I^n.I&t.I^r.I&t.I,n.M&r.M^n.M&t.M^r.M&t.M)}function x(n){var r=z(n,28),t=z(n,34),e=z(n,39);return new M(r.I^t.I^e.I,r.M^t.M^e.M)}function P(n,r){var t,e;t=(65535&n.M)+(65535&r.M);var i=(65535&(e=(n.M>>>16)+(r.M>>>16)+(t>>>16)))<<16|65535&t;return t=(65535&n.I)+(65535&r.I)+(e>>>16),e=(n.I>>>16)+(r.I>>>16)+(t>>>16),new M((65535&e)<<16|65535&t,i)}function V(n,r,t,e){var i,o;i=(65535&n.M)+(65535&r.M)+(65535&t.M)+(65535&e.M);var u=(65535&(o=(n.M>>>16)+(r.M>>>16)+(t.M>>>16)+(e.M>>>16)+(i>>>16)))<<16|65535&i;return i=(65535&n.I)+(65535&r.I)+(65535&t.I)+(65535&e.I)+(o>>>16),o=(n.I>>>16)+(r.I>>>16)+(t.I>>>16)+(e.I>>>16)+(i>>>16),new M((65535&o)<<16|65535&i,u)}function Z(n,r,t,e,i){var o,u;o=(65535&n.M)+(65535&r.M)+(65535&t.M)+(65535&e.M)+(65535&i.M);var f=(65535&(u=(n.M>>>16)+(r.M>>>16)+(t.M>>>16)+(e.M>>>16)+(i.M>>>16)+(o>>>16)))<<16|65535&o;return o=(65535&n.I)+(65535&r.I)+(65535&t.I)+(65535&e.I)+(65535&i.I)+(u>>>16),u=(n.I>>>16)+(r.I>>>16)+(t.I>>>16)+(e.I>>>16)+(i.I>>>16)+(o>>>16),new M((65535&u)<<16|65535&o,f)}function q(n,r){return new M(n.I^r.I,n.M^r.M)}function D(n){var r=z(n,1),t=z(n,8),e=O(n,7);return new M(r.I^t.I^e.I,r.M^t.M^e.M)}function G(n){var r=z(n,14),t=z(n,18),e=z(n,41);return new M(r.I^t.I^e.I,r.M^t.M^e.M)}var J=[new M(f[0],3609767458),new M(f[1],602891725),new M(f[2],3964484399),new M(f[3],2173295548),new M(f[4],4081628472),new M(f[5],3053834265),new M(f[6],2937671579),new M(f[7],3664609560),new M(f[8],2734883394),new M(f[9],1164996542),new M(f[10],1323610764),new M(f[11],3590304994),new M(f[12],4068182383),new M(f[13],991336113),new M(f[14],633803317),new M(f[15],3479774868),new M(f[16],2666613458),new M(f[17],944711139),new M(f[18],2341262773),new M(f[19],2007800933),new M(f[20],1495990901),new M(f[21],1856431235),new M(f[22],3175218132),new M(f[23],2198950837),new M(f[24],3999719339),new M(f[25],766784016),new M(f[26],2566594879),new M(f[27],3203337956),new M(f[28],1034457026),new M(f[29],2466948901),new M(f[30],3758326383),new M(f[31],168717936),new M(f[32],1188179964),new M(f[33],1546045734),new M(f[34],1522805485),new M(f[35],2643833823),new M(f[36],2343527390),new M(f[37],1014477480),new M(f[38],1206759142),new M(f[39],344077627),new M(f[40],1290863460),new M(f[41],3158454273),new M(f[42],3505952657),new M(f[43],106217008),new M(f[44],3606008344),new M(f[45],1432725776),new M(f[46],1467031594),new M(f[47],851169720),new M(f[48],3100823752),new M(f[49],1363258195),new M(f[50],3750685593),new M(f[51],3785050280),new M(f[52],3318307427),new M(f[53],3812723403),new M(f[54],2003034995),new M(f[55],3602036899),new M(f[56],1575990012),new M(f[57],1125592928),new M(f[58],2716904306),new M(f[59],442776044),new M(f[60],593698344),new M(f[61],3733110249),new M(f[62],2999351573),new M(f[63],3815920427),new M(3391569614,3928383900),new M(3515267271,566280711),new M(3940187606,3454069534),new M(4118630271,4000239992),new M(116418474,1914138554),new M(174292421,2731055270),new M(289380356,3203993006),new M(460393269,320620315),new M(685471733,587496836),new M(852142971,1086792851),new M(1017036298,365543100),new M(1126000580,2618297676),new M(1288033470,3409855158),new M(1501505948,4234509866),new M(1607167915,987167468),new M(1816402316,1246189591)];function Q(n){return"SHA-384"===n?[new M(3418070365,s[0]),new M(1654270250,s[1]),new M(2438529370,s[2]),new M(355462360,s[3]),new M(1731405415,s[4]),new M(41048885895,s[5]),new M(3675008525,s[6]),new M(1203062813,s[7])]:[new M(w[0],4089235720),new M(w[1],2227873595),new M(w[2],4271175723),new M(w[3],1595750129),new M(w[4],2917565137),new M(w[5],725511199),new M(w[6],4215389547),new M(w[7],327033209)]}function W(n,r){var t,e,i,o,u,f,s,w,a,h,c,v,A,E,l,b,S=[];for(t=r[0],e=r[1],i=r[2],o=r[3],u=r[4],f=r[5],s=r[6],w=r[7],c=0;c<80;c+=1)c<16?(v=2*c,S[c]=new M(n[v],n[v+1])):S[c]=V((A=S[c-2],E=void 0,l=void 0,b=void 0,E=z(A,19),l=z(A,61),b=O(A,6),new M(E.I^l.I^b.I,E.M^l.M^b.M)),S[c-7],D(S[c-15]),S[c-16]),a=Z(w,G(u),j(u,f,s),J[c],S[c]),h=P(x(t),_(t,e,i)),w=s,s=f,f=u,u=P(o,a),o=i,i=e,e=t,t=P(a,h);return r[0]=P(t,r[0]),r[1]=P(e,r[1]),r[2]=P(i,r[2]),r[3]=P(o,r[3]),r[4]=P(u,r[4]),r[5]=P(f,r[5]),r[6]=P(s,r[6]),r[7]=P(w,r[7]),r}var $=function(n){function r(r,t,e){var o=this;if("SHA-384"!==r&&"SHA-512"!==r)throw new Error(a);var f=e||{};return(o=n.call(this,r,t,e)||this).K=o.N,o.k=!0,o.F=-1,o.m=i(o.t,o.i,o.F),o.R=W,o.L=function(n){return n.slice()},o.B=Q,o.g=function(n,t,e,i){return function(n,r,t,e,i){for(var o,f=31+(r+129>>>10<<5),s=r+t;n.length<=f;)n.push(0);for(n[r>>>5]|=128<<24-r%32,n[f]=4294967295&s,n[f-1]=s/u|0,o=0;o<n.length;o+=32)e=W(n.slice(o,o+32),e);return"SHA-384"===i?[e[0].I,e[0].M,e[1].I,e[1].M,e[2].I,e[2].M,e[3].I,e[3].M,e[4].I,e[4].M,e[5].I,e[5].M]:[e[0].I,e[0].M,e[1].I,e[1].M,e[2].I,e[2].M,e[3].I,e[3].M,e[4].I,e[4].M,e[5].I,e[5].M,e[6].I,e[6].M,e[7].I,e[7].M]}(n,t,e,i,r)},o.U=Q(r),o.p=1024,o.T="SHA-384"===r?384:512,o.C=!1,f.hmacKey&&o.Y(A("hmacKey",f.hmacKey,o.F)),o}return b(r,n),r}(E),nn=[new M(0,1),new M(0,32898),new M(2147483648,32906),new M(2147483648,2147516416),new M(0,32907),new M(0,2147483649),new M(2147483648,2147516545),new M(2147483648,32777),new M(0,138),new M(0,136),new M(0,2147516425),new M(0,2147483658),new M(0,2147516555),new M(2147483648,139),new M(2147483648,32905),new M(2147483648,32771),new M(2147483648,32770),new M(2147483648,128),new M(0,32778),new M(2147483648,2147483658),new M(2147483648,2147516545),new M(2147483648,32896),new M(0,2147483649),new M(2147483648,2147516424)],rn=[[0,36,3,41,18],[1,44,10,45,2],[62,6,43,15,61],[28,55,25,21,56],[27,20,39,8,14]];function tn(n){var r,t=[];for(r=0;r<5;r+=1)t[r]=[new M(0,0),new M(0,0),new M(0,0),new M(0,0),new M(0,0)];return t}function en(n){var r,t=[];for(r=0;r<5;r+=1)t[r]=n[r].slice();return t}function on(n,r){var t,e,i,o,u,f,s,w,a,h=[],c=[];if(null!==n)for(e=0;e<n.length;e+=2)r[(e>>>1)%5][(e>>>1)/5|0]=q(r[(e>>>1)%5][(e>>>1)/5|0],new M(n[e+1],n[e]));for(t=0;t<24;t+=1){for(o=tn(),e=0;e<5;e+=1)h[e]=(u=r[e][0],f=r[e][1],s=r[e][2],w=r[e][3],a=r[e][4],new M(u.I^f.I^s.I^w.I^a.I,u.M^f.M^s.M^w.M^a.M));for(e=0;e<5;e+=1)c[e]=q(h[(e+4)%5],X(h[(e+1)%5],1));for(e=0;e<5;e+=1)for(i=0;i<5;i+=1)r[e][i]=q(r[e][i],c[e]);for(e=0;e<5;e+=1)for(i=0;i<5;i+=1)o[i][(2*e+3*i)%5]=X(r[e][i],rn[e][i]);for(e=0;e<5;e+=1)for(i=0;i<5;i+=1)r[e][i]=q(o[e][i],new M(~o[(e+1)%5][i].I&o[(e+2)%5][i].I,~o[(e+1)%5][i].M&o[(e+2)%5][i].M));r[0][0]=q(r[0][0],nn[t])}return r}function un(n){var r,t,e=0,i=[0,0],o=[4294967295&n,n/u&2097151];for(r=6;r>=0;r--)0===(t=o[r>>2]>>>8*r&255)&&0===e||(i[e+1>>2]|=t<<8*(e+1),e+=1);return e=0!==e?e:1,i[0]|=e,{value:e+1>4?i:[i[0]],binLen:8+8*e}}function fn(n){return c(un(n.binLen),n)}function sn(n,r){var t,e=un(r),i=r>>>2,o=(i-(e=c(e,n)).value.length%i)%i;for(t=0;t<o;t++)e.value.push(0);return e.value}var wn=function(n){function r(r,t,e){var o=this,u=6,f=0,s=e||{};if(1!==(o=n.call(this,r,t,e)||this).numRounds){if(s.kmacKey||s.hmacKey)throw new Error(h);if("CSHAKE128"===o.o||"CSHAKE256"===o.o)throw new Error("Cannot set numRounds for CSHAKE variants")}switch(o.F=1,o.m=i(o.t,o.i,o.F),o.R=on,o.L=en,o.B=tn,o.U=tn(),o.C=!1,r){case"SHA3-224":o.p=f=1152,o.T=224,o.k=!0,o.K=o.N;break;case"SHA3-256":o.p=f=1088,o.T=256,o.k=!0,o.K=o.N;break;case"SHA3-384":o.p=f=832,o.T=384,o.k=!0,o.K=o.N;break;case"SHA3-512":o.p=f=576,o.T=512,o.k=!0,o.K=o.N;break;case"SHAKE128":u=31,o.p=f=1344,o.T=-1,o.C=!0,o.k=!1,o.K=null;break;case"SHAKE256":u=31,o.p=f=1088,o.T=-1,o.C=!0,o.k=!1,o.K=null;break;case"KMAC128":u=4,o.p=f=1344,o.X(e),o.T=-1,o.C=!0,o.k=!1,o.K=o.O;break;case"KMAC256":u=4,o.p=f=1088,o.X(e),o.T=-1,o.C=!0,o.k=!1,o.K=o.O;break;case"CSHAKE128":o.p=f=1344,u=o.j(e),o.T=-1,o.C=!0,o.k=!1,o.K=null;break;case"CSHAKE256":o.p=f=1088,u=o.j(e),o.T=-1,o.C=!0,o.k=!1,o.K=null;break;default:throw new Error(a)}return o.g=function(n,r,t,e,i){return function(n,r,t,e,i,o,u){var f,s,w=0,a=[],h=i>>>5,c=r>>>5;for(f=0;f<c&&r>=i;f+=h)e=on(n.slice(f,f+h),e),r-=i;for(n=n.slice(f),r%=i;n.length<h;)n.push(0);for(n[(f=r>>>3)>>2]^=o<<f%4*8,n[h-1]^=2147483648,e=on(n,e);32*a.length<u&&(s=e[w%5][w/5|0],a.push(s.M),!(32*a.length>=u));)a.push(s.I),0==64*(w+=1)%i&&(on(null,e),w=0);return a}(n,r,0,e,f,u,i)},s.hmacKey&&o.Y(A("hmacKey",s.hmacKey,o.F)),o}return b(r,n),r.prototype.j=function(n,r){var t=function(n){var r=n||{};return{funcName:A("funcName",r.funcName,1,{value:[],binLen:0}),customization:A("Customization",r.customization,1,{value:[],binLen:0})}}(n||{});r&&(t.funcName=r);var e=c(fn(t.funcName),fn(t.customization));if(0!==t.customization.binLen||0!==t.funcName.binLen){for(var i=sn(e,this.p>>>3),o=0;o<i.length;o+=this.p>>>5)this.U=this.R(i.slice(o,o+(this.p>>>5)),this.U),this.A+=this.p;return 4}return 31},r.prototype.X=function(n){var r=function(n){var r=n||{};return{kmacKey:A("kmacKey",r.kmacKey,1),funcName:{value:[1128353099],binLen:32},customization:A("Customization",r.customization,1,{value:[],binLen:0})}}(n||{});this.j(n,r.funcName);for(var t=sn(fn(r.kmacKey),this.p>>>3),e=0;e<t.length;e+=this.p>>>5)this.U=this.R(t.slice(e,e+(this.p>>>5)),this.U),this.A+=this.p;this.l=!0},r.prototype.O=function(n){var r=c({value:this.u.slice(),binLen:this.h},function(n){var r,t,e=0,i=[0,0],o=[4294967295&n,n/u&2097151];for(r=6;r>=0;r--)0==(t=o[r>>2]>>>8*r&255)&&0===e||(i[e>>2]|=t<<8*e,e+=1);return i[(e=0!==e?e:1)>>2]|=e<<8*e,{value:e+1>4?i:[i[0]],binLen:8+8*e}}(n.outputLen));return this.g(r.value,r.binLen,this.A,this.L(this.U),n.outputLen)},r}(E);return function(){function n(n,r,t){if("SHA-1"==n)this._=new k(n,r,t);else if("SHA-224"==n||"SHA-256"==n)this._=new I(n,r,t);else if("SHA-384"==n||"SHA-512"==n)this._=new $(n,r,t);else{if("SHA3-224"!=n&&"SHA3-256"!=n&&"SHA3-384"!=n&&"SHA3-512"!=n&&"SHAKE128"!=n&&"SHAKE256"!=n&&"CSHAKE128"!=n&&"CSHAKE256"!=n&&"KMAC128"!=n&&"KMAC256"!=n)throw new Error(a);this._=new wn(n,r,t)}}return n.prototype.update=function(n){return this._.update(n),this},n.prototype.getHash=function(n,r){return this._.getHash(n,r)},n.prototype.setHMACKey=function(n,r,t){this._.setHMACKey(n,r,t)},n.prototype.getHMAC=function(n,r){return this._.getHMAC(n,r)},n}()}));


},{}],15:[function(require,module,exports){
module.exports = {
	whitelist: {"jquery":[{"filename":"core.js","version":"3.3.1","hash":"6026ca247eaee2c88fa54964d77d2e76efc97a974a5695e3744cb38defb3d691"},{"filename":"jquery.js","version":"3.3.1","hash":"d8aa24ecc6cecb1a60515bc093f1c9da38a0392612d9ab8ae0f7f36e6eee1fad"},{"filename":"jquery.min.js","version":"3.3.1","hash":"160a426ff2894252cd7cebbdd6d6b7da8fcd319c65b70468f10b6690c45d02ef"},{"filename":"jquery.slim.js","version":"3.3.1","hash":"7cd5c914895c6b4e4120ed98e73875c6b4a12b7304fbf9586748fe0a1c57d830"},{"filename":"jquery.slim.min.js","version":"3.3.1","hash":"dde76b9b2b90d30eb97fc81f06caa8c338c97b688cea7d2729c88f529f32fbb1"},{"filename":"core.js","version":"3.3.0","hash":"58db1cc9582b20320c552043b5880b40c8eaec3e6d4b46994222862a049330a1"},{"filename":"jquery.js","version":"3.3.0","hash":"4c5592b8326dea44be86e57ebd59725758ccdddc0675e356a9ece14f15c1fd7f"},{"filename":"jquery.min.js","version":"3.3.0","hash":"453432f153a63654fa6f63c846eaf7ee9e8910165413ba3cc0f80cbeed7c302e"},{"filename":"jquery.slim.js","version":"3.3.0","hash":"ec89a3d1f2cab57e4d144092d6e9a8429ecd0b594482be270536ac366ee004b6"},{"filename":"jquery.slim.min.js","version":"3.3.0","hash":"00c83723bc9aefa38b3c3f4cf8c93b92aac0dbd1d49ff16e1817d3ffd51ff65b"},{"filename":"core.js","version":"3.2.1","hash":"052b1b5ec0c4ae78aafc7a6e8542c5a2bf31d42a40dac3cfc102e512812b8bed"},{"filename":"jquery.js","version":"3.2.1","hash":"0d9027289ffa5d9f6c8b4e0782bb31bbff2cef5ee3708ccbcb7a22df9128bb21"},{"filename":"jquery.min.js","version":"3.2.1","hash":"87083882cc6015984eb0411a99d3981817f5dc5c90ba24f0940420c5548d82de"},{"filename":"jquery.slim.js","version":"3.2.1","hash":"b40f32d17aa2c27a7098e225dd218070597646fc478c0f2aa74fb5b821a64668"},{"filename":"jquery.slim.min.js","version":"3.2.1","hash":"9365920887b11b33a3dc4ba28a0f93951f200341263e3b9cefd384798e4be398"},{"filename":"core.js","version":"3.2.0","hash":"7c5c8f96ac182ed4d2c9ac74fda37941745f2793814fbd8b28624a9a720f9d39"},{"filename":"jquery.js","version":"3.2.0","hash":"c0f149348165558e3d07e0ae008ac3afddf65d26fa264dc9d4cdb6337136ca54"},{"filename":"jquery.min.js","version":"3.2.0","hash":"2405bdf4c255a4904671bcc4b97938033d39b3f5f20dd068985a8d94cde273e2"},{"filename":"jquery.slim.js","version":"3.2.0","hash":"f18ac10930e84233b80814f5595bcc1f6ffad74047d038d997114e08880aec03"},{"filename":"jquery.slim.min.js","version":"3.2.0","hash":"a8b02fd240408a170764b2377efdd621329e46c517dbb85deaea4105ad0c4a8c"},{"filename":"core.js","version":"3.1.1","hash":"4a4dec7ca8f2567b4327c82b873c8d7dd774f74b9009d2ff65431a8154693dea"},{"filename":"jquery.js","version":"3.1.1","hash":"d7a71d3dd740e95755227ba6446a3a21b8af6c4444f29ec2411dc7cd306e10b0"},{"filename":"jquery.min.js","version":"3.1.1","hash":"85556761a8800d14ced8fcd41a6b8b26bf012d44a318866c0d81a62092efd9bf"},{"filename":"jquery.slim.js","version":"3.1.1","hash":"e62fe6437d3433befd3763950eb975ea56e88705cd51dccbfd1d9a5545f25d60"},{"filename":"jquery.slim.min.js","version":"3.1.1","hash":"fd222b36abfc87a406283b8da0b180e22adeb7e9327ac0a41c6cd5514574b217"},{"filename":"core.js","version":"3.1.0","hash":"55994528e7efe901e92a76761a54ba0c3ae3f1f8d1c3a4da9a23a3e4a06d0eaa"},{"filename":"jquery.js","version":"3.1.0","hash":"b25a2092f0752b754e933008f10213c55dd5ce93a791e355b0abed9182cc8df9"},{"filename":"jquery.min.js","version":"3.1.0","hash":"702b9e051e82b32038ffdb33a4f7eb5f7b38f4cf6f514e4182d8898f4eb0b7fb"},{"filename":"jquery.slim.js","version":"3.1.0","hash":"2faa690232fa8e0b5199f8ae8a0784139030348da91ff5fd2016cfc9a9c9799c"},{"filename":"jquery.slim.min.js","version":"3.1.0","hash":"711a568e848ec3929cc8839a64da388ba7d9f6d28f85861bea2e53f51495246f"},{"filename":"core.js","version":"3.0.0-rc1","hash":"11853583eb5ce8ab1aacc380430145de705cdfff0e72c54d3dca17d01466999b"},{"filename":"jquery.js","version":"3.0.0-rc1","hash":"65ded5fa34aa91b976dae0af5888ce4c06fed34271f3665b2924505b704025c7"},{"filename":"jquery.min.js","version":"3.0.0-rc1","hash":"df68e90250b9a60fc184ef194d1769d3af8aa67396cc064281cb77e2ef6bf876"},{"filename":"jquery.slim.js","version":"3.0.0-rc1","hash":"c96eeff335114aa55df0328bbe5f9202ed7a3266b6e81fcd357cd17837fa9756"},{"filename":"jquery.slim.min.js","version":"3.0.0-rc1","hash":"e92bbd6e77604b75e910952f20f3c95ce29050c7b1137dc1edddad000c236b5d"},{"filename":"jquery.js","version":"3.0.0-beta1","hash":"78f27c3d7cb5d766466703adc7f7ad7706b7fb05514eec39be0aa253449bd0f8"},{"filename":"jquery.min.js","version":"3.0.0-beta1","hash":"b72a0aa436a8a8965041beda30577232677ef6588bb933b5bebed2de02c04dc8"},{"filename":"jquery.slim.js","version":"3.0.0-beta1","hash":"4db510700e5773fc7065f36363affd4885c9d9ef257fd7757744f91ac9da5671"},{"filename":"jquery.slim.min.js","version":"3.0.0-beta1","hash":"4c369c555423651822c2f7772d5e0b9a56a2372a92657bd2a696fe539b24be9e"},{"filename":"jquery.js","version":"3.0.0-alpha1","hash":"10b3ccff4cf14cdb5e7c31b2d323be750a13125cea8ded9ca5c1da4150a69238"},{"filename":"jquery.min.js","version":"3.0.0-alpha1","hash":"19e065eaadf26f58c0e1081a2e0e64450eec2983eebb08f998ecaacac8642a47"},{"filename":"core.js","version":"3.0.0","hash":"bad41b5e9f7c6b952b3a840b84ce2e97e3029bd2b2773c58a69a33e73217d1e4"},{"filename":"jquery.js","version":"3.0.0","hash":"8eb3cb67ef2f0f1b76167135cef6570a409c79b23f0bc0ede71c9a4018f1408a"},{"filename":"jquery.min.js","version":"3.0.0","hash":"266bcea0bb58b26aa5b16c5aee60d22ccc1ae9d67daeb21db6bad56119c3447d"},{"filename":"jquery.slim.js","version":"3.0.0","hash":"1a9ea1a741fe03b6b1835b44ac2b9c59e39cdfc8abb64556a546c16528fc2828"},{"filename":"jquery.slim.min.js","version":"3.0.0","hash":"45fe0169d7f20adb2f1e63bcf4151971b62f34dbd9bce4f4f002df133bc2b03d"},{"filename":"jquery.js","version":"2.2.4","hash":"893e90f6230962e42231635df650f20544ad22affc3ee396df768eaa6bc5a6a2"},{"filename":"jquery.min.js","version":"2.2.4","hash":"05b85d96f41fff14d8f608dad03ab71e2c1017c2da0914d7c59291bad7a54f8e"},{"filename":"jquery.js","version":"2.2.3","hash":"95a5d6b46c9da70a89f0903e5fdc769a2c266a22a19fcb5598e5448a044db4fe"},{"filename":"jquery.min.js","version":"2.2.3","hash":"6b6de0d4db7876d1183a3edb47ebd3bbbf93f153f5de1ba6645049348628109a"},{"filename":"jquery.slim.js","version":"2.2.3","hash":"4db510700e5773fc7065f36363affd4885c9d9ef257fd7757744f91ac9da5671"},{"filename":"jquery.slim.min.js","version":"2.2.3","hash":"4c369c555423651822c2f7772d5e0b9a56a2372a92657bd2a696fe539b24be9e"},{"filename":"jquery.js","version":"2.2.2","hash":"e3fcd40aa8aad24ab1859232a781b41a4f803ad089b18d53034d24e4296c6581"},{"filename":"jquery.min.js","version":"2.2.2","hash":"dfa729d82a3effadab1000181cb99108f232721e3b0af74cfae4c12704b35a32"},{"filename":"jquery.slim.js","version":"2.2.2","hash":"4db510700e5773fc7065f36363affd4885c9d9ef257fd7757744f91ac9da5671"},{"filename":"jquery.slim.min.js","version":"2.2.2","hash":"4c369c555423651822c2f7772d5e0b9a56a2372a92657bd2a696fe539b24be9e"},{"filename":"jquery.js","version":"2.2.1","hash":"78d714ccede3b2fd179492ef7851246c1f1b03bfc2ae83693559375e99a7c077"},{"filename":"jquery.min.js","version":"2.2.1","hash":"82f420005cd31fab6b4ab016a07d623e8f5773de90c526777de5ba91e9be3b4d"},{"filename":"jquery.slim.js","version":"2.2.1","hash":"4db510700e5773fc7065f36363affd4885c9d9ef257fd7757744f91ac9da5671"},{"filename":"jquery.slim.min.js","version":"2.2.1","hash":"4c369c555423651822c2f7772d5e0b9a56a2372a92657bd2a696fe539b24be9e"},{"filename":"jquery.js","version":"2.2.0","hash":"a18aa92dea997bd71eb540d5f931620591e9dee27e5f817978bb385bab924d21"},{"filename":"jquery.min.js","version":"2.2.0","hash":"8a102873a33f24f7eb22221e6b23c4f718e29f85168ecc769a35bfaed9b12cce"},{"filename":"jquery.js","version":"2.1.4","hash":"b2215cce5830e2350b9d420271d9bd82340f664c3f60f0ea850f7e9c0392704e"},{"filename":"jquery.min.js","version":"2.1.4","hash":"22642f202577f0ba2f22cbe56b6cf291a09374487567cd3563e0d2a29f75c0c5"},{"filename":"jquery.js","version":"2.1.3","hash":"828cbbcacb430f9c5b5d27fe9302f8795eb338f2421010f5141882125226f94f"},{"filename":"jquery.min.js","version":"2.1.3","hash":"2051d61446d4dbffb03727031022a08c84528ab44d203a7669c101e5fbdd5515"},{"filename":"jquery.js","version":"2.1.2","hash":"07cb07bdfba40ceff869b329eb48eeede41740ba6ce833dd3830bd0af49e4898"},{"filename":"jquery.min.js","version":"2.1.2","hash":"64c51d974a342e9df3ed548082a4ad7816d407b8c36b67356dde9e487b819cbe"},{"filename":"jquery.js","version":"2.1.1-rc2","hash":"dc0083a233768ed8554d770d9d4eed91c0e27de031b3d9cbdcecabc034265010"},{"filename":"jquery.min.js","version":"2.1.1-rc2","hash":"293c9966a4fea0fed0adc1aae242bb37e428e649337dcab65d9af5934a7cc775"},{"filename":"jquery.js","version":"2.1.1-rc1","hash":"5adbbda8312291291162ab054df8927291426dbfb550099945ece85b49707290"},{"filename":"jquery.min.js","version":"2.1.1-rc1","hash":"d246298c351558d4847d237bb2d052f22001ca24ea4a32c28de378c95af523c8"},{"filename":"jquery.js","version":"2.1.1-beta1","hash":"e96b9e8d7a12b381d2ed1efd785faef3c7bad0ea03edf42fb15c9fde533e761f"},{"filename":"jquery.min.js","version":"2.1.1-beta1","hash":"5aed44447956d7933861d56003dbd0f95504d79e19d094edacbe4a55e6cf8736"},{"filename":"jquery.js","version":"2.1.1","hash":"140ff438eaaede046f1ceba27579d16dc980595709391873fa9bf74d7dbe53ac"},{"filename":"jquery.min.js","version":"2.1.1","hash":"c0d4098bc8b34c6f87a3d7723988ae81214a53a0bb4a1d4d36a67640f98ed079"},{"filename":"jquery.js","version":"2.1.0-rc1","hash":"88d96de8ccf65e57a3f28134616e3abfe0af2b3712302beb0a73f77f6b873fd0"},{"filename":"jquery.min.js","version":"2.1.0-rc1","hash":"11f94218bacdd4dbdc5c1736ca7aa1f27bb9632bc0a1696175b408da8dcf16b3"},{"filename":"jquery.js","version":"2.1.0-beta3","hash":"8eb83f00967dd0e18877b71349f5a3641b1046a1667c54e602a5682ac0f07ab9"},{"filename":"jquery.min.js","version":"2.1.0-beta3","hash":"7ebd0c0a5a088da45a5ec48f4379dbe457129f2cbe434f2e045ef838136746a9"},{"filename":"jquery.js","version":"2.1.0-beta2","hash":"97efd5af482f4e74c37c04970421fdbd17388fd605d992a2aa0077d388b32b6d"},{"filename":"jquery.min.js","version":"2.1.0-beta2","hash":"22966516a31e64225df5e08e35f0fadb27d29a8fb2618ddca17ec171215fc323"},{"filename":"jquery.js","version":"2.1.0","hash":"0fa7752926a95e3ab6b5f67a21ef40628ce4447c81ddf4f6cacf663b6fb85af7"},{"filename":"jquery.min.js","version":"2.1.0","hash":"f284353a7cc4d97f6fe20a5155131bd43587a0f1c98a56eeaf52cff72910f47d"},{"filename":"jquery.js","version":"2.0.3","hash":"9427fe2df51f7d4c6bf35f96d19169714d0b432b99dc18f41760d0342c538122"},{"filename":"jquery.min.js","version":"2.0.3","hash":"a57b5242b9a9adc4c1ef846c365147b89c472b9cd770face331efcb965346b25"},{"filename":"jquery.js","version":"2.0.2","hash":"d2ed0720108a75db0d53248ba8e36332658064c4189714d16c0f117efb42016d"},{"filename":"jquery.min.js","version":"2.0.2","hash":"9d7d1c727e1cd32745764098a76e5d3d5fb7acd3b6527c5aacd85b7c6f8ce341"},{"filename":"jquery.js","version":"2.0.1","hash":"820fb338fe8c7478a1b820e2708b4fd306a68825de1194803e7a93fbc2177a16"},{"filename":"jquery.min.js","version":"2.0.1","hash":"4e1354fc542b617c58cbba3aeb5116a528cf08bb1299f5dc7f3bc77a3b902b68"},{"filename":"jquery.js","version":"2.0.0","hash":"896e379d334cf0b16c78d9962a1579147156d4a72355032fce0de5f673d4e287"},{"filename":"jquery.min.js","version":"2.0.0","hash":"d482871a5e948cb4884fa0972ea98a81abca057b6bd3f8c995a18c12487e761c"},{"filename":"jquery.js","version":"1.12.4","hash":"430f36f9b5f21aae8cc9dca6a81c4d3d84da5175eaedcf2fdc2c226302cb3575"},{"filename":"jquery.min.js","version":"1.12.4","hash":"668b046d12db350ccba6728890476b3efee53b2f42dbb84743e5e9f1ae0cc404"},{"filename":"jquery.js","version":"1.12.3","hash":"d5732912d03878a5cd3695dc275a6630fb3c255fa7c0b744ab08897824049327"},{"filename":"jquery.min.js","version":"1.12.3","hash":"69a3831c082fc105b56c53865cc797fa90b83d920fb2f9f6875b00ad83a18174"},{"filename":"jquery.slim.js","version":"1.12.3","hash":"4db510700e5773fc7065f36363affd4885c9d9ef257fd7757744f91ac9da5671"},{"filename":"jquery.slim.min.js","version":"1.12.3","hash":"4c369c555423651822c2f7772d5e0b9a56a2372a92657bd2a696fe539b24be9e"},{"filename":"jquery.js","version":"1.12.2","hash":"5540b2af46570795610626e8d8391356176ca639b1520c4319a2d0c7ba9bef16"},{"filename":"jquery.min.js","version":"1.12.2","hash":"95914789b5f3307a3718679e867d61b9d4c03f749cd2e2970570331d7d6c8ed9"},{"filename":"jquery.slim.js","version":"1.12.2","hash":"4db510700e5773fc7065f36363affd4885c9d9ef257fd7757744f91ac9da5671"},{"filename":"jquery.slim.min.js","version":"1.12.2","hash":"4c369c555423651822c2f7772d5e0b9a56a2372a92657bd2a696fe539b24be9e"},{"filename":"jquery.js","version":"1.12.1","hash":"56e843a66b2bf7188ac2f4c81df61608843ce144bd5aa66c2df4783fba85e8ef"},{"filename":"jquery.min.js","version":"1.12.1","hash":"2359d383bf2d4ab65ebf7923bdf74ce40e4093f6e58251b395a64034b3c39772"},{"filename":"jquery.slim.js","version":"1.12.1","hash":"4db510700e5773fc7065f36363affd4885c9d9ef257fd7757744f91ac9da5671"},{"filename":"jquery.slim.min.js","version":"1.12.1","hash":"4c369c555423651822c2f7772d5e0b9a56a2372a92657bd2a696fe539b24be9e"},{"filename":"jquery.js","version":"1.12.0","hash":"c85537acad72f0d7d409dfc1e2d2daa59032f71d29642a8b64b9852f70166fbb"},{"filename":"jquery.min.js","version":"1.12.0","hash":"5f1ab65fe2ad6b381a1ae036716475bf78c9b2e309528cf22170c1ddeefddcbf"},{"filename":"jquery.js","version":"1.11.3","hash":"2065aecca0fb9b0567358d352ed5f1ab72fce139bf449b4d09805f5d9c3725ed"},{"filename":"jquery.min.js","version":"1.11.3","hash":"aec3d419d50f05781a96f223e18289aeb52598b5db39be82a7b71dc67d6a7947"},{"filename":"jquery.js","version":"1.11.2","hash":"58c27035b7a2e589df397e5d7e05424b90b8c1aaaf73eff47d5ed6daecb70f25"},{"filename":"jquery.min.js","version":"1.11.2","hash":"d4ec583c7604001f87233d1fe0076cbd909f15a5f8c6b4c3f5dd81b462d79d32"},{"filename":"jquery.js","version":"1.11.1-rc2","hash":"648dbce0f3731ebce091c283b52f60b100d73807501eea1a99f7b23140bfcefa"},{"filename":"jquery.min.js","version":"1.11.1-rc2","hash":"06d766022172da3774651a3ccfeef893185f9ba46823bcbfcba744ab5e25a4bf"},{"filename":"jquery.js","version":"1.11.1-rc1","hash":"8241d4982de8a6fea3e0ebc47e99445337675a777054c09221f670adb3748995"},{"filename":"jquery.min.js","version":"1.11.1-rc1","hash":"a581c274adebdbc44022e45d9febf0b92c572481c58bfe562b3d74d5e8972c5a"},{"filename":"jquery.js","version":"1.11.1-beta1","hash":"0aab28e2fd1f61b6282132553325bd890fef40989b698311c5b00b7b38a1e19d"},{"filename":"jquery.min.js","version":"1.11.1-beta1","hash":"99ec4d1ab56cf49ee4c202cc41509ada5eeb334694815f75675792433828a527"},{"filename":"jquery.js","version":"1.11.1","hash":"3029834a820c79c154c377f52e2719fc3ff2a27600a07ae089ea7fde9087f6bc"},{"filename":"jquery.min.js","version":"1.11.1","hash":"540bc6dec1dd4b92ea4d3fb903f69eabf6d919afd48f4e312b163c28cff0f441"},{"filename":"jquery.js","version":"1.11.0-rc1","hash":"84792d2b1ab8a2d57dcc113abb910b4c31dda357a7acd3b46ed282dd03f15d25"},{"filename":"jquery.min.js","version":"1.11.0-rc1","hash":"5f58804382f5258bb6b187c1b5af1ec0b8ccbe2c904a5163580371352ca63424"},{"filename":"jquery.js","version":"1.11.0-beta3","hash":"847a61382a55d0c0e5244d0621f1e0674292dee6b850640c669fd1516ec9f4f5"},{"filename":"jquery.min.js","version":"1.11.0-beta3","hash":"51fc79c1828a885f3776e35d56a22895e3656d014b502b869bd05f891bd91602"},{"filename":"jquery.js","version":"1.11.0","hash":"ce0343e1d6f489768eeefe022c12181c6a0822e756239851310acf076d23d10c"},{"filename":"jquery.min.js","version":"1.11.0","hash":"b294e973896f8f874e90a8eb1a8908ac790980d034c4c4bdf0fc3d37b8abf682"},{"filename":"jquery.js","version":"1.10.2","hash":"8ade6740a1d3cfedf81e28d9250929341207b23a55f1be90ccc26cf6d98e052a"},{"filename":"jquery.min.js","version":"1.10.2","hash":"89a15e9c40bc6b14809f236ee8cd3ed1ea42393c1f6ca55c7855cd779b3f922e"},{"filename":"jquery.js","version":"1.10.1","hash":"ebaded49db62a60060caa2577f2a4ec1ff68726bc40861bc65d977abeb64fa7d"},{"filename":"jquery.min.js","version":"1.10.1","hash":"8bf150f6b29d6c9337de6c945a8f63c929b203442040688878bc2753fe13e007"},{"filename":"jquery.js","version":"1.10.0","hash":"8aa0f84b5331efcc3cb72c7d504c2bc6ebd861da003d72c33df99ce650d4531d"},{"filename":"jquery.min.js","version":"1.10.0","hash":"1e80de36726582824df3f9a7eb6ecdfe9827fc5a7c69f597b1502ebc13950ecd"},{"filename":"jquery.js","version":"1.9.1","hash":"7bd80d06c01c0340c1b9159b9b4a197db882ca18cbac8e9b9aa025e68f998d40"},{"filename":"jquery.min.js","version":"1.9.1","hash":"c12f6098e641aaca96c60215800f18f5671039aecf812217fab3c0d152f6adb4"},{"filename":"jquery.js","version":"1.9.0","hash":"4d7b01c2f6043bcee83a33d0f627dc6fbc27dc8aeb5bdd5d863e84304b512ef3"},{"filename":"jquery.min.js","version":"1.9.0","hash":"7fa0d5c3f538c76f878e012ac390597faecaabfe6fb9d459b919258e76c5df8e"},{"filename":"jquery.js","version":"1.8.3","hash":"756d7dfac4a35bb57543f677283d6c682e8d704e5350884b27325badd2b3c4a7"},{"filename":"jquery.min.js","version":"1.8.3","hash":"61c6caebd23921741fb5ffe6603f16634fca9840c2bf56ac8201e9264d6daccf"},{"filename":"jquery.js","version":"1.8.2","hash":"ba8f203a9ebbe5771f49bcbe0804079240c7225f4be6ab424769bfbfb35ebc35"},{"filename":"jquery.min.js","version":"1.8.2","hash":"f23d4b309b72743aa8afe1f8c98a25b3ee31246fa572c66d9d8cb1982cae4fbc"},{"filename":"jquery.js","version":"1.8.1","hash":"7614fc75c4fcf6f32f7307f37550440e12adefb9289226acb79020c66faeffea"},{"filename":"jquery.min.js","version":"1.8.1","hash":"a1305347219d673cc973172494248e557ce8eccaf65af995c07c9d7daed4475d"},{"filename":"jquery-1.8.0.js","version":"1.8.0","hash":"04ee795a1a5a908ee339e145ae6c6b394d1dc0d971fd0896e3cb776660adba2e"},{"filename":"jquery-1.8.0.min.js","version":"1.8.0","hash":"d73e2e1bff9c55b85284ff287cb20dc29ad9165ec09091a0597b61199f330805"},{"filename":"jquery.js","version":"1.8.0","hash":"04ee795a1a5a908ee339e145ae6c6b394d1dc0d971fd0896e3cb776660adba2e"},{"filename":"jquery.min.js","version":"1.8.0","hash":"d73e2e1bff9c55b85284ff287cb20dc29ad9165ec09091a0597b61199f330805"},{"filename":"jquery.min.js","version":"1.7.2","hash":"47b68dce8cb6805ad5b3ea4d27af92a241f4e29a5c12a274c852e4346a0500b4"},{"filename":"jquery.min.js","version":"1.7.1","hash":"88171413fc76dda23ab32baa17b11e4fff89141c633ece737852445f1ba6c1bd"},{"filename":"jquery.min.js","version":"1.7","hash":"ff4e4975ef403004f8fe8e59008db7ad47f54b10d84c72eb90e728d1ec9157ce"},{"filename":"jquery.js","version":"1.6.4","hash":"54964f8b580ad795a962fb27066715d3281ae1ad13a28bf8aedd5d8859ebae37"},{"filename":"jquery.min.js","version":"1.6.4","hash":"951d6bae39eb172f57a88bd686f7a921cf060fd21f59648f0d20b6a8f98fc5a5"},{"filename":"jquery.js","version":"1.6.3","hash":"9baa10e1c5630c3dcd9bb46bf00913cc94b3855d58c9459ae9848339c566e97b"},{"filename":"jquery.min.js","version":"1.6.3","hash":"d3f3779f5113da6da957c4d81481146a272c31aefe0d3e4b64414fd686fd9744"},{"filename":"jquery.js","version":"1.6.2","hash":"a57292619d14eb8cbd923bde9f28cf994ac66abc48f7c975b769328ff33bddc9"},{"filename":"jquery.min.js","version":"1.6.2","hash":"fefb084f14120d777c7857ba78603e8531a0778b2e639df7622513c70567afa0"},{"filename":"jquery.js","version":"1.6.1","hash":"0eef76a9583a6c7a1eb764d33fe376bfe1861df79fab82c2c3f5d16183e82016"},{"filename":"jquery.min.js","version":"1.6.1","hash":"c784376960f3163dc760bc019e72e5fed78203745a5510c69992a39d1d8fe776"},{"filename":"jquery.js","version":"1.5.1","hash":"e2ea0a6ca6b984a9405a759d24cf3c51eb3164e5c43e95c3e9a59b316be7b3b9"},{"filename":"jquery.min.js","version":"1.5.1","hash":"764b9e9f3ad386aaa5cdeae9368353994de61c0bede087c8f7e3579cb443de3b"},{"filename":"jquery.js","version":"1.4.4","hash":"b31cd094af7950b3a461dc78161fd2faf01faa9d0ed8c1c072790f83ab26d482"},{"filename":"jquery.min.js","version":"1.4.4","hash":"517364f2d45162fb5037437b5b6cb953d00d9b2b3b79ba87d9fe57ea6ee6070c"},{"filename":"jquery.js","version":"1.4.3","hash":"0e3303a3a0cec95ebc8c3cc3e19fc71c99487faa286b05d01a3eb8cca4d90bc7"},{"filename":"jquery.min.js","version":"1.4.3","hash":"f800b399e5c7a5254fc66bb407117fe38dbde0528780e68c9f7c87d299f8486a"},{"filename":"jquery.js","version":"1.4.2","hash":"95c023c80dfe0d30304c58244878995061f87801a66daa5d6bf4f2512be0e6f9"},{"filename":"jquery.min.js","version":"1.4.2","hash":"e23a2a4e2d7c2b41ebcdd8ffc0679df7140eb7f52e1eebabf827a88182643c59"},{"filename":"jquery.js","version":"1.4.1","hash":"9edc9f813781eca2aad6de78ef85cdbe92ee32bb0a56791be4da0fa7b472c1d8"},{"filename":"jquery.min.js","version":"1.4.1","hash":"2cec78f739fbddfed852cd7934d2530e7cc4c8f14b38673b03ba5fb880ad4cc7"},{"filename":"jquery.js","version":"1.4.0","hash":"882927b9aadb2504b5c6a823bd8c8c516f21dec6e441fe2c8fa228e35951bcc8"},{"filename":"jquery.min.js","version":"1.4.0","hash":"89abaf1e2471b00525b0694048e179c0f39a2674e3bcb34460ea6bc4801882be"},{"filename":"jquery.js","version":"1.3.2","hash":"74537639fa585509395c0d3b9a5601dd1e4ca036961c53dc5ab0e87386aa9be1"},{"filename":"jquery.min.js","version":"1.3.2","hash":"c8370a2d050359e9d505acc411e6f457a49b21360a21e6cbc9229bad3a767899"},{"filename":"jquery.js","version":"1.3.1","hash":"0ae058559b3e65d6cc5674fe3ff01581da5ae62387bb0dfa2923997a52093a06"},{"filename":"jquery.min.js","version":"1.3.1","hash":"17ec1f16efac893b9bd89bba5f13cb1e0bf938bdc9cece6cae3ed77f18fa6fd7"},{"filename":"jquery.js","version":"1.3.0","hash":"a7756f21ff6c558f983d5376072174af546e8d07f8bebe1e6f760b2f4b53012d"},{"filename":"jquery.min.js","version":"1.3.0","hash":"900191a443115d8b48a9d68d3062e8b3d7129727951b8617465b485baf253006"},{"filename":"jquery.js","version":"1.2.6","hash":"3cc5c121471323b25de45fcab48631d4a09c78e76af21c10d747352682605587"},{"filename":"jquery.min.js","version":"1.2.6","hash":"d548530775a6286f49ba66e0715876b4ec5985966b0291c21568fecfc4178e8d"},{"filename":"jquery.js","version":"1.2.3","hash":"d977fc32dd4bdb0479604abf078f1045b0e922666313f2f42cd71ce7835e0061"},{"filename":"jquery.min.js","version":"1.2.3","hash":"f1c4a0a7b5dead231fc9b42f06965a036ab7a2a788768847eb81e1528d6402ad"}]}
};

},{}]},{},[12]);
