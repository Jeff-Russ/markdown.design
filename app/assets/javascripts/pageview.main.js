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

$( document ).ready( function() 
{
   window.on_screen_console(true, false);
   
   // CONFIG TO DEVICE AND WINDOW
   window.onResize(); // call once on load
   
   // ADD HANDLERS
   window.topOffsetInit();
   $( window ).resize(window.onResize()); // and add handler for resizing of window
   $('#toggle-topbar-btn').on('click', window.onToggleTopbarBtnClick); 
   window.geturlInit();
   
   // ADD HOME URL AND LOGO
   window.HomeUrl = $('#home-url').comments().html();
	$('.home-url').attr('href', window.HomeUrl);

}); 
