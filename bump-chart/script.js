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
  //height is set by unique options in column name * a fixed height
  var height = (config.optional.seriesHeight[size] * graphic_data.length) + 20

  // clear out existing graphics
  graphic.selectAll("*").remove();

  series = graphic_data.map(d => d.name)
  columns = graphic_data.columns.slice(1)


  // pivot data wide to long
  dataPivoted = Array.from(pivot(graphic_data, graphic_data.columns.slice(1), "category", "value"))

  // get ranks for the data
  ranks = {};
  columns.forEach((item, i) => {
    ranks[item] = d3.rank(graphic_data, d => +d[item])
  });

  //pivot wide to tidy data and include ranks
  dataPivoted = dataPivoted.map((d, i) => ({
    ...d,
    rank: ranks[d.category][series.indexOf(d.name)],
  }))

  nested = d3.group(dataPivoted, d => d.name)

  //set up scales
  x = d3.scalePoint()
    .range([0, chart_width])
    .domain(graphic_data.columns.slice(1))
    .round(true);

  y = d3.scalePoint()
    .range([height, 0])
    .domain(d3.range(graphic_data.length - 1, -1, -1))
    .round(true);

  colour = d3.scaleOrdinal()
    .domain(series)

  if (config.essential.colour_palette.type == "custom") {
    colour.range(config.essential.colour_palette.palette)
  } else if (config.essential.colour_palette.type == "sequential") {
    colour.range(chroma.scale(chroma.brewer[config.essential.colour_palette.palette]).colors(series.length))
    colour.domain(d3.range(graphic_data.length - 1, -1, -1).reverse())
  } else if (config.essential.colour_palette.type == "qualitative") {
    colour.range(chroma.brewer[config.essential.colour_palette.palette])
  }

  // line generator
  line = d3.line()
    .x(d => x(d.category))
    .y(d => y(d.rank))

  //set up xAxis generator
  const xAxis = d3.axisTop(x)
    .tickPadding(23)
    .tickSize(0);


  //create svg for chart
  svg = d3.select('#graphic').append('svg')
    .attr("width", chart_width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("class", "chart")
    .style("background-color", "#fff")
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + (margin.top) + ")")

  svg
    .append('g')
    .attr('class', 'x axis categorical')
    .call(xAxis)
    .selectAll('text')

  series = svg.selectAll('g.series')
    .data(Array.from(nested))
    .join('g')
    .attr('class', 'series')

  series.append('path')
    .attr('class', 'between')
    .attr('d', d => line(d[1]))
    .attr('stroke', d => config.essential.colour_palette.type == "sequential" ? colour(d[1][d[1].length - 1].rank) : colour(d[0]))


  // add in the circles
  series.selectAll('circle.ranks')
    .data(d => d[1])
    .join('circle')
    .attr('r', 13)
    .attr('fill', d => config.essential.colour_palette.type == "sequential" ? colour(d.rank) : colour(d.name))
    .attr('cy', function(d) {
      return y(d.rank)
    })
    .attr('cx', function(d) {
      return x(d.category)
    })


  // add in the rank numbers in the circle
  series.selectAll('text.rankNum')
    .data(d => d[1])
    .join('text')
    .attr('class', 'rankNum')
    .text(d => +d.rank + 1)
    .attr('y', d => y(d.rank))
    .attr('x', d => x(d.category))
    .attr('text-anchor', "middle")
    .attr('dy', 5)
    .attr('fill', (d) => chroma.contrast(config.essential.colour_palette.type == "sequential" ? colour(d.rank) : colour(d.name), "#fff") < 4.5 ? "#414042" : "#fff")

  // // Add in the line labels
  series.selectAll('text.categoryLabel')
    .data(d => d[1].filter(d => d.category == columns[columns.length - 1]))
    .join('text')
    .attr('class', 'categoryLabel')
    .attr('x', x(columns[columns.length - 1]))
    .attr('y', (d) => y(d.rank))
    .text((d) => d.name)
    .call(wrap, margin.right - 10)


  // create new array from labels and select particular attributes
  labels = Array.from(d3.selectAll('.categoryLabel')._groups[0]).map(function(d) {
    bbox = d.getBBox()
    return {
      targetY: +d3.select(d).attr('y'),
      label: d.__data__.name,
      height: bbox.height
    }
  })

  // Use James T's code to get new positions
  newPositions = positionLabels(labels, y.range().reverse, d => d.targetY, d => d.height);

  // remove existing labels
  d3.selectAll('text.categoryLabel').remove()

  // add labels into their new positions
  series.selectAll('text.categoryLabel')
    .data(newPositions)
    .join('text')
    .attr('class', 'categoryLabel')
    .attr('y', (d) => Math.round(d.y))
    .attr('x', x(columns[columns.length - 1]))
    .attr('dx', "19px")
    .attr('dy', "6px")
    .text((d) => d.datum.label)
    .call(wrap, margin.right - 10)


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
        tspan = text.append("tspan").attr('x', x).attr('dx', dx).attr("dy", lineHeight + "em").text(word);
      }
    }
    var breaks = text.selectAll("tspan").size();
    text.attr("y", function() {
      return +y + -6 * (breaks - 1);
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
