angular.module('modelCompanyApp').
directive('circlePack', ['$window', 'ObjectService',
    function($window, ObjectService) {
        return {
            restrict: 'A',
            scope: {
                data: "=",
                attribute: "@",
                filter: "=",
                mess: "@",
            },
            link: function(scope, element, attrs) {
                scope.$watch('data', function(newVal) {
                    if (newVal)
                        render(newVal);
                });

                function render(data) {

                    data = ObjectService.makeOccupationTree(data, scope.attribute, scope.filter);


                    var diameter = 200,
                        format = d3.format(",d");

                    var svg = d3.select(element[0]).append("svg")
                        .attr("width", $(window).width())
                        .attr("height", diameter * 2)
                        .append("g")
                        .attr("transform", "translate(" + 20 + "," + 20 + ")");

                    var runner = 0;
                    _.each(data.children, function(category) {
                        console.log(category)
                        if (!category.percentage)
                            return;

                        var categoryDiameter = 120+category.percentage;

                        var pack = d3.layout.pack()
                            .size([categoryDiameter, categoryDiameter])
                            .padding(1.5)
                            .sort(d3.descending)
                            .value(function(d) {
                                return d.percentage;
                            });

                        var svgctr = svg.append("g")
                            .attr("width", categoryDiameter)
                            .attr("height",categoryDiameter)
                            .attr("transform", "translate(" + ((diameter/2) - (categoryDiameter/2)) + "," + ((diameter/2) - (categoryDiameter/2)) + ")");

                        var node = svgctr.datum(category).selectAll(".node")
                            .data(pack)
                            .enter().append("g")
                            .attr("class", function(d) {
                                return d.children ? "node" : "leaf node";
                            })
                            .attr("transform", function(d) {
                                return "translate(" + (runner + d.x) + "," + d.y + ")";
                            });

                        node.append("title")
                            .text(function(d) {
                                if (d.children)
                                    return "National: " + d.label + " " + d.percentage + "%";
                                else
                                    return d.label + " " + d.percentage + "%";
                            });

                        node.append("circle")
                            .attr("class", "occupation-circle")
                            .attr("r", function(d) {
                                if (d.parent && d.parent.children.length === 1)
                                    return d.r * 2;
                                else
                                    return d.r;
                            });

                        node.filter(function(d) {
                                return !d.children;
                            }).append("text")
                            .attr("dy", ".3em")
                            .style("text-anchor", "middle")
                            .text(function(d) {
                                return d.label.substring(0, d.r / 3);
                            });
                        runner += (diameter);
                    })

                }
            }
        }
    }
]);
