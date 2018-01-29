//? USER_HOME_PAGE Javascript/jQuery lauching 3 GET AJAX request to fill up UI with 1.Opages.ENTITIES_LIST.php_url, 2:sql_files_list, 3:recent_transfer

var GOmain_tabs;

var Aobfuscation_types, Aobfuscation_options, Glast_version, Gcurr_version;

$(document).ready(function() {
    reset_jquery_styles();
    refresh_jquery_menus();

    $("body").fadeIn('slow').delay(1000);

    return;


    /*$(document).on({
        ajaxStart	: function() { $body.addClass("loading");    },
        ajaxStop	: function() { $body.removeClass("loading"); }
    });*/
    $("body").append('<div  id="wait_box"></div>');
    $("#wait_box").html('<div id="spinner_wait_box" style="position:relative;left:70px;top: 70px;width:30px;height:30px;"></div>');
    $('#wait_box').dialog({
        autoResize: false,
        modal: false,
        autoOpen: false,
        width: 173,
        height: 173,
        draggable: false,
        resizeable: false,
        //title		: 'Loading...',  no need cos next line HIDE THE TITLE !!!
        dialogClass: 'jqueryDialogNoTitle'
    });// dialog initialisation

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

    // Dynamic loading of Obfuscation options from BE
    $.get(Opages.obfuscation_options.php_json_url, function (backEndData) {
        $(document).ajaxError(function (e, xhr, settings, exception) {
            console.log(exception + 'error in: ' + settings.url + ' \n' + 'error:\n' + exception);
        });
        Aobfuscation_types = backEndData.Adatatypes;
        Aobfuscation_options = backEndData.AoptionsByDatatypes;
        Glast_version = parseInt(backEndData.lastVersion, 10);
        Gcurr_version = parseInt(backEndData.currentVersion, 10);
        $('#auto_test_user_home_title').text('DBEC Version ' + Gcurr_version / 100);
        if (Glast_version > 100 && Glast_version != Gcurr_version) {
            $('#button_to_get_latest_dbec_version').val('Update to DBec ' + Glast_version / 100);
            $('#button_to_get_latest_dbec_version').show();
        }
    });

    // init tabs

    GOmain_tabs = $('#home_tabs');
    $("#home_tabs").tabs({//        heightStyle    : "fill",
        active: 0
    }).css({
        'overflow': 'hidden'
    });
    $('#link_home_tab').click(function () {
        setTimeout(function () {
            $('#home_tab_welcome').trigger('resize');
        }, 1); // fix query "bug" so that the whole scroll bar is visible
    });
    $(window).on('resize', function () {
        reset_jquery_styles();
    });
    $('body').on('resize', function () {
        GOmain_tabs.tabs('refresh');
    });
    refresh_js_db_connections_list_so_show_db_buttons();
    success_refresh_html_select_entities_to_clone();
    /*if( jsIsReleased('RELEASED_SAVE_DATASET') ){
        success_refresh_list_of_sql_file_ready_to_paste();
    }*/
    success_refresh_list_of_recent_transfers();

    // close icon: removing the tab on click
    GOmain_tabs.delegate("span.ui-icon-close", "click", function () {
        var panelId = $(this).closest("li").remove().attr("aria-controls");
        removeTab(panelId);
    });

    $('.ui-tabs-anchor').click(function () {
        adjust_tab_height();
    });
    // close transfer tab on back space ???
    /*    GOmain_tabs.bind( "keyup", function( event ) {
        if ( event.altKey && event.keyCode === $.ui.keyCode.BACKSPACE ) {
            ///fnction removeActiveTab(){
            var panelId = GOmain_tabs.find( ".ui-tabs-active" ).remove().attr( "aria-controls" );
            removeTab( panelId );
            //}
        }
    });*/

    $('.welcome_button_add_db_server').tooltip({
        position: {my: "left bottom", at: "right top"},
        show: {effect: "blind", duration: 400, direction: 'left'}
    });
    $('.welcome_button_create_entity').tooltip({
        position: {my: "left top", at: "right bottom"},
        show: {effect: "blind", duration: 400, direction: 'left'}
    });

    $('#welcome_button_db_servers_list').click(function () {
        addStaticTab(false, Opages.db_servers_list);
    });
    $('.welcome_button_add_db_server').click(function () {
        addStaticTab(false, Opages.db_server_add);
    });

    $('#welcome_button_entities_list').click(function () {
        addStaticTab(false, Opages.entities_list);
    });
    $('.welcome_button_create_entity').click(function () {
        addStaticTab(false, Opages.create_entity);
    });

    $('#welcome_button_database_explorer').click(function () {
        addStaticTab(false, Opages.simple_db_explorer);
    });

    $('#button_account_details').click(function () {
        addStaticTab(false, Opages.your_account);
    });

    $('#button_foreign_keys_wizard').click(function () {
        addStaticTab(false, Opages.fk_wizard);
    });
    $('#button_foreign_keys_manually').click(function () {
        addStaticTab(false, Opages.fk_by_hand);
    });

    $('#button_documentation').click(function () {
        addStaticTab(false, Opages.the_documentation);
    });

    $('#button_to_get_latest_dbec_version').click(function (e) {
        $('#button_to_get_latest_dbec_version').hide();
        show_central_spinner();
        $.get(pos + 'page_ajax_get_dbec_latest_version', function (back) {
            hide_central_spinner();
            if (back !== 'OK') {
                showDivAlert(back, 'Error while updating...<br>' + back);
                $('#button_to_get_latest_dbec_version').show();
            } else {
                $('#button_to_get_latest_dbec_version').hide();
                $('#dbec_is_up_to_date').show();
                showDivAlert('Well done, DBec is now up to date !<br>Press OK to reload the page.', '');
                $('#divAlertOk').click(function () {
                    $('#divAlert').dialog('close');
                    if (top.location.href.indexOf('old_vrs') > 0) {
                        top.location.href = js_replace('old_vrs', 'new_vrs', top.location.href);
                    } else {
                        top.location.reload();
                    }
                });
            }
        });
    });
});



function removeTab( panelId, headerId ){
    if( typeof headerId !== 'undefined'){
        $( "#" + headerId ).parent().remove();
    }
    $( "#" + panelId ).remove();
    tabNumber--;
    GOmain_tabs.tabs( "refresh" );
}


function updateTabTitle(Opage_static_id, tab_id, new_html){
    var header_id = 'html_header_tab_' + Opage_static_id + tab_id;
    $('#' + header_id).html( new_html );
}

// actual addTab function: adds new tab using the input from the form above
export default function addStaticTab( force_refresh, Opage, get_string, end_of_label, extra_get_string ){
    get_string        = typeof get_string            === 'undefined' ? ''        : get_string;
    extra_get_string= typeof extra_get_string    === 'undefined' ? ''        : extra_get_string;
    end_of_label    = typeof end_of_label        === 'undefined' ? ''        : end_of_label;
    if(get_string.indexOf('=') >= 0){
        alert('errro = forbidden in ids...');
        return;
    }
    var end_of_ids    = /*get_string.indexOf('=') >= 0            ? '_new'    : */get_string;
    var content_id = 'html_content_tab_' + Opage.static_id + end_of_ids;
    var header_id  = 'html_header_tab_'  + Opage.static_id + end_of_ids;

    if(Opage.static_id === 'tab_clone_data'){
        header_id  = 'html_header_tab_'  + Opage.static_id;
        content_id = 'html_content_tab_' + Opage.static_id;
    }
    var does_tab_already_exists = G(header_id) ? true : false;

    // IF force refersh on a non-existing tab, just ignore the request ?!?!?!
    if( does_tab_already_exists === false && force_refresh === true && Opage !== Opages.entity_edit){
        console.log('Ignored tab refresh request...'+header_id);
        return;
    }

    // ONLY 1 cloning tab at a time ?????????
    if(Opage.static_id === 'tab_clone_data'){
        if(does_tab_already_exists === true){
            //if(confirm('Sorry but you need to close the other cloning tab, ok ?')){
            if(G(content_id)){
                removeTab( content_id, header_id );
            }
            does_tab_already_exists = false;
            //}
        }
    }
    /* PRACTICAL TO DEBUG CLONE ENTITY
    if(Opage.static_id === 'tab_clone_data'){
        Gnb_new_windows++;
        if(Gnb_new_windows > 1){
            ///alert('Forbid opening another another one or maybe always in new win dow !!!!'+Opage.php_url + get_string + extra_get_string);
            openNewWindow(Opage.php_url + get_string + extra_get_string, Opage.static_id + Gnb_new_windows);///end_of_label); NOK to reuse windows cos reload them
            return;
        }
    }*/
    var tabTemplate =
        "<li>" +
            "<a href='#{href}' id='#{header_id}'>" +
                "#{label}" +
            "</a> " +
            "<span id='loader_#{header_id}' class='hidden'></span> " +
            "<span class='ui-icon ui-icon-close' role='presentation'>Close Tab</span>" +
        "</li>";

    // If tab does not exist, create it !
    if( does_tab_already_exists === false ){
        end_of_label = end_of_label !== '' ? ': ' + end_of_label : '';
        var li =   $(tabTemplate.replace( /#\{label\}/g,        Opage.static_label + end_of_label )
            .replace( /#\{href\}/g , "#" +    content_id )
            .replace( /#\{header_id\}/g,    header_id )
        );
        $('#home_tabs > .ui-tabs-nav' ).append( li );
        var tabContentHtml = '';//'Loading...';
        // padding:0; IMPORTANT for tiny screen and linked to width defined in reset_jquery_styles !
        GOmain_tabs.prepend( "<div id='" + content_id + "' class='tab_content' style='padding:0;'>" + tabContentHtml + "</div>" );// beteer zindex before home tabs ulist!!!=headers

        reset_jquery_styles();

    }//else
    if( does_tab_already_exists === true && force_refresh === false){    // IF tab did EXISTS and no_force_refresh, simply FPCOUS on IT !!!
        var tabIndex = $('#'+header_id).parent().index();
        GOmain_tabs.tabs( "option", "active", tabIndex);

    }else{                                                                    // IF tab did EXISTS force_refresh, REFRESH IT.
        if(get_string == 'new'){
            get_string = '';
        }
        var get_string_php = get_string;
        if (typeof Opage.php_json_url !== 'undefined') {
            //alert('get_string = ' + get_string + ' and Opage.php_json_url = ' +Opage.php_json_url);
            //var hasMoreArgumentsThanMaxAnId = get_string !== '' && isNaN(get_string);
            //get_string_php  += (!hasMoreArgumentsThanMaxAnId && Opage.php_json_url.indexOf('?') < 0) ? '?' : '&';
            //get_string_php  += 'tab_counter=' + tabCounter;

        }
        var get_string_html = '?tab_counter=' + tabCounter;
        //alert('get_stringget_string === ' + get_string_html + "\n\n" + extra_get_string);
        GOmain_tabs.tabs( "refresh" );
        GOmain_tabs.tabs( "option", "active", tabNumber);
        ///$('#'+header_id).trigger('click');
        ///alert('loading Now ' + Opage.php_url + get_string + extra_get_string);
        var currentTabCounter = tabCounter;

        // 1. load HTML content MANDATORY from html file rather than php            php_url            : 'page_db_server_edit?edited_connection_id=',  // NOW HTML !!!
        // 2. load JS FUNCTION FILE usually next folder in front _end                js_url            : Oapp.js_cache + 'page_db_server_edit.js',
        // 3. BACKEND : Load JSON data                                                php_json_url    : page_ajax_db_server_edit?edited_connection_id=',
        // 4. auto call of Opage.js_init_fct in call back of bind_back_end_JSON_into_front_end_HTML : function (tab_id){ init_js_in_edit_connection(tab_id);}

        // 1. Opage.php_url @todo : RENAME TO html_url !
        $('#' + content_id).load( Opage.php_url + get_string_html /*+ extra_get_string*/ , function (){
            if( $('#' + content_id).html() === 'Ide::YOU_ARE_NOW_LOGGED_OUT'){
                removeTab(content_id, header_id);
                GOsession.show_login_div(false);

                return;
            }else{
                var replaced = $('#' + content_id).html().replace(/\[#TAB_COUNTER#\]/g, currentTabCounter);
                $('#' + content_id).html( replaced );

                // 2. Opage.js_url
                $.getScript(Opage.js_url, function(){
                    $('.ui-tabs-anchor').click(function(){    adjust_tab_height(); /* Fix height so scroll bug */    });
                    //alert('JS loaded, victory, now trying to init it !! with tabCounter  =  ' + currentTabCounter);

                    // 3. Opage.php_json_url
                    if (typeof Opage.php_json_url !== 'undefined') {
                        bind_back_end_JSON_into_front_end_HTML(Opage.php_json_url + get_string_php + extra_get_string, currentTabCounter, Opage, content_id, header_id);
                    } else {

                        // There is NO PHP JSON to load, so just fire the JS loader...
                        if (typeof Opage.js_init_fct !== 'undefined') {
                            //alert('init for tab id = ' + currentTabCounter);
                            Opage.js_init_fct(currentTabCounter);       // NOW MAGICALLY inint the newly load JS, using New JSON and new HTML!!!
                        }

                        return;
                    }
                });
                // Special option only used by refersh_entity
                if(typeof Opage.removeOnLoad !== 'undefined' && Opage.removeOnLoad === true){
                    removeTab(content_id, header_id);
                }
            }
        });
        if(does_tab_already_exists === false){
            tabCounter++;
            tabNumber++;
        }
        if( does_tab_already_exists === true && Opage === Opages.entity_edit){    // IF tab did EXISTS , Also FOCUS on IT but ONLY if edit_entity page cos afer refresh !
            var tabIndex = $('#'+header_id).parent().index();
            GOmain_tabs.tabs( "option", "active", tabIndex);
        }
    }
}

function bind_back_end_JSON_into_front_end_HTML(json_php_url, localTabNumber, Opage, content_id, header_id) {
    //alert('READY to inject JSON from ' + json_php_url + ' into tab numero :' + localTabNumber);
    $.ajax({
        type: "GET",
        url: pos + json_php_url,
        success: function(json_back){
            hide_central_spinner();
            //if(!check_ajax_response_first_2_chars_is_ok(back,' callback of bind_back_end_JSON:' + json_php_url)){
            if (typeof json_back !== 'object') {
                removeTab(content_id, header_id);
                return;
            }
            if (typeof json_back.form_id !== 'string') {
                varInTab[localTabNumber]    = {};
                varInTab[localTabNumber].my_json = json_back;
                //console.log(Opage);
                Opage.js_init_fct(localTabNumber);            // NOW MAGICALLY inint the newly load JS, using New JSON and new HTML!!!
                adjust_tab_height(); // finally works !
                return;
            }
            var ObjectForm = $('#' + json_back.form_id + localTabNumber);
            //alert('#' + json_back.form_id + localTabNumber + ' so ObjectForm.html() = ' + ObjectForm.html());
            if (typeof ObjectForm !== 'object') {
                $('#divSimple').dialog('open');
                showDivAlert('Sorry but form_id object' + data);
                return;
            }
            var ObjectInput;
            for(var prop in json_back) {
                if (prop != 'form_id'){
                    ObjectInput = ObjectForm.find('input[name=' + prop + ']');
                    if (typeof ObjectInput.val() !== 'undefined') {
                        ObjectInput.val(json_back[prop]);
                    } else {
                        ObjectInput = ObjectForm.find('select[name=' + prop + ']');
                        if (typeof ObjectInput.val() !== 'undefined') {
                            ObjectInput.val(json_back[prop]);
                        }else{
                            //alert('NB, checkboxes not done yet, and that is Not a select ' + prop + ' with value ' +json_back[prop]);
                        }
                    }
                }
            }
            Opage.js_init_fct(localTabNumber);            // NOW MAGICALLY inint the newly load JS, using New JSON and new HTML!!!
            adjust_tab_height(); // finally works !
        }
    });
}

function adjust_tab_height() {
    $( "#home_tabs" ).find('.tab_content').css({
        'height': ($(window).height() - 43) + 'px'
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
