function init_js_in_clone_entire_tables_ui(tabNumber)
{
//    var MAX_ROWS_COPIABLE_AT_ONCE = 10; // put 25000 rows should be enough for most settings tables !!!
                          var data = varInTab[tabNumber].my_json;
	var AnodesSource        = data.src;
	var AnodesDestination   = data.dest;
	varInTab[tabNumber].GO_js_tree_db_source = new GO_tree(tabNumber, 'div_db_tree_source_for_copying_table', 'GO_js_tree_db_source', '','0','db','0','0','0');
	varInTab[tabNumber].GO_js_tree_db_source.initiliase_tree("Source DB servers", true);
	varInTab[tabNumber].GO_js_tree_db_source.parse_one_folder_call_back('OK' + JSON.stringify(AnodesSource));

	varInTab[tabNumber].GO_js_tree_db_destination = new GO_tree(tabNumber, 'div_db_tree_destination_for_copying_table', 'GO_js_tree_db_destination', '','0','db','0','0','0');
	varInTab[tabNumber].GO_js_tree_db_destination.initiliase_tree("Destination DB servers", true);
	varInTab[tabNumber].GO_js_tree_db_destination.parse_one_folder_call_back('OK' + JSON.stringify(AnodesDestination));
	
	varInTab[tabNumber].ok = "yes";
	reset_jquery_styles();
	$('#div_db_tree_source_dad' + tabNumber).fadeIn("fast");
}

$(document).ready(function(){
	GO_tree.prototype.source_for_copying_table_so_show_destination_servers = function(source_data)
    {
        varInTab[this.tabCounter].source_data = source_data;
        $('#div_db_tree_source_dad' + this.tabCounter).fadeOut("fast");
        $('.div_right').show();
        $('#div_db_tree_destination_dad' + this.tabCounter).fadeIn("fast");
    };
    
    GO_tree.prototype.destination_for_copying_table_so_show_options = function(destination_data)
    {
        varInTab[this.tabCounter].destination_data = destination_data;
        $('#div_db_tree_destination_dad' + this.tabCounter).fadeOut("fast");
        $('#div_extra_questions' + this.tabCounter).fadeIn("fast");
        
        // Just prepare next step: check if table alread exits in target DB.
        $('#table_copy_submit_button' + this.tabCounter).unbind().click({'tabCounter' : this.tabCounter}, function(event){
            var this_tabCounter = event.data.tabCounter;
            $('#div_extra_questions' + this_tabCounter).fadeOut("fast");
            $('#new_main_table_copying_div' + this_tabCounter).html( 'Checking if table alread exits in target DB...');
            reset_jquery_styles();
            
            check_if_table_does_not_exits(this_tabCounter);
            // later, if exist, option NOTT to drop it, so you will have to check if columns needs adding or ignoring...
            $('#new_main_table_copying_div' + this_tabCounter).fadeIn();
        });
    };
});



function check_if_table_does_not_exits(this_tabCounter)
{
    var post_data = {
        'src'   :   varInTab[this_tabCounter].source_data,
        'dest'  :   varInTab[this_tabCounter].destination_data,
        'tab_counter' : this_tabCounter
    };
    ajaxPost(post_data, Opages.copy_table_check.php_url, callback_check_if_table_does_not_exits);
}
function callback_check_if_table_does_not_exits(json)
{
	if(!check_ajax_response_first_2_chars_is_ok(json,' callback of check_if_table_does_not_exits')) {
        alert('php error 1:' + json);

        return;
	}
	var data = JSON.parse(json.substr(2));
    if (typeof data.tabCounter === 'undefined') {
        alert(' you must pass tabNumber from back end in callback_check_if_table_does_not_exits');

        return;
    }
    var tabCounter = data.tabCounter;
//    alert('bingo OK table already alray exist with erfect columns so just do quick count...');
    $('#new_main_table_copying_div' + tabCounter).html( 'Counting records to be copied');
    do_a_quick_count(tabCounter, data.copy_transfer_id);
}





function do_a_quick_count(tabCounter, copy_transfer_id)
{
    var post_data = {
        'src'   :   varInTab[tabCounter].source_data,
        'dest'  :   varInTab[tabCounter].destination_data,
        'tab_counter' : tabCounter,
        'copy_transfer_id' : copy_transfer_id
    };
    ajaxPost(post_data, Opages.copy_table_count.php_url, callback_check_if_count_worked);
}
function callback_check_if_count_worked(json)
{
    if(!check_ajax_response_first_2_chars_is_ok(json,' callback of callback_check_if_count_worked')) {
        alert('php error 2:' + json);
    
        return;
	}
  //  alert('bingo OK count if fine' + json);
    var data = JSON.parse(json.substr(2));
    if (typeof data.tabCounter === 'undefined') {
        alert(' you must pass tabNumber from back end in callback_check_if_table_does_not_exits');

        return;
    }
    var tabCounter = data.tabCounter;
    
    // NOW GET PAste transfer FOR EACH DESTINATION DB ! (for now, just 1)
    var ifr_idx = 1;
    $('#new_main_table_copying_div' + tabCounter).html( 'Requesting transfer ID...');
    get_paste_transfer_id(tabCounter, data.copy_transfer_id, ifr_idx);
}
function get_paste_transfer_id(tabCounter, copy_transfer_id, ifr_idx)
{
    var post_data = {
        'src'   :   varInTab[tabCounter].source_data,
        'dest'  :   varInTab[tabCounter].destination_data,
        'tab_counter' : tabCounter,
        'copy_transfer_id' : copy_transfer_id,
        'ifr_idx'   : ifr_idx
    };
    ajaxPost(post_data, Opages.copy_table_get_id.php_url, callback_get_paste_transfer_id);
}
function callback_get_paste_transfer_id(json)
{
    if(!check_ajax_response_first_2_chars_is_ok(json,' callback of callback_check_if_count_worked')) {
        alert('php error 2:' + json);
    
        return;
	}
  //  alert('bingo OK count if fine' + json);
    var data = JSON.parse(json.substr(2));
    if (typeof data.tabCounter === 'undefined') {
        alert(' you must pass tabNumber from back end in callback_check_if_table_does_not_exits');

        return;
    }
    var tabCounter = data.tabCounter;
    $('#new_main_table_copying_div' + tabCounter).html( 'Transfering data now !!!');
    start_table_copy(data.paste_transfer_id);
}

function start_table_copy(paste_transfer_id)
{
    var post_data = {
        'paste_transfer_id' : paste_transfer_id
    };
    ajaxPost(post_data, Opages.copy_table_start.php_url, callback_start_table_copy);
}

function callback_start_table_copy(json)
{
    if(!check_ajax_response_first_2_chars_is_ok(json,' callback of callback_start_table_copy')) {
        alert('php error 3:' + json);
    
        return;
	}
    alert('Victory start finished' + json);
    var data = JSON.parse(json.substr(2));
    if (typeof data.tabCounter === 'undefined') {
        alert(' you must pass tabNumber from back end in callback_check_if_table_does_not_exits');

        return;
    }
    var tabCounter = data.tabCounter;
    $('#new_main_table_copying_div' + tabCounter).html( 'Transfer Successful !');
}















function ajaxPost(post_data, url, callbackFunction)
{
    $.ajax({
        context : this,
		type: "POST",
		url: url,
		data: post_data,
		cache: false,
		success: callbackFunction,
		error: function (XMLHttpRequest, textStatus, errorThrown) {
			if(XMLHttpRequest.responseText !== ''){
				console.log("ajax error trying to check_ifsimilar_dbs :"+XMLHttpRequest.responseText);
			}
		}
	});
}
