//? GENERAL_JS   ******************<span style="color:red;"> MAP OF ALL PAGES OF THE APP</span> 
var Gmax_nb_entity_to_copy = 10;
var SESSION_DURATION_IN_MINUTES = 300;
var GOsession;
var Gsession_max_time = SESSION_DURATION_IN_MINUTES * 60;
var Gsession_user_name = 'dummy_test';
var Aconnections_db = [], A7db_entity_confirmed = [], A8db_entity_data = [], Aconnections_ftp = [];
        //? OBFUSCATION_0_general_1 : Load in JS Aobfuscation_types and Aobfuscation_options
var Aobfuscation_types = [];
var Aobfuscation_options = [];

var Oapp = {
    'js_cache'    :    'cache_js/'
};
var Gdebug_debug_all = false;
var Gdebug_debug_1_db_check = false;
var Gdebug_debug_2_extraction = false;
var Gdebug_debug_3_paste = false;///true;
function js_log(debug, msg){
    if(debug){
        console.log( msg );
    }
}

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
var Opages = {
    your_account :    {    static_label    : 'Your Account',
                        static_id        : 'tab_user_account',
                        php_url            : 'html/0_account_edit.html',
                        php_json_url    : 'page_ajax_all?module=_00_my_account/get_user_details',
                        js_url            : Oapp.js_cache + 'page_your_account.js',
                        js_init_fct        : function (tab_id){ init_js_in_my_account(tab_id);}
                    },
    update_user_one : { php_url         : 'page_ajax_all?module=_00_my_account/update_user_details'},
    update_user_two : { php_url         : 'page_ajax_all?module=_00_my_account/update_user_settings'},
                    
    the_documentation :    {    static_label    : 'Documentation',
                        static_id        : 'tab_documentation',
                        php_url            : 'page_the_documentation',  
                        js_url            : Oapp.js_cache + 'page_the_documentation.js' 
                    }, 

    fk_by_hand :    {    static_label    : 'Foreign Key manually',
                        static_id        : 'tab_fk_by_hand',
                        php_url            : 'page_fk_by_hand',
                        js_url            : Oapp.js_cache + 'page_fk_by_hand.js'
                    },
    fk_by_hand_gnr_sql:{    php_url        : 'page_ajax_all?module=manual_fk/generate_fk_sql'
                    },
    fk_by_hand_get_fks:{    php_url        : 'page_ajax_all?module=manual_fk/get_fks_select'
                    },

        /*******************    DB SERVERS ***************************/
    json_db_servers_list:{
                        php_url            : '/connections'
                    },
    db_servers_list:{   static_label : 'DB Servers',
                        static_id    : 'tab_db_servers_list',

                        php_url      : 'html/1_connections_list.html',
                        js_url       :   'js/1_connections_list.js',
                        php_json_url : 'page_ajax_all?module=connections/conn_list&connection_genre=db',
                        js_init_fct  : function (tab_id){ init_js_in_db_servers_list(tab_id);}
                        
                    },
    db_server_edit:{    static_label : 'Edit DB Server',
                        static_id    : 'tab_db_server_edit',

                        php_url      : 'html/1_connection_edit.html',
                        js_url       :   'js/1_connection_edit.js',
                        php_json_url : 'connection/', // id must be appened to this URL
                        js_init_fct  : function (tab_id){ init_js_in_edit_connection(tab_id);}
                    },
    db_server_add:{    static_label : 'Add DB Server',
                        static_id    : 'tab_db_server_edit',

                        php_url      : 'html/1_connection_edit.html',
                        js_url       :   'js/1_connection_edit.js',
                        php_json_url : 'connection/new',
                        js_init_fct  : function (tab_id){ init_js_in_edit_connection(tab_id);}
                    },
    db_server_clone:{   static_label : 'Clone DB Server',
                        static_id    : 'tab_db_server_clone',
                        php_url      : 'page_db_server_edit?action=clone&edited_connection_id=',
                        js_url       : Oapp.js_cache + 'page_db_server_edit.js'
                    },
                    
        /*******************    ENTITIES ***************************/
                    
    // rename all Opages.create_entity to Opages.entity_create
    // THIS JUST SHOW THE TREE OF DR SERVERS/DATABEASES/TABLES
    create_entity : {   static_label : 'New Entity Creation',
                        static_id    : 'tab_create_entity',

                        php_url      : 'html/2_entity_create.html',
                        js_url       :   'js/2_entity_create.js',
                        php_json_url : 'page_ajax_create_entity',
                        js_init_fct  : function (tab_id){ init_js_in_create_one_entity(tab_id);},
                        removeOnLoad : false,
                        removeOnSecondLoad : true
                    },
    
    entity_refresh : {  static_label : 'Refresh Entity Definition',
                        static_id    : 'tab_refresh_entity',
                        php_url      : 'page_ajax_create_entity?ajax=true&entity_ready_id=',
                        js_url       : Oapp.js_cache + 'page_create_entity.js',
                        removeOnLoad : true
                    },
    entities_list : {   static_label : 'Manage Entities',
                        static_id    : 'tab_entities_list',

                        php_url      : 'html/2_entities_list.html',
                        js_url       :   'js/2_entities_list.js',
                        php_json_url : 'page_ajax_all?module=entities/get_all',
                        js_init_fct  : function (tab_id){ init_js_in_entity_list(tab_id);}
                    },
    entity_edit:    {    static_label    : 'Edit Entity',
                        static_id        : 'tab_edit_entity',
                        php_url            : 'page_entity_edit',
                        js_url            : Oapp.js_cache + 'page_entity_edit.js',
                        php_json_url    : 'page_ajax_entity_edit?entity_ready_id=',
                        js_init_fct        : function (tab_id){ init_js_in_edit_one_entity(tab_id);}
                    },
    obfuscation_options:{php_json_url    : '/config'},
    entity_edit_two:{    php_json_url    : 'page_ajax_entity_edit_two?ajax=true&entity_ready_id='},
    // not used entity_edit_three:{    php_url            : 'page_entity_edit_three?ajax=true&entity_ready_id=',},
    entity_edit_quatre:{php_json_url    : 'page_ajax_entity_edit_quatre?ajax=true&entity_ready_id='},
                    
                    
            /*******************    CLONE DATA  ***************************/
                    
    clone_entire_tables_ui :    {    static_label    : 'Transfer ',
                        static_id        : 'tab_transfer_entire',
                        php_url            : 'page_clone_entire_tables_ui',  
                        js_url            : Oapp.js_cache + 'page_clone_entire_tables_ui.js',
                        php_json_url    : 'page_ajax_transfer_one_table_ui',                // ------------ copying table step 1
                        js_init_fct     : function (tab_id){ init_js_in_clone_entire_tables_ui(tab_id);}
                    },
    copy_table_check:{    php_url            : 'page_ajax_copy_table_check_it_is_new?ajax=true'    // ------------ copying table step 3A
                    },
    copy_table_count:{  php_url         : 'page_ajax_copy_table_quick_count?ajax=true'      // ------------ copying table step 4
                    },
    copy_table_get_id:{  php_url        : 'page_ajax_copy_table_get_paste_id?ajax=true'      // ------------ copying table step 4
                    },
    copy_table_start:{  php_url         : 'page_ajax_copy_table_go_transfer?ajax=true'      // ------------ copying table step 5
                    },

    /*******************    TRANSFERED DATA VIEWER  ***************************/
    data_viewer_main:{    static_label    : 'Data Viewer',
                        static_id        : 'tab_data_viewer',
                        php_url            : 'page_data_viewer_main',
                        js_url            : Oapp.js_cache + 'page_data_viewer_main.js',
                        php_json_url    : 'page_ajax_data_viewer_ui?paste_transfer_id=',
                        js_init_fct        : function (tab_id){ init_js_in_subset_viewer_ui(tab_id);}
                    },
    data_viewer_get_data:{    php_url        : 'page_ajax_all?module=data_viewer/get_data_from_one_table2'
                    },
    /*******************    DATABASE EXPLORER  ***************************/
    simple_db_explorer:{    static_label    : 'DB Explorer',
                        static_id        : 'tab_db_explorer',
                        php_url            : 'page_db_explorer_main',
                        js_url            : Oapp.js_cache + 'page_db_explorer_main.js',
                        php_json_url    : 'page_ajax_db_explorer_ui',
                        js_init_fct        : function (tab_id){ init_js_in_db_explorer_ui(tab_id);}
                    },
    db_explorer_get_data:{    php_url        : 'page_ajax_all?module=db_explorer/get_all_rows_from_one_table'
                    },

    /*******************    RECENT TRANSFER  ***************************/
    recent_transfer:{    static_label    : 'Transfer History',
                        static_id        : 'tab_transfer_history',
                        php_url            : 'page_recent_transfer', 
                        js_url            : Oapp.js_cache + 'page_recent_transfer.js',
                        php_json_url    : 'page_ajax_transfer_history',
                        js_init_fct        : function (tab_id){ init_js_in_recent_transfer_ui(tab_id);}
                    },

    /*******************    CLONE DATA  subsets ***************************/
    edit_fave_target:{  php_url           : 'page_edit_fave_target',
                        js_url            : Oapp.js_cache + 'page_edit_fave_target.js',
                        php_json_url      : 'page_ajax_edit_fave_target'
                        //nope code special box : js_init_fct       : function (tab_id){ init_js_in_edit_fave_target(tab_id);}
                    },
    change_target_db:{    php_url            : 'page_change_target_db?ajax=true',
                        js_url            : Oapp.js_cache + 'page_change_target_db.js'
                    },
    clone_data_ui :    {    static_label    : 'Clone ',
                        static_id        : 'tab_clone_data',
                        php_url            : 'page_clone_data_ui',
                        js_url            : Oapp.js_cache + 'page_clone_data_ui.js',
                        php_json_url    : 'page_ajax_clone_data_ui?entity_ready_id=',        // ------------ cloning step 1
                        js_init_fct        : function (tab_id){ init_js_in_cloning_ui(tab_id);}
                    },
    clone_data_get_ids:{php_url            : 'page_ajax_get_records_ids_from_src?ajax=true'    // ------------ cloning step 2
                    },
    clone_data_check:{    php_url            : 'page_ajax_clone_schemas_check?ajax=true'            // ------------ cloning step 3A
                    },
    clone_data_fix_db:{    php_url            : 'page_ajax_clone_target_schema_fix?ajax=true'        // ------------ cloning step 3B
                    },
    clone_data_copy:{    php_url            : 'page_ajax_clone_data_copy?ajax=true'//DISCOVERY    // ------------ cloning step 4
                    },
    clone_copy_progress:{ php_url        : 'page_ajax_clone_copy_progress'                    // ------------ cloning step 5
                        },
    clone_data_paste:{    php_url            : 'page_ajax_clone_data_paste?ajax=true'// EXTRACTION + PASTE in parallel = step 6 !
                    },
    clone_copy_cancel:{    php_url            : 'page_ajax_all?module=transfer/cancel_transfer'
                        },
                    
    /*******************    SAVED SQL DATA FILES  ***************************/
    sql_files_list:    {    static_label    : 'Saved Data Files',
                        static_id        : 'tab_sql_data_files_list',
                        php_url            : 'page_sql_files_list', 
                        js_url            : Oapp.js_cache + 'page_sql_files_list.js'
                    }
};
