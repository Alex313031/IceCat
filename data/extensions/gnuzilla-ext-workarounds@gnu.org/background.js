/*

 Copyright (C) 2017-2019 Nathan Nichols
 Copyright (C) 2019 Free Software Foundation, Inc.

 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with this program.  If not, see <http://www.gnu.org/licenses/>.

*/

console.log("background.js");

// The browser action

function launch(){
    var data = {url:"html/domestic.html"}
    browser.tabs.create(data); 
}


browser.browserAction.onClicked.addListener(launch);

// For sumofus_main.js

function redirect(requestDetails) {
	console.log("Redirecting: " + requestDetails.url);
	return {
		redirectUrl: "https://www.sumofus.org/campaigns/"
	};
}

browser.webRequest.onBeforeRequest.addListener(
	redirect,
	{urls: ["http://www.sumofus.org/"]},
 	["blocking"]
);

// Prevent google scripts from breaking the google drive add-on
var block_urls = ["*://docs.google.com/*"];
function cancel(requestDetails) {
  console.log("[google docs] Canceling: " + requestDetails.url);
  return {cancel: true};
}

browser.webRequest.onBeforeRequest.addListener(
	cancel,             // function
	{urls: block_urls, types: ["script"]},
	["blocking"]
);
