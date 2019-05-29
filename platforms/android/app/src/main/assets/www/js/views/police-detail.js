"use strict";
var m = require("mithril");
var police = require("../models/police.js");
var main = require("../models/main.js");
var position = require("../models/position.js");

module.exports = {
    oncreate: function() {
        position.showDetailMap(police.current.lng, police.current.lat, "police");
    },
    oninit: function(vnode) {
        window.scrollTo(0, 0);
        police.getEvent(vnode.attrs.id);
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
                        href: "/police/",
                        oncreate: m.route.link
                    }, [
                        m("i.fas.fa-chevron-left.fa-2x"), [
                            m("span.icon-text", "Tillbaka")
                        ]
                    ])
                ),
                m("div", police.current !== null ? [
                    m("div#map.map"),
                    m(".details", [
                        m("h2", police.current.title_type),
                        m("p", main.getDate(police.current.pubdate_iso8601)),
                        m("p", police.current.description),
                        m("p", police.getContent(police.current.content))
                    ])
                ] : "")
            ])
        ];
    }
};
