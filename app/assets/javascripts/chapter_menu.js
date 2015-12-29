//= require jquery
//= require jquery_ujs
//= comments.js 


$( document ).ready(function(){
    setTimeout(chapter_menu, 100);
    //setTimeout(close_modal, 100);
	 
	var btnColors = ["success","info","warning","primary","danger"];
	var i = 0;
	function chapter_menu() {
	
		var $topics = $('.topic'); 
		var $chapterMenu = $('#chapter-menu')
		
		$topics.each(function () { 
			$chapterMenu.append("\
				<div class='col-xs-4'>\
					<a class='btn btn-xlarge btn-block btn-" + btnColors[i] + " \
					   btn-ghost modal-link' \
						href='#" + $(this).attr('id') + "'>" + $(this).attr('id') + "\
						</a>\
				</div>")	
			i = ++i % 5;
		})
		
		// $('.modal-body').on('click', close_modal);
	}
	
	// function close_modal() { 
	// 	$('#modal-chapter-menu').modal('show');
	// 	$('#modal-chapter-menu').modal({ show: false}) ;
	// }
    
});// END document.ready










