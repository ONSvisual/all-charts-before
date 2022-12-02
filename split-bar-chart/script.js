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

  // set up scale
  x = d3.scaleLinear()
  .range([0,100])
  .domain([d3.min([0,d3.min(graphic_data,d=>+d.value)]),d3.max(graphic_data,d=>+d.value)])


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
  .style('text-align','right')
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
  splitBarInner=splitBar.append('div').attr('class','splitBar-inner')
  // then div for the background
  .append('div')
  .attr('class','splitBar-inner--background')
  .style('position','relative')

  splitBarInner.append('div')
  .attr('class','splitBar-bar--value')
  .style('left',0)
  .style('width',x(0)+"%")
  .style('border-right',"1.5px solid #b3b3b3")
  .style('height',"calc(100% + 15px)")
  .style('top',"-8px")

  // then div for the value
  splitBarInner.append('div')
  .attr('class','splitBar-bar--value')
  .style('left',d=>+d.value>0 ? x(0)+"%" : x(+d.value)+"%")
  .style('right',d=>+d.value>0 ? 100-x(+d.value)+"%" : (100-x(0))+"%")
  .style('background','#206095')
  .append('div')
  // then a div to hold the value
  .attr('class','splitBar-bar--label')
  .style('text-align','left')
  .style('padding','0 5px')
  .style('margin-left',d=>Math.abs(+x(d.value)-x(0))<20 ? "100%" : "calc(100% - 35px)")
  .style('line-height','27px')
  .append('span')
  .style('color',d=>Math.abs(+x(d.value)-x(0))<20 ? "#222222": "#fff")

  .html(d=>formatNo(d.value))

  // final div for the zero indicator
  finalrow=chart.append('div')
  // first div as separate
  finalrow.append('div').attr('class','rowLabel')
  .style('width',config.rowWidth+'px')
  .style('display','inline-block')

  finalrow.append('div')
  .style('margin-right','-8px')
  .style('width',`calc(100% - ${config.rowWidth}px)`)
  .style('display','inline-block')
  .selectAll('div.column').data(xcategories)
  .join('div')
  .attr('class', 'column')
  .style('width',100/xcategories.length+'%')
  .style('padding-right','8px')
  .style('display','inline-block')
  .append('span')
  .style('position','relative')
  .style('left',x(0)+"%")
  .html(0)




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
