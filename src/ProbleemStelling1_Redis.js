var redis = require("redis"),
    client = redis.createClient();
const {promisify} = require('util');
const LPUSH = promisify(client.LPUSH).bind(client);
const utils = require('./utils.js');

client.on("error", function (err) {
    console.log("Error " + err);
});

async function runQueries(){
    utils.benchmark(async ()=>{
        for(let i = 0; i < 1000000; i++){
            await LPUSH('user1Locations', `location: ${i}`);
        }
    }, true);
}

runQueries();

