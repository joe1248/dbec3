// Ultimate check, used once sometimes twice before each cloning !
js_Class_Clone_Ui.prototype.check_if_similar_dbs = function(check_mode){
	var url = Opages.clone_data_check.php_url;
	var post_data = html_form_to_object('form_to_clone_entity_data' + this.tabCounter);
	post_data.tab_counter = this.tabCounter;
 	post_data.check_mode = check_mode;
 	this.checkMode = check_mode;
 
 	if(check_mode !== 'fake_just_main_table'){
		this.changeTransferTitle('1_db_compare');
	}

	///dump(post_data);
	$.ajax({
		context : this,
		type: "POST",
		url: url,
		data: post_data,
		cache: false,
		success: this.callback_db_check_if_similar,
		error: function (XMLHttpRequest, textStatus, errorThrown) {
			if(XMLHttpRequest.responseText != ''){
				console.log("ajax error trying to check_ifsimilar_dbs :"+XMLHttpRequest.responseText);
			}
		}
	});
};
js_Class_Clone_Ui.prototype.callback_db_check_if_similar = function(back){
	if(!check_ajax_response_first_2_chars_is_ok(back,' callback of clone_data_check to see if db are similar !', /*PARAM**COMMA**CALLBACK**HERE*/
		 { 'thisOCloneUi' : this}, function(params){ params.thisOCloneUi.remove_ifr_data_extraction();}
	)){

        return;
	}
	var i, j, one_form, html='', inner_html, json = back.substr(2);
	var AtargetDbs; 
	if(json.substr(0,1) !== '<'){
		AtargetDbs = JSON.parse(json);
		for(i in AtargetDbs){
			// Tables missing in target DB
			inner_html = this.get_html_for_missing_tables_or_fields('Tables' , AtargetDbs[i].missing_tables);
			// Fields missing in target DB
			inner_html += this.get_html_for_missing_tables_or_fields('Fields' , AtargetDbs[i].missing_fields);
			// Foreign Keys missing in entity == EXTRA keys in target DB
			inner_html += this.get_html_for_missing_tables_or_fields('ForeignKeys' , AtargetDbs[i].missing_foreign_keys);
			
			if(inner_html !== ''){
				html += '<h4>In target DB ' + AtargetDbs[i].name + ' (id:' + AtargetDbs[i].id + '):</h4>' +
						'<form id="form_differences_to_fix_' + i + '">' +
						'<ul>' + 
							'<input type="hidden" name="dest_db_name" value="' + AtargetDbs[i].name + '">' +
							'<input type="hidden" name="dest_db_id" value="' + AtargetDbs[i].id	+ '">' ;
				html += inner_html + 
						'</ul></form>';
			}
		}
	}
	if(html !== ''){
		html = 'Sorry but Source and Target DB schema(s) are not exactly the same.<br>Differences that matter are below, how do you want to proceed ?' +
				html + 
				'<br><input id="submit_check_db_similar_choices" value="Continue cloning" type="button">';
				
		this.changeTransferTitle('2_db_fixer');

		hide_central_spinner();
		$('#div_for_bugs'	+ this.tabCounter).html( html ).fadeIn();
		
		$('#submit_check_db_similar_choices' ).click( {'object_js_Class_Clone_Ui' : this }, function(event){
			var one_form, new_post_data = []; 
			for(i in AtargetDbs){
				one_form = html_form_to_object('form_differences_to_fix_' + i);
				new_post_data.push( one_form );
			}
			var Othis = event.data.object_js_Class_Clone_Ui;
			var tab_counter = Othis.tabCounter;
			var tmp = html_form_to_object('form_to_clone_entity_data' + tab_counter);
			var post_data = {
				'data_to_fix_targets'	: JSON.stringify( new_post_data ),
				'src_db_svr_id'			: tmp.src_db_svr_id,
				'src_db_name'			: tmp.src_db_name,
				'entity_ready_id'		: tmp.entity_ready_id
			};
			$.post( Opages.clone_data_fix_db.php_url, post_data, function(data_back){ 
				//this.callback_after_db_fixed(data_back); 
					/*console.log( 'callback_after_db_fixed : ' + data_back ); 
					console.log( 'callback_after_db_fixed : ' + tab_counter ); 
					console.log( 'callback_after_db_fixed : ' + Othis.tabCounter ); */
					if(data_back !== 'OK' && data_back !== 'RE_CHECK_SIMILARITIES'){
						$('#div_for_fix_dest_db_pbs'	+ tab_counter).html( data_back ).show();
						return;
					}
					if (data_back === 'RE_CHECK_SIMILARITIES') {
						Othis.start_data_extraction(tab_counter);	// will recall again check db similar...
					} else {// OK
						//this.check_if_similar_dbs('fake_just_main_table');
						Othis.start_data_extraction(tab_counter, 'all_ignored');	// will recall again check db similar...
					}
			});
		});
	}else{
		// All good so start extracting cash !!
		// AFTER DBS have been checked, it returns the new transfer_id instead of a no_pbs empty array !
		var data = json;
		var expected = Amenu_labels.OTO_TEST_INPUT_TEXT_BACK_FROM_DB_CHECKED;
		if(data.substr(0, expected.length) !== expected){
			alert('error222 prog because data = '+ data + ' not likke expected '+expected);
			return;
		}
		var transfer_id = data.substr(expected.length, data.indexOf('>') - 1 - expected.length);
		///var transfer_id = typeof AtargetDbs.transfer_id !== 'undefined' ? AtargetDbs.transfer_id : 0;
			
		if( transfer_id === 0 ){
			alert('Error transfer_id not found in now dumped AtargetDbs');
			dump( AtargetDbs );
			return;
		}
		
		// Now get again which DB have been validated as similar !!! so also works when changing target
		json = json.substr(json.indexOf('>')+1);
		var AtargetDbs = JSON.parse(json);

		if(AtargetDbs.length === 0){
			hide_central_spinner();
			showDivAlert('No valid target DB has been selected.');
			varInTab[ this.tabCounter ].GO_js_tree_db_destination.init_h3_db_tree_title('destination');
			$('#clone_' + this.tabCounter + 'dest_db_svr_id'	).val('');
			$('#clone_' + this.tabCounter + 'dest_db_name'		).val('');	
			this.show_div_bottom();

			if(varInTab[ this.tabCounter ].OcloneUi.cloneUiMode !== 'mode_new_target_db'){
				this.remove_ifr_data_extraction(); // Back to cloning UI => remove_extraction_div
			}
			return;
		}
					
		var dest_db_ids = '', dest_db_svr_name = '', dest_db_names = '';
		GA_validated_id_multi_selected = [];

		for(i in AtargetDbs){
			dest_db_ids		+= AtargetDbs[i].db_id		+ '#';
			dest_db_names	+= AtargetDbs[i].db_name	+ '#';
			dest_db_svr_name = AtargetDbs[i].db_id;
			if(typeof Aconnections_db !== 'undefined'){
				for(var j in Aconnections_db){
					if(Aconnections_db[j].id === AtargetDbs[i].db_id){
						dest_db_svr_name = Aconnections_db[j].connection_name;
						break;
					}
				}
			}
			
			GA_validated_id_multi_selected.push( AtargetDbs[i].db_id + '_O-O_' + AtargetDbs[i].db_name + '_O-O_' + dest_db_svr_name + '_O-O_back.html_id');
		}
		//dump(GA_validated_id_multi_selected);
		$('#clone_' + this.tabCounter + 'dest_db_svr_id'	).val(dest_db_ids.substr(	0,	dest_db_ids.length		- 1));
		$('#clone_' + this.tabCounter + 'dest_db_name'		).val(dest_db_names.substr(	0,	dest_db_names.length	- 1));	
		varInTab[ this.tabCounter ].GO_js_tree_db_destination.update_h3_db_tree_title('destination');
	//alert('Perfect$checkMode = transfer_id  = '+ transfer_id );
		if(transfer_id === 'fake_just_main_table'/* || transfer_id === 'all_ignored'*/){
			return;
		}
		
		
		if(varInTab[ this.tabCounter ].OcloneUi.cloneUiMode === 'mode_new_target_db'){
			if(AtargetDbs.length !== 0){
				///alert(varInTab[ this.tabCounter ].OcloneUi.cloneUiMode + ' here you should expect paste id maybe if extraction done or file ');
				varInTab[ this.tabCounter ].OcloneCopy.extraction_is_soon_finished();
			}
			return;
		}

		if(-1 === js_in_array(varInTab[ this.tabCounter ].OcloneUi.cloneUiMode, ['mode_normal', 'mode_historic'])){
			alert('Erro maybe cos mode is ' + varInTab[ this.tabCounter ].OcloneUi.cloneUiMode );
			return;
		}

		var form_id_to_post = 'form_to_clone_entity_data' + this.tabCounter;
		var tmp = html_form_to_object( form_id_to_post );
		//alert('Creating a new Copy object so save confim is reset here !');
		///dump(tmp);
		varInTab[ this.tabCounter ].OcloneCopy = new js_Class_Clone_Copy( this.tabCounter,
			tmp.entity_ready_id,
			(tmp.delete_sql 			=== 'true'		? true : false),
			false, //(tmp.show_confirm_dialog	=== 'checked'	? true : false),
			1,//			', '  . count($Adest_db_svr_id) . '' .   HOW USEFULLL IS TAHT ??? maybe substrcount # in tmp.dest_db_svr_id
			transfer_id
			);
		///alert('Yes object created '+varInTab[ this.tabCounter ].OcloneCopy);
		js_log(Gdebug_debug_all || Gdebug_debug_1_db_check,'GO $.post( Opages.clone_data_copy.php_url'+ '&tab_counter=' + this.tabCounter + '&transfer_id='+transfer_id);

		varInTab[ this.tabCounter ].OcloneUi.cloning_cancelled = false;
		var first_index_of_ajax_updates = 1, last_log_id = 1;
		var tabCounter = this.tabCounter; // to pass to the setimeout !!!
		setTimeout( 
			function(){  
				getExtractionProgressByAjax( transfer_id, tabCounter, first_index_of_ajax_updates, last_log_id ); // FIRST CALL
			}, 2000
		);
		///var post_data = html_form_to_object(form_id_to_post);
		var post_data_string = '&ajax=true&' + $('#' + form_id_to_post).serialize();
		post_data_string += '&tab_counter=' + this.tabCounter + '&transfer_id='+transfer_id;
		var param_counter = this.tabCounter;
		// Dbs have been checked successfully so extraction start OK
		postToserverPassingJsVarToo(Opages.clone_data_copy.php_url, post_data_string, param_counter);
		
		varInTab[ this.tabCounter ].OcloneUi.changeTransferTitle('3_extraction_in_progress');
	}
};
	
function postToserverPassingJsVarToo(url, php_data_one_one_object, js_data_tab_counter/** ADD MORE JS VAR HERE  AND BELOW !! */){
    // Use a get request to get the page at URL
    $.post(url, php_data_one_one_object, function(html, status) { 
    	eventPhpScriptRunningTransferHasEnded(html, status, js_data_tab_counter/** ADD MORE JS VAR HERE  AND ABOVE  !! */) 
    });
};

function eventPhpScriptRunningTransferHasEnded(back, status, tabCounter){// Status is auto by jquery ajax and usually  success !!!
	back = back.trim();
	var isPHPerror = back !== '<input type="text" value="OK copy entity done without PHP error" id="answer_copy_entity_go_worked">';
	if( back === 'CANCELLED_BY_USER'){
		varInTab[ tabCounter ].OcloneUi.cloning_cancelled = true;
	}
	else if(isPHPerror){
		showDivAlert(back, 'Extraction Fatal Error');
		varInTab[ tabCounter ].OcloneUi.cloning_cancelled = true;
	}
};
			
function getExtractionProgressByAjax( transfer_id, tabCounter, next_index_of_ajax_updates, last_log_id ){
	js_log(Gdebug_debug_all || Gdebug_debug_1_db_check,'GO getExtractionProgressBy____Ajax');
	//var post_data = html_form_to_object('form_to_clone_entity_data' + this.tabCounter);
	var post_data_string 		= 	   $('#form_to_clone_entity_data' + tabCounter).serialize();
	if(post_data_string === '' || varInTab[ tabCounter ].OcloneUi.cloning_cancelled === true){
		///alert('Perfect Tab has been closed so no more pulling EXTRACTION updates by CANCELLING THIS extraction post_data_string='+post_data_string+' cos tabcounter='+tabCounter);
		post_data_string = 'tab_counter=' + tabCounter + '&transfer_id=' + transfer_id + '&is_extraction=1';
		$.post(Opages.clone_copy_cancel.php_url, post_data_string, function(data){
			if(data != 'OK'){
				alert('Error cancelling extraction on server : ' + data);
			}
		});
	}else{
		///alert('paasing last log id = '+last_log_id);
		post_data_string = 'tab_counter=' + tabCounter + '&transfer_id=' + transfer_id + '&is_extraction=1&' + post_data_string 
						 + '&ajax=true&index_of_ajax_updates=' + next_index_of_ajax_updates
						 + '&last_log_id=' + last_log_id;
		///a_lert('post_data_string === ' + post_data_string);
		js_log(Gdebug_debug_all || Gdebug_debug_1_db_check,'GO_AGAIN : $.post(Opages.clone_copy_progress.php_url' + post_data_string);
		$.post(Opages.clone_copy_progress.php_url, post_data_string, getExtractionProgressByAjax_callback);
	}	
	js_log(Gdebug_debug_all || Gdebug_debug_1_db_check,'END getExtractionProgressBy___Ajax');
};
function getExtractionProgressByAjax_callback( json ){
	js_log(Gdebug_debug_all || Gdebug_debug_1_db_check,'GO getExtractionProgressBy---Ajax_callback' + json);
	
	hide_central_spinner();
	// One check that must be done but big pb if user actually gets logget out while extracting ???
	// Well extraction will finish, so really, you like JS to believe taht user is still logging in ===> no real fct BACK to be called here !!!!
	// BUT not even testable cos tab_counter unknown UNless json is passed back ---->  FIND A WAY TO SATY LOGGING IN TRHOUGH EXTRACTION !
	// Probably the way, though is : { 'thisOCloneCopy' : this}, this.remove_ifr_data_extraction)
	///if(check_ajax_response_first_2_chars_is_ok(json,'getExtractionProgressBy---Ajax_callback'/*, this.remove_ifr_data_extraction*/))
	
	
	//a_lert('LOOK for tab_counter in JSON IS BACK = IIIIIIIIIIIIITTTTTTTTTTTTTTTTTTTT  isssssssssss missssssssssssssinggggggggggggggg   !!!!' + json);
	var AtoUpdate = JSON.parse( json ); 
	///dump(AtoUpdate);
	var next_index_of_ajax_updates = AtoUpdate.index_of_ajax_updates;
	var transfer_id = AtoUpdate.transfer_id;// dt_start, dt_end
	var tab_counter  = AtoUpdate.tab_counter;
	var last_log_id = AtoUpdate.last_log_id;
	// check if this ajax is not too late !
	if( parseInt(next_index_of_ajax_updates) < parseInt(varInTab[ tab_counter ].OcloneCopy.index_of_ajax_updates) ){
		console.log('Discarding late ajax answer cos '+next_index_of_ajax_updates+' < '+varInTab[ tab_counter ].OcloneCopy.index_of_ajax_updates);
		return;
	}else{
		varInTab[ tab_counter ].OcloneCopy.index_of_ajax_updates = next_index_of_ajax_updates;
		next_index_of_ajax_updates++;
	}
	var Acounters = JSON.parse( AtoUpdate.json_db_counters);	
	
	varInTab[ tab_counter ].OcloneCopy.show_extraction_progress( Acounters ); 
	
	var logs = '', Anew_logs_entries = AtoUpdate.logs_entries_ready, log_id;
	for(var i = 0 ; i< Anew_logs_entries.length ; i++){ 
		log_id = Anew_logs_entries[i].log_id;
		logs += '<br> ** ' + Anew_logs_entries[i].log_entry;
		if(log_id > last_log_id){last_log_id = log_id;}
	}
	///a_lert('back with last log id = '+last_log_id);
	if( logs !== ''){
		$('#toggle_div_error_extraction' + tab_counter).show();
		$('#div_error_extraction' + tab_counter).prepend( logs);// append / prepend NOK cos too much HTML for the browser => add links to get next query from DB 
	}
	
	/// YES if !=0 means extraction finished !!!
	if( AtoUpdate.is_success != 0 ){
		if( $('#save_in_data_file' + tab_counter).val() === 'checked' ){
			refresh_list_of_sql_file_ready_to_paste();
		}
		varInTab[ tab_counter ].OcloneCopy.Aextraction_counter = Acounters; // USefull ?? 
		varInTab[ tab_counter ].OcloneCopy.extraction_is_soon_finished( AtoUpdate.nb_queries );		
		
	}else{
		js_log(Gdebug_debug_all || Gdebug_debug_1_db_check,'GO TIMEOUT to call getExtractionProgressBy----Ajax');
		setTimeout( 
			function(){ 
				///alert('Go 2nd call to getExtractionProgressBy___Ajax : transfer_id='+transfer_id + ' and tab_counter='+tab_counter);
				getExtractionProgressByAjax( transfer_id, tab_counter, next_index_of_ajax_updates, last_log_id );
				///alert('DONE 2nd call to getExtractionProgressBy___Ajax : transfer_id='+transfer_id + ' and tab_counter='+tab_counter);
			}, varInTab[ tab_counter ].OcloneUi.AJAX_PROGRESS_DELAY);
	}
	js_log(Gdebug_debug_all || Gdebug_debug_1_db_check,'END getExtractionProgressBy__Ajax_callback');

};

/*js_Class_Clone_Ui.prototype.callback_after_db_fixed = function(back_data){
	if(back_data !== 'OK'){
		console.log( 'callback_after_db_fixed : ' + back_data ); 
		$('#div_for_fix_dest_db_pbs'	+ this.tabCounter).html( back_data ).show();
		return;
	}
	this.start_data_extraction();
};*/

js_Class_Clone_Ui.prototype.get_html_for_missing_tables_or_fields = function(tables_or_fields, AmissingOnes){
	var id, label, title, html = '';
	var i_table = 0, i_field, i_key;
	// FOR EACH TARGET BUT NB the function is called 3 times !!! ==> only ONE case at a time really !
	for(var j in AmissingOnes){
		switch(tables_or_fields){
			case 'Tables':
				if(i_table === 0){
					html += '<li>' + tables_or_fields + ' missing:</li><br><ul>';
				}
				i_table++;
				id = 'Tables__' + AmissingOnes[j];
				label = AmissingOnes[j];
				html += '<li>' + this.getOptionsForOnemissing( id ) + 
								'&nbsp;&nbsp;&nbsp;Table <b>' + label + '</b>' + 
						'</li>';
				break;
			case 'Fields':
				i_field = 0;
				for(var k in AmissingOnes[j]){
					if(i_field === 0){
						title = 'Fields missing in table <b>' + j + '</b>';
						html += '<br><li>' + title + '</li><br><ul>';
					}
					i_field++;
					id = 'Fields__' + AmissingOnes[j][k] + 'Tables__' + j;
					label = AmissingOnes[j][k];
					html += '<li>' + this.getOptionsForOnemissing( id ) + 
									'&nbsp;&nbsp;&nbsp;Field <b>' + label + '</b>' + 
							'</li>';
				}
				if(i_field !== 0){
					html += '</ul>';
				}
				break;
			case 'ForeignKeys':
				// ANOTHER LOOP MISING FOR HEN STATUS + AmissingOnes[j][k]['state']   can be missing_key OR wrong_key
				title = 'Foreign key constraint:<b>' + AmissingOnes[j]['constraint'] + ' is missing in entity table (' + AmissingOnes[j]['table'] + ')</b>';
				html += '<br><li>' + title + '</li><br><ul>';
				id = 'Foreign_Key__' + AmissingOnes[j]['constraint'] + 'Tables__' + AmissingOnes[j]['table'];
				label = 'It is pointing to the table:' + AmissingOnes[j]['key_details']['ref_table'] 
												+ ' (' + AmissingOnes[j]['key_details']['ref_column'] + ')';
				html += '<li>' + this.getOptionsForOnemissingForeignKey( id ) + 
								'&nbsp;&nbsp;&nbsp;Foreign Key Column <b>' + label + '</b>' + 
						'</li>';
				html += '</ul>';
				//	dump(AmissingOnes);
				break;
			default: console.log('Error prog : type of missing stuff nok: '+tables_or_fields);
		}
	}
	if(i_table !== 0){
		html += '</ul>';
	}
	return html;
};
// If extra table / fied in target db, who cares, but if extra foreign keys, that can break the transfer, so it cannot be ignored. (Except for cron jobs by setting FK_check=0)
js_Class_Clone_Ui.prototype.getOptionsForOnemissingForeignKey = function(select_id){
	return	'<select name="' + select_id + '">' + ///'[db_' + db_index + ']">' +
				'<option value="drop_in_dest">	Drop constraint in target DB</option>' +
				'<option value="add_to_entity">	Add constraint in entity</option>' + // BUT YOU or USER MUST REFRESH ENTITY ALSO !!  VERY HARD TO DO BOTH ?!?!
			'</select>';
};
// If missing table / field in target DB, I may avoid to extract it if user choose :"ignore this time", but where to remember that choice ???
// ideally, it should be a default choice so that a cron job can behave the same without user confirmation, 
// ===> you need to recheck if tables/fields DO exists in target db BEFORE attemtimg to execute paste queries.
js_Class_Clone_Ui.prototype.getOptionsForOnemissing = function(select_id){
	return	'<select name="' + select_id + '">' + ///'[db_' + db_index + ']">' +
				'<option value="ignore">	Ignore this time			</option>' +
				'<option value="create">	Create in target DB			</option>' +
				'<option value="exclude">	Exclude from entity			</option>' +
			'</select>';
};
