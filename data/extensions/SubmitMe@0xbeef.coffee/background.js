/*
Copyright (C) 2017 Nathan Nichols
Copyright (C) 2022 Ruben Rodriguez <ruben@gnu.org>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL NATHAN NICHOLS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

console.log("background.js");
var not_executing = true;
//passive_fix_css();
var notify_id = "submit-me";

function display_multiple_forms(){
	browser.notifications.create(notify_id, {
		"type": "basic",
		"iconUrl": browser.extension.getURL("icons/48x48.png"),
		"title": "Multiple possible forms",
		"message": "The website uses a submit button outside of a form.<br> Please select which form you would like to attempt to submit."
	});
};

function display_single_form(){
	browser.notifications.create(notify_id, {
		"type": "basic",
		"iconUrl": browser.extension.getURL("icons/48x48.png"),
		"title": "Multiple possible forms",
		"message": "The website uses a submit button outside of a form.<br> Please select which form you would like to attempt to submit."
	});
};

browser.contextMenus.create({
  id: "passive-submit-me-css",
  title: "Reveal hidden elements",
  contexts: ["all"]
});
browser.contextMenus.create({
  id: "submit-me",
  title: "Force submit a form",
  contexts: ["all"]
});
browser.contextMenus.create({
  id: "submit-me-manual",
  title: "Manually choose a form to submit",
  contexts: ["all"]
});
browser.contextMenus.create({
  id: "submit-me-css",
  title: "Remove all CSS (Try this if the website is scrambled)",
  contexts: ["all"]
});

function display_manual_dialog(){
	function onExecuted(result) {
		console.log("manual.js executed.");
		not_executing = true;
	}

	function onError(error) {
		console.log("Error in manual.js");
		console.log(error);
	}
	var executing = browser.tabs.executeScript({
		file: "/manual.js",
		allFrames: true
	});
	executing.then(onExecuted, onError);
}

function passive_fix_css(){
	function onExecuted(result) {
		console.log("passive_improve_css.js executed.");
		not_executing = true;
	}

	function onError(error) {
		//not_executing = true;
		console.log("Error in passive_improve_css.js");
		console.log(error);
	}
	var executing = browser.tabs.executeScript({
		file: "/passive_improve_css.js",
		allFrames: true
	});
	//not_executing = false;
	executing.then(onExecuted, onError);
}

function fix_css(){
	function onExecuted(result) {
		console.log("improve_css.js executed.");
		not_executing = true;
	}

	function onError(error) {
		console.log("Error in improve_css.js");
		console.log(error);
		not_executing = true;
	}
	var executing = browser.tabs.executeScript({
		file: "/improve_css.js",
		allFrames: true
	});
	not_executing = false;
	executing.then(onExecuted, onError);
}

function input(message){

	if(message["msg"] == "multiple-forms"){
		display_manual_dialog();
	}
	if(message["msg"] == "add-on-invoked"){
		browser.notifications.create(notify_id, {
			"type": "basic",
			"iconUrl": browser.extension.getURL("icons/48x48.png"),
			"title": "Submit Me",
			"message": "Please click the button you would normally click to submit the broken form."
		});
	}
};

browser.runtime.onMessage.addListener(input);
var show = false;

browser.contextMenus.onClicked.addListener(function(info, tab) {
	console.log(info);
	if(info.menuItemId == "submit-me-manual" && not_executing){
		not_executing = false;
		display_manual_dialog();
	}
		
	if(info.menuItemId == "submit-me-css" && not_executing){
		not_executing = false;
		fix_css();
	}
	if(info.menuItemId == "passive-submit-me-css" && not_executing){
		not_executing = false;
		passive_fix_css();
	}
	if (info.menuItemId == "submit-me") {
		console.log("Context menu button clicked");

		function onExecuted(result) {
		  console.log("Main.js executed.");
		}

		function onError(error) {
			console.log("Error in main.js");
			console.log(error);
		}
		var executing = browser.tabs.executeScript({
		  file: "/main.js",
		  allFrames: true
		});
		executing.then(onExecuted, onError);
	}
});


// https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/contextMenus/create
