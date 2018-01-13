//? ENTITIES_EDIT 1_B  JS to init both hierarchies : tables and fields

// Load edit entity Step2 and 3 (child tables tree + fields list)
function init_js_in_edit_one_entity(tab_id){//} , entity_id ){
    //alert('Yes init_js_in_one_edit_entity !!! tab_id = ' + tab_id);// + ' and entity_id =  + entity_id');
    var my_entity = varInTab[tab_id].my_json[0];
    //dump(my_entity);
    var entity_id = my_entity.entity_ready_id;
    $('#button_clone_edited_entity_'+ tab_id).attr('html_entity_id', entity_id);
    G('input_edit_entity_' + tab_id + '_entity_ready_id').value = entity_id;
    G('input_edit_entity_' + tab_id + '_entity_label').value = my_entity.entity_ready_name;
    $('#span_edit_entity_' + tab_id + '_entity_server').html(my_entity.connection_name);
    $('#span_edit_entity_' + tab_id + '_entity_database').html(my_entity.database_name);
    reset_jquery_styles();
    $('#table_edit_entity_' + tab_id).fadeIn();
    add_events_to_welcome_page_clone_data_buttons();/// NEEDED HERE ??? WHY ?? because all button_clone_data  are called the same so reusing same event 
    $('#button_foreign_keys_wizard_' + tab_id).click( function(){    
        //addStaticTab(false, Opages.fk_wizard, '', '', '&db_svr_id=" . $here->get_db_svr_id() . "&db_name=" . $here->get_db_name() . "');
    });
    $('#button_foreign_keys_manually_' + tab_id).click( function(){
        //addStaticTab(false, Opages.fk_by_hand, '', '', '&db_svr_id=" . $here->get_db_svr_id() . "&db_name=" . $here->get_db_name() . "');
    });
    // Button to open extra children fielset
    $('#button_to_open_div_extra_table_container').unbind().click( function(){
        if($('#button_to_open_div_extra_table_container').val() === 'Open'){
            $('#div_extra_table_container').slideDown();
            $('#button_to_open_div_extra_table_container').val('Close');
        }else{
            $('#div_extra_table_container').slideUp();
            $('#button_to_open_div_extra_table_container').val('Open');
        }
    } );
    $('#div_extra_table_container').slideUp(1500).delay(4000);
    
    // STEP_2 : GET CHILDREN TABLES
    $('.div_edit_entity_select_tables_container_loader').show();
    $('#div_edit_entity_select_tables_container').hide();
    $('.div_edit_entity_anomyze_container_loader').show();
    $('#div_edit_entity_anomyze_container_' + tab_id).hide();

    $.get( Opages.entity_edit_two.php_json_url    + entity_id + '&tab_counter=' + tab_id, function (back){
        //alert('no erro syntax bingo !' + data);
        if(!check_ajax_response_first_2_chars_is_ok(back,' callback of entity_edit_two')){

            return;
        }
        back = back.substr(2);
        var backEndData = JSON.parse(back);
        //dump(backEndData);
        var Gactivate_also_root=false; 
        var Groot_label = backEndData.main_entity.table;
        var newNodesFromPHP = backEndData.main_entity;
        /*var div_id = 'js_only_tree_main_entity_' + tab_id;
        $('.js_only_tree_main_entity_X').attr('id',div_id);*/
        varInTab[tab_id].GOtree_step2_childs = new GOpureJsTree('js_only_tree_main_entity_' + tab_id, 'GOtree_step2_childs', tab_id, '["icon_table"]');
    //    alert('ok varInTab[' + tab_id + '].GOtree_step2_childs is defiined');
        varInTab[tab_id].GOtree_step2_childs.js_only_tree_initiliase(newNodesFromPHP, Groot_label, true, true, false);
        
            $('#div_edit_entity_select_tables_container').slideDown(1500);//.delay(200);
            $('.div_edit_entity_select_tables_container_loader').hide(1500);
            $('.div_edit_entity_select_tables_container_loader').hide().delay(1500);    // just in case cos often missed...
            
            //$('.div_edit_entity_anomyze_container_loader').hide(1500);
            //$('.div_edit_entity_anomyze_container_loader').hide(1500).delay(1500);
        
        // Setting grey background color on tables which are excluded from cloning (SKIPPED tables)
        if (backEndData.excluded_tables.length) {
            varInTab[tab_id].GOtree_step2_childs.AnodesToClose = backEndData.excluded_tables;
            setTimeout( function(){ varInTab[tab_id].GOtree_step2_childs.close_already_unselected();},100);
        }
        
        // Setting the value of the select field used to limit number of records per parent records cloned.
        if (Object.keys(backEndData.limits_per_table).length) {
            varInTab[tab_id].GOtree_step2_childs.AnodesToLimit = backEndData.limits_per_table;
            setTimeout( function(){ varInTab[tab_id].GOtree_step2_childs.set_limits_in_selects();},100);
        }

        // load ALL possible extra tables
        if (Object.keys(backEndData.extra_tables_possible).length) {
            varInTab[tab_id].GOtree_step2_childs.AextraTablesPossible = backEndData.extra_tables_possible;
            if (Object.keys(backEndData.extra_tables_decisions).length) {
                varInTab[tab_id].GOtree_step2_childs.AextraTablesDecisions = backEndData.extra_tables_decisions;
            } else {
                varInTab[tab_id].GOtree_step2_childs.AextraTablesDecisions = [];
            }
            setTimeout( function(){ varInTab[tab_id].GOtree_step2_childs.setUpSelectExtraTablesPossible();},100);
        } else {
            $('.tr_for_form_extra_tables_decisions_' + tab_id).fadeOut().remove();
        }
    });
    // STEP_4 : ANOMIE = DE-IDENTIFY
    $.get( Opages.entity_edit_quatre.php_json_url + entity_id + '&tab_counter=' + tab_id, function (back){
        
        ///http://stackoverflow.com/questions/1406537/handling-errors-in-jquery-getscript
        
        $(document).ajaxError(function(e, xhr, settings, exception) {
            console.log(exception + 'error in: ' + settings.url + ' \n'+'error:\n' + exception );
        });
        if(!check_ajax_response_first_2_chars_is_ok(back,' callback of entity_edit_quatre')){

            return;
        }
        back = back.substr(2);

        var backEndData = JSON.parse(back);
        //dump(backEndData);
        varInTab[tab_id].GOtree_step4_fields = new Obfuscation_js_class(tab_id);
        varInTab[tab_id].GOtree_step4_fields.AfieldsTypes = backEndData.AsrcFields;
        varInTab[tab_id].GOtree_step4_fields.AnodesToSelect = backEndData.Afields_obfuscated_well;
        setTimeout( function(){ varInTab[tab_id].GOtree_step4_fields.select_at_initialisation_fields_to_obfuscate(); },100);
        
        setTimeout( function(){ $('#button_save_edited_entity_' + tab_id).parent().show(); },200);
        //alert('Save shown');
        // BUTTON SAVE EVENT
        $('#button_save_edited_entity_' + tab_id).unbind().click( function(){ save_entity(tab_id); } );
        $('.html_select_extra_table_' + tab_id).unbind().change( function(){ save_entity(tab_id); } );
        
        //$.getScript(Opages.entity_edit_quatre.js_url, function (back){ 
        $('#div_for_select_fields_to_obfuscate_' + tab_id).html(backEndData.htmlSelectOfFields);
        $('#div_for_select_fields_to_obfuscate_' + tab_id).slideDown(1500);
        
        $('#div_for_select_fields_to_obfuscate_' + tab_id).find('select').change(function(){
        //$('#select_new_field_to_obfuscate_' + tab_id).change(function(){
            var val = $(this).val();
            if (val !== '') {
                var table = val.substr(0, val.indexOf('#'));
                var field = val.substr(val.indexOf('#')+1);
                alert('New field to obfuscate ' +table + ' :: ' + field);
                /*if (0) {
                    if( typeof varInTab[tab_id] === "undefined"){
                        varInTab[tab_id] = {};
                    }            
                    varInTab[tab_id].GOtree_step4_fields = new GOpureJsTree('js_only_tree_fields_to_obfuscate_'+tab_id, 'GOtree_step4_fields', tab_id, '["icon_table"]');
                }*/
                var object_fields_js = varInTab[tab_id].GOtree_step4_fields;
                object_fields_js.add_new_fields_to_obfuscate(object_fields_js, table, field);
                $(this).find('option:selected').remove();
            }
        });
        //$('#js_only_tree_fields_to_obfuscate_' + tab_id).hide();
        $('#div_edit_entity_anomyze_container_' + tab_id).slideDown(1500);
        $('.div_edit_entity_anomyze_container_loader').hide(1500);
        $('.div_edit_entity_anomyze_container_loader').hide().delay(1500);
        //});
    });
    
    
    reset_jquery_styles();

    setTimeout( function(){ $('#table_edit_entity_' + tab_id).fadeIn('');}, 300);
}
//? OBFUSCATION_3_save_0 : Compile values of obfuscated fields.
function get_obfuscated_fields_params(tab_id){
    var COLUMN_SEPARATOR = '/%/';
    var Anodes_opened_4 = [];                                                                                /**DEV_2016_05_19**/
    if (!G('form_for_obfuscated_fieds_' + tab_id)) {
        console.log('Error cos form_for_obfuscated_fieds_' + tab_id + ' not found');    
        return [];
    }
    var one_field, names_end, nb_form_children = G('form_for_obfuscated_fieds_' + tab_id).children.length;
    for(var i =  0; i < nb_form_children ; i++){
        names_end = i + '_' + tab_id;
        one_field = '';
        var table = $('input[name=param_obfuscated_fields__table_'        + names_end +']').val();
        one_field += table + COLUMN_SEPARATOR;
        var field = $('input[name=param_obfuscated_fields__field_'        + names_end +']').val();
        one_field += field + COLUMN_SEPARATOR;
        var choice1 = $('select[name=select_if_copy_skip_or_obfuscate_'    + names_end +']').val();
        one_field += choice1+ COLUMN_SEPARATOR;
        var saved_method;
        if (js_in_array(choice1, ['obfuscate','anonymise']) !== -1) {
            switch (choice1) {
                case 'obfuscate':
                    saved_method = $('select[name=select_obfuscation_method_'        + names_end +']').val();
                    break;
                case 'anonymise':
                    saved_method = $('select[name=select_anonymisation_method_'        + names_end +']').val();
                    break;
            }
            one_field += saved_method + COLUMN_SEPARATOR;
            // Find out names of other fields needed
            var easy_type = varInTab[tab_id].GOtree_step4_fields.AfieldsTypes[table][field]['EASY_TYPE'];
            var options_for_obfuscation = Aobfuscation_options[easy_type];
            for(var j=0 ; j < options_for_obfuscation.length ; j++){
                if (saved_method === options_for_obfuscation[j].method){
                    one_field += return_param_values_for_one_method(options_for_obfuscation[j], COLUMN_SEPARATOR, names_end);
                    break;
                }
            }
        }
        //alert('one_field = ' + one_field + '\ninput[name=param_obfuscated_fields__table_'+ names_end +']');
        // not valid param name :Anodes_opened_4.push({'param_obfuscated_fields_'+i : one_field});
        Anodes_opened_4.push(one_field);
    }
    ///alert('Ready to save :');    dump(Anodes_opened_4);
    return Anodes_opened_4;
}
function return_param_values_for_one_method(one_method_param, COLUMN_SEPARATOR, names_end){
    var one_field = '';
    var Aother_fields_needed = [];
    if (typeof one_method_param.needed === 'undefined') {
        Aother_fields_needed = [];
    } else {
        Aother_fields_needed = one_method_param.needed.split(',');
    }
    for(k=0 ; k < Aother_fields_needed.length ; k++){
        if( typeof one_method_param['param' + (k+1)] === 'undefined') {
            alert(one_field + 'Errorprog cos options_for_obfuscation[' + j + '][param' + (k+1) + '] does not exist.');
            /// dump(one_method_param);                    dump(Aother_fields_needed);
            break;
        }
        ///alert('Extra field name = '+Aother_fields_needed[k] + ' and extra field type : ' + one_method_param['param' + (k+1)].html_type);
        var obj, nb, html_type = one_method_param['param' + (k+1)].html_type;
        switch (html_type) {
            case 'hidden':
            case 'input':
                obj = $('input[name=' + Aother_fields_needed[k] + '_' + names_end +']');
                nb = obj.length;
                if(nb > 1){
                    alert('Error prog cos '+ nb + ' hidden or input with name=' + Aother_fields_needed[k] + '_' + names_end +'] have been detected');
                }
                var one_input_value = obj.val() + COLUMN_SEPARATOR;
                //console.log('get value for input text = input[name=' + Aother_fields_needed[k] + '_' + names_end +'] == ' + one_input_value);
                one_field += one_input_value;
                break;
            case 'select':
                obj = $('select[name=' + Aother_fields_needed[k] + '_' + names_end +']');
                nb = obj.length;
                if(nb > 1){
                    alert('Error prog cos '+ nb + ' select with name=' + Aother_fields_needed[k] + '_' + names_end +'] have been detected');
                }
                one_field += obj.val() + COLUMN_SEPARATOR;

                /**** -------------------- RECURSITY CALL START HERE --------------------------*/
                var config_select_options_array = one_method_param['param' + (k+1)]['options'];
                var selected_value = obj.val();
                for (var m = 0 ; m < config_select_options_array.length ; m++){
                    if (selected_value === config_select_options_array[m]['method']){
                        // Find out names of other fields needed
                        one_field += return_param_values_for_one_method(config_select_options_array[m], COLUMN_SEPARATOR, names_end);
                    }
                }
                /**** -------------------- RECURSITY CALL ENDS HERE --------------------------*/
                break;
            default: alert('Error prog cos HTML type not planned for ' + html_type);
        }
    }
    return one_field;
}


function save_entity(tab_id){
    if(typeof varInTab[ tab_id ].GOtree_step2_childs === 'undefined'){
        console.log('Error cos GOtree_step2_childs objects not defined....');
        return;
    }
    $('#button_save_edited_entity_' + tab_id).parent().hide();
    show_central_spinner();
    
    var Anodes_opened_2 = varInTab[ tab_id ].GOtree_step2_childs.return_array_of_nodes_opened( false );
    
    
    // PERFECT USER CAN SOON chooose a limit on the number of records per tables extracted/transfered.
    varInTab[ tab_id ].GOtree_step2_childs.return_array_of_limits();
    //dump(varInTab[ tab_id ].GOtree_step2_childs.AnodesSelected);
    var node_limits = varInTab[ tab_id ].GOtree_step2_childs.AnodesSelected;
    node_limits = node_limits.substr(0, node_limits.length - 1) + '}';
    //var Anode_limits = $.parseJSON(node_limits);
    //dump(Anode_limits);
    
    /*var Anodes_opened_3 = varInTab[ tab_id ].GOtree_step3_fields.return_array_of_nodes_opened( false );

    var Anodes_opened_3_filtered = [];
    var nb = Anodes_opened_3.length;
    for(var i =  0; i < nb ; i++){
        if( Anodes_opened_3[i].indexOf("_oo_o_oo_") > 0 ){
            Anodes_opened_3_filtered.push( Anodes_opened_3[i] );
        }
    }*/
    // DO YOU REALLY WANT THE PARENT NODES BACK ????
    var Anodes_parents_2 = varInTab[ tab_id ].GOtree_step2_childs.return_array_of_nodes_parents_in_db();
    //jQuery.merge(    Anodes_opened_2 , Anodes_parents_2);
    
    var not_confirmed_main_entity_tables= Anodes_opened_2.join('#'); 
    var mandatory_setting_tables        = Anodes_parents_2.join('#'); 
    //var fields_excluded_from_copy        = Anodes_opened_3_filtered.join('#');

    //? OBFUSCATION_3_save_1 : prepare array_of_obfuscated_fields to be sent by ajax post.
    var Anodes_opened_4 = get_obfuscated_fields_params(tab_id);                                                                        /**DEV_2016_05_19**/
    var array_of_obfuscated_fields        = Anodes_opened_4.join('#');
    var entity_ready_id    = G('input_edit_entity_' + tab_id + '_entity_ready_id').value;
    var name            = G('input_edit_entity_' + tab_id + '_entity_label').value;
    if( name === ''){
        $('#div_user_error').html('Please enter a name before continuing').fadeIn();
        setTimeout( function(){ $('#div_user_error').html('&nbsp;'); }, 4000);
        return;
    }
    var post_data = {
        entity_ready_id                    :    entity_ready_id,
        entity_label                    :    name,
        not_confirmed_main_entity_tables:    not_confirmed_main_entity_tables,
        mandatory_setting_tables        :    mandatory_setting_tables,
        node_limits                        :    node_limits,
        array_of_obfuscated_fields        :    array_of_obfuscated_fields
    };
    
    if( G('form_extra_tables_decisions_' + tab_id) ){
        $('#button_to_open_div_extra_table_container').val('Open');
        var post_data2 = html_form_to_object( 'form_extra_tables_decisions_' + tab_id );
        jQuery.extend(post_data, post_data2);
    }
    var url = pos + 'page_ajax_all?module=entities/save_entity_definition';
    $.ajax({
        type : 'POST', url : url, data : post_data,
        success    : function(data){
            $('#button_save_edited_entity_' + tab_id).parent().show();
            if( !check_ajax_response_first_2_chars_is_ok( data, 'Call back save_entity_definition.')){
                $('#html_font_saved_edited_entity_' + tab_id).html('Saving Error...');
                hide_central_spinner();
                return;
            }
            // Refresh others sreens :
            refresh_general_screens_after_entity_saved();
            
            updateTabTitle( Opages.entity_edit.static_id, entity_ready_id, Opages.entity_edit.static_label + ': ' + name);
            $('#html_font_saved_edited_entity_' + tab_id).html('Update successful&nbsp;&nbsp;&nbsp;&nbsp;');

            // Hide "UPdate successfull" message after 2 seconds
            setTimeout( function(){ $('#html_font_saved_edited_entity_' + tab_id).html('&nbsp;'); }, 2000);

            $('#form_for_obfuscated_fieds_' + tab_id).remove();
            init_js_in_edit_one_entity( tab_id);
            hide_central_spinner();
        }
    });
}
function refresh_general_screens_after_entity_saved(){
    refresh_html_select_entities_to_clone();
    addStaticTab(true, Opages.entities_list ); // REfresh entity list (if already opened though...)
}
/*var isSameNameAlready = function(entity_name, entity_id){
    if(Gcurrent_user == 'autotest'){
        return false;
    }
    var tmp, Aentity_names = [];
    tmp = parent.A7db_entity_confirmed;
    for(var i = 0 ; i < tmp.length ; i++){
        if(tmp[i].sql_id != entity_id){
            Aentity_names.push( tmp[i].label );
        }
    }
    // if same name IS found, return true
    return (-1 !== js_in_array(entity_name, Aentity_names) ) ? true : false;
};*/

/*else{
            if(isSameNameAlready(new_entity_name, new_entity_id)){
                var msg = 'Another entity already exists with that name. <br><br>Please confirm you want to overwrite it ?';
                showDivConfirm( msg, confirmedGoSaveEntity, 'Confirmation before overwrite', false);
                return;
            }else{
                confirmedGoSaveEntity();
            }
        }*/
