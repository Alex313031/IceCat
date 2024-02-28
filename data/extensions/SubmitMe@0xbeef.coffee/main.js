/*
Copyright (C) 2017 Nathan Nichols

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL NATHAN NICHOLS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

/*
Explanation:

This add-on was made to combat a reoccuring issue regarding LibreJS forms.

LibreJS tends to flag the onSubmit Javascript of HTML forms. This is because
this is a logical place to put Ajax requests, which LibreJS considers non-trivial. 

*/

browser.runtime.sendMessage({"msg":"add-on-invoked"});
console.log("main.js");

function tree(forms){
	var kids;
	var out_str;
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

function get_parent_form(a){
	console.log(a);
	if(a === null || a === undefined){
		return null;	
	}
	if(a.tagName.toLowerCase() == "form"){
		return a;
	}	
	return get_parent_form(a.parentElement);
};

function force_submit(){
	console.log("form submitted");
	return true;
};


var buttons = document.getElementsByTagName("input");
console.log(buttons);


function submit_clicked(){
	var parent = get_parent_form(this);
	if(parent === null){
		console.log("Submit button parent not found: input element outside of form?");
		var forms = document.getElementsByTagName("form");		
		console.log(forms);
		if(forms.length == 1){
			console.log("Only one possible form. Submitting it.")
			forms[0].submit();
		} else {
			browser.runtime.sendMessage({"msg":"multiple-forms"});
		}
	} else{
		console.log("Got parent form of button without error.")
		console.log(parent);
		parent.submit();
	}	
}

for(var i = 0; i < buttons.length; i++){
	if(buttons[i].type == "submit"){
		buttons[i].addEventListener("click",submit_clicked);
	}
}
