angular.module('modelCompanyApp').
directive('timeseries', ['$window',
    function($window) {
        return {
            restrict: 'A',
            scope: {
                data: "=",
                attribute: "@",
                format: "@"
            },
            link: function(scope, element, attrs) {
                scope.$watch('data', function(newVal) {
                    if (newVal)
                        render(newVal);
                });

                function render(data) {

                    var margin = {
                            top: 10,
                            right: 10,
                            bottom: 100,
                            left: 40
                        },
                        width = 960 - margin.left - margin.right,
                        height = 500 - margin.top - margin.bottom;
                    var parseDate = d3.time.format("%b %Y").parse;

                    var x = d3.time.scale().range([0, width]),
                        y = d3.scale.linear().range([height, 0]);

                    var xAxis = d3.svg.axis().scale(x).orient("bottom")
                        //.ticks(10)
                        .tickSize(-height, 0)
                        .tickFormat(d3.time.format("%m/%d/%y"));

                    var yAxis = d3.svg.axis().scale(y).orient("left")
                        //xAxis.ticks(5)
                        .tickSize(-width + margin.right, margin.left)
                        .tickFormat(d3.time.format("%H:%M"));

                    // x.domain(d3.extent([padded.minDate, padded.maxDate]));
                    // y.domain(d3.extent([stop, start]));
                    x.domain(d3.extent(data.map(function(d) {
                        console.log(new Date(d.dateout))
                        return d.dateout;
                    })));
                    y.domain([0, d3.max(data.map(function(d) {
                        return 1;
                    }))]);

                    var svg = d3.select("body").append("svg")
                        .attr("width", width + margin.left + margin.right)
                        .attr("height", height + margin.top + margin.bottom);

                    var context = svg.append("g")
                        .attr("class", "context")
                        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                    context.append("g")
                        .attr("class", "x axis")
                        .attr("transform", "translate(5," + (height - margin.bottom) + ")")
                        .call(xAxis);

                    context.append("g")
                        .attr("class", "y axis")
                        .attr("transform", "translate(40," + 0 + ")")
                        .call(yAxis);

                    context.selectAll(".circ")
                        .data(data)
                        .enter().append("circle")
                        .attr("class", "circ")
                        .attr("cx", function(d) {
                            console.log(d.dateout)
                            return x(d.dateout);
                        })
                        .attr("cy", function(d, i) {
                            return y(.5);
                        })
                        .on('click', function(d) {
                            //console.log(new Date(d.value))
                        })
                        .attr("r", 7);
                }
            }
        }
    }
]);
