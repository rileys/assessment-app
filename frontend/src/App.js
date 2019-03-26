import React, { Component } from 'react'
import axios from 'axios'
import {
  Box,
  Card,
  Flex,
  FormLabel,
  Heading,
  ListItem,
  TextInput,
} from '@untappd/components'

const API = 'http://localhost:5000'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      conference: null,
      teams: [],
      visibleTeams: [],
      players: {},
      teamPlayers: {},
    }
  }

  fetchData() {
    axios.get(API, { mode: 'no-cors' }).then(response => {
      const data = response.data
      this.setState({ conference: data.conference, teams: data.teams })
    })
  }

  componentDidMount() {
    this.fetchData()
  }

  fetchTeamPlayers(teamId) {
    axios
      .get(`${API}/teams/${teamId}/players`, { mode: 'no-cors' })
      .then(response => {
        const data = response.data
        this.setState(prevState => ({
          players: {
            ...prevState.players,
            ...data,
          },
          teamPlayers: {
            ...prevState.teamPlayers,
            [teamId]: Object.keys(data),
          },
        }))
      })
  }

  toggleTeamPlayersVisibility(teamId) {
    if (this.state.visibleTeams.includes(teamId)) {
      this.setState(prevState => ({
        visibleTeams: prevState.visibleTeams.filter(item => item !== teamId),
      }))
    } else {
      this.setState(prevState => ({
        visibleTeams: [...prevState.visibleTeams, teamId],
      }))
    }
  }

  toggleTeamPlayers(teamId) {
    this.toggleTeamPlayersVisibility(teamId)
    this.fetchTeamPlayers(teamId)
  }

  getTeamPlayers(teamId) {
    if (this.state.teamPlayers[teamId]) {
      return this.state.teamPlayers[teamId].map(
        playerId => this.state.players[playerId],
      )
    }
  }

  teamVisible(teamId) {
    return this.state.visibleTeams.includes(teamId)
  }

  updatePlayerJerseyNumber(playerId, event) {
    const player = { jersey_number: event.target.value }

    axios.put(`${API}/players/${playerId}`, player).then(response => {
      this.setState(prevState => ({
        players: {
          ...prevState.players,
          [playerId]: {
            ...prevState.players[playerId],
            starter: response.data.jersey_number,
          },
        },
      }))
    })
  }

  updatePlayerStarter(playerId, event) {
    const player = { starter: event.target.checked }

    axios.put(`${API}/players/${playerId}`, player).then(response => {
      this.setState(prevState => ({
        players: {
          ...prevState.players,
          [playerId]: {
            ...prevState.players[playerId],
            starter: response.data.starter,
          },
        },
      }))
    })
  }

  updateTeamRecord(teamId, field, event) {
    const team = { [field]: event.target.value }

    axios.put(`${API}/teams/${teamId}`, team).then(response => {
      this.setState(prevState => ({
        teams: [...prevState.teams, response.data],
      }))
    })
  }

  render() {
    const { conference } = this.state
    const { teams } = this.state

    if (conference === null) {
      return <h3>loading</h3>
    }

    return (
      <Box className="App" mx={12} my={5}>
        <Heading>
          {conference.short_name} ({conference.name})
        </Heading>

        {teams.map(team => (
          <Card key={team.id} mb={3}>
            <Card.Header onClick={() => this.toggleTeamPlayers(team.id)}>
              <Heading>
                {team.name} {team.mascot}, {team.coach}
                <FormLabel htmlFor={`team_${team.id}_wins`}>Wins</FormLabel>
                <TextInput
                  id={`team_${team.id}_wins`}
                  defaultValue={team.wins}
                  onChange={e => this.updateTeamRecord(team.id, 'wins', e)}
                />
                <FormLabel htmlFor={`team_${team.id}_losses`}>Losses</FormLabel>
                <TextInput
                  id={`team_${team.id}_losses`}
                  defaultValue={team.losses}
                  onChange={e => this.updateTeamRecord(team.id, 'losses', e)}
                />
              </Heading>
            </Card.Header>
            {this.teamVisible(team.id) && this.getTeamPlayers(team.id) && (
              <Card.Content>
                {this.getTeamPlayers(team.id).map(player => (
                  <ListItem key={player.id}>
                    <ListItem.Heading>{player.name}</ListItem.Heading>
                    <ListItem.Info>
                      <Flex flexDirection="row" flexWrap="wrap">
                        <Box width={[2, 1 / 3]} my={4}>
                          <FormLabel htmlFor="text-input">
                            Jersey Number
                          </FormLabel>
                          <TextInput
                            defaultValue={player.jersey_number}
                            onChange={e =>
                              this.updatePlayerJerseyNumber(player.id, e)
                            }
                          />
                        </Box>
                        <Box width={1 / 3} my={4}>
                          Height: {player.height}
                        </Box>
                        <Box width={1 / 3} my={4}>
                          Weight: {player.weight}
                        </Box>
                        <Box width={1 / 3} my={4}>
                          Position: {player.position}
                        </Box>
                        <Box width={1 / 3} my={4}>
                          <FormLabel htmlFor="select-starter" />
                          <label>
                            Starter
                            <input
                              name="starter"
                              type="checkbox"
                              checked={player.starter}
                              onChange={e =>
                                this.updatePlayerStarter(player.id, e)
                              }
                            />
                          </label>
                        </Box>
                      </Flex>
                    </ListItem.Info>
                  </ListItem>
                ))}
              </Card.Content>
            )}
          </Card>
        ))}
      </Box>
    )
  }
}

export default App
