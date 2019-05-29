"use strict";
var m = require("mithril");
// var main = require("../models/main.js");

module.exports = {
    view: function (vnode) {
        return m("div", [
            m("div.loader", [
                m("i.fas.fa-cog.fa-w-16.fa-spin.fa-6x")
            ]),
            m("main.container", vnode.children),
            m("nav.bottom-nav", [
                m("a" +
                    (m.route.get() == "/" ? ".active" : ""),
                {
                    href: "/",
                    oncreate: m.route.link
                }, [
                    m("i.fas.fa-map.fa-2x.fa-fw"),
                    m("span.icon-text", "Start")
                ]),
                m("a" + (m.route.get().indexOf("/traffic/") !== -1 ? ".active" : ""), {
                    href: "/traffic/",
                    oncreate: m.route.link
                }, [
                    m("i.fas.fa-car.fa-2x.fa-fw"),
                    // m("i.fas.fa-road.fa-2x.fa-fw"),
                    m("span.icon-text", "Trafik")
                ]),
                m("a" + (m.route.get().indexOf("/police/") !== -1 ? ".active" : ""), {
                    href: "/police/",
                    oncreate: m.route.link
                }, [
                    // m("i.fas.fa-bullhorn.fa-2x.fa-fw"),
                    m("i.fas.fa-shield-alt.fa-2x.fa-fw"),
                    m("span.icon-text", "Polis")
                ])
            ])
        ]);
    }
};
