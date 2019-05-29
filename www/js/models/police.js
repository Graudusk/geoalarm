"use strict";

var m = require("mithril");

var police = {
    baseUrl: "https://brottsplatskartan.se/api/",
    fetchError: "",
    fetchResponse: "",
    lastUpdated: null,
    events: [],
    current: null,
    getContent: function(content) {
        var div = document.createElement("div");

        div.innerHTML = content;
        return div.textContent || div.innerText || "";
    },
    getEvent: function(id) {
        for (var i = 0; i < police.events.length; i++) {
            if (police.events[i].id == id) {
                police.current = police.events[i];
            }
        }
    },
    getEvents: function(lat, lng) {
        var now = new Date();
        var promise = m.jsonp({
            url: police.baseUrl + "eventsNearby?lat=" + encodeURIComponent(lat) +
                "&lng=" + encodeURIComponent(lng) + "&app=notifa",
            callbackKey: "callback",
        });

        if ((now - police.lastUpdated) > (60 * 5 * 1000)) {
            promise.then(function (result) {
                police.events = result.data;
                police.lastUpdated = now;
            });
        }
        return promise;
    }
};

module.exports = police;
