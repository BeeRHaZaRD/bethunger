export const GAME_STATUS = Object.freeze({
  'DRAFT': 'Черновик',
  'PLANNED': 'Запланирована',
  'ONGOING': 'В процессе',
  'COMPLETED': 'Завершена'
});

export const GAME_STATUS_SEVERITY = Object.freeze({
  'DRAFT': 'warning',
  'PLANNED': 'info',
  'ONGOING': 'success',
  'COMPLETED': 'danger'
});

export const PLAYER_STATUS = Object.freeze({
  'ALIVE': 'жив',
  'SLIGHT_INJURY': 'легко ранен',
  'MODERATE_INJURY': 'значительно ранен',
  'SEVERE_INJURY': 'тяжело ранен',
  'DEAD': 'погиб'
});

export const PLAYER_STATUS_SEVERITY = Object.freeze({
  'ALIVE': 'success',
  'SLIGHT_INJURY': 'warning',
  'MODERATE_INJURY': 'warning',
  'SEVERE_INJURY': 'warning',
  'DEAD': 'danger'
});

export const INJURY_DEGREE = Object.freeze({
  'SLIGHT_INJURY': 'легкое',
  'MODERATE_INJURY': 'значительное',
  'SEVERE_INJURY': 'тяжелое',
});

export const SEX = Object.freeze({
  0: 'MALE',
  1: 'FEMALE'
});
