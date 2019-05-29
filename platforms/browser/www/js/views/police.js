"use strict";
var m = require("mithril");
var main = require("../models/main.js");
var police = require("../models/police.js");
var position = require("../models/position.js");

function loadEvents() {
    if (position.currentPosition !== null &&
        position.counter == 0 &&
        police != undefined) {
        main.startLoading();
        var lat = position.currentPosition.latitude;
        var lng = position.currentPosition.longitude;

        position.counter = position.counter + 1;
        police.getEvents(lat, lng).then(function() {
            main.endLoading();
        }).catch(function(err) {
            console.log(err);
        });
    }
}

module.exports = {
    onupdate: function() {
        loadEvents();
    },
    oninit: function() {
        window.scrollTo(0, 0);
        position.counter = 0;
        loadEvents();
        position.getPosition();
    },
    onbeforeremove: function(vnode) {
        vnode.dom.classList.add("slide-out-left");
        return new Promise(function(resolve) {
            setTimeout(function() {
                vnode.dom.classList.remove("slide-out-left");
                resolve();
            }, 300);
        });
    },
    view: function() {
        return [
            m("div.slide-in-left", [
                m("h2", "Polismeddelanden"),
                m("div", police.events.length > 0 ?
                    police.events.map(function(item) {
                        return m("div.event", {
                            onclick: function() {
                                m.route.set("/police/" + item.id);
                            }
                        }, [
                            m("p", item.title_type),
                            m("p", main.getDate(item.pubdate_iso8601)),
                            m("p", item.description),
                            m("p", [
                                m("i.fas.fa-compass.fa-fw"),
                                " " + item.title_location
                            ]),
                            m("i.fas.fa-chevron-right.fa-fw")
                        ]);
                    }) :
                    m("h1.text-center", [
                        m("i.fas.fa-shield.fa-3x.fa-fw"),
                    ])
                )
            ])
        ];
    }
};
