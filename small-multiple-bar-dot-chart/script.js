var graphic = d3.select('#graphic');
var pymChild = null;

function drawGraphic() {

  // clear out existing graphics
  graphic.selectAll("*").remove();


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
  var chart_width = (parseInt(graphic.style("width")) - config.optional.margin.group_margin.left) / config.optional.chart_every[size] - margin.left - margin.right;
  const chart_every = config.optional.chart_every[size]
  const group_margin = config.optional.margin.group_margin

  // Set up the legend
  var legenditem = d3.select('#legend')
    .selectAll('div.legend--item')
    .data(d3.zip(config.essential.legendLabels, config.essential.colour_palette))
    .enter()
    .append('div')
    .attr('class', 'legend--item')

  legenditem.append('div').attr('class', 'legend--icon')
    .style('background-color', function(d) {
      return d[1]
    })

  legenditem.append('div')
    .append('p').attr('class', 'legend--text').html(function(d) {
      return d[0]
    })

  // read in your data and make it into a nested structure
  groupData = d3.groups(graphic_data, d => d.group, d => d.plot, d => d.name);

  series = [...new Set(graphic_data.map(d => d.name))]

  height = ((config.optional.seriesHeight[size] * series.length) + (10 * (series.length - 1)) + 12)


  // create scales
  y = d3.scaleBand()
    .range([0, height])
    .domain(series)
    .paddingOuter(0.2)
    .paddingInner((series.length - 1) * 10 / (series.length * config.optional.seriesHeight[size]))

  x = d3.scaleLinear()
    .range([0, chart_width])

  if(config.essential.xDomain=='auto'){
    x.domain([0, d3.max(graphic_data, d => d.value)])
  }else{
    x.domain(config.essential.xDomain);
  }

  yAxis = d3.axisLeft(y)
  .tickSize(0)
  .tickPadding(8)

  xAxis = d3.axisBottom(x)
    .ticks(config.optional.xAxisTicks[size])
    .tickSize(-height)

  //create a div for every group, countries
  groups = graphic.selectAll("div.group")
    .data(groupData)
    .join("div")
    .attr('class', 'group')


  groups.append("p")
    .attr("class", "grouplabels")
    .html(d => d[0]);

  groupDivs = groups.append("div").attr('class', 'plots')

  //create an svg for every chart

  plots = groupDivs.selectAll("div.plots")
    .data(d => d[1])
    .join('div')
    .attr('class', 'plot')

  plots.append('p').html(d => d[0]).attr('class', 'plotname').each(function(d, i) {
    if (i % chart_every == 0) {
      d3.select(this)
      .style("position", 'relative')
      .style('left', (group_margin.left+margin.left)+"px")
    }
  })
  .style('max-width',(chart_width+margin.left+margin.right)+'px')



  charts = plots.append("svg")
    .attr('class', 'chart')
    .attr("width", (d, i) => {
      if (i % chart_every == 0) {
        return chart_width + group_margin.left + margin.left + margin.right
      } else {
        return chart_width + margin.left + margin.right
      }
    })
    .attr("height", height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', (d, i) => {
      if (i % chart_every == 0) {
        return 'translate(' + (margin.left + group_margin.left) + ',' + margin.top + ')'
      } else {
        return 'translate(' + margin.left + ',' + margin.top + ')'
      }
    });

  charts.each(function(d, i) {
    if (i % chart_every == 0) {
      d3.select(this).append('g').attr('class', 'y axis')
        .call(yAxis).selectAll('text')
        .call(wrap,group_margin.left)
    }
  })

  charts.append('g')
    .attr('transform', 'translate(0,' + height + ')')
    .attr('class', 'x axis')
    .call(xAxis).selectAll('line').each(function(d) {
      if (d == 0) {
        d3.select(this).attr('class', 'zero-line')
      }
    })

  charts.each(function(d,i){
    if(i % chart_every == (chart_every-1)||i==d3.select(this.parentNode.parentNode.parentNode).data()[0][1].length-1){
      d3.select(this).append('text').text(config.essential.xAxisLabel)
      .attr('text-anchor','end')
      .attr('class','axis--label')
      .attr('transform','translate('+chart_width+','+(height+30)+')')
    }
  })

  series = charts.selectAll('g.series')
    .data(d => d[1])
    .join('g')
    .attr('class', 'series')
    .attr('transform', d => 'translate(0,' + y(d[0]) + ')')

  series.append('rect')
    .attr('width', d => x(+d[1].filter(d => d.series == "2021")[0].value))
    .attr('height', y.bandwidth())
    .attr('fill', '#206095')

  series.append('circle')
    .attr('r', 5)
    .attr('cx', d => x(+d[1].filter(d => d.series == "2011")[0].value))
    .attr('cy', y.bandwidth() / 2)
    .attr('fill', '#f66068')






  //create link to source
  d3.select("#source")
    .text("Source – " + config.essential.sourceText)

  //use pym to calculate chart dimensions
  if (pymChild) {
    pymChild.sendHeight();
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
      // y = text.attr("y"),
      x = text.attr("x"),
      dy = parseFloat(text.attr("dy")),
      tspan = text.text(null).append("tspan").attr('x', x);
    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan").attr('x', x).attr("dy", lineHeight + "em").text(word);
      }
    }
    var breaks = text.selectAll("tspan").size();
    text.attr("y", function() {
      return -6 * (breaks - 1);
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
