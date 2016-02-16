######--------------------------------------------######
######  By Jeff Russ https://github.com/Jeff-Russ ######
######--------------------------------------------######

require 'open-uri'
require 'uri'
require 'cgi'

class ViewController < ApplicationController
   
   include Helpers
   include Helpers::OpenUri
   include MdHelpers
   include Utils
   Utils::global_debug true
   
################################################################################
   def route
      
      @all = {}                  # hash that'll store everything 
      @all[:text] = ''           # will hold raw content as string
      @all[:host] = init_host()
      
      #------------------------------------------------------------------------#
      if params.key? "quiz"
         @all[:gss_key] = params[:quiz]
         bar; log "We have a quiz here..."
         render "quiz" and return
      end
      #------------------------------------------------------------------------#
      
      # The following query string params are used to set the file path and desired
      # view option. If their value is empty they merely indicated desired view.
      
      @all[:path] = ''  # this will hold complete path
      @all[:hide_toc] = nil;
      
      view_params = { 
         pages: "page", top: "page",  
         docs:  "doc",  toc: "doc",  doch: "doc"
      }
      bar; log "Looking for views..."
      view_params.each_with_index do | (key,view), index |
         update "'#{key}'"
         if params.key? key               # if we find this key in params
            update "Found '#{key}' so the view will be '#{view}'"
            @all[:view] = view       # it determines what view to render
            unless params[key].nil?       # if it has an actual value
               update "Partial path found."
               @all[:path] = params[key] << '.md' # use as md file path
               break
            end
         end
         if index == view_params.size - 1  # if we didn't didn't find any key
            log "No view found."
            @all[:view] = "doc"       # default view: w/ table of contents
            update "Set to default view '#{@all[:view]}'"
         end
      end
      
      # to hide toc 
      if params.key? :doch then @all[:hide_toc] = true end
            
      update "\n view = '#{@all[:view]}'\n path = '#{@all[:path]}'"
      # strings for prepending to partial path:
      s3    = 'https://s3.amazonaws.com/'          
      gh    = 'https://raw.githubusercontent.com/' 
      http  = 'http://';  https  = 'https://'
      jeffruss = 'https://s3.amazonaws.com/jeffruss/' 
      
      if params.key? :file                    # GET FILE FROM LOCAL (THIS) SERVER 
         @all[:path] = params[:file] << ".md" 
         @all[:text] = File.read( @all[:path] ) # we are done
         
       elsif params.key? :url                 # GET FILE FROM FULL WEB URL 
         @all[:path] = params[:url] << '.md' # we can skip prepend
         
       else	# DETERMINE DOMAIN OF PATH AND PREPEND TO PATH
         file_domain = { 
            s3: s3,     aws: s3,  
            gh: gh,     ghrm: gh,  
            http: http, https: https,
            jeffruss: jeffruss
         }
         @all[:domain] = ''
         log "Looking for domain..."
         file_domain.each_with_index do | (key, prepend), index |
            update "'#{key}'"
            if params.key? key
               @all[:domain] = key
               update "'#{key}' found."
               if @all[:path] == '' # unless we already found partial path
                  update "updating a file path with #{key} domain." 
                  if key == :ghrm
                     @all[:path] = prepend << params[key] << '/README.md' # set it
                  else
                     @all[:path] = prepend << params[key] << '.md' # set it
                  end
                else 						  # we had partial path so we can use this
                  @all[:path] = prepend << params[:path] # to prepend domain
               end
               break
            end
            if index == file_domain.size - 1  
               @all[:domain] = :s3
               @all[:path] = s3 << @all[:path]
               log "No domain found. AWS S3 will be assumed.\n path = '#{@all[:path]}'"
            end
         end
         update "\n path = '#{@all[:path]}'"
      end
      
      # GET CONTENT AS STRING IF NON-LOCAL
      
      if @all[:text] == '' # ( might be empty if we got if from internal file)
         if (@all[:path] == '') || (@all[:path].ends_with? '/')
            
            log "Insuffient path -> use home_page & home_view global variables"; 
            bar;
            
            #### MODIFY THIS TO PERSONALIZE HOME (WITHOUT QUERY STRING) PAGE ###
            
            if    @all[:host] == 'jr'
                  @all[:path] = 'https://s3.amazonaws.com/jeffruss/home.md'
                  @all[:view] = "page"
            elsif @all[:host] == 'md'
                  @all[:path] = 'https://s3.amazonaws.com/markdown.design/geturl.md'
                  @all[:view] = "page"
            end
            
            update "Fetching #{@all[:path]}"; bar;
            @all[:text] = safe_open(@all[:path], @all[:domain]) # safe_open is from helper file
         else
            log "We have a full path. Calling safe_open() helper method"; hr;
            @all[:text] = safe_open(@all[:path], @all[:domain]) # safe_open is from helper file
         end
      end
      
      md_configure()
      md_render()
      
      log "Calling #{@all[:view]}.html.erb"; bar;
      render @all[:view]
   end
   
################################################################################
   def readme

      @all = {}                  # hash that'll store everything 
      @all[:text] = File.read("README.md")
      @all[:host] = init_host()
      
      md_configure()
      
      renderer = Redcarpet::Render::HTML.new( @all[:r_opt] )
      markdown = Redcarpet::Markdown.new(renderer, @all[:p_ext])
      @all[:content] = markdown.render( @all[:text] ).html_safe
      html_toc = Redcarpet::Markdown.new(Redcarpet::Render::HTML_TOC)
      @all[:toc] = html_toc.render( @all[:text] ).html_safe
      
      render "doc"
   end

################################################################################
   def quiz
      
      @all = {}
      @all[:host] = init_host
      
      if params.key? "quiz"
         @all[:gss_key] = params[:quiz]
      else
         @all[:gss_key] = '0Arenb9rAosmbdG5GWHFXbWJlN1hTR2ZmN3lZMVZkOHc'
      end
      # render "quiz" and return
      
   end
end