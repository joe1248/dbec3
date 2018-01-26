import $ from "jquery";
//global.$ = $;
import 'jquery-ui';

class Styling {
    reset_styles() {
        $('.top_tabs').css(			{ 'width':($(window).width() - 179) + 'px'});
        $('.tab_content').css(		{ 'width':($(window).width() - 5) + 'px'});
        $('.tab_content').css(		{ 'height':($(window).height() - 28) + 'px', 'margin-top':'40px'});// DO NOT CHANGE margin top cos scroll bar top too !!
        $('#home_tab_welcome').css(	{ 	'height':($(window).height() - 62) + 'px',
            'width' :($(window).width()  - 48) + 'px'});// DO NOT CHANGE margin top cos scroll bar top too !!

        $( "input[type=submit], input[type=button], button" ).button();///.removeClass('.ui-widget input');
        $( "select" ).addClass("ui-widget");
        $( "input[type=text], input[type=password]" ).addClass("ui-button").addClass("ui-corner-all");
        $( "input[type=text], input[type=password]" ).addClass("medium-input").addClass("align_left");
        $( '#user_name' ).removeClass("medium-input");
        $( '#user_pass' ).removeClass("medium-input");

        // ANNOYING FOR coold db tool $('.medium-input').css("font-size",'75%');


        $('.fieldset').addClass("ui-corner-all");
        $( "h2" ).addClass("border_title");//.addClass("ui-corner-all");
        $('input[type=submit], input[type=button]').keydown(function(event){
            ///console.log('event.keyCode = ' + event.keyCode);
            if(event.keyCode==13){
                $(this).trigger('onmousedown');
            }
        });
        /* ANNOYING FOR coold db tool use css class instead !! add !important if you need
        $('.tiny-button').css("font-size",'50%');
        $('.small-button').css("font-size",'65%');
        $('.medium-button').css("font-size",'75%');
        */
        // TOO COLORED : $('fieldset').addClass('back_color');
        $('fieldset').css('background-color','#eee');
        ///$('.little_box').addClass("ui-corner-all");
    }
}
export default new Styling;