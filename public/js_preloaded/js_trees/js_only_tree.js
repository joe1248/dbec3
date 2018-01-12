
/* SPECIFIC DIVs using this : dump simple_select alert Opennin array_ returnParentId  close_already_unselected
        case 'js_only_tree_main_entity':
        case 'js_only_tree_optional_setting_tables':
        case 'js_only_tree_fields_to_exclude':
*/
function GOpureJsTree(tree_div_id, this_object_name, tabCounter, json_icons_per_level){
    this.div_id                = tree_div_id;
    this.this_object_name    = this_object_name; 
    this.Gnodes                = {};
    this.tabCounter            = tabCounter;
    this.AnodesToClose        = [];
    this.AnodesToSelect        = [];
    
    this.AnodesSelected        = null; // To save limits
    this.AnodesToLimit        = [];    // To reload limits
    this.AextraTablesPossible = [];    // To save entity extensions.
    
    this.AfieldsTypes        = [];
    this.idOfActiveNode        = 'NO_SET_YET';
    this.icons_per_level     = $.parseJSON(json_icons_per_level); 
}

$(document).ready(function(){
    GOpureJsTree.prototype.setIdOfActiveNode = function(html_id){
        this.idOfActiveNode = html_id;
    };
    
    GOpureJsTree.prototype.addNewNodeNamed = function( dad_id, node_id, label, path, is_folder, is_parent, extra_info){
        var extra_info = typeof extra_info === 'undefined' ? '' : extra_info;
        if(is_parent){
            console.log('new parent' + node_id);
        }
        var new_node = JSON.parse( 
            '{ "' + node_id + '" : ' +
                            '{        "html_id"        :    "' + node_id + '",' +
                            '        "shortPath"        :    "' + path + '",' +
                            '        "fileName"        :    "' + label + '",' +
                            '        "dad_id"        :    "' + dad_id + '",' +
                            '        "isFolder"        :    "' + is_folder + '",' +
                            '        "extra_info"    :    "' + extra_info + '",' +
                            '        "isParent"        :    "' + (is_parent ? 'true':'false') + '",' +
                            '        "isTrulyChild"    :    "false",' +
                            '        "isOpen"        :    "true",' +
                            '        "children"        :    {}    }' +
            '}' );
        if(this.Gnodes)            jQuery.extend(    this.Gnodes , new_node);
        else                                    this.Gnodes = new_node;
        return new_node;
    };
    GOpureJsTree.prototype.js_only_tree_initiliase = function(newNodesFromPHP, root_label, bool_open_root, bool_open_all, activate_also_root){
        var ii = 0;
        this.root_id            = root_label;
        this.setIdOfActiveNode(  this.root_id );
        this.addNewNodeNamed( 'ROOT_DAD', this.root_id, root_label, '', 'true');
        // convert nodes from php  newNodesFromPHP.fk_tables or for the fields, all the tables from : newNodesFromPHP.tables_to_copy
        switch(this.div_id){
            case 'js_only_tree_of_tables_to_view_data_' + this.tabCounter:                    // convert nodes from php
            case 'js_only_tree_main_entity_' + this.tabCounter:                    // convert nodes from php
                var main_table    = newNodesFromPHP.table;
                var main_childs    = newNodesFromPHP.fk_tables;
                this.convertNodesFromPhp(main_table, main_table, main_childs, main_childs); //;newNodesFromPHP.fk_columns);
                break;
            /*case 'js_only_tree_fields_to_exclude_' + this.tabCounter:            // convert nodes from php
            case 'js_only_tree_fields_to_obfuscate_' + this.tabCounter:            // convert nodes from php
                var main_table    = easyNodesFromPhp.tree_title;
                var main_childs    = easyNodesFromPhp.tables_to_copy;
                this.convertEasyNodesFromPhp(main_table, main_childs);
                break;
            case 'js_only_tree_settings_vs_childs_' + this.tabCounter:            // convert nodes from php
                ///dump(easyNodesFromPhp.fk_tables, 'body', 0);return;
                
                //alert('You need to simplify the php object to merge child and dads !!!, or yet two trees ???!?!!?!');
                var main_table    = newNodesFromPHP.table;
                var main_childs    = newNodesFromPHP.fk_tables;
                this.convertNodesFromPhp(main_table, main_table, main_childs, newNodesFromPHP.fk_columns);
                break;*/
            default : console.log('Error div_id nok ' + this.div_id);
        }
        if(!G(this.div_id)){
            //FOR DEBUG MODE ???  $('body').append('<div id="' + this.div_id + '"></div>');
            console.log('Error prog in initiliase_tree cos div doesnot exists yet :'+this.div_id+' so  (CHECK JS file cahced atched php name !!)');
            return;
        }
        
        // Create the root node only  WARNING to use jquery here will break the last div cos JS timeout to open_rpivate_node not enough for the 3rd requests.
        G(this.div_id).innerHTML = '<ul>' + this.get_node_begin(this.root_id, this.Gnodes[this.root_id]) + '</ul>';
        
        // ONLY Usefull for div tbales to copy in entity edit cos enable posiiton:absolute of the span above the select limits to work !!!!
        $('#' + this.div_id).first().css('position','relative');
        
        // Hide root node when useless
        /*if(        this.div_id === 'js_only_tree_fields_to_exclude_' + this.tabCounter        // HIDE ROOT OF TREE
            ||    this.div_id === 'js_only_tree_fields_to_obfuscate_' + this.tabCounter    // HIDE ROOT OF TREE
            ||    this.div_id === 'js_only_tree_optional_setting_tables'){
            $('#otot_link_' + this.div_id + '_' + this.root_id).hide();
            $('#otot_arrow_' + this.div_id + '_' + this.root_id).hide();
        }*/
        $("#"+this.div_id)        // call `.jstree` with the options object
            .jstree({    // the `plugins` array allows you to configure the active plugins on this instance
                "plugins" : ["themes","html_data"]//,"ui","crrm","hotkeys"]              //,"core" : { "initially_open" : [ "html_folder_atab" ] }
            })
            .bind("loaded.jstree", function (event, data) {})
            .addClass('unselectable');


        if( this.div_id !== 'js_only_tree_optional_setting_tables'){
            //$("#"+this.div_id).addClass('back_color');
        }
        if(bool_open_root){
            switch(this.div_id){
                case 'js_only_tree_main_entity_' + this.tabCounter:                        // OPEN ROOT NODE ON LOADING
                    //setTimeout('varInTab[' + this.tabCounter + '].GOtree_step2_childs.private_open_node("' + this.root_id + '", "' + bool_open_all + '");', 100);
                    setTimeout('varInTab[' + this.tabCounter + '].GOtree_step2_childs.private_open_node("' + this.root_id + '", "' + bool_open_all + '");'+
                        '$(".tables_to_copy_tool_tip").tooltip({'+
                            'position: { my: "left bottom", at: "right top" },'+
                            'show: { effect: "blind", duration: 400, direction:"left" } '+
                        '});'
                    , 100);
                    break;
                case 'js_only_tree_of_tables_to_view_data_' + this.tabCounter:                        // OPEN ROOT NODE ON LOADING
                    setTimeout('varInTab[' + this.tabCounter + '].GOtree_tables_to_view_data.private_open_node("' + this.root_id + '", "' + bool_open_all + '");', 100);
                    if (activate_also_root === true) {
                        // not worknig wothuot timeout... this.add_onclick_events(this.root_id);
                        setTimeout('varInTab[' + this.tabCounter + '].GOtree_tables_to_view_data.add_onclick_events("' + this.root_id + '");', 150);
                    }
                    break;
                /*case 'js_only_tree_optional_setting_tables':
                    //setTimeout('varInTab[' + this.tabCounter + '].GOtree_step3.private_open_node("' + this.root_id + '", "' + bool_open_all + '");', 100);
                    break;*/
                /*case 'js_only_tree_fields_to_exclude_' + this.tabCounter:                // OPEN ROOT NODE ON LOADING
                    //$('#ototo_luli_'+ this.div_id + '_' + this.root_id+' > li').css('background-image','');///'jstree-corral');
                    $('#'+ this.div_id + ' > *').css('background-image','');///'jstree-corral');
                    $('#'+ this.div_id + ' > *').removeClass('*');
                    //setTimeout('function(){varInTab[' + this.tabCounter + '].GOtree_step3_fields.private_open_node("' + this.root_id + '", "' + bool_open_all + '");}', 100);
                    setTimeout('varInTab[' + this.tabCounter + '].GOtree_step3_fields.private_open_node("' + this.root_id + '", "' + bool_open_all + '");', 100);
                    // CAused : bug something not ready...
                    //varInTab[this.tabCounter].GOtree_step3_fields.private_open_node(this.root_id, bool_open_all);
                    break
                case 'js_only_tree_fields_to_obfuscate_' + this.tabCounter:                // OPEN ROOT NODE ON LOADING
                    //$('#ototo_luli_'+ this.div_id + '_' + this.root_id+' > li').css('background-image','');///'jstree-corral');
                    $('#'+ this.div_id + ' > *').css('background-image','');///'jstree-corral');
                    $('#'+ this.div_id + ' > *').removeClass('*');
                    setTimeout('varInTab[' + this.tabCounter + '].GOtree_step4_fields.private_open_node("' + this.root_id + '", "' + bool_open_all + '");', 100);
                    //extend
                    // WORKS TO REMOVE ALL IMAGE BUT HARD TO SELECT...setTimeout("$('#" + this.div_id + "').removeClass('jstree-corral');", 600);
                    // TRY SIMPLY TO COVER THE LINE WITH ANTHER DIV SHOULD BE EASY !!! WELL OR MAYBE NOT ???
                    break;
                case 'js_only_tree_settings_vs_childs_' + this.tabCounter:                    // OPEN ROOT NODE ON LOADING
                    //$('#ototo_luli_'+ this.div_id + '_' + this.root_id+' > li').css('background-image','');///'jstree-corral');
                    $('#'+ this.div_id + ' > *').css('background-image','');///'jstree-corral');
                    $('#'+ this.div_id + ' > *').removeClass('*');
                    setTimeout('varInTab[' + this.tabCounter + '].GOtree_step4_settings_vs_childs.private_open_node("' + this.root_id + '", "' + bool_open_all + '");', 100);

                    break;*/
                default : alert('Error PROG : div_id not recognized !!! ' + this.div_id);
            }
        }else{
            alert('No bool to open nodes');
        }
    };

    GOpureJsTree.prototype.getListOfParentTables = function(table_name, table_dads) {
        var one_parent = '', parents_html = new Array();
        var table_dads_nb = table_dads.length;
        for (var j = 0 ; j < table_dads_nb ; j++) {
            if (table_dads[j].table === table_name) {
                if (typeof table_dads[j].fk_columns === 'undefined') {
                    break;
                }
                for (var k = 0 ; k < table_dads[j].fk_columns.length ; k++) {
                    one_parent = table_dads[j].fk_columns[k].referenced_table_name;
                    if (js_in_array(one_parent, parents_html) === -1) {
                        parents_html.push(one_parent);
                    }
                }
            }
        }
        if (parents_html.length) {
            parents_html = 'Parent tables : ' + parents_html.join(', ');
        }
        return parents_html;
    };
    GOpureJsTree.prototype.convertNodesFromPhp = function(top_parent_table_name, parent_table_name, table_childrens, table_dads){
        var i, table_name, isFolder, new_node, Anew_childs = false;
        //var child_parent_or_both = 'parent';
        //var child_parent_or_both = 'child';
        var child_parent_or_both = 'both';
        if(child_parent_or_both == 'child' || child_parent_or_both === 'both'){
            if( typeof table_childrens === 'undefined'){
                console.log('Error in convertNodesFromPhp cos table_childrens is null for parent_table_name='+parent_table_name);
                return;
            }
            // ************************************ ADD CHILDREN AS CHILDREN **********************
            var table_childrens_nb = table_childrens.length;
            var real_nb_childs = 0;
            for(i = 0 ; i < table_childrens_nb ; i++){    
                table_name = table_childrens[i].table;
                // skip the parent already known !
                if( table_name === parent_table_name || typeof this.Gnodes[table_name] !== 'undefined'){
                    continue; 
                }
                // ************************************ GET list of dads for that table  **********************
                var parents_html = this.div_id !== 'js_only_tree_main_entity_' + this.tabCounter ? '' : this.getListOfParentTables(table_name, table_dads);
                new_node = this.addNewNodeNamed( parent_table_name, table_name, table_name, parent_table_name + '/', 'false', false, parents_html);
                if(Anew_childs)            jQuery.extend(    Anew_childs , new_node);
                else                                    Anew_childs = new_node;
                real_nb_childs++;
            }
            /*var showParentTables = false;///true;
            if(showParentTables){
                // ************************************ ADD DADS AS CHILDREN TOO **********************
                var table_dads_nb = table_dads.length;
                for(i = 0 ; i < table_dads_nb ; i++){
                    table_name = table_dads[i].referenced_table_name;
                    
                    // No point showing dad WHICH WILL NOT be dupliacted cos no children.. (well nok for flix_file table, innit ??? )
                    if(table_dads[i].nb_childs === 0){
                        continue;
                    }
                    
                    // skip the parent already known !
                    if( table_name === parent_table_name || typeof this.Gnodes[table_name] !== 'undefined'){
                        continue; 
                    }
                    new_node = this.addNewNodeNamed( parent_table_name, table_name, table_name+table_dads[i].nb_childs, parent_table_name + '/', 'false', true);
                    if(Anew_childs)            jQuery.extend(    Anew_childs , new_node);
                    else                                    Anew_childs = new_node;
                    real_nb_childs++;
                }
            }*/
            
            jQuery.extend(this.Gnodes, Anew_childs);                // DOUBLE REFERENCING this one done INSIDE addNewNodeNamed
            if( real_nb_childs ){
                this.Gnodes[parent_table_name].children = Anew_childs;    // DOUBLE REFERENCING 
                this.Gnodes[parent_table_name].isFolder= 'true';
            }
            
            // Now get children of childrens
            for(var i = 0 ; i < table_childrens_nb ; i++){
                if(typeof table_childrens[i].fk_tables !== 'undefined'){
                    var child_table_name        = table_childrens[i].table;
                    var child_table_childrens    = table_childrens[i].fk_tables;
                    if(child_table_childrens.length || table_childrens[i].fk_columns.length){
                        this.convertNodesFromPhp(top_parent_table_name, child_table_name, child_table_childrens, table_childrens[i].fk_columns);
                    }
                } 
            }
        }
    };

    /*************************   NB : RECURSIVITY INFINY whenever a parent and its child HAVE THE SAME ID !!!! ***********/
    //   ===> double block it from ever happening !!! BETTER TO fail with an console.log or an error code in a dialog !!!
    GOpureJsTree.prototype.convertEasyNodesFromPhp = function(root_label, Atable_and_colums){
        var table_name, table_columns, nb_columns, column_name, new_node, Atable_objects = false, Acolumn_objects = false;
        if( typeof Atable_and_colums === 'undefined'){
            console.log('Error in convertEasyNodesFromPhp cos Atable_and_colums is null for parent_table_name='+parent_table_name);
            return;
        }
        var nb_tables = Atable_and_colums.length;
        // LOOP AAA : will add all the 1st level node
        for(var i = 0 ; i < nb_tables ; i++){
            table_name        = Atable_and_colums[i].table_name;
            table_columns     = Atable_and_colums[i].table_columns;
            nb_columns         = table_columns.length;
            var isFolder = 'true'; 
            if(table_columns.length == 0){
                isFolder = 'false';
            }
            new_node = this.addNewNodeNamed( root_label, table_name, table_name, root_label + '/', isFolder);
            if(Atable_objects)            jQuery.extend(    Atable_objects , new_node);
            else                                        Atable_objects = new_node;
        }
        //jQuery.extend(this.Gnodes, Atable_objects);                // DOUBLE REFERENCING this one done INSIDE addNewNodeNamed
        this.Gnodes[root_label].children = Atable_objects;    // DOUBLE REFERENCING 
        // LOOP BBB : will add all the 1st level node
        for(var i = 0 ; i < nb_tables ; i++){
            table_name        = Atable_and_colums[i].table_name;
            table_columns     = Atable_and_colums[i].table_columns;
            nb_columns         = table_columns.length;
                Acolumn_objects = false;
                for(var j = 0 ; j < nb_columns ; j++){
                    column_name = table_columns[j];
                    new_node = this.addNewNodeNamed( table_name, table_name + '_oo_o_oo_' + column_name, column_name, root_label + '/' + table_name + '/', false);
                    if(Acolumn_objects)        jQuery.extend(    Acolumn_objects , new_node);
                    else                                    Acolumn_objects = new_node;
                }
                if(nb_columns != 0 ){
                    this.Gnodes[table_name].children = Acolumn_objects;    // DOUBLE REFERENCING */
                }
        }
    };
    
    GOpureJsTree.prototype.returnParentId = function(html_id){
        return this.Gnodes[html_id].dad_id;
    };
    GOpureJsTree.prototype.returnArrayChildrenId = function(parent_html_id, known_childs){
        if(known_childs === undefined){
            known_childs = [];
        }
        if(!this.Gnodes[parent_html_id]){
            console.log('NOKNOK '+parent_html_id);
            return [];
        }
        var nb_childs = getNbPropertiesInObject( this.Gnodes[parent_html_id].children );
        if(nb_childs){
            for(var html_id in this.Gnodes[parent_html_id].children){
                known_childs.push(html_id);
                known_childs = this.returnArrayChildrenId(html_id, known_childs);
            }
        }
        return known_childs;
    };
    GOpureJsTree.prototype.returnArrayChildrenId_with_select_value = function(parent_html_id, known_childs){
        if(known_childs === undefined){
            known_childs = [];
        }
        if(!this.Gnodes[parent_html_id]){
            console.log('NOKNOK '+parent_html_id);
            return [];
        }
        var nb_childs = getNbPropertiesInObject( this.Gnodes[parent_html_id].children );
        if(nb_childs){
            for(var html_id in this.Gnodes[parent_html_id].children){
                var real_id = 'otot_link_' + this.div_id + '_' +html_id;
                var limit = $('#'+real_id).next().find('select').val();
                this.AnodesSelected[html_id] = html_id + ' # ' + limit;
                //this.AnodesSelected.push(limit);
                //jQuery.merge(    this.AnodesSelected , {'html_id':limit});
                known_childs.push(html_id);
                known_childs = this.returnArrayChildrenId(html_id, known_childs);
            }
        }
        return known_childs;
    };
    GOpureJsTree.prototype.setUpSelectExtraTablesPossible = function() {
        var selectName, Apossible_asso_fathers, html = '<table>';
        for(var extraTableName in this.AextraTablesPossible) {
            Apossible_asso_fathers = this.AextraTablesPossible[extraTableName];
            selectName = 'html_select_extra_table_' + extraTableName;
            html += '<tr><td>Extra entity : <label for="' + selectName + '">' + extraTableName + '</label></td>' +
                '<td><select name="' + selectName + '" class="html_select_extra_table_' + this.tabCounter + '">' +
                    this.returnSelectOptionsForExtraTables(extraTableName, Apossible_asso_fathers) +
                '</td></tr>';
        }
        html += '</table>';
        $('#form_extra_tables_decisions_' + this.tabCounter).html(html);
    };
    GOpureJsTree.prototype.returnSelectOptionsForExtraTables = function(extraTableName, Apossible_asso_fathers) {
        var Aextra_tables_decisions = varInTab[this.tabCounter].GOtree_step2_childs.AextraTablesDecisions;
        var default_choice_value = 'do_not_plug';
        var default_choice_label = 'Do NOT Duplicate';

        var html = "\n" + '<option value="' + default_choice_value + '">' + default_choice_label + '</option>';
        for (var i = 0 ; i < Apossible_asso_fathers.length ; i++) {
            var oneTable = Apossible_asso_fathers[i];
            html += "\n" + '<option value="' + oneTable + '"';
            if (typeof Aextra_tables_decisions[extraTableName] !== ' undefined' &&
                Aextra_tables_decisions[extraTableName] == oneTable
            ) {
                html += ' selected="selected" ';
            }
            html += '>' + oneTable + '</option>';
        }
        return html;
    };
    GOpureJsTree.prototype.set_limits_in_selects = function() {
        for(var html_id in this.AnodesToLimit){
            var limit = this.AnodesToLimit[html_id];
            var real_id = 'otot_link_' + this.div_id + '_' +html_id;
            $('#'+real_id).next().find('select').val(limit);
        }
    };
    GOpureJsTree.prototype.return_array_of_nodes_opened = function( false_if_node_closed ){
        var opened_true = ( typeof(false_if_node_closed) !== 'undefined' && false_if_node_closed === false ? 'false' : 'true' );
        var known_childs = [];
        var selected_childs = [];
        if( this.root_id  == ''){
            console.log('Why  this.root_id  is empty ??');
            return;
        }
        // get all the children of the tree
        for(var html_id in this.Gnodes[  this.root_id ].children){
            known_childs.push(html_id);
            known_childs = this.returnArrayChildrenId(html_id, known_childs);
        }
        // Return names of open ones
        for(var i=0 ; i < known_childs.length ; i++){
            html_id = known_childs[i];
            if( this.Gnodes[html_id].isOpen == opened_true){
                if( this.Gnodes[html_id].isParent === 'false'){
                    selected_childs.push( html_id );
                }
            }
        }
        return selected_childs;
    };
    GOpureJsTree.prototype.return_array_of_nodes_parents_in_db = function( ){
        var known_childs = [];
        var selected_childs = [];
        if( this.root_id  == ''){
            console.log('Why  this.root_id  is empty ??');
            return;
        }
        // get all the children of the tree
        for(var html_id in this.Gnodes[  this.root_id ].children){
            known_childs.push(html_id);
            known_childs = this.returnArrayChildrenId(html_id, known_childs);
        }
        // Return names of open ones
        for(var i=0 ; i < known_childs.length ; i++){
            html_id = known_childs[i];
            if( this.Gnodes[html_id].isParent === 'true'){
                if( this.Gnodes[html_id].isTrulyChild === 'true' ){
                    selected_childs.push( html_id );
                }
            }
        }
        return selected_childs;
    };
    GOpureJsTree.prototype.return_array_of_limits = function(){
        var known_childs = [];
        var selected_childs = [];
        if( this.root_id  == ''){
            console.log('Why  this.root_id  is empty ??');
            return;
        }
        var html_id = this.root_id;
        var real_id = 'otot_link_' + this.div_id + '_' +html_id;
        var limit = $('#'+real_id).next().find('select').val();
        this.AnodesSelected = '{"' +html_id + '":"' + limit + '",';
        // get all the children of the tree
        for(var html_id in this.Gnodes[  this.root_id ].children){
            known_childs.push(html_id);
            known_childs = this.returnArrayChildrenId(html_id, known_childs);
        }
        // Return names of open ones
        for(var i=0 ; i < known_childs.length ; i++){
            html_id = known_childs[i];
            if( this.Gnodes[html_id].isOpen == 'true'){
                if( this.Gnodes[html_id].isParent === 'false'){
                    selected_childs.push( html_id );
                }
            }
        }
        //selected_childs = known_childs;
        // get all the limits of the selected table and its child
        var limits = [];
        var selected_childs_again = [];
        for(var i = 0 ; i < selected_childs.length ; i++){
            var html_id = selected_childs[i];
            var real_id = 'otot_link_' + this.div_id + '_' +html_id;
            var limit = $('#'+real_id).next().find('select').val();
            this.AnodesSelected += '"' +html_id + '":"' + limit + '",';
            //this.AnodesSelected.push(limit);
            //jQuery.merge(    this.AnodesSelected , {'html_id':limit});
            selected_childs_again.push(html_id);
            selected_childs_again = this.returnArrayChildrenId_with_select_value(html_id, selected_childs_again);
        }
    };
    GOpureJsTree.prototype.publicToggleNodeSelection = function(html_id, from_parent_recursively){
        from_parent_recursively = typeof from_parent_recursively === 'undefined' || from_parent_recursively !== true ? false : true;
        if(typeof html_id === 'object'){
            html_id = html_id.data;/// FOR THE ROOT NODE it seems !
        }
        if(this.Gnodes[html_id] && this.Gnodes[html_id].isParent === 'true'){
            var real_id = 'otot_link_' + this.div_id + '_' +html_id;
            if( this.Gnodes[html_id].isTrulyChild === 'false'){
                if(from_parent_recursively ===false){
                    this.Gnodes[html_id].isTrulyChild = 'true';
                }
                $('#'+real_id).css('color','green').delay(1000);
            }else{
                if(from_parent_recursively ===false){
                    this.Gnodes[html_id].isTrulyChild = 'false';
                }
                $('#'+real_id).css('color','red').delay(300);
            }
            return;
        }
        if(this.Gnodes[html_id] && this.Gnodes[html_id].isOpen!=='false'){
            if(        this.div_id !== 'js_only_tree_fields_to_exclude_' + this.tabCounter     // DETECTION OF ON CLICK so call this.simple_select_one_node
                ||  this.Gnodes[ html_id ].isFolder === 'false'){
                this.simple_select_one_node(html_id);
            }else{
                this.Gnodes[html_id].isOpen = 'false';
            }
            if(!this.has_children(html_id)) return;
            if(this.div_id !== 'js_only_tree_fields_to_exclude_' + this.tabCounter){    // Adjustement to publicToggleNodeSelection = function
                var childs = this.returnArrayChildrenId(html_id, []);
                for( var i=0 ; i < childs.length ; i++){
                    if( this.Gnodes[childs[i]].isParent !== 'true'){
                        this.Gnodes[childs[i]].isOpen = 'true';   // Make sure they wiil be toggle to false !!!
                        this.publicToggleNodeSelection(childs[i], true);// true cos recursive so not user based !
                    }
                }
            }
            if(this.div_id !== 'js_only_tree_optional_setting_tables'){
                $('#ototo_luli_'+ this.div_id + '_'+html_id+'').next().slideUp();
            }
        }else{
            //if(this.div_id !== 'js_only_tree_fields_to_exclude_' + this.tabCounter || this.Gnodes[ html_id ].isFolder === 'false'){
                this.simple_UN_select_one_node(html_id);
            //}
            if(!this.has_children(html_id)) return;
            if(this.div_id !== 'js_only_tree_fields_to_exclude_' + this.tabCounter){
                var childs = this.returnArrayChildrenId(html_id, []);
                for( var i=0 ; i < childs.length ; i++){
                    if( this.Gnodes[childs[i]].isParent !== 'true'){
                        this.Gnodes[childs[i]].isOpen = 'false';   // Make sure they wiil be toggle to false !!!
                        this.publicToggleNodeSelection(childs[i], true); // true cos recursive so not user based !
                    }
                }
            }
            if( this.div_id !== 'js_only_tree_optional_setting_tables'){
                $('#ototo_luli_'+ this.div_id + '_'+html_id+'').next().slideDown();
            }
        }
    };
    GOpureJsTree.prototype.js_only_tree_erase_sons = function(html_id){
        if(!this.has_children(html_id) || typeof $('#ototo_luli_'+ this.div_id + '_'+html_id+'').next().html() == 'undefined'){
            return;
        }
        $('#ototo_luli_'+ this.div_id + '_'+html_id+'').next().remove();
    };
    GOpureJsTree.prototype.has_children = function(html_id){
        var nb_childs = getNbPropertiesInObject( this.Gnodes[html_id].children );
        return nb_childs ? true : false;          //return (this.Gnodes[html_id].children.length) ? true : false;  
    };
    GOpureJsTree.prototype.private_open_node = function(html_id, bool_open_all_child){
        //console.log('Openning '+ html_id);
        $('#ototo_luli_'+ this.div_id + '_' + html_id+' :nth-child(2)').addClass('jstree-loading');    
        var dady = html_id;
        var id, back = '', firstLevelChildren = this.Gnodes[dady].children;
    
        for( id in firstLevelChildren){
            if(this.Gnodes[id] === undefined){
                console.log('Error cos '+this.Gnodes[id]+'not defined cos id='+id);
            }
            if(this.Gnodes[id].isFolder == 'true'){
                this.Gnodes[id].isOpen = 'false';// we use that to select the files, and they are all slectetd by default for now
            }
            back += this.get_node_begin( id, this.Gnodes[id]);
        }
        var dady_html_id = 'ototo_luli_'+ this.div_id + '_' + dady;
        if(G(dady_html_id) == null){
            if(!dady || !this.Gnodes[dady] || this.Gnodes[dady] === undefined){
                console.log('ERROR : Not even defined node : dady='+dady);
                return;
            }
            if(this.Gnodes[dady].isOpen !== 'true'){
                console.log('ERROR : Error cos HTML id not found dady='+dady);
                return;
            }else{ 
                console.log('ERROR : Error PARENT NODE WRITTEN AS CLOSED (or deleted if so) ! because node just opened ' + html_id + 'has parent HMTL_id not found : ' + dady_html_id);
            }
            return;
        }
        if(this.Gnodes[dady].isOpen != 'true'){
            this.Gnodes[dady].isOpen = 'true';
        }else{
            // CLOSE NODE As we are REOPENING IT NOW !!
            this.js_only_tree_erase_sons(dady);//temp fix will become permanent ie dduplcate reqest aceoted....
        }
        ///setTimeout("$('#ototo_luli_"+ this.div_id + '_'+dady+"').removeClass('jstree-closed').addClass('jstree-open');",20);// cos if clicked on the arrow, it toggles already in real-time
        $('#ototo_luli_'+ this.div_id + '_'+dady).removeClass('jstree-closed').addClass('jstree-open');
        if(dady && back !== ''){
            $('#ototo_luli_'+ this.div_id + '_'+dady).after('<li><ul>' + back + '</ul></li>');
            $('a').addClass('font_color');
            //$('#otot_arrow_' + this.div_id + '_' + dady).hide();// Hide arrow on tables !
    
            // SET UP EVENTS
            switch(this.div_id){
                /*case 'js_only_tree_fields_to_exclude_' + this.tabCounter:        // CLOSE ALL FOLDERS ON START...
                    if(this.Gnodes[id].isFolder == 'false'){ // IF FIELDS 
                        this.publicToggleNodeSelection( dady ); // close the table dad...
                        $('#ototo_luli_'+ this.div_id + '_'+dady).addClass('jstree-closed').removeClass('jstree-open');
                    }*/
                //case 'js_only_tree_fields_to_obfuscate_' + this.tabCounter:        // Set click eventfor each node
                //case 'js_only_tree_settings_vs_childs_' + this.tabCounter:        // Set click eventfor each node
                case 'js_only_tree_main_entity_' + this.tabCounter:                // Set click eventfor each node
                case 'js_only_tree_of_tables_to_view_data_' + this.tabCounter:                // Set click eventfor each node
                //case 'js_only_tree_optional_setting_tables':
                    for( child_node_id in firstLevelChildren){                        
                        this.add_onclick_events(child_node_id);
                    }
                    break;
                default:
                    console.log('Error div_id not known');
                    return;
            }
        }
        if(dady){
            $('#ototo_luli_'+ this.div_id + '_'+dady+' :nth-child(2)').removeClass('jstree-loading');
        }
        if(bool_open_all_child === 'true'){
            for( child_name in firstLevelChildren){
                var nb_childs = getNbPropertiesInObject( this.Gnodes[child_name].children );
                if( nb_childs ){
                    //setTimeout('private_open_node("' + child_name + '", "' + bool_open_all_child + '");', 100);
                    this.private_open_node(child_name, bool_open_all_child);
                }
            }
        }else{
            //alert('Not true so node stay closed !');
        }
    };
    
    GOpureJsTree.prototype.add_onclick_events = function(child_node_id) {
        if( !G('otot_link_' + this.div_id + '_' + child_node_id)) {
            alert('Error setting event on a missing html element ID=otot_link_' + this.div_id + '_' + child_node_id);
        }
        $('#otot_link_' + this.div_id + '_' + child_node_id).click( {'child_node_id' : child_node_id, 'object_tree' : this}, 
            function(event) {
                event.preventDefault();  // VERY VERY important to prevent scroll jumping back to the top of that window !!!!!
                var child_node_id    = event.data.child_node_id;
                var object_tree        = event.data.object_tree;
                object_tree.onclick_on_tree_node(object_tree, child_node_id);
                
                if(object_tree.div_id === 'js_only_tree_main_entity_' + object_tree.tabCounter){ // SET limit select to skip if table has hiddn
                    var real_id = 'otot_link_' + object_tree.div_id + '_' + child_node_id;
                    var obj_select = $('#'+real_id).next().find('select');
                    if ((object_tree.Gnodes[child_node_id].isOpen === 'true' && obj_select.val() == -2) ||
                        (object_tree.Gnodes[child_node_id].isOpen !== 'true' && obj_select.val() != -2)) {
                        obj_select.val(obj_select.val() == -2 ? -1 : -2);
                    }
                }
            } 
        );
        if(this.div_id === 'js_only_tree_main_entity_' + this.tabCounter){ // HIDE/show the node if user select skip or unselect skip in limit select
            $('.select_for_limits').unbind().change( {'object_tree' : this}, 
                function(event){
                    var object_tree        = event.data.object_tree;
                    var child_node_id = $(this).parent().prev().attr('id');
                    child_node_id = child_node_id.substr(('otot_link_' + object_tree.div_id + '_').length);
                    // NB : -2 == SKIP THIS TABLE 
                    // OPEN and now = -2 ==> hide it           or          // CLOSED and now != -2 ==> show it
                    if ((object_tree.Gnodes[child_node_id].isOpen === 'true' && $(this).val() == -2) ||
                        (object_tree.Gnodes[child_node_id].isOpen !== 'true' && $(this).val() != -2)) {
                        object_tree.onclick_on_tree_node(object_tree, child_node_id);
                    }
                }
            );
        }
    };
    
    GOpureJsTree.prototype.onclick_on_tree_node = function(object_tree, child_node_id){
        /*if(object_tree.div_id === 'js_only_tree_fields_to_obfuscate_' + object_tree.tabCounter){// Special : if leaf, propose to add and define a  new obfuscated field.
            if( typeof object_tree.Gnodes[child_node_id] === 'undefined') {
                alert('bug 143foun d');
            }
            if(object_tree.Gnodes[child_node_id].isFolder !== 'true'){
                var nb_form_children =     G('form_for_obfuscated_fieds_' + object_tree.tabCounter) ?
                                        G('form_for_obfuscated_fieds_' + object_tree.tabCounter).children.length : 0;
                var names_end = nb_form_children + '_' + object_tree.tabCounter;                
                $('.all_extra_params_for_' + names_end).hide();
                object_tree.add_new_fields_to_obfuscate(object_tree, child_node_id);
            }
        } else */
        if(object_tree.div_id === 'js_only_tree_of_tables_to_view_data_' + object_tree.tabCounter) {// show data associated
            ///console.log('yes abe you Click on table ' + child_node_id);
            object_tree.get_data_from_server(child_node_id);
            
        } else {
            object_tree.publicToggleNodeSelection(child_node_id);
        }
    };
        /*if(this.Gnodes[child_node_id].isFolder){
        $('#otot_arrow_' + this.div_id + '_' + child_node_id).click( {'child_node_id' : child_node_id, 'object_tree' : this}, 
            function(event) { 
                event.preventDefault();  // VERY VERY important to prevent scroll jumping back to the top of that window !!!!!
                var child_node_id        = event.data.child_node_id;
                var object_tree    = event.data.object_tree;
                object_tree.publicToggleNodeSelection(child_node_id); 
            } 
        );
    }*/
    GOpureJsTree.prototype.guess_node_level = function(html_id){
        var z = html_id.indexOf('oo_o_oo');
        var level = 0;
        while(z >=0 ){
            //z = html_id.indexOf('__', z + 2);
            z = html_id.indexOf('oo_o_oo', z + 2);
            level++;
        }
        return level;
    };
    GOpureJsTree.prototype.pad = function(pad, str, padLeft) {
        if (typeof str === 'undefined') 
            return pad;
        if (padLeft) {
            return (pad + str).slice(-pad.length);
        } else {
            return (str + pad).substring(0, pad.length);
        }
    };
    GOpureJsTree.prototype.get_html_select_options = function() {
        var values = ['No limit', 'Skip this table', 1, 5, 10, 50,100,500,1000,5000,10000,50000,100000,500000,1000000];
        var html = '';// -1             -2 
        for (i=0 ; i < values.length ; i++) {
            var value;
            switch (i) {
                case 0: value = -1; break;
                case 1: value = -2; break;
                default:value = values[i];
            }
            var label = i < 1 ? values[i] : 'Limit ' + values[i];
            html += '    <option value="' + value + '">' + this.pad('...............', label, true) + '</option>';
        }
        html = html.replace(/\./g, '&nbsp;&nbsp;');
        return html;
    };
    GOpureJsTree.prototype.get_node_begin = function(html_id, node){
        var r = node.isFolder !== 'true' ? ' class="jstree-leaf" ' : ' class="jstree-closed" ';
        
        var level = this.guess_node_level(html_id);
        var icon_class = typeof this.icons_per_level[level] === 'undefined' ? this.icons_per_level[0] : this.icons_per_level[level]; 
        var back     = "\n" +  '<li id="ototo_luli_'+ this.div_id + '_' + html_id + '"' + r + '>' +
                                    '<ins id="otot_arrow_' + this.div_id + '_' + html_id + '" class="jstree-icon" style="margin-top:2px;">&nbsp;</ins>' +
                                    '<a href="#" id="otot_link_' + this.div_id + '_' + html_id + '" ' + 
                                    (this.div_id !== 'js_only_tree_main_entity_' + this.tabCounter || node.extra_info === '' ? '' :
                                        ' class="tables_to_copy_tool_tip" title="' + node.extra_info + '" '
                                    ) +
                                    '>' +
                                        '<span class="single_icon ' + icon_class + '">&nbsp;</span>' + 
                                        //'<!--ins class="jstree-icon">&nbsp;</ins-->' + 
                                        node.fileName +
                                    '</a>'+
                                    //root
                                    (this.div_id !== 'js_only_tree_main_entity_' + this.tabCounter ||
                                     this.root_id === html_id /* do not show the slect for the root of the right div, ust for the other nodes */    ? '' :
                                        '<span style="width:200px;top:5px;text-align:right;border-bottom:1px solid black;">' + 
                                        '    <select style="height:21px; position: absolute; right: 0%; margin-top: 1px;" class="select_for_limits">'+//' style="float:right;margin-right:50px;">' +
                                                this.get_html_select_options() +
                                        '    </select>' +
                                        '</span>'
                                        //'<span style="clear: right;"></span>'
                                    ) +
                                '</li>';
        return back;
    };
    GOpureJsTree.prototype.simple_select_one_node = function(html_id){
        $('#ototo_luli_'+ this.div_id + '_' + html_id + ' > a').css('color', Ojson_settings.back_color).addClass('color_inverted_1') ;///.css('background-color','grey');
        this.Gnodes[html_id].isOpen = 'false';
    };
    GOpureJsTree.prototype.simple_UN_select_one_node = function(html_id){
        $('#ototo_luli_'+ this.div_id + '_' + html_id + ' > a').css('color', Ojson_settings.font_color).removeClass('color_inverted_1') ;///.css('background-color','grey');
        this.Gnodes[html_id].isOpen = 'true';
    };
    // init 1 fct especially used at step 2
    GOpureJsTree.prototype.close_already_unselected = function(){
        for( i in this.AnodesToClose){
            var html_id = this.AnodesToClose[i];
            if(G("otot_link_" + this.div_id + '_' + html_id)){
                
                var already_disabled = false;
                var dad_id = this.returnParentId(html_id);
                
                // LOOP NOT used while user click BUT important when reloading child_tables of main entity !
                while( dad_id !== 'ROOT_DAD' ){
                    if( dad_id !== 'ROOT_DAD' && this.Gnodes[dad_id].isOpen!=='true'){
                        already_disabled = true;
                    }
                    var dad_id = this.returnParentId(dad_id);
                }
                if(already_disabled === false){         
                    this.publicToggleNodeSelection( html_id );
                    
                    // Select SKIP THIS TABLE in the HTML_SELECT for limits
                    var real_id = 'otot_link_' + this.div_id + '_' +html_id;
                    var skip_this_table = -2;
                    $('#'+real_id).next().find('select').val(skip_this_table);
                }
            }
        }                            
    };
    // init 1 fct especially used at step 4 for excluded fields
    GOpureJsTree.prototype.select_at_initialisation = function(){
        for( i in this.AnodesToSelect){
            if(G("otot_link_" + this.div_id + '_' + this.AnodesToSelect[i])){
                if(this.Gnodes[this.AnodesToSelect[i]].isOpen == 'true'){
                    this.simple_select_one_node(this.AnodesToSelect[i]);
                }
            }
        }                            
    };
});
