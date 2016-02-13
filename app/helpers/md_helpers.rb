
# By Jeff Russ https://github.com/Jeff-Russ
#~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._

require 'open-uri'
require 'uri'

module MdHelpers
   include Utils

################################################################################
   def md_configure
     
     r_opt_all = {
       filter_html: false,   # do not allow any user-inputted HTML in the output.
       no_images: false,     # do not generate any <img> tags.
       no_links: false,      # do not generate any <a> tags.
       no_styles: false,     # do not generate any <style> tags.
       escape_html: false,   # any existing HTML tag will be escaped
       safe_links_only: false,# only generate links for protocols considered safe
       with_toc_data: true,  # add HTML anchors to each header in the output HTML
       hard_wrap: false,     # normally md ignores newlines. If true this adds <br>
       xhtml: false,         # output XHTML-conformant tags.
       prettify: true,       # add prettyprint classes to <code> tags for google-code-prettify
       link_attributes: true # hash of extra attributes to add to links.
     }
     
     p_ext_all = {
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
       autolink: false,      # Email and http links, even starting with www are handled.
       footnotes: true,     # parse footnotes, PHP-Markdown style. A footnote works 
             # very much like a reference-style link: it consists of a marker next to 
             # the text (e.g. This is a sentence.[^1]) and a footnote definition on its 
             #own line anywhere within the document (e.g. [^1]: This is a footnote.).
     }
      
      prefs = {
         r_opt: { # REDCARPET RENDER OPTIONS 
            defaults: r_opt_all,
            beg_flag: '#BEGIN_R_OPT',
            end_flag: '#END_R_OPT'
         },
         p_ext: { # REDCARPET PARSER EXTENSIONS 
            defaults: p_ext_all,
            beg_flag: '#BEGIN_P_EXT',
            end_flag: '#END_P_EXT'
         },
         doc_vars: {  # CUSTOM VARIABLES FOR VIEW WITH TOC
            defaults: {},
            beg_flag: '#BEGIN_VARS',
            end_flag: '#END_VARS'
         }
      }
      
      unless @all[:path] = ''
         dir = @all[:path].concat( @all[:path].split('/')[-1] )
      end
      
      prefs.each do | key, hash |
         hr; log "Looking for #{key.to_s} preference."
         unless params.key? key 
            update "Not found in query string paramter. Using defaults in helpers."
            @all[key] = hash[:defaults]
         else                                     # custom extensions requested
            update 'found in query string parameter.'
            str = open(dir << params[key] << '.md') {|f| f.read } 
            # process preferences and store:
            hash = str_to_hash_between hash[:beg_flag], hash[:end_flag], str
            @all[key] = hash
         end
         update "\n #{key.to_s} = #{@all[key]}"
      end
   end

   
################################################################################
   def md_render
      hr; log "creating rendering objects."
      renderer = Redcarpet::Render::HTML.new(       @all[:r_opt] )
      markdown = Redcarpet::Markdown.new( renderer, @all[:p_ext] )
      
      log "Rendering HTML from markdown"
      html = markdown.render(@all[:text])
      html.gsub!("&#39;", "'") # temp fix for bad ' render

      html.gsub!(/<xmp>(.*?)<\/xmp>/m) { |block|
         block = CGI::escapeHTML(block)   # escape html in each xmp block
      }
      
      # replace xmp with p, with class for styling
      html.gsub! '&lt;xmp&gt;', '<p class="code-block">'
      html.gsub! '&lt;/xmp&gt;', '</p>'
      
      if @all[:view] == "page"
         html = html.html_safe
         html.sub! '<p>', ''   # because redcarpet wraps doc in <p></p>
         html = html.reverse.sub('>p/<', '').reverse
      end

      @all[:content] = html.html_safe
      
      unless @all[:view] == 'page'
         log "Rendering table of contents"
         html_toc = Redcarpet::Markdown.new(Redcarpet::Render::HTML_TOC)
         toc = html_toc.render(@all[:text])
         @all[:toc] = toc.html_safe
      end
   end
end