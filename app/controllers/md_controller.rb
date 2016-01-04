class MdController < ApplicationController
  include MdHelper
  
  def route
    @livedocs = render_doc params
    if    request.params.key? :full then render "full"
    elsif request.params.key? :side then render "side"
    elsif request.params.key? :top  then render "full"
    elsif request.params.key? :toc  then render "toc"
    end
  end
  
end
