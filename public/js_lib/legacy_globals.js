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

var Gmax_nb_entity_to_copy = 10;
var SESSION_DURATION_IN_MINUTES = 300;
var GOsession;
var Gsession_max_time = SESSION_DURATION_IN_MINUTES * 60;
var Gsession_user_name = 'dummy_test';
var Aconnections_db = [], A7db_entity_confirmed = [], A8db_entity_data = [], Aconnections_ftp = [];
var Aobfuscation_types = [];
var Aobfuscation_options = [];
var Gdebug_debug_all = false;
var Gdebug_debug_1_db_check = false;
var Gdebug_debug_2_extraction = false;
var Gdebug_debug_3_paste = false;///true;

var Gnb_new_windows=0;
var tabTemplate =
    "<li>" +
    "<a href='#{href}' id='#{header_id}'>" +
    "#{label}" +
    "</a> " +
    "<span id='loader_#{header_id}' class='hidden'></span> " +
    "<span class='ui-icon ui-icon-close' role='presentation'>Close Tab</span></li>",
    tabCounter = 1;///:
tabNumber = 1;
var debug = 0;// nb in consoloe Gi('db_cloner_right_side').GA_validated_id_multi_selected WORKS perfect !center
var GA_validated_id_multi_selected = [];
var varInTab = [];        // BIGGEST AND SOON FAIRLY UNIQUE GLOBAL VARIABLE.
var Opages;
function js_log(debug, msg){
    if(debug){
        console.log( msg );
    }
}

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

function refresh_jquery_menus(){
    context = window;
    context.$('.img_jquery_menu').menu({position:{ my: "left bottom", at: "right+7 top" , collision:"flipfit"},
        icons: { submenu: "ui-icon-circle-triangle-e" }
    })
        .css('margin-left', '-35px')
        .css('border', '0')
        .removeClass('ui-widget-content');  // cos white background !
    context.$('.jquery_menu_main').menu({position:{ my: "middle bottom", at: "middle top" , collision:"flipfit"},
        icons: { submenu: "ui-icon-circle-triangle-e" }
    });
}

function refresh_js_db_connections_list_so_show_db_buttons(){
    $.get( Opages.json_db_servers_list.php_url, function(AconnectionsDbNew){
        Aconnections_db = AconnectionsDbNew;
        show_buttons_to_add_and_list_connections();
    });
}

function refresh_html_select_entities_to_clone(){
    $.get( Opages.entities_list.php_url + '?list_type=button', function(html_back){
        $( "#div_list_of_entities_to_clone" ).html( html_back );
        success_refresh_html_select_entities_to_clone();
    });
}

function refresh_list_of_sql_file_ready_to_paste(){
    $.get( Opages.sql_files_list.php_url + '?list_type=button', function(html_back){
        $( "#div_list_of_sql_file_ready_to_paste" ).html( html_back );
        success_refresh_list_of_sql_file_ready_to_paste();
    });
}

function refresh_list_of_recent_transfers(){
    $.get( Opages.recent_transfer.php_url + '?list_type=button', function(html_back){
        if ( html_back !== 'Ide::YOU_ARE_NOW_LOGGED_OUT') {
            $( "#div_list_of_recent_transfers" ).html( html_back );
            success_refresh_list_of_recent_transfers();
        }
    });
}

function add_events_to_welcome_page_clone_data_buttons(){
    reset_jquery_styles();
    $('.button_clone_data').unbind().click( function(){
        addStaticTab(false, Opages.clone_data_ui, $(this).attr('html_entity_id'), $(this).attr('value') );
    });
    $('.welcome_button_clone_entire_table').unbind().click( function(){
        addStaticTab(false, Opages.clone_entire_tables_ui);//, $(this).attr('html_entity_id'), $(this).attr('value') );
    });
}

function show_buttons_to_add_and_list_connections(){
    //dump(Aconnections_db);
    if(Aconnections_db.length === 0){
        $('#welcome_big_button_add_db_server'    ).parent().show(); // show BIG add_new_db_server button.
        $('#welcome_button_db_servers_list'        ).parent().hide(); // hide fielset to manage db servers
        //$('#welcome_big_button_create_entity'    ).hide(); // hide BIG create_new_entity button.
    }else{
        $('#welcome_big_button_add_db_server'    ).parent().hide(); // hide BIG add_new_db_server button.
        $('#welcome_button_db_servers_list'        ).parent().show(); // show fielset to manage db servers
        //$('#welcome_big_button_create_entity'    ).show(); // show BIG create_new_entity button.
    }
}

function success_refresh_html_select_entities_to_clone(){
    // HIDE CLONE DATA box from home page when NO ENTITY AT ALL !
    if($( "#div_list_of_entities_to_clone" ).html() === ''){
        $("#div_list_of_entities_to_clone"        ).parent().hide();
        $('#welcome_button_entities_list'        ).parent().hide();
        $('#welcome_big_button_create_entity'    ).show(); // show BIG create_new_entity button.
    }else{
        //alert('html a that div==' + $( "#div_list_of_entities_to_clone" ).html());
        $('#welcome_big_button_create_entity'    ).hide();// Hide Big button to create entity
        $("#div_list_of_entities_to_clone"        ).parent().show();
        $('#welcome_button_entities_list'        ).parent().show();// show button to manage entities
        // Add event to open_tabClone_data  for each ENTITY button
        add_events_to_welcome_page_clone_data_buttons();
    }
}

function success_refresh_list_of_sql_file_ready_to_paste(){
    // Hide section to see last 5 SAVED_DATA_FILES if none
    if( $("#div_list_of_sql_file_ready_to_paste").html() === ''){
        $("#div_list_of_sql_file_ready_to_paste").parent().hide();
    }else{
        $("#div_list_of_sql_file_ready_to_paste" ).append('<br><input type="button" value="View all your data files" id="welcome_button_all_saved_data_files" class="margin_5">');
        $("#div_list_of_sql_file_ready_to_paste").parent().show();
        add_events_to_welcome_page_run_sql_file_buttons();
    }
}

function success_refresh_list_of_recent_transfers(){
    // Hide section to see last 5 transfer made
    if( $("#div_list_of_recent_transfers" ).html() === ''){
        $("#div_list_of_recent_transfers" ).parent().hide();
    }else{
        $("#div_list_of_recent_transfers").append('<br><input type="button" value="View complete transfer history" id="welcome_button_transfer_history" class="margin_5">');
        $("#div_list_of_recent_transfers" ).parent().show();
        add_events_to_welcome_page_run_recent_transfers_buttons();
    }
}

function add_events_to_welcome_page_run_sql_file_buttons(){
    reset_jquery_styles();
    $('#welcome_button_all_saved_data_files').unbind().click( function(){        addStaticTab(false, Opages.sql_files_list        );        });

    $('.button_sql_file_past_go').unbind().click( function(){
        addStaticTab(false, Opages.clone_data_ui, $(this).attr('html_entity_id'),
            $(this).attr('entity_label'),// New tab name
            ///'&sql_file_id=' + $(this).attr('sql_file_id') +
            '&copy_transfer_id=' + $(this).attr('copy_transfer_id')
        );
    });
}

function add_events_to_welcome_page_run_recent_transfers_buttons(){
    reset_jquery_styles();
    $('#welcome_button_transfer_history'    ).unbind().click( function(){        addStaticTab(false, Opages.recent_transfer        );        });

    $('.button_recent_transfer_go').unbind().click( function(){
        ///alert(" $(this).attr('paste_transfer_id') === "+ $(this).attr('paste_transfer_id'));
        addStaticTab(false, Opages.clone_data_ui, $(this).attr('html_entity_id'),
            $(this).attr('entity_label'),// New tab name
            '&paste_transfer_id=' + $(this).attr('paste_transfer_id')
        );
    });
}
function add_events_to_recent_transfers_page_buttons(){
    reset_jquery_styles();
    $('.button_view_data_go').unbind().click( function(){
        ///alert(" $(this).attr('paste_transfer_id') === "+ $(this).attr('paste_transfer_id'));
        addStaticTab(false, Opages.data_viewer_main, /*'paste_transfer_id=' + */$(this).attr('paste_transfer_id'), ' transfer ' + $(this).attr('transfer_idx')
            ///$(this).attr('entity_label'),// New tab name
        );
    });
    $(".histo_go_to_page").click(function(){
        //reload_transfer_history_page
        addStaticTab(true, Opages.recent_transfer, '', '', '&page_index=' + $(this).attr("data")); // REfresh transfer history (if already opened though...)
    });
}
