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
if(document.location.href.indexOf("login-mcd-cluster.prd.snantx.attwifi.com") != -1){
    console.log("mcdonalds_wifi.js");
    console.log("Detected new style captive portal.");
    document.forms[0].submit();
}


// It seems McDonald's captive portal has changed and it no longer
// uses this captive portal. This will be left here in case there
// are some places where the old style captive portal is still in
// use.
if(document.location.href.indexOf("wayport.net") != -1){
    console.log("mcdonalds_wifi.js");
    console.log("Detected old style captive portal.");

    console.log("Detected the McDonald's captive portal.")
    var form = document.getElementsByTagName("form");
    var entries = form[0].getElementsByTagName("input");
    var data = new FormData();
    captive_portal_url = "wayport.net"
    if ("undefined" === typeof(document.getElementsByTagName("form")[0].action)) {
	console.log("no form found.")    
    } else{
	document.body.style.border = "5px solid red";	
	post_url = document.getElementsByTagName("form")[0].action;
	var dest = "";
	for(var i = 0; i < entries.length; i++){
	    console.log(entries[i].name + ":" + entries[i].value);

	    if(entries[i].name == "origDest"){
		dest = entries[i].name;
		entries[i].value = "http://www.wikipedia.org";
	    }
	    // Seems like this should be set to 1, not sure if required though
	    if(entries[i].name == "connect"){
		entries[i].value = "1";
	    }
	    
	    data.append(entries[i].name,entries[i].value);

	}
	var http = new XMLHttpRequest();
	//auth_url = document.URL.substring(0,document.URL.indexOf(captive_portal_url)+captive_portal_url.length);
	//auth_url += post_url;
	console.log(data);
	console.log(post_url);
	var xhr = new XMLHttpRequest();
	xhr.open('POST', post_url, true);
	xhr.onload = function () {
	    // do something to response
	    //console.log(this.responseText);
	    document.body = this.responseText;
	};
	xhr.send(data);
	alert("Authenticated to McDonald's Wi-fi.")
    }
}
