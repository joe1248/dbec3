
// SET up Events on the clone UI, where user select : 1 Source DB, 2 IDs to clone, 3 Target DB, 4 options, 5 submit transfer

function js_Class_Clone_Ui(tabCounter, max_nb_entity_to_copy, is_copy_not_delete, copy_or_del, entity_label, main_table, main_primary_key){
	this.cloneUiMode			= 'mode_normal';//		: nothing recorded => all params expected by user.
							// or mode_new_target_db	: moved target_dbs div to move back
							// or mode_historic			: to jump cash to extraction to all params recorder since last use.
							// or mode_sql_file_paste	: to jump cash to paste data cos extraction done and recorded in file
	this.checkMode				= '';//'normal' or 'no_copy_transfer_required' or 'fake_just_main_table'
	this.tabCounter				= tabCounter;				// Tab index
	this.AJAX_PROGRESS_DELAY	= 1500;						// ###MATCHING_SETTINGS#####AJAX_PROGRESS_DELAY
	this.cloning_cancelled		= false;
	this.max_nb_entity_to_copy	= max_nb_entity_to_copy;	// CONST max copiable is set in PHP
	this.is_copy_not_delete		= is_copy_not_delete;		// true if copy
	this.copy_or_del			= copy_or_del;				// words
	this.cloned_entity_label	= entity_label;				// TODO : brilliant variable but not even used yet !!!
	this.main_table				= main_table;				
	this.main_primary_key		= main_primary_key;			
	this.perso_query_end		= 'WHERE '  + this.main_primary_key + ' >= 1'; // Also remember LAST end_query after user has changed it
	this.CONST_PERSO_QUERY_START= 'SELECT ' + this.main_primary_key + ' FROM ' + this.main_table;	
	this.last_chosen_db_source = null;						// Prevent rechecking which IDs available to copy if source DB did not actually change !
	this.last_list_of_ids = null;
	this.perso_query_start = "", perso_query_end = "";
	this.objectIdMessage = '';
	this.shown_db_source_label	= '';
	try{
		$("#button_submit_db_destination").click( { 'dest_tree' : varInTab[this.tabCounter].GO_js_tree_db_destination }, function(event){ event.data.dest_tree.copy_entity_db_chosen(); });

		$("body").prepend('<div id="confirm_box"></div>');
								$('#confirm_box').dialog(dialogOptions);// dialog initialisation							
		///a_lert('dialog created '+dialogOptions);							
		$("body").prepend('<div  id="edit_destination_faves"></div>'); var options = jQuery.extend({}, dialogOptions); options.height = 750; options.width = 750;
	
		// Copy 1 ID
		$('#user_choice_1').click( function(){
			$('#div_first_question').hide();
			$('#div1').show();
		});
		// Copy many IDs
		$('#user_choice_2').click( function(){
			$('#div_first_question').hide();
			$('#div2').show();
		});
		
		$('#real_save_in_data_file' + this.tabCounter).click( {'object_js_Class_Clone_Ui' : this }, function(event){
			var tabCounter = event.data.object_js_Class_Clone_Ui.tabCounter;
			if(G('real_save_in_data_file' + tabCounter).checked){
				$('#div_data_file_name' + tabCounter).show();
			}else{
				$('#div_data_file_name' + tabCounter).hide();
			}
		});
		
		$('#transfer_submit_button').click( {'object_js_Class_Clone_Ui' : this }, function(event){
			event.data.object_js_Class_Clone_Ui.do_last_checks_before_start_data_extraction();
		});
		
		$('#real_multiple_destinations').click( function(e){
			if( G('real_multiple_destinations') && G('real_multiple_destinations').checked){
				$('#button_submit_db_destination').parent().show();
			}else{
				$('#button_submit_db_destination').parent().hide();
			}
		});	
		/* PB to delete on keydown delete cos WHICH tree would it be ????==> you have to try MENU contextual instead !! BUT HARD so maybe if 1 shown OK*/
		$('#div_db_tree_source').keydown( function(e){
			// DOES HAPPEN IF FOCUSED FiRST !console.log('keydown on tree source !');
		});
	}catch(err){
		console.log('Error while creting cloneUI object');
	}
}
