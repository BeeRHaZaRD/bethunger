import moment from "moment";

/**
 * Format dateTime to ISO string
 * @param {string|Date} dateTime
 * @returns {string|null}
 */
export function dateTimeToIso(dateTime) {
  return dateTime ? moment(dateTime, "DD.MM.YYYY HH:mm").format("YYYY-MM-DDTHH:mm") : null;
}

/**
 * Format dateTime to 'DD.MM.YYYY HH:mm'
 * @param {string|Date} dateTime
 * @returns {string|null}
 */
export function dateTimeToString(dateTime) {
  return dateTime ? moment(dateTime).format("DD.MM.YYYY HH:mm") : null;
}

/**
 * Format passed time to string
 * @param {number} days
 * @param {number} hours
 * @param {number} minutes
 * @param {number} seconds
 * @returns {string}
 */
export function formatTime(days, hours, minutes, seconds) {
  const _hours = hours.toString().padStart(2, '0');
  const _minutes = minutes.toString().padStart(2, '0');
  const _seconds = seconds.toString().padStart(2, '0');
  if (days === 0) {
    return `${_hours}:${_minutes}:${_seconds}`;
  } else {
    const _days = days.toString();
    const daysWord = wordCase(days, ['день', 'дня', 'дней']);
    return `${_days} ${daysWord} ${_hours}:${_minutes}:${_seconds}`;
  }
}

export function wordCase(value, words){
  value = Math.abs(value) % 100;
  let num = value % 10;
  if (value > 10 && value < 20) return words[2];
  if (num > 1 && num < 5) return words[1];
  if (num === 1) return words[0];
  return words[2];
}

/**
 * Choose a word form according to specified gender
 * @param {string} gender
 * @param {string} w1
 * @param {string} w2
 * @returns {string}
 */
export function wordFormByGender(gender, w1, w2) {
  return gender === 'MALE' ? w1 : w2;
}

export function makeFullName(entity) {
  return entity ? (entity.firstName + ' ' + entity.lastName) : null;
}

export function focusDropdown(ref) {
  setTimeout(() => {
    ref.container.querySelector('.p-dropdown .p-dropdown-trigger').click();
  }, 100);
}

/**
 * Get player's index by his district and sex
 * @param {number} district
 * @param {number} sexNum
 * @returns {number}
 */
export function getPlayerIndex(district, sexNum) {
  return 2 * district + sexNum - 2;
}

export function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}