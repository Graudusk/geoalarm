"use strict";
var m = require("mithril");
var traffic = require("../models/traffic.js");
var main = require("../models/main.js");
var position = require("../models/position.js");

function loadEvents() {
    if (position.currentPosition !== null &&
        position.counter == 0 &&
        traffic !== undefined &&
        traffic.getEvents !== undefined) {
        main.startLoading();
        var lat = position.currentPosition.latitude;
        var lng = position.currentPosition.longitude;

        position.counter = position.counter + 1;
        traffic.getEvents(lat, lng).then(function() {
            main.endLoading();
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
        document.removeEventListener("scroll", traffic.checkScroll);
        document.addEventListener("scroll", traffic.checkScroll);
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
                m("h2", "Trafikmeddelanden"),
                m("div", traffic.events.length > 0 ?
                    traffic.events.slice(0, traffic.currPage * traffic.pageCount)
                        .map(function(item) {
                            return m("div.event", {
                                onclick: function() {
                                    m.route.set("/traffic/" + item.Id);
                                }
                            }, [
                                m("p", item.Deviation[0].MessageType),
                                m("p", main.getDate(item.PublicationTime)),
                                m("p", item.Deviation[0].Message),
                                m("p", [
                                    m("i.fas.fa-compass.fa-fw"),
                                    " " + traffic.getPosition(item.Deviation)
                                ]),
                                m("i.fas.fa-chevron-right.fa-fw")
                            ]);
                        }) :
                    m("h1.text-center", [
                        m("i.fas.fa-road.fa-3x.fa-fw.shimmer"),
                    ])
                ),
                m("div", traffic.loadMoreBtn())
            ])
        ];
    }
};
