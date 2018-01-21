// Not in an object goes need to back callable back really well, without object and may be idem if it was set Interval.
function getPasteProgressByAjax( paste_transfer_id, tab_counter, next_index_of_ajax_updates, last_log_id){
	js_log(Gdebug_debug_all || Gdebug_debug_1_db_check,'GO getPasteProgressByAjax');
	var post_data_string 		= 	   $('#form_to_clone_entity_data' + tab_counter).serialize();
	if(post_data_string === '' || varInTab[ tab_counter ].OcloneUi.cloning_cancelled === true){
		///alert(' tab counter=- ' + tab_counter + 'Perfect Tab has been closed so more pulling PASTE updates !! so cancelling paste'+$('#form_to_clone_entity_data' + tab_counter).html());
		post_data_string = 'tab_counter=' + tab_counter + '&transfer_id=' + paste_transfer_id + '&is_extraction=0';
		$.post(Opages.clone_copy_cancel.php_url, post_data_string, function(data){
			if(data != 'OK'){
				alert('Error cancelling cloNing on server : ' + data);
			}
		});
	}else{
		post_data_string = 'tab_counter=' + tab_counter + '&transfer_id=' + paste_transfer_id + '&is_extraction=0&' + post_data_string 
						 + '&ajax=true&index_of_ajax_updates=' + next_index_of_ajax_updates + '&last_log_id='+last_log_id;
		///alert('post_data_string === ' + post_data_string);
		js_log(Gdebug_debug_all || Gdebug_debug_1_db_check,'GO_AGAIN : $.post(Opages.clone_copy_progress.php_url' + post_data_string);
		$.post(Opages.clone_copy_progress.php_url, post_data_string, getPasteProgressByAjax_callback);
	}	
	js_log(Gdebug_debug_all || Gdebug_debug_1_db_check,'END getPasteProgressByAjax');
};
function getPasteProgressByAjax_callback( json ){
	js_log(Gdebug_debug_all || Gdebug_debug_1_db_check,'GO getExtractionProgressBy___Ajax_callback' + json);
	var AtoUpdate = JSON.parse( json ); 
	var next_index_of_ajax_updates = AtoUpdate.index_of_ajax_updates;
	var transfer_id = AtoUpdate.transfer_id;// dt_start, dt_end
	var tab_counter  = AtoUpdate.tab_counter;
	var dest_db_index  = AtoUpdate.dest_db_index;
	var last_log_id = AtoUpdate.last_log_id;
	var Acounters = JSON.parse( AtoUpdate.json_db_counters);
	var logs = '', Anew_logs_entries = AtoUpdate.logs_entries_ready;
	var final_coment = AtoUpdate.final_comment;
	var Opaste = varInTab[ tab_counter ].OclonePaste[ dest_db_index ];
	//dump(Acounters);
	// check if this ajax is not too late !
	if( parseInt(next_index_of_ajax_updates) < parseInt(Opaste.index_of_ajax_updates) ){
		console.log('Discarding late ajax answer cos '+next_index_of_ajax_updates+' < '+Opaste.index_of_ajax_updates);
		return;
	}else{
		Opaste.index_of_ajax_updates = next_index_of_ajax_updates;
		next_index_of_ajax_updates++;
	}
	
	Opaste.exec_progress( Acounters );

	var logs = '', local_paste_html_id =  'in_tab_' + tab_counter + '_target_' + dest_db_index;	
	for(var i = 0 ; i< Anew_logs_entries.length ; i++){ 
		log_id = Anew_logs_entries[i].log_id;
		logs += '<br>' + Anew_logs_entries[i].log_entry;
		if(log_id > last_log_id){last_log_id = log_id;}
	}
	if( logs !== ''){
		$('#html_sql_queries_' + local_paste_html_id).prepend( logs);// append / prepend NOK cos too much HTML for the browser => add links to get next query from DB 
		$('#html_sql_queries_' + local_paste_html_id).show();
	}	
	if( final_coment && final_coment != ''){
		$('#html_final_result_' + local_paste_html_id).html( final_coment ); 
		$('.easy_tool_tip').tooltip();
		$('#html_final_result_' + local_paste_html_id).css('visibility','visible');
	}	
///  *******************************************************  REAL SUCESS HERE !!!!!!!!!!!!!! ******************************    /
	//console.log('Paste update '+AtoUpdate.is_success);
	if( AtoUpdate.is_success != 0 ){
		///alert('Yes is sucees so stop timer');
		Opaste.isTransferringNow = false;
		clearInterval( Opaste.setIntervalForDuration ); Opaste.setIntervalForDuration = null;
		var time_left_html_id = 'div_html_time_left_' + Opaste.paste_html_id;
		$('#'+time_left_html_id).fadeOut();
		Opaste.update_ui( true );
		
		// Show replay + Change target buttons !
		$('#td_' + local_paste_html_id + '_button_replay').css('visibility','visible');
		$('#td_' + local_paste_html_id + '_button_view_data').show();
		
		// Show Change target buttons If all trsnfer are now finished!
			varInTab[ tab_counter ].OcloneCopy.nb_destination_done++;
		if(	varInTab[ tab_counter ].OcloneCopy.nb_destination_done === varInTab[ tab_counter ].OcloneCopy.nb_destination){
			$('#button_to_change_target_db'	+ tab_counter).show();
			$('#button_to_edit_entity'		+ tab_counter).show();
		}
		
		if(Gcurrent_user == 'autotest' || Gcurrent_user == 'remi' || Gcurrent_user == 'joe'){
			$('#td_' + local_paste_html_id + '_button_replay_special_debug').show();
		}
		if( AtoUpdate.is_success != 1 ){
			$('#td_' + local_paste_html_id + '_button_replay_no_errors').show();
			//alert('go untested show_transfer_error');
			//Opaste.show_transfer_error();
		}
		if( AtoUpdate.is_success == 1 && refresh_list_of_recent_transfers){
			refresh_list_of_recent_transfers();
			addStaticTab(true, Opages.recent_transfer ); // REfresh transfer history (if already opened though...)
		}
	}else{		
		js_log(Gdebug_debug_all || Gdebug_debug_1_db_check,'GO TIMEOUT to call getPasteProgressByAjax');
		setTimeout( 
			function(){ 
				getPasteProgressByAjax( transfer_id, tab_counter, next_index_of_ajax_updates, last_log_id);
			}, varInTab[ tab_counter ].OcloneUi.AJAX_PROGRESS_DELAY);//3.4 sec but still fast cos sometimes takes 5 sec to answer.
	}
	js_log(Gdebug_debug_all || Gdebug_debug_1_db_check,'END getExtractionProgressBy___Ajax_callback');

};
// so that user don't get stuch if transfer ID not returned or tranfer not started
function showReplayWhenLoggedOut(tab_counter, dest_db_index){
	var Opaste = varInTab[ tab_counter ].OclonePaste[ dest_db_index ];
	var paste_html_id = Opaste.paste_html_id;
	
	$("#td_"+paste_html_id+"_button_replay").css('visibility','visible');;

	if(Gcurrent_user == 'autotest'){
		$("#td_"+paste_html_id+"_button_replay_special_debug").show();
	}	
	
	if( Opaste.nb_error_previous_tranfer != 0){
		$("#td_"+paste_html_id+"_button_replay_no_errors").show();
	}
};

// Update the JS variable this.Aupdated_counter and this.Apasted_counter, then the UI.
js_Class_Clone_Paste.prototype.exec_progress = function( Anb_inserted_by_tables ){
	js_log(this.debug,'GO exec_progress ='+this.paste_html_id);
	this.i_query = 0;
	var nb_updated;
    if(typeof Anb_inserted_by_tables !== 'object'){
		console.log('Error : ' + Anb_inserted_by_tables);
		return;
    }
	for(var table_just_inserted_to in Anb_inserted_by_tables){
		// Only updating the JS variable, not yet the UI.
		nb_updated = Anb_inserted_by_tables[ table_just_inserted_to ];
		this.i_query += nb_updated;
		if(!G("td_" + this.paste_html_id + "_done_in_" + table_just_inserted_to)){
			// CAUSED BY NOT KNOWING THE PARENTS, SO ADD HERE DYNAMICALLLY NEW ROWS !! console.log('A>>>>Not found ID=' + "td_" + this.paste_html_id + "_done_in_" + table_just_inserted_to);
		}else{
			if(nb_updated !== 0){													// Increase NB records transfered.
				this.Apasted_counter[ table_just_inserted_to ] = nb_updated;
			}																		// Decrease NB records left to transfer.
			this.Aupdated_counter[ table_just_inserted_to ] = nb_updated;
		} 
	}

	var progressbar			= parent.$("#progressbar" + this.paste_html_id);
	var progressbarValue	= progressbar.find( ".ui-progressbar-value" );
		
	var d = new Date(); var now_time = d.getTime();
	var duration_so_far		= parseInt((now_time - this.exec_start_time)/1000			, 10);
	if(this.setIntervalForDuration === null && this.isTransferringNow === true){
		//setTimeout
		//alert('launch new timer');
		var self = this;
		this.setIntervalForDuration = setInterval( function(){ self.updateTimerValues(); }, 1000);
		duration_so_far = 1;
	}
	
	var percent_so_far		= parseInt((this.i_query / this.OtransferParams.nb_queries) * 100, 10);
	var expected_duration	= parseInt(duration_so_far / this.i_query * this.OtransferParams.nb_queries						, 10);
	var expected_time_left	= parseInt(expected_duration - duration_so_far													, 10) + 1;
	
	progressbar.progressbar( "option", {value: Math.floor( percent_so_far )});
	if( 1 < percent_so_far && percent_so_far < 199){ 
		progressbarValue.addClass('bg_orange');
		this.updateTimerValues(expected_time_left);
	}else{
		progressbarValue.removeClass('bg_orange').css({"background" : 'green' });
		this.updateTimerValues(null);
	}
	this.update_ui( false );
	js_log(this.debug,'END exec_progress ='+this.paste_html_id);
};
js_Class_Clone_Paste.prototype.updateTimerValues = function(expected_time_left_in_sec){
	var txt = '';
	///if(typeof duration_so_far_in_sec === 'undefined'){
		var d = new Date(); var now_time = d.getTime();
		duration_so_far_in_sec	= parseInt( (now_time - this.exec_start_time)/1000, 10);
	//}
	var duration_so_far = toHHMMSS(duration_so_far_in_sec);
	txt += 'Duration: ' + duration_so_far + '</span>';

	var hidden_html_id = 'html_time_left_' + this.paste_html_id;
	var time_left_html_id = 'div_html_time_left_' + this.paste_html_id;
	if(typeof expected_time_left_in_sec === 'undefined' || expected_time_left_in_sec === null){
		if( G(hidden_html_id) && (G(hidden_html_id).value - 1) > 0){
			expected_time_left_in_sec = G(hidden_html_id).value;
			expected_time_left_in_sec--;
			G(hidden_html_id).value = expected_time_left_in_sec;
		}
	}	
	if(typeof expected_time_left_in_sec !== undefined && expected_time_left_in_sec >= 0){
		if( G(hidden_html_id) && G(hidden_html_id).value > 0){
			if(G(hidden_html_id).value < expected_time_left_in_sec){
				//expected_time_left_in_sec = G(hidden_html_id).value; /// NEVER INCREASE TIME LEFT !!!    actually it may increase a lot if db becomes slower.
			}
		}
		if( !isNaN(expected_time_left_in_sec) && expected_time_left_in_sec >= 1){
			txt += '<input type="hidden" id="' + hidden_html_id + '" value="' + expected_time_left_in_sec + '">';
			var expected_time_left = toHHMMSS(expected_time_left_in_sec);
			txt += '<span id="' + time_left_html_id + '" style="margin-right:30px;float:right;">Approx. time left: ' + expected_time_left + "</span>";
		}else{
			txt += '<br>';   
		}
	}else{
		txt += '<br>';
	}
	$("#td_"+this.paste_html_id+"_transfer_status").html( txt );
}
js_Class_Clone_Paste.prototype.update_ui = function( is_final_update ){
	this.debug = false;
	js_log(this.debug,'GO update_ui ='+this.paste_html_id + ' is_final_update='+is_final_update);
	var paste_html_id = this.paste_html_id;
	var table_just_inserted_to;												// Increase NB records transfered.
	var total_inserted_or_updated = 0;
	var AtmpPasted	= this.Apasted_counter;
	var AtmpUpdated	= this.Aupdated_counter;
	// UPdate each counter : nb_ done
	for(table_just_inserted_to in AtmpPasted){
		var done_id = "td_" + paste_html_id + "_done_in_" + table_just_inserted_to;
		if(!G(done_id)){ console.log('B>>>>Not found ID=' + done_id); return; }
		G(done_id).innerHTML = AtmpPasted[ table_just_inserted_to ];
		total_inserted_or_updated += AtmpPasted[ table_just_inserted_to ];
	}
	var AextractionCounter = varInTab[ this.tabCounter ].OcloneCopy.Aextraction_counter;
	///dump(AextractionCounter);
																			// Decrease NB records left to transfer.
	for(table_just_inserted_to in AtmpUpdated){
		/*var todo_id = "td_" + paste_html_id + "_todo_in_" + table_just_inserted_to;
		if(!G(todo_id)){ console.log('C>>>>Not found ID=' + todo_id); return; }
		
		G(todo_id).innerHTML = AextractionCounter[ table_just_inserted_to ] - AtmpUpdated[ table_just_inserted_to ];
		*/																	// INCREASE NB records total transfered.		 dump
		var total_id = "td_" + paste_html_id + "_total_nb_records_transfered"; 
		if(!G(total_id)){ console.log('D>>>>Not found ID=' + total_id); return; }
		G(total_id).innerHTML = total_inserted_or_updated;///this.i_query; NOK when in mode ajax ui update
	}
	js_log(this.debug,'SOOn updating prograss bar text !!!');
	if(is_final_update){
		js_log(this.debug,'NOWWWWWWWWWWWWWW updating prograss bar text !!!');
		var progressbar = $( "#progressbar" + paste_html_id);
		var progressLabel = $( "#progress-label" + paste_html_id ); 
		var aa = this.i_query;
		var bb = this.OtransferParams.nb_queries;
		//var success =  aa == bb ? true : false;
		//var text = success ? "Completed" : "Error query " + aa + ' / ' + bb;//green
		var success = true;
		if(success){
			progressbar.progressbar( "option", {value: 100});
			var progressbarValue	= progressbar.find( ".ui-progressbar-value" );
			progressbarValue.css({"background" : 'green' });
		}
		var text = "Completed"; 
		progressLabel.text( text );
		js_log(this.debug,'DONE updating prograss bar text !!!' + progressLabel.text());
	}
	js_log(this.debug,'END update_ui ='+this.paste_html_id);
};

js_Class_Clone_Paste.prototype.show_transfer_error = function(){
	js_log(this.debug,'GO show_transfer_error ='+this.paste_html_id);

	var paste_html_id = this.paste_html_id;
	var error_counter = $("#error_counter_" + paste_html_id);
	var nb = error_counter.html();	nb++;	error_counter.html( nb );		// Increase NB errors.
	error_counter.parent().show();
	var progressbar	= parent.$("#progressbar" + paste_html_id);
	var progressbarValue	= progressbar.find( ".ui-progressbar-value" );
	progressbarValue.css({"background" : 'red' });
	js_log(this.debug,'END show_transfer_error ='+this.paste_html_id);
};
