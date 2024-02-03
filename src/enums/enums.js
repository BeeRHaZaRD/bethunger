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

export const PLANNED_EVENT_STATUS = Object.freeze({
  'SCHEDULED': 'Запланировано',
  'REQUESTED': 'Запрошено',
  'STARTED': 'Запущено',
  'CANCELLED': 'Отменено'
});

export const PLANNED_EVENT_STATUS_SEVERITY = Object.freeze({
  'SCHEDULED': '',
  'REQUESTED': 'warning',
  'STARTED': 'success',
  'CANCELLED': 'danger'
});

export const PLAYER_STATUS = Object.freeze({
  'ALIVE': 'здоров',
  'SLIGHT_INJURY': 'ранен',
  'MODERATE_INJURY': 'ранен',
  'SEVERE_INJURY': 'ранен',
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
  'SEVERE_INJURY': 'тяжелое'
});

export const SEX_NAME = Object.freeze({
  'MALE': 'мужчина',
  'FEMALE': 'женщина'
});

export const TRAIN_RESULTS_NAME = Object.freeze({
  strength: 'Сила',
  endurance: 'Выносливость',
  agility: 'Ловкость',
  stealth: 'Скрытность',
  steelArms: 'Холодное оружие',
  weapon: 'Стрелковое оружие',
  archery: 'Стрельба из лука',
  handToHand: 'Рукопашный бой'
});

export const SEX = Object.freeze({
  0: 'MALE',
  1: 'FEMALE'
});