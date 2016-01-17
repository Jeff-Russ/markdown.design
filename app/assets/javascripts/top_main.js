
/* By Jeff Russ https://github.com/Jeff-Russ
~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._*/

//= require jquery
//= require jquery_ujs
//= require bootstrap-sprockets

//= require shared
//= require top_funcs
// require top_topbar
//= require oscon
//= geturl


window.topbarFixed = true; // default setting
window.desktopMode;
	/*_~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._
       CONFIG TO DEVICE AND WINDOW SIZE*/   
function onWindowResize(){
	if (!window.isMobile && $(window).width() >= 630)
	   window.desktopMode = true;
	else
	   window.desktopMode = false;
	window.toggleTopbarSpacing();
}

$( document ).ready( function() 
{
   window.on_screen_console(true, false);
	/*_~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._
       CONFIG TO DEVICE AND WINDOW */  
   // call once on load:
   onWindowResize();
   
	/*_~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._
       ADD HANDLERS */
   window.topOffsetInit();
   $( window ).resize(onWindowResize()); // and add handler for resizing of window
   $('#toggle-topbar-btn').on('click', window.onToggleTopbarBtnClick); 
   window.geturlInit();
   
	/*_~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._
       ADD HOME URL AND LOGO 	*/
   window.HomeUrl = $('#home-url').comments().html();
	$('.home-url').attr('href', window.HomeUrl);

}); 



window.geturlInit = function(){
   
   window.log("URL GENERATE HANDLER ADDED");
   
   $('#geturl-submit-btn').on('click', function(){
      
      window.log("URL GENERATE BUTTON PRESSED");
         
      var 
      source = $('input[name=geturl-source-radio]:checked').val(),
      view   = $('input[name=geturl-view-radio]:checked').val(),
      mdd = 'http://www.markdown.design/',
      output;
      
      
      if (source == "amazon_s3"){
         var
         bucket = $('#geturl-bucket').val(),
         s3path = $('#geturl-s3path').val();
         
         if (view == 'show_toc'){
            output = mdd + '?docs=' + bucket +'/'+ s3path;
            
         }else if (view == 'hide_toc'){
            output = mdd + '?doch=' + bucket +'/'+ s3path;
            
         }else if (view == 'top'){
            output = mdd + '?pages=' + bucket +'/'+ s3path;
            
         }else if (view == 'full'){
            output = mdd + "?full=" + bucket +'/'+ s3path;
         }
         output = output.substr(0, output.lastIndexOf('.')) || output;
      }
      else if (source == "github_readme"){
         var
         ghUser = $('#geturl-gh-user').val(),
         ghRepo = $('#geturl-gh-repo').val();
         
         if (view == 'show_toc'){
            output = mdd + '?ghrm=' + ghUser +'/'+ ghRepo;
         
         }else if (view == 'hide_toc'){
            output = mdd + '?doch&ghrm=' + ghUser +'/'+ ghRepo;
            
         }else if (view == 'top'){
            output = mdd + '?pages&ghrm=' + ghUser +'/'+ ghRepo;
            
         }else if (view == 'full'){
            output = mdd + "?full&ghrm=" + ghUser +'/'+ ghRepo;
         }
      }
      window.log(source+' '+view+' '+bucket+' '+s3path+' '+ghUser+' '+ghRepo);
      window.log(output);
      $('#geturl-output').val(output);
      
   });
}; 
