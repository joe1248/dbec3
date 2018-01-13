//? GENERAL_JS  TAB management : #home_tabs creation + addStaticTab + updateTabTitle...
var GOmain_tabs;
var Amenu_labels = {
    'MENU_PERSO_ENTITY_EDIT' : 'Edit entity',
    'MENU_PERSO_ENTITY_DELETE' : 'Delete entity',
    'OTO_TEST_INPUT_TEXT_BACK_FROM_ANALYSE' : '<input type="text" id="oto_test_input_text_entity_ready_id" value="',
    'OTO_TEST_INPUT_TEXT_BACK_FROM_DB_CHECKED' : '<input type="text" id="oto_test_input_text_new_transfer_id" value="'
};
    
$(function() {
    
    GOmain_tabs = $('#home_tabs');
    $( "#home_tabs" ).tabs({//        heightStyle    : "fill",
        active        : 0
    }).css({
        'overflow':'hidden'        
    });
    $('#link_home_tab').click(function(){
        setTimeout(function(){ $('#home_tab_welcome').trigger('resize'); }, 1); // fix query "bug" so that the whole scroll bar is visible
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
    GOmain_tabs.delegate( "span.ui-icon-close", "click", function() {
        var panelId = $( this ).closest( "li" ).remove().attr( "aria-controls" );
        removeTab( panelId );
    });
    
    $('.ui-tabs-anchor').click(function(){
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
function addStaticTab( force_refresh, Opage, get_string, end_of_label, extra_get_string ){
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
        //var get_string_html = get_string;
        var get_string_php = get_string;
        //get_string_html += (get_string === '' && Opage.php_url.indexOf('?') < 0) ? '?' : '&';
        if (typeof Opage.php_json_url !== 'undefined') {
            get_string_php  += (get_string === '' && Opage.php_json_url.indexOf('?') < 0) ? '?' : '&';
            get_string_php  += 'tab_counter=' + tabCounter;
        }
        var get_string_html = '?tab_counter=' + tabCounter;
        
        //get_string += '&ajax=true';
        /// alert('get_stringget_string === ' + get_string + "\n\n" + extra_get_string);
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
                        
                        
                        alert('php_json_url is not defined in pages.js to feed ' + Opage.js_url + ' BUt Firing JS init anyway...');
                        
                        if (typeof Opage.js_init_fct !== 'undefined') {
                            alert('init for tab id = ' + currentTabCounter);
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

function bind_back_end_JSON_into_front_end_HTML(json_php_url, tabNumber, Opage, content_id, header_id) {
    //alert('READY to inject JSON from ' + json_php_url + ' into tab numero :' + tabNumber);
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
                varInTab[tabNumber]    = {};
                varInTab[tabNumber].my_json = json_back;
                //console.log(Opage);
                Opage.js_init_fct(tabNumber);            // NOW MAGICALLY inint the newly load JS, using New JSON and new HTML!!!
                adjust_tab_height(); // finally works !
                return;
            }
            var ObjectForm = $('#' + json_back.form_id + tabNumber);
            //alert('#' + json_back.form_id + tabNumber + ' so ObjectForm.html() = ' + ObjectForm.html());
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
            Opage.js_init_fct(tabNumber);            // NOW MAGICALLY inint the newly load JS, using New JSON and new HTML!!!
            adjust_tab_height(); // finally works !
        }
    });
}

function adjust_tab_height() {
    $( "#home_tabs" ).find('.tab_content').css({
        'height': ($(window).height() - 43) + 'px'
    });
}
