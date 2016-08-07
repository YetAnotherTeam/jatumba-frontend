export class DatetimeUtils {
    timeSinceFromTemplateRenderTime(timeStamp, templateRenderTime) {
        timeStamp = new Date(timeStamp);
        var secondsPast = (templateRenderTime.getTime() - timeStamp.getTime() ) / 1000;
        if (secondsPast < 10) {
            return 'just now';
        }
        if (secondsPast < 60) {
            return Math.floor(secondsPast) + ' seconds ago';
        }
        if (secondsPast < 3600) {
            return Math.floor(secondsPast / 60) + ' minutes ago';
        }
        if (secondsPast <= 86400) {
            return Math.floor(secondsPast / 3600) + ' hours ago';
        }
        if (secondsPast > 86400) {
            var day = timeStamp.getDate();
            var month = timeStamp.toDateString().match(/ [a-zA-Z]*/)[0].replace(" ", "");
            var year = timeStamp.getFullYear() == templateRenderTime.getFullYear() ? "" : " " + timeStamp.getFullYear();
            return day + " " + month + year;
        }
    }
}