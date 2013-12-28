(function() {

  var margin = {
    top: 20,
    right: 20,
    bottom: 130,
    left: 40
  },
    width = 960 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

  var sets = {
    age: {x: 'name', y: 'age'},
    mess: {x: 'name', y: 'mess'},
    height: {x: 'name', y: 'heightin'}
  };

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
    render(data, 'age');

  });

  function render(data, attr) {
    var display = sets[attr];
    x.domain(data.map(function(d) {
      return d[display.x];
    }));
    var min = d3.min(data, function(d) {
      if(d[display.y])
        return d[display.y];
      else
        return undefined;
    });
    var max = d3.max(data, function(d) {
      return d[display.y];
    });

    y.domain([min-1, max]);

    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .selectAll("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0)
      .attr("dx", "-1.8em")
      .style("text-anchor", "end");

    svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text(attr);

    svg.selectAll(".bar")
      .data(data)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) {
        return x(d[display.x]);
      })
      .attr("width", x.rangeBand())
      .attr("y", function(d) {
        return y(d[display.y]);
      })
      .attr("height", function(d) {
        return height - y(d[display.y]);
      })
      .on('click', barClick);

    change(data, display, true);

    clickListeners(data, display);

  }

  function barClick(e) {
    console.log(e);
  }

  function clickListeners(data) {
    d3.select("#age").on("change", function(e) {
      clear();
      render(data, 'age');
    });
    d3.select("#mess").on("change", function() {
      clear();
      render(data, 'mess');
    });
    d3.select("#height").on("change", function() {
      clear();
      render(data, 'height');
    });
  }

  function change(data, display, inOrder) {

    // Copy-on-write since tweens are evaluated after a delay.
    var x0 = x.domain(data.sort(inOrder ? function(a, b) {
        return b[display.y] - a[display.y];
      } : function(a, b) {
        return d3.ascending(a[display.x], b[display.x]);
      })
      .map(function(d) {
        return d[display.x];
      }))
      .copy();

    var transition = svg.transition().duration(750),
      delay = function(d, i) {
        return i * 10;
      };

    transition.selectAll(".bar")
      .delay(delay)
      .attr("x", function(d) {
        return x0(d[display.x]);
      });

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
      var correctedIn = dateIn.getFullYear() - 100;
      var correctedOut = dateOut.getFullYear() - 100;
      var cDateIn = dateIn.setFullYear(correctedIn);
      var cDateOut = dateOut.setFullYear(correctedOut);
      d.datein = new Date(cDateIn).toDateString();
      d.dateout = new Date(cDateOut).toDateString();
      d.mess = +parseInt(d.mess);
      d.age = +parseInt(d.age);
      d.heightin = +parseInt(d.heightin);
    });
  }

  function clear() {
    d3.selectAll('.bar').remove();
    d3.selectAll('.x.axis').remove();
    d3.selectAll('.y.axis').remove();
  }
})();