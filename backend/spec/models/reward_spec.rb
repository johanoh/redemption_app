require 'rails_helper'

RSpec.describe Reward, type: :model do
  it { should have_many(:redemptions).dependent(:destroy) }
  it { should have_many(:users).through(:redemptions) }

  it { should validate_presence_of(:title) }
  it { should validate_uniqueness_of(:title) }
  it { should validate_numericality_of(:points_cost).is_greater_than_or_equal_to(0) }

  it "has a valid default state" do
    reward = create(:reward)
    expect(reward).to be_valid
  end
end
