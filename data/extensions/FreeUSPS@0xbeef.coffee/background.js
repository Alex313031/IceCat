/*

Copyright (C) 2017 Nathan Nichols

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL NATHAN NICHOLS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

*/
var target = "https://postcalc.usps.com/Calculator/GetMailServices";
var start;
var weight;

function query_string(json) {
    return '?' + 
        Object.keys(json).map(function(key) {
            return encodeURIComponent(key) + '=' +
                encodeURIComponent(json[key]);
        }).join('&');
}
function message_received(message){

	if(message["start"] === undefined){
	} else{
		start = message["start"];
	}

	if(message["weight"] === undefined){
	} else{
		weight = message["weight"];
		var a = {
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

		var a = new XMLHttpRequest();
		var write_loc = document.getElementsByClassName("container")[1];;
		a.open("GET", "https://postcalc.usps.com/Calculator/GetMailServices" + query_string(postme))
		a.onload = function(){
			var response = JSON.parse(this.response)["Page"];
			for(var i = 0; i < response["MailServices"].length; i++){
				write_loc += response["MailServices"][i];
			}
		}
		a.setRequestHeader("Accept","application/json, text/javascript, */*; q=0.01");
		a.setRequestHeader("X-Requested-With","XMLHttpRequest");
		a.setRequestHeader("Referer","https://postcalc.usps.com/Calculator/MailServices");
	}
}
browser.runtime.onMessage.addListener(message_received);

