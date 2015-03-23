angular.module('modelCompanyApp').
directive('map', ['$window', 'ObjectService', 'ColorService',
    function($window, ObjectService, ColorService) {
        return {
            restrict: 'A',
            scope: {
                data: "=",
                filter: "=",
                interaction: "="
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

                // Draw the map
                function draw() {

                    var data = scope.data;

                    data = _.reject(data, function(d) {
                        return !scope.filter[parseInt(d.mess)];
                    });

                    var latLngs = [];
                    var pts = [];
                    _.each(data, function(d) {
                        if (d.latitude && d.longitude) {
                            // Create the array of lat lngs for the heatlayer
                            latLngs.push([parseFloat(d.latitude), parseFloat(d.longitude)]);
                            var fillColor = ColorService.defaultScale(parseInt(d.mess));
                            var random = Math.random()/100;
                            var circle = L.circle([parseFloat(d.latitude) + random, parseFloat(d.longitude) + random], 3000, {
                                stroke: false,
                                fillColor: fillColor,
                                fillOpacity: 0.3
                            });
                            pts.push(circle);
                        }
                    });

                    dataLayer = new L.LayerGroup(pts).addTo(map);

                    if (latLngs.length)
                        map.fitBounds(latLngs);

                }
            }
        }
    }
])
