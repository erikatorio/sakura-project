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

async function test() {
    var x = await getStats().then(function(y) {
        console.log(y);
    }); 
}

test();

