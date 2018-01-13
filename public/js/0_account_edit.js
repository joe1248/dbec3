//? USER_HOME_PAGE USER ACCOUNT page with theme select, input to change user_name and email + 1 button to send verification email if mail not checked yet...

/***************** TO SEE THE EFFECTS OF CHANGING COLOR IN ARRAY ABOVE :
 * //   ADD THIS TO auto_css/' . $jquery_theme . '.css WHEN CHANGING THEME COLORS !!!!!!!!!!!!!    ?ok='.time().'
 * 
        		1. reload ACCOUNT EDIT PAGE FRAME ONCE TO load new variable
				2. swicth the theme which has been changed to regenerate the CSS file.
				3. SKKKKKKKKKIIIIIIIIIIIIIIIIP : only reload frame to see it only works well a secon d until theme changed again
				4. REAL ONE : do reload the main page so that the main CSS file gets updated too !
		******************************************************************************************************/

var color_trios = {
// UNSELECT n mini.js but hard to chnage names cos real jquery theme folders !																														//'dark-hive'		: { bg_color : '#222930', color1 : '#0972a5', color2 : '#FF1933'}, // dark-grey / blue / light-grey
//	'excite-bike'	: { bg_color : '#222930', color1 : '#4EB1BA', color2 : '#fece2f'}, // dark-grey / blue / yellow
	'flick'			: { bg_color : '#b2cecf', color1 : '#444444', color2 : '#d02552'}, // light-blue / grey / PINK !!!
																														///'humanity'		: { bg_color : '#b2cecf', color1 : '#4EB1BA', color2 : '#d02552'}, // dark-grey / blue / 
																														//'mint-choc'		: { bg_color : '#222930', color1 : '#4EB1BA', color2 : '#50d07d'}, // dark-grey / blue / green
//	'south-street'	: { bg_color : '#222930', color1 : '#fece2f', color2 : '#d02552'}, // dark-grey / yellow / pink
	/* YELLOW BG */'sunny'			: { bg_color : '#fece2f', color1 : '#4EB1BA', color2 : '#397D02'}, // yellow / blue / green
	'ui-lightness'	: { bg_color : '#222930', color1 : '#4EB1BA', color2 : '#50d07d'} // dark-grey / blue / green
};//http://www.december.com/html/spec/color2.html	autotest143RR	



function init_js_in_my_account( tab_id )
{
    var my_account = varInTab[tab_id].my_json;

    $('#email_was_validated' ).val(my_account.user_status == 'emailValid' ? 'true' : 'false');
    $('input[name=user_mail]').val(my_account.user_mail);
    $('input[name=your_user_name]').val(my_account.user_name);

    $('#submit_account_form').hide();		$('#font_account_is_up_to_date').show();

    // For now, you will be unable to show IF EMAIL IS VALID AFTER AN UPDATE, maybe still valid, maybe not if has changed
    // updateEmailRow
    if($('#email_was_validated').val() == 'true'){
		$('#validate_email').hide();
		$('#email_is_valid_message').show();
	}else{
		//$('#validate_email').show();        WHAT IS THE POINT OF VALIDATING THE EMAIL ?????S
		$('#email_is_valid_message').hide();
	}

	
	reset_jquery_styles();
	$('input[name=user_mail]').keydown( function(){
		$('#submit_account_form').show();		$('#font_account_is_up_to_date').hide();
		$('#validate_email').hide();
	});
	$('input[name=your_user_name]').keydown( function(){
		$('#submit_account_form').show();		$('#font_account_is_up_to_date').hide();
	});
	
	// GET LIST OF STYLE FROM PARENT VARIABLE
	var theme_jquery, selected;
	for(theme_jquery in Ajquery_themes){
		selected = (parent.Ojson_settings.css_file == theme_jquery ? ' selected ' : '');
		$('#theme_switcher').append('<option ' + selected + ' value=\"'+theme_jquery+'\">' + Ajquery_themes[ theme_jquery ] + '</option>');
	}
	
	$('#theme_switcher').change( function(e){
		update_all_styles();
	});
	
	// SUBMIT FORM TO UPDATE EMAIL OR USERNAME
	$('#submit_account_form').click( function(){
		if( $('input[name=your_user_name]').val() === ''){
			showDivAlert('Your user name cannot be blank.', 'Error');
			return;
		}
		if( $('input[name=user_mail]').val() === ''){
			showDivAlert('Your email cannot be blank.', 'Error');
			return;
		}
		var post_data = {	'user_name'	:	$('input[name=your_user_name]').val()	,
							'user_mail'	:	$('input[name=user_mail]').val()	};
        var url = pos + Opages.update_user_one.php_url;
		$.ajax({
			type: 'POST',
			url: url,
			data	: post_data,
			success	: function(data){
				hide_central_spinner();
				if( !check_ajax_response_first_2_chars_is_ok( data, 'Error: ')){ // Error for example in user setting when trying an already existing email.
					return;
				}
				$('#font_account_is_up_to_date').show();
				///$('#validate_email').show();
				$('#div_for_server_messages').html('Update successful');				
				setTimeout( function(){ $('#div_for_server_messages').html(''); }, 1000);
				///setTimeout( function(){ location.reload(); }, 1000); // because too boring too pass back if email updated or not....
			} 
		});
		$('#submit_account_form').hide();
		show_central_spinner();
	});
	
	// CLICK TO VALIDATE EMAIL
	$('#validate_email').click( function(){
		var url = pos + 'page_ajax_send_email?email_type=validate_email';
		$.ajax({
			type: 'GET',
			url: url,
			success	: function(data){
				hide_central_spinner();
				if( check_ajax_response_first_2_chars_is_ok( data, 'Error sending validation email.')){
					showDivAlert( 'Perfect, a validation email has been sent to ' + data.substr(2) );
				}
			} 
		});
		show_central_spinner();
		$('#validate_email').hide();
	});

}

// Called only on cahnge of the style HTML_SELECT 
var update_all_styles = function(){
	var delay = 20;
	if( typeof color_trios == 'undefined'){
		console.log('Error finding color_trios variable');
		return;
	}
	///dump(color_trios);
	$('body').fadeOut('fast');
	var css_file = $( "#theme_switcher option:selected" ).val();
	var css_url_1 = '/html_cdn/lib/jquery_themes/'+ css_file + '/jquery-ui.min.css';
	var css_url_2 = '/html_cdn/lib/jquery_themes/auto_css/'	+ css_file + '.css' + '?now=' + new Date().getTime();
	var back_color = color_trios[css_file].bg_color;
	var font_color = color_trios[css_file].color1;
	var title_color= color_trios[css_file].color2;

	Ojson_settings.back_color = back_color;
	Ojson_settings.font_color = font_color;
	Ojson_settings.title_color= title_color;
	Ojson_settings.css_file   = css_file;

	/* UPDATE CSS IN AN IFRAME !!! if( Gi('db_cloner_right_side') && Gi('db_cloner_right_side').$ ){
		Gi('db_cloner_right_side').$('body').fadeOut('fast');

		Gi('db_cloner_right_side').G('jquery_css').href = css_url;
		Gi('db_cloner_right_side').G('user_color_css').href = pos + 'opensource/auto_css/' + css_file + '.css';
		setTimeout(function(){if( Gi('db_cloner_right_side') && Gi('db_cloner_right_side').$ ){Gi('db_cloner_right_side').$('body').fadeIn('fast');}}, delay);
	}*/
	G('jquery_css').href = css_url_1;
	G('user_color_css').href = css_url_2;
	$('body').css('background-color'	, back_color);
	$('body').css('color'				, font_color);
	setTimeout(function(){ $('body').fadeIn('fast'); }, delay);
	var post_data = {
		'back_color'	:	back_color,
		'font_color'	:	font_color,
		'title_color'	:	title_color,
		'css_file'		:	css_file
	};
    var url = pos + Opages.update_user_two.php_url;
	$.ajax({
			type: "POST",
			url: url,
			data	: post_data,
			success	: function(data){
				var ok = check_ajax_response_first_2_chars_is_ok( data, 'Error saving theme. ');
			} 
	});	
};
