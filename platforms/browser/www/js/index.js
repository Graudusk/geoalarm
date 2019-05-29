"use strict";
var m = require("mithril");
var start = require("./views/start");
var traffic = require("./views/traffic");
var police = require("./views/police");
var policeDetail = require("./views/police-detail");
var trafficDetail = require("./views/traffic-detail");
var layout = require("./views/layout");

m.route(document.body, "/", {
    "/": {
        render: function () {
            return m(layout, m(start));
        }
    },
    "/traffic": {
        render: function () {
            return m(layout, m(traffic));
        }
    },
    "/police": {
        render: function () {
            return m(layout, m(police));
        }
    },
    "/traffic/:id": {
        render: function(vnode) {
            return m(layout, m(trafficDetail, vnode.attrs));
        }
    },
    "/police/:id": {
        render: function(vnode) {
            return m(layout, m(policeDetail, vnode.attrs));
        }
    }
});
