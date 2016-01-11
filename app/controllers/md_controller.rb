######--------------------------------------------######
######  By Jeff Russ https://github.com/Jeff-Russ ######
######--------------------------------------------######

require 'open-uri'
require 'uri'

class MdController < ApplicationController
	include Helpers
	include Helpers::ConfHelper
	include Helpers::OpenUri
	Helpers::global_debug true
	
################################################################################
	def route
		
		@livedocs = {}                            # hash that'll store everything 
		text = ''                                 # will hold raw content as string
		
####_____ GET FILE PATH ____________________________________________________####

# The following query string params are used to set the file path and desired
# view option. If their value is empty they merely indicated desired view.
		@livedocs[:path] = ''  # this will hold complete path
		
		view_params = { 
			pages: "top", top: "top",  
			docs:   "toc", toc: "toc",  
			full: "full", side: "side"
		}
		bar; log "Looking for views..."
		view_params.each_with_index do | (key,view), index |
			update "'#{key}'"
			if params.key? key               # if we find this key in params
				update "Found '#{key}' so the view will be '#{view}'"
				@livedocs[:view] = view       # it determines what view to render
				unless params[key].nil?       # if it has an actual value
					update "Partial path found."
					@livedocs[:path] = params[key] << '.md' # use as md file path
					break
				end
			end
			if index == view_params.size - 1  # if we didn't didn't find any key
				log "No view found."
				@livedocs[:view] = "toc"       # default view: w/ table of contents
				update "Set to default view '#{@livedocs[:view]}'"
			end
		end
		update "\n view = '#{@livedocs[:view]}'\n path = '#{@livedocs[:path]}'"
		# strings for prepending to partial path:
		s3    = 'https://s3.amazonaws.com/'          
		gh    = 'https://raw.githubusercontent.com/' 
		http  = 'http://';  https  = 'https://'
		jeffruss = 'https://s3.amazonaws.com/jeffruss/' 
		
		if params.key? :file                    # GET FILE FROM LOCAL (THIS) SERVER 
			@livedocs[:path] = params[:file] << ".md" 
			text = File.read( @livedocs[:path] ) # we are done
			
		 elsif params.key? :url                 # GET FILE FROM FULL WEB URL 
			@livedocs[:path] = params[:url] << '.md' # we can skip prepend
			
		 else	# DETERMINE DOMAIN OF PATH AND PREPEND TO PATH
			file_domain = { 
				s3: s3,     aws: s3,  
				gh: gh,     github: gh,  
				http: http, https: https,
				jeffruss: jeffruss
			}
			log "Looking for domain..."
			file_domain.each_with_index do | (key, prepend), index |
				update "'#{key}'"
				if params.key? key
					update "'#{key}' found."
					if @livedocs[:path] == '' # unless we already found partial path
						update "including a file path." 
						@livedocs[:path] = prepend << params[key] << '.md' # set it
					 else 						  # we had partial path so we can use this
						@livedocs[:path] = prepend << params[:path] # to prepend domain
					end
					break
				end
				if index == file_domain.size - 1  
					@livedocs[:path] = s3 << @livedocs[:path]
					log "No domain found. AWS S3 will be assumed.\n path = '#{@livedocs[:path]}'"
				end
			end
			update "\n path = '#{@livedocs[:path]}'"
		end
		
# GET CONTENT AS STRING IF NON-LOCAL
		
		if text == '' # ( might be empty if we got if from internal file)
			if (@livedocs[:path] == '') || (@livedocs[:path].ends_with? '/')
				log "Insuffient path. Assuming jeffruss.com/ root"; bar;
				@livedocs[:path] = s3 << "jeffruss/home.md"
				@livedocs[:view] = 'top'
				update "Fetching #{@livedocs[:path]}"; bar;
				text = safe_open(@livedocs[:path]) # safe_open is from helper file
			else
				log "We have a full path. Calling safe_open() helper method"; hr;
				text = safe_open(@livedocs[:path]) # safe_open is from helper file
			end
		end
		
####_____ GET ADDITIONAL PREFERENCES _______________________________________####
		
		prefs = {
			r_opt: { # REDCARPET RENDER OPTIONS 
				defaults: lambda do default_toc_r_opt() end, # defaults from helpers.rb
				beg_flag: '#BEGIN_R_OPT',
				end_flag: '#END_R_OPT'
			},
			p_ext: { # REDCARPET PARSER EXTENSIONS 
				defaults: lambda do default_toc_p_ext() end, # defaults from helpers.rb
				beg_flag: '#BEGIN_P_EXT',
				end_flag: '#END_P_EXT'
			},
			toc_vars: {  # CUSTOM VARIABLES FOR VIEW WITH TOC
				defaults: lambda do default_toc_vars() end, # defaults from helpers.rb
				beg_flag: '#BEGIN_VARS',
				end_flag: '#END_VARS'
			}
		}
		
		dir = @livedocs[:path].concat( @livedocs[:path].split('/')[-1] )
		prefs.each do | key, hash |
			hr; log "Looking for #{key.to_s} preference."
			unless params.key? key 
				update "Not found in query string paramter. Using defaults in helpers."
				@livedocs[key] = hash[:defaults].call
			else                                     # custom extensions requested
			   update 'found in query string parameter.'
				str = open(dir << params[key] << '.md') {|f| f.read } 
				# process preferences and store:
				hash = str_to_hash_between hash[:beg_flag], hash[:end_flag], str
				@livedocs[key] = hash
			end
			update "\n #{key.to_s} = #{@livedocs[key]}"
		end

####_____ GET RENDERED CONTENT _____________________________________________####
		
		hr; log "creating rendering objects."
		renderer = Redcarpet::Render::HTML.new(           @livedocs[:r_opt] )
		markdown = Redcarpet::Markdown.new(     renderer, @livedocs[:p_ext] )
		
		log "Rendering HTML from markdown"
		@livedocs[:content] = markdown.render(text).html_safe
		
		unless @livedocs[:view] == 'top'
			log "Rendering table of contents"
			html_toc = Redcarpet::Markdown.new(Redcarpet::Render::HTML_TOC)
			@livedocs[:toc] = html_toc.render(text).html_safe
		end
		log "Calling #{@livedocs[:view]}.html.erb"; bar;
		render @livedocs[:view]
		
	end
	
################################################################################
	def readme

		text = File.read("README.md")
		
		@livedocs = {} # the hash that will store everything 
		
		@livedocs[:p_ext] = default_toc_p_ext
		@livedocs[:r_opt] = default_toc_r_opt
		
		renderer = Redcarpet::Render::HTML.new( @livedocs[:r_opt] )
		markdown = Redcarpet::Markdown.new(renderer, @livedocs[:p_ext])
		@livedocs[:content] = markdown.render(text).html_safe
		html_toc = Redcarpet::Markdown.new(Redcarpet::Render::HTML_TOC)
		@livedocs[:toc] = html_toc.render(text).html_safe
		
		render "toc"
	end
	
end
