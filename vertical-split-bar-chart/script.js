var graphic = d3.select('#graphic');
var pymChild = null;

function drawGraphic() {

  // clear out existing graphics
  graphic.selectAll("*").remove();

  if (parseInt(graphic.style("width")) < config.threshold_sm) {
    size = "sm"
  } else {
    size = "not sm"
  }

  //population accessible summmary
  d3.select('#accessibleSummary').html(config.accessibleSummary)

  formatNo = d3.format(config.numberFormat)

  // set up scale
  x = d3.scaleLinear()
    .range([0, 100])
    .domain([d3.min([0, d3.min(graphic_data, d => +d.value)]), d3.max(graphic_data, d => +d.value)])



  // nest data
  groupedData = d3.groups(graphic_data, d => d.plot, d => d.ycategory)

  // unique columns
  xcategories = [...new Set(graphic_data.map(d => d.xcategory))]

  if (config.colour_palette.type == "categorical") {
    colour = d3.scaleOrdinal()
      .range(config.colour_palette.colours)
      .domain(xcategories)

    if (size == "sm") {
      // Set up the legend
      var legenditem = d3.select('#legend')
        .selectAll('div.legend--item')
        .data(d3.zip(xcategories, config.colour_palette.colours))
        .enter()
        .append('div')
        .attr('class', 'legend--item')

      legenditem.append('div').attr('class', 'legend--icon')
        .style('background-color', function (d) {
          return d[1]
        })

      legenditem.append('div')
        .append('p').attr('class', 'legend--text').html(function (d) {
          return d[0]
        })
    }


  }

  // create div for each plot, here England, Wales
  plots = graphic.selectAll('div.plots').data(groupedData)
    .join('div')
    .attr('class', 'plots')

  plots.append('p')
    .attr('class', 'plot--title')
    .html(d => d[0])

  // create a div for the chart
  chart = plots.append('div').attr('class', 'chart')


  if (size != "sm") {
    // create a div for the headers
    headers = chart.append('div').attr('class', 'splitBar-label')

    // create div for the first square
    headers.append('div')
      .attr('class', 'rowLabel')
      .style('width', config.rowWidth + 'px')

    // create divs for the rest of the column headers
    headers.append('div').attr('class', 'headers')
      .style('width', `calc(100% - ${config.rowWidth}px)`)
      .selectAll('div.column').data(xcategories)
      .join('div')
      .attr('class', 'column')
      .style('width', 100 / xcategories.length + '%')
      .append('span').html(d => d)
  }


  // create divs as rows
  rows = chart.selectAll('div.rows')
    .data(d => d[1])
    .join('div')
    .attr('class', 'splitBar-row')

  // first div as separate
  rows.append('div').attr('class', 'rowLabel')
    .style('width', config.rowWidth + 'px')
    .append('span')
    .style('text-align', 'right')
    .html(d => d[0])

  // then create another div to hold all split bars
  splitBar = rows.append('div').attr('class', 'headers')
    .style('width', `calc(100% - ${config.rowWidth}px)`)
    .selectAll('div.splitBar')
    .data(d => d[1])
    .join('div')
    // then add a div for each x category
    .attr('class', 'column')
    .style('width', 100 / xcategories.length + '%')

  // divs for inside the splitBar
  splitBarInner = splitBar.append('div').attr('class', 'splitBar-inner')
    // then div for the background
    .append('div')
    .attr('class', 'splitBar-inner--background')

  // add a div to help draw a line for 0
  splitBarInner.append('div')
    .attr('class', 'splitBar-bar--value')
    .style('width', "calc(100% + 10px)")
    .style('border-bottom', "1.5px solid #b3b3b3")
    .style('height', "100%")
    .style('left', "-5px")

  // then div for the value
  splitBarInner.append('div')
    .attr('class', 'splitBar-bar--value')
    .style('bottom', d => +d.value > 0 ? x(0) + "%" : x(+d.value) + "%")
    .style('top', d => +d.value > 0 ? 100 - x(+d.value) + "%" : (100 - x(0)) + "%")
    .style('background', function (d) {
      if (config.colour_palette.type == "mono") {
        return config.colour_palette.colours
      } else if (config.colour_palette.type == "divergent") {
        return +d.value > 0 ? config.colour_palette.colours[0] : config.colour_palette.colours[1]
      } else if (config.colour_palette.type == "categorical") {
        return colour(d.xcategory)
      }
    })
    
    splitBarInner.append('div')
    // then a div to hold the value
    .attr('class', 'splitBar-bar--label')
    .style('margin-left', "42%")
    .style('position', "absolute")
    .style('bottom', d => x(d.value) < 30 ? x(d.value) + "%" : "calc("+x(d.value)+"% - 25px")
    .append('span')
    .style('color', d => Math.abs(+x(d.value) - x(0)) < 30 ? "#222222" : "#fff")
    .html(d => formatNo(d.value))

  //create link to source
  d3.select("#source")
    .text("Source: " + config.sourceText)



  //use pym to calculate chart dimensions
  if (pymChild) {
    pymChild.sendHeight();
  }
}

d3.csv(config.graphic_data_url)
  .then(data => {
    //load chart data
    graphic_data = data

    //use pym to create iframed chart dependent on specified variables
    pymChild = new pym.Child({
      renderCallback: drawGraphic
    });
  });
