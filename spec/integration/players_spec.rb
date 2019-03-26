# frozen_string_literal: true

require 'rails_helper'

RSpec.describe PlayersController do
  it 'returns a success response with players belonging to a team' do
    team = create(:team, :with_players, number: 3)
    get "/teams/#{team.id}/players", as: :json

    expect(response).to have_http_status(:ok)
    expect(response.parsed_body.keys.size).to eq(3)
  end

  it 'returns a success response with updated player json' do
    player = create(:player)
    put "/players/#{player.id}", params: { player: { jersey_number: 99, starter: true } }, as: :json

    expect(response).to have_http_status(:ok)
    expect(response.parsed_body['starter']).to eq(true)
    expect(response.parsed_body['jersey_number']).to eq(99)
  end
end
