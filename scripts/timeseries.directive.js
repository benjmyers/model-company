angular.module('modelCompanyApp').
directive('timeseries', ['$window', 'ObjectService',
    function($window, ObjectService) {
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
                var circleSize = 12;

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

                    // DATA JOIN
                    var circ = context.selectAll(".circ")
                        .data(data);

                    // UPDATE
                    circ.transition().duration(500)
                        .attr("r", function(d) {
                            return Math.min(50, Math.max(10, 20 * Math.log(d.value)));
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

                    var margin = {
                            top: 25,
                            right: 50,
                            bottom: 50,
                            left: 25
                        },
                        width = 1200 - margin.left - margin.right,
                        height = 200 - margin.top - margin.bottom;
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

                    context = svg.append("g")
                        .attr("class", "context")
                        .attr("transform", "translate(" + (margin.left + 50) + "," + (height / 2) + ")");

                    var ev = context.selectAll(".event")
                        .data(scope.events)
                        .enter().append("g")
                        .attr("transform", function(d) {
                            return d.date ? "translate(" + x(getDate(d.date)) + "," + margin.top + ")" : "translate(" + x(getDate(d.daterange[0])) + "," + margin.top + ")"
                        })

                    ev.append("rect")
                        .attr("class", "timeline-event")
                        .attr("y", -(height / 2) + margin.top)
                        .attr("height", height - 50)
                        .attr("width", "1px");

                    context.selectAll(".circ")
                        .data(data)
                        .enter().append("circle")
                        .attr("class", "circ")
                        .attr("cx", function(d) {
                            return x(getDate(d.label));
                        })
                        .attr("cy", function(d, i) {
                            return circleSize * 2;
                        })
                        .on('click', function(d) {
                            console.log(d)
                        })
                        .attr("r", function(d) {
                            return Math.min(50, Math.max(10, 20 * Math.log(d.value)));
                        })
                        .append("svg:title").text(function(d) {
                            return d.value;
                        })

                    var textGr = ev.append("g")
                        .attr("transform", function(d, i) {
                            var dy = (i % 2) ? height / 2 : -height / 2;
                            return "translate(0," + dy + ")";
                        })

                    textGr.append("text")
                        .attr("font-size", 10)
                        .style("font-weight", 700)
                        .style("text-anchor", "middle")
                        .text(function(d) {
                            return d.name;
                        })

                    textGr.append("text")
                        .attr("font-size", 10)
                        .attr("dy", 12)
                        .style("text-anchor", "middle")
                        .text(function(d) {
                            var date = (d.date) ? d.date : d.daterange[0];
                            return date;
                        })

                }

                function getDate(date) {
                    return moment(date.trim(), "MM/DD/YYYY").valueOf();
                }
            }
        }
    }
]);
