const Sequelize = require('sequelize');
const { QueryTypes } = require('sequelize');
var express = require("express");
var app = express();
var path = require("path");
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var HTTP_PORT = process.env.PORT || 8080;

// set up sequelize to point to our postgres database
var sequelize = new Sequelize('aqoqzwdx', 'aqoqzwdx', 'NjkY89I5Rvmp-S-M4sGWW3sOLIDpHvbR', {
    host: 'peanut.db.elephantsql.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: { rejectUnauthorized: false }
    },
    query: { raw: true }
});


var User = sequelize.define('User', {
    username: Sequelize.STRING,
    password: Sequelize.STRING,
    email: Sequelize.STRING
});

sequelize.sync().then(function () {

});
// call this function after the http server starts listening for requests
function onHttpStart() {
    console.log("Express http server listening on: " + HTTP_PORT);
  }
  
  // setup a 'route' to listen on the default url path (http://localhost)
  app.get('/', function(req,res){
        res.sendFile(path.join(__dirname,"/login.html"));
  });
  
  // setup another route to listen on /about
  app.post('/home', function(req,res) {
    var formData = req.body;
    console.log(formData);
    const alphanumeric = /^[\p{L}\p{N}]*$/u;
    if (formData.username.match(alphanumeric))
    {
        const query = `SELECT * FROM "Users" WHERE username = ?`;
        sequelize.query(query, 
            { replacements: [`${formData.username}`],
             type: QueryTypes.SELECT })
        .then(function(data)
        {
            res.send(data);
        });
    }
  });
  
  // setup http server to listen on HTTP_PORT
  app.listen(HTTP_PORT, onHttpStart);