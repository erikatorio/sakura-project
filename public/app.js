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

for(var i = 0; i<users.length; i++) {
    db.collection('users').doc(users[i].username).set(users[i]);
}

// login
$(document).ready(function() {
  $('#login-button').click(function() {
      var username = $('#username').val();
      var password = $('#password').val();

      var users = db.collection('users');
      var query = users.where("username", "==", username).where("password", "==", password).get()
      .then(function(querySnapshot) {
        if(!querySnapshot.empty) {
            // var url ="http://localhost:5000/home.html"
            // $(location).attr('href', url);
            querySnapshot.forEach(function(doc) {
                document.cookie = "group_value="+encodeURIComponent(doc.data().group);
                console.log(doc.data().group);
            });
        } else {
            $('#invalid-credentials').append("<div class=\"alert alert-danger\" role=\"alert\">Invalid Credentials. Please Try Again. </div>");
        }
        });
      
    //   var query = users.get().then(function(querySnapshot) {
    //       querySnapshot.forEach(function(doc) {
    //           // doc.data() is never undefined for query doc snapshots
    //           console.log(doc.id, " => ", doc.data());
    //           console.log(username == doc.data().username && password == doc.data().password);
    //           if(username == doc.data().username && password == doc.data().password) {
    //               console.log("logged in");
    //           } else {
    //               console.log("not logged in");
    //           }
    //       });
    //   })
    //   .catch(function(error) {
    //       console.log("Error getting documents: ", error);
    //   });
  });
});

$('#logout_btn').click(function() {
      document.cookie ='group_value=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      var landing_page = "http://localhost:5000/"
      $(location).attr('href', landing_page);
});

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

//update data
