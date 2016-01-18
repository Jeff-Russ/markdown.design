 /*~~._.~~._.~~._.~~._.~~._.~~._.~~._~~._.~~._.~~._.~~._.~~._.~~._.~~._~~._.~~*\
|        docview.main.js    part of markdown.design                             |
|        By Jeff Russ       https://github.com/Jeff-Russ                        |
 \._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~.*/

//= require jquery
//= require jquery_ujs
//= require bootstrap-sprockets
//= require shared
//= require docview_funcs
//= require docview_topbar
//= require oscon

window.showToc;
window.hide_toc;
window.hasToc = true;  // eventually we will want this off for some pages.
window.$activeTocAnchor; // TOC anchor which this will have the id toc_active
window.$topViewElem;     // element in reader w/ id hash currently on top of view 
window.$tocBtn;
window.tocFollowBtn;
// window.root = location.protocol + '//' + location.host; // not used but maybe later

// to fix navbar hiding to of content when linksing to spot in page:
window.homeURl;
window.addEventListener("hashchange", function() { scrollBy(0, -45) });


$( document ).ready( function() 
{
   window.on_screen_console(false, false); 
   
	/*_~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._
       INITIALIZE GLOBAL VARIABLES */
   window.$tocAnchors   = $('#toc').find('a[href^="#"]'); // sidebar <a>-> headers
   window.topOffset     = $('#topbar').height();    // height of topbar
   window.$tocFollowBtn = $('#toc-follow-btn');
   window.$tocBtn       = $('#toc-btn');
   window.log("#hide_toc " + $('#hide_toc').attr('data-bool') );
   if ( $('#hide_toc').attr('data-bool') == "true") {
      window.hide_toc  = true;
      window.tocFollow = true;  window.$tocFollowBtn.addClass("on");
      window.showToc   = true;  window.$tocFollowBtn.addClass("on");
   } else {
      window.hide_toc  = false;
      window.tocFollow = false;  window.$tocFollowBtn.removeClass("on");
      window.showToc   = false;  window.$tocFollowBtn.removeClass("on");
      window.onTocShowBtnClick();
      window.tocFollowBtnState()
   }
   
	window.topOffsetInit();
	if (!window.HomeUrl) window.HomeUrl = "http://www.jeffruss.com/";
	
	
	
	/*_~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._
       ADD HOME URL AND LOGO 	*/
   window.HomeUrl = $('#home-url').comments().html();
	$('.home-url').attr('href', window.HomeUrl);
	var logoUrl    = $('#logo-url').comments().html();
	if (!logoUrl)
	   logoUrl ="https://s3.amazonaws.com/shared-img-res/JR%20logo/JR_20px_wide.png";
	$('.logo-url').attr('src', logoUrl);
	
    /*_~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._
       FORMERLY "onPageLoad"  */
   if(window.location.hash)   // initial load from url hash
   {
      if (window.location.hash == "#undefined"){
         window.location.hash = '';
         location.reload();
      } else  
         window.$topViewElem = $(decodeURIComponent(window.location.hash));
   } else {                     // initial load without url hash
   
      var $firstSection;
      if ($('.section').size() > 0) { 
         $firstSection = $('.section').first();
         window.$topViewElem = $firstSection;
      } else if ($('h2').size() > 0){
         $firstSection = $('h2').first();
         window.$topViewElem = $firstSection;
      }
   }

   window.determineSection();
   window.updateTopbar();
   
   if (true) { // true should be window.showToc
      var tocFollowSetting = window.tocFollow; 
      window.tocFollow = true; // temporarily make true
      window.updateToc();
      window.tocFollow = tocFollowSetting; // restore setting
   } 

	/*_~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._
       CONFIG TO DEVICE AND WINDOW */  
   // call once on load:
   onWindowResize();
   // and add handler for resizing of window:
   $(window).resize(onWindowResize());
   
	/*_~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._
       ADD HANDLERS */
   $(window).on("scroll", window.findNewPosition);   
   // $(window).scrollEnd(function(){ window.findNewPosition; });
   window.$tocAnchors.on('click', window.onTocClick); 
   window.$tocFollowBtn.on('click', window.onTocFollowBtnClick);
	if (window.hasToc) window.$tocBtn.on('click', window.onTocShowBtnClick); 

	/*_~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._
       SET UP MODAL MENUS */
   window.populateModalMenus();

}); // END DOCUMENT READY



/*_~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~.
       CONFIG TO DEVICE AND WINDOW SIZE*/   
function onWindowResize()
{
	if (!window.isMobile && $(window).width() >= 800  && window.hasToc)
	   if (window.hide_toc == false) window.showToc = true;
	else
	   window.showToc = false;
	   window.toggleSidebar();
}