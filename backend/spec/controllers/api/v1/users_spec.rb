require 'rails_helper'

RSpec.describe Api::V1::UsersController, type: :request do
  let!(:user) { create(:user, points_balance: 1500) }

  shared_context 'parsed API response' do
    let(:parsed_body) { JSON.parse(response.body) }
  end

  shared_examples 'successful response' do
    it 'returns 200 OK status' do
      expect(response).to have_http_status(:ok)
    end
  end

  describe "GET /api/v1/users/:id/points" do
    include_context "parsed API response"

    before { get "/api/v1/users/#{user.id}/points" }

    include_examples "successful response"
    it { expect(parsed_body).to eq({ "points_balance" => 1500 }) }
  end

  describe "PATCH /api/v1/users/:id/points" do
    include_context "parsed API response"

    subject(:patch_request) { patch "/api/v1/users/#{user.id}/points", params: { points_balance: points } }

    context 'with valid amount' do
      let(:points) { 2000 }

      it 'changes points balance from 1500 to 2000' do
        expect { patch_request }.to change { user.reload.points_balance }.from(1500).to(2000)
      end

      it 'returns success response' do
        patch_request
        expect(response).to have_http_status(:ok)
      end

      it 'returns updated balance' do
        patch_request
        expect(parsed_body).to include("points_balance" => 2000)
      end
    end

    context 'with invalid amount' do
      let(:points) { -100 }

      it 'does not change points balance' do
        expect { patch_request }.not_to change { user.reload.points_balance }
      end

      it 'returns unprocessable entity status' do
        patch_request
        expect(response).to have_http_status(:unprocessable_entity)
      end

      it 'returns error message' do
        patch_request
        expect(parsed_body).to include("error" => "Validation failed: Points balance must be greater than or equal to 0")
      end
    end
  end
end