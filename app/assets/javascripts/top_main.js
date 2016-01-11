
/* By Jeff Russ https://github.com/Jeff-Russ
~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._*/

//= require jquery
//= require jquery_ujs
//= require bootstrap-sprockets

//= require shared
//= require top_funcs
// require top_topbar


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
	/*_~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._
       CONFIG TO DEVICE AND WINDOW */  
   // call once on load:
   onWindowResize();
   initTopbarBtns();

	/*_~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._
       ADD HANDLERS */
   window.topOffsetInit();
   $( window ).resize(onWindowResize()); // and add handler for resizing of window
   $('#toggle-topbar-btn').on('click', window.onToggleTopbarBtnClick); 


	/*_~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._
       ADD HOME URL AND LOGO 	*/
   window.HomeUrl = $('#home-url').comments().html();
	$('.home-url').attr('href', window.HomeUrl);

}); 

function initTopbarBtns(){
   $('.topbar-btn').addClass('topbtn-greenwell fixed');
}