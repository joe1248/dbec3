function Obfuscation_js_class(tabCounter){
	this.tabCounter			= tabCounter;
	this.AnodesToSelect		= [];
	this.AfieldsTypes		= [];
}

$(document).ready(function(){
	// init 1 fct especially used at step 4 for excluded fields
	//? OBFUSCATION_2_init_1 : select_at_initialisation_fields_to_obfuscate
	Obfuscation_js_class.prototype.select_at_initialisation_fields_to_obfuscate = function(){
		/*
		
		can't you try to order field by tables , except newly added at the end is ok.
		SO more space to show the diffrents options if table name shown on the line above the fields of taht table...
		
		*/
		$('#div_edit_entity_anomyze_container_'+ this.tabCounter).prepend('<form id="form_for_obfuscated_fieds_' + this.tabCounter + '"></form>');
		var previous_table = '';
		for (var i in this.AnodesToSelect) {
			/*var part_node_id = this.AnodesToSelect[i].table +  "_oo_o_oo_" + this.AnodesToSelect[i].column;
			if(G("otot_link_" + this.div_id + '_' + part_node_id)){
				if(this.Gnodes[part_node_id].isOpen == 'true'){*/
			this.add_new_fields_to_obfuscate(this, this.AnodesToSelect[i].table, this.AnodesToSelect[i].column, this.AnodesToSelect[i], previous_table);
				/*}//else alert(this.div_id + ' : ' + part_node_id + ' NOT OPENED YET');
			}//else alert(this.div_id + ' : ' + part_node_id + ' NOT EXISTING YET');
			*/
			previous_table = this.AnodesToSelect[i].table;
		}
	};
//DEFINE ALL THE JS BEHAVIOUR IN A NEW SEPARATE PHP CLASS SO THAT OBFUSCATION OPTION EASY TO EXTEND...so just echo_js_now in a loop on those options.
/*

Now perfect all SQL types are available in JS

Now GET THE PHP obfuscation setting so that :
	1. convert real sql types in a simplified one
	2. use simplified type to use 2nd array of php settings to 
		1. adding a new field, =>  you can show appropriate options
		2. filling already saved obfuscation params for a few fields, you need 
		- to show in proper fields ready to be re-saved all the options so reuse what you did just above
*/
	// NB : clean up method.
	// Make only a test page conataining the first tree only.
	// comment out all from other trees
	// extract what is specific for 1st tree one by one, without ever losing working state.
	// extract then for each other tree.










// THIS FCT SHOUD BE IN NEW FILE, and that would be a good example to try to separate each functionaity in different classes, having ONE SAME BASE CLASS, 
// and different OPTION values  in children classes, as well as some few differents fcts publics required..

// Maybe do bother to include js in that specific file only as they are  ajax calls too a JS script too, as we as php, i believe...

//? OBFUSCATION_2_init_3 : JS init each field params in add_new_fields_to_obfuscate
	Obfuscation_js_class.prototype.get_input_size = function(easy_var_type){
		var size;
		switch (easy_var_type) {
			case 'string':		size = 170;	break;
			case 'char':		size =  30;	break;//????   according to len !!!
			case 'float':		size =  65;	break;
			case 'bool':		size = 100;	break;
			case 'enum':		size = 200;	break;
			case 'date':		size =  80;	break;
			case 'time':		size =  80;	break;
			case 'datetime':	size = 170;	break;
			default:			size = 300;	break;
		}
		return size;
	};
	
	Obfuscation_js_class.prototype.add_new_fields_to_obfuscate = function(object_tree, table, field, saved_params, previous_table){
		
		// Remove same field being added as a serie of input and selects, from the tree, so cannot be added twice. dad
		//$('#otot_link_' + object_tree.div_id + '_' + html_id).parent().remove();
																		  var is_new_field_or_not_1st_line = typeof saved_params === 'undefined' || previous_table!=='' ? true : false;
		var html = '';
		if(!G('form_for_obfuscated_fieds_' + object_tree.tabCounter)){
			$('#div_edit_entity_anomyze_container_'+ object_tree.tabCounter).prepend('<form id="form_for_obfuscated_fieds_' + object_tree.tabCounter + '"></form>');
		}
										   var nb_form_children = G('form_for_obfuscated_fieds_' + object_tree.tabCounter).children.length;
		html += '<span id="param_for_field_' + nb_form_children + '">' + ( is_new_field_or_not_1st_line ? '<br>' : '');

					// 1. table name
														 var names_end = nb_form_children + '_' + object_tree.tabCounter;
																	//var table = this.Gnodes[html_id].dad_id;
																			   previous_table = typeof previous_table === 'undefined' ? '' : previous_table;
					html += this.obfuscation1_get_table_name(names_end, table, previous_table);
			
					// 2. field name
																	 //var field = this.Gnodes[html_id].fileName;
					html += this.obfuscation2_get_field_name(names_end, field);
					if (typeof this.AfieldsTypes === 'undefined' || typeof this.AfieldsTypes[table] === 'undefined' || typeof this.AfieldsTypes[table][field] === 'undefined'){
						alert('Error getting fields type : ');
						dump(this.AfieldsTypes);
						return;
					}
					var Aeasy_type = this.AfieldsTypes[table][field];
					var easy_type = Aeasy_type['EASY_TYPE'];
					// 3. Main Select : Obfuscate / Skip / Keep as is.
																						  var copy_skip_or_obfuscate 	= typeof saved_params === 'undefined' ? '' : saved_params.way;
					html += this.obfuscation3_get_select_if_copy_skip_or_obfuscate(names_end, copy_skip_or_obfuscate, easy_type);
					
					// 4. First option of obfuscation which depends on simplified mysql type.
					var options_for_obfuscation =  Aobfuscation_options[easy_type];							// Aobfuscation_options(_BY_TYPE) is global ?!
					var saved_method 			= typeof saved_params === 'undefined' ? '' : saved_params.method;
					html += this.obfuscation4_select_which_method_for_your_type(names_end, copy_skip_or_obfuscate, easy_type, saved_method);
		html += 	'<div id="latest_new_field_obfuscated_detail_two_' + names_end + '" class="column_for_obfuscated_fields">'; // REMOVE THAT IF USELESS
						// 5. All parameters for obfuscation of this type (method chosen options being shown, the others hidden)
						html += this.obfuscation5_get_all_parameters_for_that_type(names_end, copy_skip_or_obfuscate, options_for_obfuscation, saved_method, saved_params, Aeasy_type);
		html +=		'</div>';
		html += '</span>';
		///alert('Adding to form :' + G('form_for_obfuscated_fieds_' + object_tree.tabCounter) + ' : html ='+html);
		$('#form_for_obfuscated_fieds_' + object_tree.tabCounter).append(html);



		// ACT on the differents options shown above (Obfuscate, Skip, Keep as is)
		$('#select_if_copy_skip_or_obfuscate_' + names_end).change({'object_js_Class_Clone_Ui' : object_tree, 'table':table, 'field':field }, function(event){
			var Othis = event.data.object_js_Class_Clone_Ui;
			var table = event.data.table;
			var field = event.data.field;
			var selected_option = $('#select_if_copy_skip_or_obfuscate_' + names_end).val();
			switch (selected_option) {
				case '': return; break;
				case 'anonymise':
				case 'obfuscate':
					var id_of_select_to_hide, id_of_select_to_show;
					if (selected_option === 'anonymise') {
						id_of_select_to_hide = 'select_obfuscation_method_' + names_end;
						id_of_select_to_show = 'select_anonymisation_method_' + names_end;
					} else {
						id_of_select_to_hide = 'select_anonymisation_method_' + names_end;
						id_of_select_to_show = 'select_obfuscation_method_' + names_end;
					}					
					// HIDE select_obfuscation_method + any params 
					$('#' + id_of_select_to_hide).hide();
					$('.all_extra_params_for_' + names_end).hide();
					// SHOW select_anonymisation_method + the right params
					$('#' + id_of_select_to_show).show();
					$('#extra_params_for_' + G(id_of_select_to_show).value + '_' + names_end).show();
					//console.log('showing:::' + '#extra_params_for_' + G(id_of_select_to_show).value + '_' + names_end);
					// level 1 guessing : 
					if (selected_option === 'anonymise') {
						var found = Othis.return_best_anonymisation_choice_guess_for(table, field);
						if (found !== false) {
							$('#' + id_of_select_to_show).val(found);
						}
					}
					break;
				case 'do_not_copy':// Make grey console.log
					// hide options + its params..
					$('#select_anonymisation_method_' + names_end).hide();
					$('#select_obfuscation_method_' + names_end).hide();
					$('.all_extra_params_for_' + names_end).hide();
					/*var Aeasy_type = Othis.AfieldsTypes[table][field];
					var is_nullable 	= Aeasy_type['IS_NULLABLE'];
					var column_default 	= Aeasy_type['COLUMN_DEFAULT'];
				SEEM USELESS OCS not null date gets 0000-00-00 00:00:00 and int gets 0, so ask sumeet or google if a setting to activate to get NOT NULL enforced  ???
					if (is_nullable === 'NO' && column_default === null){
						console.log('USER_ALERT:YOU CANNOT SKIP THAT FIED COS not nul and no default value given.'+table+'-'+field + ' : '+column_default + ' is ="" :'+ (typeof column_default=='undefined')+'/'+(column_default===null));
					}else{*/
						$('#select_obfuscation_method_' + names_end).parent().css('background-color', '#ccc').css('margin','20px');
					//}
					break;
				case 'normal_copy':
					// Check if not null disaloed and without default, if ok, then confirm by user, if ok, delete from here and ut back in tree.
					$('#param_for_field_' + nb_form_children).remove();
					break;
			}
		});
		// ACT on the differents types of obfuscation shown above from : var options_for_obfuscation
		$('#select_obfuscation_method_' + names_end).change({'object_js_Class_Clone_Ui' : this }, function(event){ // this better than object_tree ??????
			if (!G('select_obfuscation_method_' + names_end)){alert('yep bug identified !!!');return;}
			$('.all_extra_params_for_' + names_end).hide();
			var second_selected_option = G('select_obfuscation_method_' + names_end).value;
			$('#extra_params_for_' + second_selected_option + '_' + names_end).show();
		});
		/*
		$('#select_anonymisation_method_' + names_end).change({'object_js_Class_Clone_Ui' : this }, function(event){ // this better than object_tree ??????
			if (!G('select_anonymisation_method_' + names_end)){alert('yep bug identified !!!');return;}
			$('.all_extra_params_for_' + names_end).hide();
			var second_selected_option = G('select_anonymisation_method_' + names_end).value;
			$('#extra_params_for_' + second_selected_option + '_' + names_end).show();
		});*/
		
		

		// level 2 guessing : 
		if (copy_skip_or_obfuscate === '') {
			var found = this.return_best_anonymisation_choice_guess_for(table, field);
			if (found !== false) {
				$('#select_if_copy_skip_or_obfuscate_' + names_end).val('anonymise');
				$('#select_if_copy_skip_or_obfuscate_' + names_end).trigger('change');//TRIIGER EVENT HANDLER which will then seect the 2nd level.
			}
		}
		
	};
	
	/*
	select_if_copy_skip_or_obfuscate should be shown by default so easier to use
		and if user select skip, you need to refuse it by an alert if the field is not null AND hasno default value
		and if user select copy as is, show a confirm box box, and if yes, just put the fied backin the ist of fields.
		
		and if user do want to obfuscate, you must propose a different select, if it is for an int, or for a float..or bool !!
		
		nb to add either plain or in a tool_tip, the type of each field so you will understand why no obfusctaion method proposed.
	*/

	
	// 1. private from only from add_new_fields_to_obfuscate
	Obfuscation_js_class.prototype.obfuscation1_get_table_name = function(names_end, table, previous_table){
		var html = (previous_table===table ? '' : '<br><h3>' + table + '</h3>');
		// Hidden input table
		html += '<input class="column_for_obfuscated_fields" type="' + (1 || previous_table===table ? 'hidden' : 'text') + '" readonly name="param_obfuscated_fields__table_' + names_end + '" value="' + table + '">';
		return html;
	};
	
	// 2. private from only from add_new_fields_to_obfuscate
	Obfuscation_js_class.prototype.obfuscation2_get_field_name = function(names_end, field){
		// Space before each field cos now grouped by table
		return '<span style="min-width:40px;display:inline-block;">&nbsp;</span>' +
		// input field name
		'<input style="width:100px;" class="column_for_obfuscated_fields" type="text" readonly name="param_obfuscated_fields__field_' + names_end + '" ' +
		'value="' + field + '">&nbsp;';
	};

	Obfuscation_js_class.prototype.any_anonymise_fct_set = function(easy_type){
		return js_in_array(easy_type, ['string','date','datetime']) !== -1;
	};
	// 3. private from only from add_new_fields_to_obfuscate
	Obfuscation_js_class.prototype.obfuscation3_get_select_if_copy_skip_or_obfuscate = function(names_end, copy_skip_or_obfuscate, easy_type){
		var fields_destinies = [
			{label:'Please select:'		, way:''},
			{label:'Anonymise'			, way:'anonymise'},
			{label:'Obfuscate'			, way:'obfuscate'},
			{label:'Skip'				, way:'do_not_copy'},
			{label:'Normal copy'		, way:'normal_copy'},
		];
		//select if obfuscate/ skip/ normal copy
		var html = '<select id="select_if_copy_skip_or_obfuscate_' + names_end + '" class="column_for_obfuscated_fields" ' + //style="width:130px;" ' +
		 				  ' name="select_if_copy_skip_or_obfuscate_' + names_end + '"  style="width:120px;">';
		for(var i=0 ; i < fields_destinies.length ; i++){
			if (fields_destinies[i].way === 'anonymise' && !this.any_anonymise_fct_set(easy_type)){
				continue;
			}
			html += '	<option ' + (copy_skip_or_obfuscate == fields_destinies[i].way ? 'selected':'') + ' value="' + fields_destinies[i].way + '">';
			html += 		fields_destinies[i].label;
			html += '	</option>';
		}
		html += 	'</select>&nbsp;';
		return html;
	};

	// 4. private from only from add_new_fields_to_obfuscate
	Obfuscation_js_class.prototype.obfuscation4_select_which_method_for_your_type = function(names_end, copy_skip_or_obfuscate, easy_type, saved_method){
		// 2nd select to choose obfuscation method in a select from which options are depending on the type.
		var options_for_obfuscation = Aobfuscation_options[easy_type];		// Aobfuscation_options is global ?!
		if (typeof options_for_obfuscation === 'undefined') {
			alert('Error cos no Aobfuscation_options for easy_type = ' + easy_type);
			return;
		}
		var html = '';
		if (options_for_obfuscation.length > 0) {
			var style_display = copy_skip_or_obfuscate !== 'obfuscate' ? 'display:none;' : '';
			html += 		'<select id="select_obfuscation_method_' + names_end + '" class="column_for_obfuscated_fields" ' + 
								 ' name="select_obfuscation_method_' + names_end + '" style="width:250px;' + style_display + '">';
								for(i=0 ; i < options_for_obfuscation.length ; i++){
									if(options_for_obfuscation[i].category	!=	'ANONYMISATION'){
										html += '	<option ' + (saved_method == options_for_obfuscation[i].method ? 'selected':'') + ' value="' + options_for_obfuscation[i].method + '">';
										html += 		options_for_obfuscation[i].label;
										html += '	</option>';
									}
								}
			html += 		'</select>';
			// If some anonimazation have been written by me for that type.
			if (this.any_anonymise_fct_set(easy_type)) {
				var style_display = (copy_skip_or_obfuscate !== 'anonymise') ? 'display:none;' : '';
				html += 		'<select id="select_anonymisation_method_' + names_end + '" class="column_for_obfuscated_fields" ' + 
									 ' name="select_anonymisation_method_' + names_end + '" style="width:250px;' + style_display + '">';
									for(i=0 ; i < options_for_obfuscation.length ; i++){
										if(options_for_obfuscation[i].category	==	'ANONYMISATION'){
											html += '	<option ' + (saved_method == options_for_obfuscation[i].method ? 'selected':'') + ' value="' + options_for_obfuscation[i].method + '">';
											html += 		options_for_obfuscation[i].label;
											html += '	</option>';
										}
									}
				html += 		'</select>';
			}
		}
		return html;
	};


	// 5. private from only from add_new_fields_to_obfuscate
	Obfuscation_js_class.prototype.obfuscation5_get_all_parameters_for_that_type = function(names_end, copy_skip_or_obfuscate, options_for_obfuscation, saved_method, saved_params, Aeasy_type){
		//Others options : inputs or selects : Some are shown, some are hidden
		var html = '';
		var saved_param1 			= typeof saved_params === 'undefined' ? '' : saved_params.param1;
		var saved_param2 			= typeof saved_params === 'undefined' ? '' : saved_params.param2;
		var saved_param3 			= typeof saved_params === 'undefined' ? '' : saved_params.param3;
		var saved_param4 			= typeof saved_params === 'undefined' ? '' : saved_params.param4;
		saved_params = [saved_param1, saved_param2, saved_param3, saved_param4];
		// For each possibe method of that type, echo all input, the one for the right method having saved values selected
		for (i=0 ; i < options_for_obfuscation.length ; i++) {
			var current_method_params = options_for_obfuscation[i];
										 //  right_method to ony fill default for the right obfuscation method
										 var right_method = copy_skip_or_obfuscate != 'do_not_copy' && (i===0 && saved_method==='' || saved_method === current_method_params.method) ? true : false;
						   //  param_style to show only the useful params (just for the right obfuscation method)
						   var param_style = right_method ? '' : ' style="display:none;" ';			
			// 1 span per set of options so easy to shown/hide in block if method changed
			html +=	'<div ' + param_style + ' id="extra_params_for_' + current_method_params.method + '_' + names_end + '" ' + 
											 ' class="all_extra_params_for_' + names_end + '">&nbsp;';
							html +=	this.obfuscation6_get_all_paramters_for_one_method(names_end, current_method_params, right_method, saved_params, Aeasy_type);
			html += '</div>';
		}
		return html;
	};
                 
	Obfuscation_js_class.prototype.obfuscation6_get_all_paramters_for_one_method = function(names_end, current_method_params, right_method, saved_params, Aeasy_type){
		var html = '';
		//var easy_type = Aeasy_type[0];
		
		//PARAM ONE
		if (typeof current_method_params.param1 === 'undefined'){		return html;} // No param needed for that method
		saved_params = [saved_params[0], saved_params[1], saved_params[2], saved_params[3]];
		html += this.obfuscation7_get_one_param(names_end, Aeasy_type, current_method_params.param1, saved_params, right_method, current_method_params.label);
							
		//PARAM TWO
		if (typeof current_method_params.param2 === 'undefined'){ 		return html; } 
		saved_params = [saved_params[1], saved_params[2], saved_params[3]];
		html +=	this.obfuscation7_get_one_param(names_end, Aeasy_type, current_method_params.param2, saved_params, right_method, current_method_params.label);

		//PARAM THREE
		if (typeof current_method_params.param3 === 'undefined')		return html; // Only 2 param needed for that method
		saved_params = [saved_params[2], saved_params[3]];
		html +=	this.obfuscation7_get_one_param(names_end, Aeasy_type, current_method_params.param3, saved_params, right_method, current_method_params.label);

		//PARAM FOUR
		if (typeof current_method_params.param4 === 'undefined')		return html; // Only 3 param needed for that method
		saved_params = [saved_params[3]];
		html +=	this.obfuscation7_get_one_param(names_end, Aeasy_type, current_method_params.param4, saved_params, right_method, current_method_params.label);
		
		return html;
	};

	Obfuscation_js_class.prototype.obfuscation7_get_one_param = function(names_end, Aeasy_type, param, Asaved_values, right_method, current_method_params_label){
		var html = '';
		var saved_value = Asaved_values[0];
		var newAsaved_values = [];
		// just remove first value of this array, so the shorter array will be passed to the recursive fct
		for (var i = 1 ; i < Asaved_values.length ; i++) {
			newAsaved_values[(i-1)] = Asaved_values[i];
		}
		var easy_type = Aeasy_type['EASY_TYPE'];
		// check if label defined : at least for inputs... but putting here the oppsite for now..
		if (typeof param.label === 'undefined' && js_in_array(param.html_type,['hidden','select']) === -1) {
			alert('Error prog cos no label for param.label of the obfuscation labelled : ' + current_method_params_label + ' and type = '+param.html_type);
			return;
		}
		html +=				typeof param.pre_label 	=== 'undefined' ? '' : param.pre_label;
		var default_value =	typeof param.default	=== 'undefined' ? '' : param.default;
		// INPUT AS PARAM 
		if (param.html_type === 'input') {
			html += '<input style="width:' + this.get_input_size(easy_type) + 'px;margin:0;" type="text" name="' +  param.name + '_' + names_end + '" ' +
					' placeholder="' + param.label + '" value="' + (right_method ? saved_value : default_value) + '">';
		}
		
		// SELECT AS PARAM 
		if (param.html_type === 'select') {
			html += '<select style="width:' + this.get_input_size(easy_type) + 'px;" name="' +  param.name + '_' + names_end + '"  id="' +  param.name + '_' + names_end + '">';
			
			//Dynamic select option if type = enum
			var select_options = easy_type === 'enum' ? Aeasy_type['ENUM_OPTIONS'] : param.options;
			var sub_html;
			for(j=0 ; j < select_options.length ; j++){
				sub_html = '';
				var current_option = select_options[j];
				var value = easy_type === 'enum' ? js_replace("'",'',current_option) : current_option.method;
				var label = easy_type === 'enum' ? js_replace("'",'',current_option) : current_option.label;
				html += '	<option ' + (saved_value == value ? 'selected':'') + ' value="' + value + '">';
				html += 		label;
				html += '	</option>';
				
				/*---------- NEW SUB_FUBCTION start ---------*/
														 //  right_method to ony fill default for the right obfuscation method
											 var right_sub_method = (j===0 && saved_value==='' || saved_value === current_option.method) ? true : false;
							   //  param_style to show only the useful params (just for the right obfuscation method)
							   var sub_param_style = right_sub_method ? '' : ' style="display:none;" ';			
				// 1 span per set of options so easy to shown/hide in block if method changed
				sub_html +=	'<span ' + sub_param_style + ' id="extra_params_for_' + current_option.method + '_' + names_end + '" ' + 
												 ' class="all_extra_params_for_' + param.name + '_' + names_end + '"><br>&nbsp;';
												 
								sub_html +=	this.obfuscation6_get_all_paramters_for_one_method(names_end, current_option, right_sub_method, newAsaved_values, Aeasy_type);
				sub_html += '</span>';
				/*---------- NEW SUB_FUBCTION end ---------*/
			}
				
			html += '</select>';
			html +=	sub_html;
			
			// NOw, outside the FOR LOOP!!!, set up ONE UNIQUE onchange event handler per select
			if (easy_type !== 'enum' && select_options.length){
				setTimeout(function(){
					$('#' + param.name + '_' + names_end).change( function(event){
						if (!G(param.name + '_' + names_end)){alert('yep bug identified !!!');return;}
						// OPTIONAL TO HAVE  IT some have extra parameters, some don't if (!G('extra_params_for_' + current_value + '_' + names_end)){alert('yep bug3 identified !!!');return;}
						var current_value = $('#' + param.name + '_' + names_end).val();
						$('.all_extra_params_for_' + param.name + '_' + names_end).hide();
						$('#extra_params_for_' + current_value + '_' + names_end).show();
					});
				}, 1500); 
			
			}
			
		}
		
		// HIDDEN AS PARAM  to store all enum values so one can be picked randomly
		if (param.html_type === 'hidden') {
			if (easy_type !== 'enum') {
				alert('Error prog cos param1 hidden only for enum type');
			} else {
				html += '<input type="hidden" name="' +  param.name + '_' + names_end + '"' +
						' value="' + Aeasy_type['ENUM_OPTIONS'].join(',') + '">';
			}
		}
		return html;
	};		

/*************************** Mke this a separate file so not loaded with tables too */
	Obfuscation_js_class.prototype.return_best_anonymisation_choice_guess_for = function(table, field){
		field = field.toLowerCase();
		var settings_for_that_column_type = Aobfuscation_options[this.AfieldsTypes[table][field]['EASY_TYPE']];
		var all_guesses = {};
		for (var i=0 ; i < settings_for_that_column_type.length ; i++) {
			var current_settings = settings_for_that_column_type[i];
			if (current_settings.category == 'ANONYMISATION' && typeof current_settings.guesses !== 'undefined') {
				all_guesses[current_settings.method] = current_settings.guesses;
			}
		}
		var found = false;
		// 1. Match ONLY if exact match
		for (var method in all_guesses) {
			var Aguesses = all_guesses[method];
			if ($.inArray(field, Aguesses) !== -1) {
				found = method;
				break;
			}
		}
		// 2. Match 1st approximation
		if (found === false) {
			for (var method in all_guesses) {
				var Aguesses = all_guesses[method];
				for (var j=0 ; j < Aguesses.length ; j++) {
					//console.log('guessing: ' + field + ' vs ' + Aguesses[j] + '(' + (field.indexOf(Aguesses[j])) + '/' + Aguesses[j].indexOf(field) + ')');
					if (field.indexOf(Aguesses[j]) !== -1 || Aguesses[j].indexOf(field) !== -1) {
						found = method;
						break;
					}
				}
				if (found !== false) {
					break;
				}
			}
		}
		//console.log('guessed: ' + found);
		return found;
	};
});
