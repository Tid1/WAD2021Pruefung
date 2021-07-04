var MongoClient = require("mongodb").MongoClient;
var url = "mongodb://localhost:27017";

let mongoClient = null;

MongoClient.connect(url, {useUnifiedTopology: true}, function (err, client) {
    if(err) throw err;
    mongoClient = client.db("advizDB");
    console.log("MongoDB started")
})

function mongo() {
    return mongoClient;
}
module.exports = mongo;