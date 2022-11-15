config={
  "essential": {
    "graphic_data_url": "data.csv",
    "colour_palette": ["#206095","#F66068","#C6C6C6"],
    "sourceText": "Office for National Statistics",
    "accessibleSummary":"Chart showing death rates due to alchohol by regions, for males, females and all.",
    "yDomain":[0,100]
    // either auto or a custom domain as an array e.g [0,100]
  },
  "optional": {
    "aspectRatio":{
      //height to width ratio of the chart area, not including margin
      "sm":[1,2],
      "md":[1,2],
      "lg":[1,2]
    },
    "margin": {
      "sm": {
        "top": 15,
        "right": 150,
        "bottom": 20,
        "left": 100
      },
      "md": {
        "top": 50,
        "right": 150,
        "bottom": 50,
        "left": 100
      },
      "lg": {
        "top": 50,
        "right": 125,
        "bottom": 50,
        "left": 35
      }
    },
    "yAxisTicks":{
      "sm":4,
      "md":8,
      "lg":10
    },
    "mobileBreakpoint": 510,
    "mediumBreakpoint": 600
  }
};
