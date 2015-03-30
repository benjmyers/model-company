angular.module('modelCompanyApp').
directive('circlePack', ['$window', 'ObjectService', 'ColorService',
    function($window, ObjectService, ColorService) {
        return {
            restrict: 'A',
            scope: {
                data: "=",
                attribute: "@",
                filter: "=",
                mess: "@",
                format: "@"
            },
            link: function(scope, element, attrs) {
                var pack, svg, node, x, y, occupationBars, header, scaler;

                scope.$watch('data', function(newVal) {
                    if (newVal)
                        render(newVal);
                });

                scope.$watch('filter', function(newVal) {
                    if (svg && newVal)
                        update(newVal)
                }, true)


                angular.element($window).bind('resize', function() {
                    if (svg && scope.data) {
                        element.empty();
                        render(scope.data);
                    }
                })

                function update(filter) {
                    var companyCt = scope.data.length;

                    if (scope.format !== "false")
                        data = ObjectService.makeOccupationTree(scope.data, scope.attribute, scope.filter);

                    // BIND
                    svgctr.data(data);

                    // UPDATE
                    svgctr.select('.mess-circle')
                        .transition().duration(200)
                        .attr("r", function(d) {
                            return scope.filter.value === 'Company' ? 0 : getCoPercent(d, companyCt) * scaler;
                        });

                    header.data(data);

                    header.select('.mess-lbl')
                        .transition()
                        .text(function(d) {
                            return getCoPercent(d, companyCt) + "%";
                        });

                    d3.selectAll(".mess-row")
                        .attr("display", function(d) {
                            return filter.value !== "Company" ? "block" : "none";
                        });

                    var occupationBars = svgctr.selectAll(".bar")
                        .data(function(d) {
                            return d.children;
                        });

                    occupationBars.select(".occ-bar")
                        .transition().duration(200)
                        .attr("width", function(d) {
                            return x(d.percentage);
                        })

                    var occExit = occupationBars.exit()
                    occExit.select(".occ-bar")
                        .transition().duration(250)
                        .attr("width", 0)

                }

                function getCoPercent(category, length) {
                    return Math.ceil((d3.sum(_.pluck(category.children, 'percentage')) / length) * 100);
                }

                function render(data) {
                    var companyCt = data.length;

                    if (scope.format !== "false")
                        data = ObjectService.makeOccupationTree(scope.data, scope.attribute, scope.filter);

                    var width = $('.container-fluid').width(),
                        diameter = width / 6, // width divided by number of messes
                        height = $(window).width() < 786 ? 200 : 570;
                    scaler = $(window).width() < 786 ? 0.5 : 1.5;

                    svg = d3.select(element[0]).append("svg")
                        .attr("width", width)
                        .attr("height", height)
                        .style("text-align", "left")
                        .append("g")
                        .attr("transform", "translate(" + 20 + "," + 20 + ")");

                    var tip = d3.tip()
                        .attr('class', 'd3-tip')
                        .html(function(d) {
                            var m = Math.round(d.value) === 1 ? " man, " : " men, ";
                            return Math.round(d.value) + m + Math.round(d.percentage) + "%";
                        });
                    svg.call(tip);

                    var spacing = 25;
                    var natlOffset = -diameter / 2;
                    var companyOffset = -diameter / 2 + spacing;
                    var labelx = $(window).width() >= 786 ? 25 : 5;

                    var headerCtr = svg
                        .append("g")
                        .attr("transform", "translate(20, 0)");

                    header = headerCtr.selectAll(".occupation-row")
                        .data(data).enter()
                        .append("g")
                        .attr("class", "occupation-row")
                        .attr("transform", function(d, i) {
                            return "translate(" + (diameter * i + (diameter / 2)) + ",0)";
                        })

                    header.append("text")
                        .attr("y", 0)
                        .style("text-anchor", function(d) {
                            return $(window).width() >= 786 ? "middle" : "start"
                        })
                        .attr("class", "lbl-xs lower")
                        .attr("transform", function(d) {
                            return $(window).width() >= 786 ? "rotate(0)" : "rotate(-90)";
                        })
                        .attr("dy", function(d) {
                            return $(window).width() >= 786 ? "0" : "4px";
                        })
                        .attr("dx", function(d) {
                            return $(window).width() >= 786 ? "0" : -(spacing + 10);
                        })
                        .text(function(d) {
                            return d.label;
                        });

                    headerCtr.append("text")
                        .attr("y", spacing * 2)
                        .attr("x", labelx)
                        .style("text-anchor", "end")
                        .attr("class", "lbl-xs lower")
                        .text("National");

                    headerCtr.append("line")
                        .attr("x1", -30)
                        .attr("y1", spacing * 2 + 4)
                        .attr("x2", width)
                        .attr("y2", spacing * 2 + 4)
                        .style("stroke", "#e5e8ec")

                    header.append("text")
                        .attr("y", spacing * 2)
                        .style("text-anchor", "middle")
                        .style("fill", ColorService.national)
                        .attr("class", "lbl-xs lower natl-lbl")
                        .text(function(d) {
                            return d.percentage + "%";
                        });

                    headerCtr.append("text")
                        .attr("y", spacing * 3)
                        .attr("x", labelx)
                        .style("text-anchor", "end")
                        .attr("class", "lbl-xs lower")
                        .text("Company");

                    headerCtr.append("line")
                        .attr("x1", -30)
                        .attr("y1", spacing * 3 + 4)
                        .attr("x2", width)
                        .attr("y2", spacing * 3 + 4)
                        .style("stroke", "#e5e8ec")

                    header.append("text")
                        .attr("y", spacing * 3)
                        .style("text-anchor", "middle")
                        .style("fill", ColorService.company)
                        .attr("class", "lbl-xs lower")
                        .text(function(d) {
                            return getCoPercent(d, companyCt) + "%";
                        });

                    headerCtr.append("text")
                        .attr("y", spacing * 4)
                        .attr("x", labelx)
                        .style("text-anchor", "end")
                        .attr("class", "mess-row lbl-xs lower")
                        .text("Mess");

                    headerCtr.append("line")
                        .attr("class", "mess-row")
                        .attr("x1", -30)
                        .attr("y1", spacing * 4 + 4)
                        .attr("x2", width)
                        .attr("y2", spacing * 4 + 4)
                        .style("stroke", '#e5e8ec')

                    header.append("text")
                        .attr("y", spacing * 4)
                        .style("text-anchor", "middle")
                        .style("fill", ColorService.mess)
                        .attr("class", "lbl-xs lower mess-lbl mess-row");

                    d3.selectAll(".mess-row")
                        .attr("display", "none");

                    svgctr = svg.selectAll(".occupation")
                        .data(data).enter()
                        .append("g")
                        .attr("width", diameter)
                        .attr("height", diameter + 50)
                        .attr("class", "svg-ctr")
                        .attr("transform", function(d, i) {
                            return "translate(" + (20) + "," + ((diameter / 2) + spacing * 4) + ")";
                        })

                    var natlCtr = svgctr.append("g")
                        .attr("class", "national")
                        .attr("transform", function(d, i) {
                            return "translate(" + (diameter * i + (diameter / 2)) + "," + 20 + ")"
                        });

                    natlCtr.append("circle")
                        .attr("r", function(d) {
                            return (d.percentage * scaler);
                        })
                        .attr("class", "natl-circle")
                        .style("fill", "none")
                        .style("stroke", ColorService.national)
                        .style("stroke-width", "2px")

                    var coCtr = svgctr.append("g")
                        .attr("class", "company")
                        .attr("transform", function(d, i) {
                            return "translate(" + (diameter * i + (diameter / 2)) + "," + 20 + ")"
                        });

                    coCtr.append("circle")
                        .attr("r", function(d) {
                            return getCoPercent(d, companyCt) * scaler;
                        })
                        .attr("class", "co-circle")
                        .style("fill", "none")
                        .style("stroke", ColorService.company)
                        .style("stroke-width", "2px")

                    var circleTip = d3.tip()
                        .attr('class', 'd3-tip')
                        .html(function(d) {
                            return getCoPercent(d, companyCt) + "%";
                        });

                    var messCtr = svgctr.append("g")
                        .attr("class", "mess")
                        .attr("transform", function(d, i) {
                            return "translate(" + (diameter * i + (diameter / 2)) + "," + 20 + ")"
                        });

                    messCtr.call(circleTip);
                    messCtr.append("circle")
                        .attr("r", function(d) {
                            return 0;
                        })
                        .attr("class", "mess-circle")
                        .style("fill", ColorService.mess)
                        .style("fill-opacity", 0.3)
                        .style("stroke", ColorService.mess)
                        .style("stroke-width", "3px")
                        .on('mouseover', circleTip.show)
                        .on('mouseout', circleTip.hide);

                    if ($(window).width() >= 786) {
                        var barCtr = svgctr.append("g")
                            .attr("class", "occupation-summary")
                            .attr("transform", function(d, i) {
                                return "translate(" + diameter * i + "," + (diameter / 2 + 50) + ")"
                            });

                        x = d3.scale.linear()
                            .range([0, diameter / 2])
                            .domain([0, 30]); // this is the maximum value from observation

                        y = d3.scale.ordinal()
                            .rangeRoundBands([0, diameter], .1)
                            .domain([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10])

                        occupationBars = barCtr.selectAll(".bar")
                            .data(function(d) {
                                return d.children;
                            }).enter()
                            .append("g")
                            .attr("class", "bar");

                        occupationBars.append("rect")
                            .attr("class", "occ-bar")
                            .attr("fill", "steelblue")
                            .attr("x", diameter / 2)
                            .attr("width", function(d) {
                                return x(d.percentage);
                            })
                            .attr("y", function(d, i) {
                                return y(i);
                            })
                            .attr("height", function(d) {
                                return y.rangeBand();
                            })
                            .on('mouseover', tip.show)
                            .on('mouseout', tip.hide);

                        occupationBars.append("text")
                            .attr("x", diameter / 2 - 5)
                            .attr("y", function(d, i) {
                                return y(i);
                            })
                            .attr("dy", 14)
                            .style("text-anchor", "end")
                            .attr("class", "lbl-xs lower")
                            .text(function(d) {
                                return d.label;
                            })
                    }
                }
            }
        }
    }
]);