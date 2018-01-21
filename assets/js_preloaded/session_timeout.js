//? GENERAL_JS JS SESSION CLASS to setTimeout to propose auto relogging after Gsession_max_time / 4 ... (so no risk to be actually logged out by Apache !!): show_login_div...

function Js_Class_Session(){
	this.Gsession_clock = '';		// Time session started or "LOGGED_OUT"
	this.MAX_SESSION_DURATION_IN_SECONDS = Gsession_max_time;
	// TODO :  REPLACE GOsession.Gtimeout_session BY server ping at REGULAR intervals !
	this.Gtimeout_session = null;	// TIMER : create by setTimeout in order to anticipate PHP session ends
	this.userName = Gsession_user_name;
	this.uniqueInitialSetup();
	delete this.uniqueInitialSetup;
}

$(document).ready(function(){	
	$('#button_new_logout').click( function(){ try_loggin_out(); } );
	var try_loggin_out = function(){
		show_central_spinner();
        location =  '/logout' ;
	};
	
	Js_Class_Session.prototype.uniqueInitialSetup = function(){
		$('body').append('<div id="divToLogBackIn" style="z-index:9999;"></div>'); // index useless really cos still pb with 3 button in paste screen
		var div_login = $('#divToLogBackIn');
		div_login.dialog(dialogOptions);
		div_login.html(
			'<div id="login_form_itself" class="centered">'+
				'<form id="form_to_log_in" method="post">'+
					'<br>Dear <input type="text" readonly="readonly" size="30" maxlength="30" name="user_name" id="user_name"><br>'+
					'<br>Please re-enter your password :'+
					'<br><input type="password" size="30" maxlength="30" name="user_pass" id="user_pass"><br>'+
					'<br><input type="button" id="button_submit_login" value="Click to login">'+
				'</form>'+
			'</div>'+
			'<div id="login_form_sent" class="centered" style="display:none;">'+
				'<br><br><h2>Checking&nbsp;credentials...</h2>'+
			'</div>');
        $('#user_name').val(this.userName);
		reset_jquery_styles();
			
		$('#button_submit_login').click( function(){ 
			GOsession.try_again_loggin_in();
			
		});
		div_login.bind('dialogclose', function(event) { 
			if(GOsession.Gsession_clock == 'LOGGED_OUT'){
				GOsession.toggle_login_form_sent( false );// get ready for next time.
				$('#divToLogBackIn').dialog('open');
				$('input[name=user_name]').focus();
			}// else should not happen but does because the way jquery fires events even if triggered by program instead of user...
		});	
		// KEY "ENTER" on user_name : focus on user_pass
		$('#user_name').keydown( function(event){ if(event.keyCode==13){	G('user_pass').focus();				}	} );
		// KEY "ENTER" on user_pass : go login in
		$('#user_pass').keydown( function(event){ if(event.keyCode==13){	GOsession.try_again_loggin_in();	}	} );
	};
	
	
	Js_Class_Session.prototype.try_again_loggin_in = function(){
		var post_data = {
			'user_name'		:	$('input[name=user_name]').val(),
			'user_pass'		:	$('input[name=user_pass]').val(),
			'posted_ajax'	:	'true'
		};
		GOsession.toggle_login_form_sent( true );
		$.ajax({
			type: "POST",
			url: "page_ajax_login",
			data: post_data,
			success: function(data){
				//3lines to delete:
					GOsession.reset_session_clock();
					$('#divToLogBackIn').dialog('close');
					GOsession.toggle_login_form_sent( false );// get ready for next time.
				
				hide_central_spinner();
					return;				// well 4 lines
				
				if(data != 'OK_logged_in_accepted'){
					$('#divToLogBackIn').dialog('option', 'title', 'Error in your username or password.');
				}else{
					GOsession.reset_session_clock();
					$('#divToLogBackIn').dialog('close');
				}
				GOsession.toggle_login_form_sent( false );// get ready for next time.
			}
		});
	};
	

	Js_Class_Session.prototype.toggle_login_form_sent = function( true_if_sent ){
		reset_jquery_styles();
		if(true_if_sent){
			$('#login_form_itself').hide();
			show_central_spinner();
		}else{
			$('#login_form_itself').show();
			// ON SHOWING THE LOGGIN DIV : focus on user_name
			G('user_pass').focus();
		}
	};
	
	Js_Class_Session.prototype.reset_session_clock = function(){
		var nowDate = new Date(); 
		GOsession.Gsession_clock = nowDate.getTime();
		clearTimeout(GOsession.Gtimeout_session);
		GOsession.Gtimeout_session = setTimeout( GOsession.show_login_div_from_js, this.MAX_SESSION_DURATION_IN_SECONDS * 1000 / 4); ///2 * 60 * 1000); // TEST ON 2 minutes 
		///GOsession.Gtimeout_session = setTimeout( GOsession.show_login_div_from_js, 2 * 60 * 1000); // TEST ON 2 minutes 
		///console.log(GOsession.Gsession_clock + '______________reset clock '+this.MAX_SESSION_DURATION_IN_SECONDS);
	};
	Js_Class_Session.prototype.show_login_div_from_js = function(js_originated){
		GOsession.show_login_div( true );
	};
	Js_Class_Session.prototype.show_login_div = function(js_originated){
		hide_central_spinner();
		// GOsession.Gsession_clock is used as a lock so the div_login get shown only once 
		if(GOsession.Gsession_clock == 'LOGGED_OUT'){
			return;
		}
		GOsession.Gsession_clock = 'LOGGED_OUT';
		var div_login = $('#divToLogBackIn');
		div_login.dialog('option', 'title', 'Session expired. Sign in, please.');
		GOsession.toggle_login_form_sent( false );
		div_login.dialog('open');
		$('input[name=user_name]').focus();
	};


    GOsession = new Js_Class_Session();
});
