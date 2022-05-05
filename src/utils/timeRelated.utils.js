export const getArrayYears = (olderYear, lastYear) => {
  return Array.from({ length: (lastYear + 1) - olderYear }).map((_, index) => olderYear + index).reverse();
}

export const getLocalDateString = stringDateUS => {
  let stringDateLocal = stringDateUS.slice(0, 10);
  stringDateLocal = stringDateLocal.split("-");
  return `${stringDateLocal[2]}/${stringDateLocal[1]}/${stringDateLocal[0]}`
}

export const getActualYear = () => {
  return new Date().getYear() + 1900;
}

export const unaHoraEnMilisegundos = 3600000;
export const oneDayInMS = 24 * unaHoraEnMilisegundos;
export const getCantDaysInMS = cantDays => oneDayInMS * cantDays;

export const secondsToMmSs = timeInSeconds => {
  let minutes = Math.floor(timeInSeconds / 60);
  let seconds = timeInSeconds - minutes * 60;
  return `${minutes}:${seconds > 9 ? seconds : "0" + seconds}`;
}