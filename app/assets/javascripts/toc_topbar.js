
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
   $('#page-btn').text(pageName);               // set text on page btn 
   
   var sectionName;
   if (window.currHashName == undefined) {
      var currLocInToc = window.$activeTocAnchor.text();
      sectionName = window.tersify(currLocInToc);
   } else { sectionName = window.currHashName; }

   $('#section-btn').text(window.currHashName); // set section btn text
   document.title = pageName+' - '+sectionName; // set browser tab title
};


//  POPULATE PAGE SELECTION MODAL ~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~_
window.populateModalMenus = function ()    // if .md has 
{

   var arr = findMenuSources();
   var makePageMenu    = arr[0], $pages    = arr[1], pageMenuSrc    = arr[2],
       makeSectionMenu = arr[3], $sections = arr[4], sectionMenuSrc = arr[5];
   
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
   
   var numOfPages, numOfSections;
    
   if (makePageMenu)
   {
      numOfPages = $pages.size();
      if (numOfPages == 1 ) {
         $pageMenu.prepend("<div class='col-xs-2'>");
      }
      var $pageMenu = $('#page-menu');
      $pageMenu.append(chunk1 + window.HomeUrl + "'>" + 'Home' + "</a></div>");
      populateWithBtns( $pages, $pageMenu, pageMenuSrc );
   }
   if (makeSectionMenu)
   {  
      numOfSections = $sections.size();
      if (numOfSections == 1 ) {
         $sectionMenu.prepend("<div class='col-xs-2'>");
      }
      var $sectionMenu = $('#section-menu');
      $sectionMenu.append(chunk1 + window.HomeUrl + "'>" + 'Home' + "</a></div>");
      populateWithBtns( $sections, $sectionMenu, sectionMenuSrc );
   }
   
   // Notice the .dismiss class we added above. 
   // Below makes them also close the modal:
   $('.dismiss').on('click', function() { 
      $( "button[data-dismiss='modal']").trigger("click"); 
   });

};


////// FUNCTIONS USED ONLY IN THIS DOCUMENT /////////////////////////////////////

function findMenuSources() // determine if & how to populate Pages & Section menus
{
   var makePageMenu    = true, $pages,    pageMenuSrc,
       makeSectionMenu = true, $sections, sectionMenuSrc;
   
   if ( $('.page-menu').size() > 1)  // if .md has hidden tags with .page-menu
   {	
      // For populating the Page Menu (on left, right of leftmost button):
      pageMenuSrc = 'comments'; $pages = $('.page-menu'); // use their comments
      window.log("pageMenuSrc = 'comments'");
      
      // For populating the Section Menu (center button, between < and >):
      if ( $('.section').size() > 1) { // if .md has hidden tags with .section
         sectionMenuSrc = 'comments'; $sections = $('.section'); // use comments
         window.log("sectionMenuSrc = 'comments'");
         
      }else if ( $('h1').size() > 1 && $('h1').size() < 12) {    // or h1's?
         sectionMenuSrc = 'headers';  $sections = $('h1');       // yep. use them
         window.update("sectionMenuSrc = 'headers' (<h1>)");
         
      }else if ( $('h2').size() > 1 && $('h2').size() < 12){     // maybe h2's?
         sectionMenuSrc = 'headers';  $sections = $('h2');
         window.update("sectionMenuSrc = 'headers' (<h2>)");
      
      }else {
         makeSectionMenu = false;          // EVERTHING FALE'D. NO SECTION MENU!
         window.update ("everything failed for section menu. not making it");
      }
   }
   // Now we'll try the next levels up. before we tried .page-menu comments for
   // the Page Menu but that failed so we will try h1's for the Page Menu and 
   // h2's for the Section menu:
   else if ( $('h1').size() > 1 && $('h1').size() < 12) 
   {	
      pageMenuSrc = 'headers'; $pages = $('h1');
      window.log("pageMenuSrc = 'headers' (<h1>)");
      
      if ( $('.section').size() > 1) {
         sectionMenuSrc = 'comments'; $sections = $('.section');	
         window.log("sectionMenuSrc = 'comments'");
         
      }else if ( $('h2').size() > 1 && $('h2').size() < 12) {
         sectionMenuSrc = 'headers';  $sections = $('h2');
         window.update("sectionMenuSrc = 'headers' (<h2>)");
         
      }else if ( $('h3').size() > 1 && $('h3').size() < 12){
         sectionMenuSrc = 'headers';  $sections = $('h3');
         window.update("sectionMenuSrc = 'headers' (<h3>)");
         
      }else {
         makeSectionMenu = false;    // EVERTHING FALE'D. NO SECTION MENU!
         window.update ("everything failed for section menu. not making it");
      }
   } 
   // One more levels up. H1's failed for the Page Menu so we'll try h1's, 
   // with h3's as the Section Menu:
   else if ( $('h2').size() > 1 && $('h2').size() < 12) 
   {
      pageMenuSrc = 'headers'; $pages = $('h2');
      window.log("pageMenuSrc = 'headers' (<h2>)");
      
      if ( $('.section').size() > 1) {
         sectionMenuSrc = 'comments'; $sections = $('.section');
         window.log("sectionMenuSrc = 'comments'");
         
      }else if ( $('h3').size() > 1 && $('h3').size() < 12) {
         sectionMenuSrc = 'headers';  $sections = $('h3'); 
         window.update("sectionMenuSrc = 'headers' (<h3>)");
         
      }else if ( $('h4').size() > 1 && $('h4').size() < 12){
         sectionMenuSrc = 'headers';  $sections = $('h4');
         window.update("sectionMenuSrc = 'headers' (<h4>)");
         
      }else { 
         makeSectionMenu = false; // EVERTHING FALE'D. NO SECTION MENU!
         window.update ("everything failed for section menu. not making it");
      }  
   } 
   else { 
      makePageMenu = false; // EVERTHING FALE'D. NO PAGE MENU!
      window.update ("everything failed for page menu. not making it");
   }
   
   return [ makePageMenu,    $pages,    pageMenuSrc, 
            makeSectionMenu, $sections, sectionMenuSrc ];
}


function populateWithBtns($source, $destination, menuSource) 
{
   var chunk1 = "<div class='col-xs-4 centered-div'><a class='dismiss btn btn-xlarge btn-block btn-";
   var chunk2 = " btn-ghost modal-link' href='";
   var btnColors = ["info","success","warning","danger","primary"];
   
   var i = 0;
   
   window.log ("About to populate " + $destination.attr("id"));
   
   switch (menuSource) 
   { 
     case 'comments':
      window.update ("Populating from comments:<br />");
      $source.each( function() { 
         var str = $(this).attr('id');
         str = window.tersify(str);
         window.update(" --- '"+str+"' with href='"+$(this).comments().html()+"'");
         $destination.append( chunk1 + btnColors[i] + chunk2 + 
            $(this).comments().html() + "'>" + str + "</a></div>");
         i = ++i % 5;
      });
      break;
     case 'headers':
      window.update ("Populating from headers");
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