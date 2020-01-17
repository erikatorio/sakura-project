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

// var users = db.collection('users');
//       var query = users.get().then(function(querySnapshot) {
//           querySnapshot.forEach(function(doc) {
//               // doc.data() is never undefined for query doc snapshots
//               console.log(doc.id, " => ", doc.data());
//               console.log(doc.data().group);
//           });
//       })
//       .catch(function(error) {
//           console.log("Error getting documents: ", error);
//       });

var groups = [];
var categories = [];

async function getStats() {
    var group_query = await db.collection('groups').get().then(function(snapshot) {
        snapshot.forEach(function(doc) {
            groups.push(doc.data().name);
        });
    });
    console.log(groups);

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
var z_values=[];
async function test() {
    var x = await getStats().then(function(y) {
        z_values = [];
        for(var i = 0;i<y.length;i++){
            z_values.push(y[i].amount);
        }
        console.log(z_values);
    }); 
}

test();

