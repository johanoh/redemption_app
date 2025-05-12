class CreateRewards < ActiveRecord::Migration[8.0]
  def change
    create_table :rewards do |t|
      t.string :title, null: false
      t.integer :points_cost, null: false

      t.timestamps
    end

    add_index :rewards, :title, unique: true
  end
end
