class TeamsController < ApplicationController
  # GET /teams
  def index
    @teams = Team.all

    render json: @teams
  end

  def update
    @team = Team.find(params[:id])
    @team.update(team_params)
    render json: @team
  end

  private

  def team_params
    params.require(:team).permit(:wins, :losses)
  end
end
