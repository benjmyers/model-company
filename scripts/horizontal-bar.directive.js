angular.module('modelCompanyApp').
directive('horizontalBar', ['$window',
    function($window) {
        return {
            restrict: 'A',
            scope: {
                data: "=",
                attribute: "@",
                average: "=",
                format: "@", 
                label: "@",
                mess: "@"
            },
            link: function(scope, element, attrs) {

                // var d3colors = d3.scale.ordinal().range([
                //                 '#b2182b',
                //                 '#d6604d',
                //                 '#f4a582',
                //                 '#fddbc7',
                //                 '#f7f7f7',
                //                 '#d1e5f0',
                //                 '#92c5de',
                //                 '#4393c3',
                //                 '#2166ac']);

                var d3colors = d3.scale.ordinal().range([
                            '#fff7fb',
                            '#ece2f0',
                            '#d0d1e6',
                            '#a6bddb',
                           '#67a9cf',
                            '#3690c0',
                            '#02818a',
                            '#016c59',
                            '#014636'])

                scope.$watch('data', function(newVal) {
                    if (newVal)
                        render(newVal);
                });

                function render(data) {
                    data = _.sortBy(data, function(d) {
                        return d.label;
                    });
                    var margin = {
                            top: 25,
                            right: 20,
                            bottom: 30,
                            left: 20
                        },
                        width, height, x, y;

                    var barHeight = 35;
                    var elemWidth = $('.container').width();
                    var elemHeight = 100;
                    width = elemWidth - margin.left - margin.right;
                    height = elemHeight - margin.top - margin.bottom;

                    var calcdWidth = 0;
                    _.each(data, function(d) {
                        calcdWidth += d.value;
                    })

                    var scaler = width / calcdWidth;
                    _.each(data, function(d) {
                        d.value = d.value * scaler;
                    })

                    var svg = d3.select(element[0]).append("svg")
                        .attr("width", width + margin.left + margin.right)
                        .attr("height", height + margin.top + margin.bottom)
                        .append("g")
                        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


                    svg.append("text")
                        .attr("x", 0)
                        .attr("y", 0)
                        .attr("dy", "-5px")
                        .attr("font-size", 14)
                        .text(scope.label);

                    var runner = 0;
                    var item = svg.selectAll(".bar-item")
                        .data(data).enter().append("g")
                        .attr("transform", function(d) {
                            var value = angular.copy(runner);
                            runner += d.value;
                            return "translate("+ value + "," + 0 + ")";
                        })
                    item.append("rect")
                        .attr("class", "bar")
                        .attr("fill", function(d, i) {
                            return d3colors(i);
                        })
                        .attr("x", 0)
                        .attr("width", function(d) {
                            return d.value;
                        })
                        .attr("y", 0)
                        .attr("height", barHeight);

                    item.append("text")
                        .attr("x", function(d) {
                            return d.value / 2
                        })
                        .attr("y", barHeight * 1.5)
                        .attr("font-size", 14)
                        .attr("text-align", "middle")
                        .text(function(d) {
                            return d.label;
                        });
                }
            }
        }
    }
])
