/* here
	s how_central_spinner()
	h ide_central_spinner()
and defined in mini_jquery.js :
	reset_jquery_styles()
	showDivAlert = function( msg, title, button_at_the_top )
	showDivSimple = function( msg, title )
	showDivConfirm = function( msg, funct_confirm_ok, title, button_at_the_top, funct_confirm_ok_params)

*/
var Ajquery_themes = {	//"dark-hive",
						//"excite-bike",
						"ui-lightness":'Blue',
						"flick":'Pink',
						//"humanity",
						//"mint-choc",
						//"south-street",
						"sunny":'Yellow' // only one with roundedd tabs though !!
					};
/*** Default settings ***/
var Ojson_settings = {
	'back_color'	:	'#b2cecf',
	'font_color'	:	'#444444',
	'title_color'	:	'#d02552', 
	'css_file'		:	'flick'
};
var dialogOptions = {
	modal: true,
	bgiframe: false,
	autoOpen: false,
	autoResize:true,
	minWidth: 500,
	minHeight: 300,
	draggable: true,
	resizeable: true
	/*open: function (event, ui) {
        $('.ui-widget-header').addClass('ui-widget-header-override');
        $('.ui-widget-overlay').addClass('ui-widget-overlay-override');
    }*/
};
var myDialogclose = function(event) {
	parent.scrollTo(0,0);
};
var Gspinner_opts = {
  lines: 11, // The number of lines to draw
  length: 36, // The length of each line
  width: 30, // The line thickness
  radius: 6, // The radius of the inner circle
  corners: 1, // Corner roundness (0..1)
  rotate: 90, // The rotation offset
  direction: 1, // 1: clockwise, -1: counterclockwise
  color: [Ojson_settings.back_color, Ojson_settings.font_color, Ojson_settings.title_color],///'#FFA500', // #rgb or #rrggbb or array of colors
  speed: 0.7, // Rounds per second
  trail: 26, // Afterglow percentage
  shadow: false, // Whether to render a shadow
  hwaccel: false, // Whether to use hardware acceleration
  className: 'spinner', // The CSS class to assign to the spinner
  zIndex: 2e9, // The z-index (defaults to 2000000000)
  top: 'auto', // Top position relative to parent in px
  left: 'auto' // Left position relative to parent in px
};
function show_central_spinner(){
	if( !G('spinner_wait_box') ) return;
	if(  G('spinner_wait_box').innerHTML === '' ){
		var spinner = new Spinner( Gspinner_opts ).spin();
		G('spinner_wait_box').appendChild(spinner.el);
	}	
	$('#wait_box').dialog('open'); 
}
function hide_central_spinner(comment){
	if(typeof comment !== 'undefined'){
		//console.log('hide_central_spinner with comment = '+comment);
	}
	$('#wait_box').dialog('close'); 
}
function check_ajax_response_first_2_chars_is_ok(response, error_id_or_message, callback_parameters, function_to_call_if_logged_out){
	if(response.substr(0,2) != 'OK'){
		if(response === 'Ide::YOU_ARE_NOW_LOGGED_OUT'){
			GOsession.show_login_div(false);
			// READY FOR WHEN USED FOUND< so far, while etraction, you should rather extend php session
			if(typeof function_to_call_if_logged_out !== 'undefined'){
				////console.log(typeof function_to_call_if_logged_out + 'Yes call abcck '+function_to_call_if_logged_out);
				if(typeof callback_parameters  !== 'undefined'){
					function_to_call_if_logged_out( callback_parameters );
				}else{
					function_to_call_if_logged_out();
				}
				///console.log('Yes call abcck DONE '+function_to_call_if_logged_out);
			}else{
				///console.log('Nothing to call if logged out ');
			}
		}else{
			GOsession.reset_session_clock();
			var pattern = '<!-- ERROR_DB_CONNECTION_NOT_WORKING -->';
			if(response.substr(0, pattern.length) == pattern){
				$('*').removeClass('jstree-loading');
				showDivAlert(response.substr(pattern.length), 'Error DB connection', true);
			}else{
				var button_on_top = response.length > 150 ? true : false;
				showDivAlert(response, 'Error 702: '+error_id_or_message, button_on_top);
			}
		}
		return false;
	} 
	///hide_central_spinner();
	if( typeof GOsession !== 'undefined') GOsession.reset_session_clock();
	return true;
}
function html_form_to_object(id){
	if(!G(id)){
		alert('Error in html_form_to_object( ' + id + ' BECAUSE form not found... !!!');
		return;
	}
	var post_data = $("#" + id).serializeArray();
	///dump(post_data);
	if(post_data.length === 0) {
		alert('Error in html_form_to_object( ' + id + ' SURELY BECAUSE THE NAMES ARE MISSING as well as IDs !!!');
		/*for(one_input in $("#" + id + ' input')){
			post_data[] = {
				name : one_input.attr('name'),
				value : one_input.val()
			} 
		}*/
	}
	var pair, new_post_data = {};
	for(var i = 0 ; i < post_data.length ; i++){
		pair = post_data[i];
		new_post_data[pair.name] = pair.value;
	}
	
	return new_post_data;
}
function trim(str){
	return str.replace(/^\s\s*/, "").replace(/\s\s*$/, "");
}
function openNewWindow(url, id){
	var myLatestNewTab = top.window.open(url, id);
}
// CORE : replace for an iframe getElementById()..contentWindow
function Gi(id){
	var el= document.getElementById(id);
	if(el === null){
		return false;
	}else{
		return el.contentWindow;
	}
}	
function G(id){
	return document.getElementById(id);
}
function outro_easy(BooleanOnLoadGiveFocus){
	reset_jquery_styles();
	hide_central_spinner();
	$('body').fadeIn('slow');
}
// Return EVENT object
function js_event(oEvent){ 
	var e = window.event || oEvent; // WORKS EVEN IN FIREFOX if passing event in event call : onclick="handleEvent(event)"
	return e;
}
function ajax_error_handler(XMLHttpRequest, textStatus, errorThrown) {
	if(XMLHttpRequest.responseText + textStatus + errorThrown !== ''){
		console.log("error :"+XMLHttpRequest.responseText + '\ntextStatus=' + textStatus + '\nerrorThrown = ' + errorThrown);
	}
}
function isInt(n) {
	n = parseInt(n, 10);
	return typeof n === 'number' && n % 1 === 0;
}
function openUrlInIframe(url, iframe_id, debug){
	if(!G || !G(iframe_id)){
		if(debug){
			console.log('Iframe '+iframe_id+' not found');
		}
		setTimeout( function(){ openUrlInIframe(url, iframe_id, true); }, 500);
		return;
	}
	$('#'+iframe_id+'>body').fadeOut();
	G(iframe_id).setAttribute('src',url);//in openUrlInIframe !
}
