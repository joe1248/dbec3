var ignore_subsequent_request = false;//json

var Gcolor_active_node         = 'border_font'; ///'color_inverted_1';
var Gcolor_selected_nodes     = 'color_inverted_2';

var force_red_selection = false;
var GA_cut_or_copy = null;
var Gcut_or_copy = null;
var Genable_looping_keyboard_arrow = false;// could beactivated when SHIFT ispressed???!!! esc
var ctrl_shift_alt = 'ctrl';// FOR MULTI _SELECT ( WITH THE MOUSE + 1 keyboard ???? a bit weird !!!)
var Glatest_new_file_to_open_auto = false;
function GO_tree(tabCounter, tree_div_name, this_object_name, rootFolder, projectId, conType, svnId, ftpId, dbId){
    switch (tree_div_name) {
        case 'div_pick_a_db_to_analyse':// In fact a table needs to be picked !
        case 'div_pick_a_db_to_add_fks':
        case 'div_pick_a_db_to_add_manually_fks':
        case 'div_pick_a_db_to_explore':
        case 'div_db_tree_source_for_copying_table':
            this.icons_per_level = ['', 'icon_server', 'icon_db', 'icon_table'];
            break;
        case 'div_db_tree_source':
        case 'div_db_tree_destination':
        case 'div_db_tree_destination_for_copying_table':
        case 'div_favorites_dbs':
            this.icons_per_level = ['', 'icon_server', 'icon_db'];
            break;
        default:
            alert('Error65813218513165 cos New tree : tree_div_name = ' + tree_div_name+ ' and this_object_name = ' + this_object_name);
    }
    this.tabCounter              = tabCounter;
    this.GA_id_multi_selected = [];
    this.G_multi_selected_dad = null;
    this.tree_div_name        = tree_div_name;
    this.this_object_name    = this_object_name; 
    this.Gnodes                = {};
    this.Gphp_root_folder    = rootFolder;
    this.Gphp_project_id    = projectId;
    this.colored_weight        = false;  // you need a nicer way to choose between folder tree or file tree...
    this.GAignored            = [];
    this.Ghtml_root            = tree_div_name + '_ideTreeId_root';
    this.Gconnnexion_type      = conType;
    this.Gsvn_id            = svnId;
    this.Gftp_id            = ftpId;
    this.Gdb_id                 = dbId;    
    this.AnodesBeingLoaded    = [];
    this.AnodesWaitingTobeMultiSelected = [];
    this.idOfActiveNode        = 'NO_SET_YET';
    this.idOfPreviousNode    = 'NO_SET_YET';
    this.currentState        ='normal';
}
$(document).ready(function(){
    GO_tree.prototype.getIdOfActiveNode = function(){            return  this.idOfActiveNode;};
    GO_tree.prototype.setIdOfActiveNode = function(html_id){            this.idOfActiveNode = html_id;};
    GO_tree.prototype.getBrow2state = function(){                return  this.currentState;};
    GO_tree.prototype.setBrow2state = function(state){
        if( js_in_array(state, Array('normal', 'context_menu','cut','copy' /*,'rename','new_node'*/)) === -1){
            console.log('error in this.setBrow2state cos new state not allowed:'+state);
        }else{
            ///a_lert('Changing browser state from '+this.currentState + ' to '+ state);
            this.currentState = state;
        }
    };
    GO_tree.prototype.getPathOfActiveNode = function(){
        var activeId = this.getIdOfActiveNode();
        return this.Gnodes[activeId].shortPath + this.Gnodes[activeId].fileName;
    };
    GO_tree.prototype.addNewNodeNamed = function( dad_id, node_id, label, path, is_folder){
        var new_node = JSON.parse( // JS OBject cannot have dynamic property => must be kept in PHP !!!
                '{ "' + node_id + '" : ' +
                                '{        "html_id"        :    "' + node_id + '",' +
                                '        "shortPath"        :    "' + path + '",' +
                                '        "JSrootFolder"     :      "/",' +
                                '        "fileName"        :    "' + label + '",' +
                                '        "dad_id"        :    "' + dad_id + '",' +
                                '        "isFolder"        :    "' + is_folder + '",' +
                                '        "isOpen"        :    "false",' +
                                '        "children"        :    []    }' +
                '}' );
        if(this.Gnodes)            jQuery.extend(    this.Gnodes , new_node);
        else                                this.Gnodes = new_node;
        return new_node;
    };
    GO_tree.prototype.initiliase_tree = function(root_label, bool_open_it){
        this.setIdOfActiveNode(  this.Ghtml_root); // INIT
        //NOT USEFULL setIdOfPreviousNode(this.Ghtml_root); // INIT
        this.addNewNodeNamed( 'ROOT_DAD', this.Ghtml_root, 'okOKOK', '', 'true');
        this.Gnodes[this.Ghtml_root].shortPath = '';
        this.Gnodes[this.Ghtml_root].fileName = root_label;
        ///a_lert('this.Ghtml_root = '+this.Ghtml_root + 'so this.Gnodes[this.Ghtml_root].fileName='+this.Gnodes[this.Ghtml_root].fileName);
        var node = this.Gnodes[this.Ghtml_root];
        var temp = '<ul>' + this.get_node_begin(this.Ghtml_root, node) + '</ul>';
        //a_lert('In init_treev setting html of '+this.tree_div_name+' to '+temp);
        if(!G(this.tree_div_name)){
            console.log('Error prog (CHECK JS file cahced atched php name !!) in initiliase_tree cos div doesnot exists yet :'+this.tree_div_name);
            return;
        }
        G(this.tree_div_name).innerHTML = temp;    
        this.add_events_to_node_id(this.Ghtml_root);
        //a_lert('DIV ID='+this.tree_div_name+' IS NOW RADY WITH ONE NODE');
        $("#"+this.tree_div_name)        // call `.jstree` with the options object
            .jstree({    // the `plugins` array allows you to configure the active plugins on this instance
                "plugins" : ["themes","html_data"]//,"ui","crrm","hotkeys"]              //,"core" : { "initially_open" : [ "html_folder_atab" ] }
            })
            .bind("loaded.jstree", function (event, data) {}) 
            .addClass('unselectable') //disableSelection()
            ///.addClass('back_color')
            ;

        if(bool_open_it){
            this.private_open_node(this.Ghtml_root, this.Ghtml_root);
            console.log('node opened');
        }else{
            //console.log('no need to open a node');
        }
        //$('a').addClass('font_color');
        //this.set_active_node(this.Ghtml_root,true);
        //a_lert('active_node ='+this.Ghtml_root);
        //G(this.tree_div_name).focus();    //setTimeout(function () { $("#"+this.Ghtml_root).jstree("set_focus"); }, 500);
    };    
    GO_tree.prototype.publicOpenFolder = function(html_id){    
        if(ignore_subsequent_request){ /*console.log('openeing IGNORED'+html_id); */ return;}
        oEvent=js_event();
        if(oEvent && oEvent.button==2){ return;}// RIGHT MOUSE
///alert('GO_tree.prototype.publicOpenFolder OPen '+html_id);        
        ignore_subsequent_request=true;
        if(this.Gnodes[html_id] && this.Gnodes[html_id].isOpen!=='false'){
            this.public_close_node(html_id);
        }else{
            this.private_open_node(html_id, '');
        }/*
        if( G('db_input_sql_database') ){ 
            var new_db = basedir(this.Gnodes[html_id].shortPath + this.Gnodes[html_id].fileName);
            if( G('db_input_sql_database').value !== new_db){
                G('db_input_sql_database').value = new_db;
                $('#db_input_sql_database').css('background-color', 'yellow');
                $('#db_input_sql_database').effect( 'pulsate', {}, 250, this.removeEffectOn('#db_input_sql_database') );
                //a_lert('New active DB : ' + new_db);
            }
        }    */
        ignore_subsequent_request = false;
    };
 
    // callback function to bring a hidden box back
    GO_tree.prototype.removeEffectOn = function(id){
        setTimeout(function(){ $( id ).removeAttr( "style" ).hide().fadeIn(); }, 1000 );
    };    
    GO_tree.prototype.public_close_node = function(html_id){
        this.Gnodes[html_id].isOpen = 'false';
        this.erase_sons(html_id);
        setTimeout("$('#"+html_id+"').removeClass('jstree-open').addClass('jstree-closed');",20); // cos if clicked on the arrow, it toggles already in real-time
    };
    GO_tree.prototype.get_connection = function(){
        var conn =  this.Ghtml_root.substr(0,3);
        if(conn == 'db_') conn = 'db';
        return conn;
    };
    GO_tree.prototype.bulk_open_and_select = function(html_id, file_path_to_select){
        if(G(html_id)){
            console.log('error cos bulk_open_and_select should work on node not yet defined !!!');
        }
        var file_path = file_path_to_select;
        //var dad_id = html_id; 
        var nb_node_to_open = 0;
        var conn = this.get_connection();
        do{
            nb_node_to_open++;
            file_path = file_path.substr(0, file_path.lastIndexOf('/'));
            new_html_id = this.getHtmlIdFromRelPath( conn, file_path);
            //dump(this.AnodesBeingLoaded);
            if(js_in_array(new_html_id, this.AnodesBeingLoaded) !== -1){
                //a_lert('YES YES YES node being laoded : '+new_html_id);
                this.AnodesWaitingTobeMultiSelected.push(html_id);
                return;
            }
            if(file_path == ''){
                console.log('Error cos new_html_id null with '+conn+' and ' +file_path);
                break;
            }
            //a_lert(file_path + ' so '+new_html_id);
        }while(file_path != '' && !G(new_html_id) && nb_node_to_open < 5);
        //a_lert('nb_node_to_open = '+nb_node_to_open+' - '+file_path);
        if(nb_node_to_open == 1){
            this.AnodesBeingLoaded.push(new_html_id);
            this.do_ajax_post_to_open_one_node(html_id,  file_path + '/', html_id);//, file_path_to_select??? not working ?
        }else{
            this.do_ajax_post_to_open_x_nodes( html_id,  file_path + '/', html_id, file_path_to_select);
        }
        // test it even trying to select only 1 file, I mean, even when actually opening just one folder !!!!
    };
    GO_tree.prototype.private_open_node = function(html_id, node_to_select){
        var shortFilePath = null;
        if(this.Ghtml_root == html_id)           shortFilePath = '/';
        else                                    shortFilePath = this.Gnodes[html_id].shortPath + this.Gnodes[html_id].fileName + '/';
        if(!this.isFavoriteFolder(html_id)){
            this.do_ajax_post_to_open_one_node(html_id,  shortFilePath, node_to_select);
        }else{
            var child_id, Ajson_soon = {};
            for(var i = 0 ; i < this.Gnodes[html_id].children.length ; i++){
                child_id = this.Gnodes[html_id].children[i];
                Ajson_soon[child_id] = this.Gnodes[child_id];
            }
            Ajson_soon['connection_type'] = this.Gconnnexion_type; //big here
            Ajson_soon['parent_folder'] = html_id;
            alert('Pure JS open node' + this.Gnodes[html_id].children.length);
            dump(Ajson_soon);
            this.parse_one_folder_call_back('OK' + JSON.stringify(Ajson_soon));
            reset_jquery_styles();
        }
        
    };
    // the point of the fucntion below is that the parent node may not even exist (NOT NEEDED AS WE KNOW THE PATH ALREADY....)
    GO_tree.prototype.do_ajax_post_to_open_one_node = function(html_id, shortFilePath, node_to_select){
        // setTimeout NEEDED WHen clicking on the arrow !!!
        setTimeout("$('#"+html_id+" :nth-child(2)').addClass('jstree-loading');",2);
        var post_ftp_id = 0;    if(this.Gconnnexion_type=='ftp')  post_ftp_id    =this.Gftp_id;
        var post_svn_id = 0;    if(this.Gconnnexion_type=='svn')  post_svn_id    =this.Gsvn_id;
        var post_db_id = 0;        if(this.Gconnnexion_type=='db')     post_db_id    =this.Gdb_id;
        var post_weighted = 0;  if(this.colored_weight) post_weighted = 1;
        
        
        // Nasty workaround to accomodate differents server browsing in db_cloner
        if( post_db_id == 0 ){
            post_db_id = this.Gnodes[html_id].php_sql_id;
            if( post_db_id == 0 ){
                var html_id_parent = this.get_parent_node(html_id);
                post_db_id = (typeof this.Gnodes[html_id_parent] !== 'undefined'
                                 && this.Gnodes[html_id_parent].php_sql_id != undefined ? this.Gnodes[html_id_parent].php_sql_id : '');
            }
        }
        
        var post_data = {
            'tree_object'    : this.this_object_name,
            'tree_div_name'    : this.tree_div_name,
            'proj'          : this.Gphp_project_id,
            'root_folder'   : this.Gphp_root_folder,
            'ftp_id'        : post_ftp_id,
            'svn_id'        : post_svn_id,
            'db_id'            : post_db_id,
            'colored_weight': post_weighted,
            'ajax'          : 1,
            'destination_folder'    : shortFilePath,
            'node_to_select'        : node_to_select
        }
        ///dump(post_data);
        var url;
        if (post_db_id > 0) {
            url = pos + "page_ajax_open_tree_node";
        } else {
            url = pos + "page_ajax_open_tree_node";
        }
        $.ajax({
            context : this,
            type: "POST",
            url: url,
            data: post_data,
            cache: false,
            success: this.parse_one_folder_call_back,
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                if(XMLHttpRequest.responseText != ''){
                    console.log("Browser2, opening node error :"+XMLHttpRequest.responseText);
                }
            }
        });
    };
    GO_tree.prototype.parse_many_folder_call_back = function(json){
        if( !check_ajax_response_first_2_chars_is_ok( json, 'Error opening nodeS : ')){
            return;
        }
        json = json.substr(2);
        /*if(json.substr(0,5) == 'ERROR' || json.substr(0,5) == 'Error' || json.indexOf('<')!=-1 ){
            console.log(json);// find a way to close the node !!!???
            return;
        }*/
        //a_lert('START with json = '+json);
        var bunches = JSON.parse(json);//a_lert(json);
        for(var i = 0 ; i < bunches.length ; i++){
            ///a_lert('...'+JSON.stringify(bunches[i]));
            this.parse_one_folder_call_back('OK' + JSON.stringify(bunches[i]));
        }
    };
    GO_tree.prototype.parse_one_folder_call_back = function(json){
        //a_lert(json);
        var debug_that_call_back = false; 
        //var debug_that_call_back = true;
        /*if( !check_ajax_response_first_2_chars_is_ok( json, 'Error opening node : ')){
            return;
        }
        json = json.substr(2); working*/
        var error_true_false_or_json = check_ajax_response_first_2_chars_is_ok( json, 'Error opening node : ');
        if( error_true_false_or_json === false){
            return;
        }
        if( error_true_false_or_json === true){
            json = json.substr(2);
        }else{
            json = error_true_false_or_json;
        }
        var dady = null;
        var back = '', i=0, firstLevelChildren = [], secondLevelChildren = {};
        var newNodes = JSON.parse(json);
        if(typeof newNodes !== 'object'){
            console.log('Error : ' + json);
        }
    //KEEP    dump(this.Gnodes);
        if( debug_that_call_back ) dump(newNodes);
    //KEEP    //a_lert(Object.keys(newNodes).length+' nodes as json was '+json);
        var conn = 'unknown';
        var node_to_select  = 'none';
        for(var html_id in newNodes){
            switch(html_id){ 
                case 'connection_type': 
                    conn = newNodes['connection_type'];
                    /*if(this.get_connection()!=conn){// special for paste 2nd browser
                        conn = this.Ghtml_root.substr(0,5);
                    }*/
                break;
                case 'parent_folder':
                    var id = newNodes['parent_folder'];
                    //a_lert('iiiiiiiddd='+id);
                    dady = id;
                break;
                case 'node_to_select':
                    if(newNodes['node_to_select'] != '') node_to_select = newNodes['node_to_select'];
                    //a_lert('NODE TO SLECT +++'+node_to_select);
                break;
                default://this.Gconnnexion_type
                    //a_lert('PBPBPBHERE'+this.Gconnnexion_type+'!='+conn);
                    /*if(this.Gconnnexion_type!=conn){// special for paste 2nd browser
                        old_html_id = html_id;
                        html_id = 'paste' + html_id.substr(3);
                        newNodes[html_id] = newNodes[old_html_id];
                        delete newNodes[old_html_id];
                    }*/
                    var compare_path = newNodes[html_id].shortPath + newNodes[html_id].fileName;
                    
                    if( js_in_array(compare_path, this.GAignored) === -1){
                        var short_path = (newNodes[html_id].shortPath === '/' ? newNodes[html_id].shortPath : trim_last_slash(newNodes[html_id].shortPath));
                        
                        /*console.log(' 1st LevelChildren ? ' + 
                            (this.getHtmlIdFromRelPath( this.get_connection(), short_path) === newNodes['parent_folder']) + 
                             this.getHtmlIdFromRelPath( this.get_connection(), short_path)+' === '+newNodes['parent_folder']
                        );*/
                        
                        if(this.getHtmlIdFromRelPath( this.get_connection(), short_path) === newNodes['parent_folder']){
                            firstLevelChildren[i++] = html_id;
                            back += this.get_node_begin(html_id, newNodes[html_id]);
                        }else{
                            secondLevelChildren['connection_type'] = newNodes['connection_type'];
                            secondLevelChildren['parent_folder'] = this.getHtmlIdFromRelPath( this.get_connection(), newNodes[html_id].shortPath);
                            secondLevelChildren[html_id] = newNodes[html_id];
                            ///dump(secondLevelChildren);
                        }
                    }
                break;
            }
        }
        //if(debug_that_call_back) console.log('SO dady = '+dady);
        if(G(dady) == null){
            if(!dady || !this.Gnodes[dady] || this.Gnodes[dady] === undefined){
                console.log('Line 343 in tree_base, Not even defined node : dady = \n' + dady);/// + newNodes['parent_folder']);
                //dump(newNodes);
                return;
            }
            if(this.Gnodes[dady].isOpen !== 'true'){
                if(debug_that_call_back) console.log('Yes end of boring bug !!'+dady);
                return;
            }else{ 
                console.log('Error PARENT NODEWRTITTEN AS CLOSED (or deleted if so) ! because node just opened has no parent : '+dady);
                //dump(this.Gnodes);
            }
            return;
        }
        if(this.Gnodes[dady].isOpen !== 'true'){
            //this.Gnodes[dady].isLoaded = 'false';
            this.Gnodes[dady].isOpen = 'true';
            //a_lert('Cancelling open cos has already been closed....');        return;
        }else{
            this.erase_sons(dady);//temp fix will become permanent ie dduplcate reqest aceoted....
            //a_lert('already open but fix cs double request !');//return;   
        }
        //setTimeout("$('#"+html_id+"').removeClass('jstree-closed').addClass('jstree-open');",20); // cos if clicked on the arrow, it toggles already in real-time
        if(dady){
            $('#'+dady+' :nth-child(2)').removeClass('jstree-loading');
            ///a_lert('removed jstree-loading on ' + dady);
            $('#'+dady).removeClass('jstree-closed').addClass('jstree-open').css('color','');
            
            // In case of BROKEN DB CONNEXION 
            if( error_true_false_or_json !== true){
                $('#'+dady).removeClass('jstree-open').addClass('jstree-closed');
                var html = $('#'+dady).html();
                if(html.indexOf('Not working') < 0){
                    $('#'+dady).append('<div style="position:relative;display:inline-block;color:red;">----------------------&gt; Not working</div>');
                }
                this.Gnodes[dady].isOpen = 'false';
            }
        }else{
            console.log('Error daday isempty....');
        }
        //setTimeout("$('#"+dady+"').removeClass('jstree-closed').addClass('jstree-open');console.log($('#"+dady+"').html());",20);
        // TODO : dady AND IdOfactiveNode SHOULD BE ONE ???maybe...
        this.Gnodes[dady].children = firstLevelChildren;
        //Add up Objects newNodes to global array of nodes : this.Gnodes
        if(this.Gnodes)  jQuery.extend(this.Gnodes,        newNodes);//firstLevelChildren
        else        this.Gnodes =                        newNodes;
        if(debug_that_call_back) dump(this.Gnodes);
        //if(debug_that_call_back) 
        //a_lert('Yeschildren found = '+firstLevelChildren.length + ' and back ='+back);
        if(dady && firstLevelChildren.length){  
            //a_lert('Adding_NOWNOW '+back);
            $('#'+dady).after('<li><ul>' + back + '</ul></li>');
            $('a').addClass('font_color');
            for( var child_index in this.Gnodes[dady].children){
                child_node_id = firstLevelChildren[child_index];
                this.add_events_to_node_id(child_node_id);
            }
        }
        var idx = js_in_array(this.AnodesBeingLoaded, dady);
        if(idx !== -1){
            this.AnodesBeingLoaded = removeIndexFromArray(this.AnodesBeingLoaded, idx);
        }
        if(node_to_select != 'none'){ 
            if(force_red_selection == false && this.GA_id_multi_selected.length === 0){
                //a_lert('Node slected = '+node_to_select+' innit : '+this.getIdOfActiveNode());
                this.set_active_node(node_to_select);
                //setTimeout('scroll_active_node_to_the_middle();', 100);
                //this.scroll_active_node_to_the_middle();
            }else{
                this.bro2_multi_select_no_limits(node_to_select);
                if(this.AnodesWaitingTobeMultiSelected.length){
                    var ready_to_remove = [];
                    for(var i=0 ; i < this.AnodesWaitingTobeMultiSelected.length ; i++){
                        node_to_select = this.AnodesWaitingTobeMultiSelected[i];
                        if( G(node_to_select) ){
                            //a_lert('Perfect 2nd multi slect '+node_to_select);
                            this.bro2_multi_select_no_limits(node_to_select);
                            ready_to_remove.push(i);
                        }
                    }
                    for(var i=ready_to_remove.length -1 ; i >= 0  ; i--){
                        ///a_lert('Removing '+ready_to_remove[i]+'from array'+this.AnodesWaitingTobeMultiSelected);
                        this.AnodesWaitingTobeMultiSelected = removeIndexFromArray(this.AnodesWaitingTobeMultiSelected, ready_to_remove[i]);
                    }
                }
            }
        }else{
            if( dady==this.Ghtml_root && this.getBrow2state() == 'normal'){
                if(this.getIdOfActiveNode() == this.Ghtml_root)
                    this.set_active_node('recoloring_same_node',true);
                else
                    this.set_active_node(this.Ghtml_root,true);
                //G(div_id).focus();    //setTimeout(function () { $("#"+this.Ghtml_root).jstree("set_focus"); }, 500);
            }
        }
        if(G('isBrowserFullyLoaded')) G('isBrowserFullyLoaded').value = 'true';// Help auto test a bit.
        ///a_lert('AAAA:setting new children of dady='+dady+':::: '+G(dady).nextSibling.innerHTML);
        ignore_subsequent_request = false;
        if(JSON.stringify(secondLevelChildren) !== '{}'){
            //a_lert('Go level 2 with ' + JSON.stringify(secondLevelChildren));
            //dump(secondLevelChildren);
            this.parse_one_folder_call_back( 'OK' + JSON.stringify(secondLevelChildren));
            reset_jquery_styles();
        }
        ///////MAKE BROWSER SCROLL JUMP  if(G('div_file_browser')) G('div_file_browser').focus();  SO NO NEED FOR window.scrollTo(0,0);
    };
    GO_tree.prototype.add_events_to_node_id = function(child_node_id){
        // MOUSEOVER ON ARROW
        $('#otot_link_' + child_node_id).mouseover( {'child_node_id' : child_node_id, 'object_tree' : this}, 
            function(event) { 
                var html_id        = event.data.child_node_id;
                var object_tree    = event.data.object_tree;
                object_tree.set_active_node( html_id );
            }
        );
        // CLICK ON ARROW
        $('#otot_arrow_' + child_node_id).click(  {'child_node_id' : child_node_id, 'object_tree' : this}, 
            function(event) { 
                var html_id        = event.data.child_node_id;
                var object_tree    = event.data.object_tree;
                object_tree.bro2_arrow_clicked(html_id, event);
                // NOK cos working well in brow2 to make parallell request
                //ignore_subsequent_request = true;
            }
        );
        // CLICK ON LABEL
        $('#otot_link_' + child_node_id).click(  {'child_node_id' : child_node_id, 'object_tree' : this}, 
            function(event) { 
                event.preventDefault();  //easy to test in destinationof copy_entity ! VERY VERY important to prevent scroll jumping back to the top of that window !!!!!
                var html_id        = event.data.child_node_id;
                var object_tree    = event.data.object_tree;
                if( ! object_tree.is_folder(html_id) ){
                    object_tree.bro2_edit_file(html_id, event);
                }else{
                    object_tree.bro2_click_folder(html_id, event);
                }
                // NOK cos working well in brow2 to make parallell request
                //ignore_subsequent_request = true;
            }
        );
    };
    GO_tree.prototype.get_node_begin = function(html_id, node){
        var r = '';
        if(!node || !node.fileName){    console.log('big pb here cos node==' + node);        return;        }
        var txt = node.fileName;    
        if(!isNaN(txt)) txt += ' ';
        if(isNaN(node.fileName) && (node.fileName===null || !node.fileName.indexOf)){
            console.log('bug in brow2 cos node='+node+' so node.fileName='+node.fileName);
        }
        if(isNaN(node.fileName) &&  node.fileName.indexOf('/')!==-1){// ROOT FOLDER !!
            node.fileName = '';
        }
        if(this.colored_weight && node.nb_child)  txt += ' - ' + node.nb_child;
        // Add delete button for DB source/dest favorites
        var extra_txt = '';
        if( node.tag_svr_id ){ 
            var parentFolderName = this.Gnodes[this.get_parent_node(html_id)].fileName;
            // Or span class="tiny-button border_font...
            extra_txt =    ' <input type="button" class="tiny-button" id="button_delete_'+html_id+'" value="Del." onclick="' + 
                        'varInTab[' + this.tabCounter + '].' + 
                        this.this_object_name + ".delete_faves('" + // SPECIAL FCT not calling PHP, just above !
                            node.tag_fave_id + "','" +
                            (this.tree_div_name == 'div_db_tree_destination' ? 'db_favorite_destinations' : 'db_favorite_sources') + "','" + 
                            html_id + "','" +
                            node.fileName + '\');"> ';
                            
            if(this.tree_div_name == 'div_db_tree_destination'){
                extra_txt +=' <input type="button" class="tiny-button" id="button_edit_'+html_id+'" value="Edit" onclick="' + 
                        'varInTab[' + this.tabCounter + '].' + 
                        this.this_object_name+'.edit_faves(\'' + node.tag_fave_id + '\');">&nbsp;';
            }
        }
        if(node.isFolder !== 'true'){        r = ' class="jstree-leaf" ';        }
        else{
            if(node.isOpen !== 'true')        r = ' class="jstree-closed" ';        
            else                            r = ' class="jstree-open" ';
        }
        back    = "\n"+'<li id="' + html_id + '"' + r + '><ins id="otot_arrow_' + html_id + '" class="jstree-icon" style="margin-top:2px;">&nbsp;</ins>';
        back   += extra_txt + '<a href="#" class="border_transparent" id="otot_link_' + html_id + '"';
        //back   += '><ins class="jstree-icon">&nbsp;</ins>' + txt +'</a></li>';
        var level = this.guess_node_level(html_id);
        if(this.icons_per_level[level] === '') {
            back   += '>' + txt +'</a></li>';
        } else {
            back   += '><span class="single_icon ' + this.icons_per_level[level] + '">&nbsp;</span>' + txt +'</a></li>';
        }
        return back;
    };
    GO_tree.prototype.guess_node_level = function(html_id){
        var z = html_id.indexOf('__');
        var level = 0;
        while(z >=0 ){
            z = html_id.indexOf('__', z + 2);
            level++;
        }
        return level;
    };
    
    var G_html_id_fave_deleted = null;
    var G_object_tree_fave_deleted = null;

    GO_tree.prototype.delete_faves = function(tag_fave_id, data_type, html_id, label){
        ///var src_or_dest = (data_type === 'db_favorite_destinations' ? 'destination' : 'source');
        var data = 'Are you sure you want to delete the favorite named: ' + label + '? ';
        G_html_id_fave_deleted = html_id;
        G_object_tree_fave_deleted = this;
        params_from_above = { 'object_tree' : this, 'post_data' : {'sql_id':tag_fave_id, 'data_type':data_type, 'html_id_fave':html_id, 'just_testing':'false'}};
        showDivConfirm( data, this.delete_faves_confirmed, 'Confirmation before delete', false, params_from_above );
        ///parent.delete_user_file(tag_fave_id, data_type, true);
    };
    GO_tree.prototype.delete_faves_confirmed = function(params_from_above){
        var url = pos+"page_ajax_all?module=delete_dbec_row";
        $.ajax({
                type: "POST",
                url: url,
                data    : params_from_above.post_data,
                success    : params_from_above.object_tree.delete_fave_call_back 
        });
        show_central_spinner();
    };
    GO_tree.prototype.delete_fave_call_back = function(data){
        hide_central_spinner();
        if( !check_ajax_response_first_2_chars_is_ok( data, 'Error in delete_fave_call_back. ')){
            return;
        }
        var html_id         = G_html_id_fave_deleted;
        G_object_tree_fave_deleted.GA_id_multi_selected = removeValueFromArray(G_object_tree_fave_deleted.GA_id_multi_selected, html_id);
        delete G_object_tree_fave_deleted.Gnodes[html_id];         //this.Gnodes.splice(html_id, 1);
        G(html_id).remove();
    };
    GO_tree.prototype.edit_faves = function(tag_fave_id){ ///}, data_type, html_id){
        //$("#edit_destination_faves").dialog('option', 'buttons', myButtons);//$('#edit_destination_faves').dialog('open');
        var options = jQuery.extend({}, dialogOptions);
        options.height = 630;
        options.width = 800;
        $("#edit_destination_faves").dialog(options);//.data('parent', $(this)); //Let the dialog know what opened it;// dialog initialisation        
        
        reset_jquery_styles();
        show_central_spinner(); ///$('#wait_box').dialog('open'); 
        $("#edit_destination_faves").load( Opages.edit_fave_target.php_url, [], 
            // closure to get correct value for i
            (function(preservedTabCounter) {
                $.getScript(Opages.edit_fave_target.js_url, function(){
                    $.get( Opages.edit_fave_target.php_json_url + '?ajax=true&tab_counter=' + preservedTabCounter
                        + '&src_or_dest=destination&tag_fave_id=' + tag_fave_id, 
                        function (backSpecial){
                            $("#edit_destination_faves").dialog('open');
                            init_js_in_edit_fave_target(backSpecial);
                            $("#wait_box").dialog('close');
                        }
                    );
                });
            })(this.tabCounter)
        );
        /*else{ // GET DOES WORK like LOAD but it seenms much slower ????
            $.get(pos + 'page_edit_favorite_db_group?src_or_dest=destination&tag_fave_id=' + tag_fave_id, function(html){ 
                $("#edit_destination_faves").html( html );
                $("#edit_destination_faves").dialog('open');
                $("#wait_box").dialog('close');
            });
        }*/
    };
});
