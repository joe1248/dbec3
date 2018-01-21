//? LOGIN_SYSTEM : JS form to login and register + AJAX POST functions + FORGOT EMAIL form, ajax event and callback fct.
var loginRoutes = {
    postLogin : '/login',
    postRegister : '/doRegister',
    dashboard : '/dashboard',
    postEmailPassForgotten : '/send_email_pass_forgotten',
}
var Gapplication_name = 'Data Cloner';
var html_signup_form =    //'<form method="post" action="' + pos + 'index/signup.php">' +
    '    <br>Enter your email :' +
    '    <br><input type="text" size="30" maxlength="75" name="new_user_mail" id="new_user_mail" value="">' +
    '    <br>' +
    '    <br>Choose a user name' +
    '    <br><input type="text" size="30" maxlength="30" name="new_user_name" id="new_user_name" value="">' +
    '    <br>' +
    '    <br>And a new password :' +
    '    <br><input type="password" size="30" maxlength="30" name="new_user_pass" id="new_user_pass" value="">' +
    '    <br>' +
    '    <br><input id="submit_db_cloner_register_form" type="button" value="Click to register">'
    //+'</form>'
;
var html_choice_form =    '<br><br><span>How will you use ' + Gapplication_name + ' ?</span><br><br>' +
    '<input type="button" id="button_ide_on_the_cloud" value="On the cloud" />' +
    '&nbsp;&nbsp;&nbsp;OR&nbsp;&nbsp;&nbsp;' +
    '<input type="button" id="button_ide_on_own_server" value="On your own server" />' +
    '</h4>';

$(document).ready(function(){
    var validateEmail = function (email)
    {
        var re = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
        return re.test(email);
    };
    var checkPassword = function(str)
    {
        // at least one number, one lowercase and one uppercase letter
        // at least six characters that are letters, numbers or the underscore
        var re = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
        return re.test(str);
    };
    var getTimeZoneOffset = function (){
        var d = new Date();        var js_iso_time = d.toISOString();        var utc_offset_once = d.getTimezoneOffset();
        ///alert( d.toLocaleString()  + ' so offset = ' + utc_offset_once);
        return - utc_offset_once + 1;// +1 so that if we find 0 after the post to ogin.php we know it has to be ignored
    };
    var setup_signup_form = function (){
        $('#div_db_cloner_register').dialog('option','height',450);
        $('#div_db_cloner_register').html( html_signup_form ); reset_jquery_styles();
        $('#submit_db_cloner_register_form').click(function(event){
            if (!validateEmail($('input[name=new_user_mail]').val())) {
                showDivAlert('Error: Email address is not valid');
                $('input[name=new_user_mail]').css('borderColor',"#E34234");
                $('input[name=new_user_mail]').focus();
                return;
            } else {
                $('input[name=new_user_mail]').css('borderColor',"");
            }
            if ($('input[name=new_user_name]').val().length < 3 ) {
                showDivAlert('Error: User name must be at least 3 characters.');
                $('input[name=new_user_name]').css('borderColor',"#E34234");
                $('input[name=new_user_name]').focus();
                return;
            } else {
                $('input[name=new_user_name]').css('borderColor',"");
            }
            if (!checkPassword($('input[name=new_user_pass]').val())) {
                showDivAlert('Error: Your password must contain at least six characters and include at least one number, one lowercase and one uppercase letter.');
                $('input[name=new_user_pass]').css('borderColor',"#E34234");
                $('input[name=new_user_pass]').focus();
                return;
            } else {
                $('input[name=new_user_pass]').css('borderColor',"");
            }
            var post_data = {
                'new_user_name'    :    $('input[name=new_user_name]').val(),
                'new_user_mail'    :    $('input[name=new_user_mail]').val(),
                'new_user_pass'    :    $('input[name=new_user_pass]').val(),
                'user_status'    :    'db_cloner',
                'js_utc_offset'    :    getTimeZoneOffset(),
                'posted_ajax'    :    'true'
            };
            $.ajax({
                type: "POST",
                url: loginRoutes.postRegister,
                data: post_data,
                success: function(data){
                    hide_central_spinner();
                    if(data != 'OK'){
                        $('#div_db_cloner_register').dialog('open');
                        showDivAlert(data, 'Error : ');
                    }else{
                        // SUCCESS SIGNING UP !!
                        location = loginRoutes.dashboard;
                    }
                }
            });
            $('#div_db_cloner_register').dialog('close');///html( '<br><br><h3 style="centered">Please wait 1 sec ;)</h3><br><br>' );
            show_central_spinner();
        });
    };
    var open_div_db_cloner_register = function(e){
        setup_signup_form();
        $('#div_db_cloner_register').dialog('open');
    };
    var dialogOptions = {
        closeOnEscape: true,
        modal: true,
        bgiframe: false,
        autoOpen: false,
        height: 300,
        width: 300,
        minWidth: 500,
        minHeight: 300,
        draggable: true,
        resizeable: true
    };

    $('#div_db_cloner_register').dialog(dialogOptions);

    // NOP cos nok when selecting from browser caache : $('input[name=user_name]').keydown( function(event){ if(event.keyCode==13){    try_loggin_in(); }    } );
    $('input[name=user_pass]').keydown( function(event){ if(event.keyCode==13){    try_loggin_in(); }    } );

    $('#button_submit_login').click( function(){ try_loggin_in(); } );
    var try_loggin_in = function(){
        show_central_spinner();
        /*var post_data = {
            'user_name'    :    $('input[name=user_name]').val(),
            'user_pass'    :    $('input[name=user_pass]').val(),
            'user_status'    :    'db_cloner',
            'js_utc_offset'    :    getTimeZoneOffset(),
            'posted_ajax'    :    'true'
        };
        $.post(
            loginRoutes.postLogin,
            post_data,
            function(data){
                alert(data);
                hide_central_spinner();
                if(data.indexOf('OK_logged_in_accepted') < 0){
                    showDivSimple(data, 'Setting up a new password.');
                    $('#button_password_forgotten').click( function(){
                        var html =    'Enter your email to reset your password:' +
                            '<div class="centered"><br><input type="text" name="input_email_for_password_reset" size="30" autocomplete="on">' +
                            '    <br><br><input type="button" id="button_to_send_password_reset_email" value="Send email now">' +
                            '</div>';
                        $('#div_simple_content').html( html );
                        reset_jquery_styles();
                        $('input[name=input_email_for_password_reset]').focus();
                        $('input[name=input_email_for_password_reset]').keydown( function(event){ if(event.keyCode==13){    try_sending_reset_password_email(); }    } );
                        $('#button_to_send_password_reset_email').click( function(){ try_sending_reset_password_email(); } );
                    } );
                }else{
                    show_central_spinner();
                    showDivSimple('Please wait while your account is loading...', 'Success Signing in');
                    // SUCCESS SIGNING UP !!
                    location = loginRoutes.dashboard;
                }
            },
            'json'
        );*/
        //G('form_to_log_in').action = pos + "index/login.php";
        G('form_to_log_in').submit();
    };
    $('#button_db_cloner_register_1').click( function (){
        open_div_db_cloner_register();
    });
    $('#button_db_cloner_register_2').click( function (){
        open_div_db_cloner_register();
    });
    var try_sending_reset_password_email = function(){
        var post_data = {
            'user_mail'        :    $('input[name=input_email_for_password_reset]').val(),
            'posted_ajax'    :    'true',
            'email_type'    :    'password_reset'
        };
        $.ajax({
            type: "POST",
            url: loginRoute.postEmailPassForgotten,
            data: post_data,
            success: function(data){
                hide_central_spinner();
                if( data.substr(0,2) === 'OK'){
                    showDivAlert('Email successfully sent to ' + data.substr(2) + ',<br> please check your inbox !');
                }else{
                    $('#divSimple').dialog('open');
                    showDivAlert('Sorry but ' + data);

                    // NOK cos both dialog togther but in wrong order !


                }
            }
        });
        $('#divSimple').dialog('close');
        show_central_spinner();
    };

    //setTimeout(function(){$('body').fadeIn();},1000);///.delay(1000);
});
