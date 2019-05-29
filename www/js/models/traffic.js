"use strict";

var m = require("mithril");
// var main = require("../models/main.js");

var traffic = {
    baseUrl: "http://www.student.bth.se/~erjh17/dbwebb-kurser/webapp/me/kmom10/proj/www/",
    fetchError: "",
    current: null,
    fetchResponse: "",
    events: [],
    currPage: 1,
    pageCount: 10,
    checkScroll: function() {
        var btn = document.getElementById("loadMoreBtn");

        if (btn !== null) {
            var top = btn.offsetTop;
            var left = btn.offsetLeft;
            var width = btn.offsetWidth;
            var height = btn.offsetHeight;

            while (btn.offsetParent) {
                btn = btn.offsetParent;
                top += btn.offsetTop;
                left += btn.offsetLeft;
            }

            if (top >= window.pageYOffset &&
                left >= window.pageXOffset &&
                (top + height) <= (window.pageYOffset + window.innerHeight) &&
                (left + width) <= (window.pageXOffset + window.innerWidth)) {
                traffic.currPage += 1;
                m.redraw();
            }
        }
    },
    loadMore: function() {
        traffic.currPage = traffic.currPage + 1;
        m.redraw();
    },
    loadMoreBtn: function() {
        if (traffic.events.length > (traffic.currPage * traffic.pageCount)) {
            return m("p#loadMoreBtn.text-center", {
                onclick: function() {
                    traffic.loadMore();
                }
            }, "Läs in mer");
        }
        return "";
    },
    getPosition: function (dev) {
        for (var i = 0; i < dev.length; i++) {
            if (dev[i].RoadNumber) {
                return dev[i].RoadNumber;
            }
        }
        for (var o = 0; o < dev.length; o++) {
            if (dev[o].LocationDescriptor) {
                return dev[o].LocationDescriptor;
            }
        }
    },
    getValue: function (key) {
        for (var i = 0; i < traffic.current.Deviation.length; i++) {
            if (traffic.current.Deviation[i][key]) {
                return traffic.current.Deviation[i][key];
            }
        }
    },
    getEvent: function (id) {
        for (var i = 0; i < traffic.events.length; i++) {
            if (traffic.events[i].Id == id) {
                traffic.current = traffic.events[i];
                var pos = traffic.current.Deviation[0].Geometry.WGS84;
                var lat;
                var lng;

                pos = pos.replace("(", "");
                pos = pos.replace(")", "");
                pos = pos.split(" ");
                lat = pos[1];
                lng = pos[2];
                pos = [lat, lng];
                traffic.current.position = pos;

                return traffic.events[i];
            }
        }
    },
    getEvents: function (lat, lng, callback = null) {
        var xmlRequest = "<REQUEST>" +
            "<LOGIN authenticationkey='f3c9703c86284fb9917dd764185250ae' />" +
            "<QUERY objecttype='Situation' orderby='PublicationTime desc'>" +
                "<FILTER>" +
                    "<WITHIN name='Deviation.Geometry.WGS84' shape='center'"+
                    " value='" + lng + " " + lat + "' radius='50000m' />" +
                "</FILTER>" +
                "<INCLUDE>Id</INCLUDE>" +
                "<INCLUDE>Deviation.Header</INCLUDE>" +
                "<INCLUDE>Deviation.NumberOfLanesRestricted</INCLUDE>" +
                "<INCLUDE>Deviation.LocationDescriptor</INCLUDE>" +
                "<INCLUDE>Deviation.RoadNumber</INCLUDE>" +
                "<INCLUDE>Deviation.Geometry.WGS84</INCLUDE>" +
                "<INCLUDE>PublicationTime</INCLUDE>" +
                "<INCLUDE>Deviation.IconId</INCLUDE>" +
                "<INCLUDE>Deviation.Message</INCLUDE>" +
                "<INCLUDE>Deviation.MessageCode</INCLUDE>" +
                "<INCLUDE>Deviation.MessageType</INCLUDE>" +
            "</QUERY>" +
        "</REQUEST>";

        return fetch("http://api.trafikinfo.trafikverket.se/v1.3/data.json", {
            body: xmlRequest, // must match 'Content-Type' header
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, same-origin, *omit
            headers: {
                'user-agent': 'Mozilla/4.0 MDN Example',
                'content-type': 'text/xml',
                'access-control-allow-origin': '*'
            },
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, cors, *same-origin
            redirect: 'follow', // manual, *follow, error
            referrer: 'no-referrer', // *client, no-referrer
        }).then(function (result) {
            return result.json();
        }).then(function (result) {
            return result.RESPONSE.RESULT[0].Situation;
        }).then(function (ret) {
            traffic.events = ret.slice(0, 50);
            m.redraw();
            if (callback !== null) {
                callback();
            }
            return ret;
        }).catch(function (error) {
            console.log("The fetch operation failed due" +
                "to the following error: ", error.message);
            if (callback !== null) {
                callback();
            }
        });
    }
};

module.exports = traffic;
