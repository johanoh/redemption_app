class AddIndexesToRedemptions < ActiveRecord::Migration[8.0]
  def change
    add_index :redemptions, :user_id, if_not_exists: true
    add_index :redemptions, :reward_id, if_not_exists: true
    add_foreign_key :redemptions, :users, if_not_exists: true
    add_foreign_key :redemptions, :rewards, if_not_exists: true
  end
end
