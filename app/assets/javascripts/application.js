// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or any plugin's vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery_ujs
//= 
//= require_tree .


$( document ).ready(function() {
	
	// to fix navbar hiding to of content when linksing to spot in page
	// by offsetting by 50. REMEMBER TO ADJUST SCROLL LISTENER BY SAME VALUE!
	// window.addEventListener("hashchange", function() { scrollBy(0, -50) });
	
	// initialize: 
	var $links = $('#toc').find('a');          // we'll need this a lot
	$(document).on("scroll", onScroll);        // add scroll listener on content
	$('a[href^="#"]').on('click', onTocClick); // add click listener on toc
	var $home = $('a[href^="#toc_0"]');
	var $prevActive
	
	// initil load from url hash:
	if(window.location.hash) { 
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
				
				// $(document.body).prepend($currentLink.attr("href") + ' ' + hash + '<br>');
				// $('#position').text($currentLink.attr("href"));
			}
		});
	// intial load without url hash:
	} else {
		$home.attr('id', 'toc-active');
		$prevActive = $home
	}

	// click listener for toc
	function onTocClick (e) {   // e == object that raised the event
		e.preventDefault();           // bypass clicked <a>'s native bahavior 
		$(document).off("scroll");    // remove event handler on scroll
		$links.attr('id', 'toc-inactive');
		
		$(this).attr('id', 'toc-active');   // add our own active status to clicked <a> 
		
		var target = this.hash;
		var $target = $(target);
		$('html, body').stop().animate({
			'scrollTop': $target.offset().top - 60
		}, 500, 'swing', function () {
			window.location.hash = target;
			$(document).on("scroll", onScroll);
		});
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
				
				// var href = $currentLink.attr('href');
				// window.location.hash = href; // update url in url bar to keep position
				
			}
		});
	}// END scroll tracker
	
	// update scrolling of toc by position in text:
	function tocScroller() {
		var toc = document.getElementById("toc");
		var activeElement = document.getElementById("toc-active");
		var activePos = activeElement.offsetTop;
		var sidebarHeight = document.getElementById('sidebar').offsetHeight;
		var correction = -(activePos - sidebarHeight * 0.2)
		if (activePos > sidebarHeight * 0.9)
			$( "#toc" ).css('margin-top', correction);
		else 
			$( "#toc" ).css('margin-top', 0);
		}
		
       // google analytics:
       (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
       (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
       m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
       })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
       
       ga('create', 'UA-71741017-1', 'auto');
       ga('send', 'pageview');
       // END google analytics

});// END document.ready