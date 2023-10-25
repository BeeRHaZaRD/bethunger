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

export function range(start, stop, step) {
    return Array.from(
        {length: (stop - start) / step + 1},
        (value, index) => start + index * step
    )
}