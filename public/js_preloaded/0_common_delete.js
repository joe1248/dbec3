//? GENERAL_JS COmmon file used for the JS deletion of most things : DB_connections, analysed_DBs, perso_entities (AND even for SQL_DATA_FILES BUT NOT FAVORITES cos no PHP confirm needed !!!)
function delete_user_file(sql_id, data_type, just_testing_true){
    var post_data, real_delete = false;
    if( typeof just_testing_true !== 'undefined' && just_testing_true===true){
        GO_delete_params.sql_id = sql_id;
        GO_delete_params.data_type = data_type;
        post_data = {
            'sql_id'            :    sql_id,
            'data_type'            :    data_type,
            'just_testing'        :    'true'
        };
    }else{
        if( typeof sql_id  !== 'undefined' ||  typeof data_type  !== 'undefined' ){
            console.log('Error in delete_user_file cos all params should be null since just_testing_true IS NOT true !='+GO_delete_params.sql_id);
            return;
        }
        if( !isNaN(GO_delete_params.sql_id) && GO_delete_params.data_type.length ){
            post_data = GO_delete_params;
            real_delete = true;
        }else{
            console.log('Error in delete_user_file cos GO_delete_params.sql_id='+GO_delete_params.sql_id);
            return;
        }
    }
    if (data_type == 'Aconnections_db') {
        real_delete = true;
        $.ajax({
            type: "DELETE",
            url: '/connection/' + sql_id,
            success: (!real_delete ? delete_user_file_call_back_one : delete_user_file_call_back_two) 
        }); 
    } else {
        $.ajax({
            type: "POST",
            url: pos+"page_ajax_all?module=delete_dbec_row",
            data: post_data,
            success: (!real_delete ? delete_user_file_call_back_one : delete_user_file_call_back_two) 
        });    
    }
    show_central_spinner();
}
var GO_delete_params = { 'sql_id':null, 'data_type':null, 'just_testing':'false' };
function delete_user_file_call_back_one(data){
    hide_central_spinner();
    if( !check_ajax_response_first_2_chars_is_ok( data, 'Error in delete_user_file_call_back_one. ')){
        return;
    }
    data = data.substr(2);
    showDivConfirm( data, delete_user_file, 'Confirmation before delete', true );
}
function delete_user_file_call_back_two(data){
    hide_central_spinner();
    if( !data.success){//}!check_ajax_response_first_2_chars_is_ok( data, 'Error in delete_user_file_call_back_two. ')){
        return;
    }
    refresh_js_db_connections_list_so_show_db_buttons();
    addStaticTab(true, Opages.db_servers_list );
    return;
    
    /*data = data.substr(2);
    var limit = data.indexOf(',#,');
    var Adata = data.split(',#,');
    var user_data_type = Adata[0];
    var json  = Adata[1];*/
    switch(user_data_type){
        case 'Aconnections_db':
            Aconnections_db = JSON.parse(json);
            if(Aconnections_db.length === 0){
                // Remove list of connexions if none last one has been deleted
                removeTab('html_content_tab_tab_db_servers_list', 'html_header_tab_tab_db_servers_list');
            }else{
                addStaticTab(true, Opages.db_servers_list ); // REfresh db_servers_list (if already opened though...)
            }
            success_refresh_html_select_entities_to_clone();
            //TODO : remove tab just deleted if still being edited...  removeTab('html_content_tab_tab_db_servers_list', 'html_header_tab_tab_db_servers_list');
        break;
        case 'db_favorite_sources':
        case 'db_favorite_destinations':
            break;
        //case '6db_entity_families':
            // JSON IS MOSTY THE ID BEING DLETED
            //A6db_entity_families = JSON.parse(json);
        //    break;
        case '7db_entity_confirmed':
            //alert('refresh entity list'+json);
            //A7db_entity_confirmed = JSON.parse(json);
            ///dump(A7db_entity_confirmed);
            addStaticTab(true, Opages.entities_list ); // REfresh entity list.
            refresh_html_select_entities_to_clone();
            break;
        case '8db_entity_data':
            A8db_entity_data = JSON.parse(json);
            refresh_list_of_sql_file_ready_to_paste();
            addStaticTab(true, Opages.sql_files_list ); // REfresh sql_files_list (if already opened though...)

            //refresh_8db_entity_data();
            break;
        default:console.log('Error prog in delete_user_file_call_back_two cos user_data_type='+user_data_type);
    }
    //refresh_jquery_menus();
}
