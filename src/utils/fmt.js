import numeral from 'numeral';
import moment from 'moment';

export function fmtProgress(val) {
  return numeral(val).format('0');
}

export function fmtMoney(val) {
  return numeral(val).format('0,00.00');
}

export function fmtTomorrow() {
  return moment().add(1, 'day');
}

export function fmtYesterday() {
  return moment().subtract(1, 'days');
}

export function fmtLastWeek() {
  return moment().subtract(1, 'week');
}

export function fmtLastMonth() {
  return moment().subtract(1, 'month');
}

export function fmtDateTime(val, fmt = 'YYYY-MM-DD HH:mm:ss') {
  let str = moment(val).format(fmt);
  if (str === 'Invalid date') {
    str = '-';
  }
  return str;
}

export function fmtDate(val) {
  return fmtDateTime(val, 'YYYY-MM-DD');
}

export function fmtYear(val) {
  return fmtDateTime(val, 'YYYY');
}

export function fmtMonth(val) {
  return fmtDateTime(val, 'MM');
}

export function fmtDay(val) {
  return fmtDateTime(val, 'DD');
}

export function formatThounsandsPercentage(num) {
  return numeral(num).format('0.000%', Math.floor);
}

export function formatTenThounsandsPercentage(num) {
  return numeral(num).format('0.0000%', Math.floor);
}
