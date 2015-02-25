angular.module('modelCompanyApp').
directive('companyBar', ['$window', 'ObjectService',
    function($window, ObjectService) {
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

                var d3colors = d3.scale.ordinal().range([
                    '#b2182b',
                    '#d6604d',
                    '#f4a582',
                    '#fddbc7',
                    '#f7f7f7',
                    '#d1e5f0',
                    '#92c5de',
                    '#4393c3',
                    '#2166ac'
                ]);

                scope.$watch('data', function(newVal) {
                    if (newVal)
                        render(newVal);
                });

                function render(data) {
                    data = ObjectService.construct(data, scope.attribute, scope.mess);

                    data = _.sortBy(data, function(d) {
                        return d.label;
                    });
                    var margin, width, height, x, y;
                    margin = {
                        top: 2,
                        right: 2,
                        bottom: 2,
                        left: 70
                    }


                    var barHeight = (scope.mess) ? 18 : 35;
                    var elemWidth = $('.container').width();
                    var elemHeight = barHeight;
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
                        .attr("dy", function(d) {
                            return barHeight/2 + 2;
                        })
                        .attr("dx", -5)
                        .attr("font-size", 14)
                        .attr("text-anchor", "end")
                        .text(scope.label);

                    var runner = 0;
                    var item = svg.selectAll(".bar-item")
                        .data(data).enter().append("g")
                        .attr("transform", function(d) {
                            var value = angular.copy(runner);
                            runner += d.value;
                            return "translate(" + value + "," + 0 + ")";
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
                        .attr("height", barHeight)
                                                .append("svg:title").text(function(d) {
                            return d.label;
                        })

                    // if (!scope.mess) {
                    //     item.append("text")
                    //         .attr("x", function(d) {
                    //             return d.value / 2
                    //         })
                    //         .attr("y", barHeight * 1.5)
                    //         .attr("font-size", 14)
                    //         .attr("text-anchor", "middle")
                    //         .text(function(d) {
                    //             return d.label;
                    //         });
                    // }
                }
            }
        }
    }
])
