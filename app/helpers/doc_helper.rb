
# PLANS FOR MULTI-FORMAT DOCUMENT RENDERER ARE CANCELLED FOR NOW

=begin

require 'nokogiri'
require 'open-uri'
require "erb"
require 'ostruct'
=end
module DocHelper

  def render_doc params
=begin    
    # check the five different input types strings prepend the domain names:
    if params.key? :file
      path = params[:file]
    elsif params.key? :aws 
      path = "https://s3.amazonaws.com/" << params[:aws]
    elsif params.key? :github
      path = "https://raw.githubusercontent.com/" << params[:github]
    elsif params.key? :https
      path = "https" << params[:https]
    elsif params.key? :http
      path = "http"  << params[:http]
    elsif params.key? :url
      path =  params[:path]
    end
    
    if    path.ends_with? ".md"
      params[:doctype] == "md"
    elsif path.ends_with? ".html"
      params[:doctype] == "html"
    elsif path.ends_with? ".erb"
      params[:doctype] == "erb"
    end
    
    params[:doctype] ||= params[:doctype] = "md" # default doctype is markdown
    
    # append extension to path strings if not included in HTTP request:
    if params[:doctype] == "md"
      if !path.ends_with? ".md"
        path = path << ".md" 
      end
    elsif params[:doctype] == "html"
      if !path.ends_with? ".html"
        path = path << ".html"
      end
    elsif params[:doctype] == "erb"
      if !path.ends_with? ".html.erb" ||  ".erb" # syntax??
        path = path << ".html.erb" 
      end
    end

    livedocs = {}
    
    # open the file and save it to text variable:
    if params.key? :file 
      livedocs[:content] = File.read(path)
    elsif params[:doctype] == 'md'
      text = open(path) {|f| f.read }
    elsif params[:doctype] == 'html'
      livedocs[:content] = Nokogiri::HTML(open(path)).to_html.html_safe
    elsif params[:doctype] == 'erb'
      text = open(path) {|f| f.read }
      view = ActionView::Base.new(ActionController::Base.view_paths, {})
      livedocs[:content] = view.render(:file => text, :locals => params, :layout => false)
      erb = ERB.new(text)
      livedocs[:content] = text
      livedocs[:content] = text.html_safe
    end
    
    # render markdown:
    if params[:doctype] == "md"
      
      # add any additional flags if found:
      if params.key? :flags
        str = params[:flags]          # we received flags as a string
        flags = Hash[*str.split(',')] # create hash from comma separted string
      else
        flags = {} # a new hash to pass to Redcarpet
      end
      
      # render without toc:
      if params.key? :hide_toc 
        
        markdown = Redcarpet::Markdown.new(Redcarpet::Render::HTML.new(flags))
        
        # render to return hash 
        livedocs[:content] = markdown.render(text).html_safe
      
      # render with toc:
      else
        
        flags[:with_toc_data] = true  # initialize flags as a string
          
        # Create a markdown rendering object and one for the toc:  
        markdown = Redcarpet::Markdown.new(Redcarpet::Render::HTML.new(flags))
        html_toc = Redcarpet::Markdown.new(Redcarpet::Render::HTML_TOC)
        
        # render them to return hash 
        livedocs[:content] = markdown.render(text).html_safe
        livedocs[:toc]  = html_toc.render(text).html_safe 
      end
    end
    
  return livedocs
=end
  end
end
