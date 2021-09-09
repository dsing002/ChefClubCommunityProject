module.exports = function(app) 
{

/////////////////////////validation const for email//////////////////////////////
const { check, validationResult } = require('express-validator');
/////////////////////////////////////////////////////////////////////////////////


//////////////////redirect login const for add, update and delete recipe/////////////
const redirectLogin = (req, res, next) => {

   if (!req.session.userId ) {
     res.redirect('./login')
   } else { next (); }
   }                 
/////////////////////////////////////////////////////////////////////////////////////


//////////////////////////////////////////////////////////////////////upload-file//////////////////////////////////////////////////////////////////////
//this was done as i needed a way to upload my jpg image files, after not being able to find a way i created a upload file path that parses the image//
///////file through the server and to the destination, then i could move it wherever i needed to and access it through the html pages using url()//////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

upload = require("express-fileupload");
app.use(upload())

app.get("/uploadfile",function(req,res){
    res.sendFile(__dirname+"/uploadfile.html");
})

app.post("/",function(req,res){

   if(req.files){
      var file = req.files.filename,
      filename = file.name;

      file.mv("./"+filename,function(err){
        if(err){
            console.log(err)
            res.send("error occured")
}
        else{ res.send("done!")}
})
}
}) 


//////////////////////////////////////////////////--index route that renders the homepage--///////////////////////////////////////////////////////////

 app.get('/index',function(req,res){
 res.render('index.html')
 });

/////////////////////////////////////////////////////////--search--and-searchresult--////////////////////////////////////////////////////////////////

 app.get('/search', function(req,res){
 res.render("search.html");
 });

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//was unable to get search result working correctly i managed to connect it to the database and use find, however it does not use the form input id//
////to find the actual record, as a result it simply produces a list of all the records in the database and so has only been partially completed/////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.post('/search-result', function(req, res) {
      var MongoClient = require('mongodb').MongoClient;
      var url = 'mongodb://localhost';
      MongoClient.connect(url, function (err, client) {
      if (err) throw err;
      var db = client.db('recipes');

      db.collection('foodname').find({search: req.query.search}).toArray((findErr, results) => {
      if (findErr) throw findErr;
      else
      client.close();
 //search result
 res.render('searchresult.html', {availablefoodname:results});
 });
});
});



/////////////////////////////////////////////////////////--register--and--registered--///////////////////////////////////////////////////////////////

 app.get('/register', function (req,res) { 
 res.render('register.html');
 });
 
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//register route works as expected, where the user inputs data such as name password email, where email has validation requiring @ symbol and then//
////having a res.send message to confirm the registration, as well as storing the pass word in hassed format and sanitizing the passwords as well///
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

 app.post('/registered', [check('email').isEmail()], function (req,res) {

 const errors = validationResult(req);
 
 if (!errors.isEmpty()) {
          res.redirect('./register'); }
       else {

 // saving data in database
       var MongoClient = require('mongodb').MongoClient;
       var url = 'mongodb://localhost';

       const bcrypt = require('bcrypt');
       const saltRounds = 10;
     //  const plainPassword = req.body.password;
       const plainPassword = req.sanitize(req.body.password);

bcrypt.hash(plainPassword, saltRounds, function(err, hashedPassword) {
   // Store hashed password in your database.
           
        MongoClient.connect(url, function(err, client) {
        if (err) throw err;
        var db = client.db ('recipes');  
        db.collection('chefs').insertOne({
        username: req.body.username,
        password: hashedPassword,
        email: req.body.email                                           
        });
        client.close();

 res.send(' You are now registered! your username is:' + req.body.username + ', your password is:'+ req.body.password + ' and your hashed password is:' + hashedPassword + ', and your email is:' + req.body.email+ '<br />'+'<a href='+'/index'+'>Home</a>'+'  <a href='+'/login'+'>Login</a>');
 });
})
}
});


///////////////////////////////////////////////////////////////---login--//////////////////////////////////////////////////////////////////////////////
//the login page works as expected and reuires the name and password it checks it against the stored hashed password to check its correct in the chef//
//database, if the login doe snot exist the corresponding message is printed, if the login is worng the corresponding message is printed, otherwise////
//the login is success ful and session management is proccessed////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//login page
    app.get('/login', function (req, res) {

        res.render("login.ejs");

        app.post('/loggedin', function (req, res) {

            var MongoClient = require('mongodb').MongoClient;
            var url = 'mongodb://localhost';

            MongoClient.connect(url, function (err, client) {
                if (err) throw err;
                var db = client.db('recipes');

                const bcrypt = require('bcrypt');
                const plainPassword = req.body.password;
                var users = db.collection('chefs');
                users.findOne({ "username": req.body.username}, function (err, result) {
                    if (err) throw err;
                    if (result) {
                        var hashedPassword = result.password;
                        bcrypt.compare(plainPassword, hashedPassword, function (err, result) {
                            if (result == true) {
                               //save user session
                               req.session.userId = req.body.username;
                                res.send("Congrats you logged in! Your username is " + req.body.username + "." + '<br />'+'<a href='+'./index'+'>Home</a>'+'  <a href='+'/addrecipe'+'>Add recipe</a>'+'  <a href='+'/updaterecipe'+'>Update recipe</a>'+'  <a href='+'/deleterecipe'+'>Delete recipe</a>'+'  <a href='+'/list'+'>List</a>'+'  <a href='+'/search'+'>Search</a>'+'  <a href='+'/api'+'>API</a>'+'  <a href='+'/logout'+'>Logout</a>');
                                               
                              } else {
                                res.send("Username or Password is Incorrect."+ '<br />'+'<a href='+'./login'+'>Login</a>');
                            }
                        });
                    } else {
                        res.send("Check that again because there is no user with this username!"+ '<br />'+'<a href='+'./login'+'>Login</a>'); 
                    }
                    client.close();
                });
            });
        });
    });

//////////////////////////////////////////////////////////////----LOGOUT----/////////////////////////////////////////////////////////////////////////
//////////////////////////////simple logut that destroys the session and renders the logout page with the messages///////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.get('/logout', (req,res) => {
     req.session.destroy(err => {
     if (err) {
       return res.redirect('./')
     }
     res.render('logout.html');
     })
     })

///////////////////////////////////////////////////////////////-----LIST-----////////////////////////////////////////////////////////////////////////
app.get('/list', function(req, res) {
      var MongoClient = require('mongodb').MongoClient;
      var url = 'mongodb://localhost';
      MongoClient.connect(url, function (err, client) {
      if (err) throw err;
      var db = client.db('recipes');
      db.collection('foodname').find().toArray((findErr, results) => {
      if (findErr) throw findErr;
      else
         res.render('list.html', {availablefoodname:results});
      client.close();
  });
});
});


///////////////////////////////////////////////////////--addrecipe--and--recipeadded--//////////////////////////////////////////////////////////////////////
//add recipe works as expected, uses insert one record command by connecting to the recipes database and foodname collection, the database has four fields//
//, author, recipename, ingreidents and instructions all taken through user input via a html form and then a res.send message confirms its has been added///
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

 app.get('/addrecipe', redirectLogin, function(req,res){
 res.render("addrecipe.html");
 });
  
app.post('/recipeadded', function (req,res) {

       // saving data in database
       var MongoClient = require('mongodb').MongoClient;
       var url = 'mongodb://localhost';
                                                                         
       MongoClient.connect(url, function(err, client) {
        if (err) throw err;
        var db = client.db ('recipes');  
        db.collection('foodname').insertOne({
        author: req.body.author,
        recipename: req.body.recipename,
        ingredients: req.body.ingredients,
        instructions: req.body.instructions                                                                                                 
        });
        client.close();
        res.send(' This recipe has been added to the database, author: '+ req.body.author +'<br/>' + ' recipe name:'+ req.body.recipename +'<br/>' + 'ingredients:' + req.body.ingredients +'<br/>' + 'instructions:' + req.body.instructions  + '<br />'+'<a href='+'/index'+'>Home</a>'+'  <a href='+'/addrecipe'+'>Add recipe</a>'+'  <a href='+'/updaterecipe'+'>Update recipe</a>'+'  <a href='+'/deleterecipe'+'>Delete recipe</a>'+'  <a href='+'/list'+'>List</a>'+'  <a href='+'/search'+'>Search</a>'+'  <a href='+'/api'+'>API</a>'+'  <a href='+'/logout'+'>Logout</a>');
        });
       });


////////////////////////////////////////////////////////--delete--and-deleted--//////////////////////////////////////////////////////////////////////
//delete recipe works as expected where the user can view thetable of record on the page and select which one they wish to delete, this is doen by///
//using a html form requiring the recipe name, then deleteOne checks the database for this record and deleted the entire page, the user can see the//
//record has now been deleted on the same page without having to go back and forth between list and delete page, for a better user experience////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.get('/deleterecipe',redirectLogin, function(req, res) {
      var MongoClient = require('mongodb').MongoClient;
      var url = 'mongodb://localhost';
      MongoClient.connect(url, function (err, client) {
      if (err) throw err;
      var db = client.db('recipes');
      db.collection('foodname').find().toArray((findErr, results) => {
      if (findErr) throw findErr;
      else
         res.render('deleterecipe.html', {availablefoodname:results});
      client.close();                                                                                                                                
  });
});
});


app.post('/deleted', function (req,res) {
                                                                                                                                                     
       // saving data in database
       var MongoClient = require('mongodb').MongoClient;
       var url = 'mongodb://localhost';
                                                                                                                                                     
       MongoClient.connect(url, function(err, client) {
        if (err) throw err;
        var db = client.db ('recipes');
        db.collection('foodname').deleteOne({                   
        recipename: req.body.recipename,                                                                                                                     });
        client.close();
res.send(' The recipe: '+ req.body.recipename + 'has been deleted, check for any other recipes you would like to delete!'  +'<br />'+'<a href='+'./index'+'>Home</a>'+'  <a href='+'/addrecipe'+'>Add recipe</a>'+'  <a href='+'/updaterecipe'+'>Update recipe</a>'+'  <a href='+'/deleterecipe'+'>Delete recipe</a>'+'  <a href='+'/list'+'>List</a>'+'  <a href='+'/search'+'>Search</a>'+'  <a href='+'/api'+'>API</a>'+'  <a href='+'/logout'+'>Logout</a>');                                                                                                                             
        });
       });

/////////////////////////////////////////////////////////////updaterecipe--and-updated///////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////update recipe list///////////////////////////////////////////////////////////////////
//update recipe works as expected, there are four forms to update the indiviusal fields, i thought this was more efficent as a user would not have///
//input an entire records details in order to update it, thus all forms have two input values, one is the ID of the existing value, th eother of/////
//the new value they are updating it to thus making it easier to update specific details. Also i have added the table of record at the bottom of/////
//the page to make it easier for users to see what record they want to delete////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.get('/updaterecipe', redirectLogin, function(req, res) {
      var MongoClient = require('mongodb').MongoClient;
      var url = 'mongodb://localhost';
      MongoClient.connect(url, function (err, client) {
      if (err) throw err;
      var db = client.db('recipes');
      db.collection('foodname').find().toArray((findErr, results) => {
      if (findErr) throw findErr;
      else
         res.render('updaterecipe.html', {availablefoodname:results});
      client.close();                                                                                                                                
  });
});
});

/////////////////////////////////////////////////////////////////updated author//////////////////////////////////////////////////////////////////////
app.post('/updatedauthor', function (req,res) {
                                                                                                                                                     
       // saving data in database
       var MongoClient = require('mongodb').MongoClient;
       var url = 'mongodb://localhost';
                                                                                                                                                     
       MongoClient.connect(url, function(err, client) {
        if (err) throw err;
        var db = client.db ('recipes');
        db.collection('foodname').updateOne(
        {author: req.body.authorID}, {$set:{ author: req.body.author}
      }); 
       client.close();                                                                                                                             
          
res.send(' The author name'+ req.body.authorID + ' has been changed to: '+ req.body.author + ' check the for any other authors you would like to update!'  +'<br />'+'<a href='+'/index'+'>Home</a>'+'  <a href='+'/addrecipe'+'>Add recipe</a>'+'  <a href='+'/updaterecipe'+'>Update recipe</a>'+'  <a href='+'/deleterecipe'+'>Delete recipe</a>'+'  <a href='+'/list'+'>List</a>'+'  <a href='+'/search'+'>Search</a>'+'  <a href='+'/api'+'>API</a>'+'  <a href='+'/logout'+'>Logout</a>');                                                                                                                

        });
       });

/////////////////////////////////////////////////////////////////////updated recipe name/////////////////////////////////////////////////////////////
app.post('/updatedrecipename', function (req,res) {
                                                                                                                                                     
       // saving data in database
       var MongoClient = require('mongodb').MongoClient;
       var url = 'mongodb://localhost';
                                                                                                                                                     
       MongoClient.connect(url, function(err, client) {
        if (err) throw err;
        var db = client.db ('recipes');
        db.collection('foodname').updateOne(
        {recipename: req.body.recipeID}, {$set:{ recipename: req.body.recipe}
      });
       client.close();                                                                                                                               
                                                                                                                                                     
res.send(' The recipe name: '+ req.body.recipeID + ' has been changed to: '+ req.body.recipe + ' check for any other recipe names you would like to update!'  +'<br />'+'<a href='+'/index'+'>Home</a>'+'  <a href='+'/addrecipe'+'>Add recipe</a>'+'  <a href='+'/updaterecipe'+'>Update recipe</a>'+'  <a href='+'/deleterecipe'+'>Delete recipe</a>'+'  <a href='+'/list'+'>List</a>'+'  <a href='+'/search'+'>Search</a>'+'  <a href='+'/api'+'>API</a>'+'  <a href='+'/logout'+'>Logout</a>');                                                                                         

                                                                                                                                                     
        });
       });
///////////////////////////////////////////////////////////////updated ingredients///////////////////////////////////////////////////////////////////

app.post('/updatedingredients', function (req,res) {
                                                                                                                                                     
       // saving data in database
       var MongoClient = require('mongodb').MongoClient;
       var url = 'mongodb://localhost';
                                                                                                                                                     
       MongoClient.connect(url, function(err, client) {
        if (err) throw err;
        var db = client.db ('recipes');
        db.collection('foodname').updateOne(
        {ingredients: req.body.ingredientID}, {$set:{ ingredients: req.body.ingredient}
      });
       client.close();                                                                                                                               
                                                                                                                                                     
res.send(' The ingredients list: '+ req.body.ingredientID + ' has been changed to: '+ req.body.ingredient + ' check for any other ingredient lists you would like to update!'  +'<br />'+'<a href='+'/index'+'>Home</a>'+ '<a href='+'/addrecipe'+'>Add recipe</a>'+ '<a href='+'/updaterecipe'+'>Update recipe</a>'+' <a href='+'/deleterecipe'+'>Delete recipe</a>'+'  <a href='+'/list'+'>List</a>'+'  <a href='+'/search'+'>Search</a>'+'  <a href='+'/api'+'>API</a>'+'  <a href='+'/logout'+'>Logout</a>');                                                                                                                                                                                                                
        });
       });

//////////////////////////////////////////////////////////////updated instructions///////////////////////////////////////////////////////////////////
app.post('/updatedinstructions', function (req,res) {
                                                                                                                                                     
       // saving data in database
       var MongoClient = require('mongodb').MongoClient;
       var url = 'mongodb://localhost';
                                                                                                                                                     
       MongoClient.connect(url, function(err, client) {
        if (err) throw err;
        var db = client.db ('recipes');
        db.collection('foodname').updateOne(
        {instructions: req.body.instructionID}, {$set:{ instructions: req.body.instruction}
      });
       client.close();                                                                                                                               
                                                                                                                                                     
res.send(' The instructions: '+ req.body.instructionID + ' has been changed to: '+ req.body.instruction + ' check for any other instructions you would like to update!'  +'<br />'+'<a href='+'/index'+'>Home</a>'+'  <a href='+'/addrecipe'+'>Add recipe</a>'+'  <a href='+'/updaterecipe'+'>Update recipe</a>'+'  <a href='+'/deleterecipe'+'>Delete recipe</a>'+'  <a href='+'/list'+'>List</a>'+'  <a href='+'/search'+'>Search</a>'+'  <a href='+'/api'+'>API</a>'+'  <a href='+'/logout'+'>Logout</a>');                                                                 

        });
       });



//////////////////////////////////////////////////////////////////////API////////////////////////////////////////////////////////////////////////////
///////////////////////////the api is used form lab9 and simply displays all records in a json format on the webpage/////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.get('/api', function (req,res) {
     var MongoClient = require('mongodb').MongoClient;
     var url = 'mongodb://localhost';
     MongoClient.connect(url, function (err, client) {

     if (err) throw err                                                                                                                             
     var db = client.db('recipes');                                                                                                                                                                   
      db.collection('foodname').find().toArray((findErr, results) => {                                                                                                                                
      if (findErr) throw findErr;
      else
         res.json(results);                                                                                                                          
      client.close();      

                                                                                                   
  });
});
});



}
