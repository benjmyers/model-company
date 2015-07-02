angular.module('modelCompanyApp').
directive('nationalBar', ['$window', 'ObjectService', 'ColorService',
    function($window, ObjectService, ColorService) {
        return {
            restrict: 'A',
            scope: {
                data: "=",
                attribute: "@",
                label: "@",
                sort: "@"
            },
            link: function(scope, element, attrs) {
                var svg;

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

                function render(data) {

                    data = _.sortBy(data, function(d) {
                        return scope.sort === "order" ? d[scope.sort] : d.label;
                    }).filter(function(d) { return d.value !== undefined;});

                    var margin, width, height, x, y;
                    if ($(window).width() < 786) {
                        margin = {
                            top: 55,
                            right: 10,
                            bottom: 2,
                            left: 50
                        }     
                    }
                    else {
                        margin = {
                            top: 2,
                            right: 10,
                            bottom: 2,
                            left: 70
                        }
                    }

                    var barHeight = 30;
                    var elemWidth = $('.container-fluid').width();
                    var elemHeight = barHeight + margin.top + 25;
                    width = elemWidth - margin.left - margin.right;
                    height = elemHeight - margin.top - margin.bottom;

                    var calcdWidth = 0;
                    _.each(data, function(d) {
                        calcdWidth += d.value;
                    })

                    var scaler = width / calcdWidth;
                    _.each(data, function(d) {
                        d.value = d.value * scaler;
                    })

                    svg = d3.select(element[0]).append("svg")
                        .attr("width", width + margin.left + margin.right)
                        .attr("height", height + margin.top + margin.bottom)
                        .append("g")
                        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
                    
                    var tip = d3.tip()
                        .attr('class', 'd3-tip')
                        .direction('s')
                        .offset([2, 0])
                        .html(function(d) { return d.percentage+"%"; });
                    svg.call(tip);

                    svg.append("text")
                        .attr("x", 0)
                        .attr("y", 0)
                        .attr("dy", function(d) {
                            return barHeight + 12;
                        })
                        .attr("dx", function(d) {
                            return $(window).width() < 786 ? -3 : -10
                        })
                        .attr("class", "lbl-xs")
                        .attr("text-anchor", "end")
                        .text(scope.label);

                    var runner = 0;
                    var item = svg.selectAll(".bar-item")
                        .data(data).enter().append("g")
                        .attr("transform", function(d) {
                            var value = angular.copy(runner);
                            runner += d.value;
                            return "translate(" + value + "," + 0 + ")";
                        })
                    item.append("rect")
                        .attr("class", "bar")
                        .attr("fill", function(d, i) {
                            return ColorService.getColor(scope.attribute, d.label);
                        })
                        .attr("x", 0)
                        .attr("width", function(d) {
                            return d.value;
                        })
                        .attr("y", 23)
                        .attr("height", barHeight)
                        .on('mouseover', tip.show)
                        .on('mouseout', tip.hide);

                    item.append("text")
                        .attr("x", function(d) {
                            return $(window).width() < 786 ? -20 : d.value / 2;
                        })
                        .attr("y", function(d) {
                            return $(window).width() < 786 ? (d.value/2 + 4) : 14;
                        })
                        .attr("class", "lbl-xs")
                        .attr("text-anchor", function() {
                            return $(window).width() < 786 ? "beginning" : "middle";
                        })
                        .attr("transform", function(d) {
                            return $(window).width() < 786 ? "rotate(-90)" : "rotate(0)";
                        })
                        .text(function(d) {
                            return d.label !== "NA" ? d.label : "";
                        });
                }
            }
        }
    }
])
