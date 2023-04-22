const express = require("express");
const bodyParser = require("body-parser");
const path = require('path');
var __dirname = path.resolve();
const mongodb = require('mongodb');
const {MongoClient} = require("mongodb");

const url = "mongodb+srv://USER1:1234567890@cluster0.561hie2.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(url)
const dbConn = client.connect(url)

const database = client.db("stock_ticker");
const collection = database.collection("companies");

const app = express();
const port = process.env.PORT || 8080;

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')))

// Load index.html 
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'));
})

// When form is submitted display results
app.post('/process', (req, res) => {
    var input = req.body.input;
    var type = req.body.type;
    var doc = {[type]: input}

    dbConn.then(function() {
        collection.find(doc).toArray().then(function(data){
            var built = parseData(data)
            res.send(built);
        })
    })
})

// Format resulting data
function parseData(data) {
    var builder = "<h1> RESULTS: </h1>";
    if (data.length === 0) {
        builder = "<h3> Nothing matching your search was found </h3>"
    }
    data.forEach((result) => {
        builder += "<p>";
        builder += result.company + " | ";
        builder += result.ticker + " | ";
        builder += result.price;
        builder += "</p>";
    })
    return builder;
}

app.listen(port);
console.log("running on port 8080")
