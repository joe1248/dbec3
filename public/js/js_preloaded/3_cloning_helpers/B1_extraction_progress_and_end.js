//5
function js_Class_Clone_Copy(tabCounter, entity_ready_id, is_delete, show_confirm_button, nb_destination, copy_transfer_id){
	this.debug					= (Gdebug_debug_all || Gdebug_debug_2_extraction ? true : false);
	this.tabCounter				= tabCounter;				// Tab index
	this.entity_ready_id		= entity_ready_id;
	this.copy_transfer_id		= copy_transfer_id;
	this.index_of_ajax_updates  = 1;
	this.is_delete				= is_delete;				// true if delete
	this.show_confirm_button	= show_confirm_button;		//true if confirm button before executing on target DBs
	this.nb_destination			= nb_destination;
	this.nb_destination_done	= 0; 
	this.Aextraction_counter	= [];						// for each table, count nb records extracted.
	this.nb_queries				= -1;		// So here so easy to pass to OclonePaste being created later !!!

	this.update_extraction_status();
}
js_Class_Clone_Copy.prototype.update_extraction_status = function(){
	js_log(this.debug, 'GO jsClass_Clone_Copy.prototype.update_extraction_status');
	if( ! G('new_main_extraction_div' + this.tabCounter)){
		return;
	}
	var nb_in_one_table, totalNbRecordsEctractedSoFar = 0, html_rows = '';
	for(var table in this.Aextraction_counter){
		nb_in_one_table = this.Aextraction_counter[ table ]; 
		totalNbRecordsEctractedSoFar += nb_in_one_table;
		html_rows = "<tr class='tr_color_alternate'><td>" + table + "</td><td class='align_right'>" + nb_in_one_table + "</td></tr>" + html_rows;
	}
	var innerTableUpdated = Oview.get_html_extraction_table(this.tabCounter, this.is_delete, html_rows, totalNbRecordsEctractedSoFar);
	var extractionTableContainer = Oview.get_html_extraction_table_container(this.tabCounter, innerTableUpdated);
	
	if( !G('div_small_body_extraction' + this.tabCounter)){
		$('#new_main_extraction_div' + this.tabCounter).append( extractionTableContainer );
		$('#div_error_extraction' + this.tabCounter).hide();
		var tabCounter = this.tabCounter;
		$('#toggle_div_error_extraction' + this.tabCounter).click( function(){
			///a_lert(this.tabCounter + ' vs ' + tabCounter + 'so '+$('#div_error_extraction' + tabCounter).html());
			$('#div_error_extraction' + tabCounter).toggle();
		});
		$('#extraction_table').hide();
		reset_jquery_styles(); 
	}else{
		G('div_small_body_extraction' + this.tabCounter).innerHTML = innerTableUpdated;
	}
	js_log(this.debug, 'END jsClass_Clone_Copy.prototype.update_extraction_status');
};
js_Class_Clone_Copy.prototype.show_extraction_progress = function( Anb_extracted_by_tables_json ){ 
	$('#extraction_table').fadeIn();
    Anb_extracted_by_tables = Anb_extracted_by_tables_json;
    if(typeof Anb_extracted_by_tables !== 'object'){
		console.log('Error : ' + Anb_extracted_by_tables_json);
    }
	for(var table in Anb_extracted_by_tables){
		this.Aextraction_counter[ table ] = Anb_extracted_by_tables[table];
	}
	this.update_extraction_status();
};

js_Class_Clone_Copy.prototype.show_extraction_error = function(){
	js_log(this.debug, 'GO jsClass_Clone_Copy.prototype.show_extraction_error');
	// Increase NB errors.
	var error_counter = $("#error_counter" + this.tabCounter);
	var nb = error_counter.html();
	nb++;
	error_counter.html( nb );
	error_counter.parent().show();
	var progressbar	= $("#progressbar" + this.tabCounter);
	var progressbarValue	= progressbar.find( ".ui-progressbar-value" );
	progressbarValue.css({"background" : 'red' });
	js_log(this.debug, 'END jsClass_Clone_Copy.prototype.show_extraction_error');
};
// SO FAR ONLY WHEN DB PROGRESS vs js cash
js_Class_Clone_Copy.prototype.extraction_is_soon_finished = function( nb_queries ){
	// Just in case in mode new target db:
	$('#div_to_change_target_db' + this.tabCounter).hide();
	hide_central_spinner('from extarction soo finished');
	
	// If we need a confirm button, create it and show it
	/*if( $('#show_confirm_dialog').val() === 'checked'){
		varInTab[ this.tabCounter ].OcloneCopy.showButtonToStartPastingExtractedData();
	}else{// else the copy screen as paste as already started inside extraction__is_soon_finished just above
	*/	$('#div_small_body_extraction'	+ this.tabCounter).hide();
		$('#div_error_extraction'		+ this.tabCounter).hide();
		$('#div_master_paste'			+ this.tabCounter).show();
	//}
	var OtransferParams, post_data = html_form_to_object('form_to_clone_entity_data' + this.tabCounter);
//	dump(post_data);
	var form_id = 'main_form_to_paste_in_tab_' + this.tabCounter;
	$('#' + form_id).remove();
	var html = 
		'<form method="post" id="' + form_id + '" class="hidden"> ' +
//		'	<input type="hidden" name="transfer_mode"		value="' + (this.is_delete ? 'MODE_DELETING_DATA' : 'MODE_CLONING_DATA') + '">' +
		'	<input type="hidden" name="form_id"				value="3_clone__B1_progress_line_92">' +
		'	<input type="hidden" name="tab_counter"			value="' + this.tabCounter + '">' +
		'	<input type="hidden" name="table_name"			value="' + varInTab[ this.tabCounter ].OcloneUi.main_table + '">' +
		'	<input type="hidden" name="primary_key_name"	value="' + varInTab[ this.tabCounter ].OcloneUi.main_primary_key + '">' +
		'	<input type="hidden" name="ignore_fk_checks"	value="false">' +
		//'	<input type="hidden" name="do_stop_on_error"	value="true">' +
		'	<input type="hidden" name="on_error_rollback"	value="'					+ (post_data.on_error_stop_n_do_a_rollback == 'checked' ? 'true':'false') + '">' +
		'	<input type="hidden" name="show_error_only"		value="'					+ (post_data.enable_debug_mode == 'checked' ? 'false':'true') + '">' +
		'	<input type="hidden" name="entity_ready_id" id="entity_ready_id" value="'	+ post_data.entity_ready_id + '">' +
		'	<input type="hidden" name="div_back_index" id="div_back_index" value="">'	+
		//'	<input type="hidden" name="transfer_id" value="' + this.copy_transfer_id + '">' +
		//'	<input type="hidden" name="tmp_file_name" value="'.str_replace('\\', '\\\\', $tmp_file_name).'">' +
		'</form>';
//	alert(html);
//	$("body").append(html);
	if(typeof nb_queries !== 'undefined'){
		varInTab[ this.tabCounter ].OcloneCopy.nb_queries = nb_queries;
	}
	// FOR EACH DEST DB, Create new jsClass_Clone_Paste JS Object.
	var Adest_db_ids = post_data.dest_db_svr_id.split('#');
	var Adest_names  = post_data.dest_db_name.split('#');
	this.nb_destination = Adest_db_ids.length; 
	this.nb_destination_done = 0; 
	///alert('this.nb_destination = '+this.nb_destination);
	for(var i = 0 ; i < this.nb_destination ; i++){
		if(typeof Adest_db_ids[i] === 'undefined' || Adest_db_ids[i] === ''){
			continue;
		}
		///alert('Adest_db_ids[i]='+Adest_db_ids[i]);
		this.prepare_new_paste_object(i, Adest_db_ids[i], Adest_names[i], post_data.object_id);
		/*if( //varInTab[ this.tabCounter ].OcloneCopy.show_confirm_button === false
			$('#show_confirm_dialog').val() !== 'checked'
		){*/
			varInTab[ this.tabCounter ].OclonePaste[ i ].real_post_paste_transfer();// When no need to click on continue after etxraction
		/*}else{
			///alert('soon showing extrction button when progress clabbck will notice it has ended with mode = ' + varInTab[ this.tabCounter ].OcloneUi.cloneUiMode);//+ $('#button_continue_confirm_exe' + this.tabCounter));
			//$('#button_continue_confirm_exe' + this.tabCounter).show();
			varInTab[ this.tabCounter ].OcloneUi.changeTransferTitle('4_extraction_done');
			js_log(this.debug,' YES CONFIRM BUTTON SO NOT calling real__post_paste_transfer' );
		}*/		
	}
	
	/*if(this.is_delete){ 
		Aids_to_copy = this.OtransferParams.primary_key_values.split(',');
		G('tranf  er_title' + this.tabCounter).innerHTML = 'Ready to delete of ' + Aids_to_copy.length + ' entities from ' + this.OtransferParams.main_table_name;
	}else*/
	//var Aids_to_copy, max_len = 30;
	/*if(this.OtransferParams.primary_key_values.length > max_len){
		Aids_to_copy = this.OtransferParams.primary_key_values.split(',');
	}*/ 
	//post_data.object_id
	
};

js_Class_Clone_Copy.prototype.prepare_new_paste_object = function(paste_index, dest_db_id, dest_name, data_object_id){
	// OtransferParams NEEDED as is by jsClass_Clone_Paste object !
	var data_discovery_approximation = 1.17; // ADDS 10 % to the expected total number of queries (just for the % in progress bar !)

	OtransferParams = { 
		'nb_queries'			: this.nb_queries * data_discovery_approximation,
		'dest_db_svr_id'		: dest_db_id,
		'dest_db_svr_name'		: 'done_in_js_construct',
		'dest_db_name'			: dest_name,
		'main_table_name'		: varInTab[ this.tabCounter ].OcloneUi.main_table,
		'main_primary_key_name'	: varInTab[ this.tabCounter ].OcloneUi.main_primary_key,
		'primary_key_values'	: data_object_id,
		'on_error_rollback'		: true,
		'do_stop_on_error'		: true,
		'show_error_only'		: true
	};
	// Make sure container array does exist before putting new object in it !
	if( typeof	varInTab[	this.tabCounter ].OclonePaste === "undefined"){
				varInTab[	this.tabCounter ].OclonePaste = []; // so will be one per dest_db
	}
	varInTab[ this.tabCounter ].OclonePaste[paste_index ] = new js_Class_Clone_Paste( this.tabCounter,paste_index, OtransferParams);
};
// ONLY CALLED if confimation button needed before starting transfer... 
js_Class_Clone_Copy.prototype.showButtonToStartPastingExtractedData = function(){

	$('#button_continue_confirm_exe' + this.tabCounter).show();
	$('#hidden_has_extraction_finished' + this.tabCounter).val('true');
	// GO PASTING DATA ALREADY EXTRACTED
	$('#button_continue_confirm_exe' + this.tabCounter).unbind().click( { 'thisOCloneCopy' : this}, function(event){ 
		var tabCounter = event.data.thisOCloneCopy.tabCounter;
		////a_lert('event.data.thisOCloneCopy.nb_destination === '+event.data.thisOCloneCopy.nb_destination);
		for(var dest_db_index = 0 ; dest_db_index < event.data.thisOCloneCopy.nb_destination ; dest_db_index++){
			if(typeof varInTab[ tabCounter ].OclonePaste === 'undefined'){ 
				console.log('Errror varInTab[ tabCounter ].OclonePaste object not found in tab numero::::: ' + tabCounter);
				dump(event.data.thisOCloneCopy);
			}else{
				varInTab[ tabCounter ].OclonePaste[ dest_db_index ].real_post_paste_transfer();// when clicked on conitnue after extraction done.
			}
		}
		$('#div_small_body_extraction'	+ tabCounter).hide();
		$('#toogle_div_error_extraction'		+ tabCounter).hide();
		$('#div_error_extraction'		+ tabCounter).hide();
		$('#div_master_paste'			+ tabCounter).show();
	});
	reset_jquery_styles(); 
};
