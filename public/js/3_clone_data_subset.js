//? ENTITIES_CREATE  JS to init tree

function init_js_in_cloning_ui(tabNumber){
	//alert('Yes init_js_in_loning ui tabNumber = ' + tabNumber);
	var MAX_ENTITY_COPIABLE_AT_ONCE = 150;	
	var data = varInTab[tabNumber].my_json;
	//dump(data);
	
	var AnodesSource = data.src;
	var AnodesDestination = data.dest;
	varInTab[tabNumber].GO_js_tree_db_source = new GO_tree(tabNumber, 'div_db_tree_source', 'GO_js_tree_db_source', '','0','db','0','0','0');
	varInTab[tabNumber].GO_js_tree_db_source.initiliase_tree("Source DB servers",false);
	var load_first_level_GO_js_tree_db_source = function(){ 
		varInTab[tabNumber].GO_js_tree_db_source.parse_one_folder_call_back('OK' + JSON.stringify(AnodesSource));
	}; 
	setTimeout(load_first_level_GO_js_tree_db_source,1);


	varInTab[tabNumber].GO_js_tree_db_destination = new GO_tree(tabNumber, 'div_db_tree_destination', 'GO_js_tree_db_destination', '','0','db','0','0','0');
	varInTab[tabNumber].GO_js_tree_db_destination.initiliase_tree("Destination DB servers",false);
	var load_first_level_GO_js_tree_db_destination = function(){ 
		varInTab[tabNumber].GO_js_tree_db_destination.parse_one_folder_call_back('OK' + JSON.stringify(AnodesDestination));
	}; 
	setTimeout(load_first_level_GO_js_tree_db_destination,1);

	
	varInTab[tabNumber].ok = "yes";
	$('#clone_' + tabNumber + 'entity_ready_id').val(data.entity_ready_id);
	varInTab[tabNumber].OcloneUi = new js_Class_Clone_Ui(
		tabNumber, MAX_ENTITY_COPIABLE_AT_ONCE, 'true', 'copy', data.entity_ready_name, data.main_table_name, data.main_table_primary_key
	);
	if (typeof data.paste_transfer_id !== ' undefined' && typeof data.one_transfer !== 'undefined'){
		replay_one_recent_transfer(tabNumber, data.one_transfer);
	}
	reset_jquery_styles();
	$('#div_db_tree_source_dad' + tabNumber).fadeIn("fast");
//	alert('victory JS executed all !!!');
}
function replay_one_recent_transfer(tabNumber, one_transfer)
{
	$('#clone_' + tabNumber + 'copy_transfer_i'		).val(one_transfer.transfer_id);
    $('#clone_' + tabNumber + 'src_db_name'			).val(one_transfer.src_db_name);
    $('#clone_' + tabNumber + 'src_db_svr_id'		).val(one_transfer.src_db_svr_id);
    $('#clone_' + tabNumber + 'src_db_svr_name'		).val(one_transfer.src_connection_name);  /// only added here, not needed for normal more cos using node_id to get node_properties
    $('#clone_' + tabNumber + 'dest_db_name'		).val(one_transfer.dest_db_name);
    $('#clone_' + tabNumber + 'dest_db_svr_id'		).val(one_transfer.dest_db_svr_id);
    $('#clone_' + tabNumber + 'dest_db_svr_nam'		).val(one_transfer.dest_connection_name);  /// only added here, not needed for normal more cos using node_id to get node_properties
    $('#clone_' + tabNumber + 'entity_ready_id'		).val(one_transfer.entity_ready_id);
    $('#clone_' + tabNumber + 'copy_sql'			).val("true");
    $('#clone_' + tabNumber + 'delete_sql'			).val("false");
    $('#clone_' + tabNumber + 'object_id'			).val(one_transfer.src_ids);
    varInTab[tabNumber].OcloneUi.changeMode( "mode_historic", "from copy_entity.php---A" );
    varInTab[tabNumber].GO_js_tree_db_source.update_h3_db_tree_title("source");
    varInTab[tabNumber].GO_js_tree_db_source.copy_entity_db_chosen();        // Load others possible src ids
    varInTab[tabNumber].GO_js_tree_db_destination.update_h3_db_tree_title("destination");
    varInTab[tabNumber].OcloneUi.success_new_object_id(one_transfer.src_ids, "real_second_answer");
}
