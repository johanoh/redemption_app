require 'rails_helper'

RSpec.describe "Api::V1::RewardsController", type: :request do
  describe "GET /api/v1/rewards" do
    shared_examples 'a sorted reward list' do
      include_context 'parsed API response'

      it { expect(parsed_body.first.keys).to match_array(%w[id title points_cost]) }
      it { expect(response).to have_http_status(:ok) }
      it { expect(parsed_body.length).to eq(3) }

      it 'returns rewards in correct order' do
        expected_rewards = expected_order.map do |reward|
          { "id" => reward.id, "title" => reward.title, "points_cost" => reward.points_cost }
        end

        expect(parsed_body).to eq(expected_rewards)
      end
    end

    shared_context 'parsed API response' do
      let(:parsed_body) { JSON.parse(response.body) }
    end

    context 'when default sort' do
      let!(:title_1) { 'Coffee' }
      let!(:title_2) { 'T-Shirt' }
      let!(:title_3) { 'Zebra' }
      let!(:reward1) { create(:reward, title: title_1, points_cost: 100) }
      let!(:reward2) { create(:reward, title: title_2, points_cost: 300) }
      let!(:reward3) { create(:reward, title: title_3, points_cost: 500) }

      before { get "/api/v1/rewards?sort=#{sort_type}" }

      context 'it returns rewards ordered by point cost ASC by default' do
        let(:sort_type) { nil }
        let(:expected_order) { [ reward1, reward2, reward3 ] } # 100, 300, 500
        include_examples 'a sorted reward list'
      end

      context 'with a valid sort type' do
        context 'with points ASC' do
          let(:sort_type) { 'points_asc' }
          let(:expected_order) { [ reward1, reward2, reward3 ] } # 100, 300, 500
          include_examples 'a sorted reward list'
        end

        context 'with points DESC' do
          let(:sort_type) { 'points_desc' }
          let(:expected_order) { [ reward3, reward2, reward1 ] } # 500, 300, 100
          include_examples 'a sorted reward list'
        end

        context 'with title ASC' do
          let(:sort_type) { 'title_asc' }
          let(:expected_order) { [ reward1, reward2, reward3 ] } # Coffee, T-Shirt, Zebra
          include_examples 'a sorted reward list'
        end

        context 'with title DESC' do
          let(:sort_type) { 'title_desc' }
          let(:expected_order) { [ reward3, reward2, reward1 ] } # Zebra, T-Shirt, Coffee
          include_examples 'a sorted reward list'
        end
      end
    end

    context 'when the sort option is invalid' do
      it 'returns 400 Bad Request with error message' do
        get "/api/v1/rewards?sort=invalid_option"

        expect(response).to have_http_status(:bad_request)

        json = JSON.parse(response.body)
        expect(json["error"]).to eq("Invalid sort option")
      end
    end

    context 'when there are no rewards' do
      include_context 'parsed API response'
      before { get "/api/v1/rewards" }

      it { expect(parsed_body).to eq([]) }
      it { expect(response).to have_http_status(:ok) }
    end
  end
end
