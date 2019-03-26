# frozen_string_literal: true

require 'rails_helper'

RSpec.describe TeamsController do
  let(:conference) { create(:conference) }

  it 'returns a success response with teams' do
    3.times { create(:team, :with_players, conference: conference) }
    get "/conferences/#{conference.id}/teams", as: :json

    expect(response).to have_http_status(:ok)
    expect(response.parsed_body.size).to eq(3)
  end

  it 'returns a success response with updated team json' do
    team = create(:team, conference: conference)
    put "/teams/#{team.id}", params: { team: { wins: 1000, losses: 2 } }, as: :json

    expect(response).to have_http_status(:ok)
    expect(response.parsed_body['wins']).to eq(1000)
    expect(response.parsed_body['losses']).to eq(2)
  end
end
