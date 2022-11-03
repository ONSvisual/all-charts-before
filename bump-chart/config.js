config={
  "essential": {
    "graphic_data_url": "data.csv",
    "colour_palette": {


      // type:"custom",
      // palette:["#206095","#F66068","#C6C6C6","#A8BD3A","#27A0CC"],

      type:"sequential",
      palette:"YlGnBu"
      // options include custom, sequential or qualitative
      // for custom, this is a colour for each series
      // for sequential, this accepts a colour brewer palette eg. YlGnBu
      // for qualitative, this accepts a colour brewer palette e.g Accent
    },
    "sourceText": "Office for National Statistics",
    "accessibleSummary":"Chart showing death rates due to alchohol by regions, for males, females and all.",
  },
  "optional": {
    "seriesHeight":{
      "sm":30,
      "md":30,
      "lg":20
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
    "mobileBreakpoint": 510,
    "mediumBreakpoint": 600
  }
};
