class Reward < ApplicationRecord
  SORT_OPTIONS = {
    "points_desc" => { points_cost: :desc },
    "points_asc"  => { points_cost: :asc },
    "title_asc"   => { title: :asc },
    "title_desc"  => { title: :desc }
  }.freeze

  DEFAULT_SORT = { points_cost: :asc }.freeze

  has_many :redemptions, dependent: :destroy
  has_many :users, through: :redemptions

  validates :title, presence: true
  validates :points_cost, numericality: { greater_than_or_equal_to: 0 }


  scope :sorted_by, ->(sort = nil) {
    return order(DEFAULT_SORT) if sort.blank?

    key = sort.to_s.downcase
    raise ArgumentError, "Invalid sort option" unless SORT_OPTIONS.key?(key)

    order(SORT_OPTIONS[key])
  }
end
