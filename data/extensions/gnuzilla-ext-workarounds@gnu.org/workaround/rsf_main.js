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

if(document.location.href.indexOf("rsf.org") != -1){
    console.log("rsf_main.js");
    function broken_page(){
	if(document.getElementsByClassName("col-md-4 petition-wrap")[0] === undefined){
	    return 0;	
	}	
	var iframe_src = document.getElementsByTagName("iframe")[0].src.replace(/[\s\S]+%20/g,"");
	document.getElementsByClassName("col-md-4 petition-wrap")[0].insertAdjacentHTML("afterbegin",'<h2 style="background-color: #00ffff;"><a href="'+iframe_src+'">Click here to sign the petition</a><h2>');
	document.getElementsByTagName("iframe")[0].remove();
    }

    function petition_page(){
	document.getElementsByTagName("form")[0].insertAdjacentHTML("beforeend",document.getElementById("ajax-view-state-page-container").innerHTML);
	console.log("inserted info");
    }

    if(document.location.href.match("rsf.secure.force.com/petition") !== null){
	console.log("petition");// the page in the iframe
	petition_page();
    } else{
	console.log("other page");
	broken_page();// the one with the iframe that is a 404
    }
}
