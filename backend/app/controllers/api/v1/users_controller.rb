module Api
  module V1
    class UsersController < BaseController
      before_action :set_user

      def show_points
        render json: { points_balance: @user.points_balance }
      end
      
      def update_points
        @user.update!(points_params)
        render json: { points_balance: @user.points_balance }
      rescue ActiveRecord::RecordInvalid => e
        render_error(e.message, :unprocessable_entity)
      end

      def redemptions
        redemptions = @user.redemptions.includes(:reward).order(created_at: :desc)
        render json: redemptions.as_json(include: :reward, except: [ :updated_at ])
      end

      private

      def set_user
        @user = User.find(params[:id])
      end

      def points_params
        params.permit(:points_balance)
      end
    end
  end
end
