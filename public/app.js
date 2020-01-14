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

//display data
async function displayData() {
    var x = await getStats().then(function(y) {
        //to do, integrate data from firestore with graph
    }); 
}
