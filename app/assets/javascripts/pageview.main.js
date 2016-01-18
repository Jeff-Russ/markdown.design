 /*~~._.~~._.~~._.~~._.~~._.~~._.~~._~~._.~~._.~~._.~~._.~~._.~~._.~~._~~._.~~*\
|        pageview.main.js   part of markdown.design                             |
|        By Jeff Russ       https://github.com/Jeff-Russ                        |
 \._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~.*/

//= require jquery
//= require jquery_ujs
//= require bootstrap-sprockets
//= require pageview_funcs
//= require geturl
//= require shared
//= require oscon

window.topbarFixed = true; // default setting
window.desktopMode;
	/*_~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._
       CONFIG TO DEVICE AND WINDOW SIZE*/   
function onWindowResize(){
	if (!window.isMobile && $(window).width() >= 630)
	   window.desktopMode = true;
	else
	   window.desktopMode = false;
	window.toggleTopbarSpacing();
}

$( document ).ready( function() 
{
   window.on_screen_console(true, false);
	/*_~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._
       CONFIG TO DEVICE AND WINDOW */  
   // call once on load:
   onWindowResize();
   
	/*_~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._
       ADD HANDLERS */
   window.topOffsetInit();
   $( window ).resize(onWindowResize()); // and add handler for resizing of window
   $('#toggle-topbar-btn').on('click', window.onToggleTopbarBtnClick); 
   window.geturlInit();
   
	/*_~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._
       ADD HOME URL AND LOGO 	*/
   window.HomeUrl = $('#home-url').comments().html();
	$('.home-url').attr('href', window.HomeUrl);

}); 
