export function getFormattedUTCDate(date:Date) {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  const seconds = String(date.getUTCSeconds()).padStart(2, '0');
  const milliseconds = String(date.getUTCMilliseconds()).padStart(3, '0');
  
  // Get microseconds by adding a random value (since JS Date doesn't track microseconds)
  const microseconds = String(Math.floor(Math.random() * 1000000)).padStart(6, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}${microseconds}+00:00`;
}
