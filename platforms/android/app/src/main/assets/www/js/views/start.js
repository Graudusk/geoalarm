"use strict";
var m = require("mithril");
var main = require("../models/main.js");
var police = require("../models/police.js");
var traffic = require("../models/traffic.js");
var position = require("../models/position.js");

module.exports = {
    onupdate: function() {
        if (position.currentPosition !== null &&
            position.counter == 0 &&
            police != undefined &&
            traffic != undefined) {
            main.startLoading();
            var lat = position.currentPosition.latitude;
            var lng = position.currentPosition.longitude;

            position.counter = position.counter + 1;
            police.getEvents(lat, lng).then(function(policeRet) {
                traffic.getEvents(lat, lng).then(function(trafficRet) {
                    position.showStartMap(policeRet, trafficRet);
                    main.endLoading();
                });
            });
        }
    },
    oninit: function() {
        position.counter = 0;
        var map = document.getElementById("startMap");

        if (map !== null && map.childElementCount == 0) {
            position.lastUpdated = null;
            position.getPosition(true);
        }
        position.getPosition(true);
    },
    view: function() {
        return [
            m("div.slide-in-left", [
                m("h1.text-center", [
                    m("p", position.currentPlace !== null &&
                            position.currentPosition !== null ?
                        "Din nuvarande position: " + position.currentPlace
                        :"Hämtar din position...")
                ]),
                m("div#map.map.loading", [
                    m("i.fas.fa-map.fa-w-16.fa-6x")
                ])
            ])
        ];
    }
};
