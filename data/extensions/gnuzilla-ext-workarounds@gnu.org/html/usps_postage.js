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

console.log("usps_postage.js");


function is_in(a, arr){
    for(var i = 0; i < arr.length; i++){
	if(a == arr[i]){
	    return true;
	}
    }

    return false;

}
function disable(name){
    off = document.getElementsByName(name);
    for(var i = 0; i < off.length; i++){
	off[i].style = "display:none;"
    }
}
function enable(name){
    on = document.getElementsByName(name);
    for(var i = 0; i < on.length; i++){
	on[i].style = ""
    }
}



function tag(name){
    return "<"+name+">";
}
function etag(name){
    return "</"+name+">";

}
function surround(name,content){
    return tag(name) + content + etag(name);
}
function visible(name){
    if(document.getElementsByName(name)[0].style.display == "none"){
	return false;
    }else{
	return true;
    }
}

function gen_package(data){
    var res = '<Package ID="0">';
    res = res + surround("Service", data["Service"]);

    if(visible("FirstClassMailType")){
	res=res+surround("FirstClassMailType", data["FirstClassMailType"]);
    }
    res = res + surround("ZipOrigination", data["ZipOrigination"]);    
    res = res + surround("ZipDestination", data["ZipDestination"]);
    res = res + surround("Pounds", data["Pounds"]);    
    res = res + surround("Ounces", "0");
    
    res = res + surround("Container", data["Container"]);
    res = res + surround("Machinable", data["Machinable"]);
    
    res = res + etag("Package");

    return res;
}

function build_xml_domestic(data){
    var res = '<RateV4Request USERID="' +data["USERID"] +'">';
    res = res + "<Revision>2</Revision>";
    res = res + gen_package(data);
    res  = res + etag("RateV4Request");
    return res;
}

function check_domestic(req){
    console.log("Form changed.");
    
    serv = req["Service"];
    // "Machinable" required for:
    mach=["FIRST CLASS","LETTER","FLAT","RETAIL GROUND","ALL","ONLINE"];
    if(is_in(serv, mach) == true){
	enable("Machinable");
    }else{
	disable("Machinable")
    }

    if(serv == "Retail Ground"){
	enable("GroundOnly");
    }else{
	disable("GroundOnly");
    }
    
    fcmt=["FIRST CLASS","FIRST CLASS COMMERCIAL","FIRST CLASS HFP COMMERCIAL"];
    if(is_in(serv, fcmt)){
	enable("FirstClassMailType");
    }else{
	disable("FirstClassMailType");
    }
    
    if(resp["ContentType"] == "LIVES"){
	enable("ContentDescription");
    }else{
	disable("ContentDescription");
    }
};
function check_intl(req){
    console.log("Form changed.");
    
};


function byname(name){
    return document.getElementsByName(name)[0].value;
}

// Return an array of the selected opion values
function select_values(name) {
    var opts = document.getElementsByName(name)[0].options
    var res = [];
    for(var i = 0; i < opts.length; i++){
	if(opts[i].selected){
	    res.push(opts[i].value);
	}
    }
    return res;
}

// reads the form and returns a dictionary
function read_domestic(){
    resp = {};
    resp["USERID"] = byname("USERID"); 
    resp["Service"] = byname("Service");
    resp["FirstClassMailType"] = byname("FirstClassMailType");
    resp["Machinable"] = byname("Machinable");
    resp["ZipOrigination"] = byname("ZipOrigination"); 
    resp["ZipDestination"] = byname("ZipDestination"); 
    resp["Pounds"] = byname("Pounds"); 
    resp["Container"] = byname("Container");
    //resp["Size"] = byname("Size");
    resp["Width"] = byname("Width");
    resp["Length"] = byname("Length");
    resp["Height"] = byname("Height");
    resp["Girth"] = byname("Girth");
    resp["Value"] = byname("Value");
    resp["AmountToCollect"] = byname("AmountToCollect");
    resp["SpecialServices"] = select_values("SpecialService");
    resp["ContentType"] = byname("ContentType");

    if(resp["ContentType"] == "DEFAULT"){
	resp["ContentType"] = "";
    }
    return resp;
}


// reads the form and returns a dictionary
function read_intl(){
    resp = {};
    resp["USERID"] = byname("USERID2"); 
    resp["Machinable"] = byname("Machinable2");
    resp["MailType"] = byname("MailType"); 
    //resp["POBoxFlag"] = byname("POBoxFlag"); 
    //resp["GiftFlag"] = byname("GiftFlag"); 
    resp["ValueOfContents"] = byname("ValueOfContents"); 
    resp["Country"] = byname("Country");
    resp["Pounds"] = byname("Pounds2");
    resp["GiftFlag"] = byname("GiftFlag");
    resp["POBoxFlag"] = byname("POBoxFlag");
    resp["OriginZip"] = byname("OriginZip");
    resp["Width"] = byname("Width2");
    resp["Length"] = byname("Length2");
    resp["Height"] = byname("Height2");
    resp["Girth"] = byname("Girth2");
    resp["Container"] = byname("Container2");
    resp["CommercialFlag"] = byname("CommercialFlag");
    resp["CommercialPlusFlag"] = byname("CommercialPlusFlag");
    resp["Size"] = byname("Size2");
    

    return resp;
}

function decode_html(input){
  var e = document.createElement('div');
  e.innerHTML = input;
  return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
}


function make_row(name, avail, price){
    res = "<tr>";
    res = res+"<td>"+name+"</td>";
    res = res+"<td>"+avail+"</td>";
    res = res+"<td>"+price+"</td>";
    res = res+"</tr>\n";
    return res;
    
}

function parse_response(resp){
    console.log(resp.documentElement.outerHTML);
    xml_doc = $.parseXML(resp.documentElement.outerHTML);
    $xml = $(xml_doc);
    errs = $xml.find("Error");
    console.log(errs);

    var res = "";
    
    if(errs.length > 0){
	for(var i = 0; i < errs.length; i++){
	    res = res+i.toString()+": "+$(errs[i]).find("Description")[0].innerHTML;
	    res = res +"<br>";
	}
	$("#errors").html(res)
	$("#mainrate").html("");
	$("#results").html("");
	
	return "";
    }

    $pack = $($xml.find("Package")[0]);

    // Get Parse the main result
    mailserv = decode_html($pack.find("MailService")[0].innerHTML);
    rate = $pack.find("Rate")[0].innerHTML;

    var res = "";
    res = "<b>Mail Service:</b>"+mailserv+"<br>";
    res = res+"<b>Rate:</b>"+rate+"<br>\n"   

    // Generate a table of the services available
    servs = $pack.find("SpecialService");
    table = make_row("<b> Service name </b>", "<b>Available</b>", "<b>Price</b>"); 
    for(var i = 0; i < servs.length; i++){
	serv = $(servs[i]);
	name = decode_html(serv.find("ServiceName")[0].innerHTML);
	avail = serv.find("Available")[0].innerHTML;
	price = serv.find("Price")[0].innerHTML;
	table = table + make_row(name,avail,price);
    }
    
    table = "<tbody>"+table+"</tbody>";
    $("#mainrate").html(res);
    $("#results").html(table);
    return table;
}


function make_api_call(url){
    $.ajax({
	url: url,
	cache: false,
	type: 'post',
    }).done(function(d){
	console.log("Success");
	var res = parse_response(d);
	//$("#results").html(res);	
    }).always(function(){
	
    }).fail(function(d){
	console.log("Failed");
	console.log(d);
    });
}

function gen_package_intl(data){
    var res = "";
    res = res + '<Package ID="0">';
    res = res + surround("Pounds",data["Pounds"])
    res = res + surround("Ounces","0");
    res = res + surround("Machinable",data["Machinable"]);
    res = res + surround("MailType",data["MailType"]);
    /*
    res = res + "<GXG>"
    res = res + surround("POBoxFlag",data["POBoxFlag"]);
    res = res + surround("GiftFlag",data["GiftFlag"]);
    res = res + "</GXG>"
    */
    res = res + surround("ValueOfContents", data["ValueOfContents"]);
    res = res + surround("Country",data["Country"]);
    //res = res + surround("Size",data["Size"]);
    //res = res + surround("Container",data["Container"]);    
    //res = res + surround("Width",data["Width"]);
    //res = res + surround("Length",data["Length"]);
    //res = res + surround("Height",data["Height"]);
    //res = res + surround("Girth",data["Girth"]);
    res = res + surround("OriginZip",data["OriginZip"]);
    
    res = res + '</Package>';

    return res;
}


function build_xml_intl(data){
    res = "";
    res = res + '<IntlRateV2Request USERID="'+data["USERID"]+'">';
    res = res + gen_package_intl(data);

    res = res + "</IntlRateV2Request>";
    console.log(res);
    return res;
};



window.addEventListener('load', (event) => {

    $("#button_domestic").bind("click",function(){
	console.log("Making request");
	r = read_domestic();
	check_domestic(r);
	url = "http://production.shippingapis.com/ShippingAPI.dll?API=RateV4&XML=";
	url = url + build_xml_domestic(r);
	console.log(url);
	make_api_call(url);
    });

    console.log("Window loaded.")
    disable("Machinable");
    disable("FirstClassMailType");
    disable("ContentDescription");
    disable("GroundOnly");

    document.getElementById("button_intl").style = "display:none;";
    document.forms[1].style = "display:none;";
    
    document.forms[0].addEventListener("change", function(){
	r = read_domestic();
	check_domestic(r);
	url = "http://production.shippingapis.com/ShippingAPI.dll?API=RateV4&XML=";
	url = url + build_xml_domestic(r);
	console.log(url);
    });

    $("#button_intl").bind("click",function(){
	console.log("Making request");
	r = read_intl();
	check_intl(r);
	url = "http://production.shippingapis.com/ShippingAPI.dll?API=IntlRateV2&XML=";
	url = url + build_xml_intl(r);
	console.log(url);
	make_api_call(url);
    });
    
    document.forms[1].addEventListener("change", function(){
	r = read_intl();
	url = "http://production.shippingapis.com/ShippingAPI.dll?API=IntlRateV2&XML=";
	url = url + build_xml_intl(r);
	console.log(url);
    });
    
});



