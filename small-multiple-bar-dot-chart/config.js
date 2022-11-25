config={
  "essential": {
    "graphic_data_url": "data.csv",
    "legendLabels": ["2011","2021"],
    //the keys match the column names
    "colour_palette": ["#f66068", "#206095"],
    "sourceText": "Office for National Statistics",
    "accessibleSummary":"Chart showing death rates due to alchohol by regions, for males, females and all.",
    "xAxisLabel":"x axis label",
    "xDomain":[0,100]
    // either auto or a custom domain as an array e.g [0,100]
  },
  "optional": {
    "margin": {
      "group_margin":{
        "left": 100
      },
      "sm": {
        "top": 5,
        "right": 20,
        "bottom": 40,
        "left": 10
      },
      "md": {
        "top": 5,
        "right": 20,
        "bottom": 40,
        "left": 20
      },
      "lg": {
        "top": 5,
        "right": 30,
        "bottom": 40,
        "left": 5
      }
    },
    "chart_every":{
      "sm":1,
      "md":2,
      "lg":3
    },
    "seriesHeight":{
      "sm":40,
      "md":40,
      "lg":40
    },
    "xAxisTicks":{
      "sm":4,
      "md":5,
      "lg":5
    },
    "seriesHeight":{
      "sm":30,
      "md":30,
      "lg":20
    },
    "mobileBreakpoint": 510,
    "mediumBreakpoint": 600
  }
};
