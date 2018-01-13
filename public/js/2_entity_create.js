//? ENTITIES_CREATE  JS to init tree

function init_js_in_create_one_entity(tabNumber){
	//alert('Yes init_js_in_create_one_entity !!! tabNumber = ' + tabNumber);
	
	var Anodes = varInTab[tabNumber].my_json;
	//dump(Anodes);

	varInTab[tabNumber].GO_js_tree = new GO_tree(tabNumber, 'div_pick_a_db_to_analyse', 'GO_js_tree', '','0','db','0','0','0');
	varInTab[tabNumber].GO_js_tree.initiliase_tree("DB connections",false);
	var load_first_level_GO_js_tree = function(){ 
		varInTab[tabNumber].GO_js_tree.parse_one_folder_call_back('OK' + JSON.stringify(Anodes));
	}; 
	setTimeout(load_first_level_GO_js_tree,1);
}
