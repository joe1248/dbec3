//? USER_HOME_PAGE Javascript/jQuery lauching 3 GET AJAX request to fill up UI with 1.Opages.ENTITIES_LIST.php_url, 2:sql_files_list, 3:recent_transfer
var Aobfuscation_types, Aobfuscation_options, Glast_version, Gcurr_version;
// Dynamic loading of Obfuscation options proposed by the back end !!!
$.get( Opages.obfuscation_options.php_json_url, function (back){
    $(document).ajaxError(function(e, xhr, settings, exception) {
        console.log(exception + 'error in: ' + settings.url + ' \n'+'error:\n' + exception );
    });
    var backEndData = JSON.parse(back);
    Aobfuscation_types = backEndData.Adatatypes;
    Aobfuscation_options = backEndData.AoptionsByDatatypes;
    Glast_version = parseInt(backEndData.last_version, 10);
    Gcurr_version = parseInt(backEndData.curr_version, 10);
    $('#auto_test_user_home_title').text('DBEC Version '+Gcurr_version/100);
    if(Glast_version > 100 && Glast_version != Gcurr_version) {
        $('#button_to_get_latest_dbec_version').val('Update to DBec ' + Glast_version/100);
        $('#button_to_get_latest_dbec_version').show();
    }
});
refresh_jquery_menus();

$('.welcome_button_add_db_server').tooltip({
    position: { my: "left bottom", at: "right top" },
    show: { effect: "blind", duration: 400, direction:'left' } 
});
$('.welcome_button_create_entity').tooltip({ 
    position: { my: "left top", at: "right bottom" },
    show: { effect: "blind", duration: 400, direction :'left' } 
});

$('#welcome_button_db_servers_list'        ).click( function(){        addStaticTab(false, Opages.db_servers_list        );        });
$('.welcome_button_add_db_server'        ).click( function(){        addStaticTab(false, Opages.db_server_edit        );        });

$('#welcome_button_entities_list'        ).click( function(){        addStaticTab(false, Opages.entities_list        );        });
$('.welcome_button_create_entity'        ).click( function(){        addStaticTab(false, Opages.create_entity        );        });

$('#welcome_button_database_explorer'   ).click( function(){        addStaticTab(false, Opages.simple_db_explorer   );        });

$('#button_account_details'                ).click( function(){        addStaticTab(false, Opages.your_account            );        });

$('#button_foreign_keys_wizard'            ).click( function(){        addStaticTab(false, Opages.fk_wizard            );        });
$('#button_foreign_keys_manually'        ).click( function(){        addStaticTab(false, Opages.fk_by_hand            );        });

$('#button_documentation'                ).click( function(){        addStaticTab(false, Opages.the_documentation    );        });

$('#button_to_get_latest_dbec_version').click( function(e){
    $('#button_to_get_latest_dbec_version').hide();
    show_central_spinner();
    $.get( pos + 'page_ajax_get_dbec_latest_version', function(back){
        hide_central_spinner();
        if( back !== 'OK'){
            showDivAlert(back, 'Error while updating...<br>' + back);
            $('#button_to_get_latest_dbec_version').show();
        }else{
            $('#button_to_get_latest_dbec_version').hide();
            $('#dbec_is_up_to_date').show();
            //showDivSimple('Well done, DBec is now up to date !', '');
            showDivAlert('Well done, DBec is now up to date !<br>Press OK to reload the page.', '');
            $('#divAlertOk' ).click( function(){ 
                $('#divAlert').dialog('close'); 
                if( top.location.href.indexOf('old_vrs') > 0){
                    top.location.href = js_replace('old_vrs', 'new_vrs', top.location.href);
                }else{
                    top.location.reload(); 
                }
            });
            // NOw ask if OK to switch to new version, old version always OK to go back to "hopefully if DB changes are handled?!?!?!ask sumeet !"
            //===> if ok, top.location reload and for old version loaction = old_version/ !!!
            
            //==> quite now you need to detect in echo type if needed to redirect to new_version or old_version, depending on user_choice saved in DB ???
        }
    });
});
function refresh_jquery_menus(context){
    //if(typeof context === 'undefined'){
        context = window;
    //}
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
    $.get( Opages.json_db_servers_list.php_url, function(back){
        if(check_ajax_response_first_2_chars_is_ok(back,' callback of json_db_servers_list')){
            back = back.substr(2);
            Aconnections_db = JSON.parse(back);
            show_buttons_to_add_and_list_connections();
        }
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
