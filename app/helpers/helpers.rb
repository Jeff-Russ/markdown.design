
# By Jeff Russ https://github.com/Jeff-Russ
#~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._

require 'open-uri'
require 'uri'

module Helpers
   
   @@debug_on = false
   
#~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._
   def javascript(*files) 
      content_for(:head)
      javascript_include_tag(*files) 
   end
#~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._
   def global_debug bool; unless bool.nil? then @@debug_on = bool end
   end; module_function :global_debug

   def log string; if @@debug_on then print "\n# #{string}" end
   end; module_function :log
   
   def warn string; if @@debug_on then print "\n### warn: #{string}\n" end
   end; module_function :warn
   
   def err string; if @@debug_on then print "\n#### err: #{string}\n" end
   end; module_function :err

   def update string; if @@debug_on then print " #{string}" end
   end; module_function :update
   
   def hr;  puts; 40.times do print "_" end; puts; end; module_function :hr
   def bar; puts; puts;  40.times do print "#" end; puts; end; module_function :bar
   def br;  puts       end; module_function :br
   def br2; puts; puts end; module_function :br2
   
#~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._
   def rm_last_exten string 
      return string.match(/(.*)\.[^.]+$/)[1] 
   end; module_function :rm_last_exten
#~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._
   def str_to_bool string; 
      string.downcase!
      return string =~ (/(true|t|yes|y|1|on|show)$/i)
   end; module_function :str_to_bool
#~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._
   def ins_parent_dir path, ins
      return path.rpartition('/').first<< ins<< path.rpartition('/').last
   end; module_function :ins_parent_dir
#~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._
	def ins_after_domain_ext path, ins, domain_ext
		return path.rpartition(domain_ext).first<< domain_ext<< ins<< path.rpartition(domain_ext).last
	end; module_function :ins_after_domain_ext
#~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._
   def str_to_hash_between (begin_flag, end_flag, string)
      output_hash = {} # the hash that will store everything 
      string = string.string_between_markers("begin_p_ext", "end_p_ext")
      unless string.blank?
         arr = string.gsub(/\s+/, '').split(/[=,:]/)  # strip whitespace; -> array
         hash = Hash[*arr.flatten]                    # convert to hash
         # now we'll convert keys to symbols and values to booleans
         hash.each do |k, v|    # convert strings to boolean
            if     v == "true"  then v = true
             elsif v == "false" then v = false
            end
            output_hash[k.to_sym] = v # convert keys to symbols
         end
         return output_hash
      else 
         return nil
      end
   end; module_function :str_to_hash_between
   
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
   module ConfHelper
     
     @@r_opt_all = {
       filter_html: false,   # do not allow any user-inputted HTML in the output.
       no_images: false,     # do not generate any <img> tags.
       no_links: false,      # do not generate any <a> tags.
       no_styles: false,      # do not generate any <style> tags.
       escape_html: false,   # any existing HTML tag will be escaped
       safe_links_only: true,# only generate links for protocols considered safe
       with_toc_data: true,  # add HTML anchors to each header in the output HTML
       hard_wrap: false,     # normally md ignores newlines. If true this adds <br>
       xhtml: true,          # output XHTML-conformant tags.
       prettify: true,       # add prettyprint classes to <code> tags for google-code-prettify
       link_attributes: true # hash of extra attributes to add to links.
     }
     
     @@p_ext_all = {
       no_intra_emphasis: true,  # ex. foo_bar_baz will not generate <em> tags
       tables: false,            # parse tables, PHP-Markdown style.
       fenced_code_blocks: true, # use ``` with optional language name for code
       disable_indented_code_blocks: false, # disable code block via indent
       strikethrough: true, # parse ~~strikethrough~~, PHP-Markdown style.
       lax_spacing: true,   # HTML blocks won't require to be surrounded by an empty line
       space_after_headers: true, #this wouldn't be a valid header but # this would
       superscript: true,   # 3^4 will raise up the 4. parens as in 2^(nd) supported
       underline: true,     # this is _underlined_ butthis is still *italic*
       highlight: true,     # this is ==highlighted== like: <mark>highlighted</mark>
       quote: true,         # This is a "quote". It looks like this: <q>quote</q>
       autolink: true,      # Email and http links, even starting with www are handled.
       footnotes: true,     # parse footnotes, PHP-Markdown style. A footnote works 
             # very much like a reference-style link: it consists of a marker next to 
             # the text (e.g. This is a sentence.[^1]) and a footnote definition on its 
             #own line anywhere within the document (e.g. [^1]: This is a footnote.).
     }
   
     # html (aka "content") rendering options from RedCarpet
     def default_toc_r_opt; hash = @@r_opt_all 
     return hash end
       
     def default_top_r_opt; hash = @@r_opt_all 
       return hash end
       
     def default_full_r_opt; hash = @@r_opt_all 
       return hash end
       
     def default_side_r_opt; hash = @@r_opt_all 
       return hash end
   
     # markdown parser extensions from RedCarpet
     def default_toc_p_ext; hash = @@p_ext_all
       return hash end
       
     def default_top_p_ext; hash = @@p_ext_all 
       return hash end
       
     def default_full_p_ext; hash = @@p_ext_all 
       return hash end
       
     def default_side_p_ext; hash = @@p_ext_all 
       return hash end
     
     # other useful variables
     def default_toc_vars; 
       return hash end
       
     def default_top_vars; 
       return hash end
       
     def default_full_vars; 
       return hash end
       
     def default_side_vars; 
       return hash end
       
     module_function :default_toc_r_opt, :default_top_r_opt, :default_full_r_opt, 
     :default_side_r_opt, :default_toc_p_ext, :default_top_p_ext, 
     :default_full_p_ext, :default_side_p_ext, :default_toc_vars, :default_top_vars, 
     :default_full_vars, :default_side_vars
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