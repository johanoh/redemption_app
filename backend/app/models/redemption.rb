class Redemption < ApplicationRecord
  belongs_to :user
  belongs_to :reward

  validates :redeemed_at, presence: true
  validates :reward_id, uniqueness: { scope: :user_id }
end
