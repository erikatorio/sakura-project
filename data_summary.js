//firestore
const firebase = require("firebase/app");
// Required for side-effects
require("firebase/firestore");

// Initialize Cloud Firestore through Firebase
firebase.initializeApp({
  apiKey: 'AIzaSyDhu4s_OVdZ8s-UgT8aO4olgI_r7Hp2Pnc',
  authDomain: 'sakura-test-ea29e.firebaseapp.com',
  projectId: 'sakura-test-ea29e'
});

var db = firebase.firestore();

module.exports = { db };

//gets group and category data
var groups = [];
var categories = [];

async function getData() {
  var group_query = await db.collection('groups').get().then(function(snapshot) {
    snapshot.forEach(function(doc) {
        groups.push(doc.data().name);
    });
  });

  var category_query = await db.collection('categories').get().then(function(snapshot) {
      snapshot.forEach(function(doc) {
          categories.push(doc.data().name);
      });
  }); 
}

//displays header and header table
async function headerAndTotal() {
  var date = new Date();
  // var today = date.getMonth()+' '+date.getDate()+', 'date.getFullYear();
  $('#date-today').append(date);

  var total_reports;
  await db.collection('reports').get().then(function(snapshot) {
    total_reports = snapshot.size;
  });
  $('#total-reports').append(total_reports);

  var unique_reports;
  await db.collection('reports').where('details', '>', '').get().then(function(snapshot) {
    unique_reports = snapshot.size;
  });
  $('#unique-respondents').append(unique_reports);
}

//displays and populates pie graphs dynamically
async function populatePieData(group) {
    var temp = [['Category', 'Number of Reports']];
    for(var j = 0; j < categories.length; j++) {
        var num_reports = await db.collection('reports').where("group", "==", group).where("category", "==", categories[j]);
        var count;
        var query = await num_reports.get().then(function(snapshot) {
            count = snapshot.size;
            temp.push([categories[j], count]);
        });
    }
    return temp;
}

async function displayPieChart() {
  console.log('pie time');
  google.charts.load("current", {packages:["corechart"]});
  google.charts.setOnLoadCallback(function(){
        for(var i = 0;i<groups.length;i++){
          drawChart(groups[i]);
        }
      });
      async function drawChart(group) {
        var pieData = await populatePieData(group);
        console.log(pieData);
        var data = google.visualization.arrayToDataTable(pieData);

        var current_grp = group.split(' ')[1];
        console.log(current_grp);

        var options = {
          title: 'Reports by Group '+current_grp,
          pieHole: 0.4,
          legend: 'right',
          width:390,
          height:350,
          label: {color:'#F4989C'},
          colors: ["#EBD2B4", "#F4989C", "#DAC4F7", "#ACECF7"]
        };
        var target = 'donutchart-'+current_grp;
        console.log(target);
        var chart = new google.visualization.PieChart(document.getElementById(target));
        chart.draw(data, options);
      }
}

//populates and displays summary table dynamically
function summaryTemplate(summaryData) {
  return '<div id="group-'+summaryData.group+'" class="row"><div class="col-5" ><table class="table table-hover"><tbody><tr><th scope="row">Group '+summaryData.group+'</th><td></td><td></td></tr><tr><th scope="row">Respondents</th><td>'+summaryData.respondents+'</td><td></td></tr><tr id = "sub-'+summaryData.group+'"><th scope="row">Total Reports</th><td>'+summaryData.reports+'</td><td></td></tr></tbody></table></div><div class="col d-flex justify-content-center"><div id="donutchart-'+summaryData.group+'" ></div></div></div><br>'
}

var group_headers = [];

async function tableHeader(group) {
  var grp_reports;
  var respondents;
  await db.collection('reports').where('group','==',group).get().then(function(snapshot) {
    grp_reports = snapshot.size;
  });

  await db.collection('users').where('group','==',group).get().then(function(snapshot) {
    respondents = snapshot.size;
  });

  group_headers.push({
    group: group.split(' ')[1],
    reports: grp_reports,
    respondents: respondents
  });
}

async function displayDataTable() {
  await getData();
  console.log('here data is got');
  for(var i=0; i < groups.length; i++) {
    await tableHeader(groups[i]);
  }

  $('#group-tables').append($.parseHTML(group_headers.map(summaryTemplate).join('')));
  console.log('appends');
}

//populates and displays sub summary table dynamically
function subTemplate(subList) {
  return '<tr><th scope="row" class="float-right">Category '+subList.category+'</th><td>'+subList.amount+'</td><td style="width:3px;"></td></tr>';
}

async function subTable(group) {
  var temp = [];
  for(var j = 0; j < categories.length; j++) {
      var num_reports = await db.collection('reports').where("group", "==", group).where("category", "==", categories[j]);
      var count;
      var query = await num_reports.get().then(function(snapshot) {
          count = snapshot.size;
          temp.push({
            category: categories[j],
            amount: count
          });
      });
  }
  return temp;
}

async function displaySubTable() {
  for(var i=0; i < groups.length; i++) {
    var subid='#sub-'+groups[i].split(' ')[1];
    await subTable(groups[i]).then(function(s) {
      $(subid).after($.parseHTML(s.map(subTemplate).join('')));
    });
  }
}

  async function loadData() {
    await headerAndTotal();
    await displayDataTable();
    await displaySubTable();
    await displayPieChart();
  }

  loadData();