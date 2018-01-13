/*

not a tab but a quite complex dialog like never before so do it by end:
    $.get( Opages.entity_edit_two.php_json_url    + entity_id + '&tab_counter=' + tab_id, function (back){

*/
//alert(';loaded but what is the tab number and where is it load ed from cos not standart or maybe still a bit....');
function init_js_in_edit_fave_target(backSpecial) {
    var json_back = JSON.parse(backSpecial);
    
    var tabNumber     = json_back.tabCounter;
    var src_or_dest   = json_back.src_or_dest;
    var fave_label    = json_back.fave_label;
    var ApathsToOpen  = json_back.ApathsToOpen;

    G('old_favorite_label_edited').value = fave_label;
    G('favorite_label_edited').value = fave_label;

    // STUFF TO PRESELCT : could be more than 1 db per fave though !!!
    var dest_fave_id  = json_back.fave_details[0].dest_fave_id;
    var database_name = json_back.fave_details[0].database_name;
    var svr_id        = json_back.fave_details[0].svr_id;

    var force_red_selection = true; //force_it_multi == will be red instead of green.
    // varInTab[tabNumber].GO_js_tree_edit_fave_dest
    var GO_js_tree_edit_fave_dest = new GO_tree(tabNumber, 'div_favorites_dbs', 'GO_js_tree_edit_fave_dest', '','0','db','0','0','0');
    GO_js_tree_edit_fave_dest.initiliase_tree("DB connections",false);
    var load_first_level_GO_js_tree = function(){ 
        GO_js_tree_edit_fave_dest.parse_one_folder_call_back('OK' + JSON.stringify(json_back.tree));
        
            if (ApathsToOpen.length) {
               for (var i = 0 ; i < ApathsToOpen.length ; i++) {
                   ///alert(i + ' / ' + ApathsToOpen.length);
                    var path = ApathsToOpen[i];
                    //alert('Selecting Path = ' + path + ' - ' + tabNumber);
                    //var selectAlreadyChosenOnes = function(){ 
                        //alert('selecting for real ::: VICTORY !!!!!');
                        var safePath = GO_js_tree_edit_fave_dest.getHtmlIdFromRelPath( 
                            GO_js_tree_edit_fave_dest.get_connection(),
                            path
                        );
                        //alert('safePath = ' + safePath); 
                        GO_js_tree_edit_fave_dest.bro2_multi_select_no_limits(safePath);
                        //alert('stuff se;ected !!!' + safePath); 
                   // };
                   // setTimeout(selectAlreadyChosenOnes, 5);
                }
            } else {
                alert('No svr/db pair saved in that destination fave : ' + fave_label);
            }
        
        
    }; 
    setTimeout(load_first_level_GO_js_tree, 2);
    
    //"{"tabCounter":"2","src_or_dest":"destination","fave_label":"Local DB2 - clara_virtual","fave_details"
    //:[{"dest_fave_id":"7","dest_fave_label":"Local DB2 - clara_virtual","deleted":"0","database_name":"clara_virtual","svr_id":"7"}]}"
    $('#button_submit_edit_fav_db_dest').click( function(event) {
        GO_js_tree_edit_fave_dest.submit_multi_db_choices('destination');
    });



}
