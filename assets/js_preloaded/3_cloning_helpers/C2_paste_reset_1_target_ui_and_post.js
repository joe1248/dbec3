// Start paste SQL on one destination, maybe from REPLAY button or Continue button after extraction done.
js_Class_Clone_Paste.prototype.real_post_paste_transfer = function(){				//--------------------------> real_post_paste_transfer just here
	js_log(this.debug,'GO real_post_pasteTransfer paste_html_id ='+this.paste_html_id);
	
	varInTab[ this.tabCounter ].OcloneUi.changeTransferTitle('5_pasting_normal');
	
	this.nb_error_previous_tranfer = $('#error_counter_' + this.paste_html_id).html();
	
	
	// RESET PASTE PROGRESS TABLE and request new tranfer ID, then launch transfer !
//	this.initialiase_paste_table();  // NEEDS OcloneCopy.Aextraction_counter
//js_Class_Clone_Paste.prototype.initialiase_paste_table = function(){
	///js_log(this.debug,'GO initialiase_pasteTable ='+this.paste_html_id);
	
	var AextractionCounter = varInTab[ this.tabCounter ].OcloneCopy.Aextraction_counter;
	///dump( AextractionCounter );
	var paste_html_id = this.paste_html_id;
	this.i_query = 0;	  var d = new Date(); 
	this.index_of_ajax_updates = 1;
	this.exec_start_time 	= d.getTime();
	this.Apasted_counter	= {};// array indexed per TABLE name
	this.Aupdated_counter	= {};// array indexed per TABLE name

	//$('#html_final_result_' + paste_html_id).html('');
	$('#html_final_result_' + paste_html_id).css('visibility','hidden');
	$('#html_sql_queries_'  + paste_html_id).html('<br>');
	$('#error_counter_'		+ paste_html_id).html('0');
	$('#error_counter_'		+ paste_html_id).hide();
	$('#progress-label'		+ paste_html_id).html('Loading');
	var progressbar			= parent.$("#progressbar" + paste_html_id);
	var progressbarValue	= progressbar.find( ".ui-progressbar-value" );
	progressbar.progressbar( "option", {value: 0 });
	progressbarValue.removeClass('bg_orange').css({"background" : '#fff' });
	
	$('#' + this.ifr_or_div_id).html( Oview.get_html_transfer_1_target_details(paste_html_id, AextractionCounter) );
	
	$('.tr_color_alternate:odd').css('background-color','#ccc');
	
	$('#html_sql_queries_' + paste_html_id).hide();
	$("#td_"+paste_html_id+"_button_replay_special_debug").hide();
	$("#td_"+paste_html_id+"_button_replay").css('visibility','hidden');
	$('#td_' + paste_html_id + '_button_view_data').hide();
	$("#td_"+paste_html_id+"_button_replay_no_errors").hide();
	reset_jquery_styles();
	
	this.privatePostTransfer(false, 0, this.tabCounter);
	js_log(this.debug,'END real_post_pasteTransfer paste_html_id ='+this.paste_html_id);
};

// private cos call twice by itself cos first call only request a new transfer id !
js_Class_Clone_Paste.prototype.privatePostTransfer = function(real_one, paste_transfer_id, tabCounter){
	if(!real_one && paste_transfer_id !== 0){ alert('error in post Transfer NOT REAL cos paste_transfer_id already not zero'); return; }
	if(real_one  && (typeof paste_transfer_id === 'undefined' || isNaN(paste_transfer_id) || paste_transfer_id <=0)){
		alert('error in post Transfer REAL cos paste_transfer_id not valid '+paste_transfer_id); 
		return;
	}
	var extraction_post_data = html_form_to_object('form_to_clone_entity_data' + this.tabCounter);
	/*alert('Next dump is extraction_post_data');
	
	alert('Next dump is this.OtransferParams');
	dump(this.OtransferParams);*/ 
	//dump(extraction_post_data);
	//alert('NOW extraction_post_data[enable_debug_mode_'+tabCounter+'] = ' + extraction_post_data['enable_debug_mode_'+tabCounter]);
	var callback_fct;
	//if(!real_one){
	var post_data_string	=	'&ajax'					+ '=' + 'true' +
								'&tab_counter'			+ '=' + this.tabCounter +
								'&ifr_idx'				+ '=' + this.dest_db_index +
								'&dest_db_svr_id'		+ '=' + this.OtransferParams.dest_db_svr_id +
								'&dest_db_name'			+ '=' + this.OtransferParams.dest_db_name +
								
								'&src_db_svr_id'		+ '=' + extraction_post_data.src_db_svr_id +
								'&src_db_name'			+ '=' + extraction_post_data.src_db_name +
								

								'&on_error_rollback'	+ '=' + (extraction_post_data.on_error_stop_n_do_a_rollback == 'checked' ? 'true':'false') +
								//'&do_stop_on_error'		+ '=' + this.OtransferParams.do_stop_on_error +
								'&show_error_only'		+ '=' + (extraction_post_data['enable_debug_mode_'+tabCounter] == 'checked' ? 'false':'true') +
								//'&transfer_mode'		+ '=' + 'MODE_CLONING_DATA' +
								'&entity_ready_id'		+ '=' + varInTab[ this.tabCounter ].OcloneCopy.entity_ready_id +
								
								'&copy_transfer_id'		+ '=' + varInTab[ this.tabCounter ].OcloneCopy.copy_transfer_id +
								'&table_name'			+ '=' + varInTab[ this.tabCounter ].OcloneUi.main_table +
								'&primary_key_name'		+ '=' + varInTab[ this.tabCounter ].OcloneUi.main_primary_key +
								'&object_id'			+ '=' + this.OtransferParams.primary_key_values
							;
	if(!real_one){
		
		callback_fct = this.real_post_paste_transfer_callback(this.tabCounter, this.dest_db_index); 
	}else{
		/*var post_data_string	= '&ajax=true'
								+ '&paste_transfer_id'	+ '=' + paste_transfer_id
								+ '&copy_transfer_id'	+ '=' + varInTab[ this.tabCounter ].OcloneCopy.copy_transfer_id
								;*/
									// Now that we have the transferId, let's PASTE data FOR REAL !!!
		post_data_string	+= '&paste_transfer_id'		+ '=' + paste_transfer_id;

		callback_fct = function( back ){
			if( back !== 'OK_PASTE_SQL_FINISHED_NO_PHP_BUG' 
				//&& back !== 'stopped_due_to_cancelled' 
				&& back !== 'CANCELLED_BY_USER'
				//&& back !== 'stopped_due_to_sql_error'
				){
				showDivAlert(back, 'Data Transfer Error');
			}else{
				// TRANSFER ENDED SUCCESFULLY !!
			}
		};
		$('#button_remove_ifr_data_extraction' +  this.tabCounter).show();		
		this.isTransferringNow = true;
	}
	$.post( Opages.clone_data_paste.php_url, post_data_string, callback_fct);
};
// This call back just get Aback.paste_transfer_id and it post again to same URL and last call back is within !
js_Class_Clone_Paste.prototype.real_post_paste_transfer_callback = function( tabCounter, dest_db_index ){
	return function(back, textStatus) { // only way to pass paste_html_id to check_ajax_response_first_2_chars_is_ok
		if(!check_ajax_response_first_2_chars_is_ok(back,'real_post_paste_transfer_callback', /*PARAM**COMMA**CALLBACK**HERE*/
			{ 'tabCounter' : tabCounter, 'dest_db_index' : dest_db_index}, function(params){ showReplayWhenLoggedOut(params.tabCounter, params.dest_db_index);}
		)){
			if(back !== 'Ide::YOU_ARE_NOW_LOGGED_OUT'){
				showDivAlert(back, 'Data Transfer Loading Error');
			}
		}else{
			var Aback = JSON.parse( back.substr(2) );
			var Othis = varInTab[ tabCounter ].OclonePaste[ dest_db_index ]; 
			
			Othis.paste_transfer_id = Aback.paste_transfer_id;
			
			//REAL TRANSFER LAUNCH cos true
			Othis.privatePostTransfer(true, Aback.paste_transfer_id, tabCounter);
			
			//REAL first progress request
			var local_index_of_ajax_updates , last_log_id; 
				local_index_of_ajax_updates = last_log_id = 1;
			getPasteProgressByAjax( Aback.paste_transfer_id, Othis.tabCounter, local_index_of_ajax_updates, last_log_id );
		}
	};
};
