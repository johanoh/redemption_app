module Api
  module V1
    class UsersController < BaseController
      before_action :set_user

      def show_points
        render json: { points_balance: @user.points_balance }
      end

      def update_points
        service = PointsService.new(user: @user, amount: params[:points_balance].to_i)

        if service.set_user_points!
          render json: { points_balance: @user.points_balance }
        else
          render_error("Failed to update points", :unprocessable_entity)
        end

      rescue ArgumentError => e
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
