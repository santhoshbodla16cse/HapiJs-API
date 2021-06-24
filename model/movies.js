const Connection = require('../conn/dbconn');
const {DataTypes} = require('sequelize');

const dbconnection = Connection.connect;

const movies = dbconnection.define('movietable',{
    movie_name : {
        type : DataTypes.STRING
    },
    movie_language : {
        type : DataTypes.STRING
    },
    movie_genre : {
        type : DataTypes.STRING
    },
    released : {
        type : DataTypes.INTEGER
    },
    actor : {
        type : DataTypes.STRING
    },
    actress : {
        type : DataTypes.STRING
    },
    rating : {
        type : DataTypes.INTEGER
    }
},
{
    freezeTableName : true,
    timestamps : false
});
module.exports = movies;
