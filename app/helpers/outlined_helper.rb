module OutlinedHelper
  def render_url url 
    unless url.ends_with? ".md"
      url = url << ".md"
    end
    text = open(url) {|f| f.read }
    html_toc = Redcarpet::Markdown.new(Redcarpet::Render::HTML_TOC)
    markdown = Redcarpet::Markdown.new(Redcarpet::Render::HTML.new(:with_toc_data => true))
    @toc  = html_toc.render(text).html_safe
    @html = markdown.render(text).html_safe
  end
  def render_markdown text 
    html_toc = Redcarpet::Markdown.new(Redcarpet::Render::HTML_TOC)
    markdown = Redcarpet::Markdown.new(Redcarpet::Render::HTML.new(:with_toc_data => true))
    @toc  = html_toc.render(text).html_safe
    @html = markdown.render(text).html_safe
  end
end
