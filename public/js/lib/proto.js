// CORE : replace createElement trim js_replace
function N(type){ 
	return document.createElement(type); 
}
// CORE : create an Iframe
function I(id){
	var ifr=N('IFRAME');	ifr.setAttribute('id', id);
	ifr.setAttribute('name', id);  document.body.appendChild(ifr);
	ifr.style.zIndex=1; 	ifr.style.position='fixed';
	init_one_div_size( id, 0, 50, 50, 150);
	ifr.style.borderStyle="solid";  ifr.style.border='0px';
	ifr.style.borderColor='blue';   ifr.style.visibility="hidden";
	ifr.style.display='block';
	ifr.scrolling="auto";
	ifr.frameborder="0";
	ifr.marginheight="0";
	ifr.marginwidth="0"; 
	ifr.vspace="0";
	ifr.hspace="0";
}
//CORE : Replace str "ca" by str "par_ca" in str "dans_ca"
function js_replace(ca, par_ca, dans_ca){
	if(dans_ca==null){
		console.log('Error in js_replace of '+ ca+' by '+par_ca);
		dans_ca = '';
	}
	if(dans_ca.indexOf(ca)>=0){	
		var tmp = dans_ca.split(ca);
	   	dans_ca= tmp.join(par_ca);
	}
	return dans_ca;
}
//CORE : Return -1 if one_value NOT found in one_array OR return the index of value
function js_in_array(one_value,one_array){
	for(var j=0;j<one_array.length;j++) if(one_array[j]===one_value) return j;
	return -1;
}
//Return width of frame
function getWinWidth(){
	var iWidth = 0;
	if (window.innerWidth){  iWidth = window.innerWidth;
	}else if(document.documentElement && document.documentElement.clientWidth){
		iWidth = document.documentElement.clientWidth;
	}else if(document.body && document.body.clientWidth)
		iWidth = document.body.clientWidth;
	if(iWidth==0)return 500;
	return iWidth;
}
// Return height of frame
function getWinHeight(){
	var iHeight=0;
	if (window.innerHeight){  
		iHeight = window.innerHeight;
	}else if(document.documentElement && document.documentElement.clientHeight){
		iHeight = document.documentElement.clientHeight;
	}else if(document.body && document.body.clientHeight){
		iHeight = document.body.clientHeight;
	}
	if(iHeight==0)return 500;
	return iHeight;
}
function basedir(path) {
	path = trim_first_slash(path);
	path = trim_first_slash(path);
	path += '/';
	var end = path.indexOf('/');
	return path.substr(0, end);
}
function trim_first_slash(str) { 
	if(str === undefined)return '';
	if(str.substr(0,1) == '/') { return str.substr(1); }
	else						return str;
}
function trim_last_slash(str) { 
	if(str === undefined)return '';
	if(str.substr(str.length - 1,1) == '/') { return str.substr(0, str.length - 1); }
	else						return str;
}

/*
dump() displays the contents of a variable like var_dump() does in PHP. dump() is
better than typeof, because it can distinguish between array, null and object.  
Parameters:
  v:  			The variable
  howDisplay: 	"none", "body", "a___lert" (default)
  recursionLevel: Number of times the function has recursed when entering nested
  				objects or arrays. Each level of recursion adds extra space to the 
  				output to indicate level. Set to 0 by default.
Return Value:
  A string of the variable's contents 
Limitations:
  Can't pass an undefined variable to dump(). 
  dump() can't distinguish between int and float.
  dump() can't tell the original variable type of a member variable of an object.
  These limitations can't be fixed because these are *features* of JS. However, dump()
*/
function repeatString(str, num) {
	for (var out = '', i = 0; i < num; i++) {
		out += str; 
	}
	return out;
}
function dump(v, howDisplay, recursionLevel) {
	howDisplay = (typeof howDisplay === 'undefined') ? "a"+"lert" : howDisplay;
	recursionLevel = (typeof recursionLevel !== 'number') ? 1 : recursionLevel;

	var cnt, sContents = '';
	var vType = typeof v;
	var out = vType;

	switch (vType) {
		case "number":
			/* there is absolutely no way in JS to distinguish 2 from 2.0
			so 'number' is the best that you can do. The following doesn't work:
			var er = /^[0-9]+$/;
			if (!isNaN(v) && v % 1 === 0 && er.test(3.0))
				out = 'int';*/
		case "boolean":
			out += ": " + v;
			break;
		case "string":
			out += "(" + v.length + '): "' + v + '"';
			break;
		case "object":
			//check if null
			if (v === null) {
				out = "null";

			}
			//If using jQuery: if ($.isArray(v))
			//If using IE: if (isArray(v))
			//this should work for all browsers according to the ECMAScript standard:
			else if (Object.prototype.toString.call(v) === '[object Array]') {  
				out = 'array(' + v.length + '): {\n';
				for (var i = 0; i < v.length; i++) {
					out += repeatString('   ', recursionLevel) + "   [" + i + "]:  " + 
						dump(v[i], "none", recursionLevel + 1) + "\n";
				}
				out += repeatString('   ', recursionLevel) + "}";
			}
			else { //if object	
				sContents = "{\n";
				cnt = 0;
				for (var member in v) {
					//No way to know the original data type of member, since JS
					//always converts it to a string and no other way to parse objects.
					sContents += repeatString('   ', recursionLevel) + "   " + member +
						":  " + dump(v[member], "none", recursionLevel + 1) + "\n";
					cnt++;
				}
				sContents += repeatString('   ', recursionLevel) + "}";
				out += "(" + cnt + "): " + sContents;
			}
			break;
	}

	if (howDisplay == 'body') {
		var pre = document.createElement('pre');
		pre.innerHTML = out;
		document.body.appendChild(pre)

	} else if (howDisplay == 'log') {
		console.log(out);

	} else if (howDisplay == 'a'+'lert') {
		console.log(out);
		//alert(out); // LEAVE THIS PARTICULAR ALERT IS OK !
	}

	return out;
}

// used everywhere
function removeValueFromArray(the_array, item) {
	var index = $.inArray(item, the_array);
	if(index !== -1){
		the_array.splice(index, 1);
	}
	return the_array;
}
// used everywhere
function removeIndexFromArray(the_array, from) {
	var back = [];
	for(var i = 0 ; i < the_array.length ; i++){
		if(i !== from){
			back.push(the_array[i]);
		}
	}
	return back;
}

function basename(path) {
     return path.replace( /.*\//, "" );
}
function dirname(path) {
     return path.match( /.*\// );
}
function htmlentities(value){
    if (value) {
        return jQuery('<div />').text(value).html();
    } else {
        return '';
    }
}
function nl2br(txt){
    return js_replace('\n', '\n<br>', txt);
}
function html_entity_decode(value) {
    if (value) {
        return $('<div />').html(value).text();
    } else {
        return '';
    }
}
function js_print( txt ){
    var w=window.open();
    w.document.write( txt );
    w.print();
    w.close();
}
function scroll_to_bottom(){
	scroll(0, document.body.scrollHeight);
}
function event_click_on_checkbox(checkbox_name, fancy_colors, reversed_behaviour){
	if(	 G('real_'+checkbox_name).checked && !reversed_behaviour ||
		!G('real_'+checkbox_name).checked &&  reversed_behaviour ){
		if(reversed_behaviour) 	G(checkbox_name).value='not_checked';
		else					G(checkbox_name).value='checked';
		if(fancy_colors){
			G(checkbox_name).parentNode.style.color = 'green'; // dumb already above : !reversed_behaviour ? 'red' : 'green';
		}
		
		// if in fk wizard 1st screen and it happens to have a child div : open it
		if (G('div_son_of_' + checkbox_name)) {
			$('#div_son_of_' + checkbox_name).slideDown();
		}
		var pattern = 'checkbox_manual_fk_';
		if (checkbox_name.substr(0, pattern.length) == pattern) {
			//alert('do ajax call here to get the manual options !!!!!!!!!!!');
			if (G('div_son_of_' + checkbox_name)) {
				$('#div_son_of_' + checkbox_name).slideDown();
			}
			
		}
	}else{
		if(!reversed_behaviour) 	G(checkbox_name).value='not_checked';
		else					G(checkbox_name).value='checked';
		if(fancy_colors) {
			G(checkbox_name).parentNode.style.color = 'red'; // dumb already above :!reversed_behaviour ? 'green' : 'red';
		}
		if(G('div_son_of_' + checkbox_name)){
			$('#div_son_of_' + checkbox_name).slideUp();
		}		
		var pattern = 'checkbox_manual_fk_';
		if (checkbox_name.substr(0, pattern.length) == pattern) {
			//alert('HIDE HERE the manual options !!!!!!!!!!!');
			if(G('div_son_of_' + checkbox_name)){
				$('#div_son_of_' + checkbox_name).slideUp();
			}		
		}
	}
}
// used in js_only_tree.js
function getNbPropertiesInObject(myobj){
	var k, count = 0; 
	for (k in myobj) if (myobj.hasOwnProperty(k)) count++;
	return count; 
}
function open_main_accordeon_title(active_title_wanted){
	alert('open_main_accordeon_title');
	if(typeof fully_loaded == 'undefined' || fully_loaded == true){
		//Aconnections_ftp, 		
		var Aaccordeon_COPY_of_arrays = [		Aconnections_db, 	A7db_entity_confirmed, A8db_entity_data];
		var new_active_id = js_in_array(active_title_wanted, Aaccordeon_titles);
		if(new_active_id>=0){ 
			for( var i = new_active_id ; i >=0 ; i--){
				if( Aaccordeon_COPY_of_arrays[i].length ){
					var active_index = $('#main_db_cloner_accordeon').accordion('option','active');
					if(active_index != i){ 
						$( "#main_db_cloner_accordeon" ).accordion("refresh");
						$( '#main_db_cloner_accordeon' ).accordion({ active: i }); // focus on first NON empty accordeon tab.
					}
					break;
				}
			}
		}
	}
}
function open_accordeon_index(accordeon_id, active_index_wanted){
		alert('open_accordeon_index');
	if(typeof fully_loaded == 'undefined' || fully_loaded == true){
		//a_lert('fully_loaded = '+fully_loaded +' so '+active_index_wanted+' id = '+accordeon_id + G(accordeon_id).parentNode.innerHTML);
		var active_index = $('#'+accordeon_id).accordion('option','active');
		if(active_index != active_index_wanted){
			$( '#'+accordeon_id ).accordion("refresh");
			$( '#'+accordeon_id ).accordion({ active: active_index_wanted });
		}
	}
}
function jsGetCenteredDiv(content, div_width, id){
	id = ( typeof id === 'undefined' ? '' : ' id="' + id + '"');
	div_width = ( typeof div_width === 'undefined' ? '400px' : div_width);
	return	'<div ' + id + ' class="center1 content"><div class="center2"><div class="center3" style="width:' + div_width + ';">' +
				'<div>' + content + '</div>' +
			'</div></div></div>';
}
// not used
function getValidFileName( fileName ){
	if( typeof fileName !== 'string' || fileName === ''){
		return '';
	}
	var replaceChar = "_";
	var regEx = new RegExp('[,/\:*?""<>|]', 'g');
	return fileName.replace(regEx, replaceChar);
}
function init_one_div_size(o_id, l, t, w, h){// object, left, top, width, height
// NOW ABLOISH_allid fct so G() in the arg if needed !idem as cost or cheaper !
 
  if(typeof o_id=='string'){ var o=G(o_id);}
  else 					{ var o=  o_id ;}
  if(o==null){ console.log('Error in init_one_div_size cos id="'+o_id+'" not found so resizable'); return;}
  if(l==null){ console.log('Error in init_one_div_size of id="'+o_id+'" cos lefdt = null'); return;}
  rl(o, l);
  rt(o, t);
  rw(o, w);
  rh(o, h);
}
function rl(o, l){ if(o==null||isNaN(l)  	){return;} o.style.left  =l+'px';o.style.posLeft  =l; }
function rt(o, t){ if(o==null||isNaN(t)  	){return;} o.style.top   =t+'px';o.style.posTop   =t; }
function rw(o, w){ if(o==null||isNaN(w)||w<0){return;} o.style.width =w+'px';o.style.posWidth =w; }
function rh(o, h){ if(o==null||isNaN(h)||h<0){return;} o.style.height=h+'px';o.style.posHeight=h; }
// used for iframe....
function show(o_id){
  var o=G(o_id);if(o==null){return;}
  o.style.visibility='visible';
}
function hide(o_id){
  //a_lert('Hiding '+o_id);
  var o=G(o_id);if(o==null){return;}
  if(o_id != 'black_div'){   		o.style.visibility='hidden';		}
  else{  setTimeout('G("' + o_id + '").style.visibility="hidden";', 200);}
}

var Cwidth = getWinWidth();
var Cheight = getWinHeight();

function toHHMMSS(numberOfSeconds) {
    var sec_num = parseInt(numberOfSeconds, 10); // don't forget the second param
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);
	
    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    var time    = hours+':'+minutes+':'+seconds;
    return time;
}
function fill_html_table_from_js_object(target_html_table_id, data){
	var tbl_body = document.createElement("tbody");
    var odd_even = false;
    $.each(data, function() {
        var tbl_row = tbl_body.insertRow();
        tbl_row.className = odd_even ? "odd" : "even";
        $.each(this, function(k , v) {
            var cell = tbl_row.insertCell();
            var value = v === null ? 'NULL' : v.toString();
            cell.appendChild(document.createTextNode(value));
        })        
        odd_even = !odd_even;               
    })
    $("#" + target_html_table_id).append(tbl_body);
}
