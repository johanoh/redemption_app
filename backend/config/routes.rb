Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Defines the root path route ("/")
  # root "posts#index"
  namespace :api do
    namespace :v1 do
      resources :users, only: [] do
        member do
          get :points, action: :show_points       # /api/v1/users/:id/points
          patch :points, action: :update_points   # /api/v1/users/:id/points
          get :redemptions                        # /api/v1/users/:id/redemptions
        end
      end
      resources :rewards, only: [ :index ]        # /api/v1/rewards
      resources :redemptions, only: [ :create ]   # /api/v1/redemptions
    end
  end
end
