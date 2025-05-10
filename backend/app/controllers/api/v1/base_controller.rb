module Api
  module V1
  class BaseController < ActionController::API
    before_action :set_user

    rescue_from ActiveRecord::RecordNotFound, with: :render_not_found
    rescue_from ActiveRecord::RecordInvalid, with: :render_unprocessable_entity

    private

    def set_user
      # hard coded for demo app to only have one user, Production app would return correct user
      @current_user = User.first
    end

    def render_not_found(exception)
      render json: { error: exception.message }, status: :not_found
    end

    def render_unprocessable_entity(exception)
      render json: { error: exception.record.errors.full_messages }, status: :unprocessable_entity
    end

    def render_error(message, status = :bad_request)
      render json: { error: message }, status: status
    end
  end
  end
end
