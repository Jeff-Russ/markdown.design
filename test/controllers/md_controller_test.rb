require 'test_helper'

class MdControllerTest < ActionController::TestCase
  test "should get full" do
    get :full
    assert_response :success
  end

  test "should get side" do
    get :side
    assert_response :success
  end

  test "should get top" do
    get :top
    assert_response :success
  end

  test "should get toc" do
    get :toc
    assert_response :success
  end

end
