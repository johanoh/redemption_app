class Redemption < ApplicationRecord
  belongs_to :user
  belongs_to :reward

  validates :redeemed_at, presence: true
end
