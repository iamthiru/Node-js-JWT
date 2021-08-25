import {padNumber} from '../utils/date';

export const timeDuration = (startTime, endTime) => {
  let totalTimeDifference = 0;
  let seconds = 0;
  let minutes = 0;
  totalTimeDifference = endTime - startTime;
  seconds = parseInt(totalTimeDifference / 1000);
  minutes = parseInt(seconds / 60);
  seconds = seconds%60;

  return `${padNumber(minutes)} Min's, ${padNumber(seconds)} Sec's`;
};
