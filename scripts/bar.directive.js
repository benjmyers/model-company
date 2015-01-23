angular.module('modelCompanyApp').
directive('bar', ['$window',
    function($window) {
        return {
            restrict: 'A',
            scope: {
                data: "=",
                attribute: "@",
                average: "="
            },
            link: function(scope, element, attrs) {
                scope.$watch('data', function(newVal) {
                    if (newVal)
                        render(newVal);
                });

                function render(data) {
                    if (scope.attribute === "heightft") {
                        data.sort(function(a, b) {
                            if (parseInt(a.heightin) > parseInt(b.heightin))
                                return 1;
                            else if (parseInt(a.heightin) < parseInt(b.heightin))
                                return -1;
                            else
                                return 0;
                        })
                    }
                    var attrs = _.pluck(data, scope.attribute);
                    var obj = {};
                    _.each(attrs, function(a) {
                        a = a.trim();
                        (obj[a] === undefined) ? obj[a] = 1: obj[a] ++;
                    });
                    var set = [];
                    _.each(obj, function(o, key) {
                        set.push({
                            'label': key,
                            'value': parseInt(o)
                        })
                    })
                    var item = {
                        'key': scope.attribute,
                        'values': set
                    };

                    var margin = {
                            top: 20,
                            right: 20,
                            bottom: 30,
                            left: 40
                        },
                        width = 800 - margin.left - margin.right,
                        height = 250 - margin.top - margin.bottom;

                    var x = d3.scale.ordinal()
                        .rangeRoundBands([0, width], .1);

                    var y = d3.scale.linear()
                        .range([height, 0]);

                    var xAxis = d3.svg.axis()
                        .scale(x)
                        .orient("bottom");

                    var yAxis = d3.svg.axis()
                        .scale(y)
                        .orient("left")
                        .ticks(5)
                        .tickFormat(d3.format("d"));

                    var svg = d3.select("." + scope.attribute).append("svg")
                        .attr("width", width + margin.left + margin.right)
                        .attr("height", height + margin.top + margin.bottom)
                        .append("g")
                        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                    x.domain(set.map(function(d) {
                        return d.label;
                    }));
                    y.domain([0, d3.max(set.map(function(d) {
                        return d.value;
                    }))]);

                    svg.append("g")
                        .attr("class", "x axis")
                        .attr("transform", "translate(0," + height + ")")
                        .call(xAxis);

                    svg.append("g")
                        .attr("class", "y axis")
                        .call(yAxis)
                        .append("text")
                        .attr("transform", "rotate(-90)")
                        .attr("y", 6)
                        .attr("dy", ".71em")
                        .style("text-anchor", "end")
                        .text(scope.attribute.toUpperCase());

                    svg.selectAll(".bar")
                        .data(set)
                        .enter().append("rect")
                        .attr("class", "bar")
                        .attr("fill", '#4393c3')
                        .attr("x", function(d) {
                            return x(d.label);
                        })
                        .attr("width", x.rangeBand())
                        .attr("y", function(d) {
                            return y(d.value);
                        })
                        .attr("height", function(d) {
                            return height - y(d.value);
                        });

                    if (scope.average) {
                        svg.selectAll(".average")
                            .data([scope.average])
                            .enter().append("rect")
                            .attr("class", "average")
                            .attr("fill", '#d6604d')
                            .attr("x", function(d) {
                                return x(d) + x.rangeBand() / 2;
                            })
                            .attr("width", 2)
                            .attr("y", function(d) {
                                return 0;
                            })
                            .attr("height", function(d) {
                                return height;
                            });
                        // company average is complicated by height...
                    }
                }
            }
        }
    }
])
