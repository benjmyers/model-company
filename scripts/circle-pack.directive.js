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
                        scaler = 5,
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

                    var runner = 0;
                    _.each(data.children, function(category) {

                        var companyPercent = Math.ceil((d3.sum(_.pluck(category.children, 'percentage')) / companyCt) * 100);

                        var categoryDiameter = Math.max(category.percentage * scaler, companyPercent * scaler);

                        svg.selectAll('.svg-ctr') 
                            .transition().duration(100)
                            .attr("width", categoryDiameter)
                            .attr("height", categoryDiameter)
                            .attr("transform", "translate(" + (runner) + "," + (height / 2) + ")");

                        var circleCtr = svg.selectAll(".natl-node")
                            .transition().duration(100)
                            .attr("transform", "translate(" + categoryDiameter / 2 + "," + 20 + ")");

                        circleCtr.select(".natl-circle")
                        .transition().duration(100)
                            .attr("r", (category.percentage * scaler) / 2)

                        circleCtr.select(".co-circle")
                        .transition().duration(100)
                            .attr("r", (companyPercent * scaler) / 2)

                        circleCtr.select(".natl-text")
                            .attr("y", -height / 3)
                            .text(function(d) {
                                return d.label;
                            });

                        circleCtr.select(".co-text")
                            .attr("dy", -((companyPercent * scaler) / 2) - 5)
                            .text(function(d) {
                                return companyPercent + "%";
                            });

                        runner += categoryDiameter + padding;

                    })



                    var exit = circleCtr.exit();
                    exit.transition().duration(250)
                        .attr("r", 0);
                    exit.remove();


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

                    var runner = 0;
                    _.each(data.children, function(category) {

                        var companyPercent = Math.ceil((d3.sum(_.pluck(category.children, 'percentage')) / companyCt) * 100);

                        var categoryDiameter = Math.max(category.percentage * scaler, companyPercent * scaler);

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
                            .attr("class", "svg-ctr")
                            .attr("transform", "translate(" + (runner) + "," + (height / 2) + ")");

                        var circleCtr = svgctr.selectAll(".natl-node")
                            .data([category])
                            .enter()
                            .append("g")
                            .attr("transform", "translate(" + categoryDiameter / 2 + "," + 20 + ")");

                        circleCtr.append("circle")
                            .attr("r", (category.percentage * scaler) / 2)
                            .attr("class", "natl-circle")
                            .style("fill", 'none')
                            .style("stroke", 'steelblue')
                            .style("stroke-width", "6px")

                        circleCtr.append("circle")
                            .attr("r", (companyPercent * scaler) / 2)
                            .attr("class", "co-circle")
                            .style("fill", 'none')
                            .style("stroke", 'red')
                            .style("stroke-width", "6px")

                        circleCtr.append("text")
                            .attr("dy", -((category.percentage * scaler) / 2) - 5)
                            .style("text-anchor", "middle")
                            .text(function(d) {
                                return d.percentage + "%";
                            });

                        circleCtr.append("text")
                            .attr("y", -height / 3)
                            .style("text-anchor", "middle")
                            .attr("class", "natl-text")
                            .text(function(d) {
                                return d.label;
                            });

                        circleCtr.append("text")
                            .attr("dy", -((companyPercent * scaler) / 2) - 5)
                            .style("text-anchor", "middle")
                            .attr("class", "co-text")
                            .text(function(d) {
                                return companyPercent + "%";
                            });

                        runner += categoryDiameter + padding;

                    })
                }
            }
        }
    }
]);
