//? VIEW_DATA  JS
var lastScrollLeft_1, lastScrollLeft_2, lastScrollTop_1, lastScrollTop_2;
lastScrollLeft_1 = lastScrollLeft_2 = lastScrollTop_1 = lastScrollTop_2 = 0; 

function init_js_in_db_explorer_ui(tabNumber){
    var Anodes = varInTab[tabNumber].my_json;
	varInTab[tabNumber].GO_js_tree = new GO_tree(tabNumber, 'div_pick_a_db_to_explore', 'GOtree_tables_db_explorer', '','0','db','0','0','0');
	varInTab[tabNumber].GO_js_tree.initiliase_tree("Your DB connections",false);
	var load_first_level_GO_js_tree = function(){ 
		varInTab[tabNumber].GO_js_tree.parse_one_folder_call_back('OK' + JSON.stringify(Anodes));
	}; 
	setTimeout(load_first_level_GO_js_tree,1);
        reset_jquery_styles();
}
$(document).ready(function(){
	// GET width in px of the fieldset (ok to define in %), and report this px width to its inner table !
    var w = $('#db_explorer_right').width();
	$('.data_tables').css('max-width',w + 'px');
	$('.data_tables').css('width',w + 'px');
    var h = $('#html_content_tab_tab_db_explorer').height() - 100;
	$('.data_tables').css('max-height',h + 'px');
	$('.data_tables').css('height',h + 'px');
	GO_tree.prototype.get_data_from_server_for_db_explorer = function(data){
        ///dump(data); 
		var post_data = {
			tab_counter :	this.tabCounter,
            limit       :	$('#select_db_explorer_limit_' + this.tabCounter).val(),
			table		:	data.table_name,
            db_svr_id   :   data.db_svr_id,
            db_name     :   data.db_name
		};
		var this_tabCounter = this.tabCounter;
		show_central_spinner();
		var table_results = "#div_table_results_" + this_tabCounter;
		$.post( Opages.db_explorer_get_data.php_url, post_data, function(back){
			if(check_ajax_response_first_2_chars_is_ok(back,' callback of get_data_from_server')){
				back = back.substr(2);
				$.current_table_viewed_name = child_node_id;
				$.current_table_viewed_pk_name = '';
				var records = jQuery.parseJSON(back);
				var nb1 = records.length;
				$("#div_table_results_title_"  + this_tabCounter).html(' the table: ' + data.db_name + '.' + data.table_name + ' (' + nb1 + ' rows)');
				if (nb1 === 0) {
					$(table_results).html('The table `' + data.db_name + '.' + data.table_name + '` is empty.');
				} else {
					$(table_results).html('');
					$($.makeTableSimple(records, 'sortable_src_'+child_node_id, 'src_row')).appendTo(table_results);
				}
				
				$(table_results).scrollLeft(0);
				$(table_results).scrollTop(0);
				try{
					sorttable.init('sortable_src_'+child_node_id);
				}catch(e){
					console.log('ok1');
				}
				$('.sortable_src_'+child_node_id+'>thead>tr>th').first().trigger( "click" );
			}
			hide_central_spinner();
		});
		
		
		// ----------------------------- ON SORT SOURCE columns ----------------------------
		$(table_results).unbind().on('click', 'th', function() {
			var dest_id   = $(this).attr('id').replace('src_row', 'dest_row');
			try{
				sorttable.innerSortFunction.apply(G(dest_id), []);
			}catch(e){
				//console.log('ok2');
			}
		});
		
		// ----------------------------- ON click ON SOURCE lines ------ ---------------------
		$(table_results).on('click', 'tr', {'this_tabCounter':this.tabCounter, 'object_tree':this}, function (event) {
			var this_tabCounter = event.data.this_tabCounter;
			var object_tree = event.data.object_tree;
			// If nont the first line : lineof th
			if (typeof $(this).attr('id_there') !== 'undefined'){
				$(table_results + ' tr').css('background-color','');
				$(this).css('background-color','yellow');
				//KEEP cos nice : console.log($(this).attr('class') + ' ---->  ' + $(this).attr('id_there'));
				$('#bottom tr').css('background-color','');
				if ($('#bottom').find('* [id_here="dest_row' + $(this).attr('id_there') + '"]').length === 0) {
					console.log('Not found in target : ID=' + $(this).attr('id_there'));
				} else {
					console.log('OK in target : ID=' + $(this).attr('id_there'));
				}
				
				$('#bottom').find('* [id_here="dest_row' + $(this).attr('id_there') + '"]').css('background-color','yellow');
				
				// IF Not a leaf table, then adding filters on click !
				var nb_childs = getNbPropertiesInObject( object_tree.Gnodes[$.current_table_viewed_name].children );
				if( nb_childs ){
					var filter_params = {
						'sql_table_filtered'	: $.current_table_viewed_name,
						'sql_primary_key_name'	: $.current_table_viewed_pk_name,
						'sql_prim_key_value_src'  : $(this).attr('id_here').substr('src_row'.length),
						'sql_prim_key_value_dest' : $(this).attr('id_there')
					};
					object_tree.add_new_view_data_filter(filter_params, this_tabCounter);
				}
			}
		});
		
	};// END OF FUNCT : get_data_from_server
	



	$.recolor_table_row = function(table_target_id){
		$(table_target_id).find("tr").removeClass("row2").removeClass("row1");
		$(table_target_id).find("tr").filter(":odd").addClass("row1");
		$(table_target_id).find("tr").filter(":even").addClass("row2");
	};
	
	$.makeTableSimple = function (mydata, class_table, row_src_or_dest) {
		var table = $('<table class="' + class_table + '" border="1"></table>');
		var tblHeader = "<tr>";
		var i = 0;
		for (var k in mydata[0]) {
			if ($.current_table_viewed_pk_name === '') {
				$.current_table_viewed_pk_name = k;			// Finger crossed first column is alays primary key, + the only one...
			}
			tblHeader += '<th id="th_' + row_src_or_dest + '_' + k + '">' + k + (i!==0 ? "</th>" : '<span id="sorttable_sortfwdind"> ▴</span></th>');
			i++;
		}
		tblHeader += "</tr>";
		$('<thead>' + tblHeader + '</thead>').appendTo(table);
		
		var tblBody = '<tbody>';
		$.each(mydata, function (index, value) {
			var TableRow = '<tr';
			var i = 0;
			$.each(value, function (key, val) {
				if (i===0) {
					TableRow += //' id_there="' + Anew_ids[val] + '"' 
                                ' id_here="' + row_src_or_dest + val + '">';
				}	
				if (i===0)	TableRow += "<td><b>" + val + "</b></td>"; // ID column is the first one !
				else		TableRow += "<td>" + val + "</td>";
				i++;
			});
			TableRow += "</tr>";
			tblBody += TableRow;
		});
		tblBody += '</tbody>';
		$(table).append(tblBody);
		if (mydata.length >= 9) {
			$('<tfoot>' + tblHeader + '</tfoot>').appendTo(table);
		}
		return ($(table));
	};

});
