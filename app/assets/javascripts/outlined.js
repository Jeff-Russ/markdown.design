//= require jquery
//= require jquery_ujs
//= comments.js 

// global vars: 
var $links; 
var $topics; 
var $prevActive; 
var topOffset;
var $home;
var subject;

$( document ).ready(function(){
    setTimeout(updateTocFromHash, 100);
});// END document.ready

function updateTocFromHash () {

	// initil load from url hash:
	if(window.location.hash) { 
	    
        // var y = $(window).scrollTop();  // your current y position on the page
        // $(window).scrollTop( y + 100);     // offset by height of top navbar
        
		var hash = window.location.hash;
		$links.attr('id', 'toc-inactive');
		
		
		$links.each(function () { 
			var $currentLink = $(this)
			// var $prevActive = $links.find('#active');
			var refElement = $currentLink.attr("href"); // get value of href attr
			// $currentLink.attr('id', 'toc-inactive');
			// check position of <a> in <nav>
			if (refElement === hash) { 
				
				$links.attr('id', 'toc-inactive');
				$currentLink.attr('id', 'toc-active');        //  and add active to match
				$prevActive = $currentLink;
				tocScroller() // reposition table of contents
				var currentTopic = $(hash).prevAll('.topic').attr('id')
				$('#topic-btn').text(currentTopic);
			}
			else {
			 //   $('#topic-btn').text(hash.substring(1));
			}
		});
		
		// for offset
		$("html, body").delay(100).animate({    
		    scrollTop: $(hash).offset().top - topOffset 
		}, 200);
	// intial load without url hash:
	} else {
		$home.attr('id', 'toc-active');
		$prevActive = $home
	}
	
}

// update scrolling of toc by position in text:
function tocScroller() {
	var toc = document.getElementById("toc");
	var tocHeight = toc.height;
	var activeElement = document.getElementById("toc-active");
	var activePos = activeElement.offsetTop;
	var sidebarHeight = document.getElementById('sidebar').offsetHeight;
	var offset = activePos - sidebarHeight * 0.2
    var maxOffset = tocHeight - sidebarHeight;
    if (offset > maxOffset) { offset = maxOffset; }
    else { offset = offset; }
	var correction = -offset;
	if (activePos > sidebarHeight * .95)
		$( "#toc" ).animate({ marginTop: correction }, 300);
	else 
		$( "#toc" ).css('margin-top', 0);
	}


$( document ).ready(function() {
	
// 	to fix navbar hiding to of content when linksing to spot in page
//     by offsetting by 50. REMEMBER TO ADJUST SCROLL LISTENER BY SAME VALUE!
    // window.addEventListener("hashchange", function() { scrollBy(0, -190) });
    
    // $( ":header" ).css({ "margin-top": "100px" });
	
	// initialize: 
	$links = $('#toc').find('a');           // we'll need this a lot
	$topics = $('#topic');                  // we'll need this a lot
	$prevActive                             // and this
	topOffset = $('#topbar').outerHeight(true) // and this
	$home = $('a[href^="#toc_0"]');         // this too
	subject = $( "#subject" ).comments().html();// get subject from markdown comment

	
	$links.attr('id', 'toc-inactive')           // make all toc <a> id='inactive'
	$(document).on("scroll", onScroll);         // add scroll listener on content
	$('a[href^="#"]').on('click', onTocClick);  // add click listener on toc
	
	
	$('#subject-btn').text(subject)                 // use it to set subject button
	
	// click listener for toc
	function onTocClick (e) {   // e == object that raised the event
		e.preventDefault();           // bypass clicked <a>'s native bahavior 
		$(document).off("scroll");    // remove event handler on scroll
		$links.attr('id', 'toc-inactive');
		
		$(this).attr('id', 'toc-active');   // add our own active status to clicked <a> 
		
		var target = this.hash;
		var $target = $(target);
		$('html, body').stop().animate({
			'scrollTop': $target.offset().top - topOffset 
		}, 100, 'swing', function () {
			window.location.hash = target;
			$(document).on("scroll", onScroll);
		});
		var currentTopic = $(target).prevAll('.topic').attr('id')
		$('#topic-btn').text(currentTopic);
	}
	
	// listen to user and animated scrolling of content:
	function onScroll() {
		var scrollPosition = $(document).scrollTop(); // distace from top
		// var scrollPosition =  $('#body').offset().top;
		
		// Iterate all <a> descendant of <nav> (the links to locations)
		$links.each(function () { 
			var $currentLink = $(this)
			// var $prevActive = $links.find('#active');
			var $refElement = $($currentLink.attr("href")); // get value of href attr
			// check position of <a> in <nav>
			if ($refElement.position().top + -50 // OFFSET 50 for navbar height + more 
				<= scrollPosition && $refElement.position().top - 50 + 
				$refElement.height() > scrollPosition) { // if it is near top of page:
				$links.attr('id', 'toc-inactive');
				$currentLink.attr('id', 'toc-active');        //  and add active to match
				$prevActive = $currentLink;
				tocScroller() // reposition table of contents
				
				// set topbar button:
				var hash = $currentLink.attr('href')
				var currentTopic = $(hash).prevAll('.topic').attr('id')
				$('#topic-btn').text(currentTopic);
			}
		});
	}// END scroll tracker
	
// 	// run tocScroller when scrolling stops for 1 sec
// 	$(window).scroll(function() {
//         clearTimeout($.data(this, 'scrollTimer'));
//         $.data(this, 'scrollTimer', setTimeout(function() {
//             tocScroller();
//             console.log("Haven't scrolled in 250ms!");
//         }, 1000));
//     });
	

});// END document.ready