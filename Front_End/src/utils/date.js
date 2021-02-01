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