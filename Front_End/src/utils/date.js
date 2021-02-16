function padNumber(n) {
    if (n < 10) {
        return '0' + n;
    }
    return n;
}

export const secondsToMinsAndSecs = (totalSeconds) => {
    let seconds = padNumber(totalSeconds % 60);
    let minutes = padNumber(parseInt(totalSeconds / 60));
    return minutes + ":" + seconds;
}

export const formatAMPM = (date) => {
    if (!date) {
        return "";
    }
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    hours = padNumber(hours);
    minutes = padNumber(minutes);
    let strTime = hours + ':' + minutes + ' ' + ampm;

    return strTime;
}