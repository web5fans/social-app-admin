import dayjs from "dayjs";

export default function utcFormat(date?: string) {
  const template = 'YYYY/MM/DD HH:mm:ss UTC';
  return dayjs(date).utc().format(template);
}

export function dateFormat(date?: string) {
  const time = dayjs(date)
  if (!time.isValid()) return '-'
  return time.format('YYYY/MM/DD HH:mm:ss');
}