config={
  "essential": {
    "graphic_data_url": "data.csv",
    "legendLabels": {"min":"2015-2019", "max":"2020"},
    //the keys match the column names
    "colour_palette": ["#6D6E72", "#0075A3"],
    "sourceText": "Office for National Statistics",
    "accessibleSummary":"Chart showing death rates due to alchohol by regions, for males, females and all.",
    "numberFormat":".0f",
    "xDomain":[0,100]
    // either auto or a custom domain as an array e.g [0,100]
  },
  "optional": {
    "margin": {
      "sm": {
        "top": 15,
        "right": 20,
        "bottom": 20,
        "left": 100
      },
      "md": {
        "top": 15,
        "right": 20,
        "bottom": 20,
        "left": 100
      },
      "lg": {
        "top": 15,
        "right": 20,
        "bottom": 20,
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
    "mobileBreakpoint": 510,
    "mediumBreakpoint": 600
  }
};
