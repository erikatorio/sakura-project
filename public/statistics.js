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