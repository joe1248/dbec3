JsViewClass.prototype.get_html_transfer_master_div = function(tabCounter){
	return '<div class="nobr center">' +
				
				'<div id="div_cancel_continue_buttons' + tabCounter + '" style="position:absolute;padding-left:30px;padding:15px 35px;z-index:200;">' +
					'<input type="button" class="medium-button" value="Back" id="button_remove_ifr_data_extraction' + tabCounter +'">' +
					'<input type="button" style="margin-left:20px;" class="medium-button hidden" value="Edit entity" id="button_to_edit_entity' + tabCounter +'">' +
					'<br>' +
					'<input type="button" style="margin-top:20px;" class="medium-button hidden" value="Change Target DB" id="button_to_change_target_db' + tabCounter +'">' +
					
				'</div>' +
				'<div>' +				
					'<h2 id="html_transfer_title' + tabCounter +'" class="nobr centered">' +
					'</h2>' +
				'</div>' +
				'<div id="div_for_fix_dest_db_pbs' + tabCounter +'"></div>'+   /// eroors while fixing dbs... 
				'<div id="div_sql_file_description' + tabCounter +'" class="hidden">'+ 
				'</div>'+
				'<div id="div_to_change_target_db' + tabCounter +'" class="hidden">'+ 
				'</div>'+
				'<div id="div_for_bugs' + tabCounter +'" style="position:relative; left:25%; width:50%;top:20px;"></div>'+
				
				'<div id="div_master_paste' + tabCounter + '" class="hidden centered" style="position:relative;top:20px;"></div>'+

			'</div>';
};
 
JsViewClass.prototype.get_html_extraction_table_container = function(tabCounter, html_extraction_table){
	return	'<input type="button" style="margin-left:20px;" class="medium-button hidden" value="Extraction warnings" id="toggle_div_error_extraction' + tabCounter + '">' +
			'<div id="div_error_extraction'		+ tabCounter + '" class="center hidden"></div>'+
			'<div id="div_small_body_extraction'+ tabCounter + '" class="centered center" style="width:20%;">'+
				html_extraction_table + 
			'</div>';
};

JsViewClass.prototype.get_html_extraction_table = function(tabCounter, is_delete, html_rows, totalNbRecordsEctractedSoFar){
	return	'<table id="extraction_table" class="table_2_columns highlighted rounded-corners" style="margin-top:20px;padding:20px">' +
				'<tr>' + 
					'<th colspan="2" class="nobr">The total number of records ' + (!is_delete ? 'extracted' : 'ready to be deleted') + ' is ' +
						'<input type="hidden" id="hidden_has_extraction_finished' + tabCounter + '" value="false">' +
						'<span id="total_nb_records_extracted' + tabCounter + '">' + totalNbRecordsEctractedSoFar + '</span>' +
						'<br>'+
						'<input type="button" value="Continue" id="button_continue_confirm_exe' + tabCounter + '" style="float:right;top:7px;width:100%;" class="medium-button hidden"/>' +
						'<br>&nbsp;'+
					'</th>' +
				'</tr><tr><td>&nbsp;</td></tr>' +
				'<tr class="tr_color_alternate">' + 
					'<th>Table</th>' + 
					'<th class="align_right">Rows ' + (!is_delete ? 'extracted' : 'deleted') + '</th>' +
				'</tr>' +
				html_rows +
			'</table><br>';
};
