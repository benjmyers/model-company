angular.module('modelCompanyApp').
directive('bar', ['$window',
    function($window) {
        return {
            restrict: 'A',
            scope: {
                data: "=",
                attribute: "@",
                average: "=",
                orientation: "@",
                format: "@"
            },
            link: function(scope, element, attrs) {

                if (!scope.orientation)
                    scope.orientation = "horizontal";

                scope.$watch('data', function(newVal) {
                    if (newVal)
                        render(newVal);
                });

                function render(data) {

                    var margin = {
                            top: 20,
                            right: 20,
                            bottom: 30,
                            left: 150
                        },
                        width, height, x, y;
                    if (scope.orientation === "horizontal") {
                        var elemWidth = 800 || element[0].clientWidth;
                        var elemHeight = 300 || element[0].clientHeight;
                        width = elemWidth - margin.left - margin.right;
                        height = elemHeight - margin.top - margin.bottom;
                        x = d3.scale.ordinal()
                            .rangeRoundBands([0, width], .1);
                        y = d3.scale.linear()
                            .range([height, 0]);
                        x.domain(data.map(function(d) {
                            return d.label;
                        }));
                        y.domain([0, d3.max(data.map(function(d) {
                            return d.value;
                        }))]);
                    } else {
                        var elemWidth = 400 || element[0].clientWidth;
                        var elemHeight = 400 || element[0].clientHeight;
                        width = elemWidth - margin.left - margin.right;
                        height = elemHeight - margin.top - margin.bottom;
                        x = d3.scale.linear()
                            .range([0, width]);
                        y = d3.scale.ordinal()
                            .rangeRoundBands([0, height], .1);
                        x.domain([0, d3.max(data.map(function(d) {
                            return d.value;
                        }))]);
                        y.domain(data.map(function(d) {
                            return d.label;
                        }));
                    }

                    var xAxis = d3.svg.axis()
                        .scale(x)
                        .orient("bottom");

                    var yAxis = d3.svg.axis()
                        .scale(y)
                        .orient("left")
                        // .ticks(5)
                        // .tickFormat(d3.format("d"));

                    var svg = d3.select(element[0]).append("svg")
                        .attr("width", width + margin.left + margin.right)
                        .attr("height", height + margin.top + margin.bottom)
                        .append("g")
                        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                    svg.append("g")
                        .attr("class", "x axis")
                        .attr("transform", "translate(0," + height + ")")
                        .call(xAxis);

                    svg.append("g")
                        .attr("class", "y axis")
                        .call(yAxis)
                        // .append("text")
                        // .attr("transform", "rotate(-90)")
                        // .attr("y", 6)
                        // .attr("dy", ".71em")
                        // .style("text-anchor", "end")
                        // .text(scope.attribute.toUpperCase());

                    svg.selectAll(".bar")
                        .data(data)
                        .enter().append("rect")
                        .attr("class", "bar")
                        .attr("fill", '#4393c3')
                        .attr("x", function(d) {
                            return scope.orientation === "horizontal" ? x(d.label) : 0;
                        })
                        .attr("width", function(d) {
                            return scope.orientation === "horizontal" ? x.rangeBand() : x(d.value);
                        })
                        .attr("y", function(d) {
                            return scope.orientation === "horizontal" ? y(d.value) : y(d.label);
                        })
                        .attr("height", function(d) {
                            return scope.orientation === "horizontal" ? height - y(d.value) : y.rangeBand();
                        });

                    if (scope.average) {
                        svg.selectAll(".natl-average")
                            .data([scope.average])
                            .enter().append("rect")
                            .attr("class", "natl-average")
                            .attr("fill", '#d6604d')
                            .attr("x", function(d) {
                                return x(d) + x.rangeBand() / 2;
                            })
                            .attr("width", 2)
                            .attr("y", function(d) {
                                return 0;
                            })
                            .attr("height", function(d) {
                                return height;
                            });

                        var setAverage = d3.sum(data, function(d) {
                            return d.label * d.value;
                        }) / d3.sum(data, function(d) {
                            return d.value;
                        });

                        svg.selectAll(".co-average")
                            .data([setAverage])
                            .enter().append("rect")
                            .attr("class", "co-average")
                            .attr("fill", 'green')
                            .attr("x", function(d) {
                                return x(Math.floor(d)) + x.rangeBand() / 2;
                            })
                            .attr("width", 2)
                            .attr("y", function(d) {
                                return 0;
                            })
                            .attr("height", function(d) {
                                return height;
                            });
                    }
                }
            }
        }
    }
])
