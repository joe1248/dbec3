// check all paramaters ready before launching data extraction
js_Class_Clone_Ui.prototype.do_last_checks_before_start_data_extraction = function(){	
	if( this.is_copy_not_delete !== 'false' && $('#clone_'+this.tabCounter+'dest_db_svr_id' + this.tabCounter +'').val() === ''){
		showDivAlert('Please select a valid DB destination.');
		return;
	}
	if( $('#clone_'+this.tabCounter+'object_id').val() === ''){
		showDivAlert('Please select a valid object to clone.');
		return;
	}	
	if( $('#save_in_data_file' + this.tabCounter).val() === 'checked'){
		var new_data_file_name = $('input[name=shown_user_data_filename' + this.tabCounter +']').val();
		if(this.isSameDataFileNameAlready(new_data_file_name)){
			var msg = 'Another data file already exists with that name. <br><br>Please confirm you want to overwrite it ?';
			showDivConfirm( msg, this.start_data_extraction, 'Confirmation before data file overwritten', false, this.tabCounter);
			return;
		}else{
			this.start_data_extraction();
		}
	}else{
		this.start_data_extraction();
	}
};
js_Class_Clone_Ui.prototype.getTransferTitle = function(){
	var html = this.main_table + ' where ' + this.main_primary_key + ' = ';
	var ids = $('#clone_'+this.tabCounter+'object_id').val();
	var Aids = ids.split(', '); 
	if (Aids.length <= 3) {
		html += ids;
	} else {
		html += Aids[0] + ', <input type="button" value="..." title="' + ids.substr(0,ids.length - 2) + '." class="small-button easy_tool_tip">';
	}
	html += '<br>' + ' from  ' + this.shown_db_source_label; 
	return html;
};

// in fact, it will check db are similar before starting the extraction !
js_Class_Clone_Ui.prototype.start_data_extraction = function( tabCounter, fakeSimiliratyCheck){
	var Othis	= typeof tabCounter !== 'undefined' ? varInTab[ tabCounter ].OcloneUi : this;
	fakeSimiliratyCheck = typeof fakeSimiliratyCheck !== 'undefined' && fakeSimiliratyCheck == 'all_ignored' ? true : false;
	$('#div_transfer_questions' + Othis.tabCounter).hide();
	$('#new_main_extraction_div' + Othis.tabCounter).html( Oview.get_html_transfer_master_div(Othis.tabCounter ) );
	
	$('#button_remove_ifr_data_extraction' + Othis.tabCounter).click( { 'thisOCloneUi' : Othis}, function(event){
		var tabCounter = event.data.thisOCloneUi.tabCounter;
		varInTab[ tabCounter ].OcloneUi.cancelAnyTimerLeft();
		if(	varInTab[ tabCounter ].OcloneUi.cloneUiMode == 'mode_new_target_db'){
			$('.div_right').prepend( $('#div_db_tree_destination_dad') );			// put back target_dbs where they came from !
			// Temporary because if user changes after selected a wrong target, bug cos the first bad request may overtake the second good request !
			$('#button_to_change_db_destination').show();///css('visibility','hidden');
		}
		event.data.thisOCloneUi.remove_ifr_data_extraction();
	});
	$('#button_to_change_target_db' + Othis.tabCounter).unbind().click( { 'thisOCloneUi' : Othis}, Othis.event_click_on_change_target);
	$('#button_to_edit_entity'		+ Othis.tabCounter).unbind().click( { 'thisOCloneUi' : Othis}, 
		function(event){ 
			var tabCounter = event.data.thisOCloneUi.tabCounter;
			addStaticTab(false, Opages.entity_edit,	
				varInTab[ tabCounter ].OcloneCopy.entity_ready_id,
				varInTab[ tabCounter ].OcloneUi.cloned_entity_label
			);
		}
	);

	reset_jquery_styles();

	// is sql file
	if(Othis.cloneUiMode === 'mode_new_target_db'){
		Othis.event_click_on_change_target();
	}else{
		Othis.check_if_similar_dbs(fakeSimiliratyCheck === false ? 'normal' : 'all_ignored');
	}
	$('#new_main_extraction_div' + Othis.tabCounter).fadeIn();
};

js_Class_Clone_Ui.prototype.changeTransferTitle = function(step){
	var html ='';
	switch( step ){
		case '1_db_compare': //changeTransferTitle
			//html += 'Comparing source and target DB structure.';
			html += 'Databases schema comparison...'
			show_central_spinner();
			break;
		case '2_db_fixer': //changeTransferTitle
			html += 'Extra step: Differences between Source And Target DBs';
			break;
		case '3_extraction_in_progress': //changeTransferTitle
			html += 'Data discovery...';//'Extracting ' + this.getTransferTitle();
			break;
		case '4_extraction_done': //changeTransferTitle
			html += 'Ready to clone ' + this.getTransferTitle();
			break;
		case '5_pasting_normal': //changeTransferTitle
			html += 'Cloning ' + this.getTransferTitle();
			break;
		case '6_pasting_sql_file': //changeTransferTitle
			html += 'Transfering saved data:';
			break;
	}	
	$('#html_transfer_title' + this.tabCounter).html( html );
	$('.easy_tool_tip').tooltip();
	//$('#html_transfer_title' + this.tabCounter).show();

};
// change target ===  sql file soon go
js_Class_Clone_Ui.prototype.event_click_on_change_target = function(event){
		
	var tabCounter = typeof event !== 'undefined' ? event.data.thisOCloneUi.tabCounter : this.tabCounter;
	
	varInTab[ tabCounter ].OcloneUi.changeTransferTitle('5_pasting_normal');///'6_pasting_sql_file');
	varInTab[ tabCounter ].OcloneUi.cancelAnyTimerLeft();
	///alert('Wicked already changing DB with tabCounter == '+tabCounter);
	varInTab[ tabCounter ].OcloneUi.changeMode('mode_new_target_db', 'from event_click_on_change_target');
	varInTab[ tabCounter ].GO_js_tree_db_destination.init_h3_db_tree_title('destination');
	$("#div_master_paste" + tabCounter).html('');
//	alert('div_master_paste has been cleared up !');
	$('#div_to_change_target_db'	+ tabCounter).append( $('#div_db_tree_destination_dad') );
	///$('#button_to_change_db_destination').trigger('click');	// done above
	///object_tree.init_h3_db_tree_title(source_or_destination);// done above 
	$('#button_to_change_target_db' + tabCounter).hide();
	$('#button_to_edit_entity'		+ tabCounter).hide();
	$('#div_to_change_target_db'	+ tabCounter).show();
	$('#div_master_paste'			+ tabCounter).hide();
	$('#div_small_body_extraction'	+ tabCounter).hide();
	$('#div_sql_file_description'	+ tabCounter).show();
	
	varInTab[ tabCounter ].OcloneCopy.nb_destination = 0;
	varInTab[ tabCounter ].OcloneCopy.nb_destination_done = 0; 
	
//	alert('Js so far so good');
};
js_Class_Clone_Ui.prototype.cancelAnyTimerLeft = function(event){
	var tabCounter = typeof event !== 'undefined' ? event.data.thisOCloneUi.tabCounter : this.tabCounter;
	var Opaste = varInTab[ tabCounter ];
	if (typeof Opaste !== 'undefined' && typeof varInTab[ tabCounter ].OcloneCopy !== 'undefined'){
		for( var i=0 ; i < varInTab[ tabCounter ].OcloneCopy.nb_destination ; i++ ){
			Opaste = varInTab[ tabCounter ].OclonePaste;
			if (typeof Opaste === 'undefined') continue;
			Opaste = varInTab[ tabCounter ].OclonePaste[ i ];
			if (typeof Opaste === 'undefined') continue;
			clearInterval( Opaste.setIntervalForDuration ); Opaste.setIntervalForDuration = null;
			///alert('VICTORY cancelled timer for dest_db_index='+i);
		}
	}
};
js_Class_Clone_Ui.prototype.remove_ifr_data_extraction = function(){
	hide_central_spinner();
	this.changeMode('mode_normal', 'From remove_ifr_data_extraction');
	$('#new_main_extraction_div' + this.tabCounter).hide();	
	$('#div_transfer_questions' + this.tabCounter).fadeIn('fast'); make_strong_checkboxes(); // NB : it is, for now, stored in: html_cdn/lib/ide_js/mini_jquery.js
	this.show_div_bottom();
	this.cloning_cancelled = true;
};

js_Class_Clone_Ui.prototype.isSameDataFileNameAlready = function(name){
	if(Gcurrent_user == 'autotest'){
		return false;
	}
	var tmp, Anames = [];
	tmp = parent.A8db_entity_data;
	for(var i = 0 ; i < tmp.length ; i++){
		Anames.push( tmp[i].label );
	}
	// if same name IS found, return true
	return (-1 !== js_in_array(name, Anames) ) ? true : false;
};
