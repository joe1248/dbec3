//? VIEW_DATA  JS

var lastScrollLeft_1, lastScrollLeft_2, lastScrollTop_1, lastScrollTop_2;
lastScrollLeft_1 = lastScrollLeft_2 = lastScrollTop_1 = lastScrollTop_2 = 0; 
//? ENTITIES_CREATE  JS to init tree

function init_js_in_subset_viewer_ui(tabNumber){
	var MAX_ENTITY_COPIABLE_AT_ONCE = 150;	
	var backEndData = varInTab[tabNumber].my_json;
	varInTab[tabNumber].Groot_label = backEndData.main_entity.table;
	varInTab[tabNumber].GOtree_tables_to_view_data = new GOpureJsTree('js_only_tree_of_tables_to_view_data_'+tabNumber, 'GOtree_tables_to_view_data', tabNumber, '["icon_table"]');
	varInTab[tabNumber].GOtree_tables_to_view_data.js_only_tree_initiliase(backEndData.main_entity, varInTab[tabNumber].Groot_label, true, true, true);
	varInTab[tabNumber].GOtree_tables_to_view_data.get_data_from_server(backEndData.main_entity.table);
	reset_jquery_styles();
}
$(document).ready(function(){
	reset_jquery_styles();
	
	$.current_table_viewed_name = '';
	$.current_table_viewed_pk_name = '';
	$.filters_view_data = [];
	$.prevent_source_triggered_again_by_me = false;
	$.prevent_target_triggered_again_by_me = false;
	// GET width in px of the fieldset (ok to define in %), and report this px width to its inner table !
	var w = $('#top').width();
	$('.data_tables').css('max-width',w + 'px');
	$('.data_tables').css('width',w + 'px');
	
	GOpureJsTree.prototype.get_data_from_server = function(child_node_id){
		var data = {
			tab_counter :	this.tabCounter,
			table		:	child_node_id,
			limit		:	$('#select_view_data_limit_' + this.tabCounter).val(),
			filters		:	JSON.stringify($.filters_view_data)
		};
		var this_tabCounter = this.tabCounter;
		data = jQuery.extend(data, varInTab[this_tabCounter].my_json.Otransfer);
		data = jQuery.extend(data, {'paste_transfer_id':varInTab[this_tabCounter].my_json.Otransfer.t_id2});//PASTE ID was needed !
		show_central_spinner();
		var table_src_id = "#div_table_source_" + this_tabCounter;
		var table_target_id = "#div_table_target_" + this_tabCounter;
		$.post( Opages.data_viewer_get_data.php_url, data, function(back){
			if(check_ajax_response_first_2_chars_is_ok(back,' callback of get_data_from_server')){
				back = back.substr(2);
				$.current_table_viewed_name = child_node_id;
				$.current_table_viewed_pk_name = '';
				var records = jQuery.parseJSON(back);
				records[0] = typeof records[0] !== 'undefined' ? records[0] : [];
				records[1] = typeof records[1] !== 'undefined' ? records[1] : [];
				var nb1 = records[0].length;
				var nb2 = records[1].length;
				$("#data_view_src_title_"  + this_tabCounter).html(' in table: ' + child_node_id + ' (' + nb1 + ' rows)');
				$("#data_view_dest_title_" + this_tabCounter).html(' in table: ' + child_node_id + ' (' + nb2 + ' rows)');

				//var nb3 = records[2].length;
				var Anew_ids = {}, Aold_ids = {};
				for (var i = 0 ; i < records[2].length ; i++) {
					var ids = records[2][i];
					Anew_ids[ids.old_id] = ids.new_id;
					Aold_ids[ids.new_id] = ids.old_id;
				}
				if (nb1 === 0) {
					$(table_src_id).html('No data copied from that table: ' + child_node_id);
				} else {
					$(table_src_id).html('');
					$($.makeTable(records[0], Anew_ids, 'sortable_src_'+child_node_id, 'src_row')).appendTo(table_src_id);
				}
				
				if (nb2 === 0) {
					$(table_target_id).html('No data copied to that table: ' + child_node_id);
				} else {
					$(table_target_id).html('');
					$($.makeTable(records[1], Aold_ids, 'sortable_dest_'+child_node_id, 'dest_row')).appendTo(table_target_id);
				}
		
				$(table_target_id).scrollLeft(0);
				$(table_target_id).scrollTop(0);
				try{
					sorttable.init('sortable_dest_'+child_node_id);
					sorttable.init('sortable_src_'+child_node_id);
				}catch(e){
					console.log('ok1');
				}
				$('.sortable_src_'+child_node_id+'>thead>tr>th').first().trigger( "click" );
				//$.prevent_target_triggered_again_by_me = true;
				// AUTOMATIC !!! $('.sortable_dest_'+child_node_id+'>thead>tr>th').first().trigger( "click" );
			}
			hide_central_spinner();
		});
		
		
		// ----------------------------- ON SORT SOURCE columns ----------------------------
		$(table_src_id).unbind().on('click', 'th', function() {
			/*if ($.prevent_source_triggered_again_by_me === true || $.prevent_target_triggered_again_by_me === true) {
				console.log('preventing again update of target');
				$.prevent_target_triggered_again_by_me = false;
				setTimeout(function(){$.prevent_source_triggered_again_by_me = false;}, 500);
				return;
			} */
			
			var dest_id   = $(this).attr('id').replace('src_row', 'dest_row');
			//console.log('GO again update from ' + $(this).attr('id') + ' to ' + dest_id);
			//$.prevent_target_triggered_again_by_me = true;
			//$('#' + dest_id).trigger( "click" );
			try{
				sorttable.innerSortFunction.apply(G(dest_id), []);
			}catch(e){
				//console.log('ok2');
			}
			//console.log('target sorted....');
			//re color the table after sorting !!!
			$.recolor_table_row(table_src_id);	$.recolor_table_row(table_target_id);
			
		});
		// ----------------------------- ON SORT TARGET columns ----------------------------
		$(table_target_id).unbind().on('click', 'th', function() {
			/*if ($.prevent_source_triggered_again_by_me === true || $.prevent_target_triggered_again_by_me === true) {
				$.prevent_source_triggered_again_by_me = false;
				setTimeout(function(){$.prevent_target_triggered_again_by_me = false;}, 500);
				console.log('preventing again update of source');
				return;
			}*/
			//console.log('GO again update of target');
			var src_id   = $(this).attr('id').replace('dest_row', 'src_row');
			try{
				sorttable.innerSortFunction.apply(G(src_id), []);
			}catch(e){
				console.log('ok3');
			}
			console.log('source sorted....');
			//$.prevent_source_triggered_again_by_me = true;
			//BUGGY... $('#' + src_id).trigger( "click" );
			//re color the table after sorting !!!
			$.recolor_table_row(table_src_id);	$.recolor_table_row(table_target_id);
		});
		
		// ----------------------------- synchronise scrolling SOURCE ---------------------
		$(table_src_id).on('scroll', {'this_tabCounter':this.tabCounter}, function (event) {
			var trigger = 10;
			var this_tabCounter = event.data.this_tabCounter;
			var currentScrollLeft_1 = $(this).scrollLeft();
			if (Math.abs(lastScrollLeft_1 - currentScrollLeft_1) > trigger) {
				$('#div_table_target_' + this_tabCounter).scrollLeft(currentScrollLeft_1);
				lastScrollLeft_1 = currentScrollLeft_1;
			}
			var currentScrollTop_1 = $(this).scrollTop();
			if (Math.abs(lastScrollTop_1 - currentScrollTop_1) > trigger) {
				$('#div_table_target_' + this_tabCounter).scrollTop(currentScrollTop_1);
				lastScrollTop_1 = currentScrollTop_1;
			}
		});
		// ----------------------------- synchronise scrolling TARGET ---------------------
		$(table_target_id).on('scroll', {'this_tabCounter':this.tabCounter}, function (event) {
			var this_tabCounter = event.data.this_tabCounter;
			var trigger = 10;
			var currentScrollLeft_2 = $(this).scrollLeft();
			if (Math.abs(lastScrollLeft_2 - currentScrollLeft_2) > trigger) {
				$('#div_table_source_' + this_tabCounter).scrollLeft(currentScrollLeft_2);
				lastScrollLeft_2 = currentScrollLeft_2;
			}
			var currentScrollTop_2 = $(this).scrollTop();
			if (Math.abs(lastScrollTop_2 - currentScrollTop_2) > trigger) {
				$('#div_table_target_' + this_tabCounter).scrollTop();
				$('#div_table_source_' + this_tabCounter).scrollTop(currentScrollTop_2);
				lastScrollTop_2 = currentScrollTop_2;
			}
		});
		// ----------------------------- ON click ON SOURCE lines ------ ---------------------
		$(table_src_id).on('click', 'tr', {'this_tabCounter':this.tabCounter, 'object_tree':this}, function (event) {
			var this_tabCounter = event.data.this_tabCounter;
			var object_tree = event.data.object_tree;
			// If nont the first line : lineof th
			if (typeof $(this).attr('id_there') !== 'undefined'){
				$(table_src_id + ' tr').css('background-color','');
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
		// ----------------------------- ON click ON TARGET lines ------ ---------------------
		$(table_target_id).on('click', 'tr', function() {
			// If not the first line : line of th
			if (typeof $(this).attr('id_there') !== 'undefined'){
				$(table_target_id + ' tr').css('background-color','');
				$(this).css('background-color','yellow');
				//KEEP cos nice : console.log($(this).attr('class') + ' ---->  ' + $(this).attr('id_there'));
				$('#top tr').css('background-color','');
				$('#top').find('* [id_here="src_row' + $(this).attr('id_there') + '"]').css('background-color','yellow');
				if ($('#top').find('* [id_here="src_row' + $(this).attr('id_there') + '"]').length === 0) {
					console.log('Not found in source : ID=' + $(this).attr('id_there'));
				} else {
					console.log('OK in source : ID=' + $(this).attr('id_there'));
				}
			}
		});
		
	};// END OF FUNCT : get_data_from_server
	



	$.recolor_table_row = function(table_target_id){
		$(table_target_id).find("tr").removeClass("row2").removeClass("row1");
		$(table_target_id).find("tr").filter(":odd").addClass("row1");
		$(table_target_id).find("tr").filter(":even").addClass("row2");
	};
	
	$.makeTable = function (mydata, Anew_ids, class_table, row_src_or_dest) {
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
					TableRow += ' id_there="' + Anew_ids[val] + '" id_here="' + row_src_or_dest + val + '">';
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

	$.refresh_filters_display = function (this_tabCounter) {
		// refresh the whole display
		//console.log('NB fiters = ' + $.filters_view_data.length);
		for (var html_1 = '', html_2 = '', idx = 0, i = 0 ; i < $.filters_view_data.length ; i++) {
			var one_filter = $.filters_view_data[i];
			if (typeof one_filter === 'undefined') continue;
			if (idx === 0)	html = '<pre style="margin: 5px;"><b>Filters:</b>&nbsp;&nbsp;&nbsp;<b>WHERE</b>&nbsp;';
			else			html = '&nbsp;<b>AND</b>&nbsp;';
			var filter_key =  one_filter.sql_table_filtered;
			html +=  one_filter.sql_primary_key_name + ' = ';
			html_1 += html + one_filter.sql_prim_key_value_src + '<span span_type="filter" filter_key="' + filter_key + '" style="display:inline-block; color:black;">&nbsp;X</span>';
			html_2 += html + one_filter.sql_prim_key_value_dest;
			idx++;
		}
		$('#div_source_filters_' + this_tabCounter).html(html_1 + '</pre>');
		$('#div_target_filters_' + this_tabCounter).html(html_2 + '</pre>');
		
		$('span[span_type="filter"]').click(function(){
			for (var i = 0 ; i < $.filters_view_data.length ; i++) {
				var one_filter = $.filters_view_data[i];
				if (typeof one_filter === 'undefined') continue;
				if (one_filter.sql_table_filtered === $(this).attr('filter_key')) {
					delete $.filters_view_data[i];
				}
			}
			$.refresh_filters_display(this_tabCounter);
		});
	};
	GOpureJsTree.prototype.add_new_view_data_filter = function(filter_params, this_tabCounter) {
		// UNLESS CTRL IS PRESSED : Remove any same table filter
		var removeItem = $.current_table_viewed_name;
		for (var i = $.filters_view_data.length - 1 ; i >=0  ; i--) {
			var one_filter = $.filters_view_data[i];
			if (typeof one_filter === 'undefined') continue;
			if (one_filter.sql_table_filtered === removeItem) {
				$.filters_view_data.splice(i , 1 );
			}
		}
		// add new one
		$.filters_view_data.push(filter_params);
		
		$.refresh_filters_display(this_tabCounter);
		//console.log('adding display filters = ' + this_tabCounter + html_2);
	};
});
