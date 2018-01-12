$(document).ready(function(){ 
	reset_jquery_styles(); 

	$("body").fadeIn('slow').delay(1000);
	/*$(document).on({
		ajaxStart	: function() { $body.addClass("loading");    },
		ajaxStop	: function() { $body.removeClass("loading"); }    
	});*/
	$("body").append('<div  id="wait_box"></div>');
							$("#wait_box").html('<div id="spinner_wait_box" style="position:relative;left:70px;top: 70px;width:30px;height:30px;"></div>');						
							$('#wait_box').dialog(	{	autoResize	: false	,
														modal		: false	,
														autoOpen	: false	,
														width		: 173	,
														height		: 173	,
														draggable	: false	,
														resizeable	: false	,
														//title		: 'Loading...',  no need cos next line HIDE THE TITLE !!!
														dialogClass	:'jqueryDialogNoTitle'
													} );// dialog initialisation
													
	// SPINNER IS ALREADY IN MINI.js 
	//+>>  show_central_spinner AND hide_central_spinner
	$("body").append('<div  id="divConfirm"></div>');
							$('#divConfirm').dialog(dialogOptions);// dialog initialisation
							$('#divConfirm').dialog('option', 'width', '700px');
							$('#divConfirm').addClass('dialog');
	$("body").append('<div  id="divAlert"></div>');
							$('#divAlert').dialog(dialogOptions);// dialog initialisation
							$('#divAlert').addClass('dialog');
	$("body").append('<div  id="divSimple"></div>');
							$('#divSimple').dialog(dialogOptions);// dialog initialisation
							$('#divSimple').addClass('dialog');

});
var showDivSimple = function( msg, title ){
	title = (typeof title !== 'undefined' ? title : '');
	var html =	'<div class="centered"><br>' +
					'<br><div class="align_left" id="div_simple_content" style="position:relative;left:5%;width:90%;">' +
						msg + 
					'</div><br>' +
				'</div>';
	$('#divSimple').html( html );
	reset_jquery_styles();
	$('#divSimple').dialog('option', 'title', title);
	$('#divSimple').dialog('open'); 
};
var showDivAlert = function( msg, title, button_at_the_top, fct_on_ok){
	fct_on_ok = (typeof fct_on_ok !== 'undefined' ? fct_on_ok : null);
	title = (typeof title !== 'undefined' ? title : '');
	button_at_the_top = (typeof button_at_the_top !== 'undefined' && button_at_the_top === true ? true : false);
	var html_button = '<input id="divAlertOk" style="margin:50px;" type="button" class="small-button" value="OK">';
	var html =	'<div class="centered"><br>' +
					(button_at_the_top ? html_button : '') +
					'<br><div id="divAlertContent" class="align_left" style="position:relative;left:5%;width:90%;">' +
						msg + 
					'</div><br>' +
					(!button_at_the_top ? html_button : '') +
				'</div>';
	$('#divAlert').html( html );
	if(fct_on_ok != null)
		$('#divAlertOk' ).click(  fct_on_ok );
	else
		$('#divAlertOk' ).click( function(){ $('#divAlert').dialog('close'); } );
	reset_jquery_styles();
	$('#divAlert').dialog('option', 'title', title);
	$('#divAlert').dialog('open'); 
};
var showDivConfirm = function( msg, funct_confirm_ok, title, button_at_the_top, funct_confirm_ok_params){
	funct_confirm_ok_params = (typeof funct_confirm_ok_params	!== 'undefined'									? funct_confirm_ok_params	: '');
	title					= (typeof title						!== 'undefined'									? title						: '');
	button_at_the_top		= (typeof button_at_the_top			!== 'undefined' && button_at_the_top === true	? true						: false);
	var html_button =	'<br>'
						+ '<input id="divConfirmNo"  type="button" class="small-button" value="Cancel">'
						+ '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
						+ '<input id="divConfirmYes" type="button" class="small-button user_instruction" value="Confirm">'
						+ '<br>';
	var html =	'<div class="centered"><br>' +
					(button_at_the_top ? html_button : '') +
					'<br>' +
					'<div class="align_left" id="divConfirmContent" style="position:relative;left:5%;width:90%;">' +
						msg + 
					'</div><br>' +
					(!button_at_the_top ? html_button : '') +
				'</div>';
	$('#divConfirm').html( html );
	$('#divConfirmNo' ).click( function(){													$('#divConfirm').dialog('close'); } );
	if( funct_confirm_ok_params !== ''){
		///alert('Yes funct_confirm_ok_params found :'+funct_confirm_ok_params);
		$('#divConfirmYes').click( function(){ funct_confirm_ok( funct_confirm_ok_params );	$('#divConfirm').dialog('close'); } );
	}else{
		$('#divConfirmYes').click( function(){ funct_confirm_ok();							$('#divConfirm').dialog('close'); } );
	}
	reset_jquery_styles();
	$('#divConfirm').dialog('option', 'title', title);
	$('#divConfirm').dialog('open'); 
};
/* YOU MAY UST AS use the fct above and pass <input as msg !
var showDivPrompt = function( msg, funct_confirm_ok, title, button_at_the_top, funct_confirm_ok_params){
	funct_confirm_ok_params = (typeof funct_confirm_ok_params	!== 'undefined'									? funct_confirm_ok_params	: '');
	title					= (typeof title						!== 'undefined'									? title						: '');
	button_at_the_top		= (typeof button_at_the_top			!== 'undefined' && button_at_the_top === true	? true						: false);
	var html_button =	'<br>'
						+ '<input id="divPromptNo"  type="button" class="small-button" value="Cancel">'
						+ '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
						+ '<input id="divPromptYes" type="button" class="small-button user_instruction" value="Continue">'
						+ '<br>';
	var html =	'<div class="centered"><br>' +
					(button_at_the_top ? html_button : '') +
					'<br>' +
					'<div class="align_left" id="divPromptContent" style="position:relative;left:5%;width:90%;">' +
						msg + 
					'</div><br>' +
					(!button_at_the_top ? html_button : '') +
				'</div>';
	$('#divPrompt').html( html );
	$('#divPromptNo' ).click( function(){													$('#divPrompt').dialog('close'); } );
	if( funct_confirm_ok_params !== ''){
		///alert('Yes funct_confirm_ok_params found :'+funct_confirm_ok_params);
		$('#divPromptYes').click( function(){ funct_confirm_ok( funct_confirm_ok_params );	$('#divPrompt').dialog('close'); } );
	}else{
		$('#divPromptYes').click( function(){ funct_confirm_ok();							$('#divPrompt').dialog('close'); } );
	}
	reset_jquery_styles();
	$('#divPrompt').dialog('option', 'title', title);
	$('#divPrompt').dialog('open'); 
};*/

function make_strong_checkboxes() {
    $("input[type=checkbox]").unbind().click( function(){
        if (typeof this.id != 'string' || this.id.substr(0,5) != 'real_') {
            alert('Bad checkbox!!' + typeof this.id + this.id.substr(0,5));
            return;
        }
        var hidden_id = this.id.substr(5);
        G(hidden_id).value = this.checked ? 'checked' : 'not_checked';
        console.log('HIDDEN input : ' + hidden_id + '(from '+ this.id + ') is now ' + this.checked);
    });
}

function reset_jquery_styles(){
	$('.top_tabs').css(			{ 'width':($(window).width() - 179) + 'px'});
	$('.tab_content').css(		{ 'width':($(window).width() - 5) + 'px'});
	$('.tab_content').css(		{ 'height':($(window).height() - 28) + 'px', 'margin-top':'40px'});// DO NOT CHANGE margin top cos scroll bar top too !!
	$('#home_tab_welcome').css(	{ 	'height':($(window).height() - 62) + 'px',
									'width' :($(window).width()  - 48) + 'px'});// DO NOT CHANGE margin top cos scroll bar top too !!

	$( "input[type=submit], input[type=button], button" ).button();///.removeClass('.ui-widget input');
    $( "select" ).addClass("ui-widget");
    $( "input[type=text], input[type=password]" ).addClass("ui-button").addClass("ui-corner-all");
    $( "input[type=text], input[type=password]" ).addClass("medium-input").addClass("align_left");
    $( '#user_name' ).removeClass("medium-input");
    $( '#user_pass' ).removeClass("medium-input");
    
    // ANNOYING FOR coold db tool $('.medium-input').css("font-size",'75%');
    
    
    $('.fieldset').addClass("ui-corner-all");
    $( "h2" ).addClass("border_title");//.addClass("ui-corner-all");
	$('input[type=submit], input[type=button]').keydown(function(event){
		///console.log('event.keyCode = ' + event.keyCode);
		if(event.keyCode==13){
			$(this).trigger('onmousedown');
		}
	});
	/* ANNOYING FOR coold db tool use css class instead !! add !important if you need
	$('.tiny-button').css("font-size",'50%');
	$('.small-button').css("font-size",'65%');
	$('.medium-button').css("font-size",'75%');
	*/
	// TOO COLORED : $('fieldset').addClass('back_color');
	$('fieldset').css('background-color','#eee');
	///$('.little_box').addClass("ui-corner-all");	
}
