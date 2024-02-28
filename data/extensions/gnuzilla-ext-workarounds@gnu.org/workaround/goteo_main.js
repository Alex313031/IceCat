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
if(document.location.href.indexOf("pgw.ceca.es") != -1
   || document.location.href.indexOf("goteo.org") != -1
   || document.location.href.indexOf("sis.sermepa.es") != -1
  ){
    console.log("goteo_main.js");
    function update_currency(){
	var curr = document.getElementById("currency_select").selectedOptions[0].innerHTML;
	var value = document.getElementsByName("Importe")[0].value;
	value = value.substr(0,value.length-2) + "," + value.substr(value.length-2,value.length)+" "+curr;
	document.getElementById("imp").innerText = value;
	var currency = document.getElementsByName("TipoMoneda")[0];
	currency.value = document.getElementById("currency_select").value;		
    }

    if(document.location.href.indexOf("sermepa.es/sis") != -1){
	console.log("sis.sermepa.es");
	document.forms[0].submit();
    }

    
    if(document.domain.indexOf("goteo.org") == -1){

	var currency_options = '<div class="box mgt"><div class="izq"><label class="bloque">Currency/moneda:</label><select id="currency_select"><option value="978">EUR</option></select></div></div>';
	document.getElementById("pago_tarjeta").insertAdjacentHTML("beforeend",currency_options);
	document.getElementById("currency_select").addEventListener("change", update_currency);

	// Generate correct year options
	var d = new Date();
	var n = d.getFullYear();
	var opts = "";

	for(var i = 0; i < 15; i++){
	    var cy = n+i;
	    opts += "<option value='"+cy+"'>"+cy+"</option>\n";
	}

	document.getElementsByName("elanyo")[0].insertAdjacentHTML("afterbegin",opts);
	document.body.insertAdjacentHTML("afterbegin","<h1>3rd party Javascript activated because you downloaded an add-on to use this page with free Javascript. If you are not running LibreJS, disable this add-on or reload with it enabled.</h1>");
	document.getElementsByTagName("h1")[0].style.display = "inline";
	document.getElementsByTagName("h1")[0].style.color = "red";

	document.getElementById("visa").children[0];
	document.getElementById("tarjetero").children[0];
	document.getElementById("masterpass").children[0];


	var a = document.getElementsByClassName("izq divizq")[0];
	a.addEventListener("click",function(){
	    if(document.getElementById("visa").children[0].checked){
		document.getElementById("pago_tarjeta").style.display = "block";
		document.getElementById("pago_tarjetero").style.display = "none";
		document.getElementById("pago_masterpass").style.display = "none";
	    }
	    if(document.getElementById("tarjetero").children[0].checked){
		document.getElementById("pago_tarjeta").style.display = "none";
		document.getElementById("pago_tarjetero").style.display = "block";
		document.getElementById("pago_masterpass").style.display = "none";
	    }
	    if(document.getElementById("masterpass").children[0].checked){
		document.getElementById("pago_tarjeta").style.display = "none";
		document.getElementById("pago_tarjetero").style.display = "none";
		document.getElementById("pago_masterpass").style.display = "block";
	    }	
	});

	a.click();

	document.getElementById("pagar").addEventListener("click",function(){
	    // Read the inputs and set the form values:
	    // expire date
	    var expire = document.getElementsByName("Caducidad")[0];
	    expire.value = document.getElementsByName("elanyo")[0].value+document.getElementsByName("elmes")[0].value;
	    // currency code
	    var currency = document.getElementsByName("TipoMoneda")[0];
	    currency.value = document.getElementById("currency_select").value;		

	    document.getElementsByTagName("form")[0].submit();
	});

	var num_op = document.getElementsByName("Num_operacion")[0].value;
	document.getElementById("numoperacion").innerText = num_op;
	document.getElementById("CSC").style.display = "none";
	document.getElementById("mc_S_ico").style.display = "none";
	document.getElementById("visa_S_ico").style.display = "none";
	document.getElementById("mc_S_ico").style.display = "none";
	document.getElementById("amex_ico").style.display = "none";

	var value = document.getElementsByName("Importe")[0].value;
	value = value.substr(0,value.length-2) + "," + value.substr(value.length-2,value.length) + " EUR";
	document.getElementById("imp").innerText = value;
    } else{
	console.log("goteo");
	// this needs to happen twice for some reason
	var dropdown = document.getElementsByClassName("dropdown-menu language-dropbox");
	var a = [];
	for(var i = 0; i < dropdown.length; i++){
	    a.push(dropdown[i])
	}
	for(var i = 0; i < a.length; i++){
	    a[i].className = "";
	}
    }
}
