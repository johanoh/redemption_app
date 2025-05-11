require 'rails_helper'

RSpec.describe PointsService do
  let(:user) { create(:user, points_balance: 100) }
  let(:reward) { create(:reward, points_cost: 50) }
  subject(:service) { described_class.new(user: user, amount: amount, reward: reward) }
  let(:amount) { nil }

  describe "#initialize" do
    context "with minimal params" do
      subject { described_class.new(user: user) }
      it { is_expected.to have_attributes(user: user, amount: nil, reward: nil) }
    end

    context "with all params" do
      let(:amount) { 200 }
      it { is_expected.to have_attributes(user: user, amount: 200, reward: reward) }
    end
  end

  describe "#set_user_points!" do
    context "with valid amount" do
      let(:amount) { 200 }

      it "updates balance" do
        expect { service.set_user_points! }.to change { user.reload.points_balance }.to(200)
      end

      it "uses a lock" do
        expect(user).to receive(:with_lock)
        service.set_user_points!
      end
    end

    context "with negative amount" do
      let(:amount) { -10 }
      it { expect { service.set_user_points! }.to raise_error(ArgumentError, "Amount must be positive") }
    end

    context "with nil amount" do
      subject { described_class.new(user: user) }
      it { expect { service.set_user_points! }.to raise_error(ArgumentError, "amount must be provided") }
    end
  end

  describe "#redeem!" do
    context "successful redemption" do
      it "changes balance" do
        expect { service.redeem! }.to change { user.reload.points_balance }.by(-50)
      end

      it "creates redemption" do
        expect { service.redeem! }.to change(Redemption, :count).by(1)
      end

      it "sets redemption attribute" do
        service.redeem!
        expect(service.redemption).to have_attributes(user: user, reward: reward)
      end

      it "uses transaction" do
        expect(ActiveRecord::Base).to receive(:transaction)
        service.redeem!
      end
    end

    context "with insufficient points" do
      let(:user) { create(:user, points_balance: 10) }

      it "returns false" do
        expect(service.redeem!).to be false
      end

      it "preserves balance" do
        expect { service.redeem! }.not_to change { user.reload.points_balance }
      end
    end

    describe "memoization" do
      before { service.redeem! }

      it "returns cached value" do
        expect(service.redeem!).to be true
      end

      it "doesn't create duplicate redemptions" do
        expect { service.redeem! }.not_to change(Redemption, :count)
      end
    end
  end

  describe "private methods" do
    describe "#change_user_balance" do
      context "with :by" do
        it "changes balance relatively" do
          expect { service.send(:change_user_balance, by: 10) }
            .to change { user.reload.points_balance }.by(10)
        end
      end

      context "with :to" do
        it "sets absolute balance" do
          expect { service.send(:change_user_balance, to: 75) }
            .to change { user.reload.points_balance }.to(75)
        end
      end
    end

    describe "#create_redemption!" do
      let(:redemption) { service.send(:create_redemption!) }

      it "has correct attributes" do
        expect(redemption).to have_attributes(
          user: user,
          reward: reward,
          redeemed_at: be_within(1.second).of(Time.current)
        )
      end
    end
  end
end
