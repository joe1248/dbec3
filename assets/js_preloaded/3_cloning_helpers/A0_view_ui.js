
function JsViewClass(){
	
}
var Oview = new JsViewClass();
/*
JsViewClass.prototype.get_html_ = function(){
	return ;
};
*/

JsViewClass.prototype.getLinkToChange = function(html_id){
	return '&nbsp;&nbsp;<input type="button" id="' + html_id + '" class="float_right small-button" value="Change">';
};

JsViewClass.prototype.get_html_to_chose_object_id_2 = function(main_primary_key, html_for_select){
	return '<br>Enter one <b>' +
		main_primary_key + ' </b> ' +
		'<input type="text" size="8" id="input_text_object_id">&nbsp;' +
		'<input type="button" class="small-button user_instruction" id="button_object_id_entered" value="Confirm">' +
		'<br><br>Or just select one: ' + 
		'<select id="select_object_id">' + html_for_select + '</select><br>&nbsp;' + this.getLinkToChange('a_change_ids_when_1_record');
};
JsViewClass.prototype.get_html_to_chose_object_id_3 = function(CONST_PERSO_QUERY_START, perso_query_end){
	//'<span class="user_instruction">Complete the query below to get specific record ID(s).</span><br><br>' +
	return '<span class="float_left_percent" style="background-color:#DDD;color:#000;" id="user_query_start">' +	CONST_PERSO_QUERY_START + '</span><br>' +
		'<textarea id="end_of_perso_query" name="end_of_perso_query" class="float_left_percent text_area_border">' +
			perso_query_end +
		'</textarea><br><br>' +
		'<input type="button" id="a_change_ids_when_sql" class="float_left small-button" value="Change">' +
		'<input id="button_test_query" type="button" class="float_right medium-button user_instruction" value="Confirm SQL query">';

};
