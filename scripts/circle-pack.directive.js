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
                    console.log(data)
                    var diameter = 400,
                        format = d3.format(",d");

                    var pack = d3.layout.pack()
                        .size([diameter - 4, diameter - 4])
                        .value(function(d) {
                            console.log(d)
                            return d.value;
                        });

                    var svg = d3.select(element[0]).append("svg")
                        .attr("width", diameter)
                        .attr("height", diameter)
                        .append("g")
                        .attr("transform", "translate(2,2)");

                    var node = svg.datum(data).selectAll(".node")
                        .data(pack.nodes)
                        .enter().append("g")
                        .attr("class", function(d) {
                            return d.children ? "node" : "leaf node";
                        })
                        .attr("transform", function(d) {
                            return "translate(" + d.x + "," + d.y + ")";
                        });

                    node.append("title")
                        .text(function(d) {
                            if (d.children) 
                                return "National: "+d.label+" "+d.percentage+"%";
                            else
                                return d.label+" "+d.percentage+"%";
                        });

                    node.append("circle")
                        .attr("r", function(d) {
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

                }
            }
        }
    }
]);
