/******************************************************************************/

//= require jquery
//= require jquery_ujs
//= comments.js 

/**   GLOBAL VARIABLES   *******************************************************/

// SINGLE TARGET CONTAINERS (unchanging): 
var $window;      // the whole window
var $sidebarDiv;  // the sidebar 
var tocElem;		// the table of contents element
var $htmlBody;		// the body of the page

// SINGLE TARGET ELEMENTS (unchanging): 
var topSection;   // the first element in toc which points to top of page
var $toc_0; 		// highest <a> in toc
var $tocFollowBtn;// to toggle follow reader or not
var $pageBtn;     // page selection button
var $sectionBtn;  // the button that shows and selected a section
var $debugL;      // two helpful
var $debugR;      // debuggers

// COLLECTIONS OF SIMILAR ELEMENTS (unchanging): 
var $links;			// links in table of contents sidebar to headers
var $sections;    // all sections markers as definined in markdown

// MEASUREMENTS (unchanging): 
var topOffset;		// height of navbar on top of page
var pageName;	   // get page name from markdown comment 

// VARIABLES (changing)
var tocHeight;		// height of table of contents
var tocFollow;    // internal variable to toggle following reader in toc
var prevActive;


////// DOCUMENT READY //////////////////////////////////////////////////////////

$( document ).ready( function() 
{
   /*** INITIALIZE GLOBAL VARIABLES *******************************************/
   // single target containers (unchanging): 
   $window       = $(window);
   $sidebarDiv   = $('#sidebar');
   tocElem       = document.getElementById("toc");
   $htmlBody     = $("html, body");
   // collections of similar elements (unchanging): 
   $links        = $('#toc').find('a[href^="#"]');
   $sections     = $('.section');
   // single target elements (unchanging): 
   topSection    = $sections.first().attr('id');
   $toc_0        = $('a[href^="#toc_0"]'); 
   $tocFollowBtn = $('#toc-follow-btn');
   $pageBtn      = $('#page-btn');
   $sectionBtn   = $('#section-btn');
   $debugL       = $('#debug-l');
   $debugR       = $('#debug-r');
   // measurements (unchanging): 
   topOffset     = $('#topbar').outerHeight(false);
   pageName      = $("#page").comments().html();
   // variables (changing)
   tocHeight     = tocElem.height;
   tocFollow     = true;
   prevActive    = 
   
   // add handlers:
   $window.on("scroll", findNewPosition);    // add scroll listener on content
   // $window.scroll( onReaderScroll() );
   $links.on('click', onTocClick);       // add click listener on toc
   $tocFollowBtn.on('click', onTocFollowBtnClick());
   
   
   window.onhashchange = function() { setTimeout(onPageLoad(), 400); };
   
   onPageLoad(); 
   
}); ////// END DOCUMENT READY //////////////////////////////////////////////////




/*** LOAD PAGE FROM HASH ******************************************************/

function onPageLoad() 
{  
   $tocFollowBtn.addClass('on');      // to jump to location if hash is found
   $links.attr('id', 'toc-inactive'); // set all to inactive until we see what is
   
   // initial load from url hash:
   if(window.location.hash)   
   {  
      $links.each( function () 
      { 
         var $currLink = $(this);
         var refElement = $currLink.attr("href"); // get value of href attr
         
         if (refElement === window.location.hash) 
         { 
            $links.attr('id', 'toc-inactive');
            $currLink.attr('id', 'toc-active');  // and add active to match
            setTimeout(scrollToc(), 700);       // reposition table of contents
            var currSection = $(window.location.hash).prevAll('.section').attr('id');
            commitNewPos(pageName, currSection);
         }
      });
      $htmlBody.delay(10).animate({   // for offset
         scrollTop: $(window.location.hash).offset().top - topOffset 
      }, 200);
      
      var $currSection    = $(window.location.hash);
      var $prevSection    = $currSection.prevAll('.section');
      var prevHash = '#'  + $prevSection.attr('id');
      var $notNextSection = $currSection.nextAll('.section');
      var $nextSection    = $notNextSection.nextAll('.section');
      var nextHash = '#'  + $nextSection.attr('id');
      
   } else { // intial load without url hash:
   
      $toc_0.attr('id', 'toc-active');
      commitNewPos(pageName, topSection);
   }
}

/*** CLICK LISTENER FOR TOC **************************************************/

function onTocClick(e)           // e == object that raised the event
{   
   e.preventDefault();           // bypass clicked <a>'s native bahavior 
   $(document).off("scroll");    // remove event handler on scroll
   $links.attr('id', 'toc-inactive');
   
   $(this).attr('id', 'toc-active');// add our own active status to clicked <a> 
   
   var target = this.hash;
   var $target = $(target);
   $htmlBody.stop().animate({
      'scrollTop': $target.offset().top - topOffset 
   }, 100, 'swing', function () {
      window.location.hash = target;
      $(document).on("scroll", findNewPosition);
   });
   var currSection = $(target).prevAll('.section').attr('id');
   commitNewPos(pageName, currSection);
}

/*** CLICK LISTENER FOR TOC FOLLOW BUTTONS  ************************************/

function onTocFollowBtnClick() 
{
   $tocFollowBtn.toggleClass('on');
   if ( $tocFollowBtn.hasClass('on') ) {
      tocFollow = true;
      $('#toc-follow-img, #toc-follow-txt').css('opacity','.9');
      findNewPosition();
   } else {
      tocFollow = false;
      $('#toc-follow-img, #toc-follow-txt').css('opacity','.4');
      scrollToc(); 
   }
}

/*** SCROLL LISTENER FOR READER ************************************************/

function onReaderScroll() {
   clearTimeout($.data(this, 'scrollTimer'));
   $.data(this, 'scrollTimer', setTimeout( function() {
      scrollToc();
   }, 500));
}

/**** FIND NEW POSITION IN READER ***********************************************/

// listen to user and animated scrolling of content:
function findNewPosition() 
{
   var scrollPosition = $(document).scrollTop(); // distace from top

   // Iterate all <a> descendant of <nav> (the links to locations)
   $links.each( function () 
   { 
      var $currLink = $(this);
      var $refElement = $($currLink.attr("href")); // get value of href attr
      // check position of <a> in <nav>
      if ($refElement.position().top + -50 // OFFSET 50 for navbar height +more 
         <= scrollPosition && $refElement.position().top - 50 + 
         $refElement.height() > scrollPosition) 
      { 	// if it is near top of page:
         $links.attr('id', 'toc-inactive');
         $currLink.attr('id', 'toc-active');   //  and add active to match

         // prepare variables for commitNewPostion() and call it.
         var hash = $currLink.attr('href');
         var $currSection = $(hash).prevAll('.section');
         var currTopic = $currSection.attr('id');
         commitNewPos(pageName, currTopic);
      }
   });
}

/** COMMIT NEW POSITION *******************************************************/

function commitNewPos (page, section) 
{
   scrollToc(); 
   $pageBtn.text(page);                   // set text on page button on topbar
   $sectionBtn.text(section);             // set text on section button on topbar
   document.title = page + ' ' + section; // set title on top of browser tab
   
   // determine prev and next sections 
   var currSectionId = '#' + section;
   var prevSection = $(currSectionId).prevAll('.section').attr('id');
   if (prevSection == undefined) { prevSection =  'toc_0'; }
   var nextSection = $(currSectionId).nextAll('.section').attr('id');
   
   // set target for prev and next buttons on topbar
   $("#prev-btn").attr('href', "#"+prevSection);
   $("#next-btn").attr('href', "#"+nextSection);
}

/*** AUTO SCROLL OF TOC *****************************************************/

var currScroll; // keep outside function so it retains value between calls

// update scrolling of toc by position in text:
function scrollToc() 
{
   if (tocFollow)  
   {
      var activeElement = document.getElementById("toc-active");
      var activePos     = activeElement.offsetTop;
      var sidebarHeight = document.getElementById('sidebar').offsetHeight;
      var sidebarUpper  = sidebarHeight * 0.3;
      var offset        = activePos - sidebarUpper;
      var maxOffset     = tocHeight - sidebarHeight;
      
      if (offset > maxOffset) { offset = maxOffset; }
      else                    { offset = offset;    }
      
      if ((activePos > sidebarHeight * .95) || 
         (currScroll < activePos + sidebarUpper) ) 
      {
         $sidebarDiv.animate({ scrollTop: offset}, 300);
         currScroll = offset;
      }
   }
}

/******************************************************************************/