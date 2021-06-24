//Without any orm

const {Client} = require('pg');
const client =  new Client({
    user:"postgres",
    password:"root",
    host:"localhost",
    port:5432,
    database:"postgres",
})

execute()
async function execute(){
    try{
        await client.connect();
        console.log("Connected Successfully");
    }
    catch(err){
        console.log(err);
    }
}
module.exports = client;


