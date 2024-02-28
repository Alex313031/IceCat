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
if(document.location.href.indexOf("docs.google.com") != -1){
    console.log("googledocs_main.js");
    function parseURL(a){
	let url = new URL(a);
	var result = Object.create(null);
	for(let i of url.searchParams) {
	    result[i[0]] = i[1];
	}
	return JSON.stringify(result, undefined, 4); 
    }
    var id;
    var url;
    function form_check(){
	console.log("boop");
	var format = "";
	var input = document.getElementsByTagName("input");
	if(input[input.length-1].value != "Expected 3 letter file extension"){
	    format = input[input.length-1].value;
	} else{
	    for(var i = 0; i < input.length-1; i++){
		if(input[i].value != ""){
		    format = input[i].value;
		    break;
		}
	    }
	    if(format == ""){
		return 0;		
	    }
	}

	// Supposed to look like this:
	// https://docs.google.com/document/export?format=FORMAT&id=ID
	// Thanks to Alyssa Rosenzweig.
	var new_url = 'https://docs.google.com/document/export?format='+format+'&id='+id;
	document.location.assign(new_url);
	return 0;
    }


    var contains_apostrophe = "You don't really want to store your data in a cloudy service do you?";
    var opts_form =
	'	<br>'+
	'	<h1>Google Drive without non-free Javascript</h1>'+
	'	'+contains_apostrophe+'<br><br><br>'+
	'	<div id="opts">'+
	'	<b>Please select the format to download in:</b><br><br>'+
	'	<input type="radio" name="format" value="txt"> Plain text ("txt")<br>'+
	'	<input type="radio" name="format" value="odt"> ODT ("odt")<br><br>'+
	'	Or try to get the document in a different format, '+
	'	("png", "avi", "pdf", etc..):<br><br>'+
	'	<input type="text" value="Expected 3 letter file extension"><br><br>'+
	'	<button id="submit">Go fetch the document<br>'+
	'	</div>'+
	''+
	''+
	'';

    // see if its a document or not.
    function check_valid(){
	id = "no ID found.";
	var url_arr = document.location.href.split("/");
	for(var i = 0; i < url_arr.length-1; i++){
	    if(url_arr[i] == "d"){
		id = url_arr[i+1];
		break;
	    }
	    if(url_arr[i].indexOf("id=") != -1){
		id = document.location.href.substring(url_arr[i].indexOf("id=")+3,document.location.href.length);
		break;
	    }
	}
	console.log(id);
	if(id == "no ID found."){
	    // do nothing because it could be an info page or something
	    console.log("no id found.");
	    return false;
	}
	else {
	    return true;
	}
    }



    function main(){
	
	if(check_valid()){	
	    console.log("---------------------------------"+Date.now()+":Detected Google Drive."+"---------------------------------");
	    window.stop();
	    document.head.innerHTML = "";
	    document.body.innerHTML = opts_form;
	    document.body.style.textAlign = "center";
	    document.getElementById("opts").style.textAlign = "left";	
	    //document.getElementsById("opts").style.float = "left";	
	    document.body.style.marginTop = "2%"
	    document.body.style.marginLeft = "25%"
	    document.body.style.marginRight = "25%"
	    document.getElementById("submit").addEventListener("click",form_check);
	}
	return 0;
    }
    main();
}
