angular.module('modelCompanyApp').
directive('map', ['$window',
    function($window) {
        return {
            restrict: 'A',
            scope: {
                data: "="
            },
            link: function(scope, element, attrs) {
                var map, heat, markers, heatmapShowing = true,
                    markersShowing = true;

                // Watch for model data changes
                scope.$watch('data', function(newVal) {
                    if (newVal)
                        draw(newVal);
                });
                
                // Create the map
                map = L.map('map', {
                    minZoom: 4,
                    maxZoom: 17,
                    zoomControl: false
                }).setView([40.398036,-76.811517], 6);

                // Add the tile layer. Alternative themes: 'terrain' and 'watercolor'.
                var canvas = L.tileLayer.provider('Esri.WorldGrayCanvas');

                // Add the tile layer
                map.addLayer(canvas);

                // Draw the map
                function draw(data) {
                    var latLngs = [];
                    
                    _.each(data, function(d) {
                        if (d.latitude && d.longitude) {
                            // Create the array of lat lngs for the heatlayer
                            latLngs.push([parseFloat(d.latitude), parseFloat(d.longitude)]);
                        }
                    });

                    // Create the heatmap
                    heat = L.heatLayer(latLngs, {
                        radius: 16,
                        // gradient: {
                        //     0.4: '#1b5479',
                        //     0.65: '#d4e6f1',
                        //     1: '#D35400'
                        // }
                    });

                    if (heatmapShowing)
                        map.addLayer(heat);

                }
            }
        }
    }
])
