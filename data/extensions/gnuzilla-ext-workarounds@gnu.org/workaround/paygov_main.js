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

if(document.location.href.indexOf("copyright.gov")!= -1){
    console.log("paygov_main.js");

    var content;
    function replace_regex(){
	content = document.documentElement.innerHTML;
	content = content.replace(/type\s*\=\s*("|')\s*hidden\s*\1\s*;/g,"");
	content = content.replace(/display\s*:\s*none/g,"");
	content = content.replace(/visibility\s*:\s*hidden/g,"");
	document.documentElement.innerHTML = "<html>"+content+"</html>";
    }

    if(window.getComputedStyle(document.body)["display"] == "none"){
	replace_regex();
    }
    function parseURL(a){
	let url = new URL(a);
	var result = Object.create(null);
	for(let i of url.searchParams) {
            result[i[0]] = i[1];
	}
	return JSON.stringify(result, undefined, 4); 
    }
    function get_domain(url){
	var domain = url.replace('http://','').replace('https://','').split(/[/?#]/)[0];
	if(url.indexOf("http://") == 0){
	    domain = "http://" + domain;
	}
	else if(url.indexOf("https://") == 0){
	    domain = "https://" + domain;
	}
	domain = domain + "/";
	domain = domain.replace(/ /g,"");
	return domain;
    }

    if(document.location.href.indexOf("pay.gov/tcsonline/") != -1){
	document.getElementsByClassName("text")[0].remove();
	console.log("detected payment page.");

	if(	document.getElementsByClassName("redbuttontext") !== null){
	    document.getElementsByClassName("redbuttontext")[0].remove();
	}


	document.getElementById("hiddenContinueButton").style.display = "";
	document.getElementById("statesCAN").remove();
	document.getElementById("statesUSA").remove();
	document.getElementById("stateText").value = "2 letter code";
    }

    if(get_domain(document.location.href) == "https://dmca.copyright.gov/"){

	document.body.style.display = true;
	var csrf = document.getElementsByName("_csrf")[0].content;
	console.log("csrf:"+csrf);
	var form = document.getElementById("file");
	if(form !== null){
	    console.log("upload page detected");
	    document.getElementById("btnUpload").disabled = false;
	    var xml = new XMLHttpRequest();
	    //xml.open("POST","https://dmca.copyright.gov/osp/home/alternatename/edit/alternatename.html",true);
	    var url = "https://dmca.copyright.gov/home/alternatename/edit/alternatenameajaxdisplay.html"		
	    console.log("OPENING "+url);		
	    xml.open("POST",url,true);
	    console.log("DONE");		
	    var spid = JSON.parse(parseURL(document.location.href))["spid"];
	    console.log("spid:"+spid);
	    var payload = {  
		"draw":1,
		"columns":[  
		    {  
			"data":"name",
			"name":"",
			"searchable":true,
			"orderable":true,
			"search":{  
			    "value":"",
			    "regex":false
			}
		    },
		    {  
			"data":null,
			"name":"",
			"searchable":true,
			"orderable":false,
			"search":{  
			    "value":"",
			    "regex":false
			}
		    }
		],
		"order":[  
		    {  
			"column":0,
			"dir":"asc"
		    }
		],
		"start":0,
		"length":10,
		"search":{  
		    "value":"",
		    "regex":false
		},
		"spid": spid
	    };

	    xml.onload = function(){
		console.log(this);
		var parser = new DOMParser();
		var doc = parser.parseFromString(this.responseText, "text/html");
		var error = doc.getElementsByClassName("page-head")[0];
		if(error != undefined){
		    console.log(error.innerText.replace(/\t/g,""));
		} else{
		    console.log(this.responseText);
		}
	    }
	    console.log("retrieving data...");
	    xml.setRequestHeader('Accept', 'application/json');
	    xml.setRequestHeader('Content-Type', 'application/json');
	    xml.setRequestHeader("csrfHeader", csrf);

	    xml.send(payload);
	    
	}
    }


}
