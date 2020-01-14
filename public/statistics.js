var data = null;
var graph = null;

function custom(x, y) {
  return -Math.sin(x / Math.PI) * Math.cos(y / Math.PI) * 10 + 10;
}

// Called when the Visualization API is loaded.
function drawVisualization() {
    var style = document.getElementById("style").value;
    var showPerspective = document.getElementById("perspective").checked;
    var xBarWidth = parseFloat(document.getElementById("xBarWidth").value) || undefined;
    var yBarWidth = parseFloat(document.getElementById("yBarWidth").value) || undefined;
    var withValue = ["bar-color", "bar-size", "dot-size", "dot-color"].indexOf(style) != -1;

    // Create and populate a data table.
    data = [];
    colors = ["#EBD2B4", "#F4989C", "#DAC4F7", "#ACECF7"];

    var color = 0;
    var steps = 3; // number of datapoints will be steps*steps
    var axisMax = 8;
    var axisStep = axisMax / steps;
    for (var x = 0; x <= axisMax; x += axisStep+1) {
        for (var y = 0; y <= axisMax; y += axisStep) {
            var z = Math.random();
            if (withValue) {
                data.push({
                  x: x,
                  y: y,
                  z: z,
                  style: {
                    fill: colors[color],
                    stroke: colors[color+1]
                  }
                });
            }
            else {
                data.push({ x: x, y: y, z: z });
            }
        }
        color+=1;
    }

var category = ["A","B","C","D"];
var cat_count = 0;
  // specify options
  var options = {
    width:'100%',
    style: style,
    xBarWidth: 2,
    yBarWidth: 2,
    showPerspective: showPerspective,
    showShadow: false,
    keepAspectRatio: true,
    verticalRatio: 0.5,
    xCenter:'55%',
    yStep:2.5,
    xStep:3.5,
    animationAutoStart:true,
    animationPreload:true,
    showShadow:true,
    
    yLabel: "Categories (of Abuse)",
    xLabel: "Groups",
    zLabel: "Reports",
    yValueLabel: function (y) {
        if(y == 0){
            return "Category " + category[y];
        }else{
            return "Category " +category[Math.ceil(y/3)];
        }
    },
    
    xValueLabel: function(x) {
        if(x == 0){
            return "Group 1";
        }else{
            return "Group " + (Math.ceil(x/3));
        }
    },
    tooltip: function(data){
        var res = "";
        if(data.x == 0){
            res += "<strong>Group 1</strong>";
        }else{
            res += "<strong>Group</strong> " + (Math.ceil(data.x/3));
        }

        if(data.y == 0){
            res+= "<br><strong>Category</strong> " + category[data.y];
        }else{
            res+= "<br><strong>Category</strong> " +category[Math.ceil(data.y/3)];
        }

        res+= "<br><strong>Reports</strong> " + data.z;
        return res;
    }
  };


  var camera = graph ? graph.getCameraPosition() : null;

  // create our graph
  var container = document.getElementById("mygraph");
  graph = new vis.Graph3d(container, data, options);

  if (camera) graph.setCameraPosition(camera); // restore camera position

  document.getElementById("style").onchange = drawVisualization;
  document.getElementById("perspective").onchange = drawVisualization;
  document.getElementById("xBarWidth").onchange = drawVisualization;
  document.getElementById("yBarWidth").onchange = drawVisualization;
}

window.addEventListener("load", () => {
  drawVisualization();
    document.getElementById("mygraph").childNodes[0].childNodes[1].style.width = '630px';
    drawVisualization();
    graph.setCameraPosition({horizontal: 1.4, vertical: 0, distance: 1.6})

    //legend
    for(var i = 0; i<3;i++){
      document.getElementById("legend").innerHTML +='<span class="badge badge-pill" style="background-color:'+colors[i]+'">Group '+(i+1)+'</span>';
    }

});
window.addEventListener("resize", function(){
    graph.animationStart();
    //document.getElementById("mygraph").style.left = 0;
    graph.redraw();
    console.log("resize")
});