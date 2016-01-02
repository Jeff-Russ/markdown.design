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
//= require bootstrap-sprockets
//= require_tree .



$( document ).ready(function() 
{
	
var isMobile = navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/);

	showTOC(!isMobile && $(window).width() >= 630)
	
	$('#toc-btn').on('click', function(){
		$(this).toggleClass('on');
		if ($(this).hasClass('on')) { 
			showTOC(true); 
		} else { 
			showTOC(false);
		}
	});
	
/* add home link and logo *****************************************************/
	
	var homeUrl    = $('#home-url').comments().html();
	var logoUrl    = $('#logo-url').comments().html();
	
	$('.home-url').attr('href', homeUrl)
	$('.logo-url').attr('src', logoUrl)


/*  google analytics  *********************************************************/

	(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
	(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
	m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
	})(window,document,'script','//www.google-analytics.com/analytics.js','ga');
	
	ga('create', 'UA-71741017-1', 'auto');
	ga('send', 'pageview');
	// END google analytics

});// END document.ready


/*  function Defs  ***********************************************************/




function showTOC(boolean) 
{
	if ( boolean ) {
		$('#reader').css('width', '100%').removeClass('span12').addClass('span8');
		$('#sidebar').css('display', 'inline-block');
		$('.mono').css('white-space','pre').css('overflow','scroll');
		$('#toc-btn').addClass('on')
		
		// $('#debugger').text('on');
	} else {
		$('#reader').css('width', '150%').removeClass('span8').addClass('span12');
		$('#sidebar').css('display', 'none')
		$('.mono').css('white-space','pre-wrap').css('overflow','initial')
		$('#toc-btn').removeClass('on')
		
		// $('#debugger').text('off');
	}
}
		
/*
function resChangeEvt() 
{
	var width = screen.width,
		height = screen.height;
	setInterval(function () {
		if (screen.width !== width || screen.height !== height) {
			width = screen.width;
			height = screen.height;
			$(window).trigger('resolutionchange');
		}
	}, 50);
}
$(window).bind('resolutionchange', doSomething())
*/
/*
function getPPI()
{
	var div = document.createElement("div");// create an empty element
	div.style.width="1in";                  // append it to the body
	var body = document.getElementsByTagName("body")[0];
	body.appendChild(div);
	
	// read the computed width:
	var ppi = document.defaultView.getComputedStyle(div, null).getPropertyValue('width');
	body.removeChild(div);     // remove it again
	return parseFloat(ppi);    // and return the value
}
*/
