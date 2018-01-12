$(document).ready(function(){ 
    GO_tree.prototype.bro2_edit_file = function(html_id, Oevent){
        // because the favorites DB connection are shown as files !
        this.bro2_click_folder(html_id, Oevent);
    };
    GO_tree.prototype.bro2_arrow_clicked = function(html_id, Oevent){
        oEvent=js_event(Oevent);
        var node    = this.Gnodes[html_id];
        if(!node){ return; }
        var path1   = node.shortPath;
        var file1   = node.fileName;
        
        this.set_active_node(html_id);
        if(oEvent && (oEvent == 'from_context_menu' || oEvent.button!=2)){
            if( ! this.is_folder(html_id)){
                console.log('Error that fct is not for files !');
            }else{
                if( ! this.is_node_open(html_id) ){
                    this.publicOpenFolder(html_id);
                }else{
                    this.public_close_node(html_id);
                }            
            }
        }
    };
    GO_tree.prototype.isFavoriteFolder = function(html_id){
        var faves_src  = 'Favorites DB sources';/// 'db_favorite_sources';
        var faves_dest = 'Favorites DB destinations';///'db_favorite_destinations';
        faves_src = this.getHtmlIdFromRelPath( this.get_connection(), faves_src);
        faves_dest = this.getHtmlIdFromRelPath( this.get_connection(), faves_dest);
        return (html_id.substr(html_id.length - faves_src.length) === faves_src || html_id.substr(html_id.length - faves_dest.length) === faves_dest);
    };
    GO_tree.prototype.bro2_click_folder = function(html_id, Oevent){
        this.db_cloner_click_on_folder(html_id, Oevent);
    };
    // ONLY ONE DAD ALLOWED for normal browser !
    GO_tree.prototype.bro2_multi_select_no_limits = function(html_id, unselect_by_user_click){
        //console.log('Multi select '+html_id);
        // check if node exists !
        ///alert(' YES bro2_multi_select_no_limits = function(' +html_id + ', ' + unselect_by_user_click);
        if( typeof this.Gnodes[html_id] === 'undefined'){
            alert('Error cos selecting node not in Gnodes '+html_id);
            return;
        }
        var idx = js_in_array(html_id, this.GA_id_multi_selected);
        // Select / Unselect.
        if(idx === -1){
            //alert('selected for seaving soon ' + html_id);
            this.GA_id_multi_selected.push(html_id);
            this.private_color_node(html_id, Gcolor_selected_nodes);
        }else{
            this.private_UN_color_node(this.GA_id_multi_selected[idx], Gcolor_selected_nodes);
            // no point even removing color when done auto , cos all cleaned up brutally anyway, and pb when removing the only fave while more ajax response coming
            if(typeof unselect_by_user_click !== 'undefined' && unselect_by_user_click === true){
                this.GA_id_multi_selected = removeValueFromArray(this.GA_id_multi_selected, html_id);
            }
        }
//        alert('after multi select, len = ' + this.GA_id_multi_selected.length);
    };
    GO_tree.prototype.db_cloner_click_on_folder = function(html_id, Oevent){            
        var table_name_needed = false;
        var db_svr_id, db_name, nod = this.Gnodes[html_id];
        var table_name = '';
        if(    this.tree_div_name === 'div_pick_a_db_to_analyse' || 
            this.tree_div_name === 'div_pick_a_db_to_explore' ||
            this.tree_div_name === 'div_db_tree_source_for_copying_table'){
            table_name_needed = true;
        }
        // iF YOU CLICKED ON A FAVORITE
        if( -1 !== js_in_array(this.tree_div_name, ['div_pick_a_db_to_analyse', 'div_db_tree_source', 'div_db_tree_destination']) && 
                typeof nod.tag_svr_id !== 'undefined' && nod.tag_svr_id !== ''){
            db_svr_id    = nod.tag_svr_id;
            db_name        = nod.tag_db_name;
        }else{//dbId
            // ELSE : UNLESS DB_SVR_ID of parent IS EMPTY => YOU JUST CLICKED ON A DB SERVER (OR WHATEVER THAT CAN OPEN !)
            var html_id_parent = this.get_parent_node(html_id);
            db_svr_id = (typeof this.Gnodes[html_id_parent] !== 'undefined' &&
                        this.Gnodes[html_id_parent].php_sql_id !== undefined ? this.Gnodes[html_id_parent].php_sql_id : '');
            db_name = js_replace('/','',nod.fileName); 
            
            if( db_svr_id === '' && table_name_needed  && db_name !== ''){
                table_name = db_name;
                html_id_gd_parent = this.get_parent_node(html_id_parent);
                db_svr_id = (typeof this.Gnodes[html_id_gd_parent] !== 'undefined' &&
                            this.Gnodes[html_id_gd_parent].php_sql_id !== undefined ? this.Gnodes[html_id_gd_parent].php_sql_id : '');
                db_name = js_replace('/', '', this.Gnodes[html_id_parent].fileName); 
            }
            if(db_svr_id === '' || (table_name_needed && (db_name === '' || table_name === ''))){
                ///a_lert('Yes opening html_id= '+html_id + '\n db_svr_id=' + db_svr_id + ' and db_name = ' + db_name);
                this.publicOpenFolder(html_id);
                return;
            }else{
                ///a_lert('OH NO NOT AGAIN VALIDATED html_id= '+html_id + '\n db_svr_id=' + db_svr_id + ' and db_name = ' + db_name);
            }
        }
        
        if( typeof sql_file_id == 'undefined'){
            sql_file_id = '';
        }
        // Return if multi_slection allowed.
        if( -1 !== js_in_array(this.tree_div_name, ['div_db_tree_destination','div_favorites_dbs']) ){
            var selected_or_unselected = this.bro2_multi_select_no_limits(html_id, true);
            if( this.tree_div_name == 'div_favorites_dbs' || G('real_multiple_destinations') && G('real_multiple_destinations').checked){
                return;
            }
        }
        // UNLESS new entity creation OR add_fk_tree , validate selection now
        if( -1 !== js_in_array(this.tree_div_name, ['div_db_tree_source','div_db_tree_destination']) ){
            this.GA_id_multi_selected[0] = html_id;
            this.copy_entity_db_chosen();
            return;
        }
        // ONLY new entity creation AND add_fk_tree are being processed below:
        var debug_mode_wizard_adding_fks    = true;
        var post_data = {
            db_svr_id        :    db_svr_id,
            db_name            :    db_name,
            table_name        :    table_name
        };
        var action = '';
        switch(this.tree_div_name){
            case 'div_pick_a_db_to_add_fks':    
                action = Opages.fk_wizard.php_url;
                break;
            case 'div_pick_a_db_to_add_manually_fks':
                action = Opages.fk_by_hand.php_url;
                break;                
            case 'div_pick_a_db_to_analyse':
                action = Opages.create_entity.php_url;
                post_data.force_analyse = 'true';
                break;
            case 'div_pick_a_db_to_explore':                // individual fct set below
            case 'div_db_tree_source_for_copying_table':    // individual fct set below
            case 'div_db_tree_destination_for_copying_table':    // individual fct set below
                break;
            default: 
                alert('Error_A div not valid:'+ this.tree_div_name);
                return;
        }
        if( typeof debug_mode_entity_creation === 'undefined'){
            debug_mode_entity_creation = false;
        }
        if( typeof debug_mode_wizard_adding_fks === 'undefined'){
            debug_mode_wizard_adding_fks = false;
        }
        /*if( 0 ){//}&& (debug_mode_entity_creation        && this.tree_div_name === 'div_pick_a_db_to_analyse') || 
            //(debug_mode_wizard_adding_fks    && this.tree_div_name === 'div_pick_a_db_to_add_fks')){
            action = js_replace('../' , '', action);
            post_data.tab_counter = 4;
            post_data.debug = 'true';
            // convert post_data into html_form in order to submit it for real, no ajax for debug mode !
            var html = '<form id="form_to_debug" action="' + pos + action + '">';    
            for(var i in post_data){
                html += '<input type="text" name="' + i + '" value="' + post_data[i] + '">';
            }
            html += '<form>';
            $('body').append( html );
            alert('FORM BEING SUBMITTED< BE PATIENT !!!! go debug !!!'+this.tree_div_name + ' - action = ' + pos + action + $('#form_to_debug').html());
            $('#form_to_debug').submit();
            //$.post(pos + action, post_data);
            return;
        }else{ */
            // post_data SENT by ajax !
            post_data.ajax = 'true';
            var html_start, html_end; 
            switch(this.tree_div_name){
                
                case 'div_db_tree_source_for_copying_table':
                    this.source_for_copying_table_so_show_destination_servers(post_data);
                    break;
                case 'div_db_tree_destination_for_copying_table':
                    this.destination_for_copying_table_so_show_options(post_data);
                    break;
                case 'div_pick_a_db_to_explore':
                    this.get_data_from_server_for_db_explorer(post_data);
                    break;
                case 'div_pick_a_db_to_add_manually_fks':    
                    html_start ='<div class="center" style="height:97%; overflow:auto;">'+
                                        '<br>'+
                                        '<fieldset class="fieldset">'+
                                            '<legend class="legend">Foreign Key Manually</legend>';
                    html_end =                '<br><br>'+
                                        '</fieldset>'+
                                    '</div>';
                    $('#html_content_tab_tab_fk_wizard').html('<br><br><br><div class="centered">Loading list of columns...</div>');
                    show_central_spinner();
                    $.post(Opages.fk_by_hand.php_url, post_data, function(data){
                        $('#html_content_tab_tab_fk_by_hand').html(html_start + data + html_end);
                        hide_central_spinner();
                    });
                    break;
                case 'div_pick_a_db_to_add_fks':
                    html_start    = '<div class="center" id="div_fk_wizard_container" style="height:97%; overflow:auto;">';
                    html_end    = '</div>';
                    var wait_msg = '<br><br><br><div class="centered">Please wait, foreign keys wizard is loading...</div>';
                    $('#html_content_tab_tab_fk_wizard').html(html_start + wait_msg + html_end);
                    OfkWizard.setDetails(post_data.db_svr_id, post_data.db_name);
                    OfkWizard.go_to_step_2_question_idx_equal(1);
                    break;
                case 'div_pick_a_db_to_analyse':
                    $('#html_content_tab_tab_create_entity').html('<br><br><div class="centered">Please wait, the new entity is being created...</div>');
                    show_central_spinner();        
                    $('#html_content_tab_tab_create_entity').load( Opages.entity_refresh.php_url, post_data, function(data){ 
                        hide_central_spinner();
                        if(check_ajax_response_first_2_chars_is_ok(data,'call back create_entity')){
                            data = data.substr(2);
                            var expected = Amenu_labels.OTO_TEST_INPUT_TEXT_BACK_FROM_ANALYSE;
                            if(data.substr(0, expected.length) !== expected){
                                alert('error prog because data = '+Adata + ' not likke expected '+expected);
                                return;
                            }
                            var new_entity_ready_id = data.substr(expected.length, data.length - expected.length - 2);
                            // REmove current tab
                            removeTab('html_content_tab_tab_create_entity', 'html_header_tab_tab_create_entity');
                            // Open a new tab using new entity_ready_id === Adata[1]
                            addStaticTab(false, Opages.entity_edit, new_entity_ready_id , table_name);
                            refresh_html_select_entities_to_clone();
                            addStaticTab(true, Opages.entities_list ); // REfresh entity list (if already opened though...)
                        }
                    });
                    break;
                default: alert('ErrorB div not valid:'+ this.tree_div_name);
            }
        //}
    };
    // SUBMIT FAVORITE src or dest nothing else !!!!!
    GO_tree.prototype.submit_multi_db_choices = function(source_or_destination){
        /* NOT for SOURCE FAVORITE !!! if(this.GA_id_multi_selected.length === 0){
            showDivAlert('You must select at least one destination database.');
            return;
        }*/
        var new_fave_label = ''; var old_fave_label = '';
        if(this.tree_div_name === 'div_favorites_dbs'){
            new_fave_label    = $('#favorite_label_edited').val();
            old_fave_label    = $('#old_favorite_label_edited').val();
            if(new_fave_label === old_fave_label){
                old_fave_label = '';
            }
        }else{
            new_fave_label = $('#input_new_favorite_name' + source_or_destination).val();
        }
        if(new_fave_label === '' || new_fave_label === null){
            showDivAlert('Please enter a name for this favorite ' + source_or_destination + ' DB.');
            return;
        }
        var Adatas = this.getValidatedDbsReadyToPost(source_or_destination, false);// UNvalidated OK for favorites
        ///dump(Adatas);
        if(!Adatas || !Adatas[0] || Adatas[0] === ''){
            showDivAlert('Please select at least favorite DB before saving.');
            return;
        }
        var db_svr_id    = Adatas[0];
        var db_name        = Adatas[1];
        var post_action = 'page_ajax_save_favorite_db';
        //show_central_spinner();
        $('#div_to_name_fav_db_' + source_or_destination).slideUp();
        this.source_or_destination = source_or_destination; // DOES WORK in Chrome !!! to pass argument to the callback, thanks to the context though !!
        $.ajax({
            context: this,
            type: "post",
            url: post_action,
            data :{        "db_svr_id"                :    db_svr_id,
                        "db_name"                :    db_name,
                        "favorite_label"        :    new_fave_label,
                        "old_favorite_label"    :    old_fave_label,
                        "src_or_dest"            :    source_or_destination
            },
            success: this.exeSuccess
        });
    };
    // callback after saving favorite
    GO_tree.prototype.exeSuccess = function(data){
        if(check_ajax_response_first_2_chars_is_ok(data,' callback after saving favorite ')){
            var tree_to_refresh_id, tree_to_refresh_obj;
            // EDITING EXISTING FAVE (destination only though)
            if(this.tree_div_name === 'div_favorites_dbs'){
                varInTab[ this.tabCounter ].GO_js_tree_edit_fave_dest = null;
                //$('#edit_destination_faves').dialog('close'); BUG cannot call dialog before initialisation ????
                // Refresh Main cloning screen second tree to show new favorite name in case it was changed
                tree_to_refresh_id = 'div_db_tree_destination';
                tree_to_refresh_obj = varInTab[ this.tabCounter ].GO_js_tree_db_destination;
                var html = '';
                html += '<div class="centered"><br><br><h2 class=\"ui-corner-all\">Saved ;)</h2><br><br>';
                html += '    <input type=\"button\" value=\"Close dialog box\" id=\"button_close_edit_fave\">';
                html += '</div>';
                $('#edit_destination_faves').html(html);
                $('#button_close_edit_fave').click( function(){
                    $('#edit_destination_faves').dialog('close');
                });
            }else{ // NEW FAVES HAS BEEN ADDED
                tree_to_refresh_id = this.tree_div_name;
                tree_to_refresh_obj = this;
                //alert('Yep fave src saved');
                $('#div_to_name_fav_db_' + this.source_or_destination).delay(1000).html('<br><br><h2 class="ui-corner-all">Saved ;)</h2>').delay(1000).fadeOut();
            }
            tree_to_refresh_obj.public_close_node(            tree_to_refresh_id + '_ideTreeId_root' );
            tree_to_refresh_obj.db_cloner_click_on_folder(    tree_to_refresh_id + '_ideTreeId_root', '' );
            $('#div_to_name_fav_db_' + this.source_or_destination).remove();
            $('body').append('<input type="hidden" id="div_to_name_fav_db_' + this.source_or_destination + '" value="' + 'Saved ;)' + '">');
        }
    };
    
});
