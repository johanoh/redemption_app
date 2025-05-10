require 'rails_helper'

RSpec.describe User, type: :model do
  it { should have_many(:redemptions).dependent(:destroy) }
  it { should have_many(:rewards).through(:redemptions) }

  it { should validate_presence_of(:name) }
  it { should validate_numericality_of(:points_balance).is_greater_than_or_equal_to(0) }

  it "has a valid default state" do
    user = create(:user)
    expect(user).to be_valid
  end
end
