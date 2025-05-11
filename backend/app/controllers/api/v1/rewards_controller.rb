module Api
  module V1
    class RewardsController < BaseController
      include Pagy::Backend

      def index
        rewards = Reward.sorted_by(params[:sort])
        @pagy, paginated_rewards = pagy(rewards, items: params[:per_page] || 10)

        render json: {
          rewards: paginated_rewards.as_json(only: [:id, :title, :points_cost]),
          meta: pagy_metadata(@pagy)
        }
      rescue ArgumentError => e
        render_error(e.message, :bad_request)
      end
    end
  end
end
