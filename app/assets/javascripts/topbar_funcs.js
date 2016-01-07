/* By Jeff Russ https://github.com/Jeff-Russ
= require jquery
= require jquery_ujs
= comments.js 

INTER-FILE INTERDEPENDENCIES:
    VARS READ:      window.currHashName    window.prevHash      window.nextHash

    FUNCS DEFINED: Just look down there
*/



//  CLOSES ANY MODAL WINDOW. HANDY! ____________________________________________
window.close_modal = function () { 
	$( "button[data-dismiss='modal']").trigger("click");
};


//  POPULATE PAGE SELECTION MODAL ______________________________________________
window.page_menu = function () {
	var $pageMenu = $('#page-menu'), 
		$pages = $('.page-menu'), numOfPages = $pages.size();
	// get home url from markdown comment:
	$pageMenu.append("\
		<div class='col-xs-4 centered-div'>\
			<a class='dismiss btn btn-xlarge btn-block btn-warning \
			   btn-ghost modal-link' \
				href='" + window.HomeUrl +"'>" + 'Home' + "\
				</a>\
		</div>");
	
	if ( numOfPages == 0) {
	    $pageMenu.prepend("<div class='col-xs-4'>");
	} else if (numOfPages == 1 ) {
		$pageMenu.prepend("<div class='col-xs-2'>");
	} else { 
	}
	var btnColors = ["info","success","warning","primary","danger"];
	var i = 0;
	$pages.each(function () { 
		$pageMenu.append("\
			<div class='col-xs-4 centered-div'>\
				<a class='dismiss btn btn-xlarge btn-block btn-"+btnColors[i]+" \
				   btn-ghost modal-link' \
					href='"+ $(this).comments().html()+"'>"+ $(this).attr('id')+"\
					</a>\
			</div>");	
		i = ++i % 5;
	});
};


//  POPULATE SECTION MODAL WITH TOC ____________________________________________
window.section_menu = function () {
	var $sectionMenu = $('#section-menu');
	$sectionMenu.append("\
		<div class='col-xs-4 centered-div'>\
			<a class='dismiss btn btn-xlarge btn-block btn-warning \
			   btn-ghost modal-link' \
				href='" + window.HomeUrl +"'>" + 'Home' + "\
				</a>\
		</div>");
	var $sections = $('.section');
	var numOfSections = $sections.size();
	if ( numOfSections == 0) {
	    $sectionMenu.prepend("<div class='col-xs-4'>");
	} else if (numOfSections == 1 ) {
		$sectionMenu.prepend("<div class='col-xs-2'>");
	} else {
		
	}
	var btnColors = ["info","success","primary","warning","danger"];
	var i = 0;
	$sections.each(function () { 
		$sectionMenu.append("\
			<div class='col-xs-4'>\
				<a class='dismiss btn btn-xlarge btn-block btn-"+btnColors[i]+" \
				   btn-ghost modal-link' \
					href='#"+$(this).attr('id')+"'>"+ $(this).attr('id')+"\
					</a>\
			</div>");	
		i = ++i % 5;
	});
	$('.dismiss').on('click', window.close_modal);
};


//  SET VARIABLES NEEDED BY TOPBAR _____________________________________________
window.updateTopbar = function() {
   // set target for prev and next buttons on topbar
   $(".prev-btn").attr('href', window.prevHash);
   $(".next-btn").attr('href', window.nextHash);
   
   var pageName = $("#page").comments().html(); // get page name from md comment
    
   $('#page-btn').text(pageName);                        // set text on page btn 
   $('#section-btn').text(window.currHashName);       // set section btn text
   document.title = pageName+' '+window.currHashName; // set browser tab title
};
