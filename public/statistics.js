var z_values = require('./bundle.js');
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
    var z = 0;
    var axisStep = axisMax / steps;
    for (var x = 0; x <= axisMax; x += axisStep+1) {
        for (var y = 0; y <= axisMax; y += axisStep) {
            if (withValue) {
                data.push({
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
                data.push({ x: x, y: y, z: z });
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


//chat functions
function showChat(){
  $('.toast').toast('show');
}

function viewMessage(name){
  $('#admin-search').css('display','none');
  $('#chat-footer').css('display','none');
  $('#user-chat').css('display','none');

  $('#message-container').css('display','block');
  $('#send-message').css('display','');
  $('#back-btn').css('display','inline');

  $('#chat-title').html('&nbsp;'+name);

  setToRead();
  displayMessages();
}


function back(){
  $('#user-list').html('');
  $('#message-container').html('<div class="announcement"><span>Start messaging.</span></div><br>');
  $('#message-container').css('display','none');
  $('#send-message').css('display','none');
  $('#back-btn').css('display','none');

  $('#admin-search').css('display','inline');
  $('#chat-footer').css('display','inline');
  $('#user-chat').css('display','inline');
  $('#chat-title').html('&nbsp;Chat');
  displayMessagePreviews();
}

//for admin only
function displayMessagePreviews(){
  //recommend: for loop all the users for now, implement the get by 5 in the future
  //if possible, sort all users based on the recent message's timestamp and if is_read == false

  //sample acquired users that are not admin
  //assumed that these are usernames
  var users = ["Barry", "Kara","Nini","Ricky"];

  //for each user, get the latest message regardless if it's from the admin or from the user
  //get the data of the recent message
  var recent_message = "this is the recent message";
  var recent_timestamp = "Jan 23";
  var is_read = false; //or true, for UI purposes


  //if no messages or if the recent message's is_deleted == true
  //set recent_message = "No messages.";
  //timestamp = "";

  for(var i = 0; i<4;i++){
    $('#user-list').append('<div onclick="viewMessage(\''+users[i]+'\')" class="col-message chat-preview"><div class="row no-gutters"><div class="col-auto pad-5 d-flex align-items-center justify-content-center"><center><img src="user.png"></center></div><div class="col-8 pad-10"><br><div class="w-100"></div><div class="d-flex justify-content-between" ><strong><span style="font-size:medium;">'+users[i]+'</span></strong></div><div class="w-100"></div><small class="text-muted text-truncate">'+recent_message+'</small><div class="w-100"></div></div><div class="col-auto" ><br><div class="w-100"></div><div class="d-flex justify-content-end"><small class="text-muted">'+recent_timestamp+'</small></div><div class="w-100"></div><br><div class="d-flex justify-content-center"><span class="badge badge-pill badge-info">!</span></div></div></div></div>');
  }
}

function searchUser(){
  //$('#user-list').append('No messages yet.');
}

function setToRead(){
  //set all the is_read == true for that message correspondence
}

//in the case that user and admin have the chat open during the conversation
//there should be a checker if they have the chat open.

function displayMessages(){
  //check if user is logged in
  //if user, just retrieve the messages 
        
  //if admin is logged in, retrieve the value of id=chat-title
  //because it will contain either a simple title or the username of
  //the selected chat log to view

  //example below is if user is logged in
  //in the case that admin is logged in and is_admin == false
  //sender will have the value of the username of the chosen user

  var msgs = ["AAAA","BBBBB","CCCCCc"];
  for(var i = 0;i<3;i++){
    //if message is_deleted == true, skip
    //if message is_read == false, change the value to true
    //if is_admin == true:
    var sender = "Admin";
    //if is_admin == false:
    //var sender = "You"

    //retrieve message and timestamp first
    var message = "this is the message."
    var timestamp = "01/23/2020 10:56AM";

     $('#message-container').append('<div class="d-flex justify-content-between"><span class="badge badge-pill" id="admin-name">'+sender+'<br></span><span class="timestamp text-muted">'+timestamp+'</span></div><div class="card mb-3"><div class="row no-gutters"><div class="col"><div id="message_display" class="text-wrap"><p>'+message+'</p></div></div></div></div>');
   }
  autoScrollToBottom();
}

function autoScrollToBottom(){
  $("#message-container").animate({ 
    scrollTop: $('#message-container').get(0).scrollHeight}, 1000); 
}
      
function sendMessage(){
  var message =   $('textarea#textarea-message').val().trim();
  if(message != ""){
    $('#textarea-message').val('');
    appendMessage(message);
  }
  autoScrollToBottom();
  //add to database
}

function appendMessage(message){
  //if user, check if received or sending
  //if admin, check if receeived or sending and who is
  //the user/chatbox owner
  var sender = "You";

  //get current timestamp
  var timestamp = "01/23/2020 10:56AM"
  $('#message-container').append('<div class="d-flex justify-content-between"><span class="timestamp text-muted">'+timestamp+'</span><span class="badge badge-pill" id="user-name">'+sender+'<br></span></div><div class="card  mb-3"><div class="row no-gutters"><div class="col"><div id="message_display" class="text-wrap"><p>'+message+'</p></div></div></div></div>');
        
 }
