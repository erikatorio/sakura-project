google.charts.load("current", {packages:["corechart"]});
  google.charts.setOnLoadCallback(function(){
        for(var i = 1;i<4;i++){
          drawChart(i);
        }
      });
      function drawChart(group) {
        var data = google.visualization.arrayToDataTable([
          ['Category', 'Number of Reports'],
          ['Category A', 11],
          ['Category B', 6],
          ['Category C', 4],
          ['Category D', 9]
        ]);

        var options = {
          title: 'Reports by Group '+group,
          pieHole: 0.4,
          legend: 'right',
          width:390,
          height:350,
          label: {color:'#F4989C'},
          colors: ["#EBD2B4", "#F4989C", "#DAC4F7", "#ACECF7"]
        };
        var target = 'donutchart-'+group;
        var chart = new google.visualization.PieChart(document.getElementById(target));
        chart.draw(data, options);
      }

  window.onafterprint = afterPrint;
  //hides print button when clicked
  function printSummary(){
    $("#print-btn").css("display", 'none');
    setTimeout(function(){
      window.print()
    },3000) ;
  }

  //displays print button after printing/closing
  function afterPrint(){
    setTimeout(function(){
      $("#print-btn").css("display", 'inline');
    },2000) ;
  }