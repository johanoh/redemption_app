class Reward < ApplicationRecord
  has_many :redemptions, dependent: :destroy
  has_many :users, through: :redemptions

  validates :title, presence: true
  validates :points_cost, numericality: { greater_than_or_equal_to: 0 }
end
