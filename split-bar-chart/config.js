config = {
  graphic_data_url:"data.csv",
  colour_palette: {
    type:"categorical",
    // type can be mono, divergent, categorical
    colours:["#206095", "#27A0CC","#871A5B", "#A8BD3A","#F66068"]
    // colours is an array for the colours of the bars
    // e.g. if mono use ["206095"]
    // e.g if divergent you can use ["#206095","#F66068"]
    // e.g if categorical ["#206095", "#27A0CC","#871A5B", "#A8BD3A","#F66068"]
  },
  numberFormat:".0f",
  rowWidth:"140",
  // rowWidth set the width of y category column in pixel
  accessibleSummary:"This chart has been hidden from screen readers. The main message of the chart is summarised in the chart title.",
  sourceText:"Office for National Statistics – Census 2021",
  threshold_sm:500
};
