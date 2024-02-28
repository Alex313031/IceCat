/*
Copyright (C) 2017 Nathan Nichols

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL NATHAN NICHOLS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
console.log("manual.js");
function tree(forms){
	var kids = [];
	var out_str = "";
	for(var i = 0; i < forms.length; i++){
		kids = [];
		for(var j = 0; j < forms[i].children.length; j++){
			if(forms[i].children[j].tagName == "INPUT"){
				kids.push(forms[i].children[j]);
			}
		}
		out_str += "\nForm number " + (i + 1) + ":";
		for(var j = 0; j < kids.length; j++){
			out_str += "\n	Item #"+(j+1)+":";
			out_str += "\n		Text:'"+kids[j].innerHTML+"'";
			out_str += "\n		Name:'"+kids[j].name+"'";
			out_str += "\n		Value:'"+kids[j].value+"'";
		}

	}
	return out_str;
}

var forms = document.getElementsByTagName("form");		

console.log("multiple possible forms.");
var a = window.prompt("Please select one of the following forms:\n" + tree(forms) + "\n\n Enter a number to submit that form. Any other input will cancel this operation.");
if(parseInt(a) === NaN){
	console.log("not a number.");
} else {
	if( (parseInt(a)-1) < forms.length){
		forms[parseInt(a)-1].submit();	
	}
}

