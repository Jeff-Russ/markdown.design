
/* By Jeff Russ https://github.com/Jeff-Russ
~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._*/

//= require jquery
//= require jquery_ujs
//= require bootstrap-sprockets

//= require toc_main
/*
INTER-FILE INTERDEPENDENCIES:
    VARS READ:      window.currHashName    window.prevHash      window.nextHash

    FUNCS DEFINED: Just look down there
*/


//  CLOSES ANY MODAL WINDOW. HANDY! ~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~____
window.close_modal = function () { 
	$( "button[data-dismiss='modal']").trigger("click");
};

//  SET VARIABLES NEEDED BY TOPBAR ~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~
window.updateTopbar = function() {
   // set target for prev and next buttons on topbar
   $(".prev-btn").attr('href', window.prevHash);
   $(".next-btn").attr('href', window.nextHash);
   
   var pageName = $("#page").comments().html(); // get page name from md comment
   if (pageName == undefined) {
   	pageName = window.getDocName();
   }   
   $('#page-btn').text(pageName);                  // set text on page btn 
   
   var sectionName;
   if (window.currHashName == undefined) {
   	var currLocInToc = window.$activeTocAnchor.text();
   	sectionName = window.tersify(currLocInToc);
   } else { sectionName = window.currHashName; }

   $('#section-btn').text(window.currHashName);       // set section btn text
   document.title = pageName+' - '+sectionName; // set browser tab title
};


//  POPULATE PAGE SELECTION MODAL ~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~_
window.populateModalMenus = function () {
	
	var $pages, $sections, numOfPages, numOfSections, pageMenuSrc, sectionMenuSrc,
	makePageMenu = true, makeSectionMenu = true;
	
	if ( $('.page-menu').size() > 1) 
	{	
		pageMenuSrc = 'comments'; $pages = $('.page-menu');
		
		if ( $('.section').size() > 1) {
			sectionMenuSrc = 'comments'; $sections = $('.section');	
		}else if ( $('h1').size() > 1 && $('h1').size() < 12) { 
			sectionMenuSrc = 'headers';  $sections = $('h1');
		}else if ( $('h2').size() > 1 && $('h2').size() < 12){
			sectionMenuSrc = 'headers';  $sections = $('h2');
		}
	}
	else if ( $('h1').size() > 1 && $('h1').size() < 12) 
	{	
		pageMenuSrc = 'headers'; $pages = $('h1');
		
		if ( $('.section').size() > 1) {
			sectionMenuSrc = 'comments'; $sections = $('.section');	
		}else if ( $('h2').size() > 1 && $('h2').size() < 12) {
			sectionMenuSrc = 'headers';  $sections = $('h1');
		}else if ( $('h3').size() > 1 && $('h3').size() < 12){
			sectionMenuSrc = 'headers';  $sections = $('h2');
		}
	} 
	else if ( $('h2').size() > 1 && $('h2').size() < 12) 
	{
		pageMenuSrc = 'headers'; $pages = $('h2');
		
		if ( $('.section').size() > 1) {
			sectionMenuSrc = 'comments'; $sections = $('.section');	
		}
		else if ( $('h3').size() > 1 && $('h3').size() < 12) {  
			sectionMenuSrc = 'headers';  $sections = $('h1'); 
		}
		else if ( $('h4').size() > 1 && $('h4').size() < 12){
			sectionMenuSrc = 'headers';  $sections = $('h2');
		}
		else { makeSectionMenu = false; }

	}
	else { makePageMenu = false; }
	
   if (!makePageMenu)    { 
   	$('#page-button').addClass('hidden'); 
   }
	if (!makeSectionMenu) { 
		$('#section-button').addClass('hidden');
		$(".prev-btn").addClass('hidden'); $(".next-btn").addClass('hidden');
	}
	
	var chunk1 = "<div class='col-xs-4 centered-div'> \
			<a class='dismiss btn btn-xlarge btn-block btn-danger \
			btn-ghost modal-link' href='";
	
	if (makePageMenu)
	{
		numOfPages = $pages.size();
		if (numOfPages == 1 ) {
			$pageMenu.prepend("<div class='col-xs-2'>");
		}
		var $pageMenu = $('#page-menu');
		$pageMenu.append(chunk1 + window.HomeUrl + "'>" + 'Home' + "</a></div>");
		populateBtnMenu( $pages, $pageMenu, pageMenuSrc );
	}
	if (makeSectionMenu)
	{  
		numOfSections = $sections.size();
		if (numOfSections == 1 ) {
			$sectionMenu.prepend("<div class='col-xs-2'>");
		}
		var $sectionMenu = $('#section-menu');
		$sectionMenu.append(chunk1 + window.HomeUrl + "'>" + 'Home' + "</a></div>");
		populateBtnMenu( $sections, $sectionMenu, sectionMenuSrc );
	}
	
	// Notice the .dismiss class we added above. 
	// Below makes them also close the modal:
	$('.dismiss').on('click', function() { 
		$( "button[data-dismiss='modal']").trigger("click"); 
	});

	
	function populateBtnMenu($source, $destination, menuSource) 
	{
		var chunk1 = "<div class='col-xs-4 centered-div'><a class='dismiss btn btn-xlarge btn-block btn-";
		var chunk2 = " btn-ghost modal-link' href='#";
		var btnColors = ["info","success","warning","danger","primary"];
		

		var i = 0;
	
		switch (menuSource) 
		{ 
		  case 'comments':
			$source.each( function() { 
				var str = $(this).attr('id');
				str = window.tersify(str);
				$destination.append( chunk1 + btnColors[i] + chunk2 + 
				   $(this).comments().html() + "'>" + str + "</a></div>");
				i = ++i % 5;
			});
			break;
		  case 'headers':
			$source.each( function() { 
				var str = $(this).text();
				str = window.tersify(str);
				$destination.append( chunk1 + btnColors[i] + chunk2 + 
			       $(this).attr('id') + "'>" + str +"</a></div>");
				i = ++i % 5;
			});
			break;
		}
	}
};

