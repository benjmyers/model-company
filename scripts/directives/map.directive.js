angular.module('modelCompanyApp').
directive('map', ['$window', 'ObjectService', 'ColorService',
    function($window, ObjectService, ColorService) {
        return {
            restrict: 'A',
            scope: {
                data: "=",
                filter: "=",
                interaction: "=",
                geocoder: "="
            },
            link: function(scope, element, attrs) {
                var map, dataLayer;

                // Watch for model data changes
                scope.$watch('data', function(newVal) {
                    if (newVal)
                        draw();
                });

                scope.$watch('filter', function(newVal) {
                    if (map && scope.data && newVal) {
                        map.removeLayer(dataLayer);
                        draw()
                    }
                }, true)

                scope.$watch('interaction', function(newVal) {
                    if (map && newVal) 
                        enableInteraction();
                    else if (map && !newVal)
                        disableInteraction();
                }, true)

                // Create the map
                var mapId = scope.mess? 'map'+scope.mess : 'map';

                map = L.map(mapId, {
                    minZoom: 5,
                    maxZoom: 12,
                    zoomControl: false
                }).setView([40.398036,-76.811517], 6);
                
                disableInteraction();

                L.esri.basemapLayer('Gray').addTo(map);
                L.esri.basemapLayer('GrayLabels').addTo(map);


                function disableInteraction() {
                    map.dragging.disable();
                    map.touchZoom.disable();
                    map.doubleClickZoom.disable();
                    map.scrollWheelZoom.disable();
                    map.boxZoom.disable();
                    map.keyboard.disable();
                }

                function enableInteraction() {
                    map.dragging.enable();
                    map.touchZoom.enable();
                    map.doubleClickZoom.enable();
                    map.scrollWheelZoom.enable();
                    map.boxZoom.enable();
                    map.keyboard.enable();
                }

                function getLocation(lat, lon) {
                    return _.find(scope.geocoder, function(e) { return e.lat === lat && e.lon === lon;});
                }

                // Draw the map
                function draw() {

                    var data = scope.data;
                    var value = scope.filter.value;
                    if (value === "Officers")
                        value = "Mess 7";

                    if (value && value !== "Company") {
                        data = _.reject(data, function(d) {
                            return parseInt(value.split("Mess ")[1]) !== parseInt(d.mess);;
                        });
                    }

                    var mapObj = {};
                    var latLngs = [];
                    _.each(data, function(d) {
                        if (d.latitude && d.longitude) {
                            latLngs.push([parseFloat(d.latitude), parseFloat(d.longitude)]);
                            if (!mapObj[d.latitude + "," + d.longitude + "," + d.mess])
                                mapObj[d.latitude + "," + d.longitude + "," + d.mess] = 1;
                            else
                                mapObj[d.latitude + "," + d.longitude + "," + d.mess]++;
                        }
                    })

                    var pts = [];
                    _.each(mapObj, function(v, k) {
                        var d = k.split(",");
                        var fillColor = ColorService.defaultScale(parseInt(d[2]));
                        var circle = L.circle([parseFloat(d[0]), parseFloat(d[1])], v * 1500, {
                            stroke: false,
                            fillColor: fillColor,
                            fillOpacity: 0.5
                        });
                        var loc = getLocation(d[0], d[1])
                        circle.bindPopup("<b>" + loc.town + "</b><div>" + v + " men</div>");
                        pts.push(circle);
                    });

                    dataLayer = new L.LayerGroup(pts).addTo(map);

                    if (latLngs.length)
                        map.fitBounds(latLngs);

                }
            }
        }
    }
])
