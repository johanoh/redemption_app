require 'rails_helper'

RSpec.describe "Api::V1::RedemptionsController", type: :request do
  shared_context 'parsed API response' do
    let(:parsed_body) { JSON.parse(response.body) }
  end

  describe "POST /api/v1/redemptions" do
    include_context "parsed API response"



    let!(:user) { create(:user, points_balance: user_point_balance) }
    let!(:reward) { create(:reward, title: "Gift Card", points_cost: 500) }
    let(:user_point_balance) { 2000 }
    let(:reward_id) { reward.id }

    context "with valid parameters" do
      let(:user_point_balance) { 2000 }
      include_context "parsed API response"
      before do
        post "/api/v1/redemptions", params: { reward_id: reward_id }
      end

      it { expect(user.redemptions.count).to eq(1) }
      it { expect(user.reload.points_balance).to eq(1500) }
      it { expect(parsed_body["status"]).to eq("success") }
      it { expect(parsed_body["redemption"]).to be_present }
      it 'returns the redemption with the correct data' do
        redemption = Redemption.first
        expect(parsed_body).to include(
          "redemption" => include(
            "id" => redemption.id,
            "reward" => include(
              "id" => reward.id,
              "title" => reward.title,
              "points_cost" => reward.points_cost
            ),
            "points_balance" => user.reload.points_balance
          )
        )
      end
    end

    context "with insufficient points" do
      let(:user_point_balance) { 100 }

      before do
        post "/api/v1/redemptions", params: { reward_id: reward_id }
      end

      it { expect(response).to have_http_status(:unprocessable_entity) }
      it { expect(parsed_body["status"]).to eq("error") }
      it { expect(parsed_body["message"]).to be_present }
      it { expect(user.reload.points_balance).to eq(100) }
      it { expect(user.redemptions.count).to eq(0) }
    end

    context "with invalid reward ID" do
      let(:reward_id) { -1 }

      before do
        post "/api/v1/redemptions", params: { reward_id: reward_id }
      end

      it { expect(response).to have_http_status(:not_found) }
      it { expect(parsed_body["status"]).to eq("error") }
      it { expect(parsed_body["message"]).to eq("Reward not found") }
      it { expect(user.reload.points_balance).to eq(2000) }
    end

    context "when redemption fails" do
      before do
        allow_any_instance_of(PointsService).to receive(:redeem!).and_return(false)
        post "/api/v1/redemptions", params: { reward_id: reward_id }
      end

      it { expect(response).to have_http_status(:unprocessable_entity) }
      it { expect(parsed_body["status"]).to eq("error") }
      it { expect(parsed_body["message"]).to eq("Redemption failed") }
      it { expect(user.reload.points_balance).to eq(2000) }
    end

    context "when an exception occurs" do
      before do
        allow_any_instance_of(PointsService).to receive(:redeem!).and_raise("Unexpected error")
        post "/api/v1/redemptions", params: { reward_id: reward_id }
      end

      it { expect(response).to have_http_status(:unprocessable_entity) }
      it { expect(parsed_body["status"]).to eq("error") }
      it { expect(parsed_body["message"]).to eq("Unexpected error") }
      it { expect(user.reload.points_balance).to eq(2000) }
    end
  end
end
