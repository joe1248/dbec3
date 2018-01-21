//victory reset discar
function js_Class_Clone_Paste(tabCounter, dest_db_index, OtransferParams){
	this.debug =Gdebug_debug_all || Gdebug_debug_3_paste ? true : false;
	js_log(this.debug,'GO NEW OBJECT js_ClassClone_Paste(tabCounter='+tabCounter+','+ dest_db_index+'=dest_db_index)');
	this.tabCounter				= tabCounter;				// Tab index
	this.index_of_ajax_updates  = 1;
	this.dest_db_index			= dest_db_index;
	this.paste_html_id			= 'in_tab_' + tabCounter + '_target_' + dest_db_index;
	this.paste_transfer_id		= 0;
	this.copy_transfer_id			= 0;
	this.i_query				= null;
	this.OtransferParams		= OtransferParams;
	if(typeof Aconnections_db !== 'undefined'){
		for(var i in Aconnections_db){
			if(Aconnections_db[i].id === this.OtransferParams.dest_db_svr_id){
				this.OtransferParams.dest_db_svr_name = Aconnections_db[i].connection_name;
				break;
			}
		}
	}
	this.Apasted_counter	= null;	// array indexed per TABLE name
	this.Aupdated_counter	= null; // array indexed per TABLE name
	this.exec_start_time	= null;
	this.ifr_or_div_id				= 'div_to_paste'		+ this.paste_html_id;
	this.button_id					= 'show_hide_details'	+ this.paste_html_id;	
	this.nb_error_previous_tranfer = 0;
	this.isTransferringNow			= false;
	this.setIntervalForDuration		= null;
	//js_log(this.debug,'END NEW OBJECT js_ClassClone_Paste(tabCounter='+tabCounter+','+ dest_db_index+'=dest_db_index)');
		//varInTab[ this.tabCounter ].OclonePaste[paste_index ].build_paste_ui_fr_one_db_target();
	//delete	varInTab[ this.tabCounter ].OclonePaste[paste_index ].build_paste_ui_fr_one_db_target;

//}
// preparing all the iframes + fire the submit IF NOT CONFIRMATION BOX TO BE SHOWN..
///js_Class_Clone_Paste.prototype.build_paste_ui_fr_one_db_target = function(){
///	js_log(this.debug,'GO create_oneTransfer_form');
	var show_spinner = false;
	var label_show_details = ' + ';
	var label_hide_details = ' -  ';
	var div_master_paste_html_added = Oview.get_html_transfer_1_target_div(this.OtransferParams, label_show_details, this.button_id, this.paste_html_id, this.ifr_or_div_id);

	$("#div_master_paste" + this.tabCounter).append( div_master_paste_html_added );

	var Othis = this;
	$("#td_"+this.paste_html_id+"_button_replay_special_debug"	).unbind().click( function(){
			Othis.OtransferParams.on_error_rollback	= 'true';
			Othis.OtransferParams.do_stop_on_error	= 'true';
			//Othis.OtransferParams.show_error_only	= 'false';
			$('#enable_debug_mode_' + Othis.tabCounter).val('checked');
			//alert(Othis.tabCounter + $('#enable_debug_mode_' + Othis.tabCounter).val());
			Othis.real_post_paste_transfer();	// button replay debug
	});
	$("#td_"+this.paste_html_id+"_button_view_data"				).unbind().click( function(){
		addStaticTab(false, Opages.data_viewer_main, /*'paste_transfer_id=' + */Othis.paste_transfer_id, 'Transfer ' +Othis.paste_transfer_id);// + $(this).attr('transfer_idx')
	});
	$("#td_"+this.paste_html_id+"_button_replay"				).unbind().click( function(){
			Othis.OtransferParams.on_error_rollback	= 'true';
			Othis.OtransferParams.do_stop_on_error	= 'true';
			Othis.OtransferParams.show_error_only	= 'true';
			Othis.real_post_paste_transfer();	// button replay 
	});
	$("#td_"+this.paste_html_id+"_button_replay_no_errors"		).unbind().click( function(){
			Othis.OtransferParams.on_error_rollback	= 'false';
			Othis.OtransferParams.do_stop_on_error	= 'false';
			Othis.OtransferParams.show_error_only	= 'true';
			Othis.real_post_paste_transfer();	// button replay ignore errors
	});
	

	$('.ui-dialog-titlebar').css(		'height', '25px');
	$('.ui-dialog-titlebar>span').css(	'height', '20px');
	reset_jquery_styles();
	
	$('#' + this.button_id).unbind().click( { 'thisOClonePaste' : this}, function(event){
		var button_id		= event.data.thisOClonePaste.button_id;
		var ifr_or_div_id	= event.data.thisOClonePaste.ifr_or_div_id;
		if( $('#' + ifr_or_div_id).is(":visible")){
			$('#' + button_id).attr('value', label_show_details);//Nothing works cos has to be in MANY jquery CSS classes.removeClass('small-button-text-higher');//.addClass('small-button');
			$('#' + ifr_or_div_id).hide();
		}else{
			$('#' + button_id).attr('value', label_hide_details);//Nothing works cos has to be in MANY jquery CSS classes.addClass('small-button-text-higher');//removeClass('small-button').
			$('#' + ifr_or_div_id).show();
		}
	});
	var progressbar		= $( "#progressbar"		+ this.paste_html_id);
	var progressLabel	= $( "#progress-label"	+ this.paste_html_id ); 
	progressbar.progressbar({	value	: 0,
								change	: function() {		progressLabel.text( progressbar.progressbar( "value" ) + "%" );	},
								complete: function() { /* NO NEEED JUST USE js_Class_Clone_Paste.prototype.update_ui */		}
	});
	if( varInTab[ this.tabCounter ].OcloneCopy.nb_destination !== 1){
		$('#' + this.ifr_or_div_id).hide();	// Iframe hidden by default until user does open it !
	}else{ 
		$('#' + this.button_id).attr('value', label_hide_details);
	}	
	js_log(this.debug,'END create_oneTransfer_form');
}
