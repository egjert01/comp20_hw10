const {MongoClient} = require("mongodb");
const fs = require('fs');
const path = './companies.csv';
const url = "mongodb+srv://USER1:1234567890@cluster0.561hie2.mongodb.net/?retryWrites=true&w=majority";

// Create a new MongoClient
const client = new MongoClient(url)

// Access desired db and collection
const database = client.db("stock_ticker");
const collection = database.collection("companies");

// Read file and populate db
async function getData() {
    await fs.readFile(path, {encoding: 'utf-8'}, async function (err, data) {
        if (err) throw err;
        var array = data.split("\n");
        for (let i = 1; i < array.length; i++) {
            var line = array[i].split(",")
            console.log(line)
            await collection.insertOne({company: line[0], ticker: line[1], price: line[2]});
        }
        await client.close();
    });
}

// main driver
async function main() {
    await client.connect();
    await client.db("stock_ticker").command({ping: 1});

    getData()
}

main();



