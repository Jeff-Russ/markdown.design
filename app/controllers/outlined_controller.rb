# call this project pagify-md pagefly docdown docploy livedoc livepage livepage-md

class OutlinedController < ApplicationController
  
  include OutlinedHelper

  def show
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
