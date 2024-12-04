export const getLocalStartAndEnd = (utcTimes) => {
  const { start, end } = utcTimes;
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const formatTime = (dateString, timeZone) => {
    const date = new Date(dateString);
    const options = {
      timeZone,
      hour: "numeric",
      minute: "2-digit",
      hour12: true, 
    };
    return date.toLocaleTimeString(undefined, options);
  };

  const startLocal = formatTime(start, timeZone);
  const endLocal = formatTime(end, timeZone);

  return { start: startLocal, end: endLocal };
};
