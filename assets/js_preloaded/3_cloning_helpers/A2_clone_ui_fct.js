js_Class_Clone_Ui.prototype.changeMode = function(new_mode, comment){
    ///alert('New mode =' + new_mode + ' triggered ' + comment);
    this.cloneUiMode = new_mode;
};
// called at the END of left side choices
js_Class_Clone_Ui.prototype.user_has_finished_src_choices = function(){
    $('.div_right').fadeIn();
    if(this.is_copy_not_delete === 'true'){
        $('#div_db_tree_destination_dad').show();
        this.show_div_bottom();
    }else{
        $('#transfer_submit_button').show();
        $('#my_div_bottom').show();              // when delete, not need destination !
    }
    scroll_to_bottom();
};
// called at the END of right side choices
js_Class_Clone_Ui.prototype.show_div_bottom = function(){
    // If destination chosen => show options + submit, else hide options...
    if( $('#clone_'+this.tabCounter+'dest_db_svr_id').val() !== '' && 
        $('#clone_'+this.tabCounter+'src_db_svr_id').val()    !== '' && 
        $('#clone_'+this.tabCounter+'object_id').val()        !== ''){
        $('#div_extra_questions').show(); make_strong_checkboxes(); // NB : it is, for now, stored in: html_cdn/lib/ide_js/mini_jquery.js
        $('#transfer_submit_button').show();
        $('#my_div_bottom').show();
    }else{
        $('#my_div_bottom').hide();
        $('#div_extra_questions').hide();
    }            
};
// When user click CHNAGE button on ID(s) to copy
js_Class_Clone_Ui.prototype.change_data_to_copy = function(){
    this.changeMode('mode_normal', 'from change_data_to_copy');
    $('#div0').hide();
    $('#div1').hide();
    $('#div2').hide();
    $('#div_first_question').show();
    this.init_font_second_answer();
    this.init_font_third_answer();
    $('#clone_'+this.tabCounter+'object_id').val('');
    this.show_div_bottom();
};
// reinit Query box
js_Class_Clone_Ui.prototype.init_font_third_answer = function(){
    
    $('#font_third_answer').html( Oview.get_html_to_chose_object_id_3(this.CONST_PERSO_QUERY_START, this.perso_query_end) );
    
    $('#a_change_ids_when_sql').click( {'object_js_Class_Clone_Ui' : this }, function(event){
        var Othis = event.data.object_js_Class_Clone_Ui;
        Othis.change_data_to_copy();
    });
    $('#real_third_answer').html('');
    $('#font_third_answer').show();
    reset_jquery_styles();
    // Many IDs chosen
    $('#button_test_query').click( {'object_js_Class_Clone_Ui' : this }, function(event){
        var Othis = event.data.object_js_Class_Clone_Ui;
        var url = pos + Opages.clone_data_get_ids.php_url;// there is a button for for users to TEST their QUERY !!!
        var sql = /*$('#user_query_start').html() + */ $('#end_of_perso_query').val();
        $('#clone_' + Othis.tabCounter + 'end_of_perso_query').val( sql );
        Othis.perso_query_end = sql;
        var db_svr_id = $('#clone_'+Othis.tabCounter+'src_db_svr_id').val();
        if(isNaN(db_svr_id) || db_svr_id <= 0){
            showDivAlert('Error : the source database server ID is not recognized : ' + db_svr_id);
            return;
        }
        var post_data = {
            'db_svr_id'        : db_svr_id,
            'db_name'        : $('#clone_'+Othis.tabCounter+'src_db_name').val(),
            'main_table'    : Othis.main_table,
            'primary_key'    : Othis.main_primary_key,
            //'id_to_check'    : selected_id
            'query_where'    : sql
        };
        ///$('#wait_box').html( jsGetCenteredDiv('<h3>Testing query...</h3>'));
        show_central_spinner(); ///$('#wait_box').dialog('open'); 
        $('#confirm_box').load(url, post_data, function(json){
            hide_central_spinner();
            var Othis = event.data.object_js_Class_Clone_Ui;
            Othis.multi_ids_confirmed_by_user(json);
        });
    });
};
// renint choose IDs box
js_Class_Clone_Ui.prototype.init_font_second_answer = function(){
    $('#clone_'+this.tabCounter+'object_id').val('');
    var html_for_select = this.last_list_of_ids === null ? '<option>Loading...</option>' : this.last_list_of_ids;
    
    $('#font_second_answer').html( Oview.get_html_to_chose_object_id_2(this.main_primary_key, html_for_select) );
    
    // Button change when simply click onto ! records to copy and relaise you need many by sql !
    $('#a_change_ids_when_1_record').click( {'object_js_Class_Clone_Ui' : this }, function(event){
        var Othis = event.data.object_js_Class_Clone_Ui;
        Othis.change_data_to_copy();
    });

    $('#real_second_answer').html('');
    $('#font_second_answer').show();
    reset_jquery_styles();
    // 1 ID selected
    $('#select_object_id').change(  {'object_js_Class_Clone_Ui' : this }, function(event){ 
        var Othis = event.data.object_js_Class_Clone_Ui;
        var selected_id = $('#select_object_id').val();
        Othis.success_new_object_id( selected_id, 'real_second_answer');
        $('#font_second_answer').hide();
    });
    // 1 ID entered
    $('#button_object_id_entered').click( {'object_js_Class_Clone_Ui' : this }, function( event ){ 
        var selected_id = $('#input_text_object_id').val();
        var Othis = event.data.object_js_Class_Clone_Ui;
        if( ! isInt(selected_id) ){
            console.log('Error : an integer was expected as ' + Othis.main_primary_key);
        }
        var db_svr_id = $('#clone_'+Othis.tabCounter+'src_db_svr_id').val();
        if(isNaN(db_svr_id) || db_svr_id <= 0){
            showDivAlert('Error : the source database is not recognized : ' + db_svr_id);
            return;
        }
        var post_data = {
            'db_svr_id'        : db_svr_id,
            'db_name'        : $('#clone_'+Othis.tabCounter+'src_db_name').val(),
            'main_table'    : Othis.main_table,
            'primary_key'    : Othis.main_primary_key,
            'id_to_check'    : selected_id
        };
        $.ajax({
            context:this,
            type: "POST",
            url: pos + Opages.clone_data_get_ids.php_url, // check ID entered does exist
            data: post_data,
//            cache: false,
            success: function(back){
                var Othis = event.data.object_js_Class_Clone_Ui;
                if(!check_ajax_response_first_2_chars_is_ok(back,' callback of success_button_object_id_entered')){
        
                    return;
                }
                back = back.substr(2);
                back = JSON.parse(back);
                if( back.error !== ''){
                    showDivAlert(back.error, 'An error 705 has occured :', true);
                }else{
                    if(back.id_really_existed !== 'true'){
                        showDivAlert('Error : the "' + Othis.main_primary_key + '" to ' + Othis.copy_or_del + ' has not been found on the source database.');
                    }else{
                        $('#select_object_id').hide();
                        Othis.success_new_object_id( back.selected_id, 'real_second_answer');
                        $('#font_second_answer').hide();
                    }
                }
            },
            error: ajax_error_handler
        });
    });    
};
js_Class_Clone_Ui.prototype.multi_ids_confirmed_by_user = function(back){
    if(!check_ajax_response_first_2_chars_is_ok(back,' callback of user_sql_confirm_box_loaded')){

        return;
    }
    back = back.substr(2);
    var data_back = JSON.parse(back);
    if(typeof data_back.success === 'undefined'){
        console.log('Error ajax sql has json parts missing data_back = ' + data_back);
        return;
    }
    if(data_back.success !== 'true'){
        showDivAlert('There is an error in your query: ' + data_back.error_msg);
        return;
    }
    var results = data_back.results;//.data;
    var msg =    '<div class="centered"><br><br>' +
                    '<input id="query_cancel_button"  type="button" class="small-button" value="Cancel">';
    var content = '<br><br>No results found';
    var ids;
    var Aids = [];
    if(results.length !== 0){ 
        var nb_records_to_copy = results.length < this.max_nb_entity_to_copy ? results.length : this.max_nb_entity_to_copy;
        content =    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
                    '<input id="query_confirm_button" type="button" class="small-button user_instruction" value="Confirm">' + 
                '<br><br>' + this.copy_or_del + ' of <span class="user_instruction">' + nb_records_to_copy +
                ' </span>records <br><br>from ' + this.main_table + ' having ' + this.main_primary_key + ' = <br><br><span class="user_instruction">';
        for(ids = '', i=0 ; i < nb_records_to_copy ; i++){
            ids += results[i]['ids'] + ', ';
            Aids.push(results[i]['ids']);
        }
        //DEBUG Big NUMBERS for( i=0 ; i < 1000 ; i++)    ids += i + ', ';
        content += ids.substr(0, ids.length-2) +
                '</span>';
    }
    msg += content + '.<br><br>' + '</div>';
    $('#confirm_box').html(msg);
    $('#query_cancel_button').click( function(e){
        $('#confirm_box').dialog('close'); 
    });
    $('#query_confirm_button').click( {'ids' : ids, 'Aids' : Aids, 'object_js_Class_Clone_Ui' : this }, function( event){
        var Othis = event.data.object_js_Class_Clone_Ui;
        Othis.success_new_object_id( event.data.ids, 'font_third_answer');
        $('#confirm_box').dialog('close'); 
    });
    reset_jquery_styles();
    $('#confirm_box').dialog('option', 'title', 'Please confirm IDs to clone :');
    $('#confirm_box').dialog('open'); 
    $('#wait_box').dialog('close');
};
// reinit choose IDs box
js_Class_Clone_Ui.prototype.success_new_object_id = function(new_data_id, html_answer_id){
    $('#clone_' + this.tabCounter + 'object_id').val(            new_data_id );
    $('#' +html_answer_id).html(    this.setRecordIdMessage(    new_data_id ) ); this.addOnChangeObjectIdEvent();
    this.user_has_finished_src_choices();
    reset_jquery_styles();
    switch(html_answer_id){
        case 'real_second_answer':
            $('#div1').show();
            break;
        case 'font_third_answer':
            $('#div2').show();
            break;
        default:alert('error prog case nok in success_new_object_id:'+html_answer_id);
    }
};
js_Class_Clone_Ui.prototype.setRecordIdMessage = function(records_string){
    records_string = records_string + ''; // force string conversion !!!
    if( typeof records_string !== 'string'){
        console.log('Error mate :records_string = '+records_string + typeof records_string);
        return 'Pb here....';
    }
    if( records_string.substr(-2) === ', '){
        records_string = records_string.substr(0, records_string.length -2);
    }
    var Arecords = records_string.split(',');
    var nb = Arecords.length < this.max_nb_entity_to_copy ? Arecords.length : this.max_nb_entity_to_copy;
    this.objectIdMessage = nb + ' record' + (nb > 1 ? 's' : '') + ' from ' + this.main_table + ' to ' + this.copy_or_del +
            (nb === 1 ? ': ' + Arecords[0] : '') + '.' +
            Oview.getLinkToChange('a_change_ids_chosen');
            
    return this.getObjectIdMessage();
};
js_Class_Clone_Ui.prototype.getObjectIdMessage = function(){
    return this.objectIdMessage;
};

js_Class_Clone_Ui.prototype.addOnChangeObjectIdEvent = function(){
    $('#a_change_ids_chosen').click( {'object_js_Class_Clone_Ui' : this }, function(event){
        var Othis = event.data.object_js_Class_Clone_Ui;   
        Othis.change_data_to_copy();
    });
};
