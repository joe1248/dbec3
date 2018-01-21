GO_tree.prototype.getHtmlIdFromRelPath = function(conn_type, fileRelativePath){
	if(!fileRelativePath && fileRelativePath!==''){
		if(console && console.log) console.log('Error in JSgetHtmlIdFromRelPath cos fileRelativePath is undefined'); 
		return;
	}
	var back=  this.tree_div_name + '_ideTreeId_' +
				js_replace('/','__',     
				js_replace('.','zkw---', 
				js_replace(' ','-_-', 
				js_replace('!','-z-', 
				js_replace('?','zkw-q-', 
				js_replace('+','zkw-p-', 
				js_replace(',','zkw-c-', 
				js_replace('=','zkw-e-', 
				js_replace('*','zkw-s-', 
				js_replace(':','zkw-d-', 
				fileRelativePath
				))))))))));
	if(back == this.tree_div_name + '_ideTreeId___') {
		back = this.tree_div_name + '_ideTreeId_root';
	}
	return back;
};
