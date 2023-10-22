export function timestampToDateTime(date) {
    date = new Date(date);
    return date.toLocaleDateString('ru-RU') + ' ' + date.toLocaleTimeString('ru-RU');
}
export function timestampToDate(date) {
    date = new Date(date);
    return date.toLocaleDateString('ru-RU');
}
export function timestampToTime(date) {
    date = new Date(date);
    return date.toLocaleTimeString('ru-RU');
}