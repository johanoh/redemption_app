# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

User.find_or_create_by!(name: "Test User") do |user|
  user.points_balance = 1500
end

require 'faker'

if Reward.count.zero?
  used_titles = Set.new

  100.times do
    title = nil

    loop do
      candidate = Faker::Commerce.product_name
      unless used_titles.include?(candidate) || Reward.exists?(title: candidate)
        title = candidate
        break
      end
    end

    used_titles << title

    Reward.create!(
      title: title,
      points_cost: rand(100..2000)
    )
  end
end
