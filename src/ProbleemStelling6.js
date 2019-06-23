const neo4j = require('neo4j-driver').v1;
const utils = require('./utils.js');

async function start() {
    const driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('neo4j', '1234'));
    const session = driver.session();

    let users = await session.run(
        'MATCH (user:User)\n' +
        ' RETURN user.Email as Email LIMIT 1000;'
    );

    utils.benchmark(async ()=> {
        for (let i = 0; i < users.records.length; i++) {
            let query = 'MATCH (me:User {Email: \''+users.records[i].get('Email')+'\'})-[:FRIEND_OF]-(mf)-[:FRIEND_OF]-(u:User)\n' +
                'RETURN distinct me, u, COUNT(mf) as common \n' +
                'ORDER BY common DESC LIMIT 5\n';

            let result = await session.run(query);
        }
    }, true);
}

start();

