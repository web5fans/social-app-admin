import dayjs from "dayjs";

export default function secondsToDuration(seconds?: number) {
  if (!seconds) return '';
  const duration = dayjs.duration(seconds, 'seconds');
  return [
    duration.hours(),
    duration.minutes(),
    duration.seconds(),
  ].join(":")
}