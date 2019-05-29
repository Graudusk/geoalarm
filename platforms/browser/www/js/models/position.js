"use strict";
/*global google:true*/
/*eslint no-undef: "error"*/
var m = require("mithril");

var position = {
    counter: 0,
    map: null,
    lastUpdated: null,
    locationMarker: null,
    openPopups: [],
    currentPosition: null,
    currentPlace: null,
    geocoder: null,
    // iconBase: "../../img/",
    iconBase: "http://www.student.bth.se/~erjh17/dbwebb-kurser/webapp/me/kmom10/proj/www/img/",
    // iconBase: "",
    getPosition: function (force = false, callback = null) {
        var now = new Date();

        if (navigator.geolocation) {
            if ((now - position.lastUpdated) > (60 * 5 * 1000) ||
                position.currentPosition == null ||
                force) {
                position.lastUpdated = now;
                navigator.geolocation.getCurrentPosition(
                    position.geoSuccess,
                    position.geoError
                );
            }

            if (callback !== null) {
                callback();
            }
        }
    },
    geoSuccess: function (pos) {
        position.currentPosition = pos.coords;
        var latlng = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);

        position.geocoder = new google.maps.Geocoder();

        position.geocoder.geocode({
            'latLng': latlng
        }, function (results, status) {
            if (status === google.maps.GeocoderStatus.OK) {
                if (results[2]) {
                    position.currentPlace = results[2].formatted_address;
                    m.redraw();
                } else {
                    position.currentPlace = null;
                    console.log('No results found');
                }
            } else {
                console.log('Geocoder failed due to: ' + status);
            }
        });
    },
    makeInfoWindowEvent: function (map, infowindow, marker) {
        google.maps.event.addListener(marker, 'click', function () {
            for (var popup in position.openPopups) {
                position.openPopups[popup].close();
            }
            position.openPopups.push(infowindow);
            infowindow.open(map, marker);
        });
    },
    geoError: function (error) {
        console.log('code: ' + error.code + '\n' +
            'message: ' + error.message + '\n');
    },
    initMap: function(pos) {
        var height = window.innerHeight - (57 + 116 + 68);
        var mapElement = document.getElementById("map");

        position.map = new google.maps.Map(mapElement, {
            zoom: 12,
            center: pos,
            mapTypeControl: false,
            streetViewControl: false,
            zoomControlOptions: {
                position: google.maps.ControlPosition.LEFT_TOP
            }
        });

        if (mapElement !== null) {
            mapElement.style.height = height + "px";
            mapElement.classList.remove("loading");
        }
    },
    showDetailMap: function (lat, lng, type = "traffic") {
        var eventPosition = new google.maps.LatLng(lng, lat);

        position.initMap(eventPosition);
        position.setPosition();
        new google.maps.Marker({
            map: position.map,
            icon: position.iconBase + type + ".png",
            position: eventPosition
        });
    },
    showStartMap: function (police, traffic) {
        var eventPosition = new google.maps.LatLng(position.currentPosition.latitude,
            position.currentPosition.longitude);

        position.initMap(eventPosition);
        position.setPosition();
        for (var i = 0; i < police.data.length; i++) {
            var latLng = new google.maps.LatLng(police.data[i].lat, police.data[i].lng);

            if (police.data[i].lat !== null) {
                var policemarker = new google.maps.Marker({
                    icon: position.iconBase + "police.png",
                    position: latLng,
                    clickable: true,
                    map: position.map,
                    title: police.data[i].title_type,
                    id: police.data[i].id
                });
                var anchor = document.createElement("a");

                anchor.innerText = policemarker.title;
                anchor.href = "#!/police/" + policemarker.id;

                var infowindow = new google.maps.InfoWindow({
                    content: anchor
                });

                position.makeInfoWindowEvent(position.map, infowindow, policemarker);
            }
        }

        for (var o = 0; o < traffic.length; o++) {
            var pos = traffic[o].Deviation[0].Geometry.WGS84;
            var lat;
            var lng;

            pos = pos.replace("(", "");
            pos = pos.replace(")", "");
            pos = pos.split(" ");
            lat = pos[2];
            lng = pos[1];
            pos = [lat, lng];
            var trafficLatLng = new google.maps.LatLng(lat, lng);

            if (lat !== null) {
                var marker = new google.maps.Marker({
                    position: trafficLatLng,
                    icon: position.iconBase + "traffic.png",
                    map: position.map,
                    id: traffic[o].Id,
                    title: traffic[o].Deviation[0].MessageCode
                });

                var trafficAnchor = document.createElement("a");

                trafficAnchor.innerText = marker.title;
                trafficAnchor.href = "#!/traffic/" + marker.id;

                var trafficInfowindow = new google.maps.InfoWindow({
                    content: trafficAnchor
                });

                position.makeInfoWindowEvent(position.map, trafficInfowindow, marker);
            }
        }
    },
    setPosition: function () {
        var pos = new google.maps.LatLng(position.currentPosition.latitude,
            position.currentPosition.longitude);
        var positionmarker = new google.maps.Marker({
            icon: position.iconBase + "user.png",
            map: position.map,
            position: pos
        });

        var positioninfowindow = new google.maps.InfoWindow({
            content: "Din position"
        });

        position.makeInfoWindowEvent(position.map, positioninfowindow, positionmarker);
    }
};

module.exports = position;
