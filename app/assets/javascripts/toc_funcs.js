/* By Jeff Russ https://github.com/Jeff-Russ
= require jquery
= require jquery_ujs

INTER-FILE INTERDEPENDENCIES:
    VARS SET:      window.$topViewElem      window.currHashName
                   window.prevHash          window.nextHash
    READ AND SET:  window.$activeTocAnchor
    VARS READ:     window.tocFollow          window.$tocAnchors
    
    FUNCS CALLED:  window.determineSection() window.updateTopbar()
                   window.updateToc()
    FUNCS DEFINED: Just look down there
*/

//  CLICK LISTENER FOR TOC _____________________________________________________
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


//  TOC SHOW/HIDE BUTTONS LISTENER  ____________________________________________
window.onTocShowBtnClick = function(){
	window.$tocBtn.toggleClass('on');
	if (window.$tocBtn.hasClass('on')) { 
		window.showToc = true;
		$('#toc-btn-img').css('opacity','.9');
		window.toggleSidebar(); 
        tocFollowBtnRestoreState()
	} else { 
		window.showToc = false;
		$('#toc-btn-img').css('opacity','.4');
		window.toggleSidebar();
		window.tocFollow = false;
		$('#toc-follow-img').css('opacity','.4');
	}
};


//  TOC FOLLOW BUTTONS LISTENER  _______________________________________________
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



//  FIND NEW POSITION IN READER ________________________________________________
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


//  DETERMINE SECTION __________________________________________________________
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
   window.$activeTocAnchor = $('a[href="'+activeAnchorHash+'"]');
};


//  ACTIVE LINK AND AUTO SCROLL OF TOC _________________________________________
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
		
			$('#sidebar').animate({ scrollTop: offset}, 300);
			window.currScroll = offset;
		} 
   }
};