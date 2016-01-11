
/* By Jeff Russ https://github.com/Jeff-Russ
~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._*/

//= require jquery
//= require jquery_ujs
//= require bootstrap-sprockets


/*
INTER-FILE INTERDEPENDENCIES:
    VARS SET:      window.$topViewElem      window.currHashName
                   window.prevHash          window.nextHash
    READ AND SET:  window.$activeTocAnchor
    VARS READ:     window.tocFollow          window.$tocAnchors
    
    FUNCS CALLED:  window.determineSection() window.updateTopbar()
                   window.updateToc()
    FUNCS DEFINED: Just look down there
*/

//  CLICK LISTENER FOR TOC ~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._
window.onTocClick = function(e) {   
   // e == object that raised the event
   e.preventDefault();       // bypass clicked <a>'s native bahavior 
   $(document).off("scroll");// remove event handler on scroll
   
   var target = this.hash;
   var $target = $(target);
   $("html, body").stop().animate({
      'scrollTop': $target.offset().top - window.topOffset 
   }, 100, 'swing', function () {
      window.location.hash = target;
      // $(document).on("scroll", window.determineSection()); ADD BACK LATER????
   });

   window.$topViewElem = $target;
   window.determineSection();
   window.updateTopbar();
   window.updateToc();
};

//  TOC SHOW/HIDE BUTTONS LISTENER  ~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.
window.onTocShowBtnClick = function(){
	window.$tocBtn.toggleClass('on');
	if (window.$tocBtn.hasClass('on')) { 
		window.showToc = true;
		$('#toc-btn-img').css('opacity','.9');
		window.toggleSidebar(); 
        tocFollowBtnRestoreState();
	} else { 
		window.showToc = false;
		$('#toc-btn-img').css('opacity','.4');
		window.toggleSidebar();
		window.tocFollow = false;
		$('#toc-follow-img').css('opacity','.4');
	}
};

//  TOC FOLLOW BUTTONS LISTENER  ~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~.
window.onTocFollowBtnClick = function() {
   $(this).toggleClass('on');
    tocFollowBtnRestoreState();
};

function tocFollowBtnRestoreState() {
   if ( window.$tocFollowBtn.hasClass('on') ) {
      window.tocFollow = true;
      $('#toc-follow-img').css('opacity','.9');
      window.findNewPosition();
   } else {
      window.tocFollow = false;
      $('#toc-follow-img').css('opacity','.4');
   }
}

//  FIND NEW POSITION IN READER ~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._
window.findNewPosition = function() {
   var scrollPosition = $(document).scrollTop(); // distace from top

   // Iterate all <a> descendant of <nav> (the links to locations)
   window.$tocAnchors.each( function () 
   { 
      var $thisLink = $(this);
      var $refElement = $($thisLink.attr("href")); // get value of href attr
      // check position of <a> in <nav>
      if ($refElement.position().top - window.topOffset 
         <= scrollPosition && $refElement.position().top - 50 + 
         $refElement.height() > scrollPosition) 
      { 	// if it is near top of page:
         var hash = $thisLink.attr('href');
         window.$topViewElem = $(hash);

         window.determineSection();
         window.updateTopbar();
         window.updateToc();
      }
   });
};

//  DETERMINE SECTION ~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._
window.determineSection = function() {  
   // needs window.$topViewElem
   // and sets the following globals for use elsewhere:
   window.currHashName;
   window.prevHash; 
   window.nextHash;

   var $prevSection, $nextSection,
   activeTocId,  // the id top viewed div in reader that starts with toc_
   $firstSection = $('.section').first(),
   $lastSection  = $('.section').last();

   if ( window.$topViewElem.hasClass("section") ) 
   {
      window.currHashName = window.$topViewElem.attr('id');
      
      if ( window.$topViewElem == $firstSection ) {
         $prevSection = window.$topViewElem;
         $nextSection = window.$topViewElem.nextAll('.section');
      } 
      else if ( window.$topViewElem == $lastSection )
      {
         $prevSection = window.$topViewElem.prevAll('.section');
         $nextSection = window.$topViewElem;
      } 
      else {
         $prevSection = window.$topViewElem.prevAll('.section');
         $nextSection = window.$topViewElem.nextAll('.section');
      }
      activeTocId = window.$topViewElem.nextAll('[id^="toc_"]').attr('id');
      
   } else {
      
      var $lastTocTarget= $('[id^="toc_"]').last();
      
      if ( window.$topViewElem == $lastTocTarget ) {
         $nextSection = $firstSection;    // wrap around to top
      } else {
         $nextSection = window.$topViewElem.nextAll('.section');
      }
      $prevSection = window.$topViewElem.prevAll('.section');
      window.currHashName = $prevSection.attr('id');
      
      activeTocId = window.$topViewElem.attr('id');
   }
   var prevSectionName = $prevSection.attr('id');
   var nextSectionName = $nextSection.attr('id');


   window.prevHash = '#' + prevSectionName;
   window.nextHash = '#' + nextSectionName;
   
   var activeAnchorHash = '#' + activeTocId;
   window.$activeTocAnchor = $('a[href="'+activeAnchorHash+'"]', '#toc');
};

//  ACTIVE LINK AND AUTO SCROLL OF TOC ~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~_
window.updateToc = function () {  
   // needs window.$tocAnchors and $activeTocAnchor
   // and sets the following for use elsewhere:
   window.$tocAnchors.attr('id', 'toc-inactive');
   window.$activeTocAnchor.attr('id', 'toc-active');
   
   window.currScroll; // global only to retain value between calls (only used here)

   if (window.tocFollow)  
   {  
		var activeElement = document.getElementById("toc-active");
		var activePos     = activeElement.offsetTop;
		var sidebarHeight = document.getElementById('sidebar').offsetHeight;
		var sidebarUpper  = sidebarHeight * 0.3;
		var offset        = activePos - sidebarUpper;
		var maxOffset     = tocHeight - sidebarHeight;
      var tocElem       = document.getElementById("toc");
		var tocHeight     = tocElem.height;

		if (offset > maxOffset) { offset = maxOffset; }
		else                    { offset = offset;    }
		
		if ((activePos > sidebarHeight * .95) || 
		    (window.currScroll < activePos + sidebarUpper) ) {
		
			$('#sidebar').animate( { scrollTop: offset}, 300);
			window.currScroll = offset;
		       
		} 
   }
};

//  TOGGLE SIDEBAR ON AND OFF ~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~
window.toggleSidebar = function() 
{
	
   if ( window.showToc ) {
		$('#reader').css('width', '64%').css('padding-right', '2%');
		$('#sidebar').css('display', 'inline-block');
		$('.mono').css('white-space','pre').css('overflow','scroll');
		$('#toc-btn').addClass('on');
		
      $('.topbar').addClass('topbar-toc').removeClass('topbar');
      $('.LL-7').addClass('LL-7-toc').removeClass('LL-7');
      $('.LR-7').addClass('LR-7-toc').removeClass('LR-7');
      $('.CL-7').addClass('CL-7-toc').removeClass('CL-7');
      $('.CC-7').addClass('CC-7-toc').removeClass('CC-7');
      $('.CR-7').addClass('CR-7-toc').removeClass('CR-7');
      $('.RL-7').addClass('RL-7-toc').removeClass('RL-7');
      $('.RR-7').addClass('RR-7-toc').removeClass('RR-7');
      
   } else {
		$('#reader').css('width', '96%');
		$('#sidebar').css('display', 'none');
		$('.mono').css('white-space','pre-wrap').css('overflow','initial');
		$('#toc-btn').removeClass('on');
		
      $('.topbar-toc').addClass('topbar').removeClass('topbar-toc');
      $('.LL-7-toc').addClass('LL-7').removeClass('LL-7-toc');
      $('.LR-7-toc').addClass('LR-7').removeClass('LR-7-toc');
      $('.CL-7-toc').addClass('CL-7').removeClass('CL-7-toc');
      $('.CC-7-toc').addClass('CC-7').removeClass('CC-7-toc');
      $('.CR-7-toc').addClass('CR-7').removeClass('CR-7-toc');
      $('.RL-7-toc').addClass('RL-7').removeClass('RL-7-toc');
      $('.RR-7-toc').addClass('RR-7').removeClass('RR-7-toc');
   }
}