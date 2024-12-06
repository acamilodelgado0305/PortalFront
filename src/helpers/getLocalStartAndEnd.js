export const getLocalStartAndEnd = (utcTimes) => {

  const { start, end } = utcTimes;
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const startLocal = new Date(start).toLocaleTimeString(undefined, {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
  });

  const endLocal = new Date(end).toLocaleTimeString(undefined, {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
  });


  return { start: startLocal, end: endLocal };
};
