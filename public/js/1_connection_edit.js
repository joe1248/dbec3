//? USER_DB_SERVERS_EDIT 3. JS to Add, update, enable/disable, check if connecting, mostly using : page_ajax_all?module=connections/conn_upd or check_conn_avail
function init_js_in_edit_connection( tab_id )
{
    //debugger;
    var input_connection_id    = $('#hidden_input_connection_id_'        + tab_id);
    var is_disabled            = $('#hidden_disabled_connection_id_'    + tab_id).val();
    var div_server_message    = $('#div_for_server_messages_'            + tab_id);
    var button_disable        = $('#button_to_disable_one_connection_'+ tab_id);
    var button_enable        = $('#button_to_enable_one_connection_' + tab_id);
    var button_submit        = $('#submit_conn_form_'                + tab_id);
    this.isNewConnection = function() {
        return input_connection_id.val() === '' ? true : false;
    };
    
    if(this.isNewConnection())
    {
        div_server_message.html("Please, enter DB connection details:");
    }
    else if( is_disabled == '1')
    {
        button_enable.show();
        div_server_message.html("This connection is disabled !");
    }else
    {
        div_server_message.html("Testing..." );
        if (!this.isNewConnection()) {
            call_check_if_one_connection_works( tab_id );
        }
    }
    $( '#edit_connection_jquery_tabs_' + tab_id ).tabs(); // Create 2 TABS within edit DB connection screen : DB details on TAB_1 and SSH details on TAB_2.
    
    // if no special db protocol selected, disable SSH tab within edit DB connection screen
    if( $('#select_db_protocol_' + tab_id).val() === '' )
    {
        $( '#edit_connection_jquery_tabs_' + tab_id ).tabs( "disable", 1 );
    }

    button_submit.show();
    reset_jquery_styles();
    $('#form_connection_' + tab_id).fadeIn();
        
    var fct_enable_disable = function(tab_id, value){
        var destination = pos + 'page_ajax_all?module=connections/conn_disable&connection_disabled=' + value + '&connection_id=' + input_connection_id.val();
        var is_disabled = value;
        $('#hidden_disabled_connection_id_'    + tab_id).val( is_disabled );
        if(is_disabled === '1'){
            div_server_message.html('Disabling now...');
            button_disable.hide();
        }else{
            div_server_message.html('Enabling now...');
            button_enable.hide();
        } 
        $.get(destination, function(back){
            if(check_ajax_response_first_2_chars_is_ok(back,' callback after fct_enable_disable')){
                back = back.substr(2);
                div_server_message.hide(); 
                if(div_server_message.html() == 'Enabling now...'){
                    div_server_message.html('Testing connection...');
                    call_check_if_one_connection_works( tab_id );
                }else{
                    button_enable.show();
                    button_disable.hide();
                    div_server_message.html(back);///SAME as back ! + '<br>This connection is disabled !');
                }
                addStaticTab(true, Opages.db_servers_list ); // REfresh db_servers_list (if already opened though...)
                div_server_message.fadeIn();
            }
        });
    }; 
    button_disable.click(function(e){    fct_enable_disable(tab_id, '1');    });
    button_enable.click( function(e){    fct_enable_disable(tab_id, '0');    });
    //$('#form_connection > *').keydown( function(e){ button_submit.show(); });
    //$('#form_connection > *').change( function(e){ button_submit.show(); });
    $('#button_test_connection_works_' + tab_id).hide();
    $('#button_test_connection_works_' + tab_id).click( function (e){
        call_check_if_one_connection_works( tab_id );
    });
    // Event on submit in order to ask confirmation if new DB server has same name as exiting= overwrite ?
    button_submit.click( function (e){
        // check if connecion name already exists
        var post_data = html_form_to_object('form_connection_' + tab_id);
        // CHECK DATABASE credentials have been filled
        var AnotEmptyFields =    {'db_connection_name'    : 'Database Label'
                                ,'db_url_host'            : 'Database Host'
                                ,'db_user_name'            : 'Database User Name'
                                ,'db_pass_word'            : 'Database Password'
                                ,'db_port_number'        : 'Database Port Number'
                                };
        var msg = '';
        for (var field_name in AnotEmptyFields) {
            if (post_data[field_name] === '') {
                msg += '<br> - ' + AnotEmptyFields[field_name];
            }
        }
        if (msg !== '') {
            showDivAlert('Error, those fields cannot be left blank:' + msg);
            return;
        }
        // CHECK SSH credentials have been filled
        if(!(Gcurrent_user == 'autotest' || Gcurrent_user == 'joe')){
            if (post_data['db_url_host'] === 'localhost') {
                AnotEmptyFields =    {'ftp_url_host'            : 'SSH Host'
                                    ,'ftp_user_name'        : 'SSH User Name'
                                    ,'ftp_pass_word'        : 'SSH Password'
                                    ,'ftp_port_number'        : 'SSH Port Number'
                                    };
                for (var field_name in AnotEmptyFields) {
                    if (post_data[field_name] === '') {
                        msg += '<br> - ' + AnotEmptyFields[field_name];
                    }
                }
                if (msg !== '') {
                    showDivAlert('As you are using "localhost" as database host instead of an IP address, you must also fill in your SSH credentials:' + msg);
                    return;
                }
            }
        }
        if (isSameNameAlready('db', post_data.db_connection_name, post_data.db_connection_id)) {
            msg = 'Another DB server already exists with that name. <br><br>Please confirm you want to overwrite it ?';
            showDivConfirm( msg, confirmedGoSaveConnection, 'Confirmation before overwrite', false);
            return;
        } else {
            confirmedGoSaveConnection( tab_id );
        }
    });
    var confirmedGoSaveConnection = function( tab_id ){
        button_submit.show();
        button_submit.val('Save');
        div_server_message.html('Saving in progress...');
        var post_data = html_form_to_object('form_connection_' + tab_id);
        var successCallBack = function(backEndData){
            input_connection_id.val(backEndData.connection_id);
            div_server_message.html(backEndData.message);
            var is_disabled = $('#hidden_disabled_connection_id_'    + tab_id).val();
            if(is_disabled === '1'){
                $('#button_test_connection_works_' + tab_id).show();
            }else{
                call_check_if_one_connection_works( tab_id );
            }
            Aconnections_db.push('ok');    // why ?
            success_refresh_html_select_entities_to_clone();
            $('#welcome_big_button_add_db_server'    ).parent().hide(); // hide BIG add_new_db_server button.
            $('#welcome_button_db_servers_list'        ).parent().show();// show fielset to manage db servers
            addStaticTab(true, Opages.db_servers_list ); // REfresh db_servers_list (if already opened though...)
        };
        if (this.isNewConnection()) {
            $.post(Opages.db_server_create.php_url, post_data, successCallBack, 'json');
        } else {
            $.ajax({
                type    : 'PATCH',
                url     : Opages.db_server_update.php_url,
                data    : post_data,
                success    : successCallBack
            });
        }
    };
    $('#select_db_protocol_' + tab_id).change( function(){
        var selected_val = $(this).val();
        if( selected_val === ''){
            $( '#edit_connection_jquery_tabs_' + tab_id ).tabs( "disable", 1 );
        }else{
            $( '#edit_connection_jquery_tabs_' + tab_id ).tabs( "enable", 1 );
        }
    });
    $('#view_db_pass_'  + tab_id).mousedown(    function(){        $('#db_pass_word_' + tab_id).attr('type','text');        });
    $('#view_db_pass_'  + tab_id).mouseup(        function(){        $('#db_pass_word_' + tab_id).attr('type','password');    });
    $('#view_ftp_pass_' + tab_id).mousedown(    function(){        $('#ftp_pass_word_'+ tab_id).attr('type','text');        });
    $('#view_ftp_pass_' + tab_id).mouseup(        function(){        $('#ftp_pass_word_'+ tab_id).attr('type','password');    });

    var isSameNameAlready = function(connection_genre, connection_name, connection_id){
        if(Gcurrent_user == 'autotest'){
            return false;
        }
        var tmp, Aconnections_names = [];
        switch(connection_genre){
            case 'db':
                tmp = parent.Aconnections_db;
                break;
            case 'ftp':
                tmp = parent.Aconnections_ftp;
                break;
        }
        for(var i = 0 ; i < tmp.length ; i++){
            if(tmp[i].id != connection_id){
                Aconnections_names.push( tmp[i].connection_name );
            }
        }
        // if same name IS found, return true
        return (-1 !== js_in_array(connection_name, Aconnections_names) ) ? true : false;
    };
}

// below fct should be get script just before the ajax load
function call_check_if_one_connection_works( tab_id ){
    var input_connection_id    = $('#hidden_input_connection_id_'        + tab_id);
    var connection_id = input_connection_id.val();
    var div_server_message    = $('#div_for_server_messages_'            + tab_id);
    if(connection_id >= 1){
        div_server_message.css('background-color', '');
        div_server_message.html('Testing connection...');
        var destination = pos + 'page_ajax_all?module=connections/check_conn_avail&connection_id=' + connection_id;
        $.get(destination, call_check_if_one_connection_works_callback(tab_id, connection_id));   // fill_up_iframe is the callback success fct !
    }else{
        console.log('Error in call_check_if_one_connection_works : No connection id to check if works. connection_id = ' + connection_id);
    }
} 

var call_check_if_one_connection_works_callback = function(tab_id, connection_id) {
    return function(data, textStatus) {
        var div_server_message    = $('#div_for_server_messages_'            + tab_id);
        var button_disable        = $('#button_to_disable_one_connection_'+ tab_id);
        var is_disabled            = $('#hidden_disabled_connection_id_'    + tab_id).val();
        var bg_color = '';
        var conn_status = '';

        if(js_in_array(data, ['yes','1','DB_connection_OK', 'local_DB_connection_OK','SSH_connection_OK','SSH_TUNNEL_CASH_WORKING']) !== -1 ||
            !isNaN(data)
        ){
            bg_color = 'green';
            conn_status = 'This connection is working'; // used in autotest !
        }else{
            bg_color = 'orange';
            conn_status = data; // output error message to user
            if(is_disabled === '0'){
                button_disable.show();
            }
        }
        div_server_message.css('background-color', bg_color);
        div_server_message.html( conn_status ); 
        setTimeout( function(){ div_server_message.css('background-color', '');  } , 2000 );
    };
};
