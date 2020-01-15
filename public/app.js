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
            var url ="http://localhost:5000/home.html"
            $(location).attr('href', url);
            querySnapshot.forEach(function(doc) {
                document.cookie = "group_value="+encodeURIComponent(doc.data().group);
                console.log(doc.data().group);
            });
        } else {
            $('#invalid-credentials').append("<div class=\"alert alert-danger\" role=\"alert\">Invalid Credentials. Please Try Again. </div>");
        }
        });
  });

    $('#confirm_btn').click(function() {
        console.log('clicked');
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
            updateStats(group, category);
        } else {
            var temp = cookie_data[1].split('=');
            group = temp[1].replace('%20', ' ');
            var temp_2 = cookie_data[0].split('=');
            category = temp_2[1];
            updateStats(group, category);
        }
    });

    $('#refresh_btn').click(function() {
        location.reload();
    });
});

$('#logout_btn').click(function() {
      document.cookie ='group_value=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      var landing_page = "http://localhost:5000/"
      $(location).attr('href', landing_page);
});

//update stat data
function updateStats(group, category) {
    var query = db.collection('stats').doc('stats').collection(group).doc(category);
    query.update({
        count: firebase.firestore.FieldValue.increment(1)
    })
}

//get graph data
async function getStats() {
    var groups = ['Group 1', 'Group 2', 'Group 3'];

    var data = [];
    var current_group_id;
    for(var i = 0; i < groups.length; i++) {
        var current_group = await db.collection('stats').doc('stats').collection(groups[i]);

        var query = await current_group.get().then(function(snapshot) {
            var current = groups[i];
            var values = [];
            snapshot.forEach(function(doc) {
                //console.log(doc.id, "=>", doc.data(), "=>", doc.data().count);
                var x = {
                    key: doc.id,
                    count: doc.data().count
                }

                values.push(x);
            });
            
            data.push({
                key: groups[i],
                info: values
            });
        });
    }
    return data;
}

var z_values;
//display data
async function displayData() {
    var x = await getStats().then(function(y) {
        // console.log(y);
        // console.log(y[0].info[0].count);

        z_values = [];
        for(var i = 0;i<3;i++){
            for(var j = 0;j<4;j++){
                z_values.push(y[i].info[j].count);
            }
        }
        //console.log(z_values);
    }); 
}

var z_data = null;
var graph = null;

function custom(x, y) {
  return -Math.sin(x / Math.PI) * Math.cos(y / Math.PI) * 10 + 10;
}

// Called when the Visualization API is loaded.
async function drawVisualization() {
    var style = document.getElementById("style").value;
    var showPerspective = document.getElementById("perspective").checked;
    var xBarWidth = parseFloat(document.getElementById("xBarWidth").value) || undefined;
    var yBarWidth = parseFloat(document.getElementById("yBarWidth").value) || undefined;
    var withValue = ["bar-color", "bar-size", "dot-size", "dot-color"].indexOf(style) != -1;

    // Create and populate a data table.
    z_data = [];
    colors = ["#EBD2B4", "#F4989C", "#DAC4F7", "#ACECF7"];
    await displayData();

    var color = 0;
    var steps = 3; // number of datapoints will be steps*steps
    var axisMax = 8;
    var z = 0;
    var axisStep = axisMax / steps;
    for (var x = 0; x <= axisMax; x += axisStep+1) {
        for (var y = 0; y <= axisMax; y += axisStep) {
            
            if (withValue) {
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
  graph = new vis.Graph3d(container, z_data, options);

  if (camera) graph.setCameraPosition(camera); // restore camera position

  document.getElementById("style").onchange = drawVisualization;
  document.getElementById("perspective").onchange = drawVisualization;
  document.getElementById("xBarWidth").onchange = drawVisualization;
  document.getElementById("yBarWidth").onchange = drawVisualization;

  document.getElementById("mygraph").childNodes[0].childNodes[1].style.width = '630px';
    graph.setCameraPosition({horizontal: 1.4, vertical: 0, distance: 1.6})

    //legend
    for(var i = 0; i<3;i++){
      document.getElementById("legend").innerHTML +='<span class="badge badge-pill" style="background-color:'+colors[i]+'">Group '+(i+1)+'</span>';
    }
}

window.addEventListener("load", () => {
    drawVisualization();
    

});
window.addEventListener("resize", function(){
    graph.animationStart();
    //document.getElementById("mygraph").style.left = 0;
    graph.redraw();
    console.log("resize")
});