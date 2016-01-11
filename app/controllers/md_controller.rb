######--------------------------------------------######
######  By Jeff Russ https://github.com/Jeff-Russ ######
######--------------------------------------------######

require 'open-uri'
require 'uri'

class MdController < ApplicationController
	include Helpers
	include Helpers::ConfHelper
	include Helpers::OpenUri
	
################################################################################
	def route
		
		@livedocs = {}                            # hash that'll store everything 
		s3 = 'https://s3.amazonaws.com/'          # for prepending to partial path
		gh = 'https://raw.githubusercontent.com/' # same
		@livedocs[:path] = ''                     # this will hold complete path
		text = ''                                 # will hold raw content as string
		
####_____ GET FILE PATH ____________________________________________________####

# The following query string params are used to set the file path and desired
# view option. If their value is empty they merely indicated desired view.

		
		if params.key? :pages then @livedocs[:view] = "top"
			unless params[:pages].nil?
				@livedocs[:path] = params[:pages]<< '.md' end 
		
		 elsif params.key? :docs then @livedocs[:view] = "toc"
			unless params[:docs].nil?
				@livedocs[:path] = params[:docs]<< '.md' end 
				
		 elsif params.key? :toc then @livedocs[:view] = "toc"
			unless params[:toc].nil?
				@livedocs[:path] = params[:toc]<< '.md' end
			
		 elsif params.key? :top then @livedocs[:view] = "top"
			unless params[:top].nil?
				@livedocs[:path] = params[:top]<< '.md' end 
		
		 elsif params.key? :full then @livedocs[:view] = "full"
			unless params[:full].nil?
				@livedocs[:path] = params[:full]<< '.md' end 
			
		 elsif params.key? :side then @livedocs[:view] = "side"
			unless params[:side].nil?
				@livedocs[:path] = params[:side]<< '.md' end 
				
		 else @livedocs[:view] = "toc" # default view is with table of contents
		end
		
		if params.key? :file                    # GET FILE FROM LOCAL (THIS) SERVER 
			@livedocs[:path] = params[:file] << ".md" 
			text = File.read( @livedocs[:path] ) # we are done
			
		 elsif params.key? :url                 # GET FILE FROM FULL WEB URL 
			@livedocs[:path] = params[:url] << '.md' # we can skip prepend
			
		 else	# DETERMINE DOMAIN OF PATH AND PREPEND TO PATH
		 
			if (params.key? :s3)
				if @livedocs[:path] == '' # (unless we already found a path)
					  @livedocs[:path] = s3 << params[:s3] << '.md'
				else @livedocs[:path] = s3 << params[:path] end
				
			 elsif (params.key? :aws) 
				if @livedocs[:path] == ''
					  @livedocs[:path] = s3 << params[:aws] << '.md'
				else @livedocs[:path] = s3 << params[:path] end
					
			 elsif (params.key? :gh) 
				if @livedocs[:path] == ''
					  @livedocs[:path] = gh << params[:gh] << '.md'
				else @livedocs[:path] = gh << params[:path] end
					
			 elsif (params.key? :github) 
				if @livedocs[:path] == ''
					  @livedocs[:path] = gh << params[:github] << '.md'
				else @livedocs[:path] = gh << params[:path] end
				
			 elsif (params.key? :http) 
				if @livedocs[:path] == ''
					  @livedocs[:path] = 'http://'<< params[:https]<< '.md}'
				else @livedocs[:path] = 'http://'<< params[:path] end
					
			 elsif (params.key? :https) 
				if @livedocs[:path] == ''
					  @livedocs[:path] = 'https://'<< params[:https]<< '.md}'
				else @livedocs[:path] = 'https://'<< params[:path] end
					
			 elsif (params.key? :jeffruss)           # selfish default!
				if @livedocs[:path] == ''
					  @livedocs[:path]= s3<< 'jeffruss/'<< params[:jeffruss]<< '.md'
				else @livedocs[:path]= s3<< 'jeffruss/'<< params[:path]<< '.md' end
			end
		end
		
# GET CONTENT AS STRING IF NON-LOCAL
		if text == '' # ( might be empty if we got if from internal file)
			text = safe_open(@livedocs[:path]) # safe_open is from helper file
		end
		
####_____ GET RENDER OPTIONS _______________________________________________####

# REDCARPET RENDER OPTIONS 
		dir = @livedocs[:path].concat( @livedocs[:path].split('/')[-1] )
		
		unless params.key? :r_opt                   # no custom parser exten's
			@livedocs[:r_opt] = default_toc_r_opt    # use defaults
		else                                        # custom extensions requested
			str = open(dir << params[:r_opt] << '.md') {|f| f.read } 
			# process RedCarpet parser extensions and store:
			hash = HashHelper.str_to_hash_between '#BEGIN_R_OPT', '#END_R_OPT', str
			@livedocs[:r_opt] = hash
		end

# REDCARPET PARSER EXTENSIONS 
		unless params.key? :p_ext                   # no custom parser exten's
			@livedocs[:p_ext] = default_toc_p_ext    # use defaults
		else                                        # custom extensions requested
			str = open(dir << params[:p_ext] << '.md') {|f| f.read } 
			# process RedCarpet parser extensions and store:
			hash = HashHelper.str_to_hash_between '#BEGIN_P_EXT', '#END_P_EXT', str
			@livedocs[:p_ext] = hash
		end

# OTHER CUSTOM VARIABLES
		unless params.key? :vars                   # no custom parser exten's
			@livedocs[:vars] = default_toc_vars    # use defaults
		else                                        # custom extensions requested
			str = open(dir << params[:vars] << '.md') {|f| f.read } 
			# process RedCarpet parser extensions and store:
			hash = HashHelper.str_to_hash_between '#BEGIN_VARS', '#END_VARS', str
			@livedocs[:vars] = hash
		end
	
####_____ GET RENDERED CONTENT _____________________________________________####
	
		# create rendering object:
		renderer = Redcarpet::Render::HTML.new(           @livedocs[:r_opt] )
		markdown = Redcarpet::Markdown.new(     renderer, @livedocs[:p_ext] )
		
		# render content:
		@livedocs[:content] = markdown.render(text).html_safe
		
		# render table of contents if requested:
		unless @livedocs[:view] == 'top'
			html_toc = Redcarpet::Markdown.new(Redcarpet::Render::HTML_TOC)
			@livedocs[:toc] = html_toc.render(text).html_safe
		end
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
