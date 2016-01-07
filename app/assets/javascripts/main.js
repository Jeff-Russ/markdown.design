// By Jeff Russ https://github.com/Jeff-Russ
//= require jquery
//= require jquery_ujs


window.showToc;
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
	/*_~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~_~._.~~._.~~._.~~._
       INITIALIZE GLOBAL VARIABLES */
   window.$tocAnchors   = $('#toc').find('a[href^="#"]'); // sidebar <a>-> headers
   window.topOffset     = $('#topbar').height() * 0.8;    // height of topbar 
   window.$tocFollowBtn = $('#toc-follow-btn');
   window.tocFollow     = true;  window.$tocFollowBtn.addClass("on");
   window.$tocBtn       = $('#toc-btn');
   window.showToc       = true;  window.$tocFollowBtn.addClass("on");
	
	if (!window.HomeUrl) window.HomeUrl = "http://www.jeffruss.com/";
	
	/*_~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~_~._.~~._.~~._.~~._
       ADD HOME URL AND LOGO 	*/
   window.HomeUrl = $('#home-url').comments().html();
	$('.home-url').attr('href', window.HomeUrl);
	var logoUrl    = $('#logo-url').comments().html();
	if (!logoUrl)
	   logoUrl ="https://s3.amazonaws.com/shared-img-res/JR%20logo/JR_20px_wide.png";
	$('.logo-url').attr('src', logoUrl);
	
	/*_~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~_~._.~~._.~~._.~~._
       FORMERLY "onPageLoad"  */
   if(window.location.hash) {   // initial load from url hash
      window.$topViewElem = $(window.location.hash);
   } else {                     // initial load without url hash
      var $firstSection = $('.section').first();
      window.$topViewElem = $firstSection;
   }

   window.determineSection();
   window.updateTopbar();
   
   if (true) { // true should be window.showToc
      var tocFollowSetting = window.tocFollow; 
      window.tocFollow = true; // temporarily make true
      window.updateToc();
      window.tocFollow = tocFollowSetting; // restore setting
   } 
   
	/*_~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~_~._.~~._.~~._.~~._
       CONFIG TO DEVICE  */    
	var isMobile = navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/);
	if (!isMobile && $(window).width() >= 630 && window.hasToc )
	     window.showToc = true;
	else window.showToc = false;
	
	window.toggleSidebar();
   
	/*_~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~_~._.~~._.~~._.~~._
       ADD HANDLERS */
   $(window).on("scroll", window.findNewPosition);   
   $(window).scrollEnd(function(){
       window.findNewPosition;
   });
   window.$tocAnchors.on('click', window.onTocClick); 
   window.$tocFollowBtn.on('click', window.onTocFollowBtnClick);
	if (window.hasToc) {	
	   window.$tocBtn.on('click', window.onTocShowBtnClick); 
	}
	
	/*_~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~_~._.~~._.~~._.~~._
       SET UP MODAL MENUS */
   window.page_menu();
   window.section_menu();

   /*_~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~_~._.~~._.~~._.~~._
       GOOGLE ANALYTICS  */
	(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
	(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
	m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m);
	})(window,document,'script','//www.google-analytics.com/analytics.js','ga');
	
	ga('create', 'UA-71741017-1', 'auto');
	ga('send', 'pageview');
	// END google analytics
	
}); 

window.debug = function(text){
   $('.debug').append(text + ';' + '\u0020');
}


window.toggleSidebar = function() 
{
	if ( window.showToc ) {
		$('#reader').css('width', '64%').css('padding-right', '2%');
		$('#sidebar').css('display', 'inline-block');
		$('.mono').css('white-space','pre').css('overflow','scroll');
		$('#toc-btn').addClass('on');
		$('#topbar').css('width', '68%');
		$('.topbar-btn').css('width', '8%');
		$('.topbar-btn-1-7').css('left', '4%');
		$('.topbar-btn-2-7').css('left', '13%');
		$('.topbar-btn-3-7').css('left', '22%');
		$('.topbar-btn-4-7').css('left', '31%');
		$('.topbar-btn-5-7').css('left', '40%');
		$('.topbar-btn-6-7').css('left', '49%');
		$('.topbar-btn-7-7').css('left', '58%');
		
	} else {
		$('#reader').css('width', '96%');
		$('#sidebar').css('display', 'none');
		$('.mono').css('white-space','pre-wrap').css('overflow','initial');
		$('#toc-btn').removeClass('on');
		$('#topbar').css('width', '99%');
		$('.topbar-btn').css('width', '12%');
		$('.topbar-btn-1-7').css('left', '4%');
		$('.topbar-btn-2-7').css('left', '17%');
		$('.topbar-btn-3-7').css('left', '30%');
		$('.topbar-btn-4-7').css('left', '43%');
		$('.topbar-btn-5-7').css('left', '56%');
		$('.topbar-btn-6-7').css('left', '69%');
		$('.topbar-btn-7-7').css('left', '82%');
	}
}