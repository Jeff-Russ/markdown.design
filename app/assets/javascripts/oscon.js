// oscon.js
/* By Jeff Russ https://github.com/Jeff-Russ
~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._*/

//= require jquery
//= require jquery_ujs


//========== ON SCREEN CONSOLE TOGGLE ========================================

// Put this in document ready. window.on_screen_console(true, true); fully enables
// window.on_screen_console(true, false); enables but hides.
window.on_screen_console = function(run, show){
   on_screen_console_bool = run;
   if (on_screen_console_bool) {
      $('#on_screen_console').remove();
      $("body").append("<p id='on_screen_console' style='position:fixed; z-index: 9999;\
                     left:2px; top:-20px;color:#AFD; font-size:12px;visiblity:hidden;\
                     background-color: #444; opacity:0.5;pointer-events:none'></p>");
      window.log("ON SCREEN CONSOLE: `d to disable, `e to enable,\
               `h to hide, `s to show, `c to clear");
      enable_osc_keys(true);
   }
   else {
      $('#on_screen_console').remove();
      // but don't disable ocs_keys in case user turns back on
   }
   if (arguments.length == 2)
      show_on_screen_console(show);
};


//========== ON SCREEN CONSOLE TOOLS ===========================================
 
// log a newline followed by a non urgent message:
window.log = function(string){
   if (on_screen_console_bool)
   $('#on_screen_console').append("<br />js: " + string);
};
// log a newline followed by a warning message:
window.warn = function(string){
   if (on_screen_console_bool)
      $('#on_screen_console').append("<br />js warning: " + string + "<br />");
};
// log a newline followed by a error message:
window.err = function(string){
   if (on_screen_console_bool)
      $('#on_screen_console').append("<br />js error: " + string + "<br />");
};
// append a message without insertion of a newline. Prepended with a space:
window.update = function(string){
   if (on_screen_console_bool)
      $('#on_screen_console').append(" " + string);
};
// append a message without insertion of a newline. Not repended with a space:
window.type = function(string){
   if (on_screen_console_bool)
      $('#on_screen_console').append(string);
};
// print a newline followed by a horiz. rule type thingo:
window.hr = function(){
   $('#on_screen_console').append("<br />________________________________________");
}; 
// print a newline followed by a bar-looking thing:
window.bar = function(){ 
   $('#on_screen_console').append("<br /><br />========================================");
};
// print a line break:
window.br  = function() { 
   $('#on_screen_console').append("<br /><br />");  
};
// print two line breaks:
window.br2 = function() { 
   $('#on_screen_console').append("<br />"); 
};

// clear console:
window.clear_on_screen_console = function(){
   window.on_screen_console(true);
};

//========== ON SCREEN CONSOLE KEY COMBOS =======================================

// Key combinations: back-tick (`) and a letter
// Call with true to enable key listening
function enable_osc_keys (bool)
{
   if (bool){
      var map = { 192:false, 67:false, 68:false, 69:false, 72:false, 83:false };
      $(document).keydown( function(e) {
         if (e.keyCode in map) 
         { 
            map[e.keyCode] = true;
            
            if (map[192] && map[69])
               window.on_screen_console(true);     // ( `e ) enable
            if (map[192] && map[68])
               window.on_screen_console(false);     // ( `d ) disable
            if (map[192] && map[83])
               show_on_screen_console(true);  // ( `s ) show
            if (map[192] && map[72])
               show_on_screen_console(false); // ( `h ) hide
            if (map[192] && map[67])
               window.clear_on_screen_console();     // ( `c ) clear
         }
      }).keyup(function(e) { 
         if (e.keyCode in map) { map[e.keyCode] = false;}
         
      });  
   }
   else{
      $(document).unbind('keydown');
      $(document).unbind('keyup');
   }
}

//========== OTHER LOCALS  =====================================================

var on_screen_console_bool;
// Enables console with arg of true. Messages will not be visible from this call
// but key mappings will. Press `s (backtick-s ) to make visible (show).
// `h to hide, `d to disble, `e to enable, `c to clear. 

// make console messages visible:
function show_on_screen_console(bool){ 
   if (bool) { 
      $('#on_screen_console').css('visibility','visible'); 
   } else { 
      $('#on_screen_console').css('visibility','hidden' ); 
   }
}