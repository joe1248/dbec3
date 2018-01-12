// access "parent" object : varInTab[ this.tabCounter ].OcloneUi.

$(document).ready(function(){

	GO_tree.prototype.getSvrIdAndNameAndDbNAme = function(html_id){
		nod = this.Gnodes[html_id];
		if(!nod){// Happens when favorite has been deleted
			console.log('Error mat ecos html_id = \n'+html_id+'\n n0t found in Gnodes');
			return ['Error html_id \n'+html_id+'\n not found',
					'Error html_id \n'+html_id+'\n not found',
					'Error html_id \n'+html_id+'\n not found'];
		}
		// if it is a favorite : it has tag_svr_name, tag_svr_id, tag_db_name
		var Aback = [];
		if(nod && nod.tag_svr_name){
			var Adb_svr_id		= nod.tag_svr_id.split('#');
			var Adb_svr_name	= nod.tag_svr_name.split('#');
			var Adb_name		= nod.tag_db_name.split('#');
			for(var i=0 ; i < Adb_name.length ; i++){
				Aback.push( [ Adb_svr_id[i], Adb_name[i], Adb_svr_name[i] ] );
			}
		}else{
			var html_id_parent = this.get_parent_node(html_id);
			db_svr_id = this.Gnodes[html_id_parent].php_sql_id;			
			db_name		= js_replace('/','', nod.fileName);
			db_svr_name = js_replace('/','', nod.shortPath);
			Aback.push( [db_svr_id, db_name, db_svr_name] );
		}
		return Aback;
	};//this.GA_id_multi_selected is being used in dialog, so either use a different or find a way to detetct at least the onclose the REOPEN the WHOLE DEST TREE !!!
	GO_tree.prototype.getThreeDbDetailsArrays = function(Ahtml_id){
		var Adb_details, Aagain_html_id, Adb_svr_name=[], Adb_svr_id = [], Adb_name = [];
		for(var i=0 ; i < Ahtml_id.length ; i++){
			Aagain_html_id = this.getSvrIdAndNameAndDbNAme( Ahtml_id[ i ] );// ANY ==> FOR LOOP !
			// If it was a bookmar => may have more than !
			for(var j=0 ; j < Aagain_html_id.length ; j++){
				Adb_details = Aagain_html_id[j];
				Adb_svr_id.push(			Adb_details[0] );
				Adb_name.push(				Adb_details[1] );
				Adb_svr_name.push(			Adb_details[2] );
			}
		}
		return [Adb_svr_id, Adb_name, Adb_svr_name, Ahtml_id]; 
	};
	GO_tree.prototype.getValidatedDbsReadyToPost = function(source_or_destination, true_for_really_validated){
		var html_id, mode = varInTab[ this.tabCounter ].OcloneUi.cloneUiMode;
		if( this.tree_div_name !== 'div_favorites_dbs' && 
			(	mode === 'mode_historic' ||											// Only one dest DB
				mode === 'mode_new_target_db' && source_or_destination === 'source' // OK mamy dest db
			) ){
			var back;
			if(source_or_destination === 'destination'){
				//alert('1 target cos mode ='+varInTab[ this.tabCounter ].OcloneUi.cloneUiMode);
				back=	[	$('#clone_'+this.tabCounter+'dest_db_svr_id'	).val(),
							$('#clone_'+this.tabCounter+'dest_db_name'		).val(),
							$('#clone_'+this.tabCounter+'dest_db_svr_name'	).val(),
							''
						];
			}else{
				// tree.getHtmlIdFromRelPath( tree.get_connection(), 
				html_id =  this.getHtmlIdFromRelPath( this.get_connection(),	$('#clone_'+this.tabCounter+'src_db_svr_name'	).val() + 
																				'/' + 
																				$('#clone_'+this.tabCounter+'src_db_name'		).val()	
				);
				this.GA_id_multi_selected[0] = html_id;//'fake_one_cos_no_tree_yet';
				back=	[	$('#clone_'+this.tabCounter+'src_db_svr_id'		).val(),
							$('#clone_'+this.tabCounter+'src_db_name'		).val(),
							$('#clone_'+this.tabCounter+'src_db_svr_name'	).val(),
							''
						];
			}
			///alert('@so soon validating '+source_or_destination);
			///dump(back);
			return back;
		}
		
		var Atmp, db_svr_id = '', db_name = '', db_svr_name = '';
		html_id = '';
		if(source_or_destination === 'destination'){
			// IMPOSSIBLE YET TO VALIDATE group of destination DB.
			var AthreeArrays = [];					/// // Now closing tree even before check so more responsive, so temporary fake array of targets...
			//alert('NOTHING in GA_validated_id_multi_selected so getting instead GA_id_multi_selected='+this.GA_id_multi_selected.length);
			if(true_for_really_validated === false || GA_validated_id_multi_selected.length === 0){
				Atmp = this.GA_id_multi_selected;
				AthreeArrays = this.getThreeDbDetailsArrays(Atmp);
				db_svr_id	= AthreeArrays[0].join('#');
				db_name		= AthreeArrays[1].join('#');
				db_svr_name = AthreeArrays[2].join('#');
				html_id		= AthreeArrays[3].join('#');
			}else{
				Atmp = GA_validated_id_multi_selected;//GA_validated_id_multi_selected.push( back.db_svr_id + '_O-O_' + back.db_svr_name + '_O-O_' + back.db_name + '_O-O_' + back.html_id);
				for(var i=0 ; i<Atmp.length ; i++){
					var tmp = Atmp[i].split('_O-O_');
					db_svr_id	+= tmp[0] + (i == Atmp.length-1 ? '' : '#');
					db_name		+= tmp[1] + (i == Atmp.length-1 ? '' : '#');
					db_svr_name += tmp[2] + (i == Atmp.length-1 ? '' : '#');
					html_id		+= tmp[3] + (i == Atmp.length-1 ? '' : '#');
				}
			}
		}else{
			html_id = this.GA_id_multi_selected[0];
			if(!this.Gnodes[html_id]){
				console.log('Error AGAIIN mat ecos html_id = '+html_id+' npt found in Gnodes');
				return;
			}
			Adb_details = this.getSvrIdAndNameAndDbNAme(html_id);// SOURCE ==> [0] is enough !
			db_svr_id	= Adb_details[0][0];
			db_name		= Adb_details[0][1];
			db_svr_name	= Adb_details[0][2];
		}
		if(debug) console.log(db_svr_id + ' - '+ db_name + ' - '+ db_svr_name + ' - '+ html_id);
		return [db_svr_id, db_name, db_svr_name, html_id];
	};
	GO_tree.prototype.copy_entity_db_chosen = function(){
		if( typeof varInTab[ this.tabCounter ].OcloneUi === 'undefined'){
			console.log('Error creeating object OcloneUi');
			return;
		}
		var post_data = {
			'html_id'		: '', // used to unselect invalid destination
			'db_svr_id'		: '',
			'db_name'		: '',
			'main_table'	: varInTab[ this.tabCounter ].OcloneUi.main_table,
			'primary_key'	: varInTab[ this.tabCounter ].OcloneUi.main_primary_key,
			'src_or_dest'	: ''
		};
		if(this.tree_div_name == 'div_db_tree_source'){
			if(this.GA_id_multi_selected.length === 0){
				showDivAlert('You must select one source database....');
				return;
			}
			Adb_details = this.getValidatedDbsReadyToPost('source', false);
			post_data.html_id = this.GA_id_multi_selected[0];	// needed for JS callback
			post_data.db_svr_id	= Adb_details[0];			// needed by PHP
			post_data.db_name	= Adb_details[1];			// needed by PHP
			post_data.limit = 1000;	/// 1000 ids is a bit too many no ???
			if( isNaN(post_data.db_svr_id) || post_data.db_svr_id <= 0){
				alert('Erro getting source db_svr_id in copy_entity_db_chosen Adb_details='+Adb_details+ ' cos this.GA_id_multi_selected[0]='+this.GA_id_multi_selected[0]);
				return;
			}
			// Prevent rechecking which IDs available to copy if source DB did not actually change !
			if( varInTab[ this.tabCounter ].OcloneUi.last_chosen_db_source !== post_data.db_svr_id + '_' + post_data.db_name || 
				varInTab[ this.tabCounter ].OcloneUi.last_list_of_ids === null){
				varInTab[ this.tabCounter ].OcloneUi.last_chosen_db_source   = post_data.db_svr_id + '_' + post_data.db_name;
				varInTab[ this.tabCounter ].OcloneUi.last_list_of_ids = null;
				post_data.src_or_dest = 'src';
				$.ajax({
					context:this,
					type: "POST",
					url: pos + "page_ajax_get_records_ids_from_src", // GET list of IDs for the HTML SELECT element
					data: post_data,
					//cache: false,
					success: this.db_src_chosen_call_back,
					error: ajax_error_handler
				});
			}
			// no need to update UI unless more normal
			if(varInTab[ this.tabCounter ].OcloneUi.cloneUiMode !== 'mode_normal'){
				return;
			}
			this.update_h3_db_tree_title('source');			// show chosen DB in a text form
			$('#clone_'+this.tabCounter+'src_db_svr_id').val(db_svr_id);
			$('#clone_'+this.tabCounter+'src_db_name').val(db_name);
			///a_lert('db choooooosen '+db_svr_id+ ' - '+db_name);
			$('#div_first_question').show();
			varInTab[ this.tabCounter ].OcloneUi.init_font_second_answer();
			varInTab[ this.tabCounter ].OcloneUi.init_font_third_answer();
		}else{
			if(this.GA_id_multi_selected.length === 0){
				showDivAlert('You must select at least one destination database....');
				return;
			}
			$("#button_submit_db_destination").parent().hide();
			post_data.limit = 1;
			GA_validated_id_multi_selected = [];
			var i, svr_name, perso_db_id;
			var Aagain_html_id, Adb_details, A_id_multi_selected_to_check = []; // Only used to check for duplicate : same server /same DB name
			for(i=0 ; i < this.GA_id_multi_selected.length ; i++){
				html_id = this.GA_id_multi_selected[ i ];
				Aagain_html_id = this.getSvrIdAndNameAndDbNAme(html_id); // ===DEST so FOR LOOP
				for(var j=0 ; j < Aagain_html_id.length ; j++){
					Adb_details = Aagain_html_id[j];
					perso_db_id = Adb_details[0] + '/' + Adb_details[1];
					A_id_multi_selected_to_check.push(perso_db_id);
				}
			}
			
			// Hide tree immediatly, showing selection of targets unvalidateds
			if(varInTab[ this.tabCounter ].OcloneUi.cloneUiMode !== 'mode_new_target_db'){
				this.update_h3_db_tree_title('destination');
			}
			// "i" is DECREASING because IT IS removING DUPLICATES WITHIN the loop !!!
			for(i=this.GA_id_multi_selected.length-1 ; i >= 0  ; i--){
				html_id = this.GA_id_multi_selected[ i ];
				Aagain_html_id = this.getSvrIdAndNameAndDbNAme(html_id);  // ===DEST so FOR LOOP
				for(var k=0 ; k < Aagain_html_id.length ; k++){
					Adb_details = Aagain_html_id[k];
					// AJAX POST DB details 1 BY 1 ! cos unvalidated yet ALL NEEDED cos will be added to A-validated
					post_data.html_id	= html_id;//Add new fa
					post_data.db_svr_id = Adb_details[0];
					post_data.db_name	= Adb_details[1];
					post_data.db_svr_name	= Adb_details[2];
					perso_db_id = Adb_details[0] + '/' + Adb_details[1];
					A_id_multi_selected_to_check = removeValueFromArray(A_id_multi_selected_to_check, perso_db_id);
					/*var order = js_in_array(perso_db_id, A_id_multi_selected_to_check);
					// IF still in the array just fater you removed it from there ==> it was twice => skip that one !
					if( order !== -1){
						if(debug) console.log(order + 'This database is already selected : ' + post_data.db_svr_name + ' / ' + post_data.db_name);
						///this.invalidate_chosen_destination( html_id, false ); // NOT SURE IF USEFULL !!!
					}else{
						if(debug) console.log(order + 'FINNALY A NEW DB not duplicate : ' + post_data.db_svr_name + ' / ' + post_data.db_name);
						// CHECK if DB main table exits AND Get the last 1 id, so user can choose to also delete the previously inserted entity_id.
						post_data.src_or_dest = 'dest';
						// NOT USED var url = pos + Opages.clone_data_get_ids.php_url; // Checks target target does Exists + get LAST_ID !!!
			
						if(varInTab[ this.tabCounter ].OcloneUi.cloneUiMode !== 'mode_new_target_db'){ // Reject doing fake DB comparison !!!
							$.post(url, post_data, this.db_dest_chosen_call_back( this.tabCounter ) );
						}
					}*/
				}
			}
			if(varInTab[ this.tabCounter ].OcloneUi.cloneUiMode === 'mode_new_target_db'){ // DO real DB comparison !!!
				this.update_h3_db_tree_title('destination');
				$('#button_remove_ifr_data_extraction' +  this.tabCounter).hide();//// HIDE TEMPO COS BUG if user goes back during db check, cos mode will change so extraction would start instead of paste file
				varInTab[ this.tabCounter ].OcloneUi.check_if_similar_dbs('no_copy_transfer_required');
			}else{ 
				varInTab[ this.tabCounter ].OcloneUi.check_if_similar_dbs('fake_just_main_table');// normal transfer but without real comparison
			}
		}
	};
	/*  now all dest DB handled at once in callback_db_check_if_similar.
	
	GO_tree.prototype.db_dest_chosen_call_back = function( tabCounter ){
		return function(json, textStatus) { // only way to pass paste_html_id to check_ajax_response_first_2_chars_is_ok
			if(check_ajax_response_first_2_chars_is_ok(json,'db_dest_chosen_call_back')){
				var back = JSON.parse(json.substr(2));
				///var tree_to_refresh_obj = varInTab[ this.tabCounter ].GO_js_tree_db_destination;
				var Othis = varInTab[tabCounter].GO_js_tree_db_destination;
				if( Othis.GA_id_multi_selected.length===0 || js_in_array(back.html_id, Othis.GA_id_multi_selected) === -1){
					//alert('Well done : ignoring ajax call back cos user change its mind quicker than ajax !'+back.html_id);
					//dump(Othis.GA_id_multi_selected);
					return;
				}else{
					//alert('Next timemate:' +Othis.GA_id_multi_selected.length);
				}
				if( back.error !== ''){
					//// ONE DAY JUST ACTUALLY PRINT FLASH MESSAGE COS TOO BORING : showDivAlert(back.error, 'Please check again :', true);
					Othis.invalidate_chosen_destination( back.html_id, false );
				}else{
					GA_validated_id_multi_selected.push( back.db_svr_id + '_O-O_' + back.db_name + '_O-O_' + back.db_svr_name + '_O-O_' + back.html_id);
					var last_id = ' ( ID = ' + back.Aids[1] + ' ) ';
					if( G('last_id')){
						$('#last_id').html(last_id);
					}
				}
				Othis.update_h3_db_tree_title('destination');
			}
		};
	};*/
	// INvalidate chosen destination by unslecting it UNless it is a favorite   ( WHAT THE POINT ?, just remove from selected items array)
	/*GO_tree.prototype.invalidate_chosen_destination = function( html_id ){
		if(js_in_array(html_id, this.GA_id_multi_selected) !== -1){
			this.bro2_multi_select_no_limits(html_id);// unselect invalid DB + remove it from this.GA_id_multi_selected
		}else{
			// Happens cos 1 favorites can contain several wrong dbs !!
		}
		if( this.GA_id_multi_selected.length === 0 ){
			this.init_h3_db_tree_title('destination');
		}
	};*/
	
	GO_tree.prototype.update_h3_db_tree_title = function(source_or_destination){
		var html =	'<table style="width:100%;">';
		var Adb_name, Adb_svr_name, Adb_details = this.getValidatedDbsReadyToPost(source_or_destination, true); // true_for_really_validated !
		var first_html_id, Ahtml_ids = []; // just to check if ONLY 1 favorite has been selected => no need for Add to favorites button !
		if(Adb_details.length === 0){
			///a_lert('New bug patched when nothing validated stay open tree');
			this.init_h3_db_tree_title(source_or_destination);
		}
		
		if(source_or_destination === 'destination'){
			$('#clone_'+this.tabCounter+'dest_db_svr_id').val(Adb_details[0] );
			$('#clone_'+this.tabCounter+'dest_db_name').val(	Adb_details[1]   );
			Adb_name					=		Adb_details[1].split('#');
			Adb_svr_name				=		Adb_details[2].split('#');
			Ahtml_ids					=		Adb_details[3].split('#');
			first_html_id = Ahtml_ids[0];
		}else{
			db_svr_id		= Adb_details[0];
			db_name			= Adb_details[1];
			db_svr_name		= Adb_details[2];
			first_html_id	= Adb_details[3];
			
			varInTab[ this.tabCounter ].OcloneUi.shown_db_source_label = db_svr_name + ': ' + db_name;
		}
		var buttons = '<span style="float:right;">'+
				// if favorite === tag_svr_name is favoorite name ???
				(typeof this.Gnodes[   first_html_id   ] !== 'undefined'  && typeof this.Gnodes[   first_html_id   ].tag_svr_name !== 'undefined' ? '' :
					' <img id="button_add_fav_db_' + source_or_destination + 
					'" src="../html_cdn/images_icon/star.jpg" class="float_right" width="25px" alt="Add as favorite DB '+source_or_destination+'">'
				)+
			'&nbsp;&nbsp;'+
				'<input  id="button_to_change_db_' + source_or_destination + '" type="button" class="float_right small-button" value="Change">'+
			'</span>';
		
		if(source_or_destination === 'destination'){
			for( var i = 0 ; i < Adb_svr_name.length ; i++){
				var name = Adb_svr_name[i] + ' : ' + Adb_name[i];
				html += '<tr><td colspan="2" class="float_right_container big_line">' + name + (i===0 ? buttons : '') + '</td></tr>';
			}
		}else{
			html += '<tr><td colspan="2" class="float_right_container">' + db_svr_name + ' : ' + db_name + buttons + '</td></tr>';
		}
		html += '<tr><td colspan="2">'+
					' <div id="div_to_name_fav_db_' + source_or_destination + '" style="display:none;height:120px;" class="little_box centered">'+
						'<h3>New Favorite DB ' + source_or_destination + ' : </h3><br>' +
						'<span class="user_instruction nowrap">'+
							'Enter a name : <input type="text" id="input_new_favorite_name'+source_or_destination+'" value="" size="50" style="width:200px;">'+
						' </span>'+
						' <br><br>'+
						'<input id="button_cancel_new_fav_db_' + source_or_destination + '" type="button" class="user_instruction small-button" value="Cancel" />'+
						'<input id="button_submit_new_fav_db_' + source_or_destination + '" type="button" class="user_instruction small-button" value="Add favorite DB now" style="margin-left:40px;"/>'+
					' </div>'+
				'</td></tr>'+
				'</table>';
		$('#div_db_tree_' + source_or_destination+'_chosen').html( html );
		
		// Temporary because if user changes after selected a wrong target, bug cos the first bad request may overtake the second good request !
		if(source_or_destination === 'destination' && varInTab[ this.tabCounter ].OcloneUi.cloneUiMode == 'mode_new_target_db'){
			$('#button_to_change_db_' + source_or_destination).hide();///css('visibility','hidden');
		}
		
		$('#button_cancel_new_fav_db_' + source_or_destination).click( {'object_tree' : this}, function(event) {
			$('#div_to_name_fav_db_' + source_or_destination).slideUp();
			$('#button_add_fav_db_' + source_or_destination).fadeIn();
		});
		$('#button_add_fav_db_' + source_or_destination).click( {'object_tree' : this}, function(event) {
			$('#div_to_name_fav_db_' + source_or_destination).slideDown();
			$('#button_add_fav_db_' + source_or_destination).fadeOut();
			var db_details = event.data.object_tree.getValidatedDbsReadyToPost(source_or_destination, true);
			var svr_name = db_details[2];
			var db_name  = db_details[1];
			if(db_details[2].indexOf('#') > 0){
				svr_name = db_details[2].substr(0, db_details[2].indexOf('#'));
				db_name  = db_details[1].substr(0, db_details[1].indexOf('#'));
			}
			$('#input_new_favorite_name' + source_or_destination).val( svr_name + ' - ' + db_name );
			$('#input_new_favorite_name' + source_or_destination).focus();
		}); 
		$('#button_submit_new_fav_db_' + source_or_destination).click( {'object_tree' : this}, function(event) {
			try_launching_save_new_favorite(source_or_destination, event.data.object_tree);
		});
		$('#input_new_favorite_name' + source_or_destination).keydown( {'object_tree' : this}, function(event) {
			if(event.keyCode==13){
				try_launching_save_new_favorite(source_or_destination, event.data.object_tree);
			}
		});
		var try_launching_save_new_favorite = function( source_or_destination, object_tree ){
			if( $('#input_new_favorite_name' + source_or_destination).val() === '' ){
				$('#input_new_favorite_name' + source_or_destination).css('background-color', 'yellow');
				$('#input_new_favorite_name' + source_or_destination).show( "pulsate" );
			}else{
				//alert('Yes submit_multi_db_choices( ' + source_or_destination);
				object_tree.submit_multi_db_choices(source_or_destination);
				$('#div_to_name_fav_db_' + this.source_or_destination).slideUp();
			}
		};
		$('#button_to_change_db_' + source_or_destination).click( {'object_tree' : this}, function(event) {
			var object_tree	= event.data.object_tree;
			varInTab[ object_tree.tabCounter ].OcloneUi.changeMode('mode_normal',' FROM event click on #button_to_change_db_' + source_or_destination);
			///alert('Chnaging '+source_or_destination);
			object_tree.init_h3_db_tree_title(source_or_destination); 
		});
	
		$('#div_db_tree_'+source_or_destination).hide();
		$( '#h3_db_tree_'+source_or_destination+'_title').hide();
		$('#div_db_tree_'+source_or_destination+'_chosen').show();
		reset_jquery_styles();
		// stil doing nrmal stuff so if user press Back buttotn, all still looks good !
		varInTab[ this.tabCounter ].OcloneUi.show_div_bottom();
		scroll_to_bottom();
	};
	// show tree again (and hide results table ) ++++ UNSELECT everything !
	GO_tree.prototype.init_h3_db_tree_title = function(source_or_destination){
		if(source_or_destination == 'source'){
			$('#clone_'+this.tabCounter+'src_db_svr_id').val('');
			varInTab[ this.tabCounter ].OcloneUi.change_data_to_copy();
			$('#div_first_question').hide();
		}else{
			if( G('real_multiple_destinations') && G('real_multiple_destinations').checked){
				$('#button_submit_db_destination').parent().show();
			}
			for(var i=0 ; i<this.GA_id_multi_selected.length ; i++){
				html_id	= this.GA_id_multi_selected[i];
				this.bro2_multi_select_no_limits(html_id);
			}
			this.GA_id_multi_selected = [];
			GA_validated_id_multi_selected = [];
			
			// Force un color of all nodes for some reasons not always working nicely
			for(var html_id in this.Gnodes){
				this.private_UN_color_node(html_id, Gcolor_selected_nodes);
			}
			
			$( '#h3_db_tree_'+source_or_destination+'_title').show(); 
			$('#clone_'+this.tabCounter+'dest_db_svr_id').val('');
		}
		varInTab[ this.tabCounter ].OcloneUi.show_div_bottom();
		
		$('#div_db_tree_'+source_or_destination+'_chosen').hide();
		$('#div_db_tree_'+source_or_destination).show();
		reset_jquery_styles();
	};
	GO_tree.prototype.db_src_chosen_call_back = function(json){
		if(check_ajax_response_first_2_chars_is_ok(json,'db_src_chosen_call_back')){
			var back = JSON.parse(json.substr(2));
			if( $('#clone_'+this.tabCounter+'src_db_svr_id').val() === ''){
				//alert('Well done : ignoring ajax call back cos user change its mind quicker than ajax !'+back.html_id);
				return;
			}
			if( back.error !== ''){
				showDivAlert(back.error, 'Please check again :', true);
				this.init_h3_db_tree_title('source'); 
			}else{
				var value, label, html = '';
				var nb = back.Aids.length;
				for(var i = 0 ; i < nb ; i++){
					label = back.Aids[i];
					value = (i===0 ? '' : label);
					html += '<option value="' + value + '">' + label + '</option>';
				}
				varInTab[ this.tabCounter ].OcloneUi.last_list_of_ids = html;
				$('#select_object_id').html(html);
				varInTab[ this.tabCounter ].OcloneUi.show_div_bottom();
			}
		}
	};
});
