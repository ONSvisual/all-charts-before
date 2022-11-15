var graphic = d3.select('#graphic');
var pymChild = null;

function drawGraphic() {

  //population accessible summmary
  d3.select('#accessibleSummary').html(config.essential.accessibleSummary)

  var threshold_md = config.optional.mediumBreakpoint;
  var threshold_sm = config.optional.mobileBreakpoint;

  //set variables for chart dimensions dependent on width of #graphic
  if (parseInt(graphic.style("width")) < threshold_sm) {
    size = "sm"
  } else if (parseInt(graphic.style("width")) < threshold_md) {
    size = "md"
  } else {
    size = "lg"
  }

  var margin = config.optional.margin[size]
  var chart_width = parseInt(graphic.style("width")) - margin.left - margin.right;
  //height is set by an aspect ratio in the config
  var height = config.optional.aspectRatio[size][0] * chart_width / config.optional.aspectRatio[size][1]

  // clear out existing graphics
  graphic.selectAll("*").remove();

  // pivot data wide to long
  dataPivoted = Array.from(pivot(graphic_data, graphic_data.columns.slice(1), "category", "value"))


  //set up scales
  x = d3.scalePoint()
    .range([0, chart_width])
    .domain(graphic_data.columns.slice(1));

  y = d3.scaleLinear()
    .range([height, 0]);

  //set up yAxis generator
  var yAxis = d3.axisLeft(y)
    .tickSize(-chart_width)
    .tickPadding(10)
    .ticks(config.optional.yAxisTicks[size]);

  //set up xAxis generator
  var xAxis = d3.axisTop(x)
    .tickPadding(15)
    .tickSize(-height);


  //create svg for chart
  svg = d3.select('#graphic').append('svg')
    .attr("width", chart_width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("class", "chart")
    .style("background-color", "#fff")
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + (margin.top) + ")")


  if (config.essential.yDomain == "auto") {
    y.domain(d3.extent(dataPivoted, d => +d.value))
  } else {
    y.domain(config.essential.yDomain)
  }

  svg
    .append('g')
    .attr('transform', 'translate(0,' + 0 + ')')
    .attr('class', 'y axis numeric')
    .call(yAxis).selectAll('line').each(function(d) {
      if (d == 0) {
        d3.select(this)
          .attr('class', 'zero-line')
      };
    })

  svg
    .append('g')
    .attr('class', 'x axis categorical')
    .call(xAxis)
    .selectAll('text') //.call(wrap, margin.left - 5);

  svg.selectAll('line.between')
    .data(graphic_data)
    .join('line')
    .attr('class', 'between')
    .attr('x1', x("min"))
    .attr('y1', (d) => y(d.min))
    .attr('x2', x("max"))
    .attr('y2', (d) => y(d.max))
    .attr('stroke', function(d) {
      if (+d.max > +d.min) {
        return config.essential.colour_palette[0];
      } else if (+d.max < +d.min) {
        return config.essential.colour_palette[1];
      } else {
        return config.essential.colour_palette[2];
      }
    });

  svg.selectAll('circle')
    .data(dataPivoted)
    .join('circle')
    .attr('r', 6)
    .attr('fill', function(d) {
      if (+d.max > +d.min) {
        return config.essential.colour_palette[0];
      } else if (+d.max < +d.min) {
        return config.essential.colour_palette[1];
      } else {
        return config.essential.colour_palette[2];
      }
    })
    .attr('cy', function(d) {
      return y(d.value)
    })
    .attr('cx', function(d) {
      return x(d.category)
    })

    // Add in the labels
  svg.selectAll('text.categoryLabel')
    .data(graphic_data)
    .join('text')
    .attr('class', 'categoryLabel')
    .attr('x', x("max"))
    .attr('y', (d) => y(d.max))
    .attr('dx',"6px")
    .text((d) => d.name)
    .call(wrap,margin.right-10)

// create new array from labels and select particular attributes
  labels = Array.from(d3.selectAll('.categoryLabel')._groups[0]).map(function(d){
    bbox = d.getBBox()
    return {targetY:+d3.select(d).attr('y'),label:d.__data__.name,height:bbox.height}
  })

  // Use James T's code to get new positions
  newPositions = positionLabels(labels, y.range().reverse, d => d.targetY, d => d.height);

  // remove existing labels
  d3.selectAll('text.categoryLabel').remove()

  // add labels into their new positions
  svg.selectAll('text.categoryLabel')
    .data(newPositions)
    .join('text')
    .attr('class', 'categoryLabel')
    .attr('y',(d)=>d.y)
    .attr('x', x("max"))
    .attr('dx',"16px")
    .attr('dy',"0.4em")
    .text((d) => d.datum.label)
    .call(wrap,margin.right-10)

  //create link to source
  d3.select("#source")
    .text("Source – " + config.essential.sourceText)

  //use pym to calculate chart dimensions
  if (pymChild) {
    pymChild.sendHeight();
  }
}

// This is from bostock's notebook https://observablehq.com/d/ac2a320cf2b0adc4
// which is turn comes from this thread on wide to long data https://github.com/d3/d3-array/issues/142
function* pivot(data, columns, name, value, opts) {
  const keepCols = columns ?
    data.columns.filter(c => !columns.includes(c)) :
    data.columns;
  for (const col of columns) {
    for (const d of data) {
      const row = {};
      keepCols.forEach(c => {
        row[c] = d[c];
      });
      // TODO, add an option to ignore if fails a truth test to approximate `values_drop_na`
      row[name] = col;
      row[value] = d[col];
      yield row;
    }
  }
}

function wrap(text, width) {
  text.each(function() {
    var text = d3.select(this),
      words = text.text().split(/\s+/).reverse(),
      word,
      line = [],
      lineNumber = 0,
      lineHeight = 1.1, // ems
      y = text.attr("y"),
      x = text.attr("x"),
      dx = text.attr('dx'),
      tspan = text.text(null).append("tspan").attr('x', x);
    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan").attr('x', x).attr('dx',dx).attr("dy", lineHeight + "em").text(word);
      }
    }
    var breaks = text.selectAll("tspan").size();
    text.attr("y", function() {
      return +y+-6 * (breaks - 1);
    });
  });

}

d3.csv(config.essential.graphic_data_url)
  .then(data => {
    //load chart data
    graphic_data = data

    //use pym to create iframed chart dependent on specified variables
    pymChild = new pym.Child({
      renderCallback: drawGraphic
    });
  });
