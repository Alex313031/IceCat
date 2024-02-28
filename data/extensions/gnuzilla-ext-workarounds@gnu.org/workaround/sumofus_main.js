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

if(document.location.href.indexOf("sumofus") != -1){
    console.log("sumofus_main.js");

    function wildcard_match(str, rule) {
	return new RegExp("^" + rule.split("*").join(".*") + "$").test(str);
    }

    var page = window.location.href;
    /*
      if( wildcard_match(document.getElementsByTagName("pre")[0].innerHTML,'{"follow_up_url":"*"}') ){
      console.log(JSON.parse(document.getElementsByTagName("pre")[0].innerHTML)["follow_up_url"]);
      }
    */

    var style = "div {	top: 5%; margin-left: 10%; margin-right: 10%; background-color: white;}"
    var sheet = document.createElement('style');
    sheet.innerHTML = style;
    document.body.appendChild(sheet);
    if( wildcard_match(page,"*://*actions.sumofus.org/api/pages/*/actions") ){
	console.log("Submitted petition")
	//console.log("Redirecting...");
	var link = document.body.innerText;
	link = JSON.parse(link);
	//console.log(link);	
	document.body.innerHTML = "<h1>You have submitted this petition.</h1>";
    }


    function send_data(data){
	url = document.forms[0].action
	
	var xhr = new XMLHttpRequest();
	var url_encoded = "";
	var url_encoded_pairs = [];
	var name;

	for(name in data){
	    temp = encodeURIComponent(name) + '=' + encodeURIComponent(data[name])
	    url_encoded_pairs.push(temp);
	}
	url_encoded = url_encoded_pairs.join('&').replace(/%20/g, '+');
	
	xhr.addEventListener('load', function(event){
	    console.log("loaded");
	    res = JSON.parse(event.target.response);
	    url = res["follow_up_url"]
	    document.location = url;
	    
	});
	xhr.addEventListener('error', function(event){
	    console.log("Error submitting form.");
	});

	xhr.open('POST', url);
	xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	xhr.send(url_encoded);
	
    }

    if( wildcard_match(page,"*://*actions.sumofus.org/a/*") ){
	console.log("Fixing campaign page");

	// Make some changes to the page so it's readable.
	
	// because I noticed there were two of these for some reason	
	document.getElementsByTagName("button")[1].remove();
	document.getElementsByTagName("span")[0].innerHTML = "";
	var divs = 	document.getElementsByTagName("div");
	document.getElementsByClassName("noscript-notice")[0].remove();
	
	// If they change the HTML of the page this might break...
	//document.getElementsByClassName("petition-bar__content")[0].children[1].children[1].innerHTML = "";    
	for ( i=0; i<document.styleSheets.length; i++) {
	    void(document.styleSheets.item(i).disabled=true);
	}
	// apply some basic CSS
	var style = "div {margin: 50px; text-align: left; color: black; font-size: 12pt;}";
	var sheet = document.createElement('style');
	sheet.innerHTML = style;
	document.body.appendChild(sheet);
	
	// Make the button not submit a post request

	document.getElementsByClassName("button action-form__submit-button")[0].type = "button"
	
	// Add a listener to submit the form
	document.getElementsByClassName("button action-form__submit-button")[0].addEventListener("click", function(){
	    entries = document.getElementsByClassName("form__content sweet-placeholder__field");
	    data = []
	    for(i = 0; i < entries.length; i++){
		data.push(entries[i].value);
	    }

	    form_id = document.getElementsByName("form_id")[0].value
	    res = {
		country: data[2],
		email: data[0],
		form_id: form_id,
		name: data[1],
		phone: data[4],
		postal: data[3]
	    }

	    send_data(res);

	    
	});
	
	
    } else{
	console.log("Getting current campaigns");
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
	    if(this["readyState"] == 4 && this["status"] == 200){
		var campaigns = JSON.parse(this.responseText);
		//console.log(campaigns);
		var s = "";
		var number = "";
		//html_template += '<button onclick="">Show Pictures</button><br>';
		for(var i = 0; i < campaigns.length; i += 1){
		    number = (i+1)+"/"+campaigns.length+":";
		    s = campaigns[i]["title"]+"<br>";
		    html_template += number.link(campaigns[i]["url"])+s;
		    html_template += "<img src="+'"'+campaigns[i]["image"]+'"'+"><br>";
		}
		document.body.innerHTML = html_template;	
	    }
	};

	var html_template = "<h1>[Simple SumOfUs.org]</h1>";
	// URL to get campaigns
	var url = "http://actions.sumofus.org/api/pages/featured.json?language=en";

	document.head.replaceWith("");
	document.body.innerHTML = "";
	xhr.open("GET", url);
	xhr.send();
    }
}
