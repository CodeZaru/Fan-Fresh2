"use strict";
 
var fs = require("fs");
var path = require("path");
//var Sequelize = require("sequelize");
var env = process.env.NODE_ENV || "development";
var config = require(path.join(__dirname, '..','..', 'config', 'config.json'))[env];
var sequelize = new Sequelize(config.database, config.username, config.password, config);
var db = {};
var HEROKU_POSTGRESQL_BRONZE_URL = "postgres://iykonsfagnlfvl:63d5c6e91fb2c7732759ea13c5e9928d9cf8f541a4d39e848d5b1a8f82f7c799@ec2-54-221-221-153.compute-1.amazonaws.com:5432/db6s5gvfqdu4k1" 
 //added for heroku begin
if (!global.hasOwnProperty('db')) {
  var Sequelize = require('sequelize')
    , sequelize = null

  if (process.env.NODE_ENV) {
    // the application is executed on Heroku ... use the postgres database
    sequelize = new Sequelize(HEROKU_POSTGRESQL_BRONZE_URL, {
      dialect:  'postgres',
      protocol: 'postgres',
      port:     match[4],
      host:     match[3],
      logging:  true //false
    })
  } else {
    // the application is executed on the local machine ... use mysql
    sequelize = new Sequelize(config.database, config.username, config.password, config)
  }

  global.db = {
    Sequelize: Sequelize,
    sequelize: sequelize,
    User:      sequelize.import(__dirname + '/user') 
    // add your other models here
  }

  /*
    Associations can be defined here. E.g. like this:
    global.db.User.hasMany(global.db.SomethingElse)
  */



 /*
 if (process.env.JAWSDB_URL) {
    connection = Sequelize.createConnection(process.env.JAWSDB_URL);
} else {
    var sequelize = new Sequelize(config.database, config.username, config.password, config);
}
*/
/*
 if (config.use_env_variable) {
  var sequelize = new Sequelize(process.env[config.use_env_variable]);
} else {
  var sequelize = new Sequelize(config.database, config.username, config.password, config);
}
*/
 //added for heroku end

fs
    .readdirSync(__dirname)
    .filter(function(file) {
        return (file.indexOf(".") !== 0) && (file !== "index.js");
    })
    .forEach(function(file) {
        var model = sequelize.import(path.join(__dirname, file));
        db[model.name] = model;
    });
 
Object.keys(db).forEach(function(modelName) {
    if ("associate" in db[modelName]) {
        db[modelName].associate(db);
    }
});
 
 
//db.sequelize = sequelize;
//db.Sequelize = Sequelize;
 
//module.exports = db;
}

module.exports = global.db