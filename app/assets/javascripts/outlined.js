/******************************************************************************/

//= require jquery
//= require jquery_ujs
//= comments.js 

/******************************************************************************/

// global vars: 
var $tocElem		// the table of contents element
var $links;			// links in table of contents sidebar to headers
var $debugL 
var $debugR 
var $toc_0; 		// highest <a> in toc
var topOffset;		// height of navbar on top of page
var pageName;	   // get page name from markdown comment 
var tocElem;		// the table of contents element
var tocHeight;		// hight of table of contents
var $htmlBody;		// the body of the page
var $sectionBtn;  // the button that shows and selected a section
var $sections;    // all sections markers as definined in markdown
var topSection;   // the first element in toc which points to top of page

var $prevActive;

var activeElement
var activePos 
var sidebarHeight
var maxOffset

var tocFollow = true;

window.onhashchange = function() {  setTimeout(pageLoadFromFromHash(), 400); }

// jQuery extension call "callback" after scrolling stops for "timout" ms.
$.fn.scrollEnd = function(callback, timeout) {          
  $(this).scroll(function(){
    var $this = $(this);
    if ($this.data('scrollTimeout')) {
      clearTimeout($this.data('scrollTimeout'));
    }
    $this.data('scrollTimeout', setTimeout(callback,timeout));
  });
};


/******************************************************************************/

$( document ).ready(function() {
	
	// initialize global vars:
	$tocElem    = $('#toc');
    $debugL     = $('#debug-l');
    $debugR     = $('#debug-r');
	$links      = $tocElem.find('a');
	$toc_0      = $('a[href^="#toc_0"]'); 
	topOffset   = $('#topbar').outerHeight(false);
	pageName    = $("#page").comments().html();
	tocElem     = document.getElementById("toc");
	tocHeight   = tocElem.height;
	$htmlBody   = $("html, body");
	$sectionBtn = $('#section-btn');
	$sections   = $('.section');
	topSection  = $sections.first().attr('id');
	$('#toc-follow-btn').addClass('on');
	
	// make all toc <a> id='inactive'
	$links.attr('id', 'toc-inactive')
	
	// add handlers:
	$(window).on("scroll", findNewPosition);  // add scroll listener on content
	// $(window).scrollEnd(tocScroller(), 1000);
	$('a[href^="#"]').on('click', onTocClick);  // add click listener on toc
	
	$(window).scroll(function() {
	    clearTimeout($.data(this, 'scrollTimer'));
	    $.data(this, 'scrollTimer', setTimeout(function() {
	        // do something
	        
	        tocScroller();
	    }, 500));
	});
	
	$('#toc-follow-btn').on('click', function(){
		$(this).toggleClass('on');
		if ($(this).hasClass('on')) {
			tocFollow = true;
			$('#toc-follow-img, #toc-follow-txt').css('opacity','.9');
			findNewPosition()
		} else {
			tocFollow = false;
			$('#toc-follow-img, #toc-follow-txt').css('opacity','.4');
			tocScroller() 
		}
	});
	
	pageLoadFromFromHash() 
	
	
});// END document.ready

/******************************************************************************/

// TODO CHANGE TO TOGGLECLASS .toc-on 

function pageLoadFromFromHash () 
{
	if(window.location.hash) { // initial load from url hash
		$links.attr('id', 'toc-inactive');
		
		$links.each(function () { 
			var $currentLink = $(this)
			var refElement = $currentLink.attr("href"); // get value of href attr
			
			if (refElement === window.location.hash) { 
				$links.attr('id', 'toc-inactive');
				$currentLink.attr('id', 'toc-active');   //  and add active to match
				$prevActive = $currentLink;
				setTimeout(tocScroller(), 700); // reposition table of contents
				var currentSection = $(window.location.hash).prevAll('.section').attr('id')
				commitNewPosition(pageName, currentSection);
			}
		});
		
		$htmlBody.delay(10).animate({   // for offset
			scrollTop: $(window.location.hash).offset().top - topOffset 
		}, 200);
		
		var $currentSection = $(window.location.hash);
		var $prevSection    = $currentSection.prevAll('.section');
		var prevHash = '#'  + $prevSection.attr('id')
		var $notNextSection = $currentSection.nextAll('.section')
		var $nextSection    = $notNextSection.nextAll('.section')
		var nextHash = '#'  + $nextSection.attr('id')
		
	// intial load without url hash:
	} else {
		$toc_0.attr('id', 'toc-active');
		$prevActive = $toc_0
		commitNewPosition(pageName, topSection);
	}
}


/******************************************************************************/

// click listener for toc
function onTocClick (e)          // e == object that raised the event
{   
	e.preventDefault();           // bypass clicked <a>'s native bahavior 
	$(document).off("scroll");    // remove event handler on scroll
	$links.attr('id', 'toc-inactive');
	
	$(this).attr('id', 'toc-active');   // add our own active status to clicked <a> 
	
	var target = this.hash;
	var $target = $(target);
	$htmlBody.stop().animate({
		'scrollTop': $target.offset().top - topOffset 
	}, 100, 'swing', function () {
		window.location.hash = target;
		$(document).on("scroll", findNewPosition);
	});
	var currentSection = $(target).prevAll('.section').attr('id')
	commitNewPosition(pageName, currentSection)
}

/******************************************************************************/

// listen to user and animated scrolling of content:
function findNewPosition() {
	var scrollPosition = $(document).scrollTop(); // distace from top
	// var scrollPosition =  $('#body').offset().top;
	// $debugL.text("looking...")
	// Iterate all <a> descendant of <nav> (the links to locations)
	$links.each(function () { 
		var $currentLink = $(this)
		var $refElement = $($currentLink.attr("href")); // get value of href attr
		// check position of <a> in <nav>
		if ($refElement.position().top + -50 // OFFSET 50 for navbar height + more 
			<= scrollPosition && $refElement.position().top - 50 + 
			$refElement.height() > scrollPosition) { // if it is near top of page:
			$links.attr('id', 'toc-inactive');
			$currentLink.attr('id', 'toc-active');        //  and add active to match
			$prevActive = $currentLink;
			// tocScroller() // reposition table of contents
			
			// set topbar buttons:
			var hash = $currentLink.attr('href')
			var $currentSection = $(hash).prevAll('.section')
			var currentTopic = $currentSection.attr('id')
			commitNewPosition(pageName, currentTopic);
			$debugL.text("found match.")
		}
	});
}

/******************************************************************************/

function commitNewPosition (page, section) 
{
	$('#page-btn').text(page)              // use it to set page button
	document.title = page + ' ' + section; // set title on top of browser tab
	var currentSectionId = '#' + section;
	var prevSection = $(currentSectionId).prevAll('.section').attr('id');
	if (prevSection == undefined) { prevSection =  'toc_0'; };
	var nextSection = $(currentSectionId).nextAll('.section').attr('id');

	$sectionBtn.text(section);
}

/******************************************************************************/
var currentScroll;
// update scrolling of toc by position in text:
function tocScroller() 
{
	
	if (tocFollow)  // disabled for now
	{
		
		var activeElement = document.getElementById("toc-active");
		var activePos     = activeElement.offsetTop;
		var sidebarHeight = document.getElementById('sidebar').offsetHeight;
		var sidebarUpper  = sidebarHeight * 0.3;
		var offset        = activePos - sidebarUpper;
		var maxOffset     = tocHeight - sidebarHeight;

		$debugR.text(currentScroll + ' ' + activePos + " / " + sidebarHeight )
		
		if (offset > maxOffset) { offset = maxOffset; }
		else                    { offset = offset;    }
		
		var correction = -offset;
		
		if ((activePos > sidebarHeight * .95) || 
		    (currentScroll < activePos + sidebarUpper) ) {
		
			$('#sidebar').animate({ scrollTop: offset}, 300);
			currentScroll = offset
			// $debugR.text(currentScroll + ' '  + activePos + " / " + sidebarHeight ).delay(1000)
		} 
	// 	else 
	// 		// $debugR.text(currentScroll + ' '  + activePos + " / " + sidebarHeight ).delay(1000)
	// 		$tocElem.css('margin-top', 0);
	// 		currentScroll = offset
	// } else {
	// 	$tocElem.height("0px")
	// 	currentScroll = 0
	}
}

/******************************************************************************/