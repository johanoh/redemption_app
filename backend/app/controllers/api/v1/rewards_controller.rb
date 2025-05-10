module Api
  module V1
    class RewardsController < BaseController
      def index
        rewards = Reward.sorted_by(params[:sort])
        render json: rewards.as_json(only: [ :id, :title, :points_cost ])
      rescue ArgumentError => e
        render_error(e.message, :bad_request)
      end
    end
  end
end
