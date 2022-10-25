config={
  "essential": {
    "graphic_data_url": "data.csv",
    "colour_palette": ["#206095","#27A0CC","#871A5B","#A8BD3A","#F66068"],
    "sourceText": "Office for National Statistics",
    "accessibleSummary":"Here is the screenreader text describing the chart.",
    "xDomain":"auto",
    // either "auto" or an array for the x domain e.g. [0,100]
    "xAxisTickFormat":".0f",
    "xAxisLabel":"x axis label",
    "stackOffset":d3.stackOffsetNone,
    // options include
    // stackOffsetNone means the baseline is set at zero
    // stackOffsetExpand to do 100% charts
    // stackOffsetDivergine for data with positive and negative values
    "stackOrder":d3.stackOrderNone
    // other options include
    // d3.stackOrderNone means the order is taken from the datafile
    // d3.stackOrderAppearance the earliest series (according to the maximum value) is at the bottom
    // d3.stackOrderAscending the smallest series (according to the sum of values) is at the bottom
    // d3.stackOrderDescending the largest series (according to the sum of values) is at the bottom
    // d3.stackOrderReverse reverse the order as set from the data file
  },
  "optional": {
    "margin": {
      "sm": {
        "top": 15,
        "right": 20,
        "bottom": 50,
        "left": 120
      },
      "md": {
        "top": 15,
        "right": 20,
        "bottom": 50,
        "left": 120
      },
      "lg": {
        "top": 15,
        "right": 20,
        "bottom": 50,
        "left": 120
      }
    },
    "seriesHeight":{
      "sm":30,
      "md":30,
      "lg":30
    },
    "xAxisTicks":{
      "sm":4,
      "md":8,
      "lg":10
    },
    "mobileBreakpoint": 510,
    "mediumBreakpoint": 600
  }
};
