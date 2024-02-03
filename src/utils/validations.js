export function isGameInfoValid(game) {
  return (typeof game.name === 'string' && game.name.trim() !== '')
      && (typeof game.description === 'string' && game.description.trim() !== '')
      && (typeof game.arenaType === 'string' && game.arenaType.trim() !== '')
      && (typeof game.arenaDescription === 'string' && game.arenaDescription.trim() !== '')
      && (game.dateStart !== null);
}

export function isPlayersTrainResultsFull(players) {
  return players !== null && Object.values(players).flat().every(player => player.trainResults !== null);
}