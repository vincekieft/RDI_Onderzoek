const neo4j = require('neo4j-driver').v1;
const utils = require('./utils.js');

async function start() {
    const driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('neo4j', '1234'));
    const session = driver.session();
    const totalInsertLength = 50000;
    let users = await session.run(
        'MATCH (user:User)\n' +
        ' RETURN user.Email as Email LIMIT 50000;'
    );

    let maxPostID = await session.run(
        'MATCH (post:Post)\n' +
        'RETURN post.PostID as PostID\n' +
        'ORDER BY post.PostID DESC\n' +
        'LIMIT 1'
    );

    const startID = parseInt(maxPostID.records[0].get('PostID'));

    utils.benchmark(async ()=>{
        for(let i = 0; i < totalInsertLength; i++){
            let userIndex = parseInt(Math.random() * users.records.length);
            let email = users.records[userIndex].get('Email');
            let userQuery = "CREATE (:Post {PostID: "+(startID+i)+",Date: \"0000-00-00 00:00:00\", Description: \"Post description here\", Title: \"Post title here\"})<-[:POST_OF]-(:User {Email: '"+email+"'})";

            await session.run(userQuery);
        }
    }, true);

}

start();

