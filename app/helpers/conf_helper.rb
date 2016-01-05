module ConfHelper
  
  @@r_opt_all = {
    filter_html: false,   # do not allow any user-inputted HTML in the output.
    no_images: false,     # do not generate any <img> tags.
    no_links: false,      # do not generate any <a> tags.
    no_styles: true,      # do not generate any <style> tags.
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
  def self.toc_r_opt; hash = @@r_opt_all
    return hash end
    
  def self.top_r_opt; hash = @@r_opt_all 
    return hash end
    
  def self.full_r_opt; hash = @@r_opt_all 
    return hash end
    
  def self.side_r_opt; hash = @@r_opt_all 
    return hash end

  # markdown parser extensions from RedCarpet
  def self.toc_p_ext; hash = @@p_ext_all
    return hash end
    
  def self.top_p_ext; hash = @@p_ext_all 
    return hash end
    
  def self.full_p_ext; hash = @@p_ext_all 
    return hash end
    
  def self.side_p_ext; hash = @@p_ext_all 
    return hash end
  
  # other useful variables
  def self.toc_vars; 
    return hash end
    
  def self.top_vars; 
    return hash end
    
  def self.full_vars; 
    return hash end
    
  def self.side_vars; 
    return hash end
    
end