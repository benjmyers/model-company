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

                var pack, svgctr, node;

                scope.$watch('data', function(newVal) {
                    if (newVal)
                        render(newVal);
                });

                scope.$watch('filter', function(newVal) {
                    if (svgctr && newVal)
                        update(newVal)
                }, true)

                function update(filter) {
                    var data;
                    data = ObjectService.makeOccupationTree(scope.data, scope.attribute, filter);
                    console.log(data)
                    _.each(data, function(category) {
                        console.log(category)
                    })

                    var ctr = svgctr.selectAll("g")
                        .data(pack.nodes({
                            'children': data
                        }).filter(function(d) {
                            return !d.children;
                        }))
                        // .attr("transform", function(d) {
                        //     return "translate(" + (d.x) + "," + d.y + ")";
                        // })

                    ctr.select("circle")
                        .attr("r", function(d) {
                            return d.r;
                        });

                    ctr.select("title")
                        .text(function(d) {
                            if (d.children)
                                return "National: " + d.label + " " + d.percentage + "%";
                            else
                                return d.label + " " + d.percentage + "%";
                        });

                    ctr.select("text")
                        .text(function(d) {
                            return d.label.substring(0, d.r / 3);
                        });

                    var exit = ctr.exit();
                    exit.transition().duration(250)
                        .attr("r", 0);
                    exit.remove();


                }

                function render(data) {
                    var companyCt = data.length;

                    if (scope.format !== "false")
                        data = ObjectService.makeOccupationTree(scope.data, scope.attribute, scope.filter);

                    var diameter = $(window).width() - 20,
                        scaler = 5,
                        padding = 5,
                        format = d3.format(",d"),
                        color = d3.scale.category20();

                    var svg = d3.select(element[0]).append("svg")
                        .attr("width", diameter)
                        .attr("height", diameter)
                        .style("text-align", "left")
                        .append("g")
                        .attr("transform", "translate(" + 20 + "," + 20 + ")");

                    var runner = 0;
                    _.each(data.children, function(category) {

                        var categoryDiameter = 200//category.percentage * scaler;

                        pack = d3.layout.pack()
                            .size([categoryDiameter, categoryDiameter])
                            .padding(1.5)
                            .sort(d3.descending)
                            .value(function(d) {
                                return d.percentage * scaler;
                            });



                        svgctr = svg.append("g")
                            .attr("width", categoryDiameter)
                            .attr("height", categoryDiameter)   
                            .attr("transform", "translate(" + (runner) + "," + (categoryDiameter/2) + ")");

                        var natlctr = svgctr.selectAll(".natl-node")
                            .data([category])
                            .enter()
                            .append("g")
                            .attr("transform", "translate(" + categoryDiameter/2 + "," + 20 + ")");

                        natlctr.append("circle")
                            .attr("r", (category.percentage * scaler)/2)
                            .style("fill", 'none')
                            .style("stroke", 'steelblue')
                            .style("stroke-width", "4px")

                        natlctr.append("text")
                            .attr("dy", - ((category.percentage * scaler)/2) - 5)
                            .style("text-anchor", "middle")
                            .text(function(d) {
                                return d.label + " " + d.percentage + "%";
                            });

                        var companyPercent = d3.sum(_.pluck(category.children, 'percentage')) / companyCt;


                        // node = svgctr.selectAll(".node")
                        //     .data(pack.nodes({
                        //         'children': category.children
                        //     }).filter(function(d) {
                        //         return !d.children;
                        //     }))

                        // node.enter().append("g")
                        //     .attr("class", function(d) {
                        //         return d.children ? "node" : "leaf node";
                        //     })
                        //     .attr("transform", function(d) {
                        //         return "translate(" + (d.x) + "," + (d.y) + ")";
                        //     });

                        // node.append("title")
                        //     .text(function(d) {
                        //             return d.label + " " + d.percentage + "%";
                        //     });

                        // node.append("circle")
                        //     .attr("class", "occupation-circle")
                        //     .style("fill", function(d) {
                        //         if (scope.format !== "false") {
                        //             return ColorService.getColor('occupation', ObjectService.occupationCategories[d.label]);
                        //         } else {
                        //             return ColorService.getColor('occupation', d.label);
                        //         }
                        //     })
                        //     .attr("r", function(d) {
                        //         return d.r;
                        //     });

                        // node.append("text")
                        //     .attr("dy", ".3em")
                        //     .style("text-anchor", "middle")
                        //     .text(function(d) {
                        //         return d.label.substring(0, d.r / 3);
                        //     });

                        runner += categoryDiameter + padding;

                    })
                }
            }
        }
    }
]);
