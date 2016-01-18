 /*~~._.~~._.~~._.~~._.~~._.~~._.~~._~~._.~~._.~~._.~~._.~~._.~~._.~~._~~._.~~*\
|        geturl.js          part of markdown.design                             |
|        By Jeff Russ       https://github.com/Jeff-Russ                        |
 \._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~.*/

window.geturlInit = function(){
   
   window.log("URL GENERATE HANDLER ADDED")
   
   $('#geturl-submit-btn').on('click', function(){
      
      window.log("URL GENERATE BUTTON PRESSED")
         
      var 
      source = $('input[name=geturl-source-radio]:checked').val(),
      view   = $('input[name=geturl-view-radio]:checked').val() || "show_toc",
      mdd = 'http://www.markdown.design/',
      output;
      
      if (source == "amazon_s3"){
         var
         bucket = $('#geturl-bucket').val(),
         s3path = $('#geturl-s3path').val();
         
         if (bucket == '' || s3path == ''){
            output = "ENTER BOTH BUCKET AND PATH";
         
         }else if (view == 'show_toc'){
            output = mdd + '?docs=' + bucket +'/'+ s3path;
            
         }else if (view == 'hide_toc'){
            output = mdd + '?doch=' + bucket +'/'+ s3path;
            
         }else if (view == 'top'){
            output = mdd + '?pages=' + bucket +'/'+ s3path;
            
         }else if (view == 'full'){
            output = mdd + "?full=" + bucket +'/'+ s3path;
         }
         
         if (output.endsWith('.md')){
            output = window.removeExtension(output);
         }
         
      }
      else if (source == "github_readme"){
         var
         ghUser = $('#geturl-gh-user').val(),
         ghRepo = $('#geturl-gh-repo').val();
         
         if (ghUser == '' || ghRepo == ''){
               output = "ENTER BOTH USER AND REPO";
         
         }else if (view == 'show_toc'){
            output = mdd + '?ghrm=' + ghUser +'/'+ ghRepo;
         
         }else if (view == 'hide_toc'){
            output = mdd + '?doch&ghrm=' + ghUser +'/'+ ghRepo;
            
         }else if (view == 'top'){
            output = mdd + '?pages&ghrm=' + ghUser +'/'+ ghRepo;
            
         }else if (view == 'full'){
            output = mdd + "?full&ghrm=" + ghUser +'/'+ ghRepo;
         }
      }

      window.log(source+' '+view+' '+bucket+' '+s3path+' '+ghUser+' '+ghRepo)
      window.log(output)
      $('#geturl-output').attr('href', output);
      $('#geturl-output').text(output);
   });
}; 