const graphic = d3.select('#graphic');
const titles = d3.select('#titles')
const legend = d3.select('#legend')
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
  margin.centre = config.optional.margin.centre

  // calculate percentage if we have numbers
  if (config.essential.dataType == "numbers") {
    maleTotal = d3.sum(graphic_data, d => d.maleBar)
    femaleTotal = d3.sum(graphic_data, d => d.femaleBar)

    comparisonMaleTotal = d3.sum(comparison_data, d => d.maleBar)
    comparisonFemaleTotal = d3.sum(comparison_data, d => d.femaleBar)

    // turn into tidy data
    graphic_data = graphic_data.map(function (d) {
      return [{
        age: d.age,
        sex: 'female',
        value: d.femaleBar / femaleTotal,
      }, {
        age: d.age,
        sex: 'male',
        value: d.maleBar / maleTotal
      }]
    }).flatMap(d => d);

    comparison_data = comparison_data.map(function(d){
      return {
        age:d.age,
        malePercent: d.maleBar/comparisonMaleTotal,
        femalePercent:d.femaleBar/comparisonFemaleTotal
      }
    })
  } else {
    // turn into tidy data
    graphic_data = graphic_data.map(function (d) {
      return [{
        age: d.age,
        value: d.femaleBar,
        sex: 'female'
      }, {
        age: d.age,
        sex: 'male',
        value: d.maleBar
      }]
    }).flatMap(d => d)
  }

  maxPercentage = d3.max([d3.max(graphic_data, d => d.value),d3.max(comparison_data,d=>d3.max([d.femaleBar,d.maleBar]))])

  // set up widths
  fullwidth = parseInt(graphic.style("width"))
  chart_width = ((parseInt(graphic.style("width")) - margin.centre) / 2) - margin.left - margin.right
  height = (graphic_data.length / 2 * config.optional.seriesHeight[size]) 
  
  // set up some scales, first the left scale
  xLeft = d3.scaleLinear()
  .domain([0,maxPercentage])
  .rangeRound([chart_width,0])

  // right scale
  xRight= d3.scaleLinear()
  .domain(xLeft.domain())
  .rangeRound([chart_width+margin.centre,chart_width*2+margin.centre])

  // y scale
  y = d3.scaleBand()
  .domain([...new Set(graphic_data.map(d=>d.age))])
  .rangeRound([height,0])
  .paddingInner(0.1)

  // create the svg
  svg = graphic.append('svg').attr('class','chart')
      .attr('height', height + margin.top + margin.bottom)
      .attr('width', fullwidth)
      .append('g')
      .attr('transform','translate('+margin.left+','+margin.top+')')


  // create line generators
  lineLeft = d3.line()
  .curve(d3.curveStepBefore)
  .x(d=>xLeft(d.femalePercent))
  .y(d=>y(d.age)+y.bandwidth())
  
  lineRight = d3.line()
  .curve(d3.curveStepBefore)
  .x(d=>xRight(d.malePercent))
  .y(d=>y(d.age)+y.bandwidth())

  //add x-axis left
  svg.append('g').attr('class','x axis')
  .attr('transform','translate(0,'+height+')')
  .call(d3.axisBottom(xLeft).tickFormat(d3.format(".1%")).ticks(config.optional.xAxisTicks[size]).tickSize(-height))
  .selectAll('line').each(function(d){
    if (d == 0) {d3.select(this).attr('class','zero-line')};
  })    

  //add x-axis right
  svg.append('g').attr('class','x axis right')
  .attr('transform','translate(0,'+height+')')
  .call(d3.axisBottom(xRight).tickFormat(d3.format(".1%")).ticks(config.optional.xAxisTicks[size]).tickSize(-height))
  .selectAll('line').each(function(d){
    if (d == 0) {d3.select(this).attr('class','zero-line')};
  })

  // add bars
  svg.append('g')
  .selectAll('rect')
  .data(graphic_data)
  .join('rect')
  .attr('fill',d=> d.sex==="female" ? config.essential.colour_palette[0] : config.essential.colour_palette[1])
  .attr("x", d => d.sex === "female" ? xLeft(d.value) : xRight(0))
  .attr("y", d => y(d.age))
  .attr("width", d => d.sex === "female" ? xLeft(0) - xLeft(d.value) : xRight(d.value) - xRight(0))
  .attr("height", y.bandwidth());

  //add y-axis
  svg.append('g').attr('class','y axis')
  .attr('transform','translate('+(chart_width+margin.centre/2-3)+',0)')
  .call(d3.axisRight(y).tickSize(0).tickValues(y.domain().filter((d,i)=>!(i%10))))
  .selectAll('text').each(function(){d3.select(this).attr('text-anchor','middle')})

  //draw comparison lines
  comparisons = svg.append('g')
  
  comparisons.append('path').attr('class','line')
  .attr('d',lineLeft(comparison_data)+'l 0 '+-y.bandwidth())
  .attr('stroke','black')
  .attr('stroke-width','2px')

  comparisons.append('path').attr('class','line')
  .attr('d',lineRight(comparison_data)+'l 0 '+-y.bandwidth())
  .attr('stroke','black')
  .attr('stroke-width','2px')

  //add x-axis titles
  svg.append('text')
  .attr('transform','translate('+(fullwidth-margin.left-margin.right)+','+(height+30)+')')
  .attr('class','axis--label')
  .attr('text-anchor','end')
  .text("Proportion(%)")

  svg.append('text')
  .attr('transform','translate('+(0)+','+(height+30)+')')
  .attr('class','axis--label')
  .attr('text-anchor','start')
  .text("Proportion(%)")

  //add y-axis title
  svg.append('text')
  .attr('transform','translate('+(chart_width+margin.centre/2)+',-15)')
  .attr('class','axis--label')
  .attr('text-anchor','middle')
  .text("Age")

  // add chart titles
  titles.append('div')
  .style('width',(chart_width+margin.centre+margin.left)+"px")
  .style('color',config.essential.colour_palette[0])
  .append('p')
  .attr('class','chartLabel')
  .html("Females")

  titles.append('div')
  .style('width',(chart_width)+"px")
  .append('p')
  .style('color',config.essential.colour_palette[1])
  .attr('class','chartLabel')
  .html("Males")

  // set up the legend
    // Set up the legend
    var legenditem = d3.select('#legend')
    .selectAll('div.legend--item')
    .data(d3.zip(Object.values(config.essential.legendLabels), config.essential.colour_palette))
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



  //create link to source
  d3.select("#source")
      .text("Source: " + config.essential.sourceText)

  //use pym to calculate chart dimensions
  if (pymChild) {
    pymChild.sendHeight();
  }
}//end draw graphic

Promise.all([
  d3.csv(config.essential.graphic_data_url, d3.autoType),
  d3.csv(config.essential.comparison_data,d3.autoType)
]).then(([data,datab]) => {
    //load chart data
    graphic_data = data;
    comparison_data = datab;

    //use pym to create iframed chart dependent on specified variables
    pymChild = new pym.Child({
      renderCallback: drawGraphic
    });
  });
