JsViewClass.prototype.get_html_transfer_1_target_div = function(OtransferParams, label_show_details, button_id, paste_html_id, ifr_or_div_id){
	return '<fieldset class="fieldset" style="width:80%;min-width:400px;">' +
			'<legend class="legend">Transfer to ' + OtransferParams.dest_db_svr_name + ' / ' + OtransferParams.dest_db_name + '</legend>' +
			'<div style="border:#000 solid 0px; height:35px;text-align:left;">'+
				'<span style="margin:5px;"><input value="' + label_show_details + '" id="' + button_id + '" type="button" class="small-button"></span>' +
				
				'<div id="html_final_result_' + paste_html_id + '" class="rounded-corners highlighted_strong" style="position:relative;margin-left:30px;margin-right:30px;width:40%;display:inline-block;padding:5px;"></div>' +
				
				'<span class="error_counter rounded-corners">&nbsp;&nbsp;Errors : <span id="error_counter_' + paste_html_id + '">0</span>&nbsp;&nbsp;</span>' +
		
				'<input  style="position:relative;display:none;left:10px;" type="button" value="R" id="td_' + paste_html_id + '_button_replay_special_debug">' +
/*				'<select style="position:relative;display:none;left:10px;" id="select_nb_times_' + paste_html_id + '">' +
					'<option>Once<option>'+
					'<option>Twice<option>'+
					'<option>3 times<option>'+
					'<option>10 times<option>'+
					'<option>100 times<option>'+
				'</select>' +
*/				'<input style="position:relative;visibility:hidden;left:10px;" type="button" value="Replay" id="td_' + paste_html_id + '_button_replay">' +
				'<input style="position:relative;display:none;left:10px;" type="button" value="Force" id="td_' + paste_html_id + '_button_replay_no_errors">' +
				'<input style="position:relative;display:none;left:10px;" type="button" value="View data" id="td_' + paste_html_id + '_button_view_data">' +
					//'" html_entity_id="' + OtransferParams.entity_id . '" transfer_idx="' . $transfer_idx . '"paste_transfer_id="' . $paste_sql_id . '" copy_transfer_id="' . $copy_sql_id . '" '.
					//					'entity_label="' . $entity_label . '" class="small-button button_view_data_go"></td>'
	
				'<div id="progressbar' + paste_html_id + '" class="final_progressbar">' + 
					'<div id="progress-label' + paste_html_id + '" class="final_progress-label">...</div>' +
				'</div>' +
			'</div>' + 
			'<div id="html_sql_queries_' + paste_html_id + '" class="rounded-corners hidden" style="position:relative;left:10px;top:12px;padding:20px;text-align:left;margin: 10px auto 20px auto; max-width:870px;max-height:250px;overflow:auto;white-space:normal;background:#fff;"></div>' +
			'<div id="' + ifr_or_div_id + '" class="center highlighted" style="position:relative;top:15px;"></div>' +
			'<br>' + // IMPORTANT to make up for top:15px so the container still resize on contant size properly
		   '</fieldset><br><br>';
};

JsViewClass.prototype.get_html_transfer_1_target_details = function(paste_html_id, AextractionCounter){
	html = '';
	html += '<div style="position:relative;width:100%;text-align:left;margin-left:20px;top:10px;">'+
				'Rows transfered : <span id="td_' + paste_html_id + '_total_nb_records_transfered">0</span>'+
			'</div>';
	html += '<div style="position:relative;width:500px;text-align:left;margin-left:20px;top:15px;" id="td_' + paste_html_id + '_transfer_status">'+
				'Duration : 00:00:00' +
			'</div>';
	html += '<table class="table_4_columns center">' +
				"<tr>" +
					'<th class="table_column">Table</th>' +
					//'<th class="align_right">Source</th>' +
					'<th class="align_right">Number of records transferred</th>' +
					//'<th class="align_right">Left to transfer</th>' +
				"</tr>";
	var nb, table, display;
	for(table in AextractionCounter){
		nb = AextractionCounter[ table ];
		//table = table.toLowerCase();
		display = (nb === 0) ? 'none' : 'table-row';
		html += '<tr class="tr_color_alternate" style="display:' + display + ' !important;">' +
					'<td style="text-indent:20px;">'	+ table + '</td>' + 
					//'<td class="align_right">' 			+ nb 	+ '</td>' + 
					'<td class="align_right" id="td_' + paste_html_id + "_done_in_" + table + '">0</td>' +
					//'<td class="align_right" id="td_' + paste_html_id + "_todo_in_" + table + '">' + nb + '</td>'
				'</tr>';
	}
	html += '</table><br>&nbsp;';
	return html;
};
