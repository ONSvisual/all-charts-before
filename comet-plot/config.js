config={
    "essential": {
      "graphic_data_url": "data.csv",
      "legendLabels": {"min":"2011", "max":"2021"},
      //the keys match the column names
      "colour_palette": ["#206095", "#F66068", "#A09FA0"],
      "sourceText": "Office for National Statistics",
      "accessibleSummary":"Chart showing death rates due to alchohol by regions, for males, females and all.",
      "numberFormat":".0f",
      "xAxisLabel":"x axis label",
      "xDomain":[0,100],
      // either auto or a custom domain as an array e.g [0,100]
      "dotsize":6,
      "legendLineLength": 60,
      "legendItemWidth": 150,
      "showDataLabels":true
    },
    "optional": {
      "margin": {
        "sm": {
          "top": 5,
          "right": 20,
          "bottom": 20,
          "left": 100
        },
        "md": {
          "top": 5,
          "right": 20,
          "bottom": 20,
          "left": 100
        },
        "lg": {
          "top": 5,
          "right": 20,
          "bottom": 40,
          "left": 100
        }
      },
      "seriesHeight":{
        "sm":40,
        "md":40,
        "lg":40
      },
      "xAxisTicks":{
        "sm":4,
        "md":8,
        "lg":10
      },
      "legendHeight":40,
      "mobileBreakpoint": 510,
      "mediumBreakpoint": 600
    }
  };