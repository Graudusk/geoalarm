"use strict";
var m = require("mithril");
var traffic = require("../models/traffic.js");
var main = require("../models/main.js");
var position = require("../models/position.js");

module.exports = {
    oncreate: function() {
        if (traffic != null && traffic.current != null) {
            position.showDetailMap(traffic.current.position[0],
                traffic.current.position[1]);
        }
    },
    oninit: function(vnode) {
        window.scrollTo(0, 0);
        traffic.getEvent(vnode.attrs.id);
    },
    onbeforeremove: function(vnode) {
        vnode.dom.classList.add("slide-out-right");
        return new Promise(function(resolve) {
            setTimeout(function() {
                vnode.dom.classList.remove("slide-out-right");
                resolve();
            }, 300);
        });
    },
    view: function() {
        return [
            m("div.slide-in-right", [
                m("div.topMenu",
                    m("a", {
                        href: "/traffic/",
                        oncreate: m.route.link
                    }, [
                        m("i.fas.fa-chevron-left.fa-2x"), [
                            m("span.icon-text", "Tillbaka")
                        ]
                    ])
                ),
                m("div", traffic.current !== null ? [
                    m("div#map.map"),
                    m(".details", [
                        m("p", traffic.getValue("MessageType")),
                        m("p", main.getDate(traffic.current.PublicationTime)),
                        m("p", traffic.getValue("LocationDescriptor")),
                        m("p", traffic.getValue("Message"))
                    ])
                ] : "")
            ])
        ];
    }
};
