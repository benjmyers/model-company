var margin = {top: 20, right: 20, bottom: 130, left: 40},
    width = 960 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

var formatPercent = d3.format("d");

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1, 0);

var y = d3.scale.linear()
    .rangeRound([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .ticks(5)
    .orient("left");

var svg = d3.select(".container").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("data/formatted-messes.csv", function(error, data) {

  parseData(data);

  x.domain(data.map(function(d) { return d.Name; }));
  y.domain([0, d3.max(data, function(d) { return d.age; })]);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .selectAll("text")
      .style("text-anchor", "end")
          .attr("dx", "-1.8em")
          .attr("dy", ".15em")
          .attr("transform", function(d) {
              return "rotate(-90)" 
          });

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Age");

  svg.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.Name); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.age); })
      .attr("height", function(d) { return height - y(d.age); });

   d3.select("input").on("change", change);

  var sortTimeout = setTimeout(function() {
    d3.select("input").property("checked", true).each(change);
  }, 2000);

  function change() {
    clearTimeout(sortTimeout);

    // Copy-on-write since tweens are evaluated after a delay.
    var x0 = x.domain(data.sort(this.checked
        ? function(a, b) { return b.age - a.age; }
        : function(a, b) { return d3.ascending(a.Name, b.Name); })
        .map(function(d) { return d.Name; }))
        .copy();

    var transition = svg.transition().duration(750),
        delay = function(d, i) { return i * 50; };

    transition.selectAll(".bar")
        .delay(delay)
        .attr("x", function(d) { return x0(d.Name); });

    transition.select(".x.axis")
        .call(xAxis)
      .selectAll("g")
        .delay(delay);
  }

  function parseData(data) {
    _.each(data, function(d) {
      // Dates are 100 years off, correct
      var dateIn = new Date(d.datein);
      var dateOut = new Date(d.dateout);
      var correctedIn = dateIn.getFullYear()-100;
      var correctedOut = dateOut.getFullYear()-100;
      var cDateIn = dateIn.setFullYear(correctedIn);
      var cDateOut = dateOut.setFullYear(correctedOut);
      d.datein = new Date(cDateIn).toDateString();
      d.dateout = new Date(cDateOut).toDateString();
      d.mess = +parseInt(d.mess);
      d.age = +parseInt(d.age);
      d.heightin = +parseInt(d.heightin);
    });
  }
});