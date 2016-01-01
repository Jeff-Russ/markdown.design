class MdController < ApplicationController
  include MdHelper

  def show
    if params[:toc].present?
      @render_toc = params.fetch(toc)
    else
      @render_toc = true
    end
    
    if params[:aws].present?
      url = "https://s3.amazonaws.com/" << params.fetch(:aws) 
      render_url url
      
    elsif params[:https].present?
      url = "https://" << params.fetch(:https) 
      render_url url
      
    elsif params[:http].present?
      url = "http://" << params.fetch(:http) 
      render_url url
      
    elsif params[:url].present? 
      url = params.fetch(:url) 
      render_url url
      
    else
      text = File.read('README.md')
      render_markdown text
    end
  end
  
end
