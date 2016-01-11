
/* By Jeff Russ https://github.com/Jeff-Russ
~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._*/

//= require jquery
//= require jquery_ujs
//= require bootstrap-sprockets


// This jQuery plugin will gather the comments within
// the current jQuery collection, returning all the
// comments in a new jQuery collection.
//
// NOTE: Comments are wrapped in DIV tags.

/*_~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._
    CONFIG TO DEVICE  */    
window.isMobile = navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/);
window.topOffsetInit = function() { window.topOffset = $('#topbar').height(); };
window.debug = function(text){ $('.debug').append(text + ';' + '\u0020'); };

// call "callback" when scrolling has stopped for
document.scrollTimeout = 500;
// milliseconds. 

$( document ).ready( function() 
{
   $('.prev-btn-img').append("<img src='https://shared-img-res.s3.amazonaws.com/icons/left_icon_grn.png'/>");
   $('.next-btn-img').append("<img src='https://shared-img-res.s3.amazonaws.com/icons/right_icon_grn.png'/>");
   $('.menubar-img').append("<img class='menubar-img-css'src='https://s3.amazonaws.com/shared-img-res/livepage_heroku/menubar-icon.png'/>");
   $('.scroll-btn-img').append("<img class='scroll-btn-img-css' id='toc-follow-img' src='https://shared-img-res.s3.amazonaws.com/livepage_heroku/auto-y_icon_33_grn.png'/>");
   $('.toc-btn-img').append("<img class='toc-btn-img-css toc-btn-img' id='toc-btn-img' src='https://shared-img-res.s3.amazonaws.com/livepage_heroku/toc_icon_h20.png'/>");
   $('.jr-img').append("<img class='jr-img-css' src='https://s3.amazonaws.com/shared-img-res/JR%20logo/JR_20px_wide.png'/>");


   var $btnLinks = $('[data-link]');
   $btnLinks.each(function(){
      var url = $(this).attr('data-link');
      $(this).wrap("<a href='" + url + "'></a>");
   });

   var $appendImg = $('[data-img]');
   $appendImg.each(function(){
      var url = $(this).attr('data-img');
      $(this).append("<img src='" + url + "'></img>");
   });
   
   /*_~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._
      GOOGLE ANALYTICS  */
   (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
   (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
   m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m);
   })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
   
   ga('create', 'UA-71741017-1', 'auto');
   ga('send', 'pageview');
   // END google analytics


   $('#open-mailto').on('click', function(){
      var emailDest = $('#email-dest').val(); 
      var emailSubj = $("#email-subj").val();
      var emailBody = $("#email-body").val(); 
      window.buildMailTo(emailDest, emailSubj, emailBody);
   }); 

});

window.buildMailTo = function (address, subject, body) {
   var strMail = 'mailto:' + encodeURIComponent(address)
               + '?subject=' + encodeURIComponent(subject)
               + '&body=' + encodeURIComponent(body);
   window.location.href = strMail;
};


window.tersify = function(string) {
   string = string.replace(/^\d+\.\s*/, ''); // cut off "1. " or similar
   if (string.length > 20) {
      string = string.substr(0, 20); // trim at last space before 20th
      string = string.substr(0, Math.min(string.length, string.lastIndexOf(" ")));
   }
   return string;
};

window.getDocName = function() {
   var url = window.location.href;   // get url
   var hash = window.location.hash;  // get hash
      var index_of_hash = url.indexOf(hash) || url.length; // find loc of hash
      var hashless_url = url.substr(0, index_of_hash);     // remove hash
   var docName = hashless_url.match(/[^\/]*$/); // get last part of url.
   return docName;
};

$.fn.comments = function( blnDeep ){
   var blnDeep = (blnDeep || false);
   var jComments = $( [] );
   // Loop over each node to search its children for
   // comment nodes and element nodes (if deep search).
   this.each(
      function( intI, objNode ){
         var objChildNode = objNode.firstChild;
         var strParentID = $( this ).attr( "id" );
         // Keep looping over the top-level children
         // while we have a node to examine.
         while (objChildNode){
            // Check to see if this node is a comment.
            if (objChildNode.nodeType === 8){
               // We found a comment node. Add it to
               // the nodes collection wrapped in a
               // DIV (as we may have HTML).
               jComments = jComments.add(
                  "<div rel='" + strParentID + "'>" +
                  objChildNode.nodeValue +
                  "</div>"
                  );
            } else if (
               blnDeep &&
               (objChildNode.nodeType === 1)
               ) {
               // Traverse this node deeply.
               jComments = jComments.add(
                  $( objChildNode ).comments( true )
                  );
            }
            // Move to the next sibling.
            objChildNode = objChildNode.nextSibling;
         }
      }
      );
   // Return the jQuery comments collection.
   return( jComments );
};


$.fn.scrollEnd = function(callback) {          
  $(this).scroll(function(){
   var $this = $(this);
   if ($this.data('scrollTimeout')) {
     clearTimeout($this.data('scrollTimeout'));
   }
   $this.data('scrollTimeout', setTimeout(callback,document.scrollTimeout));
  });
};
// TEST IT:
// $(window).scrollEnd(function(){
//     alert('stopped scrolling');
   
// });



// function onReaderScroll() // UNUSED TIMEOUT FOR SCROLL LISTENER ________________
// {
//    clearTimeout($.data(this, 'scrollTimer'));
//    $.data(this, 'scrollTimer', setTimeout( function() {
//       findNewPosition();
//    }, 500));
// }