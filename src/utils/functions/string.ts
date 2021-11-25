export const textLimiter = (string: string, limit: number, limiter: string = '...') => {
  return string.length > limit ? string.slice(0, limit) + limiter : string;
};

export const countUpperCase = (string: string) => {
  return (string.match(/[A-Z]/g) || []).length;
};

export const convertTime = async (time: string) => {
  let time2 = 0;
  if (time) {
    if (time.split('s').length > 2) return 'error time';
    if (time.split('m').length > 2) return 'error time';
    if (time.split('h').length > 2) return 'error time';
    if (time.split('d').length > 2) return 'error time';
    if (time.split('w').length > 2) return 'error time';
    if (time.split('y').length > 2) return 'error time';
    time = time.replace('s', '*1000*');
    time = time.replace('m', '*60000*');
    time = time.replace('h', '*3600000*');
    time = time.replace('d', '*86400000*');
    time = time.replace('w', '*604800000*');
    time = time.replace('y', '*31536000000*');
    let num = time.split('*').length - 1;
    for (let i = 0; num > i; i += 2) {
      if (!isNaN(Number(time.split('*')[i]))) {
        if (!isNaN(Number(time.split('*')[i + 1]))) {
          time2 += parseInt(time.split('*')[i]) * Number(time.split('*')[i + 1]);
        }
      }
    }
    let y = time2 / 31536000000;
    y = y.toString().includes('e-') ? 0 : y;
    let d = (time2 - y * 31536000000) / 86400000;
    d = d.toString().includes('e-') ? 0 : d;
    let h = (time2 - y * 31536000000 - d * 86400000) / 3600000;
    h = h.toString().includes('e-') ? 0 : h;
    let m = (time2 - y * 31536000000 - d * 86400000 - h * 3600000) / 60000;
    m = m.toString().includes('e-') ? 0 : m;
    let s = (time2 - y * 31536000000 - d * 86400000 - h * 3600000 - m * 60000) / 1000;
    s = s.toString().includes('e-') ? 0 : s;
    if (isNaN(time2)) return 'error';
    return time2;
  }
  return 'error';
};

export const visuelTime = async (AllMs: number) => {
  let totalSeconds = AllMs / 1000;
  let days = Math.floor(totalSeconds / 86400);
  totalSeconds %= 86400;
  let hours = Math.floor(totalSeconds / 3600);
  totalSeconds %= 3600;
  let minutes = Math.floor(totalSeconds / 60);
  let seconds = Math.floor(totalSeconds % 60);

  let time = [];
  let timeText = '';
  if (days !== 0) time.push('' + days + ' day' + (days === 1 ? '' : 's'));
  if (hours !== 0) time.push('' + hours + ' hour' + (hours === 1 ? '' : 's'));
  if (minutes !== 0) time.push('' + minutes + ' minute' + (minutes === 1 ? '' : 's'));
  if (seconds !== 0) time.push('' + seconds + ' second' + (seconds === 1 ? '' : 's'));
  if (time.length === 4) timeText = time[0] + ', ' + time[1] + ', ' + time[2] + ' and ' + time[3];
  if (time.length === 3) timeText = time[0] + ', ' + time[1] + ' and ' + time[2];
  if (time.length === 2) timeText = time[0] + ' and ' + time[1];
  if (time.length === 1) timeText = time[0];
  if (time.length === 0) timeText = 'Less than a minute';

  return timeText;
};
