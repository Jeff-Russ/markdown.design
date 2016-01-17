
/* By Jeff Russ https://github.com/Jeff-Russ
~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._*/

//= require jquery
//= require jquery_ujs
//= require bootstrap-sprockets

//= require oscon


window.geturlInit = function(){

   $('#geturl-submit-btn').on('click', function(){
      
      var 
      source = $('#geturl-source-radio input:radio:checked').val(),
      view = $('#geturl-view-radio input:radio:checked').val(),
      bucket = $('#geturl-bucket input:radio:checked').val(),
      s3path = $('#geturl-s3path input:radio:checked').val(),
      ghUser = $('#geturl-gh-user input:radio:checked').val(),
      ghRepo = $('#geturl-gh-repo input:radio:checked').val(),
      
      mdd = '',
      s3 = 'https://s3.amazonaws.com/',
      gh = 'https://raw.githubusercontent.com/';
      
      if (source == 'amazon_s3'){
         
      }else if (source == 'github_readme'){
         
      }
   
   });
}; 
