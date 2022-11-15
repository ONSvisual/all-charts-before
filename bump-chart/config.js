config={
  "essential": {
    "graphic_data_url": "data.csv",
    "colour_palette": {


      type:"custom",
      palette:["#206095"],

      // type:"sequential",
      // palette:"YlGnBu"
      // options include custom, sequential or qualitative
      // for custom, this is a colour for each series, the palette will cycle round so you can set a single colour if you wish
      // for sequential, this accepts a colour brewer palette eg. YlGnBu
      // for qualitative, this accepts a colour brewer palette e.g Accent
    },
    "sourceText": "Office for National Statistics",
    "accessibleSummary":"Languages spoken between two time points.",
    "customRankCutoff":10,
    "numberFormat":",.0s"
  },
  "optional": {
    "seriesHeight":{
      "sm":30,
      "md":25,
      "lg":20
    },
    "margin": {
      "sm": {
        "top": 50,
        "right": 150,
        "bottom": 20,
        "left": 20
      },
      "md": {
        "top": 50,
        "right": 150,
        "bottom": 50,
        "left": 20
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
