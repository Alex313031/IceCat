/*

Copyright (C) 2017 Nathan Nichols

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL NATHAN NICHOLS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

*/

var target = "https://postcalc.usps.com/Calculator/GetMailServices";

// The website has a bar identified by it's CSS class "breadcrumb"
// that is basically the working directory of the calculator (tells what stage the calculating process is on).
// On the first page it isn't there, but on the others it is.
// This is the main thing I use to detect what javascript needs to be run. 

function qs2json(a){
	let url = new URL(a);
	var result = Object.create(null);
    for(let i of url.searchParams) {
        result[i[0]] = i[1];
    }
    //console.log(JSON.stringify(result, undefined, 4));
	return JSON.stringify(result, undefined, 4); 
}
function query_string(json) {
    return '?' + 
        Object.keys(json).map(function(key) {
			if(key === undefined){
				return "=";
			}else{
		        return encodeURIComponent(key) + '=' + encodeURIComponent(json[key]);
			}
		}).join('&')
}
function lbs_2_kg(lbs,oz){
	return ( lbs + (oz*(1/16)) ) * 0.453592;
}
var a = document.getElementsByClassName("breadcrumb")[0];

if(a === undefined){
	//console.log("first page");
	var a = "first";
} else{
	a = a.getElementsByClassName("active")[0].innerText;
	//console.log(a);
}

var html_form = document.getElementsByTagName("form")[0];

// this is the main one that is broken.
if(a == "Mail Services"){

	console.log("reached broken page");
	var all_data = {
		countryID: document.getElementById('MachProp_ShpSz_IdxPg_CountryID').value,
		countryCode: document.getElementById('MachProp_ShpSz_IdxPg_CountryCode').value,
		origin: document.getElementById('MachProp_ShpSz_IdxPg_Origin').value,
		isOrigMil: document.getElementById('MachProp_ShpSz_IdxPg_IsOriginMilitary').value,
		destination: document.getElementById('MachProp_ShpSz_IdxPg_Destination').value,
		isDestMil: document.getElementById('MachProp_ShpSz_IdxPg_IsDestinationMilitary').value,
		shippingDate: document.getElementById('MachProp_ShpSz_IdxPg_ShippingDate').value,
		itemValue: document.getElementById('MachProp_ShpSz_IdxPg_ItemValue').value,
		dayOldPoultry: document.getElementById('MachProp_ShpSz_IdxPg_DayOldPoultry').value,
		groundTransportation: document.getElementById('MachProp_ShpSz_IdxPg_GroundTransportation').value,
		hazmat: document.getElementById('MachProp_ShpSz_IdxPg_Hazmat').value,
		liveAnimals: document.getElementById('MachProp_ShpSz_IdxPg_LiveAnimals').value,
		nonnegotiableDocument: document.getElementById('MachProp_ShpSz_IdxPg_NonnegotiableDocument').value,
		mailShapeAndSize: document.getElementById('MachProp_ShpSz_IdxPg_MailShapeAndSize').value,
		pounds: document.getElementById('MachProp_ShpSz_Pounds').value,
		ounces: document.getElementById('MachProp_ShpSz_Ounces').value,
		length: document.getElementById('MachProp_Length').value,
		height: document.getElementById('MachProp_Height').value,
		width: document.getElementById('MachProp_Width').value,
		girth: document.getElementById('MachProp_Girth').value,
		shape: document.getElementById('MachProp_Shape').value,
		nonmachinable: document.getElementById('MachProp_Nonmachinable').value,
		isEmbedded: document.getElementById('MachProp_ShpSz_IdxPg_IsEmbedded').value
	};
	//console.log("all data:");
	//console.log(all_data);
	var x = new XMLHttpRequest();
	var write_loc = document.getElementsByClassName("container")[1];
	
	function write_val(a){
		write_loc.innerHTML += "<br>";
		write_loc.innerHTML += a;						
	};

	x.open("GET", "https://postcalc.usps.com/Calculator/GetMailServices"+query_string(all_data));
	x.onload = function(){
		var response = JSON.parse(this.response)["Page"];
		if(JSON.parse(this.response)["PageError"] != ""){
			write_val("<b>----------"+JSON.parse(this.response)["PageError"]+"----------</b>");
			for(var i = 0; i < JSON.parse(this.response)["Page"]["Footnotes"].length; i++){
				write_val(JSON.parse(this.response)["Page"]["Footnotes"][i]);
			}
			return;
		}
		for(var i = 0; i < response["MailServices"].length; i++){	
			write_val(" ");
			write_val("<b>----------"+response["MailServices"][i]["Title"]+"----------</b>");
			write_val('		<img src="'+response["MailServices"][i]["ImageURL"]+'" height="128" width="128">');
			if(response["MailServices"][i]["Dimensions"] != ""){
				write_val("		<b>Dimensions:</b> " + response["MailServices"][i]["Dimensions"]);
			} 			 			
			var opts = response["MailServices"][i]["DeliveryOptions"];
			for(var j = 0; j < opts.length; j++){
				write_val("		<b>"+opts[j]["Name"]+" ("+opts[j]["DeliveryDay"]+")"+":</b>");
				write_val("			Click-N-Ship® Price:"+opts[j]["CnSPrice"]);
				write_val("			Retail Price:"+opts[j]["RetailPrice"]);
				write_val('			Extra services (customs forms, etc..):<a href="'+opts[j]["URL"]+'">[click]</a>');
			}

			//console.log(response["MailServices"][i]);
		}
	}
	x.setRequestHeader("Accept","application/json, text/javascript, */*; q=0.01");
	x.setRequestHeader("X-Requested-With","XMLHttpRequest");
	x.setRequestHeader("Referer","https://postcalc.usps.com/Calculator/MailServices");
	x.send();
}
// This one is also broken but much simpler.
// USPS has an API for checking zip codes. Perhaps they were calling this API in the onclick JS
// and that was what caused it to get flagged as non-trivial? Will skipping this check cause 
// bugs to arise? 
if(a == "GXG Mailing Location"){
	var button = document.getElementsByClassName("btn btn-pcalc hidden-print")[0];
	button.addEventListener("click", function(){
		document.getElementsByTagName("form")[0].submit();
	});
}


if(a == "Weight and Shape/Size"){
	html_form.onsubmit = function(){
		var data = {};
		var inputs = document.getElementsByTagName("input");
		for(var i = 0; i < inputs.length; i++){
			data[inputs[i].name] = inputs[i].value;
		}
		//console.log(data);
		data["Kilograms"] = lbs_2_kg(parseFloat(data["Pounds"]),parseFloat(data["Ounces"]));
		//console.log("sent message");
		browser.runtime.sendMessage({"weight": data});
		return true;
	};
}
if(a == "first"){
	html_form.onsubmit = function(){
		//console.log("entered first page");
		var data = {};
		var inputs = document.getElementsByTagName("input");
		for(var i = 0; i < inputs.length; i++){
			data[inputs[i].name] = inputs[i].value;
		}
		data["_"] = Date.now();
		browser.runtime.sendMessage({"start": data});
		return true;
	};
}
if(a == "Postal Code"){
	var x = new XMLHttpRequest();
	x.onload = function(){
		// gets here when we receive the city data after they submit the form.
		var response = JSON.parse(this["response"]);
		//console.log(response);
		document.getElementById("cities-panel").style = "";
		var opts_here = document.getElementById("CityID");
		var opts = response["Options"];


		// Added this block because states with more than a small amount of cities would cause 
		// the browser to hang. 
		var i = 0; 
		function next_200(){
			for(var j = 0; j < 50; j++){
				if( i+j == opts.length){
					return 0;				
				} else{
					opts_here.innerHTML += '<option value="'+opts[i+j]+'">'+opts[i+j]+"</option";
				}	
			}
			i += 50;
			//console.log(i)
			setTimeout(function() {next_200();},150);
		}
		next_200();
	};


	var postal_code_data = {
		countryCode : document.getElementById("ShpSz_IdxPg_CountryCode").value,
		stateProvinceID: "", // needs to be entered by the user.
		_:Date.now()
	};

	document.getElementById("PostalCodeID").onchange = function(){
		document.getElementById("Destination").value = document.getElementById("PostalCodeID").value
	}
	document.getElementsByClassName("panel-body")[0].style = "";
	document.getElementById("StateProvinceID").value = document.getElementById("StateProvinceID").children[0].innerText;
	document.getElementById("StateProvinceID").onchange = function(){
		// Once they pick a province/state, it has to get the city data. 
		postal_code_data["stateProvinceID"] = document.getElementById("StateProvinceID").value;
		x.open("GET", "https://postcalc.usps.com/Calculator/StateProvinceSelected"+query_string(postal_code_data));
		x.setRequestHeader("Accept","application/json, text/javascript, */*; q=0.01");
		x.setRequestHeader("X-Requested-With","XMLHttpRequest");
		x.setRequestHeader("Referer","https://postcalc.usps.com/Calculator/PostalCode");
		x.send();
	}
	document.getElementById("CityID").onchange = function(){
		// Once they pick a city, it has to get the possible postal codes. 

		x.onload = function(){
			// here when we send back the city
			var response = JSON.parse(this["response"]);
			//console.log(response);
			document.getElementById("postal-codes-panel").style = "";
			var opts = response["Options"];
			var opts_here = document.getElementById("PostalCodeID");
			opts_here.innerHTML += '<option value="">Please select one of the following</option';
			for(var i = 0; i < opts.length; i++){
				opts_here.innerHTML += '<option value="'+opts[i]+'">'+opts[i]+"</option";
			}

		};
		postal_code_data["cityID"] = document.getElementById("CityID").value;
		//console.log("sending:");
		//console.log(postal_code_data);
		x.open("GET", "https://postcalc.usps.com/Calculator/CitySelected"+query_string(postal_code_data));
		x.setRequestHeader("Accept","application/json, text/javascript, */*; q=0.01");
		x.setRequestHeader("X-Requested-With","XMLHttpRequest");
		x.setRequestHeader("Referer","https://postcalc.usps.com/Calculator/PostalCode");
		x.send();
	}
	//document.getElementById("CityID").onchange = function(){}
}

if(a == "Extra Services"){
	var target = "Calculator/GetExtraServices";
	var extra_services_data = {
		"countryID": document.getElementById("MailSrvcs_MachProp_ShpSz_IdxPg_CountryID").value,
		"countryCode": document.getElementById("MailSrvcs_MachProp_ShpSz_IdxPg_CountryCode").value,
		"origin": document.getElementById("MailSrvcs_MachProp_ShpSz_IdxPg_Origin").value,
		"destination": document.getElementById("MailSrvcs_MachProp_ShpSz_IdxPg_Destination").value,
		"shippingDate": document.getElementById("MailSrvcs_MachProp_ShpSz_IdxPg_ShippingDate").value,
		"itemValue": document.getElementById("MailSrvcs_MachProp_ShpSz_IdxPg_ItemValue").value,
		"dayOldPoultry": document.getElementById("MailSrvcs_MachProp_ShpSz_IdxPg_DayOldPoultry").value,
		"groundTransportation": document.getElementById("MailSrvcs_MachProp_ShpSz_IdxPg_GroundTransportation").value,
		"hazmat": document.getElementById("MailSrvcs_MachProp_ShpSz_IdxPg_Hazmat").value,
		"liveAnimals": document.getElementById("MailSrvcs_MachProp_ShpSz_IdxPg_LiveAnimals").value,
		"nonnegotiableDocument": document.getElementById("MailSrvcs_MachProp_ShpSz_IdxPg_NonnegotiableDocument").value,
		"mailShapeAndSize": document.getElementById("MailSrvcs_MachProp_ShpSz_IdxPg_MailShapeAndSize").value,
		"pounds": document.getElementById("MailSrvcs_MachProp_ShpSz_Pounds").value,
		"ounces": document.getElementById("MailSrvcs_MachProp_ShpSz_Ounces").value,
		"length": document.getElementById("MailSrvcs_MachProp_Length").value,
		"height": document.getElementById("MailSrvcs_MachProp_Height").value,
		"width": document.getElementById("MailSrvcs_MachProp_Width").value,
		"girth": document.getElementById("MailSrvcs_MachProp_Girth").value,
		"shape": document.getElementById("MailSrvcs_MachProp_Shape").value,
		"nonmachinable": document.getElementById("MailSrvcs_MachProp_Nonmachinable").value,
		"mailServiceID": document.getElementById("MailSrvcs_MailServiceID").value,
		"deliveryOption": document.getElementById("MailSrvcs_DeliveryOption").value,
		"extraServiceSelected": document.getElementById("Selected").value,
		"additionalInputValues": document.getElementById("AdditionalInputValues").value,
		"isPostBack": "False"// explanation:
		// When you select some options, it disables others. 
		// If figures out what options are disabled by any selected option by communicating back to
		// the website. This value is false for the initial one and true for the rest. 
	};
	
	var write_loc = document.getElementsByClassName("container")[1];

	function write_val(a){
		write_loc.innerHTML += "<br>";
		write_loc.innerHTML += a;						
	};
	var x = new XMLHttpRequest();
	x.open("GET", "https://postcalc.usps.com/Calculator/GetExtraServices"+query_string(extra_services_data));
	x.onload = function(){
		var response = JSON.parse(this["response"]);
		if(response["PageError"] != ""){
			write_val("<b>----------"+response["PageError"]+"----------</b>");
			return;
		}
		response = response["Page"];
		//console.log(response);
		// write customs info
		write_val("<b>----------Customs forms (if applicable)----------</b>");
		write_val("<i>NOTE: These are beyond the scope of this add-on (for now atleast.)<br> You can still calculate your price and see what options you have.<></i>");
		for(var i = 0; i < response["CustomsFormPage"]["CustomsForms"].length; i++){
			write_val(response["CustomsFormPage"]["CustomsForms"][i]["FormName"]);
		}
		write_val("<br>NOTE: "+response["CustomsFormPage"]["Footnotes"][0]);
		// write other services 		
		for(var i = 0; i < response["ExtraServices"].length; i++){
			//console.log(response["ExtraServices"][i]);
			write_val("<b>----------"+response["ExtraServices"][i]["Name"]+"----------</b>");
			// Decided not to implement the XHR part of this to keep it simple			
			//write_val('<input type="checkbox" id="'+response["ExtraServices"][i]["ID"]+'" value="checked">');
			write_val("<i>Retail price: </i>"+response["ExtraServices"][i]["RetailPrice"]);
			write_val("<i>Click-N-Ship® price: </i>"+response["ExtraServices"][i]["CnSPrice"]);
			for(var j = 0; j < response["ExtraServices"][i]["Messages"].length; j++){
				write_val("Message: "+response["ExtraServices"][i]["Messages"][j]);
			}
		}	
	}
	x.setRequestHeader("Accept","application/json, text/javascript, */*; q=0.01");
	x.setRequestHeader("X-Requested-With","XMLHttpRequest");
	x.setRequestHeader("Referer","https://postcalc.usps.com/Calculator/MailServices");
	x.send();
}












