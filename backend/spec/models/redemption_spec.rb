require 'rails_helper'

RSpec.describe Redemption, type: :model do
  it { should belong_to(:user) }
  it { should belong_to(:reward) }

  it { should validate_presence_of(:redeemed_at) }

  it "has a valid default state" do
    redemption = create(:redemption)
    expect(redemption).to be_valid
  end
end
