import {padNumber} from '../utils/date';

export const timeDuration = (startTime, endTime) => {
  let totalTimeDifference = 0;
  let seconds = 0;
  let minutes = 0;
  totalTimeDifference = endTime - startTime;
  seconds = parseInt(totalTimeDifference / 1000);
  minutes = parseInt(seconds / 60);
  seconds = seconds % 60;

  if (seconds === 0 && minutes === 0) {
    return `${padNumber(minutes)}:${padNumber(seconds)} Sec's`;
  } else if (seconds !== 0 && minutes === 0) {
    return `${padNumber(minutes)}:${padNumber(seconds)} Sec's`;
  } else {
    return `${padNumber(minutes)}:${padNumber(seconds)} Min's`;
  }
};
