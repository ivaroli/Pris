var admin = require("firebase-admin");
var serviceAccount = require("./pris-141b6-firebase-adminsdk-j6km7-4ab959fa04.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://pris-141b6.firebaseio.com"
});

const db = admin.firestore();

hasDocument({link:"https://elko.is/43dp640-tcl-43-snjallsjonvarp-uhd"});

module.exports.Insert = function(data){
    db.collection("products").add(data);
}

function hasDocument(data){
    var query = db.collection("products").where("link", "!==", "");
    console.log(query);
}
