class AddUniqueIndexToRewardsTitle < ActiveRecord::Migration[8.0]
  def change
    add_index :rewards, :title, unique: true
  end
end
