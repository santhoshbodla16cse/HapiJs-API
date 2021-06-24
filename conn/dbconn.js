const Sequelize = require('sequelize');

const sequelize = new Sequelize('postgres','postgres','root',{
    host: 'localhost',
    port:5432,
    dialect:"postgres"
});

sequelize.authenticate().then(()=>{
    console.log("Connected to database");
}).catch((err)=>{
    console.log(err);
})
module.exports.connect = sequelize;