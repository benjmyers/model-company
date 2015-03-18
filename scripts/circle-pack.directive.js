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
                var pack, svg, node, x, y, occupationBars;

                var width = $('.ctr').width() - 20,
                    height = 700,
                    diameter = 200,
                    scaler = 2.5,
                    padding = 25,
                    format = d3.format(",d"),
                    color = d3.scale.category20();

                scope.$watch('data', function(newVal) {
                    if (newVal)
                        render(newVal);
                });

                scope.$watch('filter', function(newVal) {
                    if (svg && newVal)
                        update(newVal)
                }, true)

                function update(filter) {
                    var companyCt = scope.data.length;

                    if (scope.format !== "false")
                        data = ObjectService.makeOccupationTree(scope.data, scope.attribute, scope.filter);

                    // BIND
                    svgctr.data(data);

                    // UPDATE
                    svgctr.select('.co-circle')
                        .transition().duration(200)
                        .attr("r", function(d) {
                            return getCoPercent(d, companyCt) * scaler;
                        });

                    svgctr.select('.co-text')
                        .text(function(d) {
                            return getCoPercent(d, companyCt) + "%";
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

                    svg = d3.select(element[0]).append("svg")
                        .attr("width", width)
                        .attr("height", height)
                        .style("text-align", "left")
                        .append("g")
                        .attr("transform", "translate(" + 20 + "," + 20 + ")");

                    var tip = d3.tip()
                        .attr('class', 'd3-tip')
                        .html(function(d) { return d.percentage+"%"; });
                    svg.call(tip);

                    svgctr = svg.selectAll(".occupation")
                        .data(data).enter()
                        .append("g")
                        .attr("width", diameter)
                        .attr("height", diameter + 50)
                        .attr("class", "svg-ctr")
                        .attr("transform", "translate(" + (diameter / 2) + "," + ((diameter / 2) + 50) + ")");

                    var natlOffset =  -diameter / 2 - 40;
                    var companyOffset = -diameter / 2 - 20;

                    svgctr.append("text")
                        .attr("y", -diameter/2 - 60)
                        .attr("x", function(d, i) {
                            return (diameter * i + (diameter / 2));
                        })
                        .style("text-anchor", "middle")
                        .style("font-weight", 700)
                        .attr("class", "category-text")
                        .text(function(d) {
                            return d.label;
                        });

                    svgctr.append("text")
                        .attr("y", natlOffset)
                        .attr("x", 25)
                        .style("text-anchor", "end")
                        .text("National");

                    svgctr.append("line")
                        .attr("x1", -30)
                        .attr("y1", natlOffset + 4)
                        .attr("x2", width - 200)
                        .attr("y2", natlOffset + 4)
                        .style("stroke", "#e5e8ec")

                    svgctr.append("text")
                        .attr("y", companyOffset)
                        .attr("x", 25)
                        .style("text-anchor", "end")
                        .text("Company");

                    svgctr.append("line")
                        .attr("x1", -30)
                        .attr("y1", companyOffset + 4)
                        .attr("x2", width - 200)
                        .attr("y2", companyOffset + 4)
                        .style("stroke", "#e5e8ec")

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
                        .style("fill", 'none')
                        .style("stroke", ColorService.national)
                        .style("stroke-width", "6px")

                    natlCtr.append("text")
                        .attr("y", function(d) {
                            return natlOffset - 20;
                        })
                        .style("text-anchor", "middle")
                        .style("fill", ColorService.national)
                        .attr("class", "natl-text")
                        .text(function(d) {
                            return d.percentage + "%";
                        });

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
                        .style("fill", 'none')
                        .style("stroke", ColorService.company)
                        .style("stroke-width", "6px")

                    coCtr.append("text")
                        .attr("y", function(d) {
                            return companyOffset - 20;
                        })
                        .style("text-anchor", "middle")
                        .style("fill", ColorService.company)
                        .attr("class", "co-text")
                        .text(function(d) {
                            return getCoPercent(d, companyCt) + "%";
                        });

                    var barCtr = svgctr.append("g")
                        .attr("class", "occupation-summary")
                        .attr("transform", function(d, i) {
                            return "translate(" + diameter*i + "," + diameter + ")"
                        });

                    x = d3.scale.linear()
                            .range([0, diameter/2])
                            .domain([0, 20])

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
                        .attr("x", diameter/2)
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
                        .attr("x", diameter/2 - 5)
                        .attr("y", function(d, i) {
                            return y(i);
                        })
                        .attr("dy", 14)
                        .style("text-anchor", "end")
                        .text(function(d) {
                            return d.label;
                        })
                }
            }
        }
    }
]);
