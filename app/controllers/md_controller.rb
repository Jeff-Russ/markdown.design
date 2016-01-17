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
		
		@lpmd= {}                            # hash that'll store everything 
		text = ''                                 # will hold raw content as string
		
####_____ GET FILE PATH ____________________________________________________####

# The following query string params are used to set the file path and desired
# view option. If their value is empty they merely indicated desired view.
		@lpmd[:path] = ''  # this will hold complete path
		@lpmd[:hide_toc] = nil;
		
		view_params = { 
			pages: "top", top: "top",  
			docs:  "toc", toc: "toc",  doch: "toc",
			full: "full", side: "side"
		}
		bar; log "Looking for views..."
		view_params.each_with_index do | (key,view), index |
			update "'#{key}'"
			if params.key? key               # if we find this key in params
				update "Found '#{key}' so the view will be '#{view}'"
				@lpmd[:view] = view       # it determines what view to render
				unless params[key].nil?       # if it has an actual value
					update "Partial path found."
					@lpmd[:path] = params[key] << '.md' # use as md file path
					break
				end
			end
			if index == view_params.size - 1  # if we didn't didn't find any key
				log "No view found."
				@lpmd[:view] = "toc"       # default view: w/ table of contents
				update "Set to default view '#{@lpmd[:view]}'"
			end
		end
		
		# to hide toc 
		if params.key? :doch then @lpmd[:hide_toc] = true end
				
		update "\n view = '#{@lpmd[:view]}'\n path = '#{@lpmd[:path]}'"
		# strings for prepending to partial path:
		s3    = 'https://s3.amazonaws.com/'          
		gh    = 'https://raw.githubusercontent.com/' 
		http  = 'http://';  https  = 'https://'
		jeffruss = 'https://s3.amazonaws.com/jeffruss/' 
		
		if params.key? :file                    # GET FILE FROM LOCAL (THIS) SERVER 
			@lpmd[:path] = params[:file] << ".md" 
			text = File.read( @lpmd[:path] ) # we are done
			
		 elsif params.key? :url                 # GET FILE FROM FULL WEB URL 
			@lpmd[:path] = params[:url] << '.md' # we can skip prepend
			
		 else	# DETERMINE DOMAIN OF PATH AND PREPEND TO PATH
			file_domain = { 
				s3: s3,     aws: s3,  
				gh: gh,     ghrm: gh,  
				http: http, https: https,
				jeffruss: jeffruss
			}
			@lpmd[:domain] = ''
			log "Looking for domain..."
			file_domain.each_with_index do | (key, prepend), index |
				update "'#{key}'"
				if params.key? key
					@lpmd[:domain] = key
					update "'#{key}' found."
					if @lpmd[:path] == '' # unless we already found partial path
						update "updating a file path with #{key} domain." 
						if key == :ghrm
							@lpmd[:path] = prepend << params[key] << '/README.md' # set it
						else
							@lpmd[:path] = prepend << params[key] << '.md' # set it
						end
					 else 						  # we had partial path so we can use this
						@lpmd[:path] = prepend << params[:path] # to prepend domain
					end
					break
				end
				if index == file_domain.size - 1  
					@lpmd[:domain] = :s3
					@lpmd[:path] = s3 << @lpmd[:path]
					log "No domain found. AWS S3 will be assumed.\n path = '#{@lpmd[:path]}'"
				end
			end
			update "\n path = '#{@lpmd[:path]}'"
		end
		
# GET CONTENT AS STRING IF NON-LOCAL
		
		if text == '' # ( might be empty if we got if from internal file)
			if (@lpmd[:path] == '') || (@lpmd[:path].ends_with? '/')
				
				log "Insuffient path indicate home page. Using home_page and home_view global variables"; bar;
				
				@lpmd[:path] = 'https://s3.amazonaws.com/jeffruss/geturl.md'
				@lpmd[:view] = 'top'
				
				update "Fetching #{@lpmd[:path]}"; bar;
				text = safe_open(@lpmd[:path], @lpmd[:domain]) # safe_open is from helper file
			else
				log "We have a full path. Calling safe_open() helper method"; hr;
				text = safe_open(@lpmd[:path], @lpmd[:domain]) # safe_open is from helper file
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
		
		dir = @lpmd[:path].concat( @lpmd[:path].split('/')[-1] )
		prefs.each do | key, hash |
			hr; log "Looking for #{key.to_s} preference."
			unless params.key? key 
				update "Not found in query string paramter. Using defaults in helpers."
				@lpmd[key] = hash[:defaults].call
			else                                     # custom extensions requested
			   update 'found in query string parameter.'
				str = open(dir << params[key] << '.md') {|f| f.read } 
				# process preferences and store:
				hash = str_to_hash_between hash[:beg_flag], hash[:end_flag], str
				@lpmd[key] = hash
			end
			update "\n #{key.to_s} = #{@lpmd[key]}"
		end

####_____ GET RENDERED CONTENT _____________________________________________####
		
		hr; log "creating rendering objects."
		renderer = Redcarpet::Render::HTML.new(           @lpmd[:r_opt] )
		markdown = Redcarpet::Markdown.new(     renderer, @lpmd[:p_ext] )
		
		log "Rendering HTML from markdown"
		@lpmd[:content] = markdown.render(text).html_safe
		
		unless @lpmd[:view] == 'top'
			log "Rendering table of contents"
			html_toc = Redcarpet::Markdown.new(Redcarpet::Render::HTML_TOC)
			@lpmd[:toc] = html_toc.render(text).html_safe
		end
		log "Calling #{@lpmd[:view]}.html.erb"; bar;
		render @lpmd[:view]
		
	end
	
################################################################################
	def readme

		text = File.read("README.md")
		
		@lpmd = {} # the hash that will store everything 
		
		@lpmd[:p_ext] = default_toc_p_ext
		@lpmd[:r_opt] = default_toc_r_opt
		
		renderer = Redcarpet::Render::HTML.new( @lpmd[:r_opt] )
		markdown = Redcarpet::Markdown.new(renderer, @lpmd[:p_ext])
		@lpmd[:content] = markdown.render(text).html_safe
		html_toc = Redcarpet::Markdown.new(Redcarpet::Render::HTML_TOC)
		@lpmd[:toc] = html_toc.render(text).html_safe
		
		render "toc"
	end
	
end
