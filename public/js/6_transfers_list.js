function init_js_in_recent_transfer_ui(tabNumber) {	//alert(' yes in init_js_in_recent_transfer_ui tabNumber= ' + tabNumber);
	var Atransfers = varInTab[tabNumber].my_json;	//dump(Atransfers);
	var html = '', info = '', entity_label, label, transfer_idx, params, nb_transfers = Atransfers.length;
	$('#span_nb_transfers').html(nb_transfers);
	for( var obj, i=0 ; i < nb_transfers ; i++) {
		obj				= Atransfers[i];
		transfer_idx	= nb_transfers - i;
        entity_label	= obj.entity_ready_name;
		info = '[table]' +
					'[tr][td]Entity label	[/td][td]&nbsp;[/td][td]' + obj.entity_ready_name + '[/td][/tr]' +
					'[tr][td]Duration		[/td][td]&nbsp;[/td][td]duration_soon[/td][/tr]' +
					'[tr][td]Nb of queries	[/td][td]&nbsp;[/td][td]' + obj.nb_queries + '[/td][/tr]' +
				'[/table]';
        params =	' copy_transfer_id="' + obj.t_id1			+ '"' + // copy_sql_id
					' paste_transfer_id="' + obj.t_id2			+ '"' + // paste_sql_id
					' transfer_idx="' + transfer_idx			+ '"' +
					' html_entity_id="' + obj.entity_ready_id	+ '"' +
					' entity_label="' + entity_label			+ '"';
		html += 
			'<tr>' +
				'<td class="td_left_align"' +
					' sorttable_customkey="' + obj.t_id2 + '">' +				obj.label + 
				'</td>' +
				'<td class="td_right_align"' +
					' sorttable_customkey="' + obj.nb_bytes + '">' +			obj.size +
				'</td>' +
				'<td><input type="button"' +									' value="?" title="' + info + '"' +
							' class="small-button jqtooltip"></td>' +
				'<td><input type="button"' + params +
																				' value="Replay"' +
							' class="small-button button_recent_transfer_go">' +
                '</td>' +
                '<td>' +
					'<input type="button" ' + params +
																				' value="View data T' + transfer_idx + '"' +
                            ' class="small-button button_view_data_go">' +
                '</td>' +
            '</tr>';
	}
	// Render THEN add events !!
	$('.html_example').html(html);$('.html_example').attr('class', '');
	sorttable.init("sortable_history");
	reset_jquery_styles();
	add_events_to_recent_transfers_page_buttons();
	add_events_to_welcome_page_run_recent_transfers_buttons(); // buttons to replpay rey on same event as on welcome page	
	$('#div_recent_transfer_list').fadeIn();
}
