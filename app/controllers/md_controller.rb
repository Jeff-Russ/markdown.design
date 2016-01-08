class MdController < ApplicationController
	include ConfHelper
	include ApplicationHelper
	
	def route
		
		@livedocs = {} # the hash that will store everything 
	
		# GET LOCATION OF CONTENT AND SAVE TO LOCAL VARIABLE (text) ##############
		
		# get the document as raw text string:
		if params.key? :file # NOTE params or params ???
			@livedocs[:file_path] = params[:file] 
			text = File.read(@livedocs[:file_path] << ".md")
		else # we need to grab the doc from somewhere else:
			if (params.key? :s3) || (params.key? :aws) || (params.key? :toc)
				@livedocs[:file_path] = "https://s3.amazonaws.com/#{params[:aws]}.md"
			 elsif (params.key? :gh) || (params.key? :github)
				@livedocs[:file_path] = "https://raw.githubusercontent.com/#{params[:github]}.md"
			 elsif params.key? :https
				@livedocs[:file_path] = "https://#{params[:https]}.md" 
			 elsif params.key? :http
			 	@livedocs[:file_path] = "http://#{params[:http]}.md"
			 elsif params.key? :url
			 	@livedocs[:file_path] = params[:@livedocs[:file_path] << ".md"]
			 else
			 	rootPath = true
				text = File.read("README.md")
			end
			unless 
				rootPath then text = open(@livedocs[:file_path]) {|f| f.read }
			end
		end
		
		# LOCATE CONFIGURATION FILE AND SAVE IT TO A LOCAL VARIABLE  (conf) ######
		
		# we may or may not need this directory but defining it here is quicker
		dir = @livedocs[:file_path].concat( @livedocs[:file_path].split('/')[-1] )
		
		# params[:toc], params[:top], params[:full] and params[:side] indicate 
	 	# indicated desired view by their presence. The value indicates path of 
	 	# config file in other location. If the value is empty a default file 
	 	# local to this server will be used instead.
		
		if params.key? :toc
			@livedocs[:view] = "toc"
			if params[:toc].nil?
				@livedocs[:p_ext] = ConfHelper.toc_p_ext
				@livedocs[:r_opt] = ConfHelper.toc_r_opt
				@livedocs[:vars]  = ConfHelper.toc_vars
			 else conf = open(dir << params[:toc] << '.md') {|f| f.read } 
			end
		 elsif params.key? :top
			@livedocs[:view] = "top"
			if params[:top].nil?
				@livedocs[:p_ext] = ConfHelper.top_p_ext
				@livedocs[:r_opt] = ConfHelper.top_r_opt
				@livedocs[:vars]  = ConfHelper.top_vars
			 else conf = open(dir << params[:top] << '.md') {|f| f.read } 
			end
		 elsif params.key? :full
			@livedocs[:view] = "full"
			if params[:full].nil?
				@livedocs[:p_ext] = ConfHelper.full_p_ext
				@livedocs[:r_opt] = ConfHelper.full_r_opt
				@livedocs[:vars]  = ConfHelper.full_vars
			 else conf = open(dir << params[:full] << '.md') {|f| f.read }
			end
		 elsif params.key? :side
			@livedocs[:view] = "side"
			if params[:side].nil?
				@livedocs[:p_ext] = ConfHelper.side_p_ext
				@livedocs[:r_opt] = ConfHelper.side_r_opt
				@livedocs[:vars]  = ConfHelper.side_vars
			 else conf = open(dir << params[:side] << '.md') {|f| f.read }
			end
		 else # default view is toc with on-server conf file
			@livedocs[:view] = "toc"
			if params[:toc].nil?
				@livedocs[:p_ext] = ConfHelper.toc_p_ext
				@livedocs[:r_opt] = ConfHelper.toc_r_opt
				@livedocs[:vars]  = ConfHelper.toc_vars
			 else conf = open(dir << params[:toc] << '.md') {|f| f.read } 
			end
		end
		
	# PROCESS AND STORE CONTENTS OF CONFIG FILE #################################
		
		unless conf.blank?
				
			# process RedCarpet parser extensions and store:
			temp = conf.string_between_markers("begin_p_ext", "end_p_ext")
			unless temp.blank?
				@livedocs[:p_ext] = temp
				str = params[:p_ext]   # save as a string for now
				
				 # remove all whitespace and split into array at delimiters
				arr = str.gsub(/\s+/, '').split(/[=,:]/)  
				hash = Hash[*arr.flatten]     # convert to hash
				
				# now we'll convert keys to symbols and values to booleans
				hash.each do |k, v|    # convert strings to boolean
					if   v =~ (/(true|t|yes|y|1|on|show)$/i) then v = true
					 else v = false 
					end
					@livedocs[:p_ext[k.to_sym] = v] # convert keys to symbols
				end
			end
			
			# process RedCarpet renderer options and store:
			temp = conf.string_between_markers("begin_r_opt", "end_r_opt")
			unless temp.blank?
				@livedocs[:r_opt] = temp
				str = params[:r_opt]   # save as a string for now
				
				 # remove all whitespace and split into array at delimiters
				arr = str.gsub(/\s+/, '').split(/[=,:]/)  
				hash = Hash[*arr.flatten]     # convert to hash
				
				# now we'll convert keys to symbols and values to booleans
				hash.each do |k, v|    # convert strings to boolean
					if   v =~ (/(true|t|yes|y|1|on|show)$/i) then v = true
					 else v = false 
					end
					@livedocs[:r_opt[k.to_sym] = v] # convert keys to symbols
				end
			end

			# store other variables:
			temp = conf.string_between_markers("begin_vars", "end_vars")
			unless temp.blank?
				@livedocs[:vars] = temp
			end
		end
			
	# 	# If view is toc, you must have toc rendered, regardless of what conf says
	# 	if @livedocs[:view] == "toc" then @livedocs[:p_ext][:with_toc_data] = true end
			
	# # PROCESS ANY PAGE VARIABLES FOUND IN conf FILE #############################
	# 	renderer = Redcarpet::Render::HTML.new( @livedocs[:r_opt] )
	# 	markdown = Redcarpet::Markdown.new( renderer, @livedocs[:p_ext].deep_dup ) 
	# 	@livedocs[:content] = markdown.render(text).html_safe
		
	# 	# render table of contents
	# 	if (@livedocs[:p_ext][:with_toc_data] == true)
	# 		html_toc = Redcarpet::Markdown.new(Redcarpet::Render::HTML_TOC)
	# 		@livedocs[:toc]     = html_toc.render(text).html_safe 
	# 	end
	
	test = { strikethrough: true}

		renderer = Redcarpet::Render::HTML.new( @livedocs[:r_opt] )
		markdown = Redcarpet::Markdown.new(renderer, @livedocs[:p_ext])
		@livedocs[:content] = markdown.render(text).html_safe
		html_toc = Redcarpet::Markdown.new(Redcarpet::Render::HTML_TOC)
		@livedocs[:toc] = html_toc.render(text).html_safe

		
		render @livedocs[:view]
		
	end
	
end
