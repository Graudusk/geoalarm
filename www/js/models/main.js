"use strict";

var main = {
    startLoading: function() {
        document.body.classList.add("loading");
    },
    getDate: function(isodate) {
        var d = new Date(isodate);

        return d.getUTCFullYear() + '-' + ('0' + (d.getUTCMonth() + 1)).slice(-2) +
            '-' + ('0' + d.getUTCDate()).slice(-2) + ' ' + ('0' + d.getUTCHours()).slice(-2) + ':' +
            ('0' + d.getUTCMinutes()).slice(-2) + ':' + ('0' + d.getUTCSeconds()).slice(-2);
    },
    endLoading: function() {
        document.body.classList.remove("loading");
    }
};

module.exports = main;
