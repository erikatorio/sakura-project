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
        group: 'A'
    },
    {
        username: 'Ricky',
        password: '1234',
        group: 'B'
    },
    {
        username: 'Kara',
        password: '12345',
        group: 'C'
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
            var url ="http://localhost:5000/home.html"
            $(location).attr('href', url);
            console.log("logged in");
        } else {
            $('#invalid-credentials').append("<div class=\"alert alert-danger\" role=\"alert\">Invalid Credentials. Please Try Again. </div>");
            console.log("not logged in");
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