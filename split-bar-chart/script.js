var graphic = d3.select('#graphic');
var pymChild = null;

function drawGraphic() {

  // clear out existing graphics
  graphic.selectAll("*").remove();


  //population accessible summmary
  d3.select('#accessibleSummary').html(config.accessibleSummary)

  var threshold_md = config.mediumBreakpoint;
  var threshold_sm = config.mobileBreakpoint;

  //set variables for chart dimensions dependent on width of #graphic
  if (parseInt(graphic.style("width")) < threshold_sm) {
    size = "sm"
  } else if (parseInt(graphic.style("width")) < threshold_md) {
    size = "md"
  } else {
    size = "lg"
  }

  formatNo = d3.format(config.numberFormat)

  // nest data
  groupedData = d3.groups(graphic_data, d => d.plot, d => d.ycategory)

  // unique columns
  xcategories = [...new Set(graphic_data.map(d => d.xcategory))]

  // create div for each plot, here England, Wales
  plots = graphic.selectAll('div.plots').data(groupedData)
    .join('div')
    .attr('class', 'plots')

  plots.append('p')
    .attr('class','plot--title')
    .html(d => d[0])

  // create a div for the chart
  chart = plots.append('div').attr('class', 'chart')

  // create a div for the headers
  headers = chart.append('div').attr('class', 'splitBar-label')


  // create div for the first square
  headers.append('div')
  .attr('class', 'rowLabel')
  .style('display','inline-block')
  .style('width',config.rowWidth+'px')

  // create divs for the rest of the column headers
  headers.append('div')
  .style('margin-right','-8px')
  .style('width',`calc(100% - ${config.rowWidth}px)`)
  .style('display','inline-block')
  .selectAll('div.column').data(xcategories)
  .join('div')
  .attr('class', 'column')
  .style('width',100/xcategories.length+'%')
  .style('padding-right','8px')
  .style('display','inline-block')
  .append('span').html(d=>d)

  // create divs as rows 
  rows = chart.selectAll('div.rows')
  .data(d=>d[1])
  .join('div')
  .attr('class','splitBar-row')
  
  // first div as separate 
  rows.append('div').attr('class','rowLabel')
  .style('width',config.rowWidth+'px')
  .style('display','inline-block')
  .append('span')
  .html(d=>d[0])

  // then create another div to hold all split bars
  splitBar=rows.append('div').attr('class','splitBars')
  .style('width',`calc(100% - ${config.rowWidth}px)`)
  .style('display','inline-block')
  .style('margin-right','-8px')
  .selectAll('div.splitBar')
  .data(d=>d[1])
  .join('div')
  // then add a div for each x category
  .attr('class','splitBar')
  .style('width',100/xcategories.length+'%')
  .style('padding-right','8px')

  // divs for inside the splitBar
  splitBar.append('div').attr('class','splitBar-inner')
  // then div for the background
  .append('div')
  .attr('class','splitBar-inner--background')
  .style('position','relative')
  // then div for the value
  .append('div')
  .attr('class','splitBar-bar--value')
  .style('left','0%')
  .style('right','34%')
  .style('background','#206095')
  .append('div')
  .attr('class','splitBar-bar--label')
  .append('span')
  .html(d=>formatNo(d.value))






  // Set up the legend
  // var legenditem = d3.select('#legend')
  //   .selectAll('div.legend--item')
  //   .data(d3.zip(Object.values(config.legendLabels), config.colour_palette))
  //   .enter()
  //   .append('div')
  //   .attr('class', 'legend--item')

  // legenditem.append('div').attr('class', 'legend--icon')
  //   .style('background-color', function(d) {
  //     return d[1]
  //   })

  // legenditem.append('div')
  //   .append('p').attr('class', 'legend--text').html(function(d) {
  //     return d[0]
  //   })

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
