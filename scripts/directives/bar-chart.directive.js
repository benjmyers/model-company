angular.module('modelCompanyApp').
directive('bar', ['$window', 'ObjectService', 'ColorService',
    function($window, ObjectService, ColorService) {
        return {
            restrict: 'A',
            scope: {
                data: "=",
                attribute: "@",
                mess: "@",
                average: "=",
                orientation: "@",
                national: "@"
            },
            link: function(scope, element, attrs) {
                var svg;

                if (!scope.orientation)
                    scope.orientation = "horizontal";

                scope.$watch('data', function(newVal) {
                    if (newVal)
                        render(newVal);
                });

                angular.element($window).bind('resize', function() {
                    if (svg && scope.data) {
                        element.empty();
                        render(scope.data);
                    }
                })

                function convertHeight(inches) {
                    return (Math.round((inches/12)*10)/10 + "").replace(".", "\'");
                }

                function render(data) {
                    
                    if (!scope.national)
                        data = ObjectService.construct(data, scope.attribute, scope.mess);

                    data = _.reject(data, function(d) {
                        return d.label === "NA";
                    });

                    var margin = {
                            top: 10,
                            right: 20,
                            bottom: 60,
                            left: 40
                        },
                        width, height, x, y;

                    if (scope.orientation === "horizontal") {
                        var elemWidth;
                        if ($(window).width() < 786)
                            elemWidth = $(window).width();
                        else
                            elemWidth = $(window).width()/2;
                        var elemHeight = $(window).height()/2;
                        width = elemWidth - margin.left - margin.right;
                        height = elemHeight - margin.top - margin.bottom;
                        x = d3.scale.ordinal()
                            .rangeRoundBands([0, width], .1);
                        y = d3.scale.linear()
                            .range([height, 0]);
                        x.domain(data.map(function(d) {
                            return d.label;
                        }));
                        y.domain([0, 21]);
                    } else {
                        var elemWidth = 400 || element[0].clientWidth;
                        var elemHeight = 500 || element[0].clientHeight;
                        width = elemWidth - margin.left - margin.right;
                        height = elemHeight - margin.top - margin.bottom;
                        x = d3.scale.ordinal()
                            .range([0, width]);
                        y = d3.scale.ordinal()
                            .rangeRoundBands([0, height], .1);
                        x.domain([0, 21]); // 21 is the max val for height and age. hard coding for ease.
                        y.domain(data.map(function(d) {
                            return d.label;
                        }));
                    }

                    var xAxis = d3.svg.axis()
                        .scale(x)
                        .orient("bottom")
                        .tickFormat(function(d) {
                            return (scope.attribute === "heightin") ? convertHeight(d) : d;
                        })
                        .ticks(6);

                    var yAxis = d3.svg.axis()
                        .scale(y)
                        .orient("left")
                        .innerTickSize([-width])
                        .outerTickSize([-width])
                        .ticks(5);

                    svg = d3.select(element[0]).append("svg")
                        .attr("width", width + margin.left + margin.right)
                        .attr("height", height + margin.top + margin.bottom)
                        .append("g")
                        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                    svg.append("g")                                                                                                                                                                                                                                                                                       
                        .attr("class", "x axis")
                        .attr("transform", "translate(0," + height + ")")
                        .call(xAxis)
                         .append("text")
                          .attr("x", width/2)
                          .attr("y", function(d) {
                            return ($(window).width() < 786) ? 40 : 35;
                          })
                          .style("text-anchor", "middle")
                          .attr("class", "lbl-xs")
                          .text(function(d) {
                            return scope.attribute === "heightin"? "Height" : "Age";
                          });

                    svg.append("g")
                        .attr("class", "y axis")
                        .call(yAxis)
                        .append("text")
                          .attr("transform", "rotate(-90)")
                          .attr("x", -height/2)
                          .attr("dy", "-25")
                          .style("text-anchor", "middle")
                          .attr("class", "lbl-xs")
                          .text("Soldiers");

                    svg.selectAll(".bar")
                        .data(data)
                        .enter().append("rect")
                        .attr("class", "bar")
                        .attr("fill", ColorService.visualization)
                        .attr("x", function(d) {
                            return scope.orientation === "horizontal" ? x(d.label) : 0;
                        })
                        .attr("width", function(d) {
                            return scope.orientation === "horizontal" ? x.rangeBand() : x(d.percentage);
                        })
                        .attr("y", function(d) {
                            return scope.orientation === "horizontal" ? y(d.percentage) : y(d.label);
                        })
                        .attr("height", function(d) {
                            return scope.orientation === "horizontal" ? height - y(d.percentage) : y.rangeBand();
                        });

                    svg.selectAll('.tick text')
                        .attr("y", function(d, i) {
                            if ($(window).width() < 786)
                                return (i % 2) ? 9 : 19;
                            else
                                return 9;
                        })

                    if (scope.average) {
                        svg.selectAll(".natl-average")
                            .data([scope.average])
                            .enter().append("rect")
                            .attr("class", "natl-average")
                            .attr("fill", ColorService.national)
                            .attr("x", function(d) {
                                return x(d) + x.rangeBand() / 2;
                            })
                            .attr("width", 3)
                            .attr("y", function(d) {
                                return 0;
                            })
                            .attr("dy", function(d) {
                                return -5;
                            })
                            .attr("height", function(d) {
                                return height + 5;
                            });

                        var setAverage = d3.sum(data, function(d) {
                            return parseInt(d.label) * d.percentage;
                        }) / d3.sum(data, function(d) {
                            return d.percentage;
                        });

                        svg.selectAll(".co-average")
                            .data([setAverage])
                            .enter().append("rect")
                            .attr("class", "co-average")
                            .attr("fill", ColorService.company)
                            .attr("x", function(d) {
                                return x(Math.floor(d)) + x.rangeBand() / 2;
                            })
                            .attr("width", 2)
                            .attr("y", function(d) {
                                return 0;
                            })
                            .attr("dy", function(d) {
                                return -5;
                            })
                            .attr("height", function(d) {
                                return height + 5;
                            });
                    }
                }
            }
        }
    }
])
