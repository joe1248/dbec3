function init_js_in_entity_list(tabNumber) {
    //alert(' yes in init_js_in_entity_list tabNumber= ' + tabNumber);
    var Aentities = varInTab[tabNumber].my_json;
    //dump(Aentities);
    var html = '', info = '';
    for( var i=0 ; i < Aentities.length ; i++) {
        info = '[table]' +
                    '[tr][td]From server    [/td][td]&nbsp;[/td][td]' + Aentities[i].connection_name + '[/td][/tr]' +
                    '[tr][td]DB                [/td][td]&nbsp;[/td][td]' + Aentities[i].database_name   + '[/td][/tr]' +
                    '[tr][td]Main table        [/td][td]&nbsp;[/td][td]' + Aentities[i].main_table_name + '[/td][/tr]' +
                '[/table]';

        html += 
            '<tr>' +
            '    <td>' + Aentities[i].entity_ready_name + '</td>' +
            '    <td><input type="button" value="?"        title="' + info + '" class="small-button jqtooltip"></td>' +
            '    <td><input type="button" value="Clone Data"    html_entity_id="' + Aentities[i].entity_ready_id + '" html_entity_label="' + Aentities[i].entity_ready_name + '" class="small-button button_clone_data"></td>' +
            '    <td><input type="button" value="Edit"        html_entity_id="' + Aentities[i].entity_ready_id + '" html_entity_label="' + Aentities[i].entity_ready_name + '" class="small-button button_entity_edit"></td>' +
            '    <td><input type="button" value="Refresh"    html_entity_id="' + Aentities[i].entity_ready_id + '" html_entity_label="' + Aentities[i].entity_ready_name + '" class="small-button button_entity_refresh"></td>' +
            '    <td><input type="button" value="Delete"        html_entity_id="' + Aentities[i].entity_ready_id + '" html_entity_label="' + Aentities[i].entity_ready_name + '" class="small-button button_entity_delete"></td>';
        html += '</tr>';
    }
    
    // Render
    $('.html_example').html(html);$('.html_example').attr('class', '');
    
    reset_jquery_styles();
    $('#div_entities_list').fadeIn();
    $('#entity_list_button_create_entity').click( function(){        addStaticTab(false, Opages.create_entity        );        });
    $('.button_clone_data'      ).click( function(){ addStaticTab(false, Opages.clone_data_ui, $(this).attr('html_entity_id'), $(this).attr('html_entity_label') );    });
    $('.button_entity_edit'     ).click( function(){ addStaticTab(false, Opages.entity_edit  , $(this).attr('html_entity_id'), $(this).attr('html_entity_label') );    });
    $('.button_entity_refresh'  ).click( function(){ 
        show_central_spinner();
        addStaticTab(false, Opages.entity_refresh, $(this).attr('html_entity_id'), $(this).attr('html_entity_label') );    
    });
    $('.button_entity_delete'    ).click( function(){ delete_user_file($(this).attr('html_entity_id'),'7db_entity_confirmed',true);});
    $('.jqtooltip').tooltip({ 
        content: function(callback) { 
            //return js_replace('|', '<br />', $(this).prop('title'));
            return js_replace('[', '<', js_replace(']', '>', $(this).prop('title')));
        }
    });
}
