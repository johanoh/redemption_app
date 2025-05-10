FactoryBot.define do
  factory :redemption do
    user
    reward
    redeemed_at { Time.current }
  end
end
