angular.module('modelCompanyApp').
directive('pie', ['$window',
    function($window) {
        return {
            restrict: 'A',
            scope: {
                data: "=",
                attribute: "@",
                format: "@"
            },
            link: function(scope, element, attrs) {
                scope.$watch('data', function(newVal) {
                    if (newVal)
                        render(newVal);
                });

                function render(data) {
                    data = _.sortBy(data, function(d) { return d.label; });
                    //Regular pie chart example
                    nv.addGraph(function() {
                     var chart = nv.models.pieChart()
                        .x(function(d) { return d.label })
                        .y(function(d) { return d.value })
                        .showLabels(true)     //Display pie labels
                        .labelThreshold(.1)  //Configure the minimum slice size for labels to show up
                        .labelType("percent") //Configure what type of data to show in the label. Can be "key", "value" or "percent"
                        .donut(true)          //Turn on Donut mode. Makes pie chart look tasty!
                        .donutRatio(0.35)     //Configure how big you want the donut hole size to be.
                        .tooltips(true)
                        .color([
                            '#d6604d',
                            '#4393c3',
                            '#f4a582',
                            '#92c5de',
                            '#fddbc7',
                            '#d1e5f0',
                            '#b2182b',
                            '#2166ac'
                        ]);

                        d3.select("."+scope.attribute)
                            .datum(data)
                            .transition().duration(350)
                            .call(chart);

                      return chart;
                    });
                }
            }
        }
    }
]);
