require 'rails_helper'

RSpec.describe Api::BaseController, type: :controller do
  controller(Api::BaseController) do
    def index
      render json: { user_id: @current_user.id }
    end

    def trigger_not_found
      raise ActiveRecord::RecordNotFound, "Not Found"
    end

    def trigger_invalid
      raise ActiveRecord::RecordInvalid.new(User.new)
    end

    def trigger_custom_error
      render_error("Something went wrong", :forbidden)
    end
  end

  let!(:user) { create(:user) }

  before do
    routes.draw do
      get 'index' => 'api/base#index'
      get 'not_found' => 'api/base#trigger_not_found'
      get 'invalid' => 'api/base#trigger_invalid'
      get 'custom_error' => 'api/base#trigger_custom_error'
    end
  end

  describe "before_action :set_user" do
    it "assigns the first user as current_user" do
      get :index
      expect(JSON.parse(response.body)["user_id"]).to eq(user.id)
    end
  end

  describe "error handling" do
    it "handles RecordNotFound" do
      get :trigger_not_found
      expect(response).to have_http_status(:not_found)
      expect(JSON.parse(response.body)["error"]).to eq("Not Found")
    end

    it "handles RecordInvalid" do
      get :trigger_invalid
      expect(response).to have_http_status(:unprocessable_entity)
      expect(JSON.parse(response.body)["error"]).to be_an(Array)
    end

    it "handles custom error rendering" do
      get :trigger_custom_error
      expect(response).to have_http_status(:forbidden)
      expect(JSON.parse(response.body)["error"]).to eq("Something went wrong")
    end
  end
end
