angular.module('modelCompanyApp').
directive('timeseries', ['$window', 'ObjectService', 'ColorService',
    function($window, ObjectService, ColorService) {
        return {
            restrict: 'A',
            scope: {
                data: "=",
                events: "=",
                attribute: "@",
                filter: "=",
                mess: "@"
            },
            link: function(scope, element, attrs) {

                var context, x;
                var circleSize = $(window).width() < 786 ? 8 : 12;

                scope.$watch('data', function(newVal) {
                    if (newVal)
                        render(newVal);
                });

                scope.$watch('filter', function(newVal) {
                    if (context && newVal)
                        update(newVal)
                }, true)

                function update(filter) {

                    var data = ObjectService.constructWithFilter(scope.data, scope.attribute, filter);
                    data = _.reject(data, function(d) {
                        return d.label === "NA";
                    });

                    // DATA JOIN
                    var circ = context.selectAll(".circ")
                        .data(data, function(d) { return d.label; });

                    // UPDATE
                    circ.transition().duration(500)
                        .attr("cx", function(d) {
                            return x(getDate(d.label));
                        })
                        .attr("r", function(d) {
                            return Math.min(50, Math.max(circleSize, 20 * Math.log(d.value)));
                        })

                    circ.selectAll('title')
                        .text(function(d) {
                            return d.value;
                        })

                    // EXIT
                    var exitCirc = circ.exit();
                    exitCirc.transition().duration(250)
                        .attr("r", 0);

                }

                function render(data) {
                    data = ObjectService.construct(data, scope.attribute, scope.mess);
                    data = _.reject(data, function(d) {
                        return d.label === "NA";
                    });

                    var margin;
                    if ($(window).width() < 786) {
                        margin = {
                            top: 50,
                            right: 15,
                            bottom: 50,
                            left: 15
                        };
                    }
                    else {
                        margin = {
                            top: 25,
                            right: 15,
                            bottom: 50,
                            left: 60
                        };
                    }
                    var width = $('.container-fluid').width() - margin.left - margin.right;
                    var height = ($(window).width() < 786) ? 300 - margin.top - margin.bottom : 200 - margin.top - margin.bottom;

                    var parseDate = d3.time.format("%b %Y").parse;

                    x = d3.time.scale().range([0, width - margin.left - margin.right])

                    var xAxis = d3.svg.axis().scale(x).orient("bottom")
                        .ticks(10)
                        .tickSize(-height, 0)
                        .tickFormat(d3.time.format("%m-%d-%y"));

                    x.domain(d3.extent(data.map(function(d) {
                        return getDate(d.label);
                    })));

                    var svg = d3.select(element[0]).append("svg")
                        .attr("width", width + margin.left + margin.right)
                        .attr("height", height + margin.top + margin.bottom);

                    var tip = d3.tip()
                        .attr('class', 'd3-tip')
                        .html(function(d) { 
                          var m = Math.round(d.value) === 1 ? " man, " : " men, ";
                          return Math.round(d.value) + m + Math.round(d.percentage)+"%"; 
                        });
                    svg.call(tip);

                    context = svg.append("g")
                        .attr("class", "context")
                        .attr("transform", "translate(" + (margin.left) + "," + (height / 2) + ")");

                    var ev = context.selectAll(".event")
                        .data(scope.events)
                        .enter().append("g")
                        .attr("transform", function(d) {
                            return "translate(" + x(getDate(d.date)) + "," + (margin.top/2) + ")";
                        })

                    ev.append("line")
                        .attr("x1", 0)
                        .attr("y1", function(d) {
                            return $(window).width() < 786 ? 0 : -30
                        })
                        .attr("x2", 1)
                        .attr("y2", 50)
                        .style("stroke", "#ccc");

                    context.selectAll(".circ")
                        .data(data, function(d) { return d.label; })
                        .enter().append("circle")
                        .attr("class", "circ")
                        .attr("cx", function(d) {
                            return x(getDate(d.label));
                        })
                        .attr("cy", function(d, i) {
                            return (height - margin.top - margin.bottom)/2;
                        })
                        .style("fill", ColorService.company)
                        .style("opacity", 0.8)
                        .attr("r", function(d) {
                            return Math.min(50, Math.max(circleSize, 20 * Math.log(d.value)));
                        })
                        .on('mouseover', tip.show)
                        .on('mouseout', tip.hide);

                    var textGr = ev.append("g")
                        .attr("transform", function(d, i) {
                            if ($(window).width() < 786) {
                                var dy = (i % 2) ? -10 : 55;
                                var rotate = "rotate(-90)";
                                return "translate(" + 5 + "," + dy + ")" + rotate;
                            }
                            else {
                                var dy = (i % 2) ? (height / 2) + 20 : -height / 2;
                                return "translate(0," + dy + ")";
                            }
                            
                        })

                    textGr.append("text")
                        .style("font-weight", "300")
                        .style("text-anchor", function(d, i) {
                            return textAnchor(d, i);
                        })
                        .text(function(d) {
                            return d.name;
                        })

                    textGr.append("text")
                        .attr("dy", 14)
                        .attr("class", "lbl-xs")
                        .style("text-anchor", function(d, i) {
                           return textAnchor(d, i);
                        })
                        .text(function(d) {
                            return ($(window).width() < 786) ? "" : d.date;
                        })

                }

                function textAnchor(d, i) {
                    if ($(window).width() < 786)
                        return (i % 2) ? "beginning" : "end";
                    else
                        return "middle";
                }

                function getDate(date) {
                    var d = moment(date.trim(), "MM/DD/YYYY").valueOf()
                    return d;
                }
            }
        }
    }
]);
