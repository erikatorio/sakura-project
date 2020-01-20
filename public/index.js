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

//populate users
let users = [
    {
        username: 'Nini',
        password: '123',
        group: 'Group 1'
    },
    {
        username: 'Ricky',
        password: '1234',
        group: 'Group 2'
    },
    {
        username: 'Kara',
        password: '12345',
        group: 'Group 3'
    },
];

// for(var i = 0; i<users.length; i++) {
//     db.collection('users').doc(users[i].username).set(users[i]);
// }

// login
$(document).ready(function() {
  $('#login-button').click(function() {
      var username = $('#username').val();
      var password = $('#password').val();

      var users = db.collection('users');
      var query = users.where("username", "==", username).where("password", "==", password).get()
      .then(function(querySnapshot) {
        if(!querySnapshot.empty) {
            var home_url ="http://localhost:5000/home.html"
            var admin_url ="http://localhost:5000/statistics.html"
            querySnapshot.forEach(function(doc) {
                if(doc.data().type == "user") {
                    $(location).attr('href', home_url);
                    document.cookie = "group_value="+encodeURIComponent(doc.data().group);
                } else {
                    $(location).attr('href', admin_url);
                }
            });
        } else {
            $('#invalid-credentials').append("<div class=\"alert alert-danger\" role=\"alert\">Invalid Credentials. Please Try Again. </div>");
        }
        });
  });

    $('#confirm_btn').click(function() {
        var info = document.getElementById("report_sent");
        info.style.display = "block";
        setTimeout(function(){$('#report_sent').fadeOut();}, 2000);

        var group;
        var category;
        var cookie_data = document.cookie.split(';');
        if(cookie_data[0].includes('group_value')) {
            var temp = cookie_data[0].split('=');
            group = temp[1].replace('%20', ' ');
            var temp_2 = cookie_data[1].split('=');
            category = temp_2[1];
            addReport(group, category);
        } else {
            var temp = cookie_data[1].split('=');
            group = temp[1].replace('%20', ' ');
            var temp_2 = cookie_data[0].split('=');
            category = temp_2[1];
            addReport(group, category);
        }
    });
});

function deselectBtn(e){
    var button = document.getElementsByClassName('categories');
    
    for (var i = 0; i < button.length; i++) {
        button[i].classList.remove('active');
    }
    document.getElementById("submit_btn").disabled = true;
}

$('#logout_link').click(function() {
      document.cookie ='group_value=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      var landing_page = "http://localhost:5000/"
      $(location).attr('href', landing_page);
});

//add new report
function addReport(grp, cat) {
    switch(grp) {
        case 'Group 1':
            db.collection('reports').add({
                category: cat,
                group: grp,
                color: colors[0]
            });
            break;
        case 'Group 2':
            db.collection('reports').add({
                category: cat,
                group: grp,
                color: colors[1]
            });
            break;
        case 'Group 3':
            db.collection('reports').add({
                category: cat,
                group: grp,
                color: colors[2]
            });
            break;
    }
}

//use listen on firestore
function newReportNotif() {
    db.collection("reports").onSnapshot(function(querySnapshot) {
       var notif_container = document.getElementById("notification-container");
        var time = new Date();
        var notif_type = "Chat/Report";
        var notif_message = "A new report has been submitted."; //"Message for the notif here";
        notif_container.innerHTML = '<div class="toast" role="alert" aria-live="assertive" aria-atomic="true" data-delay="3000"><div class="toast-header"><svg class="rounded mr-2" width="20" height="20" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" focusable="false" role="img"><rect fill="#007aff" width="100%" height="100%" /></svg><strong class="mr-auto">'+notif_type+'!</strong><small class="text-muted">'+time+'</small><button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close"><span aria-hidden="true">&times;</span></button> </div><div class="toast-body">'+notif_message+'</div></div>'
        $('.toast').toast('show');
    });
}
var groups = [];
var categories = [];

//get graph data
async function getStats() {
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

    var data = [];
    for(var i = 0; i < groups.length; i++) {
        for(var j = 0; j < categories.length; j++) {
        var num_reports = await db.collection('reports').where("group", "==", groups[i]).where("category", "==", categories[j]);
        var count;
        var query = await num_reports.get().then(function(snapshot) {
            count = snapshot.size;
            var current = groups[i];
            
            data.push({
                group: groups[i],
                category: categories[j],
                amount: count
            });
        });
        }
    }
    return data;
}

function categoryTemplate(categoriesList) {
    return '<button id="category_'+categoriesList.name+'" value="'+categoriesList.name+'" type="button" class="btn categories" data-description="'+categoriesList.description+'" onclick="selectCategory(this)"><strong>'+categoriesList.name+ '</strong></button>'
}

async function getCategories() {
    var c = [];
    var category_query = await db.collection('categories').get().then(function(snapshot) {
        snapshot.forEach(function(doc) {
            c.push({
                name: doc.data().name,
                description: doc.data().description
            });
        });
    });
    return c;
}

async function displayCategories() {
    await getCategories().then(function(a) {
        $('#select_category').append($.parseHTML(a.map(categoryTemplate).join('')));
    });
}

var z_values;
//display data
async function displayData() {
    var x = await getStats().then(function(y) {
        z_values = [];
        for(var i = 0;i<y.length;i++){
            z_values.push(y[i].amount);
        }
    });
}

var z_data = null;
var graph = null;
var colors = ["#EBD2B4", "#F4989C", "#DAC4F7", "#ACECF7"];

function custom(x, y) {
  return -Math.sin(x / Math.PI) * Math.cos(y / Math.PI) * 10 + 10;
}

// Called when the Visualization API is loaded.
async function drawVisualization() {
    var style = "bar-color";//document.getElementById("style").value;
    var showPerspective = true;

    // Create and populate a data table.
    z_data = [];
    await displayData();

    var color = 0;
    var steps = 3; // number of datapoints will be steps*steps
    var axisMax = 8;
    var z = 0;
    var axisStep = axisMax / steps;
    for (var x = 0; x <= axisMax; x += axisStep+1) {
        for (var y = 0; y <= axisMax; y += axisStep) {
            
            if (true) {
                z_data.push({
                  x: x,
                  y: y,
                  z: z_values[z],
                  style: {
                    fill: colors[color],
                    stroke: colors[color+1]
                  }
                });
            }
            else {
                z_data.push({ x: x, y: y, z: z });
            }
            z+=1;
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
            return "Category " + categories[y];
        }else{
            return "Category " +categories[Math.ceil(y/3)];
        }
    },
    
    xValueLabel: function(x) {
        if(x == 0){
            return "Group 1";
        }else{
            return "Group " + groups[Math.ceil(x/3)];
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
  graph = new vis.Graph3d(container, z_data, options);

  if (camera) graph.setCameraPosition(camera); // restore camera position
}

function reportTemplate(reportList) {
    return '<div data-toggle="modal" data-target="#report-'+reportList.id+'" class="card report-card mb-3 " style="min-width:100%"><div class="row no-gutters"><div class="col"><div class="card-body text-wrap"><span class="badge badge-pill" style="background-color:'+reportList.color+'">'+reportList.group+'</span><p class="text-truncate">'+reportList.details+'</p></div></div></div></div><div class="modal fade" id="report-'+reportList.id+'" tabindex="-1" role="dialog"><div class="modal-dialog modal-dialog-centered" role="document"><div class="modal-content"><div class="modal-header" style="background-color:'+reportList.color+'"><h5 class="modal-title" id="report-full-title">Category '+reportList.category+'</h5><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button></div><div class="modal-body scrollbar scrollbar-rare-wind">'+reportList.details+'</div><div class="modal-footer"><button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button></div></div></div></div>'
}

async function getReports() {
    var r = [];
    var category_query = await db.collection('reports').where('details','>','').get()
    .then(function(snapshot) {
        snapshot.forEach(function(doc) {
            r.push({
                id: doc.id,
                group: doc.data().group,
                category: doc.data().category,
                details: doc.data().details,
                color: doc.data().color
            });
        });
    });
    return r;
}

//adds reports to the report-container
async function displayReportList(){
    await getReports().then(function(b) {
        $('#report-container').append($.parseHTML(b.map(reportTemplate).join('')));
    });
}

window.addEventListener("load", () => {
    displayCategories();
    newReportNotif();
    $('.toast').toast('show');
    $('#refresh_btn').click(function() {
        //drawVisualization();
        location.reload(true);
        console.log('refresh');
    });
    displayReportList();
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
});