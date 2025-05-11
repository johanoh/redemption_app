require 'rails_helper'

RSpec.describe Redemption, type: :model do
  it { should belong_to(:user) }
  it { should belong_to(:reward) }

  describe "validations" do
    it { should validate_presence_of(:redeemed_at) }
    it "Only include if you added uniqueness validation in the model" do
      create(:redemption)
      should validate_uniqueness_of(:reward_id).scoped_to(:user_id)
    end
  end
  

  it "has a valid default state" do
    redemption = create(:redemption)
    expect(redemption).to be_valid
  end
end
