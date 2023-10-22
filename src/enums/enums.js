export const GAME_STATUS = Object.freeze({
  'draft': 'Черновик',
  'planned': 'Запланирована',
  'ongoing': 'В процессе',
  'completed': 'Завершена'
});

export const GAME_STATUS_SEVERITY = Object.freeze({
  'draft': 'warning',
  'planned': 'info',
  'ongoing': 'success',
  'completed': 'danger'
});

export const PLAYER_STATUS = Object.freeze({
  'alive': 'жив',
  'slight_injury': 'легко ранен',
  'moderate_injury': 'значительно ранен',
  'severe_injury': 'тяжело ранен',
  'dead': 'погиб'
});

export const PLAYER_STATUS_SEVERITY = Object.freeze({
  'alive': 'success',
  'slight_injury': 'warning',
  'moderate_injury': 'warning',
  'severe_injury': 'warning',
  'dead': 'danger'
});

export const INJURY_DEGREE = Object.freeze({
  'slight_injury': 'легкое',
  'moderate_injury': 'значительное',
  'severe_injury': 'тяжелое',
});
