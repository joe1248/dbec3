//? USER_DB_SERVERS_LIST In the DB servers list : call_check_connection_availibility + its scallback and display
function init_js_in_db_servers_list(tabNumber) {
    var Aconn = varInTab[tabNumber].my_json;
    //dump(Aconn);
    var html = '';
    for( var i=0 ; i < Aconn.length ; i++) {
        html += 
            '<tr>' +
            '    <td class="centered" style="width:20px;">' +
            '        <div id="td_connection_status_' + Aconn[i].id + '" class="connection_statuses">&nbsp;</div>' +
            '    </td>' +
            '    <td style="text-indent:20px;">' + Aconn[i].connection_name + '</td>' +
            '    <td class="centered" id="td_button_connection_' + Aconn[i].id + '" style="width:55px;">&nbsp;    </td>';
        if (Aconn[i].connection_disabled == 1) {
            html += '    <td><input type="button" value="Enable"        html_connection_id="' + Aconn[i].id + '" html_connection_label="' + Aconn[i].connection_name + '" class="small-button button_connection_enable"></td>';
        } else {
            html += '    <td><input type="button" value="Edit"        html_connection_id="' + Aconn[i].id + '" html_connection_label="' + Aconn[i].connection_name + '" class="small-button button_connection_edit"></td>' +
                    '    <td><input type="button" value="Clone"        html_connection_id="' + Aconn[i].id + '" html_connection_label="' + Aconn[i].connection_name + '" class="small-button button_connection_clone"></td>' +
                    '    <td><input type="button" value="Delete"        html_connection_id="' + Aconn[i].id + '" html_connection_label="' + Aconn[i].connection_name + '" class="small-button button_connection_delete"' +
                    ' id="oto_del_conn_' + Aconn[i].id + '"></td>';
        }
        html += '</tr>';
    }
    
    // Render
    $('.html_example').html(html);$('.html_example').attr('class', '');
    
    for(i=0 ; i < Aconn.length ; i++) {
        if (Aconn[i].connection_disabled == 0) {
            ///$('input["html_connection_id=' + Aconn[i].id + '"]').hide();
            call_check_connection_availibility(Aconn[i].id);
            do_the_display(Aconn[i].id, "Being tested...", "orange");
        } else {
            do_the_display(Aconn[i].id, "Disabled", "#555");
        }
    }
    reset_jquery_styles();
    $( '.connection_statuses'  ).addClass('ui-corner-all');
    $( '#div_connections_list' ).fadeIn();
    $( '#connection_list_button_add_connection').click( function(){        addStaticTab(false, Opages.db_server_add        );        });
    
    $( '.button_connection_edit'    ).click( function(){ addStaticTab(false, Opages.db_server_edit,    $(this).attr('html_connection_id'), $(this).attr('html_connection_label') );    });
    $( '.button_connection_clone'    ).click( function(){ addStaticTab(false, Opages.db_server_clone,$(this).attr('html_connection_id'), $(this).attr('html_connection_label') );    });
    $( '.button_connection_delete'    ).click( function(){ delete_user_file(    $(this).attr('html_connection_id'), 'Aconnections_db', true);});
    ///$( '.button_connection_enable'    ).click( function(){ enable_connection(    $(this).attr('html_connection_id'), 'Aconnections_db', true);});
}
function call_check_connection_availibility(connection_id){
    var destination = pos + 'page_ajax_all?module=connections/check_conn_avail&connection_id=' + connection_id;
    $.get(destination, call_check_connection_availibility_callback(connection_id));   // fill_up_iframe is the callback success fct !
} 
function do_the_display(connection_id, conn_status, bg_color){
    $('#td_connection_status_'+connection_id).css('background-color', bg_color);
    $('#td_connection_status_'+connection_id).attr( 'title', conn_status );    
    $('#td_connection_status_'+connection_id).html(conn_status);    
}
var call_check_connection_availibility_callback = function(connection_id) { 
    return function(data, textStatus) {
        var bg_color = '';
        var conn_status = '';
        if(    !isNaN(data) ||
            js_in_array(data, ['yes','1','DB_connection_OK', 'local_DB_connection_OK','SSH_connection_OK','SSH_TUNNEL_CASH_WORKING']) !== -1 || 
            data.indexOf('DB_connection_OK') > 0){
            bg_color = 'green';
            conn_status = 'Goed'
        }else{
            bg_color = 'red';
            conn_status = 'Neit Goed';
                data;//
            // LATER COS HARD TO UPDATE EDIT CONNECTION TAB IF OPENNED : $('#td_button_connection_'+connection_id).html('<input id="button_to_disable_one_connection_'+connection_id+'" class="small-button" type="button" value="Disable">');
            reset_jquery_styles();
            /* LATER COS HARD TO UPDATE EDIT CONNECTION TAB IF OPENNED : 
            $('#button_to_disable_one_connection_'+connection_id).click(function(e){
                $('#button_to_disable_one_connection_'+connection_id).hide();
                var bg_color = 'black';
                var conn_status = 'Soon disabled...';
                do_the_display(connection_id, conn_status, bg_color);
                $.get(pos + 'save__d/ajax/connections/conn_disable.php?connection_disabled=1&connection_id=' + connection_id, function(back){
                    if(check_ajax_response_first_2_chars_is_ok(back,' callback of connection disabled ')){
                        var bg_color = '#555';
                        var conn_status = 'Disabled';
                        do_the_display(connection_id, conn_status, bg_color);
                        // Update edit taht connection TAB if open !!
                        addStaticTab(false, Opages.db_server_clone,    connection_id+'', '' );    
                    }
                });
            });*/
        }
        do_the_display(connection_id, conn_status, bg_color);
    };
};
