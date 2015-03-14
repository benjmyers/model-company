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

                var pack, svg, node;
                var width = $(window).width() - 20,
                    height = 500,
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

                    svgctr = svg.selectAll(".occupation")
                        .data(data).enter()
                        .append("g")
                        .attr("width", diameter)
                        .attr("height", diameter)
                        .attr("class", "svg-ctr")
                        .attr("transform", "translate(" + (diameter / 2) + "," + (height / 2) + ")");

                    svgctr.append("text")
                        .attr("y", -height / 3)
                        .attr("x", function(d, i) {
                            return (diameter * i + (diameter / 2));
                        })
                        .style("text-anchor", "middle")
                        .attr("class", "category-text")
                        .text(function(d) {
                            return d.label;
                        });

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
                        .on("click", function(d) {
                            console.log(d.percentage)
                        })
                        .style("fill", 'none')
                        .style("stroke", '#d6604d')
                        .style("stroke-width", "6px")

                    natlCtr.append("text")
                        .attr("y", function(d) {
                            return - (height / 3) + 20;
                        })
                        .style("text-anchor", "middle")
                        .style("fill", "#d6604d")
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
                        .on("click", function(d) {
                            console.log(getCoPercent(d, companyCt))
                        })
                        .attr("class", "co-circle")
                        .style("fill", 'none')
                        .style("stroke", '#4393c3')
                        .style("stroke-width", "6px")

                    coCtr.append("text")
                        .attr("y", function(d) {
                            return - (height / 3) + 35;
                        })
                        .style("text-anchor", "middle")
                        .style("fill", "#4393c3")
                        .attr("class", "co-text")
                        .text(function(d) {
                            return getCoPercent(d, companyCt) + "%";
                        });
                }
            }
        }
    }
]);
