$(document).ready(function(){ //private_color_node
    GO_tree.prototype.set_active_node = function(new_html_id, ignoreBrow2State){
        if(force_red_selection === true /*|| this.GA_id_multi_selected.length !== 0*/){
            //a_lert('Think ! pb here cos no way to cancel multi select ? Well, just press escape to unselect all !');
            //console.log('BRO : no color cos force_red_selection ro multi selected=');
            return;
        }
        if(this.getBrow2state() != 'normal' && this.getBrow2state() != 'cut' && this.getBrow2state() != 'copy'){
            // NB SECOND PARAMENTER !!! console.log('BRO : no color cos this.getBrow2state()=' + this.getBrow2state());
            if(ignoreBrow2State) var a=1;//a_lert('YES man using new way to maybe reselect node whencontext already open ?');
            else                 return;
        }
        if( new_html_id!='recoloring_same_node' && !G(new_html_id) ){     new_html_id = this.getIdOfActiveNode();}
        if( new_html_id!='recoloring_same_node' && !G(new_html_id) ){   new_html_id = this.Ghtml_root; }
        if( new_html_id!='recoloring_same_node' && !G(new_html_id) ){   console.log('UI:STill boring PB as node with this ID not found :'+new_html_id); return; }
        if(!new_html_id){                                               console.log('BRO : no color cos no new_html_id'); return; }// TODO : FIND out where those comes from!!!
        if(ignore_subsequent_request){                                  console.log('BRO : no color cos ignore_subsequent_request'); return; }
        var active_id = this.getIdOfActiveNode();
        if(active_id == new_html_id){                                   /*console.log('BRO : no color cos same one as already colored');*/ return;    }
        if(active_id!=='' && new_html_id!='recoloring_same_node'){
            this.private_UN_color_node(active_id, Gcolor_active_node);
        }
        if(new_html_id=='recoloring_same_node'){
            new_html_id = active_id;
        }/* not usefull it seems else{
            setIdOfPreviousNode(active_id);
        }*/
        var obj = this.Gnodes[new_html_id];
        if( !obj ){
            console.log('BRO : no color obj not defined ');
            ///a_lert('Error in setActiveNode of html_id ='+new_html_id+' cos this.Gnodes['+new_html_id+'] does not exists having this.Gnodes.length ='+this.Gnodes.length);
            return;
        }
        this.private_color_node(new_html_id, Gcolor_active_node);// RVB : green
        this.setIdOfActiveNode(new_html_id); // UNIQUE CALL (ok 1 for init !)
        if(G('brow_input_adrress')){
            var path = obj.shortPath.substr(1) + obj.fileName;
            if(path === ''){
                path = this.Gphp_root_folder;
            }
            G('brow_input_adrress').value = path;
        }
        /////MAKE BROWSER SCROLL JUMP  if(G('div_file_browser')) G('div_file_browser').focus();
    };
    
    // private means 3 tiny calls...
    GO_tree.prototype.private_color_node = function(html_id, bg_color){/*
            $('#'+html_id+' :nth-child(1)'  ).css('background-color', bg_color);
            $('#'+html_id+' :nth-child(2)'  ).css('background-color', bg_color);
            $('#'+html_id                   ).css('background-color', bg_color);*/
            /*$('#'+html_id+' :nth-child(1)'  ).addClass(bg_color);
            $('#'+html_id+' :nth-child(2)'  ).addClass(bg_color);
            $('#'+html_id+' :nth-child(3)'  ).addClass(bg_color);// for faves source
            $('#'+html_id+' :nth-child(4)'  ).addClass(bg_color);// for faves destination
            $('#'+html_id                    ).addClass(bg_color);*/
            $('#'+html_id+' > a').addClass(bg_color);
            $('#'+html_id+' > a').removeClass('border_transparent');
            //alert(' bingo adding bg color ' + bg_color + ' to the a within ' + html_id);  
            /*$('#'+html_id+' :nth-child(1)'  ).removeClass('font_color');
            $('#'+html_id+' :nth-child(2)'  ).removeClass('font_color');
            $('#'+html_id+' :nth-child(3)'  ).removeClass('font_color');// for faves source
            $('#'+html_id+' :nth-child(4)'  ).removeClass('font_color');// for faves destination
            $('#'+html_id                    ).removeClass('font_color');
            */
    };
    GO_tree.prototype.private_UN_color_node = function(html_id, bg_color){/*
            $('#'+html_id+' :nth-child(1)'  ).css('background-color', bg_color);
            $('#'+html_id+' :nth-child(2)'  ).css('background-color', bg_color);
            $('#'+html_id                   ).css('background-color', bg_color);*/
            /*$('#'+html_id+' :nth-child(1)'  ).removeClass(bg_color);
            $('#'+html_id+' :nth-child(2)'  ).removeClass(bg_color);
            $('#'+html_id+' :nth-child(3)'  ).removeClass(bg_color);
            $('#'+html_id+' :nth-child(4)'  ).removeClass(bg_color);
            $('#'+html_id                    ).removeClass(bg_color);*/
            $('#'+html_id+' > a').removeClass(bg_color);
            $('#'+html_id+' > a').addClass('border_transparent');
            /*
            $('#'+html_id+' :nth-child(1)'  ).removeClass(bg_color).addClass('font_color');
            $('#'+html_id+' :nth-child(2)'  ).removeClass(bg_color).addClass('font_color');
            $('#'+html_id+' :nth-child(3)'  ).removeClass(bg_color).addClass('font_color');
            $('#'+html_id+' :nth-child(4)'  ).removeClass(bg_color).addClass('font_color');
            $('#'+html_id                    ).removeClass(bg_color).addClass('font_color');
            */
    };
    /* ONLY USED FROM OUTSIDE THE OBJECT !!!! */
    GO_tree.prototype.browser2_select_file = function(file_path){
        var html_id_to_select = this.getHtmlIdFromRelPath( this.get_connection(), file_path);
        var html_id = html_id_to_select;
        var AnotLoaded = [];
        //dump(this.Gnodes,'body',0);
        //a_lert('so G(html_id)'+G(html_id)+html_id);
    //    return;
        if(!G(html_id)){
            if(this.Gconnnexion_type == 'ftp' || this.Gconnnexion_type == 'not')
                this.bulk_open_and_select(html_id, file_path);
            else
                console.log('go bulk open '+file_path+ ' cos not found html_id =' + html_id);
        }else{
            //a_lert('no need for  bulk open '+file_path);
            var ancestors = [];
            do{ // Even open only the nodes which are not yet opened !!
                if( ! this.is_node_open(html_id) || html_id == html_id_to_select){ 
                    ancestors[ancestors.length] = html_id;
                }
                html_id = this.get_parent_node(html_id);
            }while(html_id!=this.Ghtml_root); 
            ancestors.reverse();
            for(var i = 0 ; i< ancestors.length ; i++){
                if(this.is_folder(ancestors[i]) && ancestors[i]!=html_id_to_select){
                    this.publicOpenFolder(ancestors[i]);
                }else{
                    this.set_active_node(ancestors[i]);
                    //setTimeout('scroll_active_node_to_the_middle();', 100);
                    //this.scroll_active_node_to_the_middle();
                }
            }
        }
    };
    GO_tree.prototype.get_parent_node = function(html_id){
        if(html_id == this.Ghtml_root){ /*console.log('prog error : asking for parent of root'); */return null;}
        var obj = this.Gnodes[html_id];
        if(!obj){ console.log('prog error in get_parent_node: this.Gnodes[html_id] null with html id = ' + html_id); return null;}
        var id =null;
        if(obj.shortPath === '' || obj.shortPath === '/'){
            id = this.Ghtml_root;
        }else{
            id = this.getHtmlIdFromRelPath(this.get_connection(), trim_last_slash(obj.shortPath));
        }
        ///a_lert('get_parent_node('+html_id+' having path = '+obj.shortPath+ ' so id = '+id);
        ///a_lert('PPPPPPPPARENT of '+html_id+' is '+id+' cos short path='+obj.shortPath)
        if( !this.Gnodes[id] || !this.Gnodes[id].children){
            console.log('ERROR in get Parent as parent has no children array cos id='+id+' but this.Gnodes[id]='+this.Gnodes[id]+' \n  with short_path of parent='+obj.shortPath+'  \n  '+trim_last_slash(obj.shortPath));
            //dump(this.Gnodes);
            return this.Ghtml_root;
        }
        return id;
    };
    GO_tree.prototype.is_node_open = function(html_id){
        return (this.Gnodes[html_id].isOpen == 'true' ? true : false );
    };
    GO_tree.prototype.is_folder = function(html_id){
        if(!this.Gnodes[html_id]){ 
            console.log('Error in Brow2.is_folder('+html_id+'), this node has been deleted...');
            return;
        }
        return (this.Gnodes[html_id].isFolder == 'true' ? true : false );
    };
    GO_tree.prototype.erase_sons = function(html_id){
        //a_lert('DELETING : '+$('#'+html_id+'').next().outerHTML());
        if(!this.node_has_children(html_id)) return;
        var child_id_expected_to_be_erased = this.Gnodes[html_id].children[0];
        ///a_lert('CLOSING NODE '+html_id+' child id='+child_id_expected_to_be_erased);
        // CHECK FIrst child deleted is the onewe expect, or do nothing
        var id_soon_to_be_deleted = $('#'+html_id+'').next('li').children().children().first().attr('id');
        if(id_soon_to_be_deleted === child_id_expected_to_be_erased){
            $('#'+html_id+'').next().remove();
        }/*else{
            if(id_soon_to_be_deleted === undefined)
                //a_lert('Saved illegal erasement of nodes brother of '+id_soon_to_be_deleted);
            //else
                 console.log('No first child found AT ALL (was meant to be :'+child_id_expected_to_be_erased+') Unless,adding a first childorrenaming it, Maybe you could REopenHERE that node who is slow to open !');
        }*/
    };
    // return order of a node amongst its brother : ie top node in a folder is index 0
    GO_tree.prototype.get_index_of_node = function(html_id){
        // if root, get its last child
        if(html_id == this.Ghtml_root){ 
            console.log('Error BAD : get_index_of_node of root !');
            return this.Ghtml_root;
        }
        var parent_id = this.get_parent_node(html_id);
        var sons = this.Gnodes[parent_id].children;
        var previous_node = this.Ghtml_root; 
        for(var len=sons.length, i=0 ; i < len  ; i++){
            if(sons[i] == html_id){
                break;
            }   
        }
        return i;
    };
    // return previous node id OR this.Ghtml_root     .... OLD: or parent id
    GO_tree.prototype.get_previous_node = function(html_id){
        // if root, get its last child
        if(html_id == this.Ghtml_root){ 
            //a_lert('Error BAD : get_previous_node of root !');
            return this.Ghtml_root;
        }
        var previous_node = parent_id = this.get_parent_node(html_id);
        var sons = this.Gnodes[parent_id].children;
        for(var len=sons.length, i=0 ; i < len  ; i++){
            if(sons[i] == html_id){
                ///a_lert('Found previous node : '+previous_node+' cos next one is '+html_id);
                break;
            }else{
                previous_node = sons[i];
            }
        }
        return previous_node;
    };
    GO_tree.prototype.node_has_children = function(html_id){
        if(typeof this.Gnodes[html_id] == 'undefined'){
            console.log('Error in has children cos Gnodes not set for html_id='+html_id);
        }
        return (this.Gnodes[html_id].children.length) ? true : false;  
    };
    GO_tree.prototype.get_first_child = function(html_id){
        var first_son_id = this.Ghtml_root;
        if(this.Gnodes[html_id].children.length) first_son_id = this.Gnodes[html_id].children[0];
        return first_son_id;    
    };
    GO_tree.prototype.get_last_child = function(html_id){
        var node = this.Ghtml_root;
        if(this.Gnodes[html_id].children.length) node = this.Gnodes[html_id].children[this.Gnodes[html_id].children.length-1];
        return node;    
    };
    // return next node id or 1st node of the tree
    GO_tree.prototype.get_next_node = function(html_id, strictly_no_children){
        if(!this.Gnodes[html_id]){ console.log('Erro calling get next node with html_id='+html_id); return; }
        if(html_id == this.Ghtml_root && !this.is_node_open(html_id)){ return;}// cos root only one to have no dad and no brother !
        // check firt if node open,if yes return the first child.
        if( !strictly_no_children && this.is_folder(html_id) && this.is_node_open(html_id) ){
            var next_selected = this.get_first_child(html_id);
            if(next_selected != this.Ghtml_root){ 
                return next_selected;
            }
        }
        var parent_id = this.get_parent_node(html_id);    //a_lert('PARENT of '+html_id+' is '+parent_id);
        var brother = this.Gnodes[parent_id].children;
        var next_node = this.Ghtml_root;
        // get its younger brother ! (the one below it )
        if(next_node == this.Ghtml_root){
            var next_node_found = false;
            var len = brother.length; //Object.keys(brother).length;
            for(var i=0 ; i < len  ; i++){
                if(next_node_found ==true){     next_node = brother[i]; break; }        
                if(brother[i] == html_id){         next_node_found =true;        }
            }
            //if(!next_node_found){console.log(html_id+'not found in fratrie cos Was last brother amongst brother = '+len);}
        }
        // if last brother => get parent of parent then next brother of parent.
        if(next_node == this.Ghtml_root && parent_id != this.Ghtml_root){        
            next_node = this.get_next_node( parent_id, true);  // PB RECURSIVE !!!!
        }
        return next_node;
    };
    GO_tree.prototype.event_focus_with_letters = function(event){ // NB A pressed = 97==ASCII but A down/up =65 !!!! FUNNY enough, letter range are just reversed : upper/lowercase
        //a_lert('PRESS'+event.keyCode);
        var active_id = this.getIdOfActiveNode();
        if( active_id === this.Ghtml_root){
            return;
        }
        var lower_case_letter   = String.fromCharCode(event.keyCode).toLowerCase();
        var lower_case_code     = lower_case_letter.charCodeAt(0);
        if( 97 <= event.keyCode && event.keyCode <= 122 || //a to z
            48 <= event.keyCode && event.keyCode <= 57 ){  // 0 to 9
            var dad_id = this.get_parent_node(active_id);            
            var brothers = this.Gnodes[dad_id].children;
            var start       = this.get_index_of_node(active_id);
            var bro_id      = null;
            // Twice so if at the end of a letter, go to the first one again
            for(var j=0 ; j<2 ; j++){
                var same_letter_found = false;
                for(var i=start ; i < brothers.length ; i++){
                    bro_id = brothers[i];
                    var first_letter_code = this.Gnodes[bro_id].fileName.charCodeAt(0);
                    if( first_letter_code == lower_case_code && i!=start){
                        same_letter_found = true;
                            break;
                    }
                }
                if(same_letter_found){
                    var new_active_id = this.Gnodes[bro_id].html_id;
                    this.set_active_node(new_active_id);
                    //this.scroll_active_node_to_the_middle();
                    break;
                }else{
                    start = 0;//a_lert(lower_case_letter+' Not found below active node so we will now look above !');
                }
            }
        }
    };
});
