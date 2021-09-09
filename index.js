/////variables initiated at the top of this file////////
var express = require ('express')
var bodyParser= require ('body-parser')
var session = require ('express-session')
var validator = require ('express-validator');
////////////////////////////////////////////////////////

const app = express()
const mysql = require('mysql');
const port = 8000
const expressSanitizer = require('express-sanitizer');

///////////////////////////////////////////////////////
/////this is used to make the views folder stattic/////
///so that i can access my images in the html files////
///////////////////////////////////////////////////////

app.use(express.static(__dirname+'/views'));
app.get('/', function(req,res){
   res.sendFile(__dirname + 'index.html');
})

///added for session management////
app.use(session({
    secret: 'somerandomstuffs',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 600000                                                                                                                              
    }
}));
//////////////////////////////////

////////santization////////
app.use(expressSanitizer());

/////////////////connecting to mongodb/////////////////////////
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost/mybookshopdb";
MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  console.log("Database created!");
  db.close();
});

app.use(bodyParser.urlencoded({ extended: true }))
// new code added to my Express web server
require('./routes/main')(app);
app.set('views',__dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
///////////////////////////////////////////////////

///////////////message to state connection has been established//////////////////////
app.listen(port, () => console.log(`This server is up and running on port ${port}!`))
