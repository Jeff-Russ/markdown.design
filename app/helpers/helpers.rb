
# By Jeff Russ https://github.com/Jeff-Russ
#~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._

require 'open-uri'
require 'uri'

module Helpers
   include Utils
   
#~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._
   def javascript(*files) 
      content_for(:head)
      javascript_include_tag(*files) 
   end
#~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._
   def init_host 
      log "@@@@@ request.host @@@@@"
      log request.host # jeffruss.herokuapp.com
      host = request.host 
      if     host == 'jeffruss.herokuapp.com'        then return 'jr'
       elsif host == 'www.jeffruss.com'              then return 'jr'
       elsif host == 'jeffruss.com'                  then return 'jr'
      
       elsif host == 'markdown-design.herokuapp.com' then return 'md'
       elsif host == 'www.markdown.design'           then return 'md'
       elsif host == 'markdown.design'               then return 'md'
      
       elsif host == 'private-jeff-russ.c9users.io'  then return 'md'
      
       else return 'md'
      end
   end; module_function :init_host
   
################################################################################
   module OpenUri
         include Helpers
   #~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._
      def safe_open (str, view)
          
         if (view == :gh) || (view == :ghrm)
            fixpath = ins_parent_dir(str, '/master/')
            # fixpath = ins_after_domain_ext(fixpath, "Jeff-Russ/", '.com/')
         else 
            fixpath = ins_parent_dir(str, '/jeffruss/')
         end
         variations = [str, fixpath, rm_last_exten(str), str.downcase, 
                  str.capitalize, URI.encode(str)]
         output = false
         variations.each do |vari|
             log "Attemping open '#{vari}'"
             output = Helpers::open_uri_attempt(vari)
             break if output
         end
         log "\nREQUESTED FILE FOUND. Saved as raw string."
         return output
      end; module_function :open
   end
   
################################################################################
   def open_uri_attempt (location_str) # this method used by this doc only
      begin 
         string = open(location_str)  {|f| f.read }
       rescue => e
         case e
          when OpenURI::HTTPError  then return false
          when SocketError         then return false
          else                          return false
         end
         warn "exception found"
       rescue SystemCallError => e
         if e === Errno::ECONNRESET then return false
          else                           return false
         end
      end
     return string
   end
   module_function :open_uri_attempt
end