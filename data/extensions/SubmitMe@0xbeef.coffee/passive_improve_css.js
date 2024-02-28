/*

Copyright (C) 2017 Nathan Nichols

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL NATHAN NICHOLS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/


function escapeHTML (unsafe_str) {
    return unsafe_str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\"/g, '&quot;')
      .replace(/\'/g, '&#39;')
      .replace(/\//g, '&#x2F;')
}

console.log("passive_improve_css.js");
function reveal_css(){
	var bad = [];

	var elements = document.getElementsByTagName("style");
	for(var i = 0; i < elements.length; i++){
		var rules = escapeHTML(elements[i].innerText).replace(/\s/g,'');
		var j = rules.indexOf("display");
		if(j != -1){
			//console.log("j:"+j);
			var part = rules.substr(j,j+10);
			//console.log("part:"+part); 
			//console.log("index:"+part.indexOf("none"));
			if(part.indexOf("none") <= 10 && part.indexOf("none") > 0){
				//elements[i].remove();
				bad.push(elements[i]);
				//console.log("^^^^BAD^^^^")
			}

		}
	}
	if(bad.length > 0){
		for(var i = 0; i < bad.length; i++){
			bad[i].remove();
		}
	}
}

reveal_css();


/*
var a = document.getElementsByTagName("style")[2];
var btn = document.createElement("style");        // Create a <button> element
var t = document.createTextNode("body{display:inline !important;}");       // Create a text node
btn.appendChild(t);                                // Append the text to <button>
a.insertAdjacentElement("beforeBegin",btn);
*/
