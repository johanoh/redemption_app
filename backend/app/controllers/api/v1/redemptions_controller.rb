module Api
  module V1
    class RedemptionsController < BaseController
      before_action :set_user

      def create
        reward = Reward.find(params[:reward_id])
        service = PointsService.new(user: @current_user, reward: reward)

        if service.redeem!
          render_redemption_success(redemption: service.redemption)
        else
          render json: { status: "error", message: "Redemption failed" }, status: :unprocessable_entity
        end

      rescue ActiveRecord::RecordNotFound
        render json: { status: "error", message: "Reward not found" }, status: :not_found
      rescue => e
        render json: { status: "error", message: e.message }, status: :unprocessable_entity
      end

      private

      def render_redemption_success(redemption:)
        render json: {
          status: "success",
          redemption: {
            id: redemption.id,
            redeemed_at: redemption.redeemed_at,
            reward: {
              id: redemption.reward.id,
              title: redemption.reward.title,
              points_cost: redemption.reward.points_cost
            },
            points_balance: @current_user.points_balance
          }
        }, status: :created
      end
    end
  end
end
