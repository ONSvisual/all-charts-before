config={
  "essential": {
    "graphic_data_url": "data.csv",
    "legendLabels": ["Category 1 goes here", "Category 2 goes here"],
    "colour_palette": ["#206095", "#27a0cc"],
    "sourceText": "Office for National Statistics",
    "accessibleSummary":"Here is the screenreader text describing the chart.",
    "dataLabels":{
      "show":true,
      "numberFormat":".0%"
    },
    "xDomain":"auto"
    // either "auto" or an array for the x domain e.g. [0,100]
  },
  "optional": {
    "margin": {
      "sm": {
        "top": 15,
        "right": 20,
        "bottom": 20,
        "left": 120
      },
      "md": {
        "top": 15,
        "right": 20,
        "bottom": 20,
        "left": 120
      },
      "lg": {
        "top": 15,
        "right": 20,
        "bottom": 20,
        "left": 120
      }
    },
    "seriesHeight":{
      "sm":28,
      "md":28,
      "lg":28
    },
    "aspectRatio": {
      "sm": [5, 6],
      "md": [15, 6],
      "lg": [15, 9]
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
