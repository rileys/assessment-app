class PlayersController < ApplicationController
  def index
    @players = Player.where(team_id: params[:team_id]).index_by(&:id)
    render json: @players
  end

  def update
    @player = Player.find(params[:id])
    @player.update(player_params)
    render json: @player
  end

  private

  def player_params
    params.require(:player).permit(:jersey_number, :starter)
  end
end
